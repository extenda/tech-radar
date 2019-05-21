const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const path = require('path');
const yaml = require('yaml');
const handlebars = require('handlebars');
const md = require('markdown-it')();
const radarModel = require('./radarmodel');
const semver = require('semver');

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  }
}

const THIRTY_DAYS = 2592000000;

function buildRelatedLinks(radar, content) {
  const related = []
  if (content.related) {
    content.related.forEach((file) => {
      try {
        const linked = yaml.parse(fs.readFileSync(path.join(radar.radarDir, file), 'utf8'));
        related.push({
          file: path.basename(file, '.yaml') + '.html',
          name: linked.name,
        });
      } catch (err) {
        console.error(`Related file not found: ${file}`, err.message);
      }
    });
  }

  return related.sort((a, b) => a.name.localeCompare(b.name));
}

// Build the static radar HTML representation from the model and radar entries
function buildRadar(outputDir, radarDir, version, creationDate = new Date()) {

  // Ensure directories exist
  fs.mkdirsSync(outputDir);
  fs.mkdirSync(path.join(outputDir, 'entries'));

  handlebars.registerPartial('footer', handlebars.compile(fs.readFileSync('src/templates/footer.hbs', 'utf8')));
  handlebars.registerHelper('markdown', value => md.render(value));

  const entryPage = handlebars.compile(fs.readFileSync('src/templates/entry_page.hbs', 'utf8'));
  const quadrantPage = handlebars.compile(fs.readFileSync('src/templates/quadrant_page.hbs', 'utf8'));
  const radarPage = handlebars.compile(fs.readFileSync('src/templates/index.hbs', 'utf8'));

  const radar = radarModel.createModel(version);
  radar.date = dateFormat(creationDate);
  radar.radarDir = radarDir;
  radar.outputDir = outputDir;

  console.log('Build radar', radar.version);

  console.log('  - Entries');

  // Create all the entries pages and collect blips.
  for (var f of klawSync(radar.radarDir, { nodir: true, traverseAll: true, filter: p => path.extname(p.path) === '.yaml' })) {
    const content = yaml.parse(fs.readFileSync(f.path, 'utf8'));
    validateYaml(f.path, content);
    let quadrantIndex = 0;
    findQuadrant(radar, f.path, (i, q) => {
      content.quadrant = q;
      quadrantIndex = i;
    });

    content.title = radar.title;
    content.version = radar.version;
    content.date = dateFormat(creationDate);

    const filename = path.join(outputDir, 'entries', path.basename(f.path, '.yaml') + '.html');

    radar.quadrants[quadrantIndex][content.blip.last().ring.toLowerCase()].push({
      name: content.name,
      file: path.relative(outputDir, filename),
    });

    const blip = createBlip(radar, creationDate, content, filename, f.path);
    if (blip.active) {
      radar.blips.push(blip);
    }

    content.blip = blip;
    content.related = buildRelatedLinks(radar, content);

    fs.writeFileSync(
      filename,
      entryPage(content),
    );
  }

  // Create the quadrant index pages.
  console.log('  - Quadrants');
  for (var q of radar.quadrants) {
    q.title = radar.title;
    q.version = radar.version;
    q.date = dateFormat(creationDate);

    const sortFn = (a, b) => a.name.localeCompare(b.name);
    q.adopt.sort(sortFn);
    q.trial.sort(sortFn);
    q.assess.sort(sortFn);
    q.hold.sort(sortFn);

    fs.writeFileSync(path.join(outputDir, q.dirname + '.html'), quadrantPage(q))
  }

  // Create the main radar visualization
  console.log('  - Radar visualization');
  fs.writeFileSync(path.join(outputDir, 'index.html'), radarPage(radar));

  if (outputDir === 'build') {
    // Copy static resources
    console.log('Copy resources');
    fs.copySync('src/resources', outputDir);
    fs.copySync('src/css', path.join(outputDir, 'css'));
  }
}

function dateFormat(time) {
  return time.toLocaleString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function findQuadrant(radar, sourceFile, callback) {
  const quadrant = path.relative(radar.radarDir, path.dirname(sourceFile));
  for (const [i, q] of radar.quadrants.entries()) {
    if (q.dirname === quadrant) {
      callback(i, q);
      break;
    }
  }
}

// Validate all required properties in the radar YAML entries
function validateYaml(filename, content) {
  if (!content.hasOwnProperty('name')) {
    console.error(`Missing 'name' in ${filename}`);
  }
  if (!content.hasOwnProperty('blip')) {
    console.error(`Missing 'blip' in ${filename}`);
  }
  if (!Array.isArray(content.blip)) {
    console.error(`'blip' is not an array in ${filename}`);
  }
  for (var blip of content.blip) {
    if (!blip.hasOwnProperty('date')) {
      console.error(`Missing 'blip[*].date' in ${filename}`);
    }
    if (!blip.hasOwnProperty('ring')) {
      console.error(`Missing 'blip[*].ring' in ${filename}`);
    }
  }
  if (!content.hasOwnProperty('description')) {
    console.error(`Missing 'description' in ${filename}`);
  }
}

function createBlip(radar, creationDate, entry, htmlFile, sourceFile) {
  const blipAge = creationDate.getTime() - new Date(entry.blip.last().date).getTime();

  let blip = {
    label: entry.shortname ? entry.shortname : entry.name,
    quadrant: 0,
    since: dateFormat(new Date(entry.blip[0].date)),
    ring: radar.rings.indexOf(entry.blip.last().ring),
    moved: blipAge < THIRTY_DAYS,
    link: path.relative(radar.outputDir, htmlFile),
    active: true,
  };

  findQuadrant(radar, sourceFile, (i, q) => blip.quadrant = i);

  if (entry.hasOwnProperty('active')) {
    blip.active = entry.active;
  }

  let ringName = entry.blip.last().ring;
  blip.ringName = ringName.charAt(0) + ringName.substr(1).toLowerCase();

  if (entry.blip.length > 1) {
    blip.history = [];
    entry.blip.forEach(p => blip.history.push({
      date: dateFormat(new Date(p.date)),
      ringName: p.ring.charAt(0) + p.ring.substr(1).toLowerCase(),
    }));
  }

  return blip;
}

function cleanAll(outputDir) {
  console.log(`Clean ${outputDir}`);
  fs.removeSync(outputDir);
}

module.exports = {
  build: buildRadar,
  clean: cleanAll,
};

// Command-line entry point.
process.argv.slice(2).forEach(function(val, index, array) {
  if (val === '--clean') {
    cleanAll('build');
  }
  if (val === '--build') {
    buildRadar('build', 'radar');
  }
});
