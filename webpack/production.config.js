const config = require('./../webpack.config');
var webpack = require('webpack');

config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: false,
      sourceMap: false
  }),
  new webpack.DefinePlugin({
      'process.env': {
          'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
  })
);

module.exports = config;
