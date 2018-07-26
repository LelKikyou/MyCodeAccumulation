// 加载数据进度
 function loadbarInit () {
    var _html = '<div class="lr-loading-bar" id="lr_loading_bar" >';
    _html += '<div class="lr-loading-bar-bg"></div>';
    _html += '<div class="lr-loading-bar-message" id="lr_loading_bar_message"></div>';
    _html += '</div>';
    $('body').append(_html);
}