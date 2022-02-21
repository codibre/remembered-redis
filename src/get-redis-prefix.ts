export function getRedisPrefix(redisPrefix: string | undefined) {
	let result: string;
	if (redisPrefix) {
		result = redisPrefix;
		if (!redisPrefix.endsWith(':')) { result += ':'; }
	} else {
		result = '';
	}
	return result;
}
