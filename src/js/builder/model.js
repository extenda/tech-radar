const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const packageVersion = require('../../../package.json').version;
const { dateFormat } = require('../modules/utils');

// Number of milliseconds in 30 days.
const THIRTY_DAYS = 2592000000;

// The date the builder was created (builder time).
const RADAR_DATE = new Date();

const createModel = (radarDir) => {
  const quadrants = yaml.parse(
    fs.readFileSync(path.join(radarDir, 'quadrants.yaml'), 'utf8'),
  );

  const title = process.env.TITLE || 'Extenda Retail Tech Radar';

  return {
    id: path.basename(radarDir),
    title, // Can we drop this?
    version: packageVersion,
    date: RADAR_DATE,
    formattedDate: dateFormat(RADAR_DATE),
    newAgeThreshold: THIRTY_DAYS,

    // Quadrants in the builder visualization order.
    quadrants,

    // Quadrants in the order we want them in the navbar.
    quadrantsNavBar: [
      quadrants[2],
      quadrants[3],
      quadrants[1],
      quadrants[0],
    ],
    rings: [
      'ADOPT',
      'TRIAL',
      'ASSESS',
      'HOLD',
    ],
  };
};

module.exports = createModel;
