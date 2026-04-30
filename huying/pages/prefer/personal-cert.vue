<template>
	<view class="page">
		<!-- 身份证认证信息 -->
		<view class="section-card">
			<view class="section-card__title">身份信息</view>
			<view class="form-item">
				<text class="form-item__label">姓名<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.name" placeholder="请输入姓名" />
			</view>
			<view class="form-item">
				<text class="form-item__label">身份证号<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.card_num" placeholder="请输入身份证号" />
			</view>
			<!-- 身份证照片 -->
			<view class="idcard-upload">
				<view class="idcard-upload__label">身份证照片<text class="form-item__required">*</text></view>
				<view class="idcard-upload__body">
					<view class="idcard-upload__item" @click="chooseFrontImg">
						<image v-if="frontImg" class="idcard-upload__img" :src="frontImg" mode="aspectFill" />
						<view v-else class="idcard-upload__placeholder">
							<u-icon name="camera" size="28" color="#999"></u-icon>
							<text class="idcard-upload__text">正面照</text>
						</view>
					</view>
					<view class="idcard-upload__item" @click="chooseBackImg">
						<image v-if="backImg" class="idcard-upload__img" :src="backImg" mode="aspectFill" />
						<view v-else class="idcard-upload__placeholder">
							<u-icon name="camera" size="28" color="#999"></u-icon>
							<text class="idcard-upload__text">反面照</text>
						</view>
					</view>
				</view>
			</view>
			<view class="btn-area">
				<u-button type="primary" @click="handleSubmit" :loading="submitting">提交</u-button>
			</view>
		</view>

		<!-- 学历认证 -->
		<view class="section-card">
			<view class="section-card__header">
				<text class="section-card__title">学历认证</text>
				<view class="section-card__action" @click="gotoPage('/pages/prefer/education-add')">
					<u-icon name="plus" size="14" color="#18BC37"></u-icon>
					<text class="section-card__action-text">新增学历</text>
				</view>
			</view>
			<view v-if="eduList.length === 0" class="section-card__empty">
				<text>暂无学历认证</text>
			</view>
			<view v-for="item in eduList" :key="item.id" class="cert-card">
				<!-- 认证状态标签 -->
				<view class="cert-card__badge" :class="{
					'cert-card__badge--pending': item.check_stat === '认证中',
					'cert-card__badge--success': item.check_stat === '认证通过',
					'cert-card__badge--fail': item.check_stat === '认证失败'
				}">{{ item.check_stat }}</view>
				<view class="cert-card__body">
					<image v-if="item.url" class="cert-card__img" :src="resolveImgUrl(item.url)" mode="aspectFill" @click="previewImage(resolveImgUrl(item.url))" />
					<view class="cert-card__info">
						<text class="cert-card__row">毕业学校：{{ item.school }}</text>
						<text class="cert-card__row">学历：{{ item.level }}</text>
						<text class="cert-card__row">专业：{{ item.major }}</text>
						<text class="cert-card__row">毕业时间：{{ formatDatetime(item.award_time) }}</text>
						<view class="cert-card__action" @click="revokeEdu(item)">
							<text class="cert-card__revoke">撤销</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 技能认证 -->
		<view class="section-card">
			<view class="section-card__header">
				<text class="section-card__title">技能认证</text>
				<view class="section-card__action" @click="gotoPage('/pages/prefer/skill-add')">
					<u-icon name="plus" size="14" color="#18BC37"></u-icon>
					<text class="section-card__action-text">新增技能</text>
				</view>
			</view>
			<view v-if="skillList.length === 0" class="section-card__empty">
				<text>暂无技能认证</text>
			</view>
			<view v-for="item in skillList" :key="item.id" class="cert-card">
				<view class="cert-card__badge" :class="{
					'cert-card__badge--pending': item.check_stat === '认证中',
					'cert-card__badge--success': item.check_stat === '认证通过',
					'cert-card__badge--fail': item.check_stat === '认证失败'
				}">{{ item.check_stat }}</view>
				<view class="cert-card__body">
					<image v-if="item.url" class="cert-card__img" :src="resolveImgUrl(item.url)" mode="aspectFill" @click="previewImage(resolveImgUrl(item.url))" />
					<view class="cert-card__info">
						<text class="cert-card__row">发证机构：{{ item.issuing_authority }}</text>
						<text class="cert-card__row">技能等级：{{ item.level }}</text>
						<text class="cert-card__row">技能名称：{{ item.name }}</text>
						<text class="cert-card__row">授予时间：{{ formatDatetime(item.award_time) }}</text>
						<view class="cert-card__action" @click="revokeSkill(item)">
							<text class="cert-card__revoke">撤销</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, onMounted } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	import { userApi } from '@/api/index.js'
	import { MAX_IMAGE_SIZE } from '@/common/js/constants.js'
	import page from '@/common/js/utils/page.js'

	/** 图片基础域名 */
	const IMG_HOST = 'https://ugoo.ugoolink.com'

	/** 格式化日期时间，去掉 00:00:00 */
	const formatDatetime = (val) => {
		if (!val) return ''
		return val.replace(/\s*00:00:00$/, '')
	}

	/** 补全图片 URL */
	const resolveImgUrl = (url) => {
		if (!url) return ''
		if (/^(https?:|data:|\/\/)/.test(url)) return url
		return IMG_HOST + (url.startsWith('/') ? url : '/' + url)
	}

	/** 表单数据 */
	const form = reactive({ name: '', card_num: '' })

	/** 身份证正面照 */
	const frontImg = ref('')

	/** 身份证反面照 */
	const backImg = ref('')

	/** 是否选择了新的正面照 */
	const isFrontChanged = ref(false)

	/** 是否选择了新的反面照 */
	const isBackChanged = ref(false)

	/** 是否正在提交 */
	const submitting = ref(false)

	/** 学历认证列表 */
	const eduList = ref([])

	/** 技能认证列表 */
	const skillList = ref([])

	/** 认证状态 */
	const checkStat = ref('')

	/** 每次页面显示时刷新数据 */
	onShow(() => { loadData() })

	/** 加载所有数据 */
	const loadData = () => {
		loadCardInfo()
		loadEduList()
		loadSkillList()
	}

	/** 加载身份证认证信息 */
	const loadCardInfo = async () => {
		try {
			const res = await userApi.getCardInfo()
			if (res.item && res.item.check_stat !== '未认证') {
				form.name = res.item.name || ''
				form.card_num = res.item.card_num || ''
				checkStat.value = res.item.check_stat || ''
				if (res.item.front_img) {
					frontImg.value = resolveImgUrl(res.item.front_img) + '?temp=' + Math.random()
				}
				if (res.item.back_img) {
					backImg.value = resolveImgUrl(res.item.back_img) + '?temp=' + Math.random()
				}
			}
		} catch (e) {
			// 未认证时不报错
		}
	}

	/** 加载学历认证列表 */
	const loadEduList = async () => {
		try {
			const res = await userApi.getEduList()
			eduList.value = res.items || []
		} catch (e) {
			// 静默处理
		}
	}

	/** 加载技能认证列表 */
	const loadSkillList = async () => {
		try {
			const res = await userApi.getSkillList()
			skillList.value = res.items || []
		} catch (e) {
			// 静默处理
		}
	}

	/** 选择身份证正面照 */
	const chooseFrontImg = () => {
		uni.chooseImage({
			sourceType: ['camera', 'album'],
			sizeType: ['compressed'],
			count: 1,
			success: (res) => {
				if (res.tempFiles[0].size > MAX_IMAGE_SIZE) {
					uni.showToast({ title: '图片不能超过3MB', icon: 'none' })
					return
				}
				frontImg.value = res.tempFilePaths[0]
				isFrontChanged.value = true
			}
		})
	}

	/** 选择身份证反面照 */
	const chooseBackImg = () => {
		uni.chooseImage({
			sourceType: ['camera', 'album'],
			sizeType: ['compressed'],
			count: 1,
			success: (res) => {
				if (res.tempFiles[0].size > MAX_IMAGE_SIZE) {
					uni.showToast({ title: '图片不能超过3MB', icon: 'none' })
					return
				}
				backImg.value = res.tempFilePaths[0]
				isBackChanged.value = true
			}
		})
	}

	/** 预览图片 */
	const previewImage = (url) => {
		uni.previewImage({ current: url, urls: [url] })
	}

	/** 提交身份证认证 */
	const handleSubmit = async () => {
		if (!form.name) { uni.showToast({ title: '请输入姓名', icon: 'none' }); return }
		if (!form.card_num) { uni.showToast({ title: '请输入身份证号', icon: 'none' }); return }
		if (!frontImg.value) { uni.showToast({ title: '请上传身份证正面照', icon: 'none' }); return }
		if (!backImg.value) { uni.showToast({ title: '请上传身份证反面照', icon: 'none' }); return }

		submitting.value = true
		try {
			const param = { name: form.name, card_num: form.card_num }
			// 新上传的图片作为 files
			const files = []
			if (isFrontChanged.value && frontImg.value.indexOf('blob:') > -1) {
				files.push({ name: 'front_img', uri: frontImg.value })
			}
			if (isBackChanged.value && backImg.value.indexOf('blob:') > -1) {
				files.push({ name: 'back_img', uri: backImg.value })
			}
			param.files = files
			await userApi.editCard(param)
			uni.showToast({ title: '提交成功', icon: 'success' })
			// 延迟刷新数据
			setTimeout(() => { loadData() }, 2000)
		} catch (e) {
			uni.showToast({ title: e || '提交失败', icon: 'none' })
		} finally {
			submitting.value = false
		}
	}

	/** 撤销学历认证 */
	const revokeEdu = (item) => {
		uni.showModal({
			content: '是否撤销本条信息？',
			success: async (res) => {
				if (res.confirm) {
					try {
						await userApi.deleteEdu({ pk: item.id })
						uni.showToast({ title: '撤销成功', icon: 'success' })
						loadEduList()
					} catch (e) {
						uni.showToast({ title: e || '撤销失败', icon: 'none' })
					}
				}
			}
		})
	}

	/** 撤销技能认证 */
	const revokeSkill = (item) => {
		uni.showModal({
			content: '是否撤销本条信息？',
			success: async (res) => {
				if (res.confirm) {
					try {
						await userApi.deleteSkill({ pk: item.id })
						uni.showToast({ title: '撤销成功', icon: 'success' })
						loadSkillList()
					} catch (e) {
						uni.showToast({ title: e || '撤销失败', icon: 'none' })
					}
				}
			}
		})
	}

	/** 页面跳转 */
	const gotoPage = (path) => { page.gotoPage(path) }
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding: $spacing-sm $spacing-md;
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 区块卡片 */
	.section-card {
		margin-bottom: $spacing-sm;
		background-color: $card-bg;
		border-radius: $card-radius;
		overflow: hidden;
		box-shadow: $shadow-light;
		padding: $spacing-lg;

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: $spacing-md;
		}

		&__title {
			font-size: 30rpx;
			font-weight: bold;
			color: $text-color;
			border-left: 6rpx solid $primary-color;
			padding-left: $spacing-sm;
		}

		&__action {
			display: flex;
			align-items: center;
			gap: 4rpx;
		}

		&__action-text {
			font-size: 24rpx;
			color: #18BC37;
		}

		&__empty {
			padding: $spacing-lg 0;
			text-align: center;
			font-size: 26rpx;
			color: $text-color-weak;
		}
	}

	/* 表单项 */
	.form-item {
		display: flex;
		align-items: center;
		padding: $spacing-md 0;
		border-bottom: 1px solid $border-color;

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
	}

	/* 身份证照片上传 */
	.idcard-upload {
		padding: $spacing-md 0;

		&__label {
			font-size: 28rpx;
			color: $text-color;
			margin-bottom: $spacing-sm;
		}

		&__body {
			display: flex;
			gap: $spacing-sm;
		}

		&__item {
			width: 48%;
			height: 200rpx;
			border-radius: $btn-radius;
			overflow: hidden;
			background-color: $uni-bg-color-grey;
		}

		&__img {
			width: 100%;
			height: 200rpx;
		}

		&__placeholder {
			width: 100%;
			height: 200rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: $spacing-xs;
		}

		&__text {
			font-size: 24rpx;
			color: $text-color-weak;
		}
	}

	/* 认证卡片 */
	.cert-card {
		position: relative;
		background-color: #fff;
		border-radius: $btn-radius;
		border: 1px solid $border-color;
		padding: $spacing-md;
		margin-bottom: $spacing-sm;

		&__badge {
			position: absolute;
			top: 0;
			right: 0;
			font-size: 22rpx;
			padding: 4rpx 16rpx;
			border-radius: 0 $btn-radius 0 $btn-radius;
			color: #fff;

			&--pending { background-color: #f0ad4e; }
			&--success { background-color: #18BC37; }
			&--fail { background-color: $danger-color; }
		}

		&__body {
			display: flex;
			gap: $spacing-md;
		}

		&__img {
			width: 200rpx;
			height: 200rpx;
			border-radius: $btn-radius;
			flex-shrink: 0;
		}

		&__info {
			flex: 1;
			min-width: 0;
		}

		&__row {
			display: block;
			font-size: 26rpx;
			color: $text-color;
			line-height: 1.8;
		}

		&__action {
			margin-top: $spacing-xs;
		}

		&__revoke {
			font-size: 24rpx;
			color: $danger-color;
			border: 1px solid $danger-color;
			padding: 4rpx 20rpx;
			border-radius: $btn-radius;
		}
	}

	/* 按钮区域 */
	.btn-area {
		margin-top: $spacing-lg;
	}
</style>
