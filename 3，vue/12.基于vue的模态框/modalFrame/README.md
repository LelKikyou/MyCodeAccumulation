# 类似于layer的模态框，基于vue

```
  npm i modalframe
  import modalFrame from "modalframe";
  Vue.use(modalFrame);

  使用：
            import template from "./template"   //模态框里面的内容 自定义
            this.$modalFrame({
                        template: template,
                        width: "1000",
                        height: "500",
                        modalData: {
                            name: "hqy"
                        },
                        onCancel: function (vm) {
                            vm.remove()  //关闭弹窗的方法
                        },
                        onOk: function (vm) {

                        }
                    })
```
## 可以传入的参数
```
          {
                 template:"",//模板，必填
                 modalData: {},//传入模板里面的data
                 width: "800",//宽度
                 height: "600",//高度
                 onCancel: "",//取消回调  返回vm
                 onOk: "",//确认回调 返回 vm
                 title: "",  //弹窗title
                 btnShow: true, //是否显示按钮
          }
```
