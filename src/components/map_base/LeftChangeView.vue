<template>
  <div>
    <!-- 血量变化的vue -->
    <!--减少的生命值-->
    <div
      v-for="(leftChange, index) in leftChanges"
      :key="index"
      class="left-change-view animated bounce"
      :style="{
        top: attachNumTop(leftChange.row),
        left: $appHelper.getPosition(leftChange.column),
      }"
    >
      <img
        :class="[imgSize + '-lifec-size']"
        v-for="(attachNum, index) in leftChange.attach"
        :key="leftNumIndex(index)"
        :src="lifeCImg(attachNum)"
      />
    </div>
  </div>
</template>

<script>
import baseVar from "@/mixins/frame/baseVar.js";
export default {
  mixins: [baseVar],
  methods: {
    leftNumIndex(index) {
      return "LIFE_" + index;
    },
  },
  computed: {
    leftChanges() {
      return this.$store.getters.leftChanges;
    },

    // 攻击数top位置
    attachNumTop() {
      return function (row) {
        let top = (row - 0.48) * this.$c() + "px";
        return top;
      };
    },
    // 获取生命数字的图片
    lifeCImg() {
      return function (attachNum) {
        return require("../../assets/images/assist/life_c_" +
          attachNum +
          ".png");
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.left-change-view {
  position: absolute;
}
.left-change-view img {
  position: relative !important ;
  float: left;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}

.animated {
  transition-duration: 0.05s;
  animation-fill-mode: both;
}

.animated.infinite {
  animation-iteration-count: infinite;
}
.bounce {
  animation-name: bounce;
  transform-origin: center bottom;
}
@keyframes bounce {
  0%,
  15%,
  47%,
  73%,
  89%,
  100% {
    animation-timing-function: ease-out;
    transform: translate3d(0, 0, 0);
  }

  30%,
  32% {
    animation-timing-function: ease-in;
    transform: translate3d(0, -12px, 0);
  }

  60% {
    animation-timing-function: ease-in;
    transform: translate3d(0, -6px, 0);
  }

  82% {
    animation-timing-function: ease-in;
    transform: translate3d(0, -3px, 0);
  }

  94% {
    animation-timing-function: ease-in;
    transform: translate3d(0, -1px, 0);
  }
}
</style>