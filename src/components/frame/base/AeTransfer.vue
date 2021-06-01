<!--
  穿梭框
-->
<template>
  <div class="transfer_body">
    <div class="transfer_left">
      <div>
        {{ addAbleTitle }}
      </div>
      <div v-if="dataList.length > 0">
        <ae-click-point
          v-for="(item, index) in addAbleList"
          :key="index"
          value="+"
          class="transfer_item"
          @clickPoint="addValue(item, index)"
          :disabled="disabled"
        >
          <ae-tooltip
            v-if="showTipKey"
            :content="item[showTipKey]"
            placement="top"
            effect="light"
          >
            <uni-tag :size="size" type="primary">{{ showKey ? item[showKey] : item }}</uni-tag>
          </ae-tooltip>
          <uni-tag v-else type="success" :size="size">{{
            showKey ? item[showKey] : item
          }}</uni-tag>
        </ae-click-point>
      </div>
    </div>
    <div class="transfer_right">
      <div>
        {{ valueTitle }}
      </div>
      <div v-if="value.length > 0">
        <ae-click-point
          v-for="(item, index) in value"
          class="transfer_item"
          :disabled="disabled"
          :key="index"
          @clickPoint="removeValue(item, index)"
        >
          <ae-tooltip
            v-if="showTipKey"
            :content="item[showTipKey]"
            placement="top"
            effect="light"
          >
            <uni-tag type="success" :size="size" effect="dark">{{
              showKey ? item[showKey] : item
            }}</uni-tag>
          </ae-tooltip>
          <uni-tag v-else type="success" :size="size" effect="dark">{{
            showKey ? item[showKey] : item
          }}</uni-tag>
        </ae-click-point>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    addAbleTitle: {
      type: String,
      default: "可选择列表",
    },
    valueTitle: {
      type: String,
      default: "当前列表",
    },
    /** 展示内容key 不指定默认全部展示 */
    showKey: {
      type: String,
    },
    /**展示的提示 */
    showTipKey: {
      type: String,
    },
    /** 比较指定key */
    valueKey: {
      type: String,
    },
    dataList: {
      type: Array,
    },
  },
  data() {
    return {
      size:"normal",
    };
  },
  computed: {
    addAbleList() {
      return this.dataList.filter((item) => {
        for (let v of this.value) {
          if (this.valueKey) {
            if (v[this.valueKey] == item[this.valueKey]) {
              return false;
            }
          } else {
            if (v == item) {
              return false;
            }
          }
        }
        return true;
      });
    },
  },
  methods: {
    addValue(item, index) {
      this.value.push(item);
    },
    removeValue(item, index) {
      this.value.splice(index, 1);
    },
  },
  created() {
    // #ifndef H5
    this.size = 'small';
    // #endif
  },
};
</script>

<style lang="scss" scoped>
.transfer_body {
  width: 100%;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  border-top: 2px #242424 solid;
  border-left: 2px #242424 solid;
  border-right: 2px #aaaaaa solid;
  border-bottom: 2px #aaaaaa solid;
  .transfer_left, .transfer_right {
    width: 45%;
    padding: 2%;
    color: white;
    justify-content: space-around
  }
  .transfer_item {
    float: left;
    margin-left: 5%;
    margin-top: 2%;
  }
}
</style>
