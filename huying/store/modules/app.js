/**
 * 全局应用状态
 */

import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
	state: () => ({
		systemInfo: null, // 系统信息
		navBarHeight: 0, // 导航栏高度
		appVersion: '1.0.0' // 应用版本号
	}),

	actions: {
		/**
		 * 初始化系统信息
		 */
		initSystemInfo() {
			try {
				this.systemInfo = uni.getSystemInfoSync()
			} catch (e) {
				console.log('获取系统信息失败', e)
			}
		},

		/**
		 * 设置导航栏高度
		 * @param {number} height - 高度值
		 */
		setNavBarHeight(height) {
			this.navBarHeight = height
		}
	}
})
