/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/**
 * @file genHeader.spec.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/11/01 下午12:17
 * @desc 通用导航栏组件测试文件
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */

import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import genHeader from '@/components/genHeader.vue';
import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import router from "@/router/router";

// 创建一个新的 Pinia 实例
const pinia = createPinia();

describe('genHeader.vue', () => {
    let wrapper;

    beforeAll(() => {
        window.scrollTo = vi.fn();
    })

    beforeEach(() => {
        // 在每个测试之前挂载组件
        wrapper = mount(genHeader, {
            global: {
                plugins: [pinia, router],
            },
        });
    });

    it('检查logo是否渲染', () => {
        const logo = wrapper.find('.logo img');
        expect(logo.exists()).toBe(true);
    });

    it('检查选项列表是否存在', () => {
        const options = wrapper.findAll('.options li');
        expect(options.length).toBeGreaterThan(0);
    });

    it('检查搜索框功能', async () => {
        const input = wrapper.find('.search input');
        await input.setValue('测试搜索');
        expect(input.element.value).toBe('测试搜索');

        // 模拟搜索结果
        wrapper.vm.search.res = [{ type: 'article', data: 'article-1' }];
        await wrapper.vm.$nextTick();

        const searchResults = wrapper.find('.search-res');
        expect(searchResults.text()).toContain('article-1');
    });

    it('切换主题应该改变颜色', async () => {
        const themeButton = wrapper.find('.control-theme');
        await themeButton.trigger('click');

        // 这里需要根据主题变化检查具体的样式或变量，示例中没有具体实现
    });

    it('用户头像链接检查', async () => {
        wrapper.vm.$store.user.name = 'guest';
        await wrapper.vm.$nextTick();
        const avatarLink = wrapper.find('.user router-link');
        expect(avatarLink.attributes('to')).toBe('/login');
    });
});
