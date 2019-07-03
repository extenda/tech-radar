const fs = require('fs');
const klawSync = require('klaw-sync');
const path = require('path');
const yaml = require('yaml');
const radar = require('./model');
const { dateFormat } = require('../modules/utils');

const htmlFile = yamlFile => `${path.basename(yamlFile, '.yaml')}.html`;

const last = arr => arr[arr.length - 1];

// Build a list of related builder blips.
const buildRelatedLinks = (entry) => {
  if (entry.related) {
    const related = [];
    entry.related.forEach((file) => {
      try {
        const linked = yaml.parse(fs.readFileSync(path.join(radar.radarDir, file), 'utf8'));
        related.push({
          file: htmlFile(file),
          name: linked.name,
        });
      } catch (err) {
        const source = entry.filename.replace('.html', '.yaml');
        throw new Error(`${source} - Related file not found: ${file}`);
      }
    });
    return related.sort((a, b) => a.name.localeCompare(b.name));
  }
  return undefined;
};

// Find the quadrant and its index for a YAML source file.
const findQuadrant = (yamlFile) => {
  const dirname = path.relative(radar.radarDir, path.dirname(yamlFile));
  const index = radar.quadrants.findIndex(q => q.dirname === dirname);
  if (index >= 0) {
    return {
      index,
      dirname,
      title: radar.quadrants[index].title,
    };
  }
  throw new Error(`Invalid quadrant source file ${yamlFile}.`);
};

const ringName = ring => ring.charAt(0) + ring.substr(1).toLowerCase();

// Create a builder blip entry.
const createBlip = (entry) => {
  const blipAge = radar.date - new Date(last(entry.blip).date).getTime();
  const blip = {
    label: entry.shortname ? entry.shortname : entry.name,
    quadrant: entry.quadrant.index,
    since: dateFormat(new Date(entry.blip[0].date)),
    ring: radar.rings.indexOf(last(entry.blip).ring),
    ringName: ringName(last(entry.blip).ring),
    moved: blipAge < radar.newAgeThreshold,
    link: `/entries/${entry.filename}`,
    active: true,
  };

  if (typeof entry.active !== 'undefined') {
    blip.active = entry.active;
  }

  if (entry.blip.length > 1) {
    blip.history = [];
    entry.blip.forEach(p => blip.history.push({
      date: dateFormat(new Date(p.date)),
      ringName: ringName(p.ring),
    }));
  }

  return blip;
};

const createLicenseTags = (entry) => {
  const tags = [];
  const { license } = entry;
  if (license && license.commercial) {
    tags.push('commercial');
    tags.push(license.commercial.company.toLowerCase());
  }

  if (license && license['open-source']) {
    const { 'open-source': { name } } = license;
    tags.push('open-source');
    tags.push(name.toLowerCase());

    const reg = /^(.*)-[0-9\\.]+$/;
    if (reg.test(name)) {
      // Tag with the base license, excluding version/style
      tags.push(name.match(reg)[1].toLowerCase());
    }
  }

  return tags;
};

const createTags = (entry) => {
  const tags = entry.tags ? entry.tags.map(t => t.toLowerCase()) : [];
  tags.push(...createLicenseTags(entry));
  tags.sort((a, b) => a.localeCompare(b));
  return tags;
};

const collectEntries = (radarDir, callback) => {
  const klawOpts = {
    nodir: true,
    traverseAll: true,
    filter: p => path.extname(p.path) === '.yaml',
  };

  radar.radarDir = radarDir;

  klawSync(radar.radarDir, klawOpts).forEach((f) => {
    const entry = yaml.parse(fs.readFileSync(f.path, 'utf8'));
    entry.quadrant = findQuadrant(f.path);
    entry.filename = htmlFile(f.path);
    entry.blip = createBlip(entry);
    entry.related = buildRelatedLinks(entry);
    entry.tags = createTags(entry);
    if (entry.license && entry.license['open-source']) {
      entry.license.openSource = entry.license['open-source'];
      delete entry.license['open-source'];
    }
    callback(entry);
  });
};

module.exports = {
  collectEntries,
};
