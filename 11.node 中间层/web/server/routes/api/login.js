var express = require('express');
var router = express.Router();

let {url} = require(pathRoot + '/config/config');
let Http = require(pathRoot + '/lib/axios.js');

const httpAxios = new Http(url);
/**
 * @api {post} /login 获取用户信息
 * @apiDescription 获取用户信息
 * @apiName login
 * @apiGroup Login
 * @apiParam {string} username 用户名
 * @apiParam {string} age 年龄
 * @apiSuccess  user 返回user
 * @apiSuccessExample {json} Success-Response:
 *  {"user":""}
 * @apiSampleRequest http://localhost:3001/api/sdcm/login
 * @apiVersion 1.0.0
 */

router.get('', function (req, res) {
    httpAxios.axioseRquest({
        url: "/sdcm/GetMainList"
    }).then(data => {
        res.status(200).json(data);
    })
});

module.exports = router;
