<template>
  <view class="calendar">
    <!-- 头部：月份切换 + 展开/收起 -->
    <view class="calendar__header">
      <view class="calendar__nav">
        <view class="calendar__arrow" @click="prevPage">
          <text class="calendar__arrow-icon">&#9664;</text>
        </view>
        <text class="calendar__title">{{ monthTitle }}</text>
        <view class="calendar__arrow" @click="nextPage">
          <text class="calendar__arrow-icon">&#9654;</text>
        </view>
      </view>
      <view class="calendar__toggle" @click="toggleMode">
        <text class="calendar__toggle-icon" :class="{ 'calendar__toggle-icon--expanded': currentMode === 'month' }">&#9650;</text>
        <text class="calendar__toggle-text">{{ currentMode === 'month' ? '收起' : '展开' }}</text>
      </view>
    </view>

    <!-- 星期标题栏 -->
    <view class="calendar__weekdays">
      <text v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day" class="calendar__weekday">{{ day }}</text>
    </view>

    <!-- 日期网格 -->
    <view class="calendar__grid" :style="{ height: gridHeight + 'rpx' }" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <view
        v-for="(cell, index) in gridData"
        :key="cell.dateStr + '-' + index"
        class="calendar__cell"
        :class="{
          'calendar__cell--other': !cell.isCurrentMonth,
          'calendar__cell--today': cell.dateStr === todayStr,
          'calendar__cell--selected': cell.dateStr === selectedDateStr,
          'calendar__cell--disabled': isCellDisabled(cell)
        }"
        @click="onCellClick(cell)"
      >
        <text class="calendar__cell-text">{{ cell.date.getDate() }}</text>
        <view v-if="getMarks(cell.dateStr).length" class="calendar__dots">
          <view
            v-for="(color, ci) in getMarks(cell.dateStr)"
            :key="ci"
            class="calendar__dot"
            :style="{ backgroundColor: color }"
          />
        </view>
        <view v-if="cell.dateStr === todayStr && cell.dateStr !== selectedDateStr" class="calendar__today-line" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'week', validator: v => ['week', 'month'].includes(v) },
  selectedDate: { type: String, default: '' },
  marks: { type: Array, default: () => [] },
  minDate: { type: String, default: '' },
  maxDate: { type: String, default: '' }
})

const emit = defineEmits(['select', 'mode-change', 'month-change'])

// ==================== 核心状态 ====================

const currentMode = ref(props.mode)
const innerDate = ref(new Date())
const currentMonth = reactive({ year: new Date().getFullYear(), month: new Date().getMonth() })

// ==================== 日期工具函数 ====================

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseDate(str) {
  if (!str) return null
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  const d = new Date(+match[1], +match[2] - 1, +match[3])
  if (d.getFullYear() !== +match[1] || d.getMonth() !== +match[2] - 1 || d.getDate() !== +match[3]) return null
  return d
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

function isDateInRange(date, minDate, maxDate) {
  const ts = date.getTime()
  if (minDate && ts < minDate.getTime()) return false
  if (maxDate && ts > maxDate.getTime()) return false
  return true
}

// ==================== 网格生成 ====================

function generateMonthGrid(year, month) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)
  const prevMonthDays = getDaysInMonth(year, month - 1)
  const grid = []

  for (let i = 0; i < 42; i++) {
    let date, isCurrentMonth
    if (i < firstDay) {
      const day = prevMonthDays - firstDay + i + 1
      const m = month === 0 ? 11 : month - 1
      const y = month === 0 ? year - 1 : year
      date = new Date(y, m, day)
      isCurrentMonth = false
    } else if (i - firstDay >= daysInMonth) {
      const day = i - firstDay - daysInMonth + 1
      const m = month === 11 ? 0 : month + 1
      const y = month === 11 ? year + 1 : year
      date = new Date(y, m, day)
      isCurrentMonth = false
    } else {
      date = new Date(year, month, i - firstDay + 1)
      isCurrentMonth = true
    }
    grid.push({ date, isCurrentMonth, dateStr: formatDate(date) })
  }
  return grid
}

function generateWeekData(baseDate) {
  const day = baseDate.getDay()
  const startOfWeek = new Date(baseDate)
  startOfWeek.setDate(baseDate.getDate() - day)
  const week = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    week.push({ date: d, isCurrentMonth: d.getMonth() === baseDate.getMonth(), dateStr: formatDate(d) })
  }
  return week
}

// ==================== Computed ====================

const marksMap = computed(() => {
  const map = new Map()
  props.marks.forEach(m => {
    if (!map.has(m.date)) map.set(m.date, [])
    const list = map.get(m.date)
    if (list.length < 3) {
      list.push(m.color || '#007AFF')
    }
  })
  return map
})

function getMarks(dateStr) {
  return marksMap.value.get(dateStr) || []
}

const effectiveMinDate = computed(() => {
  if (!props.minDate) return null
  return parseDate(props.minDate)
})
const effectiveMaxDate = computed(() => {
  if (!props.maxDate) return null
  return parseDate(props.maxDate)
})

const dateRangeValid = computed(() => {
  if (effectiveMinDate.value && effectiveMaxDate.value) {
    return effectiveMinDate.value.getTime() <= effectiveMaxDate.value.getTime()
  }
  return true
})

const finalMinDate = computed(() => dateRangeValid.value ? effectiveMinDate.value : null)
const finalMaxDate = computed(() => dateRangeValid.value ? effectiveMaxDate.value : null)

const gridData = computed(() => {
  if (currentMode.value === 'month') {
    return generateMonthGrid(currentMonth.year, currentMonth.month)
  }
  return generateWeekData(innerDate.value)
})

const monthTitle = computed(() => {
  return `${currentMonth.year}年${currentMonth.month + 1}月`
})

const today = new Date()
const todayStr = formatDate(today)

const selectedDateStr = computed(() => formatDate(innerDate.value))

// ==================== Watch ====================

watch(() => props.selectedDate, (val) => {
  if (val) {
    const d = parseDate(val)
    if (d) {
      innerDate.value = d
      currentMonth.year = d.getFullYear()
      currentMonth.month = d.getMonth()
    }
  }
}, { immediate: true })

/** 监听月份变化，通知父组件 */
watch(
  () => `${currentMonth.year}-${currentMonth.month}`,
  () => {
    const month = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}`
    emit('month-change', { month, year: currentMonth.year, monthIndex: currentMonth.month })
  }
)

// ==================== 交互逻辑 ====================

function onCellClick(cell) {
  if (isCellDisabled(cell)) return
  innerDate.value = cell.date
  currentMonth.year = cell.date.getFullYear()
  currentMonth.month = cell.date.getMonth()
  emit('select', { date: cell.dateStr })
}

function isCellDisabled(cell) {
  return !isDateInRange(cell.date, finalMinDate.value, finalMaxDate.value)
}

function prevPage() {
  if (currentMode.value === 'month') {
    if (currentMonth.month === 0) {
      currentMonth.month = 11
      currentMonth.year--
    } else {
      currentMonth.month--
    }
  } else {
    const d = new Date(innerDate.value)
    d.setDate(d.getDate() - 7)
    innerDate.value = d
    currentMonth.year = d.getFullYear()
    currentMonth.month = d.getMonth()
  }
}

function nextPage() {
  if (currentMode.value === 'month') {
    if (currentMonth.month === 11) {
      currentMonth.month = 0
      currentMonth.year++
    } else {
      currentMonth.month++
    }
  } else {
    const d = new Date(innerDate.value)
    d.setDate(d.getDate() + 7)
    innerDate.value = d
    currentMonth.year = d.getFullYear()
    currentMonth.month = d.getMonth()
  }
}

function goToToday() {
  const now = new Date()
  innerDate.value = now
  currentMonth.year = now.getFullYear()
  currentMonth.month = now.getMonth()
  emit('select', { date: formatDate(now) })
}

function toggleMode() {
  currentMode.value = currentMode.value === 'month' ? 'week' : 'month'
  emit('mode-change', { mode: currentMode.value })
}

const gridHeight = computed(() => {
  return currentMode.value === 'month' ? 480 : 80
})

const touchStartX = ref(0)
const touchStartY = ref(0)

function onTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

function onTouchEnd(e) {
  const deltaX = e.changedTouches[0].clientX - touchStartX.value
  const deltaY = e.changedTouches[0].clientY - touchStartY.value
  // 阈值 25px（≈50rpx），水平位移 > 垂直位移时触发
  if (Math.abs(deltaX) > 25 && Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX < 0) {
      nextPage()
    } else {
      prevPage()
    }
  }
}

defineExpose({
  goToToday,
  setDate(dateStr) {
    const d = parseDate(dateStr)
    if (d) {
      innerDate.value = d
      currentMonth.year = d.getFullYear()
      currentMonth.month = d.getMonth()
      emit('select', { date: formatDate(d) })
    }
  }
})
</script>

<style lang="scss" scoped>
.calendar {
  background-color: $card-bg;
  border-radius: $card-radius;
  padding: $spacing-md;
  box-shadow: $shadow-light;
}

/* 头部 */
.calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-md;
}

.calendar__nav {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.calendar__arrow {
  padding: $spacing-xs $spacing-sm;
}

.calendar__arrow-icon {
  font-size: 28rpx;
  color: $primary-color;
}

.calendar__title {
  font-size: 32rpx;
  font-weight: 600;
  color: $text-color;
}

.calendar__toggle {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: $spacing-xs $spacing-sm;
}

.calendar__toggle-icon {
  font-size: 20rpx;
  color: $text-color-weak;
  transition: transform 300ms ease;
}

.calendar__toggle-icon--expanded {
  transform: rotate(180deg);
}

.calendar__toggle-text {
  font-size: 24rpx;
  color: $text-color-weak;
}

/* 星期标题栏 */
.calendar__weekdays {
  display: flex;
  justify-content: space-around;
  margin-bottom: $spacing-sm;
}

.calendar__weekday {
  width: 80rpx;
  text-align: center;
  font-size: 24rpx;
  color: $text-color-weak;
}

/* 日期网格 */
.calendar__grid {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  transition: height 300ms ease;
}

.calendar__cell {
  width: calc(100% / 7);
  height: 80rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.calendar__cell-text {
  font-size: 28rpx;
  color: $text-color;
}

.calendar__cell--other {
  .calendar__cell-text {
    color: $text-color-secondary;
    opacity: 0.4;
  }
}

.calendar__cell--today {
  .calendar__today-line {
    position: absolute;
    bottom: 4rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 24rpx;
    height: 4rpx;
    background-color: $primary-color;
    border-radius: 2rpx;
  }
}

.calendar__cell--selected {
  .calendar__cell-text {
    width: 56rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    border-radius: 50%;
    background-color: $primary-color;
    color: $uni-text-color-inverse;
  }
}

.calendar__cell--disabled {
  pointer-events: none;
  .calendar__cell-text {
    color: $uni-text-color-disable;
    opacity: $uni-opacity-disabled;
  }
}

/* 标记点 */
.calendar__dots {
  display: flex;
  gap: 4rpx;
  margin-top: 2rpx;
}

.calendar__dot {
  width: 10rpx;
  height: 5rpx;
  border-radius: 50%;
}
</style>
