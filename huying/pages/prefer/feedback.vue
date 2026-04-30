<template>
	<view class="page">
		<!-- 顶部 Tab 切换 -->
		<view class="tabs">
			<view
				v-for="(tab, index) in tabBars"
				:key="tab.id"
				class="tabs__item"
				:class="{ 'tabs__item--active': tabIndex === index }"
				@click="onTabTap(index)"
			>
				<text class="tabs__text" :class="{ 'tabs__text--active': tabIndex === index }">{{ tab.name }}</text>
			</view>
		</view>
		<view class="tabs__line"></view>

		<!-- 使用帮助 -->
		<view v-if="tabIndex === 0" class="tab-content">
			<view class="info-card">
				<view class="info-item" @click="gotoPage('/pages/prefer/help/helpbid')">
					<text class="info-item__label">如何深入了解招标？</text>
					<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
				</view>
				<view class="info-item" @click="gotoPage('/pages/prefer/help/helpreserve')">
					<text class="info-item__label">如何设置订阅关键词？</text>
					<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
				</view>
				<view class="info-item" @click="gotoPage('/pages/prefer/help/wechatnotice')">
					<text class="info-item__label">如何收到微信公众号的推送？</text>
					<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
				</view>
				<view class="info-item" @click="gotoPage('/pages/prefer/help/helpua')">
					<text class="info-item__label">如何查看我的手机参数？</text>
					<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
				</view>
				<view class="info-item" @click="gotoPage('/pages/prefer/privacy')">
					<text class="info-item__label">隐私协议</text>
					<u-icon name="arrow-right" size="16" color="#ccc"></u-icon>
				</view>
			</view>
		</view>

		<!-- 意见反馈 -->
		<view v-if="tabIndex === 1" class="tab-content">
			<!-- 反馈类型选择 -->
			<view class="info-card">
				<view class="info-item info-item--header">
					<text class="info-item__label">请选择反馈类型</text>
				</view>
			</view>

			<view class="radio-group">
				<label class="radio-item" v-for="(item, index) in feedbackTypes" :key="item.value" @click="currentType = index">
					<radio :value="item.value" :checked="currentType === index" color="#007AFF" />
					<text class="radio-item__text">{{ item.name }}</text>
				</label>
			</view>

			<!-- 反馈内容输入 -->
			<view class="info-card">
				<view class="feedback-textarea">
					<textarea
						class="feedback-textarea__input"
						v-model="content"
						placeholder="请输入留言"
						placeholder-class="feedback-textarea__placeholder"
						maxlength="300"
						auto-height
					/>
					<text class="feedback-textarea__counter">{{ content.length }}/300</text>
				</view>
			</view>

			<!-- 提交按钮 -->
			<view class="submit-bar">
				<button class="submit-bar__btn" @click="handleSubmit">提 交</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { commonApi } from '@/api/index.js'
	import page from '@/common/js/utils/page.js'

	/** Tab 配置 */
	const tabBars = [
		{ name: '使用帮助', id: 'help' },
		{ name: '意见反馈', id: 'feedback' }
	]

	/** 当前选中的 Tab 索引 */
	const tabIndex = ref(0)

	/** 反馈类型选项 */
	const feedbackTypes = [
		{ value: 'system', name: '系统问题' },
		{ value: 'function', name: '功能问题' },
		{ value: 'other', name: '其他问题' }
	]

	/** 当前选中的反馈类型索引 */
	const currentType = ref(0)

	/** 反馈内容 */
	const content = ref('')

	/**
	 * 切换 Tab
	 * @param {number} index - Tab 索引
	 */
	const onTabTap = (index) => {
		tabIndex.value = index
	}

	/**
	 * 跳转到指定页面
	 * @param {string} path - 页面路径
	 */
	const gotoPage = (path) => {
		page.gotoPage(path)
	}

	/**
	 * 提交反馈
	 */
	const handleSubmit = async () => {
		if (!content.value.trim()) {
			uni.showToast({ title: '请输入留言', icon: 'none' })
			return
		}

		try {
			await commonApi.addFeedback({
				msg_type: feedbackTypes[currentType.value].name,
				message: content.value
			})
			uni.showToast({ title: '反馈成功', icon: 'success' })
			setTimeout(() => {
				uni.navigateBack()
			}, 1500)
		} catch (e) {
			uni.showToast({ title: '反馈失败，请重试', icon: 'none' })
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
	}

	/* Tab 切换栏 */
	.tabs {
		display: flex;
		background-color: $card-bg;
		height: 80rpx;

		&__item {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;

			&--active {
				position: relative;
			}
		}

		&__text {
			font-size: 30rpx;
			color: #555;

			&--active {
				color: $primary-color;
			}
		}

		&__line {
			height: 1rpx;
			background-color: #ccc;
		}
	}

	/* Tab 内容区 */
	.tab-content {
		padding: $spacing-sm 0;
	}

	/* 信息列表卡片 */
	.info-card {
		background-color: $card-bg;
	}

	.info-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: $spacing-md $spacing-lg;
		border-bottom: 1px solid $border-color;

		&:last-child {
			border-bottom: none;
		}

		&--header {
			justify-content: flex-start;
		}

		&__label {
			font-size: 28rpx;
			color: $text-color;
		}
	}

	/* 单选组 */
	.radio-group {
		background-color: $card-bg;
		padding: $spacing-sm $spacing-lg;
		margin-bottom: $spacing-sm;
	}

	.radio-item {
		display: flex;
		align-items: center;
		padding: $spacing-sm 0;

		&__text {
			font-size: 28rpx;
			color: $text-color;
			margin-left: $spacing-xs;
		}
	}

	/* 反馈输入区 */
	.feedback-textarea {
		position: relative;
		padding: $spacing-md $spacing-lg;

		&__input {
			width: 100%;
			min-height: 160rpx;
			font-size: 28rpx;
			color: $text-color;
		}

		&__placeholder {
			font-size: 26rpx;
			color: $uni-text-color-placeholder;
		}

		&__counter {
			display: block;
			text-align: right;
			font-size: 24rpx;
			color: $text-color-weak;
			margin-top: $spacing-xs;
		}
	}

	/* 提交按钮 */
	.submit-bar {
		padding: $spacing-lg $spacing-lg;

		&__btn {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			background-color: $primary-color;
			color: $uni-text-color-inverse;
			font-size: 32rpx;
			border-radius: $btn-radius;
			border: none;

			&::after {
				border: none;
			}
		}
	}
</style>
