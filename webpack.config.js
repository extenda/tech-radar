const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const log = require('webpack-log');
const path = require('path');
const watch = require('watch');
const radarBuilder = require('./src/js/builder/builder');

const logger = log({ name: 'radar' });

const outputPath = path.resolve(__dirname, 'build');

const radarDir = path.join(__dirname, 'radar');

const buildRadar = () => {
  logger.info('Build JSON radar');
  return radarBuilder.build(radarDir);
};

module.exports = {
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
      watch.watchTree('radar', () => {
        buildRadar().then(() => {
          server.sockWrite(server.sockets, 'content-changed');
        });
      });
    },
  },
  entry: {
    'js/app': './src/js/index.jsx',
    'css/main': './src/assets/css/main.css',
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
  output: {
    path: outputPath,
    filename: '[name].bundle.js',
  },
  plugins: [
    compiler => compiler.hooks.done.tap('RadarBuilderPlugin', async () => {
      await buildRadar();
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyPlugin([
      { from: './src/assets/index.html', to: outputPath },
    ], {
      flatten: true,
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
