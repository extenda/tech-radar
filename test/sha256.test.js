import { TextEncoder } from 'util';
import crypto from 'crypto';
import sha256 from '../src/js/modules/sha256';

test('It can create a shasum', async () => {
  Object.defineProperty(window.globalThis, 'crypto', {
    value: crypto,
  });

  global.TextEncoder = TextEncoder;

  const result = await sha256('test');
  expect(result).toEqual('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
});
