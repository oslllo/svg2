# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0](https://www.github.com/oslllo/svg2/compare/v0.3.1...v1.0.0) (2022-01-12)


### Bug Fixes

* **pkg:** switch to svg2png-wasm-node-10 for node 10+ support ([47bce23](https://www.github.com/oslllo/svg2/commit/47bce23d974c0d957119c28738a1c92a1c7a2541))
* **test:** resolve wasm ([72d7bf4](https://www.github.com/oslllo/svg2/commit/72d7bf4d7683a470249a4ec71dee9747b3b8e3aa))


### Miscellaneous Chores

* release 1.0.0 ([45c30f6](https://www.github.com/oslllo/svg2/commit/45c30f60bcc2d67d003c95de4a681b7d9fd09947))

### [0.3.1](https://www.github.com/oslllo/svg2/compare/v0.3.0...v0.3.1) (2021-09-05)


### Bug Fixes

* vulnerabilities ([2054734](https://www.github.com/oslllo/svg2/commit/2054734c151f1373eee47ad9f951bd70237e3a5f))

## [0.3.0](https://www.github.com/oslllo/svg2/compare/v0.2.4...v0.3.0) (2021-07-14)


### Features

* add support for svgs with "ex", "ch", "cm", "mm", "q", "in", "pc", "pt" dimensions ([6c5bca1](https://www.github.com/oslllo/svg2/commit/6c5bca16e8a123ec3d9b821ffed8138e56630778))


### Bug Fixes

* Svg2.AUTO outputting wrong dimensions on resize() ([fbd2431](https://www.github.com/oslllo/svg2/commit/fbd24319de0b9f8a62955809d42a4f433dc70186))
* vulnerabilities ([9729786](https://www.github.com/oslllo/svg2/commit/97297861d21ddafc75b38a004ceea7c449f0a743))

### [0.2.4](https://www.github.com/oslllo/svg2/compare/v0.2.3...v0.2.4) (2021-05-06)


### Miscellaneous Chores

* update dependencies
* release 0.2.4 ([1288793](https://www.github.com/oslllo/svg2/commit/12887938271b92f466bec2de7da94034685aa65b))

## [0.2.3] - 2021/4/1

### Updated

- Updated dependencies.

## [0.2.2] - 2020/12/12

### Fixed

- Fixed vulnerability.

### Updated

- Updated dependencies.

### Removed

- Removed `validatorjs`.

## [0.2.1] - 2020/10/2

### Fixed

- Fixed throwing error when svg has % dimensions.

## [0.2.0] - 2020/9/17

### Changed

- Removed tests from npm `package` to help reduce unpacked `package` size.

## [0.1.0] - 2020/8/27

### Added

- image `extend()` chain function.
- image `background()` chain function.

### Changed

- internal `validate.js` to external `oslllo-validator`

### Security

- Updated dependencies

## [0.0.2] - 2020/8/27

### Security

- Fixed [vulnerability](https://npmjs.com/advisories/1523).

## [0.0.1] - 2020/7/29

### Added

- Everything, initial release.
