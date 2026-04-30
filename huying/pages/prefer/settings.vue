<template>
	<view class="page">
		<!-- 账号与安全 -->
		<view class="menu-card">
			<view class="menu-item" @click="gotoPage('/pages/prefer/account-security')">
				<text class="menu-item__text">账号与安全</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
		</view>

		<!-- 通知设置 -->
		<view class="menu-card">
			<view class="menu-item">
				<text class="menu-item__text">新信息通知</text>
				<switch :checked="notificationEnabled" @change="onNotificationChange" color="#007AFF" />
			</view>
		</view>

		<!-- 清除缓存 -->
		<view class="menu-card">
			<view class="menu-item" @click="handleClearCache">
				<text class="menu-item__text">清除缓存</text>
				<text class="menu-item__value">{{ cacheSize }}</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="menu-card" v-if="userStore.isLoggedIn">
			<view class="menu-item logout-btn" @click="handleLogout">
				<text class="logout-btn__text">退出登录</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { useUserStore } from '@/store/modules/user.js'
	import page from '@/common/js/utils/page.js'

	/** 用户状态 */
	const userStore = useUserStore()

	/** 新信息通知开关状态 */
	const notificationEnabled = ref(uni.getStorageSync('notification_enabled') !== false)

	/** 缓存大小显示文字 */
	const cacheSize = ref('0MB')

	/**
	 * 跳转到指定页面
	 * @param {string} path - 页面路径
	 */
	const gotoPage = (path) => {
		page.gotoPage(path)
	}

	/**
	 * 切换通知开关
	 * @param {Object} e - switch 变更事件
	 */
	const onNotificationChange = (e) => {
		const val = e.detail.value
		notificationEnabled.value = val
		uni.setStorageSync('notification_enabled', val)
	}

	/**
	 * 清除本地缓存
	 */
	const handleClearCache = () => {
		uni.showModal({
			title: '提示',
			content: '确定清除所有缓存数据吗？',
			success: (res) => {
				if (res.confirm) {
					uni.clearStorage()
					// 恢复登录态
					userStore.restoreLoginState()
					cacheSize.value = '0MB'
					uni.showToast({ title: '缓存已清除', icon: 'success' })
				}
			}
		})
	}

	/**
	 * 退出登录
	 */
	const handleLogout = () => {
		uni.showModal({
			title: '提示',
			content: '确定退出登录吗？',
			success: async (res) => {
				if (res.confirm) {
					await userStore.logout()
					uni.reLaunch({ url: '/pages/login/index' })
				}
			}
		})
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-md;
	}

	/* 菜单卡片 */
	.menu-card {
		margin-bottom: $spacing-sm;
		background-color: $card-bg;
		border-radius: $card-radius;
		overflow: hidden;
		box-shadow: $shadow-light;
	}

	.menu-item {
		display: flex;
		align-items: center;
		padding: $spacing-md $spacing-lg;
		border-bottom: 1px solid $border-color;

		&:last-child {
			border-bottom: none;
		}

		&__text {
			flex: 1;
			font-size: 28rpx;
			color: $text-color;
		}

		&__value {
			font-size: 24rpx;
			color: $text-color-weak;
			margin-right: $spacing-xs;
		}
	}

	/* 退出登录 */
	.logout-btn {
		justify-content: center;

		&__text {
			font-size: 28rpx;
			color: $danger-color;
			text-align: center;
		}
	}
</style>
