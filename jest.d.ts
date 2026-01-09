import type { expect, describe, test, it, beforeEach, afterEach, beforeAll, afterAll, jest } from '@jest/globals';

declare global {
  const expect: typeof import('@jest/globals').expect;
  const describe: typeof import('@jest/globals').describe;
  const test: typeof import('@jest/globals').test;
  const it: typeof import('@jest/globals').it;
  const beforeEach: typeof import('@jest/globals').beforeEach;
  const afterEach: typeof import('@jest/globals').afterEach;
  const beforeAll: typeof import('@jest/globals').beforeAll;
  const afterAll: typeof import('@jest/globals').afterAll;
  const jest: typeof import('@jest/globals').jest;
}

export {};
