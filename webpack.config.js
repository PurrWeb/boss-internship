var webpack = require('webpack');
var crypto = require('crypto');

// This plug-in outputs a json file with the paths of the generated assets
// so you can find them from somewhere else.
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin({metadata: {version: crypto.randomBytes(20).toString('hex')}});
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const plugins = [
  // new webpack.DefinePlugin({
  //   'process.env': {
  //     NODE_ENV: '"' + NODE_ENV + '"'  // NODE_ENV: '"production"' for decreasing size of react library
  //   }
  // }),
  assetsPluginInstance,
  new FriendlyErrorsWebpackPlugin({
    clearConsole: true,
  })
];

module.exports = {
  devtool: 'source-map',
  entry: {
    main: ['whatwg-fetch', './app/frontend/index.js'],
  },
  output: {
    path: __dirname + '/public/assets/bundles',
    filename: 'frontend_bundle-[hash:50].js',
    publicPath: '/assets/bundles/'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'tslint-loader',
        exclude: /node_modules/,
        options: {
          failOnHint: true
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFileName: './configs/tsconfig.json'
        }
      },
      {
        test: /\.svg$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/svg+xml',
          limit: 30000
        }
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        options: {
          mimetype: 'image/png',
          limit: 30000
        }
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/font-woff',
          limit: 300000
        }
      },
      {
        test: /\.eot$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/vnd.ms-fontobject',
          limit: 300000
        }
      },
      {
        test: /\.(ttf|otf)$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/octet-stream',
          limit: 300000
        }
      },
      {test: /\.css$/, loader: "style-loader!css-loader"},
      {test: /\.sass$/, loader: "style-loader!css-loader!sass-loader"},
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.js.jsx', '.ts', '.tsx'],
    modules: [
      'node_modules'
    ]
  },
  plugins: plugins
};
