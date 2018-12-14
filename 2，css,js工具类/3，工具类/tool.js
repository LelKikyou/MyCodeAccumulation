/**hqy工具类
 * **/

!(function (window, document) {
    "use strict";
    var T = T || {};
    /*
    （1）.时间相关
    */
    /**
     * 1.1，获取当前年月日
     * fmt输入"yyyy--mm--ddd--hh-ii-ss",也可以单个显示比如yyyy-mm-dd，符号自己可选
     * **/
    T.Format = function (fmt) {
        var date = new Date();
        fmt = fmt || "yyyy-mm-dd";
        var o = {
            "m+": date.getMonth() + 1,//月份
            "d+": date.getDate(),//日
            "h+": date.getHours(),//小时
            "i+": date.getMinutes(),//分
            "s+": date.getSeconds()//秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    /*
    （2）.url取值相关
    */
    /**
     * 2.1,解析键值对字符串为Hash对象
     * @memberof T
     * @method DecodeHashString
     * @param {String} str 必选，键值对字符串
     * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
     * @param {String} [flag==] 可选，默认“=”，键值分隔符
     * @returns {Object} Hash对象
     */
    T.DecodeHashString = function (str, sign, flag) {
        var arr = str ? str.split(sign == null ? '&' : sign) : [];
        var hashs = {};
        var reg = new RegExp('(^|' + (flag || '&') + ')([^' + (sign || '=') + ']*)' + (sign || '=') + '([^' + (flag || '&') + ']*)(' + (flag || '&') + '|$)', 'i');
        for (var i = 0, l = arr.length; i < l; i++) {
            var parts = arr[i].match(reg) || [];
            if (parts[2] !== '') {
                hashs[parts[2]] = decodeURI(parts[3] == null ? '' : parts[3]);
            }
        }
        return hashs;
    };
    /**
     * 2.2,编码Hash对象为键值对字符串
     * @memberof T
     * @method EncodeHashString
     * @param {String} hashs 必选，Hash对象
     * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
     * @param {String} [flag==] 可选，默认“=”，键值分隔符
     * @returns {String} 键值对字符串
     */
    T.EncodeHashString = function (hashs, sign, flag) {
        var arr = [];
        for (var key in hashs) {
            if (hashs.hasOwnProperty && hashs.hasOwnProperty(key)) {
                arr.push(key + (flag == null ? '=' : flag) + encodeURIComponent(decodeURIComponent(hashs[key] == null ? '' : hashs[key])));
            }
        }
        return arr.join(sign == null ? '&' : sign);
    };
    /**
     * 2.3,获取URL中“?/#”之后的所有参数并转化为Hash对象
     * @memberof T
     * @method GetRequest
     * @param {Boolean} isHash 必选，是否为location.hash
     * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
     * @param {String} [flag==] 可选，默认“=”，键值分隔符
     * @returns {Object} 所有参数
     * location.hash获取#后面的数据
     *  location.search 获取？后面的数据
     */
    T.GetRequest = function (isHash, sign, flag) {
        var hashs = isHash ? location.hash : location.search;//获取url中'?或#'符后的字符串
        return T.DecodeHashString(hashs.replace(/^[?#]/, ''), sign, flag);
    };
    /*
    （3）.分页，数据展示相关
    */
    /**
     *3.1,分页切换目录
     * pagin:{
        num: 2,//显示能点击的页码数
        size: 2,//每页多少条数据
        total: 100,//总共多少页
        index: 10, // 当前页码
        paginbar: "rolePaginbar", // 容器ID
        callback: function (obj, index, size, total) { // 点击页码回调
            obj//点击的dom
            index//点击到哪页
            size//同上
            total//同上
            console.log(obj,index,size,total)
        }
    }
     * */
    T.Paginbar = function (pagin) {//分页条
        pagin = pagin || {};
        pagin.index = parseInt(pagin.index, 10) || 1;//当前页
        pagin.total = parseInt(pagin.total, 10) || 1;//总页数
        pagin.size = parseInt(pagin.size, 10) || 15;//每页记录数
        pagin.num = parseInt(pagin.num, 10) || 3;
        if (pagin.index > pagin.total) pagin.index = 1;
        if (!pagin.paginbar) return;
        pagin.paginbar = document.getElementById(pagin.paginbar);
        if (!pagin.paginbar) return;
        $(pagin.paginbar).addClass('hide');
        pagin.paginbar.innerHTML = '';
        if (pagin.total < 2) return;
        $(pagin.paginbar).removeClass('hide');

        function createPageLabel(tag, cla, tit, txt, callback) {
            var obj = document.createElement(tag);
            obj.className = cla;
            obj.title = tit;
            if (tag === 'input') {
                obj.value = txt;
            } else {
                obj.innerHTML = txt;
            }
            if (tag === 'a') obj.href = 'javascript:;';
            pagin.paginbar.appendChild(obj);
            if (callback) {
                obj.onclick = function (o, i, s, t) {
                    return function (e) {
                        callback(o, i, s, t);
                    };
                }(obj, tit, pagin.size, pagin.total);
            }
            return obj;
        }

        var pages = [];
        if (pagin.index > 1) {
            createPageLabel('a', 'start', 1, '<i class="icon-double-angle-left" style="margin-top:10px;"></i>', pagin.callback);// 起始页
            createPageLabel('a', 'prev', pagin.index - 1, '<i class="icon-angle-left" style="margin-top:10px;"></i>', pagin.callback); // 上一页
        }
        if (pagin.total <= 2 * pagin.num + 4) {//小于2*pagin.num页
            for (var index = 1; index <= pagin.total; index++) {
                if (index === pagin.index) createPageLabel('b', 'dis', index, index);
                else createPageLabel('a', '', index, index, pagin.callback);
            }
        } else {//大于2*pagin.num页
            var total = Math.min(pagin.index + pagin.num, pagin.total);
            var index = Math.max(pagin.index - pagin.num, 1);
            /*
             * 如果当前页靠近首页，则省略中间页码
             * 如果当前页靠近尾页，则省略中间页码
             * 如果当前页在中间，则省略两端页码
             */
            var _left = pagin.index < index + pagin.num;
            var _right = pagin.index > total - pagin.num;
            var center = (pagin.index >= index + pagin.num) && (pagin.index <= total - pagin.num);
            //console.log('center',center,pagin.num,pagin.index,index,total)
            if (center) {
                if (index > 1) createPageLabel('a', 'ellipsis', index, '...', pagin.callback);
                for (index; index <= total; index++) {
                    if (index === pagin.index) createPageLabel('b', 'dis', index, index);
                    else createPageLabel('a', '', index, index, pagin.callback);
                }
                ;
                if (total < pagin.total) createPageLabel('a', 'ellipsis', index, '...', pagin.callback);
            } else {
                if (_left) total = Math.min(index + 2 * pagin.num, pagin.total);
                if (_right) index = Math.max(total - 2 * pagin.num, 1);
                var num = index;
                //console.log(index,total);
                if (_right && total > 2 * pagin.num) createPageLabel('a', 'ellipsis', index, '...', pagin.callback);
                for (index; index <= total; index++) {
                    if (index === pagin.index) createPageLabel('b', 'dis', index, index);
                    else createPageLabel('a', '', index, index, pagin.callback);
                }
                /* if(_left)createPageLabel('a','ellipsis',index,'...',pagin.callback);*/
            }
        }
        if (pagin.index < pagin.total) {
            createPageLabel('a', 'next', pagin.index + 1, '<i class="icon-angle-right" style="margin-top:10px;"></i>', pagin.callback); // 下一页
            createPageLabel('a', 'end', pagin.total, '<i class="icon-double-angle-right" style="margin-top:10px;"></i>', pagin.callback); // 尾页
        }
        if (pagin.total > 2 * pagin.num + 4) {//小于2*pagin.num页
            //createPageLabel('span','txt','','到第');
            var input = createPageLabel('input', 'go', '', pagin.index);
            input.onblur = function () {
                var val = parseInt(input.value.replace(/(^\s*)|(\s*$)/g, ''), 10) || 1;
                if (val < 1) val = 1;
                if (val > pagin.total) val = pagin.total;
                input.value = val;
            };
            //createPageLabel('span','txt','','页');
            createPageLabel('a', 'btn', '跳页', '<i class="icon-external-link">跳页</i>', function () {
                if (pagin.callback) pagin.callback(input, input.value, pagin.size, pagin.total)
            });
        }
    };
    /*
    （4）.下载上传相关
    */
    /**
     * 4.1，文件上传格式和大小限制
     * @param id  input的id，上传文件的input
     * @param formatArr 允许的格式数组。例如：[".jpg",".png",".rar",".txt",".zip",".doc"]
     * @param maxSzie 允许最大上传大小，单位：M
     */
    T.uploadFormatSize = function (id, formatArr, maxSzie) {
        var target = document.getElementById(id);
        var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
        var fileSize = 0;
        var filemaxsize = 1024 * maxSzie;
        //1.判断格式
        var filepath = target.value;
        if (filepath) {
            var isAllowFormat = false;
            var fileFormat = filepath.substring(filepath.lastIndexOf("."));
            if (formatArr && formatArr.length > 0) {
                for (var i = 0; i < formatArr.length; i++) {
                    if (formatArr[i] == fileFormat) {
                        isAllowFormat = true;
                        break;
                    }
                }
            }
            if (!isAllowFormat) {
                target.value = "";
                return {data: false, mes: "没有匹配的格式"};
            }
        } else {
            return {data: false, mes: "文件不存在"};
        }
        //2.判断是否存在
        if (isIE && !target.files) {
            var filePath = target.value;
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            if (!fileSystem.FileExists(filePath)) {
                return {data: false, mes: "文件不存在"};
            }
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;
        } else {
            fileSize = target.files[0].size;
        }
        //3.判断大小
        var size = fileSize / 1024;
        if (size > filemaxsize) {
            target.value = "";
            return {data: false, mes: "文件大小不能大于" + filemaxsize / 1024 + "M！"};
        }
        if (size <= 0) {
            target.value = "";
            return {data: false, mes: "文件大小不能为0M！"};
        }
        return {data: true, mes: null};
    };
    /**
     * 4.2，下载文件流并转为blob对象再下载到本地
     * 参数options，如下
     * 依赖上面的  T.EncodeHashString方法,第2.2个
     */
    T.downloadBlob = function (options) {
        // options = {
        //     url: '',   //url地址
        //     type: 'POST',   //请求类型  默认get
        //     data: {},       //请求参数
        //     callback: null,  //请求成功回调
        //     filename: 'data.xlsx'    //请求文件名字,自动匹配的话需要获取blob里面type的类型，去“MIME 参考手册”匹配.
        // };
        var querySting = options.data ? T.EncodeHashString(options.data) : null;
        var type = options.type ? options.type : "GET";
        if (type.toUpperCase() !== "POST") {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", options.url + "?" + querySting, true);
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var blob = this.response;
                    var link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = window.URL.createObjectURL(blob);
                    link.download = options.filename;
                    // 触发点击
                    document.body.appendChild(link);
                    link.click();
                    // 然后移除
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                    if (options.callback) options.callback();
                }
            };
            xhr.send();
        } else {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", options.url, true);
            xhr.responseType = "blob";
            xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var blob = this.response;
                    var link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = window.URL.createObjectURL(blob);
                    link.download = options.filename;
                    // 触发点击
                    document.body.appendChild(link);
                    link.click();
                    // 然后移除
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                    if (options.callback) options.callback();
                }
            };
            xhr.send(querySting);
        }
    };
    /*
   （5）.对象方法相关
   */
    /**
     *5.1，对象的深拷贝和浅拷贝
     * 参数obj,可为[]，也可以是{}
     * 返回新对象
     * **/
    T.Copy = function () {
        /* 深拷贝,会递归把所以的拷贝进去，只要是可枚举的都拷贝进去*/
        function deepCopy(source) {
            var target = Array.isArray(source) ? [] : {};
            for (var k in source) {
                if (source.hasOwnProperty(k)) {   // 意思就是__proto__上面的属性,我不拷贝,如果想拷贝__proto__上的属性就去掉
                    if (typeof source[k] === 'object') {
                        target[k] = deepCopy(source[k])
                    } else {
                        target[k] = source[k]
                    }
                }
            }
            return target
        }

        //这个方法大多数时候都适用，但是不会拷贝原型上的方法，也不会拷贝有函数的属性，比如{a:function(){console.log(123)}},属性a不会拷贝
        function copy(obj) {
            return JSON.parse(JSON.stringify(obj))
        }

        //浅拷贝对象，对象属性值是对象的拷贝不了。
        //比如{a:{b:1}}
        function copyAssign(obj) {
            return Object.assign({}, obj)
        }

        //浅拷贝数组，属性值是对象的拷贝不了。
        // 比如：[{a: 1}]
        function copyConcat(arr) {
            return [].concat(arr);
        }
    };
    window.T = T;
}(window, document));