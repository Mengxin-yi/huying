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
			<view class="summary__footer">
				<text class="summary__text">{{ publishLabel }}</text>
				<!-- 留言与点赞入口 -->
				<view v-if="unreadNum > 0" class="summary__badge-btn" @click="goCommentList">
					<uni-badge :text="unreadNum" size="small" absolute="rightBottom" :offset="[80, 0]">
						<text class="summary__badge-text">留言与点赞</text>
					</uni-badge>
				</view>
			</view>
		</view>

		<!-- 加载动画 -->
		<view v-if="loading" class="task-loading">
			<u-loading-icon mode="circle" size="48"></u-loading-icon>
			<text class="task-loading__text">加载中...</text>
		</view>

		<!-- 发布列表 -->
		<view v-else-if="publishList.length" class="task-list">
			<uni-swipe-action v-for="item in publishList" :key="item.data_id">
				<uni-swipe-action-item :right-options="optionRight" :auto-close="true" style="margin-top: 16rpx;"
					@click="onSwipeClick($event, item)">
					<view class="task-card" @click="onCardClick(item)">
						<!-- 左侧：类型标签 -->
						<view v-if="item.msg_type" class="task-card__type">{{ item.msg_type }}</view>
						<!-- 右侧：标题、内容、时间、互动数据 -->
						<view class="task-card__body">
							<text class="task-card__title">{{ item.title }}</text>
							<text v-if="item.content" class="task-card__content">{{ item.content }}</text>
							<view class="task-card__footer">
								<text class="task-card__time">{{ item.publish_time }}</text>
								<view class="task-card__stats">
									<view v-if="item.like_num" class="task-card__stat">
										<u-icon name="heart" size="14" color="#999"></u-icon>
										<text class="task-card__stat-num">{{ item.like_num }}</text>
									</view>
									<view v-if="item.comment_num" class="task-card__stat">
										<u-icon name="chat" size="14" color="#999"></u-icon>
										<text class="task-card__stat-num">{{ item.comment_num }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>

		<!-- 暂无发布 -->
		<view v-else class="task-empty">
			<image class="task-empty__img" src="/static/image/empty.png" mode="aspectFit" />
			<text class="task-empty__text">暂无发布</text>
		</view>

		<!-- 新增发布按钮 -->
		<view class="fab" @click="goToEditor">
			<text class="fab__icon">+</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onPullDownRefresh,
		onShow
	} from '@dcloudio/uni-app'
	import CalendarPicker from '@/components/CalendarPicker.vue'
	import {
		getPublishList,
		getPublishNum,
		deletePublish,
		getCommentLikeNum
	} from '@/api/modules/publish.js'

	/** 日历组件引用 */
	const calendarRef = ref(null)

	/** 日历标记数据 */
	const marks = ref([])

	/** 加载状态 */
	const loading = ref(false)

	/** 当前选中日期（yyyy-MM-dd） */
	const selectedDate = ref('')

	/** 选中日期的发布数量 */
	const selectedCount = ref(0)

	/** 发布列表 */
	const publishList = ref([])

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

	/** 发布标签，如 "3个发布" */
	const publishLabel = computed(() => {
		const count = selectedCount.value
		if (count === 0) return '暂无发布'
		return `${count}个发布`
	})

	/** 格式化发布时间为 HH:mm */
	function formatTime(time) {
		if (!time) return ''
		return time.split(' ')[1]?.slice(0, 5) || ''
	}

	/** 右滑按钮（删除） */
	const optionRight = [{
		text: '删除',
		style: {
			backgroundColor: '#F56C6C'
		}
	}]

	/** 滑动按钮点击 */
	function onSwipeClick(e, item) {
		const action = e?.content?.text || ''
		if (action === '删除') {
			uni.showModal({
				title: '提示',
				content: '是否删除本条发布？',
				success: (res) => {
					if (res.confirm) {
						handleDelete(item)
					}
				}
			})
		}
	}

	/** 执行删除操作 */
	async function handleDelete(item) {
		try {
			await deletePublish({
				data_id: item.data_id
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

	/** 点击发布卡片，跳转预览页 */
	function onCardClick(item) {
		uni.navigateTo({
			url: `/pages/publish/preview?data_id=${item.data_id}&data_type=${item.data_type}`
		})
	}

	/** 刷新当前数据（月份统计 + 当日列表） */
	function refreshCurrentData() {
		fetchMonthNum(getCurrentMonth())
		fetchPublishList(selectedDate.value || getToday())
	}

	/** 获取指定月份的发布日历标记 */
	async function fetchMonthNum(monthStr) {
		try {
			const res = await getPublishNum({
				date: monthStr,
				_silent: true
			})
			const dayData = res.data || {}
			const [yearStr, monthPart] = monthStr.split('-')
			const year = parseInt(yearStr, 10)
			const month = parseInt(monthPart, 10)
			const newMarks = []

			// 遍历每日数量，有发布的日期添加标记
			Object.keys(dayData).forEach(day => {
				if (dayData[day] > 0) {
					const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
					newMarks.push({
						date: dateStr
					})
				}
			})

			marks.value = newMarks

			// 同步更新选中日期的发布数量
			if (selectedDate.value) {
				const selectedDay = parseInt(selectedDate.value.split('-')[2], 10)
				selectedCount.value = dayData[selectedDay] || 0
			}
		} catch (e) {
			console.error('获取月度发布统计失败:', e)
		}
	}

	/** 获取选中日期的发布列表 */
	async function fetchPublishList(date) {
		loading.value = true
		try {
			const res = await getPublishList({
				date,
				page: 1,
				page_size: 20,
				_silent: true
			})
			publishList.value = res.data || []
			selectedCount.value = res.total || publishList.value.length
		} catch (e) {
			console.error('获取发布列表失败:', e)
			publishList.value = []
		} finally {
			loading.value = false
		}
	}

	/** 页面原生下拉刷新 */
	onPullDownRefresh(async () => {
		await Promise.all([
			fetchMonthNum(getCurrentMonth()),
			fetchPublishList(selectedDate.value || getToday())
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
		fetchPublishList(date)
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
		fetchMonthNum(month)
	}

	/** 回到今天 */
	function goToToday() {
		const today = getToday()
		selectedDate.value = today
		calendarRef.value?.goToToday()
		fetchPublishList(today)
	}

	/** 跳转到编辑发布页面 */
	function goToEditor() {
		uni.navigateTo({
			url: '/pages/publish/editor'
		})
	}

	/** 跳转到评论列表页面 */
	function goCommentList() {
		uni.navigateTo({
			url: '/pages/publish/pllist'
		})
	}

	/** 未读互动数量（留言+点赞） */
	const unreadNum = ref(0)

	/** 更新 tabBar 角标（发布 tab 索引为 3） */
	async function updateTabBadge() {
		try {
			const res = await getCommentLikeNum({
				_silent: true,
				_no_disturb: true
			})
			if (res.num > 0) {
				unreadNum.value = res.num
				uni.setTabBarBadge({
					index: 3,
					text: res.num > 99 ? '99+' : String(res.num)
				})
			} else {
				unreadNum.value = 0
				uni.removeTabBarBadge({ index: 3 })
			}
		} catch (e) {
			// 获取失败不显示角标
		}
	}

	/** 页面每次显示时刷新角标和数据 */
	onShow(() => {
		updateTabBadge()
		refreshCurrentData()
	})

	// 页面加载时初始化
	selectedDate.value = getToday()
	fetchMonthNum(getCurrentMonth())
	fetchPublishList(getToday())
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

		&__footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		&__badge-btn {
			flex-shrink: 0;
		}

		&__badge-text {
			display: inline-block;
			font-size: 26rpx;
			color: $primary-color;
			background-color: rgba($primary-color, 0.1);
			padding: 8rpx 24rpx;
			border-radius: $uni-border-radius-sm;
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

	/* 暂无发布 */
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
		display: flex;
		align-items: center;
		padding: $spacing-md;
		background-color: #fff;
		border-radius: $uni-border-radius-lg;

		&__body {
			flex: 1;
			min-width: 0;
			display: flex;
			flex-direction: column;
		}

		&__title {
			font-size: 30rpx;
			color: $uni-text-color;
			font-weight: 500;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		&__content {
			font-size: 26rpx;
			color: $uni-text-color-grey;
			margin-top: $spacing-xs;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}

		&__footer {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: $spacing-xs;
		}

		&__time {
			font-size: 24rpx;
			color: $uni-text-color-grey;
		}

		&__stats {
			display: flex;
			gap: $spacing-md;
		}

		&__stat {
			display: flex;
			align-items: center;
			gap: 4rpx;
		}

		&__stat-num {
			font-size: 22rpx;
			color: $uni-text-color-grey;
		}

		&__type {
			margin-right: $spacing-md;
			font-size: 30rpx;
			color: $primary-color;
			background-color: rgba($primary-color, 0.1);
			padding: 12rpx 28rpx;
			border-radius: $uni-border-radius-sm;
			white-space: nowrap;
			flex-shrink: 0;
		}
	}

	/* 新增发布悬浮按钮 */
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
