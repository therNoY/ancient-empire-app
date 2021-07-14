<template>
  <div id="template_detail">
    <ae-base-dialog
      v-if="showModel"
      v-model="showModel"
      :title="templateDetail.template_name"
      :width="$uni.isH5 ? 45 : 75"
      inlineDialog
      :top="5"
    >
      <ae-tab-form
        ref="templateInfoForm"
        :edit="model == 'myTemp'"
        :dataObj="templateDetail"
        :signal="signal"
        :templateId="templateDetail.id"
        :formConfig="templateInfoFormConfig"
        hasBorder
      >
      </ae-tab-form>

      <ae-button-list
        :buttonList="dynamicButton.map((a) => a.name)"
        :clickAction="dynamicButton.map((a) => a.action)"
      ></ae-button-list>
    </ae-base-dialog>
    <start-comment
      ref="startComment"
      :comment="downloadComment"
      @ok="downLoadTemp"
    ></start-comment>
  </div>
</template>

<script>
import PreviewUnitList from "../frame/PreviewUnitList.vue";
import StartComment from "../frame/StartComment.vue";
import dialogShow from "../../mixins/frame/dialogShow.js";
import {
  SaveTemplateInfo,
  RemoveUserTemplate,
  RemoveUserTemplateAttention,
  UpdateUserTempAttention,
  RevertTemplateVersion,
} from "@/api";
export default {
  mixins: [dialogShow],
  props: {
    templateDetail: {},
    // 查看模式 myTemp myDownload
    model: {
      type: String,
      default: "myTemp",
    },
  },
  components: {
    PreviewUnitList,
    StartComment,
  },
  data() {
    return {
      templateInfoFormConfig: [
        {
          type: "input",
          key: "template_name",
          des: this.$t("tm.templateName"),
          tab: this.$t("tm.baseInfo"),
        },
        {
          type: "switchSelect",
          key: "shared",
          des: this.$t("tm.isShared"),
          items: [
            { key: "1", value: this.$t("tm.shared") },
            { key: "0", value: this.$t("tm.notShared") },
          ],
          tab: this.$t("tm.baseInfo"),
        },
        {
          type: "input",
          key: "template_desc",
          des: this.$t("tm.templateDesc"),
          tab: this.$t("tm.baseInfo"),
        },
        {
          type: "input",
          key: "unit_max_level",
          des: this.$t("tm.maxLevel"),
          style: "number",
          tab: this.$t("tm.unitInfo"),
        },
        {
          type: "unitCheckbox",
          key: "bind_uint_list",
          des: this.$t("tm.unitList"),
          tab: this.$t("tm.unitInfo"),
        },
        {
          type: "unitRadio",
          key: "derivative_id",
          des: this.$t("tm.summonType"),
          tab: this.$t("tm.unitInfo"),
        },
        {
          type: "switchSelect",
          key: "attach_model",
          des: this.$t("tm.attachMode"),
          items: [
            { key: "1", value: this.$t("tm.fixedNum") },
            { key: "2", value: this.$t("tm.floatNum") },
          ],
          tab: this.$t("tm.attachInfo"),
        },
        {
          type: "input",
          key: "attach_experience",
          des: this.$t("tm.attachExp"),
          style: "number",
          tab: this.$t("tm.attachInfo"),
        },
        {
          type: "input",
          key: "counterattack_experience",
          des: this.$t("tm.counterAttackExp"),
          style: "number",
          tab: this.$t("tm.attachInfo"),
        },
        {
          type: "input",
          key: "kill_experience",
          des: this.$t("tm.killExp"),
          style: "number",
          tab: this.$t("tm.attachInfo"),
        },
        {
          type: "input",
          key: "antikill_experience",
          des: this.$t("tm.antikillExp"),
          style: "number",
          tab: this.$t("tm.attachInfo"),
        },
        {
          type: "editableAnimate",
          key: "attach_animation",
          des: this.$t("tm.attachAnimation"),
          tab: this.$t("tm.animationSetting"),
        },
        {
          type: "editableAnimate",
          key: "summon_animation",
          des: this.$t("tm.summonAnimation"),
          tab: this.$t("tm.animationSetting"),
        },
        {
          type: "editableAnimate",
          key: "dead_animation",
          des: this.$t("tm.deadAnimation"),
          tab: this.$t("tm.animationSetting"),
        },
        {
          type: "switchSelect",
          key: "promotion_mode",
          items: [
            { key: "0", value: this.$t("tm.notPromotion") },
            { key: "1", value: this.$t("tm.userPromotion") },
            { key: "2", value: this.$t("tm.randomPromotion") },
            { key: "3", value: this.$t("tm.authPromotion") },
          ],
          des: this.$t("tm.promotionMode"),
          tab: this.$t("tm.promotionSetting"),
        },
        {
          type: "input",
          key: "promotion_max_num",
          des: this.$t("tm.maxNumPromotion"),
          style: "number",
          tab: this.$t("tm.promotionSetting"),
        },
        {
          type: "input",
          key: "promotion_level",
          des: this.$t("tm.minLevelPromotion"),
          style: "number",
          tab: this.$t("tm.promotionSetting"),
        },
      ],
      activeName: "baseInfo",
      activeNames: ["1"],
      showDetail: true,
      signal: 0,
      downloadComment: {},
      dialogTimer: null,
    };
  },
  methods: {
    onDialogCreate() {
      this.dialogTimer = setInterval(() => {
        if (this.signal < 1000) {
          this.signal++;
        } else {
          this.signal = 0;
        }
      }, 500);
      this.templateInfoFormConfig;
    },
    onDialogDestroy() {
      clearInterval(this.dialogTimer);
    },
    downLoadTemp(comment) {
      this.$emit("downLoadTemp", comment);
    },
    saveTemp() {
      let args = this.templateDetail;
      args.relation_unit_list = this.templateDetail.bind_uint_list.map(
        (u) => u.id
      );
      args.opt_type = "1";
      SaveTemplateInfo(args).then((resp) => {
        if (resp && resp.res_code == 0) {
          this.$appHelper.successMsg(this.$t("c.saveSuccess"));
          this.$emit("input", false);
          this.$emit("saveOrDel");
        }
      });
    },
    delTemp(templateDetail = this.templateDetail) {
      let _this = this;
      this.$appHelper.showTip(this.$t("c.deleteTip"), () => {
        let args = {};
        args.id = templateDetail.id;
        if (_this.model == "myTemp") {
          RemoveUserTemplate(args).then((resp) => {
            _this.$appHelper.infoMsg(_this.$t("c.deleteSuccess"));
            _this.$emit("input", false);
            _this.$emit("saveOrDel");
          });
        } else if (_this.model == "myDownload") {
          RemoveUserTemplateAttention(args).then((resp) => {
            _this.$appHelper.infoMsg(_this.$t("c.deleteSuccess"));
            _this.$emit("input", false);
            _this.$emit("saveOrDel");
          });
        }
      });
    },

    saveDraft() {
      let args = this.$refs.templateInfoForm.getFormData();
      args.relation_unit_list = args.bind_uint_list.map(
        (u) => u.id
      );
      args.opt_type = "0";
      SaveTemplateInfo(args).then((resp) => {
        if (resp && resp.res_code == 0) {
          this.$appHelper.infoMsg(this.$t("c.saveSuccess"));
          this.$emit("input", false);
          this.$emit("saveOrDel");
        }
      });
    },
    updateVersion() {
      let args = {};
      if (
        this.templateDetail.max_version &&
        this.templateDetail.max_version > this.templateDetail.version
      ) {
        args.template_id = this.templateDetail.id;
        UpdateUserTempAttention(args).then((resp) => {
          this.$appHelper.successMsg(this.$t("c.updateSuccess"));
          this.$emit("input", false);
          this.$emit("saveOrDel");
        });
      } else {
        this.$appHelper.warningMsg(this.$t("c.cannotUpdate"));
      }
    },
    reverVersion() {
      let template = this.templateDetail;
      if (template.status == "0") {
        let args = {};
        args.template_id = template.id;
        RevertTemplateVersion(args).then((resp) => {
          this.$emit("input", false);
          this.$emit("saveOrDel");
        });
      } else {
        this.$appHelper.warningMsg(this.$t("c.cannotRollback"));
      }
    },
    showComment() {
      this.$refs.startComment.showComment();
    },
  },
  computed: {
    dynamicButton() {
      if (this.model == "myTemp") {
        return [
          { name: this.$t("c.publicVersion"), action: this.saveTemp },
          { name: this.$t("c.saveDraft"), action: this.saveDraft },
          { name: this.$t("c.draftRollback"), action: this.reverVersion },
        ];
      } else if (this.model == "myDownload") {
        return [
          { name: this.$t("c.updateVersion"), action: this.updateVersion },
          { name: this.$t("c.deleteDownload"), action: this.delTemp },
        ];
      } else if (this.model == "download") {
        return [
          {
            name: this.$t("tm.downLoadTemplate"),
            action: this.showComment,
          },
        ];
      } else {
        return [];
      }
    },
  },
  watch: {},
  created() {
    this.$appHelper.bindPage2Global(this, "templateDetail");
  },
};
</script>

<style lang="scss" >
#template_detail {
  margin-top: 10px;
  .el-collapse-item__header {
    background-color: #5a5c59;
    color: #ffffff;
    text-align: center;
    padding-left: 45%;
    border-bottom: 1px solid #919191;
  }
  .el-collapse-item__wrap {
    background-color: #5a5c59;
    color: #ffffff;
    border-bottom: 1px solid #919191;
  }
  .el-form-item__label {
    float: left;
    margin-top: 1%;
  }
  .el-form-item__content {
    margin-top: 1%;
    width: 80%;
    padding-bottom: 0% !important;
  }
  .el-form-item__label {
    color: #e0e0e0;
  }
}
</style>
