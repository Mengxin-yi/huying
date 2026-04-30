<template>
	<view class="page">
		<!-- 未登录提示 -->
		<view v-if="!userStore.isLoggedIn && !loading" class="empty-state">
			<PageEmpty text="请先登录后查看个人资料" mode="permission" />
			<view class="empty-state__action">
				<button class="empty-state__btn" @click="goLogin">去登录</button>
			</view>
		</view>

		<!-- 加载中 -->
		<PageLoading v-else-if="loading" />

		<!-- 主内容：表单列表 -->
		<scroll-view v-else scroll-y class="form-scroll" :class="{ 'form-scroll--editing': isEditing }">
			<view class="form-list">
				<!-- 头像 -->
				<view class="form-row" @click="onAvatarClick">
					<text class="form-row__label">头像</text>
					<view class="form-row__value form-row__value--avatar">
						<image v-if="displayAvatar" class="form-row__avatar" :src="displayAvatar" mode="aspectFill" />
						<view v-else class="form-row__avatar form-row__avatar--default">
							<u-icon name="account" size="14" color="#ccc"></u-icon>
						</view>
						<u-icon v-if="isEditing" name="camera" size="12" color="#fff" class="form-row__camera-icon"></u-icon>
						<u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
					</view>
				</view>

				<!-- 用户名（跳转修改） -->
				<view class="form-row" @click="gotoEditUsername">
					<text class="form-row__label">用户名</text>
					<view class="form-row__value">
						<text class="form-row__readonly">{{ profile.username || '' }}</text>
						<u-icon name="arrow-right" size="14" color="#ccc"></u-icon>
					</view>
				</view>

				<!-- 姓名 -->
				<view class="form-row">
					<text class="form-row__label">姓名</text>
					<view class="form-row__value">
						<template v-if="!isEditing">
							<text>{{ profile.surname || '未设置' }}</text>
						</template>
						<input v-else class="form-row__input" v-model="profile.surname" placeholder="请输入姓名/单位名称" />
					</view>
				</view>

				<!-- 简介 -->
				<view class="form-row form-row--top">
					<text class="form-row__label">简介</text>
					<view class="form-row__value form-row__value--flex-end">
						<template v-if="!isEditing">
							<text class="form-row__text-ellipsis">{{ profile.intro || '未设置' }}</text>
						</template>
						<textarea v-else class="form-row__textarea" v-model="profile.intro" placeholder="请输入简介"
							maxlength="200" :auto-height="true" />
					</view>
				</view>
				<view v-if="isEditing" class="form-row__counter">
					<text>{{ (profile.intro || '').length }}/200</text>
				</view>

				<!-- 省市 -->
				<view class="form-row" @click="onCityClick">
					<text class="form-row__label">省市</text>
					<view class="form-row__value">
						<template v-if="!isEditing">
							<text :class="{ 'form-row__placeholder': !cityLabel }">{{ cityLabel || '未设置' }}</text>
						</template>
						<template v-else>
							<picker mode="region" @change="onCityChange">
								<text :class="{ 'form-row__placeholder': !cityLabel }">{{ cityLabel || '请选择城市' }}</text>
							</picker>
						</template>
					</view>
				</view>

				<!-- 邮箱 -->
				<view class="form-row">
					<text class="form-row__label">邮箱</text>
					<view class="form-row__value">
						<template v-if="!isEditing">
							<text>{{ profile.email || '未设置' }}</text>
						</template>
						<input v-else class="form-row__input" v-model="profile.email" placeholder="请输入邮箱" />
					</view>
				</view>

				<!-- 主营范围（非个人用户显示） -->
				<view class="form-row" v-if="profile.user_type && profile.user_type !== '个人用户'">
					<text class="form-row__label">主营范围</text>
					<view class="form-row__value">
						<template v-if="!isEditing">
							<text>{{ profile.business_scope || '未设置' }}</text>
						</template>
						<input v-else class="form-row__input" v-model="profile.business_scope" placeholder="请输入主营范围" />
					</view>
				</view>

				<!-- 用户积分（只读） -->
				<view class="form-row">
					<text class="form-row__label">用户积分</text>
					<view class="form-row__value">
						<text class="form-row__highlight">{{ profile.user_score || '0' }}</text>
					</view>
				</view>

				<!-- 用户等级（只读） -->
				<view class="form-row">
					<text class="form-row__label">用户等级</text>
					<view class="form-row__value">
						<text class="form-row__readonly">{{ profile.user_level || userStore.vipLabel || '普通用户' }}</text>
					</view>
				</view>

				<!-- 认证状态（只读） -->
				<view class="form-row">
					<text class="form-row__label">认证状态</text>
					<view class="form-row__value">
						<text class="form-row__readonly">{{ authStatus }}</text>
					</view>
				</view>

				<!-- 注册时间（只读） -->
				<view class="form-row" v-if="profile.date_joined">
					<text class="form-row__label">注册时间</text>
					<view class="form-row__value">
						<text class="form-row__readonly">{{ profile.date_joined }}</text>
					</view>
				</view>

				<!-- 认证通过时间（有值时显示） -->
				<view class="form-row" v-if="profile.last_check_time">
					<text class="form-row__label">认证通过时间</text>
					<view class="form-row__value">
						<text class="form-row__readonly">{{ profile.last_check_time }}</text>
					</view>
				</view>
			</view>

			<!-- 操作按钮 -->
			<view class="form-actions">
				<button v-if="!isEditing" class="form-actions__btn form-actions__btn--edit" @click="enterEdit">编辑</button>
				<template v-else>
					<button class="form-actions__btn form-actions__btn--cancel" @click="cancelEdit">取消</button>
					<button class="form-actions__btn form-actions__btn--save" @click="handleSave">提交</button>
				</template>
			</view>
		</scroll-view>
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
const authStatus = ref('未认证')  // 认证状态

/** 显示用头像（编辑中用临时头像） */
const displayAvatar = computed(() => {
	return tempAvatar.value || profile.value.avatar_img || userStore.avatar || ''
})

/** 城市显示文本 */
const cityLabel = computed(() => {
	return (profile.value.province || '') + (profile.value.city || '') || ''
})

/** 加载用户资料 */
const loadProfile = async () => {
	try {
		loading.value = true
		// 并行加载资料和认证状态
		const [profileRes] = await Promise.all([
			userApi.getProfile(),
			loadAuthStatus()
		])
		profile.value = profileRes.item || profileRes || {}
	} catch (e) {
		uni.showToast({ title: '加载失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

/** 加载认证状态 */
const loadAuthStatus = async () => {
	try {
		const res = await userApi.getAuthDetail({ _silent: true, _no_disturb: true })
		if (res.item && res.item.check_stat) {
			authStatus.value = res.item.check_stat
		}
	} catch (e) {
		// 静默处理，认证状态不影响主流程
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

/** 点击城市行 */
const onCityClick = () => {
	// 非编辑模式下不触发 picker
	if (!isEditing.value) return
}

/** 城市选择回调 */
const onCityChange = (e) => {
	const region = e.detail.value // [省, 市, 区]
	profile.value.province = region[0] || ''
	profile.value.city = region[1] || ''
}

/** 保存用户资料 */
const handleSave = async () => {
	// 校验姓名
	if (!profile.value.surname || !profile.value.surname.trim()) {
		uni.showToast({ title: '姓名不能为空', icon: 'none' })
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
			business_scope: profile.value.business_scope,
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

/** 跳转修改用户名页 */
const gotoEditUsername = () => {
	uni.navigateTo({ url: '/pages/prefer/edit-username' })
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
.form-scroll {
	height: 100vh;
	padding: 10rpx 0;
}

.form-scroll--editing {
	padding-bottom: 140rpx;
}

/* ========== 表单列表 ========== */
.form-list {
	padding: 0;
}

/* 表单行 */
.form-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 18rpx 24rpx;
	background-color: $card-bg;
	min-height: 80rpx;
	position: relative;

	/* 行间分隔线 */
	&:not(:last-child)::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 24rpx;
		right: 0;
		height: 1rpx;
		background-color: $border-color;
	}

	/* 简介等多行内容顶部对齐 */
	&--top {
		align-items: flex-start;
	}

	/* 左侧标签 */
	&__label {
		font-size: 26rpx;
		color: $text-color;
		flex-shrink: 0;
		width: 150rpx;
	}

	/* 右侧值区域 */
	&__value {
		flex: 1;
		text-align: right;
		font-size: 26rpx;
		color: $text-color;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		overflow: hidden;

		&--avatar {
			gap: 8rpx;
		}

		&--flex-end {
			align-items: flex-start;
			justify-content: flex-end;
		}
	}

	/* 头像缩略图 */
	&__avatar {
		width: 50rpx;
		height: 50rpx;
		border-radius: $uni-border-radius-circle;
		background-color: $uni-bg-color-grey;
		flex-shrink: 0;

		&--default {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	/* 编辑模式下的相机图标 */
	&__camera-icon {
		background-color: $primary-color;
		width: 28rpx;
		height: 28rpx;
		border-radius: $uni-border-radius-circle;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 只读文本 */
	&__readonly {
		color: $text-color-weak;
	}

	/* 高亮文本 */
	&__highlight {
		color: $primary-color;
		font-weight: 500;
	}

	/* 占位符文本 */
	&__placeholder {
		color: $uni-text-color-placeholder;
	}

	/* 输入框 */
	&__input {
		font-size: 26rpx;
		color: $text-color;
		text-align: right;
		border: none;
		width: 100%;
		background: transparent;
	}

	/* 多行文本输入 */
	&__textarea {
		font-size: 26rpx;
		color: $text-color;
		text-align: right;
		border: none;
		width: 100%;
		background: transparent;
		min-height: 40rpx;
		max-height: 200rpx;
	}

	/* 文本截断 */
	&__text-ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 400rpx;
	}

	/* 字数统计 */
	&__counter {
		text-align: right;
		padding: 0 24rpx 10rpx;
		background-color: $card-bg;
		font-size: 22rpx;
		color: $text-color-weak;
	}
}

/* ========== 操作按钮 ========== */
.form-actions {
	padding: $spacing-md 24rpx;
	display: flex;
	gap: $spacing-sm;

	&__btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 30rpx;
		font-weight: 500;
		border-radius: $btn-radius;
		border: none;

		&::after {
			border: none;
		}

		/* 编辑按钮 */
		&--edit {
			background: linear-gradient(135deg, $primary-color, $primary-color-light);
			color: $uni-text-color-inverse;
		}

		/* 取消按钮 */
		&--cancel {
			background-color: $uni-bg-color-grey;
			color: $text-color-weak;
		}

		/* 提交按钮 */
		&--save {
			background: linear-gradient(135deg, $primary-color, $primary-color-light);
			color: $uni-text-color-inverse;
		}
	}
}
</style>
