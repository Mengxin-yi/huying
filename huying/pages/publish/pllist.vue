<template>
	<view class="page">
		<!-- 加载状态 -->
		<view v-if="loading" class="loading">
			<u-loading-icon mode="circle" size="48"></u-loading-icon>
		</view>

		<!-- 列表 -->
		<view v-else-if="list.length" class="list">
			<view v-for="(item, index) in list" :key="index" class="list__item" @click="goDetail(item)">
				<!-- 左侧头像 -->
				<image class="list__avatar" src="/static/image/dash.png" mode="aspectFill" />
				<!-- 中间内容 -->
				<view class="list__body">
					<text class="list__username">{{ item.user_name }}</text>
					<text class="list__title">{{ item.title }}</text>
					<text v-if="item.content" class="list__content">{{ item.content }}</text>
				</view>
				<!-- 右侧标签 -->
				<view class="list__tag" :class="item.type === 'comment' ? 'list__tag--comment' : 'list__tag--like'">
					<text class="list__tag-text">{{ item.type === 'comment' ? '留言' : '点赞' }}</text>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-else class="empty">
			<text class="empty__text">暂无留言与点赞</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		getCommentLikeData,
		setCommentLikeNum
	} from '@/api/modules/publish.js'

	/** 列表数据 */
	const list = ref([])

	/** 加载状态 */
	const loading = ref(false)

	/** 跳转发布详情（标记已读并清除角标） */
	function goDetail(item) {
		// 标记已读
		setCommentLikeNum({ _silent: true }).catch(() => {})
		uni.removeTabBarBadge({ index: 3 })
		uni.navigateTo({
			url: `/pages/publish/preview?data_id=${item.data_id}&data_type=${item.data_type}`
		})
	}

	/** 获取留言点赞列表 */
	async function fetchData() {
		loading.value = true
		try {
			const res = await getCommentLikeData({})
			list.value = res.data || res.datas || []
		} catch (e) {
			console.error('获取留言点赞数据失败:', e)
			list.value = []
		} finally {
			loading.value = false
		}
	}

	onLoad(() => {
		fetchData()
	})
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
	}

	.loading {
		display: flex;
		justify-content: center;
		padding: 200rpx 0;
	}

	.list {
		padding: $spacing-sm $spacing-md;

		&__item {
			display: flex;
			align-items: center;
			padding: $spacing-md;
			background-color: #fff;
			border-radius: $uni-border-radius-lg;
			margin-bottom: $spacing-sm;
		}

		/* 左侧头像 */
		&__avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			flex-shrink: 0;
			background-color: #eee;
		}

		/* 中间内容 */
		&__body {
			flex: 1;
			margin-left: $spacing-sm;
			min-width: 0;
		}

		&__username {
			font-size: 26rpx;
			color: $primary-color;
			font-weight: 500;
		}

		&__title {
			display: block;
			font-size: 28rpx;
			color: $uni-text-color;
			font-weight: 500;
			margin-top: 4rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		&__content {
			display: block;
			font-size: 24rpx;
			color: $uni-text-color-grey;
			margin-top: 4rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		/* 右侧标签 */
		&__tag {
			flex-shrink: 0;
			padding: 8rpx 20rpx;
			border-radius: $uni-border-radius-sm;

			&--comment {
				background-color: rgba($primary-color, 0.1);
			}

			&--like {
				background-color: rgba(#F56C6C, 0.1);
			}
		}

		&__tag-text {
			font-size: 24rpx;
			font-weight: 500;
		}

		&__tag--comment &__tag-text {
			color: $primary-color;
		}

		&__tag--like &__tag-text {
			color: #F56C6C;
		}
	}

	.empty {
		display: flex;
		justify-content: center;
		padding: 200rpx 0;

		&__text {
			font-size: 28rpx;
			color: $uni-text-color-grey;
		}
	}
</style>
