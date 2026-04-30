<template>
	<view class="page">
		<!-- 二维码区域 -->
		<view class="qrcode-section">
			<view class="qrcode-section__wrap">
				<u-qrcode v-if="bindLink" ref="qrcode" :val="bindLink" size="300" />
				<view v-else class="qrcode-section__loading">
					<u-icon name="reload" size="32" color="#ccc"></u-icon>
					<text class="qrcode-section__loading-text">加载中...</text>
				</view>
			</view>
		</view>

		<!-- 提示信息 -->
		<view class="tip-section">
			<text class="tip-section__action">长按二维码进行操作</text>
			<text class="tip-section__note">(可以保存或扫描二维码)</text>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { userApi } from '@/api/index.js'

	/** 微信绑定链接 */
	const bindLink = ref('')

	/**
	 * 获取微信绑定二维码链接
	 */
	const loadBindLink = async () => {
		try {
			const res = await userApi.getWechatBindLink({ _silent: true })
			bindLink.value = res.link || ''
		} catch (e) {
			uni.showToast({ title: '获取绑定链接失败', icon: 'none' })
		}
	}

	onMounted(() => {
		loadBindLink()
	})
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
	}

	/* 二维码区域 */
	.qrcode-section {
		background-color: $card-bg;
		padding: $spacing-lg;

		&__wrap {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: $spacing-lg 0;
		}

		&__loading {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 300px;
			height: 300px;
		}

		&__loading-text {
			font-size: 24rpx;
			color: $text-color-weak;
			margin-top: $spacing-sm;
		}
	}

	/* 提示信息 */
	.tip-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: $card-bg;
		padding: $spacing-lg;

		&__action {
			font-size: 34rpx;
			color: $text-color;
		}

		&__note {
			font-size: 24rpx;
			color: $text-color-weak;
			margin-top: $spacing-xs;
		}
	}
</style>
