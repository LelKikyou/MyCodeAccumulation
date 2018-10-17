# nginx 反向代理跨域，实现跨域，不需要改服务端代码。
- 1，下载nginx ，我用的window版本   http://nginx.org/en/download.html   
    下载中间的稳定版本   
     如图1
- 2，下载下来解压到一个盘，如图2，cmd命令，D:切换到D盘，cd nginx 切换到目录下。   
   start nginx 启动命令   
   nginx -s quit 从容停止
   nginx -s stop 停止命令   
   nginx -s reload 重启命令   
   每次修改完都要重启。
- 3，修改   conf/nginx.conf文件来修改配置   
如图4   
~~~
        location / {
            root   index;
            index  index.html index.htm;
        }
~~~
配置一个端口，打开nginx服务后，所以的ajax请求只要是/musichall开头，比如http://localhost:/musichall，都会默认转换到https://c.y.qq.com上，完成反向代理。   
~~~
        location /musichall {
           add_header Access-Control-Allow-Origin *;
           add_header Access-Control-Allow-Headers X-Requested-With;   #实现端口跨域
           add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
           proxy_pass https://c.y.qq.com;
        }
        #/weapi下的所以请求都转换到 http://music.163.com下
        location  /weapi  {
           add_header Access-Control-Allow-Origin *;
           add_header Access-Control-Allow-Headers X-Requested-With;
           add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
           proxy_pass http://music.163.com;
        }  
~~~
- 5，访问，就可以跨域访问到，实际上访问的是http://music.163.com：/weapi/personalized/newsong
~~~
    var a="j10BbcU76wMeUELiO/m0mF9IlmEL1yi5IkJAAT+6rk4=";
    var b="05e4344867fe9fa7797def21562046e8f552c5b40a4b0ebde58f55f9c0aee44bb9263adfc65f255c85558732a6bc5004ea4a9fb8dc81c4c7338f15f09adc3697263b13217de50f35329f8b1b2bc273336f4c2ff923ced13888f96f0c3bca3a2bde47a26c65fbc0409c99855729e4921d9b3179e12bedc9dc99d4acd8c354d8f5"
    $.post("http://localhost:/weapi/personalized/newsong",{params:a,encSecKey:b},data=>{
        console.log(JSON.parse(data))

    })
~~~
