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
~~~
