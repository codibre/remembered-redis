import { LogError } from '../../src';
import { tryToFactory } from '../../src/try-to-factory';

describe(tryToFactory.name, () => {
	let logError: LogError;

	beforeEach(() => {
		logError = jest.fn();
	});

	it('should return a function that runs the action', async () => {
		const callback = tryToFactory(logError);
		const action = jest.fn().mockResolvedValue('test');

		const result = await callback(action);

		expect(action).toHaveCallsLike([]);
		expect(logError).toHaveCallsLike();
		expect(result).toBe('test');
	});

	it('should return a function that runs the action and log an error, if the action throws one', async () => {
		const callback = tryToFactory(logError);
		const action = jest.fn().mockImplementation(async () => {
			throw new Error('my error');
		});

		const result = await callback(action);

		expect(action).toHaveCallsLike([]);
		expect(logError).toHaveCallsLike(['my error']);
		expect(result).toBeUndefined();
	});

	it('should return a function that runs the action and do not log an error, if the action throws one and logError is undefined', async () => {
		const callback = tryToFactory(undefined);
		const action = jest.fn().mockImplementation(async () => {
			throw new Error('my error');
		});

		const result = await callback(action);

		expect(action).toHaveCallsLike([]);
		expect(result).toBeUndefined();
	});
});
