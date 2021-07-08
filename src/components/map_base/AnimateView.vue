<!--所有的动画特效-->
<template>
  <div>
    <div v-for="(animate, index) in animates" :key="index">
      <img
        v-if="animate"
        class="stand-img-size base-animate"
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
export default {
  computed: {
    animates() {
      return this.$store.getters.animates;
    },
  },
};
</script>

<style >
</style>