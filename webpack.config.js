function getConfig(mode, postFix)
{
    var config = {
        mode,
        entry: {
            "linq-collection": [
                './src/WebLinq.ts'
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
            filename: `[name].${postFix}.js`,
        },
    };

    return config;
}

module.exports = [
    getConfig("production", "bundle.min"),
    getConfig("development", "bundle")
];
