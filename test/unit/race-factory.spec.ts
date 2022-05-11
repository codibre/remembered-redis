import { delay } from '../../src/delay';
import { raceFactory } from '../../src/race-factory';

describe(raceFactory.name, () => {
	it('should return a function that returns a callback result if it is finished before a specified timeout', async () => {
		const callback = jest.fn().mockImplementation(async () => {
			return 'test';
		});
    const timeout = 1;

		const raceFactoryCallback = raceFactory(timeout, callback);

    const result = await raceFactoryCallback();

		expect(callback).toHaveCallsLike([]);
		expect(result).toBe('test');
	});

  it('should return a function that returns a rejected promise if the callback received as parameter do not finish before a specified timeout', async () => {
		const callback = jest.fn().mockImplementation(async () => {
      await delay(10);
			return 'test';
		});
    const timeout = 0;

		const raceFactoryCallback = raceFactory(timeout, callback);

    let err;
    try {
      await raceFactoryCallback();
    }catch(error: any){
      err = error;
    }

		expect(callback).toHaveCallsLike([]);
		expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Redis seems to be unavailable');
	});
});
