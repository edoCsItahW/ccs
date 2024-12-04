/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/**
 * @file home.spec.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/11/01 下午12:05
 * @desc
 * */

import { mount } from '@vue/test-utils';
import home from '@/components/home.vue';
import { createTestingPinia } from '@pinia/testing';  // pnpm i --save-dev @pinia/testing
import { describe, it, expect } from 'vitest';

describe('Home.vue', () => {
    it('应能正确渲染文章列表', () => {
        const wrapper = mount(home, {
            global: {
                plugins: [createTestingPinia()], // 确保Pinia状态管理正常
            },
        });
        expect(wrapper.findAll('.article-block').length).to.be.greaterThan(0); // 确保有文章块渲染
    });

    it('应能显示文章标题', () => {
        const wrapper = mount(home, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        expect(wrapper.find('.article-block h3').exists()).toBe(true); // 验证是否显示文章标题
    });

    it('应能正确处理评分功能', async () => {
        const wrapper = mount(home, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const star = wrapper.find('.article-block-score span').first();
        await star.trigger('click'); // 触发星星点击
        expect(wrapper.vm.starLog.size).toBe(1); // 确保评分记录更新
    });

    it('应能正确处理提交评论', async () => {
        const wrapper = mount(home, {
            global: {
                plugins: [createTestingPinia()],
            },
        });
        const commentTextarea = wrapper.find('.article-block-comment-input textarea');
        await commentTextarea.setValue('这是一个测试评论');
        await wrapper.find('.article-block-comment-input button').trigger('click'); // 提交评论
        expect(wrapper.vm.commentLog.size).toBeGreaterThan(0); // 确保评论被记录
    });
});
