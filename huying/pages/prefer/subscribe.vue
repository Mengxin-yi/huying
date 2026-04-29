<template>
	<view class="page">
		<CalendarPicker ref="calendarRef" mode="week" :marks="marks" @select="onDateSelect" @mode-change="onModeChange"
			@month-change="onMonthChange" />
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import CalendarPicker from '@/components/CalendarPicker.vue'
	import {
		getPushNum
	} from '@/api/modules/subscribe.js'

	const calendarRef = ref(null)

	/** 日历标记点 */
	const marks = ref([])

	/** 当前选中日期（yyyy-MM-dd） */
	const selectedDate = ref('')

	/** 获取今天的日期字符串 */
	function getToday() {
		const now = new Date()
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
	}

	/** 获取当前月份字符串（yyyy-MM） */
	function getCurrentMonth() {
		const now = new Date()
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
	}

	/** 获取指定月份的推送数量，生成日历标记 */
	async function fetchPushNum(monthStr) {
		try {
			const res = await getPushNum({
				date: monthStr,
				_silent: true
			})
			const data = res.data || res.res || {}
			const [yearStr, monthPart] = monthStr.split('-')
			const year = parseInt(yearStr, 10)
			const month = parseInt(monthPart, 10)
			const newMarks = []

			// 遍历每一天，数量 > 0 的添加标记点
			Object.keys(data).forEach(dayKey => {
				const count = data[dayKey]
				if (count > 0) {
					const day = parseInt(dayKey, 10)
					const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
					newMarks.push({
						date: dateStr
					})
				}
			})

			marks.value = newMarks
		} catch (e) {
			console.error('获取推送数量失败:', e)
		}
	}

	/** 选中日期回调 */
	function onDateSelect({
		date
	}) {
		selectedDate.value = date
	}

	/** 日历模式切换回调 */
	function onModeChange({
		mode
	}) {
		console.log('模式切换:', mode)
	}

	/** 月份变化回调 */
	function onMonthChange({
		month
	}) {
		fetchPushNum(month)
	}

	// 页面初始化
	selectedDate.value = getToday()
	fetchPushNum(getCurrentMonth())
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-md;
	}
</style>
