<template>
	<view class="page">
		<!-- 表单区域 -->
		<view class="form">
			<!-- 标题 -->
			<view class="form__item">
				<text class="form__label">标题</text>
				<input class="form__input" v-model="form.title" placeholder="请输入标题" :placeholderStyle="placeholderStyle" />
			</view>

			<!-- 类型 -->
			<view class="form__item">
				<text class="form__label">类型</text>
				<picker :range="typeLabels" @change="onTypeChange">
					<view class="form__picker">
						<text :class="['form__picker-text', !form.type && 'form__picker-text--placeholder']">
							{{ form.type || '请选择类型' }}
						</text>
						<u-icon name="arrow-down" size="24" color="#999"></u-icon>
					</view>
				</picker>
			</view>

			<!-- 内容 -->
			<view class="form__item form__item--column">
				<view class="form__label-row">
					<text class="form__label">内容</text>
					<text v-if="isTemplateType" class="form__mode-btn" @click="toggleMode">
						{{ isManualMode ? '模版输入' : '手动输入' }}
					</text>
				</view>

				<!-- 手动输入模式（默认） -->
				<textarea v-if="isManualMode" class="form__textarea" v-model="form.content" placeholder="请输入内容"
					:placeholderStyle="placeholderStyle" maxlength="-1" />

				<!-- 模版输入模式 -->
				<view v-else class="form__template">
					<block v-if="form.type === '招标'">
						<input v-for="(f, i) in templateFields.bid" :key="'bid'+i" class="form__template-input"
							v-model="templateData.bid[i]" :placeholder="f" :placeholderStyle="placeholderStyle" />
					</block>
					<block v-else-if="form.type === '招聘'">
						<input v-for="(f, i) in templateFields.job" :key="'job'+i" class="form__template-input"
							v-model="templateData.job[i]" :placeholder="f" :placeholderStyle="placeholderStyle" />
					</block>
					<block v-else-if="form.type === '通知'">
						<input v-for="(f, i) in templateFields.notice" :key="'notice'+i" class="form__template-input"
							v-model="templateData.notice[i]" :placeholder="f" :placeholderStyle="placeholderStyle" />
					</block>
					<block v-else-if="form.type === '项目'">
						<input v-for="(f, i) in templateFields.project" :key="'project'+i" class="form__template-input"
							v-model="templateData.project[i]" :placeholder="f" :placeholderStyle="placeholderStyle" />
					</block>
					<block v-else-if="form.type === '会议'">
						<input v-for="(f, i) in templateFields.meeting" :key="'meeting'+i" class="form__template-input"
							v-model="templateData.meeting[i]" :placeholder="f" :placeholderStyle="placeholderStyle" />
					</block>
					<view v-else class="form__template-empty">
						<text class="form__template-empty-text">请先选择类型</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 图片上传 -->
		<view class="upload">
			<view class="upload__header">
				<text class="upload__title">图片内容</text>
				<text class="upload__count">{{ imageList.length }}/9</text>
			</view>
			<view class="upload__body">
				<view class="upload__item" v-for="(img, index) in imageList" :key="index">
					<image class="upload__img" :src="img" mode="aspectFill" @click="previewImage(img)" />
					<view class="upload__del" @click="deleteImage(index)">
						<u-icon name="close" size="20" color="#fff"></u-icon>
					</view>
				</view>
				<view class="upload__add" v-if="imageList.length < 9" @click="chooseImage">
					<u-icon name="plus" size="40" color="#ccc"></u-icon>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="actions">
			<button class="actions__btn actions__btn--primary" @click="handleSubmit">提 交</button>
			<button class="actions__btn actions__btn--reset" @click="handleReset">重 置</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed
	} from 'vue'
	import {
		addPublish
	} from '@/api/modules/publish.js'
	import {
		MAX_IMAGE_SIZE
	} from '@/common/js/constants.js'

	/** 输入框占位样式 */
	const placeholderStyle = 'color:#B0B0B0;font-size:28rpx'

	/** 类型选项 */
	const typeLabels = ['招标', '招聘', '通知', '项目', '会议']

	/** 模版字段定义 */
	const templateFields = {
		bid: ['招标金额(元)', '时间要求', '地点要求', '采购方式', '采购内容', '采购要求', '联系人', '联系方式'],
		job: ['招聘岗位', '薪资待遇', '工作地点', '工作方式', '岗位要求', '工作内容', '联系人', '联系方式'],
		notice: ['时间要求', '推送受众', '通知内容描述', '推送受众', '推送时效'],
		project: ['项目金额(元)', '截止时间', '项目要求内容描述', '推送受众', '推送时效'],
		meeting: ['投稿截止时间', '会议召开时间', '会议地点', '会议结束时间', '会议内容要求描述', '推送受众']
	}

	/** 表单数据 */
	const form = reactive({
		title: '',
		type: '',
		content: ''
	})

	/** 是否为手动输入模式（默认 true） */
	const isManualMode = ref(true)

	/** 模版输入数据 */
	const templateData = reactive({
		bid: Array(8).fill(''),
		job: Array(8).fill(''),
		notice: Array(5).fill(''),
		project: Array(5).fill(''),
		meeting: Array(6).fill('')
	})

	/** 图片列表 */
	const imageList = ref([])

	/** 当前类型是否支持模版 */
	const isTemplateType = computed(() => typeLabels.includes(form.type))

	/** 类型选择 */
	function onTypeChange(e) {
		form.type = typeLabels[e.detail.value]
		isManualMode.value = true
	}

	/** 切换输入模式 */
	function toggleMode() {
		isManualMode.value = !isManualMode.value
	}

	/** 将模版数据组装为内容字符串 */
	function buildTemplateContent() {
		const typeKey = Object.keys(templateFields).find(k =>
			form.type === { bid: '招标', job: '招聘', notice: '通知', project: '项目', meeting: '会议' }[k]
		)
		if (!typeKey) return ''

		const fields = templateFields[typeKey]
		const values = templateData[typeKey]
		const labels = {
			bid: ['招标金额(元)', '时间要求', '地点要求', '采购方式', '采购内容', '采购要求', '联系人', '联系方式'],
			job: ['招聘岗位', '薪资待遇', '工作地点', '工作方式', '岗位要求', '工作内容', '联系人', '联系方式'],
			notice: ['时间要求', '推送受众', '通知内容描述', '推送受众', '推送时效'],
			project: ['项目金额(元)', '截止时间', '项目要求内容描述', '推送受众', '推送时效'],
			meeting: ['投稿截止时间', '会议召开时间', '会议地点', '会议结束时间', '会议内容要求描述', '推送受众']
		}

		return labels[typeKey].map((label, i) => `${label}：${values[i] || ''}`).join('\n')
	}

	/** 选择图片 */
	function chooseImage() {
		const remaining = 9 - imageList.value.length
		if (remaining <= 0) return

		uni.chooseImage({
			count: remaining,
			sizeType: ['compressed', 'original'],
			sourceType: ['album', 'camera'],
			success: (res) => {
				for (const file of res.tempFiles) {
					if (file.size > MAX_IMAGE_SIZE) {
						uni.showToast({
							title: '单张图片不能超过3MB',
							icon: 'none'
						})
						return
					}
				}
				imageList.value = imageList.value.concat(res.tempFilePaths)
			}
		})
	}

	/** 预览图片 */
	function previewImage(img) {
		uni.previewImage({
			current: img,
			urls: imageList.value
		})
	}

	/** 删除图片 */
	function deleteImage(index) {
		imageList.value.splice(index, 1)
	}

	/** 提交表单 */
	async function handleSubmit() {
		if (!form.title.trim()) {
			uni.showToast({ title: '请输入标题', icon: 'none' })
			return
		}

		// 组装内容
		let content = ''
		if (isManualMode.value) {
			content = form.content
		} else {
			content = buildTemplateContent()
		}

		if (!content.trim() && imageList.value.length === 0) {
			uni.showToast({ title: '请添加内容或上传图片', icon: 'none' })
			return
		}

		// 组装标题（类型前缀）
		const title = form.type ? `【${form.type}】${form.title}` : form.title

		// 组装提交参数
		const param = {
			title,
			content,
			msg_type: form.type || ''
		}

		// 图片文件
		const files = imageList.value.map(uri => ({
			name: 'files',
			uri
		}))
		if (files.length) {
			param.files = files
		}

		try {
			await addPublish(param)
			uni.showToast({ title: '提交成功', icon: 'success' })
			setTimeout(() => uni.navigateBack(), 1500)
		} catch (err) {
			uni.showToast({ title: String(err), icon: 'none' })
		}
	}

	/** 重置表单 */
	function handleReset() {
		form.title = ''
		form.type = ''
		form.content = ''
		isManualMode.value = true
		Object.keys(templateData).forEach(k => {
			templateData[k] = templateData[k].map(() => '')
		})
		imageList.value = []
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-md;
		padding-bottom: calc($spacing-xl + env(safe-area-inset-bottom));
	}

	/* 表单区域 */
	.form {
		background-color: #fff;
		border-radius: $uni-border-radius-lg;
		overflow: hidden;

		&__item {
			display: flex;
			align-items: center;
			padding: $spacing-md $spacing-md 0;
			min-height: 88rpx;

			&--column {
				flex-direction: column;
				align-items: stretch;
				padding-bottom: $spacing-md;
			}
		}

		&__label {
			font-size: 28rpx;
			font-weight: 600;
			color: $uni-text-color;
			flex-shrink: 0;
			width: 120rpx;
		}

		&__input {
			flex: 1;
			font-size: 28rpx;
			color: $uni-text-color;
		}

		&__picker {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;

			&-text {
				font-size: 28rpx;
				color: $uni-text-color;

				&--placeholder {
					color: #B0B0B0;
				}
			}
		}

		&__label-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: $spacing-sm;
		}

		&__mode-btn {
			font-size: 24rpx;
			color: $primary-color;
		}

		&__textarea {
			width: 100%;
			height: 240rpx;
			font-size: 28rpx;
			color: $uni-text-color;
			background-color: #FEF9FA;
			border-radius: $uni-border-radius-sm;
			padding: $spacing-sm;
			box-sizing: border-box;
		}

		&__template {
			width: 100%;
		}

		&__template-input {
			width: 100%;
			height: 72rpx;
			font-size: 26rpx;
			color: $uni-text-color;
			background-color: #FEF9FA;
			border-radius: $uni-border-radius-sm;
			padding: 0 $spacing-sm;
			margin-bottom: $spacing-xs;
			box-sizing: border-box;
		}

		&__template-empty {
			padding: $spacing-md 0;
			text-align: center;
		}

		&__template-empty-text {
			font-size: 26rpx;
			color: $uni-text-color-grey;
		}
	}

	/* 图片上传 */
	.upload {
		background-color: #fff;
		border-radius: $uni-border-radius-lg;
		padding: $spacing-md;
		margin-top: $spacing-sm;

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: $spacing-sm;
		}

		&__title {
			font-size: 28rpx;
			font-weight: 600;
			color: $uni-text-color;
		}

		&__count {
			font-size: 24rpx;
			color: $uni-text-color-grey;
		}

		&__body {
			display: flex;
			flex-wrap: wrap;
			gap: $spacing-sm;
		}

		&__item {
			position: relative;
			width: 200rpx;
			height: 200rpx;
		}

		&__img {
			width: 200rpx;
			height: 200rpx;
			border-radius: $uni-border-radius-sm;
		}

		&__del {
			position: absolute;
			top: -10rpx;
			right: -10rpx;
			width: 40rpx;
			height: 40rpx;
			background-color: $danger-color;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__add {
			width: 200rpx;
			height: 200rpx;
			border: 2rpx dashed #D9D9D9;
			border-radius: $uni-border-radius-sm;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	/* 操作按钮 */
	.actions {
		margin-top: $spacing-lg;

		&__btn {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			font-size: 32rpx;
			border-radius: $btn-radius;

			&--primary {
				background-color: $primary-color;
				color: #fff;
			}

			&--reset {
				background-color: #DEE3E7;
				color: $uni-text-color;
				margin-top: $spacing-sm;
			}
		}
	}
</style>
