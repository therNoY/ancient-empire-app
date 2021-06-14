<!--按钮集合-->
<template>
  <div class="ae-button-list" v-if="buttonList.length > 0">
    <div
      v-for="(button, index) in buttonList"
      :key="index"
      class="ae-button-list-item"
      :style="{ width: buttonWidth + '%' }"
      v-show="
        config === null ||
        config[index] === null ||
        config[index].display === true
      "
    >
      <ae-button @click="onClick(index)">
        {{ button }}
      </ae-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /***
     * 配置某一个按钮的配置 比如可以控制某一个按钮不显示 {"测试":”{display:false}“}
     */
    buttonConfig: {
      type: Object,
      default: null,
    },
    // 按钮的名称集合
    buttonList: {
      type: Array,
      default: () => [],
    },
    // 按钮的方法集合
    clickAction: {
      type: Array,
      default: () => [],
    },
    // 扩展因子 调节按钮之间的宽度
    factor: {
      type: Number,
      default: 50,
    },
    // 按钮字体大小
    size: {
      type: [Number, String],
      default: 0.75,
    },
  },
  methods: {
    onClick(index) {
      this.$emit("click", index);
      if (
        this.clickAction &&
        this.clickAction[index] &&
        this.clickAction[index] instanceof Function
      ) {
        this.clickAction[index].bind(this.$parent)();
      }
    },
  },
  data() {
    return {
      config: null,
    };
  },
  created() {
    this.$appHelper.bindPage2Global(this, "ButtonList");
    if (this.buttonConfig !== null) {
      this.config = Array.from(Array(this.buttonList.length), (v, k) => null);
      for (let key of Object.keys(this.buttonConfig)) {
        let index;
        if ((index = Number.parseInt(key)) < this.buttonList.length) {
          this.config[index] = this.buttonConfig[key];
        }
      }
      console.log("buttonList: config", this.config);
    }
  },
  watch: {},
  computed: {
    buttonWidth() {
      if (this.buttonList.length === 1) {
        return 40;
      } else {
        let displayCount = 0;
        return this.factor / (this.buttonList.length - displayCount);
      }
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
</style>
