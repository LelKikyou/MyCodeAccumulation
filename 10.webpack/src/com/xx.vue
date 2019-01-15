<template>
    <div class="xx">
        hahahah
        <h1>{{zzz}}</h1>
        <h3>我是一22个xxxx</h3>
        <img src="../img/bd.png" alt="">
        <div class="img" @click="dj"></div>
        <div id="title"></div>
    </div>
</template>

<script>
    export default {
        name: "xx",
        data(){
            return {
                zzz:"aaaaaaaaa"
            }
        },
        methods:{
            dj(){
                $('#title').html('Hello');
                console.log(11)
            }
        }
    }
</script>
<style lang="stylus" scoped>
    @import "xx.stylus"
</style>
