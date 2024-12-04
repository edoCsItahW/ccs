/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */

/** @module svg
 * @desc 声明 svg 文件的类型
 * */
declare module "*.svg" {
    /** @var {any} content svg 文件的原始内容 */
    const content: any;
    /** @export content 导出 svg 文件的原始内容 */
    export default content;
}

/** @module png
 * @desc 声明 png 文件的类型
 * */
declare module "*.png" {
    /** @var {any} content png 文件的原始内容 */
    const content: any;
    /** @export content 导出 png 文件的原始内容 */
    export default content;
}

/** @module json
 * @desc 声明 json 文件的类型
 * */
declare module "*.json" {
    /** @var {any} content json 文件的原始内容 */
    const content: any;
    /** @export content 导出 json 文件的原始内容 */
    export default content;
}
