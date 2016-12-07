const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');
const PATHS = require('./lib/paths');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const validate = require('webpack-validator');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');

const common = {
  entry: [
    path.join(PATHS.scripts, 'multiselect.js'),
    path.join(PATHS.styles, 'multiselect.scss'),
  ],
  output: {
    path: PATHS.build,
    filename: 'multiselect.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.scss$/,
        loader: 'import-glob-loader',
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        include: PATHS.scripts,
        loader: 'babel',
      },
      {
        test: /\.scss$/,
        include: PATHS.styles,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('multiselect.css'),
  ],
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
};

let config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
  case 'postinstall':
    config = merge(
      common,
      {
        devtool: 'source-map',
        plugins: [
          new webpack.DefinePlugin({
            'process.env': {
              NODE_ENV: JSON.stringify('production'),
            },
          }),
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
            },
          }),
        ],
      }
    );
    break;

  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map',
        module: {
          preLoaders: [
            {
              test: /\.jsx?$/,
              loaders: ['eslint'],
            },
          ],
        },
        plugins: [
          new StyleLintPlugin({
            configFile: './.stylelintrc.json',
            context: PATHS.styles,
            syntax: 'scss',
          }),
          new WebpackNotifierPlugin(),
        ],
      }
    );
}

module.exports = validate(config);
