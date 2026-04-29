<template>
	<view class="page">
		<!-- 加载状态 -->
		<view v-if="loading" class="loading">
			<u-loading-icon mode="circle" size="48"></u-loading-icon>
		</view>

		<!-- 详情内容 -->
		<view v-else-if="detail" class="detail">
			<!-- 用户信息行 -->
			<view class="detail__header">
				<image class="detail__avatar" :src="avatarSrc" mode="aspectFill" @error="onAvatarError" />
				<view class="detail__user">
					<text class="detail__username">{{ detail.username }}</text>
					<text class="detail__time">{{ detail.publish_time }}</text>
				</view>
			</view>

			<!-- 正文内容 -->
			<view class="detail__content">
				<!-- 类型标签 -->
				<view v-if="detail.msg_type" class="detail__type-tag">
					<text class="detail__type-text">{{ detail.msg_type }}</text>
				</view>
				<!-- 标题 -->
				<text class="detail__title">{{ detail.title }}</text>
				<!-- 内容文字 -->
				<text v-if="detail.content" class="detail__text">{{ detail.content }}</text>
			</view>

			<!-- 图片网格 -->
			<view v-if="detail.img_list && detail.img_list.length" class="detail__images"
				:class="[`detail__images--${imageLayout}`]">
				<image v-for="(img, index) in detail.img_list" :key="index" class="detail__img" :src="resolveImg(img)"
					mode="aspectFill" @click="previewImage(index)" />
			</view>

			<!-- 位置信息 -->
			<view v-if="detail.location" class="detail__location">
				<u-icon name="map" size="24" color="#999"></u-icon>
				<text class="detail__location-text">{{ detail.location }}</text>
			</view>

			<!-- 操作栏 -->
			<view class="detail__actions">
				<view class="detail__action detail__action--left" @click="handleDelete">
					<u-icon name="trash" :size="18" color="#F56C6C"></u-icon>
				</view>
				<view class="detail__actions-right">
					<view class="detail__action" @click="handleLike">
						<u-icon :name="isLiked ? 'heart-fill' : 'heart'" :size="18"
							:color="isLiked ? '#F56C6C' : '#999'"></u-icon>
						<text v-if="detail.like_num" class="detail__action-num">{{ detail.like_num }}</text>
					</view>
					<view class="detail__action" @click="handleComment">
						<u-icon name="chat" :size="18" color="#999"></u-icon>
						<text v-if="detail.comment_num" class="detail__action-num">{{ detail.comment_num }}</text>
					</view>
					<view class="detail__action">
						<u-icon name="eye" :size="18" color="#999"></u-icon>
						<text v-if="detail.read_num" class="detail__action-num">{{ detail.read_num }}</text>
					</view>
					<view class="detail__action" @click="handleShare">
						<u-icon name="share" :size="18" color="#999"></u-icon>
					</view>
				</view>
			</view>

			<!-- 评论区域 -->
			<view v-if="commentList.length" class="detail__comments">
				<view v-for="(item, i) in commentList" :key="i" class="detail__comment-item"
					@click="handleCommentAt(item)">
					<text class="detail__comment-author">{{ item.author }}</text>
					<text v-if="item.reply_at" class="detail__comment-reply"> 回复 {{ item.reply_at }}</text>
					<text class="detail__comment-text">: {{ item.content }}</text>
				</view>
			</view>

			<!-- 留言输入区域 -->
			<view class="detail__input">
				<input class="detail__input-field" placeholder="输入留言内容" v-model="commentText" />
				<view class="detail__input-btn" @click="handleCommentSubmit">
					<text class="detail__input-btn-text">留言</text>
				</view>
			</view>
		</view>

		<!-- 数据为空 -->
		<view v-else class="empty">
			<text class="empty__text">内容不存在或已删除</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watch
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		getPublishDetail,
		deletePublish,
		getCommentList,
		addComment,
		setReadNum
	} from '@/api/modules/publish.js'
	import {
		useUserStore
	} from '@/store/modules/user.js'

	/** 用户信息 */
	const userStore = useUserStore()
	const username = computed(() => userStore.username)
	const avatarSrc = ref('')
	const avatar = computed(() => userStore.avatar)

	/** 头像加载失败时回退到默认头像 */
	function onAvatarError() {
		avatarSrc.value = '/static/image/dash.png'
	}

	// 监听 store 中头像变化，重置错误状态
	watch(avatar, (val) => {
		avatarSrc.value = resolveImg(val) || '/static/image/dash.png'
	}, { immediate: true })

	/** 发布详情数据 */
	const detail = ref(null)

	/** 页面参数 */
	const pageParams = ref({ data_id: '', data_type: '' })

	/** 加载状态 */
	const loading = ref(false)

	/** 是否已点赞 */
	const isLiked = ref(false)

	/** 点赞数 */
	const likeNum = computed(() => detail.value?.like_num || 0)

	/** 图片基础地址 */
	// #ifdef H5
	const IMG_BASE = ''
	// #endif
	// #ifndef H5
	const IMG_BASE = 'https://ugoo.ugoolink.com'
	// #endif

	/** 补全图片 URL */
	function resolveImg(url) {
		if (!url) return ''
		// 替换 SSL 证书过期的域名
		url = url.replace('ugoo.ugoolink.com', 'echotime.ugoolink.com')
		if (url.startsWith('http://') || url.startsWith('https://')) return url
		return IMG_BASE + (url.startsWith('/') ? '' : '/') + url
	}

	/** 图片布局模式 */
	const imageLayout = computed(() => {
		const len = detail.value?.img_list?.length || 0
		if (len === 1) return 'single'
		if (len === 2) return 'double'
		if (len === 4) return 'grid2'
		return 'grid3'
	})

	/** 预览图片 */
	function previewImage(index) {
		const urls = detail.value.img_list.map(img => resolveImg(img))
		uni.previewImage({
			current: urls[index],
			urls
		})
	}

	/** 点赞操作 */
	function handleLike() {
		isLiked.value = !isLiked.value
	}

	/** 评论操作（TODO: 后续接入评论功能） */
	function handleComment() {
		uni.showToast({
			title: '评论功能开发中',
			icon: 'none'
		})
	}

	/** 评论列表 */
	const commentList = ref([])

	/** 评论输入内容 */
	const commentText = ref('')

	/** 回复目标用户 */
	const commentAt = ref({})

	/** 获取评论列表 */
	async function fetchCommentList() {
		try {
			const res = await getCommentList({
				data_id: pageParams.value.data_id,
				data_type: pageParams.value.data_type,
				_silent: true
			})
			const list = res.datas || res.data || []
			commentList.value = list.map(m => ({
				author: m.username,
				reply_at: m.re_username || '',
				content: m.content,
				user_id: m.user_id,
				re_user_id: m.re_user_id
			}))
		} catch (e) {
			console.error('获取评论列表失败:', e)
		}
	}

	/** 点击评论项（回复） */
	function handleCommentAt(item) {
		if (item.author) {
			commentText.value = `回复 ${item.author}: `
			commentAt.value = item
		}
	}

	/** 提交留言 */
	async function handleCommentSubmit() {
		if (!commentText.value.trim()) {
			uni.showToast({ title: '请输入留言内容', icon: 'none' })
			return
		}
		try {
			await addComment({
				data_id: pageParams.value.data_id,
				data_type: pageParams.value.data_type,
				content: commentText.value,
				re_user_id: commentAt.value.re_user_id || 0
			})
			uni.showToast({ title: '留言成功', icon: 'success' })
			commentText.value = ''
			commentAt.value = {}
			fetchCommentList()
		} catch (err) {
			uni.showToast({ title: String(err), icon: 'none' })
		}
	}

	/** 删除发布 */
	function handleDelete() {
		uni.showModal({
			title: '提示',
			content: '是否删除本条发布？',
			success: async (res) => {
				if (res.confirm) {
					try {
						await deletePublish({
							data_id: pageParams.value.data_id
						})
						uni.showToast({ title: '删除成功', icon: 'success' })
						setTimeout(() => uni.navigateBack(), 1500)
					} catch (err) {
						uni.showToast({ title: String(err), icon: 'none' })
					}
				}
			}
		})
	}

	/** 分享操作 */
	function handleShare() {
		const shareData = {
			title: `时代呼应 - ${detail.value?.title || ''}`,
			content: detail.value?.content || '',
			href: `https://echotime.ugoolink.com/pages/publish/preview?data_id=${pageParams.value.data_id}&data_type=${pageParams.value.data_type}`
		}

		// #ifdef APP-PLUS
		const shareContent = [shareData.title, shareData.href].filter(Boolean).join('\n')
		plus.share.sendWithSystem({
			type: 'text',
			content: shareContent
		}, () => {}, (err) => {
			console.error('分享失败:', err)
		})
		// #endif

		// #ifdef MP-WEIXIN
		uni.showShareMenu()
		// #endif

		// #ifdef H5
		if (navigator.share) {
			navigator.share({
				title: shareData.title,
				text: shareData.content,
				url: shareData.href
			}).catch(() => {})
		} else {
			uni.setClipboardData({
				data: `${shareData.title}\n${shareData.content}\n${shareData.href}`,
				success: () => {
					uni.showToast({ title: '内容已复制', icon: 'success' })
				}
			})
		}
		// #endif
	}

	/** 获取发布详情 */
	async function fetchDetail(dataId, dataType) {
		loading.value = true
		// 保存页面参数，供评论/删除等接口使用
		pageParams.value = { data_id: dataId, data_type: dataType }
		try {
			const res = await getPublishDetail({
				data_id: dataId,
				data_type: dataType
			})
			detail.value = res.datas || res.data || res.item || res
			// 初始化点赞状态
			isLiked.value = detail.value.like_status === 1
			// 初始化头像
			avatarSrc.value = resolveImg(detail.value.avatar_url) || '/static/image/dash.png'
			// 增加阅读次数
			setReadNum({
				data_id: dataId,
				data_type: dataType,
				_silent: true
			})
			// 加载评论列表
			fetchCommentList()
		} catch (e) {
			console.error('获取发布详情失败:', e)
			detail.value = null
		} finally {
			loading.value = false
		}
	}

	// 页面加载时获取详情
	onLoad((options) => {
		if (options.data_id) {
			fetchDetail(options.data_id, options.data_type || 'publish')
		}
	})
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
	}

	/* 加载状态 */
	.loading {
		display: flex;
		justify-content: center;
		padding: 200rpx 0;
	}

	/* 详情卡片 */
	.detail {
		background-color: #fff;
		padding: $spacing-md $spacing-lg;

		/* 用户信息行 */
		&__header {
			display: flex;
			align-items: center;
		}

		&__avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			flex-shrink: 0;
			background-color: #eee;
		}

		&__user {
			margin-left: $spacing-md;
			display: flex;
			flex-direction: column;
		}

		&__username {
			font-size: 30rpx;
			font-weight: 600;
			color: $primary-color;
		}

		&__time {
			font-size: 24rpx;
			color: $uni-text-color-grey;
			margin-top: 4rpx;
		}

		/* 正文区域 */
		&__content {
			margin-top: $spacing-md;
		}

		&__type-tag {
			display: inline-block;
			margin-bottom: $spacing-xs;
		}

		&__type-text {
			font-size: 22rpx;
			color: $primary-color;
			background-color: rgba($primary-color, 0.1);
			padding: 4rpx 16rpx;
			border-radius: 6rpx;
		}

		&__title {
			font-size: 32rpx;
			font-weight: 600;
			color: $uni-text-color;
			line-height: 1.6;
		}

		&__text {
			display: block;
			font-size: 28rpx;
			color: $uni-text-color;
			line-height: 1.8;
			margin-top: $spacing-sm;
			white-space: pre-wrap;
			word-break: break-all;
		}

		/* 图片网格 */
		&__images {
			margin-top: $spacing-md;

			&--single {
				.detail__img {
					width: 400rpx;
					height: 400rpx;
					max-width: 100%;
				}
			}

			&--double {
				display: flex;
				gap: $spacing-xs;
			}

			&--grid2 {
				display: flex;
				flex-wrap: wrap;
				gap: $spacing-xs;

				.detail__img {
					width: calc(50% - $spacing-xs / 2);
					height: 220rpx;
				}
			}

			&--grid3 {
				display: flex;
				flex-wrap: wrap;
				gap: $spacing-xs;

				.detail__img {
					width: calc(33.33% - $spacing-xs * 2 / 3);
					height: 200rpx;
				}
			}
		}

		&__img {
			border-radius: $uni-border-radius-sm;
		}

		/* 位置信息 */
		&__location {
			display: flex;
			align-items: center;
			margin-top: $spacing-sm;
		}

		&__location-text {
			font-size: 24rpx;
			color: $primary-color;
			margin-left: 6rpx;
		}

		/* 操作栏 */
		&__actions {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: $spacing-md;
			padding-top: $spacing-md;
			border-top: 1rpx solid $border-color;
		}

		&__actions-right {
			display: flex;
			gap: $spacing-lg;
		}

		&__action {
			display: flex;
			align-items: center;
			gap: 6rpx;
		}

		&__action-num {
			font-size: 24rpx;
			color: $uni-text-color-grey;
		}

		/* 评论区域 */
		&__comments {
			margin-top: $spacing-md;
			padding: $spacing-sm $spacing-md;
			background-color: #F7F7F7;
			border-radius: $uni-border-radius-sm;
		}

		&__comment-item {
			font-size: 26rpx;
			line-height: 1.8;
		}

		&__comment-author {
			color: $primary-color;
		}

		&__comment-reply {
			color: $primary-color;
		}

		&__comment-text {
			color: $uni-text-color;
		}

		/* 留言输入区域 */
		&__input {
			display: flex;
			align-items: center;
			margin-top: $spacing-sm;
			border: 1rpx solid $border-color;
			border-radius: $uni-border-radius-sm;
			overflow: hidden;
		}

		&__input-field {
			flex: 1;
			font-size: 26rpx;
			height: 64rpx;
			padding: 0 $spacing-sm;
		}

		&__input-btn {
			padding: 0 $spacing-md;
			height: 64rpx;
			display: flex;
			align-items: center;
			background-color: $primary-color;
		}

		&__input-btn-text {
			font-size: 26rpx;
			color: #fff;
		}
	}

	/* 空状态 */
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
