import { LogError } from '../../src';
import { tryToFactory } from '../../src/try-to-factory';
import './setup';

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
		expect(result).toBeUndefined();
	});

	it('should return a function that runs the action and log an error, with the action throws one', async () => {
		const callback = tryToFactory(logError);
		const action = jest.fn().mockImplementation(async () => {
			throw new Error('my error');
		});

		const result = await callback(action);

		expect(action).toHaveCallsLike([]);
		expect(logError).toHaveCallsLike(['my error']);
		expect(result).toBeUndefined();
	});

	it('should return a function that runs the action and not log an error, with the action throws one and an undefined logError', async () => {
		const callback = tryToFactory(undefined);
		const action = jest.fn().mockImplementation(async () => {
			throw new Error('my error');
		});

		const result = await callback(action);

		expect(action).toHaveCallsLike([]);
		expect(result).toBeUndefined();
	});
});
