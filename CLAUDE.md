# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A TypeScript library that converts HTML forms with their fields and values into multidimensional JavaScript objects. Supports PHP-style brackets (`name="field[]"`) and Spring MVC dot notation (`name="field.subfield"`).

## Commands

```bash
# Build (esbuild + TypeScript declarations)
npm run build

# Development mode with watch
npm run dev

# Lint
npm run lint

# Run all unit/integration tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run a single test file
npx vitest run test/unit/checkbox.test.ts

# Run tests matching a pattern
npx vitest run --testNamePattern="radio"

# Run tests in watch mode
npm run test:watch

# Run e2e tests (requires Chrome)
npm run test:e2e

# Run all pre-release checks
npm run prerelease
```

## Pre-release Checklist

Run `npm run prerelease` to execute all stages:

1. **install** - Clean install dependencies (`npm ci`)
2. **build** - Build UMD bundle and TypeScript declarations
3. **lint** - Run ESLint
4. **test:unit** - Run unit tests
5. **test:integration** - Run integration tests
6. **test:e2e** - Run end-to-end tests (requires Chrome)

## Architecture

```
src/
├── index.ts          # Entry point - exports formToObject() function
├── FormToObject.ts   # Core class - form parsing and object construction
├── handlers.ts       # Element value extractors (radio, checkbox, select, etc.)
├── dom.ts            # DOM utilities and type guards (isRadio, isCheckbox, etc.)
├── types.ts          # TypeScript interfaces and types
└── utils.ts          # Helper functions (key parsing, object utilities)
```

**Flow:** `formToObject(selector)` → `FormToObject.initForm()` → `FormToObject.convertToObj()` → iterates form elements → `getNodeValues()` delegates to handlers → `processSingleLevelNode()` or `processMultiLevelNode()` builds result object.

**Key Types:**
- `NodeResult` - The output object type with nested structure support
- `HTMLFormField` - Union of form element types (input, select, textarea, button)
- `NodeValueResult` - Value returned from handlers (`string | string[] | FileList | false`)

## Build Output

- `build/bundle/formToObject.min.js` - UMD bundle (~6KB)
- `build/src/*.d.ts` - TypeScript declarations

## Testing

- **Unit/Integration:** Vitest + jsdom (`test/unit/`, `test/integration/`)
- **E2E:** WebdriverIO 9 + Chrome (`test/e2e/`)
- **Fixtures:** HTML form fixtures in `test/integration/fixtures/`

## Options

| Option                                      | Default | Description                            |
|---------------------------------------------|---------|----------------------------------------|
| `includeEmptyValuedElements`                | `false` | Include fields with empty values       |
| `includeSubmitButton`                       | `false` | Include submit button in output        |
| `includeDisabledFields`                     | `false` | Include disabled fields in output      |
| `selectNameWithEmptyBracketsReturnsArray`   | `true`  | `name="select[]"` returns flat array   |
| `checkBoxNameWithEmptyBracketsReturnsArray` | `true`  | `name="checkbox[]"` returns flat array |

## Code Navigation

When searching for files, classes, references, or methods, use LSP (Language Server Protocol) tools instead of grep/glob when available.
