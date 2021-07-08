<template>
  <div>
    <ae-base-dialog :title="dialog_title" v-model="show">
      <div style="float: left">
        <div
          class="unit-choose-list-item"
          @click="clickUnit(unit)"
          v-for="(unit, index) in unit_list"
          :key="index"
        >
          <ae-tooltip :content="unit.description">
            <unit :unit_id="unit.id" :color="color"></unit>
          </ae-tooltip>
        </div>
      </div>
    </ae-base-dialog>
  </div>
</template>

<script>
import Unit from "./Unit.vue";

export default {
  components: { Unit },
  props: {
    color: {
      type: String,
      default: "blue",
    },
    dialog_title: {
      type: String,
      default: "选择其他单位",
    },
    unit_list: {
      type: Array,
    },
  },
  methods: {
    clickUnit(unit) {
      this.$emit("clickUnit", unit);
    },
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.unit-choose-list-item {
  float: left;
  width: 48px;
  height: 48px;
}
</style>