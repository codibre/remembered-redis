import { Remembered } from 'remembered';
import { Redis } from 'ioredis';
import { LockOptions, Semaphore } from 'redis-semaphore';
import { LogError, RememberedRedisConfig } from './remembered-redis-config';

const DEFAULT_LOCK_TIMEOUT = 10000;
const DEFAULT_ACQUIRE_TIMEOUT = 60000;
const DEFAULT_RETRY_INTERVAL = 100;
const DEFAULT_REFRESH_INTERVAL = 8000;
const EMPTY = Symbol('Empty');
const resolved = Promise.resolve();

export class RememberedRedis extends Remembered {
	private semaphoreConfig: LockOptions;
	private redisPrefix: string;
	private redisTtl: number | undefined;
	private logError: LogError | undefined;

	constructor(config: RememberedRedisConfig, private readonly redis: Redis) {
		super(config);
		this.semaphoreConfig = {
			lockTimeout: config.lockTimeout || DEFAULT_LOCK_TIMEOUT,
			acquireTimeout: config.acquireTimeout || DEFAULT_ACQUIRE_TIMEOUT,
			retryInterval: config.retryInterval || DEFAULT_RETRY_INTERVAL,
			refreshInterval: config.refreshInterval || DEFAULT_REFRESH_INTERVAL,
		};
		this.redisTtl = config.redisTtl;
		this.logError = config.logError;
		if (config.redixPrefix) {
			this.redisPrefix = config.redixPrefix;
			if (!this.redisPrefix.endsWith(':')) {
				this.redisPrefix += ':';
			}
		} else {
			this.redisPrefix = '';
		}
	}

	get<T>(key: string, callback: () => PromiseLike<T>): PromiseLike<T> {
		return super.get(key, () =>
			this.tryCache(key, () => this.getResult(key, callback)),
		);
	}

	private async getResult<T>(key: string, callback: () => PromiseLike<T>) {
		const semaphore = new Semaphore(
			this.redis,
			`${this.redisPrefix}REMEMBERED-SEMAPHORE:${key}`,
			1,
			this.semaphoreConfig,
		);
		await this.acquire(semaphore);
		let saveCache = resolved;
		try {
			const result = await this.tryCache(key, callback);
			if (result) {
				saveCache = this.saveToRedis<T>(key, result);
			}
			return result;
		} finally {
			saveCache.then(() => this.release(semaphore));
		}
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
		return result !== EMPTY ? result : callback();
	}

	private async release(semaphore: Semaphore) {
		try {
			await semaphore.release();
		} catch (err) {
			this.logError?.(err.message);
		}
	}

	private async acquire(semaphore: Semaphore) {
		try {
			await semaphore.acquire();
		} catch (err) {
			this.logError?.(err.message);
		}
	}

	async getFromRedis<T>(key: string): Promise<T | typeof EMPTY> {
		const cached = await this.redis.get(this.getRedisKey(key));
		return cached ? JSON.parse(cached) : EMPTY;
	}

	private getRedisKey(key: string) {
		return `${this.redisPrefix}${key}`;
	}
}
