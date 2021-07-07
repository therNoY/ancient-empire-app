<!--基础按钮-->
<template>
  <div>
    <view :class="['ae-button',disabled?'ae-button-disable':'']" @click="click" :style="{'fontSize': fontSize}">
      <span class="ae-button-text">
        <slot/>
      </span>
    </view>
  </div>
</template>

<script>
  export default {
    props: {
      // 大小默认0.75rem 可以指定
      size: {
        type: [Number,String],
        default: 0.75,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      click() {
        if (!this.disabled) {
          this.$emit("click");
        }
      },
    },
    data(){
      return{
        fontSize: null,
      }
    },
    created() {
      if (typeof this.size == 'number') {
        if (this.$uni.isH5) {
          this.fontSize = this.size / 3 + 'rem';
        } else {
          this.fontSize = this.size + 'rem';
        }
      } else {
        this.fontSize = this.size;
      }

    },
    computed: {},
  };
</script>

<style>

</style>