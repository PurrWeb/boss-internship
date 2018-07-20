const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const defaultConfigHash = require('hard-source-webpack-plugin/lib/default-config-hash.js');

const getConfig = require('./../webpack.config');

module.exports = function(env) {
  const config = getConfig(env);

  config.mode = 'development';
  config.devtool = 'source-map';
  config.optimization.nodeEnv = 'development';

  config.plugins.push(new HardSourceWebpackPlugin({
    configHash: function(webpackConfig) {
      webpackConfig = Object.assign({}, webpackConfig, {
        watch: true
      });

      return defaultConfigHash(webpackConfig);
    }
  }));

  return config;
};
