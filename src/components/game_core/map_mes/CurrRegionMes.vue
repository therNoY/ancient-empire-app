<template>
  <!--地形信息-->
  <div class="region-mes" :style="bkColor">
    <div v-if="region" style="height: 60%">
      <div class="region-title">
        <div>{{ region.name }}</div>
      </div>

      <div class="curr-regin-view">
        <ae-border padding="0px" class="show-unit-detail-img">
          <div class="show-region-img">
            <img
              v-if="region.type == 'castle'"
              src="../../../assets/images/Region/castle_title.png"
            />
            <div v-else class="stand-img-size"></div>
            <img :src="$appHelper.getRegionImg(region.type, region.color)" />
          </div>
        </ae-border>
      </div>

      <div class="region-description">{{ region.description }}</div>

      <div class="region-des">
        <ae-tooltip class="region-des-tooltip" :content="$t('e.defenseAdd')">
          <img src="../../../assets/images/assist/action_defense.png" />
          <span class="no-background-color">{{ region.buff }}</span>
        </ae-tooltip>
        <ae-tooltip class="region-des-tooltip" :content="$t('e.roundRecover')">
          <img src="../../../assets/images/assist/action_restore.png" />
          <span class="no-background-color">{{ region.restore }}</span>
        </ae-tooltip>
        <ae-tooltip class="region-des-tooltip" :content="$t('e.moneyAdd')">
          <img src="../../../assets/images/assist/action_buy.png" />
          <span class="no-background-color">{{ region.tax }}</span>
        </ae-tooltip>
        <ae-tooltip class="region-des-tooltip" :content="$t('e.moveConsume')">
          <img src="../../../assets/images/assist/action_move.png" />
          <span class="no-background-color">{{ region.deplete }}</span>
        </ae-tooltip>
      </div>
    </div>
    <game-message
      sendEventMethod="sendGameMessage"
      receiveMesEvent="addGameMessage"
      :height="$uni.screenHeigh * 0.3"
    ></game-message>
  </div>
</template>

<script>
import GameMessage from "../../frame/GameMessage.vue";
export default {
  components: {
    GameMessage,
  },
  props: ["curr_color", "region"],
  computed: {
    // 背景
    bkColor() {
      return this.$appHelper.getBkColor(this.curr_color);
    },
  },
};
</script>

<style lang="scss" scoped>
.region-mes {
  float: right;
  text-align: center;
  width: 100%;
  height: 100%;
  .region-title {
    font-size: 16px;
    margin-top: 10px;
    margin-bottom: 20px;
    color: white;
  }
  .curr-regin-view {
    width: 72px;
    height: 72px;
    margin: auto;
    position: relative;
    .show-unit-detail-img {
      position: absolute;
      width: 68px;
      height: 68px;
      background-color: rgb(70, 72, 70);
      .show-region-img {
        position: absolute;
        display: flex;
        flex-direction: column;
        left: 20px;
      }
    }
  }
  .region-des {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    width: 100%;
    .region-des-tooltip {
      width: 100%;
      background-color: rgb(255, 255, 255);
      margin-top: 10px;
      padding: 5px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    img {
      float: left;
      width: 9.5%;
      margin-left: 5%;
    }
    span {
      float: left;
      width: 75%;
      margin-left: 5%;
      color: rgb(97, 97, 97);
      font-size: 12px;
      background-color: rgba(0, 255, 157, 0.767);
    }
    i {
      float: left;
      transition-duration: 0.2s;
      transition-property: all;
      transition-timing-function: linear;
      transition-delay: 0s;
      padding-top: 2px;
      padding-bottom: 2px;
    }
    .no-background-color {
      background-color: rgba(255, 255, 255, 0.767);
    }
  }
  .region-description {
    font-size: 12px;
    color: rgb(255, 255, 255);
    float: left;
    margin-top: 20px;
    margin-bottom: 10px;
    padding-bottom: 10px;
    width: 100%;
  }
}
</style>