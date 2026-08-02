# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.2.2] - 2026-08-02

### Added
- Prototype pollution defense-in-depth protection:
  - Added `isDangerousKey()` validator and runtime-frozen `DANGEROUS_KEYS` (`Object.freeze(['__proto__', 'constructor', 'prototype'])`)
  - Sanitized `extend()` and `convertFieldNameToArrayOfKeys()` in `src/utils.ts`
  - Guarded `processSingleLevelNode()` and `processMultiLevelNode()` in `src/FormToObject.ts`
  - Comprehensive unit tests covering prototype pollution vectors and runtime immutability

### Fixed
- Robust CSS selector error handling in `initForm()`: invalid CSS selector syntax (e.g. `:invalid[`) is caught gracefully as `SyntaxError` without throwing unhandled `DOMException`, while re-throwing unexpected runtime errors
- Modernized CI/CD workflow actions to `@v4` (`actions/checkout@v4`, `actions/setup-node@v4`, `codecov/codecov-action@v4`)
- Upgraded `vitest` and `@vitest/coverage-v8` to `4.1.10`, resolving all 7 devDependencies vulnerabilities (0 vulnerabilities found on audit)

### Security
- Hardened against prototype pollution payload injections via malicious input field names or option objects
- Clean `npm audit` across all dependencies

## [3.2.1] - 2026-05-13

### Changed
- Migrated E2E test runner from WebdriverIO + Mocha to Playwright + Chromium
- Replaced `@wdio/static-server-service` with a tiny built-in Node static server (`test/e2e/server.mjs`)
- Pinned every `devDependency` to an exact version for reproducible installs (no `^`/`~` ranges)
- Switched the npm package to an explicit `files:` whitelist (only `build/bundle/`, `build/index.d.ts`, `build/types.d.ts`, `CHANGELOG.md` plus the npm defaults are shipped)

### Added
- `playwright.config.ts` and `test/e2e/smoke.spec.ts` (Playwright port of the previous smoke test)
- `permissions: contents: read` block in the GitHub Actions workflow (CodeQL hardening, alert #2)

### Removed
- `@wdio/cli`, `@wdio/local-runner`, `@wdio/mocha-framework`, `@wdio/spec-reporter`, `@wdio/static-server-service`, `@wdio/types`, `@types/mocha`, `ts-node` dev dependencies
- `serialize-javascript` `overrides` entry (vulnerability source removed with the mocha chain)
- `wdio.conf.ts` and the old `test/e2e/smoke.test.ts`
- Internal declaration files (`build/FormToObject.d.ts`, `build/dom.d.ts`, `build/handlers.d.ts`, `build/utils.d.ts`) from the published tarball — only the public surface ships

### Fixed
- Resolved 3 high-severity `serialize-javascript` advisories (GHSA-5c6j-r48x-rmvq, GHSA-qj8w-gfj5-8c6v) inherited from `mocha` via WebdriverIO
- `package.json` `types` field pointed at `build/src/index.d.ts`, which never existed — corrected to `build/index.d.ts` so type resolution actually works for consumers
- Excluded Playwright runtime artifacts (`test-results/`, `playwright-report/`) from git and the npm tarball

### Security
- GitHub Actions workflow now declares least-privilege `GITHUB_TOKEN` permissions

## [3.2.0] - 2026-01-09

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
