<template>
	<view class="page">
		<!-- 当前用户名 -->
		<view class="current-info">
			<text class="current-info__label">当前用户名</text>
			<text class="current-info__value">{{ userStore.username || '未设置' }}</text>
		</view>

		<!-- 表单 -->
		<view class="form-card">
			<!-- 新用户名 -->
			<view class="form-row">
				<text class="form-row__label">新用户名</text>
				<view class="form-row__field">
					<input class="form-row__input" v-model="formData.username" placeholder="请输入新用户名"
						@input="onUsernameInput" />
					<view v-if="formData.username" class="form-row__clear" @click="formData.username = ''">
						<u-icon name="close-circle-fill" size="16" color="#ccc"></u-icon>
					</view>
				</view>
			</view>

			<!-- 验证码 -->
			<view class="form-row">
				<text class="form-row__label">验证码</text>
				<view class="form-row__field">
					<input class="form-row__input form-row__input--code" v-model="formData.code" type="number"
						placeholder="请输入验证码" maxlength="6" />
					<view class="form-row__code-btn" :class="{ 'form-row__code-btn--disabled': countdown > 0 || !canGetCode }"
						@click="getCode">
						<text>{{ countdown > 0 ? countdown + 's' : '获取验证码' }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-bar">
			<button class="submit-bar__btn" :class="{ 'submit-bar__btn--disabled': !canSubmit }" @click="handleSubmit">提交</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { userApi } from '@/api/index.js'
import { useUserStore } from '@/store/modules/user.js'

const userStore = useUserStore()

/** 表单数据 */
const formData = ref({
	username: '',
	code: ''
})

/** 验证码倒计时（秒） */
const countdown = ref(0)

/** 定时器引用 */
let timer = null

/** 提交中状态 */
const submitting = ref(false)

/** 是否可以获取验证码 */
const canGetCode = computed(() => {
	return formData.value.username.trim().length > 0
})

/** 是否可以提交 */
const canSubmit = computed(() => {
	return formData.value.username.trim().length > 0 && formData.value.code.length > 0 && !submitting.value
})

/** 用户名输入时校验是否可用 */
const onUsernameInput = () => {
	// 可扩展：实时校验用户名格式或是否已被占用
}

/** 获取验证码 */
const getCode = async () => {
	if (!canGetCode.value || countdown.value > 0) return

	try {
		await userApi.getUserCode({})
		uni.showToast({ title: '验证码已发送', icon: 'none' })
		countdown.value = 59
		timer = setInterval(() => {
			countdown.value--
			if (countdown.value <= 0) {
				clearInterval(timer)
				timer = null
			}
		}, 1000)
	} catch (e) {
		uni.showToast({ title: '发送失败，请重试', icon: 'none' })
	}
}

/** 提交修改用户名 */
const handleSubmit = async () => {
	if (!canSubmit.value) return

	if (!formData.value.username.trim()) {
		uni.showToast({ title: '请输入新用户名', icon: 'none' })
		return
	}
	if (!formData.value.code) {
		uni.showToast({ title: '请输入验证码', icon: 'none' })
		return
	}

	submitting.value = true
	try {
		const res = await userApi.editUsername({
			username: formData.value.username,
			code: formData.value.code
		})
		// 更新 token
		if (res.token) {
			uni.setStorageSync('token', res.token)
		}
		// 更新 store
		userStore.updateUserInfo({ username: formData.value.username })

		uni.showToast({
			title: '修改成功',
			icon: 'success',
			success() {
				uni.navigateBack()
			}
		})
	} catch (e) {
		uni.showToast({ title: '修改失败，请重试', icon: 'none' })
	} finally {
		submitting.value = false
	}
}

/** 页面卸载时清除定时器 */
onUnmounted(() => {
	if (timer) {
		clearInterval(timer)
	}
})
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: $bg-color;
}

/* 当前用户名提示 */
.current-info {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 20rpx 24rpx;
	margin: $spacing-md $spacing-md 0;
	background-color: $card-bg;
	border-radius: $card-radius;

	&__label {
		font-size: 26rpx;
		color: $text-color-weak;
	}

	&__value {
		font-size: 26rpx;
		color: $text-color;
	}
}

/* 表单卡片 */
.form-card {
	margin: $spacing-sm $spacing-md 0;
	background-color: $card-bg;
	border-radius: $card-radius;
	overflow: hidden;
}

.form-row {
	display: flex;
	align-items: center;
	padding: 18rpx 24rpx;
	min-height: 80rpx;
	position: relative;

	&:not(:last-child)::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 24rpx;
		right: 0;
		height: 1rpx;
		background-color: $border-color;
	}

	&__label {
		font-size: 26rpx;
		color: $text-color;
		flex-shrink: 0;
		width: 140rpx;
	}

	&__field {
		flex: 1;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	&__input {
		flex: 1;
		font-size: 26rpx;
		color: $text-color;

		&--code {
			// 验证码输入框不需要额外样式，保持统一
		}
	}

	/* 清除按钮 */
	&__clear {
		flex-shrink: 0;
		margin-left: 8rpx;
	}

	/* 获取验证码按钮 */
	&__code-btn {
		flex-shrink: 0;
		font-size: 24rpx;
		color: $primary-color;
		padding: 8rpx 16rpx;
		border: 1rpx solid $primary-color;
		border-radius: $btn-radius;
		margin-left: 12rpx;
		white-space: nowrap;

		&--disabled {
			color: $text-color-weak;
			border-color: $border-color;
		}
	}
}

/* 提交按钮 */
.submit-bar {
	padding: $spacing-lg $spacing-md;

	&__btn {
		width: 100%;
		height: 80rpx;
		line-height: 80rpx;
		background-color: $primary-color;
		color: $uni-text-color-inverse;
		font-size: 30rpx;
		font-weight: 500;
		border-radius: $btn-radius;
		border: none;

		&::after {
			border: none;
		}

		&--disabled {
			opacity: 0.5;
		}
	}
}
</style>
