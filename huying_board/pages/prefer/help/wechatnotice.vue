<template>
	<view class="content-inner" v-html="data">
	</view>
</template>

<script>
	import pageUtil from '../../../common/js/utils/page.js';
	import ts1 from '../../../static/image/ts1.png';
	import ts2 from '../../../static/image/ts2.png';
	import ts3 from '../../../static/image/ts3.png';
	import ts4 from '../../../static/image/ts4.png';
	
	export default {
		data() {
			return {
				data: '<div style="margin-left: 1%; margin-right: 1%;"><p style="font-size: 20px; padding: 20px 0px;">1.进入我的页面</p><p class="box3" style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="'+ ts1 +'"></p><p style="font-size: 20px; padding: 20px 0px;">2. 点击设置</p><p class="box3" style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="'+ ts2 +'"></p><p style="font-size: 20px; padding: 20px 0px;">3. 点击微信绑定</p><p class="box3" style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="'+ ts3 +'"></p><p style="font-size: 20px; padding: 20px 0px;">4. 点击下一步</p><p class="box3" style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="'+ ts4 +'"></p></div>'
			}
		},
		mounted() {
			pageUtil.checkWechatAll();
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.content-inner {
		padding: 20rpx 20rpx;
	}

</style>
