<!--基础弹框-->
<template>
  <div
    class="ae-base-dialog-container"
    :style="{
      display: vueStyle.dialogDisplay,
      backgroundColor: vueStyle.dialogBackgroundColor,
      left: vueStyle.dialogLeft,
      top: vueStyle.dialogTop,
      width: vueStyle.dialogWidth,
    }"
    v-if="value"
  >
    <ae-border
      :noBorder="fullScreen"
      :style="{
        width: vueStyle.popupWidth,
        height: vueStyle.popupHeight,
        backgroundColor: vueStyle.mainBackgroundColor,
      }"
    >
      <div
        class="ae-base-dialog-popup"
        :class="[fullScreen ? 'fullScreenStyle' : 'h5Style']"
        :style="{ width: vueStyle.popupWidth }"
      >
        <div
          class="ae-base-dialog-content"
          :style="{ width: vueStyle.contentWidth }"
        >
          <div class="ae-base-dialog-popup-header" v-if="!fullScreen">
            <span>{{ title }}</span>
            <!-- #ifdef H5 -->
            <uni-icons
              type="closeempty"
              color="#b0b8ac"
              class="btn-close"
              :size="closeButtonSiz"
              @click="close"
            />
            <!-- #endif -->
          </div>
          <div
            class="ae-base-dialog-popup-main"
            :style="{ padding: mainPadding }"
          >
            <slot />
          </div>
          <div class="ae-base-dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </ae-border>

    <!-- #ifndef H5 -->
    <img
      class="app-close-button click-cursor"
      @click="close"
      src="../../../assets/images/assist/return1.png"
    />
    <!-- #endif -->
    <ae-tip
      v-show="showTip"
      v-model="showTip"
      :closeTip="closeTip"
      @ok="closeOk"
    ></ae-tip>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    // 弹出框宽度
    width: {
      default: "42",
    },
    // 是否全屏 只有是不是H5的时候有校
    setFullScreen: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    closeTip: {
      type: String,
      default() {
        return uni.$t("common.sureClose");
      },
    },
    showCloseTip: {
      type: Boolean,
      default: false,
    },
    // inlineDialog为true的时候有用
    top: {
      type: Number,
      default: 10,
    },
    // 是否是inLine布局 默认flex布局
    inlineDialog: {
      type: Boolean,
      default: false,
    },
    mainPadding: {
      type: String,
      default: "2%",
    },
  },
  data() {
    return {
      showTip: false,
      fullScreen: false,
      closeButtonSiz: 15,
      vueStyle: {
        popupWidth: null,
        dialogDisplay: "inline",
        dialogBackgroundColor: "rgba(167, 167, 167, 0)",
        mainBackgroundColor: "#242a43",
        dialogLeft: null,
        dialogTop: null,
        borderWidth: null,
        contentWidth: null,
        dialogWidth:'100%',
      },
    };
  },
  methods: {
    close() {
      if (this.showCloseTip) {
        this.showTip = true;
      } else {
        this.$emit("input", false);
        this.$emit("close");
      }
    },
    closeOk() {
      this.$emit("input", false);
      this.$emit("close");
    },
  },
  computed: {},
  mounted() {
    this.$appHelper.bindPage2Global(this, "activeBaseDialog");
  },
  created() {
    if ((this.width + "").indexOf("px") > 0) {
      this.vueStyle.popupWidth = this.width;
    } else if (!this.inlineDialog) {
      this.vueStyle.popupWidth = this.width + "%";
    } else {
      this.vueStyle.popupWidth = this.width * 1.3 + "%";
    }

    if (!this.inlineDialog) {
      this.vueStyle.dialogDisplay = "flex";
      this.vueStyle.dialogBackgroundColor = "rgba(167, 167, 167, 0.3)";
      this.vueStyle.dialogLeft = "0";
      this.vueStyle.dialogTop = "0";
    } else {
      this.vueStyle.dialogTop = this.top + "%";
      this.vueStyle.dialogLeft = (100 - this.width) / 2 + "%";
      // #ifndef H5
      this.vueStyle.dialogWidth = this.width + "%";
      // #endif
    }
    // #ifdef H5
    this.closeButtonSiz = 25;
    // #endif
  },
  watch: {
    value(v) {
      if (v) {
        this.$emit("open");
        // 全屏
        if (this.setFullScreen && !uni.isH5) {
          this.vueStyle.popupWidth = "100%";
          this.vueStyle.popupHeight = "100%";
          this.fullScreen = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scope>
.ae-base-dialog-container {
  position: fixed;
  display: flex;
  bottom: 0;
  right: 0;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.ae-base-dialog-popup {
  background: #242a43;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}

.fullScreenStyle {
  height: 100%;
  padding: 1%;
}

.h5Style {
  /*padding-left: 1%;*/
  /*padding-right: 1%;*/
  /*padding-bottom: 1%;*/
  /*overflow-y: 10%;*/
  /*border: 2px #afb7aa solid;*/
  /*box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.692);*/
}

.ae-base-dialog-popup-main {
}

.ae-base-dialog-content {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.ae-base-dialog-popup-header {
  color: #b0b8ac;
  justify-content: space-between;
  /*#ifdef H5*/
  margin-bottom: 15px;
  /*#endif*/
  /*#ifdef MP-WEIXIN*/
  margin-bottom: 5 rpx;
  /*#endif*/

  span {
    /*#ifdef H5*/
    font-size: 18px;
    /*#endif*/
    /*#ifdef MP-WEIXIN*/
    font-size: 0.7rem;
    /*#endif*/
  }
}

.ae-base-dialog-footer {
}

.btn-close {
  cursor: pointer;
  float: right;
  margin-right: 2%;
}

.ae-close-tip {
  font-size: 16px;
  color: rgb(195, 195, 195);
  margin-top: 8%;
  margin-bottom: 8%;
}

.app-close-button {
  position: absolute;
  width: 32px;
  height: 32px;
  right: 3px;
  bottom: 3px;
}
</style>
