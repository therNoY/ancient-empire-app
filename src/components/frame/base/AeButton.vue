<template>
  <div class="ae-button-body">
    <button
        :disabled="disabled"
        type="button"
        class="ae-button"
        :style="{'width':width + '%','fontSize': size + 'rem', 'height':height + 'px', 'marginLeft':marginLeft + '%'}"
        @click="click"
    >
      <slot/>
    </button>
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
      height: {
        type: Number,
        default: 30,
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
        default: 0.75,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      click() {
        this.$emit("onClick");
      },
    },
    create() {
    },
    computed: {
      btnStyle() {
        if (this.disabled) {
          return {
            width: this.width + "%",
            fontSize: this.size + "em",
            height: this.height + "px",
            marginLeft: this.marginLeft + "%",
            cursor: "not-allowed",
          };
        } else {
          return {
            width: this.width + "%",
            fontSize: this.size + "em",
            height: this.height + "px",
            marginLeft: this.marginLeft + "%",
            cursor: "pointer",
          };
        }
      },
    },
  };
</script>

<style>
  .ae-button {
    float: left;
    color: rgb(255, 255, 255);
    cursor: pointer;
    background-color: #5a5c59;
    border-top: 2px #818181 solid;
    border-left: 2px #818181 solid;
    border-right: 2px #494949 solid;
    border-bottom: 2px #494949 solid;
    -webkit-text-stroke: 0.02px #000000;
    border-radius: 3px;
    overflow: hidden;
  }

  .ae-button:hover {
    box-shadow: 0 1px 8px 0 rgba(255, 255, 255, 0.322);
  }
</style>