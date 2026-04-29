/**
 * Pinia 状态管理入口
 */

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// #ifdef H5
// H5 端直接用 localStorage，避免与 uni.setStorageSync 双重序列化
const storage = localStorage
// #endif
// #ifndef H5
// 非 H5 端用 uni.storage 适配器
const storage = {
	getItem: (key) => {
		const val = uni.getStorageSync(key)
		return val || null
	},
	setItem: (key, value) => {
		uni.setStorageSync(key, value)
	},
	removeItem: (key) => {
		uni.removeStorageSync(key)
	}
}
// #endif

pinia.use(createPersistedState({ storage }))

export default pinia
