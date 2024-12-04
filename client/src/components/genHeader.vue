<!--
  - Copyright (c) 2024. All rights reserved.
  - This source code is licensed under the CC BY-NC-SA
  - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
  - This software is protected by copyright law. Reproduction, distribution, or use for commercial
  - purposes is prohibited without the author's permission. If you have any questions or require
  - permission, please contact the author: 2207150234@st.sziit.edu.cn
  -->
<script lang="ts">
/**
 * @file genHeader.vue
 * @author edocsitahw
 * @version 1.1
 * @date 2024/10/25 下午2:46
 * @desc 通用导航栏组件
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */
// @ts-ignore
import { zip, toRgb, request, API_URL } from "confunc";
import { SerachRes, User } from "@/assets/types";
import { Store_ } from "@/stores/stores";
import { Theme } from "@/assets/global";
import { defineComponent } from "vue";
import { mapState } from "pinia";

import avatarSvg from "@/assets/img/avatar.svg";
import lightSvg from "@/assets/img/light.svg";
import logoPng from "@/assets/img/logo.png";
import darkSvg from "@/assets/img/dark.svg";

export default defineComponent({
    data() {
        return {
            // TODO: 路由列表,暂无其它内容
            urls: ["/", "/", "/", "/"],
            // 缓存视效改变的目标元素
            targetCache: null as HTMLDivElement | null,
            search: { key: "", res: null as SerachRes[] },
            focusFlag: false
        };
    },
    setup() {
        const store = Store_();
        return { store, logoPng, lightSvg, darkSvg, avatarSvg, Theme, zip };
    },
    computed: {
        ...mapState(Store_, {
            color: store => store.color,
            svg: store => store.svg,
            content: store => store.content
        }),
        // 同步视口大小为响应式数据
        win(): { w: number; h: number } {
            return { w: window.innerWidth, h: window.innerHeight };
        },
        // logo大小
        logoSize() {
            return Math.min(this.win!.w / 15, this.win!.h / 15);
        }
    },
    methods: {
        /**
         * @desc 切换主题(包括icon动效)
         * */
        changeTheme(event: MouseEvent) {
            const target = event.target as HTMLDivElement;

            target.classList.toggle("change"); // 类选择器切换动画
            target.style.visibility = "hidden"; // 实现缩放动画

            this.store.changeColor();
            this.backColor(this.targetCache, this.color.back); // 避免颜色滞留

            setTimeout(() => {
                target.style.visibility = "visible";
                target.classList.remove("change");
            }, 200 /** @todo 计算最适延迟 */);
        },
        /**
         * @desc 选中视觉提示效果
         * */
        backColor(elem: HTMLDivElement, color: string) {
            this.targetCache = elem;
            const [r, g, b] = toRgb(color).map((x: number) => x - 50); // 稍微偏移颜色
            this.targetCache.style.backgroundColor = `rgba(${r}, ${g}, ${b})`;
        },
        /**
         * @desc 清除视效
         * @param event 鼠标移出事件
         * */
        resetColor(event: MouseEvent) {
            if (this.targetCache) {
                this.targetCache.style.backgroundColor = "transparent";
                this.targetCache = null;
            }
            (event.target as HTMLDivElement).style.backgroundColor = "transparent";
        },
        /**
         * @desc 开始搜索
         * */
        beginSearch() {
            if (this.search.key.length > 0)
                // TODO: 对输入进行限制,防止连续请求,并做缓存处理
                request(API_URL, "search", { key: this.search.key }).success(res => this.search.res = res.data);
            else
                this.search.res = null;
        },
        /**
         * @desc 处理搜索结果的跳转链接
         * @param item 搜索结果项
         * */
        resUrl(item: SerachRes) {
            switch (item.type) {
                case 'article': return `/#${item.data}`;
                case 'user':
                    this.store.sendto(item.data, 'profile');
                    return '/profile';
            }
        }
    }
});
</script>

<template>
    <!-- 导航栏 -->
    <header id="header" class="header" :style="{ borderBottom: store.controlOnly ? 'none' : `1px solid ${color.border}` /** 分割线 */ }">

        <!-- Logo -->
        <div class="logo" v-show="!store.controlOnly">

            <img :src="logoPng" alt="logo" :style="{ width: `${logoSize}px`, height: `${logoSize}px` }" />

        </div>

        <!-- 选项列表 -->
        <div class="options" v-show="!store.controlOnly">

            <ul>

                <!-- 点击时将选项索引存入Store以便路由守卫操作 -->
                <li :class="{ choose: idx === store.optIdx }" v-for="(opt, idx) in zip(content?.header.options, urls)" @click="store.optIdx = idx">

                    <router-link :to="opt[1]">{{ store.format(opt[0]) }}</router-link>

                </li>

            </ul>

        </div>

        <!-- 搜索框 -->
        <div class="search" v-show="!store.controlOnly">

            <!-- &nbsp; &#160; -->
            <input type="text" :placeholder="store.format(content?.header.search.ph)" v-model="search.key" @input="beginSearch" @focus="focusFlag = true" @blur="focusFlag = false" />

            <transition>

                <div class="search-res" :style="{ backgroundColor: color.back, border: `1px solid ${color.border}` }" v-if="search.res && search.res.length > 0 && focusFlag">

                    <div class="arrow-up" :style="{ borderBottom: `8px solid ${color.back}` }"></div>

                    <ul>

                        <li class="search-res-item" v-for="item in search.res">

                            <router-link :to="resUrl(item)">

                                <span>{{ item.type === 'article' ? item.data : (item.data as User).name }}</span><h5 :style="{ color: color.border }">{{ store.format(content?.header.search.type) }}: {{ store.format(content?.header.search.map[item.type]) }}</h5>

                            </router-link>

                        </li>

                    </ul>

                </div>

                <div class="search-res" :style="{ backgroundColor: color.back, border: `1px solid ${color.border}` }" v-else-if="search.key && focusFlag">{{ store.format(content?.header.search.no) }}</div>

            </transition>

        </div>

        <!-- 控制按钮 -->
        <div class="control" :style="store.controlOnly ? { position: 'absolute', right: '10px', top: '10px' } : {}">

            <div class="control-lang" v-html="svg?.lang() /** TODO: 防止修改svg导致XSS攻击 */" @click="store.changeLang" @mouseenter="backColor($event.target as HTMLDivElement, color.back)" @mouseleave="resetColor"></div>

            <div class="control-theme" @click="changeTheme" @mouseenter="backColor(<HTMLDivElement>$event.target, color.back)" @mouseleave="resetColor">

                <img :src="color.isLight ? darkSvg : lightSvg" alt="theme" />

            </div>

        </div>

        <!-- 用户交互 -->
        <div class="user" v-show="!store.controlOnly">

            <router-link :to="!store.user.name || store.user.name === 'guest' ? '/login' : '/profile'"> <!-- store未记录用户或者为访客时跳转到登录页,否则跳转到个人中心 -->

                <img :src="store.user.img || avatarSvg" alt="avatar" class="avatar" style="cursor: pointer" />

            </router-link>

        </div>

    </header>

    <!-- 占位符 -->
    <div id="header-placeholder"></div>

    <slot></slot>

</template>

<style lang="sass">
@use "sass:map"


// 主题图标变化控制
.change
    transition: all 0.2s ease-in-out
    transform: scale(0.3)

.arrow-up
    position: absolute
    top: -6px
    left: 40%
    width: 0
    height: 0
    border-left: 8px solid transparent
    border-right: 8px solid transparent
    z-index: -1

$opt-map: (total: 20, border: 3)
$opt-padding: #{map.get($opt-map, total)}px
$opt-border: #{map.get($opt-map, border)}px
$opt-hover-padding: #{map.get($opt-map, total) - map.get($opt-map, border)}px
.choose
    padding: $opt-padding 10px $opt-hover-padding 10px
    border-bottom: $opt-border solid #0092f3

.header
    display: flex
    flex-direction: row
    align-items: center
    position: fixed
    top: 0
    left: 0
    right: 0
    width: 100%
    z-index: 1000
    background-color: inherit
    //justify-content: space-between

// 板块比例表
$rate-map: (logo: 1, options: 6, search: 1, control: 1, user: 1)
.logo
    flex: map.get($rate-map, logo)
    text-align: center

.options
    flex: map.get($rate-map, options)
    ul
        font-size: 18px
        width: 50%
        display: flex
        flex-direction: row
        //word-wrap: break-word
        //overflow-wrap: break-word
        white-space: nowrap

        li
            transition: border-bottom-color 0.2s ease-in-out

            &:not(.choose)
                padding: $opt-padding 10px

            &:not(:last-child)
                margin-right: 20px

            &:hover
                padding-bottom: $opt-hover-padding  /** 20px - 2px 防抖动 */

                &:not(.choose)
                    color: #7e7e7e
                    border-bottom: $opt-border solid #838383

.search
    flex: map.get($rate-map, search)
    text-align: center
    position: relative

    input
        padding: 5px 0 5px 20px
        border-radius: 20px
        //border: 1px solid #eee
        border: none
        transition: all 0.2s ease-in-out

        &:hover
            box-shadow: 0 0 5px #18a3fa

        &:focus
            box-shadow: 0 0 5px #18a3fa
            outline-color: #18a3fa
            //border-color: #18a3fa

        &::placeholder
            font-size: 14px

    &-res
        position: absolute
        top: 120%
        width: 120%
        z-index: 10
        border-radius: 10px

        ul
            list-style: none
            margin: 0
            padding: 0

        &-item
            display: flex
            align-items: center
            justify-content: flex-start
            font-size: 14px
            padding: 5px 5px 0 5px
            overflow-x: hidden
            text-overflow: ellipsis
            text-wrap: nowrap

            &:not(:last-child)
                border-bottom: 1px solid #878787

            &:last-child
                padding-bottom: 5px

            a
                color: #4595ff
                display: flex
                flex-direction: column
                width: 100%
                text-align: left

    &::before
        content: ""
        background-image: url("@/assets/img/search.svg")
        position: absolute
        left: 5px
        top: 50%
        transform: translateY(-50%)
        width: 16px
        height: 16px

.control
    display: flex
    flex-direction: row
    justify-content: center
    flex: map.get($rate-map, control)

    div
        border-radius: 50%
        transition: all 0.3s ease-in-out
        padding: 2px

        &:hover
            cursor: pointer

.user
    flex: map.get($rate-map, user)
    text-align: left
</style>
