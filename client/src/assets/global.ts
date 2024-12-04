/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/**
 * @file global.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/10/25 下午4:02
 * @desc 全局构件
 * @copyright CC BY-NC-SA 2024. All rights reserved.
 * */

/** @namespace Theme
 * @desc 包含主题相关的类和方法
 * @property {Mode} Mode 主题模式
 * @property {IColor} IColor 主题颜色接口
 * @property {_Color} _Color 主题颜色类
 * */
export namespace Theme {
    /** @enum Mode
     * @desc 主题模式
     * @property LIGHT 亮色模式
     * @property DARK 暗色模式
     * */
    export enum Mode {
        // 亮
        LIGHT,
        // 暗
        DARK
    }

    /** @interface IColor
     * @desc 主题颜色接口
     * @property {string} font 字体颜色
     * @property {string} back 背景颜色
     * @property {string} border 边框颜色
     * @property {string} backL 偏亮背景颜色
     * @property {string} backD 偏暗背景颜色
     * @property {string} fontL 偏亮字体颜色
     * @property {string} fontD 偏暗字体颜色
     * */
    export interface IColor {
        // 字体颜色
        font: string;
        // 偏亮字体颜色
        fontL: string;
        // 偏暗字体颜色
        fontD: string;
        // 偏亮背景颜色
        backL: string;
        // 偏暗背景颜色
        backD: string;
        // 背景颜色
        back: string;
        // 边框颜色
        border: string;
    }

    /** @class _Color
     * @classdesc 主题颜色控制类
     * @property {Mode} mode 主题模式
     * @property {IColor} map 主题颜色映射表
     * @property {boolean} isLight 是否为亮色模式
     * @method hexToRgb 将十六进制颜色值转换为 RGB 值
     * */
    export class _Color {
        #map = {
            // LIGHT, DARK
            font: ["#333", "#d3d3d3"],
            fontL: ["#494949", "#9f9f9f"],
            fontD: ["#1e1e1e", "#ececec"],
            back: ["#e3e3e3", "#1c1c1c"],
            backD: ["#fff", "#000000"],
            backL: ["#d6d6d6", "#373737"],
            border: ["#888", "#888"],
        };

        /** @constructor
         * @param {Mode} mode 主题模式
         * */
        constructor(public mode: Mode) {}

        get map(): IColor { return this.#map; }

        get isLight() { return this.mode === Mode.LIGHT; }

        hexToRgb(hexColor: string): number[] {
            hexColor = hexColor.replace('#', '');

            return Array.from({length: 3}, (_, i) => parseInt(hexColor.slice(i * 2, i * 2 + 2), 16));
        }
    }


    /** @constant Color
     * @desc 使用代理包装 Theme._Color 类,控制描述符
     * */
    export const Color = (mode: Mode) => new Proxy<_Color>(new _Color(mode), {
        get: (target: _Color, key: string) => {
            if (key in target.map) return target.map[key]?.[target.mode];  // 引导索引
            return target[key];
        },
        set: (target: _Color, key: string, value: any) => {
            if (key in target.map) throw new Error(`Cannot set ${key} property`);
            if (key === "mode") target.mode = value;
            return true;
        }
    }) as IColor & _Color;
}

/** @interface _SvgFunc
 * @desc SVG 通用函数接口
 * */
export interface _SvgFunc {
    (w?: Number, h?: Number, ...args: any[]): string;
}

/** @interface ISvg
 * @desc SVG 实例接口
 * @property {_SvgFunc} lang 语言改变图标
 * @property {_SvgFunc} star 星星图标
 * @property {_SvgFunc} comment 评论图标
 * */
export interface ISvg {
    lang: _SvgFunc;
    star: _SvgFunc;
    comment: _SvgFunc;
}

/** @class _Svg
 * @classdesc svg 样式控制类
 * @private color 主题控制类实例
 * */
export class _Svg {
    #map = {
        // LIGHT, DARK
        lang: ['black', 'white'],
        comment: ['black', 'white'],
        _star: ["red", "yellow"],
    };

    /** @var rate
     * @summary 缩放比例
     * @desc 控制svg图标的缩放比例
     * @access public
     * @default 1
     * */
    public rate = 1;

    /** @constructor
     * @param {Theme._Color} color 主题模式
     * */
    constructor(private color: Theme._Color & Theme.IColor) {}

    get isLight() {
        return this.color.mode === Theme.Mode.LIGHT;
    }

    get map() {
        return this.#map;
    }

    auto(key: string) {
        return this.map[key]?.[this.isLight ? 0 : 1];
    }

    lang(w: Number = 24, h: Number = 24) {
        return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="${this.auto('lang')}" width="${this.rate * w}" height="${this.rate * h}">
                    <path d="m11.62965 16.61452c-1.13922-.692-3.111-2.36313-3.153-2.32718a28.32942 28.32942 0 0 1 -3.30095 2.26177c-.68823.39708-1.38892.49615-1.82064-.09139a.992.992 0 0 1 .26656-1.40406c.00852-.00391 2.44665-1.594 3.25973-2.29678a11.64387 11.64387 0 0 1 -2.23281-3.53521 1.07774 1.07774 0 0 1 .52716-1.36835c.52715-.22205 1.049-.12664 1.48663.61989a10.33341 10.33341 0 0 0 1.8143 2.89517 10.853 10.853 0 0 0 2.1563-4.3469l-7.63293-.02148v-2.00685h4.8124v-.99406a.98574.98574 0 1 1 1.9713 0v.99406h5.1703v2.00685h-2.08646a17.03869 17.03869 0 0 1 -2.64065 5.75689 15.88157 15.88157 0 0 0 2.30149 1.66068l2.3092-5.66617a1.162 1.162 0 0 1 2.1802.01591l3.01041 7.389 1.85638 4.385h-2.47393l-1.08252-2.53924h-4.84082l-.888 2.53924h-2.5993l.287-.69166zm4.31307-5.16715-1.67531 4.55419h3.35059z"/>
                </svg>`;
    }

    star(w: Number = 24, h: Number = 24, active: boolean = false) {
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="${this.rate * w}" height="${this.rate * h}">
                    <polygon fill="${active ? this.auto('_star') : 'gray'}" points="50,5 61,35 95,35 67,57 76,90 50,70 24,90 33,57 5,35  39,35" />
                </svg>`
    }

    comment(w: Number = 24, h: Number = 24) {
        return `<svg fill="${this.auto('comment')}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="${this.rate * w}" height="${this.rate * h}">
                    <path d="M896 128a42.666667 42.666667 0 0 1 42.666667 42.666667v554.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H256l-170.666667 170.666667V170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667h768z m-21.333333 64H149.333333v592.128L229.482667 704H874.666667V192z m-533.333334 192a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z m192 0a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z m192 0a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z" />
                </svg>`
    }
}

/** @constant Svg
 * @desc 使用代理包装 Svg 实例
 * */
export const Svg = (color: Theme._Color & Theme.IColor) => new Proxy<_Svg>(new _Svg(color), {
    get: (target: _Svg, key: string) => {
        if (key in target) return target[key];
        return target.auto(key);
    }
}) as _Svg & ISvg;

/** @enum Lang
 * @desc 语言枚举
 * @property EN 英文
 * @property ZH 中文
 * */
export enum Lang {
    EN = "en",
    ZH = "zh"
}
