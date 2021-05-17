import black from "./color/black.json"
import white from "./color/white.json"
import Vue from 'vue'

import store from "../store";

let style = {

    userStyle: () => store.getters.setting.style | "black",

    styleCatch: {},

    /**
     * 获取背景颜色
     * @param router
     */
    getStyle: function (router) {

        if (!router) {
            throw new Error("获取颜色错误,配置错误", router);
        }

        if (this.styleCatch[router]) {
            return this.styleCatch[router];
        } else {
			console.log("获取颜色：", router)
            let colorJson;
            const routArray = router.split(".");
            if (this.userStyle === "black") {
                colorJson = black;
            } else if (this.userStyle === 'white') {
                colorJson = white;
            } else {
                colorJson = black;
            }

            let obj = colorJson;
            for (let i = 0; i < routArray.length; i++) {
                const key = routArray[i];
                if (obj[key]) {
                    obj = obj[key];
                } else {
                    throw new Error("获取颜色错误,未配置", router);
                }
            }

            this.styleCatch[router] = obj;
            return obj;
        }
    }

}

Vue.prototype.$s = (router) => style.getStyle(router);


export default style;
