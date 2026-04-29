<template>
	<view class="page" @touchmove.stop.prevent>
		<!-- 顶部 Logo 区域 -->
		<view class="header">
			<image class="logo" src="/static/logo.png" mode="aspectFit" />
			<text class="header__title">注册账号</text>
		</view>

		<!-- 用户类型选择 -->
		<view class="type-selector">
			<view class="type-selector__item" :class="{ 'type-selector__item--active': userType === 'personal' }"
				@click="userType = 'personal'">
				<view class="type-selector__radio"
					:class="{ 'type-selector__radio--checked': userType === 'personal' }">
					<u-icon v-if="userType === 'personal'" name="checkmark" size="12" color="#fff"></u-icon>
				</view>
				<text class="type-selector__text">个人用户</text>
			</view>
			<view class="type-selector__item" :class="{ 'type-selector__item--active': userType === 'company' }"
				@click="userType = 'company'">
				<view class="type-selector__radio" :class="{ 'type-selector__radio--checked': userType === 'company' }">
					<u-icon v-if="userType === 'company'" name="checkmark" size="12" color="#fff"></u-icon>
				</view>
				<text class="type-selector__text">单位用户</text>
			</view>
		</view>

		<!-- 注册表单卡片 -->
		<view class="card">
			<view class="form-item">
				<u-icon name="account" size="20" color="#999"></u-icon>
				<input class="form-item__input" v-model="formData.username" placeholder="请输入用户名"
					placeholder-class="input-placeholder" />
			</view>
			<view class="form-item">
				<u-icon name="lock" size="20" color="#999"></u-icon>
				<input class="form-item__input" v-model="formData.password" :password="!showPassword"
					placeholder="请输入密码（6-20位）" placeholder-class="input-placeholder" />
				<u-icon :name="showPassword ? 'eye-fill' : 'eye'" size="20" color="#999"
					@click="showPassword = !showPassword"></u-icon>
			</view>
			<view class="form-item">
				<u-icon name="lock" size="20" color="#999"></u-icon>
				<input class="form-item__input" v-model="formData.confirmPassword" :password="!showConfirmPassword"
					placeholder="请再次输入密码" placeholder-class="input-placeholder" />
				<u-icon :name="showConfirmPassword ? 'eye-fill' : 'eye'" size="20" color="#999"
					@click="showConfirmPassword = !showConfirmPassword"></u-icon>
			</view>
			<view class="form-item">
				<u-icon name="phone" size="20" color="#999"></u-icon>
				<input class="form-item__input" v-model="formData.tel" type="number" maxlength="11" placeholder="请输入手机号"
					placeholder-class="input-placeholder" />
			</view>
			<view class="form-item">
				<u-icon name="chat" size="20" color="#999"></u-icon>
				<input class="form-item__input" v-model="formData.code" type="number" maxlength="6" placeholder="请输入验证码"
					placeholder-class="input-placeholder" />
				<view class="form-item__code-btn" :class="{ 'form-item__code-btn--disabled': countdown > 0 }"
					@click="handleGetCode">
					<text class="form-item__code-text">{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}</text>
				</view>
			</view>
			<view>
				<!-- 注册按钮 -->
				<view class="btn-primary" :class="{ 'btn-primary--loading': loading }" @click="handleRegister">
					<text class="btn-primary__text">{{ loading ? '注册中...' : '注册' }}</text>
				</view>
			</view>

		</view>



		<!-- 底部链接 -->
		<view class="footer">
			<text class="footer__link" @click="goLogin">去登录</text>
			<text class="footer__divider">|</text>
			<text class="footer__link" @click="showAgreement = true">用户协议</text>
		</view>

		<!-- 用户协议弹窗 -->
		<u-popup :show="showAgreement" mode="bottom" round="16" closeable @close="showAgreement = false">
			<view class="agreement-popup">
				<text class="agreement-popup__title">用户协议</text>
				<scroll-view scroll-y class="agreement-popup__content">
					<text class="agreement-popup__text">
						欢迎使用"时代呼应"应用程序。请您在使用前仔细阅读以下用户协议。\n\n
						一、服务条款\n
						本应用提供的所有服务均基于现有技术和条件。我们将尽最大努力为您提供安全、稳定的服务。\n\n
						二、用户注册\n
						用户应提供真实、准确、完整的注册信息，并妥善保管账号和密码。因用户个人信息不真实而导致的问题，由用户自行承担。\n\n
						三、用户行为规范\n
						用户在使用本应用时，应遵守相关法律法规，不得利用本应用从事违法违规活动。\n\n
						四、隐私保护\n
						我们重视用户隐私保护，将按照隐私政策收集、使用和保护您的个人信息。\n\n
						五、免责声明\n
						因不可抗力、系统故障等原因导致服务中断，我们不承担由此造成的损失。
					</text>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		onUnmounted
	} from 'vue'
	import {
		userApi
	} from '@/api/index.js'

	const formData = ref({
		username: '',
		password: '',
		confirmPassword: '',
		tel: '',
		code: ''
	})
	const userType = ref('personal')
	const showPassword = ref(false)
	const showConfirmPassword = ref(false)
	const loading = ref(false)
	const countdown = ref(0)
	const showAgreement = ref(false)

	let timer = null

	onUnmounted(() => {
		if (timer) clearInterval(timer)
	})

	/** 获取验证码 */
	const handleGetCode = async () => {
		if (countdown.value > 0) return
		if (!formData.value.tel) {
			return uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
		}
		if (!/^1\d{10}$/.test(formData.value.tel)) {
			return uni.showToast({
				title: '手机号格式不正确',
				icon: 'none'
			})
		}

		try {
			await userApi.getRegisterCode({
				tel: formData.value.tel
			})
			startCountdown()
			uni.showToast({
				title: '验证码已发送',
				icon: 'none'
			})
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

	/** 注册 */
	const handleRegister = async () => {
		if (loading.value) return
		if (!formData.value.username) {
			return uni.showToast({
				title: '请输入用户名',
				icon: 'none'
			})
		}
		if (!formData.value.password || formData.value.password.length < 6) {
			return uni.showToast({
				title: '密码长度为6-20位',
				icon: 'none'
			})
		}
		if (formData.value.password !== formData.value.confirmPassword) {
			return uni.showToast({
				title: '两次密码不一致',
				icon: 'none'
			})
		}
		if (!formData.value.tel) {
			return uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
		}
		if (!formData.value.code) {
			return uni.showToast({
				title: '请输入验证码',
				icon: 'none'
			})
		}

		loading.value = true
		try {
			await userApi.register({
				username: formData.value.username,
				tel: formData.value.tel,
				code: formData.value.code,
				password: formData.value.password
			})
			uni.showToast({
				title: '注册成功',
				icon: 'success'
			})
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
		uni.redirectTo({
			url: '/pages/login/index'
		})
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
		margin-top: 160rpx;
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

	/* 用户类型选择 */
	.type-selector {
		display: flex;
		width: 100%;
		gap: $spacing-sm;
		margin-bottom: $spacing-lg;

		&__item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			height: 80rpx;
			background-color: $card-bg;
			border: 1px solid $border-color;
			border-radius: $btn-radius;

			&--active {
				background-color: #E6F0FF;
				border-color: $primary-color;
			}
		}

		&__radio {
			width: 32rpx;
			height: 32rpx;
			border-radius: 50%;
			border: 2px solid $border-color;
			margin-right: $spacing-sm;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			flex-shrink: 0;

			&--checked {
				background-color: $primary-color;
				border-color: $primary-color;
			}
		}

		&__text {
			font-size: 28rpx;
			color: $text-color;
		}
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
		display: flex;
		align-items: center;
		margin-top: $spacing-lg;

		&__link {
			font-size: 28rpx;
			color: $primary-color;
		}

		&__divider {
			color: $border-color;
			margin: 0 $spacing-sm;
			font-size: 28rpx;
		}
	}

	/* 用户协议弹窗 */
	.agreement-popup {
		padding: $spacing-lg;

		&__title {
			font-size: 32rpx;
			font-weight: bold;
			color: $text-color;
			text-align: center;
			display: block;
			margin-bottom: $spacing-md;
		}

		&__content {
			max-height: 600rpx;
		}

		&__text {
			font-size: 26rpx;
			color: $text-color-secondary;
			line-height: 1.8;
		}
	}
</style>