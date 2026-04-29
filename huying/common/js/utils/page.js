/**
 * 页面导航工具（多端兼容）
 */

import auth from './auth.js'

// 需要登录才能访问的页面路径
const PUBLIC_PAGES = [
	'pages/login/',
	'pages/weiguang/detail',
	'pages/weiguang/search',
]

/**
 * 显示 Toast 提示
 * @param {string} text - 提示文字
 * @returns {Promise<void>}
 */
const toast = (text) => {
	return new Promise((resolve) => {
		var message = typeof text === 'string' ? text : '请返回上一步'
		if (text instanceof Error) {
			console.log(text.stack)
			return
		} else if (typeof text === 'object') {
			message = JSON.stringify(text)
			console.log(message)
		}
		uni.showToast({
			title: message,
			icon: 'none'
		})
		setTimeout(() => {
			resolve()
		}, 1500)
	})
}

/**
 * 返回上一页
 */
const goBack = () => {
	uni.navigateBack({
		delta: 1
	})
}

/**
 * 跳转页面（自动判断 switchTab / navigateTo）
 * @param {string} path - 页面路径（不含 /pages/ 前缀）
 */
const gotoPage = (path) => {
	if (!checkAuth(path)) {
		return
	}
	const fullPath = '/pages/' + path
	// TabBar 页面使用 switchTab
	const tabPages = ['index/index', 'weiguang/index', 'subscribe/index', 'publish/index', 'prefer/index']
	const isTab = tabPages.some(tab => path === tab)
	if (isTab) {
		uni.switchTab({ url: fullPath })
	} else {
		uni.navigateTo({ url: fullPath })
	}
}

/**
 * 检查登录权限（未登录则跳转登录页）
 * @param {string} path - 目标页面路径
 * @returns {boolean} 是否通过权限检查
 */
const checkAuth = (path) => {
	const isPublic = PUBLIC_PAGES.some(page => path.indexOf(page) > -1)
	if (isPublic) {
		return true
	}
	if (!auth.isLoggedIn()) {
		uni.setStorageSync('redirectUrl', path)
		uni.reLaunch({
			url: '/pages/login/index'
		})
		return false
	}
	return true
}

/**
 * 登录成功后跳转到之前保存的页面或首页
 */
const goAfterLogin = () => {
	const redirectUrl = uni.getStorageSync('redirectUrl')
	uni.removeStorageSync('redirectUrl')
	if (redirectUrl) {
		gotoPage(redirectUrl)
	} else {
		uni.switchTab({
			url: '/pages/index/index'
		})
	}
}

/**
 * 清除页面缓存
 */
const cleanCache = () => {
	uni.removeStorageSync('profile')
}

export default {
	toast,
	goBack,
	gotoPage,
	checkAuth,
	goAfterLogin,
	cleanCache
}
