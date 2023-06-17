import { promisify } from 'util';
import { RememberedRedis } from '../../src/remembered-redis';
import Redis = require('ioredis');

const delay = promisify(setTimeout);

describe('e2e: Non available Redis resilience', () => {
	it('should not throw an error when redis is not available', async () => {
		const redis = new Redis(8888, 'localhost', {
			commandTimeout: 100,
			maxRetriesPerRequest: 1,
		});
		const setex = jest.spyOn(redis, 'setex');
		const getBuffer = jest.spyOn(redis, 'getBuffer');
		const remembered = new RememberedRedis(
			{
				ttl: 900,
				redisTtl: 100000,
				redisTimeout: 100,
				doubleLock: true,
			},
			redis,
		);
		let i = 0;

		const result1 = await remembered.get('my-key', async () => i++);
		const result2 = await remembered.get('my-key', async () => i++);
		await delay(1000);
		const result3 = await remembered.get('my-key', async () => i++);
		await remembered.get('my-key', async () => i++);

		expect(getBuffer).toHaveCallsLike(
			['my-key'],
			['my-key'],
			['my-key'],
			['my-key'],
		);
		expect(setex).toHaveCallsLike(['my-key', 100000, expect.any(Buffer)]);
		expect(result1).toBe(result2);
		expect(result1).not.toBe(result3);
	});
});
