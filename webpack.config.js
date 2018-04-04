var webpack = require('webpack');
var crypto = require('crypto');
var path = require('path');

// This plug-in outputs a json file with the paths of the generated assets
// so you can find them from somewhere else.
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({
  metadata: { version: crypto.randomBytes(20).toString('hex') },
});

var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const plugins = [
  assetsPluginInstance,
  new FriendlyErrorsWebpackPlugin({
    clearConsole: true,
  }),
  new webpack.HashedModuleIdsPlugin(),
];

module.exports = function(env) {
  if (env && env.analyze) {
    plugins.push(new BundleAnalyzerPlugin());
  }

  return {
    optimization: {
      runtimeChunk: { name: 'runtime' },
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            name: 'vendors',
          },
          assets: {
            test: /([\\/]assets[\\/])|(\.sass$)/,
            chunks: 'all',
            name: 'assets',
          }
        }
      }
    },

    bail: true,
    watch: false,
    mode: 'none',
    devtool: false,
    node: false,

    entry: {
      main: path.resolve('app/frontend/index.js'),
    },
    output: {
      path: path.join(__dirname, '/public/assets/bundles'),
      filename: 'frontend_bundle-[hash:50].js',
      chunkFilename: 'frontend_chunk-[name]-[chunkhash:50].js',
      publicPath: '/assets/bundles/',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            configFile: path.resolve('configs/tsconfig.json'),
          },
        },
        {
          test: /\.svg$/,
          loader: 'url-loader',
          options: {
            mimetype: 'image/svg+xml',
            limit: 30000,
          },
        },
        {
          test: /\.gif$/,
          loader: 'url-loader',
          options: {
            mimetype: 'image/gif',
            limit: 300000,
          },
        },
        {
          test: /\.png$/,
          loader: 'url-loader',
          options: {
            mimetype: 'image/png',
            limit: 30000,
          },
        },
        {
          test: /\.gif$/,
          loader: 'url-loader',
          options: {
            mimetype: 'image/gif',
            limit: 30000,
          },
        },
        {
          test: /\.(woff|woff2)$/,
          loader: 'url-loader',
          options: {
            mimetype: 'application/font-woff',
            limit: 300000,
          },
        },
        {
          test: /\.eot$/,
          loader: 'url-loader',
          options: {
            mimetype: 'application/vnd.ms-fontobject',
            limit: 300000,
          },
        },
        {
          test: /\.(ttf|otf)$/,
          loader: 'url-loader',
          options: {
            mimetype: 'application/octet-stream',
            limit: 300000,
          },
        },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.sass$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.js.jsx', '.ts', '.tsx'],
      modules: [path.resolve('node_modules')],
    },
    plugins: plugins,
  };

};