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
      showing: false,
      upShowAnimList: [],
      showAnim: false,
    };
  },
  methods: {
    showLevelUp({ site, imgValue }) {
      this.upShowAnimList.push({ site, imgValue });
      if (!this.showing) {
        this.doShowAnim();
      }
    },
    doShowAnim() {
      if (this.upShowAnimList.length > 0) {
        this.showing = true;
        let upShowAnim = this.upShowAnimList.shift();
        this.site = upShowAnim.site;
        this.imgValue = upShowAnim.imgValue;
        this.showAnim = true;
        setTimeout(() => {
          this.site.row = this.site.row - 0.5;
          setTimeout(() => {
            this.showAnim = false;
            this.$nextTick(() => {
              this.doShowAnim();
            });
          }, 500);
        }, 200);
      } else {
        this.showing = false;
      }
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