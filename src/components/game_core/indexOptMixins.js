import eventype from "../../manger/eventType";
import { RecordSaveAs } from "@/api";

export default {
    methods: {
        roundEnd() {
            if (this.$appHelper.mapCanClick()) {
                this.$appHelper.showTip(this.$t("e.endRound"), () => {
                    this.$appHelper.sendEvent(eventype.ROUND_END);
                });
            }
        },
        goHome() {
            this.$appHelper.showTip(this.$t("e.leaveGameWarn"), () => {
                this.$uni.redirectTo({
                    url: "/components/Home",
                    complete: (resp) => {
                        console.log(resp);
                    },
                });
            });
        },
        saveRecord() {
            let _this = this;
            this.$appHelper.showInputDialog(
                this.$t("lg.saveRecord"),
                this.$t("lg.recordName"),
                (saveRecordName) => {
                    let args = {};
                    args.uuid = _this.gameId;
                    args.name = saveRecordName;
                    RecordSaveAs(args).then(() => {
                        _this.$appHelper.infoMsg(_this.$t("c.saveSuccess"));
                    });
                }
            );
        },
    },
    computed: {
        currentArmy() {
            let game = this.$store.getters.game;
            let currArmy = game.army_list[game.curr_army_index];
            currArmy.max_pop = game.max_pop;
            currArmy.current_round = game.current_round;
            return currArmy;
        },
    },
}