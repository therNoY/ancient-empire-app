<!-- 城堡的title -->
<template>
  <div>
    <img
      :class="[imgSize + '-img-size', 'castle-title']"
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
import baseVar from "@/mixins/frame/baseVar.js";
export default {
  mixins: [baseVar],
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