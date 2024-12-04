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
 * @file profile.vue
 * @author edocsitahw
 * @version 1.1
 * @date 2024/10/28 下午1:43
 * @description 个人主页组件
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */
import { request, API_URL } from "confunc";
import { Store_ } from "@/stores/stores";
import { defineComponent } from "vue";
import { User } from "@/assets/types";

import genHeader from "@/components/genHeader.vue";
import avatarSvg from "@/assets/img/avatar.svg";
import logoutSvg from "@/assets/img/logout.svg";
import router from "@/router/router";

export default defineComponent({
    name: "Profile",
    data() {
        return {
            /** @summary 用户信息
             * @desc 目标用户信息,等待从数据库中获取
             * @todo 获取详细信息
             * @property {string} name - 用户名
             * @property {string} img - 用户头像
             * @property {number} id - 用户id
             * */
            user: undefined as User | undefined
        };
    },
    setup() {
        const store = Store_();
        return { store, avatarSvg, logoutSvg, router, API_URL };
    },
    computed: {
        notCurrUser() {
            return (this.user && this.user?.name != this.store.user.name) || (!this.user && !this.store.user.name && this.user?.name == this.store.user.name);
        }
    },
    methods: {
        /** @summary 上传头像
         * @desc 上传头像并更新用户信息
         * @param {Event} ev - 上传文件事件
         * */
        upload(ev: Event) {
            // 获取上传文件
            const file = (ev.target as HTMLInputElement).files?.item(0);
            if (file) {
                const reader = new FileReader();
                // 读取文件内容
                reader.readAsDataURL(file);
                reader.onload = () => {  // 读取完成
                    const name = encodeURIComponent(file.name);  // 编码文件名

                    // ------------------------ 上传头像 ------------------------

                    request(API_URL, "upload", { uid: this.store.user.id, data: reader.result as string, name })
                        .then(res => {
                            if (res.code === 200) {
                                // NOTE: 当前用户无法修改其它用户的头像,则直接更新当前用户信息
                                this.store.updateUser({ ...this.store.user, img: res.data });
                                this.user = this.store.user;
                            } else alert(res.msg);
                        });
                };
            }
        },
        /** @summary 触发上传头像
         * @desc 触发上传头像事件
         * */
        trigger() {
            // 仅当前用户可修改头像
            if (this.notCurrUser) return;
            (document.getElementById("upload") as HTMLInputElement)?.click();
        }
    },
    components: {
        genHeader
    },
    watch: {
        "store.trans": {
            // 监听store中转数据
            handler(nVal: undefined | { data: User, target: string }, oVal) {
                // 当数据存在且目标为profile,id发生变化时
                if (nVal && nVal.target === "profile" && nVal.data.id != oVal?.data?.id)

                    // ------------------------ 获取用户信息 -----------------------

                    request(API_URL, "user", { data: nVal.data.name || nVal.data.id, type: "query" }).then(res => {
                        if (res.code === 200 && res.data) {
                            this.user = res.data;
                            // 重置用户信息
                            this.store.sendto(null, null);
                        }
                        else {
                            alert("数据库缺失用户信息.");
                            // 重置用户信息
                            this.store.sendto(null, null);
                            router.push("/");
                        }
                    });
            },
            deep: true,
            immediate: true
        }
    }
});
</script>

<template>

    <genHeader>

        <div class="profile">

            <!-- 个人信息页横幅 -->
            <header class="profile-header">

                <div class="profile-header-avatar" :style="{ cursor: notCurrUser ? 'unset' : 'pointer' /** 非当前用户不可点击 */ }">

                    <input id="upload" type="file" style="display: none" accept="image/*" @change="upload" />

                    <img :src="user?.img || store.user.img || avatarSvg" alt="avatar" @click="trigger" />

                </div>

                <div class="profile-header-info">

                    <h1 style="font-size: 2.5rem" class="profile-header-info-name">{{ user?.name || store.user.name || 'guest' }}</h1>

                </div>

                <div class="profile-header-logout" @click="
                        store.resetUser();
                        router.push('/login');
                    "
                >

                    <p class="react-text">  <!-- 登出 -->
                        <span>
                            <img :src="logoutSvg" alt="logout" />
                            <span>{{ store.format(store.content.profile.logout) }}</span>
                        </span>
                    </p>

                </div>

            </header>

            <!-- 留言板(当前用户呈现留言,否则提供留言板) -->
            <div class="profile-leaveword">

                <textarea v-if="user?.name === store.user.name" :placeholder="store.format(store.content.profile.leaveword)"></textarea>
                <p v-else></p>

            </div>

            <div class="profile-history"></div>

        </div>

    </genHeader>

</template>

<style lang="sass">
.profile
    height: 100%
    margin: 0 20px

    &-header
        display: flex
        align-items: center
        flex-direction: row
        min-height: 30%
        background-size: 100% 200%
        background: linear-gradient(45deg, rgba(145, 203, 255, 0.76), rgba(184, 156, 255, 0.71))
        margin: 20px 0
        border-radius: 20px
        position: relative

        &-avatar
            flex: 1
            justify-content: center
            align-items: center
            text-align: center
            height: 100%
            margin: 0 20px

            img
                min-width: 150px
                max-width: 250px
                padding: 10px

        &-info
            flex: 4
            height: 100%
            position: relative

            h1
                position: absolute
                top: 10px
                transform: translateY(-20px)

        &-logout
            position: absolute
            right: 20px
            bottom: 20px
            cursor: pointer
            display: flex

            img
                transform: translateY(10px)

    &-leaveword
        p
            font-size: 1.2rem

        textarea
            width: 100%
            height: 100px
</style>
