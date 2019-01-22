import Vue from 'vue'
import App from './app.vue'
import toast from "vue2-toast"
Vue.use(toast)
new Vue({
    render: (h) => h(App)
}).$mount("#app")