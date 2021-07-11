<!--下载的评论界面-->
<template>
  <div>
    <ae-base-dialog v-model="show" :title="title" width="35">
      <div class="start-comment">
        <div class="start-comment-label">{{$t('c.rate')}}</div>
        <div>
          <uni-rate size="12" v-model="comment.start" />
        </div>
      </div>
      <div>
        <ae-input
          :label="$t('c.comment')"
          :placeholder="$t('c.inputComment')"
          v-model="comment.comment"
        />
      </div>
      <ae-button-list
        :buttonList="buttonList.map((a) => a.name)"
        :clickAction="buttonList.map((a) => a.action)"
      ></ae-button-list>
    </ae-base-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default(){
        return uni.$t("c.comment")
      },
    },
  },
  data() {
    return {
      show: false,
      comment: {
        comment: "",
        start: 5,
      },
      buttonList: [
        { name: this.$t("c.sure"), action: this.ok },
        { name: this.$t("c.cancel"), action: () => (this.show = false) },
      ],
    };
  },
  methods: {
    showComment() {
      this.show = true;
      this.comment.comment = "";
      this.comment.start = 5;
    },
    ok() {
      this.$emit("ok", this.comment);
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.start-comment {
  width: 96%;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  .start-comment-label {
    width: 20%;
    height: 20px;
    color: white;
  }
}
</style>
