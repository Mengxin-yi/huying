<template>
	<view class="page"></view>
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
		uni.showLoading({ title: '保存中...' })

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

		uni.hideLoading()
		uni.showToast({ title: '保存成功', icon: 'success' })

		// 退出编辑模式
		tempAvatar.value = ''
		originalProfile.value = null
		isEditing.value = false

		// 刷新数据
		await loadProfile()
	} catch (e) {
		uni.hideLoading()
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
