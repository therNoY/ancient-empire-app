import { connectWS } from "../../utils/gameHelper.js"
import commendDispatcher from '../../manger/commandDispather.js'
import chapterDialogDispather from '../../manger/chapterDialogDispather.js'
import { SendMessage } from "../../api";

// 前端游戏的核心控制器
const gameCore = {
    state: {
        // 连接的socket
        socket: null,
        // 当前连接的游戏信息
        game: {},
        // 当前游戏的模板
        template: {},
        // 单位等级信息
        levelInfo: {},
        // 地图状态是1的时候不能点击其他的
        mapState: "0",
        // 是否展示购买单位弹框
        buyUnitDialog: false,

    },

    mutations: {
        setGameSocket(state, ws) {
            state.socket = ws;
        },
        setGame(state, game) {
            state.game = game;
        },
        setTemplate(state, template) {
            state.template = template;
        },
        setMapState(state, mapState) {
            state.mapState = mapState;
        },
        setUnitLevelInfo(state, levelInfo) {
            state.levelInfo = levelInfo;
        },
        removeTomb(state, removeTomb) {
            for (let i = 0; i < state.game.tomb_list.length; i++) {
                const tomb = state.game.tomb_list[i];
                if (tomb.row == removeTomb.row && tomb.column == removeTomb.column) {
                    state.game.tomb_list.splice(i, 1);
                    break;
                }
            }
        },
        setBuyUnitDialog(state, dialog) {
            state.buyUnitDialog = dialog;
        },
        addUnit(state, addUnit) {
            console.log("准备添加单位", addUnit);
            state.game.army_list[addUnit.army_index].units.push(addUnit.unit);
        },
        changeRegion(state, changeRegion) {
            console.log("准备改变地形", changeRegion);
            state.game.game_map.regions.splice(changeRegion.region_index, 1, changeRegion.region)
        },
    },

    actions: {
        // 连接一局游戏的socket 使用websocket
        connectGameSocket(store, { recordId, type }) {
            // 收到游戏事件回调
            let onGetGameMessage = function (data) {
                console.log("收到游戏事件消息", data);
                if (data instanceof Array && data.length > 0) {
                    commendDispatcher.dispatchOrder(data);
                } else {
                    if (data.game_commend) {
                        commendDispatcher.dispatch(data);
                    } else if (data.dialog_type) {
                        chapterDialogDispather.dispatch(data);
                    }
                }
            };

            // 初始化方法
            let initFunction = function (store) {
                store.commit("setAttachArea", []);
                store.commit("setAttachPoint", {});
                store.commit("setMoveArea", []);
                store.commit("setMoveLine", []);
                store.commit("setAction", []);
            };

            let onClose = function () {
                uni.redirectTo({
                    url: "/components/Home",
                    complete: (resp) => {
                        console.log(resp);
                    },
                });
            };

            let conInfo = {};
            conInfo.typeId = recordId;
            conInfo.type = type;
            return connectWS(conInfo, "setGameSocket", onGetGameMessage, initFunction, onClose);
        },

        sendGameMessage({ state }, { message }) {
            let sendMes = {};
            sendMes.message = message;
            sendMes.send_type = "SEND_TO_GROUP";
            SendMessage(sendMes);
        },

        levelGame({ state }) {
            if (state.socket) {
                state.socket.close();
            }
            this.commit("setGameSocket", null);
        },

        // 发送 事件
        sendEvent({ state }, mes) {
            console.log("发送mes:", mes);
            state.socket.send({
                data: JSON.stringify(mes),
                success(res) { },
                fail(err) { }
            })
        },

        // 测试是否连接
        testGameConnect({ state }) {
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
            if (state.socket && state.socket.readyState == 1) {
                return true;
            }
            return false;
        }

    }
}

export default gameCore;