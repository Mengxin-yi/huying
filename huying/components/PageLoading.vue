<template>
	<view class="page-loading">
		<u-loading-icon mode="circle" size="48"></u-loading-icon>
		<text class="page-loading__text" v-if="text">{{ text }}</text>
	</view>
</template>

<script setup>
const props = defineProps({
	text: { type: String, default: '加载中...' } // 提示文字
})
</script>

<style lang="scss" scoped>
.page-loading {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 400rpx;

	&__text {
		margin-top: $spacing-sm;
		font-size: $uni-font-size-sm;
		color: $text-color-weak;
	}
}
</style>
