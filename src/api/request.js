import store from '../store'
import appHelper from "../utils/appHelper";
import {
  getCookieToken,
  getLocalSaveUser,
  setUser,
  setToken
} from "../utils/authUtil"
import {Login} from "./index";
import {baseUrl} from './env'

const serviceConfig = {
  timeout: 50000 // 请求超时时间
};

/**
 * 获取真实的url
 * @param url
 * @returns {string}
 */
function getRealUrl(url) {
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  if (baseUrl.charAt(baseUrl.length - 1) === '/') {
    baseUrl = baseUrl.substr(0, baseUrl.length - 1);
  }
  return baseUrl + url;
}

/**
 * 登录并且请求
 * @param user 用户
 * @param url url
 * @param data data
 * @param type type
 * @param showLoading showLoading
 */
function loginAndRequest(user, url, data, type, showLoading) {
  console.log("根据本地保存的用户进行登录", user);
  Login(user, false).then(({res_val}) => {
    let loginUser = {};
    loginUser.user_name = res_val.user_name;
    loginUser.password = res_val.password;
    loginUser.user_id = res_val.user_id;
    setUser(loginUser);
    let token = res_val.token;
    setToken(token);
    request(url, data, type, showLoading);
  })
}

/**
 * 封装的发送请求的函数
 * vue Vue实例
 * url 发送的Url
 * data jsons数据
 * type 请求类型 目前有 POST 和 GET
 * showLoading 是否展示loading
 * handlerErr 默认处理异常
 */
export function request(url = '', data = {}, type = 'POST', showLoading = true, handlerErr = true) {

  let header = {};

  // 请求拦截
  if (url.indexOf("/api/") >= 0) {
    // 先从vuex中获取
    let token = store.getters.token;
    // 从本地获取token
    if (!token) {
      token = getCookieToken();
    }
    if (!token) {
      // 还没有token 就从本地获取用户 然后请求登录获取token
      let user = getLocalSaveUser();
      if (!user) {
        appHelper.errorMsg("尚未登录");
        uni.redirectTo({url: 'components/Home'});
      } else {
        loginAndRequest(user, url, data, type, showLoading);
        return;
      }
    }
    if (!token) {
      return;
    }
    header['Authorization'] = "Bearer " + token;
  }

  let realUrl = getRealUrl(url);
  return new Promise((resolve, reject) => {
    if (showLoading) {
      appHelper.setLoading();
    }
    uni.request({
      url: realUrl,
      method: type,
      data,
      header,
      timeout: serviceConfig.timeout,
      success: response => {
        if (showLoading) {
          appHelper.setLoading();
        }

        if (!response || !response.data) {
          appHelper.errorMsg("系统错误, 请联系管理员");
          console.error(response);
          reject();
          return;
        }
        if (response.data.res_code === 40003 || response.data.res_code === 40001) {
          // TODO
          console.log("需要重定向");
          reject();
          return;
        }
        if (!handlerErr) {
          resolve(response.data);
        } else {
          if (response.data.res_code !== 0) {
            console.error(response);
            appHelper.errorMsg(response.data.res_mes);
            reject(response.data.res_msg);
          }
          resolve(response.data);
        }
      },
      fail: (res) => {
        reject(res);
        if (showLoading) {
          appHelper.setLoading();
        }
      }
    });
  });
}

