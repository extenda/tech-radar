/**
 * @jest-environment node
 */
const path = require('path');
const reader = require('../src/reader');
const createModel = require('../src/model');

const radar = createModel(path.join(__dirname, '..', '..', '..', 'radar'));

describe('YAML Reader', () => {
  test('It can traverse all entries', () => {
    const callback = jest.fn();
    reader.collectEntries(path.resolve(__dirname, 'radar/valid'), radar, callback);
    expect(callback.mock.calls.length).toEqual(3);
  });

  test('It maps licenses to tags', () => {
    const entries = [];
    reader.collectEntries(path.resolve(__dirname, 'radar/valid'), radar, (entry) =>
      entries.push(entry),
    );
    expect(entries.find((entry) => entry.name === 'Java').tags).toEqual([
      "90's",
      'commercial',
      'gpl-ce',
      'java',
      'open-source',
      'oracle',
      'web',
    ]);

    expect(entries.find((entry) => entry.name === 'PHP').tags).toContain('bsd');
  });

  test('It throws error on invalid relations', () => {
    expect(() =>
      reader.collectEntries(path.resolve(__dirname, 'radar/ref_error'), radar, jest.fn()),
    ).toThrow('java.yaml - Related file not found: dev/php4.yaml');
  });

  test('It throws error on invalid quadrants', () => {
    expect(() =>
      reader.collectEntries(path.resolve(__dirname, 'radar/quadrant_error'), radar, jest.fn()),
    ).toThrow(/^Invalid quadrant source.*/);
  });
});
