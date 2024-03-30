import { Linter } from 'eslint';

const config: Linter.Config = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    rules: {
        'no-explicit-any': 'off',
        'no-unsafe-argument': 'off',
        'no-unsafe-assignment': 'off',
        'no-unsafe-member-access': 'off',
        'no-unsafe-return': 'off',
    },
};

export default config;
