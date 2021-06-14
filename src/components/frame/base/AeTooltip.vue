<template>
  <div style="position: relative">
    <span
      v-show="show"
      :class="['popuptext', show ? 'show' : '', placement + '-placement']"
      @click="show = false"
      >{{ content }}</span
    >
    <span style="width: 100%;" @click="showToolTip">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: "提示",
    },
    // 正中显示 可选 left right
    placement: {
      type: String,
      default: "center"
    },
    effect: {},
  },
  data() {
    return {
      show: false,
    };
  },
  methods:{
    showToolTip(){
      this.show = !this.show;
      if (this.show) {
        this.$eventBus.publish("closeOtherToolTip", this._uid)
      }
    },
    closeOtherToolTip(id){
      if (this.show && this._uid !== id) {
        this.show = false;
      }
    }
  },
  created() {
    this.$eventBus.regist(this, "closeOtherToolTip");
  },
  destroyed(){
    this.$eventBus.unRegist(this, "closeOtherToolTip");
  }
};
</script>

<style>
.popuptext {
  width: 160px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  margin-left: -80px;
  -webkit-text-stroke: 0.2px #000000;
}
.center-placement{
  left: 50%;
}
.left-placement{
  left: 120%;
}
.right-placement{
  left: 90%;
}

/* Popup arrow */
.popuptext::after {
  content: "";
  position: absolute;
  top: 100%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}
.center-placement::after{
  left: 50%;
}
.left-placement::after{
  left: 10%;
}
.right-placement::after{
  left: 90%;
}

/* Toggle this class - hide and show the popup */
.show {
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

/* Add animation (fade in the popup) */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>