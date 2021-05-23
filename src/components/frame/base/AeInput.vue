<template>
  <div class="ae-input">
    <div v-if="label" class="ae-input-label">{{ label }}</div>
    <input class = "ae-input-real"
      :type="type"
      :style="{'width':width+'%'}"
      v-model="inputValue"
      :disabled="!editAble"
      :placeholder="placeholder"
      :max="max"
      :min="min"
    />
  </div>
</template>

<script>
export default {
  props: {
    editAble: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "text",
    },
    value: {
    },
    default: {
    },
    width: {
      type: Number,
      default: 85,
    },
    placeholder: {
      type: String,
      default(){
        return uni.$t("common.pleaseInput");
      },
    },
    label: {
      type: String,
    },
    max:{
      type:Number,
    },
    min:{
      type:Number,
    }
  },
  data() {
    return {
      inputValue: "",
    };
  },
  watch: {
    inputValue(value) {
      this.$emit("input", value);
      this.$emit("onChange", value);
    },
    value(v) {
      if (v && !this.inputValue) {
        this.inputValue = v;
      }
    },
    // default(v) {
    //   this.inputValue = this.default;
    // }
  },
  created() {
    this.inputValue = this.value;
  },
  mounted() {
    if (this.default) {
      this.inputValue = this.default;
    }
  },

};
</script>

<style lang="scss" scoped>
.ae-input {
  width: 96%;
  float: left;
  padding: 1%;
  /*background-color: #4cd964;*/
  .ae-input-label {
    width: 20%;
    float: left;
    font-size: 14px;
    padding-top: 2%;
    color: white;
  }
  input::-webkit-input-placeholder {
    font-family: aeFont;
    -webkit-text-stroke: 0px #000000;
  }
}

.ae-input-real {
  outline: none;
  float: left;
  margin-left: 1%;
  background-color: #494949;
  font-family: aeFont;
  -webkit-text-fill-color: white;
  -webkit-text-stroke: 0px #000000;
  /* #ifdef H5*/
  font-size: 14px;
  height: 20px;
  border-top: 2px #494949 solid;
  border-left: 2px #494949 solid;
  border-right: 2px #818181 solid;
  border-bottom: 2px #818181 solid;
  /* #endif*/
  /* #ifdef MP-WEIXIN */
  font-size : 0.75rem;
  height: 16rpx;
  border-top: 2rpx #494949 solid;
  border-left: 2rpx #494949 solid;
  border-right: 2rpx #818181 solid;
  border-bottom: 2rpx #818181 solid;
  /* #endif */
}

.ae-input-real:disabled {
  border-top: 2px #ffffff00 solid;
  border-left: 2px #ffffff00 solid;
  border-right: 2px #ffffff00 solid;
  border-bottom: 2px #ffffff00 solid;
}

.ae-input-real:-webkit-autofill {
  -webkit-text-fill-color: #ffffff !important;
  background-color: transparent;
  background-image: none;
  -webkit-transition: background-color 50000s ease-in-out 0s;
  transition: background-color 50000s ease-in-out 0s;
}
</style>