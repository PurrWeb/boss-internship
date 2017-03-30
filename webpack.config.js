var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: ['./app/frontend/index.js'],
  },
  output: {
    path: __dirname + '/public/assets/bundles',
    filename: 'frontend_bundle.js'
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
    })
  ]
};
