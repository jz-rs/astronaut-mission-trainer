import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      'max-lines': ['warn', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 30, skipBlankLines: true, skipComments: true }],
      'no-magic-numbers': 'off',
      eqeqeq: 'error',
    },
  },
  {
    // A describe() block groups many short tests, so it is naturally long.
    files: ['tests/**'],
    rules: { 'max-lines-per-function': 'off' },
  },
  {
    // Core logic must stay framework-free so it can be tested and later moved to a server.
    files: ['src/core/**', 'src/bots/**'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ['phaser', 'phaser/*'] }],
    },
  },
);
