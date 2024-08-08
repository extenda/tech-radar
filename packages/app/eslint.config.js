const js = require('@eslint/js');
const eslintPluginPrettier = require('eslint-plugin-prettier/recommended');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
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
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
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
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  eslintPluginPrettier,
  {
    ignores: ['src/js/lib/radar.js'],
  },
];
