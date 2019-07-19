// 打印类属性、方法定义
/* import Print from 'print'
Vue.use(Print) // 注册
<template>
<section class="print" ref="print">
	打印内容
	<div class="no-print">不要打印我</div>
</section>
</template>
this.$print(this.$refs.print) // 使用
注意事项 需使用ref获取dom节点，若直接通过id或class获取则webpack打包部署后打印内容为空 指定不打印区域 方法一. 添加no-print样式类

<div class="no-print">不要打印我</div>
方法二. 自定义类名

<div class="do-not-print-me-xxx">不要打印我</div>
this.$print(this.$refs.print,{'no-print':'.do-not-print-me-xxx'}) // 使用
 */

/*
* 重点    不然打印显示的样式会和页面的有区别。。
* 写样式的时候从需要打印的地方开始写，不然导入css进去会找不到。
* 比如上面的print
* .print .no-print{...}  这样写  不要从更上一级开始写。。导入的时候之后导入.print这个dom及以下的html
* */
const Print = function (dom, options) {
    if (!(this instanceof Print)) return new Print(dom, options);

    this.options = this.extend({
        'noPrint': '.no-print'
    }, options);

    if ((typeof dom) === "string") {
        this.dom = document.querySelector(dom);
    } else {
        this.isDOM(dom)
        this.dom = this.isDOM(dom) ? dom : dom.$el;
    }

    this.init();
};
Print.prototype = {
    init: function () {
        var content = this.getStyle() + this.getHtml();
        this.writeIframe(content);
    },
    extend: function (obj, obj2) {
        for (var k in obj2) {
            obj[k] = obj2[k];
        }
        return obj;
    },

    getStyle: function () {
        var str = "",
            styles = document.querySelectorAll('style,link');
        for (var i = 0; i < styles.length; i++) {
            str += styles[i].outerHTML;
        }
        str += "<style>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + "{display:none;}</style>";

        return str;
    },

    getHtml: function () {
        var inputs = document.querySelectorAll('input');
        var textareas = document.querySelectorAll('textarea');
        var selects = document.querySelectorAll('select');

        for (var k = 0; k < inputs.length; k++) {
            if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
                if (inputs[k].checked == true) {
                    inputs[k].setAttribute('checked', "checked")
                } else {
                    inputs[k].removeAttribute('checked')
                }
            } else if (inputs[k].type == "text") {
                inputs[k].setAttribute('value', inputs[k].value)
            } else {
                inputs[k].setAttribute('value', inputs[k].value)
            }
        }

        for (var k2 = 0; k2 < textareas.length; k2++) {
            if (textareas[k2].type == 'textarea') {
                textareas[k2].innerHTML = textareas[k2].value
            }
        }

        for (var k3 = 0; k3 < selects.length; k3++) {
            if (selects[k3].type == 'select-one') {
                var child = selects[k3].children;
                for (var i in child) {
                    if (child[i].tagName == 'OPTION') {
                        if (child[i].selected == true) {
                            child[i].setAttribute('selected', "selected")
                        } else {
                            child[i].removeAttribute('selected')
                        }
                    }
                }
            }
        }

        return this.dom.outerHTML;
    },

    writeIframe: function (content) {
        var w, doc, iframe = document.createElement('iframe'),
            f = document.body.appendChild(iframe);
        iframe.id = "myIframe";
        //iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";
        iframe.setAttribute('style', 'position:absolute;width:0;height:0;top:-10px;left:-10px;');
        w = f.contentWindow || f.contentDocument;
        doc = f.contentDocument || f.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();
        var _this = this
        iframe.onload = function () {
            _this.toPrint(w);
            setTimeout(function () {
                document.body.removeChild(iframe)
            }, 100)
        }
    },

    toPrint: function (frameWindow) {
        try {
            setTimeout(function () {
                frameWindow.focus();
                try {
                    if (!frameWindow.document.execCommand('print', false, null)) {
                        frameWindow.print();
                    }
                } catch (e) {
                    frameWindow.print();
                }
                frameWindow.close();
            }, 10);
        } catch (err) {
            console.log('err', err);
        }
    },
    isDOM: (typeof HTMLElement === 'object') ?
        function (obj) {
            return obj instanceof HTMLElement;
        } :
        function (obj) {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        }
};
const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
    // 4. 添加实例方法
    Vue.prototype.$print = Print
}
export default MyPlugin
