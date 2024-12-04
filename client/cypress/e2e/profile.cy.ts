/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/**
 * @file profile.cy.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/11/01 下午12:28
 * @desc 个人主页组件测试
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */
describe('个人主页组件测试', () => {
    beforeEach(() => {
        cy.visit('/profile'); // 访问个人主页
    });

    it('显示用户头像', () => {
        cy.get('img[alt="avatar"]').should('exist'); // 确保头像存在
    });

    it('用户信息正确显示', () => {
        cy.get('.profile-header-info-name').should('not.be.empty'); // 确保用户名不为空
    });

    it('点击头像能够触发上传事件', () => {
        cy.get('.profile-header-avatar img').click(); // 点击头像
        cy.get('#upload').should('be.visible'); // 确保上传按钮可见
    });

    it('登出功能正常', () => {
        cy.get('.profile-header-logout').click(); // 点击登出
        cy.url().should('include', '/login'); // 确保跳转到登录页
    });

    it('能够上传头像', () => {
        const fileName = 'avatar.png'; // 示例文件名
        cy.fixture(fileName).then(fileContent => {
            cy.get('input[type=file]').attachFile({
                fileContent,
                fileName,
                mimeType: 'image/png',
            });
        });
        cy.get('img[alt="avatar"]').should('have.attr', 'src').should('not.equal', ''); // 确保头像更新
    });
});

