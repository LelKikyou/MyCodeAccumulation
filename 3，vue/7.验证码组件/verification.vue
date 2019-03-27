<template>
    <div class="img-verify">
        <canvas
                ref="verify"
                :width="width"
                :height="height"
                @click="handleDraw"></canvas>
    </div>
</template>

<script>
    export default {
        //对外传出方法verificationCode获取code值
        /*
           @verificationCode=getCode
           getCode(code){
           code 就是验证码
           }
        * */
        props: {
            width: {   //  验证码宽度
                type: Number,
                default: 150,
                validator: function (value) {
                    return value >= 50
                }
            },
            height: {   //  验证码高度
                type: Number,
                default: 100,
                validator: function (value) {
                    return value >= 50
                }
            },
            interferenceLineNum: {   //  干扰线的条数
                type: Number,
                default: 5,
                validator: function (value) {
                    return value >= 0
                }
            },
            interferenceSpotNum: {   //  干扰点的个数
                type: Number,
                default: 40,
                validator: function (value) {
                    return value >= 10
                }
            },
            minFontSize: {   //  最小字体大小
                type: Number,
                default: 18,
                validator: function (value) {
                    return value >= 15
                }
            },
            maxFontSize: {   //  干扰点的个数
                type: Number,
                default: 40,
                validator: function (value) {
                    return value >= 18 && value <= 50
                }
            },
            codeNum: {   //  验证码个数
                type: Number,
                default: 4,
                validator: function (value) {
                    return value >= 3 && value <= 20
                }
            }
        },
        data() {
            return {
                pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', // 字符串
            }
        },
        mounted() {
            this.draw()
        },
        methods: {
            // 1.随机数
            randomNum(min, max) {
                return parseInt(Math.random() * (max - min) + min)
            },
            // 2.随机颜色
            randomColor(min, max) {
                const r = this.randomNum(min, max)
                const g = this.randomNum(min, max)
                const b = this.randomNum(min, max)
                return `rgb(${r},${g},${b})`
            },
            // 点击图片重新绘制
            handleDraw() {
                this.draw()
            },
            // 绘制图片
            draw() {
                // 3.填充背景颜色，背景颜色要浅一点
                const ctx = this.$refs.verify.getContext('2d')
                // 填充颜色
                ctx.fillStyle = this.randomColor(180, 230)
                // 填充的位置
                ctx.fillRect(0, 0, this.width, this.height)
                // 定义paramText
                let imgCode = ''
                // 4.随机产生字符串，并且随机旋转
                for (let i = 0; i < this.codeNum; i++) {
                    // 随机的四个字
                    const text = this.pool[this.randomNum(0, this.pool.length)]
                    imgCode += text
                    // 随机的字体大小
                    const fontSize = this.randomNum(this.minFontSize, this.maxFontSize)
                    // 字体随机的旋转角度
                    const deg = this.randomNum(-40, 40)
                    /*
                     * 绘制文字并让四个文字在不同的位置显示的思路 :
                     * 1、定义字体
                     * 2、定义对齐方式
                     * 3、填充不同的颜色
                     * 4、保存当前的状态（以防止以上的状态受影响）
                     * 5、平移translate()
                     * 6、旋转 rotate()
                     * 7、填充文字
                     * 8、restore出栈
                     * */
                    ctx.font = fontSize + 'px Simhei'
                    ctx.textBaseline = 'top'
                    ctx.fillStyle = this.randomColor(80, 150)
                    /*
                     * save() 方法把当前状态的一份拷贝压入到一个保存图像状态的栈中。
                     * 这就允许您临时地改变图像状态，
                     * 然后，通过调用 restore() 来恢复以前的值。
                     * save是入栈，restore是出栈。
                     * 用来保存Canvas的状态。save之后，可以调用Canvas的平移、放缩、旋转、错切、裁剪等操作。 restore：用来恢复Canvas之前保存的状态。防止save后对Canvas执行的操作对后续的绘制有影响。
                     *
                     * */
                    ctx.save()
                    let textHeight = this.height / 2;//文字高度
                    let textWidth = (0.5 + i) * this.width / this.codeNum;//文字宽度
                    ctx.translate(textWidth, textHeight)
                    ctx.rotate(deg * Math.PI / 180)
                    // fillText() 方法在画布上绘制填色的文本。文本的默认颜色是黑色。
                    // 请使用 font 属性来定义字体和字号，并使用 fillStyle 属性以另一种颜色/渐变来渲染文本。
                    // context.fillText(text,x,y,maxWidth);
                    ctx.fillText(text, -this.randomNum(10, 20), -this.randomNum(10, 20))
                    ctx.restore()
                }
                // 5.随机产生5条干扰线,干扰线的颜色要浅一点
                for (let i = 0; i < this.interferenceLineNum; i++) {
                    ctx.beginPath()
                    ctx.beginPath()
                    ctx.moveTo(this.randomNum(0, this.width), this.randomNum(0, this.height))
                    ctx.lineTo(this.randomNum(0, this.width), this.randomNum(0, this.height))
                    ctx.strokeStyle = this.randomColor(180, 230)
                    ctx.closePath()
                    ctx.stroke()
                }
                // 6.随机产生40个干扰的小点
                for (let i = 0; i < this.interferenceSpotNum; i++) {
                    ctx.beginPath()
                    ctx.arc(this.randomNum(0, this.width), this.randomNum(0, this.height), 1, 0, 2 * Math.PI)
                    ctx.closePath()
                    ctx.fillStyle = this.randomColor(150, 200)
                    ctx.fill()
                }
                // 将生成的四个字传递给父组件
                this.$emit('verificationCode', imgCode)
            }
        }
    }
</script>
<style type="text/css">
    .img-verify canvas {
        cursor: pointer;
    }
</style>