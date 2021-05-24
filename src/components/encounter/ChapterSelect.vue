<template>
  <div>
    <ae-complex-dialog
        ref="aeDialog"
        v-model="showModel"
        :showItem="showItem"
        :title="$t('battle.chooseBattle')"
        :initQueryDataGrid="queryDataFunction"
        :footerButtons="footerButtons"
        :width="55"
    ></ae-complex-dialog>
  </div>
</template>

<script>
  import dialogShow from "@/mixins/frame/dialogShow.js";
  import {
    GetUserTemp,
    GetStoreList,
    GetUnitLevelByTemp,
    MapInit,
  } from "@/api";

  export default {
    mixins: [dialogShow],
    data() {
      return {
        footerButtons: [
          {name: this.$t("common.start"), action: "startStoreGame"},
          {name: this.$t("common.return"), action: "closeSelf"},
        ],
        queryDataFunction: (query) => GetStoreList(query),
        showItem: ["map_name"],
      };
    },
    methods: {

      /**
       * 开始一局单机游戏
       * 1.创建ws连接,
       * 2.后台根据地图和游戏类型生成一个游戏上下文,
       * 3.可以开始游戏
       */
      startStoreGame() {
        let record = this.$refs.aeDialog.getDataGridSelect();
        this.$appHelper.setLoading();
        console.log("开始一个遭遇战的单机游戏");
        let args = {};
        args.map_id = record.uuid;
        args.game_type = "story";
        MapInit(args).then((resp) => {
          if (resp.res_code == 0) {
            this.$store.commit("setGame", resp.res_val);
            // 获取单位最大生命值
            this.getUnitLevelByTemp(resp.res_val.template_id);
            // 获取模板
            GetUserTemp(resp.res_val.template_id).then((tempResp) => {
              if (tempResp && tempResp.res_val) {
                this.$store.commit("setTemplate", tempResp.res_val);
                let connArgs = {};
                connArgs.recordId = resp.res_val.uuid;
                connArgs.type = "chapter_game";
                this.$store
                .dispatch("connectGameSocket", connArgs)
                .then((r) => {
                  this.$appHelper.setLoading();
                  this.$router.push("/gameIndex");
                })
                .catch((e) => {
                  console.error(e);
                  this.$appHelper.setLoading();
                });
              } else {
                this.$appHelper.errorMsg(resp.res_mes);
                this.$appHelper.setLoading();
              }
            });
          } else {
            this.$appHelper.errorMsg(resp.res_mes);
            this.$appHelper.setLoading();
          }
        })
        .catch((e) => {
          console.error(e);
          this.$appHelper.setLoading();
        });
      },

      async getUnitLevelByTemp(tempId) {
        const {res_code, res_val, res_mes} = await GetUnitLevelByTemp(tempId);
        if (res_code === 0) {
          this.$store.commit("setUnitLevelInfo", res_val);
          return res_val;
        } else {
          this.$appHelper.errorMsg(res_mes);
          return null;
        }
      },
    },
    created() {
      this.$appHelper.bindPage2Global(this, "chapterSelect");
    },
  };
</script>

<style>
</style>