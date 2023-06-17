import Redis from 'ioredis';
import { RememberedRedis } from '../../src';
import { promisify } from 'util';
import { v4 } from 'uuid';
import { gzipValueSerializer } from '../../src/gzip-value-serializer';

const delay = promisify(setTimeout);
const proto = RememberedRedis.prototype;

describe('index.ts', () => {
	let redis: Redis;
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
				redisTtl: 1000000,
				redisPrefix: 'REMEMBERED',
			},
			redis,
		);
	});

	afterEach(async () => {
		await redis.flushdb();
	});

	it('should acquire redis semaphore, fill redis cache with callback result, and release semaphore', async () => {
		const callback = jest
			.fn()
			.mockResolvedValue(delay(10).then(() => 'expected result'));

		const result = await target.get(key, callback);
		await delay(5);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBe('expected result');
		expect(await redis.getBuffer(target['getRedisKey'](key))).toEqual(
			await gzipValueSerializer.serialize('expected result'),
		);
		await delay(5);
		expect(await redis.ttl(target['getRedisKey'](key))).toBeGreaterThan(0);
	});

	it('should acquire redis semaphore, fill redis cache with callback result, and release semaphore when noCacheIf returns false', async () => {
		const callback = jest
			.fn()
			.mockResolvedValue(delay(10).then(() => 'expected result'));

		const result = await target.get(key, callback, () => false);
		await delay(5);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBe('expected result');
		expect(await redis.getBuffer(target['getRedisKey'](key))).toEqual(
			await gzipValueSerializer.serialize('expected result'),
		);
		await delay(7);
		expect(await redis.ttl(target['getRedisKey'](key))).toBeGreaterThan(0);
	});

	it('should acquire redis semaphore, do not fill redis cache with callback result, and release semaphore when noCacheIf returns true', async () => {
		const callback = jest.fn().mockResolvedValue('expected result');

		const result = await target.get(key, callback, () => true);
		await delay(10);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBe('expected result');
		expect(await redis.getBuffer(target['getRedisKey'](key))).toBe(null);
	});

	it('should acquire redis semaphore, fill redis cache with callback result with no ttl, and release semaphore when redisTtl is 0', async () => {
		const callback = jest
			.fn()
			.mockResolvedValue(delay(10).then(() => 'expected result'));
		const target0 = new RememberedRedis(
			{
				ttl: 1000,
				redisTtl: 0,
				redisPrefix: 'REMEMBERED',
			},
			redis,
		);

		const result = await target0.get(key, callback);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBe('expected result');
		expect(await redis.ttl(target['getRedisKey'](key))).toBeLessThan(10);
	});

	it('should acquire redis semaphore, not fill redis cache with callback result, and release semaphore when callback result is undefined', async () => {
		const callback = jest.fn().mockResolvedValue(undefined);

		const result = await target.get(key, callback);
		await delay(10);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBeUndefined();
		expect(await redis.getBuffer(target['getRedisKey'](key))).toBe(null);
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
		await delay(10);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBe('expected result');
		expect(await redis.getBuffer(target['getRedisKey'](key))).toEqual(
			await gzipValueSerializer.serialize('expected result'),
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
		await delay(10);

		expect(callback).toHaveCallsLike();
		expect(result).toBe('cached result');
		expect(await redis.getBuffer(target['getRedisKey'](key))).toEqual(
			await gzipValueSerializer.serialize('cached result'),
		);
	});

	it('should return info from cache even if it is not gzipped', async () => {
		const callback = jest.fn().mockResolvedValue('expected result');
		await redis.set(target['getRedisKey'](key), '"cached result"');

		const result = await target.get(key, callback);

		expect(callback).toHaveCallsLike();
		expect(result).toBe('cached result');
	});

	it('should acquire redis semaphore, fill redis cache with callback result, and release semaphore when redisTtl is a function', async () => {
		const callback = jest
			.fn()
			.mockResolvedValue(delay(10).then(() => 'expected result'));
		target = new RememberedRedis(
			{
				ttl: 1000,
				redisTtl: () => 100,
				redisPrefix: 'REMEMBERED',
			},
			redis,
		);

		const result = await target.get(key, callback);
		await delay(5);

		expect(callback).toHaveCallsLike([]);
		expect(result).toBe('expected result');
		expect(await redis.getBuffer(target['getRedisKey'](key))).toEqual(
			await gzipValueSerializer.serialize('expected result'),
		);
		await delay(5);
		expect(await redis.ttl(target['getRedisKey'](key))).toBeGreaterThan(0);
	});

	describe(proto.runAndCache.name, () => {
		let callback: jest.SpyInstance;
		let noCacheIf: jest.SpyInstance | undefined;
		let acquire: jest.SpyInstance;
		let release: jest.SpyInstance;
		let semaphore: any;

		beforeEach(() => {
			callback = jest.fn().mockResolvedValue('expected value');
			acquire = jest.fn().mockReturnValue('acquire result');
			release = jest.fn().mockReturnValue('release result');
			jest.spyOn(target, 'updateCache').mockResolvedValue(undefined);
			semaphore = { acquire: { bind: acquire }, release: { bind: release } };
			jest.spyOn(target, 'getSemaphore' as any).mockReturnValue(semaphore);
			jest.spyOn(target, 'tryTo' as any).mockResolvedValue(undefined);
		});

		it('should run the specified command and save it into cache, when result is defined and noCacheIf is not informed', async () => {
			const result = await target.runAndCache(
				'my-key',
				callback as any,
				noCacheIf as any,
				'my ttl' as unknown as number,
			);

			expect(result).toBe('expected value');
			expect(target['getSemaphore']).toHaveCallsLike(['my-key']);
			expect(acquire).toHaveCallsLike([semaphore]);
			expect(callback).toHaveCallsLike([]);
			expect(target.updateCache).toHaveCallsLike([
				'my-key',
				'expected value',
				'my ttl',
			]);
			expect(release).toHaveCallsLike([semaphore]);
			expect(target['tryTo']).toHaveCallsLike(
				['acquire result'],
				['release result'],
			);
		});

		it('should run the specified command and save it into cache, when result is defined and noCacheIf returns false', async () => {
			noCacheIf = jest.fn().mockReturnValue(false);

			const result = await target.runAndCache(
				'my-key',
				callback as any,
				noCacheIf as any,
				'my ttl' as unknown as number,
			);

			expect(result).toBe('expected value');
			expect(target['getSemaphore']).toHaveCallsLike(['my-key']);
			expect(acquire).toHaveCallsLike([semaphore]);
			expect(callback).toHaveCallsLike([]);
			expect(noCacheIf).toHaveCallsLike(['expected value']);
			expect(target.updateCache).toHaveCallsLike([
				'my-key',
				'expected value',
				'my ttl',
			]);
			expect(release).toHaveCallsLike([semaphore]);
			expect(target['tryTo']).toHaveCallsLike(
				['acquire result'],
				['release result'],
			);
		});

		it('should run the specified command and not save it into cache, when result is defined and noCacheIf returns true', async () => {
			noCacheIf = jest.fn().mockReturnValue(true);

			const result = await target.runAndCache(
				'my-key',
				callback as any,
				noCacheIf as any,
				'my ttl' as unknown as number,
			);

			expect(result).toBe('expected value');
			expect(target['getSemaphore']).toHaveCallsLike(['my-key']);
			expect(acquire).toHaveCallsLike([semaphore]);
			expect(callback).toHaveCallsLike([]);
			expect(noCacheIf).toHaveCallsLike(['expected value']);
			expect(target.updateCache).toHaveCallsLike();
			expect(release).toHaveCallsLike([semaphore]);
			expect(target['tryTo']).toHaveCallsLike(
				['acquire result'],
				['release result'],
			);
		});
	});

	describe(proto.getFromCache.name, () => {
		let acquire: jest.SpyInstance;
		let release: jest.SpyInstance;
		let semaphore: any;

		beforeEach(() => {
			acquire = jest.fn().mockReturnValue('acquire result');
			release = jest.fn().mockReturnValue('release result');
			semaphore = { acquire: { bind: acquire }, release: { bind: release } };
			jest.spyOn(target, 'getSemaphore' as any).mockReturnValue(semaphore);
			jest
				.spyOn(target, 'getFromCacheInternal' as any)
				.mockResolvedValue('expected result');
			jest.spyOn(target, 'tryTo' as any).mockResolvedValue(undefined);
		});

		it('should acquire semaphore when noSemaphore is not informed', async () => {
			const result = await target.getFromCache('my key');

			expect(target['getSemaphore']).toHaveCallsLike(['my key']);
			expect(acquire).toHaveCallsLike([semaphore]);
			expect(target['getFromCacheInternal']).toHaveCallsLike(['my key']);
			expect(release).toHaveCallsLike([semaphore]);
			expect(target['tryTo']).toHaveCallsLike(
				['acquire result'],
				['release result'],
			);
			expect(result).toBe('expected result');
		});

		it('should acquire semaphore when noSemaphore is false', async () => {
			const result = await target.getFromCache('my key', false);

			expect(target['getSemaphore']).toHaveCallsLike(['my key']);
			expect(acquire).toHaveCallsLike([semaphore]);
			expect(target['getFromCacheInternal']).toHaveCallsLike(['my key']);
			expect(release).toHaveCallsLike([semaphore]);
			expect(target['tryTo']).toHaveCallsLike(
				['acquire result'],
				['release result'],
			);
			expect(result).toBe('expected result');
		});

		it('should not acquire semaphore when noSemaphore is true', async () => {
			const result = await target.getFromCache('my key', true);

			expect(target['getSemaphore']).toHaveCallsLike(['my key']);
			expect(acquire).toHaveCallsLike();
			expect(target['getFromCacheInternal']).toHaveCallsLike(['my key']);
			expect(release).toHaveCallsLike();
			expect(target['tryTo']).toHaveCallsLike();
			expect(result).toBe('expected result');
		});
	});
});
