<template>
	<ae-base-dialog v-model="value" :width="width" showCloseTip closeTip="确定要退出房间吗？">
		<div>欢迎加入{{ roomName }} 房间号{{ roomId }}</div>
		<div class="player_list">
			<uni-table>
				<uni-tr>
					<uni-th>队伍</uni-th>
					<uni-th>{{$t('multiPlayer.alliance')}}</uni-th>
					<uni-th>{{$t("player.title")}}</uni-th>
					<uni-th>操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(army, index) in canJoinArmy" :key="index">
					<uni-td>
						<img :src="$appHelper.getUnitImg('10', army.color)" />
					</uni-td>
					<uni-td>
						<div style="color: rgb(255, 255, 255)">{{ army.camp }}</div>
					</uni-td>
					<uni-td>
						<div style="color: rgb(255, 255, 255); font-size: 14px">
							{{ army.player_name }}
							<span style="color: rgb(255, 255, 255); font-size: 13px"
								v-if="roomOwner && army.player == roomOwner">({{$t('multiPlayer.homeOwner')}})</span>
						</div>
					</uni-td>
					<uni-td>
						<ae-button :width="80" v-if="!item.row.player" @click="changeCtlArmy(item.row.color)">{{$t('multiPlayer.join')}}
						</ae-button>
						<ae-button :width="80" v-else-if="
					    item.row.player &&
					    item.row.player != $store.getters.user.user_id &&
					    $store.getters.user.user_id == roomOwner
					  " @click="levelCtlArmy(item.row.color, item.row.player)">{{$t('multiPlayer.kickOut')}}</ae-button>
						<ae-button :width="80" v-else-if="$store.getters.user.user_id == item.row.player"
							@click="levelCtlArmy(item.row.color, item.row.player)">{{$t('common.out')}}</ae-button>
					</uni-td>
				</uni-tr>
			</uni-table>
		</div>
		<div class="room_message">
			<room-message ref="roomMessage"></room-message>
		</div>
		<map-preview v-model="showPreview" :mapId="mapId"></map-preview>
		<div class="bottom-button">
			<ae-button @click="showPreview = true">{{$t('common.preview')}}</ae-button>
			<ae-button>{{$t("multiPlayer.invite")}}</ae-button>
			<ae-button v-show="roomOwner && $store.getters.user.user_id === roomOwner" @click="showStartTip = true">{{$t('common.start')}}}
			</ae-button>
		</div>
		<ae-tip v-model="showStartTip" :closeTip="startTip()" @ok="startRoomGame"></ae-tip>
	</ae-base-dialog>
</template>

<script>
	import {
		ChangeArmy,
		LevelCtlArmy,
		RoomInit,
		GetUserTemp,
		GetRecordById,
		GetUnitLevelByTemp,
	} from "../../../api";
	import dialogShow from "../../../mixins/frame/dialogShow.js";
	import MapPreview from "../../frame/MapPreview.vue";
	import RoomMessage from "../room/RoomMessage.vue";
	export default {
		mixins: [dialogShow],
		components: {
			RoomMessage,
			MapPreview,
		},
		data() {
			return {
				armyConfigList: null,
				roomOwner: null,
				showStartTip: false,
				showPreview: false,
			};
		},
		props: {
			roomId: {
				type: String,
			},
			mapId: {
				type: String,
			},
			roomName: {
				type: String,
			},
			width: {
				type: Number,
				default: 40,
			},
		},
		methods: {
			startTip() {
				if (
					this.armyConfigList &&
					this.armyConfigList.filter((a) => a.type == "user" && !a.play_id)
					.length > 0
				) {
					return this.$("multiPlayer.readyBegin");
				} else {
					return this.$('multiPlayer.readyStart');
				}
			},

			startRoomGame() {
				let args = {};
				args.room_id = this.roomId;
				RoomInit(args);
			},

			startGame({
				record_id
			}) {
				setTimeout(() => {
					this.$appHelper.setLoading();
					GetRecordById(record_id)
						.then((resp) => {
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
										connArgs.type = "net_game";
										this.$store
											.dispatch("connectGameSocket", connArgs)
											.then((r) => {
												this.$appHelper.setLoading();
												this.loading = false;
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
				}, 500);
			},

			async getUnitLevelByTemp(tempId) {
				const resp = await GetUnitLevelByTemp(tempId);
				if (resp.res_code == 0) {
					this.$store.commit("setUnitLevelInfo", resp.res_val);
					return resp.res_val;
				} else {
					this.$appHelper.errorMsg(resp.res_mes);
					return null;
				}
			},

			onDialogCreate() {
				console.log("加入房間页面创建");
			},
			tableStyle({
				row,
				rowIndex
			}) {
				return "background-color: #5a5c59";
			},
			onDialogDestroy() {
				console.log("加入房間页面销毁");
				this.$store.dispatch("disconnectRoomScoket");
				this.$eventBus.publish("flushRoom");
			},
			initSetting(roomId) {
				let joinArgs = {};
				joinArgs.roomId = roomId;
				joinArgs.type = "createRoom";
				return this.$store.dispatch("connectRoomSocket", joinArgs);
			},
			changeCtlArmy(color) {
				let args = {};
				args.new_army = color;
				this.$appHelper.setLoading();
				ChangeArmy(args)
					.then((resp) => {
						this.$appHelper.setLoading();
						if (resp && resp.res_code == 0) {} else {
							this.$appHelper.infoMsg(this.t("multiPlayer.joinFail"));
						}
					})
					.catch((error) => {
						console.error(error);
						this.$appHelper.setLoading();
					});
			},
			levelCtlArmy(color, userId) {
				let args = {};
				args.color = color;
				args.player_id = userId;
				this.$appHelper.setLoading();
				LevelCtlArmy(args)
					.then((resp) => {
						this.$appHelper.setLoading();
					})
					.catch((error) => {
						console.error(error);
						this.$appHelper.setLoading();
					});
			},
			joinRoomSocket(roomId) {
				let joinArgs = {};
				joinArgs.roomId = roomId;
				joinArgs.type = "joinRoom";
				return this.$store.dispatch("connectRoomSocket", joinArgs);
			},
			roomChangeArmy(message) {
				console.log("玩家改变选择单位", message);
				for (let army of this.armyConfigList) {
					if (army.color == message.join_army) {
						army.player = message.user_id;
						army.player_name = message.user_name;
						continue;
					}
					if (army.color == message.level_army) {
						army.player = null;
						army.player_name = null;
					}
				}
				this.armyConfigList = JSON.parse(JSON.stringify(this.armyConfigList));
			},
			changeRoomOwner(message) {
				console.log("房间改变房主", message);
				this.roomOwner = message.user_id;
			},
		},
		created() {
			this.$eventBus.regist(this, "roomChangeArmy");
			this.$eventBus.regist(this, "changeRoomOwner");
			this.$eventBus.regist(this, "startGame");
		},
		destroyed() {
			this.$eventBus.unRegist(this, "roomChangeArmy");
			this.$eventBus.unRegist(this, "changeRoomOwner");
			this.$eventBus.unRegist(this, "startGame");
		},
		computed: {
			canJoinArmy() {
				if (this.armyConfigList) {
					return this.armyConfigList.filter((a) => a.type == "user");
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.player_list {
		margin-top: 2%;
		float: left;
		width: 60%;
		height: 300px;
	}

	.room_message {
		margin-top: 2%;
		float: left;
		width: 40%;
		height: 300px;
	}
</style>
