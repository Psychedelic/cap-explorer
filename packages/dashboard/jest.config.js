module.exports = {
  roots: [
    '<rootDir>/src/',
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  testTimeout: 20000,
  moduleNameMapper: {
    '@stitched': '<rootDir>/src/stitches.config.ts',
    '@components/(.*)': '<rootDir>/src/components/$1',
    '@fonts/(.*)': '<rootDir>/fonts/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@hooks/(.*)': '<rootDir>/src/hooks/$1',
    '@views/(.*)': '<rootDir>/src/views/$1',
    '@agentjs': '<rootDir>/agent.ts',
  },
};
