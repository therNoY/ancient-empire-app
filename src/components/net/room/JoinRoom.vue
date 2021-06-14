<template>
  <ae-base-dialog
    v-model="value"
    :width="width"
    showCloseTip
    :title="$t('multiPlayer.welcomeJoin', roomName, roomId)"
    :closeTip="$t('multiPlayer.leaveRoomWarning')"
  >
    <div class="join-room-container">
      <div class="join-room-main">
        <div class="player_list ae-data-grid">
          <table>
            <tr>
              <th>{{ $t("multiPlayer.team") }}</th>
              <th>{{ $t("multiPlayer.alliance") }}</th>
              <th>{{ $t("player.title") }}</th>
              <th>{{ $t("common.operating") }}</th>
            </tr>
            <tr v-for="(army, index) in canJoinArmy" :key="index">
              <td>
                <img :src="$appHelper.getUnitImg('10', army.color)" />
              </td>
              <td>
                <div style="color: rgb(255, 255, 255)">{{ army.camp }}</div>
              </td>
              <td>
                <div style="color: rgb(255, 255, 255); font-size: 14px">
                  {{ army.player_name }}
                  <span
                    style="color: rgb(255, 255, 255); font-size: 13px"
                    v-if="roomOwner && army.player == roomOwner"
                    >({{ $t("multiPlayer.homeOwner") }})</span
                  >
                </div>
              </td>
              <td>
                <ae-button
                  :width="80"
                  v-if="!army.player"
                  @click="changeCtlArmy(army.color)"
                  >{{ $t("multiPlayer.join") }}
                </ae-button>
                <ae-button
                  v-else-if="
                    army.player &&
                    army.player != $store.getters.user.user_id &&
                    $store.getters.user.user_id == roomOwner
                  "
                  @click="levelCtlArmy(army.color, army.player)"
                  >{{ $t("multiPlayer.kickOut") }}</ae-button
                >
                <ae-button
                  v-else-if="$store.getters.user.user_id == army.player"
                  @click="levelCtlArmy(army.color, army.player)"
                  >{{ $t("player.out") }}</ae-button
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
            :height="320"
          ></game-message>
        </div>
      </div>

      <div class="join-room-footer">
        <!-- <ae-button @click="showPreview = true">{{
          $t("common.preview")
        }}</ae-button>
        <ae-button>{{ $t("multiPlayer.invite") }}</ae-button>
        <ae-button
          v-show="roomOwner && $store.getters.user.user_id === roomOwner"
          @click="showStartTip"
          >{{ $t("common.start") }}}
        </ae-button> -->
        <ae-button-list
          :buttonList="[
            $t('common.preview'),
            $t('multiPlayer.invite'),
            $t('common.start'),
          ]"
          size="16px"
          :buttonConfig="{
            '2': {
              display: roomOwner && $store.getters.user.user_id === roomOwner,
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
      clickAction: [
        () => {
          this.showPreview = true;
        },
        () => {},
        this.showStartTip,
      ],
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
    width: {
      type: Number,
      default: 40,
    },
  },
  methods: {
    showStartTip() {
      let tip;
      if (
        this.armyConfigList &&
        this.armyConfigList.filter((a) => a.type == "user" && !a.play_id)
          .length > 0
      ) {
        tip = this.$t("multiPlayer.readyBegin");
      } else {
        tip = this.$t("multiPlayer.readyStart");
      }
      this.$appHelper.showTip(tip, () => {
        let args = {};
        args.room_id = this.roomId;
        RoomInit(args);
      });
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
      this.$store.dispatch("disconnectRoomScoket");
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
      this.$appHelper.setLoading();
      ChangeArmy(args)
        .then((resp) => {
          this.$appHelper.setLoading();
          if (resp && resp.res_code == 0) {
          } else {
            this.$appHelper.infoMsg(this.t("multiPlayer.joinFail"));
          }
        })
        .catch((error) => {
          console.error(error);
          this.$appHelper.setLoading();
        });
    },
    levelCtlArmy(color, userId) {
      let args = {};
      args.color = color;
      args.player_id = userId;
      this.$appHelper.setLoading();
      LevelCtlArmy(args)
        .then((resp) => {
          this.$appHelper.setLoading();
        })
        .catch((error) => {
          console.error(error);
          this.$appHelper.setLoading();
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
    height: 320px;
    width: 100%;
    .player_list {
      width: 60%;
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
