// Start a development server with hot-reloading of content.

const server = require('live-server');
const watch = require('watch');
const builder = require('./builder');

const opts = {
  interval: 5,
  filter: path => /^(src|radar)/.test(path),
};

watch.watchTree('.', opts, () => {
  console.log('Change detected. Rebuild radar');
  try {
    builder.cleanBuild();
  } catch (e) {
    console.error('Failed to build radar. Will continue to try\n', e);
  }
});

server.start({
  port: 3000,
  root: 'build',
  watch: 'build',
  open: false,
  wait: 1000,
  logLevel: 0,
});
