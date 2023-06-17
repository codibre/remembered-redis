import { LogError, TryTo } from './remembered-redis-config';

export function dontWaitFactory(logError: LogError | undefined, tryTo: TryTo) {
	return (cb: () => Promise<unknown>) => setImmediate(() => tryTo(cb));
}
