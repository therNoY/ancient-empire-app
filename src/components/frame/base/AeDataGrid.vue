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
              <ae-dynamic :componentFunction="key" :itemList="realShowItem" :functionIndex="keyIndex" :item="item"></ae-dynamic>
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
                <ae-dynamic :componentFunction="key" :functionIndex="keyIndex"></ae-dynamic>
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

  },
  watch: {
    data(_data) {
      console.log("数据改变", _data);
      this.realDisplayData = [];
      this.realDisplayData = _data;
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

<style lang="scss" scoped>
.ae-data-grid {
  width: 100%;
  /* #ifdef H5 */
  max-height: 320px;
  height: 320px;
  /* #endif */
  /* #ifndef H5 */
  max-height: 230rpx;
  height: 230rpx;
  /* #endif */
  overflow: auto;
  border-top: 2px #242424 solid;
  border-left: 2px #242424 solid;
  border-right: 2px #aaaaaa solid;
  border-bottom: 2px #aaaaaa solid;

  table {
    font-family: verdana, arial, sans-serif;
    width: 100%;
    /* #ifdef H5 */
    font-size: 13px;
    /* #endif */
    /* #ifndef H5 */
    width: 140%;
    /* #endif */
    color: #ffffff;
    border-width: 0;
    border-collapse: collapse;
    background-color: #404040;
    display: flex;
    flex-direction: column;
  }

  .ae-data-grid-title {
    background-color: #39447a;
  }

  table tr {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  table td {
    border-width: 0;
    /* #ifdef H5 */
    padding: 8px;
    /* #endif */
    /* #ifndef H5 */
    padding: 3rpx;
    font-size: 0.6rem;
    /* #endif */
    border-style: solid;
  }

  .choose-td {
    background-color: #2b6771;
  }
}
</style>
