let {url} = require(pathRoot + '/config/config');
let Http = require(pathRoot + '/lib/axios.js');
const httpAxios = new Http(url);
module.exports = {
    login: () => {
        return httpAxios.axioseRquest({
            url: "/login"
        })
    }
};
