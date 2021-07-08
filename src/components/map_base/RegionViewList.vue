<!--地形集合-->
<template>
  <div v-if="regions">
    <img
      class="stand-img"
      style="float: left"
      v-for="(region, index) in regions"
      :key="region.id"
      :src="$appHelper.getRegionImg(region.type, region.color)"
      @click="clickRegion(index)"
      :title="getRegionTitle(index)"
    />

    <!-- 城堡的地图 -->
    <img
      class="stand-img castle-title"
      v-for="(title, index) in mapCastleTitle"
      :key="index"
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
  props: {
    regions: {},
    castleTitles: {},
    row: {},
    column: {},
    showTitle: { type: Boolean, default: false },
  },
  methods: {
    clickRegion(index) {
      this.$emit("clickRegion", index);
    },
    getRegionTitle(index) {
      if (this.showTitle) {
        return (
          Math.floor(index / this.column + 1) +
          "行" +
          ((index + 1) % this.column == 0
            ? this.column
            : (index + 1) % this.column) +
          "列"
        );
      }
      return null;
    },
  },
  created() {},
  computed: {
    mapCastleTitle() {
      let sites = [];
      let region;
      let row = this.row;
      let column = this.column;
      // 获取所有的城堡index 然后设置绝对定位设置城堡的头部
      for (let index = 0; index < this.regions.length; index++) {
        region = this.regions[index];
        if ("castle" == region.type) {
          let castleTitle = {};
          castleTitle.row = Number.parseInt(index / column);
          castleTitle.column =
            (index + 1) % column == 0 ? column : (index + 1) % column;
          sites.push(castleTitle);
        }
      }
      return sites;
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  .castle-title {
    position: absolute;
    pointer-events: none;
  }
}
</style>