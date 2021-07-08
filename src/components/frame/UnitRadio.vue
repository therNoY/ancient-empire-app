<!--
  单位单选组件
-->
<template>
  <div>
    <div class="unit-radio">
      <ae-click-point
        :disabled="!editAble"
        class="choose-unit"
        v-if="value"
        @clickPoint="deleteUnit"
      >
        <unit style="width: 30px" :unit_id="value" :color="color"></unit>
      </ae-click-point>
      <div>
        <img
          class="fixed-img"
          src="../../assets/images/assist/add.png"
          @click="chooseOtherUnit"
        />
      </div>
    </div>

    <unit-choose-list
      ref="unitChooseList"
      :dialog_title="$t('tm.chooseUnit')"
      :unit_list="chooseAbleUnit"
      @clickUnit="changeUnit"
    ></unit-choose-list>
  </div>
</template>

<script>
import { GetAddTempAbleUnit } from "@/api";
import Unit from "./Unit.vue";
import UnitChooseList from "./UnitChooseList.vue";
export default {
  components: { Unit, UnitChooseList },
  props: {
    value: {},
    template_id: {},
    color: {
      type: String,
      default: "blue",
    },
    editAble: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      chooseAbleUnit: [],
    };
  },

  methods: {
    chooseOtherUnit() {
      let args = {
        template_id: this.template_id,
        filter: [this.value],
      };
      GetAddTempAbleUnit(args).then(({ res_val }) => {
        this.$refs.unitChooseList.show = true;
        this.chooseAbleUnit = res_val;
        this.$refs.unitChooseList.show = true;
      });
    },
    changeUnit(unit) {
      this.$refs.unitChooseList.show = false;
      this.$emit("input", unit.id);
      this.$emit("changeUnit", unit.id);
    },
    deleteUnit() {
      this.$emit("input", null);
    },
  },
  created() {},
};
</script>

<style lang="scss" scope>
.unit-radio {
  display: flex;
  .choose-unit {
    margin-right: 16px;
  }
}
</style>
