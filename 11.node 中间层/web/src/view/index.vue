<template>
    <div>
        xxxx
    </div>
</template>

<script>
    import axios from "axios"

    export default {
        name: "index",
        mounted() {
            axios.get("http://localhost:7777/api/sdcm/login").then(res => {
                console.log(res)
            })
        }
    }
</script>

<style scoped>

</style>
