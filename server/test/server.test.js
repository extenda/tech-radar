const path = require('path');
const fetch = require('node-fetch');
const { OAuth2Client } = require('google-auth-library');
const { init: ldInit } = require('launchdarkly-node-server-sdk');

jest.mock('google-auth-library');
jest.mock('launchdarkly-node-server-sdk');

// Mock the Oauth2Client verifyIdToken method from Google.
const mockVerifyIdToken = jest.fn(({ idToken }) => {
  let ticket;
  if (idToken === 'VALID_DOMAIN') {
    ticket = {
      getPayload: () => ({
        hd: 'extendaretail.com',
        sub: 'test',
        email: 'test@extendaretail.com',
      }),
    };
  } else if (idToken === 'INVALID_DOMAIN') {
    ticket = {
      getPayload: () => ({
        hd: 'gmail.com',
      }),
    };
  } else if (idToken === 'INVALID_TOKEN') {
    return Promise.reject(new Error('Expired token'));
  }
  return Promise.resolve(ticket);
});

OAuth2Client.mockImplementation(() => ({
  verifyIdToken: mockVerifyIdToken,
}));

const mockVariation = jest.fn();
ldInit.mockImplementation(() => ({
  waitForInitialization: jest.fn().mockResolvedValueOnce(true),
  variation: mockVariation,
}));

// Directory where static test content lives.
// Picked up by our Express server.
process.env.PUBLIC_HTML = path.join(__dirname, 'testdata');

// Make ExpressJS use an ephemeral port.
process.env.PORT = '0';

// Now include and start the server.
const server = require('../src/js/index');

describe('Express', () => {
  let port;
  beforeAll(() => {
    port = server.address().port;
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('It responds to /', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    expect(response.status).toEqual(200);
    expect(response.headers.get('content-type')).toEqual('text/html; charset=UTF-8');
  });

  test('It responds to /index.html', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/index.html`);
    expect(response.status).toEqual(200);
    expect(response.headers.get('content-type')).toEqual('text/html; charset=UTF-8');
  });

  test('It redirects **/*.html to /', async () => {
    let response = await fetch(`http://127.0.0.1:${port}/dev.html`);
    expect(response.status).toEqual(200);
    expect(response.headers.get('content-type')).toEqual('text/html; charset=UTF-8');

    response = await fetch(`http://127.0.0.1:${port}/entries/java.html`);
    expect(response.status).toEqual(200);
    expect(response.headers.get('content-type')).toEqual('text/html; charset=UTF-8');
  });

  test('It removes X-Powered-By-Express response header', async () => {
    const response = await fetch(`http://127.0.0.1:${port}/`);
    expect(response.headers.get('x-powered-by-express')).toBeNull();
  });

  describe('js/radar.js', () => {
    test('It returns 401 for missing token', async () => {
      const response = await fetch(`http://127.0.0.1:${port}/js/radar.json`);
      expect(response.status).toEqual(401);
      expect(response.headers.get('www-authenticate')).toContain('credentials_required');
      expect(mockVerifyIdToken).not.toHaveBeenCalled();
    });

    test('It returns 401 for invalid scheme', async () => {
      const response = await fetch(`http://127.0.0.1:${port}/js/radar.json`, {
        headers: {
          authorization: 'token VALID_DOMAIN',
        },
      });
      expect(response.status).toEqual(401);
      expect(response.headers.get('www-authenticate')).toContain('credentials_bad_scheme');
      expect(mockVerifyIdToken).not.toHaveBeenCalled();
    });

    test('It returns 401 for invalid JWT', async () => {
      const response = await fetch(`http://127.0.0.1:${port}/js/radar.json`, {
        headers: {
          authorization: 'Bearer INVALID_TOKEN',
        },
      });
      expect(response.status).toEqual(401);
      expect(response.headers.get('www-authenticate')).toContain('invalid_token');
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
    });

    test('It returns 401 for JWT with incorrect host domain', async () => {
      const response = await fetch(`http://127.0.0.1:${port}/js/radar.json`, {
        headers: {
          authorization: 'Bearer INVALID_DOMAIN',
        },
      });
      expect(response.status).toEqual(401);
      expect(response.headers.get('www-authenticate')).toContain('invalid_token');
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
    });

    test('It returns 200 OK for valid JWT', async () => {
      const response = await fetch(`http://127.0.0.1:${port}/js/radar.json`, {
        headers: {
          authorization: 'Bearer VALID_DOMAIN',
        },
      });
      expect(response.status).toEqual(200);
      expect(response.headers.get('content-type')).toEqual('application/json; charset=UTF-8');
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
    });
  });

  describe('js/radar_tool.js', () => {
    test('It returns 200 OK if feature is enabled', async () => {
      mockVariation.mockResolvedValueOnce(true);
      const response = await fetch(`http://127.0.0.1:${port}/js/radar_tool.json`, {
        headers: {
          authorization: 'Bearer VALID_DOMAIN',
        },
      });
      expect(mockVariation).toHaveBeenCalledWith('enable.tool-radar', {
        key: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        email: 'test@extendaretail.com',
        privateAttributeNames: ['email'],
      }, false);
      expect(response.status).toEqual(200);
      expect(response.headers.get('content-type')).toEqual('application/json; charset=UTF-8');
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
    });

    test('It returns 404 if feature is disabled', async () => {
      mockVariation.mockResolvedValueOnce(false);
      const response = await fetch(`http://127.0.0.1:${port}/js/radar_tool.json`, {
        headers: {
          authorization: 'Bearer VALID_DOMAIN',
        },
      });
      expect(mockVariation).toHaveBeenCalledWith('release.tool-radar', {
        key: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        email: 'test@extendaretail.com',
        privateAttributeNames: ['email'],
      }, false);
      expect(response.status).toEqual(404);
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
    });
  });
});
