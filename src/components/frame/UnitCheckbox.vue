<!--单位多选-->
<template>
  <div class="unit-check-box">
    <div class="unit-check-box-added">
      <div
        class="unit-check-box-added-item"
        v-for="(unit, index) in localUnitList"
        :key="index"
      >
        <ae-click-point
          :disabled="disabled"
          @clickPoint="removeUnitFromList(unit, index)"
        >
          <unit style="width: 30px" :unit_id="unit.id"></unit>
        </ae-click-point>
      </div>
      <div>
        <img
          class="fixed-img"
          src="../../assets/images/assist/add.png"
          @click="showAddAbleUnit"
        />
      </div>
    </div>

    <unit-choose-list
      ref="unitChooseList"
      :dialog_title="dialog_title"
      :unit_list="addAbleUnitList"
      @clickUnit="addUnit"
    ></unit-choose-list>
  </div>
</template>

<script>
import { GetAddTempAbleUnit } from "@/api";
import Unit from "./Unit.vue";
import UnitChooseList from "./UnitChooseList.vue";
export default {
  components: {
    Unit,
    UnitChooseList,
  },
  props: {
    template_id: {},
    dialog_title: {
      type: String,
      default() {
        return uni.$t("tm.addUnit");
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "blue",
    },
    value: {
      type: Array,
    },
  },
  data() {
    return {
      removeList: {},
      localUnitList: [],
      addAbleUnitList: [],
    };
  },
  methods: {
    // 移除单位
    removeUnitFromList(unit, index) {
      this.localUnitList.splice(index, 1);
      this.$emit("input", this.localUnitList);
    },
    // 展示可以添加的模板
    showAddAbleUnit() {
      let args = {
        template_id: this.template_id,
        filter: this.localUnitList.map((unit) => unit.id),
      };
      GetAddTempAbleUnit(args).then(({ res_val }) => {
        this.$refs.unitChooseList.show = true;
        this.addAbleUnitList = res_val;
      });
    },
    addUnit(unit) {
      this.$refs.unitChooseList.show = false;
      this.localUnitList.push(unit);
      this.$emit("addUnit", unit);
      this.$emit("input", this.localUnitList);
    },
  },
  created() {
    this.localUnitList = this.value;
  },
};
</script>

<style lang="scss" scoped>
.unit-check-box {
  .unit-check-box-added {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    flex-wrap: wrap;
    .unit-check-box-added-item {
      padding-top: 2%;
      padding-right: 13px;
    }
  }
}
</style>
