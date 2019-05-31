const dateFormat = time => time.toLocaleString('en', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const pick = (object, ...props) => {
  const picked = {};
  props.forEach((p) => {
    picked[p] = object[p];
  });
  return picked;
};

module.exports = {
  dateFormat,
  pick,
};
