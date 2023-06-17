import { Action, LogError, TryTo } from './remembered-redis-config';

export function tryToFactory(logError: LogError | undefined): TryTo {
	return async function <T>(action: Action<T>) {
		try {
			return await action();
		} catch (err: any) {
			logError?.(err.message);
		}
	};
}
