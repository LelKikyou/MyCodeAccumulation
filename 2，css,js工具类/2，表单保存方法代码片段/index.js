    //表单保存方法
    $.fn.saveFrom = function () {
        var data = {};
        var id;
        var type;
        $(this).find("input,textarea,.lr-select,.sdcm-col-select").each(function () {
            id = $(this).attr("id");
            if (!!id) {
                type = $(this).attr("type");
                //类型可向下自己扩展
                switch (type) {
                    case "lrselect":
                        break;
                    case  "select":
                        var options=$("#"+id+" option:selected");
                        data[id]=options.text();
                        break;
                    default:
                        var value = $(this).val();
                        data[id] = $.trim(value);
                        break;
                }
            }
        });
        return data;
    };
    //表单设置数据方法
    $.fn.setFrom = function (data) {
        var type;
        var dom;
        for (var item in data){
            dom=$("#"+item);
            type=dom.attr("type");
            switch (type) {
                case "lrselect":
                    break;
                default:
                    dom.val(data[item]);
                    break;
            }
        }

    }