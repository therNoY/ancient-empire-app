<script>
import {initUserSetting} from "./utils/authUtil"
export default {
  methods: {},
  onLaunch: function () {
    console.log("App Launch");
    let resp = uni.getSystemInfoSync();
    console.log("系统信息", resp);
    this.$store.commit("setSystemInfo", resp);
    if (resp.platform === "windows") {
      uni.isH5 = true;
    } else {
      uni.isH5 = false;
    }
    uni.screenHeigh = resp.windowHeight;
    uni.screenWidth = resp.windowWidth;
    // 设置初始化设置
    initUserSetting();
  },
  onReady: function () {},
  onHide: function () {},
};
</script>

<style lang="scss">
/*每个页面公共css */
@import url("/style/font/aeFont.css");
@import url("/style/animate.min.css");

page {
  height: 100%;
  /* #ifdef H5 */
  font-size: 14px;
  /* #endif */
  /* #ifndef H5 */
  font-size: 0.6rem;
  /* #endif*/
}

.disable-cursor {
  cursor: not-allowed;
}
.click-cursor {
  /* #ifdef H5*/
  cursor: pointer;
  /* #endif */
}
.base-animate {
  position: absolute;
  /* #ifdef H5*/
  cursor: pointer;
  /* #endif */
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
input:-webkit-autofill {
  -webkit-text-fill-color: #ffffff !important;
  background-color: transparent;
  background-image: none;
  -webkit-transition: background-color 50000s ease-in-out 0s;
  transition: background-color 50000s ease-in-out 0s;
}
.tabFontStyle {
  /* #ifndef H5 */
  font-size: 0.6rem !important;
  /* #endif */
}
.ae-data-grid {
  width: 100%;
  /* #ifdef H5 */
  max-height: 320px;
  height: 320px;
  /* #endif */
  /* #ifndef H5 */
  max-height: 150px;
  height: 150px;
  /* #endif */
  overflow: auto;
  border-top: 2px #242424 solid;
  border-left: 2px #242424 solid;
  border-right: 2px #aaaaaa solid;
  border-bottom: 2px #aaaaaa solid;

  table {
    /* #ifdef H5 */
    width: 100%;
    font-size: 13px;
    /* #endif */
    /* #ifndef H5 */
    width: 140%;
    /* #endif */
    color: #ffffff;
    border-width: 0;
    border-collapse: collapse;
    background-color: #404040;
    display: flex;
    flex-direction: column;
  }

  .ae-data-grid-title {
    background-color: #39447a;
  }

  table tr {
    /* #ifdef H5 */
    cursor: pointer;
    /* #endif */
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  table td {
    border-width: 0;
    /* #ifdef H5 */
    padding: 8px;
    /* #endif */
    /* #ifndef H5 */
    padding: 4rpx;
    font-size: 0.75rem;
    /* #endif */
    border-style: solid;
    word-wrap: break-word;
    word-break: normal;
  }

  .choose-td {
    background-color: #2b6771;
  }
  .show-unit-detail-img {
    position: relative;
    width: 74px;
    height: 72px;
    background-color: rgb(70, 72, 70);
  }
}
.stand-attach-move-view {
  position: absolute;
  /* #ifdef H5*/
  cursor: pointer;
  /* #endif */
}
.fixed-img-size {
  width: 24px;
  height: 24px;
}
.fixed-img {
  width: 24px;
  height: 24px;
  /* #ifdef H5*/
  cursor: pointer;
  /* #endif */
}
</style>
