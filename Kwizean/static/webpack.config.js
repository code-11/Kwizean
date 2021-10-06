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
                test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
                loader: require.resolve('file-loader'),
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
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
