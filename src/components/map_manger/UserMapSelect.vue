<!-- 遭遇战地图选择器 -->
<template>
  <div class="userMap-select">
    <ae-button
      :width="80"
      class="userMap-select-button"
      @click="clickSelectMap"
    >
      {{ $t("common.choose") }}
    </ae-button>
    <div
      @click="clickPreviewChooseMap"
      class="userMap-select-name"
      v-if="chooseMap && chooseMap.map_name"
    >
      {{ chooseMap.map_name }}
    </div>
    <encounter
      ref="encounter"
      v-model="showModel"
	  v-if="showModel"
      @chooseMap="chooseMapFromSelect"
    />
  </div>
</template>

<script>
import MapPreview from "../frame/MapPreview.vue";
import Encounter from "../encounter/Encounter";
import blackStyle from "@/mixins/style/blackStyle";

export default {
  mixins: [blackStyle],
  components: {
    MapPreview,
    Encounter,
  },
  props: {
    label: {
      type: String,
    },
    value: {
      type: Object,
    },
  },
  data() {
    return {
      showModel: false,
      previewVisible: false,
      previewMapId: null,
      chooseMap: null,
    };
  },
  methods: {
    clickSelectMap() {
      this.showModel = true;
    },
    chooseMapFromSelect(map) {
      this.chooseMap = map;
      this.$emit("input", map);
    },
    clickPreviewChooseMap() {
      let value = this.chooseMap;
      console.log(value);
      if (value && value.map_id) {
        this.previewMapId = value.map_id;
        this.previewVisible = true;
      }
    },
  },
  created(){
	 this.$appHelper.bindPage2Global(this, "userMapSelect");
  }
};
</script>

<style lang="scss" scoped>
.userMap-select {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;

  .userMap-select-button {
    width: 30%;
  }

  .userMap-select-name {
    width: 30%;
    padding: 2%;
    /* #ifndef H5*/
    font-size: 12px;
    /* #endif*/
    color: white;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
