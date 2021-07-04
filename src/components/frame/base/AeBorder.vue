<!--基础-->
<template>
  <div>
    <div v-if="!noBorder" class="ae-main-border">
      <img class="t_b border" src="../../../assets/images/assist/t_b.png" />
      <img class="l_b border" src="../../../assets/images/assist/l_b.png" />
      <img class="b_b border" src="../../../assets/images/assist/b_b.png" />
      <img class="r_b border" src="../../../assets/images/assist/r_b.png" />
      <img class="t_r_b corner" src="../../../assets/images/assist/t_r_b.png" />
      <img class="t_l_b corner" src="../../../assets/images/assist/t_l_b.png" />
      <img class="r_d_b corner" src="../../../assets/images/assist/r_d_b.png" />
      <img class="l_d_b corner" src="../../../assets/images/assist/l_d_b.png" />
    </div>
    <div :style="{ padding: padding }" class="ae-border-main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    noBorder: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: String,
      // #ifdef H5
      default: "15px",
      // #endif
      // #ifndef H5
      default: "8px",
      // #endif
    },
  },
};
</script>

<style lang="scss" scope>
.ae-main-border {
  .corner {
    z-index: 999;
    width: 16px;
    height: 16px;
  }

  .border {
    z-index: 998;
  }

  .t_b,
  .b_b {
    height: 5px;
    position: absolute;
    left: 0px;
    width: 100%;
  }

  .t_b {
    top: 0px;
  }

  .b_b {
    bottom: 0px;
  }

  .r_b,
  .l_b {
    width: 5px;
    position: absolute;
    top: 0px;
    height: 100%;
  }

  .l_b {
    left: 0px;
  }

  .r_b {
    right: 0px;
  }

  .t_l_b,
  .t_r_b,
  .l_d_b,
  .r_d_b {
    position: absolute;
  }

  .t_l_b {
    top: 0px;
    left: 0px;
  }

  .t_r_b {
    top: 0px;
    right: 0px;
  }

  .r_d_b {
    bottom: 0px;
    right: 0px;
  }

  .l_d_b {
    bottom: 0px;
    left: 0px;
  }
}

.ae-border-content {
  padding: 24px;
}
</style>
