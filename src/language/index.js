import en from "./en.json"
import zh from "./zh.json"
import Vue from 'vue'

import store from "../store";

let language = {

  userLanguage: () => store.getters.setting.language | "zh",

  languageCatch: {},

  /**
   * 语言
   * @param router
   */
  getLanguage: function (router) {

    if (!router) {
      throw new Error("获取语言,配置错误", router);
    }

    if (this.languageCatch[router]) {
      return this.languageCatch[router];
    } else {
      console.log("获取语言：", router)
      let languageJson;
      const routArray = router.split(".");
      if (this.userLanguage === "zh") {
        languageJson = zh;
      } else if (this.userLanguage === 'en') {
        languageJson = en;
      } else {
        languageJson = zh;
      }

      let obj = languageJson;
      for (let i = 0; i < routArray.length; i++) {
        const key = routArray[i];
        if (obj[key]) {
          obj = obj[key];
        } else {
          throw new Error("获取语言错误,未配置", router);
        }
      }

      this.languageCatch[router] = obj;
      return obj;
    }
  }

}

Vue.prototype.$t = (router) => language.getLanguage(router);
uni.$t = Vue.prototype.$t;

export default language;
