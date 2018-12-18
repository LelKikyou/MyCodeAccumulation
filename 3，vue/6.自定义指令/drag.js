//拖动弹窗
export default function (el) {
    el.onmousedown = function (e) {
        e.preventDefault();
        let l = e.pageX - el.parentNode.offsetLeft;
        let t = e.pageY - el.parentNode.offsetTop;
        document.onmousemove = function (e) {
            let [leftValue, topValue, parentWidth, parentHeight] = [0, 0, el.parentNode.offsetWidth, el.parentNode.offsetHeight];
            e.preventDefault();
            leftValue = e.pageX - l;
            topValue = e.pageY - t;
            //控制元素不被拖出窗口外
            leftValue + parentWidth >= document.documentElement.clientWidth && (leftValue = document.documentElement.clientWidth - parentWidth);
            leftValue < 0 && (leftValue = 0);
            topValue + parentHeight >= document.documentElement.clientHeight && (topValue = document.documentElement.clientHeight - parentHeight);
            topValue < 0 && (topValue = 0);
            el.parentNode.style.left = `${leftValue}px`;
            el.parentNode.style.top = `${topValue}px`;
        };
        document.onmouseup = function (e) {
            e.preventDefault();
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}