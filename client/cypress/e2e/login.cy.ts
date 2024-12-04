/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/**
 * @file login.cy.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/11/01 下午12:22
 * @desc 登录组件cypress测试用例
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */

describe('Login Component', () => {
    beforeEach(() => {
        cy.visit('/login'); // 确保访问登录页面
    });

    it('should display the login title', () => {
        cy.get('.login-title h1').should('contain', '登录'); // 根据实际情况修改标题文本
    });

    it('should enable submit button when fields are filled during registration', () => {
        cy.get('input[type="text"]').type('testUser');
        cy.get('input[type="password"]').type('password123');
        cy.get('input[type="password"]').eq(1).type('password123'); // 确认密码
        cy.get('button[type="submit"]').should('not.be.disabled');
    });

    it('should send login request on submit when user exists', () => {
        cy.intercept('POST', '/api/login', {
            statusCode: 200,
            body: {
                code: 200,
                data: {
                    user: {
                        id: 1,
                        name: 'testUser'
                    },
                    token: 'testToken'
                }
            }
        });

        cy.get('input[type="text"]').type('testUser');
        cy.get('input[type="password"]').type('password123');
        cy.get('button[type="submit"]').click();

        cy.url().should('eq', Cypress.config().baseUrl + '/'); // 假设成功后跳转到首页
        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.eq('testToken'); // 确保token被缓存
        });
    });
});

