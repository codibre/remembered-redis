import './setup';
import Redis = require('ioredis');
import { RememberedRedis } from '../../src';
import { promisify } from 'util';
import { v4 } from 'uuid';

const delay = promisify(setTimeout);

describe('index.ts', () => {
	let redis: Redis.Redis;
	let target: RememberedRedis;
	let key: string;

	beforeAll(() => {
		redis = new Redis();
	});

	afterAll(async () => {
		await redis.quit();
	});

	beforeEach(() => {
		key = v4();
		target = new RememberedRedis(
			{
				ttl: 1000,
				redisTtl: 1,
				redisPrefix: 'REMEMBERED',
			},
			redis,
		);
	});

	afterEach(async () => {
		await redis.flushdb();
	});

	it('should acquire redis semaphore, fill redis cache with callback result, and release semaphore', async () => {
		const callback = jest.fn().mockResolvedValue('expected result');

		const result = await target.get(key, callback);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBe('expected result');
		expect(await redis.get(target['getRedisKey'](key))).toBe(
			'"expected result"',
		);
		expect(await redis.ttl(target['getRedisKey'](key))).toBeGreaterThan(0);
	});

	it('should acquire redis semaphore, fill redis cache with callback result with no ttl, and release semaphore when redisTtl is 0', async () => {
		const callback = jest.fn().mockResolvedValue('expected result');
		const target0 = new RememberedRedis(
			{
				ttl: 1000,
				redisTtl: 0,
				redisPrefix: 'REMEMBERED',
			},
			redis,
		);

		const result = await target0.get(key, callback);

		expect(callback).toHaveCallsLike([], [], [], []);
		expect(result).toBe('expected result');
		expect(await redis.get(target['getRedisKey'](key))).toBe(
			'"expected result"',
		);
		expect(await redis.ttl(target['getRedisKey'](key))).toBeLessThan(0);
	});

	it('should acquire redis semaphore, not fill redis cache with callback result, and release semaphore when callback result is undefined', async () => {
		const callback = jest.fn().mockResolvedValue(undefined);

		const result = await target.get(key, callback);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBeUndefined();
		expect(await redis.get(target['getRedisKey'](key))).toBe(null);
	});

	it('should wait for semaphore acquisition, fill redis cache with callback result, and release semaphore when the semaphore is previously acquired and no result is found in redis', async () => {
		const callback = jest.fn().mockResolvedValue('expected result');
		const semaphore = target['getSemaphore'](key);
		await semaphore.acquire();
		async function release() {
			await delay(100);
			await semaphore.release();
		}
		async function checkCalls() {
			await delay(50);
			expect(callback).toHaveCallsLike();
		}

		const [result] = await Promise.all([
			target.get(key, callback),
			release(),
			checkCalls(),
		]);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBe('expected result');
		expect(await redis.get(target['getRedisKey'](key))).toBe(
			'"expected result"',
		);
	});

	it('should wait for semaphore acquisition, get result from cache, and release semaphore when the semaphore is previously acquired and some result is found in redis', async () => {
		const callback = jest.fn().mockResolvedValue('expected result');
		const semaphore = target['getSemaphore'](key);
		await semaphore.acquire();
		async function release() {
			await delay(100);
			await redis.set(target['getRedisKey'](key), '"cached result"');
			await semaphore.release();
		}

		const [result] = await Promise.all([target.get(key, callback), release()]);

		expect(callback).toHaveCallsLike();
		expect(result).toBe('cached result');
		expect(await redis.get(target['getRedisKey'](key))).toBe('"cached result"');
	});

	it('should wait for semaphore acquisition, get result from cache, and release semaphore when the semaphore is previously acquired and some result is found in redis', async () => {
		const callback = jest.fn().mockResolvedValue('expected result');
		const semaphore = target['getSemaphore'](key);
		await semaphore.acquire();
		async function release() {
			await delay(100);
			await redis.set(target['getRedisKey'](key), '"cached result"');
			await semaphore.release();
		}

		const [result] = await Promise.all([target.get(key, callback), release()]);

		expect(callback).toHaveCallsLike();
		expect(result).toBe('cached result');
		expect(await redis.get(target['getRedisKey'](key))).toBe('"cached result"');
	});
});
