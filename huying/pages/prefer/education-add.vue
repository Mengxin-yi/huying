<template>
	<view class="page">
		<view class="form-card">
			<view class="form-item">
				<text class="form-item__label">毕业学校<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.school" placeholder="请输入毕业学校" />
			</view>
			<view class="form-item">
				<text class="form-item__label">学历学位<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.level" placeholder="请输入学历学位" />
			</view>
			<view class="form-item">
				<text class="form-item__label">专业名称<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.major" placeholder="请输入专业名称" />
			</view>
			<view class="form-item">
				<text class="form-item__label">授予时间<text class="form-item__required">*</text></text>
				<picker mode="date" @change="onDateChange" :value="form.award_time">
					<view class="form-item__value" :class="{ 'form-item__value--empty': !form.award_time }">
						{{ form.award_time || '请选择授予时间' }}
					</view>
				</picker>
			</view>
		</view>

		<!-- 证书照片 -->
		<view class="upload-card">
			<view class="upload-card__label">证书照片(png、jpg、jpeg)<text class="form-item__required">*</text></view>
			<view class="upload-card__img-wrap" @click="chooseImage">
				<image v-if="certImg" class="upload-card__img" :src="certImg" mode="aspectFill" />
				<view v-else class="upload-card__placeholder">
					<u-icon name="camera" size="32" color="#999"></u-icon>
					<text class="upload-card__hint">点击上传</text>
				</view>
			</view>
		</view>

		<view class="btn-area">
			<u-button type="primary" @click="handleSubmit" :loading="submitting">提交</u-button>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive } from 'vue'
	import { userApi } from '@/api/index.js'
	import { MAX_IMAGE_SIZE } from '@/common/js/constants.js'

	const form = reactive({ school: '', level: '', major: '', award_time: '' })
	const certImg = ref('')
	const submitting = ref(false)

	/** 选择日期 */
	const onDateChange = (e) => { form.award_time = e.detail.value }

	/** 选择证书照片 */
	const chooseImage = () => {
		uni.chooseImage({
			sourceType: ['camera', 'album'],
			sizeType: ['compressed'],
			count: 1,
			success: (res) => {
				if (res.tempFiles[0].size > MAX_IMAGE_SIZE) {
					uni.showToast({ title: '图片不能超过3MB', icon: 'none' })
					return
				}
				certImg.value = res.tempFilePaths[0]
			}
		})
	}

	/** 提交 */
	const handleSubmit = async () => {
		if (!form.school) { uni.showToast({ title: '请输入毕业学校', icon: 'none' }); return }
		if (!form.level) { uni.showToast({ title: '请输入学历学位', icon: 'none' }); return }
		if (!form.major) { uni.showToast({ title: '请输入专业名称', icon: 'none' }); return }
		if (!form.award_time) { uni.showToast({ title: '请选择授予时间', icon: 'none' }); return }
		if (!certImg.value) { uni.showToast({ title: '请上传证书照片', icon: 'none' }); return }

		submitting.value = true
		try {
			const param = { ...form }
			param.files = certImg.value.indexOf('blob:') > -1 ? [{ name: 'file', uri: certImg.value }] : []
			await userApi.addEdu(param)
			uni.showToast({ title: '提交成功', icon: 'success' })
			setTimeout(() => { uni.navigateBack() }, 1500)
		} catch (e) {
			uni.showToast({ title: e || '提交失败', icon: 'none' })
		} finally {
			submitting.value = false
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-sm $spacing-md;
	}

	.form-card {
		background-color: $card-bg;
		border-radius: $card-radius;
		overflow: hidden;
		box-shadow: $shadow-light;
	}

	.form-item {
		display: flex;
		align-items: center;
		padding: $spacing-md $spacing-lg;
		border-bottom: 1px solid $border-color;

		&:last-child { border-bottom: none; }

		&__label {
			width: 160rpx;
			flex-shrink: 0;
			font-size: 28rpx;
			color: $text-color;
		}

		&__required {
			color: $danger-color;
			margin-left: 4rpx;
		}

		&__input {
			flex: 1;
			font-size: 28rpx;
			color: $text-color;
			height: 48rpx;
		}

		&__value {
			flex: 1;
			font-size: 28rpx;
			color: $text-color;

			&--empty { color: $uni-text-color-placeholder; }
		}
	}

	.upload-card {
		margin-top: $spacing-sm;
		background-color: $card-bg;
		border-radius: $card-radius;
		padding: $spacing-lg;
		box-shadow: $shadow-light;

		&__label {
			font-size: 28rpx;
			color: $text-color;
			margin-bottom: $spacing-sm;
		}

		&__img-wrap {
			width: 100%;
			height: 300rpx;
			background-color: $uni-bg-color-grey;
			border-radius: $btn-radius;
			overflow: hidden;
		}

		&__img {
			width: 100%;
			height: 300rpx;
		}

		&__placeholder {
			width: 100%;
			height: 300rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: $spacing-xs;
		}

		&__hint {
			font-size: 24rpx;
			color: $text-color-weak;
		}
	}

	.btn-area {
		margin: $spacing-lg 0;
	}
</style>
