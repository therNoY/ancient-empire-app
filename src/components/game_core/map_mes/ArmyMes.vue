<template>
  <div class="army_mes" :style="$appHelper.getBkColor(curr_color)">
    <div class="bar_mes">
      <ae-tooltip class="army-mes-tooltip" :content="$t('common.money')">
        <div class="army-mes-item">
          <img src="../../../assets/images/assist/bar_money.png" />
          <span>&nbsp;{{ currentArmy.money }}</span>
        </div>
      </ae-tooltip>

      <ae-tooltip
        class="army-mes-tooltip"
        :content="$t('unitManagement.population')"
      >
        <div class="army-mes-item">
          <img src="../../../assets/images/assist/bar_pop.png" />
          <span>&nbsp;{{ currentArmy.pop }} / {{ currentArmy.max_pop }}</span>
        </div>
      </ae-tooltip>

      <ae-tooltip class="army-mes-tooltip" :content="$t('common.round')">
        <div class="army-mes-item">
          <img src="../../../assets/images/assist/bar_round.png" />
          <span>&nbsp;&nbsp;{{ currentArmy.current_round }}</span>
        </div>
      </ae-tooltip>

      <ae-tooltip class="army-mes-tooltip" :content="$t('encounter.camp')">
        <div class="army-mes-item">
          <img src="../../../assets/images/assist/bar_camp.png" />
          <span>&nbsp;&nbsp;{{ currentArmy.camp }}</span>
        </div>
      </ae-tooltip>
    </div>
    <div class="bar_button">
      <ae-button-list
        :buttonList="[
          $t('common.home'),
          $t('common.saveGame'),
          $t('common.endRound'),
        ]"
        size="16px"
        :buttonConfig="{ '1': { display: (type === 'encounter' || type === 'chapter') } }"
        :clickAction="[goHome, saveRecord, roundEnd]"
      ></ae-button-list>
    </div>
  </div>
</template>

<script>
import eventype from "../../../manger/eventType";
import { RecordSaveAs } from "@/api";
export default {
  props: ["curr_color", "gameId", "type"],
  data() {
    return {
      saveRecordName: null,
    };
  },
  methods: {
    roundEnd() {
      this.$appHelper.sendEvent(eventype.ROUND_END);
    },
    goHome() {
      this.$appHelper.showTip(this.$t("encounter.leaveGameWarn"), () => {
        this.$uni.redirectTo({
          url: "/components/Home",
          complete: (resp) => {
            console.log(resp);
          },
        });
      });
    },
    saveRecord() {
      let _this = this;
      this.$appHelper.showInputDialog(
        this.$t("loadGame.saveRecord"),
        this.$t("loadGame.recordName"),
        (saveRecordName) => {
          let args = {};
          args.uuid = _this.gameId;
          args.name = saveRecordName;
          RecordSaveAs(args).then(() => {
            _this.$appHelper.infoMsg(_this.$t("common.saveSuccess"));
          });
        }
      );
    },
  },
  computed: {
    currentArmy() {
      let game = this.$store.getters.game;
      let currArmy = game.army_list[game.curr_army_index];
      currArmy.max_pop = game.max_pop;
      currArmy.current_round = game.current_round;
      return currArmy;
    },
  },
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
      cursor: pointer;
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