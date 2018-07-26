
//初始化菜单和tab页的属性Id
var iframeIdList = {};
top.Sdcm.frameTab = {
    iframeId: '',
    init: function () {
        Sdcm.frameTab.bind();
    },
    bind: function () {
        $(".sdcm-frame-tabs-wrap").mCustomScrollbar({ // 优化滚动条
            axis: "x",
            theme: "minimal-dark"
        });
    },
    open: function (module, notAllowClosed) {
        var $tabsUl = $('#sdcm_frame_tabs_ul');
        var $frameMain = $('#sdcm_frame_main');

        if (iframeIdList[module.F_ModuleId] == undefined || iframeIdList[module.F_ModuleId] == null) {
            // 隐藏之前的tab和窗口
            if (Sdcm.frameTab.iframeId != '') {
                $tabsUl.find('#sdcm_tab_' + Sdcm.frameTab.iframeId).removeClass('active');
                $frameMain.find('#sdcm_iframe_' + Sdcm.frameTab.iframeId).removeClass('active');
                iframeIdList[Sdcm.frameTab.iframeId] = 0;
            }
            var parentId = Sdcm.frameTab.iframeId;
            Sdcm.frameTab.iframeId = module.F_ModuleId;
            iframeIdList[Sdcm.frameTab.iframeId] = 1;

            // 打开一个功能模块tab_iframe页面
            var $tabItem = $('<li class="sdcm-frame-tabItem active" id="sdcm_tab_' + module.F_ModuleId + '" parent-id="' + parentId + '"  ><span><i class="' + module.F_Icon + '"></i>&nbsp;' + module.F_FullName + '</span></li>');
            if (!notAllowClosed) {
                $tabItem.append('<span class="reomve" title="关闭窗口"></span>');
            }
            ////  放地址的地方
            var $iframe = $('<iframe class="sdcm-frame-iframe active" id="sdcm_iframe_' + module.F_ModuleId + '" frameborder="0" src="' + module.F_Url + '"></iframe>');
            $tabsUl.append($tabItem);
            $frameMain.append($iframe);

            $(".sdcm-frame-tabs-wrap").mCustomScrollbar("update");
            $(".sdcm-frame-tabs-wrap").mCustomScrollbar("scrollTo", $tabItem);

            //绑定一个点击事件
            $tabItem.on('click', function () {
                var id = $(this).attr('id').replace('sdcm_tab_', '');
                Sdcm.frameTab.focus(id);
            });
            $tabItem.find('.reomve').on('click', function () {
                var id = $(this).parent().attr('id').replace('sdcm_tab_', '');
                Sdcm.frameTab.close(id);
                return false;
            });

            // if (!notAllowClosed) {
            //     $.ajax({
            //         url: top.$.rootUrl + "/Home/VisitModule",
            //         data: { moduleName: module.F_FullName, moduleUrl: module.F_UrlAddress },
            //         type: "post",
            //         dataType: "text"
            //     });
            // }
        }
        else {
            Sdcm.frameTab.focus(module.F_ModuleId);
        }
    },
    focus: function (moduleId) {
        if (iframeIdList[moduleId] == 0) {
            // 定位焦点tab页
            $('#sdcm_tab_' + Sdcm.frameTab.iframeId).removeClass('active');
            $('#sdcm_iframe_' + Sdcm.frameTab.iframeId).removeClass('active');
            iframeIdList[Sdcm.frameTab.iframeId] = 0;

            $('#sdcm_tab_' + moduleId).addClass('active');
            $('#sdcm_iframe_' + moduleId).addClass('active');
            Sdcm.frameTab.iframeId = moduleId;
            iframeIdList[moduleId] = 1;
            $(".sdcm-frame-tabs-wrap").mCustomScrollbar("scrollTo", $('#sdcm_tab_' + moduleId));
        }
    },
    close: function (moduleId) {
        delete iframeIdList[moduleId];

        var $this = $('#sdcm_tab_' + moduleId);
        var $prev = $this.prev();// 获取它的上一个节点数据;
        if ($prev.length < 1) {
            $prev = $this.next();
        }
        $this.remove();
        $('#sdcm_iframe_' + moduleId).remove();
        if (moduleId == Sdcm.frameTab.iframeId && $prev.length > 0) {
            var prevId = $prev.attr('id').replace('sdcm_tab_', '');

            $prev.addClass('active');
            $('#sdcm_iframe_' + prevId).addClass('active');
            Sdcm.frameTab.iframeId = prevId;
            iframeIdList[prevId] = 1;
            $('.sdcm-frame-tabs').css('width', '10000px');
            $(".sdcm-frame-tabs-wrap").mCustomScrollbar("update");
            $('.sdcm-frame-tabs').css('width', 'calc(100% - 295px)');
            $(".sdcm-frame-tabs-wrap").mCustomScrollbar("scrollTo", $prev);
        }
        else {
            if ($prev.length < 1) {
                Sdcm.frameTab.iframeId = "";
            }
            $('.sdcm-frame-tabs').css('width', '10000px');
            $(".sdcm-frame-tabs-wrap").mCustomScrollbar("update");
            $('.sdcm-frame-tabs').css('width', 'calc(100% - 295px)');
        }
    } 
};

Sdcm.frameTab.init();