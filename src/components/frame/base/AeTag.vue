<template>
  <div :class="['ae-' + size +'-tag', 'ae-tag', 'ae-'+ type +'-tag']">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      size: {
        type: String,
        default: "normal",
      },
      type: {
        type: String,
        default: "primary",
      },
    },
  };
</script>

<style lang="scss" scoped>
  .ae-tag {
    border-radius: 3px;
    line-height: 20px;
    justify-content: center;
    padding-left: 3px;
    padding-right: 3px;
    /* #ifdef H5 */
    cursor: pointer;
    line-height: 30px;
    /* #endif */
  }

  .ae-normal-tag {
    font-size: 14px;
  }

  .ae-small-tag {
    font-size: 10px;
  }
  .ae-success-tag{
    border: 1px #4cd964 solid;
  }
  .ae-primary-tag{
    border: 1px #007aff solid;
  }
</style>