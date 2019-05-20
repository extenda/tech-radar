// Start a development server with hot-reloading of content.

const server = require('live-server');
const watch = require('watch');
const builder = require('./builder');
const path = require('path');
const opts = {
  interval: 5,
  filter: path => {
    return /^(src|radar)/.test(path)
  },
};

watch.watchTree('.', opts, function(f, curr, prev) {
  console.log('Change detected. Rebuild radar');
  try {
    builder.clean('build');
    builder.build('build', 'radar');
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
  logLevel: 0
});
