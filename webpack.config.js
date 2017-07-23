/*
    ./webpack.config.js
*/
const path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
          template: './client/index.html',
          filename: 'index.html',
          inject: 'body'
      }),
      ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [/*
        'webpack-dev-server/client?https://dev.fochlac.com',*/
        './client/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'client/dist'),
        filename: 'index_bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        HtmlWebpackPluginConfig
    ]
}
