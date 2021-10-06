const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
              test: /\.(jpg|png)$/,
              use: {
                loader: 'url-loader',
              },
            },
        ]
    },
    devServer: {
        contentBase: './'
    },
    devtool: 'inline-source-map'
};
