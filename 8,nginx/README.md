﻿# nginx

### linux 下的基础操作

- linux 下载

```
rpm离线安装包下载地址:
http://nginx.org/packages/centos/7/x86_64/RPMS/
找到自己需要的版本然后 安装
rpm -ivh nginx-1.12.0-1.el7.ngx.x86_64.rpm
```

- 防火墙

```
# 开启
service firewalld start
# 重启
service firewalld restart
# 关闭
service firewalld stop
#禁止开启重启
systemctl disable firewalld.service
```

- 进程

```
killall nginx 关闭进程
```

- nginx 启动相关
```
###linux下
ps -ef | grep nginx   获取nginx安装目录
netstat -nap | grep 10100  查看nginx开了哪些端口

（建议安装完nginx之后 自定义配置文件启动，不然卸载更新之后nginx.conf 和 default.conf 文件会重置,之前的配置会不起作用）

nginx -t -c /etc/nginx/nginx.conf  测试当前配置是否正确
/usr/sbin/nginx -c /usr/share/hqyWeb/nginx.conf     nginx指定配置文件启动   (/usr/sbin/nginx)是nginx安装目录
/usr/sbin/nginx -s reload -c /usr/share/hqyWeb/nginx.conf    nginx指定配置文件重启
service nginx start  启动nginx
nginx -s quit     从容停止nginx nginx自己的命令 都是nginx -s 开头，stop停止，quit从容停止，在任务做完后停止
nginx -s reload 在重新编写或者修改Nginx的配置文件后，都需要作一下重新载入

rpm -qa | grep nginx 查看安装了nginx 没有
rpm -e nginx 卸载nginx （卸载重新安装之后 nginx.conf 和 default.conf 文件会重置）

###window下
     start nginx 启动命令
     nginx -s quit 从容停止
     nginx -s stop 停止命令
     nginx -s reload 重启命令
```

---

### 错误页面设置

- 当出现错误时候跳转页面设置
  ![错误设置](./img/1.png)  
  设置 404 错误，并设置跳转到的页面和跳转情况，在文件 html 下加 404_error.html 文件就行了

### ip 权限访问

```
allow:允许访问的ip，不能同时设置多个，如果有多个 IP 需要设置，需要重复使用 allow 指令，allow all（全部访问）
deny ：禁止ip，和上面一样。
```

![顺序](./img/2.png) ![访问权限](./img/3.png)

### 权限详解

```
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
```

### 利用域名划分虚拟主机来发布不同的网页

```
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
```

### 反向代理

- 通过 nginx.com,进入http://nginx11.com;

```
server{
        listen 80;
        server_name nginx.com;
        location / {
               proxy_pass http://nginx11.com;
        }
}
```

- 重定向 带有"/videoApi"路径的地址( http://localhost:8080/videoApi/zwcapfiles/qdyz1838565/2021/20210929/V210929_100210.mp4) 全部转到http://xxx:8070,变为http://xxx:8070/zwcapfiles/qdyz1838565/2021/20210929/V210929_100210.mp4

```
	location /videoApi {
        proxy_pass http://xxx:8070;
        proxy_redirect    off;
        proxy_set_header  Host  $host;
        proxy_set_header  X-Real-IP  $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
		    rewrite ^/videoApi/(.*) /$1 break;
    }
```

### Nginx 适配 PC 或移动设备

- $http_user_agent的使用：
Nginx通过内置变量$http_user_agent，可以获取到请求客户端的 userAgent，就可以用户目前处于移动端还是 PC 端，进而展示不同的页面给用户

```
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
```

### Nginx 的 Gzip 压缩配置

##### gzip 的配置项

###### Nginx 提供了专门的 gzip 模块，并且模块中的指令非常丰富。

- gzip : 该指令用于开启或 关闭 gzip 模块。
- gzip_buffers : 设置系统获取几个单位的缓存用于存储 gzip 的压缩结果数据流。
- gzip_comp_level : gzip 压缩比，压缩级别是 1-9，1 的压缩级别最低，9 的压缩级别最高。压缩级别越高压缩率越大，压缩时间越长。
- gzip_disable : 可以通过该指令对一些特定的 User-Agent 不使用压缩功能。
- gzip_min_length:设置允许压缩的页面最小字节数，页面字节数从相应消息头的 Content-length 中进行获取。
- gzip_http_version：识别 HTTP 协议版本，其值可以是 1.1.或 1.0.
- gzip_proxied : 用于设置启用或禁用从代理服务器上收到相应内容 gzip 压缩。
- gzip_vary : 用于在响应消息头中添加 Vary：Accept-Encoding,使代理服务器根据请求头中的 Accept-Encoding 识别是否启用 gzip 压缩

```
http {
   .....
    gzip on;#开启gzip压缩
    gzip_types text/plain application/javascript text/css;#要压缩文件的类型选择
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
```

```
gzip on;
gzip_min_length 1k;
gzip_buffers 4 16k;
#gzip_http_version 1.0;
gzip_comp_level 2;
gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;#如果有文件没有压缩就添加上，到network里面能看到返回的数据类型
gzip_vary off;
gzip_disable "MSIE [1-6]\.";

1、解释一下

第1行：开启Gzip

第2行：不压缩临界值，大于1K的才压缩，一般不用改

第3行：buffer，就是，嗯，算了不解释了，不用改

第4行：用了反向代理的话，末端通信是HTTP/1.0，有需求的应该也不用看我这科普文了；有这句的话注释了就行了，默认是HTTP/1.1

第5行：压缩级别，1-10，数字越大压缩的越好，时间也越长，看心情随便改吧

第6行：进行压缩的文件类型，缺啥补啥就行了，JavaScript有两种写法，最好都写上吧，总有人抱怨js文件没有压缩，其实多写一种格式就行了

第7行：跟Squid等缓存服务有关，on的话会在Header里增加"Vary: Accept-Encoding"，我不需要这玩意，自己对照情况看着办吧

第8行：IE6对Gzip不怎么友好，不给它Gzip了
```

### HTTPS 设置

##### 下载 mkcert

```
github地址:https://github.com/FiloSottile/mkcert
安装：linux:    ./mkcert-v1.4.1-linux-amd64
                mkcert -install
      window： 双击安装
      ------
      怎么通过mkcert创建证书 自行百度
```    
##### nginx 配置

```
    server {
        listen     443 ssl;
        server_name  localhost;
        ssl on;
        ssl_certificate      /root/.local/share/mkcert/rootCA.pem;
        ssl_certificate_key  /root/.local/share/mkcert/rootCA-key.pem;
        #ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;
        location / {
          root   /usr/share/nginx/html/dist;
          try_files $uri $uri/ /index.html;

        }
    }
```

### linux 开启自启动 nginx

##### 写入配置

- 1，vim /etc/init.d/nginx
- 2，编写 nginx 自启动脚本，内容参考官网地址：https://www.nginx.com/resources/wiki/start/topics/examples/redhatnginxinit/

```
        1，在/etc/init.d目录下 新建nginx文件 把上面官网的内容复制到文件中
        2，需要注意这两个配置修改成自己的路径
            nginx=”/usr/local/nginx/sbin/nginx” //修改成nginx执行程序的路径。
            NGINX_CONF_FILE=”/usr/local/nginx/conf/nginx.conf” //修改成nginx.conf文件的路径
        *****上面的也可以不修改根据情况而定
```

- 3，修改执行权限

```
        chmod a+x /etc/init.d/nginx
```

- 4，设置成服务并开机自启动

```
        chkconfig --add /etc/init.d/nginx
        chkconfig nginx on
```

- 5，启动

```
        /etc/init.d/nginx start
        /etc/init.d/nginx stop
        service nginx start
        service nginx stop
        service nginx restart
```
