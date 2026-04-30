<template>
	<view class="page" @click="handleCopy">
		<view class="param-card">
			<view class="param-item">
				<text class="param-item__label">UA</text>
				<text class="param-item__value">{{ envUa }}</text>
			</view>
			<view class="param-item">
				<text class="param-item__label">System</text>
				<text class="param-item__value">{{ envSys }}</text>
			</view>
			<view class="param-item">
				<text class="param-item__label">WindowHeight</text>
				<text class="param-item__value">{{ envHeight }}</text>
			</view>
		</view>
		<view class="tip">
			<text class="tip__text">点击页面复制参数到剪贴板</text>
		</view>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue'

	/** UA 信息 */
	const envUa = ref('')

	/** 系统信息 */
	const envSys = ref('')

	/** 窗口高度信息 */
	const envHeight = ref('')

	/**
	 * 初始化获取设备参数
	 */
	const initParams = () => {
		// #ifdef H5
		envUa.value = navigator.userAgent
		// #endif

		uni.getSystemInfo({
			success: (info) => {
				// #ifdef H5
				envHeight.value = `innerHeight: ${window.innerHeight}; outerHeight: ${window.outerHeight}; windowHeight: ${info.windowHeight}; screenHeight: ${info.screenHeight}`
				// #endif
				// #ifndef H5
				envHeight.value = `windowHeight: ${info.windowHeight}; screenHeight: ${info.screenHeight}`
				// #endif

				const param = { ...info }
				delete param.ua
				envSys.value = JSON.stringify(param)
			}
		})
	}

	/**
	 * 复制参数到剪贴板
	 */
	const handleCopy = () => {
		const text = `UA: ${envUa.value}\nSystem: ${envSys.value}\nWindowHeight: ${envHeight.value}`
		uni.setClipboardData({
			data: text,
			success: () => {
				uni.showToast({ title: '已复制参数到剪贴板', icon: 'success' })
			}
		})
	}

	onMounted(() => {
		initParams()
	})
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-md;
	}

	.param-card {
		background-color: $card-bg;
		border-radius: $card-radius;
		overflow: hidden;
	}

	.param-item {
		padding: $spacing-md $spacing-lg;
		border-bottom: 1px solid $border-color;

		&:last-child {
			border-bottom: none;
		}

		&__label {
			display: block;
			font-size: 28rpx;
			font-weight: bold;
			color: $text-color;
			margin-bottom: $spacing-xs;
		}

		&__value {
			display: block;
			font-size: 24rpx;
			color: $text-color-secondary;
			word-break: break-all;
		}
	}

	.tip {
		text-align: center;
		margin-top: $spacing-lg;

		&__text {
			font-size: 24rpx;
			color: $text-color-weak;
		}
	}
</style>
