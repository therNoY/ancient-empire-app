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
      <ae-button :size="size" @click="onClick(index)">
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
    // 扩展因子 越小按钮就越窄 调节按钮之间的宽度
    factor: {
      type: Number,
      // #ifdef H5
      default: 45,
      // #endif
       // #ifndef H5
      default: 40,
      // #endif
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
        let parent = this.$parent;
        let actionFunc = this.clickAction[index];
        let actionName = actionFunc.name;
        if (actionName.indexOf("bound ") >= 0) {
          actionName = actionName.split("bound ")[1];
        }
        if (actionName == "") {
          console.error("不支持匿名类调用");
          return;
        }
        while (
          parent !== undefined &&
          !(parent[actionName] instanceof Function)
        ) {
          parent = parent.$parent;
        }

        if (parent[actionName] instanceof Function) {
          actionFunc.bind(parent)();
        } else {
          console.error("无法执行函数", actionFunc);
        }
      }
    },
    initConfig() {
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
  },
  data() {
    return {
      config: null,
    };
  },
  created() {
    this.$appHelper.bindPage2Global(this, "ButtonList");
    this.initConfig();
  },
  watch: {
    buttonConfig() {
      this.initConfig();
    },
  },
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
