import fs from "fs";
import path from "path";
import { expect } from '@jest/globals';
import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

export function readIntegrationFixture(relativePath: string) {
  return fs.readFileSync(path.resolve(__dirname, "integration/fixtures", relativePath), { encoding: 'utf8', flag: 'r' })
}

// https://github.com/testing-library/jest-dom/issues/123
declare module 'expect' {
  interface Matchers<R = void>
      extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
}
