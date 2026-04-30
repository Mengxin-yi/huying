<template>
	<view class="page">
		<!-- 用户 VIP 信息头部卡片 -->
		<view class="mall-header">
			<view class="mall-header__user">
				<!-- 头像 -->
				<image
					v-if="userAvatar"
					class="mall-header__avatar"
					:src="userAvatar"
					mode="aspectFill"
				/>
				<view v-else class="mall-header__avatar mall-header__avatar--placeholder">
					<u-icon name="account-fill" size="40" color="#ccc"></u-icon>
				</view>
				<!-- 用户名 & VIP 标签 -->
				<view class="mall-header__info">
					<view class="mall-header__name-row">
						<text class="mall-header__name">{{ userStore.username }}</text>
						<view class="mall-header__badge" v-if="vipLabel !== '普通用户'">
							<text class="mall-header__badge-text">{{ vipLabel }}</text>
						</view>
					</view>
					<!-- 当前服务信息 -->
					<view class="mall-header__service" v-if="vipLabel !== '普通用户' && currentOrder">
						<view class="mall-header__service-row">
							<view class="mall-header__service-tag">
								<text class="mall-header__service-tag-text">{{ currentOrder.service }}</text>
							</view>
							<text class="mall-header__service-type">{{ currentOrder.service_type }}</text>
						</view>
						<!-- 按时间 -->
						<view v-if="currentOrder.method === 'time' && currentOrder.end_time" class="mall-header__detail">
							<text class="mall-header__detail-text">有效期至 {{ currentOrder.end_time }}</text>
						</view>
						<!-- 按流量 -->
						<view v-if="currentOrder.method === 'num'" class="mall-header__detail">
							<text class="mall-header__detail-text">剩余 {{ currentOrder.flow_num }} / {{ currentOrder.num }} 次</text>
						</view>
					</view>
					<view class="mall-header__service" v-else-if="vipLabel !== '普通用户' && vipDueTime">
						<view class="mall-header__detail">
							<text class="mall-header__detail-text">有效期至 {{ vipDueTime }}</text>
						</view>
					</view>
					<view class="mall-header__no-vip" v-else>
						<text class="mall-header__no-vip-text">暂未开通会员服务</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 分类筛选 -->
		<view class="mall-tabs">
			<view class="mall-tabs__hint">
				<text class="mall-tabs__hint-text">选择最适合您的计划</text>
			</view>
			<view class="mall-tabs__list">
				<view
					v-for="(tab, idx) in tabList"
					:key="idx"
					class="mall-tabs__item"
					:class="{ 'mall-tabs__item--active': activeTab === idx }"
					@click="handleTabChange(idx)"
				>
					<text class="mall-tabs__item-text">{{ tab.label }}</text>
				</view>
			</view>
		</view>

		<!-- 产品列表 -->
		<view class="mall-goods" v-if="productList.length > 0">
			<scroll-view scroll-x class="mall-goods__scroll">
				<view class="mall-goods__list">
					<view
						v-for="(item, index) in productList"
						:key="item.id || index"
						class="goods-card"
						@click="handleBuy(item, index)"
					>
						<!-- 左侧色条装饰 -->
						<view class="goods-card__accent" :style="{ background: accentColors[index % accentColors.length] }"></view>

						<!-- 产品名称 + 价格 -->
						<view class="goods-card__header">
							<view class="goods-card__title-area">
								<text class="goods-card__name">{{ item.name }}</text>
								<text class="goods-card__type" v-if="item.vip_type">{{ item.vip_type }}</text>
							</view>
							<text class="goods-card__price">
								¥{{ item.name === 'VIP会员(单次卡)' ? (item.price * buyCount) : item.price }}
							</text>
						</view>

						<!-- 单次卡数量选择器 -->
						<view class="goods-card__counter" v-if="item.name === 'VIP会员(单次卡)'" @click.stop>
							<text class="goods-card__counter-label">购买次数</text>
							<u-number-box v-model="buyCount" :min="1" :step="1" @change="onCountChange"></u-number-box>
						</view>

						<!-- 产品描述 -->
						<view class="goods-card__desc" v-if="item.intro">
							<rich-text :nodes="item.intro"></rich-text>
						</view>

						<!-- 底部购买按钮 -->
						<view class="goods-card__footer">
							<view class="goods-card__buy-btn">
								<text class="goods-card__buy-btn-text">立即购买</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 空状态 -->
		<PageEmpty v-else-if="!loading" text="暂无可购买的商品" />

		<!-- 加载状态 -->
		<PageLoading v-if="loading" />
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user.js'
import { commonApi } from '@/api/index.js'
import PageEmpty from '@/components/PageEmpty.vue'
import PageLoading from '@/components/PageLoading.vue'

/** 用户 store */
const userStore = useUserStore()

/** 页面加载状态 */
const loading = ref(false)

/** VIP 信息 */
const vipData = ref({})

/** VIP 等级标签 */
const vipLabel = computed(() => vipData.value.item?.current_vip_label || '普通用户')

/** VIP 到期时间 */
const vipDueTime = computed(() => vipData.value.item?.due_time || '')

/** 当前订单 */
const currentOrder = computed(() => vipData.value.current_order || null)

/** 用户头像 */
const userAvatar = computed(() => {
	const url = vipData.value.item?.avatar_img || userStore.avatar || ''
	if (!url) return ''
	if (/^(https?:|data:|\/\/)/.test(url)) return url
	return 'https://ugoo.ugoolink.com' + (url.startsWith('/') ? url : '/' + url)
})

/** 分类 Tab 列表 */
const tabList = [
	{ label: '全部', value: '' },
	{ label: '按周期', value: '会员服务' },
	{ label: '按流量', value: '会员流量包' }
]

/** 当前选中的 Tab 索引 */
const activeTab = ref(0)

/** 产品列表 */
const productList = ref([])

/** 单次卡购买数量 */
const buyCount = ref(1)

/** 产品卡片左侧装饰色条 */
const accentColors = [
	'linear-gradient(180deg, #007AFF, #58A5FF)',
	'linear-gradient(180deg, #FF9500, #FFB84D)',
	'linear-gradient(180deg, #34C759, #6DD98E)',
	'linear-gradient(180deg, #AF52DE, #C77DEB)'
]

/**
 * 加载页面数据
 */
async function fetchData() {
	loading.value = true
	try {
		// 获取 VIP 信息
		const vipRes = await commonApi.getUserVip()
		vipData.value = vipRes || {}
		// 加载产品列表
		await loadProductList()
	} catch (err) {
		uni.showToast({ title: err?.message || '加载失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

/**
 * 加载产品列表
 * 根据 activeTab 筛选类型：全部=加载所有类型并合并，否则只加载对应类型
 */
async function loadProductList() {
	const tabValue = tabList[activeTab.value].value
	let list = []

	try {
		if (activeTab.value === 0) {
			// 全部：加载优惠券 + 会员服务 + 会员流量包 + VIP会员
			const couponItems = await loadCouponData()
			list = list.concat(couponItems)
			// 加载会员服务
			const serviceRes = await commonApi.getVipList({ vip_type: '会员服务' })
			list = list.concat(serviceRes?.items || [])
			// 加载会员流量包
			const flowRes = await commonApi.getVipList({ vip_type: '会员流量包' })
			list = list.concat(flowRes?.items || [])
			// 加载 VIP会员
			const vipRes = await commonApi.getVipList({ vip_type: 'VIP会员' })
			list = list.concat(vipRes?.items || [])
		} else {
			// 按类型加载
			const res = await commonApi.getVipList({ vip_type: tabValue })
			list = res?.items || []
		}
		productList.value = list
	} catch (err) {
		uni.showToast({ title: err?.message || '加载商品列表失败', icon: 'none' })
	}
}

/**
 * 加载优惠券数据（仅在"全部"Tab 下加载）
 * @returns {Promise<Array>} 优惠券列表
 */
async function loadCouponData() {
	try {
		const res = await commonApi.getMyCouponList?.({
			has_used: -1,
			overdue: -1
		})
		if (!res?.items?.length) return []
		// 为优惠券补充 intro 详情
		const items = res.items.map(m => ({
			...m,
			name: m.card_type
		}))
		// 异步加载优惠券详情，不阻塞主流程
		items.forEach(e => {
			commonApi.getCouponDetail?.({ pk: e.card_id }).then(detail => {
				const match = items.find(x => x.card_id === detail?.item?.id)
				if (match) match.intro = detail.item.intro
			}).catch(() => {})
		})
		return items
	} catch {
		return []
	}
}

/**
 * 切换分类 Tab
 * @param {number} idx - Tab 索引
 */
function handleTabChange(idx) {
	if (activeTab.value === idx) return
	activeTab.value = idx
	productList.value = []
	loadProductList()
}

/**
 * 单次卡数量变更回调
 */
function onCountChange() {
	// buyCount 通过 v-model 自动更新，此处无需额外处理
}

/**
 * 点击购买商品
 * @param {Object} item - 商品数据
 * @param {number} index - 列表索引
 */
async function handleBuy(item, index) {
	// 优惠券类型暂不支持直接购买
	if (item.card_type) {
		uni.showToast({ title: '该优惠券暂不支持购买', icon: 'none' })
		return
	}

	uni.showLoading({ title: '正在发起支付...' })
	try {
		const res = await commonApi.getPayConfig({
			pk: item.id,
			name: item.name,
			vip_type: item.vip_type,
			price: item.price,
			method: item.method,
			num: item.num,
			is_immediate: item.is_immediate,
			vip_level: item.vip_level,
			buy_num: item.name === 'VIP会员(单次卡)' ? buyCount.value : 1
		})
		uni.hideLoading()

		const payInfo = res.item || res
		// 调用微信支付（参考 huying_board 的支付逻辑）
		callWxPay(payInfo, item)
	} catch (err) {
		uni.hideLoading()
		// openid 相关错误：用户未绑定微信
		const errMsg = typeof err === 'string' ? err : (err?.message || '')
		if (errMsg.indexOf('openid') > -1) {
			uni.showModal({
				title: '提示',
				content: '无用户微信授权信息，请先在「我的-设置-微信绑定」中绑定微信后再购买',
				confirmText: '去绑定',
				success: (res) => {
					if (res.confirm) {
						uni.navigateTo({ url: '/pages/prefer/wechat-bind' })
					}
				}
			})
		} else {
			uni.showToast({ title: errMsg || '发起支付失败', icon: 'none' })
		}
	}
}

/**
 * 调用微信 JSAPI 支付
 * 参考 huying_board 的 WeixinJSBridge 调用方式，不使用条件编译
 * @param {Object} payInfo - 支付参数（后端返回）
 * @param {Object} item - 商品数据（用于支付成功后的提示）
 */
function callWxPay(payInfo, item) {
	// 支付回调函数
	const onPayReady = () => {
		WeixinJSBridge.invoke(
			'getBrandWCPayRequest',
			{
				appId: payInfo.appid,
				timeStamp: String(payInfo.timeStamp),
				nonceStr: payInfo.nonceStr,
				package: 'prepay_id=' + payInfo.prepay_id,
				signType: 'MD5',
				paySign: payInfo.sign
			},
			(wxRes) => {
				if (wxRes.err_msg === 'get_brand_wcpay_request:ok' || wxRes.err_msg.indexOf(':ok') > -1) {
					// 支付成功
					const msg = item.is_immediate === 1
						? '支付成功'
						: '支付成功，请在[我的会员]界面启用服务'
					uni.showModal({
						content: msg,
						showCancel: false,
						success: () => {
							uni.navigateTo({ url: '/pages/prefer/vip' })
						}
					})
					// 刷新数据
					fetchData()
				} else {
					uni.showToast({ title: '支付失败', icon: 'none' })
				}
			}
		)
	}

	// 检测 WeixinJSBridge 是否可用
	if (typeof window !== 'undefined' && window.WeixinJSBridge) {
		onPayReady()
	} else if (typeof document !== 'undefined') {
		// WeixinJSBridge 尚未就绪，监听 ready 事件
		document.addEventListener('WeixinJSBridgeReady', onPayReady, false)
		// 超时保护：3秒后如果还没就绪则提示
		setTimeout(() => {
			document.removeEventListener('WeixinJSBridgeReady', onPayReady)
			if (!window.WeixinJSBridge) {
				uni.showToast({ title: '请使用微信打开本应用完成支付', icon: 'none' })
			}
		}, 3000)
	} else {
		uni.showToast({ title: '请使用微信打开本应用完成支付', icon: 'none' })
	}
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
		padding: $spacing-md;
}

/* ========== 头部 VIP 信息 - 浅色系 ========== */
.mall-header {

	background-color: $card-bg;
	border-radius: $card-radius;
	padding: $spacing-lg;
	box-shadow: $shadow-light;
}

.mall-header__user {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
}

.mall-header__avatar {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	flex-shrink: 0;
	border: 4rpx solid rgba(0, 122, 255, 0.2);
	background-color: #f0f0f0;
}

.mall-header__avatar--placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
}

.mall-header__info {
	margin-left: $spacing-md;
	flex: 1;
}

.mall-header__name-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: $spacing-xs;
}

.mall-header__name {
	font-size: 34rpx;
	font-weight: 600;
	color: $text-color;
}

.mall-header__badge {
	margin-left: $spacing-sm;
	background: linear-gradient(135deg, #FFD700, #FFA500);
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.mall-header__badge-text {
	font-size: 22rpx;
	color: #fff;
	font-weight: 600;
}

/* 当前服务信息 */
.mall-header__service {
	margin-top: $spacing-sm;
}

.mall-header__service-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: $spacing-sm;
	margin-bottom: $spacing-xs;
}

.mall-header__service-tag {
	background-color: rgba(0, 122, 255, 0.1);
	padding: 4rpx 16rpx;
	border-radius: 8rpx;
}

.mall-header__service-tag-text {
	font-size: 24rpx;
	color: $primary-color;
	font-weight: 500;
}

.mall-header__service-type {
	font-size: 22rpx;
	color: $text-color-weak;
}

.mall-header__detail {
	margin-top: $spacing-xs;
}

.mall-header__detail-text {
	font-size: 24rpx;
	color: $text-color-secondary;
}

.mall-header__no-vip {
	margin-top: $spacing-sm;
}

.mall-header__no-vip-text {
	font-size: 26rpx;
	color: $text-color-weak;
}

/* ========== 分类筛选 ========== */
.mall-tabs {
	margin-top: $spacing-md;
	background-color: $card-bg;
	border-radius: $card-radius;
	padding: $spacing-md $spacing-lg;
	box-shadow: $shadow-light;
}

.mall-tabs__hint {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: $spacing-md;
}

.mall-tabs__hint-text {
	font-size: 28rpx;
	color: $text-color-weak;
}

.mall-tabs__list {
	display: flex;
	flex-direction: row;
	background-color: $bg-color;
	border-radius: 12rpx;
	padding: 4rpx;
}

.mall-tabs__item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 8rpx 0;
	border-radius: 10rpx;
	transition: all 0.2s ease;
}

.mall-tabs__item--active {
	background-color: $card-bg;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.mall-tabs__item-text {
	font-size: 28rpx;
	color: $text-color-secondary;
}

.mall-tabs__item--active .mall-tabs__item-text {
	color: $primary-color;
	font-weight: 600;
}

/* ========== 商品列表 ========== */
.mall-goods {
	margin-top: $spacing-md;
}

.mall-goods__scroll {
	white-space: nowrap;
	width: 100%;
}

.mall-goods__list {
	display: flex;
	flex-direction: row;
	
	gap: $spacing-md;
}

/* ========== 商品卡片 - 浅色系 ========== */
.goods-card {
	position: relative;
	display: inline-flex;
	flex-direction: column;
	min-width: 480rpx;
	max-width: 480rpx;
	background-color: $card-bg;
	border-radius: $card-radius;
	padding: $spacing-lg;
	flex-shrink: 0;
	box-shadow: $shadow-light;
	overflow: hidden;
	border: 1rpx solid rgba(0, 0, 0, 0.04);
}

/* 左侧色条装饰 */
.goods-card__accent {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 8rpx;
	border-radius: $card-radius 0 0 $card-radius;
}

/* 卡片头部：名称 + 价格 */
.goods-card__header {
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	justify-content: space-between;
	margin-bottom: $spacing-md;
	padding-left: $spacing-sm;
}

.goods-card__title-area {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
	flex: 1;
	margin-right: $spacing-sm;
}

.goods-card__name {
	font-size: 30rpx;
	font-weight: 600;
	color: $text-color;
}

.goods-card__type {
	font-size: 22rpx;
	color: $text-color-weak;
}

.goods-card__price {
	font-size: 34rpx;
	font-weight: 700;
	color: $primary-color;
	white-space: nowrap;
}

/* 数量选择器 */
.goods-card__counter {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: #FAFBFE;
	border-radius: 12rpx;
	padding: $spacing-sm $spacing-md;
	margin-bottom: $spacing-md;
	margin-left: $spacing-sm;
	border: 1rpx solid rgba(0, 122, 255, 0.1);
}

.goods-card__counter-label {
	font-size: 24rpx;
	color: $text-color-secondary;
}

/* 产品描述 */
.goods-card__desc {
	font-size: 24rpx;
	color: $text-color-secondary;
	line-height: 1.6;
	overflow: hidden;
	margin-left: $spacing-sm;
	margin-bottom: $spacing-md;
}

/* 底部购买按钮 */
.goods-card__footer {
	display: flex;
	justify-content: flex-end;
	padding-left: $spacing-sm;
}

.goods-card__buy-btn {
	background-color: $primary-color;
	padding: 12rpx 32rpx;
	border-radius: $btn-radius;
}

.goods-card__buy-btn-text {
	font-size: 24rpx;
	color: #fff;
	font-weight: 500;
}
</style>
