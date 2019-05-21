/*menu配置
* 格式必须一致
* 有下级时候，是父级时候加上“#”, name: '#1',
        icon: "ios-paper",
        title: "搜索系统",
        //
        子级能点击
        {
                name: '1-1',
                title: "智能搜索",
                path: "/index/intelligentSearch",
                pathName: "intelligentSearch"
            },
*/

export default [
    {
        name: '#1',
        icon: "ios-paper",
        title: "搜索系统",
        menuItem: [
            {
                name: '1-1',
                title: "智能搜索",
                path: "/index/intelligentSearch",
                pathName: "intelligentSearch"
            },
            {
                name: '1-2',
                title: "专业搜索",
                path: "/index/intelligentSearch",
                pathName: "intelligentSearch"
            },
            {
                name: '#1-3',
                icon: "ios-paper",
                title: "内容管理",
                menuItem: [
                    {
                        name: '1-3-1',
                        title: "文章管理",
                        path: "/index/intelligentSearch",
                        pathName: "intelligentSearch"
                    },
                    {
                        name: "1-3-2",
                        title: "评论",
                        path: "/index/intelligentSearch",
                        pathName: "intelligentSearch"
                    },
                    {
                        name: '#1-3-3',
                        icon: "ios-paper",
                        title: "内容管理",
                        menuItem: [
                            {
                                name: '1-3-3-1',
                                title: "文章管理",
                                path: "/index/intelligentSearch",
                                pathName: "intelligentSearch"
                            },
                            {
                                name: "1-3-3-2",
                                title: "评论",
                                path: "/index/intelligentSearch",
                                pathName: "intelligentSearch"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: '2',
        title: "智能搜索",
        path: "/index/intelligentSearch",
        pathName: "intelligentSearch"
    },
]

/*export default [
    {
        name: '#1',
        icon: "ios-paper",
        title: "搜索系统",
        menuItem: [
            {
                name: '1-1',
                title: "智能搜索",
                path: "/index/intelligentSearch",
                pathName: "intelligentSearch"
            },
            {
                name: '1-2',
                title: "专业搜索",
                pathName: "intelligentSearch"
            }
        ]
    },
]*/
