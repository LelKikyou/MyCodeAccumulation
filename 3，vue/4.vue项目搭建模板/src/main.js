import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from '@/store/index'
Vue.config.productionTip = false;
//打包时候注释掉mock
import "@/mock/index"
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
