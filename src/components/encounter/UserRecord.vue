<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      :title="$t('lg.chooseRecord')"
      :initQueryDataGrid="queryDataFunction"
      :footerButtons="footerButtons"
      :width="$uni.isH5 ? 48 : 70"
      showSearch
      page
    >
    </ae-complex-dialog>
    <map-preview v-model="showPreview" :mapId="mapId" isRecord></map-preview>
  </div>
</template>

<script>
import {
  GetUserRecordList,
  DelUserRecord,
} from "@/api";
import {startRecordGame} from "../../utils/gameHelper"
import dialogShow from "../../mixins/frame/dialogShow.js";
import MapPreview from "../frame/MapPreview.vue";
export default {
  components: { MapPreview },
  mixins: [dialogShow],
  props: {},
  data() {
    return {
      queryDataFunction: null,
      footerButtons: [
        { name: this.$t("lg.continue"), action: this.continueRecord },
        { name: this.$t("c.preview"), action: this.preview },
        { name: this.$t("c.delete"), action: this.delUserRecord },
      ],
      showTitle: [this.$t("c.name"), this.$t("c.createTime")],
      showItem: ["record_name", "create_time"],
      showPreview: false,
      mapId: null,
    };
  },
  created() {
    this.queryDataFunction = GetUserRecordList;
  },
  methods: {
    preview() {
      let record = this.$refs.aeDialog.getDataGridSelect();
      this.mapId = record.uuid;
      this.showPreview = true;
    },
    delUserRecord() {
      this.$appHelper.showTip(this.$t("c.deleteTip"), () => {
        let record = this.$refs.aeDialog.getDataGridSelect();
        DelUserRecord(record.uuid).then((resp) => {
          this.$appHelper.infoMsg(this.$t("c.deleteSuccess"));
          this.$refs.aeDialog.flushData();
        });
      });
    },
    /**
     * 继续一局单机游戏
     * 1.创建ws连接,
     * 2.后台根据地图和游戏类型生成一个游戏上下文,
     * 3.可以开始游戏
     */
    continueRecord() {
      let record = this.$refs.aeDialog.getDataGridSelect();
      let args = {};
      args.uuid = record.uuid;
      startRecordGame(args);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
