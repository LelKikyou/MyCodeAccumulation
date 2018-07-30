(function ($, Sdcm) {
    "use strict";
    Sdcm.lrValidformMessage = function ($this, errormsg) {
        /*错误处理*/
        $this.addClass('sdcm-file-error');
        $this.parent().append('<div class="sdcm-file-error-info" title="' + errormsg + '！"><i class="fa fa-info-circle"></i></div>');
        // var validatemsg = $this.parent().find('.form-item-title').text() + ' ' + errormsg;
        // learun.alert.error('表单信息输入有误,请检查！</br>' + validatemsg);
        if ($this.attr('type') == 'lrselect') {
            $this.on('change', function () {
                removeErrorMessage($(this));
            });
        }
        else if ($this.attr('type') == 'formselect') {
            $this.on('change', function () {
                removeErrorMessage($(this));
            });
        }
        else if ($this.hasClass('lr-input-wdatepicker')) {
            $this.on('change', function () {
                var $input = $(this);
                if ($input.val()) {
                    removeErrorMessage($input);
                }
            });
        }
        else {
            $this.on('input propertychange', function () {
                var $input = $(this);
                if ($input.val()) {
                    removeErrorMessage($input);
                }
            });
        }
    };
    $.fn.lrValidform = function () {
        var validateflag = true;
        var validHelper = Sdcm.validator;
        $(this).find("[isvalid=yes]").each(function () {
            var $this = $(this);
            debugger
            //当有错误时候不走验证
            if ($this.parent().find('.sdcm-file-error-info').length > 0) {
                validateflag = false;
                return true;
            }

            var checkexpession = $(this).attr("checkexpession");
            var checkfn = validHelper['is' + checkexpession];
            if (!checkexpession || !checkfn) { return false; }
            var errormsg = $(this).attr("errormsg") || "";
            var value;
            //不同类型值的验证
            // var type = $this.attr('type');
            //有字典的情况下
            // if (type == 'lrselect') {
            //     value = $this.lrselectGet();
            // }
            // else {
            //     value = $this.val();
            // }
            value = $this.val();
            var r = { code: true, msg: '' };
            if (checkexpession == 'LenNum' || checkexpession == 'LenNumOrNull' || checkexpession == 'LenStr' || checkexpession == 'LenStrOrNull') {
                var len = $this.attr("length");
                r = checkfn(value, len);
            } else {
                r = checkfn(value);
            }
            if (!r.code) {
                validateflag = false;
                Sdcm.lrValidformMessage($this, errormsg + r.msg);
            }
        });
        return validateflag;
    }

    function removeErrorMessage($obj) {
        $obj.removeClass('lr-field-error');
        $obj.parent().find('.lr-field-error-info').remove();
    }

})($, top.Sdcm)