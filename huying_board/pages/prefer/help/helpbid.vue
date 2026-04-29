<template>
	<view class="content-inner" v-html="data">
	</view>
</template>

<script>
	import pageUtil from '../../../common/js/utils/page.js';
	import zb1 from '../../../static/image/zb1.png';
	import zb2 from '../../../static/image/zb2.png';
	
	export default {
		data() {
			return {
				data: '<div style="margin-left: 1%; margin-right: 1%;"><p style="font-size: 20px; padding: 20px 0px;">1. 点击招标tab</p><p class="box3" style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="'+ zb1 +'"></p><p style="font-size: 20px;; padding: 20px 0px;">2. 点击链接查看详细信息</p><p class="box3" style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="'+ zb2 +'"></p></div>'
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
