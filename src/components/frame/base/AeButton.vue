<template>
  <div class="ae-button-body">
    <view class="ae-button" @click="click"
          :style="{'width':width + '%','fontSize': fontSize + 'rem','marginLeft':marginLeft + '%'}">
      <span class="ae-button-text">
        <slot/>
      </span>
    </view>
  </div>
</template>

<script>
  export default {
    props: {
      /**
       * 按钮所占父容器的宽度
       */
      width: {
        type: Number,
        default: 20,
      },
      marginLeft: {
        type: Number,
        default: 10,
      },
      marginTop: {
        type: Number,
        default: 5,
      },
      size: {
        type: Number,
        default: 0.45,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      click() {
        this.$emit("click");
      },
    },
    data(){
      return{
        fontSize: this.size,
      }
    },
    created() {
      // #ifdef H5
      this.fontSize = this.fontSize / 2;
      // #endif
    },
    computed: {},
  };
</script>

<style>
  .ae-button {
    float: left;
    color: rgb(255, 255, 255);
    cursor: pointer;
    background-color: #5a5c59;
    border-top: 2rpx #818181 solid;
    border-left: 2rpx #818181 solid;
    border-right: 2rpx #494949 solid;
    border-bottom: 2rpx #494949 solid;
    -webkit-text-stroke: 0.02px #000000;
    border-radius: 3px;
    overflow: hidden;
    padding-top: 1%;
    padding-bottom: 1%;
  }

  .ae-button:hover {
    box-shadow: 0 1px 8px 0 rgba(255, 255, 255, 0.322);
  }

  .ae-button-text {

  }
</style>