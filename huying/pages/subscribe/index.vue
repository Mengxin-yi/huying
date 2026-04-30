<template>
	<view class="page">
		<!-- 日历组件 -->
		<CalendarPicker ref="calendarRef" mode="week" :marks="marks" @select="onDateSelect"
			@mode-change="onModeChange" @month-change="onMonthChange" />

		<!-- 订阅栏目 tab（横向可滚动） -->
		<view class="tabs-wrapper">
			<scroll-view class="tabs" scroll-x enable-flex :scroll-into-view="scrollIntoTab"
				:scroll-with-animation="true">
				<view
					v-for="tab in tabs"
					:key="tab.value"
					:id="'tab-' + tab.value"
					class="tabs__item"
					:class="{ 'tabs__item--active': activeTab === tab.value }"
					@click="onTabChange(tab.value)"
				>
					<text class="tabs__text">{{ tab.label }}</text>
				</view>
			</scroll-view>
			<!-- 滑动下划线 -->
			<view v-if="tabs.length" class="tabs__line" :style="{ left: lineLeft + 'px', width: lineWidth + 'px' }" />
		</view>

		<!-- 日期摘要 -->
		<view class="summary">
			<view class="summary__header">
				<view class="summary__date">{{ dateLabel }}</view>
				<view v-if="!isToday" class="summary__today" @click="goToToday">回到今天</view>
			</view>
			<view class="summary__body">
				<!-- 左侧推送次数 -->
				<view class="summary__count">
					<text class="summary__count-num">{{ timeList.length }}</text>
					<text class="summary__count-label">{{ timeList.length > 0 ? '次推送' : '暂无推送' }}</text>
				</view>
				<!-- 右侧时间选项 -->
				<view class="summary__times" v-if="timeList.length">
					<view
						v-for="item in timeList"
						:key="item.value"
						class="summary__time-tag"
						:class="{ 'summary__time-tag--active': activeTime === item.value }"
						@click="onTimeChange(item.value)"
					>
						<text class="summary__time-text">{{ item.label }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 加载动画 -->
		<view v-if="loading" class="data-loading">
			<u-loading-icon mode="circle" size="48"></u-loading-icon>
			<text class="data-loading__text">加载中...</text>
		</view>

		<!-- 推送数据列表 -->
		<view v-else-if="dataList.length" class="data-list">
			<view class="data-card" v-for="item in dataList" :key="item.id" @click="onCardClick(item)">
				<!-- 标题 -->
				<text class="data-card__title">{{ item.llm_title || item.title }}</text>
				<!-- 信息行 -->
				<view class="data-card__info">
					<text class="data-card__type">{{ getTypeLabel(item.data_type) }}</text>
					<text class="data-card__location" v-if="item.location">{{ item.location }}</text>
					<text class="data-card__method" v-if="item.procurement_method">{{ item.procurement_method }}</text>
				</view>
				<view class="data-card__footer">
					<text class="data-card__source" v-if="item.source_name">{{ item.source_name }}</text>
					<text class="data-card__time">{{ formatPublishTime(item.publish_time) }}</text>
				</view>
			</view>
		</view>

		<!-- 暂无数据 -->
		<view v-else class="data-empty">
			<image class="data-empty__img" src="/static/image/empty.png" mode="aspectFit" />
			<text class="data-empty__text">暂无推送数据</text>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed, nextTick, watch } from 'vue'
	import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
	import CalendarPicker from '@/components/CalendarPicker.vue'
	import { getPushNum, getOrderList, getOrderIndex } from '@/api/modules/subscribe.js'

	/** 日历组件引用 */
	const calendarRef = ref(null)

	/** 日历标记日期 */
	const marks = ref([])

	/** 当前选中 tab，默认选中第一个 */
	const activeTab = ref(' ')

	/** tab 滚动定位 ID */
	const scrollIntoTab = ref('')

	/** 下划线位置 */
	const lineLeft = ref(0)
	const lineWidth = ref(40)

	/** 订阅列表原始数据 */
	const orderList = ref([])

	/** 当前选中日期（yyyy-MM-dd） */
	const selectedDate = ref('')

	/** 当月每天推送数量 */
	const dayCounts = ref({})

	/** 推送数据列表 */
	const dataList = ref([])

	/** 时间选项列表（接口返回的 time_list） */
	const timeList = ref([])

	/** 当前选中的时间选项 */
	const activeTime = ref('')

	/** 加载状态 */
	const loading = ref(false)

	/** 星期映射 */
	const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

	/** data_type 到中文名称的映射 */
	const TYPE_LABELS = {
		bid: '招标',
		job: '招聘'
	}

	/** 日期标签 */
	const dateLabel = computed(() => {
		const d = selectedDate.value || getToday()
		const date = new Date(d)
		const month = date.getMonth() + 1
		const day = date.getDate()
		const weekDay = WEEK_DAYS[date.getDay()]
		return `${month}月${day}日 ${weekDay}`
	})

	/** 是否为今天 */
	const isToday = computed(() => selectedDate.value === getToday())

	/** 动态生成 tab 选项：各订阅 title */
	const tabs = computed(() => {
		const result = []
		orderList.value.forEach(item => {
			if (item.title) {
				result.push({ label: item.title, value: item.title, id: item.id })
			}
		})
		return result
	})

	/** 当前选中 tab 对应的订阅 ID */
	const activeOrderId = computed(() => {
		const tab = tabs.value.find(t => t.value === activeTab.value)
		return tab ? tab.id : ''
	})

	/** 格式化发布时间 */
	function formatPublishTime(time) {
		if (!time) return ''
		return time.replace('T', ' ').slice(0, 16)
	}

	/** 获取数据类型标签 */
	function getTypeLabel(type) {
		return TYPE_LABELS[type] || type || '其他'
	}

	/**
	 * 更新下划线位置
	 * @param {string} tabValue - tab 标识
	 */
	async function updateLine(tabValue) {
		await nextTick()
		const id = 'tab-' + tabValue
		uni.createSelectorQuery()
			.select('#' + id)
			.boundingClientRect()
			.select('.tabs-wrapper')
			.boundingClientRect()
			.exec((res) => {
				const tabRect = res[0]
				const wrapperRect = res[1]
				if (tabRect && wrapperRect) {
					const w = Math.max(tabRect.width * 0.6, 40)
					lineWidth.value = w
					lineLeft.value = tabRect.left - wrapperRect.left + (tabRect.width - w) / 2
				}
			})
	}

	/** 获取当前月份字符串（yyyy-MM） */
	function getCurrentMonth() {
		const now = new Date()
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
	}

	/** 获取今天的日期字符串（yyyy-MM-dd） */
	function getToday() {
		const now = new Date()
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
	}

	/**
	 * 获取指定月份的推送数量，生成日历标记
	 * @param {string} monthStr - 月份字符串（yyyy-MM）
	 */
	async function fetchMonthMarks(monthStr) {
		try {
			const res = await getPushNum({ date: monthStr, _silent: true })
			const dayMap = res.data || {}
			dayCounts.value = dayMap

			const [yearStr, monthPart] = monthStr.split('-')
			const year = parseInt(yearStr, 10)
			const month = parseInt(monthPart, 10)
			const newMarks = []

			Object.keys(dayMap).forEach(dayStr => {
				if (dayMap[dayStr] > 0) {
					const day = parseInt(dayStr, 10)
					const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
					newMarks.push({ date: dateStr })
				}
			})

			marks.value = newMarks
		} catch (e) {
			console.error('获取推送数量失败:', e)
		}
	}

	/** 获取订阅列表 */
	async function fetchOrderList() {
		try {
			const res = await getOrderList({ _silent: true })
			orderList.value = res.data || []
		} catch (e) {
			console.error('获取订阅列表失败:', e)
		}
	}

	/**
	 * 获取选中日期的推送数据
	 * @param {string} date - 日期（yyyy-MM-dd）
	 * @param {string} [time] - 时间选项值
	 */
	async function fetchOrderData(date, time) {
		if (!activeOrderId.value) return
		loading.value = true
		try {
			const params = {
				id: activeOrderId.value,
				date,
				page: 1,
				page_size: 10,
				_silent: true
			}
			if (time) params.time = time
			const res = await getOrderIndex(params)
			dataList.value = res.data || []
			// 仅在非时间筛选时更新 time_list（避免切换时间后丢失选项）
			if (!time) {
				timeList.value = res.time_list || []
				activeTime.value = timeList.value.length ? timeList.value[0].value : ''
			}
		} catch (e) {
			console.error('获取推送数据失败:', e)
			dataList.value = []
			if (!time) {
				timeList.value = []
				activeTime.value = ''
			}
		} finally {
			loading.value = false
		}
	}

	/** 时间选项切换，带 time 参数重新请求数据 */
	function onTimeChange(value) {
		activeTime.value = value
		fetchOrderData(selectedDate.value || getToday(), value)
	}

	/** tab 切换 */
	function onTabChange(value) {
		activeTab.value = value
		scrollIntoTab.value = 'tab-' + value
		updateLine(value)
		// 切换 tab 后重新加载数据
		fetchOrderData(selectedDate.value || getToday())
	}

	/** 选中日期回调 */
	function onDateSelect({ date }) {
		selectedDate.value = date
		fetchOrderData(date)
	}

	/** 日历模式切换回调 */
	function onModeChange({ mode }) {
		console.log('模式切换:', mode)
	}

	/** 月份变化回调 */
	function onMonthChange({ month }) {
		fetchMonthMarks(month)
	}

	/** 回到今天 */
	function goToToday() {
		const today = getToday()
		selectedDate.value = today
		calendarRef.value?.goToToday()
		fetchOrderData(today)
	}

	/** 点击数据卡片 */
	function onCardClick(item) {
		console.log('点击数据:', item.id)
	}

	/** 页面初始化 */
	selectedDate.value = getToday()
	fetchMonthMarks(getCurrentMonth())
	fetchOrderList()

	/** tabs 数据变化后，默认选中第一个并加载数据 */
	watch(tabs, (newTabs) => {
		if (newTabs.length && activeTab.value === ' ') {
			activeTab.value = newTabs[0].value
			scrollIntoTab.value = 'tab-' + newTabs[0].value
		}
		updateLine(activeTab.value)
		// tabs 就绪后加载当天数据
		if (newTabs.length) {
			fetchOrderData(selectedDate.value || getToday())
		}
	}, { immediate: true })

	/** 每次页面显示时刷新数据 */
	onShow(() => {
		fetchMonthMarks(getCurrentMonth())
		fetchOrderList()
	})

	/** 下拉刷新 */
	onPullDownRefresh(async () => {
		await Promise.all([
			fetchMonthMarks(getCurrentMonth()),
			fetchOrderList()
		])
		uni.stopPullDownRefresh()
	})
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-md;
		padding-bottom: 180rpx;
	}

	/* 订阅栏目 tab 栏 */
	.tabs-wrapper {
		position: relative;
		margin-top: $spacing-md;
	}

	.tabs {
		white-space: nowrap;

		&__item {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 16rpx $spacing-md;
			flex-shrink: 0;
		}

		&__text {
			font-size: 28rpx;
			color: $uni-text-color-grey;
		}

		&__item--active .tabs__text {
			color: $uni-text-color;
			font-weight: bold;
		}

		/* 滑动下划线 */
		&__line {
			position: absolute;
			bottom: 0;
			height: 3px;
			border-radius: 1.5px;
			background-color: $primary-color;
			transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		}
	}

	/* 日期摘要 */
	.summary {
		margin-top: $spacing-sm;
		padding: $spacing-md;
		background-color: #fff;
		border-radius: $uni-border-radius-lg;

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
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

		&__body {
			display: flex;
			align-items: center;
			margin-top: $spacing-sm;
		}

		&__count {
			display: flex;
			flex-direction: column;
			align-items: center;
			min-width: 100rpx;
			padding-right: $spacing-md;
			border-right: 2rpx solid $border-color;

			&-num {
				font-size: 48rpx;
				font-weight: bold;
				color: $primary-color;
				line-height: 1;
			}

			&-label {
				font-size: 22rpx;
				color: $uni-text-color-grey;
				margin-top: 4rpx;
			}
		}

		&__times {
			flex: 1;
			display: flex;
			flex-wrap: wrap;
			gap: $spacing-sm;
			padding-left: $spacing-md;
		}

		&__time-tag {
			padding: 8rpx 24rpx;
			border-radius: 24rpx;
			background-color: $bg-color;

			&--active {
				background-color: $primary-color;

				.summary__time-text {
					color: #fff;
				}
			}
		}

		&__time-text {
			font-size: 24rpx;
			color: $uni-text-color;
		}
	}

	/* 加载动画 */
	.data-loading {
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

	/* 暂无数据 */
	.data-empty {
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

	/* 推送数据列表 */
	.data-list {
		margin-top: $spacing-sm;
	}

	.data-card {
		padding: $spacing-md;
		background-color: #fff;
		border-radius: $uni-border-radius-lg;
		margin-bottom: $spacing-sm;
		position: relative;
		overflow: hidden;

		&__title {
			font-size: 28rpx;
			color: $uni-text-color;
			font-weight: 500;
			line-height: 1.5;
			display: block;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 100%;
		}

		&__info {
			display: flex;
			gap: $spacing-sm;
			margin-top: $spacing-sm;
			overflow: hidden;
		}

		&__type {
			display: inline-block;
			font-size: 22rpx;
			color: #fff;
			background-color: $primary-color;
			padding: 4rpx 16rpx;
			border-radius: 4rpx;
			white-space: nowrap;
			flex-shrink: 0;
		}

		&__location,
		&__method {
			font-size: 24rpx;
			color: $uni-text-color-grey;
			background-color: $bg-color;
			padding: 4rpx 12rpx;
			border-radius: 4rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			flex-shrink: 0;
			max-width: 40%;
		}

		&__footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: $spacing-sm;
		}

		&__source {
			font-size: 24rpx;
			color: $uni-text-color-grey;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			flex: 1;
			margin-right: $spacing-sm;
		}

		&__time {
			font-size: 24rpx;
			color: $uni-text-color-grey;
			white-space: nowrap;
			flex-shrink: 0;
		}
	}
</style>
