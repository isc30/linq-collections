function getConfig(mode)
{
    var config = {
        mode,
        entry: {
            "linq-collections": [
                './src/Linq.ts'
            ],
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    enforce: 'pre',
                    loader: 'tslint-loader',
                    exclude: [/node_modules/, /test/],
                    options: { /* Loader options go here */ }
                },
                {
                    test: /\.ts?$/,
                    use: 'awesome-typescript-loader'
                }
            ]
        },
        output: {
            filename: "[name].js",
            libraryTarget: "umd",
        },
    };

    return config;
}

module.exports = getConfig("production");
