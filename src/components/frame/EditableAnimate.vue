<!--
  循环展示动画的组件
-->
<template>
  <div class="edit-able-animate">
    <div class="edit-able-animate-button">
      <img
        :class="[$uni.imgSize + '-img-size']"
        src="../../assets/images/assist/change.png"
        @click="changeImg"
      />
    </div>
    <img :class="[$uni.imgSize + '-img-size']" v-if="animImg" :src="animImg" />

    <ae-base-dialog :title="$t('tm.changeAnimate')" v-model="show">
      <div class="edit-anim-list">
        <upload-game-img :templateId="template_id" @success="uploadSuccess">
          <img
            :class="[$uni.imgSize + '-img']"
            src="../../assets/images/assist/add.png"
          />
        </upload-game-img>
        <div
          class="edit-anim-list-item"
          v-for="(item, index) in animImgList"
          :key="item.key"
          draggable="true"
          @dragstart="handleDragStart($event, item, index)"
          @dragenter="handleDragEnter($event, item, index)"
          @dragend="handleDragEnd($event, item, index)"
        >
          <ae-tooltip :content="$t('tm.moveChangeOrder')">
            <ae-click-point @clickPoint="clickPoint(index)">
              <img :class="[$uni.imgSize + '-img-size']" :src="$appHelper.getTemplateImg(item)" />
            </ae-click-point>
          </ae-tooltip>
        </div>
      </div>
    </ae-base-dialog>
  </div>
</template>

<script>
import UploadGameImg from "./UploadGameImg.vue";
export default {
  components: { UploadGameImg },
  props: {
    value: {
      type: String,
    },
    signal: {
      type: Number,
    },
    template_id: {
      default: 1,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      show: false,
      swapStartIndex: null,
      swapEndIndex: null,
    };
  },
  methods: {
    changeImg() {
      this.show = true;
    },
    clickPoint(index) {
      let list = this.animImgList;
      list.splice(index, 1);
      this.$emit("input", list.join(","));
    },
    handleDragStart(event, item, index) {
      this.swapStartIndex = index;
    },
    handleDragEnter(event, item, index) {
      this.swapEndIndex = index;
    },
    uploadSuccess(fileName) {
      let list = this.animImgList;
      list.push(fileName);
      this.$emit("input", list.join(","));
    },
    handleDragEnd(event, item, index) {
      if (this.swapStartIndex == index && this.swapEndIndex != null) {
        let list = this.animImgList;
        let temp = list[this.swapStartIndex];
        list[this.swapStartIndex] = list[this.swapEndIndex];
        list[this.swapEndIndex] = temp;
        this.$emit("input", list.join(","));
      }
      this.swapStartIndex = null;
      this.swapEndIndex = null;
    },
  },
  computed: {
    animImgList() {
      return this.value.split(",");
    },
    animImg() {
      let list = this.value.split(",");
      if (list && list.length > 0) {
        let index = this.signal % list.length;
        let imgUrl = this.$appHelper.getTemplateImg(list[index]);
        return imgUrl;
      } else {
        return null;
      }
    },
  },
  created() {},
  destroyed() {},
};
</script>

<style lang="scss" scope>
.edit-able-animate {
  display: flex;
  .edit-able-animate-button {
    margin-right: 3%;
    /* #ifdef H5*/
    cursor: pointer;
    /* #endif */
  }
  .edit-anim-list {
    display: flex;
    .edit-anim-list-item{
      margin-left: 15px;
    }
  }
}
</style>
