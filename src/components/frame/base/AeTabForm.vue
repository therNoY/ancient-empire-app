<!-- 包含tab分页的form -->
<template>
  <div style="width: 100%">
    <uni-segmented-control
      :current="currentActiveTab"
      :values="tabItems"
      style-type="text"
      active-color="#4993a0"
      @clickItem="onClickTab"
      class="tabFontStyle"
    />
    <div v-for="(config, tab) in tabFormConfig" :key="tab">
      <ae-form
        v-model="showDataValue"
        v-if="tabItems[currentActiveTab] === tab"
        ref="baseForm"
        :signal="signal"
        :templateId="templateId"
        :edit="edit"
        :hasBorder="hasBorder"
        :formConfig="config"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formConfig: {
      type: Array,
    },
    edit: {
      type: Boolean,
      default: true,
    },
    dataObj: {
      type: Object,
      default: null,
    },
    closeBind: {
      type: Boolean,
      default: false,
    },
    signal: {
      type: Number,
      default: 0,
    },
    hasBorder: {
      type: Boolean,
      default: false,
    },
    templateId: {},
    defaultActiveName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      tabFormConfig: {},
      activeName: "",
      currentActiveTab: 0,
      showDataValue:{},
      tabItems: [],
    };
  },
  methods: {
    onClickTab({ currentIndex }) {
      this.currentActiveTab = currentIndex;
    },
    getFormData() {
      let res = {};
      if (this.$refs.baseForm && this.$refs.baseForm.length > 0) {
        for (let formComp of this.$refs.baseForm) {
          res = Object.assign(res, formComp.getFormData());
        }
      }
      return res;
    },
  },
  created() {
    this.activeName = this.defaultActiveName;
    let tabFormConfig = {};
    for (let config of this.formConfig) {
      if (!config.tab) {
        config.tab = "";
      }
      if (!tabFormConfig[config.tab]) {
        tabFormConfig[config.tab] = [];
      }
      if (!this.activeName) {
        this.activeName = config.tab;
      }
      tabFormConfig[config.tab].push(config);
      if (this.tabItems.indexOf(config.tab) < 0) {
        this.tabItems.push(config.tab);
      }
    }
    this.tabFormConfig = tabFormConfig;
    this.showDataValue = this.dataObj;
    this.$appHelper.bindPage2Global(this, "AeTabForm");
  },
};
</script>

<style>
</style>
