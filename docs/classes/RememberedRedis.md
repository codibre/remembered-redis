[@remembered/redis - v0.6.0](../README.md) / RememberedRedis

# Class: RememberedRedis

## Hierarchy

- `Remembered`

  ↳ **`RememberedRedis`**

## Table of contents

### Constructors

- [constructor](RememberedRedis.md#constructor)

### Properties

- [onCache](RememberedRedis.md#oncache)
- [redisPrefix](RememberedRedis.md#redisprefix)
- [redisTtl](RememberedRedis.md#redisttl)
- [semaphoreConfig](RememberedRedis.md#semaphoreconfig)
- [tryTo](RememberedRedis.md#tryto)

### Methods

- [clearCache](RememberedRedis.md#clearcache)
- [get](RememberedRedis.md#get)
- [getFromRedis](RememberedRedis.md#getfromredis)
- [getRedisKey](RememberedRedis.md#getrediskey)
- [getResult](RememberedRedis.md#getresult)
- [getSemaphore](RememberedRedis.md#getsemaphore)
- [tryCache](RememberedRedis.md#trycache)
- [updateCache](RememberedRedis.md#updatecache)
- [wrap](RememberedRedis.md#wrap)

## Constructors

### constructor

• **new RememberedRedis**(`config`, `redis`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`RememberedRedisConfig`](../interfaces/RememberedRedisConfig.md) |
| `redis` | `Redis` |

#### Overrides

Remembered.constructor

## Properties

### onCache

• `Private` `Optional` **onCache**: (`key`: `string`) => `void`

#### Type declaration

▸ (`key`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

##### Returns

`void`

___

### redisPrefix

• `Private` **redisPrefix**: `string`

___

### redisTtl

• `Private` `Optional` **redisTtl**: <T\>(`r`: `T`) => `number`

#### Type declaration

▸ <`T`\>(`r`): `number`

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `r` | `T` |

##### Returns

`number`

___

### semaphoreConfig

• `Private` **semaphoreConfig**: `LockOptions`

___

### tryTo

• `Private` **tryTo**: [`TryTo`](../README.md#tryto)

## Methods

### clearCache

▸ **clearCache**(`key`): `Promise`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<`number`\>

___

### get

▸ **get**<`T`\>(`key`, `callback`, `noCacheIf?`, `ttl?`): `PromiseLike`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `callback` | () => `PromiseLike`<`T`\> |
| `noCacheIf?` | (`t`: `T`) => `boolean` |
| `ttl?` | `number` |

#### Returns

`PromiseLike`<`T`\>

#### Overrides

Remembered.get

___

### getFromRedis

▸ `Private` **getFromRedis**<`T`\>(`key`): `Promise`<typeof `EMPTY` \| `T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<typeof `EMPTY` \| `T`\>

___

### getRedisKey

▸ `Private` **getRedisKey**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

___

### getResult

▸ `Private` **getResult**<`T`\>(`key`, `callback`, `noCacheIf?`, `ttl?`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `callback` | () => `PromiseLike`<`T`\> |
| `noCacheIf?` | (`t`: `T`) => `boolean` |
| `ttl?` | `number` |

#### Returns

`Promise`<`T`\>

___

### getSemaphore

▸ `Private` **getSemaphore**(`key`): `default`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`default`

___

### tryCache

▸ `Private` **tryCache**<`T`\>(`key`, `callback`): `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `callback` | () => `PromiseLike`<`T`\> |

#### Returns

`Promise`<`T`\>

___

### updateCache

▸ **updateCache**<`T`\>(`key`, `result`, `ttl?`): `Promise`<`void`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `result` | `T` |
| `ttl` | `undefined` \| `number` |

#### Returns

`Promise`<`void`\>

___

### wrap

▸ **wrap**<`T`, `K`, `R`\>(`callback`, `getKey`, `noCacheIf?`): (...`args`: `T`) => `R`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any`[] |
| `K` | extends `any`[] |
| `R` | extends `PromiseLike`<`any`, `R`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (...`args`: `T`) => `R` |
| `getKey` | (...`args`: `K`) => `string` |
| `noCacheIf?` | (`result`: `R` extends `PromiseLike`<`TR`\> ? `TR` : `never`) => `boolean` |

#### Returns

`fn`

▸ (...`args`): `R`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `T` |

##### Returns

`R`

#### Inherited from

Remembered.wrap
