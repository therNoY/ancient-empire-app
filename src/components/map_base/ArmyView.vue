<template>
  <div>
    <unit-view-list
      v-for="(army, index) in armys"
      :key="index"
      :units="army.units"
      :armyColor="army.color"
      @unitOnClick="clickUnit"
      :signal="signal"
    ></unit-view-list>
  </div>
</template>

<script>
import UnitViewList from "./UnitViewList.vue";
export default {
  props: ["armys", "signal"],
  components: {
    UnitViewList,
  },
  computed: {},
  methods: {
    clickUnit(unit) {
      this.$emit("unitOnClick", unit);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>