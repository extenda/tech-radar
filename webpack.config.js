const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
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
      contentBase: [
        outputPath,
        path.resolve(__dirname, 'src/assets'),
      ],
      publicPath: '/',
      historyApiFallback: {
        index: '/',
        disableDotRule: true,
      },
      after: (app, server) => {
        watch.watchTree(radarDir, () => {
          buildRadar().then(() => {
            server.sockWrite(server.sockets, 'content-changed');
          });
        });
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
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            'css-loader',
          ],
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
    node: {
      fs: 'empty',
    },
    optimization: {
      minimizer: [
        new TerserJSPlugin({}),
        new OptimizeCSSAssetsPlugin({}),
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
    },
    resolveLoader: {
      modules: ['node_modules'],
    },
  };

  if (process.env.BACKEND === '1') {
    // Add a proxy for the development server with JWT validation.
    webpack.devServer.proxy = {
      '/js/radar.json': {
        target: 'http://localhost:3000',
        secure: false,
      },
      '/js/radar_it.json': {
        target: 'http://localhost:3000',
        secure: false,
      },
    };
  }

  return webpack;
};
