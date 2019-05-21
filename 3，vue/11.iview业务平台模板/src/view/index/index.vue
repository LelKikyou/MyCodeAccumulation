<template>
    <div class="layout">
        <Layout :style="{width:'100%',height:'100%'}">
            <Sider ref="side" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed"
                   class="siderScroll">
                <div class="sign" :style="{height: layoutHeaderBarHeight+'px',lineHeight: layoutHeaderBarHeight+'px'}">
                    <img class="logo" src="../../assets/imgs/logo.png">
                    <div class="font" v-show="!isCollapsed">
                        罪犯数据平台
                    </div>
                </div>
                <!--active-name="1-2" :open-names="['1']"-->
                <Menu ref="menu" theme="dark" :active-name="getActiveName" :open-names="getOpenNames" width="auto"
                      :class="menuitemClasses">
                    <menuTree :menuData="menuData" @upHandleRoute="handleRoute"></menuTree>
                </Menu>
            </Sider>
            <Layout>
                <Header class="layout-header-bar"
                        :style="{height: layoutHeaderBarHeight+'px',lineHeight: layoutHeaderBarHeight+'px',padding: 0}">
                    <Icon @click.native="collapsedSider" :class="rotateIcon"
                          :style="{margin: '0 20px',cursor:'pointer',float: 'left',lineHeight:'64px'}" type="md-menu"
                          size="24"></Icon>
                    <div class="tags-nav">
                        <tagNav :pullRoute="$route" :list="getMenuList" @upHandleClose="upHandleClose"
                                @upHandleClick="upHandleClick"></tagNav>
                    </div>
                    <div class="admin">

                    </div>
                </Header>
                <Content>
                    <div :style="{height:contentHtight+'px'}">
                        <transition name="fade-transform" mode="out-in">
                            <keep-alive :include="pageCache">
                                <router-view></router-view>
                            </keep-alive>
                        </transition>
                    </div>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import {Layout, Header, Content, Sider, Menu, Icon} from "iview"
    import tagNav from "@/components/tag-nav"
    import menuData from "@/config/menuConfig"
    import menuTree from "@/components/menu-tree"
    import {mapGetters, mapMutations} from "vuex"
    import {on} from '@/lib/tools'

    export default {
        components: {
            Layout,
            Header,
            Content,
            Sider,
            Menu,
            Icon,
            tagNav,
            menuTree
        },
        data() {
            return {
                isCollapsed: false,//menu 开关
                menuData: menuData,
                layoutHeaderBarHeight: 64, //layoutHeaderBar高度
                contentHtight: 0
            }
        },
        mounted() {
            this.contentHtight = this.getContentHtight();
            on(window, 'resize', () => { //监听屏幕变化，即时给高度
                this.contentHtight = this.getContentHtight();
            })
        },
        computed: {
            ...mapGetters([
                "getMenuList",
                "getActiveName",
                "getOpenNames"
            ]),
            pageCache() {//页面缓存
                return this.getMenuList.map(item => {
                    return item.pathName
                })
            },
            rotateIcon() {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses() {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        methods: {
            getContentHtight() {
                return document.body.offsetHeight - this.layoutHeaderBarHeight
            },
            ...mapMutations([
                "rmMenuList",
                "addMenuList",
                "handle_activeName_openNames"
            ]),
            collapsedSider() {
                this.isCollapsed = !this.isCollapsed;
            },
            handleRoute(item) {
                this.addMenuList(item);
                this.$router.push({
                    path: item.path
                });
                this.handle_activeName_openNames(item);
            },
            upHandleClose({index, isNowSelection}) {
                this.rmMenuList(index);//移除tagNav
                if (isNowSelection) {
                    this.$router.push({  //是当前页面就跳转到前一个页面
                        path: this.getMenuList[index - 1].path
                    });
                    this.handle_activeName_openNames(this.getMenuList[index - 1]);
                }

            },
            upHandleClick(item) {
                this.handle_activeName_openNames(item);
                this.$router.push({
                    path: item.path
                })
            }
        },
        watch: {
            getOpenNames() {
                this.$nextTick(() => {
                    this.$refs.menu.updateOpened()
                })
            }
        }
    }
</script>
<style lang="stylus">
    .ivu-layout
        min-width 1000px

    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active.ivu-menu-item-selected
        color: #fff !important
        background: #2d8cf0 !important;

    .siderScroll .ivu-layout-sider-children
        overflow-y scroll
        margin-right -18px

    .siderScroll .collapsed-menu
        pointer-events: none
        .ivu-menu-submenu-title-icon
            display none
        .ivu-menu
            display none

    .siderScroll .menu-item span {
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }

    .siderScroll .menu-item i {
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .siderScroll .collapsed-menu span {
        width: 0px;
        transition: width .2s ease;
    }

    .siderScroll .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
</style>
<style scoped lang="stylus">
    @import "index.stylus"
</style>
