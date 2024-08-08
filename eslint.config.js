const js = require('@eslint/js');
const eslintPluginPrettier = require('eslint-plugin-prettier/recommended');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    name: 'project-config',
    plugins: {
      // 'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {},
  },
  eslintPluginPrettier,
];
