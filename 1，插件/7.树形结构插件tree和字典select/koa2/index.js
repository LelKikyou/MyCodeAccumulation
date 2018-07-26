//koa-router 中间插件的使用
const Koa = require("koa");
const Router = require("koa-router");
const app = new Koa();
//父级路由
let api = new Router();
let router = new Router();
// core 跨域
const cors = require("koa2-cors");
const JsonData = require("./data.json");
app.use(cors({
    origin: function (ctx) {
        return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
router
    .get("/select", async (ctx) => {
        ctx.body = JsonData.seller;
    })
    .get("/tree", async (ctx) => {
        ctx.body = JsonData.tree;
    });
api
    .use("/api", router.routes(), router.allowedMethods());
app
    .use(api.routes(), api.allowedMethods());


app.listen(3000, () => {
    console.log("启动成功！");
});