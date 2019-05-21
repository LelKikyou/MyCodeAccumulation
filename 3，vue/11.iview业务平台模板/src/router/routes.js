export default [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: "/index",
        component: () => import("@/view/index/index.vue"),
        name: "index",
        redirect: '/index/home',
        children: [
            {
                path: "/index/home",
                component: () => import("@/view/index/components/home/home.vue"),
                name: "home"
            },
            {
                path: "/index/intelligentSearch",
                component: () => import("@/view/index/components/intelligentSearch/intelligentSearch.vue"),
                name: "intelligentSearch"
            }
        ]
    },
    {
        path: "/login",
        component: () => import("@/view/login/login.vue"),
        name: "login",
    }
]
