var webpack = require('webpack');

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        singleRun: false,
        frameworks: ['mocha', 'sinon'],
        files: ['webpack/tests.config.js'],
        preprocessors: {
            'webpack/tests.config.js': ['webpack', 'sourcemap']
        },
        reporters: ['dots'],
        webpack: {
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
                        loader: 'babel-loader',
                        options: {
                            plugins: 'babel-plugin-rewire'
                        }
                    },
                    {
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        loader: 'ts-loader',
                        options: {
                            configFileName: './configs/tsconfig.json'
                        }
                    }
                ]
            },
            watch: true,
            resolve: {
                extensions: ['.js', '.jsx', '.js.jsx', '.ts', '.tsx'],
            },
            devtool: 'inline-source-map',
        },
        client: {
            mocha: {
                timeout: 5000
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};
