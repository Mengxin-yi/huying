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
			<p style="font-size: 20px; padding: 20px 0px;">1. 订阅页面点击加号</p>
			<p style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="/static/image/zb1.png"></p>
			<p style="font-size: 20px; padding: 20px 0px;">2. 关键词列表页面点击加号</p>
			<p style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="/static/image/gj1.png"></p>
			<p style="font-size: 20px; padding: 20px 0px;">3. 输入关键词信息</p>
			<p style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="/static/image/gj2.png"></p>
			<p style="font-size: 20px;">4. 点击保存</p>
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
