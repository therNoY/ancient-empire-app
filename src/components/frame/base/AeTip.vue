<template>
  <ae-base-dialog v-model="showModel" :title="title">
    <div class="ae-close-tip" v-html="closeTip"></div>
    <ae-button-list
      slot="footer"
      :buttonList="buttonList"
      @click="onClick"
    ></ae-button-list>
  </ae-base-dialog>
</template>

<script>
import dialogShow from "@/mixins/frame/dialogShow.js";
export default {
  mixins: [dialogShow],
  props: {
    closeTip: {
      type: String,
      default() {
        return uni.$t("common.sureClose");
      },
    },
    title: {
      type: String,
      default() {
        return uni.$t("common.tip");
      },
    },
    value: {
      type: Boolean,
      default: false,
    },
    buttonList: {
      type: Array,
      default() {
        return [uni.$t("common.sure"), uni.$t("common.cancel")];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    onClick(index) {
      if (index == 0) {
        this.$emit("input", false);
        this.$emit("ok");
        this.$emit("close");
      } else {
        this.$emit("input", false);
        this.$emit("close");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ae-close-tip {
  color: rgb(195, 195, 195);
}
</style>
