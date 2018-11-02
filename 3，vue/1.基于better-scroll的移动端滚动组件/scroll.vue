<template>
  <div ref="wrapper" class="scroll">
    <slot></slot>
  </div>
</template>
<script>
  import BScroll from "better-scroll";

  export default {
    props: {
      //滚动类型，有1，2,3三种类型
      /**当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
       当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
       当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。如果没有设置该值，其默认值为 0，即不派发 scroll 事件。**/
      probeType: {
        type: Number,
        default: 0
      },
      click: {
        type: Boolean,
        default: true
      },
      //开启监听滚动事件
      scrollLock: {
        type: Boolean,
        default: false
      },
      //开启滚动结束监听事件
      scrollEndLock: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      }
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return;
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        });
        if (this.scrollLock) {
          //滚动过程中的{Object} {x, y} 滚动的实时坐标,滚动过程中
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }
        if (this.scrollEndLock) {
          //{Object} {x, y} 滚动结束的位置坐标,触发时机：滚动结束。
          this.scroll.on('scrollEnd', (pos) => {
            this.$emit('scrollToEnd', pos)
          })
        }
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      //作用：滚动到指定的位置
      /**scrollTo(x, y, time, easing)
       {Number} x 横轴坐标（单位 px）
       {Number} y 纵轴坐标（单位 px）
       {Number} time 滚动动画执行的时长（单位 ms）,默认值为0，直接跳过去，不滚动过去
       {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
       **/
      scrollTo() {
        /**相当于
           scrollTo(x,y,time){
             this.scroll && this.scroll.scrollTo(x,y,time)
           }
         在父组件里面ref="xx",获取scroll vue实例，然后就可以调用scrollTo方法了
         **/
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      //作用：滚动到指定的目标元素。
      //用法与上面一样
      /**scrollToElement(el, time, offsetX, offsetY, easing)
       {DOM | String} el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象。
       {Number} time 滚动动画执行的时长（单位 ms），默认值为0，直接跳过去，不滚动过去
       {Number | Boolean} offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
       {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
       {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
       **/
      scrollToElement(){
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    mounted() {
      this.$nextTick(function () {
        this._initScroll();
      });
    },
    watch: {
      data() {
        this.$nextTick(function () {
          this.refresh();
        });
      }
    }
  };
</script>
<style scoped>
  .scroll {
    width: 100%;
    height: 100%;
  }
</style>
