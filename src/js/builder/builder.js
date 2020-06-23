const fs = require('fs-extra');
const path = require('path');
const { firstBy } = require('thenby');
const reader = require('./reader');
const radar = require('./model');
const { pick } = require('../modules/utils');

const BUILD_DIR = 'build/js';

const build = (radarDir) => {
  fs.mkdirsSync(BUILD_DIR);
  const json = pick(radar, 'title', 'version', 'formattedDate', 'quadrants', 'quadrantsNavBar', 'rings');
  json.entries = [];

  // Read entries from YAML files.
  reader.collectEntries(radarDir, (entry) => json.entries.push(entry));

  // Sort entries by quadrant, ring and name.
  json.entries.sort(firstBy((a, b) => a.blip.quadrant - b.blip.quadrant)
    .thenBy((a, b) => a.blip.ring - b.blip.ring)
    .thenBy('name'));

  // Assign unique IDs
  let id = 0;
  [2, 3, 1, 0].forEach((quadrant) => {
    [0, 1, 2, 3].forEach((ring) => {
      json.entries.forEach((entry, index) => {
        if (entry.blip.quadrant === quadrant && entry.blip.ring === ring) {
          id += 1;
          json.entries[index].blip.id = id;
        }
      });
    });
  });

  return fs.writeJson(path.join(BUILD_DIR, 'radar.json'), json);
};

module.exports = {
  build,
};
