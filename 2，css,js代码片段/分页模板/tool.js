


String.prototype.Trim = function(){
    return this.replace(/(^\s*)|(\s*$)/g, '');
};
Date.prototype.Format = function(fmt){
    fmt = fmt||"yyyy-mm-dd";
    var o = {
        "m+" : this.getMonth()+1,//月份
        "d+" : this.getDate(),//日
        "h+" : this.getHours(),//小时
        "i+" : this.getMinutes(),//分
        "s+" : this.getSeconds()//秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
};
!(function(window, document, undefined) {
    "use strict";
    //通用方法及常量
    var T = T||{}, _TOSTRING = Object.prototype.toString ,_SLICE = Array.prototype.slice;
    T.DayMillisecond = 864e+5; //一天的毫秒数
    T.FlashPlayerURL = "http://get.adobe.com/cn/flashplayer/";
    T.getDays = function(){
        return Math.ceil(new Date().getTime()/T.DayMillisecond);
    };
    /**
     * 获取日期段
     * @param {Number} [days=0] 天数
     * @param {Number} [direction=0] 0：向前，1：向后
     * @constructor
     * @returns {Object}
     */
    T.getDateRange = function(days, direction){
        days = parseFloat(days)||0, direction = direction||0;
        var startDate = ""; //起始时间
        var endDate = ""; //结束时间
        var date = new Date().getTime();
        var offset = days * T.DayMillisecond;
        if(direction==1){ //向前
            startDate = date - offset;
            endDate = date;
        }else{ //向后
            startDate = date;
            endDate = date + offset;
        }
        return {
            startDate: new Date(startDate).Format(),
            endDate: new Date(endDate).Format()
        }
    };
    /**
     * @根据ID绑定数据
     * @method Template
     * @param {String} [uuid] DOM节点ID标识
     * @param {Object} [data] 数据源（对象）
     * @return {Object} 展示模板解析结果的容器对象
     */
    T.Template = function(uuid,viewId, data){
        if(typeof(viewId)=="object"){
            data = viewId;
            viewId = uuid;
        }
        var temp = document.getElementById("template-"+uuid);
        var view = document.getElementById("template-"+viewId+"-view");
        if(temp&&view){
            $(view).html(Utils.template("template-"+uuid, data));
        }
        return;
    };
    /**
     * @使用ajax上传文件到oss
     * @method Template
     * @param {String} [$file] 文件dom
     * @param {String} [url] 上传url
     * @return oss文件路径
     */
    T.FileUpload = function($file,fileUrl,url){
    	var formData = new FormData();
        formData.append("file", $file.files[0]);
        formData.append("fileUrl", fileUrl);
        var result;
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
            	T.msg(data.message);
            	result = data;
            },
            error: function () {
                alert("上传失败！");
            }
        });
        return result;
    };
    T.getFormJson = function($form){
    	var o = {};
		var a = $form.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [ o[this.name] ];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
    };
    /* 基于时间戳生成20位全局唯一标识（每一毫秒只对应一个唯一的标识，适用于生成DOM节点ID） */
    T.UUID = function(len){
        var timestamp = new Date().getTime()||0, chars = 'abcdefghijklmnopqrstuvwxyz', uuid = '';
        this.timestamp = this.timestamp==timestamp?timestamp+1:timestamp;
        timestamp = ''+this.timestamp;
        len = len||20;
        for(var i=0; i<len; i++){
            var k = timestamp.charAt(i);
            if(k==''){
                k = Math.floor(Math.random()*26);
            }
            uuid += chars.charAt(k)||'x';
        }
        return uuid;
    };
    /**
     * 得到数据类型
     * @memberof T
     * @method Typeof
     * @param {Object} obj 必选，数据
     * @param {RegExp} [type] 可选，数据类型正则表达式
     * @returns {Boolean|String} 传入数据类型正则，则返回Boolean，否则返回数据类型String
     */
    T.Typeof = function(obj,type){
        var oType = {
            '[object Boolean]': 'Boolean',
            '[object Number]': 'Number',
            '[object String]': 'String',
            '[object Function]': 'Function',
            '[object Array]': 'Array',
            '[object Date]': 'Date',
            '[object RegExp]': 'RegExp',
            '[object Object]': 'Object'
        }, ret = obj==null?String(obj):oType[_TOSTRING.call(obj)]||'Unknown';
        return type?type.test(ret):ret;
    };
    /**
     * 对象遍历
     * @memberof T
     * @method Each
     * @param {Object} obj 必选，对象
     * @param {Function(String|Number, *)} callback 必选，回调函数
     * @param {String|Number} callback.key 必选，索引/键
     * @param {*} callback.value 必选，值
     * @returns {Object} 对象
     */
    T.Each = function(obj,callback){
        if(!obj)return obj;
        if(!T.Typeof(callback,/Function/))return obj;
        if(T.Typeof(obj,/Array/)){
            for(var l=obj.length,i=0; i<l; i++)
                if(callback(i,obj[i])===false)break;
        }else if(T.Typeof(obj,/Object/)){
            for(var o in obj)
                if(obj.hasOwnProperty&&obj.hasOwnProperty(o))
                    if(callback(o,obj[o])===false)break;
        }
        return obj;
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
    T.Inherit = function(source,target,depth){
        source = source||{};
        if(T.Typeof(target,/Object/)&&!T.Typeof(source,/Object/))source = {};
        if(T.Typeof(target,/Array/)&&!T.Typeof(source,/Array/))source = [];
        T.Each(target,function(k,v){
            if(depth){
                T.Inherit(source[k],v);
            }else{
                source[k] = v;
            }
        });
        return source;
    };
    /**
     * 解析键值对字符串为Hash对象
     * @memberof T
     * @method DecodeHashString
     * @param {String} str 必选，键值对字符串
     * @param {String} [sign=&] 可选，默认“&”，键值对分隔符
     * @param {String} [flag==] 可选，默认“=”，键值分隔符
     * @returns {Object} Hash对象
     */
    T.DecodeHashString = function (str, sign, flag) {
        var arr = str ? str.split(sign==null ? '&' : sign) : [];
        var hashs = {};
        var reg = new RegExp('(^|'+(flag||'&')+')([^'+(sign||'=')+']*)'+(sign||'=')+'([^'+(flag||'&')+']*)('+(flag||'&')+'|$)', 'i');
        for (var i = 0, l = arr.length; i < l; i++) {
            var parts = arr[i].match(reg)||[];
            if(parts[2]!==''){
                hashs[parts[2]]=decodeURI(parts[3]==null?'':parts[3]);
            }
        }
        return hashs;
    };
    /**
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
                arr.push(key + (flag==null ? '=' : flag) + encodeURIComponent(decodeURIComponent(hashs[key]==null?'':hashs[key])));
            }
        }
        return arr.join(sign==null ? '&' : sign);
    };
    /**
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
     * 字符串化URI
     * @memberof T
     * @method StringifyURI
     * @param {String} [uri=location.href] 可选，默认当前URI，URI字符串
     * @param {Object} [params] 可选，需要附加在“?”之后的参数
     * @param {Object} [hashs] 可选，需要附加在“#”之后的参数
     * @returns {String} URI字符串
     */
    T.StringifyURI = function(uri, params, hashs){
        var parts = (uri||location.href).split(/([?#])/, 5);
        parts[1] = parts[1]||'?';
        parts[2] = T.EncodeHashString(T.Inherit(T.DecodeHashString(parts[2]), params))||'';
        parts[3] = parts[3]||'#';
        parts[4] = T.EncodeHashString(T.Inherit(T.DecodeHashString(parts[4]), hashs))||'';
        console.log(parts.join('').replace(/[?#]+$/,''));
        return parts.join('').replace(/[?#]+$/,'');
    };
    /**
     * 重定向URI
     * @memberof T
     * @method RedirectURI
     * @param {String} goaluri 必选，目标URI字符串
     * @param {String} [backuri] 可选，默认当前URI，回调URI字符串
     */
    T.RedirectURI = function(goaluri, backuri){
        if(!goaluri)return;
        location.replace(T.StringifyURI(goaluri, {backuri: backuri||location.href}));
    };
    /**
     * 重新加载URI
     * @memberof T
     * @method ReloadURI
     * @param {Object} [params] 可选，需要附加在“?”之后的参数
     * @param {Object} [hashs] 可选，需要附加在“#”之后的参数
     */
    T.ReloadURI = function(params, hashs){
        location.replace(T.StringifyURI(location.href, params, hashs));
    };
    /**
     * 动态创建一个闭包函数并执行
     * @memberof T
     * @param {String} str 必选，字符串
     * @returns {Object} 执行结果
     */
    T.Eval = function(str){
        return (new Function('return '+str)());
    };
    /**
     * 操作cookie对象
     * @memberof T
     * @summary Cookie操作类
     * @namespace T.Cookie
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     */
    T.Cookie = {
        /**
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
            for(var i=0; i<_cookies.length; i++)
                result[_cookies[i].split('=')[0]]=decodeURIComponent(_cookies[i].split('=')[1]);
            return key ? result[key] : result;
        },
        /**
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
            if (!key)return;
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
     * @author Woo
     * @version 1.1
     * @since 2015/7/31
     */
    T.Array = {
        /**
         * 向数组中添加不重复的元素
         * @memberof T.Array
         * @method add
         * @param {Array} arr 数组
         * @param {String} value 值
         * @param {Boolean} [redo=false] 是否重复，默认false
         * @returns {Array} 添加后的数组
         */
        add: function(arr, value, redo){
            if(redo){
                arr.push(value);
                return arr;
            }
            var bool = false;
            T.Each(arr, function(k, v){
                if(v==value)bool = true;
            });
            if(!bool)arr.push(value);
            return arr;
        },
        /**
         * 根据对象key/value从对象数组中获得对象
         * @memberof T.Array
         * @method get
         * @param {Array} arr 对象数组
         * @param {String} value 对象属性值
         * @param {String} key 对象属性名
         * @returns {Object} 对应的对象
         */
        get: function(arr,value,key){
            var ret = null;
            if(typeof(value)=='undefined'||typeof(key)=='undefined'||key==='')return ret;
            T.Each(arr,function(k,v){
                if(v[key]==value){
                    ret = v;
                    return false;
                }
            });
            return ret;
        },
        /**
         * 根据对象key/value修改对象数组中的对象
         * @memberof T.Array
         * @method set
         * @param {Array} arr 对象数组
         * @param {Object} value 新对象
         * @param {String} key 对象属性名
         * @returns {Array} 修改后的对象数组
         */
        set: function(arr,value,key){
            if(!arr||typeof(value)=='undefined'||typeof(key)=='undefined'||key==='')return arr;
            T.Each(arr,function(k,v){
                if(v[key]==value[key]){
                    arr[k] = value;
                }
            });
            return arr;
        },
        /**
         * 根据key/value获得数组下标
         * @memberof T.Array
         * @method indexOf
         * @param {Array} arr 数组
         * @param {String} value 属性值
         * @param {String} [key] 属性名
         * @returns 对应的下标
         */
        indexOf: function(arr,value,key){
            var ret = -1, bool = typeof key==='undefined'||key==='';
            T.Each(arr,function(k,v){
                if(bool?v==value:v[key]==value){
                    ret = k;
                    return false;
                }
            });
            return ret;
        },
        /**
         * 根据key/values设置对象数组选中状态
         * @memberof T.Array
         * @method check
         * @param {Array} arr 对象数组
         * @param {Array|String} values 属性值，以“;”分开
         * @param {String} key 属性名
         * @param {Boolean} [def=false] 如果没有被选中的，是否默认选中第一个
         * @returns 对象数组
         */
        check: function(arr,values,key,def){
            if(!T.Typeof(arr,/Array/)||typeof(values)=='undefined'||typeof(key)=='undefined'||key==='')return values||[];
            if(T.Typeof(values,/Array/)){
                values = values.join(";");
            }
            var count = 0, _values = '';
            T.Each(arr,function(i,v){
                if((';'+values+';').indexOf(';'+v[key]+';')>=0){
                    arr[i].CHECKED = 1;
                    _values += ';'+v[key];
                    count++;
                }else{
                    arr[i].CHECKED = 0;
                }
            });
            if(count===0&&def&&arr[0]){
                arr[0].CHECKED = 1;
                _values += ';'+arr[0][key];
            }
            return (_values?_values.substring(1):'').split(";");
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
         * JSON字符串转为JSON对象
         * @memberof T.JSON
         * @method parse
         * @example
         * T.JSON.parse('{"name":"woo", "data": [1, 2, 3]}');
         * @param {String} str JSON字符串
         * @returns {Object} JSON对象
         */
        parse: function(str){
            return (new Function('return '+str))();
        },
        /**
         * 对象转为字符串
         * @memberof T.JSON
         * @method ObjectToString
         * @example
         * T.JSON.ObjectToString({"name":"woo", "age": 18});
         * @param {Object} obj 对象
         * @returns {String} 字符串
         */
        ObjectToString: function(obj){
            var _this = this;
            var jsonString = [];
            for(var o in obj){
                if(obj.hasOwnProperty(o)){
                    var item = obj[o];
                    var type = T.Typeof(item);
                    if(type==='Array'){
                        jsonString.push('"'+o+'":'+ _this.ArrayToString(item));
                    }else if (type==='Object'){
                        jsonString.push('"'+o+'":'+_this.ObjectToString(item));
                    }else{
                        jsonString.push('"'+o+'":"'+item+'"');
                    }
                }
            }
            return '{'+jsonString.join(',')+'}';
        },
        /**
         * 数组转为字符串
         * @memberof T.JSON
         * @method ArrayToString
         * @example
         * T.JSON.ArrayToString([1, 2, 3]);
         * @param {Array} arr 数组
         * @returns {String} 字符串
         */
        ArrayToString: function(arr) {
            var _this = this;
            var jsonString = [];
            for(var item=null,i=0; item=arr[i]; i++){
                var type = T.Typeof(item);
                if(type==='Array'){
                    jsonString.push(_this.ArrayToString(item));
                }else if (type==='Object'){
                    jsonString.push(_this.ObjectToString(item));
                }else{
                    jsonString.push('"'+item+'"');
                }
            }
            return '['+jsonString.join(',')+']';
        },
        /**
         * JSON对象转为JSON字符串
         * @memberof T.JSON
         * @method stringify
         * @example
         * T.JSON.stringify({"name":"woo", "data": [1, 2, 3]});
         * @param {Object} json JSON对象
         * @returns {String} JSON字符串
         */
        stringify: function(json) {
            var _this = this;
            var jsonString = '';
            var type = T.Typeof(json);
            if(type==='Array'){
                jsonString = _this.ArrayToString(json);
            }else if(type==='Object') {
                jsonString = _this.ObjectToString(json);
            }else{
                jsonString = json;
            }
            return jsonString;
        }
    };
    T.byTagName = function(o,n){
        o = o?o:document;
        var els = o.getElementsByTagName(n);
        return els?els:[];
    };
    T.GetChecked = function(dom,name,isRadio, hasDisabled){
        if(!name)return null;
        var chks = [];
        var type = isRadio?'radio':'checkbox';
        var inputs = T.byTagName(dom,'input');
        for(var input=null, i=0; input=inputs[i]; i++){
            if(input&&input.type==type&&input.name==name){
                if(hasDisabled){
                    if(input.checked)chks.push(input.value);
                }else{
                    if(input.checked&&!input.disabled)chks.push(input.value);
                }
            }
        }
        return chks;
    };
    T.Checkboxs = function(dom,name,nameall,callback){
        if(!name)return;
        if(nameall!==null)nameall = nameall||name+'all';
        var inputs = T.byTagName(dom,'input');
        for(var input=null, i=0; input=inputs[i]; i++){
            if(input&&input.type=='checkbox'&&(input.name===name||input.name===nameall)){
                input.onclick = function(o){
                    return function(e){
                        checked(o,o.checked);
                        if(o.name===nameall)chkeckall(o,o.checked);
                        else chkeckall(o,check(),true);
                    };
                }(input);
            }
        }
        function chkeckall(o,chk,chkall){
            var inputs = T.byTagName(dom,'input');
            for(var input=null, i=0; input=inputs[i]; i++){
                if(chkall){
                    if(input&&input.type=='checkbox'&&input.name===nameall)checked(input,chk);
                }else{
                    if(input&&input.type=='checkbox'&&(input.name===name||input.name===nameall))checked(input,chk);
                }
            }
        }
        function check(){
            var checked = true;
            var inputs = T.byTagName(dom,'input');
            for(var input=null, i=0; input=inputs[i]; i++){
                if(input&&input.type=='checkbox'&&input.name===name){
                    if(!input.checked)return false;
                }
            }
            return true;
        }
        function checked(o,chk){
            chk?o.checked = true:o.checked = false;
            //chk?T.addClass(T.closest(o,'.checkbox'),'sel'):T.removeClass(T.closest(o,'.checkbox'),'sel');
            if(callback)callback.call(o,o,o.checked);
        }
    };
    if ( window.jQuery || window.Zepto ) {
        (function($) {
            $.fn.getChecked = function(name,isRadio, hasDisabled) {
                return T.GetChecked($(this)[0], name, isRadio, hasDisabled);
            };
            $.fn.checkboxs = function(name,nameall,callback) {
                return this.each(function() {
                    $(this).data("checkboxs", T.Checkboxs($(this)[0], name,nameall,callback));
                });
            };
        })( window.jQuery || window.Zepto )
    }
    /**
     * 消息提示框
     */
    T.msg = function(text,isDone){
        var dom = document.getElementById('msg_tip');
        if(dom)dom.parentNode.removeChild(dom);
        if(isDone)return;
        dom = document.body.appendChild(document.createElement('div'));
        dom.id = 'msg_tip';
        dom.className = 'msg_tip';
        dom.innerHTML = '<dl><dt></dt><dd>'+text+'</dd></dl>';
        var w = $(window).width();
        var h = $(window).height();
        dom.style.top = (h-dom.offsetHeight)/2+'px';
        dom.style.left = (w-dom.offsetWidth)/2+'px';
        $(dom).css("z-index",20000);
        setTimeout(function(){
            $(dom).animate({opacity:0},1000,function(){
                $(dom).remove();
            });
        },1200);
    };
    T.loading = function(isDone, duration, text){
        function _setProgress(step){
            var node = document.getElementById('loading_shading_progress');
            if(node&&step){
                step--;
                node.style.width = (100-step)+'%';
                if(step>2){
                    setTimeout(function(){
                        _setProgress(step);
                    }, duration/100);
                }
            }
        }
        var dom = document.getElementById('loading_shading');
        if(dom){
            if(typeof(duration)=='number'){
                _setProgress(1);
                setTimeout(function(){
                    dom.parentNode.removeChild(dom);
                }, 300);
            }else{
                dom.parentNode.removeChild(dom);
            }
        }
        if(isDone)return;
        dom = document.body.appendChild(document.createElement('dl'));
        dom.id = 'loading_shading';
        dom.className = 'loading_shading';
        //进度条
        if(typeof(duration)=='number'){
            dom.innerHTML = '<dt></dt><dd class="load_progress"><table cellpadding="0" cellspacing="0"><tr><td><div class="progress_box"><p class="text">'+(text||'')+'</p><div class="progress"><div id="loading_shading_progress"></div></div></div></td></tr></table></dd>';
            _setProgress(100);
        }else{
            dom.innerHTML = '<dt></dt><dd></dd>';
        }
    };
    T.contains = function(root, el){//如果A元素包含B元素，则返回true，否则false
        if(!root||!el||root.nodeType!==1||el.nodeType!==1){
            return false;
        }else if(root.compareDocumentPosition){
            return root===el||!!(root.compareDocumentPosition(el)&16);
        }else if(root.contains){
            return root.contains(el);//&&root!==el;
        }else{
            while(el=el.parentNode){
                if(el===root){
                    return true;
                }else{
                    return false;
                }
            }
        }
    }
    /**
     * @鼠标飘过提示框
     * @method TIP
     * @param {Object} [options] 必选，数据
     * @param {Boolean} [isRemove] 可选，默认为false；false：移除，true：隐藏
     * Return {Object} 鼠标飘过提示框
     */
    T.TIP = function(options, isRemove){
        function TIP(){
            var _this = this;
            /*
             * options.container：容器
             * options.content：内容
             * options.trigger：触发DOM对象
             * options.offsetX：X轴偏移
             * options.offsetY：Y轴偏移
             */
            if(!options.container||!options.content||!options.trigger)return;
            options['max-width'] = options['max-width']||'';
            options.width = options.width||'';
            if(/^\d+$/.test(options['max-width'])){
                options['max-width']+='px';
            }
            if(/^\d+$/.test(options.width)){
                options.width+='px';
            }
            options.offsetX = parseInt(options.offsetX,10)||0;
            options.offsetY = parseInt(options.offsetY,10)||0;
            _this.options = options||{};
            _this.container = options.dom||document.body||document.documentElement;//容器
            _this.trigger = null;
            _this.load = function(){
                var dom = document.getElementById(options.id);
                if(dom){
                    dom.parentNode.removeChild(dom);
                }
                var text = typeof(_this.options.content)=='function'?_this.options.content(_this.trigger)||"":_this.options.content;
                if(!text)return;
                _this.dom = document.createElement('div');
                if(options.id)_this.dom.id = options.id;
                _this.dom.className = 'tips '+(_this.options.style||'');
                if(options['max-width']!==''){
                    _this.dom.style['max-width'] = _this.options['max-width'];
                }
                if(options.width!==''){
                    _this.dom.style.width = _this.options.width;
                }
                _this.container.appendChild(_this.dom);
                _this.dom.innerHTML = text;
                if(_this.options.callback){
                    _this.options.callback.call(_this, _this);
                }
                _this.setPosition();
            };
            _this.setPosition = function(){
                if(_this.dom&&_this.trigger){
                    var offset = T.offset(_this.trigger);
                    var domWH = T.GetSize(_this.dom);
                    var tgrWH = T.GetSize(_this.trigger);
                    var _offset = $(_this.container).offset()||{top:0, left:0};
                    //_this.dom.style.top = (offset.top+(tgrWH.h-domWH.h)/2)+'px';
                    //_this.dom.style.left = (offset.left+(tgrWH.w-domWH.w)/2)+'px';
                    var _left = 0, _top = 0;
                    if($(options.dom).length){
                        _left = $(document).scrollLeft();
                        _top = $(document).scrollTop();
                    }
                    _this.dom.style.top = (offset.top+tgrWH.h+_this.options.offsetY-_offset.top+_top)+'px';
                    var _x = parseInt(T.attr(_this.trigger, "x"), 10)||0 - _offset.left+_left;
                    if(_this.options.left){
                        _this.dom.style.left = (offset.left+_x+_this.options.offsetX)+'px';
                    }else{
                        _this.dom.style.left = (offset.left+_x+tgrWH.w-domWH.w+_this.options.offsetX)+'px';
                    }
                    $(_this.dom).bind("mouseenter", _this.mouseenter).bind("mouseleave", _this.mouseleave);
                }
            };
            _this.show = function(){
                if(_this.dom){
                    _this.dom.style.display = 'block';
                }
            };
            _this.hide = function(){
                if(_this.dom){
                    _this.dom.style.display = 'none';
                }
            };
            _this.remove = function(){
                if(_this.dom&&_this.dom.parentNode){
                    _this.dom.parentNode.removeChild(_this.dom);
                    _this.dom = null;
                }
            };
            _this.mouseenter = function(e){
                if(!_this.contains(e.fromElement||e.currentTarget)){
                    _this.load();
                }
            };
            _this.mouseleave = function(e){
                if(!_this.contains(e.toElement||e.relatedTarget)){
                    _this.remove();
                    _this.trigger = null;
                }
            };
            _this.contains = function(toElement){
                if(T.contains(_this.dom, toElement)||T.contains(_this.trigger, toElement)){
                    return true;
                }
                return false;
            };
            $(options.container).delegate(options.trigger, "mouseenter", function(e){
                _this.trigger = $(this).get(0);
                _this.mouseenter(e);
            }).delegate(options.trigger, "mouseleave", function(e){
                _this.trigger = $(this).get(0);
                _this.mouseleave(e);
            });
        };
        return new TIP();
    };

    /**
     * 设置计数器
     * @param $dom 父容器
     * @param options 配置项
     * @param callback 值改变回调
     */
    T.setCounter = function($dom, options, callback){
        options = options||{min:1, max:1000};
        options.step = options.step||1;
        $dom.delegate(".counter a, .counter b", "selectstart.counter", function() {
            return false;
        }).delegate(".counter a", "click.counter", function(e) { //减数量
            var $minus = $(this);
            var $input = $minus.siblings("input");
            var val = parseInt($input.val(), 10);
            if (val > options.min) {
                val-=options.step;
                val = Math.max(val, options.min);
                $input.val(val);
            }
            if(callback)callback($input, val);
            return false;
        }).delegate(".counter b", "click.counter", function(e) { //加数量
            var $plus = $(this);
            var $input = $plus.siblings("input");
            var val = parseInt($input.val(), 10);
            if (val < options.max) {
                val+=options.step;
                val = Math.min(val, options.max);
                $input.val(val);
            }
            if(callback)callback($input, val);
            return false;
        }).delegate(".counter input", "blur.counter", function(e) { //输入数字
            var $input = $(this);
            var val = $input.val();
            if (isNaN(val)) {
                val = 1;
            }
            val = parseInt(val, 10) || 1;
            if (val > options.max) {
                val = options.max;
            }
            if (val < 1) {
                val = 1;
            }
            val = Math.max(val, options.min);
            val = Math.min(val, options.max);
            $input.val(val);
            if(callback)callback($input, val);
            return false;
        }).delegate(".counter input", "keydown.counter", function(e) {
            var $input = $(this);
            if ($.trim($input.val()) && e.keyCode == 13) {
                e.preventDefault();
                e.stopPropagation();
                $input.blur();
            }
        }).delegate(".counter input", "keyup.counter afterpaste.counter", function (e) {
            var $input = $(this);
            $input.val($input.val().replace(/\D\./g, ''));
        }).delegate(".counter input", "focus.counter", function (e) {
            $(this).trigger("blur.counter");
        });
    };
    T.Paginbar = function(pagin){//分页条
        pagin = pagin||{};
        pagin.index = parseInt(pagin.index,10)||1;//当前页
        pagin.total = parseInt(pagin.total,10)||1;//总页数
        pagin.size = parseInt(pagin.size,10)||15;//每页记录数
        pagin.num = parseInt(pagin.num,10)||3;
        if(pagin.index>pagin.total)pagin.index = 1;
        if(!pagin.paginbar)return;
        pagin.paginbar = document.getElementById(pagin.paginbar);
        if(!pagin.paginbar)return;
        $(pagin.paginbar).addClass('hide');
        pagin.paginbar.innerHTML = '';
        if(pagin.total<2)return;
        $(pagin.paginbar).removeClass('hide');
        function createPageLabel(tag,cla,tit,txt,callback){
            var obj = document.createElement(tag);
            obj.className = cla;
            obj.title = tit;
            if(tag==='input'){
                obj.value = txt;
            }else{
                obj.innerHTML = txt;
            }
            if(tag==='a')obj.href = 'javascript:;';
            pagin.paginbar.appendChild(obj);
            if(callback){
                obj.onclick = function(o,i,s,t){
                    return function(e){
                        callback(o,i,s,t);
                    };
                }(obj,tit,pagin.size,pagin.total);
            }
            return obj;
        }
        var pages = [];
        if(pagin.index>1){
            createPageLabel('a','start',1,'<i class="icon-double-angle-left" style="margin-top:10px;"></i>',pagin.callback);// 起始页
            createPageLabel('a','prev',pagin.index-1,'<i class="icon-angle-left" style="margin-top:10px;"></i>',pagin.callback); // 上一页
        }
        if(pagin.total<=2*pagin.num+4){//小于2*pagin.num页
            for(var index = 1; index<=pagin.total; index++){
                if(index==pagin.index)createPageLabel('b','dis',index,index);
                else createPageLabel('a','',index,index,pagin.callback);
            }
        }else{//大于2*pagin.num页
            var total = Math.min(pagin.index+pagin.num,pagin.total);
            var index = Math.max(pagin.index-pagin.num,1);
            /*
             * 如果当前页靠近首页，则省略中间页码
             * 如果当前页靠近尾页，则省略中间页码
             * 如果当前页在中间，则省略两端页码
             */
            var _left = pagin.index<index+pagin.num;
            var _right = pagin.index>total-pagin.num;
            var center = (pagin.index>=index+pagin.num)&&(pagin.index<=total-pagin.num);
            //console.log('center',center,pagin.num,pagin.index,index,total)
            if(center){
                if(index>1)createPageLabel('a','ellipsis',index,'...',pagin.callback);
                for(index; index<=total; index++){
                    if(index==pagin.index)createPageLabel('b','dis',index,index);
                    else createPageLabel('a','',index,index,pagin.callback);
                };
                if(total<pagin.total)createPageLabel('a','ellipsis',index,'...',pagin.callback);
            }else{
                if(_left)total = Math.min(index+2*pagin.num,pagin.total);
                if(_right)index = Math.max(total-2*pagin.num,1);
                var num = index;
                //console.log(index,total);
                if(_right&&total>2*pagin.num)createPageLabel('a','ellipsis',index,'...',pagin.callback);
                for(index; index<=total; index++){
                    if(index==pagin.index)createPageLabel('b','dis',index,index);
                    else createPageLabel('a','',index,index,pagin.callback);
                }
               /* if(_left)createPageLabel('a','ellipsis',index,'...',pagin.callback);*/
            }
        }
        if(pagin.index<pagin.total){
            createPageLabel('a','next',pagin.index+1,'<i class="icon-angle-right" style="margin-top:10px;"></i>',pagin.callback); // 下一页
            createPageLabel('a','end',pagin.total,'<i class="icon-double-angle-right" style="margin-top:10px;"></i>',pagin.callback); // 尾页
        }
        if(pagin.total>2*pagin.num+4){//小于2*pagin.num页
            //createPageLabel('span','txt','','到第');
            var input = createPageLabel('input','go','',pagin.index);
            input.onblur = function(){
                var val = parseInt(input.value.Trim(),10)||1;
                if(val<1)val = 1;
                if(val>pagin.total)val = pagin.total;
                input.value = val;
            };
            //createPageLabel('span','txt','','页');
            createPageLabel('a','btn','跳页','<i class="icon-external-link">跳页</i>',function(){
                if(pagin.callback)pagin.callback(input,input.value,pagin.size,pagin.total)
            });
        }
    };
    
    /**
     * 文件上传格式和大小限制
     * @param id 文件的html容器
     * @param formatArr 允许的格式数组。例如：[".jpg",".png",".rar",".txt",".zip",".doc"]
     * @param maxSzie 允许最大上传大小，单位：M
     */
    T.uploadFormatSize = function(id,formatArr,maxSzie){
    	var target = document.getElementById(id);
    	var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
		var fileSize = 0; 
		var filemaxsize = 1024*maxSzie;
		//1.判断格式
		var filepath = target.value; 
		if(filepath){
			var isAllowFormat = false; 
			var fileFormat = filepath.substring(filepath.lastIndexOf(".")); 
			if(formatArr && formatArr.length>0){ 
				for(var i =0; i<formatArr.length;i++){ 
					if(formatArr[i]==fileFormat){ 
						isAllowFormat = true; 
						break; 
					} 
				} 
			} 
			if(!isAllowFormat){ 
				alert("不接受此文件类型！"); 
				target.value =""; 
				return false; 
			} 
		}else{ 
			return false; 
		}
		//2.判断是否存在
		if (isIE && !target.files) {
			var filePath = target.value;
			var fileSystem = new ActiveXObject("Scripting.FileSystemObject"); 
			if(!fileSystem.FileExists(filePath)){ 
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
		if(size>filemaxsize){ 
			alert("文件大小不能大于"+filemaxsize/1024+"M！"); 
			target.value ="";
			return false; 
		} 
		if(size<=0){ 
			alert("文件大小不能为0M！");
			target.value =""; 
			return false; 
		} 
		return true;
    }
    
    
    T.REQUESTS = T.GetRequest();
    window.T = T;
}(window, document));