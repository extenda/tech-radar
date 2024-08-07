const path = require('path');
const fs = require('fs');
const { build } = require('../src');

afterEach(() => {
  fs.rmSync(path.resolve(__dirname, '..', 'build'), { recursive: true });
});

test('It can build a radar', async () => {
  const outputFile = path.resolve(__dirname, '..', 'build', 'js', 'radar.json');
  await build(
    path.resolve(__dirname, 'radar', 'valid'),
    outputFile,
  );
  expect(fs.existsSync(outputFile)).toEqual(true);
});
