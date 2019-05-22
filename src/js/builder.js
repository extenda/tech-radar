const fs = require('fs-extra');
const klawSync = require('klaw-sync');
const path = require('path');
const yaml = require('yaml');
const handlebars = require('handlebars');
const md = require('markdown-it')();
const radarModel = require('./radarmodel');

if (!Array.prototype.last) {
  // eslint-disable-next-line no-extend-native
  Array.prototype.last = function last() {
    return this[this.length - 1];
  };
}

const THIRTY_DAYS = 2592000000;

const templates = {};

const dateFormat = time => time.toLocaleString('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const initTemplates = () => {
  handlebars.registerPartial('footer', handlebars.compile(fs.readFileSync('src/templates/footer.hbs', 'utf8')));
  handlebars.registerHelper('markdown', value => md.render(value));

  templates.entryPage = handlebars.compile(fs.readFileSync('src/templates/entry_page.hbs', 'utf8'));
  templates.quadrantPage = handlebars.compile(fs.readFileSync('src/templates/quadrant_page.hbs', 'utf8'));
  templates.radarPage = handlebars.compile(fs.readFileSync('src/templates/index.hbs', 'utf8'));
};

// Build a list of related radar blips.
const buildRelatedLinks = (radar, content) => {
  const related = [];
  if (content.related) {
    content.related.forEach((file) => {
      try {
        const linked = yaml.parse(fs.readFileSync(path.join(radar.radarDir, file), 'utf8'));
        related.push({
          file: `${path.basename(file, '.yaml')}.html`,
          name: linked.name,
        });
      } catch (err) {
        console.error(`Related file not found: ${file}`, err.message);
      }
    });
  }
  return related.sort((a, b) => a.name.localeCompare(b.name));
};

// Find the quadrant and its index for a YAML source file.
const findQuadrant = (radar, sourceFile) => {
  const quadrant = path.relative(radar.radarDir, path.dirname(sourceFile));
  for (const [i, q] of radar.quadrants.entries()) {
    if (q.dirname === quadrant) {
      return {
        index: i,
        quadrant: q,
      };
    }
  }
  throw new Error(`Invalid quadrant source file ${sourceFile}.`);
};

// Create a radar blip entry.
const createBlip = (radar, creationDate, entry, htmlFile, sourceFile) => {
  const blipAge = creationDate.getTime() - new Date(entry.blip.last().date).getTime();
  const blip = {
    label: entry.shortname ? entry.shortname : entry.name,
    quadrant: findQuadrant(radar, sourceFile).index,
    since: dateFormat(new Date(entry.blip[0].date)),
    ring: radar.rings.indexOf(entry.blip.last().ring),
    moved: blipAge < THIRTY_DAYS,
    link: path.relative(radar.outputDir, htmlFile),
    active: true,
  };

  if (typeof entry.active !== 'undefined') {
    blip.active = entry.active;
  }

  const ringName = entry.blip.last().ring;
  blip.ringName = ringName.charAt(0) + ringName.substr(1).toLowerCase();

  if (entry.blip.length > 1) {
    blip.history = [];
    entry.blip.forEach(p => blip.history.push({
      date: dateFormat(new Date(p.date)),
      ringName: p.ring.charAt(0) + p.ring.substr(1).toLowerCase(),
    }));
  }

  return blip;
};

// Build the static radar HTML representation from the model and radar entries
const buildRadar = (outputDir = 'build', radarDir = 'radar', creationDate = new Date()) => {
  // Ensure directories exist
  fs.mkdirsSync(outputDir);
  fs.mkdirSync(path.join(outputDir, 'entries'));

  initTemplates();

  const radar = radarModel.createModel();
  radar.date = dateFormat(creationDate);
  radar.radarDir = radarDir;
  radar.outputDir = outputDir;

  console.log('Build radar', radar.version);

  console.log('  - Entries');

  // Create all the entries pages and collect blips.
  const klawOpts = {
    nodir: true,
    traverseAll: true,
    filter: p => path.extname(p.path) === '.yaml',
  };

  klawSync(radar.radarDir, klawOpts).forEach((f) => {
    const content = yaml.parse(fs.readFileSync(f.path, 'utf8'));
    const quadrant = findQuadrant(radar, f.path);

    content.quadrant = quadrant.quadrant;
    content.title = radar.title;
    content.version = radar.version;
    content.date = dateFormat(creationDate);

    const filename = path.join(outputDir, 'entries', `${path.basename(f.path, '.yaml')}.html`);

    // Add the entry to its radar quadrant
    radar.quadrants[quadrant.index][content.blip.last().ring.toLowerCase()].push({
      name: content.name,
      file: path.relative(outputDir, filename),
    });

    content.blip = createBlip(radar, creationDate, content, filename, f.path);
    if (content.blip.active) {
      radar.blips.push(content.blip);
    }
    content.related = buildRelatedLinks(radar, content);

    fs.writeFileSync(
      filename,
      templates.entryPage(content),
    );
  });

  // Create the quadrant index pages.
  console.log('  - Quadrants');
  for (const quadrant of radar.quadrants) {
    quadrant.title = radar.title;
    quadrant.version = radar.version;
    quadrant.date = dateFormat(creationDate);

    const sortFn = (a, b) => a.name.localeCompare(b.name);
    quadrant.adopt.sort(sortFn);
    quadrant.trial.sort(sortFn);
    quadrant.assess.sort(sortFn);
    quadrant.hold.sort(sortFn);
    fs.writeFileSync(path.join(outputDir, `${quadrant.dirname}.html`), templates.quadrantPage(quadrant));
  }

  // Create the main radar visualization
  console.log('  - Radar visualization');
  fs.writeFileSync(path.join(outputDir, 'index.html'), templates.radarPage(radar));

  // Copy static resources
  console.log('Copy resources');
  fs.copySync('src/resources', outputDir);
  fs.copySync('src/css', path.join(outputDir, 'css'));
};

const cleanAll = (outputDir = 'build') => {
  console.log(`Clean ${outputDir}`);
  fs.removeSync(outputDir);
};

module.exports = {
  build: buildRadar,
  clean: cleanAll,
  cleanBuild: () => {
    cleanAll();
    buildRadar();
  },
};
