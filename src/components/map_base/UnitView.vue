<!--显示一个单位详情信息-->
<template>
  <div
    :style="{
      top: unitSiteStyle.top,
      left: unitSiteStyle.left,
      transitionDuration: unitSiteStyle.transitionDuration,
    }"
    @click="clickUnit"
  >
    <div>
      <div v-if="unit.done">
        <img class="stand-img-size" :src="doneImg" />
      </div>
      <div v-else>
        <img class="stand-img-size" v-show="signal % 2 === 0" :src="unitImg" />
        <img class="stand-img-size" v-show="signal % 2 !== 0" :src="unitImg2" />
      </div>
    </div>

    <!--单位的状态 血量 等级 buff-->
    <div class="stand-img-size">
      <!--状态-->
      <div
        v-if="unit.status && unit.status !== 'normal'"
        class="stand-status-size"
      >
        <img :src="statusImg" />
      </div>

      <!--血量-->
      <div v-if="isNotMaxLife" class="lifeNum stand-unit-life-num">
        <img
          class="stand-left-size"
          v-for="(lifeNum, index) in unit.life_num"
          :key="index"
          :src="liftImg(lifeNum)"
        />
      </div>
      <!--等级-->
      <div v-if="hasLevel" class="stand-unit-level">
        <img :src="levelImg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    unit: {},
    color: {},
    signal: {
      type: [Number, String],
      default: 0,
    },
    top: {
      type: Number,
      default: null,
    },
    left: {
      type: Number,
      default: null,
    },
  },
  computed: {
    unitImg() {
      return this.$appHelper.getUnitImg(
        this.unit.type_id,
        this.color ? this.color : this.unit.color
      );
    },
    unitImg2() {
      return this.$appHelper.getUnitImg(
        this.unit.type_id,
        this.color ? this.color : this.unit.color,
        "_2"
      );
    },
    isNotMaxLife() {
      if (this.unit.max_life) {
        if (this.unit.max_life == this.unit.life) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    },
    liftImg() {
      return function (liftImg) {
        if (this.liftImg) {
          return require("../../assets/images/assist/life_" + liftImg + ".png");
        }
      };
    },
    hasLevel() {
      if (!this.unit.level) {
        return false;
      }
      return this.unit.level > 0;
    },
    // 计算等级的图片
    levelImg() {
      if (this.unit.level) {
        return require("../../assets/images/assist/level_" +
          this.unit.level +
          ".png");
      }
    },
    statusImg() {
      if (this.unit.status) {
        return require("../../assets/images/assist/status_" +
          this.unit.status +
          ".png");
      }
    },
    doneImg() {
      return this.$appHelper.getUnitDoneImg(
        this.unit.type_id,
        this.color ? this.color : this.unit.color
      );
    },
    unitSiteStyle() {
      let unitSiteSty = {};
      if (this.top) {
        unitSiteSty.top = this.top + "px";
      } else {
        unitSiteSty.top = this.$appHelper.getUnitPosition(this.unit.row);
      }
      if (this.left) {
        unitSiteSty.left = this.left + "px";
      } else {
        unitSiteSty.left = this.$appHelper.getUnitPosition(this.unit.column);
      }
      let moveLength = this.$store.getters.moveLength;
      if (moveLength > 0) {
        unitSiteSty.transitionDuration =
          this.$store.getters.moveLength * 0.25 + "s";
      }
      return unitSiteSty;
    },
  },
  methods: {
    clickUnit() {
      this.$emit("unitOnClick", this.unit);
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  position: absolute;
  img {
    position: absolute;
    transition-property: all !important;
    transition-timing-function: linear;
    transition-duration: 0s;
  }
}

.lifeNum img {
  position: relative;
  float: left;
}
</style>