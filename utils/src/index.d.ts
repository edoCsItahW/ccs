/**
 * @file index.d.ts
 * @author edocsitahw
 * @version 1.1
 * @date 2024/10/25 ÏÂÎç9:29
 * @desc
 * */
declare module "*.js" {
    const value: any;
    export default value;
}

export const API_URL: string;

export interface IRecv {
    code: number;
    msg: string;
    data: any;
}

declare class _Promise {
    constructor(promise: Promise<IRecv>);
    success(cb: (res: IRecv) => void, errMsg?: string): this;
    catch(cb: (reason: any) => void): void;
    then<TR2 = never>(onfulfilled?: (value: IRecv) => IRecv | PromiseLike<IRecv>, onrejected?: (reason: any) => TR2 | PromiseLike<TR2>): Promise<IRecv | TR2>;
}

export declare const $: {
    id(elementId: string): HTMLElement | null;
    class_(classNames: string, index?: number): Element | HTMLCollectionOf<Element>;
    toHash(str: string): string;
    getComplement(bigArray: any[], smallArray: any[]): any[];
};

export declare const ErrHandle: {
    regexStack(stack: string): {msg: string, stack: Array<{func: string, file: string, line: string}>};
    pyStyleError(stack: string): void;
    tryExec(func: Function, error?: (msg: string, code: number) => void): Function;
};

export declare const ElemOption: {
    removeAllChild(elem: HTMLElement): void;
};

export declare const extent: {
    array: {
        shuffle<T>(arr: T[]): T[];
    };
    object: {
        shuffleValue(obj: {[key: string]: any}): void;
        findDiff(obj1: object, obj2: object, mode?: number, diff?: object): object;
    };
};

export declare function request(url: string, reqHead: string, data: any, method?: string, contentType?: string): _Promise;

export declare const route: {
    removePos(str: string, pos?: "S" | "E" | "A", char?: string): string;
    join(...args: string[]): string;
};

export declare function sleep(ms: number): Promise<void>;

export declare function zip<T extends any[]>(...iterables: T): T[];

export declare function toRgb(hex: string): number[];
