<!--基础弹框-->
<template>
  <div>
    <div v-if="noBorder">
      <slot></slot>
    </div>
    <div v-else class="ae-main-border" :style="{'background':background}">
      <div class="ae-border-line">
        <img class="t_l_b corner" src="../../../assets/images/assist/t_l_b.png" />
        <img class="t_b border" src="../../../assets/images/assist/t_b.png" />
        <img class="t_r_b corner" src="../../../assets/images/assist/t_r_b.png" />
      </div>

      <!-- TODO 这里wx展示边框会有问题 解决办法 使用图片作为边框展示https://www.runoob.com/try/try.php?filename=trycss3_border-image -->
      <div  class="ae-border-content">
        <!-- #ifdef H5 -->
        <img class="l_b border" src="../../../assets/images/assist/l_b.png" />
        <!-- #endif -->
        <slot></slot>
        <!-- #ifdef H5 -->
        <img class="r_b border" src="../../../assets/images/assist/r_b.png" />
        <!-- #endif -->
      </div>

      <div class="ae-border-line" style="align-items: flex-end">
        <img class="l_d_b corner" src="../../../assets/images/assist/l_d_b.png" />
        <img class="b_b border" src="../../../assets/images/assist/b_b.png" />
        <img class="r_d_b corner"  src="../../../assets/images/assist/r_d_b.png" />
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    props: {
      background:{
        type:String,
        default(){
          return "#242a43";
        }
      },
      noBorder:{
        type:Boolean,
        default:false,
      }
    },
    data() {
      return {
      };
    },
    methods: {
    },
    computed: {},
    mounted(){
    },
    created() {
    },
  };
</script>

<style lang="scss" scope>
  .ae-main-border {
    display: flex;
    flex-direction: column;
    width: 100%;
    .borderContent {
    }
    .corner {
      z-index: 9998;
      width: 16px;
      height: 16px;
    }
    .border{
      z-index: 9998;
    }
    .ae-border-content{
      display: flex;
      flex-direction: row;
      /*border:2px solid #ddd;*/
      /*-webkit-border-image:url(../../../assets/images/assist/l_b.png) 30 30 stretch;*/
      /*-o-border-image:url(../../../assets/images/assist/l_b.png) 30 30 stretch;*/
      /*border-image:url(../../../assets/images/assist/l_b.png) 30 30 stretch;*/
    }
    .ae-border-line{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .t_b, .b_b{
      height: 5px;
      flex: 1 1 auto;
    }
    .r_b, .l_b{
      width: 5px;
      /*flex: 1 1 auto;*/
    }
    .t_l_b, .t_r_b{
      display: block;
    }
  }
</style>
