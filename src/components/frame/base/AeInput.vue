<template>
  <div :class="['ae-input', center?'ae-input-center':'']">
    <div v-if="label" class="ae-input-label">{{ label }}</div>
    <input
      class="ae-input-real"
      :type="type"
      :style="{ width: width + '%', flexDirection: textDir }"
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
    value: {},
    default: {},
    width: {
      type: Number,
      default: 85,
    },
    placeholder: {
      type: String,
      default() {
        return uni.$t("common.pleaseInput");
      },
    },
    label: {
      type: String,
    },
    max: {
      type: Number,
    },
    min: {
      type: Number,
    },
    textDir: {
      default: "column",
    },
    center: {
      type: Boolean,
      default: false,
    },
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
      } else if (v === null) {
        this.inputValue = null;
      }
    },
  },
  created() {
    if (this.value == 0) {
      this.inputValue = this.value + "";
    } else {
      this.inputValue = this.value;
    }
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
  padding: 1%;
  display: flex;
  flex-direction: row;
  align-items: center;
  .ae-input-label {
    width: 20%;
    color: white;
  }
  input::-webkit-input-placeholder {
    font-family: aeFont;
    -webkit-text-stroke: 0px #000000;
  }
}
.ae-input-center{
  justify-content: space-evenly;
}

.ae-input-real {
  outline: none;
  background-color: #494949;
  -webkit-text-fill-color: white;
  -webkit-text-stroke: 0 #000000;
  /* #ifdef H5*/
  height: 20px;
  border-top: 2px #494949 solid;
  border-left: 2px #494949 solid;
  border-right: 2px #818181 solid;
  border-bottom: 2px #818181 solid;
  /* #endif*/
  /* #ifdef MP-WEIXIN */
  height: 16rpx;
  font-size: 12px;
  border-top: 2rpx #494949 solid;
  border-left: 2rpx #494949 solid;
  border-right: 2rpx #818181 solid;
  border-bottom: 2rpx #818181 solid;
  display: flex;
  min-height: 1rem;
  justify-content: space-evenly;
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