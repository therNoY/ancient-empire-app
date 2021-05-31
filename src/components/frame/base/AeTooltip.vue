<template>
  <div>
    <span
      v-show="show"
      :class="['popuptext', show ? 'show' : '']"
      @click="show = false"
      >{{ content }}</span
    >
    <span @click="show = !show">
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
    placement: {},
    effect: {},
  },
  data() {
    return {
      show: false,
    };
  },
  created() {
  },
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
  left: 50%;
  margin-left: -80px;
  -webkit-text-stroke: 0.2px #000000;
}

/* Popup arrow */
.popuptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
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