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
lsof -i :8080 查看端口进程
nginx -s stop 关闭
nginx -s reload 重启
~~~