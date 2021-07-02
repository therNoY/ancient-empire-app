import en from "./en.json"
import zh from "./zh.json"
import Vue from 'vue'

import store from "../store";
import arrayWithHoles from "@babel/runtime/helpers/esm/arrayWithHoles";

let language = {

	// userLanguage: "en",
	userLanguage: store.getters.setting.language | "zh",

	languageCatch: {},

	/**
	 * 语言
	 * @param router
	 */
	getLanguage: function (router) {
		if (!router) {
			throw new Error("获取语言,配置错误" + router);
		}
		let userLanguage = this.userLanguage;
		let languageCatch = this.languageCatch[userLanguage];
		if (!languageCatch) {
			this.languageCatch[userLanguage] = {};
			languageCatch = this.languageCatch[userLanguage];
		}

		if (languageCatch[router]) {
			return languageCatch[router];
		} else {
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
					console.warn("获取语言错误,未配置" + router);
					return routArray[i];
				}
			}
			languageCatch[router] = obj;
			return obj;
		}
	}

}

Vue.prototype.$t = (router, args) => {
	if (args instanceof Array && args.length > 0) {
		let res = language.getLanguage(router);
		let flag = 0, argLength = args.length;
		while (argLength > 0 && flag < argLength && res.indexOf("{}") > 0) {
			res = res.replace("{}", args[flag]);
			flag++;
		}
		return res;
	} else if (args !== undefined) {
		let res = language.getLanguage(router);
		res = res.replace("{}", args);
		return res;
	} else {
		return language.getLanguage(router);
	}
};
uni.$t = Vue.prototype.$t;

export default language;
