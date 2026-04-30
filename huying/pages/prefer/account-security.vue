<template>
	<view class="page">
		<!-- 账号信息 -->
		<view class="menu-card">
			<view class="menu-item">
				<text class="menu-item__text">用户名</text>
				<text class="menu-item__value">{{ userStore.username || '未设置' }}</text>
			</view>
			<view class="menu-item" @click="handleMobile">
				<text class="menu-item__text">手机号</text>
				<text class="menu-item__value">{{ mobileText }}</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
		</view>

		<!-- 安全设置 -->
		<view class="menu-card">
			<view class="menu-item" @click="handleChangePassword">
				<text class="menu-item__text">修改密码</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="gotoPage('/pages/prefer/wechat-bind')">
				<text class="menu-item__text">微信绑定</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
			<view class="menu-item" @click="handleUnbindWechat" v-if="wechatBound">
				<text class="menu-item__text menu-item__text--danger">解除微信绑定</text>
				<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
			</view>
		</view>

		<!-- 修改密码弹窗 -->
		<u-popup :show="showPasswordPopup" mode="center" round="16" @close="showPasswordPopup = false">
			<view class="password-popup">
				<text class="password-popup__title">修改密码</text>
				<view class="password-popup__field">
					<input class="password-popup__input" v-model="pwdForm.pw" placeholder="请输入旧密码" :password="!showOldPw" />
					<u-icon :name="showOldPw ? 'eye' : 'eye-off'" size="20" color="#999" @click="showOldPw = !showOldPw" />
				</view>
				<view class="password-popup__field">
					<input class="password-popup__input" v-model="pwdForm.new_pw" placeholder="请输入新密码" :password="!showNewPw" />
					<u-icon :name="showNewPw ? 'eye' : 'eye-off'" size="20" color="#999" @click="showNewPw = !showNewPw" />
				</view>
				<view class="password-popup__field">
					<input class="password-popup__input" v-model="pwdForm.confirm_password" placeholder="请确认新密码" :password="!showConfirmPw" />
					<u-icon :name="showConfirmPw ? 'eye' : 'eye-off'" size="20" color="#999" @click="showConfirmPw = !showConfirmPw" />
				</view>
				<view class="password-popup__btns">
					<view class="password-popup__btn password-popup__btn--cancel" @click="showPasswordPopup = false">取消</view>
					<view class="password-popup__btn password-popup__btn--confirm" @click="onSubmitPassword">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'
	import { useUserStore } from '@/store/modules/user.js'
	import { userApi } from '@/api/index.js'
	import commonUtils from '@/common/js/utils/common.js'
	import page from '@/common/js/utils/page.js'

	/** 用户状态 */
	const userStore = useUserStore()

	/** 绑定的手机号 */
	const mobile = ref('')

	/** 微信是否已绑定 */
	const wechatBound = ref(false)

	/** 修改密码弹窗显示状态 */
	const showPasswordPopup = ref(false)

	/** 密码明文显示开关 */
	const showOldPw = ref(false)
	const showNewPw = ref(false)
	const showConfirmPw = ref(false)

	/** 修改密码表单 */
	const pwdForm = ref({
		pw: '',
		new_pw: '',
		confirm_password: ''
	})

	/** 手机号脱敏显示 */
	const mobileText = computed(() => {
		return mobile.value ? commonUtils.desensitizePhoneNumber(mobile.value) : '未绑定'
	})

	/**
	 * 加载账号安全信息
	 */
	const loadSecurityInfo = async () => {
		try {
			// 获取绑定手机号
			const res = await userApi.getMobile()
			mobile.value = res.item?.tel || res.tel || ''
		} catch (e) {
			// 静默处理
		}
	}

	/**
	 * 点击手机号项
	 */
	const handleMobile = () => {
		uni.showToast({ title: '手机号管理功能开发中', icon: 'none' })
	}

	/**
	 * 打开修改密码弹窗
	 */
	const handleChangePassword = () => {
		pwdForm.value = { pw: '', new_pw: '', confirm_password: '' }
		showPasswordPopup.value = true
	}

	/**
	 * 提交修改密码
	 */
	const onSubmitPassword = async () => {
		const { pw, new_pw, confirm_password } = pwdForm.value

		// 表单校验
		if (!pw) {
			uni.showToast({ title: '请输入旧密码', icon: 'none' })
			return
		}
		if (!new_pw) {
			uni.showToast({ title: '请输入新密码', icon: 'none' })
			return
		}
		if (new_pw.length < 6) {
			uni.showToast({ title: '新密码至少6位', icon: 'none' })
			return
		}
		if (new_pw !== confirm_password) {
			uni.showToast({ title: '两次密码不一致', icon: 'none' })
			return
		}

		try {
			await userApi.changePassword({ pw, new_pw })
			uni.showToast({ title: '密码修改成功', icon: 'success' })
			showPasswordPopup.value = false
		} catch (e) {
			uni.showToast({ title: '密码修改失败', icon: 'none' })
		}
	}

	/**
	 * 跳转到指定页面
	 * @param {string} path - 页面路径
	 */
	const gotoPage = (path) => {
		page.gotoPage(path)
	}

	/**
	 * 解除微信绑定
	 */
	const handleUnbindWechat = () => {
		uni.showModal({
			title: '提示',
			content: '确定解除微信绑定吗？',
			success: async (res) => {
				if (res.confirm) {
					try {
						await userApi.unbindWechat()
						wechatBound.value = false
						uni.showToast({ title: '已解绑', icon: 'success' })
					} catch (e) {
						uni.showToast({ title: '解绑失败', icon: 'none' })
					}
				}
			}
		})
	}

	onMounted(() => {
		loadSecurityInfo()
	})
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-md;
	}

	/* 菜单卡片 */
	.menu-card {
		margin-bottom: $spacing-sm;
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

			&--danger {
				color: $danger-color;
			}
		}

		&__value {
			font-size: 24rpx;
			color: $text-color-weak;
			margin-right: $spacing-xs;
		}
	}

	/* 修改密码弹窗 */
	.password-popup {
		width: 600rpx;
		padding: $spacing-xl $spacing-lg $spacing-lg;

		&__title {
			display: block;
			text-align: center;
			font-size: 32rpx;
			font-weight: 600;
			color: $text-color;
			margin-bottom: $spacing-lg;
		}

		&__field {
			display: flex;
			align-items: center;
			margin-bottom: $spacing-sm;
			border: 1px solid $border-color;
			border-radius: $btn-radius;
			padding: 0 $spacing-md;
		}

		&__input {
			flex: 1;
			height: 80rpx;
			font-size: 28rpx;
			color: $text-color;
		}

		&__btns {
			display: flex;
			gap: $spacing-md;
			margin-top: $spacing-lg;
		}

		&__btn {
			flex: 1;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 28rpx;
			border-radius: $btn-radius;

			&--cancel {
				background-color: $uni-bg-color-grey;
				color: $text-color-secondary;
			}

			&--confirm {
				background-color: $primary-color;
				color: $uni-text-color-inverse;
			}
		}
	}
</style>
