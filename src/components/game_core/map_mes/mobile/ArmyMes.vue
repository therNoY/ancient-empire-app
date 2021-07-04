<template>
  <div>
    <div
      class="mobile-army-style-reginon"
      :style="{ width: regionWidth + 'px', height: regionWidth + 'px' }"
    >
      <ae-border padding="5px">
        <img
          class="mobile-army-region-info"
          style="width: 24px; height: 24px"
          :src="$appHelper.getRegionImg(region.type, region.color)"
        />
      </ae-border>
    </div>

    <div
      class="mobile-army-style-army"
      :style="{
        width: armyWidth + 'px',
        height: regionWidth + 'px',
        backgroundColor: $appHelper.getBkColorValue(curr_color),
      }"
    >
      <ae-border padding="5px">
        <div class="mobile-army-main">
          <div class="mobile-army-mes">
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
          <div class="mobile-army-opt-icon">
            <!---主页-->
            <img
              src="../../../../assets/images/assist/icon_city.png"
              @click="goHome"
            />
            <!--聊天-->
            <img src="../../../../assets/images/assist/icon_chat.png" />
            <!--保存-->
            <img
              src="../../../../assets/images/assist/net.png"
              @click="saveRecord"
            />
            <!--详情-->
            <img
              @click="showUnitDetailInfo = true"
              src="../../../../assets/images/assist/icon_deatil.png"
            />
            <!---结束回合-->
            <img
              src="../../../../assets/images/assist/icon_end.png"
              @click="roundEnd"
            />
          </div>
        </div>
      </ae-border>
    </div>

    <div
      :class="[
        showLeft ? 'mobile-unit-detail-left' : 'mobile-unit-detail-right',
        'mobile-unit-detail',
      ]"
      v-if="localUnitInfo !== null"
    >
      <ae-border padding="8px">
        <div class="mobile-unit-detail-content">
          <ae-border padding="0px" class="mobile-unit-detail-unit">
            <unit-view
              :unit="localUnitInfo"
              :color="bg_color"
              :top="24"
              :left="24"
            ></unit-view>
          </ae-border>

          <div class="mobile-unit-detail-info">
            <div class="mobile-unit-detail-item">
              <img src="../../../../assets/images/assist/info_life1.png" />
              <div>
                <span
                  >{{ localUnitInfo.life }}/{{ localUnitInfo.max_life }}</span
                >
              </div>
            </div>
            <div class="mobile-unit-detail-item">
              <img
                src="../../../../assets/images/assist/info_experience1.png"
              />
              <div>
                <span
                  >{{ localUnitInfo.experience }}/{{
                    $appHelper.getUnitMaxExp(localUnitInfo.level)
                  }}</span
                >
              </div>
            </div>
            <div class="mobile-unit-detail-item">
              <img src="../../../../assets/images/assist/info_attach1.png" />
              <div>
                <span
                  >{{ localUnitInfo.level_mes.min_attack }} -
                  {{ localUnitInfo.level_mes.max_attack }}</span
                >
              </div>
            </div>
            <div class="mobile-unit-detail-item">
              <img src="../../../../assets/images/assist/info_move1.png" />
              <div>
                <span>{{ localUnitInfo.level_mes.speed }}</span>
              </div>
            </div>
            <div class="mobile-unit-detail-item">
              <img
                src="../../../../assets/images/assist/info_physical_defense1.png"
              />
              <div>
                <span>{{ localUnitInfo.level_mes.physical_defense }}</span>
              </div>
            </div>
            <div class="mobile-unit-detail-item">
              <img
                src="../../../../assets/images/assist/info_magic_defense1.png"
              />
              <div>
                <span>{{ localUnitInfo.level_mes.magic_defense }}</span>
              </div>
            </div>
          </div>
        </div>
      </ae-border>
    </div>

    <ae-base-dialog
      v-if="showUnitDetailInfo"
      v-model="showUnitDetailInfo"
      :title="localUnitInfo.unit_mes.name"
    >
      <unit-mes :unitInfo="unitInfo" :color="curr_color"></unit-mes>
    </ae-base-dialog>
  </div>
</template>

<script>
import UnitView from "../../../map_base/UnitView.vue";
import indexOptMixins from "../../indexOptMixins";
import UnitMes from "../../unit_map/UnitMes.vue";
export default {
  components: {
    UnitView,
    UnitMes,
  },
  props: {
    region: {},
    curr_color: {},
    point: {},
    column: {},
    unitInfo: {},
    bg_color: {},
  },
  data() {
    return {
      regionWidth: 34,
      armyWidth: null,
      localUnitInfo: null,
      // 展示单位或者地形详情
      showUnitDetailInfo: false,
    };
  },
  mixins: [indexOptMixins],
  created() {
    this.$appHelper.bindPage2Global(this, "ArmyMesIndex");
    this.armyWidth = this.$uni.screenWidth - this.regionWidth;
    if (this.unitInfo) {
      this.localUnitInfo = this.unitInfo;
    }
  },
  watch: {
    unitInfo(info) {
      this.localUnitInfo = info;
    },
    point() {
      this.localUnitInfo = null;
    },
  },
  computed: {
    showLeft() {
      return !(this.point.column * 2 <= this.column);
    },
  },
};
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
$distance: 30px;
/* #endif */
/* #ifndef H5 */
$distance: 10px;
/* #endif */
.mobile-army-style-reginon {
  position: absolute;
  left: 0px;
  bottom: 0px;
}
.mobile-army-style-army {
  position: absolute;
  left: 34px;
  bottom: 0px;
  width: 100%;
  .mobile-army-main {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    .mobile-army-mes {
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
    .mobile-army-opt-icon {
      display: flex;
      flex-direction: row;
      width: 40%;
      justify-content: space-evenly;
      cursor: pointer;
      img {
        width: 25px;
        height: 25px;
      }
    }
  }
}
.mobile-unit-detail {
  position: absolute;
  background-color: #242a43;
  top: $distance;
  .mobile-unit-detail-content {
    height: 240px;
    width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .mobile-unit-detail-unit {
      position: relative;
      width: 74px;
      height: 72px;
      background-color: rgb(70, 72, 70);
      .unit_view {
        width: 24px;
        height: 24px;
      }
    }
    .mobile-unit-detail-info {
      display: flex;
      flex-direction: column;
      width: 100%;
      flex-grow: 2;
      justify-content: space-around;
      .mobile-unit-detail-item {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        /deep/ img {
          width: 20px;
          height: 20px;
        }
        div {
          background-color: #495280;
          display: flex;
          flex-direction: column;
          height: 18px;
          flex-grow: 2;
          color: rgb(255, 255, 255);
          justify-content: space-evenly;

          span {
            height: 20px;
            /* #ifdef H5*/
            font-size: 14px;
            /* #endif*/
            /* #ifdef MP-WEIXIN */
            font-size: 0.65rem;
            /* #endif */
          }
        }
      }
    }
  }
}
.mobile-unit-detail-left {
  left: $distance;
}
.mobile-unit-detail-right {
  right: $distance;
}
.m-show-unit {
  .m-show-unit-info {
    .show-unit-detail-img {
      position: relative;
      width: 74px;
      height: 72px;
      background-color: rgb(70, 72, 70);
    }
  }
  .m-show-unit-mes {
  }
  .m-show-unit-desc {
  }
  .show-unit-ability-list {
  }
}
</style>