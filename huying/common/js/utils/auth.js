/**
 * Token 管理工具
 */

const TOKEN_KEY = 'huying_token' // Token 存储键名
const CREDENTIAL_KEY = 'huying_credential' // 登录凭证存储键名
const USERNAME_KEY = 'huying_username' // 用户名存储键名

/**
 * 获取 Token
 * @returns {string} Token 字符串
 */
const getToken = () => {
	return uni.getStorageSync(TOKEN_KEY) || ''
}

/**
 * 设置 Token
 * @param {string} token - JWT Token
 */
const setToken = (token) => {
	uni.setStorageSync(TOKEN_KEY, token)
}

/**
 * 移除 Token
 */
const removeToken = () => {
	uni.removeStorageSync(TOKEN_KEY)
}

/**
 * 获取登录凭证（用于自动重登录）
 * @returns {Object|null} 登录凭证
 */
const getCredential = () => {
	const cred = uni.getStorageSync(CREDENTIAL_KEY)
	return cred || null
}

/**
 * 设置登录凭证
 * @param {Object} credential - 登录凭证 { username, password } 或 { tel, code }
 */
const setCredential = (credential) => {
	uni.setStorageSync(CREDENTIAL_KEY, credential)
}

/**
 * 判断是否已登录
 * @returns {boolean} 是否已登录
 */
const isLoggedIn = () => {
	const token = getToken()
	const username = uni.getStorageSync(USERNAME_KEY)
	return !!token && !!username
}

/**
 * 设置用户名缓存
 * @param {string} username - 用户名
 */
const setUsername = (username) => {
	uni.setStorageSync(USERNAME_KEY, username)
}

/**
 * 获取用户名
 * @returns {string} 用户名
 */
const getUsername = () => {
	return uni.getStorageSync(USERNAME_KEY) || ''
}

/**
 * 清除所有登录相关状态
 */
const clearLoginState = () => {
	uni.removeStorageSync(TOKEN_KEY)
	uni.removeStorageSync(CREDENTIAL_KEY)
	uni.removeStorageSync(USERNAME_KEY)
	uni.removeStorageSync('profile')
	uni.removeStorageSync('permissions')
}

export default {
	getToken,
	setToken,
	removeToken,
	getCredential,
	setCredential,
	isLoggedIn,
	setUsername,
	getUsername,
	clearLoginState
}
