module.exports = (api) => {
  api.cache(true);
  return {
    env: {
      test: {
        plugins: [
          '@babel/plugin-transform-runtime',
        ],
      },
    },
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
        },
      ],
    ],
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
  };
};
