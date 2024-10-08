module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src/'],
  verbose: true,
  reporters: ['default', 'jest-junit'],
  coveragePathIgnorePatterns: ['<rootDir>/src/test/'],
  collectCoverageFrom: ['src/**'],
  coverageReporters: ['text'],
  coverageThreshold: {
    global: {
      lines: 85,
    },
  },
};
