import { delay } from './delay';

export function raceFactory<T>(
	timeout: number,
	callback: (...args: any[]) => Promise<any>,
): (...args: any[]) => Promise<T> {
	return async (...args) => {
		let finished = false;
		try {
			return await Promise.race([
				callback(...args),
				delay(timeout).then(() => {
					if (!finished) {
						return Promise.reject(new Error('Redis seems to be unavailable'));
					}
				}),
			]);
		} finally {
			finished = true;
		}
	};
}
