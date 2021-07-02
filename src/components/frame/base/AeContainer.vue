<template>
  <div
    class="ae-container"
    :style="{ height: _maxHeight }"
    ref="aeContainer"
  >
    <div
      class="ae-container-main"
      ref="aeContainerMain"
      :style="{
        height: maxHeight - inputHeight + 'px',
        maxHeight: maxHeight - inputHeight + 'px',
      }"
    >
      <slot name="main"></slot>
    </div>
    <div ref="aeContainerFooter" class="ae-container-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
const inputHeight = 24;
export default {
  props: {
    maxWidth: {
      type: Number,
      default: -1,
    },
    maxHeight: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      inputHeight: inputHeight + 6,
      _maxHeight: null,
      _maxWidth: null,
    };
  },
  created() {
    if (this.maxWidth === -1) {
      this._maxWidth = "100%";
    } else {
      this._maxWidth = this.maxWidth + "px";
    }
    if (this.maxHeight === -1) {
      this._maxHeight = "100%";
    } else {
      this._maxHeight = this.maxHeight + "px";
    }
  },
};
</script>

<style lang="scss">
.ae-container {
  overflow: scroll;
  display: flex;
  flex-direction: column;
  .ae-container-main{
    overflow: scroll;
  }
  .ae-container-footer {
    width: 100%;
  }
}
</style>