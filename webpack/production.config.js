const config = require('./../webpack.config');
var webpack = require('webpack');

config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
);

module.exports = config;
