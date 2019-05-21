import Vue from 'vue'
import Vuex from 'vuex'
import menu_tagNav from './modules/menu_tagNav'

Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        menu_tagNav
    }
})