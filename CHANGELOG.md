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
