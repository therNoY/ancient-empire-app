<template>
  <div @click="beforeUpload">
    <slot></slot>
  </div>
</template>

<script>
import { baseUrl } from "../../api/env";
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    templateId: {},
    unitId: {},
    checkFunc: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      uploadUrl: null,
      uploadImgList: [],
    };
  },
  methods: {
    beforeUpload() {
      if (!(this.checkFunc instanceof Function) || this.checkFunc()) {
        this.upload();
      }
    },
    upload() {
      let _this = this;
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album"],
        success: (res) => {
          console.log(
            "chooseImage success, temp path is",
            res.tempFilePaths[0]
          );
          let imageSrc = res.tempFilePaths[0];
          uni.uploadFile({
            url: _this.uploadUrl,
            filePath: imageSrc,
            fileType: "image",
            name: "file",
            success: ({ data }) => {
              let { res_code, res_mes, res_val } = JSON.parse(data);
              if (res_code !== 0) {
                _this.$appHelper.errorMsg(res_mes);
                _this.$emit("error");
              } else {
                _this.$appHelper.successMsg(_this.$t("c.uploadSuccess"));
                _this.$emit("success", res_val);
              }
            },
            fail: (err) => {
              console.log("uploadImage fail", err);
              _this.$appHelper.errorMsg(_this.$t("c.commonErr"));
              _this.$emit("error");
            },
          });
        },
        fail: (err) => {
          console.log("chooseImage fail", err);
          // #ifdef MP
          uni.getSetting({
            success: (res) => {
              let authStatus = res.authSetting["scope.album"];
              if (!authStatus) {
                uni.showModal({
                  title: _this.$t("c.authErr"),
                  content: _this.$t("c.gameName") + _this.$t("um.authErr"),
                  success: (res) => {
                    if (res.confirm) {
                      uni.openSetting();
                    }
                  },
                });
              }
            },
          });
          // #endif
        },
      });
    },
  },
  created() {
    if (this.templateId) {
      this.uploadUrl = baseUrl + "/upload/template/" + this.templateId;
    } else {
      this.uploadUrl = baseUrl + "/upload/unit/" + this.unitId;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>