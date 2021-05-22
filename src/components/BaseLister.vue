<template>
  <div style="display: inline">
    <ae-loading style="z-index: 99999"></ae-loading>
    <ae-tip
        v-model="showGlobalTip"
        :buttonList="buttonList"
        :closeTip="closeTip"
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
        style="z-index: 999999"
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
        inputCallback: null,
        closeTip: null,
        inputDialog:{
          title:null,
          label:null,
          placeholder:"请输入..."
        },
        mes: null,
        show: false,
        type: "info",
        buttonList: undefined,
      };
    },
    methods: {
      showTip({ message, callback, buttonList }) {
        (this.buttonList = buttonList), (this.showGlobalTip = true);
        this.closeTip = message;
        this.tipCallback = callback;
      },
      showMessage({ type, mes }) {
        this.type = type;
        this.mes = mes;
        if (this.show) {
          return;
        }
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
      inputDialogOk(res){
        if (this.inputCallback && this.inputCallback instanceof Function) {
          this.inputCallback(res);
        }
      }
    },
    created() {
      this.$eventBus.regist(this, "showTip");
      this.$eventBus.regist(this, "showMessage");
      this.$eventBus.regist(this, "showInputDialog");
    },
  };
</script>
