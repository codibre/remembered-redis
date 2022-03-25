import { RememberedConfig, Ttl } from 'remembered';

export type LogError = (message: string) => any;
export type Action = () => PromiseLike<void>;
export type TryTo = (action: Action) => PromiseLike<void>;
export interface AlternativePersistence {
	/**
	 * Saves the informed content
	 * @param key the key for the content
	 * @param content the content to be saved
	 * @param ttl the ttl redis will maintain the reference for this key, in seconds
	 */
	save(key: string, content: string | Buffer, ttl: number): Promise<void>;

	/**
	 * Get the content for the informed key
	 * @param key the key for the content
	 */
	get(key: string): Promise<Buffer | string | undefined>;

	maxSavingDelay?: number;
}

export interface RememberedRedisConfig extends RememberedConfig {
	redisTtl?: Ttl;
	redisPrefix?: string;
	lockTimeout?: number;
	acquireTimeout?: number;
	retryInterval?: number;
	refreshInterval?: number;
	noCompress?: boolean;
	logError?: LogError;
	onCache?: (key: string) => void;
	onError?: (key: string, err: Error) => any;
	/**
	 * When informed, redis is used only for ttl control, but the real data is persisted using these methods
	 */
	alternativePersistence?: AlternativePersistence;
}
