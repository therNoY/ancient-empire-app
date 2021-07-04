<template>
  <div id="gameCore">
    <curr-unit-mes
      v-if="!isMobileStyle"
      :curr_unit_color="game.curr_unit_color"
      :curr_color="game.curr_color"
      :unitInfo="game.curr_unit"
      :region="game.curr_region"
    />

    <div class="game-core-container">
      <div v-if="!$uni.isH5" class="game-core-black-title">&nbsp;_</div>
      <movable-area
        class="main-area"
        :style="{ width: containerStyle.width, height: containerStyle.height }"
      >
        <movable-view
          :x="x"
          :y="y"
          :damping="50"
          :direction="direction"
          class="main-view"
          :style="{
            width: game.game_map.column * 24 + 'px',
            height: $appHelper.getMapSize(game.game_map.row),
          }"
        >
          <div class="base_map">
            <region-view-list
              ref="regionViewList"
              :regions="game.game_map.regions"
              :row="game.game_map.row"
              :column="game.game_map.column"
              @clickRegion="clickRegion"
            />
            <attach-area ref="attachArea" />
            <tomb-view ref="tombView" />
            <move-area ref="moveArea" :point="game.curr_point" />
            <army-view
              ref="armyView"
              @unitOnClick="clickUnit"
              :armys="game.army_list"
              :signal="signal"
            />
            <point-view
              ref="ponitView"
              :point="game.curr_point"
              :signal="signal"
            />
            <action-view ref="activeView" />
            <left-change ref="leftChange" />
            <animate-view ref="animateView" />
            <up-show-animate ref="upShowAnimate" />
            <game-dialog ref="gameDialog" />
          </div>
        </movable-view>
      </movable-area>
      <mobile-army-mes
        v-if="isMobileStyle"
        class="army_mes"
        ref="armyMes"
        :unitInfo="game.curr_unit"
        :point="game.curr_point"
        :column="game.game_map.column"
        :curr_color="game.curr_color"
        :region="game.curr_region"
        :gameId="game.uuid"
        :curr_unit_color="game.curr_unit_color"
      />
      <army-mes
        v-else
        class="army_mes"
        ref="armyMes"
        :type="game.type"
        :gameId="game.uuid"
        :curr_color="game.curr_color"
        :region="game.curr_region"
      />
      <buy-unit />
      <!-- 基础监听类 -->
      <base-lister />
    </div>

    <curr-region-mes
      v-if="!isMobileStyle"
      :curr_color="game.curr_color"
      :region="game.curr_region"
    />
  </div>
</template>

<script>
import RegionViewList from "../map_base/RegionViewList";
import ArmyView from "../map_base/ArmyView.vue";
import CurrUnitMes from "./map_mes/CurrUnitMes.vue";
import ArmyMes from "./map_mes/ArmyMes.vue";
import CurrRegionMes from "./map_mes/CurrRegionMes.vue";
import MobileArmyMes from "./map_mes/mobile/ArmyMes.vue";
import PointView from "../map_base/PointView.vue";
import MoveArea from "../map_base/MoveArea.vue";
import ActionView from "../map_base/ActionView.vue";
import AttachArea from "../map_base/AttachArea.vue";
import LeftChange from "../map_base/LeftChangeView.vue";
import AnimateView from "../map_base/AnimateView.vue";
import TombView from "../map_base/TombView.vue";
import BuyUnit from "./unit_map/BuyUnit.vue";
import eventype from "../../manger/eventType";
import UpShowAnimate from "../map_base/UpShowAnimate.vue";
import GameDialog from "../map_base/GameDialog.vue";
import BaseLister from "../BaseLister.vue";
import appHelper from "../../utils/appHelper";
export default {
  components: {
    RegionViewList,
    ArmyView,
    MobileArmyMes,
    CurrUnitMes,
    CurrRegionMes,
    PointView,
    MoveArea,
    ActionView,
    AttachArea,
    LeftChange,
    AnimateView,
    TombView,
    BuyUnit,
    ArmyMes,
    UpShowAnimate,
    GameDialog,
    BaseLister,
  },
  data() {
    return {
      // 当前地图
      game: {},
      // 当前变化信号
      signal: 1,
      containerStyle: {},
      x: 0,
      y: 0,
      direction: "all",
      isMobileStyle: true,
    };
  },
  computed: {},
  methods: {
    initMapStyle() {
      // #ifdef H5
      this.containerStyle.height = "100%";
      this.direction = "no";
      // #endif
      // #ifndef H5
      this.containerStyle.width = this.$uni.screenWidth + "px";
      this.containerStyle.height = this.$uni.screenHeigh - 40 + "px";
      this.isMobileStyle = true;
      // #endif
    },
    // 开启一个后台进程 计时器
    startWorker() {
      setInterval(() => {
        if (this.signal < 1000) {
          this.signal++;
        } else {
          this.signal = 0;
        }
      }, 500);
    },
    // 结束回合开始新的回合
    getNewRound() {
      this.$store.dispatch("getNewRound");
    },
    // 检测游戏是否可以开始
    checkGame() {
      // gameWS正常连接
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("testGameConnect")
          .then((isOK) => {
            if (isOK) {
              // 验证数据
              if (this.$store.getters.game) {
                resolve(1);
                return;
              }
            }
            reject("无法开始游戏");
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      });
    },
    clickRegion(index) {
      // 点击了其他的单位 或者已经行动过了
      if (this.$appHelper.mapCanClick()) {
        this.$appHelper.sendEvent(eventype.CLICK_REGION, null, null, index);
      }
    },
    clickUnit(unit) {
      if (this.$appHelper.mapCanClick()) {
        if (this.$store.getters.game.curr_color == unit.color && !unit.done) {
          // 点击了自己的可以行动的单位
          this.$appHelper.sendEvent(eventype.CLICK_ACTIVE_UNIT, {
            row: Math.round(unit.row),
            column: Math.round(unit.column),
          });
        } else {
          // 点击了其他的单位 或者已经行动过了
          this.$appHelper.sendEvent(eventype.CLICK_UN_ACTIVE_UNIT, {
            row: Math.round(unit.row),
            column: Math.round(unit.column),
          });
        }
      }
    },
  },
  created() {
    this.$appHelper.loadFontFaceFromWeb();
    // 检测webscoket连接
    console.log("准备开始游戏, 检查ws连接情况");
    this.$appHelper.bindPage2Global(this, "GameIndex");
    this.initMapStyle();
    this.checkGame()
      .then((resp) => {
        if (resp) {
          this.game = this.$store.getters.game;
          this.startWorker();
        } else {
          console.error("ws连接不正确");
          appHelper.errorMsg("数据错误,无法进入游戏");
          uni.redirectTo({
            url: "/components/Home",
            complete: (resp) => {
              console.log(resp);
            },
          });
        }
      })
      .catch((error) => {
        console.error(error);
        uni.redirectTo({
          url: "/components/Home",
          complete: (resp) => {
            console.log(resp);
          },
        });
      });
  },
  destroyed() {
    this.$store.dispatch("levelGame");
  },
};
</script>

<style lang="scss">
#gameCore {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  text-align: center;
  .unit-mes,
  .region-mes {
    /* #ifdef H5 */
    width: 16%;
    /* #endif */
    /* #ifndef H5 */
    width: 0;
    /* #endif */
  }
  .game-core-container {
    float: left;
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    background-color: #242b44;
    .game-core-black-title {
      height: 20px;
      color: rgb(70, 72, 70);
    }
    .main-area {
      width: 100%;
      height: 80%;
      padding: 2%;
      float: left;
      .main-view {
        position: relative;
        &:hover {
          cursor: pointer;
        }
        .base_map {
          cursor: hand;
          position: absolute;
          img {
            float: left;
          }
        }
      }
    }
    .army_mes {
      height: 10%;
    }
  }
}
</style>
