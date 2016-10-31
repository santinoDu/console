var webpack = require('webpack')

module.exports = {
    entry: './src/main.js',
    output: {
        path: './build',
        filename: 'build.js'
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
    }
}
