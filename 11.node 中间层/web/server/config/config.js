module.exports = {
    apiName: "/api/sdcm",
    port: 7777,//端口
    development: process.env.NODE_ENV || "production", //开发版本
    url: "http://192.168.0.123:8085"  //访问接口
};
