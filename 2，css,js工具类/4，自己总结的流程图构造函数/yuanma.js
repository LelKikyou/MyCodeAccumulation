var b = {
    defaults: {
        /**
         * @public
         * @static
         * @description 业务线主菜单的id
         * 类型：String
         * @default ""
         * @example $("#flowbar").flowbar({symenufk:""})
         */
        symenufk: "",
        /**
         * @public
         * @static
         * @description 业务线距离顶端的间隔 单位(px)
         * 类型：Integer
         * @default 22
         * @example $("#flowbar").flowbar({topinterval:22})
         */
        topinterval: 2,
        /**
         * @public
         * @static
         * @description 业务线距离左边的间隔 单位(px)
         * 类型：Integer
         * @default 100
         * @example $("#flowbar").flowbar({topinterval:100})
         */
        leftinterval: 5,
        /**
         * @public
         * @static
         * @description 界面显示的选择器
         * 类型：String
         * @default 无
         * @example $("#flowbar").flowbar({toselector:"#idname"})
         */
        toselector: "",
        /**
         * @public
         * @static
         * @description 点击节点触发事件
         * 类型：Function(el)
         * @default 无
         * @example $("#flowbar").flowbar({onclick:function(el){}})
         */
        onclick: null,
        /**
         * @public
         * @static
         * @description 鼠标移动到节点触发事件
         * 类型：Function(el)
         * @default 无
         * @example $("#flowbar").flowbar({onmousemove:function(){}})
         */
        onmousemove: null,
        /**
         * @public
         * @static
         * @description 鼠标移出节点触发事件
         * 类型：Function(el)
         * @default 无
         * @example $("#flowbar").flowbar({onmouseout:function(){}})
         */
        onmouseout: null,
        /**
         * @public
         * @static
         * @description flowbar加载完成后触发的
         * @param postposition 是否后置菜单调整
         * 类型：Function(postposition)
         * @default 无
         * @example $("#flowbar").flowbar({onmouseout:function(postposition){}})
         */
        onsuccess: null
    }
}
var a = {
    init: function () {
        if (!this.options.symenufk) {
            this.options.symenufk = $(Ntutil.getMenuNode(this.element)).attr('symenufk');//$(window.frameElement.parentNode).attr('symenufk');
        }
        this.width = 0;//svg的宽度
        this.height = 0;//svg的高度
        this._getData(function (data) {
            this.$panel = $("<div></div>").appendTo(this.element);

            this.linePanel = this._createLinePanel();
            this.$panel.append(this.linePanel);
            this._createMenus(data.children.nodes);
            this._createLines(data.children.lines);
            this._createflowbarTable();
            this._bindEvent();
            this._resetWH();
            this._createNextBusiness();
            this._createPostpositionMenus();
            this._createRightHide();
            //判断是否存在后置处理的方法，存在则触发后置处理
            if (typeof(window.parent.flowbarPostProcess) == "function") {
                window.parent.flowbarPostProcess.call(this, window);
                this.options.onsuccess.call(this, true);
            } else {
                if (typeof(this.options.onsuccess) == "function") this.options.onsuccess.call(this, false);
            }
        });
    },

    selectFlow: null,

    /**
     * 当前选中的菜单
     */
    selectMenu: null,

    /**
     * 开始菜单
     */
    startMenu: null,

    /**
     * 后置菜单面板
     */
    flowbarTable: null,

    /**
     * @description 创建菜单按钮
     * @function Private
     * @param menuData 格式{widht:100,height:30,left:20,top:30}
     * @author 刘全
     * @date 2014-03-12
     */
    _createMenus: function (menuData) {
        for (var id in menuData) {
            var menu = menuData[id];
            menu.left = menu.left + this.options.leftinterval;
            menu.top = menu.top + this.options.topinterval;
            var $menu = this._createMenu(menu);
            $menu.data("data", menu);
            this.$panel.append($menu);
            if ((menu.left + menu.width) > this.width) this.width = menu.left + menu.width;
            if ((menu.top + menu.height) > this.height) this.height = menu.top + menu.height;
            if (menu.isstart == "1") this.startMenu = $menu;
        };
    },

    /**
     * @description 创建连线
     * @function Private
     * @author 刘全
     * @date 2014-03-12
     */
    _createLines: function (lineData) {
        for (var id in lineData) {
            var line = lineData[id];
            this._addLine(id, line);
            if (line.type == "tb" && line.M > this.height) this.height = line.M;
            if (line.type == "lr" && line.M > this.width) this.width = line.M;
        }
    },

    /**
     * @description 创建隐藏后置业务的开关
     * @function Private
     * @author 刘全
     * @date 2014-03-12
     */
    _createRightHide: function () {
        var contracted = false;
        var $tablePanel = this.flowbarTable.parent();
        var $body;
        if (Ntutil.hasFrameELement()) {
            $body = $("body");
        }
        else {
            $body = Ntutil.getMenuNode(this.element);
        }
        $("<div class='flowbar-righthide'>" +
            "<div/>" +
            "</div>")
            .bind("click", function () {
                if (contracted === false) {
                    $tablePanel.animate({
                        right: 15
                    }, 500);
                    contracted = true;
                } else {
                    $tablePanel.animate({
                        right: -$tablePanel.outerWidth()
                    }, 500);
                    contracted = false;
                }
            })
            .appendTo($body);
    },

    /**
     * @description 创建可以做后置业务菜单
     * @function Private
     * @author 刘全
     * @date 2014-06-05
     */
    _createflowbarTable: function () {
        if (!this.flowbarTable) {
            var $body;
            if (Ntutil.hasFrameELement()) {
                $body = $("body");
            }
            else {
                $body = Ntutil.getMenuNode(this.element);
            }
            var $tablePanel = $("<div class='flowbar-table-panel'></div>").appendTo($body);
            this.flowbarTable = $('<div class="flowbar-table">' +
                '<div class="flowbar-table-column-group">' +
                '<div class="flowbar-table-column"></div>' +
                '<div class="flowbar-table-column"></div>' +
                '<div class="flowbar-table-column"></div>' +
                '</div>' +
                '<div class="flowbar-table-row-group">' +
                '<ul class="flowbar-table-row">' +
                '<li class="flowbar-table-cell">1</li>' +
                '<li class="flowbar-table-cell">John</li>' +
                '<li class="flowbar-table-cell">19</li>' +
                '</ul>' +
                '</div>' +
                '</div>').appendTo($tablePanel);
        }
    },

    /**
     * @description 创建连线容器
     * @function Private
     * @author 刘全
     * @date 2014-03-12
     */
    _createLinePanel: function () {
        var linePanel;
        if (this._isUseSVG()) {
            linePanel = document.createElementNS("http://www.w3.org/2000/svg", "svg");//可创建带有指定命名空间的元素节点
            var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            linePanel.appendChild(defs);
            defs.appendChild(this._getSvgMarker("arrow1", "#15428B"));
            defs.appendChild(this._getSvgMarker("arrow2", "#ff3300"));
            defs.appendChild(this._getSvgMarker("arrow3", "#ff3300"));
        } else {
            linePanel = document.createElement("v:group");
        }
        linePanel.style.position = "absolute";
        return linePanel;
    },

    /**
     * @description 绑定事件
     * @function Private
     * @author 刘全
     * @date 2014-03-12
     */
    _bindEvent: function () {
        var self = this;
        var $toSelector, $pSelector;

        if (Ntutil.hasFrameELement()) { //有iframe
            $toSelector = $(self.options.toselector);
            $pSelector = self.options.plselector;
        }
        else {
            var $menuNode = Ntutil.getMenuNode(this.element);
            $toSelector = $menuNode.find(self.options.toselector);
            $pSelector = $menuNode.find(self.options.plselector);
        }
        this.element.delegate(".flowbar-menu", "click", function () {
            var $this = $(this);
            var data = $this.data("data");
            if (data.disable) return;
            if (self.selectMenu) {
                self.selectMenu.removeClass(self.getStatusClass("S"));
                self.selectMenu.addClass(self.getStatusClass(self.selectMenu.data("data").flowbarMenuStatus));
            }

            self.selectMenu = $this;
            $this.removeClass(self.getStatusClass(data.flowbarMenuStatus));
            $this.addClass(self.getStatusClass("S"));
            if (!data.tooldatas) {
                data.tooldatas = self._getToolsdatas(data.menuinfo.id);
            }
            var menuinfo = data.menuinfo;
            var viewAdd = menuinfo.url;
            var controllerName = menuinfo.method.split('?');
            controllerName = controllerName.length > 1 ? controllerName[1] : controllerName[0];
            var tooldatas = data.tooldatas;
            var $content = $toSelector.find(">div.content[flow='" + controllerName + "']");
            var cName = $.String.underscore(controllerName).replace(/\./g, "_"), $operModule = null;
            if ($content.length == 0) {
                $toSelector.find("div.content").hide();
                var $view = $("<div class='content' flow='" + controllerName + "'></div>").appendTo($toSelector);

                $operModule = $view[cName]({
                    view: viewAdd,
                    list: $pSelector,
                    toolsdata: tooldatas,
                    designcode: data.designcode
                }).data().controllers[cName];
            }
            else {
                //$content.nextAll().hide();
                //$content.prevAll().hide();
                $operModule = $content.data().controllers[cName];
                $toSelector.find(">div.content:not([flow='" + controllerName + "'])").hide();
                $content.show();
            }
            self.selectFlow = cName;
            $operModule.initFlowEventRun(); //默认接口

            //设置页面菜单值

            $(Ntutil.getMenuNode(self.element)).attr('subsymenufk', $this.attr("symenufk"))

            if (typeof(self.options.onclick) == "function") self.options.onclick.call(self, $this);
        });


//			var barjspath = [];
        var bars = this.element.find(".flowbar-menu");
        bars.each(function () {
            var data = $(this).data("data");
            if (data.disable) return;

            var paths = data.menuinfo.method.split('?');
            if (paths.length > 1) {
                //barjspath.push(paths[0]);
                Flowbar.opername = paths[1];
                if (Flowbar.opername.indexOf("Ntx.Public.Operation") != -1) {
                    loadPublicLoad(Flowbar.opername);
                }
                else {
                    steal.then(paths[0]);
                }

            }
        });

        var menuClick = function () {
            self.refreshStatus(self.startMenu);
        };

        steal.then(menuClick);

        /*if(barjspath.length > 0) {
            var args = [];
            args = args.concat(barjspath);
            args.push(menuClick);
            steal.then.apply(steal,args);
        }else{
            steal.then(menuClick);
        }*/

        if (typeof(this.options.onmousemove) == "function") this.element.delegate(".flowbar-menu", "onmousemove", this.options.onmousemove);
        if (typeof(this.options.onmouseout) == "function") this.element.delegate(".flowbar-menu", "onmouseout", this.options.onmouseout);
    },

    /**
     * 获取当前选中流程节点
     *
     * @author 关德俊
     * @date 2014-3-12
     */
    getSelectFlowNode: function () {
        return this.selectFlow;
    },

    /**
     * @descriptioin 获取工具菜单
     * @param symenufk 工具菜单的父菜单
     * @Function Private
     */
    _getToolsdatas: function (symenufk) {
        var returnData = null;
        var params = {
            async: false,
            url: Ntutil.defaults.url,
            servicename: Ntutil.defaults.servicename,
            method: "getList",
            data: [{
                querykey: "System.memu.getToolsdatas",
                args: {symenufk: symenufk}
            }]
        };
        Models.Form.find(params, function (data) {
            returnData = data.data[0].data;
        });

        return returnData;
    },

    /**
     * @descriptioin 获取菜单数据
     * @param symenufk 菜单id
     * @Function Private
     */
    _getMenuData: function (symenufk) {
        var returnData = null;
        var params = {
            async: false,
            url: Ntutil.defaults.url,
            servicename: Ntutil.defaults.servicename,
            method: "getList",
            data: [{
                querykey: "System.Symenu.list",
                args: {id: symenufk}
            }]
        };
        Models.Form.find(params, function (data) {
            returnData = data.data[0].data[0];
        });

        return returnData;
    },

    /**
     * @descript 获取svg标签的标记
     * @param 标记的ID
     * @param color标记颜色
     * @function Private
     * @author 刘全
     * @date 2014-03-12
     */
    _getSvgMarker: function (id, color) {
        var m = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        m.setAttribute("id", id);
        m.setAttribute("viewBox", "0 0 6 6");
        m.setAttribute("refX", 5);
        m.setAttribute("refY", 3);
        m.setAttribute("markerUnits", "strokeWidth");
        m.setAttribute("markerWidth", 6);
        m.setAttribute("markerHeight", 6);
        m.setAttribute("orient", "auto");
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 0 0 L 6 3 L 0 6 z");
        path.setAttribute("fill", color);
        path.setAttribute("stroke-width", 0);
        m.appendChild(path);
        return m;
    },


    /**
     * @description 创建一个菜单
     * @param node 菜单信息 格式{color:"red",name:"",id:"",left:20,top:20,width:100,height:30}
     * @function Private
     * @author 刘全
     * @date 2014-03-12
     */
    _createMenu: function (prop) {
        var menu = $("<div class='flowbar-menu'>" +
            "<div class='flowbar-menu-recordcount'></div>" +
            "</div>").css({
            left: prop.left,
            top: prop.top,
            cursor: "pointer"
        })
            .attr({
                id: prop.id,
                code: prop.menuinfo.code,
                symenufk: prop.menuinfo.id
            });
        $("<table class='flowbar-menu-table'>" +
            "<tr>" +
            "<td>" + prop.name + " </td" +
            "</tr>" +
            "</table>")
            .css({
                width: prop.width,
                height: prop.height
            }).appendTo(menu);
        menu.addClass(this.getStatusClass());
        menu.tips({content: prop.instruction, show: {event: 'mouseenter', delay: 3000}});
        return menu;
    },

    /**
     * @description 添加连线
     * @param json 连线信息 格式{name:"",flowbarmenufk:"",nextflowbarmenufk:"",type:"",M:50}
     * @param id 连线的id
     * @function Private
     * @author 刘全
     * @date 2014-03-12
     */
    _addLine: function (id, json) {
        if (!json.name) json.name = "";
        if (json.flowbarmenufk == json.nextflowbarmenufk) return;
        //避免两个节点间不能有一条以上同向接连线
        for (var k in this.$lineData) {
            if ((json.flowbarmenufk == this.$lineData[k].flowbarmenufk && json.nextflowbarmenufk == this.$lineData[k].nextflowbarmenufk))
                return;
        }
        var n1 = $("#" + json.flowbarmenufk).data("data"), n2 = $("#" + json.nextflowbarmenufk).data("data");
        if (!n1 || !n2) return;
        var res;
        if (json.type && json.type != "sl")
            res = this._calcPolyPoints(n1, n2, json.type, json.M);
        else
            res = this._calcStartEnd(n1, n2);
        if (!res) return;

        var lineDom;
        if (json.type == "sl")
            lineDom = this._drawLine(id, res.start, res.end, json.mark);
        else
            lineDom = this._drawPoly(id, res.start, res.m1, res.m2, res.end, json.mark);
        this.linePanel.appendChild(lineDom);
        if (!this._isUseSVG()) {
            lineDom.childNodes[1].innerHTML = json.name;
            if (json.type != "sl") {
                var Min = (res.start[0] > res.end[0] ? res.end[0] : res.start[0]);
                if (Min > res.m2[0]) Min = res.m2[0];
                if (Min > res.m1[0]) Min = res.m1[0];
                lineDom.childNodes[1].style.left = (res.m2[0] + res.m1[0]) / 2 - Min - lineDom.childNodes[1].offsetWidth / 2 + 4;
                Min = (res.start[1] > res.end[1] ? res.end[1] : res.start[1]);
                if (Min > res.m2[1]) Min = res.m2[1];
                if (Min > res.m1[1]) Min = res.m1[1];
                lineDom.childNodes[1].style.top = (res.m2[1] + res.m1[1]) / 2 - Min - lineDom.childNodes[1].offsetHeight / 2;
            } else
                lineDom.childNodes[1].style.left =
                    ((res.end[0] - res.start[0]) * (res.end[0] > res.start[0] ? 1 : -1) - lineDom.childNodes[1].offsetWidth) / 2 + 4;
        }
        else lineDom.childNodes[2].textContent = json.name;
    },

    /**
     * @description 画一条只有两个中点的折线
     * @function private
     * @param id 连线id
     * @param sp 开始菜单坐标
     * @param m1 开始菜单中断的x(y)坐标
     * @param m2 结束菜单中断的x(y)坐标
     * @param ep 结束菜单坐标
     * @param mark 标记
     * @author 刘全
     * @date 2014-02-28
     */
    _drawPoly: function (id, sp, m1, m2, ep, mark) {
        var poly, strPath;
        if (this._isUseSVG()) {
            poly = document.createElementNS("http://www.w3.org/2000/svg", "g");
            var hi = document.createElementNS("http://www.w3.org/2000/svg", "path");
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            if (id != "") poly.setAttribute("id", id);
            poly.setAttribute("flowbarmenufk", sp[0] + "," + sp[1]);
            poly.setAttribute("nextflowbarmenufk", ep[0] + "," + ep[1]);
            hi.setAttribute("visibility", "hidden");
            hi.setAttribute("stroke-width", 9);
            hi.setAttribute("fill", "none");
            hi.setAttribute("stroke", "white");
            strPath = "M " + sp[0] + " " + sp[1];
            if (m1[0] != sp[0] || m1[1] != sp[1])
                strPath += " L " + m1[0] + " " + m1[1];
            if (m2[0] != ep[0] || m2[1] != ep[1])
                strPath += " L " + m2[0] + " " + m2[1];
            strPath += " L " + ep[0] + " " + ep[1];
            hi.setAttribute("d", strPath);
            hi.setAttribute("pointer-events", "stroke");
            path.setAttribute("d", strPath);
            path.setAttribute("stroke-width", 1.4);
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("fill", "none");
            if (mark) {
                path.setAttribute("stroke", "#ff3300");
                path.setAttribute("marker-end", "url(#arrow2)");
            }
            else {
                path.setAttribute("stroke", "#5068AE");
                path.setAttribute("marker-end", "url(#arrow1)");
            }
            poly.appendChild(hi);
            poly.appendChild(path);
            var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            //text.textContent=id;
            poly.appendChild(text);
            var x = (m2[0] + m1[0]) / 2;
            var y = (m2[1] + m1[1]) / 2;
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("x", x);
            text.setAttribute("y", y);
            text.style.cursor = "text";
            poly.style.cursor = "pointer";
        }
        else {
            poly = document.createElement("v:Polyline");
            if (id != "") poly.id = id;
            poly.filled = "false";
            strPath = sp[0] + "," + sp[1];
            if (m1[0] != sp[0] || m1[1] != sp[1])
                strPath += " " + m1[0] + "," + m1[1];
            if (m2[0] != ep[0] || m2[1] != ep[1])
                strPath += " " + m2[0] + "," + m2[1];
            strPath += " " + ep[0] + "," + ep[1];
            poly.points.value = strPath;
            poly.setAttribute("fromTo", sp[0] + "," + sp[1] + "," + ep[0] + "," + ep[1]);
            poly.strokeWeight = "1.2";
            poly.stroke.EndArrow = "Block";
            var text = document.createElement("div");
            //text.innerHTML=id;
            poly.appendChild(text);
            var x = (m2[0] - m1[0]) / 2;
            var y = (m2[1] - m1[1]) / 2;
            if (x < 0) x = x * -1;
            if (y < 0) y = y * -1;
            text.style.left = x + "px";
            text.style.top = y - 4 + "px";
            poly.style.cursor = "pointer";
            if (mark) poly.strokeColor = "#ff3300";
            else poly.strokeColor = "#5068AE";
        }
        return poly;
    },

    /**
     * @description 计算折线的所有坐标
     * @function private
     * @param n1 开始菜单
     * @param n2 结束菜单
     * @param type 连线类型
     * @param M 中段的X(或Y)的坐标
     * @author 刘全
     * @date 2014-02-28
     */
    _calcPolyPoints: function (n1, n2, type, M) {
        var pleft = this.element.position().left;
        var ptop = this.element.position().top;
        //开始/结束两个结点的中心
        var SP = {x: n1.left - pleft + n1.width / 2, y: n1.top - ptop + n1.height / 2};
        var EP = {x: n2.left - pleft + n2.width / 2, y: n2.top - ptop + n2.height / 2};
        var sp = [], m1 = [], m2 = [], ep = [];
        //如果是允许中段可左右移动的折线,则参数M为可移动中段线的X坐标
        //粗略计算起始点
        sp = [SP.x, SP.y];
        ep = [EP.x, EP.y];
        if (type == "lr") {
            //粗略计算2个中点
            M = M - this.options.leftinterval - pleft;
            m1 = [M, SP.y];
            m2 = [M, EP.y];
            //再具体分析修改开始点和中点1
            if (m1[0] > n1.left - pleft && m1[0] < n1.left - pleft + n1.width) {
                m1[1] = (SP.y > EP.y ? n1.top - ptop : n1.top - ptop + n1.height);
                sp[0] = m1[0];
                sp[1] = m1[1];
            }
            else {
                sp[0] = (m1[0] < n1.left - pleft ? n1.left - pleft : n1.left - pleft + n1.width);
            }
            //再具体分析中点2和结束点
            if (m2[0] > n2.left - pleft && m2[0] < n2.left - pleft + n2.width) {
                m2[1] = (SP.y > EP.y ? n2.top - ptop + n2.height : n2.top - ptop);
                ep[0] = m2[0];
                ep[1] = m2[1];
            }
            else {
                ep[0] = (m2[0] < n2.left - pleft ? n2.left - pleft : n2.left - pleft + n2.width);
            }
        }
        //如果是允许中段可上下移动的折线,则参数M为可移动中段线的Y坐标
        else if (type == "tb") {
            M = M - this.options.topinterval - ptop;
            //粗略计算2个中点
            m1 = [SP.x, M];
            m2 = [EP.x, M];
            //再具体分析修改开始点和中点1
            if (m1[1] > n1.top - ptop && m1[1] < n1.top - ptop + n1.height) {
                m1[0] = (SP.x > EP.x ? n1.left - pleft : n1.left - pleft + n1.width);
                sp[0] = m1[0];
                sp[1] = m1[1];
            }
            else {
                sp[1] = (m1[1] < n1.top - ptop ? n1.top - ptop : n1.top - ptop + n1.height);
            }
            //再具体分析中点2和结束点
            if (m2[1] > n2.top - ptop && m2[1] < n2.top - ptop + n2.height) {
                m2[0] = (SP.x > EP.x ? n2.left - pleft + n2.width : n2.left - pleft);
                ep[0] = m2[0];
                ep[1] = m2[1];
            }
            else {
                ep[1] = (m2[1] < n2.top - ptop ? n2.top - ptop : n2.top - ptop + n2.height);
            }
        }
        return {start: sp, m1: m1, m2: m2, end: ep};
    },


    /**
     * @description 计算直线连线的开始坐标和结束坐标
     * @function private
     * @param n1 开始菜单
     * @param n2 结束菜单
     * @author 刘全
     * @date 2014-02-28
     */
    _calcStartEnd: function (n1, n2) {
        var pleft = this.element.position().left;
        var ptop = this.element.position().top;
        var X_1, Y_1, X_2, Y_2;
        //X判断：
        var x11 = n1.left - pleft, x12 = n1.left - pleft + n1.width, x21 = n2.left - pleft,
            x22 = n2.left - pleft + n2.width;
        //结点2在结点1左边
        if (x11 >= x22) {
            X_1 = x11;
            X_2 = x22;
        }
        //结点2在结点1右边
        else if (x12 <= x21) {
            X_1 = x12;
            X_2 = x21;
        }
        //结点2在结点1水平部分重合
        else if (x11 <= x21 && x12 >= x21 && x12 <= x22) {
            X_1 = (x12 + x21) / 2;
            X_2 = X_1;
        }
        else if (x11 >= x21 && x12 <= x22) {
            X_1 = (x11 + x12) / 2;
            X_2 = X_1;
        }
        else if (x21 >= x11 && x22 <= x12) {
            X_1 = (x21 + x22) / 2;
            X_2 = X_1;
        }
        else if (x11 <= x22 && x12 >= x22) {
            X_1 = (x11 + x22) / 2;
            X_2 = X_1;
        }

        //Y判断：
        var y11 = n1.top - ptop, y12 = n1.top - ptop + n1.height, y21 = n2.top - ptop, y22 = n2.top - ptop + n2.height;
        //结点2在结点1上边
        if (y11 >= y22) {
            Y_1 = y11;
            Y_2 = y22;
        }
        //结点2在结点1下边
        else if (y12 <= y21) {
            Y_1 = y12;
            Y_2 = y21;
        }
        //结点2在结点1垂直部分重合
        else if (y11 <= y21 && y12 >= y21 && y12 <= y22) {
            Y_1 = (y12 + y21) / 2;
            Y_2 = Y_1;
        }
        else if (y11 >= y21 && y12 <= y22) {
            Y_1 = (y11 + y12) / 2;
            Y_2 = Y_1;
        }
        else if (y21 >= y11 && y22 <= y12) {
            Y_1 = (y21 + y22) / 2;
            Y_2 = Y_1;
        }
        else if (y11 <= y22 && y12 >= y22) {
            Y_1 = (y11 + y22) / 2;
            Y_2 = Y_1;
        }
        return {"start": [X_1, Y_1], "end": [X_2, Y_2]};
    },

    /**
     * @description 绘制一条带箭头的连线，并返回连线的dom
     * @param id 连线id
     * @param sp 起始坐标
     * @param ep 结束坐标
     * @function Private
     * @author 刘全
     * @date 2014-03-05
     */
    _drawLine: function (id, sp, ep, mark, dash) {
        var line;
        if (this._isUseSVG()) {
            line = document.createElementNS("http://www.w3.org/2000/svg", "g");
            var hi = document.createElementNS("http://www.w3.org/2000/svg", "path");
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            if (id != "") line.setAttribute("id", id);
            line.setAttribute("flowbarmenufk", sp[0] + "," + sp[1]);
            line.setAttribute("nextflowbarmenufk", ep[0] + "," + ep[1]);
            hi.setAttribute("visibility", "hidden");
            hi.setAttribute("stroke-width", 9);
            hi.setAttribute("fill", "none");
            hi.setAttribute("stroke", "white");
            hi.setAttribute("d", "M " + sp[0] + " " + sp[1] + " L " + ep[0] + " " + ep[1]);
            hi.setAttribute("pointer-events", "stroke");
            path.setAttribute("d", "M " + sp[0] + " " + sp[1] + " L " + ep[0] + " " + ep[1]);
            path.setAttribute("stroke-width", 1.4);
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("fill", "none");
            if (dash) path.setAttribute("style", "stroke-dasharray:6,5");
            if (mark) {
                path.setAttribute("stroke", "#ff3300");
                path.setAttribute("marker-end", "url(#arrow2)");
            }
            else {
                path.setAttribute("stroke", "#5068AE");
                path.setAttribute("marker-end", "url(#arrow1)");
            }
            line.appendChild(hi);
            line.appendChild(path);
            line.style.cursor = "crosshair";
            if (id != "" && id != "GooFlow_tmp_line") {
                var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                //text.textContent=id;
                line.appendChild(text);
                var x = (ep[0] + sp[0]) / 2;
                var y = (ep[1] + sp[1]) / 2;
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("x", x);
                text.setAttribute("y", y);
                line.style.cursor = "pointer";
                text.style.cursor = "text";
            }
        } else {
            line = document.createElement("v:polyline");
            if (id != "") line.id = id;
            //line.style.position="absolute";
            line.points.value = sp[0] + "," + sp[1] + " " + ep[0] + "," + ep[1];
            line.setAttribute("fromTo", sp[0] + "," + sp[1] + "," + ep[0] + "," + ep[1]);
            line.strokeWeight = "1.2";
            line.stroke.EndArrow = "Block";
            line.style.cursor = "crosshair";
            if (id != "" && id != "GooFlow_tmp_line") {
                var text = document.createElement("div");
                //text.innerHTML=id;
                line.appendChild(text);
                var x = (ep[0] - sp[0]) / 2;
                var y = (ep[1] - sp[1]) / 2;
                if (x < 0) x = x * -1;
                if (y < 0) y = y * -1;
                text.style.left = x + "px";
                text.style.top = y - 6 + "px";
                line.style.cursor = "pointer";
            }
            if (dash) line.stroke.dashstyle = "Dash";
            if (mark) line.strokeColor = "#ff3300";
            else line.strokeColor = "#5068AE";
        }
        return line;
    },

    /**
     * @description 判断是否使用svg标签
     * @function private
     * @author 刘全
     * @date 2014-02-28
     */
    _isUseSVG: function () {
        if (navigator.userAgent.indexOf("MSIE 8.0") > 0 || navigator.userAgent.indexOf("MSIE 7.0") > 0 || navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * @description 重置高度和宽度
     * @function private
     * @author 刘全
     * @date 2014-02-28
     */
    _resetWH: function () {
        this.linePanel.style.width = this.width + "px";
        this.linePanel.style.height = this.height + "px";
    },

    /**
     * @description 获取菜单数据
     * @function private
     * @author 刘全
     * @date 2014-02-28
     */
    _getData: function (fn) {
        var self = this;
        var returnData = null;
        var params = {
            async: fn ? true : false,
            url: Ntutil.defaults.url,
            servicename: "flowbarService",
            method: "getFlowbarData",
            symenufk: this.options.symenufk
        };
        Models.Form.find(params, function (data) {
            returnData = data;
            if (fn) fn.call(self, returnData);
        });

        return returnData;
    },

    /**
     * @description 获取菜单
     * @function private
     * @param code 菜单编号
     * @author 刘全
     * @date 2014-02-28
     */
    getMenu: function (code) {
        if (code) return this.$panel.find(".flowbar-menu[code='" + code + "']");
        return this.$panel.find(".flowbar-menu");
    },

    /**
     * @description 获取当前选中的菜单
     * @author 刘全
     * @date 2014-02-28
     */
    getSelectMenu: function () {
        return this.selectMenu;
    },

    /**
     * @public
     * @function
     * @description 重新刷新flowbar
     * @param args type:json qkey查询的参数
     * @param cargs type:json cqkey查询的参数
     * @author 刘全
     * @date 2014-02-28
     */
    refresh: function (symenufk) {
        if (symenufk) this.symenufk = symenufk;
        this._getData(function (data) {
            this.width = 0;
            this.height = 0;
            this.$panel.html("");
            this.linePanel = this._createLinePanel();
            this.$panel.append(this.linePanel);
            this._createMenus(data.children.nodes);
            this._createLines(data.children.lines);
            this._resetWH();
            this._createPostpositionMenus();
            if (typeof(this.options.onsuccess) == "function") this.options.onsuccess.call(this);
        });
    },

    /**
     * @public
     * @function
     * @description 重置菜单，可以更新颜色和是否可以点击
     * @param menus type:array 需要重置的菜单，格式：[{id:"1",status:"P",recordcount:50}]
     * @author 刘全
     * @date 2014-02-28
     */
    resetMenus: function (menus) {
        var self = this;
        for (var i = 0, l = menus.length; i < l; i++) {
            var menuobj = menus[i];
            var $menu = $("#" + menuobj.id);
            if ($menu.length == 0) return;
            var data = $menu.data("data");
            $menu.removeClass(self.getStatusClass(data.flowbarMenuStatus));
            data.flowbarMenuStatus = menuobj.status;
            data.recordcount = menuobj.recordcount;
            var $recordcount = $menu.find(".flowbar-menu-recordcount");
            if (typeof(menuobj.recordcount) == "number") {
                if (menuobj.recordcount > 0) {
                    $recordcount.html(menuobj.recordcount);
                    $recordcount.show();
                } else {
                    $recordcount.hide();
                }
            }
            if (!$menu.hasClass(self.getStatusClass("S"))) $menu.addClass(self.getStatusClass(data.flowbarMenuStatus));
            data.disable = self.getMenuDisable(data.flowbarMenuStatus);
        }
        self._createPostpositionMenus();
    },

    /**
     * @public
     * @function
     * @description 创建后置菜单(多个)
     * @author 刘全
     * @date 2014-06-05
     */
    _createPostpositionMenus: function () {
        var self = this;
        var $rowGroup = self.flowbarTable.find(".flowbar-table-row-group");
        $rowGroup.html("");
        var n = 0;//记录后置业务个数
        self.getMenu().each(function (index, el) {
            var $el = $(el);
            var data = $el.data("data");
            var flowbarNext = data.flowbarNext;
            var $row = null;
            for (var i = 0, l = flowbarNext.length; i < l; i++) {
                if (flowbarNext[i].isdefault != "N") continue;
                if (n % 2 == 0) {
                    $row = $('<ul class="flowbar-table-row"></ul>').appendTo($rowGroup);
                }
                $('<li class="flowbar-table-cell"><b>'
                    + flowbarNext[i].symenuname + '</b>(' + data.menuinfo.name + ')' +
                    '</li>')
                    .appendTo($row)
                    .data("data", flowbarNext[i]);
                n++;
            }
        });
        if (n == 0) $rowGroup.html("暂无后置业务");
        self.flowbarTable.parent().css("right", -self.flowbarTable.outerWidth());
        $rowGroup.delegate(".flowbar-table-cell", "click", function () {
            var $cell = $(this);
            var data = $cell.data("data");
            var menuData = self._getMenuData(data.symenufk);

            var $parentDiv = $(window.frameElement.parentNode.parentNode).find(">div[symenufk='" + menuData.parentid + "']");
            if ($parentDiv.length > 0) {//模块已打开，直接触发菜单点击
                window.parent.document.getElementById(menuData.parentid).click();
                $($parentDiv.find(">iframe#inner-frame")[0].contentWindow.document.body).find(".flowbar-menu[symenufk='" + data.symenuid + "']").click();
            } else {
                //绑定跳转后处理事件，跳转到对应模块后，触发对应菜单的点击
                window.parent.flowbarPostProcess = function (win) {
                    $(win.document.body).find(".flowbar-menu[symenufk='" + data.symenufk + "']").click();
                    //对应菜单点击后，清空后置处理事件
                    window.parent.flowbarPostProcess = null;
                };
                window.parent.document.getElementById(menuData.parentid).click();
            }
        });
    },

    /**
     * @public
     * @function
     * @description 获取菜单的disable
     * @param status 菜单的状态
     * @author 刘全
     * @date 2014-02-28
     */
    getMenuDisable: function (status) {
        var result = false;

        switch (status) {
            case "S":
                result = false;
                break;
            case "C":
                result = false;
                break;
            case "P":
                result = false;
                break;
            case "N":
                result = true;
                break;
            default:
                result = false;
                break;
        }

        return result;
    },

    /**
     * @public
     * @function
     * @description 获取菜单的样式
     * @param status 菜单的状态
     * @author 刘全
     * @date 2014-02-28
     */
    getStatusClass: function (status) {
        var className;
        switch (status) {
            case "S":
                className = "status-S";
                break;
            case "C":
                className = "status-C";
                break;
            case "P":
                className = "status-P";
                break;
            case "N":
                className = "status-N";
                break;
            default:
                className = "status-D";
                break;
        }
        return className;
    },

    /**
     * @public
     * @function
     * @description 构造后续业务
     * @author 黄海翔
     * @date 2014-05-02
     */
    _createNextBusiness: function () {
        var userinfo = parent.userinfo;
        if (!userinfo) {
            return;
        }
        var nexts = this.options.nextbusiness;
        if ($.isArray(nexts) == false) {
            return;
        }
        var tmp1 = new Object();
        $.each(nexts, function (index, value) {
            if (typeof value == "string") {
                tmp1[encodeURIComponent(value)] = true;
            }
        });
        var menus = userinfo.getMenu();
        if ($.isArray(menus) == false) {
            return;
        }
        var nextmenus = new Object();
        $.each(menus, function (index, value) {
            var code = value["code"];
            if (tmp1[encodeURIComponent(code)] == true) {
                nextmenus[code] = value;
            }
        });
        delete tmp1;
        if (!nextmenus) {
            return;
        }

        var nextwidth = this.options.nextbusinesswidth;
        if (!nextwidth) {
            nextwidth = 150;
        }
        this.$nextbar = $('<div class="nextbar"></div>').css({
            "position": "absolute",
            "width": "20px",
            "height": "80px",
            "top": "7px",
            "right": "0",
            "overflow": "hidden",
            "background-color": "orange",
            "color": "#000000",
            "font-family": "微软雅黑",
            "font-size": "12px",
            "font-weight": "normal",
            "border-top-left-radius": "5px",
            "border-bottom-left-radius": "5px"
        });
        this.$nextcaption = $("<div>后续业务</div>").css({
            "position": "absolute",
            "width": "15px",
            "height": "70px",
            "top": "5px",
            "left": "5px"
        }).appendTo(this.$nextbar);
        this.$nextmenus = $("<div></div>").css({
            "position": "absolute",
            "height": "70px",
            "top": "5px",
            "left": "20px"
        }).appendTo(this.$nextbar);
        var $menus = this.$nextmenus;
        var labelheight = 17;
        var interval = 5;
        this._nextbusinesswidth = interval + (nextwidth + interval) * (parseInt(nexts.length / 3, 10) + ((nexts.length % 3 == 0) ? 0 : 1));
        $.each(nexts, function (index, value) {
            var menu = nextmenus[value];
            if (!menu) {
                return;
            }
            var x = interval + parseInt(index / 3, 10) * (nextwidth + interval);
            var y = interval + (index % 3) * (labelheight + interval);
            var $nextmenu = $("<div>" + menu["name"] + "</div>").css({
                "position": "absolute",
                "width": nextwidth,
                "height": labelheight,
                "top": y,
                "left": x,
                "text-align": "center",
                "background-color": "yellow",
                "border-radius": "5px",
                "cursor": "pointer"
            }).appendTo($menus);
            $nextmenu.click(function () {
                var maintab = parent.maintab;
                if (!maintab) {
                    return;
                }
                var tab = maintab.getAlter(menu.id);
                if (tab.length == 0) {
                    maintab.add({
                        id: menu.id,
                        title: menu.name,
                        url: menu.url,
                        method: menu.method
                    });
                } else {
                    maintab.activate(tab.index() - 1);
                }
            });
        });
        var cusload = this;
        this.$nextbar.mouseenter(function () {
            $(this).width($(this).width() + cusload._nextbusinesswidth);
        });
        this.$nextbar.mouseleave(function () {
            $(this).width($(this).width() - cusload._nextbusinesswidth);
        });
        this.$panel.append(this.$nextbar);
    },

    /**
     * @public
     * @function
     * @description 刷新业务线权限状态、待办以及自动点击业务线节点
     * @author 黄海翔
     * @date 2014-05-02
     */
    refreshStatus: function (start) {
        var flowbar = this;
        if (typeof flowbar.options.onsuccess == "function") {
            return;
        }
        if (!flowbar.options.symenufk)
            return;
        var able = null;

        var gParam = null;
        if (top.frames && top.frames.length && top.frames[0].gParam) {
            gParam = top.frames[0].gParam;
            top.frames[0].gParam = undefined;
        }

        Models.Form.find({
            async: true,
            url: Ntutil.defaults.url,
            servicename: Ntutil.defaults.servicename,
            method: "getList",
            data: [{
                querykey: "System.Symenu.getByParentId",
                args: {
                    parentid: flowbar.options.symenufk
                }
            }]
        }, function (d) {
            var data = d.data[0].data;
            var valid = new Object();
            $.each(data, function (i, v) {
                valid[v.id] = v.method.substring(v.method.indexOf("?") + 1);
            });
            var $menu = flowbar.getMenu();
            var settings = new Array();
            $.each($menu, function (i, v) {
                var symenufk = $(v).attr("symenufk");
                var id = $(v).attr("id");
                if (valid[symenufk]) {
                    settings.push({
                        id: id,
                        status: "D",
                        cusload: valid[symenufk],
                        _symenufk_: symenufk
                    });
//						if (!able) {
//							able = v;
//						}
                    if (gParam) {
                        var menuinfo = $(v).data("data")["menuinfo"];
                        var method = menuinfo["method"];
                        method = method.substring(method.indexOf("?") + 1);
                        if (gParam["isFromMsg"] && method.toLowerCase() === gParam["objname"].toLowerCase()) {
                            start = $(v);

                            if (typeof(gParam["removeMsg"]) === "function") {
                                gParam.removeMsg(gParam);
                            }
                        }
                    }
                } else {
                    settings.push({
                        id: id,
                        status: "N"
                    });
                }
            });
            var qkeys = new Array();
            $.each(settings, function (i, v) {
                if (v.cusload) {
                    var cusload = null;
                    try {
                        cusload = eval(v.cusload);
                    } catch (e) {
                        cusload = null;
                    }
                    if (!cusload || !cusload.defaults || !cusload.defaults.dependlist) return;
                    var todokey = cusload.defaults.dependlist.flowbarkey || cusload.defaults.dependlist.todokey;
                    if (!todokey) return;
                    var params = {
                        ispage: true,
                        pagesize: 1,
                        querykey: todokey,
                        _index_: i
                    };
                    if (typeof cusload.defaults.dependlist.getArgs == "function") {
                        try {
                            params.args = cusload.defaults.dependlist.getArgs.call(cusload, true, null, v["_symenufk_"]);
                        } catch (e) {
                        }
                    }
                    qkeys.push(params);
                }
            });
            if (qkeys.length) {
                Models.Form.find({
                    async: false,
                    url: Ntutil.defaults.url,
                    servicename: Ntutil.defaults.servicename,
                    method: "getList",
                    data: qkeys
                }, function (d) {
                    var counts = d.data;
                    $.each(counts, function (i, v) {
                        settings[qkeys[i]["_index_"]]["recordcount"] = v["recordcount"];
                    });
                });
            }
            flowbar.resetMenus(settings);
            if (start && start.jquery && !start.hasClass("status-N")) {
                start.click();
            } else if (able) {
                able.click();
            }
        });
    }
}