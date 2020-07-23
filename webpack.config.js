const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const log = require('webpack-log');
const path = require('path');
const watch = require('watch');
const radarBuilder = require('./src/js/builder/builder');

const logger = log({ name: 'radar' });

const baseDir = process.env.BASEDIR || __dirname;
const title = process.env.TITLE || 'Extenda Retail Tech Radar';

const outputPath = path.resolve(baseDir, 'build');

const radarDir = path.join(baseDir, 'radar');

const buildRadar = () => {
  logger.info('Build JSON radar');
  return radarBuilder.build(radarDir);
};

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
  };
}

module.exports = webpack;
