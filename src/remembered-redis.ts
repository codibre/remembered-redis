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
import { gzipValueSerializer } from './gzip-value-serializer';
import { valueSerializer } from './value-serializer';
import { promisify } from 'util';
import * as clone from 'clone';
import { getSafeRedis } from './get-safe-redis';

const delay = promisify(setTimeout);

export const DEFAULT_LOCK_TIMEOUT = 10000;
export const DEFAULT_ACQUIRE_TIMEOUT = 60000;
export const DEFAULT_RETRY_INTERVAL = 100;
export const DEFAULT_REFRESH_INTERVAL = 8000;
export const EMPTY = Symbol('Empty');
const resolved = Promise.resolve();

interface SavingObjects {
	key: string;
	fullfilled: boolean;
	entries: Map<string, [number, unknown]>;
}

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

const MAX_ALTERNATIVE_KEY_SIZE = 50;
export class RememberedRedis extends Remembered {
	private semaphoreConfig: LockOptions;
	private redisPrefix: string;
	private redisTtl?: <T>(r: T) => number;
	private tryTo: TryTo;
	private onCache?: (key: string) => void;
	private onError?: (key: string, err: Error) => any;
	private alternativePersistence?: AlternativePersistence;
	private savingObjects?: SavingObjects;
	private waitSaving = false;
	private savingPromise?: Promise<unknown>;
	private readonly redis: Redis;

	constructor(private settings: RememberedRedisConfig, redis: Redis) {
		super(prepareConfig(settings));
		this.redisTtl =
			typeof settings.redisTtl === 'number'
				? () => settings.redisTtl as number
				: settings.redisTtl;
		this.tryTo = tryToFactory(settings.logError);
		this.semaphoreConfig = getSemaphoreConfig(settings);
		this.redisPrefix = getRedisPrefix(settings.redisPrefix);
		this.onCache = settings.onCache;
		this.onError = settings.onError;
		this.alternativePersistence = settings.alternativePersistence;
		this.redis = getSafeRedis(redis, settings.onError, settings.redisTimeout);
	}

	blockingGet<T>(
		key: string,
		callback: () => PromiseLike<T>,
		noCacheIf?: ((result: T) => boolean) | undefined,
		ttl?: number,
	): PromiseLike<T> {
		return super.blockingGet(
			key,
			() =>
				this.tryCache(key, () => this.getResult(key, callback, noCacheIf, ttl)),
			noCacheIf,
		);
	}

	async getFromCache<T>(key: string): Promise<T | typeof EMPTY> {
		const semaphore = this.getSemaphore(key);
		await this.tryTo(semaphore.acquire.bind(semaphore));
		try {
			return await this.getFromCacheInternal(key);
		} finally {
			this.tryTo(semaphore.release.bind(semaphore));
		}
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
			{
				...this.semaphoreConfig,
				onLockLost: () => undefined,
			},
		);
	}

	async updateCache<T>(
		cacheKey: string,
		result: T,
		ttl = this.redisTtl?.(result),
	): Promise<void> {
		try {
			const redisKey = this.getRedisKey(cacheKey);
			const realTtl = ttl || 1;
			const resultCopy: T = clone(result);
			if (this.alternativePersistence) {
				if (!this.waitSaving) {
					const savingObjects: SavingObjects = {
						key: v4(),
						fullfilled: false,
						entries: new Map(),
					};
					savingObjects.entries.set(redisKey, [realTtl, resultCopy]);
					const { maxResultsPerSave } = this.alternativePersistence;
					if (
						this.alternativePersistence.maxSavingDelay &&
						(!maxResultsPerSave ||
							savingObjects.entries.size < maxResultsPerSave)
					) {
						this.savingObjects = savingObjects;
						this.waitSaving = true;
						await delay(this.alternativePersistence.maxSavingDelay);
						this.waitSaving = false;
						this.savingObjects = undefined;
					}
					this.persistKeys(savingObjects);
				} else {
					this.savingObjects!.entries.set(redisKey, [realTtl, resultCopy]);
					const { maxResultsPerSave } = this.alternativePersistence;
					if (
						maxResultsPerSave &&
						this.savingObjects!.entries.size >= maxResultsPerSave
					) {
						this.persistKeys(this.savingObjects!);
					}
				}
				await this.savingPromise;
			} else {
				await this.persist(resultCopy, (value) =>
					this.try(redisKey, () => this.redis.setex(redisKey, realTtl, value)),
				);
			}
		} catch (err) {
			if (!this.onError) {
				throw err;
			}
			this.onError(cacheKey, err as Error);
		}
	}

	private persistKeys(savingObjects: SavingObjects) {
		if (!savingObjects.fullfilled) {
			savingObjects.fullfilled = true;
			let maxTtl = Number.NEGATIVE_INFINITY;
			const entries: Record<string, unknown> = {};

			for (const [key, [ttl, value]] of savingObjects.entries.entries()) {
				if (maxTtl < ttl) {
					maxTtl = ttl;
				}
				entries[key] = value;
			}
			const savingPromise = (this.savingPromise = Promise.all([
				this.persist(entries, (value) =>
					this.alternativePersistence!.save(savingObjects.key, value, maxTtl),
				),
				...this.saveKeys(savingObjects),
			]).then(() => {
				if (this.savingPromise === savingPromise) {
					this.savingPromise = undefined;
				}
			}));
		}
	}

	private async try<T>(key: string, cb: () => Promise<T>) {
		try {
			return await cb();
		} catch (err) {
			this.onError?.(key, err as Error);
		}
	}

	private *saveKeys(savingObjects: SavingObjects) {
		for (const [redisKey, [ttl]] of savingObjects.entries.entries()) {
			yield this.try(redisKey, () =>
				this.redis.setex(redisKey, ttl || 1, savingObjects.key),
			);
		}
	}

	private get serializer() {
		return this.settings.noCompress ? valueSerializer : gzipValueSerializer;
	}

	private async persist<T>(
		savingObjects: T,
		saving: (payload: string | Buffer) => Promise<unknown>,
	): Promise<unknown> {
		const value = (await this.serializer.serialize(savingObjects)) as
			| string
			| Buffer;
		return await saving(value);
	}

	async clearCache(key: string) {
		return this.try(key, () => this.redis.del(this.getRedisKey(key)));
	}

	private async tryCache<T>(key: string, callback: () => PromiseLike<T>) {
		const result = await this.getFromCacheInternal<T>(key);
		if (result !== EMPTY) {
			this.onCache?.(key);
			return result;
		}
		return callback();
	}

	private async getFromCacheInternal<T>(
		key: string,
	): Promise<T | typeof EMPTY> {
		const redisKey = this.getRedisKey(key);
		const cached: string | Buffer | undefined = await this.try(redisKey, () =>
			this.redis.getBuffer(redisKey),
		);
		if (cached) {
			if (
				this.alternativePersistence &&
				cached.length <= MAX_ALTERNATIVE_KEY_SIZE
			) {
				const alternativeCached = await this.alternativePersistence.get(
					cached.toString(),
				);
				if (alternativeCached) {
					const deserialized = await this.serializer.deserialize(
						alternativeCached,
					);
					return deserialized[redisKey];
				}
			}
			try {
				return await this.serializer.deserialize(cached);
			} catch {
				return EMPTY;
			}
		}
		return EMPTY;
	}

	private getRedisKey(key: string) {
		return `${this.redisPrefix}${key}`;
	}
}
