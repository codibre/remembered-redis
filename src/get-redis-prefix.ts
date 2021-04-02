import { RememberedRedisConfig } from './remembered-redis-config';

export function getRedisPrefix(config: RememberedRedisConfig) {
	let redisPrefix: string;
	if (config.redixPrefix) {
		redisPrefix = config.redixPrefix;
		if (!redisPrefix.endsWith(':')) {
			redisPrefix += ':';
		}
	} else {
		redisPrefix = '';
	}
	return redisPrefix;
}
