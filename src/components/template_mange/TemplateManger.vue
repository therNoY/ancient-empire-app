<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      :title="$t('tm.title')"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      :tableConfig="tableConfig"
      :titleButtons="titleButtonList"
      :titleSwitchSelect="titleSwitchSelect"
      :initQueryDataGrid="initQueryDataFunction"
      :footerButtons="footerButtonList"
      :width="$uni.isH5 ? 65 : 75"
      @titleSwitchSelectChange="switchSelectChange"
      showSearch
      page
    >
    </ae-complex-dialog>
    <template-detail
      ref="templateDetail"
      v-model="showTempDetail"
      :templateDetail="currentTemp"
      :model="model"
      @saveOrDel="flushData"
      @downLoadTemp="downLoadTemp"
    ></template-detail>
  </div>
</template>

<script>
import {
  GetUserTemplate,
  GetUserDraftTemplate,
  GetUserAttentionTemp,
  GetDownloadAbleTemplate,
  DownloadTemplate,
} from "@/api";

import dialogShow from "@/mixins/frame/dialogShow.js";
import TemplateDetail from "./TemplateDetail.vue";

const showBindUnitRender = function (h, params) {
  return h(
    "previewUnitList",
    { props: { unit_list: params.bind_uint_list, showNum: 9 } },
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
          {
            key: "3",
            value: this.$t("tm.downLoadTemplate"),
            query: GetDownloadAbleTemplate,
          },
        ],
      },
      showItem: [
        "template_name",
        showBindUnitRender,
        "create_user_name",
        (h, p) => {
          if (p.max_version && p.max_version > p.version) {
            return h(
              "b",
              {},
              this.$t("c.thisVersion", p.version, p.max_version)
            );
          } else if (p.status == "0") {
            return h("div", {}, this.$t("c.draftVersion", p.version));
          } else {
            return h("div", {}, this.$t("c.latestVersion", p.version));
          }
        },
        "update_time",
        "down_load_count",
        "start_count",
      ],
      showTitle: [
        this.$t("tm.templateName"),
        this.$t("tm.unitPreview"),
        this.$t("c.author"),
        this.$t("c.version"),
        this.$t("c.updateTime"),
        this.$t("c.downloadCount"),
        this.$t("c.score"),
      ],
      tableConfig: {
        1: { style: { width: "20%" } },
      },
      titleButtonList: [
        { name: this.$t("c.create"), action: this.clickAddButton },
      ],
      showTempDetail: false,
      currentTemp: {},
      model: "myTemp",
      initQueryDataFunction: (condition) => GetUserTemplate(condition),
    };
  },
  created() {
    this.$appHelper.bindPage2Global(this, "templateManger");
  },
  methods: {
    clickAddButton() {
      let params = {};
      GetUserDraftTemplate(params).then(({ res_val }) => {
        this.currentTemp = res_val;
        this.model = "myTemp";
        this.showTempDetail = true;
      });
    },
    flushData() {
      this.$refs.aeDialog.flushData();
    },
    showDetail() {
      console.log("查看详情");
      this.currentTemp = JSON.parse(
        JSON.stringify(this.$refs.aeDialog.getDataGridSelect())
      );
      this.showTempDetail = true;
    },
    switchSelectChange(value) {
      if (value == "1") {
        this.model = "myTemp";
      } else if (value == "2") {
        this.model = "myDownload";
      } else if (value == "3") {
        this.model = "download";
      }
    },
    delTemp() {
      console.log("删除模板");
      this.$refs.templateDetail.delTemp(
        this.$refs.aeDialog.getDataGridSelect()
      );
    },

    downLoadTemp(downloadComment) {
      let args = {};
      args.template_id = this.$refs.aeDialog.getDataGridSelect().id;
      args.template_start = downloadComment.start;
      args.template_comment = downloadComment.comment;
      DownloadTemplate(args).then(({ res_code }) => {
        this.$appHelper.infoMsg(this.$t("c.downloadSuccess"));
        this.flushData();
      });
    },

    showComment() {
      this.$refs.templateDetail.$refs.startComment.showComment();
    },
  },
  computed: {
    footerButtonList() {
      let footerButtonList = [];
      footerButtonList.push({
        name: this.$t("c.desc"),
        action: this.showDetail,
      });
      if (this.model === "myTemp") {
        footerButtonList.push({
          name: this.$t("c.delete"),
          action: this.delTemp,
        });
      } else if (this.model === "myDownload") {
        footerButtonList.push({
          name: this.$t("c.delete"),
          action: this.delTemp,
        });
      } else if (this.model === "download") {
        footerButtonList.push({
          name: this.$t("c.download"),
          action: this.showComment,
        });
      }
      return footerButtonList;
    },
  },
};
</script>

<style>
</style>
