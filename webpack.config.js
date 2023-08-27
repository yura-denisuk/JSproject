const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry: './src/utils/app.js',
    mode: "development",
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: "./dist",
        compress: true,
        port: 9000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "static/images", to: "images"},
                {from: "static/scripts", to: "scripts"},
            ],
        }),],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },



    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             exclude: /node_modules/,
    //             use: {
    //                 loader: 'babel-loader',
    //                 options: {
    //                     presets: [
    //                         ['@babel/preset-env', { targets: "defaults" }]
    //                     ]
    //                 }
    //             }
    //         }
    //     ]
    // },
};