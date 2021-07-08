<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      :title="$t('mm.title')"
      v-model="showModel"
      :showItem="showItem"
      :showTitle="showTitle"
      :titleSwitchSelect="titleSwitchSelect"
      :initQueryDataGrid="initQueryDataFunction"
      :footerButtons="footerButtonList"
      :width="65"
      showSearch
      @titleSwitchSelectChange="switchSelectChange"
      page
      setFullScreen
    >
    </ae-complex-dialog>

    <template-detail
      ref="TemplateDetail"
      v-model="showTempDetail"
      :TemplateDetail="TemplateDetail"
      model="no"
    ></template-detail>

    <map-preview v-model="showMapDetail" :mapId="currentMap.map_id">
    </map-preview>

    <start-comment ref="startComment" @ok="handleDownload" />
  </div>
</template>

<script>
import {
  GetUserMapList,
  DownloadMap,
  DelDownloadMap,
  DelUserMap,
  GetUserDownloadMap,
  GetWorldMapList,
  UpdateMapVersion,
} from "@/api";
import StartComment from "../frame/StartComment.vue";
import dialogShow from "../../mixins/frame/dialogShow.js";
import TemplateDetail from "../template_mange/TemplateDetail.vue";
import MapPreview from "../frame/MapPreview.vue";

export default {
  mixins: [dialogShow],
  components: {
    TemplateDetail,
    MapPreview,
    StartComment,
  },
  props: {},
  data() {
    return {
      titleSwitchSelect: {
        type: "switchSelect",
        key: "queryType",
        default: "1",
        des: "",
        items: [
          { key: "1", value: this.$t("e.myMap"), query: GetUserMapList },
          {
            key: "2",
            value: this.$t("c.myDownload"),
            query: GetUserDownloadMap,
          },
          {
            key: "3",
            value: this.$t("mm.downloadMap"),
            query: GetWorldMapList,
          },
        ],
      },
      showItem: [
        "map_name",
        "template_name",
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
        this.$t("mm.mapName"),
        this.$t("tm.templateName"),
        this.$t("c.author"),
        this.$t("c.version"),
        this.$t("c.updateTime"),
        this.$t("c.downloadCount"),
        this.$t("c.score"),
      ],
      showTempDetail: false,
      TemplateDetail: {},
      showMapDetail: false,
      currentMap: {},
      model: "myMap",
      initQueryDataFunction: null,
    };
  },
  created() {
    this.initQueryDataFunction = GetUserMapList;
  },
  methods: {
    handleDownload(commend) {
      let map = this.$refs.aeDialog.getDataGridSelect();
      let args = Object.assign(map, {});
      args.map_start = commend.start;
      args.map_comment = commend.comment;
      DownloadMap(args).then((resp) => {
        this.$appHelper.successMsg(this.$t("c.downloadSuccess"));
        this.flushData();
      });
    },
    flushData() {
      this.$refs.aeDialog.flushData();
    },
    previewMap() {
      this.currentMap = this.$refs.aeDialog.getDataGridSelect();
      this.showMapDetail = true;
    },
    switchSelectChange(value) {
      if (value == "1") {
        this.model = "myMap";
      } else if (value == "2") {
        this.model = "myDownload";
      } else if (value == "3") {
        this.model = "download";
      }
    },
    goEditMap() {
      this.currentMap = this.$refs.aeDialog.getDataGridSelect();
      const mapId = this.currentMap.map_id;
      uni.redirectTo({
        url: "map_manger/MapEdit?mapId=" + mapId,
        complete: (resp) => {
          console.log("跳转成功");
        },
      });
    },
    delUserMap() {
      let userMap = this.$refs.aeDialog.getDataGridSelect();
      let _this = this;
      this.$appHelper.showTip(this.$t("c.deleteTip"), () => {
        if (_this.model == "myMap") {
          DelUserMap(userMap.uuid).then((resp) => {
            _this.$appHelper.infoMsg(this.$t("c.deleteSuccess"));
            _this.flushData();
          });
        } else if (_this.model == "myDownload") {
          let args = {};
          args.map_id = userMap.uuid;
          DelDownloadMap(args).then((resp) => {
            _this.$appHelper.infoMsg(this.$t("c.deleteSuccess"));
            _this.flushData();
          });
        }
      });
    },
    updateMapVersion() {
      let userMap = this.$refs.aeDialog.getDataGridSelect();
      if (userMap.max_version && userMap.max_version > userMap.version) {
        let args = { map_id: userMap.map_id };
        UpdateMapVersion(args).then((resp) => {
          this.$appHelper.successMsg(this.$t("c.downloadSuccess"));
          this.flushData();
        });
      } else {
        this.$appHelper.warningMsg(this.$t("c.cannotUpdate"));
      }
    },
  },
  computed: {
    footerButtonList() {
      let footerButtonList = [];
      footerButtonList.push({
        name: this.$t("c.preview"),
        action: this.previewMap,
      });
      if (this.model == "myMap") {
        footerButtonList.push({
          name: this.$t("c.change"),
          action: this.goEditMap,
        });
        footerButtonList.push({
          name: this.$t("c.delete"),
          action: this.delUserMap,
        });
      } else if (this.model == "myDownload") {
        footerButtonList.push({
          name: this.$t("c.update"),
          action: this.updateMapVersion,
        });
        footerButtonList.push({
          name: this.$t("c.delete"),
          action: this.delUserMap,
        });
      } else if (this.model == "download") {
        footerButtonList.push({
          name: this.$t("c.download"),
          action: () => this.$refs.startComment.showComment(),
        });
      }
      return footerButtonList;
    },
  },
};
</script>

<style>
</style>
