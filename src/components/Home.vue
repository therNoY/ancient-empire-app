<template>
  <!--首页-->

  <div class="home" :style="{ background: vueStyle.background }">
    <img class="logo" src="../assets/images/assist/logo.png" />
    <div class="buttons">
      <!-- #ifdef H5 -->
      <ae-button
        :size="buttonSize"
        class="home_button"
        @click="clickUserInfo"
        >{{ $t("player.title") }}</ae-button
      >
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <ae-button
        :size="buttonSize"
        v-if="haveLogin"
        class="home_button"
        @click="clickUserInfo"
        >{{ $t("player.title") }}</ae-button
      >
      <button
        v-else
        class="ae-button loginButton"
        style="font-size: 0.7rem !important"
        open-type="getPhoneNumber"
        @getphonenumber="onGetPhoneNumber"
      >
        {{ $t("player.title") }}
      </button>
      <!-- #endif -->
      <ae-button
        id="battleButton"
        :size="buttonSize"
        class="home_button"
        @click="showChapter = true"
        >{{ $t("battle.title") }}</ae-button
      >
      <ae-button
        :size="buttonSize"
        class="home_button"
        @click="showEncounter = true"
        >{{ $t("encounter.title") }}</ae-button
      >
      <ae-button
        :size="buttonSize"
        class="home_button"
        @click="showNetGameDialog = true"
        >{{ $t("multiPlayer.title") }}</ae-button
      >
      <ae-button
        :size="buttonSize"
        class="home_button"
        @click="showUserRecord = true"
        >{{ $t("loadGame.title") }}</ae-button
      >
      <ae-button
        :size="buttonSize"
        class="home_button"
        @click="showUnitMange = true"
        >{{ $t("unitManagement.title") }}</ae-button
      >
      <ae-button
        :size="buttonSize"
        class="home_button"
        @click="showTemplateManger = true"
        >{{ $t("templateManagement.title") }}</ae-button
      >
      <ae-button
        :size="buttonSize"
        class="home_button"
        @click="showMapManger = true"
        >{{ $t("mapManagement.title") }}</ae-button
      >
      <ae-button
        :size="buttonSize"
        class="home_button"
        @click="router('mapEdit/0')"
        >{{ $t("mapEdit.title") }}</ae-button
      >
      <ae-button :size="buttonSize" class="home_button" @click="router('Test')"
        >帮助</ae-button
      >
      <ae-button
        :size="buttonSize"
        class="home_button"
        @click="showMoitor = true"
        >监控</ae-button
      >
      <!--  <ae-button :size="buttonSize" class="home_button" @click="router('monitor')">监控</ae-button> -->
    </div>

    <!-- #ifdef H5 -->
    <user-info
      ref="userInfo"
      v-model="userInfoDialog"
      @close="userInfoDialog = false"
    ></user-info>
    <!-- #endif -->
    <!-- #ifdef MP -->
    <wei-xin-user-info
      ref="userInfo"
      v-model="userInfoDialog"
      :register="loginUser"
      @close="userInfoDialog = false"
    ></wei-xin-user-info>
    <!-- #endif -->

    <!--章节选择-->
    <chapter-select ref="chapter" v-model="showChapter"></chapter-select>
    <!--遭遇战-->
    <encounter-start
      ref="encounter"
      v-if="showEncounter"
      v-model="showEncounter"
    ></encounter-start>
    <!-- 多人游戏 房间管理 -->
    <room-index ref="room" v-model="showNetGameDialog"></room-index>
    <!--模板管理-->
    <template-manger
      ref="template"
      v-model="showTemplateManger"
    ></template-manger>
    <!--单位信息管理-->
    <unit-mes-manger ref="unit-mes" v-model="showUnitMange"></unit-mes-manger>
    <!--用户记录-->
    <user-record ref="user-record" v-model="showUserRecord"></user-record>

    <!-- 地图管理 -->
    <map-manger ref="map-manger" v-model="showMapManger"></map-manger>

    <monitor v-model="showMoitor"></monitor>

    <!-- 基础监听类 -->
    <base-lister></base-lister>
  </div>
</template>

<script>
import UserInfo from "./auth/UserInfo.vue";
import WeiXinUserInfo from "./auth/WeiXinUserInfo.vue";
import Monitor from "./Monitor.vue"
import RoomIndex from "./net/room/RoomIndex.vue";
import EncounterStart from "./encounter/EncounterStart.vue";
import UserRecord from "./encounter/UserRecord.vue";
import TemplateManger from "./template_mange/TemplateManger.vue";
import UnitMesManger from "./template_mange/UnitMesManger.vue";
import MapManger from "./map_manger/MapManger.vue";
import MapEdit from "./map_manger/MapEdit.vue";
import ChapterSelect from "./encounter/ChapterSelect.vue";
import BaseLister from "./BaseLister.vue";
import { Login, GetWeiXinPhone, GetCanReConnectRecord } from "../api";
import { reRecordGame } from "../utils/gameHelper";
import {
  getLocalSaveUser,
  setUser,
  setToken,
  removeAllStorage,
} from "../utils/authUtil";
export default {
  components: {
    UserInfo,
    WeiXinUserInfo,
    RoomIndex,
    UserRecord,
    TemplateManger,
    UnitMesManger,
    EncounterStart,
    MapEdit,
    ChapterSelect,
    MapManger,
    BaseLister,
    Monitor
  },
  data() {
    return {
      loginUser: {},
      dialogVisible: false,
      loginVisible: false,
      userInfoDialog: false,
      showNetGameDialog: false,
      showEncounter: false,
      showUserRecord: false,
      showTemplateManger: false,
      showUnitMange: false,
      showMapEdit: false,
      showChapter: false,
      showMapManger: false,
      showMoitor: false,
      buttonSize: 0.8,
      vueStyle: {},
    };
  },
  methods: {
    // H5 用户点击玩家时使用邮箱登录
    clickUserInfo() {
      this.userInfoDialog = true;
    },
    router(path) {
      uni.redirectTo({
        url: path,
        complete: (resp) => {
          console.log("跳转成功", resp);
        },
      });
    },
    // 根据本地保存的信息登录
    loginBySaveInfo() {
      let user = getLocalSaveUser();
      if (user) {
        Login(user, false)
          .then(({ res_val }) => {
            let loginUser = {};
            loginUser.user_name = res_val.user_name;
            loginUser.password = res_val.password;
            loginUser.user_id = res_val.user_id;
            setUser(loginUser);
            let token = res_val.token;
            setToken(token);
            this.reConnectGameRecord();
          })
          .catch((err) => {
            removeAllStorage();
          });
      }
    },
    // 重新连接
    reConnectGameRecord() {
      GetCanReConnectRecord().then(({ res_val }) => {
        if (res_val) {
          this.$appHelper.showTip("有正在进行的游戏,需要重新连接么", () => {
            console.log("准备重连", res_val);
            reRecordGame(res_val);
          });
        }
      });
    },
    // 重试
    onGetPhoneNumber({ detail }) {
      let _this = this;
      if (detail.encryptedData && detail.iv) {
        uni.login({
          provider: "weixin",
          success: function (loginRes) {
            console.log("微信用户登录", loginRes);
            if (loginRes.code) {
              let args = {};
              args.code = loginRes.code;
              args.iv = detail.iv;
              args.encrypted_data = detail.encryptedData;
              uni.getUserInfo({
                provider: "weixin",
                success: function ({ encryptedData, iv }) {
                  args.user_info_encrypted = encryptedData;
                  args.user_info_iv = iv;
                  // 自己处理异常 并且进行一次重试
                  GetWeiXinPhone(args, false).then(({ res_code, res_val }) => {
                    if (res_code === 0) {
                      _this.openAppUserInfo(res_val);
                    }
                  });
                },
                fail: function (error) {
                  console.log(error);
                },
              });
            }
          },
          fail: function (err) {
            console.error("微信用户登录失败", err);
          },
        });
      } else {
        _this.$appHelper.warningMsg("登录后可以体验更多功能哦！");
      }
    },
    /**
     * 小程序或者App用户打开用户信息
     * @param user_name 用户名称
     * @param phone_number 微信用户注册之后默认使用手机号码作为密码
     * @param nick_name 微信昵称
     * @param token 已经存在说明已经注册过
     * @param user_id
     */
    openAppUserInfo({ user_name, phone_number, nick_name, token, user_id }) {
      let loginUser = {};
      if (token) {
        loginUser.user_name = user_name;
        loginUser.password = phone_number;
        loginUser.user_id = user_id;
        setUser(loginUser);
        setToken(token);
        this.$appHelper.successMsg("用户:" + phone_number + "登录成功");
      } else {
        this.loginUser.phone = phone_number;
        this.loginUser.user_name = nick_name;
        this.userInfoDialog = true;
      }
    },
  },
  created() {
    // #ifdef MP-WEIXIN
    wx.uni = uni;
    // #endif

    if (!this.$uni.isH5) {
      this.buttonSize = 0.7;
    }
    this.$appHelper.loadFontFaceFromWeb();
    this.vueStyle.background = this.$s("homeBase.background");
    this.$appHelper.bindPage2Global(this, "HomeVue");
    this.loginBySaveInfo();
  },
  computed: {
    haveLogin() {
      return (
        this.$store.getters.token &&
        this.$store.getters.user &&
        this.$store.getters.user.user_name
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  text-align: center;
  height: 100%;
}

.logo {
  margin: 0 auto;
  height: 15%;
  // #ifdef MP
  width: 20%;
  // #endif
}

.buttons {
  width: 50%;
  height: 80%;
  margin: 0 auto;
  background-color: #242b44;
  border: 2rpx #afb7aa solid;
  box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.692);
}

.home_button {
  float: left;
  margin-left: 20%;
  height: 9%;
  margin-top: 1%;
  width: 60%;
}
.loginButton {
  width: 60%;
  margin-left: 21%;
  margin-top: 1%;
  margin-bottom: 1%;
  height: 8%;
  text-align: center;
  line-height: 1.5;
}
</style>
