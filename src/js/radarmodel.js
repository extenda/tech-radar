const packageVersion = require('../../package.json').version;

// Tech radar object model. Used by the builder.
module.exports = {
  createModel: () => {
    const radar = {
      title: 'Extenda Retail Tech Radar',
      version: packageVersion,

      // Quadrants in the radar visualization order.
      quadrants: [
        {
          dirname: 'data_management',
          name: 'Data Management',
        },
        {
          dirname: 'infrastructure_config',
          name: 'Infrastructure & Configuration',
        },
        {
          dirname: 'languages_language_frameworks',
          name: 'Languages & Libraries',
        },
        {
          dirname: 'system_frameworks_techniques',
          name: 'Frameworks & Techniques',
        },
      ],
      // Quadrants in the order we want them in the navbar.
      quadrantsNavigation: function quadrantsNavigation() {
        return [
          this.quadrants[0],
          this.quadrants[1],
          this.quadrants[2],
          this.quadrants[3],
        ];
      },
      rings: [
        'ADOPT',
        'TRIAL',
        'ASSESS',
        'HOLD',
      ],
      blips: [],
      entries: function entries() {
        return JSON.stringify(this.blips, null, 2);
      },
    };

    for (const q of radar.quadrants) {
      q.adopt = [];
      q.assess = [];
      q.trial = [];
      q.hold = [];
    }

    return radar;
  },
};
