<template>
	<!--首页-->
	<div class="home" :style="{ background: vueStyle.background }">
		<img class="logo" src="../assets/images/assist/logo.png" alt />
		<div class="buttons">
			<ae-button :size="buttonSize" class="home_button font" @click="clickUserInfo">{{ $t('player.title') }}</ae-button>
			<ae-button :size="buttonSize" class="home_button" @click="showChapter = true">{{ $t('battle.title') }}</ae-button>
			<ae-button :size="buttonSize" class="home_button" @click="showEncounter = true">{{ $t('encounter.title') }}</ae-button>
			<ae-button :size="buttonSize" class="home_button" @click="showNetGameDialog = true">{{ $t('multiPlayer.title') }}</ae-button>
			<ae-button :size="buttonSize" class="home_button" @click="showUserRecord = true">{{ $t('loadGame.title') }}</ae-button>
			<ae-button :size="buttonSize" class="home_button" @click="showUnitMange = true">{{ $t('unitManagement.title') }}</ae-button>
			<ae-button :size="buttonSize" class="home_button" @click="showTemplatManger = true">{{ $t('templateManagement.title') }}</ae-button>
			<ae-button :size="buttonSize" class="home_button" @click="showMapManger = true">{{ $t('mapManagement.title') }}</ae-button>
			<ae-button :size="buttonSize" class="home_button" @click="router('mapEdit/0')">{{ $t('mapEdit.title') }}</ae-button>
			<!--  <ae-button :size="buttonSize" class="home_button" @click="router('demo')">帮助</ae-button>   -->
			<!--  <ae-button :size="buttonSize" class="home_button" @click="router('monitor')">监控</ae-button> -->
		</div>

		<user-info v-model="userInfoDialog" :user="loginUser" @logout="logout" :isDisable="true" @close="userInfoDialog = false"></user-info>
		<!-- 多人游戏 房间管理 -->
		<room-index v-model="showNetGameDialog"></room-index>
		<!--遭遇战-->
		<encounter v-model="showEncounter"></encounter>
		<!--模板管理-->
		<template-manger v-model="showTemplatManger"></template-manger>
		<!--单位信息管理-->
		<unit-mes-manger v-model="showUnitMange"></unit-mes-manger>
		<!--用户记录-->
		<user-record v-model="showUserRecord"></user-record>

		<!--章节选择-->
		<chapter-select v-model="showChapter"></chapter-select>

		<map-manger v-model="showMapManger"></map-manger>
	</div>
</template>

<script>
import UserInfo from './UserInfo.vue';
import RoomIndex from './net/room/RoomIndex.vue';
import Encounter from './encounter/Encounter.vue';
import UserRecord from './encounter/UserRecord.vue';
import TemplateManger from './template_mange/TemplateManger.vue';
import UnitMesManger from './template_mange/UnitMesManger.vue';
import MapManger from './map_manger/MapManger.vue';
import MapEdit from './map_manger/MapEdit.vue';
import ChapterSelect from './encounter/ChapterSelect.vue';
// const url = 'https://sungd.github.io/Pacifico.ttf';
const url = '/static/font/aeFont.ttf';
export default {
	components: {
		UserInfo,
		RoomIndex,
		Encounter,
		UserRecord,
		TemplateManger,
		UnitMesManger,
		MapEdit,
		ChapterSelect,
		MapManger
	},
	data() {
		return {
			loginUser: globalThis.store,
			dialogVisible: false,
			loginVisible: false,
			userInfoDialog: false,
			showNetGameDialog: false,
			showEncounter: false,
			showUserRecord: false,
			showTemplatManger: false,
			showUnitMange: false,
			showMapEdit: false,
			showChapter: false,
			showMapManger: false,
			buttonSize: 0.7,
			vueStyle: {}
		};
	},
	methods: {
		// 点击玩家时
		clickUserInfo() {
			this.userInfoDialog = !this.userInfoDialog;
		},
		logout() {
			this.userInfoDialog = false;
			this.loginUser = {};
		},
		router(path) {
			this.$router.push('/' + path);
		},
		// 微信加载字体
		loadFontFaceFromWeb() {
			uni.loadFontFace({
				family: 'aeFont',
				source: `url("${url}")`
			});
		}
	},
	created() {
		// #ifdef H5
		window.HomeVue = this;
		this.buttonSize = 0.8;
		// #endif
		// #ifdef MP-WEIXIN
		wx.HomeVue = this;
		this.loadFontFaceFromWeb();
		// #endif
		this.vueStyle.background = this.$s('homeBase.background');
	},
	computed: {
		homeStyle() {
			return this.$s('homeBase');
		},

	}
};
</script>

<style lang="scss" scoped>
.home {
	text-align: center;
	height: 100%;
}

.logo {
	margin: 0 auto;
	height: 15%;
	// #ifdef MP-WEIXIN
	width: 20%;
	// #endif
}

.buttons {
	width: 50%;
	height: 80%;
	margin: 0 auto;
	background-color: #242b44;
	border: 2rpx #afb7aa solid;
	box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.692);
}

.home_button {
	float: left;
	margin-left: 15%;
	height: 9%;
	margin-top: 1%;
	width: 60%;
}
</style>
