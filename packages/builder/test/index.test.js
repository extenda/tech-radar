const path = require('path');
const fs = require('fs');
const builder = require('../src/index');

afterEach(() => {
  fs.rmSync(path.resolve(__dirname, '..', 'build'), { recursive: true });
});

test('It can build a radar', async () => {
  const outputFile = path.resolve(__dirname, '..', 'build', 'js', 'radar.json');
  await builder.build(path.resolve(__dirname, 'radar', 'valid'), outputFile);
  expect(fs.existsSync(outputFile)).toEqual(true);
});
