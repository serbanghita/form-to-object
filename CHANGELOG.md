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
- `CLAUDE-REVIEW.md` - Detailed code review document
- `esbuild.config.js` - Fast bundler configuration
- `eslint.config.mjs` - ESLint 9 flat config
- `tsconfig.build.json` - Build-only TypeScript configuration
- `jest.d.ts` - Jest 30 global type declarations

### Changed
- Migrated build system from Webpack to esbuild (214x faster: 1499ms → 7ms)
- Updated ESLint 8 → 9 with new flat config format
- Updated Jest 29 → 30 with proper TypeScript support
- Updated TypeScript 5.2 → 5.8
- Updated all dev dependencies to latest versions
- Improved type definitions with proper `NodeResult`, `FormFieldValue`, `NodeValueResult` types
- Refactored `getNodeValues()` method to delegate to specialized handlers
- Plain ID strings (e.g., `'myForm'`) still work for backward compatibility

### Removed
- Webpack configuration files (`webpack.common.js`, `webpack.dev.js`, `webpack.prod.js`)
- Legacy ESLint config (`.eslintrc.cjs`)

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
