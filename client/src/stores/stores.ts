import { Theme, Svg, ISvg, _Svg, Lang,  } from "@/assets/global";
import { LangCell, Content, User } from "@/assets/types";
import { defineStore } from "pinia";
import { reactive } from "vue";

import content from "@/assets/content.json";

export const Store_ = defineStore("store", {
    state() {
        return {
            // 主题控制
            color: reactive(Theme.Color(Number.parseInt(localStorage.getItem("mode")) || Theme.Mode.LIGHT)),
            /**
             * @access private
             * @desc 待初始化的svg
             * */
            _svg: null as ISvg & _Svg | null,
            lang: Lang.ZH,
            content: content as Content,
            /**
             * @desc 选项卡索引
             * */
            optIdx: 0,
            /**
             * @desc 当前用户信息
             * */
            user: { name: null, img: null, id: null } as User,
            /**
             * @desc 是否只保留样式控制按钮
             * */
            controlOnly: false,
            /**
             * @desc 组件件数据中转
             * @property target 目标组件名
             * @property data 组件数据
             * */
            trans: { target: null as string | null, data: null as any | null }
        };
    },
    getters: {
        /**
         * @desc 获取当前主题下的svg
         * */
        svg(state): _Svg & ISvg {
            if (state._svg) return state._svg;
            return state._svg = Svg(state.color);
        }
    },
    actions: {
        /**
         * @desc 切换主题
         * */
        changeColor() {
            this.color.mode = Theme.Mode.LIGHT ^ Theme.Mode.DARK ^ this.color.mode;
            localStorage.setItem("mode", this.color.mode.toString());
        },
        /**
         * @desc 切换语言
         * */
        changeLang() { this.lang = this.lang === Lang.ZH ? Lang.EN : Lang.ZH; },
        /**
         * @desc 根据语言选择对应文本
         * @param key 语言键
         * */
        format(key: LangCell): string { return key[this.lang]; },
        /**
         * @desc 更新用户信息
         * @param user 用户信息
         * */
        updateUser(user: { name: string, img: string | null, id: string | null }) {
            this.user = user;
        },
        /**
         * @desc 重置用户信息
         * */
        resetUser() {
            this.user = { name: null, img: null, id: null };
            localStorage.removeItem("token");
        },
        /**
         * @desc 发送数据到指定组件
         * @param data 要发送的数据
         * @param target 目标组件名
         * */
        sendto(data: any, target: string | null) {
            this.trans.data = data;
            this.trans.target = target;
        }
    }
});
