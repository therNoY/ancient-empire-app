<template>
  <div v-if="unitActions.length > 0">
    <!--展示单位可以进行行动 攻击 召唤 购买 修复-->
    <div v-for="(action, index) in unitActions" :key="index">
      <img
        :class="[imgSize + '-action-size', 'base-animate']"
        :src="$appHelper.getActionImg(action.action)"
        @click="doAction(action.action)"
        :style="{
          top: $appHelper.getUnitPosition(action.row),
          left: $appHelper.getUnitPosition(action.column),
        }"
      />
    </div>
  </div>
</template>

<script>
import baseVar from "@/mixins/frame/baseVar.js";
import eventype from "../../manger/eventType";
export default {
  mixins: [baseVar],
  methods: {
    // 展示单位将要进行的行动
    doAction(name) {
      if (!this.$appHelper.mapCanClick()) {
        return;
      }
      if (name == "attack") {
        // 攻击
        this.$appHelper.sendEvent(eventype.CLICK_ATTACH_ACTION);
      } else if (name == "end") {
        this.$appHelper.sendEvent(eventype.CLICK_END_ACTION);
      } else if (name == "buy") {
        // 购买单位购买特殊处理
        this.$eventBus.publish("showBuyUnitDialog");
      } else if (name == "move") {
        this.$appHelper.sendEvent(eventype.CLICK_MOVE_ACTION);
      } else if (name == "occupied") {
        // 占领
        this.$appHelper.sendEvent(eventype.CLICK_OCCUPIED_ACTION);
      } else if (name == "repair") {
        // 修复
        this.$appHelper.sendEvent(eventype.CLICK_REPAIR_ACTION);
      } else if (name == "summon") {
        // 召唤
        this.$appHelper.sendEvent(eventype.CLICK_SUMMON_ACTION);
      }
    },
  },
  computed: {
    unitActions() {
      return this.$store.getters.action;
    },
  },
};
</script>

<style>
</style>