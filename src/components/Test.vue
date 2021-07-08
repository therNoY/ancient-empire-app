<template>
  <div style="text-align: center">
    <h1>测试容器</h1>
    <movable-area class="movable-area1">
      <movable-view
        class="max"
        out-of-bounds
        :x="x"
        :y="y"
        direction="all"
        @change="onChange"
      >
      </movable-view>
    </movable-area>
    <h1>分段</h1>
    <uni-segmented-control
      :current="current"
      :values="items"
      style-type="text"
      active-color="red"
      @clickItem="onClickItem"
    />
    <h1>tooltip</h1>
    <div>
      <ae-tooltip content="1111111">
        <div style="width: 200px; height: 200px; margin-left: 100px">
          哈哈哈
        </div>
      </ae-tooltip>
    </div>

    <h1>双向绑定</h1>
    <ae-switch-select
      label="值"
      v-model="army"
      :items="armyType"
    ></ae-switch-select>
    <ae-switch-select
      label="对象"
      v-model="config.army"
      :items="armyType"
    ></ae-switch-select>
    <ae-switch-select
      v-for="config in array"
      label="数组"
      v-model="config.army"
      :key="config.army"
      :items="armyType"
    ></ae-switch-select>

    <uni-number-box v-model="config.numberBox" />
    <uni-number-box v-model="numberBox" />

    <h1>buttonList</h1>
    <ae-button-list
      :buttonList="['测试1', '测试2', '测试3']"
      :buttonConfig="{ '2': { display: current === 2 } }"
      :clickAction="clickAction"
    ></ae-button-list>

    <h1>baseDialog</h1>
    <ae-base-dialog v-model="dailog" title="测试"></ae-base-dialog>
    <ae-button @click="dailog = !dailog">弹出</ae-button>

    <h1>弹跳</h1>
    <div
      style="
        background-color: #4cd964;
        width: 240px;
        height: 240px;
        position: absolute;
      "
    >
      <left-change-view></left-change-view>
    </div>
    <ae-button @click="setNum">开始</ae-button>

    <h2 style="margin-top:300px" >aeBorder</h2>

    <ae-border style="position: absolute" padding="4px">
      <img
        class="stand-img-size"
        src="../assets/images/Region/forest.png"
      />
    </ae-border>

  </div>
</template>

<script>
import AeBorder from "./frame/base/AeBorder.vue";
export default {
  components: { AeBorder },
  props: [],
  data() {
    return {
      dailog: false,
      x: 0,
      y: 0,
      current: 1,
      items: ["选项卡1", "选项卡2", "选项卡3"],
      styleType: "button",
      army: "user",
      config: {
        army: "user",
        numberBox: 2,
      },
      array: [
        {
          army: "user",
        },
        {
          army: "no",
        },
      ],
      numberBox: 1,
      armyType: [
        {
          key: "user",
          value: this.$t("p.title"),
        },
        {
          key: "ai",
          value: this.$t("p.ai"),
        },
        {
          key: "no",
          value: this.$t("c.noting"),
        },
      ],
      clickAction: [],
    };
  },
  methods: {
    onChange({ detail }) {
      console.log(arguments);
    },
    onClickItem() {
      console.log(arguments);
    },
    test(name) {
      alert("测试" + name);
    },
    setNum() {
      let attach = [-1, 1, 1, 1];
      let array = [];
      array.push({ attach, row: 5, column: 5 });
      this.$store.commit("setLeftChange", array);
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
movable-view {
  display: flex;
  align-items: center;
  justify-content: center;
  /*height: 150rpx;*/
  /*width: 150rpx;*/
  background-color: #007aff;
  color: #fff;
}

.movable-area1 {
  height: 200px;
  width: 200px;
  background-color: #d8d8d8;
  overflow: hidden;
}

.max {
  width: 500px;
  height: 500px;
}
</style>