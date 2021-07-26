<template>
  <!--首页-->
  <div class="home" :style="{ background: vueStyle.background }">
    <img class="logo" src="../assets/images/assist/logo.png" />
    <div class="buttons">
      <!-- #ifdef H5 -->
      <button class="ae-button home-button" @click="clickUserInfo">
        {{ $t("p.title") }}
      </button>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <button
        :size="buttonSize"
        v-if="haveLogin"
        class="ae-button home-button"
        @click="clickUserInfo"
      >
        {{ $t("p.title") }}
      </button>
      <button
        v-else
        class="ae-button home-button"
        open-type="getPhoneNumber"
        @getphonenumber="onGetPhoneNumber"
      >
        {{ $t("p.title") }}
      </button>
      <!-- #endif -->
      <button class="ae-button home-button" @click="showChapter = true">
        {{ $t("b.title") }}
      </button>
      <button class="ae-button home-button" @click="showEncounter = true">
        {{ $t("e.title") }}
      </button>
      <button class="ae-button home-button" @click="showNetGameDialog = true">
        {{ $t("mp.title") }}
      </button>
      <button class="ae-button home-button" @click="showUserRecord = true">
        {{ $t("lg.title") }}
      </button>
      <button class="ae-button home-button" @click="showUnitMange = true">
        {{ $t("um.title") }}
      </button>
      <button class="ae-button home-button" @click="showTemplateManger = true">
        {{ $t("tm.title") }}
      </button>
      <button class="ae-button home-button" @click="showMapManger = true">
        {{ $t("mm.title") }}
      </button>
      <button
        class="ae-button home-button"
        @click="router('map_manger/MapEdit?mapId=0')"
      >
        {{ $t("me.title") }}
      </button>
      <button
        :size="buttonSize"
        class="ae-button home-button"
        @click="showSetting = true"
      >
        {{ $t("s.title") }}
      </button>
      <!-- #ifdef H5 -->
      <button
        v-if="loginUser && loginUser.user_name == 'admin'"
        :size="buttonSize"
        class="ae-button home-button"
        @click="showMoitor = true"
      >
        监控
      </button>
      <!-- #endif -->
      <div style="color: yellow" class="home-button">0.1</div>
    </div>

    <!-- #ifdef H5 -->
    <user-info
      ref="userInfo"
      v-model="userInfoDialog"
      @close="userInfoDialog = false"
    ></user-info>
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <wei-xin-user-info
      ref="userInfo"
      v-model="userInfoDialog"
      :register="loginUser"
      @close="userInfoDialog = false"
      @logout="weixinLogin"
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
    <setting v-model="showSetting"></setting>
    <!-- #ifdef H5 -->
    <monitor v-model="showMoitor"></monitor>
    <!-- #endif -->
    <!-- 基础监听类 -->
    <base-lister></base-lister>
  </div>
</template>

<script>
// #ifdef H5
import UserInfo from "./auth/UserInfo.vue";
import Monitor from "./Monitor.vue";
// #endif
import WeiXinUserInfo from "./auth/WeiXinUserInfo.vue";
import RoomIndex from "./net/room/RoomIndex.vue";
import EncounterStart from "./encounter/EncounterStart.vue";
import UserRecord from "./encounter/UserRecord.vue";
import TemplateManger from "./template_mange/TemplateManger.vue";
import UnitMesManger from "./template_mange/UnitMesManger.vue";
import MapManger from "./map_manger/MapManger.vue";
import ChapterSelect from "./encounter/ChapterSelect.vue";
import BaseLister from "./BaseLister.vue";
import Setting from "./setting/Setting.vue";
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
    // #ifdef H5
    UserInfo,
    Monitor,
    // #endif
    WeiXinUserInfo,
    RoomIndex,
    UserRecord,
    TemplateManger,
    UnitMesManger,
    EncounterStart,
    ChapterSelect,
    MapManger,
    BaseLister,
    Setting,
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
      showSetting: false,
      buttonSize: 0.8,
      vueStyle: {},
      loginCode: null,
    };
  },
  methods: {
    // H5 用户点击玩家时使用邮箱登录
    clickUserInfo() {
      this.userInfoDialog = true;
    },
    router(path) {
      if (this.$store.getters.token) {
        uni.redirectTo({
          url: path,
          complete: (resp) => {
            console.log("跳转成功", resp);
          },
        });
      } else {
        this.$appHelper.warningMsg(this.$t("p.loginIsWill"));
      }
    },
    // 根据本地保存的信息登录
    loginBySaveInfo() {
      let user = getLocalSaveUser();
      if (user != null) {
        // #ifndef H5
        user.from_app = '1'
        // #endif
        Login(user, false).then(({ res_val }) => {
            let loginUser = {};
            loginUser.user_name = res_val.user_name;
            loginUser.password = res_val.password;
            loginUser.user_id = res_val.user_id;
            setUser(loginUser);
            let token = res_val.token;
            setToken(token);
            this.loginUser = loginUser;
            this.reConnectGameRecord();
          }).catch((err) => {
            console.error(err);
            this.$nextTick(() => {
              this.$appHelper.warningMsg(this.$t("p.loginIsWill"));
            });
            removeAllStorage();
          });
      } else {
        this.$nextTick(() => {
          this.$appHelper.warningMsg(this.$t("p.loginIsWill"));
        });
      }
      // #ifndef H5
      this.weixinLogin();
      // #endif
    },
    // 重新连接
    reConnectGameRecord() {
      GetCanReConnectRecord().then(({ res_val }) => {
        if (res_val) {
          this.$appHelper.showTip(this.$t("e.reConnGameTip"), () => {
            reRecordGame(res_val);
          });
        }
      });
    },
    weixinLogin() {
      let _this = this;
      uni.login({
        provider: "weixin",
        success: function (loginRes) {
          console.log("微信用户登录", loginRes);
          _this.loginCode = loginRes.code;
        },
        fail: function (err) {
          console.error(err);
        },
      });
    },
    onGetPhoneNumber({ detail }) {
      let _this = this;
      if (detail.encryptedData && detail.iv) {
        this.$appHelper.setLoading(true);
        uni.getUserInfo({
          provider: "weixin",
          success: function ({ encryptedData, iv }) {
            let args = {};
            args.user_info_encrypted = encryptedData;
            args.user_info_iv = iv;
            if (_this.loginCode != null) {
              args.code = _this.loginCode;
              args.iv = detail.iv;
              args.encrypted_data = detail.encryptedData;
              GetWeiXinPhone(args)
                .then(({ res_code, res_val }) => {
                  if (res_code === 0) {
                    _this.openAppUserInfo(res_val);
                    _this.$appHelper.setLoading(false);
                  }
                })
                .catch((err) => {
                  _this.$appHelper.setLoading(false);
                });
            } else {
              _this.$appHelper.setLoading(false);
              _this.$appHelper.warningMsg("网络异常请重新登录");
            }
          },
          fail: function (error) {
            console.log(error);
            _this.$appHelper.setLoading(false);
          },
        });
      } else {
        _this.$appHelper.warningMsg(_this.$t("p.loginIsWill"));
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
        loginUser.user_id = user_id;
        setUser(loginUser);
        setToken(token);
        this.loginUser = loginUser;
        this.$appHelper.successMsg(user_name + this.$t("p.loginOk"));
      } else {
        this.loginUser.phone = phone_number;
        this.loginUser.user_name = nick_name;
        this.userInfoDialog = true;
      }
    },
  },
  created() {
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
  // #ifndef H5
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

.home-button {
  float: left;
  margin-left: 20%;
  height: 6.8%;
  margin-top: 1%;
  margin-bottom: 1%;
  width: 60%;
  text-align: center;
  line-height: 1;
  padding-top: 1%;
  padding-bottom: 1%;
  /* #ifndef H5*/
  font-size: 0.7rem !important;
  /* #endif */
}
</style>
