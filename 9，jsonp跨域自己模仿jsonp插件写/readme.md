!!!!!!!!必须要服务器返回的jsonp数据

1，说明：
   myJson.js 是我自己根据github上的https://github.com/webmodules/jsonp，jsonp库修改的
   用法一样，但是我删除的错误机制。
jsonp（url，opts，fn）
url（String）url来获取
opts（Object），可选
    param（String）查询字符串参数的名称以指定回调（默认为callback），这个必须指定，一般是和后台协商制定的。
    timeout（Number）发出超时错误后多久。0禁用（默认60000）
    fn 回调函数
    该回调是通过data参数调用的。

如果超时，data将是一个Error对象，它message是 Timeout。

返回一个函数，该函数在被调用时将取消正在进行的jsonp请求（fn不会被调用）。