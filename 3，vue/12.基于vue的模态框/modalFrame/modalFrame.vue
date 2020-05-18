<template>
    <div class="modalFrame" :class="className">
        <transition name="bounceModalFrame">
            <div class="modalFrameBox" v-show="show" :style="modalFrameStyle">
                <div class="modalFrameTitle" ref="modalFrameTitleDom">
                    {{title}}
                    <span class="icon" @click="close"><i class="iconfont icon-close"></i></span>
                </div>
                <div class="frameBox">
                    <templateModal ref="templateModal" :modalData="modalData"></templateModal>
                </div>
                <div class="frameBtn" v-if="btnShow.length">
                    <button class="btn-cancel" @click="cancel" v-if="btnShow[1]">{{btnTit[1]||"取消"}}</button>
                    <button class="btn-ok" @click="ok" v-if="btnShow[0]">{{btnTit[0]||"确认"}}</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "modalFrame",
        data() {
            return {
                className: "",// 传入的class,可以依靠这个class控制内部样式
                modalData: {},//传入模板里面的data
                width: "800",//宽度
                height: "600",//高度
                onCancel: "",//取消回调  返回vm
                onOk: "",//确认回调 返回 vm
                onClose: "",//关闭回调 返回 vm
                title: "",  //弹窗title
                btnShow: [true, true], //是否显示按钮，[true,false],可以控制按钮的显示隐藏
                btnTit: [],// 按钮的文字，["确认"]
                show: false//控制动画显示隐藏
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.drag(this.$refs.modalFrameTitleDom)
            })
        },
        methods: {
            //取消按钮
            cancel() {
                if (!!this.onCancel) {
                    this.onCancel(this,this.$refs.templateModal)
                } else {
                    this.remove();
                }
            },
            //确认按钮
            ok() {
                if (!!this.onOk) {
                    this.onOk(this,this.$refs.templateModal)
                } else {
                    this.remove();
                }
            },
            //取消按钮
            close() {
                if (!!this.onClose) {
                    this.onClose(this,this.$refs.templateModal)
                } else {
                    this.remove();
                }
            },
            remove() { //关闭窗口
                this.show = false;
                let _time = setTimeout(() => {
                    this.destroy()
                    clearTimeout(_time);
                }, 200) //因为动画是0.2秒，所以这里是0.2秒
            },
            destroy() {
                this.$destroy();
                document.body.removeChild(this.$el);
            },
            drag(el) {
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
        },
        computed: {
            //初始化top,left,width,height
            modalFrameStyle() {
                return `top:${document.documentElement.clientHeight / 2 - this.height / 2}px;left:${document.documentElement.clientWidth / 2 - this.width / 2}px;width:${this.width}px;height:${this.height}px;`
            }
        }
    }
</script>

<style>
    @import "icon/iconfont.css";
    @import "modalFrame.css";
</style>
