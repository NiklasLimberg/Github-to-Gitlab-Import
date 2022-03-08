module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/typescript/recommended',
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'object-curly-newline': ['error', {
            consistent: true,
        }],
    },
};