﻿(function ($, learun) {
    "use strict";
    $.lrselect = {
        htmlToData: function ($self) {
            var dfop = $self[0]._lrselect.dfop;
            var $ul = $self.find('ul');
            dfop.data = [];
            $ul.find('li').each(function () {
                var $li = $(this);
                var point = { id: $li.attr('data-value'), text: $li.html() }
                dfop.data.push(point);
            });
            $ul.remove();
            $ul = null;
            dfop = null;
        },
        initRender: function (dfop, $self) {
            var $option = $('<div class="lr-select-option" id="learun_select_option_' + dfop.id + '"></div>');

            var $optionContent = $('<div class="lr-select-option-content"></div>');
            var $ul = $('<ul id="learun_select_option_content' + dfop.id + '"></ul>');
            $optionContent.css('max-height', dfop.maxHeight + 'px');
            $option.hide();
            $optionContent.html($ul);
            $option.prepend($optionContent);
            if (dfop.allowSearch) {
                var $search = $('<div class="lr-select-option-search"><input type="text" id="sdcmZD" placeholder="搜索关键字"><span class="input-query" title="查询"><i class="iconfont icon-sousuosearch82"></i></span></div>');
                $option.append($search);
                $option.css('padding-bottom', '25px');
                $search.on('click', function () { return false; });
                $search.find('input').on("keypress", function (e) {
                    if (event.keyCode == "13") {
                        var $this = $(this);
                        var keyword = $this.val();
                        var $select = $this.parents('.lr-select');
                        var dfop = $select[0]._lrselect.dfop;
                        if (dfop.type == "tree" || dfop.type == "treemultiple") {
                            var $optionContent = $this.parent().prev();
                            $optionContent.lrtreeSet('search', { keyword: keyword });
                        }
                        else if (dfop.type == "default" || dfop.type == "multiple") {
                            for (var i = 0, l = dfop.data.length; i < l; i++) {
                                var _item = dfop.data[i];
                                if (!keyword || _item[dfop.text].indexOf(keyword) != -1) {
                                    _item._lrhide = false;
                                }
                                else {
                                    _item._lrhide = true;
                                }
                            }
                            $.lrselect.render(dfop);
                        }

                    }
                });
                //添加搜索按钮点击事件
                $search.find('.input-query').on("click", function (e) {
                    var $this = $(this);
                    var keyword = $this.parent().find("input").val();
                    var $select = $this.parents('.lr-select');
                    var dfop = $select[0]._lrselect.dfop;
                    if (dfop.type == "tree" || dfop.type == "treemultiple") {
                        var $optionContent = $this.parent().prev();
                        $optionContent.lrtreeSet('search', { keyword: keyword });
                    }
                    else if (dfop.type == "default" || dfop.type == "multiple") {
                        for (var i = 0, l = dfop.data.length; i < l; i++) {
                            var _item = dfop.data[i];
                            if (!keyword || _item[dfop.text].indexOf(keyword) != -1) {
                                _item._lrhide = false;
                            }
                            else {
                                _item._lrhide = true;
                            }
                        }
                        $.lrselect.render(dfop);
                    }
                });
                $search.find('#sdcmZD').bind("input propertychange", function () {
                    var $this = $(this);
                    var keyword = $this.parent().find("input").val();
                    var $select = $this.parents('.lr-select');
                    var dfop = $select[0]._lrselect.dfop;
                    if (keyword == "") {
                        if (dfop.type == "tree" || dfop.type == "treemultiple") {
                            var $optionContent = $this.parent().prev();
                            $optionContent.lrtreeSet('search', { keyword: keyword });
                        }
                        else if (dfop.type == "default" || dfop.type == "multiple") {
                            for (var i = 0, l = dfop.data.length; i < l; i++) {
                                var _item = dfop.data[i];
                                if (!keyword || _item[dfop.text].indexOf(keyword) != -1) {
                                    _item._lrhide = false;
                                }
                                else {
                                    _item._lrhide = true;
                                }
                            }
                            $.lrselect.render(dfop);
                        }
                    }
                });
            }
            $self.append($option);
            $self.append('<div class="lr-select-placeholder" >==' + dfop.placeholder + '==</div>');
            $self.attr('type', 'lrselect').addClass('lr-select');

            if (dfop.type != 'tree') {
                $optionContent.mCustomScrollbar({ // 优化滚动条
                    theme: "minimal-dark"
                });
            }
        },
        render: function (dfop) {
            switch (dfop.type) {
                case 'default':
                    $.lrselect.defaultRender(dfop);
                    break;
                case 'tree':
                case 'treemultiple':
                    $.lrselect.treeRender(dfop);
                    break;
                case 'gird':
                    break;
                case 'multiple':
                    $.lrselect.multipleRender(dfop);
                    break;
                default:
                    break;
            }
            dfop.isrender = true;

        },
        defaultRender: function (dfop) {
            var $ul = $('#learun_select_option_content' + dfop.id);
            $ul.html("");
            if (!!dfop.placeholder) {
                $ul.append('<li data-value="" class="lr-selectitem-li" >==' + dfop.placeholder + '==</li>');
            }
            for (var i = 0, l = dfop.data.length; i < l; i++) {
                var item = dfop.data[i];
                if (!item._lrhide) {
                    var $li = $('<li data-value="' + i + '" class="lr-selectitem-li" >' + item[dfop.text] + '</li>');
                    $ul.append($li);
                }

            }
        },
        multipleRender: function (dfop) {
            var $ul = $('#learun_select_option_content' + dfop.id);
            $ul.html("");
            if (!!dfop.placeholder) {
                $ul.append('<li data-value="" class="lr-selectitem-li" >==' + dfop.placeholder + '==</li>');
            }
            for (var i = 0, l = dfop.data.length; i < l; i++) {
                var item = dfop.data[i];
                if (!item._lrhide) {
                    if (!!dfop.multipleMapValue && dfop.multipleMapValue[i] != undefined) {
                        var $li = $('<li data-value="' + i + '" class="lr-selectitem-li" ><img class="lr-select-node-cb" src="/Content/images/learuntree/checkbox_1.png">' + item[dfop.text] + '</li>');
                        $ul.append($li);
                    }
                    else {
                        var $li = $('<li data-value="' + i + '" class="lr-selectitem-li" ><img class="lr-select-node-cb" src="/Content/images/learuntree/checkbox_0.png">' + item[dfop.text] + '</li>');
                        $ul.append($li);
                    }
                }
            }
        },
        treeRender: function (dfop) {
            var $option = $('#learun_select_option_' + dfop.id);
            $option.find('.lr-select-option-content').remove();
            var $optionContent = $('<div class="lr-select-option-content"></div>');
            $option.prepend($optionContent);
            $optionContent.css('max-height', dfop.maxHeight + 'px');
            dfop.data.unshift({
                "id": "-1",
                "text": '==' + dfop.placeholder + '==',
                "value": "",
                "icon": "-1",
                "parentnodes": "0",
                "showcheck": false,
                "isexpand": false,
                "complete": true,
                "hasChildren": false,
                "ChildNodes": []
            });
            var treeop = {
                data: dfop.data,
                nodeClick: $.lrselect.treeNodeClick
            };
            if (dfop.type == 'treemultiple') {
                treeop.nodeClick = $.lrselect.treeNodeClick2;
                treeop.nodeCheck = $.lrselect.treeNodeCheck;
            }
            $optionContent.lrtree(treeop);
        },
        bindEvent: function ($self) {
            $self.unbind('click');
            $self.on('click', $.lrselect.click);
            $(document).click(function (e) {
                $('.lr-select-option').slideUp(150);
                $('.lr-select').removeClass('lr-select-focus');
            });
        },
        click: function (e) {
            //hcy 解决鼠标点右边滚动条，下拉框消失的问题
            if (e.target.className != 'lr-select-placeholder' && e.target.className != 'lr-selectitem-li') {
                return false;
            };
            var $this = $(this);
            if ($this.attr('readonly') == 'readonly' || $this.attr('disabled') == 'disabled') {
                return false;
            }
            var dfop = $this[0]._lrselect.dfop;
            if (!dfop.isload) {
                return false;
            }
            if (!dfop.isrender) {
                $.lrselect.render(dfop);
            }

            // 选中下拉框的某一项
            var et = e.target || e.srcElement;
            var $et = $(et);

            var $option = $('#learun_select_option_' + dfop.id);
            if ($option.is(":hidden")) {
                $('.lr-select-option').slideUp(150);
                $('.lr-select').removeClass('lr-select-focus');


                $this.addClass('lr-select-focus');
                var width = dfop.width || $this.parent().width();
                $option.css('width', width).show();
                $option.find('.lr-select-option-search').find('input').select();
            } else {
                if (dfop.type != 'multiple') {
                    $option.slideUp(150);
                    $this.removeClass('lr-select-focus');
                }
            }

            if (dfop.type != 'multiple') {
                if ($et.hasClass('lr-selectitem-li')) {
                    var _index = $et.attr('data-value');
                    if (dfop._index != _index) {
                        var $inputText = $this.find('.lr-select-placeholder');

                        if (_index == '') {
                            $inputText.css('color', '#999');
                            $inputText.html('==' + dfop.placeholder + '==');
                        }
                        else {
                            $inputText.css('color', '#000');
                            $inputText.html(dfop.data[_index][dfop.text]);
                        }

                        $et.addClass('selected');
                        if (dfop._index != undefined && dfop._index != null) {
                            $option.find('.lr-selectitem-li[data-value="' + dfop._index + '"]').removeClass('selected');
                        }
                        dfop._index = _index;

                        $this.trigger("change");
                        if (!!dfop.select) {
                            dfop.select(dfop.data[_index]);
                        }
                    }
                }
            }
            else {

                if ($et.hasClass('lr-selectitem-li') || $et.hasClass('lr-select-node-cb')) {
                    var $inputText = $this.find('.lr-select-placeholder');
                    var $cbobj = $et.find('.lr-select-node-cb');;
                    var _index = $et.attr('data-value');
                    if ($et.hasClass('lr-select-node-cb')) {
                        $cbobj = $et;
                        _index = $et.parent().attr('data-value');
                    }


                    dfop.multipleMapValue = dfop.multipleMapValue || {};
                    dfop.multipleValue = dfop.multipleValue || [];
                    dfop.multipleText = dfop.multipleText || [];

                    if (dfop._index != undefined && dfop._index != null) {
                        $option.find('.lr-selectitem-li[data-value="' + dfop._index + '"]').removeClass('selected');
                    }

                    if (_index == '') {
                        $inputText.css('color', '#999');
                        $inputText.html('==' + dfop.placeholder + '==');
                        dfop.multipleMapValue = {};
                        dfop.multipleValue = [];
                        dfop.multipleText = [];

                        $option.find('.lr-select-node-cb[src$="checkbox_1.png"]').attr('src', '/Content/images/learuntree/checkbox_0.png');
                        $option.slideUp(150);
                        $this.removeClass('lr-select-focus');
                    }
                    else {
                        var selected = true;
                        if (dfop.multipleMapValue[_index] == undefined) {
                            $inputText.css('color', '#000');
                            dfop.multipleValue.push(dfop.data[_index][dfop.value]);
                            dfop.multipleText.push(dfop.data[_index][dfop.text]);
                            dfop.multipleMapValue[_index] = dfop.multipleText.length - 1;
                            $inputText.html(String(dfop.multipleText));

                            $cbobj.attr('src', '/Content/images/learuntree/checkbox_1.png');
                        }
                        else {


                            dfop.multipleText.splice(dfop.multipleMapValue[_index], 1);
                            dfop.multipleValue.splice(dfop.multipleMapValue[_index], 1);
                            delete dfop.multipleMapValue[_index];

                            if (dfop.multipleText.length == 0) {
                                $inputText.css('color', '#999');
                                $inputText.html('==' + dfop.placeholder + '==');
                            }
                            else {
                                $inputText.html(String(dfop.multipleText));
                            }
                            selected = false;
                            $cbobj.attr('src', '/Content/images/learuntree/checkbox_0.png');
                        }

                        $this.trigger("change");
                        if (!!dfop.select) {
                            dfop.select(dfop.data[_index], selected, $this);
                        }
                    }
                }
            }
            dfop = null;
            e.stopPropagation();
        },
        treeNodeClick: function (item, $item) {
            $item.parents('.lr-select-option').slideUp(150);
            var $select = $item.parents('.lr-select');
            var dfop = $select[0]._lrselect.dfop;
            $select.removeClass('lr-select-focus');
            dfop.currtentItem = item;
            var $inputText = $select.find('.lr-select-placeholder');
            $inputText.html(dfop.currtentItem.text);
            if (item.value == '') {
                $inputText.css('color', '#999');
            }
            else {
                $inputText.css('color', '#000');
            }
            $select.trigger("change");
            if (!!dfop.select) {
                dfop.select(dfop.currtentItem);
            }
        },
        treeNodeClick2: function (item, $item) {
            $tree = $item.parents('.lr-select-option-content');
            var $select = $item.parents('.lr-select');
            var dfop = $select[0]._lrselect.dfop;
            $select.removeClass('lr-select-focus');
            dfop.currtentItems = [];
            if (item.value == '') {
                $item.parents('.lr-select-option').slideUp(150);
                $tree.lrtreeSet('allNoCheck');
                var $inputText = $select.find('.lr-select-placeholder');
                $inputText.html(item.text);
                $inputText.css('color', '#999');
                $select.trigger("change");
                if (!!dfop.select) {
                    dfop.select([]);
                }
            }
        },
        treeNodeCheck: function (item, $item) {
            $tree = $item.parents('.lr-select-option-content');
            var $select = $item.parents('.lr-select');
            var $inputText = $select.find('.lr-select-placeholder');
            $select.removeClass('lr-select-focus');
            var dfop = $select[0]._lrselect.dfop;
            var data = $tree.lrtreeSet('getCheckNodesEx');
            dfop.currtentItems = data;
            var text = "";
            for (var i = 0, l = data.length; i < l; i++) {
                var one = data[i];
                if (text != "") {
                    text += ",";
                }
                text += one.text;
            }
            if (text == "") {
                $inputText.html("==" + dfop.placeholder + "==");
                $inputText.css('color', '#999');
            }
            else {
                $inputText.text(text);
                $inputText.css('color', '#000');
            }
            $select.trigger("change");
            if (!!dfop.select) {
                dfop.select(dfop.currtentItems);
            }
        },
        defaultValue: function ($self) {
            var dfop = $self[0]._lrselect.dfop;
            dfop.currtentItem = null;
            dfop._index = '';
            var $inputText = $self.find('.lr-select-placeholder');
            $inputText.css('color', '#999');
            $inputText.html('==' + dfop.placeholder + '==');
            $self.trigger("change");
        }
    };


    $.fn.lrselect = function (op) {
        var dfop = {
            // 请选择
            placeholder: "请选择",
            // 类型
            type: 'default',// default,tree,treemultiple,gird,multiple
            // 字段
            value: "id",
            text: "text",
            title: "title",
            // 展开最大高度
            maxHeight: 200,
            // 宽度
            width: 200,
            // 是否允许搜索
            allowSearch: false,
            // 访问数据接口地址
            url: false,
            data: false,
            // 访问数据接口参数
            param: null,
            // 接口请求的方法
            method: "GET",

            //选择事件
            select: false,

            isload: false, // 数据是否加载完成
            isrender: false// 选项是否渲染完成
        };
        $.extend(dfop, op || {});
        var $self = $(this);
        if ($self.length == 0) {
            return $self;
        }

        dfop.id = $self.attr('id');
        if (!dfop.id) {
            return false;
        }
        if (!!$self[0]._lrselect) {
            return $self;
        }

        $self[0]._lrselect = { dfop: dfop };
        // 基础信息渲染
        $.lrselect.bindEvent($self);

        // 数据获取方式有三种：url,data,html
        // url优先级最高
        if (!!dfop.url) {
            // learun.httpAsync(dfop.method, dfop.url, dfop.param, function (data) {
            //     $self[0]._lrselect.dfop.data = data || [];
            //     $self[0]._lrselect.dfop.backdata = data || [];
            //     dfop.isload = true;
            // });
            var data = [{
                checkstate: 0,
                complete: true,
                hasChildren: true,
                icon: null,
                id: "a5548f15-1565-4812-ba29-403d09dfd386",
                isexpand: true,
                parentId: "0",
                showcheck: false,
                text: "本人或户主",
                title: null,
                value: "01",
                ChildNodes: [{
                    checkstate: 0,
                    complete: true,
                    hasChildren: false,
                    icon: null,
                    id: "011111",
                    isexpand: true,
                    parentId: "a5548f15-1565-4812-ba29-403d09dfd386",
                    showcheck: false,
                    text: "本人",
                    title: null,
                    value: "01",
                    ChildNodes: []
                }, {
                    checkstate: 1,
                    complete: true,
                    hasChildren: false,
                    icon: null,
                    id: "022222",
                    isexpand: true,
                    parentId: "a5548f15-1565-4812-ba29-403d09dfd386",
                    showcheck: false,
                    text: "本人户主",
                    title: null,
                    value: "02",
                    ChildNodes: []
                }]
            }, {
                checkstate: 0,
                complete: true,
                hasChildren: false,
                icon: null,
                id: "2222222",
                isexpand: true,
                parentId: "0",
                showcheck: false,
                text: "大爷",
                title: null,
                value: "1",
                ChildNodes: []
            }];
            $self[0]._lrselect.dfop.data = data || [];
            $self[0]._lrselect.dfop.backdata = data || [];
            dfop.isload = true;
        }
        else if (!!dfop.data) {
                dfop.isload = true;
                dfop.backdata = dfop.data;
        }
        else {// 最后是html方式获取（只适合数据比较少的情况）
            $.lrselect.htmlToData($self);
            dfop.isload = true;
            dfop.backdata = dfop.data;
        }
        $.lrselect.initRender(dfop, $self);
        return $self;

    };

    $.fn.lrselectRefresh = function (op) {
        var $self = $(this);
        if ($self.length == 0) {
            return $self;
        }
        if (!$self[0]._lrselect) {
            return false;
        }
        var dfop = $self[0]._lrselect.dfop;
        if (!dfop) {
            return false;
        }
        $.extend(dfop, op || {});

        dfop.isload = false;
        dfop.isrender = false;
        if (!!dfop.url) {
            learun.httpAsync(dfop.method, dfop.url, dfop.param, function (data) {
                $self[0]._lrselect.dfop.data = data || [];
                $self[0]._lrselect.dfop.backdata = data || [];
                dfop.isload = true;
            });
        }
        else if (!!dfop.data) {
            dfop.isload = true;
            dfop.backdata = dfop.data;
        }
        $.lrselect.defaultValue($self);
        if (dfop._setValue != null && dfop._setValue != undefined) {
            $self.lrselectSet(dfop._setValue);
        }
    }


    $.fn.lrselectGet = function () {
        var $this = $(this);
        if ($this.length == 0) {
            return $this;
        }
        var dfop = $this[0]._lrselect.dfop;
        var value = '';
        switch (dfop.type) {
            case 'default':
                if (!!dfop.data[dfop._index]) {
                    value = dfop.data[dfop._index][dfop.value];
                }
                break;
            case 'tree':
                if (!!dfop.currtentItem) {
                    value = dfop.currtentItem[dfop.value];
                }
                break;
            case 'treemultiple':
                if (!!dfop.currtentItems) {
                    for (var i = 0, l = dfop.currtentItems.length; i < l; i++) {
                        if (value != "") {
                            value += ",";
                        }
                        value += dfop.currtentItems[i][dfop.value];
                    }
                }
                break;
            case 'gird':
                break;
            case 'multiple':
                dfop.multipleValue = dfop.multipleValue || [];
                return String(dfop.multipleValue);
                break;
            default:
                break;
        }
        return value;
    };

    $.fn.lrselectSet = function (value) {        
        // 设置数据的值
        var $this = $(this);
        if ($this.length == 0) {
            return $this;
        }
        value = value + '';
        if (value == '' || value == undefined || value == null) {
            $.lrselect.defaultValue($this);
            return $this;
        }
        var dfop = $this[0]._lrselect.dfop;
        dfop._setValue = null;
        if (!dfop) {
            return $this;
        }
        function _fn(dfop) {
            if (dfop.isload == false) {
                setTimeout(function () {
                    _fn(dfop);
                }, 100);
            }
            else if (dfop.isload == true) {
                var _currtentItem;
                switch (dfop.type) {
                    case 'default':
                        for (var i = 0, l = dfop.data.length; i < l; i++) {
                            if (dfop.data[i][dfop.value] == value) {
                                dfop._index = i;
                                _currtentItem = dfop.data[i];
                                break;
                            }
                        }
                        break;
                    case 'tree':
                        _currtentItem = $.lrtree.findItem(dfop.data, dfop.value, value);
                        dfop.currtentItem = _currtentItem;
                        break;
                    case 'treemultiple':
                        $.lrselect.render(dfop);
                        $this.find('.lr-select-option-content').lrtreeSet('setCheck', value.split(','));
                        return false;
                        break;
                    case 'gird':
                        break;
                    case 'multiple':
                        dfop.multipleMapValue = {};
                        dfop.multipleValue = [];
                        dfop.multipleText = [];
                        if (dfop.isrender) {
                            $this.find('.lr-select-node-cb[src$="checkbox_1.png"]').attr('src', '/Content/images/learuntree/checkbox_0.png');
                        }
                        var _valuellist = value.split(',');

                        for (var i = 0, l = dfop.data.length; i < l; i++) {
                            var _arrayIndex = $.inArray(dfop.data[i][dfop.value], _valuellist);
                            if (_arrayIndex != -1) {
                                dfop.multipleMapValue[i] = _arrayIndex;
                                dfop.multipleValue.push(dfop.data[i][dfop.value]);
                                dfop.multipleText.push(dfop.data[i][dfop.text]);

                                if (dfop.isrender) {
                                    $this.find('[data-value="' + i + '"] .lr-select-node-cb').attr('src', '/Content/images/learuntree/checkbox_1.png');
                                }
                                if (!!dfop.select) {
                                    dfop.select(dfop.data[i], true, $this);
                                }
                            }
                        }

                        _currtentItem = dfop.multipleText;
                        break;
                    default:
                        break;
                }


                if (!!_currtentItem) {
                    if (dfop.type == 'multiple') {
                        var $inputText = $this.find('.lr-select-placeholder');
                        if (dfop.multipleText.length > 0) {
                            $inputText.css('color', '#000');
                        }
                        else {
                            $inputText.css('color', '#999');
                        }
                        $inputText.html(String(dfop.multipleText));
                        $this.trigger("change");
                    } else {
                        var $inputText = $this.find('.lr-select-placeholder');
                        $inputText.html(_currtentItem[dfop.text]);
                        $inputText.css('color', '#000');
                        $this.trigger("change");
                        if (!!dfop.select) {
                            dfop.select(_currtentItem);
                        }
                    }
                }
                else {
                    dfop._setValue = value;
                }
            }
        }
        _fn(dfop);
        return $this;
    };

})(jQuery, top.learun);