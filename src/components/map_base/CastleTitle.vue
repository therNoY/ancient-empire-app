<!-- 城堡的title -->
<template>
  <div>
    <img
      :class="[$uni.imgSize + '-img-size', 'castle-title']"
      src="../../assets/images/Region/castle_title.png"
      @click="getCastleTitle(title.row, title.column)"
      :style="{
        top: $appHelper.getPosition(title.row),
        left: $appHelper.getPosition(title.column),
      }"
    />
  </div>
</template>

<script>
export default {
  props: ["title"],
  methods: {
    getCastleTitle() {},
  },
};
</script>

<style >
.castle-title {
  position: absolute;
  pointer-events: none;
}
</style>