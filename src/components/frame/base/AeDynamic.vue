
<!--uniapp目前不支持解析render 只能手动 if else if 解析 以后支持可以直接返回render -->
<template>
  <div>
    <div v-if="renderConfig.label === 'button'">
      <button>{{ renderConfig.slot }}</button>
    </div>
    <div v-else-if="renderConfig.label === 'div'">
      <div>{{ renderConfig.slot }}</div>
    </div>
    <div v-else-if="renderConfig.label === 'img'">
      <img
        :src="renderConfig.src"
        :style="{ width: renderConfig.width, height: renderConfig.height }"
      />
    </div>
    <div v-else-if="renderConfig.label === 'aeButton'">
      <ae-button :width="renderConfig.width" :size="renderConfig.size" @click="renderConfig['click']()">{{ renderConfig.slot }}</ae-button>
    </div>
  </div>
</template>

<script>
const dynamicRender = function (label, options, slot) {

  let renderConfig = {
    label: label,
    slot: slot,
  };

  if (options.attrs) {
    renderConfig = Object.assign(renderConfig, options.attrs);
  }
  if (options.props) {
    renderConfig = Object.assign(renderConfig, options.props);
  }

  if (options.on) {
    for(let key in options.on) {
      renderConfig[key] = options.on[key];
    }
  }

  return renderConfig;
};
export default {
  props: {
    component: {
      type: String,
    },
    item: {},
    itemList:{},
    dataArray:{},
    // 微信小程序使用 function传递值为空 可以根据发function渲染 也可以根据 functionIndex
    componentFunction: {
      type: Function,
    },
    functionIndex: {
      type: Number,
    },
  },
  data() {
    return {
      renderConfig: {},
    };
  },
  created() {
    if (this.componentFunction instanceof Function) {
      this.renderConfig = this.componentFunction(dynamicRender, this.item);
    } else if (this.itemList instanceof Array){
      this.renderConfig = this.itemList[this.functionIndex](
          dynamicRender,
          this.item
      );
    }
  },
  watch: {
    item() {
      if (this.componentFunction instanceof Function) {
        this.renderConfig = this.componentFunction(dynamicRender, this.item);
      } else {
        this.renderConfig = this.itemList[this.functionIndex](
          dynamicRender,
          this.item
        );
      }
      this.$emit("updateRealDisplayData", this.item);
    },
  },
  /**
   * 使用render返回 uni-app暂不支持
   */
  // render: function (createElement) {
  // return this.componentFunction(createElement, this.item);
  // },
};
</script>

<style>
</style>