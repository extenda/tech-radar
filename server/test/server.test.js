const path = require('path');
const fetch = require('node-fetch');
const { OAuth2Client } = require('google-auth-library');

jest.mock('google-auth-library');

// Mock the Oauth2Client verifyIdToken method from Google.
const mockVerifyIdToken = jest.fn(({ idToken }) => {
  let ticket;
  if (idToken === 'VALID_DOMAIN') {
    ticket = {
      getPayload: () => ({
        hd: 'extendaretail.com',
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

const server = require('../src/js/index');

// Directory where static test content lives.
// Picked up by our Express server.
process.env.PUBLIC_HTML = path.join(__dirname, 'testdata');

describe('Express', () => {
  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    OAuth2Client.mockClear();
    mockVerifyIdToken.mockClear();
  });

  test('It responds to /', async () => {
    const response = await fetch('http://127.0.0.1:8080/');
    expect(response.status).toEqual(200);
    expect(response.headers.get('content-type')).toEqual('text/html; charset=UTF-8');
  });

  test('It removes X-Powered-By-Express response header', async () => {
    const response = await fetch('http://127.0.0.1:8080/');
    expect(response.headers.get('x-powered-by-express')).toBeNull();
  });

  describe('js/radar.js', () => {
    test('It returns 401 for missing token', async () => {
      const response = await fetch('http://127.0.0.1:8080/js/radar.json');
      expect(response.status).toEqual(401);
      expect(response.headers.get('www-authenticate')).toContain('credentials_required');
      expect(mockVerifyIdToken).not.toHaveBeenCalled();
    });

    test('It returns 401 for invalid scheme', async () => {
      const response = await fetch('http://127.0.0.1:8080/js/radar.json', {
        headers: {
          authorization: 'token VALID_DOMAIN',
        },
      });
      expect(response.status).toEqual(401);
      expect(response.headers.get('www-authenticate')).toContain('credentials_bad_scheme');
      expect(mockVerifyIdToken).not.toHaveBeenCalled();
    });

    test('It returns 401 for invalid JWT', async () => {
      const response = await fetch('http://127.0.0.1:8080/js/radar.json', {
        headers: {
          authorization: 'Bearer INVALID_TOKEN',
        },
      });
      expect(response.status).toEqual(401);
      expect(response.headers.get('www-authenticate')).toContain('invalid_token');
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
    });

    test('It returns 401 for JWT with incorrect host domain', async () => {
      const response = await fetch('http://127.0.0.1:8080/js/radar.json', {
        headers: {
          authorization: 'Bearer INVALID_DOMAIN',
        },
      });
      expect(response.status).toEqual(401);
      expect(response.headers.get('www-authenticate')).toContain('invalid_token');
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
    });

    test('It returns 200 OK for valid JWT', async () => {
      const response = await fetch('http://127.0.0.1:8080/js/radar.json', {
        headers: {
          authorization: 'Bearer VALID_DOMAIN',
        },
      });
      expect(response.status).toEqual(200);
      expect(response.headers.get('content-type')).toEqual('application/json; charset=UTF-8');
      expect(mockVerifyIdToken).toHaveBeenCalledTimes(1);
    });
  });
});
