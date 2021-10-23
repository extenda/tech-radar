const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { verifyRequest } = require('./verify');

// Handle SIGINT to gracefully exit on CTRL+C in local Docker.
process.on('SIGINT', () => {
  process.exit(0);
});

const port = process.env.PORT || 8080;
const publicHtml = process.env.PUBLIC_HTML || path.join(__dirname, '..', '..', '..', 'build');

const app = express();
app.use(morgan('tiny'));
app.disable('x-powered-by');

app.get(/.*\.html/, async (req, res) => {
  res.sendFile(path.join(publicHtml, 'index.html'));
});

app.get('/js/radar.json', async (req, res, next) => {
  verifyRequest(req).then(() => {
    next();
  }).catch((err) => {
    res.status(401)
      .append('WWW-Authenticate', `Bearer,error="${err.code}",error_description="${err.message}"`)
      .end();
  });
});

// TODO Should we just bundle both files into one? Could we return a JSON object with both radars?
// I think we can do that... But would be better to do that at compile-time.
// Or just make the bigger refactor to load them in a new way. But it will be a bit slower.

// TODO Support /js/radar_tool.json and hide behind feature toggle!
// Here we must also inject the LD_CLIENT_ID somehow...

app.use(express.static(publicHtml));
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;
