module.exports = {
  automock: false,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: [
    'lcov',
    'text',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/js/lib/*.js',
    '!server/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js',
  },
  // transform: {
  //   '^.+\\.(js|jsx)$': 'babel-jest',
  // },
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'test-results',
        outputName: 'TEST-jest.xml',
      },
      'jest-sonar',
      {
        outputDirectory: 'test-results',
        outputName: 'sonar-report.xml',
      },
    ],
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],

  snapshotSerializers: ['enzyme-to-json/serializer'],

  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/server/',
  ],

  // rootDir: process.cwd(),
  testEnvironment: 'jsdom',
  // maxWorkers: '50%',
  // setupFiles: ['./jest.setup.js'],
};
