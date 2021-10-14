[@remembered/redis - v0.7.6](../README.md) / RememberedRedisConfig

# Interface: RememberedRedisConfig

## Hierarchy

- `RememberedConfig`

  ↳ **`RememberedRedisConfig`**

## Table of contents

### Properties

- [acquireTimeout](RememberedRedisConfig.md#acquiretimeout)
- [alternativePersistence](RememberedRedisConfig.md#alternativepersistence)
- [lockTimeout](RememberedRedisConfig.md#locktimeout)
- [logError](RememberedRedisConfig.md#logerror)
- [redisPrefix](RememberedRedisConfig.md#redisprefix)
- [redisTtl](RememberedRedisConfig.md#redisttl)
- [refreshInterval](RememberedRedisConfig.md#refreshinterval)
- [retryInterval](RememberedRedisConfig.md#retryinterval)
- [ttl](RememberedRedisConfig.md#ttl)

### Methods

- [onCache](RememberedRedisConfig.md#oncache)
- [onReused](RememberedRedisConfig.md#onreused)

## Properties

### acquireTimeout

• `Optional` **acquireTimeout**: `number`

___

### alternativePersistence

• `Optional` **alternativePersistence**: [`AlternativePersistence`](AlternativePersistence.md)

When informed, redis is used only for ttl control, but the real data is persisted using these methods

___

### lockTimeout

• `Optional` **lockTimeout**: `number`

___

### logError

• `Optional` **logError**: [`LogError`](../README.md#logerror)

___

### redisPrefix

• `Optional` **redisPrefix**: `string`

___

### redisTtl

• `Optional` **redisTtl**: `Ttl`

___

### refreshInterval

• `Optional` **refreshInterval**: `number`

___

### retryInterval

• `Optional` **retryInterval**: `number`

___

### ttl

• **ttl**: `Ttl`

#### Inherited from

RememberedConfig.ttl

## Methods

### onCache

▸ `Optional` **onCache**(`key`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`void`

___

### onReused

▸ `Optional` **onReused**(`key`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`void`

#### Inherited from

RememberedConfig.onReused
