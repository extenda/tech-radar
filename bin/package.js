const git = require('simple-git/promise')('.')
const builder = require('./builder')
const path = require('path')
const fs = require('fs-extra')
const packageVersion = require('../package.json').version

function validateStatus(status) {
  for (var f of status.files) {
    if (/radar\//.test(f.path)) {
      console.error("Detected modified radar entries. Can't build archive!")
      process.exit(1)
    }
  }
}

(async() => {
  let status = await git.status()
  validateStatus(status)

  if (!fs.existsSync('build')) {
    fs.mkdirSync('build')
  }

  let outputDir = path.join('build', 'archive')
  fs.removeSync(outputDir)
  fs.mkdirSync(outputDir)

  let archiveDir = 'archive'
  fs.removeSync(archiveDir)

  let tags = await git.tags()
  let archiveDates = {}
  for (var [i, tag] of tags.all.entries()) {
    if (tag.startsWith('v')) {
      let version = tag.substring(1)
      let creationDate = new Date((await git.log(['-1', tag])).latest.date)

      archiveDates[version] = creationDate

      fs.mkdirSync(archiveDir)

      // Checkout historic radar blips
      await git.raw(['read-tree', tag])
      await git.raw(['checkout-index', '-a', '--prefix=archive/'])
      await git.raw(['read-tree', 'HEAD'])

      // Build the radar
      let radarDir = path.join('archive', 'radar')

      if (i === tags.all.length - 1) {
        // This is the most recently released radar
        builder.build('build', radarDir, version, creationDate, archiveDates)
      } else {
        builder.build(path.join(outputDir, version), radarDir, version, creationDate)
      }

      // Remove historic radar
      fs.removeSync(archiveDir)
    }
  }

  const head = await git.revparse(['--short', 'HEAD'])
  if (tags.all.length === 0) {
    // No tags exist. Publish latest to root.
    builder.build('build', 'radar', head.trim())
  } else if (tags.all[tags.all.length - 1] !== packageVersion) {
    // Latest was not tagged, it should be built.
    builder.build(path.join('build', 'latest'), 'radar', head.trim())
  }

})()
