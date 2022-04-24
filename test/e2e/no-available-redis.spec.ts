import { promisify } from 'util';
import { RememberedRedis } from './../../src/remembered-redis';
import Redis = require('ioredis');

const delay = promisify(setTimeout);

describe('Non available Redis resilience', () => {
	it('should not throw an error when redis is not available', async () => {
		const remembered = new RememberedRedis(
			{
				ttl: 1000,
				redisTtl: 100000,
				redisTimeout: 100,
			},
			new Redis(8888, 'localhost', {
				commandTimeout: 100,
				maxRetriesPerRequest: 1,
			}),
		);
		let i = 0;

		const result1 = await remembered.get('my-key', async () => i++);
		const result2 = await remembered.get('my-key', async () => i++);
		await delay(1000);
		const result3 = await remembered.get('my-key', async () => i++);
		const result4 = await remembered.get('my-key', async () => i++);

		expect(result1).toBe(result2);
		expect(result3).toBe(result4);
		expect(result1).not.toBe(result3);
	});
});
