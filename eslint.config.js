import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default [
  // Base JS rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Disable ESLint formatting rules that conflict with Prettier
  prettier,

  // Your project rules
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      // ========================
      // Code Style (IMPORTANT for AI-generated code consistency)
      // ========================
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],

      // ========================
      // TypeScript rules
      // ========================
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // ========================
      // Safety for automation framework
      // ========================
      'no-console': 'off',
      'no-debugger': 'error',
    },
  },

  // Ignore folders
  {
    ignores: ['node_modules', 'dist', 'playwright-report', 'test-results'],
  },
];
