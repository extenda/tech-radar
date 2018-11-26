const fs = require('fs-extra')
const klawSync = require('klaw-sync')
const path = require('path')
const yaml = require('yaml')
const handlebars = require('handlebars')
const md = require('markdown-it')()
const radarModel = require('./radar_model')

const outputDir = 'build'

function buildRadar(archive) {

  handlebars.registerPartial('footer', handlebars.compile(fs.readFileSync('templates/footer.hbs', 'utf8')))
  handlebars.registerHelper('markdown', value => md.render(value))

  const entryPage = handlebars.compile(fs.readFileSync('templates/entry_page.hbs', 'utf8'))
  const quadrantPage = handlebars.compile(fs.readFileSync('templates/quadrant_page.hbs', 'utf8'))
  const radarPage = handlebars.compile(fs.readFileSync('templates/index.hbs', 'utf8'))

  console.log(`Clean ${outputDir}`)
  fs.removeSync(outputDir)
  fs.mkdirSync(outputDir)
  fs.mkdirSync(path.join(outputDir, 'entries'))

  console.log('Build radar')

  var radar = radarModel.createModel()
  radar.date = dateToday()

  console.log('  - Entries')

  for (var f of klawSync('radar', { nodir: true, traverseAll: true, filter: p => path.extname(p.path) === '.yaml' })) {
    var content = yaml.parse(fs.readFileSync(f.path, 'utf8'))
    validateYaml(f.path, content)
    var quadrantIndex = 0
    findQuadrant(radar, f.path, (i, q) => {
      content.quadrant = q
      quadrantIndex = i
    })

    content.title = radar.title
    content.edition = radar.edition
    content.date = dateToday()
    content.blip.ringName = content.blip.ring.charAt(0) + content.blip.ring.substr(1).toLowerCase()

    const filename = path.join(outputDir, 'entries', path.basename(f.path, '.yaml') + '.html')

    radar.quadrants[quadrantIndex][content.blip.ring.toLowerCase()].push({
      name: content.name,
      file: path.relative(outputDir, filename)
    })

    const blip = createBlip(radar, content, filename, f.path)
    if (blip.active) {
      radar.blips.push(blip)
    }
    fs.writeFileSync(
      filename,
      entryPage(content)
    )
  }

  console.log('  - Quadrants')
  for (var q of radar.quadrants) {
    q.title = radar.title
    q.edition = radar.edition
    q.date = dateToday()

    const sortFn = (a, b) => a.name.localeCompare(b.name)
    q.adopt.sort(sortFn)
    q.trial.sort(sortFn)
    q.assess.sort(sortFn)
    q.hold.sort(sortFn)

    fs.writeFileSync(path.join(outputDir, q.dirname + '.html'), quadrantPage(q))
  }

  console.log('  - Radar visualization')
  fs.writeFileSync(path.join(outputDir, 'index.html'), radarPage(radar))

  createArchive(radar, archive)

  console.log('Copy resources')
  fs.copySync('app', outputDir)
}

function dateToday() {
  return new Date().toLocaleString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function createArchive(radar, archive) {

  // Archive current edition
  const archiveDir = path.join('archive', radar.edition)
  if (fs.existsSync(archiveDir)) {
    fs.removeSync(archiveDir)
  }
  fs.mkdirSync(archiveDir)
  fs.mkdirSync(path.join(outputDir, 'archive'))

  if (archive) {
    console.log('Archive')
    fs.copySync(outputDir, archiveDir)
  }

  // Create archive page
  const archivePage = handlebars.compile(fs.readFileSync('templates/archive_page.hbs', 'utf8'))
  var editions = []
  for (var f of klawSync('archive', {nofile: true, depthLimit: 0, filter: p => path.basename(p.path) != radar.edition })) {
    const edition = path.basename(f.path)
    fs.copySync(f.path, path.join(outputDir, 'archive', edition))
    editions.push({
      edition: edition,
      created: f.stats.ctime.toLocaleString('en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    })
  }
  fs.writeFileSync(path.join(outputDir, 'archive', 'index.html'), archivePage({
    title: radar.title,
    name: 'Archive',
    date: dateToday(),
    edition: radar.edition,
    editions: editions
  }))
}

function findQuadrant(radar, sourceFile, callback) {
  const quadrant = path.relative('radar', path.dirname(sourceFile))
  for (const [i, q] of radar.quadrants.entries()) {
    if (q.dirname === quadrant) {
      callback(i, q)
      break
    }
  }
}

function validateYaml(filename, content) {
  if (!content.hasOwnProperty('name')) {
    console.error(`Missing 'name' in ${filename}`)
  }
  if (!content.hasOwnProperty('blip')) {
    console.error(`Missing 'blip' in ${filename}`)
  }
  if (!content.blip.hasOwnProperty('since')) {
    console.error(`Missing 'blip.since' in ${filename}`)
  }
  if (!content.blip.hasOwnProperty('ring')) {
    console.error(`Missing 'blip.ring' in ${filename}`)
  }
  if (!content.hasOwnProperty('description')) {
    console.error(`Missing 'description' in ${filename}`)
  }
}

function createBlip(radar, entry, htmlFile, sourceFile) {
  var blip = {
    label: entry.name,
    quadrant: 0,
    ring: radar.rings.indexOf(entry.blip.ring),
    moved: entry.blip.since === radar.edition,
    link: path.relative(outputDir, htmlFile),
    active: true
  }

  if (!blip.moved && entry.blip.hasOwnProperty('moved')) {
    blip.moved = entry.blip.moved
  }

  findQuadrant(radar, sourceFile, (i, q) => blip.quadrant = i)
  if (entry.blip.hasOwnProperty('active')) {
    blip.active = entry.blip.active
  }

  return blip
}

module.exports = {
  build: buildRadar
}

// Command-line entry point.
process.argv.slice(2).forEach(function(val, index, array) {
  if (val === '--build') {
    buildRadar(true)
  }
})
