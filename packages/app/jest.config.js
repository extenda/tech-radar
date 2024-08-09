module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/js/lib/*.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    'react-markdown': '<rootDir>/../../node_modules/react-markdown/react-markdown.min.js',
    'd3-selection': '<rootDir>/../../node_modules/d3-selection/dist/d3-selection.js',
    'd3-force': '<rootDir>/../../node_modules/d3-force/dist/d3-force.js',
  },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'TEST-jest.xml',
      },
    ],
    [
      'jest-sonar',
      {
        outputDirectory: 'test-results',
        outputName: 'sonar-report.xml',
      },
    ],
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testEnvironment: 'jsdom',
};
