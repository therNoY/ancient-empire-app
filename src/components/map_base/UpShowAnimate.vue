<template>
  <div>
    <!--升级-->
    <div class="level_up" v-if="showAnim">
      <img style="width: 62px; height: 11px" :src="upImg" :style="[style]" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      site: {},
      imgValue: {},
      showAnim: false,
    };
  },
  methods: {
    showLevelUp({ site, imgValue }) {
      this.site = site;
      this.imgValue = imgValue;
      this.showAnim = true;
      setTimeout(() => {
        this.site.row = this.site.row - 0.5;
        setTimeout(() => {
          this.showAnim = false;
        }, 500);
      }, 200);
    },
  },
  created() {
    this.$eventBus.regist(this, "showLevelUp");
  },
  destroyed() {
    this.$eventBus.unRegist(this, "showLevelUp");
  },
  computed: {
    style() {
      let top = (this.site.row - 1) * this.$c() + "px";
      let left = (this.site.column - 2) * this.$c() + "px";
      return { top: top, left: left };
    },
    upImg() {
      return this.$appHelper.getTemplateImg(this.imgValue);
    },
  },
};
</script>

<style lang="css" scoped>
.level_up img {
  position: absolute;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
  transition-delay: 0s;
}
</style>