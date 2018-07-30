/**hqy工具类
 * **/

/**
 * 1，
 * fmt输入"yyyy--mm--ddd--hh-ii-ss",也可以单个显示比如yyyy-mm-dd，符号自己可选
 * **/
Date.prototype.Format = function (fmt) {
    fmt = fmt || "yyyy-mm-dd";
    var o = {
        "m+": this.getMonth() + 1,//月份
        "d+": this.getDate(),//日
        "h+": this.getHours(),//小时
        "i+": this.getMinutes(),//分
        "s+": this.getSeconds()//秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

!(function (window, document, undefined) {
    "use strict";
    //通用方法及常量
    //_TOSTRING，检测是什么类型
    // console.log(Object.prototype.toString.call("jerry"));//[object String]
    // console.log(Object.prototype.toString.call(12));//[object Number]
    // console.log(Object.prototype.toString.call(true));//[object Boolean]
    // console.log(Object.prototype.toString.call(undefined));//[object Undefined]
    // console.log(Object.prototype.toString.call(null));//[object Null]
    // console.log(Object.prototype.toString.call({name: "jerry"}));//[object Object]
    // console.log(Object.prototype.toString.call(function(){}));//[object Function]
    // console.log(Object.prototype.toString.call([]));//[object Array]
    // console.log(Object.prototype.toString.call(new Date));//[object Date]
    // console.log(Object.prototype.toString.call(/\d/));//[object RegExp]
    var T = T || {}, _TOSTRING = Object.prototype.toString;
    T.DayMillisecond = 864e+5; //一天的毫秒数
    /**
     * 2,
     * 获取日期段
     * @param {Number} [days=0] 天数
     * @param {Number} [direction=0] 0：向前，1：向后
     * @constructor
     * @returns {Object}
     */
    T.getDateRange = function (days, direction) {
        days = parseFloat(days) || 0, direction = direction || 0;
        var startDate = ""; //起始时间
        var endDate = ""; //结束时间
        var date = new Date().getTime();
        var offset = days * T.DayMillisecond;
        if (direction == 1) { //向前
            startDate = date - offset;
            endDate = date;
        } else { //向后
            startDate = date;
            endDate = date + offset;
        }
        return {
            startDate: new Date(startDate).Format(),
            endDate: new Date(endDate).Format()
        }
    };
    /**
     * 3,
     *  基于时间戳生成20位全局唯一标识（每一毫秒只对应一个唯一的标识，适用于生成DOM节点ID）
     */
    T.UUID = function (len) {
        var timestamp = new Date().getTime() || 0, chars = 'abcdefghijklmnopqrstuvwxyz', uuid = '';
        this.timestamp = this.timestamp == timestamp ? timestamp + 1 : timestamp;
        timestamp = '' + this.timestamp;
        len = len || 20;
        for (var i = 0; i < len; i++) {
            var k = timestamp.charAt(i);
            if (k == '') {
                k = Math.floor(Math.random() * 26);
            }
            uuid += chars.charAt(k) || 'x';
        }
        return uuid;
    };
    /**
     * 4,
     * 得到数据类型
     * @memberof T
     * @method Typeof
     * @param {Object} obj 必选，数据
     * @param {RegExp} [type] 可选，数据类型正则表达式
     * @returns {Boolean|String} 传入数据类型正则，则返回Boolean，否则返回数据类型String
     */
    T.Typeof = function (obj, type) {
        var oType = {
            '[object Boolean]': 'Boolean',
            '[object Number]': 'Number',
            '[object String]': 'String',
            '[object Function]': 'Function',
            '[object Array]': 'Array',
            '[object Date]': 'Date',
            '[object RegExp]': 'RegExp',
            '[object Object]': 'Object'
        }, ret = obj == null ? String(obj) : oType[_TOSTRING.call(obj)] || 'Unknown';
        return type ? type.test(ret) : ret;
    };
    /**
     * 5,
     * 对象遍历
     * @memberof T
     * @method Each
     * @param {Object} obj 必选，对象
     * @param {Function(String|Number, *)} callback 必选，回调函数
     * @param {String|Number} callback.key 必选，索引/键
     * @param {*} callback.value 必选，值
     * @returns {Object} 对象
     */
    T.Each = function (obj, callback) {
        if (!obj) return obj;
        if (!T.Typeof(callback, /Function/)) return obj;
        if (T.Typeof(obj, /Array/)) {
            for (var l = obj.length, i = 0; i < l; i++)
                if (callback(i, obj[i]) === false) break;
        } else if (T.Typeof(obj, /Object/)) {
            for (var o in obj)
                if (obj.hasOwnProperty && obj.hasOwnProperty(o))
                    if (callback(o, obj[o]) === false) break;
        }
        return obj;
    };
    /**
     * 6,
     * 解析键值对字符串为Hash对象
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
     * 7,
     * 编码Hash对象为键值对字符串
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
     * 8,
     * 获取URL中“?/#”之后的所有参数
     * @memberof T
     * @method GetRequest
     * @param {Boolean} isHash 必选，是否为location.hash
     * @param {String} sign 必选，键值对分隔符
     * @returns {Object} 所有参数
     */
    T.GetRequest = function (isHash, sign) {
        var hashs = isHash ? location.hash : location.search;//获取url中'?/#'符后的字符串
        return T.DecodeHashString(hashs.replace(/^[?#]/, ''), sign);
    };
    /**
     * 对象继承
     * @memberof T
     * @method Inherit
     * @param {Object} source 必选，源对象
     * @param {Object} target 必选，目标对象
     * @param {Boolean} [depth=false] 可选，是否深度继承
     * @returns {Object} 继承后的对象
     */
    T.Inherit = function (source, target, depth) {
        source = source || {};
        if (T.Typeof(target, /Object/) && !T.Typeof(source, /Object/)) source = {};
        if (T.Typeof(target, /Array/) && !T.Typeof(source, /Array/)) source = [];
        T.Each(target, function (k, v) {
            if (depth) {
                T.Inherit(source[k], v);
            } else {
                source[k] = v;
            }
        });
        return source;
    };
    /**
     * 9,
     * 字符串化URI
     * @memberof T
     * @method StringifyURI
     * @param {String} [uri=location.href] 可选，默认当前URI，URI字符串
     * @param {Object} [params] 可选，需要附加在“?”之后的参数
     * @param {Object} [hashs] 可选，需要附加在“#”之后的参数
     * @returns {String} URI字符串
     */
    T.StringifyURI = function (uri, params, hashs) {
        var parts = (uri || location.href).split(/([?#])/, 5);
        parts[1] = parts[1] || '?';
        parts[2] = T.EncodeHashString(T.Inherit(T.DecodeHashString(parts[2]), params)) || '';
        parts[3] = parts[3] || '#';
        parts[4] = T.EncodeHashString(T.Inherit(T.DecodeHashString(parts[4]), hashs)) || '';
        console.log(parts.join('').replace(/[?#]+$/, ''));
        return parts.join('').replace(/[?#]+$/, '');
    };
    /**
     * 操作cookie对象
     * @memberof T
     * @summary Cookie操作类
     * @namespace T.Cookie
     */
    T.Cookie = {
        /**
         * 10，
         * 获取cookie
         * @memberof T.Cookie
         * @method get
         * @example
         * T.Cookie.get();
         * T.Cookie.get("sid");
         * @param {String} [key] 可选，cookie键值
         * @returns {Object|String} 如果key不为空，返回指定key的值，则返回所有
         */
        get: function (key) {
            var result = {}, _cookies = document.cookie.split('; ');
            for (var i = 0; i < _cookies.length; i++)
                result[_cookies[i].split('=')[0]] = decodeURIComponent(_cookies[i].split('=')[1]);
            return key ? result[key] : result;
        },
        /**
         * 11,
         * 设置cookie，如果value为null/undefined，则删除cookie
         * @memberof T.Cookie
         * @method set
         * @example
         * T.Cookie.set("sid", "1234567890");
         * T.Cookie.set("sid", "1234567890", {expires: 1, path: "/", domain: "xxx.com"});
         * @param {String} key 必选，cookie键值
         * @param {String} value 必选，cookie值
         * @param {Object} [options] 可选，cookie配置项
         * @param {Number} [options.expires] 可选，cookie过期时间
         * @param {String} [options.path] 可选，cookie存放目录
         * @param {String} [options.domain] 可选，cookie所属域名
         * @param {String} [options.secure] 可选，是否安全传输
         */
        set: function (key, value, options) {
            if (!key) return;
            options = options || {};
            if (value === null || typeof(value) == 'undefined') {
                value = '';
                options.expires = options.expires || -1;
            }
            if (typeof(options.expires) == 'number') {
                var days = options.expires;
                options.expires = new Date();
                options.expires.setTime(options.expires.getTime() + days * 864e+5);
            }
            document.cookie = [
                key, '=', encodeURIComponent(decodeURIComponent(value)),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join('');
        }
    };
    /**
     * 数组处理类
     * @memberof T
     * @summary 数组处理类
     * @namespace T.Array
     */
    T.Array = {
        /**
         * 12，
         * 向数组中添加不重复的元素
         * @memberof T.Array
         * @method add
         * @param {Array} arr 数组
         * @param {String} value 值
         * @param {Boolean} [redo=false] 是否重复，默认false
         * @returns {Array} 添加后的数组
         */
        add: function (arr, value, redo) {
            if (redo) {
                arr.push(value);
                return arr;
            }
            var bool = false;
            T.Each(arr, function (k, v) {
                if (v == value) bool = true;
            });
            if (!bool) arr.push(value);
            return arr;
        },
        /**
         * 13，
         * 根据key/value获得数组下标
         * @memberof T.Array
         * @method indexOf
         * @param {Array} arr 数组
         * @param {String} value 属性值
         * @param {String} [key] 属性名
         * @returns 对应的下标
         */
        indexOf: function (arr, value, key) {
            var ret = -1, bool = typeof key === 'undefined' || key === '';
            T.Each(arr, function (k, v) {
                if (bool ? v == value : v[key] == value) {
                    ret = k;
                    return false;
                }
            });
            return ret;
        },
        /**
         * 14，
         * 根据key/values设置对象数组选中状态
         * @memberof T.Array
         * @method check
         * @param {Array} arr 对象数组
         * @param {Array|String} values 属性值，以“;”分开
         * @param {String} key 属性名
         * @param {Boolean} [def=false] 如果没有被选中的，是否默认选中第一个
         * @returns 对象数组
         */
        check: function (arr, values, key, def) {
            if (!T.Typeof(arr, /Array/) || typeof(values) == 'undefined' || typeof(key) == 'undefined' || key === '') return values || [];
            if (T.Typeof(values, /Array/)) {
                values = values.join(";");
            }
            var count = 0, _values = '';
            T.Each(arr, function (i, v) {
                if ((';' + values + ';').indexOf(';' + v[key] + ';') >= 0) {
                    arr[i].CHECKED = 1;
                    _values += ';' + v[key];
                    count++;
                } else {
                    arr[i].CHECKED = 0;
                }
            });
            if (count === 0 && def && arr[0]) {
                arr[0].CHECKED = 1;
                _values += ';' + arr[0][key];
            }
            return (_values ? _values.substring(1) : '').split(";");
        }
    };
    /**
     * JSON处理类
     * @memberof T
     * @summary JSON处理类
     * @namespace T.JSON
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     */
    T.JSON = {
        /**
         * 15,
         * JSON字符串转为JSON对象
         * @memberof T.JSON
         * @method parse
         * @example
         * T.JSON.parse('{"name":"woo", "data": [1, 2, 3]}');
         * @param {String} str JSON字符串
         * @returns {Object} JSON对象
         */
        parse: function (str) {
            return (new Function('return ' + str))();
        },
        /**
         * 16，
         * 对象转为字符串
         * @memberof T.JSON
         * @method ObjectToString
         * @example
         * T.JSON.ObjectToString({"name":"woo", "age": 18});
         * @param {Object} obj 对象
         * @returns {String} 字符串
         */
        ObjectToString: function (obj) {
            var _this = this;
            var jsonString = [];
            for (var o in obj) {
                if (obj.hasOwnProperty(o)) {
                    var item = obj[o];
                    var type = T.Typeof(item);
                    if (type === 'Array') {
                        jsonString.push('"' + o + '":' + _this.ArrayToString(item));
                    } else if (type === 'Object') {
                        jsonString.push('"' + o + '":' + _this.ObjectToString(item));
                    } else {
                        jsonString.push('"' + o + '":"' + item + '"');
                    }
                }
            }
            return '{' + jsonString.join(',') + '}';
        },
        /**17，
         * 数组转为字符串
         * @memberof T.JSON
         * @method ArrayToString
         * @example
         * T.JSON.ArrayToString([1, 2, 3]);
         * @param {Array} arr 数组
         * @returns {String} 字符串
         */
        ArrayToString: function (arr) {
            var _this = this;
            var jsonString = [];
            for (var item = null, i = 0; item = arr[i]; i++) {
                var type = T.Typeof(item);
                if (type === 'Array') {
                    jsonString.push(_this.ArrayToString(item));
                } else if (type === 'Object') {
                    jsonString.push(_this.ObjectToString(item));
                } else {
                    jsonString.push('"' + item + '"');
                }
            }
            return '[' + jsonString.join(',') + ']';
        }
    };
    /**
     * 18，
     * 消息提示框
     * 样式之类的需要自己写
     * text:消息文字，isDone:是否显示
     */
    T.msg = function (text, isDone) {
        var dom = document.getElementById('msg_tip');
        if (dom) dom.parentNode.removeChild(dom);
        if (isDone) return;
        dom = document.body.appendChild(document.createElement('div'));
        dom.id = 'msg_tip';
        dom.className = 'msg_tip';
        dom.innerHTML = '<div>' + text + '</div>';
        $(dom).css("z-index", 20000);
        setTimeout(function () {
            $(dom).animate({opacity: 0}, 1000, function () {
                $(dom).remove();
            });
        }, 1200);
    };
    /**
     * 19，
     * 数据加载loading
     * css  1，img  1
     *isShow:是否显示，text：文字描述
     * 先初始化    T.loadbarInit（），再使用    T.loading(true,"xxxxx")
     */
    T.loadbarInit = function () {
        var _html = '<div class="lr-loading-bar" id="lr_loading_bar" >';
        _html += '<div class="lr-loading-bar-bg"></div>';
        _html += '<div class="lr-loading-bar-message" id="lr_loading_bar_message"></div>';
        _html += '</div>';
        $('body').append(_html);
    };
    T.loading = function (isShow, text) {
        var $loading = top.$("#lr_loading_bar");
        if (!!text) {
            top.$("#lr_loading_bar_message").html(text);
        } else {
            top.$("#lr_loading_bar_message").html("正在拼了命为您加载…");
        }
        if (isShow) {
            $loading.show();
        } else {
            $loading.hide();
        }
    };
    /**
     *20,
     *分页切换目录
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
                if (index == pagin.index) createPageLabel('b', 'dis', index, index);
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
                    if (index == pagin.index) createPageLabel('b', 'dis', index, index);
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
                    if (index == pagin.index) createPageLabel('b', 'dis', index, index);
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

    /**
     * 21，
     * 文件上传格式和大小限制
     * @param id 文件的html容器
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
                alert("不接受此文件类型！");
                target.value = "";
                return false;
            }
        } else {
            return false;
        }
        //2.判断是否存在
        if (isIE && !target.files) {
            var filePath = target.value;
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            if (!fileSystem.FileExists(filePath)) {
                alert("文件不存在，请重新输入！");
                return false;
            }
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;
        } else {
            fileSize = target.files[0].size;
        }
        //3.判断大小
        var size = fileSize / 1024;
        if (size > filemaxsize) {
            alert("文件大小不能大于" + filemaxsize / 1024 + "M！");
            target.value = "";
            return false;
        }
        if (size <= 0) {
            alert("文件大小不能为0M！");
            target.value = "";
            return false;
        }
        return true;
    }
    window.T = T;
}(window, document));