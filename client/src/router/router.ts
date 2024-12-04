/**
 * @file router.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/10/22 下午1:26
 * @desc 单页面应用路由配置
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import { Store_ } from "@/stores/stores";

import profile from "@/components/profile.vue";
import login from "@/components/login.vue";
import home from "@/components/home.vue";

const router = createRouter({
//    history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: home
        },
        {
            path: "/login",
            name: "login",
            component: login
        },
        {
            path: "/profile",
            name: "profile",
            component: profile
        }
    ]
});

router.beforeEach((to, from, next) => {
    const store = Store_();

    // 如果为指定页面,则控制头部呈现
    store.controlOnly = ["login"].includes(to.name as string);

    window.scrollTo(0, 0);

    next();
})

export default router;
