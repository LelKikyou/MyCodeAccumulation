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
