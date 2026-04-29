<template>
	<view class="guide" v-if="showGuide" @touchmove.stop.prevent>
		<view :style="guideStyle" class="guide-box">
			<view class="tips guide-step-tips" :style="tipPosition">
				<view class="text">{{ guideInfo.tips }}</view>
				<view class="tool-btn">
					<text @click="skip">跳过</text>
					<view class="next" style="" @click="next">{{ guideInfo.next }}</view>
				</view>
			</view>
			<view class="arrow" :style="arrowTop"></view>
		</view>
		<!-- 遮罩层，防止点击 -->
		<view class="v-model"></view>
	</view>
</template>

<script>
	export default {
		name: "novice-guidance",
		props: {
			step: {
				type: Object,
				default: () => {
					return {}
				},
			}
		},
		data() {
			return {
				stepName: 'step', //该提示步骤的名称，用于不在重复展示
				guideList: [{
					el: '',
					tips: '',
					next: '',
					style: '',
				}],
				index: 0, // 当前展示的索引
				showGuide: true, // 是否显示引导
				guideStyle: '', // 默认样式
				arrowTop: '', //步骤提示三角形的定位
				tipPosition: '', //步骤提示的定位
				systemInfo: '', //屏幕宽度高度等信息
				tipWidth: 0 //步骤提示默认的宽度
			}
		},
		computed: {
			guideInfo() {
				return this.guideList[this.index];
			}
		},
		mounted() {
			this.guideList = this.step.guideList;
			this.stepName = this.step.name;
			const systemInfo = uni.getSystemInfoSync();
			this.systemInfo = systemInfo;
			const guide = uni.getStorageSync(this.stepName);
			if (!guide) {
				this.getDomInfo();
			} else {
				this.showGuide = false;
			}
		},
		methods: {
			// 展示新手提示
			viewTips(data, scrollTop, part) {
				if (data) {
					// 如果dom宽度大于或者等于窗口宽度,需要重新调整dom展示宽度
					let newWidth = this.systemInfo.windowWidth - 20;
					if (data.width >= newWidth) {
						data.width = newWidth;
					}
					// 如果距离左边为0,自动增加一点左边距
					if (data.left == 0) {
						data.left = 10;
					}
					let domRW = this.systemInfo.windowWidth - data.left;
					let left = 0;
					this.tipWidth = data.width * 2 + 30
					// 如果dom距离右边没有tips的宽度大的话,就要让tips向左偏移
					if (domRW < this.tipWidth) {
						left = domRW - this.tipWidth - 100; // domRW - this.tipWidth
					}
					const index = this.index;
					let ua = navigator.userAgent.toLowerCase();
					let isWeixin = ua.indexOf('micromessenger') > -1;
					console.log(this.guideInfo);
					// 步骤条展示的高度需要加上屏幕滚动的高度
					if (this.step.vueFixes) {
						data.top -= 15;
					}
					// uni.showModal({ content: '打印信息', success: (res) => { } });
					if (this.guideInfo.weixin) {
						var navHeight = uni.getStorageSync('navBarHeight');
						if (isWeixin && this.guideInfo.weixin.grid) {
							if (this.guideInfo.weixin.grid.top === 'navBarHeight' && navHeight) {
								data.top += navHeight;
							}
							else {
								
							}
						}						
					}
					
					// NO NEED TO SCROLL
					// data.top += scrollTop;
					// // 根据实际情况需要滚动到展示区域
					// uni.pageScrollTo({
					// 	scrollTop: data.top > 44 ? data.top - 44 : 0,
					// 	duration: 100
					// })
					
					let obj = Object.assign(this.guideList[index], data);
					// 设置三角形高度
					let arrowTop = data.height + 9;
					//如果dom在屏幕底部的话，重新调整提示框和三角形的定位
					let newHeight = this.systemInfo.windowHeight - data.bottom;
					
					// if near right.
					var right = part === 'right'; // domRW < this.tipWidth;
					var strLeft = right ? ('left:' + left + 'px;') : 'left: inherit;';
					console.log(strLeft);
					uni.createSelectorQuery().in(this).select('.tips').boundingClientRect(res => {
						if(this.index === this.guideList.length - 1){
							if (newHeight > ((res ? res.height : 0) + 5)) {
								this.arrowTop = "top:" + arrowTop + 'px;';
								// 设置提示框定位
								this.tipPosition = "top:" + (arrowTop + 5) + 'px;'+ strLeft +"background: linear-gradient(180deg, #1cbbb4, #0081ff);";
							} else {
								this.arrowTop = 'top: -19px;';
								// 设置提示框定位
								this.tipPosition = 'top: -14px;'+ strLeft + "transform: translateY(-100%);background: linear-gradient(0deg, #1cbbb4, #0081ff);";
							}
						}else{
							this.arrowTop = "top:" + arrowTop + 'px;';
							// 设置提示框定位
							this.tipPosition = "top:" + (arrowTop + 5) + 'px;'+ strLeft +"background: linear-gradient(180deg, #1cbbb4, #0081ff);";
						}
					}).exec();
					// 重新设置guideList的值
					this.guideList.splice(index, 1, obj);
					this.guideStyle = this.getStyle();
				} else {
					this.index += 1;
					this.getDomInfo();
				}
			},
			// 获取步骤提示的主要样式
			getStyle() {
				const {
					width,
					height,
					left,
					top,
					style = 'border-radius: 8rpx;margin: 0'
				} = this.guideInfo;
				let newstyle = "width:" + width + "px;";
				newstyle += "height:" + height + "px;";
				newstyle += "left:" + left + "px;";
				newstyle += "top:" + top + "px;";
				newstyle += "box-shadow: rgb(33 33 33 / 80%) 0px 0px 0px 0px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px;";
				newstyle += style;
				return newstyle;
			},
			// 获取dom信息
			getDomInfo() {
				try{
					const {
						el,
						part
					} = this.guideInfo;
					const query = uni.createSelectorQuery().in(this.$root);
					this.$nextTick(function() {
						query.select(el).boundingClientRect();
						query.selectViewport().scrollOffset();
						var _this = this;
						query.exec(function(res) {
							console.info('打印dom的元素的信息', res);
							let data = res[0]; // #the-id节点的上边界坐标
							let scrollTop = res[1].scrollTop; // 显示区域的竖直滚动位置
							_this.viewTips(data, scrollTop, part);
						})
					});
				} catch(error){
					console.log(error)
				} 
			},
			// 跳过新手提示
			skip() {
				this.showGuide = false;
				uni.setStorageSync(this.stepName, 'true');
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 100
				});
			},
			// 下一步
			next() {
				if (this.index === this.guideList.length - 1) {
					this.showGuide = false;
					uni.setStorageSync(this.stepName, 'true');
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 100
					});
				} else {
					this.index += 1;
					this.getDomInfo();
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.v-model {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
	}

	.guide {
		z-index: 1001;

		.guide-box {
			position: absolute;
			z-index: 10001;
			transition: all 0.2s;

			&::before {
				content: '';
				height: 100%;
				width: 100%;
				border: 1px dashed #fff;
				border-radius: 8rpx;
				position: absolute;
				top: -8rpx;
				left: -8rpx;
				padding: 7rpx;
			}

			.arrow {
				height: 20rpx;
				width: 20rpx;
				background: #1cbbb4;
				position: absolute;
				top: 144rpx;
				left: 45%;
				z-index: 10000;
				transform: rotate(45deg);
			}

			.tips {
				width: 400rpx;
				box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.1);
				color: #fff;
				position: absolute;
				top: 152rpx;
				left: -50%;
				z-index: 10001;
				padding: 15rpx 20rpx;
				font-size: 28rpx;
				border-radius: 12rpx;
				text-align: justify;

				.text {}

				.tool-btn {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-right: 0rpx;
					margin-top: 20rpx;

					.next {
						background: #fff;
						height: 48rpx;
						width: 100rpx;
						text-align: center;
						border-radius: 8rpx;
						color: #666;
						line-height: 48rpx;
						font-size: 24rpx
					}
				}
			}
		}
	}
</style>