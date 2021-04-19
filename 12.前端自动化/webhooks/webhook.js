var http = require("http")
var shell = require("shelljs")
var createHandler = require("gitee-webhook-handler")
var handler = createHandler({ path: "/webhooks_push", secret: "123456" }) //# post 所需要用到的秘钥

function run_cmd() {
  shell.echo("cd start")
  shell.cd("./video_booking_system")
  shell.echo("cd end")

  shell.echo("git pull start")
  shell.exec("git pull")
  shell.echo("git pull end")

  shell.echo("npm install start")
  shell.exec("npm install")
  shell.echo("npm install end")

  shell.echo("npm run build start")
  shell.exec("npm run build")
  shell.echo("npm run build end")

  shell.echo("dist -r start")
  shell.cp("-R", "./dist/*", "../../nginx/html/guangxiyuyue")
  shell.echo("all end")
}
handler.on("error", function (err) {
  console.error("Error:", err.message)
})
handler.on("Push Hook", function (event) {
  //# 这个地方就是GitHub 和 Gitee 不一样的地方，需要注意
  console.log("Received a push event for %s to %s", event.payload.repository.name, event.payload.ref)
  run_cmd() //# 需要执行的脚本位置
})
try {
  http
    .createServer(function (req, res) {
      handler(req, res, function (err) {
        res.statusCode = 404
        res.end("no such location")
      })
    })
    .listen(6666) //# 服务监听的端口，可以自行修改
} catch (err) {
  console.error("Error:", err.message)
}
