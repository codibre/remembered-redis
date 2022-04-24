import { v4 } from 'uuid';
import { Redis } from 'ioredis';
import CircuitBreaker = require('opossum');
import { delay } from './delay';

function raceFactory<T>(
	timeout: number,
	callback: (...args: any[]) => Promise<T>,
): (...args: any[]) => Promise<T> {
	return (args) =>
		Promise.race([
			callback(...args),
			delay(timeout).then(() =>
				Promise.reject(new Error('Redis seems to be unavailable')),
			),
		]);
}

export function getSafeRedis(
	source: Redis,
	onError?: (key: string, err: Error) => any,
	timeout?: number,
): Redis {
	if (timeout) {
		try {
			const CircuitBreakerCls = require('opossum') as typeof CircuitBreaker;
			const breakerOptions: CircuitBreaker.Options = {
				timeout,
				group: v4(),
			};
			const getBufferCb = new CircuitBreakerCls(
				raceFactory(timeout, source.getBuffer.bind(source)),
				breakerOptions,
			);
			const setexCb = new CircuitBreakerCls(
				raceFactory(timeout, source.setex.bind(source)),
				breakerOptions,
			);
			const delCb = new CircuitBreakerCls(
				raceFactory(timeout, source.del.bind(source)),
				breakerOptions,
			);
			const map = new Map([
				['getBuffer', getBufferCb.fire.bind(getBufferCb)],
				['setex', getBufferCb.fire.bind(setexCb)],
				['del', getBufferCb.fire.bind(delCb)],
			]);
			return new Proxy(source, {
				get(target, p: keyof Redis) {
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
