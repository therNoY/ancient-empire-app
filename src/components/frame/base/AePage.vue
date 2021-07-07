<!--基础分页-->
<template>
  <div class="ae-page">
    <img
        v-if="getPageCount.length > 0"
        class="ae-page-button click-cursor"
        @click="pageDes"
        src="../../../assets/images/assist/switch5.png"
    />
    <div
        v-for="(pageNum, key) of getPageCount"
        :class="['ae-page-num',  pageNum === pageNow ? 'choose-page' : '']"
        :key="key"
        @click="clickPageNum(pageNum)"
    >
      {{ pageNum }}
    </div>
    <img
        v-if="getPageCount.length > 0"
        class="ae-page-button click-cursor"
        @click="pageAdd"
        src="../../../assets/images/assist/switch6.png"
    />
  </div>
</template>

<script>
  const maxPageSize = 10;
  export default {
    props: {
      count: {
        type: Number,
        default: 0,
      },
      pageSize: {
        type: Number,
        default: 10,
      },
    },
    data() {
      return {
        pageNow: 1,
      };
    },
    methods: {
      clickPageNum(index) {
        this.pageNow = index;
        this.$emit("onPageNowChange", this.pageNow);
      },
      pageDes() {
        if (this.pageNow > 1) {
          this.pageNow = this.pageNow - 1;
          this.$emit("onPageNowChange", this.pageNow);
        }
      },
      pageAdd() {
        if (this.pageNow < this.pageCount) {
          this.pageNow = this.pageNow + 1;
          this.$emit("onPageNowChange", this.pageNow);
        }
      },
    },
    computed: {
      pageCount() {
        if (this.count % this.pageSize === 0) {
          return this.count / this.pageSize;
        } else {
          return Number.parseInt(this.count / this.pageSize) + 1;
        }
      },
      getPageCount() {
        let returnArray = [];
        if (this.pageCount < maxPageSize || this.pageNow <= 5) {
          for (let i = 0; i < Math.min(maxPageSize - 1, this.pageCount); i++) {
            returnArray.push(i + 1);
          }
        } else {
          let max =
              this.pageCount > this.pageNow + 4 ? this.pageNow + 4 : this.pageCount;
          for (let i = maxPageSize - 1; i > 0; i--) {
            returnArray.push(max - i + 1);
          }
        }
        return returnArray;
      },
    },
  };
</script>

<style lang="scss" scope>
  .ae-page {
    display: flex;
    height: 20px;
    width: 100%;
    color: rgb(255, 255, 255);
    margin-top: 1%;
    margin-bottom: 1%;
    font-size: 13px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .ae-page-button {
      width: 20px;
      height: 20px;
    }

    .ae-page-num {
      height: 18px;
      cursor: pointer;
      width: 10%;
      color: white;
    }
  }

  .choose-page {
    font-weight: bold;
    font-size: 16px;
  }
</style>