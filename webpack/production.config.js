const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const getConfig = require('./../webpack.config');

module.exports = function(env) {
  const config = getConfig(env);

  config.mode = 'none';
  config.devtool = 'source-map';
  config.optimization.usedExports = true;
  config.optimization.concatenateModules = true;
  config.optimization.noEmitOnErrors = true;
  config.optimization.nodeEnv = 'production';
  config.optimization.minimize = true;

  return config;
};