<template>
	<view>
		<view class="mask" @tap="hideright" catchtouchmove="true" @touchmove.prevent="handleTouch" v-if="popShow == true"></view>
		<view class="pop-bg" :class="{'weixin': weixin, 'right_popup': popShow, 'hide_popup': !popShow}" catchtouchmove="true">
			<view class="pop-bg-inner">
				<view class="dismiss uni-icon" @tap="hideright">&#xe6b8;</view>
				<scroll-view class="pop_scroll">
					<slot />
				</scroll-view>
				<!-- <view class="uni-scroll-view-content">
					<slot />
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		mixins: [{
			methods: {
				setData: function(obj, callback) {
					let that = this;
					const handleData = (tepData, tepKey, afterKey) => {
						tepKey = tepKey.split('.');
						tepKey.forEach(item => {
							if (tepData[item] === null || tepData[item] === undefined) {
								let reg = /^[0-9]+$/;
								tepData[item] = reg.test(afterKey) ? [] : {};
								tepData = tepData[item];
							} else {
								tepData = tepData[item];
							}
						});
						return tepData;
					};
					const isFn = function(value) {
						return typeof value == 'function' || false;
					};
					Object.keys(obj).forEach(function(key) {
						let val = obj[key];
						key = key.replace(/\]/g, '').replace(/\[/g, '.');
						let front, after;
						let index_after = key.lastIndexOf('.');
						if (index_after != -1) {
							after = key.slice(index_after + 1);
							front = handleData(that, key.slice(0, index_after), after);
						} else {
							after = key;
							front = that;
						}
						if (front.$data && front.$data[after] === undefined) {
							Object.defineProperty(front, after, {
								get() {
									return front.$data[after];
								},
								set(newValue) {
									front.$data[after] = newValue;
									that.$forceUpdate();
								},
								enumerable: true,
								configurable: true
							});
							front[after] = val;
						} else {
							that.$set(front, after, val);
						}
					});
					isFn(callback) && this.$nextTick(callback);
				}
			}
		}],
		data() {
			return {
				weixin: false
			}
		},
		props: {
			// 菜单图标
			colors: {
				type: String,
				default: '#fa436a',
			},
			// 是否显示
			popShow: {
				type: Boolean,
				default: false,
			}
		},
		mounted() {
			let ua = navigator.userAgent.toLowerCase();
			this.weixin = ua.indexOf('micromessenger') > -1;
		},
		methods: {
			hideright() {
				this.$emit("hideClick");
			},
			handleTouch(e) {
				console.log(e);
				return false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mask {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 800;
	}
	/* 右侧弹出框 */
	.right_popup {
		width: 100%;
		height: 100%;
		position: fixed;
		right: 0;
		bottom: 0;
		background-color: #fff;
		z-index: 920;
		transition: all 0.3s;
	}
	.hide_popup {
		width: 100%;
		height: 100%;
		position: fixed;
		right: 0;
		bottom: -100%;
		z-index: 920;
		transition: all 0.3s;
		background-color: #fff;
	}
	.pop_scroll {
		/* #ifndef H5 */
		height: calc(90% - 128upx);
		margin-top: 128upx;
		/* #endif */
		/* #ifdef H5 */
		height: calc(90% - 128upx);
		margin-top: 128upx;
		/* #endif */
	}
	.pop-bg {
		background-color: #8EC5FC;
		background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);
			
		.pop-bg-inner {
			position: relative;
			// align-items: center;
			// justify-content: center;
			padding: 60rpx 60rpx;
			
			.dismiss {
				position: absolute;
				background-color: rgba(255, 255, 255, 0.35);
				color: rgba(255, 255, 255, 0.65);
				border-radius: 30rpx;
				width: 60rpx;
				height: 60rpx;
				align-items: center;
				justify-content: center;
				top: 30rpx;
				left: 30rpx;
			}
			:deep(.uni-card--full), :deep(.uni-list) {
				border-radius: 30rpx;
			}
			:deep(.uni-scroll-view-content) {
				overflow: scroll;
				height: calc(100vh - 300rpx);
			}
		}
		&.weixin {
			.pop-bg-inner {
				position: relative;
				// align-items: center;
				// justify-content: center;
				padding: 20rpx 60rpx;
			}
		}
	}
</style>