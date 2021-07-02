<template>
  <!--招募军队弹框-->
  <ae-base-dialog
    :title="$t('encounter.buy')"
    v-model="buyUnitShow"
    :width="$uni.isH5 ? 55 : 80"
  >
    <div v-if="buyUnitShow && buyUnitsInfo" class="buy-unit-main">
      <div class="buy-unit-title buy-unit-info">
        <b>{{ buyUnitsInfo[selectIndex].unit_mes.name }}</b>
        <div>
          <img
            style="width: 20px; height: 20px"
            src="../../../assets/images/assist/action_buy.png"
          />
          <span>{{ buyUnitsInfo[selectIndex].unit_mes.price }}</span>
        </div>
        <div>
          <img
            style="width: 20px; height: 20px"
            src="../../../assets/images/assist/show_attach_area.png"
          />
          <span
            >{{ buyUnitsInfo[selectIndex].unit_mes.min_attach_range }} -
            {{ buyUnitsInfo[selectIndex].unit_mes.max_attach_range }}</span
          >
        </div>
        <div>
          <img
            style="width: 20px; height: 20px"
            src="../../../assets/images/assist/pop_show.png"
          />
          <span>{{ buyUnitsInfo[selectIndex].unit_mes.population }}</span>
        </div>
      </div>
      <div class="buy-unit-info">
        <div>
          <img
            style="width: 20px; height: 20px"
            src="../../../assets/images/assist/info_attach.png"
          />
          <span
            >{{ buyUnitsInfo[selectIndex].level_mes.min_attack }} -
            {{ buyUnitsInfo[selectIndex].level_mes.max_attack }}</span
          >
        </div>
        <div>
          <img
            style="width: 20px; height: 20px"
            src="../../../assets/images/assist/info_physical_defense.png"
          />
          <span>{{
            buyUnitsInfo[selectIndex].level_mes.physical_defense
          }}</span>
        </div>
        <div>
          <img
            style="width: 20px; height: 20px"
            src="../../../assets/images/assist/info_magic_defense.png"
          />
          <span>{{ buyUnitsInfo[selectIndex].level_mes.magic_defense }}</span>
        </div>
        <div>
          <img
            style="width: 20px; height: 20px"
            src="../../../assets/images/assist/info_move.png"
          />
          <span>{{ buyUnitsInfo[selectIndex].level_mes.speed }}</span>
        </div>
      </div>
      <div class="buy-unit-intr">
        <div class="buy-unit-intr-mess">
          {{ buyUnitsInfo[selectIndex].unit_mes.description }}
        </div>
        <div class="buy-unit-intr-ability">
          <div
            v-for="(abilitie, index) in buyUnitsInfo[selectIndex].abilities"
            :key="index"
          >
            {{ abilitie.name }}
          </div>
        </div>
      </div>
      <div class="buy-unit-img">
        <div
          class="unit_show"
          v-for="(unitInfo, index) in buyUnitsInfo"
          :key="unitInfo.unit_mes.type"
          @click="selectIndex = index"
        >
          <img
            class="unit_img"
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
        :buttonList="[$t('common.cancel'), $t('encounter.buy')]"
        :clickAction="[close, buyUnit]"
      ></ae-button-list>
    </span>
  </ae-base-dialog>
</template>

<script>
import eventype from "../../../manger/eventType";
import { GetUnitInfoList } from "../../../api";
import AeButtonList from "../../frame/base/AeButtonList.vue";
export default {
  components: { AeButtonList },
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
        this.$appHelper.errorMsg(this.$t("encounter.noMoney"));
        return;
      }
      // 验证军队人口
      console.log(currArmy.pop + unitInfo.unit_mes.population);
      console.log(this.$store.getters.game.max_pop);
      if (
        currArmy.pop + unitInfo.unit_mes.population >
        this.$store.getters.game.max_pop
      ) {
        this.$appHelper.errorMsg(this.$t("encounter.unitTooMuch"));
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
  .buy-unit-title {
    b {
      width: 83px;
      color: white;
    }
  }
  .buy-unit-info {
    width: 100%;
    /* #ifdef H5 */
    padding: 10px;
    /* #endif */
    /* #ifndef H5 */
    padding: 4px;
    /* #endif */
    border-bottom: 1px rgb(190, 190, 190) solid;
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    div {
      float: left;
      display: flex;
      flex-direction: row;
      img {
        float: left;
        margin-left: 10px;
      }
      span {
        font-size: 12px;
        float: left;
        margin: 0 auto;
        margin-left: 10px;
        background-color: rgb(223, 223, 223);
        padding-top: 5px;
        display: block;
        width: 43px;
      }
    }
  }
  .buy-unit-intr {
    color: white;
    /* #ifdef H5 */
    padding: 10px;
    height: 100px;
    /* #endif */
    /* #ifndef H5 */
    padding: 4px;
    height: 66px;
    /* #endif */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .buy-unit-intr-ability {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      div {
        margin-right: 10px;
      }
      div:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
  .buy-unit-img {
    float: left;
    .unit_show {
      float: left;
      margin-left: 10px;
      position: relative;
      cursor: pointer;
      .unit_img {
        position: absolute;
        top: 4px;
        left: 4px;
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>