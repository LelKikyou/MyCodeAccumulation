# 类似于layer的模态框，基于vue

```
  npm i modalFrame
  import modalFrame from "modalFrame";
  Vue.use(modalFrame);

  使用：
            import template from "./template"   //模态框里面的内容 自定义
            this.$modalFrame({
                        template: template,
                        className: ""，
                        modalData: {
                            name: "hqy"
                        },
                        width: "1000",
                        height: "500",
                        onCancel: function (vm,modal) {modal:模板实例
                            vm.remove()  //关闭弹窗的方法
                        },
                        onOk: function (vm,modal) {

                        },
                        onClose: function (vm，modal) {

                        }
                    })
```
## 可以传入的参数
```
            {
                className: "",// 传入的class,可以依靠这个class控制内部样式
                modalData: {},//传入模板里面的data
                width: "800",//宽度
                height: "600",//高度
                onCancel: "",//取消回调  返回vm
                onOk: "",//确认回调 返回 vm
                onClose: "",//关闭回调 返回 vm
                title: "",  //弹窗title
                btnShow: [true, true], //是否显示按钮，[true,false],可以控制按钮的显示隐藏 必须为数组
                btnTit: [],// 按钮的文字，["确认","关闭"]  必须为数组
            }
```
