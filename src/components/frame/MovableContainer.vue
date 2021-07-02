<template>
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
          width: width,
          height: height,
        }"
      >
        <slot></slot>
      </movable-view>
    </movable-area>
    <slot name="movable-footer"></slot>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
    },
    height: {
      type: String,
    },
  },
  data() {
    return {
      containerStyle: {},
      x: 0,
      y: 0,
      direction: "all",
    };
  },
  methods: {
    initMapStyle() {
      // #ifdef H5
      this.containerStyle.height = "100%";
      this.containerStyle.width = "100%";
      this.direction = "no";
      // #endif
      // #ifndef H5
      this.containerStyle.width = this.$uni.screenWidth + "px";
      this.containerStyle.height = this.$uni.screenHeigh - 40 + "px";
      // #endif
    },
  },
  created() {
      this.$appHelper.bindPage2Global(this, "MovableContainer");
      this.initMapStyle();
  },
};
</script>

<style lang="scss" scoped>
.game-core-container {
  display: flex;
  flex-direction: column;
  background-color: rgb(70, 72, 70);
  .game-core-black-title {
    height: 20px;
    .main-area {
      width: 100%;
      height: 84%;
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
  }
}
</style>