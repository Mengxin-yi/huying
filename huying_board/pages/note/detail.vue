<template>
	<view class="content-inner">
		<uni-section class="" title="默认插槽" padding="0 0 15px 10px">
			
		</uni-section>
	</view>
</template>

<script>
	import pageUtil from '../../common/js/utils/page.js';
	
	export default {
		data() {
			return {
				
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
		padding-top: 50rpx;
		
		.uni-section {
			background-color: transparent;
		}
	}

</style>
