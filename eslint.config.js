const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^(req|res|next|_)' }],
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'node_modules/',
      'OpenJob RESTful API V1 Test/',
      'OpenJob RESTful API V2 Test/',
      'uploads/',
    ],
  },
];

