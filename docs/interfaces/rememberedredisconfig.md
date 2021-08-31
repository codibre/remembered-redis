[fluent-iterable - v0.4.1](../README.md) / RememberedRedisConfig

# Interface: RememberedRedisConfig

## Hierarchy

- *RememberedConfig*

  ↳ **RememberedRedisConfig**

## Table of contents

### Properties

- [acquireTimeout](rememberedredisconfig.md#acquiretimeout)
- [lockTimeout](rememberedredisconfig.md#locktimeout)
- [logError](rememberedredisconfig.md#logerror)
- [onCache](rememberedredisconfig.md#oncache)
- [onReused](rememberedredisconfig.md#onreused)
- [redisPrefix](rememberedredisconfig.md#redisprefix)
- [redisTtl](rememberedredisconfig.md#redisttl)
- [refreshInterval](rememberedredisconfig.md#refreshinterval)
- [retryInterval](rememberedredisconfig.md#retryinterval)
- [ttl](rememberedredisconfig.md#ttl)

## Properties

### acquireTimeout

• `Optional` **acquireTimeout**: *number*

___

### lockTimeout

• `Optional` **lockTimeout**: *number*

___

### logError

• `Optional` **logError**: [*LogError*](../README.md#logerror)

___

### onCache

• `Optional` **onCache**: (`key`: *string*) => *void*

#### Type declaration

▸ (`key`: *string*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | *string* |

**Returns:** *void*

___

### onReused

• `Optional` **onReused**: (`key`: *string*) => *void*

#### Type declaration

▸ (`key`: *string*): *void*

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | *string* |

**Returns:** *void*

Inherited from: RememberedConfig.onReused

___

### redisPrefix

• `Optional` **redisPrefix**: *string*

___

### redisTtl

• `Optional` **redisTtl**: *number*

___

### refreshInterval

• `Optional` **refreshInterval**: *number*

___

### retryInterval

• `Optional` **retryInterval**: *number*

___

### ttl

• **ttl**: *number*

Overrides: RememberedConfig.ttl
