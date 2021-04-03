afterEach(() => {
	jest.restoreAllMocks();
	jest.clearAllMocks();
});

export function getNames<T extends object>(c: { prototype: T }): T {
	return new Proxy(c.prototype, {
		get(target: T, property: string) {
			const result = target[property as keyof T];
			if (!result) {
				throw new Error(`Method ${property} doesn't exist`);
			}

			return result;
		},
	});
}

expect.extend({
	toHaveCallsLike(spy: any, ...parameters: unknown[][]) {
		const errors: string[] = [];
		try {
			expect(spy).toBeCalledTimes(parameters.length);
		} catch (err) {
			errors.push(err);
		}
		parameters.forEach((params, i) => {
			try {
				expect(spy).toHaveBeenNthCalledWith(i + 1, ...params);
			} catch (err) {
				errors.push(err.message.replace(/\n+Number of calls: .+$/, '\n'));
			}
		});
		if (errors.length > 0) {
			const separator = '-------------------------------------------\n';
			const message = `${separator}${errors
				.map((x) => x)
				.join(`\n${separator}`)}\n`;
			return {
				message: () => message,
				pass: false,
			};
		}
		return {
			message: () => '',
			pass: true,
		};
	},
});

declare global {
	namespace jest {
		interface Matchers<R> {
			toHaveCallsLike(...parameters: unknown[][]): R;
		}
	}
}
