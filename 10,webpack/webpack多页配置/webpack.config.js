const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const optimizeCss = require('optimize-css-assets-webpack-plugin');//压缩css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    entry: { //抽离插件入口配置, index，就是文件名，可自定义
        app1: path.resolve(__dirname, './src/html1/index.js'),
        app2: path.resolve(__dirname, './src/html2/index.js'),
        $: "jquery"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {loader: 'postcss-loader', options: {plugins: [require("autoprefixer")()]}},
                ]
            },
            {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({//要使用就必须得new出来
            template: './src/html1/index.html',//生成的html文件可以使用定义好的模板，生成好的html文件会继承模板的所有内容，同时如果模板里面定义好了title，上面的title配置是不会生效的
            inject: true,   //inject  true 默认值，script标签位于html文件的 body 底部
            filename: 'index1.html',//生成的title文件的名称
            minify: {
                removeAttributeQuotes: true, // 移除属性的引号
                removeComments: true,//去掉注释
                // collapseWhitespace: true //去掉空格
            },
            hash: true,//是否产生hash值
            chunks: ["app1", "commons"],//加载那些js文件，这个js文件就是输出的js文件名,上面entry的属性名来定，不写默认都加载
        }),
        new HtmlWebpackPlugin({//要使用就必须得new出来
            template: './src/html2/index.html',//生成的html文件可以使用定义好的模板，生成好的html文件会继承模板的所有内容，同时如果模板里面定义好了title，上面的title配置是不会生效的
            inject: true,   //inject  true 默认值，script标签位于html文件的 body 底部
            filename: 'index2.html',//生成的title文件的名称
            minify: {
                removeAttributeQuotes: true, // 移除属性的引号
                removeComments: true,//去掉注释
                // collapseWhitespace: true //去掉空格
            },
            hash: true,//是否产生hash值
            chunks: ["commons", "app2", "$"],//加载那些js文件，这个js文件就是输出的js文件名,上面entry的属性名来定，不写默认都加载
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
        new optimizeCss()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',    //提取出来的文件命名
                    chunks: 'initial',  //initial表示提取入口文件的公共部分
                    minChunks: 2,       //表示提取公共部分最少的文件数
                    minSize: 0          //表示提取公共部分最小的大小
                }
            }
        }
    }
}