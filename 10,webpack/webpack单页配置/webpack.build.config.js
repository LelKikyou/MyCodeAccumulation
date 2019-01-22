const path = require('path');
const merge = require('webpack-merge');//用于合并两个配置文件的工具
const common = require('./webpack.config.js');//加载之前定义的配置文件
module.exports = merge(common, {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "js/[name].js",//打包后输出的文件名，[name]就是使用入口文件的key做名称
    },
    devtool: 'source-map'//打包模式
});