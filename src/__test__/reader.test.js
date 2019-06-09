const path = require('path');
const reader = require('../js/builder/reader');

describe('YAML Reader', () => {
  test('It can traverse all entries', () => {
    const callback = jest.fn();
    reader.collectEntries(path.resolve(__dirname, 'radar/valid'), callback);
    expect(callback.mock.calls.length).toEqual(3);
  });

  test('It logs error on invalid relations', () => {
    /* eslint-disable no-console */
    console.error = jest.fn();
    reader.collectEntries(path.resolve(__dirname, 'radar/ref_error'), jest.fn());
    expect(console.error).toHaveBeenCalled();
    expect(console.error.mock.calls[0][0]).toMatch('Related file not found: dev/php4.yaml');
    /* eslint-enable no-console */
  });

  test('It throws exception on invalid quadrants', () => {
    expect(
      () => reader.collectEntries(path.resolve(__dirname, 'radar/quadrant_error'), jest.fn()),
    ).toThrow(/^Invalid quadrant source.*/);
  });
});
