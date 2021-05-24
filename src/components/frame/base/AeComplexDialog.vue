<!--继承了基础功能的弹框-->
<template>
  <ae-base-dialog
      v-if="showModel"
      :setFullScreen="setFullScreen"
      :value="showModel"
      :closeTip="closeTip"
      :width="width"
      :title="title"
      @close="$emit('input', false)"
  >
    <div class="ae-dialog-content">

      <div class="ae-dialog-body-title">
        <ae-button-list
            v-if="titleButtons && setFullScreen.length > 0"
            :style="{'width':vueStyle.titleButtonWidth}"
            :buttonList="titleButtons.map((a) => a.name)"
            :clickAction="titleButtons.map((a) => a.action)"
        ></ae-button-list>
        <ae-switch-select
            v-if="titleSwitchSelect"
            ref="titleSwitchSelect"
            :style="{'width': vueStyle.switchButtonWidth}"
            v-model="titleSwitchSelectValue"
            :default="titleSwitchSelect.default"
            :items="titleSwitchSelect.items"
            :label="titleSwitchSelect.des"
        ></ae-switch-select>
        <ae-input
            v-model="queryCondition"
            style="width:25%;padding:1%"
            v-if="showSearch"
            @onChange="flushPageAndData()"
            :placeholder="$t('common.search')"
            :width="searchWidth"
        ></ae-input>
      </div>

      <section class="ae-dialog-popup-body">
        <div class="main-body" v-if="showContent === 'dataGrid'">
          <ae-data-grid
              ref="dataGrid"
              :data="dataGridSet"
              :showItem="showItem"
              :showTitle="showTitle"
              :page="page"
              :count="pageCount"
              :tableConfig="tableConfig"
              @onPageNowChange="onPageNowChange"
          ></ae-data-grid>
        </div>
        <div class="main-body" v-else-if="showContent === 'showForm'">
          <ae-form
              ref="aeForm"
              v-if="showModel"
              :formConfig="formConfig"
              :dataObj="dataObj"
          ></ae-form>
        </div>
      </section>
    </div>

    <template  class="ae-dialog-popup-footer" slot="footer">
      <ae-button-list
          v-if="footerButtons"
          :buttonList="footerButtons.map((a) => a.name)"
          @click="clickFooterAction"
      ></ae-button-list>
    </template >

  </ae-base-dialog>
</template>

<script>
  import dialogShow from "@/mixins/frame/dialogShow.js";

  export default {
    name: "complexDialogPage",
    mixins: [dialogShow],
    components: {},
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      // 是否全屏 只有是不是H5的时候有校
      setFullScreen: {
        type: Boolean,
        default: false,
      },
      width: {
        type: Number,
        default: 42,
      },
      title: {
        type: String,
        default: "",
      },
      showSearch: {
        type: Boolean,
        default: false,
      },
      titleButtons: {
        type: Array,
        default: () => [],
      },
      footerButtons: {
        type: Array,
        default: () => [],
      },
      // 表格data数据
      initQueryDataGrid: {
        type: Function,
      },
      showTitle: {
        type: Array,
      },
      showItem: {
        type: Array,
        default: () => [],
      },
      tableConfig: {},
      page: {
        type: Boolean,
        default: false,
      },
      // 表单数据
      formConfig: {
        type: Array,
      },
      titleSwitchSelect: {
        type: Object,
        default: null,
      },
      closeTip: {
        type: String,
      },
      dataObj: {
        type: Object,
        default: null,
      },
      showCloseTip: {
        type: Boolean,
      },
    },
    data() {
      return {
        queryCondition: "",
        showContent: "", // 展示模式 可以传数据进来
        dataGridSet: [],
        pageInfo: {
          pageStart: 1,
          pageSize: 10,
        },
        pageCount: 0,
        titleSwitchSelectValue: "",
        queryDataGrid: null,
        searchWidth: 70,
        vueStyle: {
          titleButtonWidth: null,
          switchButtonWidth: null,
        }

      };
    },
    methods: {
      flushPageAndData(pageStart = 1) {
        this.pageInfo.pageStart = pageStart;
        this.flushData();
      },
      flushData() {
        let queryInfo = {};
        queryInfo.condition = this.queryCondition;
        queryInfo.page_start = this.pageInfo.pageStart;
        queryInfo.page_size = this.pageInfo.pageSize;
        let _this = this;
        console.log("查询");
        return new Promise((resove, reject) => {
          if (_this.queryDataGrid == null) {
            reject(false);
            return;
          }
          _this.$appHelper.setLoading();
          _this.queryDataGrid(queryInfo).then(({res_val, res_code}) => {
            if (res_code === 0) {
              if (_this.page) {
                _this.dataGridSet = res_val.data;
                _this.pageCount = res_val.page_count;
              } else {
                _this.dataGridSet = res_val;
              }

              resove(res_val.data);
            } else {
              reject(false);
            }
            _this.$appHelper.setLoading();
          })
          .catch((error) => {
            _this.$appHelper.setLoading();
          });
        });
      },
      onDialogCreate() {
        if (!this.titleSwitchSelect && this.queryDataGrid != null) {
          console.log("初始化查询");
          this.flushData();
        }
      },
      getDataGridSelect() {
        if (this.$refs.dataGrid) {
          let res = this.$refs.dataGrid.getSelect();
          if (!res) {
            this.$appHelper.warningMsg(this.$t("common.chooseLineWaring"));
            throw new Error("未选择数据");
          } else {
            return res;
          }
        } else {
          this.$appHelper.warningMsg(this.$t("common.chooseLineWaring"));
          throw new Error("未选择数据");
        }
      },
      onPageNowChange(pageNow) {
        this.pageInfo.pageStart = pageNow;
        this.flushData();
      },
      getFormData() {
        if (this.$refs.aeForm && this.$refs.aeForm.formData) {
          return this.$refs.aeForm.formData;
        }
        return null;
      },

      clickFooterAction(index){
        this.$parent[this.footerButtons[index].action]();
      },

      setPageStyle() {
        if (this.showSearch || this.titleSwitchSelect) {
          if (this.showSearch && !this.titleSwitchSelect) {
            this.vueStyle.titleButtonWidth = "40%";
          } else if (!this.showSearch && this.titleSwitchSelect) {
            this.vueStyle.titleButtonWidth = "20%";
          } else {
            this.vueStyle.titleButtonWidth = "15%";
          }
        } else {
          this.vueStyle.titleButtonWidth = "50%";
        }

        if (this.showSearch) {
          this.vueStyle.switchButtonWidth = "50%";
        } else {
          this.vueStyle.switchButtonWidth = "80%";
        }
      },
    },
    created() {
      this.queryDataGrid = this.initQueryDataGrid;
      if (this.queryDataGrid) {
        this.showContent = "dataGrid";
      } else if (this.formConfig && this.formConfig.length > 0) {
        this.showContent = "showForm";
      }

      // 兼容历史
      if (!this.footerButtons && this.footerButtonList) {
        for (let i = 0; i < this.footerButtonList.length; i++) {
          let button = {'name': this.footerButtonList[i], 'action': this.footerClickAction[i]};
          this.footerButtons.push(button);
        }
      }

      this.setPageStyle();
      // #ifdef MP-WEIXIN
      this.searchWidth = 100;
      // #endif
    },
    computed: {},
    watch: {
      titleSwitchSelectValue(v) {
        for (const select of this.titleSwitchSelect.items) {
          if (
              select.key == v &&
              select.query &&
              select.query instanceof Function
          ) {
            this.queryDataGrid = select.query;
            this.flushData();
            break;
          }
        }
        this.$emit("titleSwitchSelectChange", v);
      },
    },
  };
</script>

<style lang="scss" scope>
  .ae-dialog-content {
    display: flex;
    flex-direction: column;

    .ae-dialog-body-title {
      display: flex !important;
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }

    .ae-dialog-popup-body {
      color: rgb(255, 255, 255);
      font-size: 17px;
      font-weight: 530;

      .main-body {
        float: left;
        width: 100%;
      }
    }
  }

</style>
