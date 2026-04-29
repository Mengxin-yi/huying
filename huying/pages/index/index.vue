<template>
	<view class="page">
		<CalendarPicker
			ref="calendarRef"
			mode="week"
			:marks="marks"
			@select="onDateSelect"
			@mode-change="onModeChange"
		/>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import CalendarPicker from '@/components/CalendarPicker.vue'

const calendarRef = ref(null)
const marks = ref([])

/** 选中日期回调 */
function onDateSelect({ date }) {
	console.log('选中日期:', date)
}

/** 日历模式切换回调 */
function onModeChange({ mode }) {
	console.log('模式切换:', mode)
}

/** 外部调用：跳转今天 */
function goToToday() {
	calendarRef.value?.goToToday()
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: $bg-color;
	padding: $spacing-md;
}
</style>
