<template>
  <div>
    <div
      class="weixin-army-style-reginon"
      :style="{ width: regionWidth + 'px', height: regionWidth + 'px' }"
    >
      <ae-border padding="5px">
        <img
          class="weixin-army-region-info"
          style="width: 24px; height: 24px"
          :src="$appHelper.getRegionImg(region.type, region.color)"
        />
      </ae-border>
    </div>

    <div
      class="weixin-army-style-army"
      :style="{
        width: armyWidth + 'px',
        height: regionWidth + 'px',
        backgroundColor: $appHelper.getBkColorValue(curr_color),
      }"
    >
      <ae-border padding="5px">
        <div class="weixin-army-main">
          <div class="weixin-army-mes">
            <div class="army-mes-item">
              <img src="../../../../assets/images/assist/bar_money.png" />
              <b>&nbsp;{{ currentArmy.money }}</b>
            </div>
            <div class="army-mes-item">
              <img src="../../../../assets/images/assist/bar_round.png" />
              <b>&nbsp;&nbsp;{{ currentArmy.current_round }}</b>
            </div>
            <div class="army-mes-item">
              <img src="../../../../assets/images/assist/bar_pop.png" />
              <span
                >&nbsp;{{ currentArmy.pop }} / {{ currentArmy.max_pop }}</span
              >
            </div>
            <div class="army-mes-item">
              <img src="../../../../assets/images/assist/bar_camp.png" />
              <b>&nbsp;&nbsp;{{ currentArmy.camp }}</b>
            </div>
          </div>
          <div class="weixin-army-opt-icon">
            <!---主页-->
            <img src="../../../../assets/images/assist/icon_city.png" @click="goHome"/>
            <!--聊天-->
            <img src="../../../../assets/images/assist/icon_chat.png" />
            <!--保存-->
            <img src="../../../../assets/images/assist/net.png" @click="saveRecord"/>
            <!--详情-->
            <img src="../../../../assets/images/assist/icon_deatil.png" />
            <!---结束回合-->
            <img src="../../../../assets/images/assist/icon_end.png" @click="roundEnd"/>
          </div>
        </div>
      </ae-border>
    </div>
  </div>
</template>

<script>
import AeBorder from "../../../frame/base/AeBorder.vue";
import indexOptMixins from "../../indexOptMixins";
export default {
  components: { AeBorder },
  props: {
    region: {},
    curr_color: {},
  },
  data() {
    return {
      regionWidth: 34,
      armyWidth: null,
    };
  },
  mixins: [indexOptMixins],
  created() {
    this.armyWidth = this.$uni.screenWidth - this.regionWidth;
  },
};
</script>

<style lang="scss" scoped>
.weixin-army-style-reginon {
  position: absolute;
  left: 0px;
  bottom: 0px;
}
.weixin-army-style-army {
  position: absolute;
  left: 34px;
  bottom: 0px;
  width: 100%;
  .weixin-army-main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    .weixin-army-mes {
      display: flex;
      flex-direction: row;
      width: 30%;
      justify-content: space-evenly;
      color: yellow;
      .army-mes-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        img {
          width: 11px;
          height: 11px;
        }
      }
    }
    .weixin-army-opt-icon {
      display: flex;
      flex-direction: row;
      width: 40%;
      justify-content: space-evenly;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }
}
</style>