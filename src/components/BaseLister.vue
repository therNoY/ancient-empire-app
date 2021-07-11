<template>
  <div style="display: inline">
    <ae-loading :showLoading="loading"></ae-loading>
    <ae-tip
      v-model="showGlobalTip"
      :buttonList="buttonList"
      :closeTip="closeTip"
      :title="tipTitle"
      @ok="tipOk"
    ></ae-tip>
    <ae-input-dialog
      ref="aeInputDialog"
      :title="inputDialog.title"
      :label="inputDialog.label"
      :placeholder="inputDialog.placeholder"
      v-model="showGlobalInputDialog"
      @ok="inputDialogOk"
    ></ae-input-dialog>
    <ae-message
      :mes="mes"
      :show="show"
      :type="type"
      :color="color"
    ></ae-message>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showGlobalTip: false,
      showGlobalInputDialog: false,
      tipCallback: null,
      tipTitle: null,
      buttonList: [],
      defTipTitle: this.$t("c.tip"),
      defTipButtonList: [this.$t("c.sure"), this.$t("c.cancel")],

      inputCallback: null,
      closeTip: null,
      loading: false,
      inputDialog: {
        title: null,
        label: null,
        placeholder: "请输入...",
      },
      mes: null,
      show: false,
      type: "info",
      color: null,
      
    };
  },
  methods: {
    showTip({ message, callback, buttonList, tipTitle }) {
      this.buttonList = this.defTipButtonList;
      this.tipTitle = this.defTipTitle;
      if (buttonList) {
        this.buttonList = buttonList;
      }
      if (tipTitle) {
        this.tipTitle = tipTitle;
      }
      this.showGlobalTip = true;
      this.closeTip = message;
      this.tipCallback = callback;
    },
    showMessage({ type, mes, color }) {
      this.type = null;
      this.mes = mes;
      this.color = null;
      if (this.show) {
        return;
      }
      this.type = type;
      this.color = color;
      this.show = true;
      setTimeout(() => {
        this.show = false;
      }, 1000);
    },
    showInputDialog({ title, label, placeholder, callback }) {
      this.inputDialog.title = title;
      this.inputDialog.label = label;
      this.inputDialog.placeholder = placeholder;
      this.showGlobalInputDialog = true;
      this.inputCallback = callback;
    },
    tipOk() {
      if (this.tipCallback && this.tipCallback instanceof Function) {
        this.tipCallback();
      }
    },
    inputDialogOk(res) {
      if (this.inputCallback && this.inputCallback instanceof Function) {
        this.inputCallback(res);
      }
    },
    showLoading(loading) {
      if (loading === undefined) {
        this.loading = !this.loading;
      } else {
        this.loading = loading;
      }
    },
  },
  created() {
    this.$eventBus.regist(this, "showTip");
    this.$eventBus.regist(this, "showMessage");
    this.$eventBus.regist(this, "showInputDialog");
    this.$eventBus.regist(this, "showLoading");
  },
};
</script>
