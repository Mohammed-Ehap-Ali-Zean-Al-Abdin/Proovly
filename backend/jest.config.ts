import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  // Allow imports that include a .js extension in source (common when targeting ESM output)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
    // Run env.setup before any modules are loaded so process.env values are available
    setupFiles: ['<rootDir>/tests/env.setup.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageThreshold: {
      global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
      }
    }
};

export default config;


