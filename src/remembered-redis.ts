import { v4 } from 'uuid';
import { Remembered } from 'remembered';
import { Redis } from 'ioredis';
import { LockOptions, Semaphore } from 'redis-semaphore';
import {
	RememberedRedisConfig,
	TryTo,
	AlternativePersistence,
} from './remembered-redis-config';
import { getSemaphoreConfig } from './get-semaphore-config';
import { getRedisPrefix } from './get-redis-prefix';
import { tryToFactory } from './try-to-factory';
import { valueSerializer } from './value-serializer';
import { promisify } from 'util';

const delay = promisify(setTimeout);

export const DEFAULT_LOCK_TIMEOUT = 10000;
export const DEFAULT_ACQUIRE_TIMEOUT = 60000;
export const DEFAULT_RETRY_INTERVAL = 100;
export const DEFAULT_REFRESH_INTERVAL = 8000;
const EMPTY = Symbol('Empty');
const resolved = Promise.resolve();

function prepareConfig(config: RememberedRedisConfig) {
	const { redisTtl, ttl } = config;

	if (!redisTtl) {
		config.ttl = 0;
	} else if (typeof redisTtl === 'function') {
		const fTtl = typeof ttl === 'number' ? () => ttl : ttl;
		config.ttl = <T>(r: T) => {
			const rTtl = redisTtl(r);

			return rTtl ? Math.min(fTtl(r), rTtl) : 0;
		};
	} else if (typeof ttl === 'number') {
		config.ttl = redisTtl ? Math.min(ttl, redisTtl) : 0;
	} else {
		config.ttl = <T>(t: T) => {
			const bTtl = ttl(t);

			return bTtl && redisTtl ? Math.min(bTtl, redisTtl) : 0;
		};
	}

	return config;
}

export class RememberedRedis extends Remembered {
	private semaphoreConfig: LockOptions;
	private redisPrefix: string;
	private redisTtl?: <T>(r: T) => number;
	private tryTo: TryTo;
	private onCache?: (key: string) => void;
	private alternativePersistence?: AlternativePersistence;
	private savingObjects: Record<string, unknown> = {};
	private waitSaving = false;
	private savingPromise?: Promise<unknown>;

	constructor(config: RememberedRedisConfig, private readonly redis: Redis) {
		super(prepareConfig(config));
		this.redisTtl =
			typeof config.redisTtl === 'number'
				? () => config.redisTtl as number
				: config.redisTtl;
		this.tryTo = tryToFactory(config.logError);
		this.semaphoreConfig = getSemaphoreConfig(config);
		this.redisPrefix = getRedisPrefix(config.redisPrefix);
		this.onCache = config.onCache;
		this.alternativePersistence = config.alternativePersistence;
	}

	get<T>(
		key: string,
		callback: () => PromiseLike<T>,
		noCacheIf?: (t: T) => boolean,
		ttl?: number,
	): PromiseLike<T> {
		return super.get(
			key,
			() =>
				this.tryCache(key, () => this.getResult(key, callback, noCacheIf, ttl)),
			noCacheIf,
		);
	}

	private async getResult<T>(
		key: string,
		callback: () => PromiseLike<T>,
		noCacheIf?: (t: T) => boolean,
		ttl?: number,
	) {
		const semaphore = this.getSemaphore(key);
		await this.tryTo(semaphore.acquire.bind(semaphore));
		let saveCache = resolved;
		try {
			const result = await this.tryCache(key, callback);
			if (result !== undefined && !noCacheIf?.(result)) {
				saveCache = this.updateCache<T>(key, result, ttl);
			}
			return result;
		} finally {
			saveCache.then(() => this.tryTo(semaphore.release.bind(semaphore)));
		}
	}

	private getSemaphore(key: string) {
		return new Semaphore(
			this.redis,
			`${this.redisPrefix}REMEMBERED-SEMAPHORE:${key}`,
			1,
			this.semaphoreConfig,
		);
	}

	async updateCache<T>(
		key: string,
		result: T,
		ttl = this.redisTtl?.(result),
	): Promise<void> {
		const redisKey = this.getRedisKey(key);
		const realTtl = ttl || 1;
		if (this.alternativePersistence) {
			if (!this.waitSaving) {
				key = v4();
				const savingObjects: Record<string, unknown> = {};
				savingObjects[redisKey] = result;
				if (this.alternativePersistence.maxSavingDelay) {
					this.savingObjects = savingObjects;
					this.waitSaving = true;
					await delay(this.alternativePersistence.maxSavingDelay);
					this.waitSaving = false;
				}
				this.savingPromise = Promise.all([
					this.persist(savingObjects, (value) =>
						this.alternativePersistence!.save(key, value, realTtl),
					),
					this.redis.setex(redisKey, realTtl, key),
				]);
			} else {
				this.savingObjects[redisKey] = result;
			}
			await this.savingPromise;
		} else {
			await this.persist(result, (value) =>
				this.redis.setex(redisKey, realTtl, value),
			);
		}
	}

	private async persist<T>(
		savingObjects: T,
		saving: (payload: string | Buffer) => Promise<unknown>,
	): Promise<unknown> {
		const value = (await valueSerializer.serialize(savingObjects)) as
			| string
			| Buffer;
		return saving(value);
	}

	clearCache(key: string) {
		return this.redis.del(this.getRedisKey(key));
	}

	private async tryCache<T>(key: string, callback: () => PromiseLike<T>) {
		const result = await this.getFromCache<T>(key);
		if (result !== EMPTY) {
			this.onCache?.(key);
			return result;
		}
		return callback();
	}

	async getFromCache<T>(key: string): Promise<T | typeof EMPTY> {
		const redisKey = this.getRedisKey(key);
		let cached: string | Buffer | undefined = await this.redis.getBuffer(
			redisKey,
		);
		if (cached) {
			if (!this.alternativePersistence) {
				return valueSerializer.deserialize(cached);
			}
			cached = await this.alternativePersistence.get(key);
			if (cached) {
				const deserialized = await valueSerializer.deserialize(cached);
				return deserialized[redisKey];
			}
		}
		return EMPTY;
	}

	private getRedisKey(key: string) {
		return `${this.redisPrefix}${key}`;
	}
}
