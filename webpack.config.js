'use strict';

let path = require('path');
let webpack = require('webpack');

let entries = [
    './src/BubbleSDK.class.js'
];
let pluginParams = {};
let outputBaseFile = 'BubblesSDK';
let outputFilename = outputBaseFile;
let sourceMaps = '';
let isDebug = false;

if(typeof process.env.NODE_ENV === 'undefined' || process.env.NODE_ENV === 'development') {
    console.log('Compiling for development');
    entries.unshift('soda-sandbox');
    pluginParams['window.BubbleAPI'] = 'soda-sandbox';
    sourceMaps = 'source-map';
    isDebug = true;
} else {
    console.log('Compiling for production');
    outputFilename += '.min';
}

//noinspection SpellCheckingInspection,JSUnresolvedFunction
module.exports = {
    devtool: sourceMaps,
    entry: entries,
    debug: isDebug,
    output: {
        path: path.resolve('./public/assets'),
        publicPath: '/public/assets/',
        filename: outputFilename + '.js'
    },
    plugins: [
        new webpack.ProvidePlugin(pluginParams)
    ],
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            {
                test: require.resolve('./src/BubbleSDK.class.js'),
                loader: 'expose?BubbleSDK'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.json$/,
                exclude: /node_moduls/,
                loader: "json-loader"
            }
        ]
    }
};
