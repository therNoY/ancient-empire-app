<!--基础消息框-->
<template>
  <transition name="msg" appear>
    <div class="box-item" v-if="show" :style="{ top: top + 'rpx' }">
      <unit :unit_id="unitId" :color="unitColor"></unit>
      <div class="msg-container">
        {{ mes }}
      </div>
    </div>
  </transition>
</template>


<script >
import Unit from "../Unit.vue";

export default {
  components: { Unit },
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    mes: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "info",
    },
    top: {
      type: Number,
      default: 60,
    },
    color:{
      type: String,
      default: null,
    }
  },
  data() {
    return {
      unitId: 1,
    };
  },
  watch:{
    show(v){
      if (v) {
        this.unitId = Math.floor(1 + Math.random() * 11);
      }
    }
  },
  computed: {
    unitColor() {
      if (this.color) {
        return this.color;
      }
      const type = this.type;
      let color = "blue";
      if (type == "success") {
        color = "green";
      } else if (type == "warning") {
        color = "black";
      } else if (type == "error") {
        color = "red";
      }
      return color;
    },
  },
};
</script>
<style lang="scss" rel="scss" scoped>
.box-item {
  position: fixed;
  min-width: 380px;
  border-radius: 4px;
  color: rgb(255, 255, 255);
  left: 50%;
  transform: translateX(-50%);
  transition: opacity 0.3s, transform 0.4s, top 0.4s;
  padding: 1%;
  background: #242a43;
  overflow-y: 0%;
  border: 2px #afb7aa solid;
  box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.692);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  z-index: 9999;
}
.msg-container {
  /* #ifdef H5 */
  font-size: 20px;
  -webkit-text-stroke: 0.5px #000000;
  /* #endif */
  /* #ifndef H5 */
  font-size: 14px;
  -webkit-text-stroke: 0.3px #000000;
  /* #endif */
}

.msg-enter-active {
  animation: anim 0.5s;
}

.msg-leave-active {
  animation: anim 0.5s reverse;
}

@keyframes anim {
  0% {
    opacity: 0;
    transform: translate(-50%, -200%);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>
