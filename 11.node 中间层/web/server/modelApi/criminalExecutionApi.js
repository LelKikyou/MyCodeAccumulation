let {url} = require(pathRoot + '/config/config');
let Http = require(pathRoot + '/lib/axios.js');
const httpAxios = new Http(url);
module.exports = {
    /*刑事执行-监狱*/
    //监狱首页
    getCriminalPrison: (params) => {
        return httpAxios.axioseRquest({
            method: "get",
            url: "/prisons/showByProvinceCode",
            params: params
        })
    },
    //监狱详情
    getCriminalPrisonDetails: (params) => {
        return httpAxios.axioseRquest({
            method: "get",
            url: "/prisonsinfo/showByDwdm",
            params: params
        })
    },
    //监狱列表
    getShowPrisonListByProvinceCode: (params) => {
        return httpAxios.axioseRquest({
            method: "get",
            url: "/prisons/showPrisonListByProvinceCode",
            params: params
        })
    },
    //罪犯信息
    getCriminalInfo: (params) => {
        return httpAxios.axioseRquest({
            method: "get",
            url: "/criminalinfo/showByZfbh",
            params: params
        })
    },
    getShowcriminalssummaryinfoByZfbh: (params) => {
        return httpAxios.axioseRquest({
            method: "get",
            url: "/criminalinfo/showcriminalssummaryinfoByZfbh",
            params: params
        })
    }
};
