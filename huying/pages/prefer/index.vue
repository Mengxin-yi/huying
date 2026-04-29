<template>
	<view class="page">
		<!-- 用户信息头部 -->
		<view class="header">
			<view class="header__inner">
				<view class="user-avatar" @click="goProfile">
					<image v-if="userStore.avatar" class="user-avatar__img" :src="userStore.avatar" mode="aspectFill" />
					<view v-else class="user-avatar__placeholder">
						<u-icon name="account" size="28" color="#fff"></u-icon>
					</view>
				</view>
				<view class="user-info">
					<view class="user-info__row">
						<text class="user-info__name">{{ userStore.username || '未登录' }}</text>
						<view class="user-info__vip" v-if="userStore.isLoggedIn && userStore.vipLabel">
							<text class="user-info__vip-text">{{ userStore.vipLabel }}</text>
						</view>
					</view>
					<text class="user-info__type" v-if="userStore.isLoggedIn">
						{{ userStore.userInfo?.user_type === '企事业单位' ? '单位用户' : (userStore.userInfo?.user_type || '个人用户') }}
					</text>
					<text class="user-info__login" v-else @click="goLogin">点击登录</text>
				</view>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-card">
			<view class="menu-item" @click="gotoPage('/pages/prefer/about')">
				<u-icon name="info-circle" size="20" color="#666"></u-icon>
				<text class="menu-item__text">关于我们</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage('/pages/prefer/feedback')">
				<u-icon name="edit-pen" size="20" color="#666"></u-icon>
				<text class="menu-item__text">意见反馈</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage('/pages/prefer/company')">
				<u-icon name="home" size="20" color="#666"></u-icon>
				<text class="menu-item__text">企业信息</text>
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
import { useUserStore } from '@/store/modules/user.js'
import page from '@/common/js/utils/page.js'

const userStore = useUserStore()
const goLogin = () => {
	uni.navigateTo({ url: '/pages/login/index' })
}

const goProfile = () => {
	if (!userStore.isLoggedIn) {
		goLogin()
	}
}

const gotoPage = (path) => {
	page.gotoPage(path)
}

const handleLogout = async () => {
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
}

/* 用户信息头部 */
.header {
	background: linear-gradient(135deg, $primary-color, $primary-color-light);
	padding: 80rpx 60rpx 60rpx;

	&__inner {
		display: flex;
		align-items: center;
	}
}

.user-avatar {
	width: 120rpx;
	height: 120rpx;
	margin-right: $spacing-lg;
	flex-shrink: 0;

	&__img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid rgba(255, 255, 255, 0.5);
	}

	&__placeholder {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.user-info {
	flex: 1;

	&__row {
		display: flex;
		align-items: center;
	}

	&__name {
		font-size: 36rpx;
		font-weight: bold;
		color: #FFFFFF;
	}

	&__vip {
		margin-left: $spacing-sm;
		background: linear-gradient(135deg, #FFC107, #FF9800);
		border-radius: 20rpx;
		padding: 4rpx 16rpx;
	}

	&__vip-text {
		font-size: 20rpx;
		color: #FFFFFF;
		font-weight: bold;
	}

	&__type {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
		margin-top: $spacing-xs;
		display: block;
	}

	&__login {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
		margin-top: $spacing-xs;
		display: block;
	}
}

/* 菜单卡片 */
.menu-card {
	margin: $spacing-md $page-padding;
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
		margin-left: $spacing-sm;
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
