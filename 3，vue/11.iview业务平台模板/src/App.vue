<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'app',
        mounted() {
            this.$router.push({
                path: "/index"
            })
        }
    }
</script>


<style lang="stylus">
    html, body, #app
        width 100%
        height 100%
</style>
