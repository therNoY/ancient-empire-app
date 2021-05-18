<template>
  <div class="ae-button-body">
    <view class="ae-button" @click="click"
          :style="{'fontSize': fontSize + 'rem','marginLeft':marginLeft + '%'}">
      <span class="ae-button-text">
        <slot/>
      </span>
    </view>
  </div>
</template>

<script>
  export default {
    props: {
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
        default: 0.75,
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
      this.fontSize = this.fontSize / 3;
      // #endif
    },
    computed: {},
  };
</script>

<style>
  .ae-button {
    float: left;
    width:100%;
    color: rgb(255, 255, 255);
    cursor: pointer;
    background-color: #5a5c59;
    /* #ifdef H5*/
    -webkit-text-stroke: 0.2px #000000;
    border-top: 2px #818181 solid;
    border-left: 2px #818181 solid;
    border-right: 2px #494949 solid;
    border-bottom: 2px #494949 solid;
    /* #endif*/
    /* #ifdef MP-WEIXIN */
    -webkit-text-stroke: 0.03px #000000;
    border-top: 2rpx #818181 solid;
    border-left: 2rpx #818181 solid;
    border-right: 2rpx #494949 solid;
    border-bottom: 2rpx #494949 solid;
    /* #endif */
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