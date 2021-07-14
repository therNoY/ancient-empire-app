<template>
  <div>
    <ae-base-dialog :title="$t('c.uploadImg')" v-model="showModel">
      <div class="upload-unit-img">
        <upload-game-img
          :checkFunc="checkSize"
          :unitId="unitId"
          @success="uploadSuccess"
        >
          <img
            class="upload-img-icon click-cursor"
            src="../../assets/images/assist/add.png"
          />
        </upload-game-img>
        <div
          class="uploadImg"
          v-for="(item, index) in uploadImg"
          :key="item.key"
        >
          <ae-click-point @clickPoint="removeUnit(index)">
            <img
              class="stand-img-size"
              :src="$appHelper.getUnitImg(item, 'temporary')"
            />
          </ae-click-point>
        </div>
      </div>
      <ae-button-list
        slot="footer"
        :buttonList="saveButtonList"
        :clickAction="[previewUnit, createUnit]"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog :title="$t('c.preview')" :width="30" v-model="showPreview">
      <div v-for="(color, index) in colorList" :key="index" class="previewImg">
        <img
          class="stand-img-size"
          v-show="signal % 2 === 0"
          :src="$appHelper.getUnitImg(previewUnitImg.img1, color)"
        />
        <img
          class="stand-img-size"
          v-show="signal % 2 !== 0"
          :src="$appHelper.getUnitImg(previewUnitImg.img2, color)"
        />
      </div>
    </ae-base-dialog>
  </div>
</template>

<script>
import UploadGameImg from "./UploadGameImg.vue";
import dialogShow from "@/mixins/frame/dialogShow.js";
import { CreateUnitImg } from "@/api";
let _this;
export default {
  mixins: [dialogShow],
  components: {
    UploadGameImg,
  },
  props: {
    unitId: {
      default: "-1",
    },
  },
  data() {
    return {
      uploadImg: [],
      showPreview: false,
      saveButtonList: [this.$t("c.preview"), this.$t("c.create")],
      timerChangeSignal: null,
      signal: 0,
      colorList: ["blue", "red", "green", "black"],
      previewUnitImg: {},
    };
  },
  methods: {
    onDialogCreate() {
      let _this = this;
      if (this.timerChangeSignal == null) {
        this.timerChangeSignal = setInterval(() => {
          if (_this.signal < 1000) {
            _this.signal++;
          } else {
            _this.signal = 0;
          }
        }, 300);
      }
      this.uploadImg = [];
    },
    onDialogDestroy() {
      if (this.timerChangeSignal != null) {
        clearInterval(this.timerChangeSignal);
        this.timerChangeSignal = null;
      }
    },
    checkSize() {
      if (_this.uploadImg.length > 1) {
        _this.$appHelper.infoMsg(_this.$t("um.unitPicTip1"));
        return false;
      }
      return true;
    },
    removeUnit(index) {
      _this.uploadImg.splice(index, 1);
    },
    previewUnit() {
      console.log("预览");
      if (_this.uploadImg.length !== 2) {
        _this.$appHelper.infoMsg(_this.$t("um.unitPicTip2"));
        return false;
      }
      let args = {};
      args.img_list = _this.uploadImg;
      CreateUnitImg(args).then(({ res_val }) => {
        _this.showPreview = true;
        _this.previewUnitImg = res_val;
      });
    },
    createUnit() {
      if (
        _this.previewUnitImg &&
        _this.previewUnitImg.img1 &&
        _this.previewUnitImg.img2
      ) {
        _this.$emit("input", false);
        _this.$emit("uploadOk", _this.previewUnitImg);
      } else {
        _this.$appHelper.infoMsg(this.$t("um.needPreviewTip"));
      }
    },
    uploadSuccess(fileName) {
      _this.uploadImg.push(fileName);
    },
  },
  created() {
    _this = this;
  },
};
</script>

<style lang="scss" scope>
.uploadImg {
  margin-top: 2%;
  margin-left: 3%;
}
.previewImg {
  width: 30px;
  float: left;
  margin-left: 5%;
}
.upload-unit-img {
  display: flex;
  width: 70%;
  margin-left: 12%;
}
</style>
