[![Actions Status](https://github.com/Codibre/remembered-redis/workflows/build/badge.svg)](https://github.com/Codibre/remembered-redis/actions)
[![Actions Status](https://github.com/Codibre/remembered-redis/workflows/test/badge.svg)](https://github.com/Codibre/remembered-redis/actions)
[![Actions Status](https://github.com/Codibre/remembered-redis/workflows/lint/badge.svg)](https://github.com/Codibre/remembered-redis/actions)
[![Test Coverage](https://api.codeclimate.com/v1/badges/f11e39489f6b57ff1e9d/test_coverage)](https://codeclimate.com/github/Codibre/remembered-redis/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/f11e39489f6b57ff1e9d/maintainability)](https://codeclimate.com/github/Codibre/remembered-redis/maintainability)
[![Packages](https://david-dm.org/Codibre/remembered-redis.svg)](https://david-dm.org/Codibre/remembered-redis)
[![npm version](https://badge.fury.io/js/%40remembered%2Fredis.svg)](https://badge.fury.io/js/%40remembered%2Fredis)

A simple semaphore/cache lib using redis, extended from remembered package

# How to Install

```
npm i @remembered/redis
```

# How to use

Create an Remembered instance passing a redis-io instance:

```ts
const remembered = new RememberedRedis({
  ttl: 200, // In milliseconds
  redisTtl: 10000 // In seconds
}, IORedisInstance);
```

Now, call the method you want to use the semaphore using get

```ts
const result = await remembered.get(request.myKey, () => myRequest(request));
```

You can also use the wrap method to create a new version of your function that uses the semaphore under the hood

```ts
const semaphoredMyRequest = remembered.wrap(myRequest, (request) => request.myKey);

const result = await semaphoredMyRequest(request);
```

Notice that the remembering key in the wrap option is defined by the second callback. This function receives the same parameters as the first one.

# Important!

The **ttl** refers to the local ttl, the one that the **remembered** package uses to reuse promises. **redisTtl**, in the other hand, refers to the ttl the cache will have in Redis. This distinction is important as, locally, you have a limited memory.
You can make the local ttl be just some seconds or even 0 (for the promise to be reused just while it is not resolved), while **RedisTtl** can be larger, without affecting memory consumption in your service.

## License

Licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License).
