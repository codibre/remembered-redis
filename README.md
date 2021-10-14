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

# How to use alternative persistence

Sometimes the size of your data is just too big for redis to be cheap solution, and you need to take some common strategy, like, to save the data in S3 and to use a reference to the saved file in Redis, for ttl control. This package offers a way to apply this strategy seamlessly through the configuration **alternativePersistence**. Here's an example:

First, you need to implement the interface **AlternativePersistence**. The implementation below is a valid one to use with S3
```ts
export class S3Cache implements AlternativePersistence {
  constructor(
    private s3: S3, //AWS S3 object
    private bucketName: string,
    public maxSavingDelay: number,
  ) {}

  async save(key: string, content: string | Buffer): Promise<void> {
    const objectKey = this.getObjectKey(key);

    const params = {
      Body: content,
      Bucket: this.bucketName,
      Key: objectKey,
      ContentType: 'application/json',
    };

    await this.s3.putObject(params).promise();
  }

  async get(key: string): Promise<string | Buffer | undefined> {
    const params = {
      Bucket: this.bucketName,
      Key: this.getObjectKey(key),
    };

    const { Body } = await this.s3.getObject(params).promise();

    return Body as string | Buffer | undefined;
  }

  get maxSavingDelay(): number {
    return this.settings.app.cacheWaitingDelay;
  }

  private getObjectKey(key: string): string {
    return `my-cache/${key}.bin`;
  }
}
```

Then, you can use it with **remembered-redis**:
```ts
const remembered = new RememberedRedis(
  {
    ttl: 0,
    redisTtl: 3600,
    redisPrefix: 's3-cache',
    alternativePersistence: new S3Cache(s3, 'my-bucket', 3),
  },
  redisInstance,
);
```

That's it! Now S3 will get the heavy data while Redis control semaphore, and ttl! But there's more to it: **maxSavingDelay** is part of the **AlternativePersistence** interface, and it determines how much time **remembered-redis** will wait to save the new data and to release the semaphore.
But why wait? Because more data can be gathered from another calls and all that data can be saved in the same S3 file.
The data is also saved compressed and it will benefit from a larger content, and the number of objects sent to S3 will be much lesser than the number of results you have. For example, if you have 100 calls in 3 seconds, you'll only send 1 file to S3, avoiding 99 calls! This is important because S3 can charge you very high if your number of api calls is big, and with this strategy you can decrease your cost by almost 50%!

You can also use even a redis AlternativePersistence implementation:

```ts
export class RedisCache implements AlternativePersistence {
  constructor(
    private redis: Redis,
    private bucketName: string,
    public maxSavingDelay: number,
  ) {}

  async save(key: string, content: string | Buffer, ttl: number): Promise<void> {
    await this.redis.setex(key, ttl, content);
  }

  async get(key: string): Promise<string | Buffer | undefined> {
    return this.redis.getBuffer(key);
  }
}
```

This may not seem reasonable, but, as you join many results into one can one when maxSavingDelay > 0, you can favor the compression with this, and save a lot of memory in your instance.

## License

Licensed under [MIT](https://en.wikipedia.org/wiki/MIT_License).
