let {url} = require(pathRoot + '/config/config');
let Http = require(pathRoot + '/lib/axios.js');
const httpAxios = new Http(url);
module.exports = {
    mainScreen: () => {
        return httpAxios.axioseRquest({
            method: "get",
            url: "/home"
        })
    }
};
