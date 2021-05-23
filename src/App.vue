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

input:-webkit-autofill {
  -webkit-text-fill-color: #ffffff !important;
  background-color: transparent;
  background-image: none;
  -webkit-transition: background-color 50000s ease-in-out 0s;
  transition: background-color 50000s ease-in-out 0s;
}
</style>
