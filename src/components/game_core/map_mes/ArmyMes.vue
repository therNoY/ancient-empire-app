<template>
  <div
    class="army_mes"
    :style="{ backgroundColor: $appHelper.getBkColorValue(curr_color) }"
  >
    <div class="bar_mes">
      <ae-tooltip class="army-mes-tooltip" :content="$t('c.money')">
        <div class="army-mes-item">
          <img src="../../../assets/images/assist/bar_money.png" />
          <span>&nbsp;{{ currentArmy.money }}</span>
        </div>
      </ae-tooltip>

      <ae-tooltip
        class="army-mes-tooltip"
        :content="$t('um.population')"
      >
        <div class="army-mes-item">
          <img src="../../../assets/images/assist/bar_pop.png" />
          <span>&nbsp;{{ currentArmy.pop }} / {{ currentArmy.max_pop }}</span>
        </div>
      </ae-tooltip>

      <ae-tooltip class="army-mes-tooltip" :content="$t('c.round')">
        <div class="army-mes-item">
          <img src="../../../assets/images/assist/bar_round.png" />
          <span>&nbsp;&nbsp;{{ currentArmy.current_round }}</span>
        </div>
      </ae-tooltip>

      <ae-tooltip class="army-mes-tooltip" :content="$t('e.camp')">
        <div class="army-mes-item">
          <img src="../../../assets/images/assist/bar_camp.png" />
          <span>&nbsp;&nbsp;{{ currentArmy.camp }}</span>
        </div>
      </ae-tooltip>
    </div>
    <div class="bar_button">
      <ae-button-list
        :buttonList="[
          $t('c.home'),
          $t('c.saveGame'),
          $t('c.endRound'),
        ]"
        size="16px"
        :buttonConfig="{
          '1': { display: type === 'encounter' || type === 'chapter' },
        }"
        :clickAction="[goHome, saveRecord, roundEnd]"
      ></ae-button-list>
    </div>
  </div>
</template>

<script>
import indexOptMixins from "../indexOptMixins";
export default {
  props: ["curr_color", "gameId", "type"],
  mixins: [indexOptMixins],
  data() {
    return {
      saveRecordName: null,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.army_mes {
  height: 100%;
  width: 100%;
  display: flex;
  text-align: center;
  flex-direction: row;
  .bar_mes {
    margin-top: 15px;
    width: 40%;
    display: flex;
    flex-direction: row;
    .army-mes-tooltip {
      width: 60px;
      font-size: 13px;
      margin-right: 10px;
      /* #ifdef H5*/
      cursor: pointer;
      /* #endif */
      display: flex;
      .army-mes-item {
        span {
          margin-left: 10px;
        }
      }
    }
  }
  .bar_button {
    margin-top: 15px;
    width: 50%;
    font-size: 12px;
  }
}
</style>