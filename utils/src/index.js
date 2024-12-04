/*
 - Copyright (c) 2024. All rights reserved.
 - This source code is licensed under the CC BY-NC-SA
 - (Creative Commons Attribution-NonCommercial-NoDerivatives) License, By Xiao Songtao.
 - This software is protected by copyright law. Reproduction, distribution, or use for commercial
 - purposes is prohibited without the author's permission. If you have any questions or require
 - permission, please contact the author: 2207150234@st.sziit.edu.cn
 */
import * as CryptoJS from "crypto-js";

export const API_URL = location.origin + "/api";

class _Promise {
    constructor(promise) {
        this.promise = promise;
    }

    success(cb, errMsg = "Failed to receive data") {
        this.promise.then(res => {
            if (res.code === 200) cb(res);
            else console.error(`${res.code} - ${errMsg}: ${res.msg}!`);
        });
        return this;
    }

    catch(cb) {
        this.promise.catch(cb);
    }

    then(onfulfilled, onrejected) {
        return this.promise.then(onfulfilled, onrejected);
    }
}

export const $ = {
    id(elementId) {
        return document.getElementById(elementId);
    },

    class_(classNames, index = 0) {
        return typeof index === "number" ? document.getElementsByClassName(classNames)[index] : document.getElementsByClassName(classNames);
    },

    toHash(str) {
        return CryptoJS.SHA256(str).toString();
    },

    getComplement(bigArray, smallArray) {
        return bigArray.filter(element => !smallArray.includes(element));
    }
};

export const ErrHandle = {
    regexStack(stack) {
        const stackRegex = /at\s+(?:([^\s(]+)\s+)?$(file:.*?):(\d+):\d+$|at\s+(file:.*?):(\d+):\d+|at\s+(?:([^\s(]+)\s+)?$(node:.*?):(\d+):\d+$/g;

        const matches = [];
        let match;

        while ((match = stackRegex.exec(stack)) !== null) {
            matches.push({
                func: match[1] || match[6] || "main",
                file: match[2] || match[4] || match[7] || "unknown",
                line: match[3] || match[5] || match[8]
            });
        }
        return { msg: stack.match(/^(.*?)(?=\n)/)?.[1] || "", stack: matches };
    },

    pyStyleError(stack) {
        const infoObj = this.regexStack(stack);

        console.error("Traceback (most recent call last):");
        infoObj.stack.forEach(item => console.error(`    File "${item.file}", line ${item.line}, in <${item.func}>`));
        console.error(infoObj.msg);
    },

    tryExec(func, error) {
        return function() {
            try {
                return func(...arguments);
            } catch (e) {
                if (error)
                    error(e.message, 400);
                else {
                    this.pyStyleError(e.stack);
                }
            }
        };
    }
};

export const ElemOption = {
    removeAllChild(elem) {
        if (elem.children?.length)
            Array.from(elem.children).forEach(e => elem.removeChild(e));
    }
};

export const extent = {
    array: {
        shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }
    },
    object: {
        shuffleValue(obj) {
            for (const key in obj)
                if (obj.hasOwnProperty(key) && Array.isArray(obj[key]))
                    obj[key] = this.array.shuffle(obj[key]);
        },

        findDiff(obj1, obj2, mode = 1, diff = {}) {
            if (!obj1 || !obj2)
                return mode ? { type: "assign", obj1: obj1, obj2: obj2 } : { type: "assign", from: obj1, to: obj2 };

            for (let key in obj1) {
                if (!obj2.hasOwnProperty(key))
                    diff[key] = { type: mode ? "obj1 only" : "deleted", value: obj1[key] };
                else {
                    if (obj1[key] && typeof obj1[key] === "object") {
                        diff[key] = this.findDiff(obj1[key], obj2[key], mode, diff[key]);
                        if (!Object.keys(diff[key]).length)
                            delete diff[key];
                    } else if (obj1[key] !== obj2[key]) {
                        diff[key] = mode ? { type: "changed", obj1: obj1[key], obj2: obj2[key] } : {
                            type: "changed",
                            from: obj1[key],
                            to: obj2[key]
                        };
                    }
                }
            }

            for (let key in obj2) {
                if (!obj1.hasOwnProperty(key))
                    diff[key] = { type: mode ? "obj2 only" : "added", value: obj2[key] };
            }
            return diff;
        }
    }
};

async function _request(url, reqHead, data, method = "POST", contentType = "application/json") {
    const response = await fetch(route.join(url, reqHead), {
        method: method,
        headers: { "Content-Type": contentType },
        body: contentType === "application/json" ? JSON.stringify(data) : data
    });

    if (!response.ok)
        console.warn(`${response.status} - ${response.statusText}: ${location.href} => ${response.url}!`);

    return await response.json();
}

export function request(url, reqHead, data, method = "POST", contentType = "application/json") {
    return new _Promise(_request(url, reqHead, data, method, contentType));
}

export const route = {
    removePos(str, pos = "E", char = "/") {
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
    },

    join(...args) {
        return args.map((v, i) => this.removePos(v, i === 0 ? "E" : i === args.length - 1 ? "S" : "A")).join("/");
    }
};

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function zip(...iterables) {
    const result = [];
    for (let i = 0; i < Math.max(...iterables.map(v => v.length)); i++) {
        const item = [];
        for (const arr of iterables)
            item.push(arr[i]);
        result.push(item);
    }
    return result;
}

export function toRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

