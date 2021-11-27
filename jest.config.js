// For a detailed explanation regarding each configuration property, visit: https://jestjs.io/docs/en/configuration.html

module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json",
    },
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.js$": "babel-jest",
  },
  testMatch: ["**/src/**/?(*.)+(spec|test).[tj]s"],
  testPathIgnorePatterns: ["node_modules/"],

  cacheDirectory: "./node_modules/.cache/jest",
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: "node",
};
