/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/**
 * @file profile.spec.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/11/01 下午12:29
 * @desc 个人主页测试文件
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */
import { mount } from '@vue/test-utils';
import Profile from '@/components/profile.vue';
import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { Store_ } from '@/stores/stores';
import '@testing-library/jest-dom';

const pinia = createPinia();

describe('Profile 组件测试', () => {
    beforeEach(() => {
        setActivePinia(pinia);
    });

    it('应渲染用户头像', () => {
        const userStore = Store_();
        userStore.user = {
            id: 1,
            name: 'testuser',
            img: 'test.png'
        };

        const wrapper = mount(Profile, {
            global: {
                plugins: [pinia]
            }
        });
        expect(wrapper.find('img[alt="avatar"]').exists()).toBe(true);
    });

    it('应正确显示用户名', () => {
        const userStore = Store_();
        userStore.user = {
            id: 1,
            name: 'testuser',
            img: 'test.png'
        };

        const wrapper = mount(Profile, {
            global: {
                plugins: [pinia]
            }
        });
        expect(wrapper.find('.profile-header-info-name').text()).toBe('testuser');
    });

    it('应触发上传头像', async () => {
        const userStore = Store_();
        userStore.user = {
            id: 1,
            name: 'testuser',
            img: 'test.png'
        };

        const wrapper = mount(Profile, {
            global: {
                plugins: [pinia]
            }
        });
        await wrapper.find('.profile-header-avatar img').trigger('click');

        const fileInput = wrapper.find('input[type="file"]');
        expect(fileInput.element).toBeVisible(); // 使用 jest-dom 进行可见性验证
    });

    it('应调用登出功能', async () => {
        const userStore = Store_();
        userStore.user = {
            id: 1,
            name: 'testuser',
            img: 'test.png'
        };

        const wrapper = mount(Profile, {
            global: {
                plugins: [pinia]
            }
        });
        await wrapper.find('.profile-header-logout').trigger('click');
        expect(userStore.user).toEqual({ id: null, name: '', img: '' });
    });
});

