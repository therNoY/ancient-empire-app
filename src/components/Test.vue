<template>
  <div>
    <h1>移动</h1>
    <movable-area>
      <movable-view class="max" out-of-bounds :x="x" :y="y" direction="all" @change="onChange">
        <img  class="logo" src="../assets/images/assist/main_texture.png" alt />
      </movable-view>
    </movable-area>
    <h1>分段</h1>
    <uni-segmented-control :current="current" :values="items" style-type="text" active-color="red" @clickItem="onClickItem" />
    <h1>tooltip</h1>
    <ae-tooltip>
      <h2>哈哈哈</h2>
    </ae-tooltip>
    <h1>表格</h1>
    <uni-table>
      <tr>
        <uni-th>1</uni-th>
        <uni-th>2</uni-th>
        <uni-th>3</uni-th>
      </tr>
      <tr>
        <uni-td>11</uni-td>
        <uni-td>22</uni-td>
        <uni-td>33</uni-td>
      </tr><tr>
        <uni-td>111</uni-td>
        <uni-td>222</uni-td>
        <uni-td>333</uni-td>
      </tr>
    </uni-table>
  </div>
</template>

<script>
import AeTooltip from './frame/base/AeTooltip.vue';
  export default {
    props:[],
    data(){
      return{
        x:0,
        y:0,
        current:1,
        items: ['选项卡1', '选项卡2', '选项卡3'],
        styleType: 'button'
      }
    },
    methods: {
      onChange({detail}){
        console.log(arguments)
      },
      onClickItem(){
        console.log(arguments);
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