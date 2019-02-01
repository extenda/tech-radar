const fs = require('fs-extra')
const klawSync = require('klaw-sync')
const path = require('path')
const yaml = require('yaml')
const handlebars = require('handlebars')
const md = require('markdown-it')()
const radarModel = require('./radarmodel')

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1]
  }
}

// Build the static radar HTML representation from the model and radar entries
function buildRadar(outputDir, radarDir, version, creationDate = new Date()) {

  // Ensure directories exist
  fs.mkdirsSync(outputDir)
  fs.mkdirSync(path.join(outputDir, 'entries'))

  handlebars.registerPartial('footer', handlebars.compile(fs.readFileSync('templates/footer.hbs', 'utf8')))
  handlebars.registerHelper('markdown', value => md.render(value))

  const entryPage = handlebars.compile(fs.readFileSync('templates/entry_page.hbs', 'utf8'))
  const quadrantPage = handlebars.compile(fs.readFileSync('templates/quadrant_page.hbs', 'utf8'))
  const radarPage = handlebars.compile(fs.readFileSync('templates/index.hbs', 'utf8'))

  var radar = radarModel.createModel(version)
  radar.date = dateFormat(creationDate)
  radar.radarDir = radarDir
  radar.outputDir = outputDir

  console.log('Build radar', radar.version)

  console.log('  - Entries')

  // Create all the entries pages and collect blips.
  for (var f of klawSync(radar.radarDir, { nodir: true, traverseAll: true, filter: p => path.extname(p.path) === '.yaml' })) {
    var content = yaml.parse(fs.readFileSync(f.path, 'utf8'))
    validateYaml(f.path, content)
    var quadrantIndex = 0
    findQuadrant(radar, f.path, (i, q) => {
      content.quadrant = q
      quadrantIndex = i
    })

    content.title = radar.title
    content.version = radar.version
    content.date = dateFormat(creationDate)

    const filename = path.join(outputDir, 'entries', path.basename(f.path, '.yaml') + '.html')

    radar.quadrants[quadrantIndex][content.blip.last().ring.toLowerCase()].push({
      name: content.name,
      file: path.relative(outputDir, filename)
    })

    const blip = createBlip(radar, content, filename, f.path)
    if (blip.active) {
      radar.blips.push(blip)
    }

    content.blip = blip

    fs.writeFileSync(
      filename,
      entryPage(content)
    )
  }

  // Create the quadrant index pages.
  console.log('  - Quadrants')
  for (var q of radar.quadrants) {
    q.title = radar.title
    q.version = radar.version
    q.date = dateFormat(creationDate)

    const sortFn = (a, b) => a.name.localeCompare(b.name)
    q.adopt.sort(sortFn)
    q.trial.sort(sortFn)
    q.assess.sort(sortFn)
    q.hold.sort(sortFn)

    fs.writeFileSync(path.join(outputDir, q.dirname + '.html'), quadrantPage(q))
  }

  // Create the main radar visualization
  console.log('  - Radar visualization')
  fs.writeFileSync(path.join(outputDir, 'index.html'), radarPage(radar))

  if (outputDir == 'build') {
    // Copy static resources
    console.log('Copy resources')
    fs.copySync('app', outputDir)
  }
}

function dateFormat(time) {
  return time.toLocaleString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function findQuadrant(radar, sourceFile, callback) {
  const quadrant = path.relative(radar.radarDir, path.dirname(sourceFile))
  for (const [i, q] of radar.quadrants.entries()) {
    if (q.dirname === quadrant) {
      callback(i, q)
      break
    }
  }
}

// Validate all required properties in the radar YAML entries
function validateYaml(filename, content) {
  if (!content.hasOwnProperty('name')) {
    console.error(`Missing 'name' in ${filename}`)
  }
  if (!content.hasOwnProperty('blip')) {
    console.error(`Missing 'blip' in ${filename}`)
  }
  if (!Array.isArray(content.blip)) {
    console.error(`'blip' is not an array in ${filename}`)
  }
  for (var blip of content.blip) {
    if (!blip.hasOwnProperty('version')) {
      console.error(`Missing 'blip[*].version' in ${filename}`)
    }
    if (!blip.hasOwnProperty('ring')) {
      console.error(`Missing 'blip[*].ring' in ${filename}`)
    }
  }
  if (!content.hasOwnProperty('description')) {
    console.error(`Missing 'description' in ${filename}`)
  }
}

function createBlip(radar, entry, htmlFile, sourceFile) {
  var blip = {
    label: entry.shortname ? entry.shortname : entry.name,
    quadrant: 0,
    since: entry.blip[0].version,
    ring: radar.rings.indexOf(entry.blip.last().ring),
    moved: entry.blip.last().version == radar.version,
    link: path.relative(radar.outputDir, htmlFile),
    active: true
  }

  if (!blip.moved && entry.blip.length > 1) {
    blip.moved = entry.blip[entry.blip.length - 2].ring !== blip.ring
  }

  findQuadrant(radar, sourceFile, (i, q) => blip.quadrant = i)

  if (entry.hasOwnProperty('active')) {
    blip.active = entry.active
  }

  let ringName = entry.blip.last().ring
  blip.ringName = ringName.charAt(0) + ringName.substr(1).toLowerCase()

  if (entry.blip.length > 1) {
    blip.history = []
    for (var p of entry.blip) {
      blip.history.push({
        version: p.version,
        ringName: p.ring.charAt(0) + p.ring.substr(1).toLowerCase()
      })
    }
  }

  return blip
}

function cleanAll(outputDir) {
  console.log(`Clean ${outputDir}`)
  fs.removeSync(outputDir)
}

module.exports = {
  build: buildRadar,
  clean: cleanAll
}

// Command-line entry point.
process.argv.slice(2).forEach(function(val, index, array) {
  if (val === '--clean') {
    cleanAll('build')
  }
  if (val === '--build') {
    buildRadar('build', 'radar')
  }
})
