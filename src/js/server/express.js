const express = require('express');
const path = require('path');
const morgan = require('morgan');
const { verifyRequest } = require('./verify');

const port = process.env.PORT || 8080;
const publicHtml = process.env.PUBLIC_HTML || path.join(__dirname, '..', '..', '..', 'build');

const app = express();
app.use(morgan('tiny'));
app.disable('x-powered-by');

app.get('/js/radar.json', async (req, res, next) => {
  verifyRequest(req).then(() => {
    next();
  }).catch((err) => {
    res.status(401)
      .append('WWW-Authenticate', `Bearer,error="${err.code}",error_description="${err.message}"`)
      .end();
  });
});

app.use(express.static(publicHtml));
app.listen(port);
