import modalFrame from './modalFrame'

const modalFrameObj = {};
modalFrameObj.install = function (Vue) {
    Vue.prototype.$modalFrame = (optionsData) => {
        var MainInstance = Object.assign({}, modalFrame);
        var templateModal = optionsData.template;
        if (!!templateModal) { //template为必填
            MainInstance.components = {templateModal}
        } else {
            console.error("{template:''}中template为必填，不能为空！");
            return false
        }
        let vm = new (Vue.extend(MainInstance))(); //创建实例
        Object.assign(vm, optionsData);  //导入参数
        const tpl = vm.$mount().$el; //生成dom
        document.body.appendChild(tpl);
        vm.$nextTick(() => {
            vm.show = true
        })
    }
};
export default modalFrameObj

