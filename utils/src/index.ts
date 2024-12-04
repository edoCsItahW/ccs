/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */
import * as CryptoJS from "crypto-js";

/** @constant API_URL
 * @description 标准的API地址
 * @default location.origin + "/api"
 * @global
 * */
export const API_URL: string = location.origin + "/api";

/** @interface IRecv
 * @description 标准的接口返回格式
 * @property {number} code - 状态码
 * @property {string} msg - 状态信息
 * @property {any} data - 返回数据
 * */
export interface IRecv {
    /**
     * @access public
     * @description 状态码
     * @inner
     * */
    code: number;
    /**
     * @access public
     * @description 状态信息
     * @inner
     * */
    msg: string;
    /**
     * @access public
     * @description 返回数据
     * @inner
     * */
    data: any;
}

/** @class _Promise
 * @desc 封装Promise，增加success和catch方法
 * @property {Promise<IRecv>} #promise - 原始Promise对象
 * @method success - 成功回调函数
 * @method catch - 失败回调函数
 * @method then - 同Promise.then
 * */
class _Promise {
    #promise: Promise<IRecv>;
    
    /** @constructor
     * @param {Promise<IRecv>} promise - 原始Promise对象
     * */
    constructor(promise: Promise<IRecv>) {
        this.#promise = promise;
    }
    
    /** @method success
     * @desc 成功回调函数
     * @param {Function} cb - 成功回调函数
     * @param {string} errMsg - 错误信息(可选)
     * @returns {this} - 当前实例对象
     * @example <caption>success示例</caption>
     * // 成功回调函数
     * let data;
     * _Promise(fetch(url)).success(res => { data = res.data; });
     * */
    success(
            cb: (res: IRecv) => void,
            errMsg: string = "Failed to receive data",
    ): this {
        this.#promise.then((res) => {
            if (res.code === 200) cb(res);
            else console.error(`${res.code} - ${errMsg}: ${res.msg}!`);
        });
        return this;
    }
    
    catch(cb: (reason: any) => void): void {
        this.#promise.catch(cb);
    }
    
    then<TR2 = never>(onfulfilled?: (res: IRecv) => IRecv | TR2, onrejected?: (reason: any) => PromiseLike<TR2> | TR2): Promise<IRecv | TR2> {
        return this.#promise.then(onfulfilled, onrejected);
    }
}

export namespace $ {
    /** 根据元素id获取元素对象
     *
     * @param {string} elementId - 元素id
     * @returns {HTMLElement} - 元素对象
     * */
    export function id(elementId: string): HTMLElement {
        
        
        return document.getElementById(elementId);
    }
    
    /** 根据类名获取元素对象
     *
     * @param {string} classNames - 类名
     * @param {number} index - 索引(默认为0)
     * @returns {Element | HTMLCollectionOf<Element>} - 元素对象或元素集合
     * */
    export function class_(
            classNames: string,
            index: number = 0,
    ): Element | HTMLCollectionOf<Element> {
        
        return typeof index === "number"
                ? document.getElementsByClassName(classNames)[index]
                : document.getElementsByClassName(classNames);
    }
    
    /** 生成字符串的哈希值
     *
     * @param {string} str - 字符串
     * @returns {string} - 哈希值
     * */
    export function toHash(str: string) {
        // return crypto.createHash('sha256').update(string).digest('hex')
        return CryptoJS.SHA256(str).toString();
    }
    /** 获取数组bigArray对smallArray的补集(bigArray包含smallArray)(bigArray中存在但smallArray中不存在的元素)
     *
     * @param {Array} bigArray - 包含smallArray中所有元素的数组
     * @param {Array} smallArray - 该数组中的所有元素都可以在数组bigArray中被找到
     * @returns {Array} - 补集数组
     * */
    export function getComplement(bigArray: any[], smallArray: any[]): any[] {
        return bigArray.filter((element) => !smallArray.includes(element));
    }
}

export namespace ErrHandle {
    /** @interface IError
     * @description 错误信息对象
     * @property {string} func - 函数名
     * @property {string} file - 文件名
     * @property {string} line - 行号
     * */
    interface IError {
        func: string;
        file: string;
        line: string;
    }
    
    /** @function regexStack
     * @desc 解析错误栈
     * @param {string} stack - 错误栈字符串
     * @returns {object} - 包含错误信息和错误栈的对象
     * */
    export function regexStack(stack: string): {
        msg: string;
        stack: Array<IError>;
    } {
        const stackRegex: RegExp =
                /at\s+(?:([^\s(]+)\s+)?\((file:.*?):(\d+):\d+\)|at\s+(file:.*?):(\d+):\d+|at\s+(?:([^\s(]+)\s+)?\((node:.*?):(\d+):\d+\)/g;
        
        const matches: Array<IError> = [];
        let match: RegExpExecArray | null;
        
        while ((match = stackRegex.exec(stack)) !== null) {
            matches.push({
                func: match[1] || match[6] || "main",
                file: match[2] || match[4] || match[7] || "unknown",
                line: match[3] || match[5] || match[8],
            });
        }
        
        return { msg: stack.match(/^(.*?)(?=\n)/)?.[1] || "", stack: matches };
    }
    
    /** @function pyStyleError
     * @desc 输出Python风格的错误栈
     * @param {string} stack - 错误栈字符串
     * */
    export function pyStyleError(stack: string): void {
        const infoObj = regexStack(stack);
        
        console.error("Traceback (most recent call last):");
        infoObj.stack.forEach((item) =>
                console.error(
                        `    File "${item.file}", line ${item.line}, in <${item.func}>`,
                ),
        );
        console.error(infoObj.msg);
    }
    
    /** @function tryExec
     * @desc 一个装饰器，尝试执行函数并捕获错误
     * @param {Function} func - 要执行的函数
     * @param {Function} error - 错误处理函数(可选)
     * @returns {Function} - 包装后的函数
     * @example <caption>tryExec示例</caption>
     * // 尝试执行函数并捕获错误
     * tryExec(() => throw new Error("Error occurred!"), (msg, code) => console.error(msg))
     * */
    export function tryExec(
            func: Function,
            error?: (msg: string, code: number) => void,
    ): Function {
        return function (): any {
            try {
                return func(...arguments);
            } catch (e: any) {
                if (error) error(e.message, 400);
                else {
                    pyStyleError(e.stack);
                }
            }
        };
    }
}

export namespace ElemOption {
    export function removeAllChild(elem: HTMLElement) {
        /* 移除所有子元素 */
        if (elem.children?.length)
            Array.from(elem.children).forEach((e) => elem.removeChild(e));
    }
}

export namespace extent {
    function isArray(value: any): value is any[] {
        return Array.isArray(value);
    }
    
    function isClass(value: any): value is Function {
        if (value && typeof value === "function")
            return /^class\s/.test(Object.prototype.toString.call(value));
        return false;
    }
    
    function isFunction(value: any): value is Function {
        return typeof value === "function" && !isClass(value);
    }
    
    function isInstance(value: any): value is object {
        if (value && typeof value === "object")
            return /^class\s/.test(value.constructor.toString());
        return false;
    }
    
    function isObject(value: any): value is object {
        return typeof value === "object" && !isArray(value) && !isInstance(value);
    }
    
    function dir(obj: any) {
        const properties = new Set<string>();
        
        let currentObj = obj;
        do {
            for (const key of Object.getOwnPropertyNames(currentObj)) {
                properties.add(key);
            }
            currentObj = Object.getPrototypeOf(currentObj);
        } while (currentObj);
        
        return Array.from(properties);
    }
    
    export namespace array {
        export function shuffle<T>(arr: T[]): T[] {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
    }
    export namespace object {
        export function shuffleValue(obj: { [key: string]: any }) {
            for (const key in obj)
                if (obj.hasOwnProperty(key) && isArray(obj[key]))
                    obj[key] = array.shuffle(obj[key]);
        }
        
        export enum DiffMode {
            CHANGE = 0,
            COMPARE = 1,
        }
        
        export function findDiff(
                obj1: object,
                obj2: object,
                mode: DiffMode = DiffMode.COMPARE,
                diff: object = {},
        ): object {
            if (!obj1 || !obj2)
                    // 如果有任何一个对象为空
                return mode
                        ? { type: "assign", obj1: obj1, obj2: obj2 }
                        : { type: "assign", from: obj1, to: obj2 };
            
            for (let key in obj1) {
                // 遍历obj1
                if (!obj2.hasOwnProperty(key))
                        // obj2中没有该属性
                    diff[key] = {
                        type: mode ? "obj1 only" : "deleted",
                        value: obj1[key],
                    };
                else {
                    // obj2中有该属性
                    if (obj1[key] && typeof obj1[key] === "object") {
                        // 该属性是对象
                        diff[key] = findDiff(obj1[key], obj2[key], mode, diff[key]);
                        if (!Object.keys(diff[key]).length) delete diff[key];
                    } // 递归比较
                    else if (obj1[key] !== obj2[key]) {
                        // 该属性值不同
                        console.log("value", diff, key);
                        diff[key] = mode
                                ? { type: "changed", obj1: obj1[key], obj2: obj2[key] }
                                : {
                                    type: "changed",
                                    from: obj1[key],
                                    to: obj2[key],
                                };
                    }
                }
            }
            
            for (let key in obj2) {
                // 遍历obj2
                if (!obj1.hasOwnProperty(key))
                        // obj1中没有该属性
                    diff[key] = { type: mode ? "obj2 only" : "added", value: obj2[key] };
            }
            
            return diff;
        }
    }
}

/** @function _request
 * @async
 * @desc 发送请求
 * @param {string} url - 目标路径
 * @param {string} reqHead - 用于描述请求部分和目的的字段
 * @param {object} data 请求内容
 * @param {string} method 请求方法(默认: "POST")
 * @param {string} contentType 请求内容类型(默认: "application/json")
 * @return {object} 返回的json数据,包括code,msg,body
 * @example <caption>request示例</caption>
 * // 向http://localhost:3000/api/login发送登录请求
 * _request(API_URL, 'login', {name: 'admin', password: '123456'})
 *     .then(res =>
 *         if (res.code === 200) { ... }
 *         else console.error(`${res.code} - Failed to login: ${res.msg}!`)
 *     )
 * */
async function _request(
        url: string,
        reqHead: string,
        data: any,
        method: string = "POST",
        contentType: string = "application/json",
): Promise<IRecv> {
    const response = await fetch(route.join(url, reqHead), {
        method: method,
        headers: { "Content-Type": contentType },
        body: contentType === "application/json" ? JSON.stringify(data) : data,
    });
    
    if (!response.ok)
        console.warn(
                `${response.status} - ${response.statusText}: ${location.href} => ${response.url}!`,
        );
    
    return await response.json();
}

/** @function request
 * @async
 * @desc 发送请求
 * @param {string} url - 目标路径
 * @param {string} reqHead - 用于描述请求部分和目的的字段
 * @param {object} data 请求内容
 * @param {string} method 请求方法(默认: "POST")
 * @param {string} contentType 请求内容类型(默认: "application/json")
 * @return {_Promise} 返回的json数据,包括code,msg,body
 * @example <caption>request示例</caption>
 * // 向http://localhost:3000/api/login发送登录请求
 * request(API_URL, 'login', {name: 'admin', password: '123456'})
 *     .success(res => { ... })
 * */
export function request(
        url: string,
        reqHead: string,
        data: any,
        method: string = "POST",
        contentType: string = "application/json",
) {
    return new _Promise(_request(url, reqHead, data, method, contentType));
}

export namespace route {
    /** @function removePos
     * @desc 移除字符串开头或结尾的指定字符
     * @param {string} str - 要处理的字符串
     * @param {string} pos - 要移除的位置(S:开头, E:结尾, A:开头和结尾)
     * @param {string} char - 要移除的字符(默认: "/")
     * @returns {string} - 处理后的字符串
     * */
    function removePos(
            str: string,
            pos: "S" | "E" | "A" = "E",
            char: string = "/",
    ): string {
        switch (pos) {
            case "S":
                return str.replace(new RegExp(`^${char}+`), "");
            case "E":
                return str.replace(new RegExp(`${char}+$`), "");
            case "A":
                return str.replace(new RegExp(`^${char}+|${char}+$`), "");
            default:
                return str;
        }
    }
    
    /** @function join
     * @desc 连接路径
     * @param {...string} args - 路径片段
     * @returns {string} - 连接后的路径
     * */
    export function join(...args: string[]): string {
        return args
        .map((v, i) =>
                removePos(v, i === 0 ? "E" : i === args.length - 1 ? "S" : "A"),
        )
        .join("/");
    }
}

/** @function sleep
 * @async
 * @desc 延时函数
 * @param {number} ms - 延时时间(毫秒)
 * @example <caption>sleep示例</caption>
 * // 延时3秒
 * sleep(3000).then(() => console.log("3秒后打印"));
 * */
export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** @function zip
 * @desc 打包多个数组
 * @param {...Array} iterables - 多个数组
 * @returns {Array} - 打包后的数组
 * @example <caption>zip示例</caption>
 * // 打包两个数组
 * zip([1, 2, 3], ["a", "b", "c"]) => [[1, "a"], [2, "b"], [3, "c"]]
 * */
export function zip<T extends any[]>(...iterables: T): T[] {
    const result: T = [] as any;
    for (let i = 0; i < Math.max(...iterables.map(v => v.length)); i++) {
        const item: any[] = [];
        for (const arr of iterables) item.push(arr[i]);
        result.push(item as T[number]);
    }
    return result;
}

export function toRgb(hex: string): number[] {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
