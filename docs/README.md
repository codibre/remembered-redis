@remembered/redis - v0.7.4

# @remembered/redis - v0.7.4

## Table of contents

### Classes

- [RememberedRedis](classes/RememberedRedis.md)

### Interfaces

- [AlternativePersistence](interfaces/AlternativePersistence.md)
- [RememberedRedisConfig](interfaces/RememberedRedisConfig.md)

### Type aliases

- [Action](README.md#action)
- [LogError](README.md#logerror)
- [TryTo](README.md#tryto)

### Variables

- [DEFAULT\_ACQUIRE\_TIMEOUT](README.md#default_acquire_timeout)
- [DEFAULT\_LOCK\_TIMEOUT](README.md#default_lock_timeout)
- [DEFAULT\_REFRESH\_INTERVAL](README.md#default_refresh_interval)
- [DEFAULT\_RETRY\_INTERVAL](README.md#default_retry_interval)
- [EMPTY](README.md#empty)

## Type aliases

### Action

Ƭ **Action**: () => `PromiseLike`<`void`\>

#### Type declaration

▸ (): `PromiseLike`<`void`\>

##### Returns

`PromiseLike`<`void`\>

___

### LogError

Ƭ **LogError**: (`message`: `string`) => `any`

#### Type declaration

▸ (`message`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

##### Returns

`any`

___

### TryTo

Ƭ **TryTo**: (`action`: [`Action`](README.md#action)) => `PromiseLike`<`void`\>

#### Type declaration

▸ (`action`): `PromiseLike`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`Action`](README.md#action) |

##### Returns

`PromiseLike`<`void`\>

## Variables

### DEFAULT\_ACQUIRE\_TIMEOUT

• **DEFAULT\_ACQUIRE\_TIMEOUT**: ``60000``

___

### DEFAULT\_LOCK\_TIMEOUT

• **DEFAULT\_LOCK\_TIMEOUT**: ``10000``

___

### DEFAULT\_REFRESH\_INTERVAL

• **DEFAULT\_REFRESH\_INTERVAL**: ``8000``

___

### DEFAULT\_RETRY\_INTERVAL

• **DEFAULT\_RETRY\_INTERVAL**: ``100``

___

### EMPTY

• **EMPTY**: typeof [`EMPTY`](README.md#empty)
