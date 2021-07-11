<!--基础加载框-->
<template>
  <div class="ae-loading-container" v-show="loading">
    <div class="ae-loading-body">
      <unit :unit_id="unitId" :signal="signal"></unit>
      <div>{{$t('c.loading')}}</div>
    </div>
  </div>
</template>

<script>
import Unit from "../Unit.vue";

export default {
  props:{
    showLoading:{
      type:Boolean,
      default: false,
    }
  },
  components: { Unit },
  data() {
    return {
      loading: false,
      unitId: 1,
      signal: 0,
      timerChangesignal: -1,
    };
  },
  watch:{
    showLoading(show){
      this.loading = show;
      if (this.loading) {
        this.changeUnit();
        this.startWork();
      } else {
        clearInterval(this.timerChangesignal);
      }
    }
  },
  computed: {
  },
  methods: {
    changeUnit() {
      this.unitId = Math.floor(1 + Math.random() * 12);
    },
    startWork() {
      let _this = this;
      this.timerChangesignal = setInterval(() => {
        if (_this.signal < 1000) {
          _this.signal++;
        } else {
          _this.signal = 0;
        }
      }, 300);
    },
  },
};
</script>

<style lang="scss" scope>
.ae-loading-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(167, 167, 167, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.ae-loading-body {
  background: #242a43;
  box-shadow: 2px 2px 20px 1px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  padding-top: 1%;
  width: 100%;
  /* #ifdef H5 */
  height: 10%;
  /* #endif */
  /* #ifndef H5 */
  height: 15%;
  /* #endif */
  color: aliceblue;
}
</style>
