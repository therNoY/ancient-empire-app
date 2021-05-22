<!--按钮集合-->
<template>
  <div class="ae-button-list" v-if="buttonList.length > 0">
    <div
        v-for="(button, index) in buttonList"
        :key="index"
        class="ae-button-list-item"
        :style="{'width':buttonWidth+'%'}"
    >
      <ae-button
        @click="onClick(index)"
        :size="size"
      >
        {{ button }}
      </ae-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    buttonConfig: {
      type: Function,
      default: null,
    },
    buttonList: {
      type: Array,
      default: () => [],
    },
    clickAction: {
      type: Array,
      default: () => [],
    },
    factor: {
      type: Number,
      default: 50,
    },
    size:{
      type: Number,
      default: 0.75,
    }
  },
  methods: {
    onClick(index) {
      this.$emit("click", index);
      if (
        this.clickAction &&
        this.clickAction[index] &&
        this.clickAction[index] instanceof Function
      ) {
        this.clickAction[index]();
      }
    },
  },
  created() {
    if (this.buttonConfig) {
      let res = this.buttonConfig();
      if (res instanceof Array) {
        this.buttonList = res[0];
        this.clickAction = res[1];
      }
    }
    this.$appHelper.bindPage2Global(this, "ButtonList");
  },
  computed: {
    buttonWidth() {
      return this.factor / this.buttonList.length;
    },
  },
};
</script>

<style scoped>
.ae-button-list {
  width: 100%;
  padding: 1%;
  display: flex;
  justify-content: space-around;
}
.ae-button-list-item {
  /*width: 100%;*/
}
</style>
