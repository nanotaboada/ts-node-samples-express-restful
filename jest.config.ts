import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
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
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
