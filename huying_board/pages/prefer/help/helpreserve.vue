<template>
	<view class="content-inner" v-html="data">
	</view>
</template>

<script>
	import pageUtil from '../../../common/js/utils/page.js';
	import zb1 from '../../../static/image/zb1.png';
	import gj1 from '../../../static/image/gj1.png';
	import gj2 from '../../../static/image/gj2.png';
	
	export default {
		data() {
			return {
				data: '<div style="margin-left: 1%; margin-right: 1%;"><p style="font-size: 20px; padding: 20px 0px;">1.订阅页面点击加号</p><p class="box3" style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="'+ zb1 +'"></p><p style="font-size: 20px; padding: 20px 0px;">2.关键词列表页面点击加号</p><p class="box3" style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="'+ gj1 +'"></p><p style="font-size: 20px; padding: 20px 0px;">3.输入关键词信息</p><p class="box3" style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="'+ gj2 +'"></p><p style="font-size: 20px;">4. 点击保存</p></div>'
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
