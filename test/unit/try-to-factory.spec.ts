import { getRedisPrefix } from '../../src/get-redis-prefix';

describe(getRedisPrefix.name, () => {
	it('should return prefix followed by : when an string is informed that not ends in it', () => {
		const result = getRedisPrefix('test');

		expect(result).toBe('test:');
	});

	it('should return prefix as is when an string is informed that ends with :', () => {
		const result = getRedisPrefix('test:');

		expect(result).toBe('test:');
	});

	it('should and empty string when the informed prefix is undefined', () => {
		const result = getRedisPrefix(undefined);

		expect(result).toBe('');
	});

	it('should and empty string when the informed prefix is an empty string', () => {
		const result = getRedisPrefix('');

		expect(result).toBe('');
	});
});