<!--所有的动画特效-->
<template>
  <div>
    <div v-for="(animate, index) in animates" :key="index">
      <img
        v-if="animate"
        :class="[imgSize + '-img-size', 'base-animate']"
        :src="animate.animImg"
        :style="{
          top: $appHelper.getPosition(animate.row),
          left: $appHelper.getPosition(animate.column),
        }"
      />
    </div>
  </div>
</template>

<script>
import baseVar from "@/mixins/frame/baseVar.js";
export default {
  mixins: [baseVar],
  computed: {
    animates() {
      return this.$store.getters.animates;
    },
  },
};
</script>

<style >
</style>