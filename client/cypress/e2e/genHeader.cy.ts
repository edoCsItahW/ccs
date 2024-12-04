/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/**
 * @file genHeader.cy.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/11/01 下午12:17
 * @desc
 * */

describe('导航栏组件测试', () => {
    beforeEach(() => {
        // 假设你的应用在此URL
        cy.visit('/');
    });

    it('检查logo是否渲染', () => {
        cy.get('.logo img').should('be.visible');
    });

    it('检查导航选项的数量', () => {
        cy.get('.options li').should('have.length.greaterThan', 0);
    });

    it('检查搜索框是否工作', () => {
        cy.get('.search input')
        .type('测试搜索')
        .should('have.value', '测试搜索');

        // 模拟搜索结果
        cy.intercept('GET', '**/search?key=测试搜索', {
            statusCode: 200,
            body: { data: [{ type: 'article', data: 'article-1' }] }
        });

        cy.get('.search input').trigger('input');
        cy.get('.search-res').should('contain', 'article-1');
    });

    it('切换主题', () => {
        cy.get('.control-theme').click();
        // 检查主题切换后某些样式变化
        // 这里你需要提供一些具体的检查内容，根据实际代码修改
    });

    it('检查用户头像点击跳转', () => {
        cy.get('.user img').click();
        cy.url().should('include', '/login');
    });
});

