<!--预览单位列表-->
<template>
  <div>
    <div v-for="(unit, index) in unit_list" :key="index">
      <unit v-if="index < showNum" class="showUnit" :unit_id="unit.id"></unit>
    </div>
  </div>
</template>

<script>
import Unit from "./Unit.vue";

export default {
  components: { Unit },
  props: {
    unit_list: {
      type: Array,
    },
    showNum: {
      type: Number,
      default: 9,
    },
  },
  data() {
    return {
      showList: [],
    };
  },
  created() {
    if (this.unit_list.length > this.showNum) {
      let array = [];
      for (let i = 0; i < this.showNum; i++) {
        array.push(this.unit_list[i].id);
      }
      this.showList = array;
    } else {
      this.showList = this.unit_list.map((a) => a.id);
    }
  },
};
</script>

<style lang="scss" scoped>
.showUnit {
  float: left;
  width: 19px;
}
</style>