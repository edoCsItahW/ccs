/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/**
 * @file login.spec.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/11/01 下午12:23
 * @desc 登录组件测试文件
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Login from '@/components/login.vue';
import { createPinia } from 'pinia';

const pinia = createPinia();

describe('Login.vue', () => {
    it('renders login title', () => {
        const wrapper = mount(Login, { global: { plugins: [pinia] } });
        expect(wrapper.find('.login-title h1').text()).toContain('登录'); // 根据实际情况修改标题文本
    });

    it('enables submit button when fields are filled for registration', async () => {
        const wrapper = mount(Login, { global: { plugins: [pinia] } });

        await wrapper.find('input[type="text"]').setValue('testUser');
        await wrapper.find('input[type="password"]').setValue('password123');
        await wrapper.find('input[type="password"]')[1].setValue('password123'); // 确认密码

        expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined();
    });

    it('submits login request correctly', async () => {
        const mockRequest = vi.fn().mockResolvedValue({
            code: 200,
            data: {
                user: { id: 1, name: 'testUser' },
                token: 'testToken'
            }
        });
        vi.mock('confunc', () => ({ request: mockRequest }));

        const wrapper = mount(Login, { global: { plugins: [pinia] } });

        await wrapper.find('input[type="text"]').setValue('testUser');
        await wrapper.find('input[type="password"]').setValue('password123');
        await wrapper.find('button[type="submit"]').trigger('submit');

        expect(mockRequest).toHaveBeenCalledWith(expect.anything(), 'login', expect.objectContaining({
            name: 'testUser',
            password: expect.any(String), // 这里验证密码的哈希值
        }));
    });
});

