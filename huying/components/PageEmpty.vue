<template>
	<view class="page-empty">
		<u-empty
			:mode="mode"
			:text="text"
			:icon="icon"
			:marginTop="marginTop"
		></u-empty>
	</view>
</template>

<script setup>
const props = defineProps({
	text: { type: String, default: '暂无数据' }, // 提示文字
	mode: { type: String, default: 'data' }, // uview-plus empty 组件模式
	icon: { type: String, default: '' }, // 自定义图标
	marginTop: { type: [String, Number], default: '200' } // 顶部间距
})
</script>

<style lang="scss" scoped>
.page-empty {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 400rpx;
}
</style>
