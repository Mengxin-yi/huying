<template>
	<view class="page">
		<view class="form">
			<!-- 标题 -->
			<view class="form__district">
				<text class="form__label"><text class="form__required">*</text>标题</text>
				<textarea class="form__textarea" placeholder="请输入标题" v-model="form.title" auto-height />
			</view>

			<!-- 内容 -->
			<view class="form__district">
				<text class="form__label"><text class="form__required form__required--fake">*</text>内容</text>
				<textarea class="form__textarea form__textarea--content" placeholder="请输入内容" v-model="form.content" auto-height />
			</view>

			<!-- 紧急程度 -->
			<view class="form__district form__district--row">
				<text class="form__label"><text class="form__required form__required--fake">*</text>紧急程度</text>
				<up-rate v-model="form.emergent" :count="5" active-color="#e6a23c" inactive-color="#dcdfe6" size="20" />
			</view>

			<!-- 重要程度 -->
			<view class="form__district form__district--row">
				<text class="form__label"><text class="form__required form__required--fake">*</text>重要程度</text>
				<up-rate v-model="form.severe" :count="5" active-color="#f56c6c" inactive-color="#dcdfe6" size="20" />
			</view>

			<!-- 计划时间 -->
			<view class="form__district">
				<view class="form__row">
					<text class="form__label"><text class="form__required">*</text>计划时间</text>
					<view class="form__push">
						<text>提醒我</text>
						<up-switch v-model="pushEnabled" @change="onPushChange"></up-switch>
					</view>
				</view>
				<DateTimePicker
					v-model="form.remind_time"
					:start="limitStart"
					:end="limitEnd"
					placeholder="点击选择提醒日期"
				/>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="form__actions">
			<button type="primary" class="form__btn" @click="handleSubmit">提 交</button>
			<button type="default" class="form__btn form__btn--reset" @click="handleReset">重 置</button>
		</view>

	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { addNote } from '@/api/modules/task.js'
import DateTimePicker from '@/components/DateTimePicker.vue'
import { useUserStore } from '@/store/modules/user.js'

const userStore = useUserStore()

/** 是否为会员（从 store 获取） */
const isVip = userStore.isVip
const pushEnabled = ref(false)

/** 表单数据 */
const form = ref({
	title: '',
	content: '',
	emergent: 0,
	severe: 0,
	remind_time: '',
	news_set: 0,
	data_type: '1',
	data_id: 0
})

/** 日期限制范围 */
const limitStart = ref('')
const limitEnd = ref('')

/** 格式化日期为 yyyy-MM-dd HH:mm */
function formatDateTime(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** 初始化日期范围 */
function initDateRange() {
	const now = new Date()
	limitStart.value = formatDateTime(now).substring(0, 16)
	const end = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate())
	limitEnd.value = formatDateTime(end).substring(0, 16)
}

/** 初始化默认时间：当前时间+5分钟，分钟取整到5的倍数 */
function initDefaultTime(date) {
	const now = new Date()
	const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
	if (date && date !== todayStr) {
		form.value.remind_time = `${date} 08:00`
		return
	}
	now.setMinutes(now.getMinutes() + 5)
	now.setSeconds(0, 0)
	form.value.remind_time = formatDateTime(now).substring(0, 16)
}

/** 提醒开关变化 */
function onPushChange(e) {
	if (e && !isVip) {
		pushEnabled.value = false
		uni.showModal({
			title: '提示',
			content: '该功能只对会员开放!',
			showCancel: false,
			confirmText: '知道了'
		})
		return
	}
	form.value.news_set = e ? 1 : 0
}

/** 提交表单 */
async function handleSubmit() {
	const f = form.value
	if (!f.title.trim()) {
		if (f.content) {
			f.title = f.content.substring(0, 10)
		} else {
			uni.showToast({ title: '请输入标题', icon: 'none' })
			return
		}
	}

	if (!f.remind_time) {
		uni.showToast({ title: '请选择计划时间', icon: 'none' })
		return
	}

	// weight = 紧急*10 + 重要
	const weight = (f.emergent || 0) * 10 + (f.severe || 0)
	let remindTime = f.remind_time
	if (remindTime.length < 18) {
		remindTime += ':00'
	}

	try {
		await addNote({
			title: f.title,
			content: f.content || '',
			remind_time: remindTime,
			weight,
			data_type: f.data_type,
			data_id: f.data_id,
			news_set: f.news_set
		})
		uni.showToast({ title: '新增成功', icon: 'success' })
		setTimeout(() => uni.navigateBack(), 1500)
	} catch (err) {
		uni.showToast({ title: String(err), icon: 'none' })
	}
}

/** 重置表单 */
function handleReset() {
	form.value = {
		title: '',
		content: '',
		emergent: 0,
		severe: 0,
		remind_time: '',
		news_set: 0,
		data_type: '1',
		data_id: 0
	}
	pushEnabled.value = false
	initDefaultTime(limitStart.value?.substring(0, 10))
}

onLoad((options) => {
	initDateRange()
	const date = options?.date || ''
	initDefaultTime(date)
})
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: $bg-color;
	display: flex;
	flex-direction: column;
}

.form {
	background-color: #fff;
	margin: $spacing-md;
	border-radius: $uni-border-radius-lg;
	overflow: hidden;

	&__district {
		position: relative;
		padding: 30rpx 32rpx;

		& + &::before {
			content: '';
			position: absolute;
			left: 32rpx;
			right: 32rpx;
			top: 0;
			height: 1rpx;
			background-color: #f0f0f0;
		}

		/* 星级评分项：标签和星星在同一行 */
		&--row {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	&__label {
		font-size: 28rpx;
		color: $uni-text-color;
		font-weight: 500;
		flex-shrink: 0;
	}

	&__required {
		color: #f56c6c;

		&--fake {
			opacity: 0;
		}
	}

	&__textarea {
		width: 100%;
		margin-top: 16rpx;
		font-size: 28rpx;
		color: $uni-text-color;
		line-height: 1.6;
		box-sizing: border-box;

		&--content {
			min-height: 120rpx;
		}
	}

	&__row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	&__push {
		display: flex;
		align-items: center;
		gap: 12rpx;
		font-size: 26rpx;
		color: $uni-text-color-grey;
	}

	&__actions {
		padding: 0 $spacing-md;
	}

	&__btn {
		margin: 20rpx 32rpx 0;
		border-radius: 12rpx;

		&--reset {
			margin-top: 16rpx;
			margin-bottom: 40rpx;
		}
	}
}
</style>
