## 数字可视化组件
```
npm i countup -S
<count-to :decimals="2" :end="152"/>
props: {
            init: {
                type: Number,
                default: 0
            },
            /**
             * @description 起始值，即动画开始前显示的数值
             */
            startVal: {
                type: Number,
                default: 0
            },
            /**
             * @description 结束值，即动画结束后显示的数值
             */
            end: {
                type: Number,
                required: true
            },
            /**
             * @description 保留几位小数
             */
            decimals: {
                type: Number,
                default: 0
            },
            /**
             * @description 分隔整数和小数的符号，默认是小数点
             */
            decimal: {
                type: String,
                default: '.'
            },
            /**
             * @description 动画持续的时间，单位是秒
             */
            duration: {
                type: Number,
                default: 2
            },
            /**
             * @description 动画延迟开始的时间，单位是秒
             */
            delay: {
                type: Number,
                default: 0
            },
            /**
             * @description 是否禁用easing动画效果
             */
            uneasing: {
                type: Boolean,
                default: false
            },
            /**
             * @description 是否使用分组，分组后每三位会用一个符号分隔
             */
            usegroup: {
                type: Boolean,
                default: false
            },
            /**
             * @description 用于分组(usegroup)的符号
             */
            separator: {
                type: String,
                default: ','
            },
            /**
             * @description 是否简化显示，设为true后会使用unit单位来做相关省略
             */
            simplify: {
                type: Boolean,
                default: false
            },
            /**
             * @description 自定义单位，如[3, 'K+'], [6, 'M+']即大于3位数小于6位数的用k+来做省略
             *              1000即显示为1K+
             */
            unit: {
                type: Array,
                default() {
                    return [[3, 'K+'], [6, 'M+'], [9, 'B+']]
                }
            },
            countClass: {
                type: String,
                default: ''
            },
            unitClass: {
                type: String,
                default: ''
            }
        },

```
