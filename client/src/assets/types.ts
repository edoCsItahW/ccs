/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/**
 * @file types.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/10/25 下午8:18
 * @desc 该文件提供全局类型接口及定义支持
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */

/** @interface LangCell 语言单元
 * @property {string} en 英文
 * @property {string} zh 中文
 * */
export interface LangCell {
    en: string;
    zh: string;
}

/** @interface Cmt 评论
 * @property {object} user 用户信息
 * @property {string} content 评论内容
 * @property {string} date 评论日期
 * */
export interface Cmt {
    user: { name: string; img: string | null, id: number };
    content: string;
    date: string;
}

/** @interface Content 页面多语言支持内容
 * @property {object} header 通用头部组件内容
 * @property {object} home 首页组件内容
 * @property {object} login 登录组件内容
 * @property {object} profile 用户信息组件内容
 * */
export interface Content {
    header: {
        // 选项卡
        options: LangCell[];
        // 搜索框
        search: {
            // 输入提示
            ph: LangCell;
            // 没有结果提示
            no: LangCell;
            // 结果类型表
            map: {
                article: LangCell;
                user: LangCell;
            },
            // 结果提示
            type: LangCell;
        }
    },
    home: {
        // 标题块
        block: {
            // 教师
            teacher: LangCell;
            // 评分
            score: LangCell;
            // 评论
            comment: {
                // 数量
                num: LangCell;
                // 无评论提示
                no: LangCell;
                // 关闭
                close: LangCell;
                // 评论提示
                ph: LangCell;
                // 提交
                submit: LangCell;
                // 成功信息
                success: LangCell;
                // 收起
                fold: LangCell;
            }
        },
        // 统计块
        statistics: {
            // 标题
            title: LangCell;
            hot: LangCell;
            top: LangCell;
            user: LangCell;
        },
        // 匿名确认
        confirm: LangCell
    },
    // 登录注册
    login: {
        // 标题
        title: {
            // 登录情况
            login: LangCell;
            // 注册情况
            register: LangCell;
        },
        // 用户名输入提示
        username: LangCell;
        // 密码输入提示
        password: LangCell;
        // 确认密码输入提示
        confirm: LangCell;
        // 提交文本
        submit: {
            // 登录情况
            login: LangCell;
            // 注册情况
            register: LangCell;
        }
    },
    // 用户信息
    profile: {
        // 留言板
        leaveword: LangCell;
        // 登出文本
        logout: LangCell;
    }
}

/** @interface Course 课程信息
 * @property {number} id 课程ID
 * @property {string} imgUrl 课程图片URL
 * @property {string} title 课程标题
 * @property {string} text 课程简介
 * @property {string} teacher 课程教师
 * @property {number} stars 课程评分
 * @property {Cmt[]} comment 课程评论
 * */
export interface Course {
    id: number;
    imgUrl: string;
    title: string;
    text: string;
    teacher: string;
    stars: number;
    comment: Cmt[];
}

export type Courses = Course[];

/** @interface User 用户信息
 * @property {number} id 用户ID
 * @property {string} name 用户名
 * @property {string} img 用户头像URL
 * @property {string} password 用户密码(仅当登录/注册时)
 * @property {string} date 用户注册日期(仅当登录/注册时)
 * */
export interface User {
    id: number;
    name: string;
    img: string | null;
    password?: string;
    date?: string;
}

export interface SerachRes {
    data: string | User;
    type: 'article' | 'user';
}
