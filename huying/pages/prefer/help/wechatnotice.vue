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
			<p style="font-size: 20px; padding: 20px 0px;">1. 进入我的页面</p>
			<p style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="/static/image/ts1.png"></p>
			<p style="font-size: 20px; padding: 20px 0px;">2. 点击设置</p>
			<p style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="/static/image/ts2.png"></p>
			<p style="font-size: 20px; padding: 20px 0px;">3. 点击微信绑定</p>
			<p style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="/static/image/ts3.png"></p>
			<p style="font-size: 20px; padding: 20px 0px;">4. 点击下一步</p>
			<p style="margin-left: 1%; margin-right: 1%;"><img width="100%" fit="contain" src="/static/image/ts4.png"></p>
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
