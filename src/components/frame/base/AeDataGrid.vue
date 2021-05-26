<template>
  <div style="width: 100%">
    <div class="ae-data-grid">
      <table v-if="data && data.length > 0">
        <tr v-if="showTitle && showTitle.length > 0">
          <td v-for="(key, keyIndex) in showTitle" :key="keyIndex">
            <div v-if="isNotFunction(key)">
              {{ key }}
            </div>
            <div v-else>
              <ae-dynamic :componentFunction="key"></ae-dynamic>
            </div>
          </td>
        </tr>
        <tr
            v-for="(item, index) in data"
            :key="index"
            @click="clickItem(index)"
            :class="index === selectIndex ? 'choose-td' : ''"
        >
          <td v-for="(key, keyIndex) in showKey" :key="keyIndex">
            <div v-if="isNotFunction(key)">
              {{ item[key] }}
            </div>
            <div v-else>
              <ae-dynamic :componentFunction="key" :item="item"></ae-dynamic>
            </div>
          </td>
        </tr>
      </table>
      <div v-else>
        <table>
          <tr v-if="showTitle && showTitle.length > 0">
            <td v-for="(key, keyIndex) in showTitle" :key="keyIndex">
              <div v-if="isNotFunction(key)">
                {{ key }}
              </div>
              <div v-else>
                <ae-dynamic :componentFunction="key"></ae-dynamic>
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
        style="width: 40%;float:left"
        @onPageNowChange="onPageNowChange"
    ></ae-page>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
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
      tableConfig: {}
    },
    data() {
      return {
        selectIndex: 0,
      };
    },
    created() {
      this.$appHelper.bindPage2Global(this, "dataGrid");
    },
    methods: {
      isNotFunction(obj) {
        return typeof obj != 'function'
      },
      clickItem(index) {
        this.selectIndex = index;
      },
      onPageNowChange(pageNow) {
        this.$emit("onPageNowChange", pageNow);
      },
    },
    computed: {
      showKey() {
        if (this.showItem && this.showItem.length > 0) {
          return this.showItem;
        } else {
          let showKeys = [];
          if (this.data && this.data.length > 0) {
            for (let key in this.data[0]) {
              showKeys.push(key);
            }
          }
          return showKeys;
        }
      },
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
      /* #ifdef H5 */
      font-size: 13px;
      /* #endif */
      /* #ifndef H5 */
      font-size: 0.75rem;
      /* #endif */
      color: #ffffff;
      border-width: 0px;
      width: 100%;
      border-collapse: collapse;
      background-color: #404040;
    }

    table th {
      border-width: 0px;
      padding: 8px;
      border-style: solid;
    }

    table tr {
      cursor: pointer;
    }

    table td {
      border-width: 0px;
      padding: 8px;
      border-style: solid;
    }

    .choose-td {
      background-color: #2b6771;
    }
  }
</style>
