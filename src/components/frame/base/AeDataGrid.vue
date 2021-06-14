<template>
  <div style="width: 100%">
    <div class="ae-data-grid">
      <table v-if="realDisplayData && realDisplayData.length > 0" :style="{width:tableWidth}">
        <tr v-if="showTitle && showTitle.length > 0" class="ae-data-grid-title">
          <td v-for="(key, keyIndex) in showTitle" :key="keyIndex" :style="{width:tdWidth}">
            <div v-if="isNotFunction(key)">
              {{ key }}
            </div>
            <div v-else>
              <ae-dynamic ref="titleDynamic" :itemList="showTitle" :componentFunction="key" :functionIndex="keyIndex"></ae-dynamic>
            </div>
          </td>
        </tr>
        <tr
          v-for="(item, index) in realDisplayData"
          :key="index"
          @click="clickItem(index)"
          :class="index === selectIndex ? 'choose-td' : ''"
        >
          <td v-for="(key, keyIndex) in realShowItem" :key="keyIndex" :style="{width:tdWidth}" >
            <div v-if="isNotFunction(key)">
              {{ item[key] == null ? '' : item[key]}}
            </div>
            <div v-else>
              <ae-dynamic  @change="updateRealDisplayData(_data, keyIndex, )" ref="itemDynamic" :componentFunction="key" :itemList="realShowItem" :functionIndex="keyIndex" v-bind:item="item"></ae-dynamic>
            </div>
          </td>
        </tr>
      </table>
      <div v-else>
        <table :style="{width:tableWidth}">
          <tr
            v-if="showTitle && showTitle.length > 0"
            class="ae-data-grid-title"
          >
            <td v-for="(key, keyIndex) in showTitle" :key="keyIndex">
              <div v-if="isNotFunction(key)">
                {{ key }}
              </div>
              <div v-else>
                <ae-dynamic :itemList="showTitle" :componentFunction="key" :functionIndex="keyIndex"></ae-dynamic>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <ae-page
      ref="aePage"
      v-if="page"
      :count="count"
      style="width: 40%; float: left"
      @onPageNowChange="onPageNowChange"
    ></ae-page>
  </div>
</template>

<script>
export default {
  props: {
    data: {
    },
    showTitle: {
      type: Array,
    },
    showItem: {
      type: Array,
    },
    page: {
      type: Boolean,
      default: false,
    },
    count: {
      type: Number,
      default: 0,
    },
    tableConfig: {},
  },
  data() {
    return {
      selectIndex: 0,
      realDisplayData: [],
    };
  },
  created() {
    this.$appHelper.bindPage2Global(this, "dataGrid");
    if (this.realDisplayData.length === 0 && this.data) {
      this.$nextTick(()=>{
        this.realDisplayData = this.data;
      });
    }
  },
  methods: {
    isNotFunction(obj) {
      return typeof obj != "function";
    },
    clickItem(index) {
      this.selectIndex = index;
    },
    getSelect() {
      return this.data[this.selectIndex];
    },
    onPageNowChange(pageNow) {
      this.$emit("onPageNowChange", pageNow);
    },

    updateRealDisplayData(data, item){
      this.realShowItem[item] = data;
    },

  },
  watch: {
    data(_data) {
      console.log("数据改变", _data);
      this.$nextTick(()=>{
        this.realDisplayData = _data;
      });
    },
  },
  computed: {
    realShowItem() {
      if (this.showItem && this.showItem.length > 0) {
        return this.showItem;
      } else {
        let realShowItems = [];
        if (this.realDisplayData && this.realDisplayData.length > 0) {
          for (let key in this.realDisplayData[0]) {
            realShowItems.push(key);
          }
        }
        return realShowItems;
      }
    },
    tdWidth(){
      let length;
      if (this.showTitle) {
        length = this.showTitle.length;
      } else if (this.showItem) {
        length = this.showItem.length;
      }
      return (100 / length + "%")
    },
    tableWidth(){
      let width = 100;
      if (this.showTitle instanceof Array && this.showTitle.length > 4 && !uni.isH5) {
        width = (this.showTitle.length - 4) * 10 + 100;
      }
      return width + "%";
    }
  },
};
</script>

<style lang="scss">

</style>
