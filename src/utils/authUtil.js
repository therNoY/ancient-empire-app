/**
 * 关于登录 H5 使用邮箱登录 小程序 使用自己的工具登录
 */
import localStorage from './localStorage.js'
import store from '../store'

const userNameKey = 'AEUserName'; // cookie中保存name的Key
const userIdKey = 'AEUserId'; // cookie 中保存pwd的key
const userPwdKey = 'AEPwd'; // cookie 中保存pwd的key
const TokenKey = 'AEToken'; // cookie 中保存token的key

/**
 * 获取本地token
 * @returns {*}
 */
export function getCookieToken() {
  return localStorage.get(TokenKey)
}

/**
 * 保存token
 * @param token
 */
export function setToken(token) {
  console.log("更新缓存的token"+ token);
  store.commit("setToken", token);
  localStorage.set(TokenKey, token);
}

/**
 * 从Cookie中获取历史保存用户
 * @returns {null}
 */
export function getLocalSaveUser() {
  let user_name = localStorage.get(userNameKey);
  let password = localStorage.get(userPwdKey);
  let user_id = localStorage.get(userIdKey);
  if (user_name && password && user_id) {
    let user = {};
    user.user_name = user_name;
    user.password = password;
    user.user_id = user_id;
    return user;
  }
  return null;
}

/**
 * 保存用户信息
 * @param user
 */
export function setUser(user) {
  localStorage.set(userNameKey, user.user_name);
  localStorage.set(userPwdKey, user.password);
  localStorage.set(userIdKey, user.user_id);
  store.commit("setUser", user);
}

export function removeAllStorage() {
  console.log("清除所有Cookie");
  localStorage.remove(userNameKey);
  localStorage.remove(userPwdKey);
  localStorage.remove(userIdKey);
  localStorage.remove(TokenKey)
}
