var path = require('path');
var webpack = require('webpack');

var entries = [
    'soda-sandbox',
    './src/bubble_sdk.js'
];
// var pluginParams = {};

// if(process.env.NODE_ENV === 'development') {
//     entries.unshift('soda-sandbox');
//     pluginParams["window.BubbleAPI"] = "soda-sandbox";
// }

module.exports = {
    devtool: 'source-map',
    entry: entries,
    debug: true,
    output: {
        path: path.resolve('./public/assets'),
        publicPath: '/public/assets/',
        filename: 'bubble_sdk_bundle.js'
    },
    plugins: [
        // new webpack.ProvidePlugin(pluginParams)
    ],
    module: {
        loaders: [
            {
                test: require.resolve('soda-sandbox'),
                loader: 'expose?BubbleAPI'
            },
            {
                test: require.resolve('./src/bubble_sdk.js'),
                loader: 'expose?BubbleSdk'
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
