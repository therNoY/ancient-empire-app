<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      :title="$t('tm.chooseTemplate')"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      :titleSwitchSelect="titleSwitchSelect"
      :initQueryDataGrid="initQueryDataFunction"
      :footerButtons="footerButtonList"
      :tableConfig="tableConfig"
      :width="$uni.isH5 ? 40 : 60"
      page
    >
    </ae-complex-dialog>
    <template-detail
      v-model="showTempDetail"
      :TemplateDetail="currentTemp"
      model="no"
    ></template-detail>
  </div>
</template>

<script>
import { GetUserTemplate, GetUserAttentionTemp } from "@/api";

import dialogShow from "@/mixins/frame/dialogShow.js";
import TemplateDetail from "./TemplateDetail.vue";

const showBindUnitRender = function (h, params) {
  return h(
    "previewUnitList",
    { props: { unit_list: params.bind_uint_list, showNum: 15 } },
    ""
  );
};

export default {
  mixins: [dialogShow],
  components: { TemplateDetail },
  props: {},
  data() {
    return {
      titleSwitchSelect: {
        type: "switchSelect",
        key: "queryType",
        default: "1",
        des: "",
        items: [
          { key: "1", value: this.$t("tm.myTemplate"), query: GetUserTemplate },
          {
            key: "2",
            value: this.$t("c.myDownload"),
            query: GetUserAttentionTemp,
          },
        ],
      },
      showItem: ["template_name", showBindUnitRender],
      showTitle: [this.$t("tm.templateName"), this.$t("tm.unitPreview")],
      footerButtonList: [
        { name: this.$t("c.sure"), action: this.selectTemp },
        { name: this.$t("c.desc"), action: this.showDetail },
      ],
      tableConfig: {
        1: { style: { width: "50%" } },
      },
      showTempDetail: false,
      currentTemp: {},
      initQueryDataFunction: (condition) => GetUserTemplate(condition),
    };
  },
  created() {
  },
  methods: {
    showDetail() {
      console.log("查看详情");
      this.currentTemp = JSON.parse(
        JSON.stringify(this.$refs.aeDialog.getDataGridSelect())
      );
      this.showTempDetail = true;
    },
    selectTemp() {
      this.currentTemp = this.$refs.aeDialog.getDataGridSelect();
      this.$emit(
        "onSelect",
        this.currentTemp.id,
        this.currentTemp.template_name
      );
      this.$emit("input", false);
    },
  },
  computed: {},
};
</script>

<style>
</style>
