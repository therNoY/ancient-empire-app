<!--发送接受游戏消息-->
<template>
  <div class="message-show">
    <scroll-view
      scroll-y="true"
      :scroll-top="scrollTop"
      slot="main"
      class="message-show-main"
      :style="{ height: height + 'px' }"
      ref="showMess"
    >
      <div
        class="message-show-item"
        :style="{ color: color }"
        v-for="(message, index) in messageData"
        :key="index"
      >
        {{ message }}
      </div>
    </scroll-view>
    <div slot="footer" class="messgaeInput">
      <ae-input
        style="width: 80%"
        @keyup.enter.native="sendMessage"
        v-model="inputMessage"
        center
        :placeholder="$t('e.sendMessage')"
      >
      </ae-input>
      <ae-button style="width: 20%" @click="sendMessage">{{
        $t("e.send")
      }}</ae-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    eventType: {
      type: String,
      default: "SEND_MESSAGE",
    },
    sendEventMethod: {
      type: [String, Function],
    },
    receiveMesEvent: {
      type: [String],
    },
    height: {
      type: Number,
      default() {
        return uni.getSystemInfoSync().windowHeight * 0.55;
      },
    },
    color: {
      type: String,
      default: "rgb(121, 11, 11)",
    },
  },
  data() {
    return {
      messageData: [],
      inputMessage: null,
      scrollTop: 0,
    };
  },
  methods: {
    sendMessage() {
      if (this.inputMessage) {
        let sendMes = {};
        sendMes.message = this.inputMessage;
        sendMes.eventType = this.eventType;
        if (this.sendEventMethod instanceof Function) {
          this.sendEventMethod(sendMes);
        } else {
          this.$store.dispatch(this.sendEventMethod, sendMes);
        }
      }
      this.inputMessage = null;
    },
    onMessage(message) {
      console.log("收到消息", message);
      this.messageData.push(message);
      this.$nextTick(() => {
        this.scrollTop += 20;
      });
    },
  },
  created() {
    this.$appHelper.bindPage2Global(this, "GameMessage");
    this.$eventBus.regist(this, this.receiveMesEvent, "onMessage");
  },
  destroyed() {
    this.$eventBus.unRegist(this, this.receiveMesEvent);
  },
};
</script>

<style lang="scss" scope>
.message-show {
  width: 98%;
  height: 98%;
  padding: 1%;
  font-size: 12px;
  word-wrap: break-word;
  color: rgb(250, 250, 250);
  .message-show-main {
    padding-left: 5px;
    padding-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    pointer-events: none;
    .message-show-item {
      padding: 2px;
      text-align: left;
      width: 100%;
      margin-bottom: 2px;
      -webkit-text-stroke: 0.2px #000000;
    }
  }
}

/deep/ .messgaeInput {
  display: flex;
  padding: 2%;
  flex-direction: row;
  align-items: center;
}
</style>