const {apiName} = require(pathRoot + '/config/config.js');
module.exports = function (app) {
    app.use(`${apiName}/login`, require("./controller/login"));
    app.use(`${apiName}/mainScreen`, require("./controller/mainScreen"));
    app.use(`${apiName}/criminalExecution`, require("./controller/criminalExecution"));
};
