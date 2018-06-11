1，github地址https://github.com/HubSpot/pace  <br />
2，中文文档见https://www.cnblogs.com/zx-admin/p/6418942.html <br/>
3，引入的css决定加载图案的风格，一把首页进入用pace-theme-loading-bar.tmpl.css,单个页面上面进度用pace-theme-minimal.tmpl.css <br/>
4,加载完的事件,详情见中文文档  <br/>
<script>    
    //数据全部加载完后执行
    Pace.on('done', function () {
        $('#loadbg').fadeOut();
    });
</script>
