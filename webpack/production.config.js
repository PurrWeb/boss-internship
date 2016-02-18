const config = require('./../webpack.config');
var webpack = require('webpack');

config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: false,
      sourceMap: false
    })
);

module.exports = config;
