// https://on.cypress.io/api

describe('课程评分系统', () => {
    beforeEach(() => {
        cy.visit('/home'); // 访问主页
    });

    it('应显示文章列表', () => {
        cy.get('.article-block').should('exist'); // 确保文章块存在
    });

    it('文章标题应该可见', () => {
        cy.get('.article-block h3').first().should('be.visible'); // 检查第一篇文章的标题可见
    });

    it('鼠标悬停时应高亮显示星星', () => {
        const firstIndex = 0; // 第一篇文章索引
        cy.get(`.article-block`).eq(firstIndex)
        .trigger('mouseenter')
        .find('.article-block-score span')
        .should('have.length', 5); // 确保有5颗星星
    });

    it('应能提交评论', () => {
        cy.get('.article-block-comment-input textarea').type('这是一个测试评论');
        cy.get('.article-block-comment-input button').click();
        cy.get('.article-block-comment-item').last().should('contain', '这是一个测试评论'); // 验证评论内容显示
    });

    it('应能切换到用户个人信息页面', () => {
        cy.get('.article-block-comment-item img').first().click(); // 点击用户头像
        cy.url().should('include', '/profile'); // 确认访问到个人信息页面
    });
});
