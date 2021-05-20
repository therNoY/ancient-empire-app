<script>
export default {
	methods:{
		
	},
	onLaunch: function() {
		console.log('App Launch');
		uni.getSystemInfo().then(resp => {
			console.log('系统信息', resp);
		});
		// #ifdef H5
		uni.platform = 'H5';
		uni.isH5 = true;
		// #endif

		// #ifdef MP-WEIXIN
		uni.platform = 'mpWeiXin';
		// #endif
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import 'uview-ui/index.scss';
@import url('/style/font/aeFont.css');

page {
	height: 100%;
}
</style>
