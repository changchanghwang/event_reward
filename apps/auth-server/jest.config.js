module.exports = {
  verbose: true,
  testRegex: ['.*\\.test\\.ts$', '.*\\.spec\\.ts$'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
  },
  preset: 'ts-jest',
  testMatch: null,
  testEnvironment: 'node',
};
