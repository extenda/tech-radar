const path = require('path');
const reader = require('../js/builder/reader');

describe('YAML Reader', () => {
  test('It can traverse all entries', () => {
    const callback = jest.fn();
    reader.collectEntries(path.resolve(__dirname, 'radar'), callback);
    expect(callback.mock.calls.length).toEqual(3);
  });
});
