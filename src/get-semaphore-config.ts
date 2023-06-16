import { LockOptions } from 'redis-semaphore';
import { RememberedRedisConfig } from './remembered-redis-config';
import {
	DEFAULT_LOCK_TIMEOUT,
	DEFAULT_ACQUIRE_TIMEOUT,
	DEFAULT_RETRY_INTERVAL,
	DEFAULT_REFRESH_INTERVAL,
} from './remembered-redis';

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
	release(): Promise<void>;
}
