<!--军队集合-->
<template>
  <div class="unit-view-list">
    <unit-view
      v-for="(unit, index) in units"
      :key="index"
      :unit="unit"
      :color="armyColor"
      :signal="signal"
      @unitOnClick="unitOnClick"
    ></unit-view>
  </div>
</template>

<script>
import UnitView from "./UnitView";
export default {
  components: {
    UnitView,
  },
  props: {
    units:{},
    armyColor:{},
    // 信号
    signal:{

    }
  },
  created() {},
  methods: {
    unitOnClick(unit) {
      unit.color = this.armyColor;
      this.$emit("unitOnClick", unit);
    },
  },
};
</script>

<style lang="scss" scoped>
  /deep/ .unit-view-list{
    position: absolute
  }
</style>