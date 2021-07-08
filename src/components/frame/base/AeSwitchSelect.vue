<!--左右选择器-->
<template>
  <div class="ae-switch-select">
    <div v-if="label" class="ae-switch-label">{{ label }}</div>
    <div class="ae-switch-select-content">
      <img
        :class="[
          'ae-switch-select-button',
          !editAble ? 'disable-cursor' : 'click-cursor',
        ]"
        @click="getRightItem"
        src="../../../assets/images/assist/switch4.png"
      />
      <div class="ae-switch-select-body">
        <span class="ae-switch-select-font">{{ showValue }}</span>
      </div>
      <img
        :class="[
          'ae-switch-select-button',
          !editAble ? 'disable-cursor' : 'click-cursor',
        ]"
        @click="getLeftItem"
        src="../../../assets/images/assist/switch3.png"
      />
    </div>
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
    let _value,
      isDefault = false;
    if (this.value !== null && this.value !== undefined && this.value !== "") {
      _value = this.value;
    } else {
      _value = this.default;
      isDefault = true;
    }
    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if (item.key == _value) {
        this.showIndex = i;
        if (isDefault) {
          // 来源于默认值马上回显
          this.$emit("input", item.key);
        }
        break;
      }
    }
  },
  methods: {
    getRightItem() {
      console.log("clickRight");
      if (!this.editAble) {
        return;
      }
      if (this.showIndex > 0) {
        this.$emit("input", this.items[this.showIndex - 1].key);
        this.showIndex = this.showIndex - 1;
      } else {
        this.$emit("input", this.items[this.items.length - 1].key);
        this.showIndex = this.items.length - 1;
      }
    },
    getLeftItem() {
      console.log("clickLeft");
      if (!this.editAble) {
        return;
      }
      if (this.showIndex < this.items.length - 1) {
        this.$emit("input", this.items[this.showIndex + 1].key);
        this.showIndex = this.showIndex + 1;
      } else {
        this.$emit("input", this.items[0].key);
        this.showIndex = 0;
      }
    },
  },
  computed: {
    showValue() {
      return this.items[this.showIndex].value;
    },
  },
};
</script>

<style lang="scss" scoped>
.ae-switch-select {
  display: flex;
  padding: 1%;
  flex-direction: row;
  .ae-switch-label {
    width: 20%;
    font-size: 14px;
    padding-top: 1%;
    color: aliceblue;
  }
  .ae-switch-select-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    .ae-switch-select-button {
      /* #ifdef H5*/
      width: 28px;
      height: 28px;
      /* #endif*/
      /* #ifndef H5 */
      width: 20px;
      height: 20px;
      /* #endif */
      flex-grow: 0;
    }
    .ae-switch-select-body {
      background-color: #495280;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      /* #ifdef H5*/
      height: 25.5px;
      /* #endif*/
      /* #ifndef H5 */
      height: 18px;
      /* #endif */
      color: rgb(255, 255, 255);
      justify-content: space-evenly;
      .ae-switch-select-font {
        /* #ifdef H5*/
        font-size: 14px;
        /* #endif*/
        /* #ifndef H5 */
        font-size: 0.65rem;
        /* #endif */
      }
    }
  }
}
</style>
