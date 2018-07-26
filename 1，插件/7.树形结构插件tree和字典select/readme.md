1，切换到koa2 目录，node index.js运行koa
2，tree使用方法
    渲染方法，后面是点击事件，和选中事件
    $(".box").lrtree({
           url: "http://localhost:3000/api/tree", nodeClick: (data, res) => {
               console.log(data, res)
           }, nodeCheck: data => {
               console.log(data)
           }
       });
 3，  $(".box").lrtreeSet("allNoCheck");为之后对tree的操作，可以自己扩展