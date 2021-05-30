<template>
  <ae-base-dialog
    id="mapPreview"
    :title="mapName"
    :value="showModel"
    setFullScreen
    @close="close"
    mainPadding="0"
    :width="$appHelper.getMapSize(currentMap.column)"
  >
    <movable-area
         class="main_map"
         v-if="value && currentMap && currentMap.hasOwnProperty('regions')"
         :style='{width: mapContainer.width, maxWidth: mapContainer.maxWidth, height:mapContainer.height}'>
      <movable-view
          direction="all"
          class="preview_map"
          :style='{width: mapStyle.width, height: mapStyle.height,}'
          :x="x"
          :y="y"
          :damping="50"
          @change="onChange">
        <region-view-list
            ref="regionViewList"
            :regions="currentMap.regions"
            :row="currentMap.row"
            :column="currentMap.column"
        ></region-view-list>
        <tomb-view v-if="currentMap.tombs" :tombs="currentMap.tombs"/>
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
      x:0,
      y:0,
      maxX:0,
      minY:0,
      old: {
        x: 0,
        y: 0,
      }
    };
  },
  created() {
    this.initMap();
    this.$appHelper.bindPage2Global(this, "MapPreview");
  },
  computed: {
    mapContainer(){
      // #ifdef H5
      return {
        width:(this.currentMap.column * 24 > 600 ? 600 : this.currentMap.column * 24) + "px",
        maxWidth:(this.currentMap.column * 24 > 600 ? 600 - 12 : this.currentMap.column * 24 - 12) + "px"
      };
      // #endif
      // #ifndef H5
      return {
        width:"100%",
        height:"100%",
        maxWidth:"100%"
      }
      // #endif
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
    beforeDialogCreate(){
      this.initMap();
    },
    onChange({detail}){
      // #ifndef H5
      if(detail.source === 'touch') {
        if(detail.y < this.minY) {
          // 解决view层不同步的问题
          this.x = this.old.x;
          this.y = this.old.y;
          this.$nextTick(function() {
            this.x =  0;
            this.y = this.minY
          })
        }
      }
      // #endif
    },
    initMap() {
      if (this.map) {
        this.currentMap = this.map;
      } else if (this.mapId) {
        if (this.isRecord) {
          GetRecordById(this.mapId).then(({res_val}) => {
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
              this.setMaxXAndMinY();
          })
        } else {
          let args = {};
          args.map_id = this.mapId;
          args.army_config_list = this.armyConfigList;
          GetUserMapWithConfig(args).then(({res_val}) => {
            this.currentMap = res_val;
            this.setMaxXAndMinY();
          })
        }
      }
    },
    setMaxXAndMinY(){
      this.x = 0;
      this.y = 0;
      let systemInfo = this.$store.getters.systemInfo;
      this.minY = -1 * (this.currentMap.row * 24 - systemInfo.screenHeight + 10);
      if (this.currentMap.column * 24 < systemInfo.screenWidth ) {
        this.x = (systemInfo.screenWidth - this.currentMap.column * 24) / 2;
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
  /deep/ .main_map{
    height: 400px;
    max-height: 400px;
    overflow-x: scroll;
    overflow-y: scroll;
    position: relative;
  }
  .preview_map {
    position: absolute;
    float: left;
    img {
      float: left;
    }
  }
  .ae-base-dialog-popup-main {
    padding: 0 !important;
  }
}
</style>
