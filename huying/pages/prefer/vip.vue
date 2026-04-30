<template>
	<view class="page">
		<!-- 用户 VIP 信息头部卡片 -->
		<view class="vip-header">
			<view class="vip-header__user">
				<!-- 头像 -->
				<image
					v-if="vipAvatar"
					class="vip-header__avatar"
					:src="vipAvatar"
					mode="aspectFill"
				/>
				<view v-else class="vip-header__avatar vip-header__avatar--placeholder">
					<u-icon name="account-fill" size="40" color="#ccc"></u-icon>
				</view>
				<!-- 用户名 & VIP 标签 -->
				<view class="vip-header__info">
					<view class="vip-header__name-row">
						<text class="vip-header__name">{{ vipItem.surname || userStore.username }}</text>
						<view class="vip-header__badge" v-if="vipItem.current_vip_label">
							<text class="vip-header__badge-text">{{ vipItem.current_vip_label }}</text>
						</view>
					</view>
					<!-- 当前服务信息：用 user_vip_info 返回的 current_order -->
					<view class="vip-header__service" v-if="vipData.current_order">
						<view class="vip-header__service-row">
							<view class="vip-header__service-tag">
								<text class="vip-header__service-tag-text">{{ vipData.current_order.service }}</text>
							</view>
							<text class="vip-header__service-type">{{ vipData.current_order.service_type }}</text>
						</view>
						<!-- 按时间 -->
						<view v-if="vipData.current_order.method === 'time' && vipData.current_order.end_time" class="vip-header__detail">
							<text class="vip-header__detail-text">有效期至 {{ vipData.current_order.end_time }}</text>
						</view>
						<!-- 按流量 -->
						<view v-if="vipData.current_order.method === 'num'" class="vip-header__detail">
							<text class="vip-header__detail-text">剩余 {{ vipData.current_order.flow_num }} / {{ vipData.current_order.num }} 次</text>
						</view>
					</view>
					<!-- 无 current_order 时用 item 里的到期时间 -->
					<view class="vip-header__service" v-else-if="vipItem.due_time">
						<view class="vip-header__detail">
							<text class="vip-header__detail-text">有效期至 {{ vipItem.due_time }}</text>
						</view>
					</view>
					<view class="vip-header__no-vip" v-else>
						<text class="vip-header__no-vip-text">暂未开通会员服务</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 已购服务列表 -->
		<view class="vip-section" v-if="orderList.length > 0">
			<view class="vip-section__title">
				<text class="vip-section__title-text">已购服务</text>
				<text class="vip-section__title-count">{{ orderList.length }} 项</text>
			</view>

			<view
				class="service-card"
				v-for="(item, index) in orderList"
				:key="item.id || index"
			>
				<!-- 状态角标 -->
				<view class="service-card__status" :class="item.has_used === 1 ? 'service-card__status--active' : 'service-card__status--inactive'">
					<text class="service-card__status-text">{{ item.has_used === 1 ? '已启用' : '未启用' }}</text>
				</view>

				<!-- 服务头部：名称 + 价格 -->
				<view class="service-card__header">
					<view class="service-card__title-area">
						<text class="service-card__name">{{ item.service }}</text>
						<text class="service-card__type">{{ item.service_type }}</text>
					</view>
					<text class="service-card__price">¥{{ item.price }}</text>
				</view>

				<!-- 服务信息行 -->
				<view class="service-card__info-grid">
					<!-- 计费方式 -->
					<view class="service-card__info-item">
						<text class="service-card__info-label">计费方式</text>
						<text class="service-card__info-value">{{ item.method === 'time' ? '按周期' : '按流量' }}</text>
					</view>
					<!-- 数量/周期 -->
					<view class="service-card__info-item">
						<text class="service-card__info-label">{{ item.method === 'time' ? '服务周期' : '总流量' }}</text>
						<text class="service-card__info-value">{{ item.method === 'time' ? item.num + '天' : item.num + '次' }}</text>
					</view>
					<!-- 支付方式 -->
					<view class="service-card__info-item" v-if="item.other_type">
						<text class="service-card__info-label">支付方式</text>
						<text class="service-card__info-value">{{ item.other_type }}</text>
					</view>
					<!-- 剩余流量 -->
					<view class="service-card__info-item" v-if="item.method === 'num'">
						<text class="service-card__info-label">剩余流量</text>
						<text class="service-card__info-value service-card__info-value--highlight">{{ item.flow_num }}次</text>
					</view>
				</view>

				<!-- 有效期/启用时间 -->
				<view class="service-card__time-info">
					<view class="service-card__time-row" v-if="item.start_time">
						<text class="service-card__time-label">生效时间</text>
						<text class="service-card__time-value">{{ item.start_time }}</text>
					</view>
					<view class="service-card__time-row" v-if="item.end_time">
						<text class="service-card__time-label">到期时间</text>
						<text class="service-card__time-value">{{ item.end_time }}</text>
					</view>
					<view class="service-card__time-row" v-if="item.use_time">
						<text class="service-card__time-label">启用时间</text>
						<text class="service-card__time-value">{{ item.use_time }}</text>
					</view>
				</view>

				<!-- 服务描述（可展开/收起） -->
				<view class="service-card__desc" v-if="item.vip_intro">
					<view class="service-card__desc-content" :class="{ 'service-card__desc-content--collapsed': !expandedMap[index] }">
						<rich-text :nodes="item.vip_intro"></rich-text>
					</view>
					<view class="service-card__desc-toggle" @click="toggleExpand(index)">
						<text class="service-card__desc-toggle-text">{{ expandedMap[index] ? '收起' : '查看权益详情' }}</text>
						<u-icon :name="expandedMap[index] ? 'arrow-up' : 'arrow-down'" size="12" color="#999"></u-icon>
					</view>
				</view>

				<!-- 底部操作栏 -->
				<view class="service-card__footer">
					<text class="service-card__footer-time">购买于 {{ item.create_time }}</text>
					<view
						class="service-card__set-btn"
						v-if="item.has_used === 0"
						@click="handleSetStartTime(item)"
					>
						<u-icon name="clock" size="14" color="#007AFF"></u-icon>
						<text class="service-card__set-btn-text">设置启用时间</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<PageEmpty v-else-if="!loading" text="暂无已购服务" />

		<!-- 设置启用时间弹窗 -->
		<u-popup :show="showTimePopup" mode="center" :closeOnClickOverlay="false" round="24">
			<view class="time-popup">
				<view class="time-popup__header">
					<text class="time-popup__title">设置启用时间</text>
				</view>
				<!-- 日历选择 -->
				<view class="time-popup__calendar">
					<CalendarPicker
						ref="calendarRef"
						mode="month"
						@select="onDateSelect"
					/>
				</view>
				<!-- 时间选择 -->
				<view class="time-popup__time-picker">
					<text class="time-popup__time-label">选择时间</text>
					<picker mode="time" :value="selectedTime" @change="onTimeChange">
						<view class="time-popup__time-value">
							<text>{{ selectedTime || '请选择时间' }}</text>
							<u-icon name="arrow-right" size="14" color="#999"></u-icon>
						</view>
					</picker>
				</view>
				<!-- 操作按钮 -->
				<view class="time-popup__actions">
					<view class="time-popup__btn time-popup__btn--cancel" @click="showTimePopup = false">
						<text class="time-popup__btn-text">取消</text>
					</view>
					<view class="time-popup__btn time-popup__btn--confirm" @click="handleSubmitStartTime">
						<text class="time-popup__btn-text time-popup__btn-text--confirm">确定</text>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 加载状态 -->
		<PageLoading v-if="loading" />
	</view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user.js'
import { commonApi } from '@/api/index.js'
import PageEmpty from '@/components/PageEmpty.vue'
import PageLoading from '@/components/PageLoading.vue'
import CalendarPicker from '@/components/CalendarPicker.vue'

/** 用户 store */
const userStore = useUserStore()

/** 页面加载状态 */
const loading = ref(false)

/** VIP 数据 */
const vipData = ref({})

/** 已购服务订单列表（仅支付成功的） */
const orderList = ref([])

/** 展开/收起状态映射 */
const expandedMap = reactive({})

/** VIP 用户信息 item */
const vipItem = computed(() => vipData.value.item || {})

/** VIP 头像（优先用 user_vip_info 返回的 avatar_img） */
const vipAvatar = computed(() => {
	const url = vipItem.value.avatar_img || userStore.avatar || ''
	if (!url) return ''
	// 已经是完整 URL 直接返回
	if (/^(https?:|data:|\/\/)/.test(url)) return url
	// 相对路径补全域名
	return 'https://ugoo.ugoolink.com' + (url.startsWith('/') ? url : '/' + url)
})

/** 时间设置弹窗 */
const showTimePopup = ref(false)

/** 当前正在操作的服务项 */
const currentItem = ref(null)

/** 选中的日期 */
const selectedDate = ref('')

/** 选中的时间 */
const selectedTime = ref('')

/** 日历组件引用 */
const calendarRef = ref(null)

/**
 * 获取页面数据
 */
async function fetchData() {
	loading.value = true
	try {
		// 并行请求 VIP 信息和订单列表
		const [vipRes, orderRes] = await Promise.all([
			commonApi.getUserVip(),
			commonApi.myOrderList({ kw: '', page: 1, size: 1000, start_time: '', end_time: '', other_type: '', state: '' })
		])

		// VIP 信息
		vipData.value = vipRes || {}

		// 优先用 user_vip_info 返回的 order_items，否则用 my_order_list 过滤支付成功的
		if (vipRes?.order_items?.length) {
			orderList.value = vipRes.order_items.filter(x => x.state === '支付成功')
		} else {
			const items = orderRes?.items || []
			orderList.value = items.filter(x => x.state === '支付成功')
		}
	} catch (err) {
		uni.showToast({ title: err?.message || '加载失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

/**
 * 切换服务描述展开/收起
 * @param {number} index - 服务项索引
 */
function toggleExpand(index) {
	expandedMap[index] = !expandedMap[index]
}

/**
 * 点击设置启用时间
 * @param {Object} item - 服务项数据
 */
function handleSetStartTime(item) {
	currentItem.value = item
	// 默认选中今天
	const now = new Date()
	const y = now.getFullYear()
	const m = String(now.getMonth() + 1).padStart(2, '0')
	const d = String(now.getDate()).padStart(2, '0')
	selectedDate.value = `${y}-${m}-${d}`
	selectedTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
	showTimePopup.value = true
}

/**
 * 日历选择日期回调
 * @param {Object} e - { date: 'YYYY-MM-DD' }
 */
function onDateSelect(e) {
	selectedDate.value = e.date
}

/**
 * 时间选择器回调
 * @param {Object} e - picker change 事件
 */
function onTimeChange(e) {
	selectedTime.value = e.detail.value
}

/**
 * 提交启用时间设置
 */
function handleSubmitStartTime() {
	if (!selectedDate.value || !selectedTime.value) {
		uni.showToast({ title: '请选择启用时间', icon: 'none' })
		return
	}

	const timeStr = `${selectedDate.value} ${selectedTime.value}:00`
	const msg = `确定在 ${selectedDate.value} ${selectedTime.value} 启用「${currentItem.value.service}」吗？`

	uni.showModal({
		content: msg,
		showCancel: true,
		success: async (res) => {
			if (res.confirm) {
				try {
					await commonApi.editVipStartTime({
						pk: currentItem.value.id,
						use_time: timeStr
					})
					uni.showToast({ title: '设置成功', icon: 'success' })
					showTimePopup.value = false
					// 刷新数据
					await fetchData()
				} catch (err) {
					uni.showToast({ title: '操作失败：' + (err?.message || ''), icon: 'none' })
				}
			}
		}
	})
}

onMounted(() => {
	fetchData()
})
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background-color: $bg-color;
	padding-bottom: env(safe-area-inset-bottom);
}

/* ========== 头部 VIP 卡片 - 浅色系 ========== */
.vip-header {
	margin: $page-padding;
	background-color: $card-bg;
	border-radius: $card-radius;
	padding: $spacing-lg;
	box-shadow: $shadow-light;
}

.vip-header__user {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
}

.vip-header__avatar {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	flex-shrink: 0;
	border: 4rpx solid rgba(0, 122, 255, 0.2);
	background-color: #f0f0f0;
}

.vip-header__avatar--placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
}

.vip-header__info {
	margin-left: $spacing-md;
	flex: 1;
}

.vip-header__name-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: $spacing-xs;
}

.vip-header__name {
	font-size: 34rpx;
	font-weight: 600;
	color: $text-color;
}

.vip-header__badge {
	margin-left: $spacing-sm;
	background: linear-gradient(135deg, #FFD700, #FFA500);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.vip-header__badge-text {
	font-size: 22rpx;
	color: #fff;
	font-weight: 600;
}

/* 当前服务信息 */
.vip-header__service {
	margin-top: $spacing-sm;
}

.vip-header__service-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: $spacing-sm;
	margin-bottom: $spacing-xs;
}

.vip-header__service-tag {
	background-color: rgba(0, 122, 255, 0.1);
	padding: 4rpx 16rpx;
	border-radius: 8rpx;
}

.vip-header__service-tag-text {
	font-size: 24rpx;
	color: $primary-color;
	font-weight: 500;
}

.vip-header__service-type {
	font-size: 22rpx;
	color: $text-color-weak;
}

.vip-header__detail {
	margin-top: $spacing-xs;
}

.vip-header__detail-text {
	font-size: 24rpx;
	color: $text-color-secondary;
}

.vip-header__no-vip {
	margin-top: $spacing-sm;
}

.vip-header__no-vip-text {
	font-size: 26rpx;
	color: $text-color-weak;
}

/* ========== 服务列表区域 ========== */
.vip-section {
	padding: 0 $page-padding;
	margin-top: $spacing-md;
}

.vip-section__title {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	margin-bottom: $spacing-md;
}

.vip-section__title-text {
	font-size: 32rpx;
	font-weight: 600;
	color: $text-color;
}

.vip-section__title-count {
	font-size: 26rpx;
	color: $text-color-weak;
}

/* ========== 服务卡片 - 浅色系 ========== */
.service-card {
	position: relative;
	background-color: $card-bg;
	border-radius: $card-radius;
	padding: $spacing-lg;
	margin-bottom: $spacing-md;
	box-shadow: $shadow-light;
	overflow: hidden;
	border: 1rpx solid rgba(0, 0, 0, 0.04);
}

/* 状态角标 */
.service-card__status {
	position: absolute;
	top: 0;
	right: 0;
	padding: 8rpx 20rpx;
	border-radius: 0 $card-radius 0 16rpx;
}

.service-card__status--active {
	background: linear-gradient(135deg, #FFD700, #FFA500);
}

.service-card__status--inactive {
	background: linear-gradient(135deg, #E8F4FD, #D6EAF8);
}

.service-card__status-text {
	font-size: 22rpx;
	font-weight: 500;
}

.service-card__status--active .service-card__status-text {
	color: #fff;
}

.service-card__status--inactive .service-card__status-text {
	color: $primary-color;
}

/* 卡片头部：名称 + 价格 */
.service-card__header {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: $spacing-md;
	padding-right: 100rpx;
}

.service-card__title-area {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.service-card__name {
	font-size: 30rpx;
	font-weight: 600;
	color: $text-color;
}

.service-card__type {
	font-size: 22rpx;
	color: $text-color-weak;
}

.service-card__price {
	font-size: 34rpx;
	font-weight: 700;
	color: $primary-color;
}

/* 信息网格 */
.service-card__info-grid {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: $spacing-sm $spacing-lg;
	background-color: #FAFBFE;
	border-radius: 12rpx;
	padding: $spacing-md;
	margin-bottom: $spacing-md;
}

.service-card__info-item {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
	min-width: 140rpx;
}

.service-card__info-label {
	font-size: 22rpx;
	color: $text-color-weak;
}

.service-card__info-value {
	font-size: 26rpx;
	color: $text-color-secondary;
	font-weight: 500;
}

.service-card__info-value--highlight {
	color: $primary-color;
}

/* 时间信息 */
.service-card__time-info {
	display: flex;
	flex-direction: column;
	gap: $spacing-xs;
	margin-bottom: $spacing-md;
	padding: $spacing-sm 0;
	border-top: 1rpx solid $border-color;
	border-bottom: 1rpx solid $border-color;
}

.service-card__time-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: $spacing-sm;
}

.service-card__time-label {
	font-size: 24rpx;
	color: $text-color-weak;
	min-width: 130rpx;
}

.service-card__time-value {
	font-size: 24rpx;
	color: $text-color-secondary;
}

/* 服务描述 */
.service-card__desc {
	margin-bottom: $spacing-md;
}

.service-card__desc-content {
	overflow: hidden;
	transition: max-height 300ms ease;
	font-size: 24rpx;
	color: $text-color-secondary;
	line-height: 1.7;
}

.service-card__desc-content--collapsed {
	max-height: 80rpx;
}

.service-card__desc-toggle {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	gap: 4rpx;
	margin-top: $spacing-xs;
}

.service-card__desc-toggle-text {
	font-size: 24rpx;
	color: $primary-color;
}

/* 底部操作栏 */
.service-card__footer {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}

.service-card__footer-time {
	font-size: 22rpx;
	color: $text-color-weak;
}

.service-card__set-btn {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 6rpx;
	padding: 10rpx 20rpx;
	background-color: rgba(0, 122, 255, 0.06);
	border-radius: 24rpx;
	border: 1rpx solid rgba(0, 122, 255, 0.15);
}

.service-card__set-btn-text {
	font-size: 24rpx;
	color: $primary-color;
}

/* ========== 时间设置弹窗 ========== */
.time-popup {
	padding: $spacing-lg;
	width: 680rpx;
	max-height: 80vh;
	overflow-y: auto;
}

.time-popup__header {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: $spacing-lg;
}

.time-popup__title {
	font-size: 36rpx;
	font-weight: 600;
	color: $text-color;
}

.time-popup__calendar {
	margin-bottom: $spacing-md;
}

.time-popup__time-picker {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: $spacing-md;
	background-color: $bg-color;
	border-radius: $card-radius;
	margin-bottom: $spacing-lg;
}

.time-popup__time-label {
	font-size: 28rpx;
	color: $text-color;
}

.time-popup__time-value {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: $spacing-xs;
	font-size: 28rpx;
	color: $primary-color;
}

.time-popup__actions {
	display: flex;
	flex-direction: row;
	gap: $spacing-md;
}

.time-popup__btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 88rpx;
	border-radius: $btn-radius;
}

.time-popup__btn--cancel {
	background-color: $bg-color;
}

.time-popup__btn--confirm {
	background-color: $primary-color;
}

.time-popup__btn-text {
	font-size: 30rpx;
	color: $text-color-secondary;
}

.time-popup__btn-text--confirm {
	color: #fff;
	font-weight: 500;
}
</style>
