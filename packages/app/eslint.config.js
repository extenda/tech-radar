const js = require('@eslint/js');
const eslintPluginPrettier = require('eslint-plugin-prettier/recommended');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const reactHooks = require('eslint-plugin-react-hooks');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const react = require('eslint-plugin-react');
const babelParser = require('@babel/eslint-parser');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    name: 'react-config',
    files: ['**/*.jsx'],
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  jsxA11y.flatConfigs.recommended,
  {
    name: 'react-hooks',
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    name: 'package-config',
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
        LD_CLIENT_ID: 'readonly',
        DISABLE_GOOGLE_LOGIN: 'readonly',
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
