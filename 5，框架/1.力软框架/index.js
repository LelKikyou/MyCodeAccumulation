var sdcm = function ($, Sdcm, data) {
    // 菜单操作
    var meuns = {
        init: function () {
            this.load();
            this.bind();
            //全屏
            // this.fullScreenInit();
        },
        //全屏
        fullScreenInit: function () {
            var _html = '<div class="sdcm_frame_fullscreen"><a href="javascript:void(0);" id="sdcm_fullscreen_btn" title="全屏">全屏</a></div>';
            $('body').append(_html);
            $('#sdcm_fullscreen_btn').on('click', function () {
                if (!$(this).attr('fullscreen')) {
                    $(this).attr('fullscreen', 'true');
                    meuns.requestFullScreen();
                } else {
                    $(this).removeAttr('fullscreen');
                    meuns.exitFullscreen();
                }
            });
        },
        requestFullScreen: function () {
            var de = document.documentElement;
            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        },
        exitFullscreen: function () {
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        load: function () {
            // 第一级菜单
            var parentId = '0';
            var modules = data;
            console.log(modules)
            var $firstmenus = $('<ul class="sdcm-first-menu-list"></ul>');
            for (var i = 0, l = modules.length; i < l; i++) {
                var item = modules[i];
                var $firstMenuItem = $('<li></li>');
                var menuItemHtml = '<a id="' + item.id + '" href="javascript:void(0);" F_isState="' + (item.children.length == 0 ? "iframe" : "expand") + '" url="' + item.url + '" class="sdcm-menu-item">';
                menuItemHtml += '<i class="' + item.icon + ' iconfont "></i>';
                menuItemHtml += '<span class="sdcm-menu-item-text">' + item.name + '</span>';
                menuItemHtml += '<img src="images/jt.png" class="sdcm-menu-item-arrow"/></a>';
                $firstMenuItem.append(menuItemHtml);
                // 第二级菜单
                var secondModules = item.children;
                var $secondMenus = $('<ul class="sdcm-second-menu-list"></ul>');
                var secondMenuHad = false;
                for (var j = 0, sl = secondModules.length; j < sl; j++) {
                    var secondItem = secondModules[j];
                    secondMenuHad = true;
                    var $secondMenuItem = $('<li></li>');
                    var secondItemHtml = '<a id="' + secondItem.id + '" href="javascript:void(0);" F_isState="' + (secondItem.children.length == 0 ? "iframe" : "expand") + '" url="' + secondItem.url + '" class="sdcm-menu-item" >';
                    // secondItemHtml += '<i class="' + secondItem.F_Icon + ' sdcm-menu-item-icon"></i>';
                    secondItemHtml += '<span class="sdcm-menu-item-text">' + secondItem.name + '</span>';
                    if (!(secondItem.children.length == 0)) {
                        secondItemHtml += '<img src="images/jt.png" class="sdcm-menu-item-arrow"/>'
                    }
                    secondItemHtml += '</a>';

                    $secondMenuItem.append(secondItemHtml);
                    // 第三级菜单
                    // var threeModules = modulesTree[secondItem.F_ModuleId] || [];
                    var threeModules = secondItem.children;
                    var $threeMenus = $('<ul class="sdcm-three-menu-list"></ul>');
                    var threeMenuHad = false;
                    for (var m = 0, tl = threeModules.length; m < tl; m++) {
                        var threeItem = threeModules[m];
                        threeMenuHad = true;
                        var $threeMenuItem = $('<li></li>');
                        // $threeMenuItem.attr('title', threeItem.F_FullName);
                        var threeItemHtml = '<a id="' + threeItem.id + '" href="javascript:void(0);" F_isState="' + (threeItem.children.length == 0 ? "iframe" : "expand") + '" url="' + threeItem.url + '" class="sdcm-menu-item" >';
                        // threeItemHtml += '<i class="' + threeItem.F_Icon + ' sdcm-menu-item-icon"></i>';
                        threeItemHtml += '<span class="sdcm-menu-item-text">' + threeItem.name + '</span>';
                        threeItemHtml += '</a>';
                        $threeMenuItem.append(threeItemHtml);
                        $threeMenus.append($threeMenuItem);
                    }
                    if (threeMenuHad) {
                        $secondMenuItem.addClass('sdcm-meun-had');
                        $secondMenuItem.find('a').append('<span class="sdcm-menu-item-arrow"><i class="fa fa-angle-left"></i></span>');
                        $secondMenuItem.append($threeMenus);
                    }
                    $secondMenus.append($secondMenuItem);

                }
                if (secondMenuHad) {
                    $firstMenuItem.append($secondMenus);
                }
                $firstmenus.append($firstMenuItem);
            }

            $('#sdcm_frame_menu').html($firstmenus);
        },

        bind: function () {
            $("#sdcm_frame_menu").mCustomScrollbar({ // 优化滚动条
                theme: "minimal-dark"
            });

            //禁掉可折叠菜单

            $('#sdcm_frame_menu_btn').on('click', function () {
                var $body = $('body');
                if ($body.hasClass('sdcm-menu-closed')) {
                    $body.removeClass('sdcm-menu-closed');
                }
                else {
                    $body.addClass('sdcm-menu-closed');
                }
            });

            // 添加点击事件
            $('#sdcm_frame_menu a').on('click', function () {
                var $obj = $(this);
                $('#sdcm_frame_menu a').removeClass("a-active");
                $obj.addClass("a-active");
                var isState = $(this).attr("F_isState");
                //判断是弹窗还是打开子菜单
                switch (isState) {
                    // switch ('expand') {
                    case 'iframe':// 窗口
                        console.log($(this).find(".sdcm-menu-item-text").text())
                        var _module = {
                            F_FullName: $(this).children().text(),
                            F_Url: $(this).attr("url"),
                            F_ModuleId: $(this).attr("id")
                        };
                        Sdcm.frameTab.open(_module);
                        break;
                    case 'expand':// 打开子菜单
                        var $ul = $obj.next();
                        if ($ul.is(':visible')) {
                            $ul.slideUp(500, function () {
                                $obj.removeClass('open');
                            });
                        }
                        else {
                            if ($ul.hasClass('sdcm-second-menu-list')) {
                                $('#sdcm_frame_menu .sdcm-second-menu-list').slideUp(300, function () {
                                    $(this).prev().removeClass('open');
                                });
                            }
                            else {
                                $ul.parents('.sdcm-second-menu-list').find('.sdcm-three-menu-list').slideUp(300, function () {
                                    $(this).prev().removeClass('open');
                                });
                            }
                            $ul.slideDown(300, function () {
                                $obj.addClass('open');
                            });
                        }
                        break;
                }
            });
        }
    };
    meuns.init();
};