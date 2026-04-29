/**
 * API 请求封装
 *
 * 三套接口前缀：
 * - /cpi/ — 业务接口（成功状态字段：status_code: 200）
 * - /bpi/ — 系统接口（成功状态字段：status: 200）
 * - /wpi/ — 数字人接口
 *
 * 特殊请求参数：
 * - _silent: true — 静默请求，不显示 Loading
 * - _no_disturb: true — 不打扰用户，不弹窗跳转
 */

import auth from '@/common/js/utils/auth.js'
import { REQUEST_TIMEOUT, MAX_RETRY_COUNT } from '@/common/js/constants.js'

// 请求队列（用于防止重复请求）
const pendingRequests = new Map() // 正在进行的请求集合

/**
 * 生成请求唯一 key
 * @param {string} method - 请求方法
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @returns {string} 唯一 key
 */
const generateRequestKey = (method, url, data) => {
	return `${method.toUpperCase()}:${url}:${JSON.stringify(data)}`
}

/**
 * 获取带 Token 的请求数据
 * @param {Object} data - 原始请求数据
 * @returns {Object} 带 Token 的数据
 */
const withToken = (data = {}) => {
	const token = auth.getToken()
	const result = { ...data }
	if (token) {
		result.token = token
	}
	return result
}

/**
 * 获取带分页默认值的数据
 * @param {Object} data - 原始数据
 * @returns {Object} 带分页默认值的数据
 */
const withPagination = (data = {}) => {
	return {
		kw: '',
		page: 1,
		size: 20,
		...data
	}
}

/**
 * 核心请求函数
 * @param {string} method - 请求方法 GET/POST/PUT/DELETE
 * @param {string} url - 完整请求地址（含前缀）
 * @param {Object} data - 请求数据
 * @param {string} successKey - 成功状态字段名 'status_code' 或 'status'
 * @param {boolean} isRetry - 是否为重试请求
 * @returns {Promise<Object>} 响应数据
 */
const request = (method, url, data = {}, successKey = 'status_code', isRetry = false) => {
	return new Promise((resolve, reject) => {
		const silent = data._silent // 是否静默请求
		const noDisturb = data._no_disturb // 是否不打扰用户

		// 清理内部参数，不发送到服务器
		const cleanData = { ...data }
		delete cleanData._silent
		delete cleanData._no_disturb

		// 防重复请求（非重试时检查）
		const requestKey = generateRequestKey(method, url, cleanData)
		if (!isRetry && pendingRequests.has(requestKey)) {
			return
		}
		pendingRequests.set(requestKey, true)

		// 显示 Loading
		if (!silent) {
			uni.showLoading({ title: '' })
		}

		uni.request({
			url,
			method,
			data: cleanData,
			header: {
				'app-name': 'huying',
				'Content-Type': 'application/json'
			},
			timeout: REQUEST_TIMEOUT,
			success: (res) => {
				if (!silent) {
					uni.hideLoading()
				}
				pendingRequests.delete(requestKey)

				const resInfo = res.data

				// 请求成功
				if (resInfo[successKey] === 200) {
					resolve(resInfo)
					return
				}

				// 404 / 403 错误
				if (resInfo.status === 404 || resInfo.status === 403) {
					uni.showToast({
						title: resInfo.msg || '请求失败',
						icon: 'none',
						duration: 3000
					})
					reject(resInfo.msg || '请求失败')
					return
				}

				// Token 过期或用户不存在 → 尝试自动刷新
				if (!isRetry && isAuthError(resInfo)) {
					handleAuthError(resInfo, { method, url, data, successKey, resolve, reject })
					return
				}

				// 登录态失效且重试失败 → 跳转登录
				if (isRetry && isAuthError(resInfo)) {
					if (!noDisturb) {
						auth.clearLoginState()
						uni.showToast({
							title: '登录已过期，请重新登录',
							icon: 'none'
						})
						setTimeout(() => {
							uni.reLaunch({ url: '/pages/login/index' })
						}, 1500)
					}
					reject(resInfo.msg || '登录已过期')
					return
				}

				// 业务错误
				const errorMsg = resInfo.msg || resInfo.message || '服务器错误'
				uni.showToast({
					title: errorMsg,
					icon: 'none'
				})
				reject(errorMsg)
			},
			fail: (err) => {
				if (!silent) {
					uni.hideLoading()
				}
				pendingRequests.delete(requestKey)

				// 网络错误
				uni.showToast({
					title: '网络异常，请检查网络连接',
					icon: 'none'
				})
				reject(err.errMsg || '网络异常')
			}
		})
	})
}

/**
 * 上传文件请求
 * @param {string} url - 完整请求地址
 * @param {Object} data - 请求数据（含 files 数组）
 * @param {string} successKey - 成功状态字段名
 * @returns {Promise<Object>} 响应数据
 */
const upload = (url, data = {}, successKey = 'status_code') => {
	return new Promise((resolve, reject) => {
		const silent = data._silent
		const files = data.files || []
		const cleanData = { ...data }
		delete cleanData._silent
		delete cleanData._no_disturb
		delete cleanData.files

		// 无文件时退化为普通 POST
		if (files.length === 0) {
			return request('POST', url, data, successKey).then(resolve).catch(reject)
		}

		if (!silent) {
			uni.showLoading({ title: '' })
		}

		uni.uploadFile({
			url,
			files,
			formData: cleanData,
			header: {
				'app-name': 'huying'
			},
			success: (res) => {
				if (!silent) {
					uni.hideLoading()
				}
				let resInfo = res.data
				if (typeof resInfo === 'string') {
					resInfo = JSON.parse(resInfo)
				}
				if (resInfo[successKey] === 200) {
					resolve(resInfo)
				} else {
					const errorMsg = resInfo.msg || resInfo.message || '上传失败'
					uni.showToast({ title: errorMsg, icon: 'none' })
					reject(errorMsg)
				}
			},
			fail: (err) => {
				if (!silent) {
					uni.hideLoading()
				}
				uni.showToast({ title: '上传失败', icon: 'none' })
				reject(err.errMsg || '上传失败')
			}
		})
	})
}

/**
 * 判断是否为鉴权错误
 * @param {Object} resInfo - 响应数据
 * @returns {boolean}
 */
const isAuthError = (resInfo) => {
	if (!resInfo.msg) return false
	return resInfo.msg.indexOf('用户不存在') > -1 ||
		resInfo.msg.indexOf('用户角色不存在') > -1 ||
		resInfo.msg.indexOf('token') > -1
}

/**
 * 处理鉴权错误：尝试用存储的凭证自动重新登录
 * @param {Object} resInfo - 响应数据
 * @param {Object} context - 请求上下文
 */
const handleAuthError = (resInfo, context) => {
	const credential = auth.getCredential()
	if (!credential) {
		// 无凭证 → 跳转登录
		if (!context.data._no_disturb) {
			auth.clearLoginState()
			uni.reLaunch({ url: '/pages/login/index' })
		}
		context.reject(resInfo.msg || '请先登录')
		return
	}

	// 尝试用凭证重新登录
	const loginUrl = credential.tel ? '/bpi/tel_login' : '/bpi/login'
	const loginData = credential.tel
		? withToken({ tel: credential.tel, code: credential.code })
		: { username: credential.username, password: credential.password }

	request('POST', loginUrl, { ...loginData, _silent: true }, 'status')
		.then(loginRes => {
			// 登录成功 → 更新 Token → 重试原请求
			auth.setToken(loginRes.token)
			const retryData = { ...context.data, token: loginRes.token }
			request(context.method, context.url, retryData, context.successKey, true)
				.then(context.resolve)
				.catch(context.reject)
		})
		.catch(() => {
			// 自动登录失败 → 跳转登录页
			if (!context.data._no_disturb) {
				auth.clearLoginState()
				uni.reLaunch({ url: '/pages/login/index' })
			}
			context.reject(resInfo.msg || '登录已过期')
		})
}

/**
 * 创建请求实例
 * @param {string} prefix - 接口前缀（/cpi/, /bpi/, /wpi/）
 * @param {string} successKey - 成功状态字段名
 * @returns {Object} 请求方法集合
 */
const createRequest = (prefix, successKey) => {
	return {
		/**
		 * GET 请求
		 * @param {string} url - 接口路径（不含前缀）
		 * @param {Object} params - 查询参数
		 * @returns {Promise}
		 */
		get: (url, params = {}) => request('GET', prefix + url, withToken(params), successKey),

		/**
		 * POST 请求
		 * @param {string} url - 接口路径
		 * @param {Object} data - 请求数据
		 * @returns {Promise}
		 */
		post: (url, data = {}) => request('POST', prefix + url, withToken(data), successKey),

		/**
		 * PUT 请求
		 * @param {string} url - 接口路径
		 * @param {Object} data - 请求数据
		 * @returns {Promise}
		 */
		put: (url, data = {}) => request('PUT', prefix + url, withToken(data), successKey),

		/**
		 * DELETE 请求
		 * @param {string} url - 接口路径
		 * @param {Object} data - 请求数据
		 * @returns {Promise}
		 */
		delete: (url, data = {}) => request('DELETE', prefix + url, withToken(data), successKey),

		/**
		 * 文件上传
		 * @param {string} url - 接口路径
		 * @param {Object} data - 请求数据（含 files 数组和 formData）
		 * @returns {Promise}
		 */
		upload: (url, data = {}) => upload(prefix + url, withToken(data), successKey),

		/**
		 * 带分页的 POST 请求
		 * @param {string} url - 接口路径
		 * @param {Object} data - 请求数据
		 * @returns {Promise}
		 */
		postPage: (url, data = {}) => request('POST', prefix + url, withToken(withPagination(data)), successKey)
	}
}

// 三套 API 实例
export const cpi = createRequest('/cpi/', 'status_code') // 业务接口
export const bpi = createRequest('/bpi/', 'status') // 系统接口
export const wpi = createRequest('/wpi/', 'status_code') // 数字人接口

// 工具函数导出
export { withToken, withPagination }
