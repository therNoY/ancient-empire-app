<!-- 加减选择器 -->
<template>
  <div class="ae-switch-select">
    <div v-if="label" class="ae-switch-label">{{ label }}</div>
    <ae-button
      class="ae-switch-select-right-button"
      :width="100"
      :disabled="!editAble"
      :size="0.1"
      @click="getRightItem"
    >
      <view>
        <uni-icons type="back" color="#ffffff" size="20" />
      </view>
    </ae-button>
    <div class="ae-switch-select-body">{{ showValue }}</div>
    <ae-button
      class="ae-switch-select-left-button"
      :width="100"
      :size="0.1"
      :disabled="!editAble"
      @click="getLeftItem"
    >
      <uni-icons type="forward" color="#ffffff" size="20" />
    </ae-button>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
    items: {
      type: Array,
    },
    editAble: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
    },
    default: {},
  },

  data() {
    return {
      key: null,
      showIndex: 0,
    };
  },
  created() {
    if (!this.value && this.default) {
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        if (item.key == this.default) {
          this.$emit("input", item.key);
          break;
        }
      }
    }
  },
  watch: {
    value(v) {
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        if (item.key == v) {
          this.key = item.key;
          this.showIndex = i;
          break;
        }
      }
    },
  },
  methods: {
    getRightItem() {
      if (this.showIndex > 0) {
        this.$emit("input", this.items[this.showIndex - 1].key);
      } else {
        this.$emit("input", this.items[this.items.length - 1].key);
      }
    },
    getLeftItem() {
      if (this.showIndex < this.items.length - 1) {
        this.$emit("input", this.items[this.showIndex + 1].key);
      } else {
        this.$emit("input", this.items[0].key);
      }
    },
  },
  computed: {
    showValue() {
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        if (item.key == this.value) {
          return item.value;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ae-switch-select {
  width: 96%;
  float: left;
  padding: 1%;
  /*background-color: #d9b04d;*/
  .ae-switch-label {
    float: left;
    width: 20%;
    font-size: 14px;
    padding-top: 1%;
    color: aliceblue;
  }
  .ae-switch-select-right-button {
    width: 10%;
    float: left;
  }
  .ae-switch-select-body {
    width: 30%;
    /* #ifdef H5*/
    font-size: 14px;
    /* #endif*/
    /* #ifdef MP-WEIXIN */
    font-size : 0.75rem;
    /* #endif */
    padding-top: 1%;
    float: left;
    color: rgb(255, 255, 255);
  }
  .ae-switch-select-left-button {
    width: 10%;
    float: left;
  }
}
</style>
