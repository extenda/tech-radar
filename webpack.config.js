const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
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
    maxEntrypointSize: 307200,
    maxAssetSize: 307200,
  },
  plugins: [
    // Build the radar YAMLs on first run, then watch for changes in dev-server.
    compiler => compiler.hooks.beforeRun.tapAsync('RadarBuilderPlugin', (params, callback) => {
      buildRadar().then(callback);
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
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
