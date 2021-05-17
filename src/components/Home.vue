<template>
  <!--首页-->
  <div class="home" :style="{'background':vueStyle.background}">
    <img class="logo" src="../assets/images/assist/logo.png" alt/>
    <div class="buttons">
      <ae-button :width="60" :size="vueStyle.fontSize" :height="20" class="home_button" @onClick="clickUserInfo">
        {{$t('common.player')}}
      </ae-button>
      <ae-button :width="60" class="home_button" @click="showChapter = true">{{$t('common.battle')}}</ae-button>
      <ae-button :width="60" class="home_button" @click="showEncounter = true">{{$t('common.encounter')}}</ae-button>
      <ae-button :width="60" class="home_button" @click="showNetGameDialog = true">
        {{$t('common.multiPlayerGame')}}
      </ae-button>
      <ae-button :width="60" class="home_button" @click="showUserRecord = true">
        {{$t('common.loadGame')}}
      </ae-button>
      <!--  <ae-button :width="60" class="home_button" @click="router('setting')">我的设置</ae-button> -->
      <ae-button :width="60" class="home_button" @click="showUnitMange = true">
        {{$t('common.unitManagement')}}
      </ae-button>
      <ae-button :width="60" class="home_button" @click="showTemplatManger = true">
        模板管理
      </ae-button>
      <ae-button :width="60" class="home_button" @click="showMapManger = true">
        地图管理
      </ae-button>
      <ae-button :width="60" class="home_button" @click="router('mapEdit/0')">编辑地图</ae-button>
      <!--  <ae-button :width="60" class="home_button" @click="router('demo')">帮助</ae-button>   -->
      <!--  <ae-button :width="60" class="home_button" @click="router('monitor')">监控</ae-button> -->
    </div>

    <user-info
        v-model="userInfoDialog"
        :user="loginUser"
        @logout="logout"
        :isDisable="true"
        @close="userInfoDialog = false"
    ></user-info>
    <!-- 多人游戏 房间管理 -->
    <room-index v-model="showNetGameDialog"></room-index>
    <!--遭遇战-->
    <encounter v-model="showEncounter"></encounter>
    <!--模板管理-->
    <template-manger v-model="showTemplatManger"></template-manger>
    <!--单位信息管理-->
    <unit-mes-manger v-model="showUnitMange"></unit-mes-manger>
    <!--用户记录-->
    <user-record v-model="showUserRecord"></user-record>

    <!--章节选择-->
    <chapter-select v-model="showChapter"></chapter-select>

    <map-manger v-model="showMapManger"></map-manger>
  </div>
</template>

<script>
  import UserInfo from "./UserInfo.vue";
  import RoomIndex from "./net/room/RoomIndex.vue";
  import Encounter from "./encounter/Encounter.vue";
  import UserRecord from "./encounter/UserRecord.vue";
  import TemplateManger from "./template_mange/TemplateManger.vue";
  import UnitMesManger from "./template_mange/UnitMesManger.vue";
  import MapManger from "./map_manger/MapManger.vue";
  import MapEdit from "./map_manger/MapEdit.vue";
  import ChapterSelect from "./encounter/ChapterSelect.vue";

  export default {
    components: {
      UserInfo,
      RoomIndex,
      Encounter,
      UserRecord,
      TemplateManger,
      UnitMesManger,
      MapEdit,
      ChapterSelect,
      MapManger,
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
        showTemplatManger: false,
        showUnitMange: false,
        showMapEdit: false,
        showChapter: false,
        showMapManger: false,

        vueStyle: {
          fontSize: 0.75,
        }
      };
    },
    methods: {
      // 点击玩家时
      clickUserInfo() {
        this.userInfoDialog = !this.userInfoDialog;
      },
      logout() {
        this.userInfoDialog = false;
        this.loginUser = {};
      },
      router(path) {
        this.$router.push("/" + path);
      },
    },
    created() {
      // #ifdef H5
      window.HomeVue = this;
      // #endif
      // #ifdef MP-WEIXIN
      wx.HomeVue = this;
      // #endif
      uni.getSystemInfo().then(resp => {
        console.log("系统信息", resp);
      })
      this.vueStyle.background = this.$s('homeBase.background');
      // #ifdef MP-WEIXIN
      this.vueStyle.fontSize = 0.35
      // #endif
    },
    computed: {
      homeStyle() {
        return this.$s('homeBase');
      }
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
    // #ifdef MP-WEIXIN
    width: 25%;
    // #endif
  }

  .buttons {
    width: 50%;
    height: 75%;
    margin: 0 auto;
    background-color: #242b44;
    border: 2px #afb7aa solid;
    box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.692);
  }

  .home_button {
    float: left;
    width: 100%;
    margin-left: 10%;
    // #ifdef MP-WEIXIN
    margin-top: 1%;
    // #endif
  }
</style>
