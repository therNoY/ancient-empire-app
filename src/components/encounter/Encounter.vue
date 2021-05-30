<!-- 遭遇战 -->
<template>
  <div class="userMap-select">
    <ae-complex-dialog ref="aeDialog" v-model="showModel" :showItem="showItem" :title="$t('encounter.title')"
                       :initQueryDataGrid="initQueryDataFunction" :titleSwitchSelect="titleSwitchSelect"
                       :footerButtons="buttonList" :width="dialogWidth" page>
    </ae-complex-dialog>

    <div @click="clickPreviewChooseMap" class="userMap-select-name" v-if="chooseMap && chooseMap.map_name">
      {{ chooseMap.map_name }}
    </div>

    <ae-base-dialog title="设置地图" v-model="setMapShow" @close="closeSetMap">
      <div>

        <table>
          <tr>
            <th>{{$t("encounter.army")}}</th>
            <th>{{$t("encounter.actionOrder")}}</th>
            <th>{{$t("encounter.playerType")}}</th>
            <th>{{$t("encounter.camp")}}</th>
          </tr>
          <tr v-for="(army, index) in initArmys" :key="index">
            <td>
              <img :src="$appHelper.getUnitImg('10', army.color)" />
            </td>
            <td>
              <uni-number-box :min="1" :max="initArmys.length" v-model="army.color" @change="changeOrder">
              </uni-number-box>
            </td>
            <td>
              <uni-group>
                <uni-data-checkbox mode="button" v-model="army.type" :localdata="armyType">
                </uni-data-checkbox>
              </uni-group>
            </td>
            <td>
              <uni-number-box :min="1" :max="initArmys.length" v-model="army.camp">
              </uni-number-box>
            </td>
          </tr>
        </table>

        <div class="common_init">
          <span>{{$t("encounter.initGold")}}:</span>
          <uni-number-box v-model="initMoney" :min="500" :max="2000" :step="500">
          </uni-number-box>
          <span style="padding-left: 1%">{{$t("encounter.maxPop")}}:</span>
          <uni-number-box v-model="maxPop" :min="15" :max="50" :step="5"></uni-number-box>
        </div>
        <div style="width: 100%">
          <ae-button :marginLeft="25" :width="50" @click="clickSetMap">
            {{$t("common.confirm")}}
          </ae-button>
        </div>
      </div>
    </ae-base-dialog>

    <map-preview v-model="previewVisible" @close="close" :mapId="previewMapId" :armyConfigList="initArmys">
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
  import AeRadioButton from "../frame/AeRadioButton";
  import blackStyle from "@/mixins/style/blackStyle";
  import dialogShow from "@/mixins/frame/dialogShow";
  export default {
    mixins: [blackStyle, dialogShow],
    components: {
      MapPreview,
      AeRadioButton,
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
          items: [{
            key: "1",
            value: this.$t("encounter.systemMap"),
            query: GetEncounterMap
          },
            {
              key: "2",
              value: this.$t("encounter.myMap"),
              query: GetUserMapList
            },
            {
              key: "3",
              value: this.$t("encounter.myDownload"),
              query: GetUserDownloadMap
            },
          ],
        },
        showItem: ["map_name"],
        showModel: false,
        buttonList: [{
          name: this.$t("common.choose"),
          action: this.clickChooseMap
        },
          {
            name: this.$t("common.preview"),
            action: this.clickPreviewButton
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
        armyType: [{
          key: "user",
          value: this.$t("player.title"),
        },
          {
            key: "ai",
            value: this.$t("player.ai"),
          },
          {
            key: "no",
            value: this.$t("player.noting"),
          },
        ],
        initMapConfig: {},
        dialogWidth: 40,
        initQueryDataFunction: () => GetEncounterMap(),
      };
    },
    methods: {
      getInitMapConfig() {
        return this.initMapConfig;
      },
      closeSetMap() {},
      clickChooseMap() {
        console.log(this.$refs.aeDialog);
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
        InitEncounterMap(args).then(({res_val}) => {
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
      getCurrent(color) {
        this.currentColor = color;
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
        this.chooseMap.config = this.initMapConfig;
        this.$emit("input", this.initMapConfig);
        console.log("选择地图", this.initMapConfig);
        this.setMapShow = false;
        this.showModel = false;
      },
    },
    created() {
      this.$appHelper.bindPage2Global(this, "encounter");
      // #ifndef H5
      this.dialogWidth = 60
      // #endif
    },
    computed: {},
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
      cursor: pointer;
    }

    .common_init {
      width: 100%;
      padding-top: 2%;
      padding-bottom: 2%;
      float: left;
      color: white;

      span {
        font-size: 14px;
      }
    }
  }
</style>
