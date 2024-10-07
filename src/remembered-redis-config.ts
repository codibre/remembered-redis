import { RememberedConfig, Ttl } from 'remembered';

export type LogError = (message: string) => any;
export type Action<T> = () => PromiseLike<T>;
export type TryTo = <T>(action: Action<T>) => Promise<T | undefined>;
export interface AlternativePersistence {
	/**
	 * Saves the informed content
	 * @param key the key for the content
	 * @param content the content to be saved
	 * @param ttl the expiration time, in seconds, that Redis will use to maintain the reference for this key
	 */
	save(key: string, content: string | Buffer, ttl: number): Promise<void>;

	/**
	 * Get the content for the informed key
	 * @param key the key for the content
	 */
	get(key: string, firstCheck: boolean): Promise<Buffer | string | undefined>;

	/**
	 * If defined and returns true, the alternative persistence is applied; otherwise it is not.
	 * @param content the content to be saved
	 * @param ttl the expiration time, in seconds, that Redis will use to maintain the reference for this key
	 */
	shouldUseAlternativePersistence?: (
		content: unknown,
		ttl: number,
	) => boolean;

	maxSavingDelay?: number;
	maxResultsPerSave?: number;
}

export interface Semaphore {
	acquire(key: string): Promise<() => Promise<unknown>>;
}

export interface RememberedRedisConfig extends RememberedConfig {
	redisTtl?: Ttl;
	redisPrefix?: string;
	lockTimeout?: number;
	acquireTimeout?: number;
	retryInterval?: number;
	refreshInterval?: number;
	noCompress?: boolean;
	redisTimeout?: number;
	logError?: LogError;
	onCache?: (key: string) => void;
	onError?: (key: string, err: Error) => any;
	onLockLost?: (key: string, err: Error & { name: string }) => any;
	/**
	 * When informed, redis is used only for ttl control, but the real data is persisted using these methods
	 */
	alternativePersistence?: AlternativePersistence;
	semaphore?: Semaphore;
}
