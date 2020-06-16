import * as fs from 'fs-extra';
import * as path from 'path';
import { build } from '../src/js/builder/builder';
import radarService from '../src/js/modules/radarService';

jest.dontMock('../src/js/modules/radarService');

describe('RadarService', () => {
  beforeAll(async () => {
    await build(path.resolve(__dirname, 'radar/valid'));

    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      json: () => fs.readFile(path.resolve(__dirname, '../build/js/radar.json'), 'utf-8')
        .then(data => JSON.parse(data)),
    }));

    await radarService.init('test');

    expect(global.fetch).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith('/js/radar.json', {
      headers: {
        Authorization: 'Bearer test',
      },
      credentials: 'same-origin',
    });
  });

  test('It can list active blips', () => {
    const blips = radarService.listBlips();
    expect(blips).toHaveLength(2);
  });

  test('It can filter blips by tags', () => {
    const blips = radarService.listBlips(['java']);
    expect(blips).toHaveLength(1);
  });

  test('It can load a quadrant with sorted entries', () => {
    const quadrant = radarService.getQuadrant('dev');
    expect(quadrant).toMatchObject({
      dirname: 'dev',
      adopt: [
        { name: 'Java', filename: 'java.html', active: true },
      ],
      assess: [],
      trial: [],
      hold: [
        { name: 'Common Lisp', filename: 'lisp.html', active: false },
        { name: 'PHP', filename: 'php.html', active: true },
      ],
    });
  });

  test('It can handle invalid quadrant', () => {
    const quadrant = radarService.getQuadrant('missing');
    expect(quadrant).toBeUndefined();
  });

  test('It can list all active entries in quadrant', () => {
    const entries = radarService.listEntries('dev', '*');
    expect(entries).toHaveLength(2);
  });

  test('It can list all active and inactive entries in quadrant', () => {
    const entries = radarService.listEntries('dev', '*', false);
    expect(entries).toHaveLength(3);
  });

  test('It can list entries by quadrant and ring', () => {
    const entries = radarService.listEntries('dev', 0);
    expect(entries).toHaveLength(1);
  });

  test('It can get entity by filename', () => {
    const entry = radarService.getEntry('java.html');
    expect(entry.name).toEqual('Java');
  });

  test('It can list unique tags', () => {
    const tags = radarService.listTags();
    expect(tags).toHaveLength(9);
    expect(tags).toEqual([
      '90\'s',
      'bsd',
      'bsd-2',
      'commercial',
      'gpl-ce',
      'java',
      'open-source',
      'oracle',
      'web',
    ]);
  });

  test('It can list entries by tag', () => {
    const entries = radarService.listEntriesByTag('java');
    expect(entries).toHaveLength(1);
    expect(entries[0].name).toEqual('Java');
  });

  test('It returns empty array for invalid tag', () => {
    const entries = radarService.listEntriesByTag('invalid');
    expect(entries).toHaveLength(0);
  });

  test('It can enumerate all entries', () => {
    const entries = radarService.listEntries('dev', '*', false);
    expect(entries).toHaveLength(3);
    expect(entries[0]).toMatchObject({ blip: { label: 'Lisp', id: 2 } });
    expect(entries[1]).toMatchObject({ blip: { label: 'Java', id: 1 } });
    expect(entries[2]).toMatchObject({ blip: { label: 'PHP', id: 3 } });
  });

  test('It can enumerate blips with IDs', () => {
    const blips = radarService.listBlips();
    expect(blips[0]).toMatchObject({
      label: 'Java',
      id: 1,
    });
    expect(blips[1]).toMatchObject({
      label: 'PHP',
      id: 3,
    });
  });
});
