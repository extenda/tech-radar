import * as fs from 'fs-extra';
import * as path from 'path';
import { build } from '../js/builder/builder';
import radarService from '../js/modules/radarService';

describe('RadarService', () => {
  beforeAll(async () => {
    await build(path.resolve(__dirname, 'radar'));

    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      json: () => fs.readFile(path.resolve(__dirname, '../../build/js/radar.json'), 'utf-8')
        .then(data => JSON.parse(data)),
    }));

    await radarService.init();

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('/js/radar.json');
  });

  test('It can list active blips', () => {
    const blips = radarService.listBlips();
    expect(blips.length).toEqual(2);
  });

  test('It can load a quadrant with sorted entries', () => {
    const quadrant = radarService.getQuadrant('dev');
    expect(quadrant).toMatchObject({
      dirname: 'dev',
      adopt: [
        { name: 'Java', filename: 'java.html' },
      ],
      assess: [],
      trial: [],
      hold: [
        { name: 'PHP', filename: 'php.html' },
      ],
    });
  });

  test('It can handle invalid quadrant', () => {
    const quadrant = radarService.getQuadrant('missing');
    expect(quadrant).toBeUndefined();
  });

  test('It can list all active entries in quadrant', () => {
    const entries = radarService.listEntries('dev', '*');
    expect(entries.length).toEqual(2);
    expect(entries[0].meta).toBeUndefined();
    expect(entries[0].$loki).toBeUndefined();
  });

  test('It can list all inactive entries in quadrant', () => {
    const entries = radarService.listEntries('dev', '*', false);
    expect(entries.length).toEqual(1);
  });

  test('It can list entries by quadrant and ring', () => {
    const entries = radarService.listEntries('dev', 0);
    expect(entries.length).toEqual(1);
  });

  test('It can get entity by filename', () => {
    const entry = radarService.getEntry('java.html');
    expect(entry.name).toEqual('Java');
    expect(entry.meta).toBeUndefined();
    expect(entry.$loki).toBeUndefined();
  });
});
