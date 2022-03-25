import { GzipStrategy, JsonStrategy, Serializer } from 'multi-serializer';

export const gzipValueSerializer = new Serializer(
	new JsonStrategy(),
	new GzipStrategy(),
);
