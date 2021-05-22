// 存放和用户身份验证有关的
import { removeAllStorage } from '@/utils/authUtil'

const user = {
  state: {
    token: '', // token
    user: {}, // 保存登录的用户
    role: '',// 登录用户角色
	  setting:{},
  },

  mutations: {
    setToken: (state, token) => {
      console.log("设置token" + token);
      state.token = token
    },
    setUser: (state, user) => {
      console.log("设置User");
      state.user = user
    },
  },

  actions: {
    // 登出
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        console.log("用户登出");
        commit('setToken', '');
        commit('setUser', {});
        removeAllStorage();
        resolve();
      })
    },
  }
}

export default user
