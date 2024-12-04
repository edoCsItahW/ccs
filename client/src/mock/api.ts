/**
 * @file api.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/10/22 下午1:26
 * @desc mock接口模拟文件
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */

// @ts-nocheck
import 'reflect-metadata';

/** @interface IApi
 *
 * */
interface IApi<T = unknown> {
    data: T;
    code: number;
    msg: string;
}


interface IRoute<T> {
    url: string;
    method: string | string[];
    response: T;
}

interface HttpRequest<T> {
    url: string;
    body: T;
    query: Record<string, any>;
    headers: Record<string, string>;
}


function stdRes(data: any, code: number = 200, msg: string = 'ok'): IApi {
    return {data, code, msg};
}

function unifi(fn: Function): (...args: any[]) => IApi {
    return function wrap(...args: any[]): IApi {
        const res = fn.apply(this, args);
        if (typeof res !== 'object' || res === null || !['data', 'code','msg'].every(key => key in res))
            return stdRes(res);
        return res;
    }
}

function route(rule: string, method: string | string[] = 'POST'): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const orgFn = descriptor.value;
        descriptor.value = function (...args: any[]) {
            return {url: rule, method, response: orgFn.length === 0 /** 有无参数 */ ? unifi(orgFn).apply(this, args) : unifi(orgFn) /** .apply(this, args) 直接以被装饰函数作为handler */};
        };
    }
}

import respData from '@/assets/data.json';

const users = [
    { name: 'root', password: '93ec79626735f88ab34096ff9a15325a34d51fe067099d5558c24e49f8cfe6aa', id: 1 },
    { name: 'admin', password: '', id: 2 },
    { name: '小明', password: '', id: 3 }
]

class Api {
    @route('/api/article')
    static article(): IRoute<IApi> {
        return respData;
    }

    @route('/api/comment')
    static comment(data: HttpRequest<{ id: number, content: string, date: string, user: any}>): IRoute<IApi> {
        return data.body;
    }

    @route('/api/user')
    static user(response: HttpRequest<{ type: 'query' | 'check', data: string | number, token?: string }>) {
        const data = response.body;
        switch (data.type) {
            case 'query':
                // 逻辑上可搜索的用户都应存在,如取不到第一个
                return users.filter(user => user[typeof data.data === 'number' ? 'id' : 'name'] === data.data)[0];
            case 'check':
                if (data.token === 'rootxxxxx')
                    return {name: "root", id: 1, img: null }
                return { data: null, code: 401, msg: '未登录' };
        }
    }

    @route('/api/login')
    static login(response: HttpRequest<{ name: string, password: string}>) {
        const data = response.body;
        let user = users.find(user => user.name === data.name && user.password === data.password);
        if (user)
            return { user, token: data.name + 'xxxxx' };
        return { data: null, code: 401, msg: '用户名或密码错误' };
    }

    @route('/api/register')
    static register(data: HttpRequest<{ name: string, password: string, time: string }>) {
        if (users.find(user => user.name === data.name))
            return { data: null, code: 400, msg: '用户名已存在' };
        users.push({ name: data.name, password: data.password });
        return { user: users.find(u => u.name === data.name), token: data.name + 'xxxxx' };
    }

    @route('/api/upload')
    static upload(data: HttpRequest<{ file: File }>): IApi {
        console.log(data.body);
    }

    @route('/api/search')
    static search(data: HttpRequest<{ key: string }>): IApi {
        console.log(data.body);
        // 支持模糊查询,可: 用户名, 文章标题
        // 返回: {type: 'article'|'user', data: string}[]
        if (data.body.key.length > 1)
            return [{ data: "文章标题" + data.body.key, type: 'article' }, { data: "用户名" + data.body.key, type: 'user' }]
        return []
    }
}


export default [
    {
        url: '/api',
        method: 'POST',
        response: { data: 'mock available', code: 200, msg: 'ok' }
    },
    Api.article(),
    Api.comment(),
    Api.user(),
    Api.login(),
    Api.register(),
    Api.upload(),
    Api.search()
]
