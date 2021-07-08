<!--
    根据配置自动设置的表单
    支持类型 uniapp 不支持 is 只能使用v-if
    input, switchSelect, userMapSelect
 -->
<template>
  <div :class="['ae-form-content', hasBorder ? 'ae-form-border' : '']">
    <div
      v-for="(form, index) in formConfig"
      :key="index"
      :class="['ae-form-item', column === 2 ? 'half-width' : '']"
    >
      <div class="ae-form-label">
        {{ form.des }}
      </div>
      <div class="ae-form-real-camp">
        <div v-if="form.type === 'input'">
          <ae-input
            ref="aeInput"
            v-model="formData[form.key]"
            :type="form.style"
            :default="form.default"
            :width="80"
            :editAble="edit && !form.disabled"
          ></ae-input>
        </div>
        <div v-else-if="form.type === 'switchSelect'">
          <ae-switch-select
            ref="switchSelect"
            v-model="formData[form.key]"
            :default="form.default"
            :items="form.items"
            :editAble="edit && !form.disabled"
          ></ae-switch-select>
        </div>
        <div v-else-if="form.type === 'userMapSelect'">
          <user-map-select v-model="formData[form.key]"></user-map-select>
        </div>
        <div v-else-if="form.type === 'rangeSelect'">
          <ae-range-select
            :minValue="formData[form.minKey]"
            :maxValue="formData[form.maxKey]"
            :minKey="form.minKey"
            :maxKey="form.maxKey"
            :editAble="edit && !form.disabled"
            @minKeyChange="rangeMinKeyChange"
            @maxKeyChange="rangeMaxKeyChange"
          >
          </ae-range-select>
        </div>
        <div v-else-if="form.type === 'unitRadio'">
          <unit-radio
            :editAble="edit && !form.disabled"
            v-model="formData[form.key]"
            :unitList="form.unitList"
          ></unit-radio>
        </div>
        <div v-else-if="form.type === 'unitCheckbox'">
          <unit-checkbox
            :disabled="!edit || form.disabled"
            v-model="formData[form.key]"
          ></unit-checkbox>
        </div>
        <div v-else-if="form.type === 'editableAnimate'">
          <editable-animate
            :disabled="!edit || form.disabled"
            v-model="formData[form.key]"
            :signal="signal"
            :template_id="templateId"
          ></editable-animate>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UnitRadio from "../UnitRadio.vue";
import UnitCheckbox from "../UnitCheckbox.vue";
import UserMapSelect from "../../map_manger/UserMapSelect";
import EditableAnimate from "../EditableAnimate.vue";

export default {
  components: { UserMapSelect, UnitRadio, UnitCheckbox, EditableAnimate },
  props: {
    formConfig: {
      type: Array,
    },
    edit: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Object,
      default: null,
    },
    signal: {
      type: Number,
      default: 0,
    },
    column: {
      type: Number,
      default: 1,
    },
    templateId: {},
    hasBorder: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {},
    };
  },
  methods: {
    getFormData(data) {
      for (let config of this.formConfig) {
        if (config.type === "rangeSelect") {
        }
        if (config.require && !this.formData[config.key]) {
          this.$appHelper.infoMsg(config.des + this.$t("c.notNull"));
          throw new Error("数据" + config.des + "不完整");
        }
      }
      if (!data) {
        return this.formData;
      }
      for (let key of Object.keys(this.formData)) {
        data[key] = this.formData[key];
      }
      return data;
    },
    rangeMinKeyChange(value, key) {
      this.formData[key] = value;
    },
    rangeMaxKeyChange(value, key) {
      this.formData[key] = value;
    },
  },
  created() {
    if (this.value) {
      this.formData = JSON.parse(JSON.stringify(this.value));
    }
    this.$appHelper.bindPage2Global(this, "activeForm");
  },
  watch: {
    value() {
      if (this.value) {
        for (let key of Object.keys(this.value)) {
          if (this.value[key] != this.formData[key]) {
            this.formData[key] = this.value[key];
          }
        }
      }
    },
    formData(data) {
      this.$emit("input", data);
    },
  },
};
</script>

<style lang="scss"  scoped>
.ae-form-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .ae-form-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .ae-form-label {
      width: 20%;
      color: white;
      /* #ifdef H5*/
      font-size: 14px;
      /* #endif */
      /* #ifndef H5*/
      font-size: 0.65rem;
      /* #endif*/
    }
    .ae-form-real-camp {
      width: 80%;
    }
  }
  .half-width {
    width: 50%;
  }
}
.ae-form-border {
  padding: 2%;
  border-top: 2px #242424 solid;
  border-left: 2px #242424 solid;
  border-right: 2px #aaaaaa solid;
  border-bottom: 2px #aaaaaa solid;
}
</style>
