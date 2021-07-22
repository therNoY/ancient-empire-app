<!--攻击范围区域-->
<template>
  <div>
    <div
      class="attach_area"
      v-for="(attachArea, index) in attachArea"
      :key="index"
    >
      <img
        :class="[$uni.imgSize + '-img-size', 'stand-attach-move-view']"
        src="../../assets/images/assist/attach_alpha.png"
        @click="clickAttachArea(attachArea)"
        :style="{
          top: $appHelper.getPosition(attachArea.row),
          left: $appHelper.getPosition(attachArea.column),
        }"
      />
    </div>
  </div>
</template>

<script>
import eventype from "../../manger/eventType";
export default {
  computed: {
    attachArea() {
      return this.$store.getters.attachArea;
    },
  },
  methods: {
    clickAttachArea(site) {
      if (this.$appHelper.mapCanClick()) {
        this.$appHelper.sendEvent(eventype.CLICK_ATTACH_AREA, site);
      }
    },
  },
};
</script>

<style>
</style>