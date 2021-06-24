import { GzipStrategy, JsonStrategy, Serializer } from 'multi-serializer';

export const valueSerializer = new Serializer(
	new JsonStrategy(),
	new GzipStrategy(),
);
