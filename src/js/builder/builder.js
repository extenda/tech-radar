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
  reader.collectEntries(radarDir, entry => json.entries.push(entry));

  // Sort entries by quadrant, ring and name.
  json.entries.sort(firstBy('quadrant')
    .thenBy('ring')
    .thenBy('name'));

  return fs.writeJson(path.join(BUILD_DIR, 'radar.json'), json);
};

module.exports = {
  build,
};
