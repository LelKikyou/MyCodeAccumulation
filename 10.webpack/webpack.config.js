const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');//vue模板必须的
const HtmlWebpackPlugin = require("html-webpack-plugin");//生成index模板
const extractTextPlugin = require("extract-text-webpack-plugin");//分离css用
/*const glob = require('glob');
const PurgecssPlugin = require('purgecss-webpack-plugin');//现在是这个 好像对vue没效果*/
// const PurgecssPlugin = require('purifycss-webpack');//被废弃了
const webpack = require('webpack');//按需引入插件
const  copyWebpackPlugin= require("copy-webpack-plugin");//打包不需要的静态文件用，如readme.md
module.exports = {
    entry: { //抽离插件入口配置, index，就是文件名，可自定义
        index: path.resolve(__dirname, './src/main.js'),
        jquery: 'jquery',
        vue: 'vue'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue-loader'
        }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: extractTextPlugin.extract({
                fallback: "vue-style-loader",
                use: [
                    'css-loader',
                    {loader: 'postcss-loader', options: {plugins: [require("autoprefixer")()]}},
                ]
            })
        }, {
            test: /\.stylus$/,
            exclude: /node_modules/,
            use: extractTextPlugin.extract({
                fallback: "vue-style-loader",
                use: [
                    'css-loader',
                    'postcss-loader',//有执行顺序，从下到上执行，从右向左执行。
                    'stylus-loader'
                ],
            })
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.(png|jpg|gif)$/,
            exclude: /node_modules/,
            loader: 'url-loader',
            options: {
                outputPath: "images/",
                limit: 5,
                publicPath: "../images"
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({//要使用就必须得new出来
            template: './public/index.html',//生成的html文件可以使用定义好的模板，生成好的html文件会继承模板的所有内容，同时如果模板里面定义好了title，上面的title配置是不会生效的
            inject: true,   //inject  true 默认值，script标签位于html文件的 body 底部
            filename: 'index.html',//生成的title文件的名称
            minify: {
                removeAttributeQuotes: true, // 移除属性的引号
                removeComments: true,//去掉注释
                // collapseWhitespace: true //去掉空格
            },
            hash: true,//是否产生hash值
            // chunks: ["index"],//加载那些js文件，这个js文件就是输出的js文件名
            favicon: './public/f1.ico' //指定favicon
        }),
        new VueLoaderPlugin(),
        new extractTextPlugin("./css/index.css"),
        /*        new PurgecssPlugin({
                    paths: glob.sync(path.join(__dirname, 'src/!*.vue')),
                }),*/
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        new webpack.BannerPlugin('hqy版权所有'),//js.css文件版权说明，
        new copyWebpackPlugin([{
            from:__dirname+'/readme.md',
            to:'./public'
        }])
    ],
    optimization: {
        //抽取公共的代码和插件
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        }
    },
    watchOptions: {  //dev 默认开启watch
        //检测修改的时间，以毫秒为单位
        poll: 1000,
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout: 500,
        //不监听的目录
        ignored: /node_modules/
    }
};