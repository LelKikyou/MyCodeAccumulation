<template>
    <div class="menu-tree">
        <template v-for="item in menuData">
            <Submenu v-if="/\#/.test(item.name)" :name="item.name">
                <template slot="title">
                    <Icon v-if="item.icon" :type="item.icon"/>
                    <span>{{item.title}}</span>
                </template>
                <menu-tree :menuData="item.menuItem" @upHandleRoute="handleRoute"></menu-tree>
            </Submenu>
            <MenuItem v-if="!(/\#/.test(item.name))" @click.native="handleRoute(item)" :name="item.name">
                {{item.title}}
            </MenuItem>
        </template>
    </div>
</template>

<script>
    import {Submenu, Icon, MenuItem} from "iview"

    export default {
        name: "menu-tree",
        props: {
            menuData: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        components: {
            Submenu,
            Icon,
            MenuItem
        },
        methods: {
            handleRoute(obj) {
                this.$emit("upHandleRoute", obj)
            }
        }
    }
</script>
