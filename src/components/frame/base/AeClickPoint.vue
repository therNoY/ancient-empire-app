<!--可以点击的点-->
<template>
  <div class="delete-black">
    <slot></slot>
    <span @click="clickPoint">
      <sup
        v-if="disabled"
        class="click-ponit-content"
        style="cursor: not-allowed"
        >{{ value }}</sup
      >
      <sup v-else class="click-ponit-content click-cursor">{{ value }}</sup>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "×",
    },
  },
  methods: {
    clickPoint() {
      console.log("点击clickPoint");
      if (!this.disabled) {
        this.$emit("clickPoint");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$size: 12px;
.delete-black {
  position: relative;
  vertical-align: middle;
  display: inline-block;
}
.click-ponit-content {
  background-color: #f56c6cd2;
  color: #fff;
  display: inline-block;
  justify-content: center;
  font-size: $size;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
  position: absolute;
  top: -5px;
  right: -10px;
  height: $size;
  width: $size;
  padding: 1px;
  border-radius: 10px;
  line-height: $size;

  :hover {
    background-color: #f56c6c;
  }
}
</style>