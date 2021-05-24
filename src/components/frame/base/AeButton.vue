<template>
  <div class="ae-button-body">
    <view class="ae-button" @click="click" :style="{'fontSize': fontSize + 'rem'}">
      <span class="ae-button-text">
        <slot/>
      </span>
    </view>
  </div>
</template>

<script>
  export default {
    props: {
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

</style>