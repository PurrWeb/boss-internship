const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProd = process.argv.includes('-p');

const nodeEnv = isProd ? 'production' : 'development';
const sourcePath = pathFromRoot('./src');
const outputPath = pathFromRoot('./public');

function pathFromRoot(url = '') {
  return path.resolve(__dirname, '..', url);
}

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'img', 'fonts', 'manifest']
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv)  // NODE_ENV: '"production"' for decreasing size of react library
    }
  }),
  new HtmlWebpackPlugin({
    filename: pathFromRoot('./public/index.html'),
    template: `${sourcePath}/index.ejs`
  })
];

module.exports = {
  devtool: isProd ? 'source-map' : 'eval',
  context: sourcePath,
  entry: {
    bundle: './index.tsx',
    img: '../resources/img/index.js',
    fonts: '../resources/fonts/index.js',
    vendor: [
      'classnames',
      'query-string',
      'ramda',
      'react',
      'react-addons-create-fragment',
      'react-dom',
      'react-redux',
      'react-redux-form',
      'redux',
      'redux-observable',
      'rxjs',
      'tcomb-validation',
      'tslib',
      'validator'
    ]
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: outputPath
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
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFileName: pathFromRoot('./configs/tsconfig.json')
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
          limit: 30000
        }
      },
      {
        test: /\.eot$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/vnd.ms-fontobject',
          limit: 30000
        }
      },
      {
        test: /\.(ttf|otf)$/,
        loader: 'url-loader',
        options: {
          mimetype: 'application/octet-stream',
          limit: 30000
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                pathFromRoot('./node_modules')
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [
      sourcePath,
      'node_modules'
    ]
  },
  plugins: plugins
};
