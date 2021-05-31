
<!--uniapp目前不支持解析 只能手动 if else if 解析 以后支持可以直接返回render -->
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

  return renderConfig;
};
export default {
  props: {
    component: {
      type: String,
    },
    item: {},
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
    } else {
      this.renderConfig = this.$parent.realShowItem[this.functionIndex](
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
        this.renderConfig = this.$parent.realShowItem[this.functionIndex](
          dynamicRender,
          this.item
        );
      }
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