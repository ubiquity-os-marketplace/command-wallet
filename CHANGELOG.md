# Changelog

## [1.6.0](https://github.com/ubiquity-os-marketplace/command-wallet/compare/v1.5.0...v1.6.0) (2026-02-21)


### Features

* added deno deploy ([fa404c4](https://github.com/ubiquity-os-marketplace/command-wallet/commit/fa404c4deb5e7cd95d802bcdac98cbb2ccb80bdc))
* deno ([ca6d770](https://github.com/ubiquity-os-marketplace/command-wallet/commit/ca6d770e62f537ab797bb9743003eeaa03739703))
* enhance wallet registration logic to prevent duplicate associations ([5985eb2](https://github.com/ubiquity-os-marketplace/command-wallet/commit/5985eb2d5d5f2b689b99dcc7831eb212bb7d710e))


### Bug Fixes

* accept kernel attestation inputs ([2a28fd1](https://github.com/ubiquity-os-marketplace/command-wallet/commit/2a28fd1ec1d3a65b0ffda8bfddc781c2cc553718))
* align command-wallet deps ([9729744](https://github.com/ubiquity-os-marketplace/command-wallet/commit/9729744ee168d0d2d59d50b7ee04fa7f9404e646))
* align manifest workflow and command schema metadata ([ec44ad0](https://github.com/ubiquity-os-marketplace/command-wallet/commit/ec44ad07ecb4fca692a035031ff9e400ed8da9b3))
* bot events are no longer ignored ([7fff4f1](https://github.com/ubiquity-os-marketplace/command-wallet/commit/7fff4f1cc86aba4703d809dbbbb805dfbcd40d44))
* improve wallet registration logic and update test setup for wallet commands ([264dff4](https://github.com/ubiquity-os-marketplace/command-wallet/commit/264dff4fad8eaf1825478d7e156d18e7070efd06))
* release please issue permission ([16db684](https://github.com/ubiquity-os-marketplace/command-wallet/commit/16db684e5e36d58e3cd49de804ad84c336e64808))
* release please issue permission ([6244ec5](https://github.com/ubiquity-os-marketplace/command-wallet/commit/6244ec537124fd8a39069030af25c8916eba2542))
* remove unused ubiquity listeners ([a58357f](https://github.com/ubiquity-os-marketplace/command-wallet/commit/a58357f72ec3720c609e4d304daa889becf82062))
* sync manifest workflow metadata for issue 27 ([6afc0bd](https://github.com/ubiquity-os-marketplace/command-wallet/commit/6afc0bde9a4e5413dc185af4763d022b87064401))
* sync workflow skipBotEvents and parameter metadata ([674c108](https://github.com/ubiquity-os-marketplace/command-wallet/commit/674c10861bddca37d38690d63c1e49190f11ae20))
* update logging for wallet registration to use warnings for existing addresses and add test cases ([7c5fc80](https://github.com/ubiquity-os-marketplace/command-wallet/commit/7c5fc809fd798f2ed5f805f403ee7ac4feea98db))

## [1.5.0](https://github.com/ubiquity-os-marketplace/command-wallet/compare/v1.4.0...v1.5.0) (2025-02-16)


### Features

* added rpc-handler to select the fastest rpc ([9c159f1](https://github.com/ubiquity-os-marketplace/command-wallet/commit/9c159f1a87c0f9edcc7927fff99655e1f08ff83a))
* added test for wallet link ([e059e13](https://github.com/ubiquity-os-marketplace/command-wallet/commit/e059e1329da781194a4f7a928be17015d2b28962))
* command interface ([bc98157](https://github.com/ubiquity-os-marketplace/command-wallet/commit/bc9815745afcfaa98fe55a250a4cdb74baa8c91e))
* parsing arguments and executing run ([70fb75e](https://github.com/ubiquity-os-marketplace/command-wallet/commit/70fb75e6e970d6439f5d9ba64ee51caa5edaf269))
* schema validator ([cd8404c](https://github.com/ubiquity-os-marketplace/command-wallet/commit/cd8404cb8396dec1f7571b65e83291a5798b6c9a))
* specify EVM address support in registerWallet error message ([c8d3036](https://github.com/ubiquity-os-marketplace/command-wallet/commit/c8d30367cbf02d9e3801ab118240b22dc2581cc0))
* switch to Bun and fix deploy ([ee80ad8](https://github.com/ubiquity-os-marketplace/command-wallet/commit/ee80ad8aaeff345cc77531b14a508cf2f8fdb92b))
* upgrade typebox ([5c27795](https://github.com/ubiquity-os-marketplace/command-wallet/commit/5c2779516f780cce7072d04b66ce25ae41b6c3f1))
* use new SDK version ([e1ab279](https://github.com/ubiquity-os-marketplace/command-wallet/commit/e1ab279115f7a7d415c10b11a7fea3ae8c963322))
* used ubiquity-os-logger for logging ([da8f8b3](https://github.com/ubiquity-os-marketplace/command-wallet/commit/da8f8b3cc58cbfac9d6d1d82c4cb76532a98594e))
* user can unset their wallet or link multiple accounts to the same wallet ([6fa4bb1](https://github.com/ubiquity-os-marketplace/command-wallet/commit/6fa4bb1d976df56d0aec36e766d5198853884c09))
* worker deploy and delete ([2ea04b3](https://github.com/ubiquity-os-marketplace/command-wallet/commit/2ea04b3475e8177569cc1b3392f4c656970452cb))


### Bug Fixes

* add environment ([6781aa4](https://github.com/ubiquity-os-marketplace/command-wallet/commit/6781aa4706719b0512a87f50d4c72da92d35729c))
* added @ethersproject/providers ([9619a97](https://github.com/ubiquity-os-marketplace/command-wallet/commit/9619a97c40f70a5dcb14f709a75d15e151a0c018))
* bumped rpc-handler package version ([403a293](https://github.com/ubiquity-os-marketplace/command-wallet/commit/403a293293c8a5c32ce1d4dd854f03cae09d5097))
* changed post comment function to use the SDK ([db9573a](https://github.com/ubiquity-os-marketplace/command-wallet/commit/db9573aea7ad4741e0ca161b989082e374b591e0))
* **config:** add descriptions to JSON schema properties ([fd05248](https://github.com/ubiquity-os-marketplace/command-wallet/commit/fd0524883aa9b5971015fed6e333bf5ab1e29db9))
* cross-env ([d1ff206](https://github.com/ubiquity-os-marketplace/command-wallet/commit/d1ff2061de0aab02b7db10dd645ec5bd68f77cc6))
* cspell ([bd07b52](https://github.com/ubiquity-os-marketplace/command-wallet/commit/bd07b5279b4280cd86f7787a0e8f932d86809c39))
* fixed crash when user does not exist ([433a6a7](https://github.com/ubiquity-os-marketplace/command-wallet/commit/433a6a7c3f19b2722df75e7b826bc6b8e0244a1e))
* fixed failing unittest ([f576c05](https://github.com/ubiquity-os-marketplace/command-wallet/commit/f576c0561892780027d498541d98d095798e9345))
* fixed knip and wallet test ([01c4aae](https://github.com/ubiquity-os-marketplace/command-wallet/commit/01c4aae876305b042244e6a08d62f9cb6d572488))
* fixed unittest ([ad58dcb](https://github.com/ubiquity-os-marketplace/command-wallet/commit/ad58dcbe03814ac9dc7f40b67c9dd97d4770ae28))
* formatting ([c776d22](https://github.com/ubiquity-os-marketplace/command-wallet/commit/c776d221c557f16839861d675b905c38b5e2d14b))
* formatting ([f3b2063](https://github.com/ubiquity-os-marketplace/command-wallet/commit/f3b2063885c94836fc349925c9509cba06556d04))
* improved error messages ([9c36cf6](https://github.com/ubiquity-os-marketplace/command-wallet/commit/9c36cf6ee68abce95b58effaae72fff4c2bfd509))
* inline logging message ([b82b4d3](https://github.com/ubiquity-os-marketplace/command-wallet/commit/b82b4d36ed0083e51b064872f6be6683d0625a6f))
* ipdate wrangler.toml ([80aab08](https://github.com/ubiquity-os-marketplace/command-wallet/commit/80aab085bd10e59f32d22c4ae3221a997c466f98))
* knip ([8774be4](https://github.com/ubiquity-os-marketplace/command-wallet/commit/8774be430b2d86c5e7c03c66d59e8156c26e3151))
* manifest and tests ([07d1aa8](https://github.com/ubiquity-os-marketplace/command-wallet/commit/07d1aa8ed8790875bd1efdf000038aa05c179898))
* process review comments ([80443f0](https://github.com/ubiquity-os-marketplace/command-wallet/commit/80443f049c5106b2c3c25c155f3e70d1cd700ea4))
* removed comma in the package.json ([de783d3](https://github.com/ubiquity-os-marketplace/command-wallet/commit/de783d3a51193baecae332291e79dd19b6ecb5cc))
* removed location from wallet DB references ([4d47db8](https://github.com/ubiquity-os-marketplace/command-wallet/commit/4d47db850a6ee3bd00dbc7397247c271cfe6e10c))
* revert changes in test ([13253ac](https://github.com/ubiquity-os-marketplace/command-wallet/commit/13253ac45ade2b87681180b7084b44cabdad64e3))
* setup bun ([c1985ed](https://github.com/ubiquity-os-marketplace/command-wallet/commit/c1985edba2b3317fe22f1ccf0302d544bc4dfb69))
* tests, formatting, delete bun.lockb ([70bad85](https://github.com/ubiquity-os-marketplace/command-wallet/commit/70bad856b932a26a8b492c670da3ff2116c1759f))
* update package.json ([f2dc71a](https://github.com/ubiquity-os-marketplace/command-wallet/commit/f2dc71af5ff661212c2184f215372dd9d6d4e7f1))
* update wrangler.toml compatibility and observability ([f0073f2](https://github.com/ubiquity-os-marketplace/command-wallet/commit/f0073f260de6614b5bbca54fb630fb53c2ba70a1))
* updated port for http request.http and use bun ([0e9f9a2](https://github.com/ubiquity-os-marketplace/command-wallet/commit/0e9f9a2a77097b1b215168e9826904ab0718f54e))
* updated SDK and logger ([4d0825e](https://github.com/ubiquity-os-marketplace/command-wallet/commit/4d0825e1a5a2d44f5c74617f4229e7b67015c08d))
* updated workflows to update the manifest ([44e4f4d](https://github.com/ubiquity-os-marketplace/command-wallet/commit/44e4f4dec625587d53f0df06bdf1c427404a3706))
* users can only register to a unique wallet ([dd47e9c](https://github.com/ubiquity-os-marketplace/command-wallet/commit/dd47e9cbba77d4be0dbded89d34d74c59a61beae))
* wallet not being set (user is not created) ([b67dd22](https://github.com/ubiquity-os-marketplace/command-wallet/commit/b67dd2204f89f06884965dec0cbee5b24ee8380b))

## [1.3.0](https://github.com/ubiquity-os-marketplace/command-wallet/compare/v1.2.0...v1.3.0) (2025-01-27)

### Features

- specify EVM address support in registerWallet error message ([c8d3036](https://github.com/ubiquity-os-marketplace/command-wallet/commit/c8d30367cbf02d9e3801ab118240b22dc2581cc0))

### Bug Fixes

- changed post comment function to use the SDK ([db9573a](https://github.com/ubiquity-os-marketplace/command-wallet/commit/db9573aea7ad4741e0ca161b989082e374b591e0))
- updated SDK and logger ([4d0825e](https://github.com/ubiquity-os-marketplace/command-wallet/commit/4d0825e1a5a2d44f5c74617f4229e7b67015c08d))
- updated workflows to update the manifest ([44e4f4d](https://github.com/ubiquity-os-marketplace/command-wallet/commit/44e4f4dec625587d53f0df06bdf1c427404a3706))

## [1.2.0](https://github.com/ubiquity-os-marketplace/command-wallet/compare/v1.1.0...v1.2.0) (2024-12-18)

### Features

- user can unset their wallet or link multiple accounts to the same wallet ([6fa4bb1](https://github.com/ubiquity-os-marketplace/command-wallet/commit/6fa4bb1d976df56d0aec36e766d5198853884c09))

### Bug Fixes

- improved error messages ([9c36cf6](https://github.com/ubiquity-os-marketplace/command-wallet/commit/9c36cf6ee68abce95b58effaae72fff4c2bfd509))
- removed location from wallet DB references ([4d47db8](https://github.com/ubiquity-os-marketplace/command-wallet/commit/4d47db850a6ee3bd00dbc7397247c271cfe6e10c))
- updated port for http request.http and use bun ([0e9f9a2](https://github.com/ubiquity-os-marketplace/command-wallet/commit/0e9f9a2a77097b1b215168e9826904ab0718f54e))
- users can only register to a unique wallet ([dd47e9c](https://github.com/ubiquity-os-marketplace/command-wallet/commit/dd47e9cbba77d4be0dbded89d34d74c59a61beae))

## [1.1.0](https://github.com/ubiquity-os-marketplace/command-wallet/compare/v1.0.0...v1.1.0) (2024-12-01)

### Features

- added rpc-handler to select the fastest rpc ([9c159f1](https://github.com/ubiquity-os-marketplace/command-wallet/commit/9c159f1a87c0f9edcc7927fff99655e1f08ff83a))
- command interface ([bc98157](https://github.com/ubiquity-os-marketplace/command-wallet/commit/bc9815745afcfaa98fe55a250a4cdb74baa8c91e))
- schema validator ([cd8404c](https://github.com/ubiquity-os-marketplace/command-wallet/commit/cd8404cb8396dec1f7571b65e83291a5798b6c9a))
- switch to Bun and fix deploy ([ee80ad8](https://github.com/ubiquity-os-marketplace/command-wallet/commit/ee80ad8aaeff345cc77531b14a508cf2f8fdb92b))
- upgrade typebox ([5c27795](https://github.com/ubiquity-os-marketplace/command-wallet/commit/5c2779516f780cce7072d04b66ce25ae41b6c3f1))
- used ubiquity-os-logger for logging ([da8f8b3](https://github.com/ubiquity-os-marketplace/command-wallet/commit/da8f8b3cc58cbfac9d6d1d82c4cb76532a98594e))
- worker deploy and delete ([2ea04b3](https://github.com/ubiquity-os-marketplace/command-wallet/commit/2ea04b3475e8177569cc1b3392f4c656970452cb))

### Bug Fixes

- add environment ([6781aa4](https://github.com/ubiquity-os-marketplace/command-wallet/commit/6781aa4706719b0512a87f50d4c72da92d35729c))
- added @ethersproject/providers ([9619a97](https://github.com/ubiquity-os-marketplace/command-wallet/commit/9619a97c40f70a5dcb14f709a75d15e151a0c018))
- bumped rpc-handler package version ([403a293](https://github.com/ubiquity-os-marketplace/command-wallet/commit/403a293293c8a5c32ce1d4dd854f03cae09d5097))
- cross-env ([d1ff206](https://github.com/ubiquity-os-marketplace/command-wallet/commit/d1ff2061de0aab02b7db10dd645ec5bd68f77cc6))
- cspell ([bd07b52](https://github.com/ubiquity-os-marketplace/command-wallet/commit/bd07b5279b4280cd86f7787a0e8f932d86809c39))
- fixed failing unittest ([f576c05](https://github.com/ubiquity-os-marketplace/command-wallet/commit/f576c0561892780027d498541d98d095798e9345))
- fixed knip and wallet test ([01c4aae](https://github.com/ubiquity-os-marketplace/command-wallet/commit/01c4aae876305b042244e6a08d62f9cb6d572488))
- fixed unittest ([ad58dcb](https://github.com/ubiquity-os-marketplace/command-wallet/commit/ad58dcbe03814ac9dc7f40b67c9dd97d4770ae28))
- formatting ([f3b2063](https://github.com/ubiquity-os-marketplace/command-wallet/commit/f3b2063885c94836fc349925c9509cba06556d04))
- inline logging message ([b82b4d3](https://github.com/ubiquity-os-marketplace/command-wallet/commit/b82b4d36ed0083e51b064872f6be6683d0625a6f))
- ipdate wrangler.toml ([80aab08](https://github.com/ubiquity-os-marketplace/command-wallet/commit/80aab085bd10e59f32d22c4ae3221a997c466f98))
- knip ([8774be4](https://github.com/ubiquity-os-marketplace/command-wallet/commit/8774be430b2d86c5e7c03c66d59e8156c26e3151))
- manifest and tests ([07d1aa8](https://github.com/ubiquity-os-marketplace/command-wallet/commit/07d1aa8ed8790875bd1efdf000038aa05c179898))
- process review comments ([80443f0](https://github.com/ubiquity-os-marketplace/command-wallet/commit/80443f049c5106b2c3c25c155f3e70d1cd700ea4))
- removed comma in the package.json ([de783d3](https://github.com/ubiquity-os-marketplace/command-wallet/commit/de783d3a51193baecae332291e79dd19b6ecb5cc))
- revert changes in test ([13253ac](https://github.com/ubiquity-os-marketplace/command-wallet/commit/13253ac45ade2b87681180b7084b44cabdad64e3))
- setup bun ([c1985ed](https://github.com/ubiquity-os-marketplace/command-wallet/commit/c1985edba2b3317fe22f1ccf0302d544bc4dfb69))
- update package.json ([f2dc71a](https://github.com/ubiquity-os-marketplace/command-wallet/commit/f2dc71af5ff661212c2184f215372dd9d6d4e7f1))
- update wrangler.toml compatibility and observability ([f0073f2](https://github.com/ubiquity-os-marketplace/command-wallet/commit/f0073f260de6614b5bbca54fb630fb53c2ba70a1))

## [1.1.0](https://github.com/Meniole/command-wallet/compare/v1.0.0...v1.1.0) (2024-07-16)

### Features

- added test for wallet link ([e059e13](https://github.com/Meniole/command-wallet/commit/e059e1329da781194a4f7a928be17015d2b28962))
- parsing arguments and executing run ([70fb75e](https://github.com/Meniole/command-wallet/commit/70fb75e6e970d6439f5d9ba64ee51caa5edaf269))

### Bug Fixes

- fixed crash when user does not exist ([433a6a7](https://github.com/Meniole/command-wallet/commit/433a6a7c3f19b2722df75e7b826bc6b8e0244a1e))

## 1.0.0 (2024-07-08)

### Features

- added test for wallet link ([e059e13](https://github.com/ubiquibot/command-wallet/commit/e059e1329da781194a4f7a928be17015d2b28962))
- parsing arguments and executing run ([70fb75e](https://github.com/ubiquibot/command-wallet/commit/70fb75e6e970d6439f5d9ba64ee51caa5edaf269))

### Bug Fixes

- fixed crash when user does not exist ([433a6a7](https://github.com/ubiquibot/command-wallet/commit/433a6a7c3f19b2722df75e7b826bc6b8e0244a1e))
