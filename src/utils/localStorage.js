/**
 * 使用uni的本地存储能力
 * @type {{set: localStorage.set, get: localStorage.get}}
 */
let localStorage = {

	get: function (key) {
		return uni.getStorageSync(key);
	},

	set: function (key, value) {
		uni.setStorageSync(key, value);
	},

	remove: function (key) {
		uni.removeStorageSync(key);
	}
};

export default localStorage;