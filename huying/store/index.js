/**
 * Pinia 状态管理入口
 */

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 使用 uni-app 存储适配器（兼容 H5、小程序、App 三端）
pinia.use(createPersistedState({
	storage: {
		getItem: (key) => {
			return uni.getStorageSync(key)
		},
		setItem: (key, value) => {
			uni.setStorageSync(key, value)
		},
		removeItem: (key) => {
			uni.removeStorageSync(key)
		}
	}
}))

export default pinia
