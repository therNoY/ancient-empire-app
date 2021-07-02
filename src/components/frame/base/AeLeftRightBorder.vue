<!--基础弹框-->
<template>
    <div class="ae-border-content">
      <img class="l_b border" src="../../../assets/images/assist/l_b.png"/>
      <slot></slot>
      <img class="r_b border" src="../../../assets/images/assist/r_b.png"/>
    </div>
</template>

<script>
</script>

<style lang="scss" scope>
  .ae-border-content {
    display: flex;
    flex-direction: row;
    .border {
      z-index: 9998;
    }

    .ae-border-line {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .r_b, .l_b {
      width: 5px;
    }
  }

</style>
