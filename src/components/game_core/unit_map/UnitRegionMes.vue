<template>
  <div class="unit-mes" style="width: 100%">
    <div class="unit-mes-title under-border">
      <div class="show-unit-detail-border">
        <ae-border padding="0px" class="show-unit-detail-img">
          <unit-view
            v-if="showMode == 'unit'"
            :unit="unitInfo"
            :color="color"
            :top="20"
            :left="20"
          ></unit-view>
          <div v-else class="show-region-img">
            <img
              class="fixed-img-size "
              v-if="region.type == 'castle'"
              src="../../../assets/images/Region/castle_title.png"
            />
            <div v-else class="fixed-img-size"></div>
            <img class="fixed-img-size" :src="$appHelper.getRegionImg(region.type, region.color)" />
          </div>
        </ae-border>
      </div>

      <div v-if="showMode == 'unit'" class="unit-mes-data">
        <div>
          <img src="../../../assets/images/assist/action_buy.png" />
          <span>{{ unitInfo.unit_mes.price }}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/show_attach_area.png" />
          <span
            >{{ unitInfo.unit_mes.min_attach_range }} -
            {{ unitInfo.unit_mes.max_attach_range }}</span
          >
        </div>
        <div>
          <img src="../../../assets/images/assist/pop_show.png" />
          <span>{{ unitInfo.unit_mes.population }}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/info_attach.png" />
          <span
            >{{ unitInfo.level_mes.min_attack }} -
            {{ unitInfo.level_mes.max_attack }}</span
          >
        </div>
        <div>
          <img src="../../../assets/images/assist/info_physical_defense.png" />
          <span>{{ unitInfo.level_mes.physical_defense }}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/info_magic_defense.png" />
          <span>{{ unitInfo.level_mes.magic_defense }}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/info_move.png" />
          <span>{{ unitInfo.level_mes.speed }}</span>
        </div>
      </div>
      <div v-else class="unit-mes-data">
        <div>
          <img src="../../../assets/images/assist/action_defense.png" />
          <span>{{ region.buff }}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/action_restore.png" />
          <span>{{ region.restore }}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/action_buy.png" />
          <span>{{ region.tax }}</span>
        </div>
        <div>
          <img src="../../../assets/images/assist/action_move.png" />
          <span>{{ region.deplete }}</span>
        </div>
      </div>
    </div>

    <div class="unit-mes-intr-mess under-border">
      {{
        showMode == "unit" ? unitInfo.unit_mes.description : region.description
      }}
    </div>
    <div
      class="unit-mes-intr"
      v-if="
        showMode == 'unit' &&
        unitInfo.abilities &&
        unitInfo.abilities.length > 0
      "
    >
      <div class="under-border">能力列表</div>
      <div
        class="unit-mes-intr-abil-list"
        v-for="(abilitie, index) in unitInfo.abilities"
        :key="index"
      >
        <div class="item-desc-name" @click="showAbilityDes(abilitie)">
          [{{ abilitie.name }}]
        </div>
      </div>
    </div>
    <div class="unit-mes-intr" v-if="showMode == 'unit' && unitInfo.status">
      <div class="under-border">状态</div>
      <div
        class="unit-mes-intr-abil-list item-desc-name"
        @click="showBuffDetail(unitInfo.status)"
      >
        [{{ statusInfo.name }}]
      </div>
    </div>
  </div>
</template>

<script>
import { GetBuffByType } from "../../../api";
import UnitView from "../../map_base/UnitView.vue";
export default {
  components: { UnitView },
  props: {
    unitInfo: {},
    color: {},
    region: {},
    // 展示模式默认单位 也可以展示地形
    showMode: {
      type: String,
      default: "unit",
    },
  },
  data() {
    return {
      statusInfo: {},
    };
  },
  methods: {
    showAbilityDes(ability) {
      this.$appHelper.showTip(ability.description, () => {}, [], ability.name);
    },
    showBuffDetail(type) {
      this.$appHelper.showTip(
        this.statusInfo.description,
        () => {},
        [],
        this.statusInfo.name
      );
    },
  },
  created() {
    this.$appHelper.bindPage2Global(this, "UnitMes");
    if (this.showMode == "unit" && this.unitInfo.status) {
      let args = {};
      args.type = this.unitInfo.status;
      GetBuffByType(args).then(({ res_val }) => {
        this.statusInfo = res_val;
      });
    }
  },
};
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
$padding: 10px;
/* #endif */
/* #ifndef H5 */
$padding: 4px;
/* #endif */
.unit-mes {
  display: flex;
  flex-direction: column;
  .unit-mes-title {
    display: flex;
    flex-direction: row;
    .show-unit-detail-border {
      position: relative;
      /* #ifdef H5 */
      width: 68px;
      /* #endif */
      height: 68px;
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

    .unit-mes-data {
      /* #ifndef H5 */
      margin-left: 68px;
      /* #endif */
      padding: $padding;
      text-align: center;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 1px;
      div {
        display: flex;
        flex-direction: row;
        img {
          margin-left: 10px;
          width: 20px;
          height: 20px;
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
          border: 1px rgb(70, 72, 70) solid;
        }
      }
    }
  }

  .unit-mes-intr-mess {
    color: white;
    padding: $padding;
  }
  .unit-mes-intr {
    padding: $padding;
    display: flex;
    flex-direction: row;
    color: white;
    display: flex;
    flex-direction: column;
    .unit-mes-intr-abil-list {
      display: flex;
      flex-direction: row;
    }
  }
}
.under-border {
  border-bottom: 1px rgb(190, 190, 190) solid;
}
.item-desc-name {
  /* #ifdef H5*/
  cursor: pointer;
  /* #endif */
  font-size: 12px;
}
</style>