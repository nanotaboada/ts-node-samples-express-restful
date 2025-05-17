import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.', // ensures all paths are relative from project root
    testMatch: ['<rootDir>/tests/**/*-test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                isolatedModules: true,
            },
        ],
    },
    moduleDirectories: ['node_modules', 'src'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],

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
