import globals from 'globals';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
  stylistic.configs.recommended,
  pluginJs.configs.recommended,
  {
    files: [
      '**/*.{js, mjs}'
    ],
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '**/*.config.js'
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      'semi': 'off',
      '@stylistic/semi': ['error', 'always'],
      'indent': 'off',
      '@stylistic/indent': ['error', 2],
      'quotes': 'off',
      '@stylistic/quotes': ['error', 'single'],
      'arrow-parens': 'off',
      '@stylistic/arrow-parens': ['error', 'always'],
      'comma-dangle': 'off',
      '@stylistic/comma-dangle': ['error', {
        arrays: 'never',
        objects: 'always-multiline',
      }],
      'brace-style': 'off',
      '@stylistic/brace-style': ['error', '1tbs'],
    },
  }
];
