<template>
	<view class="page" @touchmove.stop.prevent>
		<!-- 用户信息头部 -->
		<view class="profile-card" @click="userStore.isLoggedIn ? gotoPage('/pages/prefer/profile') : goLogin()">
			<view class="profile-card__avatar" @click="goProfile">
				<image v-if="userStore.avatar" class="profile-card__avatar-img" :src="userStore.avatar" mode="aspectFill" />
				<view v-else class="profile-card__avatar-default">
					<u-icon name="account" size="28" color="#ccc"></u-icon>
				</view>
			</view>
			<view class="profile-card__info">
				<view class="profile-card__row">
					<text class="profile-card__name">{{ userStore.username || '未登录' }}</text>
					<view class="profile-card__vip" v-if="userStore.isLoggedIn && userStore.isVip">
						<text class="profile-card__vip-text">{{ userStore.vipLabel }}</text>
					</view>
				</view>
				<text class="profile-card__type" v-if="userStore.isLoggedIn">
					{{ userStore.userInfo?.user_type === '企事业单位' ? '单位用户' : (userStore.userInfo?.user_type || '个人用户') }}
				</text>
				<text class="profile-card__login" v-else @click="goLogin">点击登录</text>
			</view>
			<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
		</view>

		<!-- 会员与订单 -->
		<view class="menu-card">
			<view class="menu-item" @click="gotoPage('/pages/prefer/vip')">
				<u-icon name="star" size="20" color="#FFA500"></u-icon>
				<text class="menu-item__text">我的会员</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage('/pages/prefer/mall')">
				<u-icon name="shopping-cart" size="20" color="#FF6B81"></u-icon>
				<text class="menu-item__text">会员商城</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage('/pages/prefer/order')">
				<u-icon name="order" size="20" color="#666"></u-icon>
				<text class="menu-item__text">我的订单</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
		</view>

		<!-- 内容管理 -->
		<view class="menu-card">
			<view class="menu-item" @click="gotoPage('/pages/prefer/publish')">
				<u-icon name="file-text" size="20" color="#666"></u-icon>
				<text class="menu-item__text">我的发布</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage('/pages/prefer/subscribe')">
				<u-icon name="bookmark" size="20" color="#666"></u-icon>
				<text class="menu-item__text">我的订阅</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage(certPath)">
				<u-icon name="home" size="20" color="#666"></u-icon>
				<text class="menu-item__text">{{ certLabel }}</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage('/pages/prefer/card')">
				<u-icon name="account" size="20" color="#666"></u-icon>
				<text class="menu-item__text">我的名片</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
		</view>

		<!-- 帮助与设置 -->
		<view class="menu-card">
			<view class="menu-item" @click="gotoPage('/pages/prefer/feedback')">
				<u-icon name="chat" size="20" color="#666"></u-icon>
				<text class="menu-item__text">帮助与反馈</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage('/pages/prefer/contact')">
				<u-icon name="phone" size="20" color="#666"></u-icon>
				<text class="menu-item__text">联系我们</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage('/pages/prefer/settings')">
				<u-icon name="setting" size="20" color="#666"></u-icon>
				<text class="menu-item__text">设置</text>
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
	import {
		onShow
	} from '@dcloudio/uni-app'
	import {
		useUserStore
	} from '@/store/modules/user.js'
	import { computed } from 'vue'
	import page from '@/common/js/utils/page.js'

	const userStore = useUserStore()

	/** 是否为单位用户（非个人用户即为单位用户：企事业单位、政府组织、公益组织） */
	const isCompanyUser = computed(() => {
		const userType = userStore.userInfo && userStore.userInfo.user_type
		return !!userType && userType !== '个人用户'
	})

	/** 认证菜单文字 */
	const certLabel = computed(() => isCompanyUser.value ? '公司认证' : '我的认证')

	/** 认证页面路径 */
	const certPath = computed(() => isCompanyUser.value ? '/pages/prefer/company' : '/pages/prefer/personal-cert')

	onShow(async () => {
		if (userStore.isLoggedIn) {
			try {
				await Promise.all([
					userStore.fetchProfile(),
					userStore.fetchVipInfo()
				])
			} catch (e) {
				// 静默刷新，失败不提示
			}
		}
	})
	const goLogin = () => {
		uni.navigateTo({
			url: '/pages/login/index'
		})
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
					uni.reLaunch({
						url: '/pages/login/index'
					})
				}
			}
		})
	}
</script>

<style lang="scss" scoped>
	.page {
		height: 100vh;
		overflow: hidden;
		background-color: $bg-color;
		padding: $spacing-md;
	}

	/* 用户信息头部 */
	.profile-card {
		display: flex;
		align-items: center;
		padding: $spacing-lg;
		background-color: $card-bg;
		border-radius: $card-radius;
		box-shadow: $shadow-light;

		&__avatar {
			width: 100rpx;
			height: 100rpx;
			margin-right: $spacing-md;
			flex-shrink: 0;
			border-radius: 50%;
			overflow: hidden;
		}

		&__avatar-img {
			width: 100rpx;
			height: 100rpx;
		}

		&__avatar-default {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background-color: $uni-bg-color-grey;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__info {
			flex: 1;
			min-width: 0;
		}

		&__row {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			gap: $spacing-xs;
		}

		&__name {
			font-size: 32rpx;
			font-weight: bold;
			color: $text-color;
		}

		&__vip {
			background: linear-gradient(135deg, $vip-color-start, $vip-color-end);
			border-radius: $btn-radius;
			padding: 2rpx 12rpx;
		}

		&__vip-text {
			font-size: 20rpx;
			color: #fff;
			font-weight: bold;
		}

		&__type {
			display: inline-block;
			font-size: 24rpx;
			color: $text-color-weak;
			margin-top: $spacing-xs;
			background-color: $uni-bg-color-grey;
			padding: 2rpx 12rpx;
			border-radius: $btn-radius;
		}

		&__login {
			font-size: 26rpx;
			color: $text-color-weak;
			margin-top: $spacing-xs;
			display: block;
		}
	}

	/* 菜单卡片 */
	.menu-card {
		margin: $spacing-sm 0;
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