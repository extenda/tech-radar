const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const log = require('webpack-log');
const path = require('path');
const fs = require('fs');
const watch = require('watch');
const radarBuilder = require('./src/js/builder/builder');

const logger = log({ name: 'radar' });

const baseDir = __dirname;
const title = process.env.TITLE || 'Extenda Retail Tech Radar';

const outputPath = path.resolve(baseDir, 'build');
const radarDir = path.join(baseDir, 'radar');

const buildRadar = async (radarName) => {
  const jobs = [];
  if (!radarName || radarName === 'radar') {
    logger.info('Build JSON radar [radar]');
    jobs.push(radarBuilder.build(radarDir, path.join(outputPath, 'js', 'radar.json')));
  }

  const toolRadarPath = path.join(baseDir, 'radar_it');

  if ((!radarName || radarName === 'radar_it') && fs.existsSync(toolRadarPath)) {
    logger.info('Build JSON radar [radar_it]');
    jobs.push(radarBuilder.build(toolRadarPath, path.join(outputPath, 'js', 'radar_it.json')));
  }
  await Promise.all(jobs);
};

const launchDarklyClientId = () => process.env.LD_CLIENT_ID || '';

module.exports = (env, argv) => {
  const webpack = {
    devServer: {
      static: [
        { directory: outputPath },
        { directory: path.resolve(__dirname, 'src/assets') },
      ],
      devMiddleware: {
        publicPath: '/',
      },
      historyApiFallback: {
        index: '/',
        disableDotRule: true,
      },
      setupMiddlewares: (middlewares) => {
        // Watch for changes to radar YAMLs and rebuild the JSON model.
        watch.watchTree(radarDir, () => {
          buildRadar().then(() => {
            logger.debug('Rebuilt radar model');
          });
          // buildRadar().then(() => {
          //   server.sockWrite(server.sockets, 'content-changed');
          // });
        });
        return middlewares;
      },
    },
    entry: {
      app: './src/js/index.jsx',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|gif|ico)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    optimization: {
      minimizer: [
        // `...`,
        new CssMinimizerPlugin(),
      ],
    },
    output: {
      path: outputPath,
      filename: 'js/[name].bundle.js',
      publicPath: '/',
    },
    performance: {
      maxEntrypointSize: 400 * 1024,
      maxAssetSize: 400 * 1024,
    },
    plugins: [
      // Build the radar YAMLs on first run, then watch for changes in dev-server.
      (compiler) => compiler.hooks.beforeRun.tapAsync('RadarBuilderPlugin', (params, callback) => {
        buildRadar().then(callback);
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
      }),
      new HtmlWebpackPlugin({
        hash: true,
        template: 'src/assets/index.html',
        templateParameters: {
          title,
        },
      }),
      new DefinePlugin({
        LD_CLIENT_ID: JSON.stringify(launchDarklyClientId(argv.mode)),
      }),
    ],
    resolve: {
      modules: ['node_modules', 'src/js/'],
      extensions: ['.js', '.jsx'],
      fallback: {
        fs: false,
        path: false, // For polyfill use require.resolve('path-browserify')
        buffer: false, // For polyfill use require.resolve('buffer')
      },
    },
    resolveLoader: {
      modules: ['node_modules'],
    },
  };

  if (process.env.BACKEND === '1') {
    // Add a proxy for the development server with JWT validation.
    webpack.devServer.proxy = [
      {
        context: '/js/radar.json',
        target: 'http://localhost:3000',
        secure: false,
      },
      {
        context: '/js/radar_it.json',
        target: 'http://localhost:3000',
        secure: false,
      },
    ];
  }

  return webpack;
};
