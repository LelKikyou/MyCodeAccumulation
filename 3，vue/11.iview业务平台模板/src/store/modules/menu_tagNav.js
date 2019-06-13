export default {
    state: {
        menuList: [{
            name: '0-0',
            title: "首页",
            path: "/index/home",
            pathName: "home"
        }],
        activeName: "0",//menu打开的name
        openNames: [] //展开的openNames
    },
    getters: {
        getMenuList(state) {
            return state.menuList;
        },
        getActiveName(state) {
            return state.activeName
        },
        getOpenNames(state) {
            return state.openNames
        }
    },
    mutations: {
        addMenuList(state, data) {
            //列表没有就添加
            let lock = false;
            for (let item of state.menuList) {
                if (item.name === data.name) {
                    lock = true;
                    break
                }
            }
            lock || state.menuList.push(data)
        },
        rmMenuList(state, index) {
            state.menuList.splice(index, 1);
        },
        handle_activeName_openNames(state, item) {
            function filterOpenNames(arr) {
                let openNames = [];
                for (let i = 0; i < arr.length - 1; i++) {
                    openNames.length ? openNames.push(openNames[i - 1] + "-" + arr[i]) : openNames.push("#" + arr[i])
                }
                return openNames;
            }

            state.activeName = item.name;
            state.openNames = filterOpenNames(item.name.split("-"));
        }
    }
}
