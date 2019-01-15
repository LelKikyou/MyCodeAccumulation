const merge = require('webpack-merge');
const common = require('./webpack.config.js');
module.exports = merge(common, {
    output: {
        path: "/", //热加载模式不能指定输出的文件地址，它输出的文件会缓存放在这里，你是看不到的，这里必须这样配置
        filename: "index.js"
    },
    devServer: {//webpack-server的配置
        host: '0.0.0.0',//服务显示的地址localhsot  127.0.0.1  本机的ip地址都可以
        port: 8090,//服务的端口号
        open: false,//服务启动是否打开浏览器，打开的都是默认的浏览器
        contentBase: './',//服务器加载的目录，会自动找到该目录下的index.html文件进行页面展示
        compress:true, //服务端压缩是否开启
        inline: true,//页面刷新方式
        /*       proxy: {//配置代理，因为我是前后台分离的，所以在调试的时候需要这个代理的配置才能向后台取数据
                   '/': {//代理所有的url请求
                       target: 'http://localhost:9876'//代理的地址，我的tomcat配置的端口是9876，如果你们配的不是那就需要修改这里了
                   }
               }*/
    },
    devtool: 'cheap-module-eval-source-map'//模仿vue的打包模式
});