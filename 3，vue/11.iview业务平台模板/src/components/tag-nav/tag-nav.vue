<template>
    <div class="tag-nav">
        <div class="nav-content" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
            <div class="content" ref="scrollBody" style="left: 0px;" :style="{left: tagBodyLeft + 'px'}">
                <Tag
                        type="dot"
                        v-for="(item, index) in list"
                        ref="tagsPageOpened"
                        :item-data="item"
                        :key="`tag-nav-${index}`"
                        @on-close="handleClose(index,item)"
                        @click.native="handleClick(item)"
                        :closable="item.path!=='/index/home'"
                        :color="filterIsNowSelection(pullRoute.path,item.path)?'primary':'default'"
                >{{ item.title }}
                </Tag>
            </div>
        </div>
    </div>
</template>

<script>
    import {Tag} from "iview"

    export default {
        components: {
            Tag
        },
        inheritAttrs: false,
        props: {
            pullRoute: Object,
            list: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                tagBodyLeft: 0
            }
        },
        name: "tag-nav",
        methods: {
            handleClose(index, item) {
                this.$emit("upHandleClose", {
                    index: index,
                    isNowSelection: this.filterIsNowSelection(this.pullRoute.path, item.path)  //是否当前选中的
                });
            },
            handleClick(item) {
                this.$emit("upHandleClick", item);
            },
            handlescroll(e) {
                var type = e.type;
                let delta = 0;
                if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                    delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
                }
                this.handleScroll(delta)
            },
            handleScroll(offset) {
                const outerWidth = this.$refs.scrollOuter.offsetWidth
                const bodyWidth = this.$refs.scrollBody.offsetWidth
                if (offset > 0) {
                    this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
                } else {
                    if (outerWidth < bodyWidth) {
                        if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
                            this.tagBodyLeft = this.tagBodyLeft
                        } else {
                            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, outerWidth - bodyWidth)
                        }
                    } else {
                        this.tagBodyLeft = 0
                    }
                }
            },
            filterIsNowSelection(path, pathName) {
                let pathArr = path.split("/");  //由于$router.pathName可能不一样，所以取前2个路径进行对比。
                return "/" + pathArr[1] + "/" + pathArr[2] === pathName
            },
            getTagElementByName(route) {
                this.$nextTick(() => {
                    let refsTag = this.$refs.tagsPageOpened
                    console.log(refsTag[1])
                    refsTag.forEach((item, index) => {
                        if (this.filterIsNowSelection(route.path, item.$attrs['item-data'].path)) {
                            let tag = refsTag[index].$el;
                            this.moveToView(tag)
                        }
                    })
                })
            },
            moveToView(tag) {
                const outerWidth = this.$refs.scrollOuter.offsetWidth
                const bodyWidth = this.$refs.scrollBody.offsetWidth
                if (bodyWidth < outerWidth) {
                    this.tagBodyLeft = 0
                } else if (tag.offsetLeft < -this.tagBodyLeft) {
                    // 标签在可视区域左侧
                    this.tagBodyLeft = -tag.offsetLeft
                } else if (tag.offsetLeft > -this.tagBodyLeft && tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth) {
                    // 标签在可视区域
                    this.tagBodyLeft = Math.min(0, outerWidth - tag.offsetWidth - tag.offsetLeft)
                } else {
                    // 标签在可视区域右侧
                    this.tagBodyLeft = -(tag.offsetLeft - (outerWidth - tag.offsetWidth))
                }
            },
        },
        watch: {
            '$route'(to) {
                this.getTagElementByName(to)
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "tag-nav.stylus"
</style>
