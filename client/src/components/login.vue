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
 * @file login.vue
 * @author edocsitahw
 * @version 1.1
 * @date 2024/10/22 上午11:12
 * @desc 登录组件
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */
import { request, API_URL, $ } from "confunc";
import { Store_ } from "@/stores/stores";
import { defineComponent } from "vue";
import { mapState } from "pinia";

import genHeader from "@/components/genHeader.vue";
import router from "@/router/router";


export default defineComponent({
    data() {
        return {
            /** @desc 待填充与待发送的用户数据
             * @property {string} name 用户名
             * @property {string} password 密码
             * @property {string} confirm 确认密码(仅注册时,且不提交)
             * */
            userData: { name: "", password: "", confirm: "" },
            /** @desc 是否已有用户 */
            haveUser: false,
            /** @desc 缓存已经查询过的用户名,避免重复请求
             * key: 用户名
             * value: 是否已有用户
             * */
            nameLog: new Map<string, boolean>()
        };
    },
    setup() {
        const store = Store_();
        return { store };
    },
    computed: {
        ...mapState(Store_, {
            color: state => state.color,
            content: state => state.content
        }),
        /**
         * @summary 是否可提交
         * @desc 当存在用户时,仅确保已填写密码,当不存在用户时,确保已填写密码并两次密码相同,则可提交
         * @returns {boolean} 是否可提交
         * */
        subAble(): boolean { return !!this.userData.name && !!this.userData.password && (this.haveUser || this.userData.confirm === this.userData.password); }
    },
    methods: {
        /**
         * @summary 提交表单数据
         * @desc 登录,注册共用此方法,根据是否存在用户,发送不同请求
         * */
        submit() {
            request(API_URL, this.haveUser ? "login" : "register", { name: this.userData.name, password: $.toHash(this.userData.password) /** 明文hash */, time: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}` })
                .then(res => {
                    if (res.code === 200) {
                        this.store.updateUser(res.data.user);
                        localStorage.setItem("token", res.data.token);  // 缓存token
                        router.push("/");
                    }
                    else alert(res.msg);
                })
        }
    },
    components: {
        genHeader
    },
    watch: {
        "userData.name": {
            /**
             * @desc 当用户名发生变化时,请求服务器查询是否存在用户
             * */
            handler(nVal: string, oVal: string) {
                if (nVal && nVal !== oVal)
                    if (this.nameLog.has(nVal)) this.haveUser = this.nameLog.get(nVal);
                    else
                        request(API_URL, "user", { data: this.userData.name, type: "query" })
                            .success(res => this.nameLog.set(nVal, this.haveUser = !!res.data));
                else this.haveUser = false;
            },
            immediate: true
        }
    }
});
</script>

<template>

    <genHeader>

        <form class="login" :style="{ backgroundColor: color.backL, color: color.font }" @submit.prevent="submit /** 拦截默认提交 */">

            <!-- 登录/注册标题 -->
            <div class="login-title">

                <h1>{{ store.format(content?.login.title[haveUser ? 'login' : 'register']) }}</h1>

            </div>

            <!-- 用户名/密码/确认密码输入框 -->
            <div class="login-group">

                <input class="login-input" type="text" v-model="userData.name" :placeholder="store.format(content?.login.username)" />

                <input class="login-input" type="password" v-model="userData.password" :placeholder="store.format(content?.login.password)" />

                <transition>  <!-- 密码确认框的过渡效果,确保仅在注册时才显示 -->

                    <input class="login-input" type="password" v-model="userData.confirm" :placeholder="store.format(content?.login.confirm)" v-if="!haveUser" />

                </transition>

            </div>

            <!-- 提交按钮 -->
            <div class="login-submit">

                <button type="submit" :disabled="!subAble" :style="{ color: color.font, border: `1px solid ${color.border}` }">{{ store.format(content?.login.submit[haveUser ? 'login' :'register']) }}</button>

            </div>

        </form>

    </genHeader>

</template>

<style lang="sass">
@use "@/assets/global"


.v-enter-active, .v-leave-active
    transition: opacity 0.3s ease-in-out

.v-enter-from, .v-leave-to
    opacity: 0

.login-input
    width: 100%
    outline: none
    font-size: 16px
    padding: 8px
    border-radius: 5px
    display: block
    box-sizing: border-box
    border: 1px solid #eee
    margin-bottom: 10px

    &:focus
        border-color: #618eff

    &::placeholder
        font-size: 14px

.login
    position: absolute
    top: 35%
    left: 50%
    transform: translate(-50%, -50%)
    max-width: 360px
    width: 50%
    min-width: 300px
    min-height: 30%
    border-radius: 10px
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    padding: 20px 40px

    &-title
        display: flex
        justify-content: center
        align-items: center
        text-align: center
        flex: 1

    &-group
        flex: 1
        display: flex
        flex-direction: column
        align-items: center
        justify-content: space-around
        width: 100%


    &-submit
        flex: 1
        width: 100%
        display: flex
        justify-content: center
        align-items: center

        button
            width: 100%
            padding: 10px
            border-radius: 5px
            background-color: #52a3ff
            transition: color 0.3s, background-color 0.3s
            font-weight: bold

            &:disabled
                background-color: #eee
                cursor: not-allowed

            &:hover:not(:disabled)
                background-color: #3c86ff

</style>
