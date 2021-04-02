import { Action, LogError, TryTo } from './remembered-redis-config';

export function tryToFactory(logError: LogError | undefined): TryTo {
	return async function (action: Action) {
		try {
			await action();
		} catch (err) {
			logError?.(err.message);
		}
	};
}
