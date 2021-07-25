<template>
  <div style="width: 100%; height: 100%; text-align: center">
    <div class="map-edit">
      <!--可选单位-->
      <div class="map-edit-unit" v-if="!isMobileStyle && flushUnitFlag">
        <div style="margin-top: 20px">
          <ae-switch-select v-model="unitColor" :items="armyType" />
        </div>
        <div>
          <img
            v-for="(unit, key) in initMapInfo.unit_mes_list"
            :key="key"
            :class="['map-edit-select', imgSize + '-img-size']"
            :src="$appHelper.getUnitImg(unit.id, unitColor)"
            @click="getUnit(unit)"
          />
        </div>
        <div v-if="selectUnit && selectUnit.id" class="select-unit">
          <ae-border padding="20px" class="show-unit-detail-img">
            <unit :unit_id="selectUnit.id" :color="unitColor"></unit>
          </ae-border>
        </div>
        <div v-if="selectUnit && selectUnit.id" class="select_desc">
          {{ selectUnit.name }}:{{ selectUnit.description }}
        </div>
      </div>

      <!--移动版风格-->
      <div class="mobile-map-edit" v-if="isMobileStyle">
        <ae-border class="mobile-map-edit-content">
          <div style="margin-buttom: 20px">
            <scroll-view
              scroll-y="true"
              slot="main"
              :style="{ height: containerStyle.height }"
            >
              <ae-switch-select
                :width="100"
                size="small"
                v-if="showSelectUnit"
                v-model="unitColor"
                :items="armyType"
              />
              <ae-switch-select
                v-else
                :width="100"
                size="small"
                v-model="regionColor"
                :items="regionType"
              />
              <div v-if="showSelectUnit">
                <div
                  v-for="(unit, key) in initMapInfo.unit_mes_list"
                  :key="key"
                >
                  <img
                    :class="[
                      'map-edit-select',
                      unit.id == selectUnit.id ? 'map-edit-selected' : '',
                    ]"
                    :src="$appHelper.getUnitImg(unit.id, unitColor)"
                    @click="getUnit(unit)"
                  />
                </div>
              </div>
              <div v-else>
                <div
                  v-for="(region, index) in initMapInfo.region_mes"
                  :key="index"
                >
                  <img
                    :class="[
                      'map-edit-select',
                      region.id == selectRegion.id ? 'map-edit-selected' : '',
                    ]"
                    :src="$appHelper.getRegionImg(region.type, regionColor)"
                    @click="getRegion(region)"
                  />
                </div>
              </div>
            </scroll-view>
          </div>
        </ae-border>
      </div>

      <!--操作地图-->
      <div class="game-core-container">
        <movable-area
          class="main-area"
          :style="{
            width: containerStyle.width,
            height: containerStyle.height,
          }"
        >
          <div style="position: relative">
            <movable-view
              :x="0"
              :y="0"
              :damping="50"
              direction="all"
              class="main-view"
              :style="{
                width: mapColumn * 24 + 'px',
                height: $appHelper.getMapSize(mapRow),
              }"
            >
              <div
                class="map"
                :style="{
                  width: $appHelper.getMapSize(mapColumn),
                  height: $appHelper.getMapSize(mapRow),
                }"
              >
                <img
                  :class="['unit_img', imgSize + '-img-size']"
                  v-for="(unit, index) in unitList"
                  :key="index"
                  :src="
                    $appHelper.getUnitImg(
                      unit.id ? unit.id : unit.type_id,
                      unit.color
                    )
                  "
                  :title="getUnitTitle(unit)"
                  :style="{
                    top: $appHelper.getUnitPosition(unit.row),
                    left: $appHelper.getUnitPosition(unit.column),
                  }"
                  @click="clickEditMapUnit(unit, index)"
                />
                <region-view-list
                  ref="regionViewList"
                  :regions="maps"
                  :row="mapRow"
                  :column="mapColumn"
                  showTitle
                  @clickRegion="clickEditMapRegion"
                />
              </div>
            </movable-view>
          </div>
        </movable-area>
        <ae-button-list
          v-if="!isMobileStyle"
          :factor="70"
          :buttonList="buttonList"
          :clickAction="mapEditActionList"
        ></ae-button-list>
        <div v-else class="mobile-map-edit-icon">
          <img
            :class="['icon-img', imgSize + '-img']"
            @click="goHome"
            src="../../assets/images/assist/icon_city.png"
          />
          <img
            :class="['icon-img', imgSize + '-img']"
            @click="showTemplateSelect"
            src="../../assets/images/assist/icon_setting.png"
          />
          <img
            :class="['edit-img', imgSize + '-edit-icon']"
            v-if="action == 'painting'"
            @click="changeAction"
            src="../../assets/images/assist/icon_painting.png"
          />
          <img
            :class="['edit-img', imgSize + '-edit-icon']"
            v-else
            @click="changeAction"
            src="../../assets/images/assist/icon_delete.png"
          />
          <img
            :class="['edit-img', imgSize + '-edit-icon']"
            @click="showSelectUnit = !showSelectUnit"
            src="../../assets/images/assist/icon_switch.png"
          />
          <img
            :class="['edit-img', imgSize + '-edit-icon']"
            @click="resetMap"
            src="../../assets/images/assist/icon_reset.png"
          />
          <img
            @click="setShowChangeMsg"
            :class="['icon-img', imgSize + '-img']"
            src="../../assets/images/assist/net.png"
          />
          <img
            :class="['icon-img', imgSize + '-img']"
            @click="setShowMapVisible"
            src="../../assets/images/assist/icons_my.png"
          />
        </div>
      </div>

      <!--可选地形-->
      <div class="map-edit-region" v-if="!isMobileStyle">
        <div style="margin-top: 20px">
          <ae-switch-select v-model="regionColor" :items="regionType" />
        </div>
        <div>
          <img
            v-for="(region, index) in initMapInfo.region_mes"
            :key="index"
            :class="['map-edit-select', imgSize + '-img-size']"
            :src="$appHelper.getRegionImg(region.type, regionColor)"
            @click="getRegion(region)"
          />
        </div>
        <div v-if="selectRegion && selectRegion.name" class="select_desc">
          {{ selectRegion.name }}:{{ selectRegion.description }}
        </div>
      </div>
    </div>

    <!--设置宽度弹出框 改变大小新建-->
    <ae-base-dialog
      :title="$t('me.setNewSize')"
      v-model="showSetNewMapInfo"
      :width="$uni.isH5 ? 30 : 40"
      showChoose
      @choose="createNewMapBySize(newMapColumn, newMapRow)"
    >
      <div class="reset-map-size">
        <div>
          <span>{{ $t("c.name") }}</span>
          <ae-input
            style="flex-grow: 2"
            v-model="currentMapInfo.map_name"
          ></ae-input>
        </div>
        <div>
          <span>{{ $t("me.width") }}</span>
          <uni-number-box
            v-model="newMapRow"
            :min="minArea"
            :max="maxArea"
            style="width: 70%"
            :step="1"
          />
        </div>
        <div>
          <span>{{ $t("me.height") }}</span>
          <uni-number-box
            v-model="newMapColumn"
            :min="minArea"
            :max="maxArea"
            style="width: 70%"
            :step="1"
          />
        </div>
      </div>
      <!--#ifdef H5-->
      <ae-button
        style="width: 60%; margin-left: 20%"
        @click="createNewMapBySize(newMapColumn, newMapRow)"
        >{{ $t("c.sure") }}</ae-button
      >
      <!--#endif-->
    </ae-base-dialog>

    <!--我的地图-->
    <ae-complex-dialog
      ref="myMap"
      v-model="showMapVisible"
      :showItem="showItem"
      showSearch
      :title="$t('e.myMap')"
      :initQueryDataGrid="queryFunction"
      :footerButtons="myMapEditButtonList"
      :width="$uni.isH5 ? 40 : 55"
      page
    >
    </ae-complex-dialog>

    <template-select
      v-model="showSelectTemp"
      @onSelect="createNewMapByTemplateId"
    ></template-select>

    <!--预览地图-->
    <map-preview
      v-model="previewVisible"
      :mapId="currPreviewMap.map_id"
    ></map-preview>

    <!--用于保存或者发布-->
    <ae-complex-dialog
      v-model="showChangeMsg"
      ref="baseSaveMap"
      :title="$t('me.saveMap')"
      :formConfig="baseMapFormConfig"
      :dataObj="currentMapInfo"
      :footerButtons="changMapInfoButtons"
    ></ae-complex-dialog>

    <base-lister />
  </div>
</template>

<script>
import {
  GetLastEditMap,
  SimpleDrawing,
  GetUserMapList,
  SaveUserMap,
  CreateDraftMap,
  ChangeUserSetting,
  GetUserMapById,
  GetUserTemplateBindUnit,
} from "@/api";
import BaseLister from "../BaseLister.vue";
import RegionViewList from "../map_base/RegionViewList";
import MapPreview from "../frame/MapPreview.vue";
import TemplateSelect from "../template_mange/TemplateSelect";
import Unit from "../frame/Unit";
import AeBorder from "../frame/base/AeBorder.vue";
import baseVar from "@/mixins/frame/baseVar.js";
const minAreaConst = 10;
const maxAreaConst = 50;
const armyType = [
  {
    key: "blue",
    value: "蓝色",
  },
  {
    key: "red",
    value: "红色",
  },
  {
    key: "green",
    value: "绿色",
  },
  {
    key: "black",
    value: "黑色",
  },
];
const regionType = [
  { key: "", value: "空" },
  {
    key: "blue",
    value: "蓝色",
  },
  {
    key: "red",
    value: "红色",
  },
  {
    key: "green",
    value: "绿色",
  },
  {
    key: "black",
    value: "黑色",
  },
];
export default {
  mixins: [baseVar],
  components: {
    RegionViewList,
    MapPreview,
    Unit,
    BaseLister,
    TemplateSelect,
    AeBorder,
  },
  data() {
    return {
      showSelectUnit: false,
      isMobileStyle: true,
      armyType: armyType,
      regionType: regionType,
      minArea: minAreaConst,
      maxArea: maxAreaConst,
      // 地图上的要被编辑的地图
      currentEditInfo: {},
      showSetNewMapInfo: false,
      mapRow: null,
      mapColumn: null,
      newMapColumn: null,
      newMapRow: null,
      queryFunction: (args) => GetUserMapList(args),
      showItem: ["map_name"],
      showMapVisible: false,
      previewVisible: false,
      showSelectTemp: false,
      initMapInfo: {},
      unitColor: "blue",
      regionColor: "",
      selectUnit: {},
      selectRegion: {},
      userSetting: {}, // 用户设定
      maps: [],
      // 有单位type 和 color 其他都没
      unitList: [],
      action: "painting", // 编辑模式
      currentMapInfo: {
        map_name: "",
        share: "1",
        map_id: null,
        template_id: null,
      },
      currPreviewMap: {}, // 准备预览的地图
      buttonList: [
        this.$t("c.home"),
        this.$t("c.create"),
        this.$t("me.painting"),
        this.$t("me.reset"),
        this.$t("c.save"),
        this.$t("me.myMap"),
      ],
      mapEditActionList: [
        this.goHome,
        this.showTemplateSelect,
        this.changeAction,
        this.resetMap,
        this.setShowChangeMsg,
        this.setShowMapVisible,
      ],
      myMapEditButtonList: [
        {
          name: this.$t("c.change"),
          action: this.editMap,
        },
        {
          name: this.$t("c.preview"),
          action: this.previewMap,
        },
      ],
      flushUnitFlag: true, // 帮助刷新
      currentTemplateId: null, // 当前模板ID

      showChangeMsg: false,
      baseMapFormConfig: [
        {
          type: "input",
          key: "map_name",
          des: this.$t("tm.templateName"),
        },
        {
          type: "switchSelect",
          key: "share",
          des: this.$t("tm.isShared"),
          items: [
            {
              key: "1",
              value: this.$t("tm.shared"),
            },
            {
              key: "0",
              value: this.$t("tm.notShared"),
            },
          ],
        },
      ],
      changMapInfoButtons: [
        {
          name: this.$t("c.saveDraft"),
          action: () => this.saveMap(0),
        },
        {
          name: this.$t("c.publicVersion"),
          action: () => this.saveMap(1),
        },
      ],
      containerStyle: {},
    };
  },
  methods: {
    initMapStyle() {
      // #ifdef H5
      this.containerStyle.width = "96%";
      this.containerStyle.height = this.$uni.screenHeigh - 100 + "px";
      this.isMobileStyle = this.$store.getters.setting.pc_style === "mp";
      // #endif
      // #ifndef H5
      this.containerStyle.width = "96%";
      this.containerStyle.height = this.$uni.screenHeigh - 40 + "px";
      this.isMobileStyle = true;
      // #endif
    },
    // 查看单位的说明
    getUnitTitle(unit) {
      return unit.row + "行" + unit.column + "列";
    },
    revertMap() {},
    previewMap() {
      this.currPreviewMap = this.$refs.myMap.getDataGridSelect();
      this.previewVisible = true;
    },
    setShowMapVisible() {
      this.showMapVisible = true;
    },
    setShowChangeMsg() {
      this.showChangeMsg = true;
    },
    showTemplateSelect() {
      this.showSelectTemp = true;
    },
    goHome() {
      this.$uni.redirectTo({
        url: "/components/Home",
        complete: (resp) => {
          console.log(resp);
        },
      });
    },
    // 用户点击单位
    getUnit(unit) {
      this.selectUnit = unit;
      this.selectRegion = {};
    },
    // 点击地形
    getRegion(region) {
      this.selectRegion = region;
      this.selectUnit = {};
    },
    // 改变行为
    changeAction() {
      if (this.action == "painting") {
        this.buttonList.splice(0, 0);
        this.buttonList[2] = "删除";
        this.action = "delete";
      } else {
        this.buttonList.splice(0, 0);
        this.buttonList[2] = "绘画";
        this.action = "painting";
      }
    },
    // 点击单位地形
    clickEditMapRegion(index) {
      // 首先获取当前点击的哪个位置
      this.currentEditInfo.index = index;
      if ((index + 1) % this.mapColumn == 0) {
        this.currentEditInfo.row = Math.floor((index + 1) / this.mapColumn);
        this.currentEditInfo.column = this.mapColumn;
      } else {
        this.currentEditInfo.row = Math.floor((index + 1) / this.mapColumn) + 1;
        this.currentEditInfo.column = (index + 1) % this.mapColumn;
      }
      console.log(this.currentEditInfo);
      // 判断现在的行为 是不是绘画
      if (this.action == "painting") {
        // 执行绘画逻辑
        this.doPainting();
      } else if (this.action == "delete") {
        // 删除就是画海
        this.selectRegion = JSON.parse(JSON.stringify(this.selectRegion));
        this.selectRegion["type"] = "sea";
        this.doPainting();
      }
    },
    // 点击已有的单位
    clickEditMapUnit(unit, index) {
      // 判断现在的行为 是不是绘画
      if (this.action == "painting") {
        // 执行绘画逻辑
        if (this.selectUnit.hasOwnProperty("type")) {
          // 原来已经存在改单位
          console.log("替换 单位");
          this.unitList[index].color = this.unitColor;
          this.unitList[index].type_id = this.selectUnit.id;
          this.unitList.splice(0, 0);
        } else {
          this.currentEditInfo.index =
            (unit.row - 1) * this.mapColumn + (unit.column - 1);
          this.doPainting();
        }
      } else if (this.action == "delete") {
        // 执行擦出逻辑
        console.log("删除" + index);
        this.unitList.splice(index, 1);
        this.getRegion(this.selectRegion);
      }
    },
    resetMap() {
      this.$appHelper.showTip(this.$t("me.reSetMapTip"), () => {
        for (let m of this.maps) {
          m.type = "sea";
        }
        this.unitList = [];
      });
    },
    // 获取新的初始化地图
    createNewMapBySize() {
      if (
        !this.currentMapInfo.map_name ||
        !this.newMapRow ||
        !this.newMapColumn
      ) {
        this.$appHelper.errorMsg("输入有误");
        return;
      }
      if (this.newMapRow < this.minArea || this.newMapColumn < this.minArea) {
        this.$appHelper.errorMsg(this.$t("me.minArea", this.minArea));
        return;
      }

      if (this.newMapRow > this.maxArea || this.newMapColumn > this.maxArea) {
        this.$appHelper.errorMsg(this.$t("me.maxArea", this.maxArea));
        return;
      }

      // 1. 保存用户的大小设定
      let args = {};
      args.map_init_row = this.newMapRow;
      args.map_init_column = this.newMapColumn;
      ChangeUserSetting(args);
      this.createNewMap({
        tempId: this.currentMapInfo.template_id,
        mapRow: this.newMapRow,
        mapColumn: this.newMapColumn,
        mapName: this.currentMapInfo.map_name,
      });
      this.showSetNewMapInfo = false;
    },
    // 执行绘画逻辑
    doPainting() {
      // 准备画人物
      if (this.selectUnit.hasOwnProperty("type")) {
        console.log("准备画单位");
        // 新增
        if (!this.unitList) {
          this.unitList = [];
        }
        let unit = {};
        unit.color = this.unitColor;
        unit.id = this.selectUnit.id;
        unit.row = this.currentEditInfo.row;
        unit.column = this.currentEditInfo.column;
        this.unitList.push(unit);
      } else if (this.selectRegion.hasOwnProperty("type")) {
        // 地形需要优化 异步画地形
        this.getSimpleDrawing(
          this.currentEditInfo.index,
          this.selectRegion.type
        );
      }
    },
    // 优化简单绘画
    async getSimpleDrawing(index, type) {
      let args = {};
      args.index = index;
      args.type = type;
      args.row = this.mapRow;
      args.column = this.mapColumn;
      args.region_list = this.maps;
      // 获取优化结果
      const resp = await SimpleDrawing(args);
      if (resp.res_code == 0) {
        let updateMaps = resp.res_val;
        for (let index in updateMaps) {
          this.updateMap(index, updateMaps[index]);
        }
      } else {
        console.error(resp.resp_mes);
      }
    },
    // 修改地图地形
    updateMap(index, type) {
      this.maps[index].type = type;
      this.maps[index].color = this.regionColor;
      console.log("修改index 和 type", index, type);
    },
    // 保存地图
    saveMap(optType) {
      let args = {};
      if (this.unitList) {
        for (let u of this.unitList) {
          if (u.id && !u.type_id) {
            u.type_id = u.id;
          }
        }
      }
      let saveData = this.$refs.baseSaveMap.getFormData();
      args.units = this.unitList;
      args.regions = this.maps;
      args.row = this.mapRow;
      args.column = this.mapColumn;
      args.opt_type = optType;
      args.uuid = saveData.map_id;
      args.share = saveData.share;
      args.map_name = saveData.map_name;
      SaveUserMap(args, true, false).then((resp) => {
        if (resp.res_code == 0) {
          this.$appHelper.infoMsg(this.$t("c.saveSuccess"));
          this.saveMapDialog = false;
        } else {
          this.$appHelper.errorMsg(resp.res_mes);
        }
        this.showChangeMsg = false;
        this.getLastEditMap();
      });
    },
    // 从创建过的地图里面选择编辑地图
    editMap(editMap) {
      if (!editMap) {
        this.currPreviewMap = this.$refs.myMap.getDataGridSelect();
        editMap = this.currPreviewMap;
      }
      GetUserMapById(editMap.map_id).then(({ res_val }) => {
        let userMap = res_val;
        this.maps = userMap.regions;
        this.mapColumn = userMap.column;
        this.mapRow = userMap.row;
        this.unitList = userMap.units;
        this.showMapVisible = false;
        this.currentMapInfo.map_name = userMap.map_name;
        this.currentMapInfo.share = userMap.share;
        this.currentMapInfo.map_id = userMap.uuid;
        if (res_val.template_id) {
          let args = {};
          args.template_id = res_val.template_id;
          GetUserTemplateBindUnit(args).then(({ res_val }) => {
            this.flushUnitFlag = false;
            this.initMapInfo.unit_mes_list = res_val.unit_mes_list;
            this.initMapInfo.region_mes = res_val.region_mes;
            this.$nextTick(() => {
              this.flushUnitFlag = true;
            });
          });
        }
      });
    },
    // 初始化
    createNewMap({ tempId, mapRow, mapColumn, mapName }) {
      let args = {};
      args.template_id = tempId;
      args.map_row = mapRow;
      args.map_column = mapColumn;
      args.map_name = mapName;
      CreateDraftMap(args).then(({ res_val }) => {
        this.currentMapInfo.map_name = mapName;
        // 默认共享
        this.currentMapInfo.share = "1";
        this.initMapInfo = res_val;
        this.userSetting = res_val.user_setting;
        this.unitList = this.initMapInfo.un_save_map.units;
        this.currentMapInfo.map_id = this.initMapInfo.un_save_map.uuid;
        if (!this.unitList) {
          this.unitList = [];
        }
        this.maps = this.initMapInfo.un_save_map.regions;
        this.mapColumn = this.initMapInfo.un_save_map.column;
        this.mapRow = this.initMapInfo.un_save_map.row;
      });
    },

    createNewMapByTemplateId(tempId, templateName) {
      console.log("新的模板Id", tempId);
      this.showSetNewMapInfo = true;
      this.currentMapInfo.template_id = tempId;
      this.currentMapInfo.map_name = "我的" + templateName + "地图";
      this.newMapRow = 20;
      this.newMapColumn = 20;
    },
    /**
     * 获取上一个编辑的地图
     */
    getLastEditMap() {
      GetLastEditMap().then(({ res_val }) => {
        this.initMapInfo = res_val;
        this.userSetting = res_val.user_setting;
        this.unitList = this.initMapInfo.un_save_map.units;
        if (!this.unitList) {
          this.unitList = [];
        }
        this.currentMapInfo.map_name = res_val.un_save_map.map_name;
        this.currentMapInfo.share = res_val.un_save_map.share;
        this.currentMapInfo.map_id = res_val.un_save_map.uuid;

        this.maps = this.initMapInfo.un_save_map.regions;
        this.mapColumn = this.initMapInfo.un_save_map.column;
        this.mapRow = this.initMapInfo.un_save_map.row;
        this.currentTemplateId = this.initMapInfo.user_template.id;
      });
    },
  },
  onLoad: function (option) {
    console.log(option.mapId);
    this.$appHelper.loadFontFaceFromWeb();
    // 1.获取初始化地图的宽高 初始化地图的type 获取已有地图的Id Name 获取可编辑的Unit 和 Region
    if (option.mapId && option.mapId != "0") {
      let map = {};
      map.map_id = option.mapId;
      this.editMap(map);
    } else {
      this.getLastEditMap();
    }
  },
  created() {
    this.initMapStyle();
  },
  destroyed() {
    // TODO 暂时不实现 需要判断没有保存的 需要与地图的回退和恢复一起实现
    // this.saveMap("0");
  },
};
</script>
<style lang="scss" scoped>
.map-edit {
  height: 100%;
  width: 100%;
  display: flex;

  .game-core-container {
    display: flex;
    flex-direction: column;
    flex-grow: 2;
    background-color: rgb(70, 72, 70);
    height: 100%;
    justify-content: flex-end;
    .game-core-black-title {
      height: 20px;
      color: rgb(70, 72, 70);
    }
    .main-area {
      margin: 2%;
      overflow: auto;
      width: 100%;
      height: 100%;
      .main-view {
        position: relative;
        &:hover {
          /* #ifdef H5*/
          cursor: pointer;
          /* #endif */
        }
        .base_map {
          cursor: hand;
          position: absolute;
          img {
            float: left;
          }
        }
      }
    }
    .army_mes {
      height: 10%;
    }
    .mobile-map-edit-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      /* #ifdef H5*/
      cursor: pointer;
      /* #endif */
      .icon-img {
        padding-right: 20px;
      }
      .edit-img {
        padding-right: 20px;
      }
    }
  }

  .map-edit-unit {
    display: flex;
    flex-direction: column;
    width: 18%;
    height: 100%;
    background-color: #242b44;
    .select-unit {
      display: flex;
      justify-content: space-evenly;
      height: 72px;
      margin-top: 10px;
      .show-unit-detail-img {
        position: absolute;
        width: 68px;
        height: 68px;
        background-color: rgb(70, 72, 70);
      }
    }
  }

  .map-edit-region {
    width: 18%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #242b44;
    img {
      float: left;
      margin-left: 20px;
      margin-top: 20px;
      /* #ifdef H5*/
      cursor: pointer;
      /* #endif */
    }
  }
  .mobile-map-edit {
    width: 120px;
    height: 100%;
    padding-left: 2%;
    padding-right: 2%;
    background-color: #242b44;
    .mobile-map-edit-content {
      width: 120px;
      height: 94%;
      position: absolute;
      /* #ifndef H5 */
      top: 0;
      left: 0;
      /* #endif */
    }
  }

  .map-edit-select {
    float: left;
    margin-left: 10px;
    margin-top: 10px;
    /* #ifdef H5*/
    cursor: pointer;
    /* #endif */
    width: 20px;
    height: 20px;
    padding: 2px;
  }
  .map-edit-selected {
    width: 24px;
    height: 24px;
    padding: 0px;
  }

  .select_desc {
    margin-top: 10px;
    color: rgb(255, 255, 255);
    font-size: 12px;
    float: left;
    width: 100%;
  }

  .map img {
    float: left;
    margin: 0;
    /* #ifdef H5*/
    cursor: pointer;
    /* #endif */
  }

  .unit_img {
    position: absolute;
  }
}
.reset-map-size {
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    span {
      color: white;
      font-size: 14px;
      width: 20%;
    }
  }
}
</style>
