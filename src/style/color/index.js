import black from "./black.json"
import white from "./white.json"
import Vue from 'vue'

import store from "../../store";

let color = {

    usercolor: () => store.getters.setting.color | "black",

    colorCatch: {},

    /**
     * 获取背景颜色
     * @param router
     */
    getcolor: function (router) {

        if (!router) {
            throw new Error("获取颜色错误,配置错误", router);
        }

        if (this.colorCatch[router]) {
            return this.colorCatch[router];
        } else {
			console.log("获取颜色：", router)
            let colorJson;
            const routArray = router.split(".");
            if (this.usercolor === "black") {
                colorJson = black;
            } else if (this.usercolor === 'white') {
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

            this.colorCatch[router] = obj;
            return obj;
        }
    }

}

Vue.prototype.$s = (router) => color.getcolor(router);


export default color;
