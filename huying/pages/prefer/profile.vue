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
}
</style>
