apidoc 配置文档
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
