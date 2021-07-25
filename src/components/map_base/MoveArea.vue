<!--包含单位的移动区域和攻击区域-->
<template>
  <div>
    <!--可移动区域-->
    <div v-if="moveAreas.length > 0">
      <img
        :class="['stand-attach-move-view', imgSize + '-img']"
        v-for="(moveArea, index) in moveAreas"
        :key="index"
        src="../../assets/images/assist/move_alpha.png"
        @click="showMoveLine(moveArea.row, moveArea.column)"
        :style="{
          top: $appHelper.getPosition(moveArea.row),
          left: $appHelper.getPosition(moveArea.column),
        }"
      />
    </div>
    <!--移动路线-->
    <div
      class="move-path"
      v-for="(pathPoint, index) in moveLine"
      :key="moveLineKey(index)"
    >
      <div
        v-if="index < moveLine.length - 1"
        :style="{
          top: movePathTop(pathPoint, moveLine[index + 1]),
          left: movePathLeft(pathPoint, moveLine[index + 1]),
          width: movePathWidth(pathPoint, moveLine[index + 1]),
          height: movePathHeight(pathPoint, moveLine[index + 1]),
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import baseVar from "@/mixins/frame/baseVar.js";
import eventype from "../../manger/eventType";
export default {
  props: ["point"],
  mixins: [baseVar],
  data() {
    return {
      moveStatue: null,
      standImgSize: this.$c(),
      standMovePath: this.$c() / 3,
    };
  },
  computed: {
    moveAreas() {
      return this.$store.getters.moveAreas;
    },
    moveLine() {
      return this.$store.getters.moveLine;
    },
    // 根据 得到最短距离需要拐弯的几个点 画出一条红线
    movePathTop() {
      return function (point, point2) {
        if (point.row <= point2.row) {
          return (point.row - 1) * this.standImgSize + this.standMovePath + "px";
        } else {
          return (point2.row - 1) * this.standImgSize + this.standMovePath + "px";
        }
      };
    },
    movePathLeft() {
      return function (point, point2) {
        if (point.column < point2.column) {
          return (point.column - 1) * this.standImgSize + this.standMovePath + "px";
        } else {
          return (point2.column - 1) * this.standImgSize + this.standMovePath + "px";
        }
      };
    },
    movePathWidth() {
      return function (point1, point2) {
        if (point1.column == point2.column) {
          return this.standMovePath + "px";
        } else {
          return (
            Math.abs(point2.column - point1.column) * this.standImgSize +
            this.standMovePath +
            "px"
          );
        }
      };
    },
    movePathHeight() {
      return function (point1, point2) {
        if (point1.row == point2.row) {
          return this.standMovePath + "px";
        } else {
          return Math.abs(point2.row - point1.row) * this.standImgSize + "px";
        }
      };
    },
  },
  methods: {
    moveLineKey(index) {
      return `${"MOVELINE_" + index}`;
    },
    // 展示移动路线
    showMoveLine(row, column) {
      if (this.$appHelper.mapCanClick()) {
        // 点击了其他的单位 或者已经行动过了
        this.$appHelper.sendEvent(eventype.CLICK_MOVE_AREA, {
          row: row,
          column: column,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.move-path div {
  position: absolute;
  pointer-events: none;
  background-color: #e10052;
}
</style>