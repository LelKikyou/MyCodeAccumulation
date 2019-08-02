var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');//解决history访问不到的问题
global.pathRoot = path.resolve(__dirname);//定义文件根路径
const {development} = require('./config/config.js');
var indexRouter = require('./routes/index');

var app = express();
//开发环境设置跨域
if (development === "dev") {
    app.all('*', (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(history({ //遇到/api 时候返回原来的路径
    rewrites: [
        {
            from: /\/api/,
            to: function (context) {
                return context.parsedUrl.path
            }
        }
    ]
}));

//加载路由api,开发环境加载api文档
indexRouter(app);
if (development !== "dev") {
    app.use(express.static(path.join(__dirname, '/public/dist')));
} else {
    app.use(express.static(path.join(__dirname, '/public/apidoc')));
}
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
