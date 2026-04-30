<template>
	<view class="page">
		<!-- 空状态 -->
		<PageEmpty v-if="!loading && list.length === 0" />

		<!-- 订单时间线列表 -->
		<scroll-view
			v-else
			class="order-scroll"
			scroll-y
			enableBackToTop
			refresher-enabled
			:refresher-triggered="refreshing"
			@refresherrefresh="onRefresh"
		>
			<view
				v-for="(item, index) in list"
				:key="index"
				class="order-card"
			>
				<!-- 时间线指示条 -->
				<view class="order-card__timeline">
					<view
						class="order-card__dot"
						:style="{
							backgroundColor: item.state === '支付成功' ? '#007AFF' : '#e5e5e5',
							width: item.state === '支付成功' ? '20rpx' : '16rpx',
							height: item.state === '支付成功' ? '20rpx' : '16rpx'
						}"
					/>
					<view
						v-if="index < list.length - 1"
						class="order-card__line"
						:style="{ backgroundColor: item.state === '支付成功' ? '#007AFF' : '#e5e5e5' }"
					/>
				</view>

				<!-- 卡片内容区 -->
				<view class="order-card__body">
					<!-- 日期标题（可点击展开/收起） -->
					<view class="order-card__header" @click="toggleItem(index)">
						<text class="order-card__date">{{ item.result_time }}</text>
						<view
							class="order-card__arrow"
							:class="{ 'order-card__arrow--expanded': expandedIndex === index }"
						>
							<u-icon name="arrow-down" size="14" color="#999" />
						</view>
					</view>

					<!-- 展开详情 -->
					<view v-if="expandedIndex === index" class="order-card__detail order-card__detail--anim">
						<!-- 支付结果 -->
						<view class="order-card__row">
							<text class="order-card__label">支付结果</text>
							<text
								class="order-card__value"
								:class="{ 'order-card__value--success': item.state === '支付成功' }"
							>
								{{ item.state }}
							</text>
						</view>

						<!-- 订单编号 -->
						<view class="order-card__row">
							<text class="order-card__label">订单编号</text>
							<text class="order-card__value order-card__value--number">{{ item.number }}</text>
						</view>

						<!-- 商品名称 -->
						<view class="order-card__row">
							<text class="order-card__label">商品名称</text>
							<text class="order-card__value">{{ item.service }}</text>
						</view>

						<!-- 服务类型/编码 -->
						<view class="order-card__row">
							<text class="order-card__label">服务类型/编码</text>
							<text class="order-card__value">{{ item.service_type }}</text>
						</view>

						<!-- 激活时间 -->
						<view class="order-card__row" v-if="item.start_time">
							<text class="order-card__label">激活时间</text>
							<text class="order-card__value">{{ item.start_time }}</text>
						</view>

						<!-- 有效时间 -->
						<view class="order-card__row" v-if="item.end_time">
							<text class="order-card__label">有效时间</text>
							<text class="order-card__value">{{ item.end_time }}</text>
						</view>

						<!-- 推送次数 -->
						<view class="order-card__row" v-if="item.msg_num">
							<text class="order-card__label">推送次数</text>
							<text class="order-card__value">{{ item.msg_num }}</text>
						</view>

						<!-- 原来次数 -->
						<view class="order-card__row" v-if="item.raw_flow_num">
							<text class="order-card__label">原来次数</text>
							<text class="order-card__value">{{ item.raw_flow_num }}</text>
						</view>

						<!-- 剩余次数 -->
						<view class="order-card__row" v-if="item.flow_num">
							<text class="order-card__label">剩余次数</text>
							<text class="order-card__value">{{ item.flow_num }}</text>
						</view>

						<!-- 订单价格 -->
						<view class="order-card__row">
							<text class="order-card__label">订单价格(元)</text>
							<text class="order-card__value order-card__value--price">
								{{ formatPrice(item.price) }}
							</text>
						</view>

						<!-- 申请开票 -->
						<view class="order-card__row order-card__row--action" @click="handleInvoice(item)">
							<text class="order-card__label">申请开票</text>
							<u-icon name="arrow-right" size="14" color="#999"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onShow, onPullDownRefresh } from '@dcloudio/uni-app'
	import { commonApi } from '@/api/index.js'
	import PageEmpty from '@/components/PageEmpty.vue'

	/** 订单列表数据 */
	const list = ref([])

	/** 加载状态 */
	const loading = ref(false)

	/** 下拉刷新状态 */
	const refreshing = ref(false)

	/** 当前展开的卡片索引（-1 表示全部收起） */
	const expandedIndex = ref(-1)

	/**
	 * 获取我的订单列表
	 */
	const getData = async () => {
		if (loading.value) return
		loading.value = true
		try {
			const res = await commonApi.myOrderList()
			// 仅显示支付成功的订单
			list.value = (res.items || []).filter(x => x.state === '支付成功')
		} catch (err) {
			// 错误已在 request 层处理
		} finally {
			loading.value = false
			refreshing.value = false
		}
	}

	/**
	 * 切换卡片展开/收起
	 * @param {number} index - 卡片索引
	 */
	const toggleItem = (index) => {
		expandedIndex.value = expandedIndex.value === index ? -1 : index
	}

	/**
	 * 格式化价格显示
	 * @param {number} price - 价格数值
	 * @returns {string} 格式化后的价格
	 */
	const formatPrice = (price) => {
		if (typeof price === 'number') {
			return price.toFixed(2)
		}
		return '0.00'
	}

	/**
	 * 申请开票 — 提示联系客服
	 */
	const handleInvoice = () => {
		uni.showModal({
			content: '请致电客服申请开票!',
			confirmText: '致电客服',
			success: (res) => {
				if (res.confirm) {
					uni.makePhoneCall({
						phoneNumber: '18610064932'
					})
				}
			}
		})
	}

	/** 下拉刷新 */
	const onRefresh = () => {
		refreshing.value = true
		expandedIndex.value = -1
		getData()
	}

	/** 页面显示时刷新数据 */
	onShow(() => {
		getData()
	})

	/** 页面级下拉刷新 */
	onPullDownRefresh(() => {
		expandedIndex.value = -1
		getData()
		uni.stopPullDownRefresh()
	})
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $card-bg;
			padding: $spacing-md;
	}

	/* 滚动区域 */
	.order-scroll {
		height: 100vh;
	}

	/* 订单卡片（含时间线） */
	.order-card {
		display: flex;
		padding-bottom: $spacing-sm;

		/* 左侧时间线指示 */
		&__timeline {
			display: flex;
			flex-direction: column;
			align-items: center;
			width: 40rpx;
			flex-shrink: 0;
			padding-top: 24rpx;
		}

		&__dot {
			border-radius: 50%;
			flex-shrink: 0;
		}

		&__line {
			width: 4rpx;
			flex: 1;
			margin-top: 8rpx;
			border-radius: 2rpx;
		}

		/* 右侧内容区 */
		&__body {
			flex: 1;
			background-color: $bg-color;
			border-radius: $card-radius;
			margin-left: $spacing-xs;
			overflow: hidden;
		}

		/* 可点击的日期标题行 */
		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: $spacing-md $spacing-lg;
			background-color: $card-bg;
		}

		&__date {
			font-size: 26rpx;
			color: $text-color;
		}

		/* 展开箭头旋转动画 */
		&__arrow {
			transition: transform 0.3s ease;

			&--expanded {
				transform: rotate(180deg);
			}
		}

		/* 展开详情区 */
		&__detail {
			padding: $spacing-sm $spacing-lg $spacing-md;
			border-top: 1px solid $border-color;
			background-color: $card-bg;
			transform-origin: top center;

			/* 展开动画 */
			&--anim {
				animation: detail-expand 0.3s ease both;
			}
		}

	@keyframes detail-expand {
		from {
			opacity: 0;
			transform: translateY(-20rpx);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

		/* 每行信息 */
		&__row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 8rpx 0;

			&--action {
				margin-top: $spacing-xs;
				padding-top: $spacing-sm;
				border-top: 1px solid $border-color;
				cursor: pointer;
			}
		}

		&__label {
			font-size: 28rpx;
			color: $text-color;
		}

		&__value {
			font-size: 28rpx;
			color: $text-color;
			text-align: right;
			max-width: 400rpx;
			word-break: break-all;

			&--success {
				color: #2CCD7F;
			}

			&--number {
				font-size: 24rpx;
				color: $text-color-secondary;
			}

			&--price {
				color: #2CCD7F;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}
</style>
