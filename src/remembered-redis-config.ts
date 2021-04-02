export type LogError = (message: string) => any;

export interface RememberedRedisConfig {
	ttl: number;
	redisTtl?: number;
	redixPrefix?: string;
	lockTimeout?: number;
	acquireTimeout?: number;
	retryInterval?: number;
	refreshInterval?: number;
	logError?: LogError;
}
