const { OAuth2Client } = require('google-auth-library');
const { clientId, hostedDomain } = require('../../../src/js/modules/auth-config');

const client = new OAuth2Client(clientId);

class AuthenticationError {
  constructor(code, error) {
    this.name = 'AuthenticationError';
    this.message = error.message;
    this.code = code;
    this.status = 401;
  }
}

const verifyToken = async token => client.verifyIdToken({
  idToken: token,
  audience: clientId,
}).then((ticket) => {
  const { hd } = ticket.getPayload();
  return hd === hostedDomain;
}).catch(() => false);

const verifyRequest = async (req) => {
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2) {
      const [scheme, credentials] = parts;
      if (/^Bearer$/i.test(scheme)) {
        const result = await verifyToken(credentials);
        if (!result) {
          throw new AuthenticationError('invalid_token', {
            message: 'Bad credentials',
          });
        }
        return true;
      }
      throw new AuthenticationError('credentials_bad_scheme', {
        message: 'Format is Authorization: Bearer [token]',
      });
    }
  }
  throw new AuthenticationError('credentials_required', {
    message: 'No authorization token was found',
  });
};

module.exports = {
  verifyToken,
  verifyRequest,
};
