
const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
    context: __dirname + '/src',
    entry: {
        build: 'index.js'
    },
    devtool: 'cheap-inline-module-source-map',
    output: {
        path: __dirname + '/public',
        publicPath: "/",
        filename: "[name].js"
    },
    watch: NODE_ENV == 'development',
    resolve: {
        modulesDirectories: ['node_modules', './src'],
        extensions: ['', '.js', '.less', '.jsx']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader', '*'],
        extensions: ['', '.js']
    },
    module: {

        loaders: [{
            test:   /\.jsx?$/,
            loader: "babel"
        }, {
            test:   /\.less$/,
            loader: 'style!css!autoprefixer?browsers=last 2 versions!less'
        }, {
            test:   /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
            loader: 'file?name=[path][name].[ext]'
        }]

    },

    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: __dirname + '/public',
        hot: true
    }
};