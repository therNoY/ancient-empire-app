<template>
  <div>
    <ae-complex-dialog
      ref="aeDialog"
      v-model="showModel"
      :showItem="showItem"
      :title="$t('b.chooseBattle')"
      :initQueryDataGrid="queryDataFunction"
      :footerButtons="footerButtons"
      :width="$uni.isH5 ? 40 : 70"
    ></ae-complex-dialog>
  </div>
</template>

<script>
import { startGame } from "../../utils/gameHelper.js";
import dialogShow from "@/mixins/frame/dialogShow.js";
import { GetStoreList, } from "@/api";

export default {
  mixins: [dialogShow],
  data() {
    return {
      footerButtons: [
        { name: this.$t("c.start"), action: this.startStoreGame },
        { name: this.$t("c.return"), action: this.closeSelf },
      ],
      queryDataFunction: (query) => GetStoreList(query),
      showItem: ["map_name"],
    };
  },
  methods: {
    startStoreGame() {
      let args = {};
      let record = this.$refs.aeDialog.getDataGridSelect();
      args.map_id = record.uuid;
      args.game_type = "story";
      console.log("开启遭遇战", args);
      startGame(args, "story");
    },
  },
  created() {
  },
};
</script>

<style>
</style>