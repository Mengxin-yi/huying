<template>
	<view class="page">
		<!-- 表单区域 -->
		<view class="form-card" :class="{ 'form-card--disabled': disabled }">
			<!-- 单位名称 -->
			<view class="form-item">
				<text class="form-item__label">单位名称<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.name" placeholder="请输入单位名称" :disabled="disabled" />
			</view>
			<!-- 单位类型 -->
			<view class="form-item">
				<text class="form-item__label">单位类型<text class="form-item__required">*</text></text>
				<view class="form-item__radio-group">
					<view
						v-for="item in companyTypeOptions"
						:key="item.value"
						class="radio-tag"
						:class="{ 'radio-tag--active': form.user_type === item.value, 'radio-tag--disabled': disabled }"
						@click="!disabled && (form.user_type = item.value)"
					>
						{{ item.text }}
					</view>
				</view>
			</view>
			<!-- 主营范围 -->
			<view class="form-item">
				<text class="form-item__label">主营范围<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.business_scope" placeholder="请输入主营范围" :disabled="disabled" />
			</view>
			<!-- 联系人 -->
			<view class="form-item">
				<text class="form-item__label">联系人<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.contact" placeholder="请输入联系人" :disabled="disabled" />
			</view>
			<!-- 联系电话 -->
			<view class="form-item">
				<text class="form-item__label">联系电话<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.phone" placeholder="请输入联系电话" :disabled="disabled" type="number" />
			</view>
			<!-- 省市 -->
			<view class="form-item" @click="!disabled && (showCityPicker = true)">
				<text class="form-item__label">省市<text class="form-item__required">*</text></text>
				<view class="form-item__value" :class="{ 'form-item__value--empty': !form.city }">
					{{ form.city || '请选择城市' }}
				</view>
				<u-icon v-if="!disabled" name="arrow-right" size="14" color="#999"></u-icon>
			</view>
			<!-- 地址 -->
			<view class="form-item">
				<text class="form-item__label">地址<text class="form-item__required">*</text></text>
				<input class="form-item__input" v-model="form.addr" placeholder="请输入地址" :disabled="disabled" />
			</view>
			<!-- 审核状态 -->
			<view class="form-item" v-if="form.check_stat === '审核中' || form.check_stat === '审核失败'">
				<text class="form-item__label">状态</text>
				<input class="form-item__input" :value="form.check_stat" disabled />
			</view>
		</view>

		<!-- 图片上传区域 -->
		<view class="upload-card">
			<view class="upload-card__header">
				<text class="upload-card__title">营业执照等证明图片</text>
				<text class="upload-card__count">{{ imageList.length }}/5</text>
			</view>
			<view class="upload-card__body">
				<view class="upload-card__list">
					<view class="upload-card__item" v-for="(image, index) in imageList" :key="index">
						<image class="upload-card__img" :src="image" mode="aspectFill" @click="previewImage(image)" />
						<view v-if="!disabled" class="upload-card__delete" @click="deleteImage(index)">
							<u-icon name="close" size="12" color="#fff"></u-icon>
						</view>
					</view>
					<view v-if="!disabled && imageList.length < 5" class="upload-card__add" @click="chooseImage">
						<u-icon name="plus" size="24" color="#999"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<!-- 操作按钮 -->
		<view class="btn-area" v-if="!disabled">
			<u-button type="primary" @click="handleSubmit" :loading="submitting">提交认证</u-button>
		</view>
		<view class="btn-area" v-if="authed">
			<u-button type="default" @click="handleCancel">注销认证</u-button>
		</view>

		<!-- 城市选择器弹窗（双列：左省右市，与源项目一致） -->
		<u-popup :show="showCityPicker" mode="bottom" round="16" @close="showCityPicker = false">
			<view class="city-picker">
				<!-- 顶部操作栏 -->
				<view class="city-picker__header">
					<text class="city-picker__cancel" @click="showCityPicker = false">取消</text>
					<text class="city-picker__title">选择城市</text>
					<text class="city-picker__confirm" @click="confirmCity">确定</text>
				</view>
				<!-- 双列内容 -->
				<view class="city-picker__body">
					<scroll-view class="city-picker__left" scroll-y>
						<view
							v-for="item in provinceList"
							:key="item.id"
							class="city-picker__item"
							:class="{ 'city-picker__item--active': activeProvinceId === item.id }"
							@click="selectProvince(item)"
						>
							{{ item.name }}
						</view>
					</scroll-view>
					<scroll-view class="city-picker__right" scroll-y>
						<view
							v-for="item in currentCityList"
							:key="item.id"
							class="city-picker__item"
							:class="{ 'city-picker__item--active': tempSelectedCityId === item.id }"
							@click="selectCity(item)"
						>
							<text>{{ item.name }}</text>
							<u-icon v-if="tempSelectedCityId === item.id" name="checkmark" size="14" color="#557ff7"></u-icon>
						</view>
					</scroll-view>
				</view>
			</view>
		</u-popup>

		<!-- 注销确认弹窗 -->
		<u-modal
			:show="showCancelDialog"
			title="提示"
			content="注销会清空所有信息!"
			showCancelButton
			@confirm="confirmCancel"
			@cancel="showCancelDialog = false"
		></u-modal>
	</view>
</template>

<script setup>
	import { ref, reactive, computed, onMounted } from 'vue'
	import { userApi } from '@/api/index.js'
	import { MAX_IMAGE_SIZE } from '@/common/js/constants.js'
	import dataCity from '@/common/js/data/city.js'

	// H5 端 API 基础路径为空（走代理），非 H5 端需要完整域名
	// #ifdef H5
	const IMG_BASE = ''
	// #endif
	// #ifndef H5
	const IMG_BASE = 'https://ugoo.ugoolink.com'
	// #endif

	/** 图片基础域名（图片始终用完整 URL，不走代理，避免 rewrite 问题） */
	const IMG_HOST = 'https://ugoo.ugoolink.com'

	/** 补全图片 URL */
	const resolveImgUrl = (url) => {
		if (!url) return ''
		if (/^(https?:|data:|\/\/)/.test(url)) return url
		return IMG_HOST + (url.startsWith('/') ? url : '/' + url)
	}

	/** 单位类型选项 */
	const companyTypeOptions = [
		{ text: '企事业单位', value: '企事业单位' },
		{ text: '政府组织', value: '政府组织' },
		{ text: '公益组织', value: '公益组织' }
	]

	/** 表单数据 */
	const form = reactive({
		name: '',
		user_type: '企事业单位',
		business_scope: '',
		contact: '',
		phone: '',
		city: '',
		addr: '',
		check_stat: ''
	})

	const imageList = ref([]) // 图片列表
	const authed = ref(false) // 是否已认证
	const disabled = ref(true) // 表单是否禁用
	const submitting = ref(false) // 是否正在提交
	const showCancelDialog = ref(false) // 注销确认弹窗
	const showCityPicker = ref(false) // 城市选择器弹窗
	const rawData = ref(null) // API 返回的完整数据，提交时需要回传全部字段

	/** 省份列表（只保留省市两级，去掉区；补充台湾/香港/澳门，去掉外国） */
	const provinceList = (() => {
		const list = dataCity
			.filter(p => p.name !== '外国')
			.map(mP => {
				const n = { id: mP.id, name: mP.name }
				if (mP.children && mP.children.length > 0) {
					// 城市列表：只取 level 1，去掉区级 children
					let cities = mP.children
						.filter(c => c.level !== 2)
						.map(c => ({ id: c.id, name: c.name }))

					// 直辖市：子项只有"市辖区"，替换为直辖市本身
					if (mP.name.indexOf('市') > -1 && cities.length <= 2) {
						cities = [{ id: mP.id, name: mP.name }]
					}
					// 普通省份：在开头加入"全省"选项
					if (mP.name.indexOf('省') > -1 || mP.name.indexOf('自治区') > -1) {
						cities = [{ id: mP.id, name: mP.name }, ...cities]
					}
					n.children = cities
				} else {
					// 无子项（台湾、香港、澳门等），用自身作为唯一选项
					n.children = [{ id: mP.id, name: mP.name }]
				}
				return n
			})
		// 确保台湾、香港、澳门存在且显示简称
		const names = list.map(p => p.name)
		if (!names.includes('台湾省')) {
			list.push({ id: 710000, name: '台湾省', children: [{ id: 710000, name: '台湾省' }] })
		}
		if (!names.includes('香港特别行政区')) {
			list.push({ id: 810000, name: '香港特别行政区', children: [{ id: 810000, name: '香港特别行政区' }] })
		}
		if (!names.includes('澳门特别行政区')) {
			list.push({ id: 820000, name: '澳门特别行政区', children: [{ id: 820000, name: '澳门特别行政区' }] })
		}
		return list
	})()

	/** 当前选中的省份 ID */
	const activeProvinceId = ref(provinceList.length > 0 ? provinceList[0].id : null)

	/** 临时选中的城市 ID（点击右侧城市时设置，点击确定时写入表单） */
	const tempSelectedCityId = ref(null)

	/** 当前省份下的城市列表 */
	const currentCityList = computed(() => {
		const province = provinceList.find(p => p.id === activeProvinceId.value)
		return province ? (province.children || []) : []
	})

	onMounted(() => {
		loadData()
	})

	/** 加载认证详情 */
	const loadData = async () => {
		try {
			const res = await userApi.getAuthDetail()
			if (res.item) {
				const item = res.item
				// 保存完整 API 数据，提交时合并回传
				rawData.value = { ...item }
				form.name = item.name || ''
				form.user_type = item.user_type || '企事业单位'
				form.business_scope = item.business_scope || ''
				form.contact = item.contact || ''
				form.phone = item.phone || ''
				form.addr = item.addr || ''
				form.check_stat = item.check_stat || ''

				// 拼接省市显示
				if (item.province) {
					form.city = item.province + (item.city || '')
					// 恢复选择器状态
					restoreCityState(item.province, item.city)
				}

				authed.value = item.check_stat === '审核通过'
				disabled.value = authed.value

				// 处理已有图片（相对路径需补全域名）
				if (item.imgs && Array.isArray(item.imgs) && item.imgs.length > 0) {
					imageList.value = item.imgs.map(m => {
						const url = typeof m === 'string' ? m : (m.url || '')
						return resolveImgUrl(url.replace('blob:', ''))
					}).filter(url => url)
				}
				// img_list: JSON 字符串或数组格式 ["url1", "url2"]
				else if (item.img_list) {
					try {
						const list = typeof item.img_list === 'string' ? JSON.parse(item.img_list) : item.img_list
						if (Array.isArray(list) && list.length > 0) {
							imageList.value = list.map(m => {
								const url = typeof m === 'string' ? m : (m.url || '')
								return url.replace('blob:', '')
							}).filter(url => url)
						}
					} catch (e) {
						// img_list 解析失败
					}
				}
			} else {
				disabled.value = false
			}
		} catch (e) {
			disabled.value = false
		}
	}

	/** 恢复省市选择器选中状态 */
	const restoreCityState = (provinceName, cityName) => {
		const province = provinceList.find(p => p.name === provinceName)
		if (province) {
			activeProvinceId.value = province.id
			if (cityName) {
				const city = province.children.find(c => c.name === cityName)
				if (city) {
					tempSelectedCityId.value = city.id
				}
			}
		}
	}

	/** 选择左侧省份 */
	const selectProvince = (item) => {
		activeProvinceId.value = item.id
		// 切换省份时清空已选城市
		tempSelectedCityId.value = null
	}

	/** 选择右侧城市 */
	const selectCity = (item) => {
		tempSelectedCityId.value = item.id
	}

	/** 确认城市选择 */
	const confirmCity = () => {
		const province = provinceList.find(p => p.id === activeProvinceId.value)
		if (!province) { showCityPicker.value = false; return }
		const city = province.children.find(c => c.id === tempSelectedCityId.value)
		if (!city) { showCityPicker.value = false; return }

		// 选择的是全省/直辖市本身
		if (city.id === province.id) {
			form.city = province.name
		} else if (province.name.indexOf('市') > -1) {
			// 直辖市：只显示直辖市名
			form.city = province.name
		} else {
			// 非直辖市：显示"省+市"
			form.city = province.name + city.name
		}
		showCityPicker.value = false
	}

	/** 选择图片 */
	const chooseImage = () => {
		const remainCount = 5 - imageList.value.length
		if (remainCount <= 0) {
			uni.showToast({ title: '最多上传5张图片', icon: 'none' })
			return
		}
		uni.chooseImage({
			sourceType: ['camera', 'album'],
			sizeType: ['compressed', 'original'],
			count: remainCount,
			success: (res) => {
				for (const file of res.tempFiles) {
					if (file.size > MAX_IMAGE_SIZE) {
						uni.showToast({ title: '单张图片不能超过3MB', icon: 'none' })
						return
					}
				}
				imageList.value = imageList.value.concat(res.tempFilePaths)
			}
		})
	}

	/** 预览图片 */
	const previewImage = (current) => {
		uni.previewImage({ current, urls: imageList.value })
	}

	/** 删除图片 */
	const deleteImage = (index) => {
		imageList.value.splice(index, 1)
	}

	/** 表单校验 */
	const validateForm = () => {
		if (!form.user_type) { uni.showToast({ title: '请选择单位类型', icon: 'none' }); return false }
		if (!form.name) { uni.showToast({ title: '请输入单位名称', icon: 'none' }); return false }
		if (!form.contact) { uni.showToast({ title: '请输入联系人', icon: 'none' }); return false }
		if (!form.phone) { uni.showToast({ title: '请输入联系电话', icon: 'none' }); return false }
		if (!form.city) { uni.showToast({ title: '请选择省市', icon: 'none' }); return false }
		if (!form.addr) { uni.showToast({ title: '请输入地址', icon: 'none' }); return false }
		return true
	}

	/** 提交认证 */
	const handleSubmit = async () => {
		if (!validateForm()) return
		if (imageList.value.length === 0) {
			uni.showToast({ title: '请上传认证图片', icon: 'none' })
			return
		}

		submitting.value = true
		try {
			// 以 API 原始数据为底，合并表单修改的字段（保留 urban_area 等服务端必需字段）
			const param = rawData.value ? { ...rawData.value, ...form } : { ...form }
			// 拆分省市
			const arr = form.city.split('省')
			if (arr.length > 1) {
				param.province = arr[0] + '省'
				param.city = arr[1]
			}
			// 已有图片（服务器上的）作为 img_list
			const existImgList = imageList.value.filter(e => e.indexOf('blob:') < 0)
			param.img_list = JSON.stringify(existImgList)
			delete param.imgs
			// 新上传图片（本地临时文件）作为 files
			param.files = imageList.value
				.filter(e => e.indexOf('blob:') > -1)
				.map(uri => ({ name: 'file', uri }))

			await userApi.editAuth(param)
			uni.showToast({ title: '提交成功', icon: 'success' })
			setTimeout(() => { uni.navigateBack() }, 1500)
		} catch (e) {
			uni.showToast({ title: e || '提交失败', icon: 'none' })
		} finally {
			submitting.value = false
		}
	}

	/** 注销认证 */
	const handleCancel = () => {
		showCancelDialog.value = true
	}

	/** 确认注销 */
	const confirmCancel = async () => {
		showCancelDialog.value = false
		try {
			await userApi.cancelVerify()
			uni.showToast({ title: '注销成功', icon: 'success' })
			setTimeout(() => { uni.navigateBack() }, 1500)
		} catch (e) {
			uni.showToast({ title: e || '注销失败', icon: 'none' })
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: $bg-color;
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 表单卡片 */
	.form-card {
		margin: $spacing-sm $spacing-md;
		background-color: $card-bg;
		border-radius: $card-radius;
		overflow: hidden;
		box-shadow: $shadow-light;

		&--disabled {
			.form-item__input,
			.form-item__value {
				color: $text-color-weak;
			}
		}
	}

	/* 表单项 */
	.form-item {
		display: flex;
		align-items: center;
		padding: $spacing-md $spacing-lg;
		border-bottom: 1px solid $border-color;

		&:last-child {
			border-bottom: none;
		}

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

			&--empty {
				color: $uni-text-color-placeholder;
			}
		}

		&__radio-group {
			flex: 1;
			display: flex;
			flex-wrap: wrap;
			gap: $spacing-xs;
		}
	}

	/* 单选标签 */
	.radio-tag {
		padding: 8rpx 20rpx;
		border-radius: $btn-radius;
		font-size: 24rpx;
		color: $text-color;
		background-color: $uni-bg-color-grey;
		border: 2rpx solid transparent;

		&--active {
			background-color: rgba($primary-color, 0.1);
			color: $primary-color;
			border-color: $primary-color;
		}

		&--disabled {
			opacity: 0.6;
		}
	}

	/* 图片上传卡片 */
	.upload-card {
		margin: $spacing-sm $spacing-md;
		background-color: $card-bg;
		border-radius: $card-radius;
		padding: $spacing-lg;
		box-shadow: $shadow-light;

		&__header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: $spacing-md;
		}

		&__title {
			font-size: 28rpx;
			color: $text-color;
			font-weight: bold;
		}

		&__count {
			font-size: 24rpx;
			color: $text-color-weak;
		}

		&__list {
			display: flex;
			flex-wrap: wrap;
			gap: $spacing-sm;
		}

		&__item {
			width: 160rpx;
			height: 160rpx;
			position: relative;
			border-radius: $btn-radius;
			overflow: hidden;
		}

		&__img {
			width: 160rpx;
			height: 160rpx;
		}

		&__delete {
			position: absolute;
			top: 0;
			right: 0;
			width: 40rpx;
			height: 40rpx;
			background-color: rgba(0, 0, 0, 0.5);
			border-radius: 0 0 0 $btn-radius;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__add {
			width: 160rpx;
			height: 160rpx;
			border: 2rpx dashed $border-color;
			border-radius: $btn-radius;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: $uni-bg-color-grey;
		}
	}

	/* 按钮区域 */
	.btn-area {
		margin: $spacing-lg $spacing-md;
	}

	/* 城市选择器弹窗 */
	.city-picker {
		height: 700rpx;
		display: flex;
		flex-direction: column;

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 30rpx;
			border-bottom: 2rpx solid #f5f5f5;
		}

		&__cancel {
			font-size: 32rpx;
			color: #666;
		}

		&__title {
			font-size: 32rpx;
			color: #333;
			font-weight: bold;
		}

		&__confirm {
			font-size: 32rpx;
			color: #557ff7;
		}

		&__body {
			flex: 1;
			display: flex;
			overflow: hidden;
		}

		&__left {
			width: 360rpx;
			height: 100%;
			background-color: #f8f8f8;
		}

		&__right {
			flex: 1;
			height: 100%;
			background-color: #fff;
		}

		&__item {
			height: 88rpx;
			line-height: 88rpx;
			padding: 0 30rpx;
			font-size: 28rpx;
			color: #333;
			display: flex;
			align-items: center;
			justify-content: space-between;

			&--active {
				color: #557ff7;
				background-color: #fff;
			}
		}
	}
</style>
