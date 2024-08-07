const express = require('express');
const path = require('path');
const morgan = require('morgan');
const LaunchDarkly = require('launchdarkly-node-server-sdk');
const shajs = require('sha.js');
const { verifyRequest } = require('./verify');

// Run in offline mode if LD_SDK_KEY is not set.
const ldClient = LaunchDarkly.init(process.env.LD_SDK_KEY, {
  offline: !process.env.LD_SDK_KEY,
});

// Handle SIGINT to gracefully exit on CTRL+C in local Docker.
process.on('SIGINT', () => {
  process.exit(0);
});

const port = process.env.PORT || 8080;
const publicHtml = process.env.PUBLIC_HTML || path.join(__dirname, '..', '..', '..', 'build');

const app = express();
app.use(morgan('tiny'));
app.disable('x-powered-by');

app.get(/\.html$/, async (req, res) => {
  res.sendFile(path.join(publicHtml, 'index.html'));
});

function send401(res, err) {
  res.status(401)
    .append('WWW-Authenticate', `Bearer,error="${err.code}",error_description="${err.message}"`)
    .end();
}

app.get('/js/radar.json', async (req, res, next) => {
  verifyRequest(req)
    .then(() => next())
    .catch((err) => send401(res, err));
});

app.get('/js/radar_it.json', async (req, res, next) => {
  verifyRequest(req).then(({ sub, email }) => ({
    key: shajs('sha256').update(`${sub}`).digest('hex'),
    email,
    privateAttributeNames: ['email'],
  })).then((user) => ldClient.variation('release.tool-radar', user, false))
    .then((flag) => {
      if (flag === true) {
        return next();
      }
      return res.status(404).end();
    })
    .catch((err) => send401(res, err));
});

app.use(express.static(publicHtml));

(async () => {
  await ldClient.waitForInitialization();
})();

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
