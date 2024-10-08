import { v4 } from 'uuid';
import { Remembered } from 'remembered';
import { LockOptions, Mutex } from 'redis-semaphore';
import {
	RememberedRedisConfig,
	TryTo,
	AlternativePersistence,
} from './remembered-redis-config';
import {
	getSemaphoreConfig,
	RedisLike,
	RequiredField,
} from './get-semaphore-config';
import { getRedisPrefix } from './get-redis-prefix';
import { tryToFactory } from './try-to-factory';
import { gzipValueSerializer } from './gzip-value-serializer';
import { valueSerializer } from './value-serializer';
import { promisify } from 'util';
import clone from 'clone';
import { getSafeRedis } from './get-safe-redis';
import { dontWaitFactory } from './dont-wait';
import { Redis } from 'ioredis';

const delay = promisify(setTimeout);

export const DEFAULT_LOCK_TIMEOUT = 10000;
export const DEFAULT_ACQUIRE_TIMEOUT = 60000;
export const DEFAULT_RETRY_INTERVAL = 100;
export const DEFAULT_REFRESH_INTERVAL = 8000;
export const EMPTY = Symbol('Empty');
const resolved = Promise.resolve();

interface SavingObjects {
	fulfilled: boolean;
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
const TTL_MAP_POS = 2;

export class RememberedRedis extends Remembered {
	private readonly semaphoreConfig: LockOptions;
	private readonly redisPrefix: string;
	private readonly redisTtl?: <T>(r: T) => number;
	private readonly tryTo: TryTo;
	private readonly dontWait: ReturnType<typeof dontWaitFactory>;
	private readonly onCache?: (key: string) => void;
	private readonly onError?: (key: string, err: Error) => any;
	private readonly alternativePersistence?: AlternativePersistence;
	private savingObjects?: SavingObjects;
	private waitSaving = false;
	private savingPromise?: Promise<unknown>;
	private readonly redis: RedisLike;

	constructor(
		settings: RequiredField<RememberedRedisConfig, 'semaphore'>,
		redis: RedisLike,
	);
	constructor(settings: Omit<RememberedRedisConfig, 'semaphore'>, redis: Redis);
	constructor(settings: RememberedRedisConfig, redis: Redis);
	constructor(
		private settings: RememberedRedisConfig,
		redis: RedisLike,
	) {
		super(prepareConfig(settings));
		this.redisTtl =
			typeof settings.redisTtl === 'number'
				? () => settings.redisTtl as number
				: settings.redisTtl;
		this.tryTo = tryToFactory(settings.logError);
		this.dontWait = dontWaitFactory(settings.logError, this.tryTo);
		this.semaphoreConfig = getSemaphoreConfig(settings);
		this.redisPrefix = getRedisPrefix(settings.redisPrefix);
		this.onCache = settings.onCache;
		this.onError = settings.onError;
		this.alternativePersistence = settings.alternativePersistence;
		this.redis = getSafeRedis(redis, settings.onError, settings.redisTimeout);
	}

	async blockingGet<T>(
		key: string,
		callback: () => PromiseLike<T>,
		noCacheIf?: ((result: T) => boolean) | undefined,
		ttl?: number | undefined,
	): Promise<T> {
		return super.blockingGet(
			key,
			() =>
				this.tryCache(key, () => this.getResult(key, callback, noCacheIf, ttl)),
			noCacheIf,
		);
	}

	async getFromCache<T>(
		key: string,
		noSemaphore = false,
	): Promise<T | typeof EMPTY> {
		const release = noSemaphore ? undefined : await this.acquire(key);
		try {
			return await this.getFromCacheInternal(key, false);
		} finally {
			release?.();
		}
	}

	async runAndCache<T>(
		key: string,
		callback: () => PromiseLike<T>,
		noCacheIf?: ((result: T) => boolean) | undefined,
		ttl?: number,
	): Promise<T> {
		const release = await this.acquire(key);
		try {
			const result = await callback();
			if (result !== undefined && !noCacheIf?.(result)) {
				await this.updateCache(key, result, ttl);
			}
			return result;
		} finally {
			release?.();
		}
	}

	private async getResult<T>(
		key: string,
		callback: () => PromiseLike<T>,
		noCacheIf?: (t: T) => boolean,
		ttl?: number,
	) {
		const release = await this.acquire(key);
		let saveCache = resolved;
		try {
			const result = await this.tryCache(key, callback);
			if (result !== undefined && !noCacheIf?.(result)) {
				saveCache = this.updateCache<T>(key, result, ttl);
			}
			return result;
		} finally {
			if (release) {
				this.dontWait(() => saveCache.then(() => release()));
			}
		}
	}

	private async acquire(key: string): Promise<undefined | (() => void)> {
		let release: undefined | (() => Promise<unknown>);
		const { semaphore } = this.settings;
		if (semaphore) {
			release = await this.tryTo(() => semaphore.acquire(key));
		} else {
			const { redis } = this;
			const mutex = new Mutex(
				redis as Redis,
				`${this.redisPrefix}REMEMBERED-SEMAPHORE:${key}`,
				{
					...this.semaphoreConfig,
					onLockLost: (err) => this.settings.onLockLost?.(key, err),
				},
			);
			const acquire = mutex.acquire.bind(mutex);
			release = mutex.release.bind(mutex);

			await this.tryTo(acquire);
		}
		return this.prepareRelease(release);
	}

	private prepareRelease(
		release: (() => Promise<unknown>) | undefined,
	): (() => void) | PromiseLike<() => void> | undefined {
		return release ? () => this.dontWait(release) : undefined;
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
			if (
				this.alternativePersistence &&
				(!this.alternativePersistence.shouldUseAlternativePersistence ||
					this.alternativePersistence.shouldUseAlternativePersistence(
						resultCopy,
						realTtl,
					))
			) {
				if (!this.alternativePersistence.maxSavingDelay) {
					await this.persistKeys(
						{
							fulfilled: false,
							entries: new Map([[redisKey, [realTtl, resultCopy]]]),
						},
						redisKey.replace(/:/g, '/'),
					);
				} else if (!this.waitSaving) {
					const savingObjects: SavingObjects = {
						fulfilled: false,
						entries: new Map(),
					};
					savingObjects.entries.set(redisKey, [realTtl, resultCopy]);
					const { maxResultsPerSave } = this.alternativePersistence;
					const savingPromise = (this.savingPromise =
						this.prepareAccumulatingPromise(
							maxResultsPerSave,
							savingObjects,
						).then(() => {
							if (this.savingPromise === savingPromise) {
								this.savingPromise = undefined;
							}
						}));
				} else {
					this.savingObjects!.entries.set(redisKey, [realTtl, resultCopy]);
					const { maxResultsPerSave } = this.alternativePersistence;
					if (
						maxResultsPerSave &&
						this.savingObjects!.entries.size >= maxResultsPerSave
					) {
						this.waitSaving = false;
						this.savingObjects = undefined;
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

	private async prepareAccumulatingPromise(
		maxResultsPerSave: number | undefined,
		savingObjects: SavingObjects,
	) {
		if (!maxResultsPerSave || savingObjects.entries.size < maxResultsPerSave) {
			this.savingObjects = savingObjects;
			this.waitSaving = true;
			await delay(this.alternativePersistence!.maxSavingDelay);
			this.waitSaving = false;
			this.savingObjects = undefined;
		}
		await this.persistKeys(savingObjects, undefined);
	}

	private async persistKeys(
		savingObjects: SavingObjects,
		fixedId: string | undefined,
	) {
		if (!savingObjects.fulfilled) {
			savingObjects.fulfilled = true;
			const promises = this.generateSavingPromises(savingObjects, fixedId);
			await Promise.all(promises);
		}
	}

	private *generateSavingPromises(
		savingObjects: SavingObjects,
		fixedId: string | undefined,
	) {
		const ttlSavingObjects = new Map<
			number,
			[string, Record<string, unknown>, Map<string, number>]
		>();

		for (const [key, [ttl, value]] of savingObjects.entries.entries()) {
			let ttlSaving = ttlSavingObjects.get(ttl);
			if (!ttlSaving) {
				ttlSaving = [fixedId ?? v4(), {}, new Map()];
				ttlSavingObjects.set(ttl, ttlSaving);
			}
			ttlSaving[1][key] = value;
			ttlSaving[TTL_MAP_POS].set(key, ttl);
		}
		for (const [ttl, [key, entries, ttls]] of ttlSavingObjects) {
			yield this.persist(entries, (value) =>
				this.alternativePersistence!.save(key, value, ttl),
			);
			yield* this.saveKeys(ttls, key);
		}
	}

	private async try<T>(key: string, cb: () => Promise<T>) {
		try {
			return await cb();
		} catch (err) {
			this.onError?.(key, err as Error);
		}
	}

	private *saveKeys(entries: Map<string, number>, key: string) {
		for (const [redisKey, ttl] of entries.entries()) {
			yield this.try(redisKey, () => this.redis.setex(redisKey, ttl || 1, key));
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
		return saving(value);
	}

	async clearCache(key: string) {
		return this.try(key, () => this.redis.del(this.getRedisKey(key)));
	}

	private async tryCache<T>(key: string, callback: () => PromiseLike<T>) {
		const result = await this.getFromCacheInternal<T>(key, true);
		if (result !== EMPTY) {
			this.onCache?.(key);
			return result;
		}
		return callback();
	}

	private async getFromCacheInternal<T>(
		key: string,
		firstCheck: boolean,
	): Promise<T | typeof EMPTY> {
		const redisKey = this.getRedisKey(key);
		const cached = await this.try(redisKey, () =>
			this.redis.getBuffer(redisKey),
		);
		if (cached) {
			if (
				this.alternativePersistence &&
				cached.length <= MAX_ALTERNATIVE_KEY_SIZE
			) {
				const alternativeCached = await this.alternativePersistence.get(
					cached.toString(),
					firstCheck,
				);
				if (alternativeCached) {
					const deserialized =
						await this.serializer.deserialize(alternativeCached);
					return deserialized.hasOwnProperty(redisKey)
						? deserialized[redisKey]
						: EMPTY;
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
