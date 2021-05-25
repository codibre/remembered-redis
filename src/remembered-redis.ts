import { Remembered } from 'remembered';
import { Redis } from 'ioredis';
import { LockOptions, Semaphore } from 'redis-semaphore';
import { RememberedRedisConfig, TryTo } from './remembered-redis-config';
import { getSemaphoreConfig } from './get-semaphore-config';
import { getRedisPrefix } from './get-redis-prefix';
import { tryToFactory } from './try-to-factory';

export const DEFAULT_LOCK_TIMEOUT = 10000;
export const DEFAULT_ACQUIRE_TIMEOUT = 60000;
export const DEFAULT_RETRY_INTERVAL = 100;
export const DEFAULT_REFRESH_INTERVAL = 8000;
const EMPTY = Symbol('Empty');
const resolved = Promise.resolve();

export class RememberedRedis extends Remembered {
	private semaphoreConfig: LockOptions;
	private redisPrefix: string;
	private redisTtl: number | undefined;
	private tryTo: TryTo;
	private onCache?: (key: string) => void;

	constructor(config: RememberedRedisConfig, private readonly redis: Redis) {
		super(config);
		this.redisTtl = config.redisTtl;
		this.tryTo = tryToFactory(config.logError);
		this.semaphoreConfig = getSemaphoreConfig(config);
		this.redisPrefix = getRedisPrefix(config.redisPrefix);
		this.onCache = config.onCache;
	}

	get<T>(
		key: string,
		callback: () => PromiseLike<T>,
		noCacheIf?: (t: T) => boolean,
	): PromiseLike<T> {
		return super.get(
			key,
			() => this.tryCache(key, () => this.getResult(key, callback, noCacheIf)),
			noCacheIf,
		);
	}

	private async getResult<T>(
		key: string,
		callback: () => PromiseLike<T>,
		noCacheIf?: (t: T) => boolean,
	) {
		const semaphore = this.getSemaphore(key);
		await this.tryTo(semaphore.acquire.bind(semaphore));
		let saveCache = resolved;
		try {
			const result = await this.tryCache(key, callback);
			if (result !== undefined && !noCacheIf?.(result)) {
				saveCache = this.saveToRedis<T>(key, result);
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

	private async saveToRedis<T>(key: string, result: T): Promise<void> {
		const redisKey = this.getRedisKey(key);
		const value = JSON.stringify(result);
		await (this.redisTtl
			? this.redis.setex(redisKey, this.redisTtl, value)
			: this.redis.set(redisKey, value));
	}

	private async tryCache<T>(key: string, callback: () => PromiseLike<T>) {
		const result = await this.getFromRedis<T>(key);
		if (result !== EMPTY) {
			this.onCache?.(key);
			return result;
		}
		return callback();
	}

	private async getFromRedis<T>(key: string): Promise<T | typeof EMPTY> {
		const cached = await this.redis.get(this.getRedisKey(key));
		return cached ? JSON.parse(cached) : EMPTY;
	}

	private getRedisKey(key: string) {
		return `${this.redisPrefix}${key}`;
	}
}
