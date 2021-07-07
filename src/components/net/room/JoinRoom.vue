<template>
  <ae-base-dialog
    v-model="value"
    v-if="value"
    :width="$uni.isH5 ? 55 : 85"
    showCloseTip
    :title="$t('mpwelcomeJoin', [roomName, roomId])"
    :closeTip="$t('mpleaveRoomWarning')"
  >
    <div class="join-room-container">
      <div class="join-room-main">
        <div class="player_list ae-data-grid">
          <table>
            <tr class="ae-data-grid-title">
              <th>{{ $t("mpteam") }}</th>
              <th>{{ $t("mpalliance") }}</th>
              <th>{{ $t("ptitle") }}</th>
              <th>{{ $t("c.operating") }}</th>
            </tr>
            <tr v-for="(army, index) in canJoinArmy" :key="index">
              <td>
                <img
                  class="img_style"
                  :src="$appHelper.getUnitImg('10', army.color)"
                />
              </td>
              <td>
                <div>{{ army.camp }}</div>
              </td>
              <td>
                <div>
                  {{ army.player_name ? army.player_name : "-" }}
                  <span v-if="roomOwner && army.player == roomOwner"
                    >({{ $t("mphomeOwner") }})</span
                  >
                </div>
              </td>
              <td>
                <ae-button
                  v-if="!army.player"
                  @click="changeCtlArmy(army.color)"
                  >{{ $t("mpjoin") }}
                </ae-button>
                <ae-button
                  v-else-if="
                    army.player &&
                    army.player != $store.getters.user.user_id &&
                    $store.getters.user.user_id == roomOwner
                  "
                  @click="levelCtlArmy(army.color, army.player)"
                  >{{ $t("mpkickOut") }}</ae-button
                >
                <ae-button
                  v-else-if="$store.getters.user.user_id == army.player"
                  @click="levelCtlArmy(army.color, army.player)"
                  >{{ $t("pout") }}</ae-button
                >
              </td>
            </tr>
          </table>
        </div>

        <div class="room_message">
          <game-message
            ref="roomMessage"
            sendEventMethod="sendRoomEvent"
            receiveMesEvent="roomMessage"
            color="rgb(250, 250, 250)"
          ></game-message>
        </div>
      </div>
      <div class="join-room-footer">
        <ae-button-list
          :buttonList="[
            $t('c.preview'),
            $t('mpinvite'),
            $t('c.start'),
          ]"
          size="16px"
          :buttonConfig="{
            '2': {
              display: isRoomOwner,
            },
          }"
          :clickAction="clickAction"
        ></ae-button-list>
      </div>
    </div>

    <map-preview v-model="showPreview" :mapId="mapId" />
  </ae-base-dialog>
</template>

<script>
import { ChangeArmy, LevelCtlArmy, RoomInit } from "@/api";
import dialogShow from "../../../mixins/frame/dialogShow.js";
import MapPreview from "../../frame/MapPreview.vue";
import GameMessage from "../../frame/GameMessage.vue";
import { startRoomGame } from "../../../utils/gameHelper.js";
export default {
  mixins: [dialogShow],
  components: {
    GameMessage,
    MapPreview,
  },
  data() {
    return {
      armyConfigList: null,
      roomOwner: null,
      showPreview: false,
      clickAction: [this.clickShowPreview, this.invate, this.showStartTip],
    };
  },
  props: {
    roomId: {
      type: String,
    },
    mapId: {
      type: String,
    },
    roomName: {
      type: String,
    },
  },
  methods: {
    showStartTip() {
      if (!this.armyConfigList) {
        return;
      }
      let tip;
      if (this.armyConfigList.filter((a) => a.type == "user" && !a.player).length > 0) {
        tip = this.$t("mpreadyBegin");
      } else {
        tip = this.$t("mpreadyStart");
      }
      this.$appHelper.showTip(tip, () => {
        let args = {};
        args.room_id = this.roomId;
        RoomInit(args);
      });
    },

    clickShowPreview() {
      this.showPreview = true;
    },

    invate() {
      let _this = this;
      // #ifndef H5
      this.$uni.setClipboardData({
        data: _this.roomId,
        success: function () {},
      });
      // #endif
      // #ifdef H5
      var input = document.createElement("input");
      input.setAttribute("readonly", "readonly"); // 防止手机上弹出软键盘
      input.setAttribute("value", _this.roomId);
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.$appHelper.successMsg(this.$t("mproomInfoCopy"));
      // #endif
    },

    startGame({ record_id }) {
      console.log("多人游戏开始", record_id);
      setTimeout(() => {
        startRoomGame(record_id);
      }, 500);
    },

    onDialogCreate() {
      console.log("加入房間页面创建");
    },
    onDialogDestroy() {
      console.log("加入房間页面销毁");
      this.$store.dispatch("disconnectRoomSocket");
      this.$eventBus.publish("flushRoom");
    },
    initSetting(roomId) {
      let joinArgs = {};
      joinArgs.roomId = roomId;
      joinArgs.type = "createRoom";
      return this.$store.dispatch("connectRoomSocket", joinArgs);
    },
    changeCtlArmy(color) {
      let args = {};
      args.new_army = color;
      ChangeArmy(args)
        .then((resp) => {
          if (resp && resp.res_code == 0) {
          } else {
            this.$appHelper.infoMsg(this.t("mpjoinFail"));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    levelCtlArmy(color, userId) {
      let args = {};
      args.color = color;
      args.player_id = userId;
      LevelCtlArmy(args)
        .then((resp) => {
        })
        .catch((error) => {
          console.error(error);
        });
    },
    joinRoomSocket(roomId) {
      let joinArgs = {};
      joinArgs.roomId = roomId;
      joinArgs.type = "joinRoom";
      return this.$store.dispatch("connectRoomSocket", joinArgs);
    },
    roomChangeArmy(message) {
      console.log("玩家改变选择单位", message);
      for (let army of this.armyConfigList) {
        if (army.color == message.join_army) {
          army.player = message.user_id;
          army.player_name = message.user_name;
          continue;
        }
        if (army.color == message.level_army) {
          army.player = null;
          army.player_name = null;
        }
      }
      this.armyConfigList = JSON.parse(JSON.stringify(this.armyConfigList));
    },
    changeRoomOwner(message) {
      console.log("房间改变房主", message);
      this.roomOwner = message.user_id;
    },
  },
  created() {
    this.$appHelper.bindPage2Global(this, "JoinRoom");
    this.$eventBus.regist(this, "roomChangeArmy");
    this.$eventBus.regist(this, "changeRoomOwner");
    this.$eventBus.regist(this, "startGame");
  },
  destroyed() {
    this.$eventBus.unRegist(this, "roomChangeArmy");
    this.$eventBus.unRegist(this, "changeRoomOwner");
    this.$eventBus.unRegist(this, "startGame");
  },
  computed: {
    canJoinArmy() {
      if (this.armyConfigList) {
        return this.armyConfigList.filter((a) => a.type == "user");
      }
    },
    isRoomOwner() {
      return (
        this.roomOwner && this.$store.getters.user.user_id == this.roomOwner
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.join-room-container {
  display: flex;
  flex-direction: column;
  .join-room-main {
    margin-top: 2%;
    display: flex;
    flex-direction: row;
    width: 100%;
    .player_list {
      width: 60%;
      /* #ifndef H5 */
      tr {
        width: 70%;
      }
      /* #endif */
      td {
        width: 25%;
      }
      th {
        width: 25%;
      }
    }
    .room_message {
      width: 40%;
    }
  }
}
</style>
