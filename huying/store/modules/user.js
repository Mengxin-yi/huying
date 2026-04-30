/**
 * 用户状态管理
 */

import { defineStore } from 'pinia'
import { userApi, commonApi } from '@/api/index.js'
import auth from '@/common/js/utils/auth.js'

// H5 端 API 基础路径为空（走代理），非 H5 端需要完整域名
// #ifdef H5
const IMG_BASE = ''
// #endif
// #ifndef H5
const IMG_BASE = 'https://ugoo.ugoolink.com'
// #endif

/**
 * 补全图片 URL，处理相对路径
 * @param {string} url - 原始图片路径
 * @returns {string} 可用的完整 URL
 */
const resolveImgUrl = (url) => {
	if (!url) return ''
	// 已经是完整 URL（http/https）或 data URI，直接返回
	if (/^(https?:|data:|\/\/)/.test(url)) return url
	// 相对路径补全域名
	return IMG_BASE + (url.startsWith('/') ? url : '/' + url)
}

export const useUserStore = defineStore('user', {
	state: () => ({
		token: '', // 用户登录凭证
		userInfo: null, // 用户基本信息
		vipInfo: null, // 用户会员信息
		isLoggedIn: false, // 登录状态
		permissions: [] // 用户权限列表
	}),

	getters: {
		/**
		 * 获取用户名
		 */
		username: (state) => state.userInfo?.username || '',

		/**
		 * 获取用户头像（自动补全相对路径）
		 */
		avatar: (state) => {
			const raw = state.userInfo?.avatar_img || state.userInfo?.avatar || ''
			return resolveImgUrl(raw)
		},

		/**
		 * 是否为 VIP 用户
		 */
		isVip: (state) => state.vipInfo?.user_role !== '普通用户',

		/**
		 * VIP 等级标签
		 */
		vipLabel: (state) => state.vipInfo?.current_vip_label || '普通用户'
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
			// 获取用户信息、会员信息和权限（失败不影响登录）
			try { await this.fetchProfile() } catch (e) { /* ignore */ }
			try { await this.fetchVipInfo() } catch (e) { /* ignore */ }
			try { await this.fetchPermissions() } catch (e) { /* ignore */ }
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
			// 获取用户信息、会员信息和权限（失败不影响登录）
			try { await this.fetchProfile() } catch (e) { /* ignore */ }
			try { await this.fetchVipInfo() } catch (e) { /* ignore */ }
			try { await this.fetchPermissions() } catch (e) { /* ignore */ }
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
			this.vipInfo = null
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
		 * 获取用户会员信息
		 */
		async fetchVipInfo() {
			const res = await commonApi.getUserVip()
			this.vipInfo = res.item || res
			return this.vipInfo
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
		paths: ['token', 'userInfo', 'vipInfo', 'isLoggedIn', 'permissions']
	}
})
