var webpack = require('webpack');
var crypto = require('crypto');

// This plug-in outputs a json file with the paths of the generated assets
// so you can find them from somewhere else.
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({metadata: {version: crypto.randomBytes(20).toString('hex')}});

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: ['./app/frontend/index.js'],
  },
  output: {
    path: __dirname + '/public/assets/bundles',
    filename: 'frontend_bundle-[hash:50].js',
    publicPath: '/assets/bundles/'
  },
  module: {
    loaders: [
      {
        key: 'jsx',
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loaders: ['babel-loader']
      },
      {
        key: 'scss',
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {
        key: 'css',
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.js.jsx']
  },
  plugins: [
    new ExtractTextPlugin('../stylesheets/frontend_bundle.css', {
      allChunks: true
    }),
    assetsPluginInstance
  ]
};
