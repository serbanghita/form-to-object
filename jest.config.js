module.exports = {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "<rootDir>/test/unit/*.test.ts",
    "!**/node_modules/**",
    "!<rootDir>/src/expose-to-browser.ts",
  ],
  coverageDirectory: ".tmp/coverage",
  coverageReporters: ["html", "json", "lcov", "text", "clover"],
  moduleFileExtensions: ["ts", "js"],
  modulePaths: ['<rootDir>/src/', '<rootDir>/test/unit/'],
  transform: {
    "\\.ts$": "ts-jest",
  },
  testMatch: ["<rootDir>/test/unit/*.test.ts"],
  verbose: true
};
