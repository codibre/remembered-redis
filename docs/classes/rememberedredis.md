[fluent-iterable - v0.1.0](../README.md) / RememberedRedis

# Class: RememberedRedis

## Hierarchy

* *Remembered*

  ↳ **RememberedRedis**

## Table of contents

### Constructors

- [constructor](rememberedredis.md#constructor)

### Properties

- [redisPrefix](rememberedredis.md#redisprefix)
- [redisTtl](rememberedredis.md#redisttl)
- [semaphoreConfig](rememberedredis.md#semaphoreconfig)
- [tryTo](rememberedredis.md#tryto)

### Methods

- [get](rememberedredis.md#get)
- [getFromRedis](rememberedredis.md#getfromredis)
- [getRedisKey](rememberedredis.md#getrediskey)
- [getResult](rememberedredis.md#getresult)
- [getSemaphore](rememberedredis.md#getsemaphore)
- [saveToRedis](rememberedredis.md#savetoredis)
- [tryCache](rememberedredis.md#trycache)
- [wrap](rememberedredis.md#wrap)

## Constructors

### constructor

\+ **new RememberedRedis**(`config`: [*RememberedRedisConfig*](../interfaces/rememberedredisconfig.md), `redis`: *Redis*): [*RememberedRedis*](rememberedredis.md)

#### Parameters:

Name | Type |
:------ | :------ |
`config` | [*RememberedRedisConfig*](../interfaces/rememberedredisconfig.md) |
`redis` | *Redis* |

**Returns:** [*RememberedRedis*](rememberedredis.md)

Overrides: void

## Properties

### redisPrefix

• `Private` **redisPrefix**: *string*

___

### redisTtl

• `Private` **redisTtl**: *undefined* \| *number*

___

### semaphoreConfig

• `Private` **semaphoreConfig**: LockOptions

___

### tryTo

• `Private` **tryTo**: [*TryTo*](../README.md#tryto)

## Methods

### get

▸ **get**<T\>(`key`: *string*, `callback`: () => *PromiseLike*<T\>): *PromiseLike*<T\>

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`key` | *string* |
`callback` | () => *PromiseLike*<T\> |

**Returns:** *PromiseLike*<T\>

Overrides: void

___

### getFromRedis

▸ `Private`**getFromRedis**<T\>(`key`: *string*): *Promise*<*typeof* EMPTY \| T\>

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`key` | *string* |

**Returns:** *Promise*<*typeof* EMPTY \| T\>

___

### getRedisKey

▸ `Private`**getRedisKey**(`key`: *string*): *string*

#### Parameters:

Name | Type |
:------ | :------ |
`key` | *string* |

**Returns:** *string*

___

### getResult

▸ `Private`**getResult**<T\>(`key`: *string*, `callback`: () => *PromiseLike*<T\>): *Promise*<T\>

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`key` | *string* |
`callback` | () => *PromiseLike*<T\> |

**Returns:** *Promise*<T\>

___

### getSemaphore

▸ `Private`**getSemaphore**(`key`: *string*): *default*

#### Parameters:

Name | Type |
:------ | :------ |
`key` | *string* |

**Returns:** *default*

___

### saveToRedis

▸ `Private`**saveToRedis**<T\>(`key`: *string*, `result`: T): *Promise*<void\>

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`key` | *string* |
`result` | T |

**Returns:** *Promise*<void\>

___

### tryCache

▸ `Private`**tryCache**<T\>(`key`: *string*, `callback`: () => *PromiseLike*<T\>): *Promise*<T\>

#### Type parameters:

Name |
:------ |
`T` |

#### Parameters:

Name | Type |
:------ | :------ |
`key` | *string* |
`callback` | () => *PromiseLike*<T\> |

**Returns:** *Promise*<T\>

___

### wrap

▸ **wrap**<T, K, R\>(`callback`: (...`args`: T) => R, `getKey`: (...`args`: K) => *string*): *function*

#### Type parameters:

Name | Type |
:------ | :------ |
`T` | *any*[] |
`K` | *any*[] |
`R` | *PromiseLike*<any, R\> |

#### Parameters:

Name | Type |
:------ | :------ |
`callback` | (...`args`: T) => R |
`getKey` | (...`args`: K) => *string* |

**Returns:** (...`args`: T) => R

Inherited from: void
