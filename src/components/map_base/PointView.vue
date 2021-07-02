<template>
  <div class="cursor_normal">
    <!--指针框 -->
    <div v-if="!attachPoint.hasOwnProperty('row')" @click="clickPoint">
      <img
        style="width: 26px; height: 26px"
        v-show="signal % 2 === 0"
        src="../../assets/images/assist/point_0.png"
        :style="{
          top: $appHelper.getPosition(point.row),
          left: $appHelper.getPosition(point.column),
        }"
      />
      <img
        style="width: 26px; height: 26px"
        v-show="signal % 2 === 1"
        src="../../assets/images/assist/point_1.png"
        :style="{
          top: $appHelper.getPosition(point.row),
          left: $appHelper.getPosition(point.column),
        }"
      />
    </div>
    <!--攻击/召唤/治疗 指针-->
    <div v-else class="attackPoint" @click="clickChoosePoint">
      <img
        style="width: 40px; height: 41px"
        :src="attachPointImg"
        :style="{
          top: (attachPoint.row - 1 - 0.3) * 24 + 'px',
          left: (attachPoint.column - 1 - 0.3) * 24 + 'px',
        }"
      />
    </div>

    <!--目的地指针 只在移动区域显示的时候才会显示-->
    <div class="aim_point" v-if="moveLine.length > 0">
      <img
        style="width: 26px; height: 26px"
        src="../../assets/images/assist/cursor_target.png"
        :style="{
          top: $appHelper.getPosition(point.row),
          left: $appHelper.getPosition(point.column),
        }"
        @click="goAimPoint"
      />
    </div>
  </div>
</template>

<script>
import eventype from "../../manger/eventType";
export default {
  props: {
    signal: {
      default: 0,
    },
    point: {},
  },
  data() {
    return {
      movePointIndex: 0, // 单位移动的辅助值 用于表示当前移动到第几个点了
    };
  },
  computed: {
    attachPoint() {
      return this.$store.getters.attachPoint;
    },
    moveLine() {
      return this.$store.getters.moveLine;
    },
    attachPointImg() {
      return require("../../assets/images/assist/cursor_0" +
        ((this.signal % 3) + 2) +
        ".png");
    },
  },
  methods: {
    // 点击指针
    clickPoint() {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(eventype.CLICK_POINT);
      }
    },
    // 点击目的地指针
    goAimPoint() {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(eventype.CLICK_AIM_POINT);
      }
    },
    // 点击选择指针
    clickChoosePoint() {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(
          eventype.CLICK_CHOOSE_POINT,
          null,
          this.attachPoint
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cursor_normal img {
  position: absolute;
  cursor: pointer;
}
.aim_point img {
  position: absolute;
  cursor: pointer;
}
.attackPoint img {
  position: absolute;
  cursor: pointer;
}
</style>