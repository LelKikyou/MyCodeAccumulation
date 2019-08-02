const {apiName} = require(pathRoot + '/config/config.js');
let loginRouter = require("./api/login");
module.exports = function (app) {
    app.use(`${apiName}/login`, loginRouter);
};
