const WebpackNotifierPlugin = require('webpack-notifier');
const config = require('./../webpack.config');

config.plugins.push(new WebpackNotifierPlugin());
config.devtool = 'source-map';

module.exports = config;
