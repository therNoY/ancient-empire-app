<template>
  <div>
    <div
      v-if="winCondition"
      class="show-condition-style"
      @click="$appHelper.sendEvent('CLICK_TIP')"
    >
      <div class="show-condition-title">{{ this.$t("e.gameAim") }}</div>
      <div class="show-condition-content">
        {{ message }}
      </div>
    </div>
    <div v-if="dialog" @click="$appHelper.sendEvent('CLICK_TIP')">
      <div class="show-dialog-style">
        <div>
          <img style="width: 80px; height: 80px" v-if="img" :src="img" />
        </div>
        <div class="show-dialog-title">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl } from "../../api/env";
import AeBorder from "../frame/base/AeBorder.vue";
const dialogUrlPath = "/style/download/";
export default {
  components: { AeBorder },
  data() {
    return {
      winCondition: false,
      dialog: false,
      message: "",
      img: "",
    };
  },
  methods: {
    showWinCondition(message) {
      console.log("展示胜利条件");
      this.winCondition = true;
      this.message = message;
    },
    disShowDialog(data) {
      console.log("不展示弹框");
      this.winCondition = false;
      this.dialog = false;
    },
    showDialog(data) {
      console.log("展示对话框", data);
      this.dialog = true;
      try {
        this.img = baseUrl + dialogUrlPath + data.dialog_type + ".png";
      } catch (ignored) {
        this.img = null;
      }

      this.message = data.message;
    },
    gameWin(message) {
      this.$appHelper.showTip(
        message,
        () => {
          this.$router.push("/");
        },
        ["返回主页", "继续游戏"]
      );
    },
    gameOver(message) {
      this.$appHelper.showTip(
        message,
        () => {
          this.$router.push("/");
        },
        ["返回主页"]
      );
    },
  },
  created() {
    this.$eventBus.regist(this, "showWinCondition");
    this.$eventBus.regist(this, "disShowDialog");
    this.$eventBus.regist(this, "gameWin");
    this.$eventBus.regist(this, "gameOver");
    this.$eventBus.regist(this, "showDialog");
  },
  destroyed() {
    this.$eventBus.unRegist(this, "showWinCondition");
    this.$eventBus.unRegist(this, "disShowDialog");
    this.$eventBus.unRegist(this, "gameWin");
    this.$eventBus.unRegist(this, "gameOver");
    this.$eventBus.unRegist(this, "showDialog");
  },
};
</script>

<style  lang="scss" scoped>
.show-condition-style {
  width: 100%;
  height: 25%;
  margin-top: 35%;
  position: absolute;
  background-color: rgb(70, 72, 70);
  color: white;

  .show-condition-title {
    text-align: center;
    border-bottom: 1.5px #c9c9c9 solid;
    padding: 2.5%;
  }
  .show-condition-content {
    padding-top: 6%;
    padding-left: 3%;
  }
  border-top: 2px #c9c9c9 solid;
  border-bottom: 2px #c9c9c9 solid;
}
.show-dialog-style {
  width: 100%;
  height: 30%;
  position: absolute;
  bottom: 0px;
  color: white;
  background-color: rgb(70, 72, 70);
  border-top: 2px #c9c9c9 solid;
  border-bottom: 2px #c9c9c9 solid;
  display: flex;
  align-items: center;
  .show-dialog-title {
    width: 60%;
    padding-top: 1%;
  }
}
</style>