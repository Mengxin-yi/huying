<template>
	<view class="page">
		<CalendarPicker ref="calendarRef" mode="week" :marks="marks" @select="onDateSelect" @mode-change="onModeChange"
			@month-change="onMonthChange" />

		<!-- 日期摘要 -->
		<view class="summary">
			<view class="summary__header">
				<view class="summary__date">{{ dateLabel }}</view>
				<view v-if="!isToday" class="summary__today" @click="goToToday">回到今天</view>
			</view>
			<text class="summary__text">{{ taskLabel }}</text>
		</view>

		<!-- 加载动画 -->
		<view v-if="loading" class="task-loading">
			<u-loading-icon mode="circle" size="48"></u-loading-icon>
			<text class="task-loading__text">加载中...</text>
		</view>

		<!-- 事程列表 -->
		<view v-else-if="taskList.length" class="task-list">
			<uni-swipe-action v-for="item in taskList" :key="item.id">
				<uni-swipe-action-item :left-options="optionLeft" :right-options="getOptionRight(item)"
					:auto-close="true" style="margin-top: 16rpx;" @click="onSwipeClick($event, item)">
					<view class="task-card" @click="onCardClick(item)">
						<!-- 状态标签（左上角） -->
						<text
							:class="['task-card__status', `task-card__status--${getStatusType(item)}`]">{{ getStatusText(item) }}</text>
						<!-- 左侧时间 -->
						<view class="task-card__time">
							{{ formatTime(item.remind_time) }}
						</view>
						<!-- 右侧内容 -->
						<view class="task-card__body">
							<text class="task-card__title">{{ item.title }}</text>
							<text v-if="item.content" class="task-card__content">{{ item.content }}</text>
							<view class="task-card__tags">
								<view class="task-card__tag">
									<text class="task-card__tag-label">紧急</text>
									<text class="task-card__tag-num">{{ getUrgency(item) }}</text>
								</view>
								<view class="task-card__tag">
									<text class="task-card__tag-label">重要</text>
									<text class="task-card__tag-num">{{ getImportance(item) }}</text>
								</view>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>

		<!-- 暂无事程 -->
		<view v-else class="task-empty">
			<image class="task-empty__img" src="/static/image/empty.png" mode="aspectFit" />
			<text class="task-empty__text">暂无事程</text>
		</view>

		<!-- 新增事程按钮 -->
		<view class="fab" @click="goToAdd">
			<text class="fab__icon">+</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {
		onPullDownRefresh,
		onShow
	} from '@dcloudio/uni-app'
	import CalendarPicker from '@/components/CalendarPicker.vue'
	import {
		getNoteCalendar,
		getNoteList,
		deleteNote,
		editNoteStatus,
		addNote,
		editNote
	} from '@/api/modules/task.js'

	const calendarRef = ref(null)
	const marks = ref([])
	const loading = ref(false)

	/** 当前选中日期（yyyy-MM-dd） */
	const selectedDate = ref('')

	/** 当月每天事件数量 */
	const dayCounts = ref([])

	/** 事程列表 */
	const taskList = ref([])

	/** 选中日期的事件数量 */
	const selectedCount = computed(() => {
		if (!selectedDate.value) return 0
		const day = parseInt(selectedDate.value.split('-')[2], 10)
		return dayCounts.value[day - 1] || 0
	})

	/** 星期映射 */
	const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

	/** 日期标签，如 "4月20日周一" */
	const dateLabel = computed(() => {
		if (!selectedDate.value) return ''
		const d = new Date(selectedDate.value)
		const month = d.getMonth() + 1
		const day = d.getDate()
		const weekDay = WEEK_DAYS[d.getDay()]
		return `${month}月${day}日${weekDay}`
	})

	/** 是否为今天 */
	const isToday = computed(() => selectedDate.value === getToday())

	/** 任务标签，如 "3个事程" */
	const taskLabel = computed(() => {
		const count = selectedCount.value
		if (count === 0) return '暂无事程'
		return `${count}个事程`
	})

	/** 格式化提醒时间为 HH:mm */
	function formatTime(remindTime) {
		if (!remindTime) return ''
		return remindTime.split(' ')[1].slice(0, 5)
	}

	/** 获取紧急程度（weight 第一位数字） */
	function getUrgency(item) {
		const w = item.weight
		if (!w) return 0
		return parseInt(w.toString()[0], 10)
	}

	/** 获取重要程度（weight 第二位数字） */
	function getImportance(item) {
		const w = item.weight
		if (!w) return 0
		return parseInt(w.toString()[1], 10)
	}

	/** 获取任务状态文本 */
	function getStatusText(item) {
		if (item.is_finished === 1) return '已完成'
		return item.is_overdue === 1 ? '已过期' : '计划中'
	}

	/** 获取任务状态样式类型 */
	function getStatusType(item) {
		if (item.is_finished === 1) return 'done'
		return item.is_overdue === 1 ? 'overdue' : 'plan'
	}

	/** 左滑按钮（顺延） */
	const optionLeft = [{
		text: '顺延',
		style: {
			backgroundColor: '#007aff'
		}
	}]

	/** 右滑按钮（根据状态显示删除+完成/撤销） */
	function getOptionRight(item) {
		if (item.is_finished === 1) {
			return [{
					text: '删除',
					style: {
						backgroundColor: '#F56C6C'
					}
				},
				{
					text: '撤销',
					style: {
						backgroundColor: '#007aff'
					}
				}
			]
		}
		return [{
				text: '删除',
				style: {
					backgroundColor: '#F56C6C'
				}
			},
			{
				text: '完成',
				style: {
					backgroundColor: '#67c23a'
				}
			}
		]
	}

	/** 滑动按钮点击 */
	function onSwipeClick(e, item) {
		const action = e.content.text
		if (action === '删除') {
			uni.showModal({
				content: '是否删除本条事程？',
				success: async (res) => {
					if (res.confirm) {
						try {
							await deleteNote({
								pk: item.id
							})
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							refreshCurrentData()
						} catch (err) {
							uni.showToast({
								title: String(err),
								icon: 'none'
							})
						}
					}
				}
			})
		} else if (action === '完成') {
			handleComplete(item)
		} else if (action === '撤销') {
			handleUndo(item)
		} else if (action === '顺延') {
			handlePostpone(item)
		}
	}

	/** 完成事程 */
	async function handleComplete(item) {
		try {
			await editNoteStatus({
				pk: item.id,
				is_finished: 1
			})
			uni.showToast({
				title: '操作成功',
				icon: 'success'
			})
			refreshCurrentData()
		} catch (err) {
			uni.showToast({
				title: String(err),
				icon: 'none'
			})
		}
	}

	/** 撤销完成 */
	async function handleUndo(item) {
		try {
			await editNoteStatus({
				pk: item.id,
				is_finished: 0
			})
			uni.showToast({
				title: '操作成功',
				icon: 'success'
			})
			refreshCurrentData()
		} catch (err) {
			uni.showToast({
				title: String(err),
				icon: 'none'
			})
		}
	}

	/** 顺延到下一天 */
	async function handlePostpone(item) {
		const time = new Date(item.remind_time)
		time.setDate(time.getDate() + 1)
		const newTime =
			`${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()).padStart(2, '0')} ${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:00`
		try {
			await editNote({
				pk: item.id,
				title: item.title,
				content: item.content,
				remind_time: newTime,
				weight: item.weight,
				data_type: item.data_type,
				data_id: item.data_id,
				news_set: item.news_set
			})
			uni.showToast({
				title: '成功顺延到下一天',
				icon: 'success'
			})
			refreshCurrentData()
		} catch (err) {
			uni.showToast({
				title: String(err),
				icon: 'none'
			})
		}
	}

	/** 点击事程卡片，跳转详情页 */
	function onCardClick(item) {
		uni.navigateTo({
			url: `/pages/index/detail?id=${item.id}`
		})
	}

	/** 刷新当前数据 */
	function refreshCurrentData() {
		fetchMonthNotes(getCurrentMonth())
		fetchDateNotes(selectedDate.value || getToday())
	}

	/** 获取指定月份的日历标记数据 */
	async function fetchMonthNotes(monthStr) {
		try {
			const res = await getNoteCalendar({
				time: monthStr,
				_silent: true
			})
			const counts = res.res || []
			dayCounts.value = counts

			const [yearStr, monthPart] = monthStr.split('-')
			const year = parseInt(yearStr, 10)
			const month = parseInt(monthPart, 10)
			const newMarks = []

			counts.forEach((count, index) => {
				if (count > 0) {
					const day = index + 1
					const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
					newMarks.push({
						date: dateStr
					})
				}
			})

			marks.value = newMarks
		} catch (e) {
			console.error('获取月度事件数据失败:', e)
		}
	}

	/** 获取选中日期的事程列表 */
	async function fetchDateNotes(date) {
		loading.value = true
		try {
			const res = await getNoteList({
				remind_time: date,
				is_finished: 2,
				order_type: '',
				_silent: true
			})
			taskList.value = res.items || []
		} catch (e) {
			console.error('获取事程列表失败:', e)
			taskList.value = []
		} finally {
			loading.value = false
		}
	}

	/** 页面原生下拉刷新 */
	onPullDownRefresh(async () => {
		await Promise.all([
			fetchMonthNotes(getCurrentMonth()),
			fetchDateNotes(selectedDate.value || getToday())
		])
		uni.stopPullDownRefresh()
	})

	/** 获取当前月份字符串（yyyy-MM） */
	function getCurrentMonth() {
		const now = new Date()
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
	}

	/** 获取今天的日期字符串 */
	function getToday() {
		const now = new Date()
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
	}

	/** 选中日期回调 */
	function onDateSelect({
		date
	}) {
		selectedDate.value = date
		fetchDateNotes(date)
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
		fetchMonthNotes(month)
	}

	/** 回到今天 */
	function goToToday() {
		const today = getToday()
		selectedDate.value = today
		calendarRef.value?.goToToday()
		fetchDateNotes(today)
	}

	/** 跳转到新增事程页面 */
	function goToAdd() {
		uni.navigateTo({
			url: `/pages/index/add?date=${selectedDate.value || getToday()}`
		})
	}

	// 页面加载时初始化
	selectedDate.value = getToday()
	fetchMonthNotes(getCurrentMonth())
	fetchDateNotes(getToday())

	/** 每次页面显示时刷新数据 */
	onShow(() => {
		fetchMonthNotes(getCurrentMonth())
		fetchDateNotes(selectedDate.value || getToday())
	})
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-md;
	}

	.summary {
		margin-top: $spacing-sm;
		padding: $spacing-md;
		background-color: #fff;
		border-radius: $uni-border-radius-lg;

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: $spacing-xs;
		}

		&__date {
			font-size: 30rpx;
			font-weight: bold;
			color: $uni-text-color;
		}

		&__today {
			font-size: 24rpx;
			color: $primary-color;
		}

		&__text {
			font-size: 28rpx;
			color: $uni-text-color-grey;
		}
	}

	.task-list {
		margin-top: $spacing-sm;

		uni-swipe-action {
			margin-bottom: $spacing-sm;
		}
	}

	/* 加载动画 */
	.task-loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 100rpx 0;

		&__text {
			margin-top: $spacing-sm;
			font-size: 26rpx;
			color: $uni-text-color-grey;
		}
	}

	/* 暂无事程 */
	.task-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 100rpx 0;

		&__img {
			width: 300rpx;
			height: 300rpx;
		}

		&__text {
			margin-top: $spacing-md;
			font-size: 28rpx;
			color: $uni-text-color-grey;
		}
	}

	.task-card {
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		padding: $spacing-md;
		background-color: #fff;
		border-radius: $uni-border-radius-lg;

		&__time {
			min-width: 150rpx;
			font-size: 60rpx;
			font-weight: bold;
			color: $primary-color;
			line-height: 60rpx;
		}

		&__body {
			flex: 1;
			margin-left: $spacing-md;
			display: flex;
			flex-direction: column;
			justify-content: center;
			min-height: 150rpx;
		}

		&__title {
			font-size: 30rpx;
			color: $uni-text-color;
			font-weight: 500;
		}

		&__content {
			font-size: 26rpx;
			color: $uni-text-color-grey;
		}

		&__tags {
			display: flex;
			gap: $spacing-md;
			justify-content: flex-end;
			margin-top: auto;
		}

		&__tag {
			display: flex;
			align-items: baseline;
			gap: 4rpx;
		}

		&__tag-label {
			font-size: 22rpx;
			color: $uni-text-color;
		}

		&__tag-num {
			font-size: 50rpx;
			color: $primary-color;
			font-weight: bold;
			padding: 0 5rpx;
		}

		&__status {
			position: absolute;
			left: -115rpx;
			top: -25rpx;
			overflow: hidden;
			white-space: nowrap;
			transform: rotate(-47deg);
			opacity: 0.95;
			font-size: 22rpx;
			color: #fff;
			padding: 40rpx 100rpx 4rpx 90rpx;

			&--plan {
				background-color: $primary-color;
			}

			&--overdue {
				background-color: #ff4700;
			}

			&--done {
				background-color: #67c23a;
			}
		}
	}

	/* 新增事程悬浮按钮 */
	.fab {
		position: fixed;
		right: 25rpx;
		bottom: 150rpx;
		width: 100rpx;
		height: 100rpx;

		border-radius: 50%;
		background-color: $primary-color;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.2);
		opacity: 0.5;

		&__icon {
			font-size: 56rpx;
			color: #fff;
			line-height: 1;
			margin-top: -4rpx;
		}
	}
</style>