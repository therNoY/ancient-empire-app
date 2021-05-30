<template>
  <div>
    <h1>TEST</h1>
    <movable-area>
      <movable-view class="max" out-of-bounds :x="x" :y="y" direction="all" @change="onChange">
        <img  class="logo" src="../assets/images/assist/main_texture.png" alt />
      </movable-view>
    </movable-area>
  </div>
</template>

<script>
  export default {
    props:[],
    data(){
      return{
        x:0,
        y:0,
      }
    },
    methods: {
      onChange({detail}){
        console.log(arguments)
      }
    },
    computed: {

    },
  }
</script>

<style lang="scss" scoped>
  movable-view {
    display: flex;
    align-items: center;
    justify-content: center;
    /*height: 150rpx;*/
    /*width: 150rpx;*/
    background-color: #007AFF;
    color: #fff;
  }

  movable-area {
    height: 200px;
    width: 200px;
    background-color: #D8D8D8;
    overflow: hidden;
  }

  .max {
    width:500rpx;
    height: 500rpx;
  }
</style>