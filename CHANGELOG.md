# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0](https://github.com/oslllo/svg2/compare/v2.0.2...v3.0.0) (2024-07-21)


### Bug Fixes

* fix security vulnerabilities ([f6a46ac](https://github.com/oslllo/svg2/commit/f6a46ac709ba91fe45118acf16fda63102e03725))

### [2.0.2](https://www.github.com/oslllo/svg2/compare/v2.0.0...v2.0.2) (2022-07-16)


### Miscellaneous Chores

* release 2.0.2 ([437c255](https://www.github.com/oslllo/svg2/commit/437c2555cf0456c2fd7651af4f0a1ba16c288896))

## [2.0.0](https://www.github.com/oslllo/svg2/compare/v1.0.0...v2.0.0) (2022-01-21)


This version did not break the api so upgrading from `< v0.3.1` without any changes should be fine. The reason for the major version change is just in case something did break.

### Refactored

- migrate from svg2png-wasm to @resvg/resvg-js for better performance ([#27](https://github.com/oslllo/svg2/pull/27))


## [1.0.0](https://www.github.com/oslllo/svg2/compare/v0.3.1...v1.0.0) (2022-01-12)

This version did not break the api so upgrading from `< v0.3.1` without any changes should be fine. The reason for the major version change is just in case something did break.

### Changed

- Removed `Canvas & JSDOM` to fix very slow `npm install` cycles.
- Switched from `Canvas` to `svg2png-wasm`.

### Updated

- Updated dependencies

### [0.3.1](https://www.github.com/oslllo/svg2/compare/v0.3.0...v0.3.1) (2021-09-05)

### Bug Fixes

- vulnerabilities ([2054734](https://www.github.com/oslllo/svg2/commit/2054734c151f1373eee47ad9f951bd70237e3a5f))

## [0.3.0](https://www.github.com/oslllo/svg2/compare/v0.2.4...v0.3.0) (2021-07-14)

### Features

- add support for svgs with "ex", "ch", "cm", "mm", "q", "in", "pc", "pt" dimensions ([6c5bca1](https://www.github.com/oslllo/svg2/commit/6c5bca16e8a123ec3d9b821ffed8138e56630778))

### Bug Fixes

- Svg2.AUTO outputting wrong dimensions on resize() ([fbd2431](https://www.github.com/oslllo/svg2/commit/fbd24319de0b9f8a62955809d42a4f433dc70186))
- vulnerabilities ([9729786](https://www.github.com/oslllo/svg2/commit/97297861d21ddafc75b38a004ceea7c449f0a743))

### [0.2.4](https://www.github.com/oslllo/svg2/compare/v0.2.3...v0.2.4) (2021-05-06)

### Miscellaneous Chores

- update dependencies
- release 0.2.4 ([1288793](https://www.github.com/oslllo/svg2/commit/12887938271b92f466bec2de7da94034685aa65b))

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
