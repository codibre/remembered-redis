import { v4 } from 'uuid';
import CircuitBreaker = require('opossum');
import { raceFactory } from './race-factory';
import { RedisLike } from './get-semaphore-config';

type UsedRedisMethods = 'getBuffer' | 'setex' | 'del';
const usedRedisMethods: UsedRedisMethods[] = ['getBuffer', 'setex', 'del'];

function getSafeMethodFactory(
	timeout: number,
	source: RedisLike,
	breakerOptions: CircuitBreaker.Options,
) {
	return (method: UsedRedisMethods) => {
		const CircuitBreakerCls = require('opossum') as typeof CircuitBreaker;
		const getBufferCb = new CircuitBreakerCls(
			raceFactory(timeout, source[method].bind(source)),
			breakerOptions,
		);
		const safeMethod = getBufferCb.fire.bind(getBufferCb);
		return [method, safeMethod] as [UsedRedisMethods, Function];
	};
}

export function getSafeRedis(
	source: RedisLike,
	onError?: (key: string, err: Error) => any,
	timeout?: number,
): RedisLike {
	if (timeout) {
		try {
			const breakerOptions: CircuitBreaker.Options = {
				timeout,
				volumeThreshold: 30,
				group: v4(),
			};
			const map = new Map<UsedRedisMethods, Function>(
				usedRedisMethods.map(
					getSafeMethodFactory(timeout, source, breakerOptions),
				),
			);
			return new Proxy(source, {
				get(target, p: UsedRedisMethods) {
					const func = map.get(p);
					if (func) {
						return func;
					}
					const value = target[p];
					return typeof value === 'function'
						? (value as any).bind(target)
						: value;
				},
			});
		} catch (err) {
			onError?.('*', err as Error);
		}
	}

	return source;
}
