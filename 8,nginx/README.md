# nginx
### linux下的基础操作
- 防火墙
~~~
# 开启
service firewalld start
# 重启
service firewalld restart
# 关闭
service firewalld stop
#禁止开启重启
systemctl disable firewalld.service 
~~~
- 进程
~~~
killall nginx 关闭进程
~~~
- nginx 启动      
~~~
service nginx start  启动nginx
nginx -s quit     从容停止nginx nginx自己的命令 都是nginx -s 开头，stop停止，quit从容停止，在任务做完后停止
service nginx stop  停止
service nginx restart 重启
nginx -s reload 在重新编写或者修改Nginx的配置文件后，都需要作一下重新载入
lsof -i :8080 查看端口进程
netstat -tlnp 查看所有端口

###window下
     start nginx 启动命令   
     nginx -s quit 从容停止
     nginx -s stop 停止命令   
     nginx -s reload 重启命令 
~~~
***
### 错误页面设置
- 当出现错误时候跳转页面设置
![错误设置](./img/1.png)   
设置404错误，并设置跳转到的页面和跳转情况，在文件html下加404_error.html文件就行了
### ip权限访问
~~~
allow:允许访问的ip，不能同时设置多个，如果有多个 IP 需要设置，需要重复使用 allow 指令，allow all（全部访问）
deny ：禁止ip，和上面一样。
~~~
![顺序](./img/2.png) ![访问权限](./img/3.png) 
### 权限详解
~~~
禁止192.168.1.1:8080/img，访问时候
    location = /img {
            deny all;
        }
禁止192.168.1.1:8080/admin,访问的时候
    location = /admin {
        deny all;
    }  
用正则控制
  禁止以.php结尾的文件访问的时候
  location ~ \.php$ {
      deny all;
  }
可以用正则完成任意拦截    
~~~
### 利用域名划分虚拟主机来发布不同的网页
~~~
    server {
      listen 80;
        server_name nginx2.com;
        location / {
                root /usr/share/nginx/html/html2;
                index index.html index.htm;
        }
    }
    server {
      listen 80;
        server_name nginx1.com;
        location / {
                root /usr/share/nginx/html/html1;
                index index.html index.htm;
        }
    }
~~~
### 反向代理
- 通过nginx.com,进入http://nginx11.com;
~~~
server{
        listen 80;
        server_name nginx.com;
        location / {
               proxy_pass http://nginx11.com;
        }
}
~~~
### Nginx适配PC或移动设备
- $http_user_agent的使用：
Nginx通过内置变量$http_user_agent，可以获取到请求客户端的userAgent，就可以用户目前处于移动端还是PC端，进而展示不同的页面给用户
~~~
server{
     listen 80;
     server_name nginx2.com;
     location / {
      root /usr/share/nginx/pc;
      if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
         root /usr/share/nginx/mobile;
      }
      index index.html;
     }
}
~~~
### Nginx的Gzip压缩配置
##### gzip的配置项

###### Nginx提供了专门的gzip模块，并且模块中的指令非常丰富。
- gzip : 该指令用于开启或 关闭gzip模块。
- gzip_buffers : 设置系统获取几个单位的缓存用于存储gzip的压缩结果数据流。
- gzip_comp_level : gzip压缩比，压缩级别是1-9，1的压缩级别最低，9的压缩级别最高。压缩级别越高压缩率越大，压缩时间越长。
- gzip_disable : 可以通过该指令对一些特定的User-Agent不使用压缩功能。
- gzip_min_length:设置允许压缩的页面最小字节数，页面字节数从相应消息头的Content-length中进行获取。
- gzip_http_version：识别HTTP协议版本，其值可以是1.1.或1.0.
- gzip_proxied : 用于设置启用或禁用从代理服务器上收到相应内容gzip压缩。
- gzip_vary : 用于在响应消息头中添加Vary：Accept-Encoding,使代理服务器根据请求头中的Accept-Encoding识别是否启用gzip压缩
~~~
http {
   .....
    gzip on;
    gzip_types text/plain application/javascript text/css;
    server {
        listen 80;
        server_name my.huangqiyong.xyz;
        location / {
                root html/dist;
                try_files $uri $uri/ /index.html;
        }
    }
   .....
}
~~~
