const js = require('@eslint/js');
const eslintPluginPrettier = require('eslint-plugin-prettier/recommended');
const react = require('eslint-plugin-react');
const babelParser = require('@babel/eslint-parser');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.jsx'],
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    name: 'app-config',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
      },
      parser: babelParser,
    },
    rules: {},
  },
  eslintPluginPrettier,
  {
    ignores: ['src/js/lib/radar.js'],
  },
];
