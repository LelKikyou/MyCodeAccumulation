<template>
    <div class="modalFrame">
        <transition name="bounceModalFrame">
            <div class="modalFrameBox" v-show="show" :style="modalFrameStyle">
                <div class="modalFrameTitle" ref="modalFrameTitleDom">
                    {{title}}
                    <span class="icon" @click="remove"></span>
                </div>
                <div class="frameBox">
                    <templateModal :modalData="modalData"></templateModal>
                </div>
                <div class="frameBtn" v-if="btnShow">
                    <button class="btn-cancel" @click="cancel">取消</button>
                    <button class="btn-ok" @click="ok">确认</button>
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
                modalData: {},//传入模板里面的data
                width: "800",//宽度
                height: "600",//高度
                onCancel: "",//取消回调  返回vm
                onOk: "",//确认回调 返回 vm
                title: "",  //弹窗title
                btnShow: true, //是否显示按钮
                show: false//控制动画显示隐藏
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.drag(this.$refs.modalFrameTitleDom)
            })
        },
        methods: {
            cancel() {
                if (!!this.onCancel) {
                    this.onCancel(this)
                } else {
                    this.remove();
                }
            },
            ok() {
                if (!!this.onOk) {
                    this.onOk(this)
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

<style scoped>
    @import "modalFrame.css";
</style>
