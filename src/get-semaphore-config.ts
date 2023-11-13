import { LockOptions } from 'redis-semaphore';
import { RememberedRedisConfig } from './remembered-redis-config';
import {
	DEFAULT_LOCK_TIMEOUT,
	DEFAULT_ACQUIRE_TIMEOUT,
	DEFAULT_RETRY_INTERVAL,
	DEFAULT_REFRESH_INTERVAL,
} from './remembered-redis';
import { Redis } from 'ioredis';

export function getSemaphoreConfig(config: RememberedRedisConfig): LockOptions {
	return {
		lockTimeout: config.lockTimeout || DEFAULT_LOCK_TIMEOUT,
		acquireTimeout: config.acquireTimeout || DEFAULT_ACQUIRE_TIMEOUT,
		retryInterval: config.retryInterval || DEFAULT_RETRY_INTERVAL,
		refreshInterval: config.refreshInterval || DEFAULT_REFRESH_INTERVAL,
	};
}

export interface RememberedSemaphore {
	acquire(): Promise<void>;
	release(): void;
}

export type RequiredField<Type, Field extends keyof Type> = Omit<Type, Field> &
	Required<Pick<Type, Field>>;
export type RedisLike = Pick<Redis, 'getBuffer' | 'setex' | 'del'>;
export type RedisMutexReadyLike = Pick<
	Redis,
	'getBuffer' | 'setex' | 'del' | 'eval' | 'evalsha'
>;
