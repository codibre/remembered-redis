export type LogError = (message: string) => any;
export type Action = () => PromiseLike<void>;
export type TryTo = (action: Action) => PromiseLike<void>;
export interface RememberedRedisConfig {
	ttl: number;
	redisTtl?: number;
	redisPrefix?: string;
	lockTimeout?: number;
	acquireTimeout?: number;
	retryInterval?: number;
	refreshInterval?: number;
	logError?: LogError;
	onCache?: (key: string) => void;
}
