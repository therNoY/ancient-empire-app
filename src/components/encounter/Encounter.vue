<!-- 遭遇战 -->
<template>
  <div class="userMap-select">
    <ae-complex-dialog
      ref="aeDialog"
      v-model="showModel"
      :showItem="showItem"
      :title="$t('e.title')"
      :initQueryDataGrid="initQueryDataFunction"
      :titleSwitchSelect="titleSwitchSelect"
      :footerButtons="buttonList"
      :width="$uni.isH5 ? 40 : 70"
      page
    >
    </ae-complex-dialog>

    <div
      @click="clickPreviewChooseMap"
      class="userMap-select-name"
      v-if="chooseMap && chooseMap.map_name"
    >
      {{ chooseMap.map_name }}
    </div>

    <ae-base-dialog
      :title="$t('e.setMap')"
      showChoose
      v-model="setMapShow"
      @choose="clickSetMap"
      @close="closeSetMap"
    >
      <div
        v-if="initArmys.length > 0"
        class="ae-data-grid"
        style="height: 100%; max-height: 100%"
      >
        <table style="width: 100%">
          <tr class="ae-data-grid-title">
            <td style="width: 10%">{{ $t("e.army") }}</td>
            <td style="width: 25%">{{ $t("e.actionOrder") }}</td>
            <td style="width: 30%">{{ $t("e.playerType") }}</td>
            <td style="width: 25%">{{ $t("e.camp") }}</td>
          </tr>
          <tr v-for="(army, index) in initArmys" :key="index">
            <td style="width: 10%">
              <img
                class="stand-img-size"
                :src="$appHelper.getUnitImg('10', army.color)"
              />
            </td>
            <td style="width: 27%">
              <uni-number-box
                :min="1"
                :max="initArmys.length"
                v-model="initArmys[index].order"
                @change="changeOrder"
              />
            </td>
            <td style="width: 32%">
              <ae-switch-select v-model="army.type" :items="armyType" />
            </td>
            <td style="width: 27%">
              <uni-number-box
                ref="campBox"
                :min="1"
                :max="initArmys.length"
                v-model="initArmys[index].camp"
              />
            </td>
          </tr>
        </table>

        <div class="common_init">
          <div class="common_init_one">
            <span>{{ $t("e.initGold") }}:</span>
            <uni-number-box
              v-model="initMoney"
              :min="500"
              :max="2000"
              :step="500"
            />
          </div>
          <div class="common_init_one">
            <span>{{ $t("e.maxPop") }}:</span>
            <uni-number-box v-model="maxPop" :min="15" :max="50" :step="5" />
          </div>
        </div>
        <div v-if="$uni.isH5" style="width: 50%; margin-left: 25%">
          <ae-button @click="clickSetMap">{{ $t("c.confirm") }}</ae-button>
        </div>
      </div>
    </ae-base-dialog>

    <map-preview
      v-model="previewVisible"
      @close="close"
      :mapId="previewMapId"
      :armyConfigList="initArmys"
    >
    </map-preview>
  </div>
</template>

<script>
import {
  GetEncounterMap,
  GetUserMapList,
  GetUserDownloadMap,
  InitEncounterMap,
} from "@/api";
import MapPreview from "../frame/MapPreview.vue";
import dialogShow from "@/mixins/frame/dialogShow";

export default {
  mixins: [dialogShow],
  components: {
    MapPreview,
  },
  props: {
    label: {
      type: String,
    },
  },
  data() {
    return {
      titleSwitchSelect: {
        type: "switchSelect",
        key: "queryType",
        default: "1",
        des: "",
        items: [
          {
            key: "1",
            value: this.$t("e.systemMap"),
            query: GetEncounterMap,
          },
          {
            key: "2",
            value: this.$t("e.myMap"),
            query: GetUserMapList,
          },
          {
            key: "3",
            value: this.$t("c.myDownload"),
            query: GetUserDownloadMap,
          },
        ],
      },
      showItem: ["map_name"],
      showModel: false,
      buttonList: [
        {
          name: this.$t("c.choose"),
          action: this.clickChooseMap,
        },
        {
          name: this.$t("c.preview"),
          action: this.clickPreviewButton,
        },
      ],
      previewVisible: false,
      previewMapId: null,
      chooseMap: null,
      setMapShow: false,
      initArmys: [],
      initMoney: 500,
      maxPop: 40,
      currentColor: null,
      armyType: [
        {
          key: "user",
          value: this.$t("p.title"),
        },
        {
          key: "ai",
          value: this.$t("p.ai"),
        },
        {
          key: "no",
          value: this.$t("c.noting"),
        },
      ],
      initMapConfig: {},
      initQueryDataFunction: (query) => GetEncounterMap(query),
    };
  },
  methods: {
    closeSetMap() {},
    clickChooseMap() {
      console.log("选择地图", this.$refs.aeDialog.getDataGridSelect());
      let value = this.$refs.aeDialog.getDataGridSelect();
      this.chooseMap = value;
      this.setMap();
    },
    clickPreviewButton() {
      let value = this.$refs.aeDialog.getDataGridSelect();
      console.log(value);
      if (value && value.map_id) {
        this.previewMapId = value.map_id;
        this.previewVisible = true;
      }
    },
    clickPreviewChooseMap() {
      let value = this.chooseMap;
      console.log(value);
      if (value && value.map_id) {
        this.previewMapId = value.map_id;
        this.previewVisible = true;
      }
    },
    close() {
      this.previewVisible = false;
    },
    // 初始化军队
    setMap() {
      this.initArmys = [];
      let args = {};
      args.uuid = this.chooseMap.map_id;
      InitEncounterMap(args).then(({ res_val }) => {
        this.setMapShow = true;
        let colors = res_val;
        for (let index = 0; index < colors.length; index++) {
          const color = colors[index];
          let army = {};
          army.color = color;
          army.order = index + 1;
          army.camp = index + 1;
          army.type = "user";
          this.initArmys.push(army);
        }
      });
    },
    changeOrder(newNum, oldNum) {
      for (let index = 0; index < this.initArmys.length; index++) {
        let army = this.initArmys[index];
        if (army.order == newNum && army.color != this.currentColor) {
          // 这是要被改变的那个
          army.order = oldNum;
          break;
        }
      }
    },
    clickSetMap() {
      this.initMapConfig.max_pop = this.maxPop;
      this.initMapConfig.money = this.initMoney;
      this.initMapConfig.army_list = this.initArmys;
      this.initMapConfig.map_id = this.chooseMap.map_id;
      this.initMapConfig.map_name = this.chooseMap.map_name;
      this.chooseMap.config = this.initMapConfig;
      this.$emit("input", false);
      this.$emit("chooseMap", this.initMapConfig);
      console.log("选择地图", this.initMapConfig);
      this.setMapShow = false;
      this.showModel = false;
    },
  },
  created() {
    this.$appHelper.bindPage2Global(this, "encounter");
  },
};
</script>

<style lang="scss" scoped>
.userMap-select {
  float: left;
  width: 100%;

  .userMap-select-name {
    font-size: 14px;
    float: left;
    width: 30%;
    padding: 2%;
    color: white;
    text-decoration: underline;
    /* #ifdef H5*/
    cursor: pointer;
    /* #endif */
  }

  .common_init {
    padding-top: 2%;
    padding-bottom: 2%;
    display: flex;
    flex-direction: row;
    color: white;
    justify-content: space-evenly;
    /* #ifndef H5*/
    font-size: 12px;
    /* #endif*/
    .common_init_one {
      display: flex;
      width: 40%;
      justify-content: space-around;
      align-items: center;
      flex-direction: row;
      uni-number-box {
        width: 80px;
      }
    }
  }
}
</style>
