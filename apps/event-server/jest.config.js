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
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@test$': '<rootDir>/test',
  },
  preset: 'ts-jest',
  testMatch: null,
  testEnvironment: 'node',
};
