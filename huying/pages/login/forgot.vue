<template>
	<view class="page" @touchmove.stop.prevent>
		<!-- 顶部 Logo 区域 -->
		<view class="header">
			<image class="logo" src="/static/logo.png" mode="aspectFit" />
			<text class="header__title">找回密码</text>
		</view>

		<!-- 找回密码表单卡片 -->
		<view class="card">
			<view class="form-item">
				<u-icon name="phone" size="20" color="#999"></u-icon>
				<input
					class="form-item__input"
					v-model="formData.tel"
					type="number"
					maxlength="11"
					placeholder="请输入手机号"
					placeholder-class="input-placeholder"
				/>
			</view>
			<view class="form-item">
				<u-icon name="chat" size="20" color="#999"></u-icon>
				<input
					class="form-item__input"
					v-model="formData.code"
					type="number"
					maxlength="6"
					placeholder="请输入验证码"
					placeholder-class="input-placeholder"
				/>
				<view
					class="form-item__code-btn"
					:class="{ 'form-item__code-btn--disabled': countdown > 0 }"
					@click="handleGetCode"
				>
					<text class="form-item__code-text">{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
				</view>
			</view>
			<view class="form-item">
				<u-icon name="lock" size="20" color="#999"></u-icon>
				<input
					class="form-item__input"
					v-model="formData.password"
					:password="!showPassword"
					placeholder="请输入新密码（6-20位）"
					placeholder-class="input-placeholder"
				/>
				<u-icon
					:name="showPassword ? 'eye-fill' : 'eye'"
					size="20"
					color="#999"
					@click="showPassword = !showPassword"
				></u-icon>
			</view>
			<view class="form-item">
				<u-icon name="lock" size="20" color="#999"></u-icon>
				<input
					class="form-item__input"
					v-model="formData.confirmPassword"
					:password="!showConfirmPassword"
					placeholder="请再次输入新密码"
					placeholder-class="input-placeholder"
				/>
				<u-icon
					:name="showConfirmPassword ? 'eye-fill' : 'eye'"
					size="20"
					color="#999"
					@click="showConfirmPassword = !showConfirmPassword"
				></u-icon>
			</view>

			<!-- 提交按钮 -->
			<view class="btn-primary" :class="{ 'btn-primary--loading': loading }" @click="handleReset">
				<text class="btn-primary__text">{{ loading ? '提交中...' : '确定' }}</text>
			</view>
		</view>

		<!-- 底部返回登录 -->
		<view class="footer" @click="goLogin">
			<text class="footer__link">返回登录</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { userApi } from '@/api/index.js'

const formData = ref({
	tel: '',
	code: '',
	password: '',
	confirmPassword: ''
})
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const countdown = ref(0)

let timer = null

onUnmounted(() => {
	if (timer) clearInterval(timer)
})

/** 获取验证码 */
const handleGetCode = async () => {
	if (countdown.value > 0) return
	if (!formData.value.tel) {
		return uni.showToast({ title: '请输入手机号', icon: 'none' })
	}
	if (!/^1\d{10}$/.test(formData.value.tel)) {
		return uni.showToast({ title: '手机号格式不正确', icon: 'none' })
	}

	try {
		await userApi.getSmsCode({ tel: formData.value.tel })
		startCountdown()
		uni.showToast({ title: '验证码已发送', icon: 'none' })
	} catch (e) {
		// 错误由 request 层处理
	}
}

/** 倒计时 */
const startCountdown = () => {
	countdown.value = 60
	timer = setInterval(() => {
		countdown.value--
		if (countdown.value <= 0) {
			clearInterval(timer)
			timer = null
		}
	}, 1000)
}

/** 提交重置密码 */
const handleReset = async () => {
	if (loading.value) return
	if (!formData.value.tel) {
		return uni.showToast({ title: '请输入手机号', icon: 'none' })
	}
	if (!formData.value.code) {
		return uni.showToast({ title: '请输入验证码', icon: 'none' })
	}
	if (!formData.value.password || formData.value.password.length < 6) {
		return uni.showToast({ title: '密码长度为6-20位', icon: 'none' })
	}
	if (formData.value.password !== formData.value.confirmPassword) {
		return uni.showToast({ title: '两次密码不一致', icon: 'none' })
	}

	loading.value = true
	try {
		await userApi.forgotPassword({
			tel: formData.value.tel,
			code: formData.value.code,
			pw: formData.value.password
		})
		uni.showToast({ title: '密码重置成功', icon: 'success' })
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	} catch (e) {
		// 错误由 request 层处理
	} finally {
		loading.value = false
	}
}

const goLogin = () => {
	uni.redirectTo({ url: '/pages/login/index' })
}
</script>

<style lang="scss" scoped>
.page {
	height: 100vh;
	overflow: hidden;
	background-color: $bg-color;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 60rpx;
}

/* Logo 区域 */
.header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 200rpx;
	margin-bottom: 48rpx;

	&__title {
		font-size: 40rpx;
		font-weight: bold;
		color: $text-color;
		margin-top: $spacing-lg;
	}
}

/* Logo 图片 */
.logo {
	width: 120rpx;
	height: 120rpx;
}

/* 表单卡片 */
.card {
	width: 100%;
	background-color: $card-bg;
	border-radius: $card-radius;
	padding: $spacing-lg;
	box-shadow: $shadow-light;
}

.form-item {
	display: flex;
	align-items: center;
	height: 88rpx;
	border: 1px solid $border-color;
	border-radius: $btn-radius;
	padding: 0 $spacing-md;
	margin-bottom: $spacing-md;

	&__input {
		flex: 1;
		height: 100%;
		margin-left: $spacing-sm;
		font-size: 28rpx;
		color: $text-color;
	}

	&__code-btn {
		background-color: #FFFFFF;
		border: 1px solid $primary-color;
		border-radius: 8rpx;
		padding: 8rpx 20rpx;
		margin-left: $spacing-sm;
		white-space: nowrap;

		&--disabled {
			border-color: $border-color;
		}
	}

	&__code-text {
		font-size: 24rpx;
		color: $primary-color;

		.form-item__code-btn--disabled & {
			color: $text-color-weak;
		}
	}
}

.input-placeholder {
	color: $text-color-weak;
	font-size: 28rpx;
}

/* 主按钮 */
.btn-primary {
	width: 100%;
	height: 96rpx;
	background-color: $primary-color;
	border-radius: $btn-radius;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: $spacing-sm;

	&__text {
		color: #FFFFFF;
		font-size: 32rpx;
		font-weight: bold;
	}

	&--loading {
		opacity: 0.6;
	}
}

/* 底部链接 */
.footer {
	margin-top: $spacing-lg;

	&__link {
		font-size: 28rpx;
		color: $primary-color;
	}
}
</style>
