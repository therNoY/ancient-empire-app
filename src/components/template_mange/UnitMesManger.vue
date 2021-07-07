<template>
  <div class="body">
    <ae-complex-dialog
      ref="mainDialog"
      v-model="showModel"
      showSearch
      :title="$t('unitManagement.title')"
      :titleButtons="titleButtonList"
      :footerButtons="footButtonList"
      :initQueryDataGrid="queryDataFunction"
      :showItem="showItem"
      :showTitle="showTitle"
      :titleSwitchSelect="titleSwitchSelect"
      @titleSwitchSelectChange="switchChange"
      :width="$uni.isH5 ? 60 : 70"
      page
      setFullScreen
    >
    </ae-complex-dialog>

    <ae-base-dialog
      :title="diaTitle"
      v-if="dialogVisible"
      v-model="dialogVisible"
      inlineDialog
      :top="3"
      :width="unitInfoWidth"
    >
      <uni-segmented-control
        :current="currentActiveTab"
        :values="tabItems"
        style-type="text"
        active-color="#4993a0"
        @clickItem="onClickTab"
        class="tabFontStyle"
      />
      <div class="input_mes" v-show="currentActiveTab === 0">
        <ae-form
          ref="unitBaseInfoForm"
          v-model="unit"
          hasBorder
          :edit="showPageIndex == '1'"
          :column="formShowColumn"
          :formConfig="unitBaseInfoFormConfig"
        />
      </div>
      <ae-transfer
        v-show="currentActiveTab === 1"
        v-model="currUnitInfo.abilityInfo"
        showKey="name"
        valueKey="id"
        showTipKey="description"
        :dataList="allAbilityList"
        :disabled="showPageIndex != '1'"
      />
      <ae-data-grid
        v-show="currentActiveTab === 2"
        ref="unitLevelDataGrid"
        :data="currUnitInfo.levelInfoData"
        :showTitle="unitLevelShowTitle"
        :showItem="unitLevelShowItem"
      >
      </ae-data-grid>
      <ae-button-list slot="footer"
        :buttonList="getButtonList"
        :clickAction="getClickAction"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog
      :title="$t('unitManagement.changeLevelInfo')"
      :width="unitLevelInfoWidth"
      v-model="editUnitLevelInfoDialog"
    >
      <ae-form
        ref="levelInfoForm"
        v-if="currentLevelInfo"
        v-model="currentLevelInfo"
        :edit="showPageIndex == '1'"
        :column="formShowColumn"
        :formConfig="unitLevelInfoFormConfig"
      />
      <div style="width:40%;margin-left:30%" slot="footer">
        <ae-button @click="saveLevelInfo">{{ $t("common.sure") }}</ae-button>
      </div>
    </ae-base-dialog>

    <start-comment ref="startComment" @ok="handleDownload" />
    <upload-unit-img
      ref="uploadUnitImg"
      v-model="showUploadUnitImg"
      @uploadOk="createUnit"
    />
  </div>
</template>

<script>
const createUnitTip =
  "<h3>注意: 创建单位需要一定的像素画知识，或者有现成的图片。</h3>" +
  "如果没有建议不要创建,可以通过单位商城下载作者或者大神开放的单位<br/>" +
  "<h4>上传文件需要注意:</h4> 1.需要上传两张宽度和高度都是<b>24px</b>的图片, 游戏中两张照片相互切换, 达到动态效果<br/><br/>" +
  "2.初始上传的单位为蓝色方基础单位, 会根据这个图片生成其他颜色单位";

import {
  GetUserCreateUnitMes,
  SaveUnitInfo,
  GetAllUserEnableUnitMes,
  GetUnitAbilityInfo,
  GetAllAbilityInfo,
  GetUnitLevelInfoById,
  GetUserDownloadUnitList,
  GetCanDownloadUnit,
  DeletDownLoadUnit,
  DeleteCreateUnit,
  DownLoadUnit,
  UpdateUnitVersion,
  RevertUnitVersion,
} from "@/api";
import UnitRadio from "../frame/UnitRadio.vue";
import dialogShow from "../../mixins/frame/dialogShow.js";
import StartComment from "../frame/StartComment.vue";
import UploadUnitImg from "../frame/UploadUnitImg.vue";
export default {
  mixins: [dialogShow],
  components: {
    UnitRadio,
    StartComment,
    UploadUnitImg,
  },
  data() {
    return {
      unitInfoWidth: 48,
      unitLevelInfoWidth: 40,
      formShowColumn: 1,
      titleSwitchSelect: {
        type: "switchSelect",
        key: "queryType",
        default: "1",
        des: "",
        items: [
          {
            key: "1",
            value: this.$t("unitManagement.myUnit"),
            query: GetUserCreateUnitMes,
          },
          {
            key: "2",
            value: this.$t("common.myDownload"),
            query: GetUserDownloadUnitList,
          },
          {
            key: "3",
            value: this.$t("unitManagement.unitShop"),
            query: GetCanDownloadUnit,
          },
        ],
      },
      titleButtonList: [
        {
          name: this.$t("common.add"),
          action: () =>
            this.$appHelper.showTip(createUnitTip, () => {
              this.showUploadUnitImg = true;
            }),
        },
      ],
      allUnitList: [],
      showPageIndex: "1",
      unit: {},
      currentActiveTab: 0,
      tabItems: [
        this.$t("unitManagement.baseInfo"),
        this.$t("unitManagement.bindAbility"),
        this.$t("unitManagement.levelData"),
        "",
      ],
      unitBaseInfoFormConfig: [
        {
          type: "input",
          key: "name",
          des: this.$t("common.name"),
        },
        {
          type: "switchSelect",
          key: "attack_type",
          des: this.$t("unitManagement.attachType"),
          items: [
            {
              key: "1",
              value: this.$t("unitManagement.physicalAttack"),
            },
            {
              key: "2",
              value: this.$t("unitManagement.magicAttack"),
            },
          ],
        },
        {
          type: "rangeSelect",
          minKey: "min_attach_range",
          maxKey: "max_attach_range",
          des: this.$t("unitManagement.attachArea"),
        },
        {
          type: "input",
          key: "population",
          des: this.$t("unitManagement.population"),
          style: "number",
        },
        {
          type: "input",
          key: "price",
          des: this.$t("unitManagement.price"),
          style: "number",
        },
        {
          type: "unitRadio",
          key: "promotion",
          des: this.$t("unitManagement.promotion"),
          unitList: this.allUnitList,
        },

        {
          type: "switchSelect",
          key: "tradable",
          des: this.$t("unitManagement.tradable"),
          items: [
            {
              key: "1",
              value: this.$t("common.yes"),
            },
            {
              key: "0",
              value: this.$t("common.no"),
            },
          ],
        },

        {
          type: "input",
          key: "description",
          des: this.$t("common.description"),
        },
      ],
      unitLevelInfoFormConfig: [
        {
          type: "input",
          key: "level",
          des: this.$t("unitManagement.level"),
          style: "number",
          disabled: true,
          require: true,
        },
        {
          type: "input",
          key: "min_attack",
          des: this.$t("unitManagement.minAttack"),
          style: "number",
          require: true,
        },
        {
          type: "input",
          key: "max_attack",
          des: this.$t("unitManagement.maxAttack"),
          style: "number",
          require: true,
        },
        {
          type: "input",
          key: "physical_defense",
          des: this.$t("unitManagement.physicalDefense"),
          style: "number",
          require: true,
        },
        {
          type: "input",
          key: "magic_defense",
          des: this.$t("unitManagement.magicDefense"),
          style: "number",
          require: true,
        },
        {
          type: "input",
          key: "max_life",
          des: this.$t("unitManagement.maxLife"),
          style: "number",
          require: true,
        },
        {
          type: "input",
          key: "speed",
          des: this.$t("unitManagement.mobility"),
          style: "number",
          require: true,
        },
      ],
      dialogVisible: false,
      editUnitLevelInfoDialog: false,
      diaTitle: this.$t("unitManagement.addNewUnit"),
      addLevel: false,
      activeName: "baseInfo",
      allAbilityList: [],
      currUnitInfo: {
        baseInfo: {},
        abilityInfo: [],
        levelInfoData: [],
      },
      deleteAbleButList: [
        {
          name: this.$t("common.desc"),
          action: this.handleEdit,
        },
        {
          name: this.$t("common.delete"),
          action: this.handleDelete,
        },
      ],
      downloadButList: [
        {
          name: this.$t("common.desc"),
          action: this.handleEdit,
        },
        {
          name: this.$t("common.download"),
          action: this.downloadUnit,
        },
      ],
      currentLevelInfo: null,
      queryDataFunction: () => GetUserCreateUnitMes(),
      queryShowTitle: [
        this.$t("common.unit"),
        this.$t("common.name"),
        this.$t("unitManagement.attachType"),
        this.$t("unitManagement.attachArea"),
        this.$t("unitManagement.price"),
        this.$t("unitManagement.tradable"),
        this.$t("unitManagement.promotion"),
        this.$t("common.version"),
      ],
      downShowTitle: [
        this.$t("common.unit"),
        this.$t("common.name"),
        this.$t("common.author"),
        this.$t("unitManagement.tradable"),
        this.$t("unitManagement.promotion"),
        this.$t("common.version"),
        this.$t("common.score"),
        this.$t("common.downloadCount"),
      ],
      queryShowItem: [
        (h, p) => {
          return h("img", {
            attrs: {
              src: this.$appHelper.getUnitImg(p.id),
              width: "24px",
              height: "24px",
            },
          });
        },
        "name",
        (h, p) => {
          if (p.attack_type == "1") {
            return h("div", {}, this.$t("unitManagement.physicalAttack"));
          } else if (p.attack_type == "2") {
            return h("div", {}, this.$t("unitManagement.magicAttack"));
          }
        },
        (h, p) => {
          return h("div", {}, p.min_attach_range + "-" + p.max_attach_range);
        },
        "price",
        (h, p) => {
          if (p.tradable) {
            return h("div", {}, this.$t("common.yes"));
          } else {
            return h("div", {}, this.$t("common.no"));
          }
        },
        (h, p) => {
          if (p.promotion) {
            return h("img", {
              attrs: {
                src: this.$appHelper.getUnitImg(p.promotion),
                width: "24px",
                height: "24px",
              },
            });
          } else {
            return h("div", {}, "-");
          }
        },
        (h, p) => {
          if (p.max_version) {
            return h(
              "div",
              {},
              "V" +
                p.version +
                "(" +
                this.$t("common.latestVersion") +
                "V" +
                p.max_version +
                ")"
            );
          } else if (p.status == "0") {
            return h(
              "div",
              {},
              "V" + p.version + "(" + this.$t("common.draftVersion") + ")"
            );
          } else {
            return h(
              "div",
              {},
              "V" + p.version + "(" + this.$t("common.latestVersion") + ")"
            );
          }
        },
      ],
      downloadShowItem: [
        (h, p) => {
          return h("img", {
            attrs: {
              src: this.$appHelper.getUnitImg(p.id),
              width: "24px",
              height: "24px",
            },
          });
        },
        "name",
        "create_user_name",
        (h, p) => {
          if (p.tradable) {
            return h("div", {}, this.$t("common.yes"));
          } else {
            return h("div", {}, this.$t("common.no"));
          }
        },
        (h, p) => {
          if (p.promotion) {
            return h("img", {
              attrs: {
                src: this.$appHelper.getUnitImg(p.promotion),
                width: "24px",
                height: "24px",
              },
            });
          } else {
            return h("div", {}, "-");
          }
        },
        (h, p) => {
          if (p.max_version) {
            return h(
              "div",
              {},
              "V" +
                p.version +
                "(" +
                this.$t("common.draftVersion") +
                "V" +
                p.max_version +
                ")"
            );
          } else if (p.status == "0") {
            return h(
              "div",
              {},
              "V" + p.version + "(" + this.$t("common.draftVersion") + ")"
            );
          } else {
            return h(
              "div",
              {},
              "V" + p.version + "(" + this.$t("common.latestVersion") + ")"
            );
          }
        },
        "start_count",
        "down_load_count",
      ],
      unitLevelShowTitle: [
        this.$t("unitManagement.level"),
        this.$t("unitManagement.minAttack"),
        this.$t("unitManagement.maxAttack"),
        this.$t("unitManagement.physicalDefense"),
        this.$t("unitManagement.magicDefense"),
        this.$t("unitManagement.maxLife"),
        this.$t("unitManagement.mobility"),
      ],
      unitLevelShowItem: [
        "level",
        "min_attack",
        "max_attack",
        "physical_defense",
        "magic_defense",
        "max_life",
        "speed",
      ],
      showUploadUnitImg: false,
      newUploadImg: {},
    };
  },
  methods: {
    onClickTab({ currentIndex }) {
      this.currentActiveTab = currentIndex;
    },
    createUnit(newImg) {
      this.newUploadImg = newImg;
      this.dialogVisible = true;
      this.diaTitle = this.$t("unitManagement.addNewUnit");
      this.unit = {};
      this.currUnitInfo.baseInfo = {};
      this.currUnitInfo.abilityInfo = [];
      this.currUnitInfo.levelInfoData = [];
      console.log("创建单位");
    },
    doCreateNewUnit() {
      let args = {};
      args.opt_type = "3";
      args.new_upload_img = this.newUploadImg;
      args.base_info = this.unit;
      args.ability_info = this.currUnitInfo.abilityInfo;
      args.level_info_data = this.currUnitInfo.levelInfoData;
      SaveUnitInfo(args).then((resp) => {
        this.dialogVisible = false;
        this.$appHelper.infoMsg(this.$t("common.addSuccess"));
        this.$refs.mainDialog.flushData();
      });
    },
    downloadUnit() {
      this.$refs.startComment.showComment();
    },
    /**
     * 回退版本
     */
    revertVersion() {
      let unit = this.$refs.mainDialog.getDataGridSelect();
      if (unit.status == "0") {
        console.log("回退单位草稿版本");
        let args = {};
        args.unit_id = unit.id;
        RevertUnitVersion(args).then((resp) => {
          if (resp.res_code == 0) {
            this.$appHelper.infoMsg(this.$t("common.rollbackSuccess"));
            this.$refs.mainDialog.flushData();
            this.dialogVisible = false;
          }
        });
      } else {
        this.$appHelper.infoMsg(this.$t("common.cannotRollback"));
      }
    },
    updateVersion() {
      let unit = this.$refs.mainDialog.getDataGridSelect();
      let args = {};
      args.unit_id = unit.id;
      UpdateUnitVersion(args).then((resp) => {
        this.$appHelper.infoMsg(this.$t("common.updateSuccess"));
        this.$refs.mainDialog.flushData();
        this.dialogVisible = false;
      });
    },
    save(optType = 0) {
      if (optType == "1") {
        this.$appHelper.showTip(this.$t("common.publicVersionTip"), () => {
          this.saveUnitInfo(optType);
        });
      } else {
        this.$appHelper.showTip(this.$t("common.saveDraftTip"), () => {
          this.saveUnitInfo(optType);
        });
      }
    },
    saveUnitInfo(optType) {
      let args = {};
      args.opt_type = optType;
      args.base_info = this.unit;
      args.ability_info = this.currUnitInfo.abilityInfo;
      args.level_info_data = this.currUnitInfo.levelInfoData;
      SaveUnitInfo(args).then((resp) => {
        this.dialogVisible = false;
        this.$appHelper.infoMsg(this.$t("common.saveSuccess"));
        this.$refs.mainDialog.flushData();
      });
    },
    onDialogCreate() {
      this.init();
    },
    handleEdit() {
      let unit = this.$refs.mainDialog.getDataGridSelect();
      this.diaTitle = this.$t("unitManagement.editUnit");
      this.dialogVisible = true;
      this.unit = unit;
      GetUnitAbilityInfo(unit.id, false).then((resp) => {
        if (resp.res_code == 0) {
          this.currUnitInfo.abilityInfo = resp.res_val;
        }
      });
      GetUnitLevelInfoById(unit.id, false).then((resp) => {
        if (resp.res_code == 0) {
          this.currUnitInfo.levelInfoData = resp.res_val;
        }
      });
    },
    handleDelete() {
      let unit = this.$refs.mainDialog.getDataGridSelect();
      if (this.showPageIndex === "2") {
        this.$appHelper.showTip(this.$t("common.deleteDownloadTip"), () => {
          let args = {};
          args.id = unit.id;
          DeletDownLoadUnit(args).then((resp) => {
            this.$appHelper.infoMsg(this.$t("common.deleteSuccess"));
            this.$refs.mainDialog.flushData();
            this.dialogVisible = false;
          });
        });
      } else if (this.showPageIndex === "1") {
        this.$appHelper.showTip(this.$t("common.deleteEntryTip"), () => {
          let args = {};
          args.id = unit.id;
          DeleteCreateUnit(args).then((resp) => {
            this.$appHelper.infoMsg(this.$t("common.deleteSuccess"));
            this.$refs.mainDialog.flushData();
            this.dialogVisible = false;
          });
        });
      }
    },
    handleDownload(commend) {
      let unit = this.$refs.mainDialog.getDataGridSelect();
      let args = {};
      args.unit_id = unit.id;
      args = Object.assign(commend, args);
      DownLoadUnit(args).then((resp) => {
        this.$appHelper.infoMsg(this.$t("common.downloadSuccess"));
        this.$refs.mainDialog.flushData();
        this.dialogVisible = false;
      });
    },
    editUnitLevelInfo(unitLevelInfo) {
      this.currentLevelInfo = unitLevelInfo;
      this.addLevel = false;
      this.editUnitLevelInfoDialog = true;
    },
    addNewLevel() {
      this.currentLevelInfo = {};
      this.currentLevelInfo.level = this.currUnitInfo.levelInfoData.length + '';
      this.addLevel = true;
      this.editUnitLevelInfoDialog = true;
    },
    saveLevelInfo() {
      this.$refs.levelInfoForm.getFormData(this.currentLevelInfo);
      this.editUnitLevelInfoDialog = false;
      if (this.addLevel) {
        this.currUnitInfo.levelInfoData.push(
          Object.assign(this.currentLevelInfo)
        );
      } else {
        for (let i = 0; i < this.currUnitInfo.levelInfoData.length; i++) {
          if (this.currUnitInfo.levelInfoData[i].level == this.currentLevelInfo.level){
            this.currUnitInfo.levelInfoData[i] = this.currentLevelInfo;
          }
        }
      }
    },
    init() {
      GetAllUserEnableUnitMes(false).then((resp) => {
        if (resp.res_code == 0) {
          this.allUnitList = resp.res_val;
          this.unitBaseInfoFormConfig[6].unitList = resp.res_val;
        }
      });
      GetAllAbilityInfo(false).then((resp) => {
        if (resp.res_code == 0) {
          this.allAbilityList = resp.res_val;
        }
      });
    },
    switchChange(value) {
      this.showPageIndex = value;
      if (value === "1") {
        this.unitLevelShowTitle.push((h, p) => {
          return h(
              "aeButton",
              {
                props: {
                  width: 80,
                  size:0.65,
                },
                on: {
                  click: this.addNewLevel,
                },
              },
              this.$t("common.add")
          );
        });
        this.unitLevelShowItem.push((h, p) => {
          return h(
              "aeButton",
              {
                props: {
                  width: 70,
                  size:0.65,
                },
                on: {
                  click: () => this.editUnitLevelInfo(p),
                },
              },
              this.$t("common.change")
          );
        });
      } else {
        this.unitLevelShowTitle.splice(7, 1);
        this.unitLevelShowItem.splice(7, 1);
      }
    },
  },
  computed: {
    getButtonList() {
      if (this.showPageIndex == "1") {
        if (this.diaTitle === this.$t("unitManagement.editUnit")) {
          return [
            this.$t("common.saveDraft"),
            this.$t("common.publicVersion"),
            this.$t("common.draftRollback"),
          ];
        } else {
          return [this.$t("common.create"), this.$t("common.return")];
        }
      } else if (this.showPageIndex == "2") {
        return [
          this.$t("common.updateVersion"),
          this.$t("common.deleteDownload"),
        ];
      } else if (this.showPageIndex == "3") {
        return [this.$t("common.download")];
      }
    },
    getClickAction() {
      if (this.showPageIndex == "1") {
        if (this.diaTitle === this.$t("unitManagement.editUnit")) {
          return [this.save, () => this.save(1), this.revertVersion];
        } else {
          return [this.doCreateNewUnit, () => (this.dialogVisible = false)];
        }
      } else if (this.showPageIndex == "2") {
        return [this.updateVersion, this.handleDelete];
      } else if (this.showPageIndex == "3") {
        return [this.downloadUnit];
      }
    },
    showTitle() {
      if (this.showPageIndex == "3") {
        return this.downShowTitle;
      } else {
        return this.queryShowTitle;
      }
    },
    footButtonList() {
      if (this.showPageIndex == "3") {
        return this.downloadButList;
      } else {
        return this.deleteAbleButList;
      }
    },
    showItem() {
      if (this.showPageIndex == "3") {
        return this.downloadShowItem;
      } else {
        return this.queryShowItem;
      }
    },
  },
  created() {
    // 初始化
    this.$appHelper.bindPage2Global(this, "unitMesMangerVue");
    // #ifndef H5
    this.unitInfoWidth = 84;
    this.unitLevelInfoWidth = 80;
    this.formShowColumn = 2;
    // #endif
  },
};
</script>

<style lang="css" scoped>
.input_mes {
  padding: 1%;
}

.levelInfoStyle th {
  padding: 8px, 0 !important;
}
</style>
