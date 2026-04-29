<template>
  <view class="custom-calendar">
    <!-- 日历头部 -->
    <view class="calendar-header">
      <view class="header-left" @click="prevMonth">
        <uni-icons type="left" size="20"/>
      </view>
      <view class="header-center">
        <text>{{ currentYear }}年{{ currentMonth }}月</text>
      </view>
      <view class="header-right" @click="nextMonth">
        <uni-icons type="right" size="20"/>
      </view>
    </view>
    
    <!-- 星期标题 -->
    <view class="weekdays">
      <view class="weekday" v-for="week in weekdays" :key="week">{{ week }}</view>
    </view>
    
    <!-- 日期格子 -->
    <view class="calendar-grid">
      <view 
        v-for="(day, index) in calendarDays" 
        :key="index" 
        class="calendar-day"
        :class="{
          'other-month': day.otherMonth,
          'today': day.today,
          'selected': day.selected
        }"
        @click="selectDate(day)"
      >
        <text class="day-text">{{ day.day }}</text>
        <text v-if="day.tip" class="day-tip">{{ day.tip }}</text>
        <view v-if="day.dot" class="day-dot"></view>
      </view>
    </view>
    
    <!-- 底部今天按钮 -->
    <view class="calendar-footer" v-if="showTodayBtn">
      <button class="today-btn" @click="goToToday">今天</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomCalendar',
  props: {
    // 当前选中的日期
    value: {
      type: String,
      default: ''
    },
    // 日期提示数据
    dateTip: {
      type: Object,
      default: () => ({})
    },
    // 带点标记的日期列表
    dotLists: {
      type: Array,
      default: () => ([])
    },
    // 是否显示今天按钮
    showTodayBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentDate: new Date(),
      weekdays: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  computed: {
    // 当前年份
    currentYear() {
      return this.currentDate.getFullYear()
    },
    // 当前月份
    currentMonth() {
      return this.currentDate.getMonth() + 1
    },
    // 日历数据
    calendarDays() {
      return this.generateCalendarDays()
    }
  },
  watch: {
    // 监听外部传入的value变化
    value: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          const [year, month, day] = newVal.split('-').map(Number)
          if (year && month && day) {
            this.currentDate = new Date(year, month - 1, day)
          }
        }
      }
    }
  },
  methods: {
    // 生成日历数据
    generateCalendarDays() {
      const year = this.currentYear
      const month = this.currentMonth
      const today = new Date()
      const todayStr = this.formatDate(today)
      const selectedDate = this.value || todayStr
      
      // 获取当月第一天
      const firstDay = new Date(year, month - 1, 1)
      // 获取当月最后一天
      const lastDay = new Date(year, month, 0)
      // 获取当月第一天是星期几
      const firstDayOfWeek = firstDay.getDay()
      // 获取当月的总天数
      const daysInMonth = lastDay.getDate()
      
      const days = []
      
      // 添加上个月的日期
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, -i)
        const dateStr = this.formatDate(date)
        days.push({
          date: dateStr,
          day: date.getDate(),
          otherMonth: true,
          today: dateStr === todayStr,
          selected: dateStr === selectedDate,
          tip: this.dateTip[dateStr],
          dot: this.dotLists.includes(dateStr)
        })
      }
      
      // 添加当月的日期
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month - 1, i)
        const dateStr = this.formatDate(date)
        days.push({
          date: dateStr,
          day: i,
          otherMonth: false,
          today: dateStr === todayStr,
          selected: dateStr === selectedDate,
          tip: this.dateTip[dateStr],
          dot: this.dotLists.includes(dateStr)
        })
      }
      
      // 添加下个月的日期，补齐42个格子（6行7列）
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month, i)
        const dateStr = this.formatDate(date)
        days.push({
          date: dateStr,
          day: i,
          otherMonth: true,
          today: dateStr === todayStr,
          selected: dateStr === selectedDate,
          tip: this.dateTip[dateStr],
          dot: this.dotLists.includes(dateStr)
        })
      }
      
      return days
    },
    
    // 格式化日期为YYYY-MM-DD
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    // 切换到上个月
    prevMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth - 2, 1)
    },
    
    // 切换到下个月
    nextMonth() {
      this.currentDate = new Date(this.currentYear, this.currentMonth, 1)
    },
    
    // 选择日期
    selectDate(day) {
      if (day.otherMonth) return
      
      this.$emit('change', {
        fulldate: day.date,
        year: day.date.split('-')[0],
        month: day.date.split('-')[1],
        day: day.date.split('-')[2]
      })
    },
    
    // 跳转到今天
    goToToday() {
      const today = new Date()
      this.currentDate = today
      const todayStr = this.formatDate(today)
      
      this.$emit('change', {
        fulldate: todayStr,
        year: todayStr.split('-')[0],
        month: todayStr.split('-')[1],
        day: todayStr.split('-')[2]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-calendar {
  background-color: #fff;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 32rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .header-left,
    .header-right {
      padding: 10rpx;
    }
    
    .header-center {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
  }
  
  .weekdays {
    display: flex;
    padding: 20rpx 0;
    background-color: #f8f8f8;
    
    .weekday {
      flex: 1;
      text-align: center;
      font-size: 28rpx;
      color: #666;
    }
  }
  
  .calendar-grid {
    display: flex;
    flex-wrap: wrap;
    padding: 10rpx;
    
    .calendar-day {
      width: calc(100% / 7);
      height: 100rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 5rpx 0;
      
      .day-text {
        font-size: 32rpx;
        color: #333;
      }
      
      .day-tip {
        font-size: 20rpx;
        color: #ff6b81;
        position: absolute;
        bottom: 10rpx;
      }
      
      .day-dot {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        background-color: #ff6b81;
        position: absolute;
        bottom: 10rpx;
      }
      
      &.other-month {
        opacity: 0.3;
      }
      
      &.today {
        .day-text {
          color: #ff6b81;
          font-weight: bold;
        }
      }
      
      &.selected {
        background-color: #ff6b81;
        border-radius: 50%;
        
        .day-text {
          color: #fff;
          font-weight: bold;
        }
        
        .day-tip {
          color: #fff;
        }
      }
    }
  }
  
  .calendar-footer {
    padding: 20rpx;
    text-align: center;
    
    .today-btn {
      background-color: #ff6b81;
      color: #fff;
      font-size: 28rpx;
      padding: 16rpx 40rpx;
      border-radius: 30rpx;
    }
  }
}
</style>