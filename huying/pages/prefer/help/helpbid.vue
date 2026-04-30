<template>
	<view class="page">
		<view class="content" v-html="htmlContent"></view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'

	/** 帮助内容（图文步骤） */
	const htmlContent = ref(`
		<div style="margin-left: 1%; margin-right: 1%;">
			<p style="font-size: 20px; padding: 20px 0px;">1. 点击招标tab</p>
			<p style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="/static/image/zb1.png"></p>
			<p style="font-size: 20px; padding: 20px 0px;">2. 点击链接查看详细信息</p>
			<p style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="/static/image/zb2.png"></p>
		</div>
	`)
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $card-bg;
	}

	.content {
		padding: 20rpx;
	}
</style>
