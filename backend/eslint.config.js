import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {Linter.Config} */
const config = {
  languageOptions: {
    globals: {
      browser: true,
      node: true,
      es2021: true,
    },
    parser: typescriptParser,
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': typescriptPlugin,
    prettier: prettierPlugin,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    'prettier/prettier': ['error', { singleQuote: true, semi: true }],
  },
  files: ['src/**/*.{ts,tsx}'],
};

export default [
  {
    languageOptions: {
      parser: typescriptParser,
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      'prettier/prettier': ['error', { singleQuote: true, semi: true }],
    },
  },
];
