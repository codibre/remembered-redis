# [1.9.0](https://github.com/codibre/remembered-redis/compare/v1.8.4...v1.9.0) (2023-09-18)


### Features

* implementing external semaphore support ([#32](https://github.com/codibre/remembered-redis/issues/32)) ([3774131](https://github.com/codibre/remembered-redis/commit/37741319c785909bb9c0db4480148ef9fdf1cf9b))

## [1.8.4](https://github.com/codibre/remembered-redis/compare/v1.8.3...v1.8.4) (2023-06-17)


### Bug Fixes

* bettering lint and avoiding floating promises ([#31](https://github.com/codibre/remembered-redis/issues/31)) ([cd0577c](https://github.com/codibre/remembered-redis/commit/cd0577c3414b1243587a90c7fc32ea1cfa027551))

## [1.8.3](https://github.com/codibre/remembered-redis/compare/v1.8.2...v1.8.3) (2023-06-17)


### Bug Fixes

* creating promise for every delayed saving to await ([#30](https://github.com/codibre/remembered-redis/issues/30)) ([9115034](https://github.com/codibre/remembered-redis/commit/91150347fcbe42bdb035320dbb901a568ac44019))

## [1.8.2](https://github.com/codibre/remembered-redis/compare/v1.8.1...v1.8.2) (2023-06-17)


### Bug Fixes

* indicating to alternative persistence whether it is trying to get before first semaphore ([#29](https://github.com/codibre/remembered-redis/issues/29)) ([f5c7c17](https://github.com/codibre/remembered-redis/commit/f5c7c179d95d639b84c74dc2e4640d4bca09a9ec))

## [1.8.1](https://github.com/codibre/remembered-redis/compare/v1.8.0...v1.8.1) (2023-06-17)


### Bug Fixes

* removing double lock ([#28](https://github.com/codibre/remembered-redis/issues/28)) ([6a8c737](https://github.com/codibre/remembered-redis/commit/6a8c737e0d55e86ee9523e73007c9e288ca66464))

# [1.8.0](https://github.com/codibre/remembered-redis/compare/v1.7.2...v1.8.0) (2023-06-17)


### Features

* creating double lock option for lesser fails ([#27](https://github.com/codibre/remembered-redis/issues/27)) ([3c10ab2](https://github.com/codibre/remembered-redis/commit/3c10ab2602b645f39afbbf51f56205f220c64785))

## [1.7.2](https://github.com/codibre/remembered-redis/compare/v1.7.1...v1.7.2) (2023-06-17)


### Bug Fixes

* fixing Mutext instantiation ([#25](https://github.com/codibre/remembered-redis/issues/25)) ([d1a9bf0](https://github.com/codibre/remembered-redis/commit/d1a9bf0d13410084f6b6b53bd52988ae43048a86))
* fixing tests ([#26](https://github.com/codibre/remembered-redis/issues/26)) ([5ef11f4](https://github.com/codibre/remembered-redis/commit/5ef11f4c2d3fd664c91c65b4a1118daf0131cdc2))

## [1.7.1](https://github.com/codibre/remembered-redis/compare/v1.7.0...v1.7.1) (2023-06-17)


### Bug Fixes

* fixing dependencies to avoid wrong dependency tree ([#24](https://github.com/codibre/remembered-redis/issues/24)) ([1e0c7fe](https://github.com/codibre/remembered-redis/commit/1e0c7fedc11b0c55bd50c082cf48fbe083df6dbb))

# [1.7.0](https://github.com/codibre/remembered-redis/compare/v1.6.0...v1.7.0) (2023-06-17)


### Features

* using Mutex from redis-semaphore ([#23](https://github.com/codibre/remembered-redis/issues/23)) ([ec674f5](https://github.com/codibre/remembered-redis/commit/ec674f586f644d387f8e709ff6bc169a492f9438))

# [1.6.0](https://github.com/codibre/remembered-redis/compare/v1.5.0...v1.6.0) (2023-06-16)


### Features

* using RedlockSemaphore from redis-semaphore ([#22](https://github.com/codibre/remembered-redis/issues/22)) ([3623ca0](https://github.com/codibre/remembered-redis/commit/3623ca01cbb23949da96bc929a48a8948d6bff73))

# [1.5.0](https://github.com/codibre/remembered-redis/compare/v1.4.0...v1.5.0) (2023-06-16)


### Features

* implementing redlock support ([#21](https://github.com/codibre/remembered-redis/issues/21)) ([b8a3d2d](https://github.com/codibre/remembered-redis/commit/b8a3d2d2b7b590a6f1ca0f9955d55f2567398a59))

# [1.4.0](https://github.com/codibre/remembered-redis/compare/v1.3.0...v1.4.0) (2023-06-16)


### Features

* adding onLockError ([90278d4](https://github.com/codibre/remembered-redis/commit/90278d47e95dc58e44982fb50edd75c092497bfd))

# [1.3.0](https://github.com/codibre/remembered-redis/compare/v1.2.0...v1.3.0) (2022-12-19)


### Features

* adding noSemaphore to getFromCache ([#20](https://github.com/codibre/remembered-redis/issues/20)) ([13789cd](https://github.com/codibre/remembered-redis/commit/13789cd4c776c17c0501b0ab5aac4844b86c714f))

# [1.2.0](https://github.com/codibre/remembered-redis/compare/v1.1.8...v1.2.0) (2022-11-29)


### Features

* adding runAndCache option ([29b4532](https://github.com/codibre/remembered-redis/commit/29b4532e620e81c0544beb4fc3a95f9848f42448))

## [1.1.8](https://github.com/codibre/remembered-redis/compare/v1.1.7...v1.1.8) (2022-11-14)


### Bug Fixes

* fixing undefined key from alternative persistence ([eafd61c](https://github.com/codibre/remembered-redis/commit/eafd61c758f516787b40a01fead0646b5f4844d0))

## [1.1.7](https://github.com/codibre/remembered-redis/compare/v1.1.6...v1.1.7) (2022-09-15)


### Bug Fixes

* sepating saving objects by ttl ([#18](https://github.com/codibre/remembered-redis/issues/18)) ([008f17b](https://github.com/codibre/remembered-redis/commit/008f17bd9ce0ae41dca53ed614405f9d171c6ab0))

## [1.1.6](https://github.com/codibre/remembered-redis/compare/v1.1.5...v1.1.6) (2022-09-14)


### Bug Fixes

* fixing maximum ttl calculation ([a651adf](https://github.com/codibre/remembered-redis/commit/a651adf3666075e56e336dd05c5d3d9480a9f46a))

## [1.1.5](https://github.com/codibre/remembered-redis/compare/v1.1.4...v1.1.5) (2022-09-14)


### Bug Fixes

* accepting opossum 4.2.4 or over as optional peer dependency ([a331d4a](https://github.com/codibre/remembered-redis/commit/a331d4a7d289779d28900ccb70c59f6d2f7141d3))

## [1.1.4](https://github.com/codibre/remembered-redis/compare/v1.1.3...v1.1.4) (2022-09-14)


### Bug Fixes

* fixing accumulated value to use max ttl from its entries ([50a3025](https://github.com/codibre/remembered-redis/commit/50a3025213db1951cbce08f0bbe15bc3f846bf58))

## [1.1.3](https://github.com/codibre/remembered-redis/compare/v1.1.2...v1.1.3) (2022-09-13)


### Bug Fixes

* compatibilizing remembered redis with nonBlocking option ([30ed802](https://github.com/codibre/remembered-redis/commit/30ed80295f98a73577dc68efac7535a065fc9e5c))

## [1.1.2](https://github.com/codibre/remembered-redis/compare/v1.1.1...v1.1.2) (2022-05-03)


### Bug Fixes

* fixing object saving after Map changing ([#16](https://github.com/codibre/remembered-redis/issues/16)) ([6c2be3e](https://github.com/codibre/remembered-redis/commit/6c2be3e1e7702c46ac532751f6db9d3036b1ba81))

## [1.1.1](https://github.com/codibre/remembered-redis/compare/v1.1.0...v1.1.1) (2022-05-02)


### Bug Fixes

* fixing wrong if ([#15](https://github.com/codibre/remembered-redis/issues/15)) ([dbefe1b](https://github.com/codibre/remembered-redis/commit/dbefe1b1bde9267e070ce6f9832ce7835fb15aa0))

# [1.1.0](https://github.com/codibre/remembered-redis/compare/v1.0.1...v1.1.0) (2022-05-02)


### Features

* adding maxResultsPerSave ([#14](https://github.com/codibre/remembered-redis/issues/14)) ([12220a3](https://github.com/codibre/remembered-redis/commit/12220a309eb671a5ddef64ecacf54e919d8a2923))

## [1.0.1](https://github.com/codibre/remembered-redis/compare/v1.0.0...v1.0.1) (2022-04-29)


### Bug Fixes

* validating semaphore on getFromCache call ([#13](https://github.com/codibre/remembered-redis/issues/13)) ([50aff76](https://github.com/codibre/remembered-redis/commit/50aff768f1e90ddf894e7e97791eb4ae38be9716))

# [1.0.0](https://github.com/codibre/remembered-redis/compare/v0.11.0...v1.0.0) (2022-04-26)


* Avoiding useless throw (#12) ([35d633f](https://github.com/codibre/remembered-redis/commit/35d633f80e3b774a9e4abe55e1d0059070d32c78)), closes [#12](https://github.com/codibre/remembered-redis/issues/12)


### BREAKING CHANGES

* Let's bump this lib to v1 already

# [0.11.0](https://github.com/codibre/remembered-redis/compare/v0.10.0...v0.11.0) (2022-04-25)


### Features

* implementing redis resilience in case of redis unavailability ([#11](https://github.com/codibre/remembered-redis/issues/11)) ([5e86aff](https://github.com/codibre/remembered-redis/commit/5e86aff4142fad92f627aa0c9d745e9afcbe6127))

# [0.10.0](https://github.com/codibre/remembered-redis/compare/v0.9.5...v0.10.0) (2022-03-25)


### Features

* creating parameter to disable compression ([#10](https://github.com/codibre/remembered-redis/issues/10)) ([3ff05dc](https://github.com/codibre/remembered-redis/commit/3ff05dcb783b20d0ac1efc70aebe56fcfa1241c8))

## [0.9.5](https://github.com/codibre/remembered-redis/compare/v0.9.4...v0.9.5) (2022-02-21)


### Bug Fixes

* fixing semantic-release automation ([7300ec3](https://github.com/codibre/remembered-redis/commit/7300ec39622890e8bbacbb8e3c96e7f51358a57b))
* fixing semantic-release automation again ([eaee247](https://github.com/codibre/remembered-redis/commit/eaee247bf85ae65dd929e7a11c639dba4c4dad9e))

## 0.8.4
* 965f63b fix: ignoring onLockLost error
## v0.8.3
* 44467d3 0.8.3
* 3754617 fixing key value
## v0.8.2
* 24b82ef 0.8.2
* 0740a1d fix: passing also ke on error event
## v0.8.1
* 20f5d28 0.8.1
* 5d9a227 Merge pull request #5 from Codibre/try-catch
* cec16a1 fix: include try-catch on updateCache function
## v0.8.0
* eb01e33 0.8.0
* 4491dfc Merge pull request #4 from Codibre/fix/DeepCloneResult
* 415f685 chore: version dump
* d9f7164 fix: Save into cache a copy of result payload instead of the object with your original reference
* d12f08d 0.7.12
* 2d03d9f Merge branch 'master' of github.com:Codibre/remembered-redis
* c9ab75f docs: updating readme
* 2853ab7 Merge pull request #3 from Codibre/fix/alternative-persistence-keys
* ad1756e 0.7.11
* cb77922 fix: saving all keys during alternative persistence
* 704355b 0.7.10
* 0330115 fix: ignoring too large keys for alternative persistence
## v0.7.9
* 8aaa678 0.7.9
* c505d29 fix: bettering alternative persistence switching resilience
## v0.7.8
* bc1c205 0.7.8
* ae82453 docs: updating readme
## v0.7.7
* bee9c21 0.7.7
* 1ea8a1d docs: updating readme
## v0.7.6
* 415b2a4 0.7.6
* b90170e docs: updating readme
## v0.7.5
* 6f09789 0.7.5
* 7ad3eb5 docs: updating readme
## v0.7.4
* b31c9ec 0.7.4
* 7f13fd2 docs: updating readme
* c3690b5 Merge pull request #2 from Codibre/alternative-persistence
## v0.7.3
* 9b9d0d8 0.7.3
* b1a9e5e fix: fixing get from cache and exposing EMPTY
## v0.7.2
## v0.7.12
* d12f08d 0.7.12
* 2d03d9f Merge branch 'master' of github.com:Codibre/remembered-redis
* c9ab75f docs: updating readme
* 2853ab7 Merge pull request #3 from Codibre/fix/alternative-persistence-keys
* ad1756e 0.7.11
## v0.7.11
* 9785731 0.7.11
* cb77922 fix: saving all keys during alternative persistence
## v0.7.10
* 704355b 0.7.10
* 0330115 fix: ignoring too large keys for alternative persistence
* 8aaa678 0.7.9
* c505d29 fix: bettering alternative persistence switching resilience
* bc1c205 0.7.8
* ae82453 docs: updating readme
* bee9c21 0.7.7
* 1ea8a1d docs: updating readme
* 415b2a4 0.7.6
* b90170e docs: updating readme
* 6f09789 0.7.5
* 7ad3eb5 docs: updating readme
* b31c9ec 0.7.4
* 7f13fd2 docs: updating readme
* c3690b5 Merge pull request #2 from Codibre/alternative-persistence
* 9b9d0d8 0.7.3
* b1a9e5e fix: fixing get from cache and exposing EMPTY
* 0ee48a4 0.7.2
* 702f4a7 fix: treating case where alternativePersistence doesn't found the key
## v0.7.1
* d72f264 0.7.1
* d222358 feat: exposing getFromCache
* 83bded3 fix: getting the right key from s3 when getting
* c5aa4d2 feat: implementing saving delay
* 8d03c05 fix: returning EMPTY when alternative persistence get is falsy]
* 8b91c7c fix: paralellizing redis and alternative persistence promises
## v0.7.0
* d23206b 0.7.0
* 502d2c8 feat: implementing alternative persistence option
## v0.6.0
* 6efa001 0.6.0
* 43a2e9f feat: adding clearCache method
## v0.5.3
* f6cd2a9 0.5.3
* 248971b fix: fixing updateCache when ttl is 0
* 6a1c570 fix: fixing updateCache when ttl is 0
## v0.5.2
* 485ea70 0.5.2
* c3a9841 fix: fixing updateCache when ttl is 0
## v0.5.1
* 7beef73 0.5.1
* 636e8cf feat: making ttl informable
## v0.5.0
* 1db4467 0.5.0
* b671028 feat: implementing redisTtl function mode
## v0.4.1
* 03ba326 0.4.1
* 13e39d4 updating packages and fixing vulnerabilities
## v0.4.0
* b055528 0.4.0
* 36a0839 adding gzipping to cache
## v0.3.1
* 02c21c1 0.3.1
* d9cd4e0 fixing remembered dependency
## v0.3.0
* 63ab945 0.3.0
* 97ba2af adding onCache
* 128dbbc adding prepublish only
* 6742736 removing unneeded files
* 6719fec fixing redis
* 589c196 preparing noCacheIf param
* eb9f14d fixing tests
* 8c649de fixing github url
* fd6b195 fixing packagelock
* 05853dc fixing dependencies
## v0.1.0
* 9748875 0.1.0
* 206ac01 filling readme
* 8014684 fixing test
* 54df7e5 creating unit tests
* d505d05 fixing duplicated code
* ba84bec refactoring code
* 0dc34e9 fixing pipelines and readme
* e362988 fixing readme
* 48aceb9 first version
* 6d3da55 Initial commit
