const util = require('util')

// Tech radar object model. Used by the builder.
module.exports = {
  createModel: function() {
    var radar = {
      title: 'Extenda Retail Tech Radar',
      edition: process.env.EDITION,
      quadrants: [
        {
          dirname: 'languages',
          name: 'Languages'
        },
        {
          dirname: 'infrastructure',
          name: 'Infrastructure'
        },
        {
          dirname: 'frameworks',
          name: 'Frameworks'
        },
        {
          dirname: 'data_management',
          name: 'Data Management'
        }
      ],
      rings: [
        'ADOPT',
        'TRIAL',
        'ASSESS',
        'HOLD'
      ],
      blips: [],
      entries: function() {
        return util.inspect(this.blips)
      }
    }

    for (var q of radar.quadrants) {
      q.adopt = []
      q.assess = []
      q.trial = []
      q.hold = []
    }

    return radar
  }
}
