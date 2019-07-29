import modalFrame from './modalFrame'

const modalFrameObj = {};
modalFrameObj.install = function (Vue) {
    Vue.prototype.$modalFrame = (optionsData) => {
        var MainInstance = Object.assign({}, modalFrame);
        if (filterData(optionsData)) {
            return false
        }
        //导入模板
        MainInstance.components = {templateModal: optionsData.template};
        let vm = new (Vue.extend(MainInstance))(); //创建实例
        Object.assign(vm, optionsData);  //导入参数
        const tpl = vm.$mount().$el; //生成dom
        document.body.appendChild(tpl);
        vm.$nextTick(() => {
            vm.show = true
        })
    }
};

//筛选data
function filterData(optionsData) {
    //判断模板是否存在
    if (!optionsData.template) {
        console.error("{template:''}中template为必填，不能为空！");
        return true
    }
    //btnTit必须为数组
    if (!(Object.prototype.toString.call(optionsData.btnTit) === '[object Array]')) {
        if (!(optionsData.btnTit === undefined)) {
            console.error("{btnTit:''}中btnTit只能为数组或不填");
            return true
        }
    }
    //btnShow必须为数组
    if (!(Object.prototype.toString.call(optionsData.btnTit) === '[object Array]')) {
        if (!(optionsData.btnTit === undefined)) {
            console.error("{btnShow:''}中btnShow只能为数组或不填");
            return true
        }
    }
}

export default modalFrameObj

