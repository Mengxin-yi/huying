<template>
	<view class="page">
		<!-- 顶部头像+基本信息 -->
		<view class="header-card">
			<view class="header-card__bg"></view>
			<view class="header-card__body">
				<view class="header-card__avatar">
					<image v-if="avatarUrl" class="header-card__img" :src="avatarUrl" mode="scaleToFill" />
					<view v-else class="header-card__placeholder">
						<u-icon name="account-fill" size="48" color="#fff"></u-icon>
					</view>
				</view>
				<view class="header-card__info">
					<text class="header-card__name">{{ profile.username || '未设置' }}</text>
					<view v-if="profile.user_type" class="header-card__tags">
						<text class="header-card__tag">{{ profile.user_type }}</text>
						<text v-if="profile.user_role" class="header-card__tag">{{ profile.user_role }}</text>
					</view>
					<text v-if="profile.intro" class="header-card__intro">{{ profile.intro }}</text>
				</view>
			</view>
		</view>

		<!-- 联系信息 -->
		<view class="info-card">
			<view class="info-card__title">联系信息</view>
			<view class="info-card__row" @click="handleTel">
				<u-icon name="phone-fill" size="20" color="#999"></u-icon>
				<text class="info-card__label">电话</text>
				<text class="info-card__value">{{ displayPhone }}</text>
				<u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
			</view>
			<view v-if="!isUnit && profile.email" class="info-card__row">
				<u-icon name="email-fill" size="20" color="#999"></u-icon>
				<text class="info-card__label">邮箱</text>
				<text class="info-card__value">{{ profile.email }}</text>
			</view>
			<view class="info-card__row" @click="handleLbs">
				<u-icon name="map-fill" size="20" color="#999"></u-icon>
				<text class="info-card__label">地址</text>
				<text class="info-card__value">{{ displayAddr }}</text>
				<u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="action-bar">
			<view class="action-bar__item" @click="handleTel">
				<view class="action-bar__icon action-bar__icon--tel">
					<u-icon name="phone-fill" size="22" color="#fff"></u-icon>
				</view>
				<text class="action-bar__text">打电话</text>
			</view>
			<view class="action-bar__item" @click="handleLbs">
				<view class="action-bar__icon action-bar__icon--lbs">
					<u-icon name="map-fill" size="22" color="#fff"></u-icon>
				</view>
				<text class="action-bar__text">去拜访</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'
	import { userApi } from '@/api/index.js'
	import { useUserStore } from '@/store/modules/user.js'

	/** 图片基础域名 */
	const IMG_HOST = 'https://ugoo.ugoolink.com'

	/** 补全图片 URL */
	const resolveImgUrl = (url) => {
		if (!url) return ''
		if (/^(https?:|data:|\/\/)/.test(url)) return url
		return IMG_HOST + (url.startsWith('/') ? url : '/' + url)
	}

	const userStore = useUserStore()

	/** 用户资料 */
	const profile = ref({})

	/** 认证信息 */
	const auth = ref({})

	/** 头像地址 */
	const avatarUrl = computed(() => {
		const url = profile.value.avatar_img
		if (!url) return ''
		return resolveImgUrl(url) + '?temp=' + Date.now()
	})

	/** 是否为单位用户 */
	const isUnit = computed(() => {
		const userType = profile.value.user_type
		return !!userType && userType !== '个人用户'
	})

	/** 显示的电话号码 */
	const displayPhone = computed(() => {
		if (isUnit.value) return auth.value.phone || '未填写'
		return profile.value.tel || '未填写'
	})

	/** 显示的地址 */
	const displayAddr = computed(() => {
		if (isUnit.value) return auth.value.addr || '未填写'
		return (profile.value.province || '') + (profile.value.city || '') || '未填写'
	})

	/** 加载数据 */
	const loadData = async () => {
		try {
			const res = await userApi.getProfile()
			profile.value = res.item || {}
		} catch (e) {
			// 静默处理
		}
		try {
			const res = await userApi.getAuthDetail()
			auth.value = res.item || {}
		} catch (e) {
			// 静默处理
		}
	}

	/** 打电话 */
	const handleTel = () => {
		const tel = isUnit.value ? auth.value.phone : profile.value.tel
		if (!tel) {
			uni.showToast({ title: '暂无电话信息', icon: 'none' })
			return
		}
		uni.makePhoneCall({ phoneNumber: tel })
	}

	/** 去拜访 */
	const handleLbs = () => {
		let address = ''
		if (isUnit.value) {
			address = auth.value.addr || ''
		} else {
			address = (profile.value.province || '') + (profile.value.city || '')
		}
		if (!address) {
			uni.showToast({ title: '暂无地址信息', icon: 'none' })
			return
		}
		// 使用 uni-app 内置地图打开位置
		uni.chooseLocation({
			keyword: address,
			success: () => {},
			fail: () => {
				// 如果选择器取消或失败，尝试用 openLocation
				uni.showToast({ title: '请在地图中搜索：' + address, icon: 'none' })
			}
		})
	}

	onMounted(() => { loadData() })
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		overflow: hidden;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/* 顶部头像区域 */
	.header-card {
		position: relative;

		&__bg {
			height: 280rpx;
			background: linear-gradient(135deg, $primary-color, lighten($primary-color, 15%));
		}

		&__body {
			position: relative;
			margin: -120rpx $spacing-md 0;
			background-color: $card-bg;
			border-radius: $card-radius;
			padding: $spacing-lg;
			display: flex;
			align-items: center;
			gap: $spacing-md;
			box-shadow: $shadow-light;
		}

		&__avatar {
			width: 140rpx;
			height: 140rpx;
			border-radius: 70rpx;
			background-color: $primary-color;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-shrink: 0;
			border: 4rpx solid #fff;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		}

		&__img {
			width: 140rpx;
			height: 140rpx;
			border-radius: 70rpx;
		}

		&__placeholder {
			width: 140rpx;
			height: 140rpx;
			border-radius: 70rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__info {
			flex: 1;
			min-width: 0;
		}

		&__name {
			font-size: 34rpx;
			font-weight: bold;
			color: $text-color;
			display: block;
		}

		&__tags {
			display: flex;
			flex-wrap: wrap;
			gap: 8rpx;
			margin-top: 8rpx;
		}

		&__tag {
			font-size: 22rpx;
			color: $primary-color;
			border: 1px solid $primary-color;
			border-radius: 6rpx;
			padding: 2rpx 12rpx;
		}

		&__intro {
			font-size: 24rpx;
			color: $text-color-weak;
			margin-top: 8rpx;
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	/* 联系信息卡片 */
	.info-card {
		margin: $spacing-md $spacing-md 0;
		background-color: $card-bg;
		border-radius: $card-radius;
		overflow: hidden;
		box-shadow: $shadow-light;

		&__title {
			font-size: 28rpx;
			font-weight: bold;
			color: $text-color;
			padding: $spacing-md $spacing-lg;
			border-bottom: 1px solid $border-color;
		}

		&__row {
			display: flex;
			align-items: center;
			padding: $spacing-md $spacing-lg;
			border-bottom: 1px solid $border-color;
			gap: $spacing-sm;

			&:last-child {
				border-bottom: none;
			}
		}

		&__label {
			font-size: 26rpx;
			color: $text-color-weak;
			width: 80rpx;
			flex-shrink: 0;
		}

		&__value {
			flex: 1;
			font-size: 28rpx;
			color: $text-color;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	/* 操作按钮 */
	.action-bar {
		margin: $spacing-lg $spacing-md;
		display: flex;
		gap: $spacing-md;

		&__item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: $spacing-xs;
		}

		&__icon {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

			&--tel {
				background: linear-gradient(135deg, #18BC37, #2ecc71);
			}

			&--lbs {
				background: linear-gradient(135deg, $primary-color, lighten($primary-color, 10%));
			}
		}

		&__text {
			font-size: 24rpx;
			color: $text-color-weak;
		}
	}
</style>
