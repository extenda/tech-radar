const path = require('path');
const reader = require('../src/js/builder/reader');

describe('YAML Reader', () => {
  test('It can traverse all entries', () => {
    const callback = jest.fn();
    reader.collectEntries(path.resolve(__dirname, 'radar/valid'), callback);
    expect(callback.mock.calls.length).toEqual(3);
  });

  test('It throws error on invalid relations', () => {
    expect(
      () => reader.collectEntries(path.resolve(__dirname, 'radar/ref_error'), jest.fn()),
    ).toThrow('java.yaml - Related file not found: dev/php4.yaml');
  });

  test('It throws error on invalid quadrants', () => {
    expect(
      () => reader.collectEntries(path.resolve(__dirname, 'radar/quadrant_error'), jest.fn()),
    ).toThrow(/^Invalid quadrant source.*/);
  });
});
