<template>
	<view class="page">
		<!-- 联系信息列表 -->
		<view class="info-card">
			<view class="info-item">
				<text class="info-item__label">客服电话</text>
				<text class="info-item__value" @click="callPhone('18610064932')">18610064932</text>
			</view>
			<view class="info-item">
				<text class="info-item__label">联系邮箱</text>
				<text class="info-item__value" @click="copyEmail">ugoolink@ugoolink.com</text>
			</view>
			<view class="info-item" @click="gotoPage('/pages/prefer/agreement')">
				<text class="info-item__label">用户使用协议</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="info-item" @click="gotoPage('/pages/prefer/privacy')">
				<text class="info-item__label">隐私协议</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
		</view>
	</view>
</template>

<script setup>
	import page from '@/common/js/utils/page.js'

	/**
	 * 拨打客服电话
	 * @param {string} phone - 电话号码
	 */
	const callPhone = (phone) => {
		uni.makePhoneCall({ phoneNumber: phone })
	}

	/**
	 * 复制邮箱到剪贴板
	 */
	const copyEmail = () => {
		uni.setClipboardData({
			data: 'ugoolink@ugoolink.com',
			success: () => {
				uni.showToast({ title: '已复制邮箱', icon: 'success' })
			}
		})
	}

	/**
	 * 跳转到指定页面
	 * @param {string} path - 页面路径
	 */
	const gotoPage = (path) => {
		page.gotoPage(path)
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
	}

	/* 信息列表 */
	.info-card {
		margin-top: $spacing-sm;
		background-color: $card-bg;
	}

	.info-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-md $spacing-lg;
		border-bottom: 1px solid $border-color;

		&:last-child {
			border-bottom: none;
		}

		&__label {
			font-size: 28rpx;
			color: $text-color;
		}

		&__value {
			font-size: 28rpx;
			color: $primary-color;
		}
	}
</style>
