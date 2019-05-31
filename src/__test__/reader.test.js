const reader = require('../js/builder/reader');

describe('YAML Reader', () => {
  test('It can traverse all entries', () => {
    const callback = jest.fn();
    reader.collectEntries(callback);
    expect(callback.mock.calls.length).toEqual(3);
  });
});
