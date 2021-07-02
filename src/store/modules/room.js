
import { connectWS } from "../../utils/gameHelper.js"
import dispatcher from '../../manger/roomDispacther.js'


// 前端游戏的核心控制器
const roomNet = {
  state: {
    // 连接的socket
    roomSocket: null,
    room: {},
    roomMessage: {},
  },

  mutations: {
    setRoomSocket(state, ws) {
      state.roomSocket = ws;
    },
    addRoomMessage(state, message) {
      state.roomMessage = message;
    }
  },

  actions: {
    // 连接一局游戏的socket 使用websocket
    connectRoomSocket(store, { roomId, type }) {
      let conInfo = {};
      conInfo.typeId = roomId;
      conInfo.type = type;
      return connectWS(conInfo, "setRoomSocket", (data) => dispatcher.dispath(data));
    },

    // 发送 事件
    sendRoomEvent({ state }, mes) {
      console.log("发送mes:", mes);
      state.roomSocket.send({
        data: JSON.stringify(mes),
        success(res) {
        },
        fail(err) {
        }
      })
    },

    disconnectRoomSocket({ state }) {
      if (state.roomSocket && state.roomSocket.close) {
        state.roomSocket.close();
      }
    },

    // 测试是否连接
    testRoomConnect({ state }) {
      /**
       * ebSocket的 readyState 属性用来定义连接状态，该属性的值有下面几种：
        * 0 ：对应常量CONNECTING (numeric value 0)，
        正在建立连接连接，还没有完成。The connection has not yet been established.
        1 ：对应常量OPEN (numeric value 1)，
        连接成功建立，可以进行通信。The WebSocket connection is established and communication is possible.
        2 ：对应常量CLOSING (numeric value 2)
        连接正在进行关闭握手，即将关闭。The connection is going through the closing handshake.
        3 : 对应常量CLOSED (numeric value 3)
        连接已经关闭或者根本没有建立。The connection has been closed or could not be opened.
       */
      return state.roomSocket.readyState == 1;
    }

  }
}

export default roomNet;
