<template>
    <div id="app">
        <div class="xx" @click="xx">{{data1}}</div>
        <Xx></Xx>
    </div>
</template>

<script>
    import zz from "./com/data"
    import Xx from "./com/xx.vue"
    import 'vue2-toast/lib/toast.css';
    import "./za.css"
    export default {
        name: "app",
        data() {
            return {
                data1: "我是一个hahahaha"
            }
        },
        methods: {
            xx() {
                this.$loading('loading...');
                console.log(zz)
            }
        },
        components: {
            Xx: Xx
        }
    }
</script>
<style lang="stylus">
    *
        margin 0
        padding 0
</style>
<style lang="stylus" scoped>
    #app
        background-color: aqua;
        .xx
            color red
</style>