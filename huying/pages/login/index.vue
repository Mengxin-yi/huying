<template>
	<view class="page" @touchmove.stop.prevent>
		<!-- 顶部 Logo 区域 -->
		<view class="header">
			<image class="logo" src="/static/logo.png" mode="aspectFit" />
			<text class="header__title">时代呼应</text>
			<text class="header__subtitle">连接你我，共享时光</text>
		</view>

		<!-- 登录表单卡片 -->
		<view class="card">
			<view class="form-item">
				<u-icon name="account" size="20" color="#999"></u-icon>
				<input
					class="form-item__input"
					v-model="formData.username"
					placeholder="请输入用户名/手机号"
					placeholder-class="input-placeholder"
				/>
			</view>
			<view class="form-item">
				<u-icon name="lock" size="20" color="#999"></u-icon>
				<input
					class="form-item__input"
					v-model="formData.password"
					:password="!showPassword"
					placeholder="请输入密码"
					placeholder-class="input-placeholder"
				/>
				<u-icon
					:name="showPassword ? 'eye-fill' : 'eye'"
					size="20"
					color="#999"
					@click="showPassword = !showPassword"
				></u-icon>
			</view>
			<view class="btn-primary" :class="{ 'btn-primary--loading': loading }" @click="handleLogin">
				<text class="btn-primary__text">{{ loading ? '登录中...' : '登录' }}</text>
			</view>
		</view>

		<!-- 底部链接 -->
		<view class="footer">
			<text class="footer__link" @click="goRegister">用户注册</text>
			<text class="footer__divider">|</text>
			<text class="footer__link" @click="goForgot">找回密码</text>
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
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user.js'

const userStore = useUserStore()

const formData = ref({
	username: '',
	password: ''
})
const showPassword = ref(false)
const loading = ref(false)
const showAgreement = ref(false)

const handleLogin = async () => {
	if (loading.value) return
	if (!formData.value.username) {
		return uni.showToast({ title: '请输入用户名/手机号', icon: 'none' })
	}
	if (!formData.value.password) {
		return uni.showToast({ title: '请输入密码', icon: 'none' })
	}

	loading.value = true
	try {
		await userStore.login(formData.value)
		uni.switchTab({ url: '/pages/index/index' })
	} catch (e) {
		// 错误由 request 层统一处理
	} finally {
		loading.value = false
	}
}

const goRegister = () => {
	uni.navigateTo({ url: '/pages/login/register' })
}

const goForgot = () => {
	uni.navigateTo({ url: '/pages/login/forgot' })
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
	margin-bottom: 80rpx;

	&__title {
		font-size: 48rpx;
		font-weight: bold;
		color: $text-color;
		margin-top: $spacing-lg;
	}

	&__subtitle {
		font-size: 28rpx;
		color: $text-color-weak;
		margin-top: $spacing-xs;
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
