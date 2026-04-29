/**
 * 订阅相关状态
 */

import { defineStore } from 'pinia'

export const useSubscribeStore = defineStore('subscribe', {
	state: () => ({
		subscribeList: [], // 订阅列表
		currentSubscribe: null // 当前查看的订阅
	}),

	actions: {
		/**
		 * 设置订阅列表
		 * @param {Array} list - 订阅列表数据
		 */
		setSubscribeList(list) {
			this.subscribeList = list
		},

		/**
		 * 设置当前订阅
		 * @param {Object} item - 订阅详情
		 */
		setCurrentSubscribe(item) {
			this.currentSubscribe = item
		},

		/**
		 * 清空订阅数据
		 */
		clearSubscribeData() {
			this.subscribeList = []
			this.currentSubscribe = null
		}
	}
})
