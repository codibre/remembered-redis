import { RedisLike } from './get-semaphore-config';
import { getSafeInstance } from 'get-safe-instance';

type UsedRedisMethods = 'getBuffer' | 'setex' | 'del' | 'eval' | 'evalsha';
const usedRedisMethods: UsedRedisMethods[] = [
	'getBuffer',
	'setex',
	'del',
	'eval',
	'evalsha',
];

export function getSafeRedis(
	source: RedisLike,
	onError?: (key: string, err: Error) => any,
	timeout?: number,
): RedisLike {
	return timeout
		? getSafeInstance(
				source,
				timeout,
				usedRedisMethods.filter(
					(method): method is keyof RedisLike => method in source,
				),
				(key, _, err) => onError?.(key, err),
		  )
		: source;
}
