const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(
      compilerOptions.paths,
      { prefix: '<rootDir>/' }
  ),
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  testEnvironment: "node",
  testRegex: "(/__tests__/.*|\\.(test))\\.(ts|tsx|js)$",
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  coveragePathIgnorePatterns: [
    "src/linq-collections.(ts|tsx|js)",
    "index.(ts|tsx|js)",
    "/node_modules/",
    "/test/"
  ],
  coverageThreshold: {
    "global": {
      "branches": 90,
      "functions": 95,
      "lines": 95,
      "statements": 95
    }
  },
  collectCoverageFrom: [
    "src/**/*.{js,tsx,ts}"
  ]
};