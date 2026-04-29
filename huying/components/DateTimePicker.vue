<template>
	<view class="datetime-picker">
		<!-- 显示区域 -->
		<view class="datetime-picker__display" @tap="open">
			<text :class="['datetime-picker__text', !selectedStr && 'datetime-picker__text--placeholder']">
				{{ selectedStr || placeholder }}
			</text>
		</view>

		<!-- 遮罩 -->
		<view v-if="visible" class="datetime-picker__mask" @tap="close" />

		<!-- 选择器弹窗 -->
		<view v-if="visible" class="datetime-picker__popup">
			<view class="datetime-picker__header">
				<text class="datetime-picker__btn" @tap="close">取消</text>
				<text class="datetime-picker__btn datetime-picker__btn--confirm" @tap="confirm">确认</text>
			</view>
			<picker-view
				class="datetime-picker__view"
				:indicator-style="'height: 50px;'"
				:value="pickerIndex"
				@change="onChange"
			>
				<picker-view-column>
					<view class="datetime-picker__item" v-for="item in yearList" :key="item">{{ item }}年</view>
				</picker-view-column>
				<picker-view-column>
					<view class="datetime-picker__item" v-for="item in monthList" :key="item">{{ item }}月</view>
				</picker-view-column>
				<picker-view-column>
					<view class="datetime-picker__item" v-for="item in dayList" :key="item">{{ item }}日</view>
				</picker-view-column>
				<picker-view-column>
					<view class="datetime-picker__item" v-for="item in hourList" :key="item">{{ item }}时</view>
				</picker-view-column>
				<picker-view-column>
					<view class="datetime-picker__item" v-for="item in minuteList" :key="item">{{ item }}分</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
	/** 当前选中值（yyyy-MM-dd HH:mm） */
	modelValue: { type: String, default: '' },
	/** 占位文字 */
	placeholder: { type: String, default: '请选择日期时间' },
	/** 起始日期（yyyy-MM-dd） */
	start: { type: String, default: '2020-01-01' },
	/** 结束日期（yyyy-MM-dd） */
	end: { type: String, default: '2050-12-31' }
})

const emit = defineEmits(['update:modelValue', 'change'])

const visible = ref(false)

/** 补零 */
function pad(n) {
	return String(n).padStart(2, '0')
}

/** 当前选中索引 [年, 月, 日, 时, 分] */
const pickerIndex = ref([0, 0, 0, 0, 0])

/** 解析起止年 */
const startYear = computed(() => parseInt(props.start.substring(0, 4), 10) || 2020)
const endYear = computed(() => parseInt(props.end.substring(0, 4), 10) || 2050)

/** 年列表 */
const yearList = computed(() => {
	const list = []
	for (let i = startYear.value; i <= endYear.value; i++) list.push(i)
	return list
})

/** 当前选中年 */
const currentYear = computed(() => yearList.value[pickerIndex.value[0]] || startYear.value)

/** 当前选中的月份（1-12） */
const currentMonth = computed(() => (pickerIndex.value[1] || 0) + 1)

/** 月列表 */
const monthList = computed(() => {
	const list = []
	for (let i = 1; i <= 12; i++) list.push(i)
	return list
})

/** 获取某月天数 */
function getDaysInMonth(year, month) {
	return new Date(year, month, 0).getDate()
}

/** 日列表 */
const dayList = computed(() => {
	const days = getDaysInMonth(currentYear.value, currentMonth.value)
	const list = []
	for (let i = 1; i <= days; i++) list.push(i)
	return list
})

/** 时列表 */
const hourList = computed(() => {
	const list = []
	for (let i = 0; i <= 23; i++) list.push(i)
	return list
})

/** 分列表（每1分钟） */
const minuteList = computed(() => {
	const list = []
	for (let i = 0; i <= 59; i += 1) list.push(i)
	return list
})

/** 选中值的格式化显示 */
const selectedStr = computed(() => {
	if (!props.modelValue) return ''
	const parts = props.modelValue.match(/(\d{4})-(\d{2})-(\d{2})\s*(\d{2}):(\d{2})/)
	if (!parts) return props.modelValue
	return `${parts[1]}年${parseInt(parts[2])}月${parseInt(parts[3])}日 ${parts[4]}:${parts[5]}`
})

/** 解析 modelValue 为索引 */
function valueToIndex(val) {
	if (!val) {
		const now = new Date()
		const yi = now.getFullYear() - startYear.value
		const mi = now.getMonth()
		const di = now.getDate() - 1
		const hi = now.getHours()
		// 分钟直接取整
		const mIdx = now.getMinutes()
		return [yi, mi, di, hi, mIdx]
	}
	const parts = val.match(/(\d{4})-(\d{2})-(\d{2})\s*(\d{2}):(\d{2})/)
	if (!parts) return [0, 0, 0, 0, 0]
	const yi = parseInt(parts[1], 10) - startYear.value
	const mi = parseInt(parts[2], 10) - 1
	const di = parseInt(parts[3], 10) - 1
	const hi = parseInt(parts[4], 10)
	const mRaw = parseInt(parts[5], 10)
	const mIdx = mRaw
	return [yi, mi, di, hi, mIdx]
}

/** 打开选择器 */
function open() {
	pickerIndex.value = valueToIndex(props.modelValue)
	visible.value = true
}

/** 关闭选择器 */
function close() {
	visible.value = false
}

/** 选择器滚动变化 */
function onChange(e) {
	const val = e.detail.value
	// 确保日不超出范围
	const y = yearList.value[val[0]] || startYear.value
	const m = (val[1] || 0) + 1
	const maxDay = getDaysInMonth(y, m)
	const d = Math.min(val[2] || 0, maxDay - 1)
	pickerIndex.value = [val[0] || 0, val[1] || 0, d, val[3] || 0, val[4] || 0]
}

/** 确认选择 */
function confirm() {
	const yi = pickerIndex.value[0]
	const mi = pickerIndex.value[1]
	const di = pickerIndex.value[2]
	const hi = pickerIndex.value[3]
	const mii = pickerIndex.value[4]

	const y = yearList.value[yi] || startYear.value
	const m = (mi || 0) + 1
	const maxDay = getDaysInMonth(y, m)
	const d = Math.min((di || 0) + 1, maxDay)
	const h = hi || 0
	const min = minuteList.value[mii] || 0

	const result = `${y}-${pad(m)}-${pad(d)} ${pad(h)}:${pad(min)}`
	emit('update:modelValue', result)
	emit('change', result)
	close()
}
</script>

<style lang="scss" scoped>
.datetime-picker {
	&__display {
		padding: 16rpx 20rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
	}

	&__text {
		font-size: 28rpx;
		color: $uni-text-color;

		&--placeholder {
			color: $uni-text-color-grey;
		}
	}

	&__mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
	}

	&__popup {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		z-index: 1000;
		border-radius: 24rpx 24rpx 0 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	&__header {
		display: flex;
		justify-content: space-between;
		padding: 24rpx 32rpx;
		border-bottom: 1rpx solid #eee;
	}

	&__btn {
		font-size: 30rpx;
		color: $uni-text-color-grey;

		&--confirm {
			color: $primary-color;
			font-weight: bold;
		}
	}

	&__view {
		height: 500rpx;
	}

	&__item {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		font-size: 28rpx;
		color: $uni-text-color;
	}
}
</style>
