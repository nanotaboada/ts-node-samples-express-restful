import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    rootDir: '.', // ensures all paths are relative from project root
    testMatch: ['<rootDir>/tests/**/*-test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        // SonarQube S6535: Escapes are required for regex literal dot matching
        '^.+\\.ts$': [
            'ts-jest',
            {
                useESM: true,
                isolatedModules: true,
            },
        ],
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.+)\\.js$': '$1',
    },
    moduleDirectories: ['node_modules', 'src'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],

    // Setup files to run before tests
    setupFiles: ['<rootDir>/tests/setup.ts'],

    // Only include coverage for controllers, services, and routes
    collectCoverage: true,
    collectCoverageFrom: ['src/controllers/**/*.{ts,tsx}', 'src/services/**/*.{ts,tsx}', 'src/routes/**/*.{ts,tsx}'],

    // Output clean relative paths
    coverageReporters: ['text', 'json', 'clover', 'lcov'],
    coverageDirectory: 'coverage',

    // Additional ignore patterns
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '<rootDir>/src/database/',
        '<rootDir>/src/docs/',
        '<rootDir>/src/middlewares/',
        '<rootDir>/src/models/',
        '<rootDir>/src/app.ts',
        '<rootDir>/src/server.ts',
        '<rootDir>/tests/',
    ],
};

export default config;
