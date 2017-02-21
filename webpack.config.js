const webpack = require('webpack');

const isProd = process.argv.includes('-p');

const nodeEnv = isProd ? 'production' : 'development';

const plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(nodeEnv)  // NODE_ENV: '"production"' for decreasing size of react library
        }
    })
];

module.exports = {
    devtool: isProd ? 'source-map' : 'eval',
    entry: {
        main: ['./app/frontend/index.js'],
    },
    output: {
        filename: 'frontend_bundle.js',
        path: __dirname + '/app/assets/javascripts/bundles'
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
                                './node_modules'
                            ]
                        }
                    }
                ]
            }
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
