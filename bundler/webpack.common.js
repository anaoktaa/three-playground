const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')


const htmlPageNames = ['basic', 'meshbasic', 'meshnormal', 'meshstandard'].map(
    (file) =>
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `../src/${file}.html`),
        minify: true,
        chunks: [file],
        filename: './' + file + '.html'
      })
);


module.exports = {
    entry: {
        basic: path.resolve(__dirname, '../src/basic.js'),
        meshbasic: path.resolve(__dirname, '../src/meshbasic.js'),
        meshnormal: path.resolve(__dirname, '../src/meshnormal.js'),
        meshstandard: path.resolve(__dirname, '../src/meshstandard.js'),
    },
    output:
    {
        hashFunction: 'xxhash64',
        filename: 'bundle.[name].js',
        path: path.resolve(__dirname, '../dist'),
        chunkFilename: '[id].[chunkhash].js'
    },
    devtool: 'source-map',
    plugins:
    [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../static') }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            minify: true,
            filename:"index.html",
            excludeChunks: ['basic', 'material']
        }),
        ...htmlPageNames,
        new MiniCSSExtractPlugin()
    ],
    module:
    {
        rules:
        [
            // HTML
            {
                test: /\.(html)$/,
                use:
                [
                    'html-loader'
                ]
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.css$/,
                use:
                [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/images/[hash][ext]'
                }
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                type: 'asset/resource',
                generator:
                {
                    filename: 'assets/fonts/[hash][ext]'
                }
            }
        ]
    }
}
