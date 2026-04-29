<template>
	<!-- #ifdef MP || APP -->
	<view class="ydl-col-picker" v-if="showPicker" @touchmove.stop.prevent="() => { }">
	<!-- #endif -->
		<!-- #ifndef MP || APP -->
		<view class="ydl-col-picker" v-if="showPicker">
		<!-- #endif -->
			<!-- <page-meta :page-style="`overflow: ${showPicker ? 'hidden' : 'initial'}`">
		</page-meta> -->
			<uni-transition :mode-class="['fade']" :styles="maskClass" :duration="duration" :show="showTrans"
				@click="maskTap" />
			<uni-transition :mode-class="['slide-bottom']" :styles="transClass" :duration="duration" :show="showTrans">
				<view class="ydl-cp__body">
					<view class="ydl-cp__top">
						<view class="ydl-cp__btn ydl-cp__btn--cancel" @click="cancel()">
							<text class="ydl-cp__text" :style="{
	             color: cancelBtn.color,
	             'font-size': cancelBtn.fontSize,
	           }">
								{{ cancelBtn.text }}
							</text>
						</view>
						<view class="ydl-cp__title">
							<text>
								{{ title }}
							</text>
						</view>
						<view class="ydl-cp__btn ydl-cp__btn--confirm" @click="confirm()">
							<text class="ydl-cp__text" :style="{
	             color: confirmBtn.color,
	             'font-size': confirmBtn.fontSize,
	           }">
								{{ confirmBtn.text }}
							</text>
						</view>
					</view>
					<view class="ydl-cp__search" v-if="showSearch">
						<input class="ydl-cp__input" type="text" confirm-type="search" :placeholder="searchPlaceholder"
							v-model="searchValue" @confirm="searchConfirm" />
						<view class="ydl-cp__search--icon" style="display: flex; align-items: center" v-if="searchValue"
							@click="clearSearch()">
							<uni-icons type="close" size="30" color="#666666"></uni-icons>
						</view>
					</view>
					<view class="ydl-cp__content">
						<scroll-view class="ydl-cp__scroll ydl-cp__scroll--left" scroll-y="true">
							<view class="ydl-cp__item" v-for="item in filteredRange" :key="item[idKey]" :class="[
	             currentActiveItem === item[idKey] ? 'ydl-cp__item--active' : '',
	             Object.keys(selectValue)
	               .map((key) =>
	                 typeof item[idKey] === 'number' ? Number(key) : key
	               )
	               .map((key) =>
	                 Array.isArray(selectValue[key]) &&
	                 selectValue[key].length > 0
	                   ? key
	                   : false
	               )
	               .filter(Boolean)
	               .includes(item[idKey])
	               ? 'ydl-cp__item--selected'
	               : '',
	           ]" @click="itemClick(item[idKey])">
								<view class="ydl-cp__text">
									<text class="badge"></text>
									{{ item[rangeKey] }}
								</view>
							</view>
						</scroll-view>
						<scroll-view class="ydl-cp__scroll ydl-cp__scroll--right" scroll-y="true">
							<view class="ydl-cp__item" v-for="item in currentRange" :key="item[idKey]" :class="[
	             selectValue[currentActiveItem] &&
	             selectValue[currentActiveItem].includes(item[idKey])
	               ? 'ydl-cp__item--active ydl-cp__item--selected'
	               : '',
	           ]" @click="selectItem(item[idKey])">
								<view class="ydl-cp__text">
									{{ item[rangeKey] }}
								</view>
								<view class="ydl-cp__check">
									<uni-icons type="checkmarkempty" size="16" color="#557ff7"></uni-icons>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</uni-transition>
		</view>
</template>

<script>
	// 自定义深拷贝方法
	function customCloneDeep(obj) {
		if (obj === null || typeof obj !== "object") {
			return obj;
		}

		if (obj instanceof Date) {
			return new Date(obj);
		}

		if (obj instanceof RegExp) {
			return new RegExp(obj);
		}

		if (Array.isArray(obj)) {
			return obj.map((item) => customCloneDeep(item));
		}

		const clonedObj = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				clonedObj[key] = customCloneDeep(obj[key]);
			}
		}
		return clonedObj;
	}

	// 模糊搜索
	function searchItems(items, keyword) {
		const results = [];
		items.forEach((item) => {
			const isParentMatch = item.name
				.toLowerCase()
				.includes(keyword.toLowerCase());
			const childResults = item.children ?
				searchItems(item.children, keyword) : [];

			if (isParentMatch || childResults.length > 0) {
				const newItem = Object.assign({}, item);
				if (childResults.length > 0) {
					newItem.children = childResults;
				} else if (!isParentMatch) {
					delete newItem.children;
				}
				results.push(newItem);
			}
		});
		return results;
	}

	export default {
		props: {
			// 数据
			range: {
				type: Array,
				default: () => {
					return [];
				},
			},
			// 默认选中值
			checkValue: {
				type: Object,
				default: () => {
					return {};
				},
			},
			// 指定 Object 中 key 的值作为单条数据的唯一id
			idKey: {
				type: String,
				default: "id",
			},
			// 指定 Object 中 key 的值作为选择器显示的内容
			rangeKey: {
				type: String,
				default: "label",
			},
			// 是否多选
			multiple: {
				type: Boolean,
				default: false,
			},
			// 是否允许点击蒙层关闭选择器
			closeOnClickMask: {
				type: Boolean,
				default: true,
			},
			// 标题
			title: {
				type: String,
				default: "标题",
			},
			// 取消按钮自定义
			cancelBtn: {
				type: Object,
				default: () => ({
					text: "取消",
					color: "#666666",
					fontSize: "32rpx",
				}),
			},
			// 确定按钮自定义
			confirmBtn: {
				type: Object,
				default: () => ({
					text: "确定",
					color: "#557FF7",
					fontSize: "32rpx",
				}),
			},
			// 是否开启搜索
			showSearch: {
				type: Boolean,
				default: true,
			},
			// 搜索框placeholder
			searchPlaceholder: {
				type: String,
				default: "请输入搜索内容",
			},
		},
		data() {
			return {
				showPicker: false,
				showTrans: false,
				duration: 300,
				maskClass: {
					position: "fixed",
					bottom: 0,
					top: 0,
					left: 0,
					right: 0,
					backgroundColor: "rgba(0, 0, 0, 0.3)",
				},
				transClass: {
					position: "fixed",
					left: 0,
					right: 0,
					bottom: 0,
				},
				searchValue: "",
				currentActiveItem: null,
				selectValue: {},
				filteredRange: [],
			};
		},
		computed: {
			currentRange() {
				const findItem = this.filteredRange.find((item) => {
					return item[this.idKey] === this.currentActiveItem;
				});
				return (findItem && findItem.children) || [];
			},
		},
		mounted() {},
		methods: {
			// 初始化
			init() {
				// 深拷贝默认选中数据
				if (this.multiple) {
					// 多选
					for (let key in this.checkValue) {
						this.selectValue[key] = customCloneDeep(this.checkValue[key]);
					}
				} else {
					// 单选
					const firstKey = Object.keys(this.checkValue)[0];
					if (firstKey) {
						this.selectValue[firstKey] = [this.checkValue[firstKey][0]];
					}
				}
				// 默认打开第一个
				if (Array.isArray(this.range) && this.range.length) {
					this.currentActiveItem = this.range[0][this.idKey];
				}
				// 初始化过滤范围
				this.filteredRange = customCloneDeep(this.range);
			},
			// 重置
			reset() {
				this.selectValue = {};
				this.searchValue = "";
				this.currentActiveItem = null;
			},
			// 打开
			open() {
				this.init();
				this.showPicker = true;
				this.showTrans = true;
				this.$nextTick(() => {
					// #ifdef H5
					const modal = document.querySelector('.ydl-col-picker');
					modal.addEventListener('touchmove', function(e) {
						if (e.cancelable) {
							e.preventDefault();
						}
					}, {
						passive: false
					});
					// #endif
				})
			},
			// 关闭选择器
			close() {
				this.showTrans = false;
				this.reset();
				// 等待动画结束再完全关闭
				setTimeout(() => {
					this.showPicker = false;
				}, this.duration);
				// #ifdef H5
				const modal = document.querySelector('.ydl-col-picker');
				modal.removeEventListener('touchmove', function(e) {
					if (e.cancelable) {
						e.preventDefault();
					}
				}, {
					passive: false
				});
				// #endif
			},
			// 点击取消按钮
			cancel() {
				this.close();
			},
			// 点击确定按钮
			confirm() {
				this.$emit("confirm", JSON.parse(JSON.stringify(this.selectValue)));
				this.close();
			},
			// 点击蒙层
			maskTap() {
				if (!this.closeOnClickMask) return;
				this.close();
			},
			// 确定搜索
			searchConfirm() {
				const fa = searchItems(this.range, this.searchValue);
				this.filteredRange = fa;
				//   默认打开第一个
				if (fa.length) {
					this.currentActiveItem = fa[0][this.idKey];
				}
			},
			// 清空搜索
			clearSearch() {
				this.searchValue = "";
				this.searchConfirm();
			},
			// 左侧选中
			itemClick(id) {
				this.currentActiveItem = id;
			},
			// 选择某项
			selectItem(id) {
				// 查询是否已选中
				let currentItem = Array.isArray(this.selectValue[this.currentActiveItem]);
				let selected = null;
				if (!currentItem) {
					this.selectValue[this.currentActiveItem] = [];
				} else {
					selected = this.selectValue[this.currentActiveItem].find(
						(item) => item === id
					);
				}
				if (this.multiple) {
					if (selected) {
						// 取消选中
						this.selectValue[this.currentActiveItem].splice(
							this.selectValue[this.currentActiveItem].indexOf(id),
							1
						);
					} else {
						this.selectValue[this.currentActiveItem].push(id);
					}
				} else {
					this.selectValue = {};
					if (selected) {
						this.selectValue[this.currentActiveItem] = [];
					} else {
						this.selectValue[this.currentActiveItem] = [id];
					}
				}

				// 判断当前列是否还存在已选中的值
				if (
					!this.selectValue[this.currentActiveItem] ||
					this.selectValue[this.currentActiveItem].length === 0
				) {
					// 取消左侧选中
					delete this.selectValue[this.currentActiveItem];
				}

				// #ifdef VUE2
				const copySelectValue = customCloneDeep(this.selectValue);
				this.selectValue = copySelectValue;
				// #endif
				this.checkAllRight(id, selected);
			},
			checkAllRight(id, selected) {
				if (id === this.currentActiveItem) {
					// console.log(id + ', ' + selected);
					var major = this.range.filter(eP => eP[this.idKey] === id)[0];
					if (selected) {
						this.selectValue[this.currentActiveItem] = [];
						delete this.selectValue[this.currentActiveItem];
					}
					else {
						this.selectValue[this.currentActiveItem] = [];
						major.children.forEach(eC => {
							this.selectValue[this.currentActiveItem].push(eC.id);
						});
					}
				}
				else {
					var major = this.range.filter(eP => eP[this.idKey] === this.currentActiveItem)[0];
					var index = this.selectValue[this.currentActiveItem].indexOf(this.currentActiveItem);
					if (selected) {
						if (index > -1) {
							this.selectValue[this.currentActiveItem].splice(index, 1);
						}
					}
					else {
						var arr = this.selectValue[this.currentActiveItem].filter(eC => eC.id !== this.currentActiveItem);
						if (arr.length === major.children.length - 1) {
							this.selectValue[this.currentActiveItem].splice(0, 0, this.currentActiveItem);
						}
					}
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.ydl-col-picker {
		width: 750rpx;
		position: absolute;
		bottom: 0;
		z-index: 999;
	}

	.ydl-cp__body {
		width: 750rpx;
		height: 720rpx;
		background-color: #ffffff;
		border-top-left-radius: 24rpx;
		border-top-right-radius: 24rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		.ydl-cp__top {
			display: flex;
			align-content: center;
			justify-content: space-between;
			border-bottom: 2rpx solid #f5f5f5;
			padding: 20rpx;
		}

		.ydl-cp__search {
			width: 750rpx;
			height: 72rpx;
			padding: 0 20rpx;
			margin-top: 20rpx;
			box-sizing: border-box;
			display: flex;
			align-content: center;

			.ydl-cp__input {
				flex: 1;
				height: inherit;
				padding: 0 8px;
				border: 2rpx solid #d8e3ff;
				border-radius: 8rpx;
				font-size: 26rpx;
			}
		}

		.ydl-cp__content {
			padding: 20rpx 20rpx 0 20rpx;
			box-sizing: border-box;
			display: flex;
			flex-grow: 1;
			overflow: hidden;

			.ydl-cp__scroll {
				height: 100%;

				::-webkit-scrollbar {
					display: none;
				}
			}

			.ydl-cp__scroll--left {
				background-color: rgb(248, 248, 248);
			}

			.ydl-cp__scroll--right {
				background-color: #ffffff;
			}

			.ydl-cp__item {
				height: 88rpx;
				line-height: 88rpx;
				padding-left: 36rpx;
				box-sizing: border-box;
				display: flex;
				align-content: center;

				.ydl-cp__text {
					font-size: 28rpx;
					position: relative;

					.badge {
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						left: -12rpx;
						width: 8rpx;
						height: 8rpx;
						border-radius: 50%;
						background-color: #557ff7;
						display: none;
					}
				}

				.ydl-cp__check {
					margin-left: auto;
					display: none;
				}

				&.ydl-cp__item--active {
					.ydl-cp__text {
						color: #557ff7;
					}
				}

				&.ydl-cp__item--selected {
					.ydl-cp__text {
						.badge {
							display: block;
						}
					}

					.ydl-cp__check {
						display: block;
					}
				}
			}
		}
	}
</style>