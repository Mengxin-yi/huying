<template>
  <view class="page">
    <CalendarPicker
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

const marks = ref([
  { date: '2026-04-29', color: '#007AFF' },
  { date: '2026-04-29', color: '#F0AD4E' },
  { date: '2026-05-01', color: '#DD524D' },
  { date: '2026-05-03', color: '#4CD964' },
])

function onDateSelect({ date }) {
  console.log('选中日期:', date)
}

function onModeChange({ mode }) {
  console.log('模式切换:', mode)
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: $bg-color;
  padding: $spacing-md;
}
</style>
