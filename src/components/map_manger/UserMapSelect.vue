<!-- 用户地图选择器 -->
<template>
	<div class="userMap-select">
		<ae-complex-dialog ref="aeDialog" v-model="showModel" :showItem="showItem" title="选择地图"
			:initQueryDataGrid="initQueryDataFunction" :titleSwitchSelect="titleSwitchSelect"
			:footerButtons="buttonList" :width="40" page>
		</ae-complex-dialog>
		<ae-button :width="80" class="userMap-select-button" @onClick="clickSelectMap">
			选择地图
		</ae-button>
		<div @click="clickPreivewChooseMap" class="userMap-select-name" v-if="chooseMap && chooseMap.map_name">
			{{ chooseMap.map_name }}
		</div>

		<ae-base-dialog title="设置地图" v-model="setMapShow" @close="closeSetMap">
			<div>
				<uni-table>
					<uni-tr>
						<uni-th>军队</uni-th>
						<uni-th>行动顺序</uni-th>
						<uni-th>玩家类型</uni-th>
						<uni-th>阵营</uni-th>
					</uni-tr>
					<uni-tr v-for="(army, index) in initArmys" :key="index">
						<uni-td>
							<img :src="$appHelper.getUnitImg('10', army.color)" />
						</uni-td>
						<uni-td>
							<uni-number-box :min="1" :max="initArmys.length" v-model="army.color" @change="changeOrder">
							</uni-number-box>
						</uni-td>
						<uni-td>
							<uni-group>
								<uni-data-checkbox mode="button" v-model="army.type" :localdata="armyType">
								</uni-data-checkbox>
							</uni-group>
						</uni-td>
						<uni-td>
							<uni-number-box :min="1" :max="initArmys.length" v-model="army.camp">
							</uni-number-box>
						</uni-td>
					</uni-tr>
					</uni-tr>
				</uni-table>
				<div class="common_init">
					<span>初始金币:</span>
					<uni-number-box v-model="initMoney" :min="500" :max="2000" :step="500">
					</uni-number-box>
					<span style="padding-left: 1%">最大人口:</span>
					<uni-number-box v-model="maxPop" :min="15" :max="50" :step="5"></uni-number-box>
				</div>
				<div style="width: 100%">
					<ae-button :marginLeft="25" :width="50" @onClick="clickSetMap">
						确认
					</ae-button>
				</div>
			</div>
		</ae-base-dialog>

		<map-preview v-model="previewVisible" @close="close" :mapId="previewMapId" :armyConfigList="initArmys">
		</map-preview>
	</div>
</template>

<script>
	import {
		GetEncounterMap,
		GetUserMapList,
		GetUserDownloadMap,
		InitEncounterMap,
	} from "@/src/api";
	import MapPreview from "../frame/MapPreview.vue";
	import AeRadioButton from "../frame/AeRadioButton";
	import blackStyle from "@/src/mixins/style/blackStyle";
	export default {
		mixins: [blackStyle],
		components: {
			MapPreview,
			AeRadioButton,
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
				titleSwitchSelect: {
					type: "switchSelect",
					key: "queryType",
					default: "1",
					des: "",
					items: [{
							key: "1",
							value: "系统地图",
							query: GetEncounterMap
						},
						{
							key: "2",
							value: "我的地图",
							query: GetUserMapList
						},
						{
							key: "3",
							value: "我的下载",
							query: GetUserDownloadMap
						},
					],
				},
				showItem: ["map_name"],
				showModel: false,
				buttonList: [{
						name: "选择",
						action: this.clickChooseMap
					},
					{
						name: "预览",
						action: this.clickPreivewButton
					},
				],
				previewVisible: false,
				previewMapId: null,
				chooseMap: null,
				setMapShow: false,
				initArmys: [],
				initMoney: 500,
				maxPop: 40,
				currentColor: null,
				armyType: [{
						key: "user",
						value: "玩家",
					},
					{
						key: "ai",
						value: "电脑",
					},
					{
						key: "无",
						value: "no",
					},
				],
				initMapConfig: {},
				initQueryDataFunction: null,
			};
		},
		methods: {
			clickSelectMap() {
				this.showModel = true;
				console.log(this.$refs.aeDialog);
			},
			getInitMapConfig() {
				return this.initMapConfig;
			},
			closeSetMap() {},
			clickChooseMap() {
				console.log(this.$refs.aeDialog);
				let value = this.$refs.aeDialog.getDataGridSelect();
				this.chooseMap = value;
				this.setMap();
			},
			clickPreivewButton() {
				let value = this.$refs.aeDialog.getDataGridSelect();
				console.log(value);
				if (value && value.map_id) {
					this.previewMapId = value.map_id;
					this.previewVisible = true;
					return;
				}
			},
			clickPreivewChooseMap() {
				let value = this.chooseMap;
				console.log(value);
				if (value && value.map_id) {
					this.previewMapId = value.map_id;
					this.previewVisible = true;
					return;
				}
			},
			close() {
				this.previewVisible = false;
			},
			// 初始化军队
			setMap() {
				this.initArmys = [];
				let args = {};
				args.uuid = this.chooseMap.map_id;
				InitEncounterMap(args).then((resp) => {
					if (resp.res_code == 0) {
						this.setMapShow = true;
						let colors = resp.res_val;
						for (let index = 0; index < colors.length; index++) {
							const color = colors[index];
							let army = {};
							army.color = color;
							army.order = index + 1;
							army.camp = index + 1;
							army.type = "user";
							this.initArmys.push(army);
						}
					} else {
						this.$appHelper.errorMsg(resp.res_mes);
					}
				});
			},
			getCurrent(color) {
				this.currentColor = color;
			},
			changeOrder(newNum, oldNum) {
				for (let index = 0; index < this.initArmys.length; index++) {
					let army = this.initArmys[index];
					if (army.order == newNum && army.color != this.currentColor) {
						// 这是要被改变的那个
						army.order = oldNum;
						break;
					}
				}
			},
			clickSetMap() {
				this.initMapConfig.max_pop = this.maxPop;
				this.initMapConfig.money = this.initMoney;
				this.initMapConfig.army_list = this.initArmys;
				this.initMapConfig.map_id = this.chooseMap.map_id;
				this.chooseMap.config = this.initMapConfig;
				this.$emit("input", this.initMapConfig);
				console.log("选择地图", this.initMapConfig);
				this.setMapShow = false;
				this.showModel = false;
			},
		},
		created() {
			this.initQueryDataFunction = GetEncounterMap;
		},
		computed: {},
	};
</script>

<style lang="scss" scoped>
	.userMap-select {
		float: left;
		width: 100%;

		.userMap-select-button {
			float: left;
			width: 30%;
		}

		.userMap-select-name {
			font-size: 14px;
			float: left;
			width: 30%;
			padding: 2%;
			color: white;
			text-decoration: underline;
			cursor: pointer;
		}

		.common_init {
			width: 100%;
			padding-top: 2%;
			padding-bottom: 2%;
			float: left;
			color: white;

			span {
				font-size: 14px;
			}
		}
	}
</style>
