const fs = require('fs-extra')
const path = require('path')
const json = require('../package.json')

// Command-line entry point to change the edition in package.json.
process.argv.slice(2).forEach(function(val, index, array) {
  if (val === '--next') {
    json.config.radar.edition += 1
    console.log(`Change edition to ${json.config.radar.edition}`)
    fs.writeFileSync('package.json', JSON.stringify(json, null, 2))
  }
})
