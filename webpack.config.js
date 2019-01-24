module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './akara.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            { test: /\.(t|j)sx?$/, use: ['ts-loader', 'eslint-loader'] },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ]
    },
    devtool: 'source-map'
};
