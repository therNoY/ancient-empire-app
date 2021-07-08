<template>
  <!--招募军队弹框-->
  <ae-base-dialog
    :title="$t('e.buy', buyUnitsInfo[selectIndex].unit_mes.name)"
    v-model="buyUnitShow"
    inlineDialog
    :top="3"
    :width="$uni.isH5 ? 50 : 80"
  >
    <div v-if="buyUnitShow && buyUnitsInfo" class="buy-unit-main">
      <unit-region-mes
        :unitInfo="buyUnitsInfo[selectIndex]"
        :color="color"
      ></unit-region-mes>
      <div class="buy-unit-img">
        <div
          class="by-unit-show"
          v-for="(unitInfo, index) in buyUnitsInfo"
          :key="unitInfo.unit_mes.type"
          @click="selectIndex = index"
        >
          <img
            class="by-unit-img stand-img-size"
            :src="$appHelper.getUnitImg(unitInfo.unit_mes.img_index, color)"
          />
          <img
            style="width: 32px; height: 33px"
            src="../../../assets/images/assist/show_unit.png"
            v-if="index != selectIndex"
          />
          <img
            v-else
            src="../../../assets/images/assist/select_unit.png"
            style="width: 32px; height: 33px"
          />
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <ae-button-list
        :buttonList="[$t('c.cancel'), $t('e.buyUnit')]"
        :clickAction="[close, buyUnit]"
      ></ae-button-list>
    </span>
  </ae-base-dialog>
</template>

<script>
import eventype from "../../../manger/eventType";
import { GetUnitInfoList } from "../../../api";
import UnitRegionMes from "./UnitRegionMes.vue";
export default {
  components: { UnitRegionMes },
  data() {
    return {
      selectIndex: 0,
      buyUnitsInfo: null,
    };
  },
  methods: {
    buyUnit() {
      let game = this.$store.getters.game;
      let currArmy = game.army_list[game.curr_army_index];
      const unitInfo = this.buyUnitsInfo[this.selectIndex];
      // 验证军队资金
      console.log("现有金币" + currArmy.money);
      console.log("需要金币" + unitInfo.unit_mes.price);
      if (currArmy.money < unitInfo.unit_mes.price) {
        this.$appHelper.errorMsg(this.$t("enoMoney"));
        return;
      }
      // 验证军队人口
      console.log(currArmy.pop + unitInfo.unit_mes.population);
      console.log(this.$store.getters.game.max_pop);
      if (
        currArmy.pop + unitInfo.unit_mes.population >
        this.$store.getters.game.max_pop
      ) {
        this.$appHelper.errorMsg(this.$t("eunitTooMuch"));
        return;
      }

      // 准备购买
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(
          eventype.CLICK_BUY_ACTION,
          null,
          null,
          null,
          unitInfo.unit_mes.id
        );
        this.$emit("dialogClose");
        this.$store.commit("setAction", []);
      }
      this.close();
    },
    close() {
      this.$store.commit("setBuyUnitDialog", false);
    },
  },
  computed: {
    buyUnitShow: {
      get: function () {
        return this.$store.getters.buyUnitDialog;
      },
      set: function (value) {
        this.$store.commit("setBuyUnitDialog", value);
      },
    },
    color() {
      return this.$store.getters.game.curr_color;
    },
  },
  created() {
    let args = {};
    args.uuid = this.$store.getters.game.uuid;
    GetUnitInfoList(args).then((resp) => {
      if (resp.res_code == 0) {
        this.buyUnitsInfo = resp.res_val;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.buy-unit-main {
  display: flex;
  flex-direction: column;
  .buy-unit-img {
    float: left;
    .by-unit-show {
      float: left;
      margin-left: 10px;
      position: relative;
      cursor: pointer;
      .by-unit-img {
        position: absolute;
        top: 4px;
        left: 4px;
      }
    }
  }
}
</style>