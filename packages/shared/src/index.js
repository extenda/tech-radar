const utils = require('./utils');
const authConfig = require('./auth-config');

module.exports = {
  ...authConfig,
  ...utils,
};
