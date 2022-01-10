[@remembered/redis - v0.7.9](../README.md) / RememberedRedis

# Class: RememberedRedis

## Hierarchy

- `Remembered`

  ↳ **`RememberedRedis`**

## Table of contents

### Constructors

- [constructor](RememberedRedis.md#constructor)

### Properties

- [alternativePersistence](RememberedRedis.md#alternativepersistence)
- [onCache](RememberedRedis.md#oncache)
- [redisPrefix](RememberedRedis.md#redisprefix)
- [redisTtl](RememberedRedis.md#redisttl)
- [savingObjects](RememberedRedis.md#savingobjects)
- [savingPromise](RememberedRedis.md#savingpromise)
- [semaphoreConfig](RememberedRedis.md#semaphoreconfig)
- [tryTo](RememberedRedis.md#tryto)
- [waitSaving](RememberedRedis.md#waitsaving)

### Methods

- [clearCache](RememberedRedis.md#clearcache)
- [get](RememberedRedis.md#get)
- [getFromCache](RememberedRedis.md#getfromcache)
- [getRedisKey](RememberedRedis.md#getrediskey)
- [getResult](RememberedRedis.md#getresult)
- [getSemaphore](RememberedRedis.md#getsemaphore)
- [persist](RememberedRedis.md#persist)
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

### alternativePersistence

• `Private` `Optional` **alternativePersistence**: [`AlternativePersistence`](../interfaces/AlternativePersistence.md)

___

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

### savingObjects

• `Private` **savingObjects**: `Record`<`string`, `unknown`\> = `{}`

___

### savingPromise

• `Private` `Optional` **savingPromise**: `Promise`<`unknown`\>

___

### semaphoreConfig

• `Private` **semaphoreConfig**: `LockOptions`

___

### tryTo

• `Private` **tryTo**: [`TryTo`](../README.md#tryto)

___

### waitSaving

• `Private` **waitSaving**: `boolean` = `false`

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

### getFromCache

▸ **getFromCache**<`T`\>(`key`): `Promise`<typeof [`EMPTY`](../README.md#empty) \| `T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`Promise`<typeof [`EMPTY`](../README.md#empty) \| `T`\>

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

### persist

▸ `Private` **persist**<`T`\>(`savingObjects`, `saving`): `Promise`<`unknown`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `savingObjects` | `T` |
| `saving` | (`payload`: `string` \| `Buffer`) => `Promise`<`unknown`\> |

#### Returns

`Promise`<`unknown`\>

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
