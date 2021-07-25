<template>
  <div>
    <ae-complex-dialog
        ref="mainDiaglog"
        v-model="showModel"
        showSearch
        :title="$t('mp.romeHome')"
        :titleButtons="titleButtonList"
        :footerButtons="buttonList"
        :initQueryDataGrid="queryDataFunction"
        :showItem="showItem"
        :showTitle="showTitle"
        :width="$uni.isH5 ? 42 : 65"
        page
    >
    </ae-complex-dialog>

    <ae-complex-dialog
        ref="addNewRoomDialog"
        v-model="addNewDialogShowModel"
        :title="$t('mp.addNewRome')"
        :width="$uni.isH5 ? 35 : 55"
        :formConfig="addNewRoomFormConfig"
        :footerButtons="createRoomButtons"
    ></ae-complex-dialog>

    <join-room
        ref="joinRoom"
        v-model="showJoinRoom"
        :roomName="joinRoomName"
        :roomId="joinRoomId"
        :mapId="joinMapId"
        :roomOwnerUser="roomOwner"
        :armyConfigs="armyConfigList"
    ></join-room>

    <map-preview
        v-model="previewVisible"
        @close="closePreview"
        :mapId="previewMapId"
        :armyConfigList="armyConfigList"
    ></map-preview>
  </div>
</template>

<script>
  import {GetRoomListByPage, PlayerJoinRoom, CreateRoom} from "@/api";
  import JoinRoom from "./JoinRoom.vue";
  import MapPreview from "../../frame/MapPreview.vue";
  import dialogShow from "../../../mixins/frame/dialogShow.js";

  export default {
    mixins: [dialogShow],
    components: {
      JoinRoom,
      MapPreview,
    },
    props: {},
    data() {
      return {
        willChange: false,
        canJoinRoom: {},
        queryDataFunction: (args)=> GetRoomListByPage(args),
        buttonList: [
          {name: this.$t('mp.join'), action: this.clickJoinGameButton},
          {name: this.$t('c.preview'), action: this.clickPreviewButton},
        ],
        titleButtonList: [
          {name: this.$t('c.add'), action: this.clickAddbutton},
          {name: this.$t('c.flush'), action: this.flushRoom},
        ],
        showItem: ["room_id", "room_name", "creat_time_show", "ready"],
        showTitle: [this.$t('mp.homeId'), this.$t('mp.homeName'), this.$t("c.createTime"), this.$t("p.title")],
        createRoomButtons: [
          {name: this.$t('c.create'), action: this.clickCreateRoom},
          {name: this.$t('c.cancel'), action: this.clickCancelCreateRoom},
        ],
        addNewDialogShowModel: false,
        addNewRoomFormConfig: [
          {
            type: "input",
            key: "room_name",
            des: this.$t('mp.homeName'),
            default: this.initRomeName(),
          },
          {
            type: "switchSelect",
            key: "game_type",
            des: this.$t("mp.romeType"),
            default: "1",
            items: [
              {key: "1", value: this.$t("mp.public")},
              {key: "2", value: this.$t("mp.private")},
            ],
          },
          {
            type: "switchSelect",
            key: "game_model",
            des: this.$t("mp.gameModel"),
            default: "1",
            items: [
              {key: "1", value: this.$t("mp.unlimited")},
              {key: "2", value: this.$t("mp.timeout")},
            ],
          },
          {
            type: "switchSelect",
            key: "round_time",
            des: this.$t("mp.roundLimit"),
            default: "2",
            items: [
              {key: "1", value: this.$t("c.minute", 1)},
              {key: "2", value: this.$t("c.minute", 2)},
              {key: "3", value: this.$t("c.minute", 3)},
              {key: "5", value: this.$t("c.minute", 5)},
              {key: "10", value: this.$t("c.minute", 10)},
            ],
          },
          {
            type: "userMapSelect",
            key: "init_map",
            des: this.$t("mp.chooseMap"),
          },
        ],
        joinMapId: "",
        joinRoomId: null,
        joinRoomName: "",
        showJoinRoom: false,
        previewMapId: null,
        previewVisible: false,
        armyConfigList: [],
        roomOwner: "",
      };
    },
    methods: {
      onDialogCreate() {
        console.log("页面创建");
        this.addNewRoomFormConfig[0].default = this.initRomeName();
        this.$eventBus.regist(this, "flushRoom", "flushRoom");
      },
      closePreview() {
      },
      initRomeName(){
        return this.$store.getters.user.user_name + this.$t("mp.whoRome");
      },
      onDialogDestroy() {
        console.log("页面销毁");
        this.$eventBus.unRegist(this, "flushRoom");
      },
      clickAddbutton() {
        console.log("点击新增");
        this.addNewDialogShowModel = true;
      },
      clickJoinGameButton() {
        let selectMap = this.$refs.mainDiaglog.getDataGridSelect();

        let joinRoomSocket = this.$refs.joinRoom.joinRoomSocket(selectMap.room_id);
        joinRoomSocket.then(({message}) => {
          this.joinMapId = selectMap.map_id;
          this.joinRoomId = selectMap.room_id;
          this.joinRoomName = selectMap.room_name;
          this.armyConfigList = JSON.parse(message);
          this.roomOwner = selectMap.room_owner;
          this.setJoinRoomShow();
          this.showJoinRoom = true;
          this.$appHelper.infoMsg(this.$t("mp.joinSuccess"));
        }).catch((error) => {
          console.error(error);
          this.$refs.mainDiaglog.flushData();
        });
      },
      clickPreviewButton() {
        let selectMap = this.$refs.mainDiaglog.getDataGridSelect();
        this.previewMapId = selectMap.map_id;
        let mapConfig = JSON.parse(selectMap.map_config);
        this.armyConfigList = mapConfig.armyList;
        this.previewVisible = true;
      },
      setJoinRoomShow() {
        this.$refs.joinRoom.armyConfigList = JSON.parse(JSON.stringify(this.armyConfigList));
        this.$refs.joinRoom.roomOwner = this.roomOwner;
      },
      clickCreateRoom() {
        console.log("创建房间");
        let formData = this.$refs.addNewRoomDialog.getFormData();
        console.log(formData);
        if (!formData) {
          this.$appHelper.infoMsg(this.$t("mp.roomDataLost"));
          return;
        }

        if (!formData.room_name) {
          this.$appHelper.infoMsg(this.$t("mp.roomNameLost"));
          return;
        }

        if (!formData.init_map) {
          this.$appHelper.infoMsg(this.$t("mp.gameMapLostTip"));
          return;
        }
        console.log(this.$refs.addNewRoomDialog.getFormData());
        let args = formData;
        CreateRoom(args).then(({res_val}) => {
          this.addNewDialogShowModel = false;
          this.joinMapId = this.$refs.addNewRoomDialog.getFormData().init_map.map_id;
          this.joinRoomId = res_val.room_id;
          this.joinRoomName = res_val.room_name;
          this.roomOwner = this.$store.getters.user.user_id;
          this.armyConfigList = JSON.parse(res_val.map_config).armyList;
          this.setJoinRoomShow();
          let initSetting = this.$refs.joinRoom.initSetting(
              res_val.room_id
          );
          initSetting.then((joinRoomPromise) => {
              this.showJoinRoom = true;
              console.log("joinRoomPromise result >>>", res_val, joinRoomPromise);
              this.$appHelper.infoMsg(this.$t("mp.joinSuccess"));
            }).catch((error) => {
              this.showJoinRoom = false;
            });
        })
      },
      clickCancelCreateRoom() {
        console.log("取消创建房间");
        this.addNewDialogShowModel = false;
      },
      flushRoom() {
        if (this.$refs.mainDiaglog) {
          this.$refs.mainDiaglog.flushData();
        }
      }
    },
    created() {
    },
  };
</script>

<style scoped>
</style>
