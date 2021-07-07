import {
  MapInit,
  GetUnitLevelByTemp,
  GetUserTemp,
  GetRecordById,
  GetUserRecordInfo,
  RecordInit
} from "../api"
import { gameCoreUrl } from '@/api/env'
import store from "../store";

import appHelper from "./appHelper";

/**
 * 游戏初始化类型和连接socket的映射
 */
let gameInitType2ConnectTypeMap = {
  "encounter": "stand_game",
  "story": "chapter_game",
  "room": "net_game",
}

/**
 * 获取模板单位信息缓存
 * @param tempId
 * @returns {Promise<null|*>}
 */
let getUnitLevelByTemp = async function (tempId) {
  const { res_code, res_val, res_mes } = await GetUnitLevelByTemp(tempId);
  if (res_code === 0) {
    store.commit("setUnitLevelInfo", res_val);
    console.log("异步设置单位等级信息成功", res_val);
    return res_val;
  } else {
    // appHelper.errorMsg(res_mes);
    return null;
  }
};

/**
 * 开始一局游戏
 * 1.创建ws连接,
 * 2.后台根据地图和游戏类型生成一个游戏上下文,
 * 3.可以开始游戏
 * @param selectMap
 * @param gameType 游戏类型 遭遇战 房间 战役
 */
let startGameRecord = function (selectMap, gameType, initFunc) {
  if (!selectMap) {
    return;
  }

  if (initFunc === undefined) {
    initFunc = MapInit;
  }

  let record = selectMap;
  // 初始化方法有可能存在只穿字符串的情况
  if (record instanceof Object) {
    record.game_type = gameType;
  }
  console.log("准备开始游戏 游戏类型", gameType);
  appHelper.setLoading(true);

  initFunc(record, false).then(({ res_val }) => {
    store.commit("setGame", res_val);
    console.log("初始化游戏信息", res_val);
    // 获取单位最大生命值
    // getUnitLevelByTemp(res_val.template_id);
    // 获取模板
    GetUserTemp(res_val.template_id, false, false).then((tempResp) => {
      if (tempResp && tempResp.res_val) {
        store.commit("setTemplate", tempResp.res_val);
        let connArgs = {};
        connArgs.recordId = res_val.uuid;
        connArgs.type = gameInitType2ConnectTypeMap[gameType];
        console.log("设置模板数据成功 准备连接ws", tempResp.res_val, connArgs);
        store.dispatch("connectGameSocket", connArgs).then((r) => {
          appHelper.setLoading();
          console.log("ws网络连接成功, 准备跳转游戏页面");
          uni.redirectTo({
            url: "game_core/Index", complete: (resp) => {
              console.log("跳转成功");
            }
          });
        }).catch((e) => {
          console.error(e);
          appHelper.setLoading();
        });
      } else {
        appHelper.setLoading();
      }
    });
  }).catch(err => {
    appHelper.setLoading();
  })
};

/**
 * 连接一个类型的socket
 * @param saveSocket 保存socket的方法 可以是store的可以commit方法
 * @param typeId 类型ID
 * @param type 类型
 * @returns {Promise<unknown>}
 */
export function connectWS({ typeId, type }, saveSocket, onMessage, initFunc) {
  return new Promise((resolve, reject) => {
    let token = store.getters.token;
    if (!token) {
      reject("用户未登录");
    }
    // 首次登陆 需要验证token
    let url = gameCoreUrl + "/ae/" + type + "/" + typeId + "/" + token;
    console.log("准备连接WS, url", url);
    let socket = uni.connectSocket({
      url: url,
      // #ifdef MP
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      // #endif
      complete: () => { }
    })

    if (typeof saveSocket === 'string') {
      store.commit(saveSocket, socket);
    } else if (saveSocket instanceof Function) {
      saveSocket(socket);
    }

    socket.onOpen((res) => {
      console.log("ws连接打开...", res);
    });

    socket.onMessage((e) => {
      let data = JSON.parse(e.data);
      if (data.open_status && data.open_status == '200') {
        console.log("ws 连接成功..", socket);
        if (initFunc instanceof Function) {
          console.log("执行初始化方法");
          initFunc(store);
        }
        resolve(data);
        return;
      }
      console.log("收到服务发出的指令...", data);
      if (onMessage instanceof Function) {
        onMessage(data);
      }
    });

    socket.onClose((res) => {
      console.log("ws 连接关闭", res);
      if (typeof saveSocket === 'string') {
        store.commit(saveSocket, null);
      } else if (saveSocket instanceof Function) {
        saveSocket(null);
      }
      reject();
    });
  });
}

/**
 * 开始一局单机游戏
 * @param selectMap
 */
export function startGame(selectMap, type) {
  startGameRecord(selectMap, type);
}

/**
 * 多人游戏开始游戏
 * @param selectMap
 */
export function startRoomGame(selectMap) {
  startGameRecord(selectMap, "room", GetRecordById);
}

/**
 * 从存档开始游戏
 * @param selectMap
 */
export function startRecordGame(selectMap) {
  startGameRecord(selectMap, "encounter", RecordInit);
}

/**
 * 重新连接游戏
 * @param selectMap
 */
export function reRecordGame(selectMap) {
  startGameRecord(selectMap, "room", GetUserRecordInfo);
}