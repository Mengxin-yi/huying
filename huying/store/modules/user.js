/**
 * 用户状态管理
 */

import { defineStore } from 'pinia'
import { userApi } from '@/api/index.js'
import auth from '@/common/js/utils/auth.js'

export const useUserStore = defineStore('user', {
	state: () => ({
		token: '', // 用户登录凭证
		userInfo: null, // 用户基本信息
		isLoggedIn: false, // 登录状态
		permissions: [] // 用户权限列表
	}),

	getters: {
		/**
		 * 获取用户名
		 */
		username: (state) => state.userInfo?.username || '',

		/**
		 * 获取用户头像
		 */
		avatar: (state) => state.userInfo?.avatar || '',

		/**
		 * 是否为 VIP 用户
		 */
		isVip: (state) => state.userInfo?.is_vip || false
	},

	actions: {
		/**
		 * 账号密码登录
		 * @param {Object} data - { username, password }
		 */
		async login(data) {
			const res = await userApi.login(data)
			this.token = res.token
			this.isLoggedIn = true
			auth.setToken(res.token)
			auth.setCredential(data)
			auth.setUsername(data.username)
			// 获取权限
			await this.fetchPermissions()
			return res
		},

		/**
		 * 手机验证码登录
		 * @param {Object} data - { tel, code }
		 */
		async loginByMobile(data) {
			const res = await userApi.loginByMobile(data)
			this.token = res.token
			this.isLoggedIn = true
			auth.setToken(res.token)
			auth.setCredential(data)
			auth.setUsername(data.tel)
			// 获取权限
			await this.fetchPermissions()
			return res
		},

		/**
		 * 退出登录
		 */
		async logout() {
			try {
				await userApi.logout()
			} catch (e) {
				// 忽略退出登录的接口错误
			}
			this.token = ''
			this.userInfo = null
			this.isLoggedIn = false
			this.permissions = []
			auth.clearLoginState()
		},

		/**
		 * 获取用户资料
		 */
		async fetchProfile() {
			const res = await userApi.getProfile()
			this.userInfo = res.item || res
			return this.userInfo
		},

		/**
		 * 获取用户权限
		 */
		async fetchPermissions() {
			try {
				const res = await userApi.getUserPermissions()
				this.permissions = res.items || []
			} catch (e) {
				this.permissions = []
			}
		},

		/**
		 * 更新用户信息（本地更新，不调接口）
		 * @param {Object} info - 用户信息片段
		 */
		updateUserInfo(info) {
			this.userInfo = { ...this.userInfo, ...info }
		},

		/**
		 * 从持久化存储恢复登录态
		 */
		restoreLoginState() {
			const token = auth.getToken()
			const username = auth.getUsername()
			if (token && username) {
				this.token = token
				this.isLoggedIn = true
			}
		}
	},

	// 持久化配置
	persist: {
		paths: ['token', 'userInfo', 'isLoggedIn', 'permissions']
	}
})
