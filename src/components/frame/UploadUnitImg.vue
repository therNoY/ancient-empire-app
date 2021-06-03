<template>
  <div>
    <ae-base-dialog :title="$t('common.uploadImg')" v-model="showModel">
      <div class="upload-unit-img">
        <upload-game-img
          class="uploadComp"
          :checkFunc="checkSize"
          :unitId="unitId"
          @success="uploadSuccess"
        >
          <img class="upload-img-icon click-cursor" src="../../assets/images/assist/add.png"/>
        </upload-game-img>
        <div
          class="uploadImg"
          v-for="(item, index) in uploadImg"
          :key="item.key"
        >
          <ae-click-point @clickPoint="removeUnit(index)">
            <img :src="$appHelper.getUnitImg(item, 'temporary')" />
          </ae-click-point>
        </div>
      </div>
      <ae-button-list
        slot="footer"
        :buttonList="saveButtonList"
        :clickAction="[previewUnit, createUnit]"
      ></ae-button-list>
    </ae-base-dialog>

    <ae-base-dialog :title="$t('common.preview')" :width="30" v-model="showPreview">
      <div v-for="(color,index) in colorList" :key = index class="previewImg">
        <img v-show="signal % 2 === 0" :src="$appHelper.getUnitImg(previewUnitImg.img1, color)" />
        <img v-show="signal % 2 !== 0" :src="$appHelper.getUnitImg(previewUnitImg.img2, color)" />
      </div>
    </ae-base-dialog>
  </div>
</template>

<script>

import UploadGameImg from "./UploadGameImg.vue";
import dialogShow from "@/mixins/frame/dialogShow.js";
import { CreateUnitImg } from "@/api";
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
      saveButtonList: [this.$t('common.preview'), this.$t('common.create')],
      timerChangeSignal: null,
      signal: 0,
      colorList : ["blue", "red", "green", "black"],
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
      if (this.uploadImg.length > 1) {
        this.$appHelper.infoMsg(this.$t('unitManagement.unitPicTip1'));
        throw new Error(this.$t('unitManagement.unitPicTip1'));
      }
      return true;
    },
    removeUnit(index) {
      this.uploadImg.splice(index, 1);
    },
    previewUnit() {
      console.log("预览");
      if (this.uploadImg.length !== 2) {
        this.$appHelper.infoMsg(this.$t('unitManagement.unitPicTip2'));
        return false;
      }
      let args = {};
      args.img_list = this.uploadImg;
      CreateUnitImg(args).then(({res_val}) => {
            this.showPreview = true;
            this.previewUnitImg = res_val;
        })
    },
    createUnit() {
        if (this.previewUnitImg && this.previewUnitImg.img1 && this.previewUnitImg.img2) {
            this.$emit("input", false);
            this.$emit("uploadOk", this.previewUnitImg);
        } else {
            this.$appHelper.infoMsg(this.$t('unitManagement.needPreviewTip'))
        }
    },
    uploadSuccess(fileName) {
      this.uploadImg.push(fileName);
    },
  },
  created() {
  },
};
</script>

<style lang="scss" scope>
.uploadComp {
}
.uploadImg {
  margin-top: 2%;
  margin-left: 3%;
}
.previewImg{
    width: 30px;
    float: left;
    margin-left: 5%;
}
  .upload-unit-img{
    display: flex;
    width: 70%;
    margin-left: 12%;
  }
</style>
