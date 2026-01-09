# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- CSS selector support in `initForm()` - now accepts any valid CSS selector (`.myForm`, `#myForm`, `form[data-test]`, etc.)
- New `src/handlers.ts` module with 8 specialized value extraction functions:
  - `getRadioValue()`, `getCheckboxValue()`, `getFileValue()`, `getTextareaValue()`
  - `getSelectSimpleValue()`, `getSelectMultipleValue()`, `getSubmitButtonValue()`, `getInputValue()`
- Comprehensive test coverage (158 tests, 100% line coverage)
- New test files: `handlers.test.ts`, `index.test.ts`, `file.test.ts`, `FormToObject.test.ts`
- `esbuild.config.js` - Fast bundler configuration
- `eslint.config.mjs` - ESLint 9 flat config
- `tsconfig.build.json` - Build-only TypeScript configuration
- `vitest.config.mts` and `vitest-setup.mts` - Vitest test runner configuration
- `prerelease` npm script - runs all checks (install, build, lint, test:unit, test:integration, test:e2e)
- `release:patch`, `release:minor`, `release:major` npm scripts for publishing to npm
- `test:unit` and `test:integration` npm scripts for granular test execution
- `engines` field requiring Node.js >= 24.11.0

### Changed
- Migrated build system from Webpack to esbuild (214x faster: 1499ms → 7ms)
- Migrated test runner from Jest to Vitest (faster execution, native ESM support)
- Updated ESLint 8 → 9 with new flat config format
- Updated TypeScript 5.2 → 5.8
- Updated GitHub Actions workflow to Node.js 24.x
- Updated all dev dependencies to latest versions
- Improved type definitions with proper `NodeResult`, `FormFieldValue`, `NodeValueResult` types
- Refactored `getNodeValues()` method to delegate to specialized handlers
- Plain ID strings (e.g., `'myForm'`) still work for backward compatibility

### Removed
- Webpack configuration files (`webpack.common.js`, `webpack.dev.js`, `webpack.prod.js`)
- Legacy ESLint config (`.eslintrc.cjs`)
- Jest configuration files (`jest.config.js`, `jest-setup.js`, `jest.d.ts`)
- Jest dependencies (`@jest/globals`, `jest`, `jest-environment-jsdom`, `ts-jest`)
- Unused dependencies (`@testing-library/webdriverio`, `wdio-wait-for`)
- Unused `HandlerContext` interface from handlers.ts

### Fixed
- Resolved 33 security vulnerabilities in dev dependencies

### Security
- Updated all dev dependencies to resolve known vulnerabilities
- Zero production dependencies (no supply chain risk)

## [3.1.0] - 2024-01-15

### Added
- TypeScript support with full type definitions
- UMD bundle for browser, CommonJS, and ES modules

## [3.0.0] - 2023-06-01

### Changed
- Complete rewrite in TypeScript
- Modern ES6+ syntax
- New modular architecture

### Removed
- Legacy ES5 code
- jQuery dependency
