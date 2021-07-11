<!--地图预览-->
<template>
  <ae-base-dialog
    id="mapPreview"
    :title="mapName"
    :value="showModel"
    setFullScreen
    @close="close"
    width="600px"
    mainPadding="0"
  >
    <movable-area
      class="preview-map-area"
      v-if="value && currentMap && currentMap.hasOwnProperty('regions')"
      :style="{
        width: $uni.isH5 ? h5Style.width : mpStyle.width,
        height: $uni.isH5 ? h5Style.height : mpStyle.height,
      }"
    >
      <movable-view
        direction="all"
        class="preview-map-view"
        :style="{ width: mapStyle.width, height: mapStyle.height }"
        :x="x"
        :y="y"
        :damping="50"
      >
        <region-view-list
          ref="regionViewList"
          :regions="currentMap.regions"
          :row="currentMap.row"
          :column="currentMap.column"
        ></region-view-list>
        <tomb-view v-if="currentMap.tombs" :tombs="currentMap.tombs" />
        <unit-view-list :units="currentMap.units"></unit-view-list>
        <point-view
          v-if="currentMap.currPoint"
          :point="currentMap.currPoint"
        ></point-view>
      </movable-view>
    </movable-area>
  </ae-base-dialog>
</template>

<script>
import { GetUserMapWithConfig, GetRecordById } from "../../api";
import PointView from "../map_base/PointView.vue";
import RegionViewList from "../map_base/RegionViewList.vue";
import TombView from "../map_base/TombView.vue";
import UnitViewList from "../map_base/UnitViewList.vue";
import dialogShow from "@/mixins/frame/dialogShow.js";

export default {
  mixins: [dialogShow],
  components: {
    RegionViewList,
    UnitViewList,
    TombView,
    PointView,
  },
  /**
   * props设置默认值 指定类型
   */
  props: {
    mapId: {
      // 地图ID
      default: "",
    },
    armyConfigList: {
      type: Array,
      default: () => [],
    },
    map: {
      // 直接传地图进来
      default: null,
    },
    isRecord: {
      // 是否是存档 默认不是
      type: Boolean,
      default: false,
    },
    value: {
      default: false,
    },
  },
  data() {
    return {
      currentMap: {},
      x: 0,
      y: 0,
      mpStyle: {},
      dialogWidth: undefined,
    };
  },
  created() {
    this.$appHelper.bindPage2Global(this, "MapPreview");
  },
  computed: {
    h5Style() {
      return {
        width: "550px",
      };
    },
    mapStyle() {
      return {
        width: this.$appHelper.getMapSize(this.currentMap.column),
        height: this.$appHelper.getMapSize(this.currentMap.row),
      };
    },
    mapName() {
      if (this.currentMap && this.currentMap.map_name) {
        return this.currentMap.map_name;
      } else {
        return "";
      }
    },
  },
  methods: {
    beforeDialogCreate() {
      this.initMapStyle();
      this.initMap();
      return true;
    },
    initMapStyle() {
      this.mpStyle.width = this.$uni.screenWidth + "px";
      this.mpStyle.height = this.$uni.screenHeigh - 40 + "px";
    },
    initMap() {
      if (this.map) {
        this.currentMap = this.map;
      } else if (this.mapId) {
        if (this.isRecord) {
          GetRecordById(this.mapId).then(({ res_val }) => {
            let currentMap = {};
            currentMap.regions = res_val.game_map.regions;
            currentMap.tombs = res_val.tomb_list;
            currentMap.row = res_val.game_map.row;
            currentMap.column = res_val.game_map.column;
            currentMap.map_name = res_val.record_name;
            currentMap.currPoint = res_val.curr_point;
            currentMap.units = [];
            for (let army of res_val.army_list) {
              army.units.forEach((unit) => {
                unit["color"] = army["color"];
                unit["id"] = unit["type_id"];
              });
              currentMap.units = currentMap.units.concat(army.units);
            }
            this.currentMap = currentMap;
          });
        } else {
          let args = {};
          args.map_id = this.mapId;
          args.army_config_list = this.armyConfigList;
          GetUserMapWithConfig(args).then(({ res_val }) => {
            this.currentMap = res_val;
          });
        }
      }
    },
    close() {
      this.currentMap = {};
      this.$emit("input", false);
    },
  },
};
</script>

<style lang="scss" >
#mapPreview {
  .preview-map-area {
    /* #ifndef H5 */
    width: 100%;
    height: 80%;
    padding: 2%;
    float: left;
    /* #endif */
    /* #ifdef H5 */
    height: 400px;
    max-height: 400px;
    overflow-x: scroll;
    overflow-y: scroll;
    position: relative;
    /* #endif */
  }
  .preview-map-view {
    position: absolute;
    float: left;
    img {
      float: left;
    }
  }
}
</style>
