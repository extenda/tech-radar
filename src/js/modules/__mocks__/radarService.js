const mockQuadrants = [
  { name: 'Test 1', dirname: 'test1' },
  { name: 'Test 2', dirname: 'test2' },
  { name: 'Development', dirname: 'dev' },
  { name: 'Test 4', dirname: 'test4' },
];

const mockEntries = {
  java: {
    name: 'Java',
    blip: {
      label: 'Java',
      quadrant: 2,
      since: 'Mar 20, 2018',
      ring: 0,
      ringName: 'Adopt',
      moved: false,
      link: '/entries/java.html',
      active: true,
    },
    description: 'Description',
    rationale: 'Rationale',
    related: [
      { file: 'php.html', name: 'PHP' },
    ],
    quadrant: { index: 2, dirname: 'dev' },
    filename: 'java.html',
    tags: [
      '90\'s',
      'java',
    ],
  },
  lisp: {
    name: 'Lisp',
    blip: {
      label: 'Lisp',
      quadrant: 2,
      since: 'Jan 1, 1970',
      ring: 3,
      ringName: 'Hold',
      moved: false,
      link: '/entries/lisp.html',
      active: false,
      history: [
        { date: 'Jan 1, 1970', ringName: 'Adopt' },
        { date: 'Mar 20, 2018', ringName: 'Hold' },
      ],
    },
    description: 'Description',
    rationale: 'Rationale',
    quadrant: { index: 2, dirname: 'dev' },
    filename: 'lisp.html',
    tags: [],
  },
  php: {
    name: 'PHP',
    logo: 'https://www.php.net/images/logos/php-logo.svg',
    blip: {
      label: 'PHP',
      quadrant: 2,
      since: 'Jan 1, 2004',
      ring: 3,
      ringName: 'Hold',
      moved: false,
      link: '/entries/php.html',
      active: true,
      history: [
        { date: 'Jan 1, 2004', ringName: 'Adopt' },
        { date: 'Mar 20, 2018', ringName: 'Hold' },
      ],
    },
    description: 'Description',
    rationale: 'Rationale',
    quadrant: { index: 2, dirname: 'dev' },
    filename: 'php.html',
    tags: [
      '90\'s',
    ],
  },
};

const mockBlips = [
  {
    label: 'Java',
    quadrant: 2,
    ring: 0,
    moved: false,
    link: '/entries/java.html',
    active: true,
  },
  {
    label: 'PHP',
    quadrant: 2,
    ring: 3,
    moved: false,
    link: '/entries/php.html',
    active: true,
  },
];

export default {
  init: () => Promise.resolve(true),
  listBlips: (tags = []) => {
    if (tags.length === 1 && tags[0] === 'java') {
      return [mockBlips[0]];
    }
    return mockBlips;
  },
  listTags: () => ['90\'s', 'java'],
  getQuadrant: (dirname) => {
    if (dirname === 'missing') {
      return null;
    }

    return {
      name: 'Test',
      dirname: 'test1',
      adopt: [
        { name: 'A - 1', filename: '1.html' },
        { name: 'B - 2', filename: '2.html' },
      ],
      trial: [],
      assess: [
        { name: 'C - 3', filename: '3.html' },
      ],
      hold: [
        { name: 'D - 4', filename: '4.html' },
        { name: 'E - 5', filename: '5.html' },
        { name: 'F - 6', filename: '6.html' },
      ],
    };
  },
  listEntriesByTag: (tag) => {
    if (tag === 'java') {
      return [mockEntries.java];
    }
    return [];
  },
  getEntry: entry => mockEntries[entry],
  model: {
    title: 'Test',
    formattedDate: '5 June, 2019',
    version: '0.0.1-local',
    quadrants: mockQuadrants,
    quadrantsNavBar: mockQuadrants,
    rings: [
      'ADOPT',
      'TRIAL',
      'ASSESS',
      'HOLD',
    ],
  },
};
