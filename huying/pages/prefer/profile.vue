<template>
	<view class="page">
		<!-- 右上角编辑/取消按钮 -->
		<view class="edit-btn" @click="toggleEdit">
			{{ isEditing ? '取消' : '编辑' }}
		</view>

		<!-- 未登录提示 -->
		<view v-if="!userStore.isLoggedIn && !loading" class="empty-state">
			<PageEmpty text="请先登录后查看个人资料" mode="permission" />
			<view class="empty-state__action">
				<button class="empty-state__btn" @click="goLogin">去登录</button>
			</view>
		</view>

		<!-- 加载中 -->
		<PageLoading v-else-if="loading" />

		<!-- 主内容 -->
		<scroll-view v-else scroll-y class="profile-scroll" :class="{ 'profile-scroll--editing': isEditing }">
			<!-- 头像卡片 -->
			<view class="avatar-card">
				<view class="avatar-card__img-wrap" @click="onAvatarClick">
					<image v-if="displayAvatar" class="avatar-card__img" :src="displayAvatar" mode="aspectFill" />
					<view v-else class="avatar-card__img avatar-card__img--default">
						<u-icon name="account" size="32" color="#ccc"></u-icon>
					</view>
					<view v-if="isEditing" class="avatar-card__camera">
						<u-icon name="camera" size="12" color="#fff"></u-icon>
					</view>
				</view>
				<view class="avatar-card__name">
					<template v-if="!isEditing">{{ profile.surname || userStore.username || '未设置' }}</template>
					<input v-else class="avatar-card__name-input" v-model="profile.surname" placeholder="请输入姓名" />
				</view>
				<text class="avatar-card__account">@{{ profile.username || '' }}</text>
				<view class="avatar-card__tags">
					<text class="avatar-card__type">{{ userTypeLabel }}</text>
					<text v-if="userStore.isVip" class="avatar-card__vip">{{ userStore.vipLabel }}</text>
				</view>
			</view>

			<!-- 个人信息卡片 -->
			<view class="info-card">
				<view class="info-card__row">
					<text class="info-card__label">昵称</text>
					<view class="info-card__value">
						<template v-if="!isEditing">{{ profile.nickname || '未设置' }}</template>
						<input v-else class="info-card__input" v-model="profile.nickname" placeholder="请输入昵称" />
					</view>
					<text v-if="!isEditing" class="info-card__arrow">›</text>
				</view>
				<view class="info-card__row" @click="onGenderClick">
					<text class="info-card__label">性别</text>
					<view class="info-card__value">
						<text>{{ genderLabel }}</text>
					</view>
					<text v-if="!isEditing" class="info-card__arrow">›</text>
				</view>
				<view class="info-card__row info-card__row--top">
					<text class="info-card__label">简介</text>
					<view class="info-card__value info-card__value--flex-end">
						<template v-if="!isEditing">
							<text class="info-card__text-ellipsis">{{ profile.intro || '未设置' }}</text>
						</template>
						<textarea v-else class="info-card__textarea" v-model="profile.intro" placeholder="请输入简介"
							maxlength="200" :auto-height="true" />
					</view>
					<text v-if="!isEditing" class="info-card__arrow">›</text>
				</view>
				<view v-if="isEditing" class="info-card__counter">
					<text>{{ (profile.intro || '').length }}/200</text>
				</view>
				<view class="info-card__row">
					<text class="info-card__label">城市</text>
					<view class="info-card__value">
						<template v-if="!isEditing">
							<text>{{ cityLabel || '未设置' }}</text>
						</template>
						<template v-else>
							<picker mode="region" @change="onCityChange">
								<text :class="{ 'info-card__value--placeholder': !cityLabel }">{{ cityLabel || '请选择城市' }}</text>
							</picker>
						</template>
					</view>
					<text v-if="!isEditing" class="info-card__arrow">›</text>
				</view>
			</view>

			<!-- 联系与账号卡片 -->
			<view class="info-card">
				<view class="info-card__row">
					<text class="info-card__label">邮箱</text>
					<view class="info-card__value">
						<template v-if="!isEditing">{{ profile.email || '未设置' }}</template>
						<input v-else class="info-card__input" v-model="profile.email" placeholder="请输入邮箱" />
					</view>
					<text v-if="!isEditing" class="info-card__arrow">›</text>
				</view>
				<view class="info-card__row">
					<text class="info-card__label">用户名</text>
					<view class="info-card__value info-card__value--readonly">{{ profile.username || '' }}</view>
				</view>
			</view>

			<!-- 会员信息卡片 -->
			<view class="info-card">
				<view class="info-card__row">
					<text class="info-card__label">积分</text>
					<view class="info-card__value info-card__value--highlight">{{ profile.user_score || '0' }}</view>
				</view>
				<view class="info-card__row">
					<text class="info-card__label">等级</text>
					<view class="info-card__value info-card__value--readonly">{{ profile.user_level || userStore.vipLabel || '普通用户' }}</view>
				</view>
			</view>
		</scroll-view>

		<!-- 保存按钮（编辑模式） -->
		<view v-if="isEditing" class="save-bar">
			<button class="save-bar__btn" @click="handleSave">保存</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/modules/user.js'
import { userApi } from '@/api/index.js'
import { MAX_IMAGE_SIZE } from '@/common/js/constants.js'

const userStore = useUserStore()

/** 页面响应式数据 */
const profile = ref({})           // 用户资料对象
const loading = ref(true)         // 加载状态
const isEditing = ref(false)      // 是否处于编辑模式
const tempAvatar = ref('')        // 编辑中暂存的新头像路径
const originalProfile = ref(null) // 编辑前的原始数据快照，用于取消恢复

/** 显示用头像（编辑中用临时头像） */
const displayAvatar = computed(() => {
	return tempAvatar.value || profile.value.avatar_img || userStore.avatar || ''
})

/** 用户类型标签 */
const userTypeLabel = computed(() => {
	const type = profile.value.user_type
	if (type === '企事业单位') return '单位用户'
	return type || '个人用户'
})

/** 性别显示文本 */
const genderLabel = computed(() => {
	const g = profile.value.gender
	if (g === '男' || g === '1') return '男'
	if (g === '女' || g === '2') return '女'
	if (g === '保密' || g === '0') return '保密'
	return '未设置'
})

/** 城市显示文本 */
const cityLabel = computed(() => {
	return (profile.value.province || '') + (profile.value.city || '') || ''
})

/** 加载用户资料 */
const loadProfile = async () => {
	try {
		loading.value = true
		const res = await userApi.getProfile()
		profile.value = res.item || res || {}
	} catch (e) {
		uni.showToast({ title: '加载失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

/** 进入编辑模式 */
const enterEdit = () => {
	// 保存原始数据快照用于取消恢复
	originalProfile.value = JSON.parse(JSON.stringify(profile.value))
	isEditing.value = true
}

/** 取消编辑，恢复原始数据 */
const cancelEdit = () => {
	if (originalProfile.value) {
		profile.value = originalProfile.value
	}
	tempAvatar.value = ''
	originalProfile.value = null
	isEditing.value = false
}

/** 切换编辑/查看模式 */
const toggleEdit = () => {
	if (isEditing.value) {
		cancelEdit()
	} else {
		enterEdit()
	}
}

/** 点击头像 */
const onAvatarClick = () => {
	if (!isEditing.value) return
	uni.showActionSheet({
		itemList: ['拍照', '从相册选择'],
		success: (res) => {
			const sourceType = res.tapIndex === 0 ? ['camera'] : ['album']
			chooseAvatarImage(sourceType)
		}
	})
}

/** 选择头像图片 */
const chooseAvatarImage = (sourceType) => {
	uni.chooseImage({
		count: 1,
		sourceType,
		success: (res) => {
			const tempPath = res.tempFilePaths[0]
			uni.getFileInfo({
				filePath: tempPath,
				success: (info) => {
					if (info.size > MAX_IMAGE_SIZE) {
						uni.showToast({ title: '图片不能超过3MB', icon: 'none' })
						return
					}
					tempAvatar.value = tempPath
				}
			})
		}
	})
}

/** 点击性别 */
const onGenderClick = () => {
	if (!isEditing.value) return
	uni.showActionSheet({
		itemList: ['男', '女', '保密'],
		success: (res) => {
			const genders = ['男', '女', '保密']
			profile.value.gender = genders[res.tapIndex]
		}
	})
}

/** 城市选择回调 */
const onCityChange = (e) => {
	const region = e.detail.value // [省, 市, 区]
	profile.value.province = region[0] || ''
	profile.value.city = region[1] || ''
}

/** 保存用户资料 */
const handleSave = async () => {
	// 校验昵称
	if (!profile.value.nickname || !profile.value.nickname.trim()) {
		uni.showToast({ title: '昵称不能为空', icon: 'none' })
		return
	}

	try {
		// 构造参数
		const data = {
			nickname: profile.value.nickname,
			surname: profile.value.surname,
			gender: profile.value.gender,
			intro: profile.value.intro,
			province: profile.value.province,
			city: profile.value.city,
			email: profile.value.email,
			country: ''
		}

		// 头像有变更时附加文件上传
		if (tempAvatar.value) {
			data.img = 1
			data.files = [{
				name: 'file',
				uri: tempAvatar.value
			}]
		}

		await userApi.editProfile(data)

		// 更新本地 store
		userStore.updateUserInfo(profile.value)

		uni.showToast({ title: '保存成功', icon: 'success' })

		// 退出编辑模式
		tempAvatar.value = ''
		originalProfile.value = null
		isEditing.value = false
	} catch (e) {
		uni.showToast({ title: '保存失败，请重试', icon: 'none' })
	}
}

/** 跳转登录页 */
const goLogin = () => {
	uni.navigateTo({ url: '/pages/login/index' })
}

/** 页面显示时加载数据 */
onShow(async () => {
	if (!userStore.isLoggedIn) {
		loading.value = false
		return
	}
	await loadProfile()
})
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: $bg-color;
	padding-bottom: env(safe-area-inset-bottom);
}

/* 右上角编辑/取消按钮 */
.edit-btn {
	position: fixed;
	top: calc(var(--status-bar-height, 0px) + 55px);
	right: $spacing-lg;
	z-index: 100;
	color: $primary-color;
	font-size: 28rpx;
	padding: 8rpx 24rpx;
}

/* 未登录空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 200rpx;

	&__action {
		margin-top: $spacing-lg;
		width: 400rpx;
	}

	&__btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background: linear-gradient(135deg, $primary-color, $primary-color-light);
		color: $uni-text-color-inverse;
		font-size: 28rpx;
		border-radius: $btn-radius;
		border: none;

		&::after {
			border: none;
		}
	}
}

/* 可滚动内容区 */
.profile-scroll {
	height: 100vh;
	padding: $spacing-md;
}

.profile-scroll--editing {
	padding-bottom: 140rpx;
}

/* ========== 头像卡片 ========== */
.avatar-card {
	background-color: $card-bg;
	border-radius: $card-radius;
	box-shadow: $shadow-light;
	padding: $spacing-xl $spacing-lg;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: $spacing-md;

	&__img-wrap {
		position: relative;
	}

	&__img {
		width: 128rpx;
		height: 128rpx;
		border-radius: $uni-border-radius-circle;
		background-color: $uni-bg-color-grey;

		&--default {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	&__camera {
		position: absolute;
		bottom: 0;
		right: -4rpx;
		width: 40rpx;
		height: 40rpx;
		background-color: $primary-color;
		border-radius: $uni-border-radius-circle;
		border: 4rpx solid $card-bg;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__name {
		font-size: 34rpx;
		font-weight: 600;
		color: $text-color;
		margin-top: $spacing-sm;
	}

	&__name-input {
		font-size: 34rpx;
		font-weight: 600;
		color: $text-color;
		text-align: center;
		border-bottom: 2rpx solid $primary-color;
		padding: 4rpx 0;
		width: 240rpx;
	}

	&__account {
		font-size: 24rpx;
		color: $text-color-weak;
		margin-top: $spacing-xs;
	}

	&__tags {
		display: flex;
		align-items: center;
		gap: $spacing-xs;
		margin-top: $spacing-sm;
	}

	&__type {
		font-size: 22rpx;
		color: $text-color-secondary;
		background-color: $uni-bg-color-grey;
		padding: 4rpx 16rpx;
		border-radius: $btn-radius;
	}

	&__vip {
		font-size: 22rpx;
		color: $uni-text-color-inverse;
		background: linear-gradient(135deg, $vip-color-start, $vip-color-end);
		padding: 4rpx 16rpx;
		border-radius: $btn-radius;
	}
}

/* ========== 信息卡片 ========== */
.info-card {
	background-color: $card-bg;
	border-radius: $card-radius;
	box-shadow: $shadow-light;
	overflow: hidden;
	margin-bottom: $spacing-md;

	&__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-md $spacing-lg;
		min-height: 100rpx;
		position: relative;

		&:not(:last-child)::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: $spacing-lg;
			right: 0;
			height: 1rpx;
			background-color: $border-color;
		}

		&--top {
			align-items: flex-start;
			padding-top: $spacing-lg;
		}
	}

	&__label {
		font-size: 28rpx;
		color: $text-color;
		flex-shrink: 0;
		width: 80rpx;
	}

	&__value {
		flex: 1;
		text-align: right;
		font-size: 28rpx;
		color: $text-color;
		margin-right: $spacing-xs;
		overflow: hidden;

		&--flex-end {
			display: flex;
			justify-content: flex-end;
		}

		&--placeholder {
			color: $uni-text-color-placeholder;
		}

		&--readonly {
			color: $text-color-weak;
		}

		&--highlight {
			color: $primary-color;
			font-weight: 500;
		}
	}

	&__input {
		font-size: 28rpx;
		color: $text-color;
		text-align: right;
		border: none;
		width: 100%;
		background: transparent;
	}

	&__textarea {
		font-size: 28rpx;
		color: $text-color;
		text-align: right;
		border: none;
		width: 100%;
		background: transparent;
		min-height: 40rpx;
		max-height: 200rpx;
	}

	&__text-ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 400rpx;
	}

	&__arrow {
		color: $uni-text-color-disable;
		font-size: 28rpx;
		flex-shrink: 0;
	}

	&__counter {
		text-align: right;
		padding: 0 $spacing-lg $spacing-sm;
		font-size: 22rpx;
		color: $text-color-weak;
	}
}

/* ========== 保存按钮 ========== */
.save-bar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: $spacing-md $spacing-lg;
	padding-bottom: calc(#{$spacing-md} + env(safe-area-inset-bottom));
	background-color: $card-bg;
	box-shadow: $shadow-light;
	z-index: 50;

	&__btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background: linear-gradient(135deg, $primary-color, $primary-color-light);
		color: $uni-text-color-inverse;
		font-size: 32rpx;
		font-weight: 500;
		border-radius: $btn-radius;
		border: none;

		&::after {
			border: none;
		}
	}
}
</style>
