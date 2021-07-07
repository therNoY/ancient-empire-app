<template>
  <div>
    <ae-complex-dialog
      ref="mainDiaglog"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      title="监控"
      :titleButtons="titleButtonList"
      :initQueryDataGrid="queryDataFunction"
      :footerButtons="footerButtons"
      :width="70"
      setFullScreen
      showSearch
    ></ae-complex-dialog>

    <ae-base-dialog title="内存数据" v-model="showDataFlag">
      <div style="display: flex; align-items: center">
        <ae-tooltip :content="filterRule">
          <div style="color: white">过滤规则</div>
        </ae-tooltip>
        <ae-input
          style="width: 60%"
          v-model="filterExp"
          @onChange="changeFilter"
        ></ae-input>
        <ae-button style="width: 20%" @click="copy"
          >复制</ae-button
        >
      </div>
      <ae-button-list
        :buttonList="['示例1', '示例2']"
        :clickAction="[copy1, copy2]"
      ></ae-button-list>
      <div
        :style="{ height: $uni.screenHeigh / 2 + 'px' }"
        style="overflow: scroll; color: white"
      >
        {{ showDataJSON }}
      </div>
    </ae-base-dialog>

    <map-preview
      v-model="previewVisible"
      :map="previewMap"
      isRecord
    ></map-preview>
  </div>
</template>

<script>
import dialogShow from "@/mixins/frame/dialogShow.js";
import { GetMonitorRecordList, GetUserRecordInfo } from "@/api";
import { reRecordGame } from "../utils/gameHelper";
import MapPreview from "./frame/MapPreview.vue";
import AeTooltip from "./frame/base/AeTooltip.vue";
import AeButton from "./frame/base/AeButton.vue";
const rule =
  "以分号';'结尾,'&'区别不同的key,':'表示json下一个key,'!'表示不展示,'@'表示只取某个key或者数组的index";
export default {
  mixins: [dialogShow],
  components: { MapPreview, AeTooltip, AeButton },
  data() {
    return {
      footerButtons: [
        { name: "预览", action: this.preview },
        { name: "内存数据", action: this.showData },
        { name: "观战", action: this.watch },
      ],
      queryDataFunction: (query) => GetMonitorRecordList(query),
      showItem: [
        "uuid",
        "record_name",
        "create_user_id",
        "create_time",
        "status_machine",
        "sub_status_machine",
      ],
      titleButtonList: [
        { name: this.$t("common.flush"), action: this.flushData },
      ],
      showTitle: ["ID", "名称", "创建用户", "创建时间", "主状态", "子状态"],
      showDataJSON: "",
      showDataObj: {},
      filterRule: rule,
      filterExp: "",
      showDataFlag: false,
      previewMap: {},
      previewVisible: false,
    };
  },
  methods: {
    preview() {
      let record = this.$refs.mainDiaglog.getDataGridSelect();
      GetUserRecordInfo(record.uuid).then(({ res_val }) => {
        this.previewMap = {};
        this.previewMap.regions = res_val.game_map.regions;
        this.previewMap.tombs = res_val.tomb_list;
        this.previewMap.row = res_val.game_map.row;
        this.previewMap.column = res_val.game_map.column;
        this.previewMap.map_name = "预览";
        let army_list = res_val.army_list;
        this.previewMap.units = [];
        for (let army of army_list) {
          army.units.forEach((unit) => {
            unit["color"] = army["color"];
            unit["id"] = unit["type_id"];
          });
          this.previewMap.units = this.previewMap.units.concat(army.units);
        }
        this.previewVisible = true;
      });
    },
    showData() {
      let record = this.$refs.mainDiaglog.getDataGridSelect();
      GetUserRecordInfo(record.uuid).then(({ res_val }) => {
        this.showDataJSON = res_val;
        this.showDataObj = res_val;
        this.showDataFlag = true;
        this.filterExp = null;
      });
    },
    watch() {
      let record = this.$refs.mainDiaglog.getDataGridSelect();
      reRecordGame(record.uuid);
    },
    changeFilter(exp) {
      if (exp && exp.endsWith(";")) {
        exp = exp.substring(0, exp.length - 1);
        console.log(exp);
        let newJson = JSON.parse(JSON.stringify(this.showDataObj));
        let fieldKey = exp.split("&");
        for (const key of fieldKey) {
          if (key.startsWith("!")) {
            key = key.substring(1);
            if (newJson[key]) {
              delete newJson[key];
            }
          } else if (key.startsWith("@")) {
            key = key.substring(1);
            newJson = newJson[key];
          }
        }
        this.showDataJSON = newJson;
      }
    },
    flushData() {
      this.$refs.mainDiaglog.flushData();
    },
    copy1() {
      this.copy("!game_map&!curr_unit&!curr_region;");
    },
    copy2() {
      this.copy("@army_list&@0&@units;");
    },
    copy(value) {
      if (!value) {
        value = JSON.stringify(this.showDataJSON)
      }
      var input = document.createElement("input");
      input.setAttribute("readonly", "readonly");
      input.setAttribute("value", value);
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      this.$appHelper.successMsg("复制成功");
    },
  },
  created() {
    this.$appHelper.bindPage2Global(this, "Monitor");
  },
};
</script>

<style>
</style>