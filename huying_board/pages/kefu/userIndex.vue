<template>
	<view class="kefu-con">
		<!-- 顶部 -->
		<view class="kefu-top">
			<image src="/static/image/fanhui.png" @click=goBack></image>
			<!-- <image src="/static/image/wenhao.png" @click=wenhan></image> -->
		</view>
		<!-- 内容区域 -->
		<view class="kefu-mid">
			<!-- 数字人播报 -->
			<view class="digitalHuman-con">
				<!-- 视频区 -->
				<view class="digitalHuman-video avatar-card">
					<view class="avatar-container">
						<view class="digital-avatar">
							<view class="avatar-halo"></view>
							<view class="avatar-head">
								<view class="avatar-eyes">
									<view class="eye"></view>
									<view class="eye"></view>
								</view>
								<view class="avatar-mouth"
									:style="{ animationPlayState: isPlaying ? 'running' : 'paused' }"></view>
							</view>
							<view class="avatar-body"></view>
						</view>
					</view>
					<!-- 音频播放 -->
					<view class="audioCon">
						<view>
							<image src="/static/icon/yinpinbobao.png" :class="{ rotating: isPlaying }"></image>
							<view style="margin-left: 20rpx;"><uni-tag class="state-tag" size="normal"
									:text="isPlaying ? '播放中' : '暂停中'" :type="isPlaying ? 'success' : 'warning' " />
							</view>
						</view>

						<view>
							<image style="margin-left: 20rpx;" src="/static/icon/播放.png" @click="yinpinPlay"></image>
							<image style="margin-left: 20rpx;" src="/static/icon/暂停.png" @click="yinpinStop"></image>
						</view>
					</view>
				</view>
				<!-- 播报内容 -->
				<view class="digitalHuman-text">
					<!-- 播报内容 头部 -->
					<view class="text-title">
						<span>📝 播报内容</span>
					</view>
					<!-- 播报内容 文字区 -->
					<view class="text-con">
						<view class="text-con-intro">
							{{resObj.content || '暂无简报'}}
						</view>
						<view class="text-con-items">
							<view class="text-con-item" @click="goDetail(item.data_id)" v-if='resObj.items.length>0'
								v-for="(item,index) in resObj.items" :key="index">
								{{item.title}}
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pageUtil from '../../common/js/utils/page.js';
	export default {
		data() {
			return {
				isPlaying: false,
				resObj: {
					content: '',
					items: [],
				},
				audioPlayFlag: false,
				innerAudioContext: null,
			}
		},
		onShow() {
			this.initAudio()
			pageUtil.webApi.getDigitalHumanDailyReport({}).then(async (res) => {
				this.resObj = res
				await this.textToSpeech(res.content)
			}).catch(error => {
				console.log(error)
				pageUtil.toast('暂无简报！');
			})

		},
		onLoad() {},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack({
					delta: 9999 // 设置一个较大的数字，如果超出页面栈深度，会自动返回到首页
				});
			},
			goDetail(id) {
				var uname = uni.getStorageSync('ms_username');
				var uid = uname ? pageUtil.helper.other.base64Encode(uname) : '';
				pageUtil.gotoPage('weiguang/detail?data_id=' + id + '&data_type=' + this.resObj.data_type +
					'&type=weiguang&uid=' + uid);
			},
			yinpinPlay() {
				if (this.resObj.content == '') {
					pageUtil.toast('暂无简报！');
					return
				}
				this.isPlaying = true
				if (!this.audioPlayFlag) {
					this.innerAudioContext.play()
				}
			},
			yinpinStop() {
				if (this.resObj.content == '') {
					pageUtil.toast('暂无简报！');
					return
				}
				this.isPlaying = false
				if (this.audioPlayFlag) {
					this.innerAudioContext.pause()
				}
			},
			// 文字转音频
			async textToSpeech(text) {
				const response = await pageUtil.webApi.textToSpeechFun({
					text: text,
					character: "xiaoA"
				})
				this.innerAudioContext.src = response
				this.innerAudioContext.stop()
			},
			// 初始化音频
			initAudio() {
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = '';
				innerAudioContext.onPlay(() => {
					this.audioPlayFlag = true
				});
				innerAudioContext.onError((res) => {
					console.log(res);
				});
				innerAudioContext.onPause(() => {
					this.yinpinStop()
					this.audioPlayFlag = false
				})
				this.innerAudioContext = innerAudioContext
			},
		},
		onUnload() {
			this.innerAudioContext = null;
		}
	}
</script>

<style lang="less" scoped>
	@text-font-size: 32rpx;
	@text2-font-size: 36rpx;
	@title-font-size: 40rpx;

	.kefu-con {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
		background-image: url('../../static/image/login_bg.c983be5.png');
		background-size: contain;

		.kefu-top {
			height: 120rpx;
			padding: 0 25rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;


			image {
				width: 50rpx;
				height: 50rpx;

			}

		}

		.kefu-mid {
			flex: 1;
			overflow: auto;


			// 数字人	
			.digitalHuman-con {
				padding: 0 20rpx;
				padding-bottom: 20rpx;

				.digitalHuman-video {
					background-color: #fff;
					border-radius: 10rpx;
					padding: 20rpx 25rpx;
					font-size: @text-font-size;


					.video-con {
						width: 100%;
						height: 340rpx;

						video {
							width: 100%;
							height: 100%;
							object-fit: contain;
						}
					}
				}

				.digitalHuman-text {
					margin-top: 20rpx;
					background-color: #fff;
					border-radius: 10rpx;
					padding: 10rpx 15rpx;


					.text-title {
						font-size: @title-font-size;
						font-weight: bold;
						display: flex;
						align-items: center;

						.state-tag {
							margin-left: 15rpx;
						}
					}

					.text-con {
						margin-top: 10rpx;
						font-size: @text2-font-size;

						.text-con-items {
							.text-con-item {
								margin-top: 8rpx;
								color: #00aaff;
								border-bottom: 1rpx solid #f0f0f0;
								font-size: @text-font-size;
								// @text-font-size: 28rpx;
							}
						}
					}
				}
			}

			.kefu-mid-con {
				.mid-con-item {
					display: flex;
					margin-bottom: 25rpx;

					padding: 0 10px;

					.item-text {
						max-width: 60%;
						background: #fff;
						padding: 15rpx 25rpx;
						border-radius: 15rpx;
						font-size: @text-font-size;
					}
				}

				.user {
					color: #000;
					justify-content: flex-end;

					.item-text {
						border-radius: 15rpx 0rpx 15rpx 15rpx;
					}

				}

				.ai {
					color: red;
					justify-content: flex-start;

					.item-text {
						border-radius: 0rpx 15rpx 15rpx 15rpx;
					}
				}
			}
		}

	}
</style>

<style lang="less" scoped>
	.avatar-card {
		background: #fff;
		overflow: hidden;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

		.avatar-container {
			position: relative;
			width: 100%;
			height: 400rpx;
			background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.digital-avatar {
			position: relative;
			width: 150rpx;
			height: 240rpx;
			animation: breathe 3s ease-in-out infinite;
		}

		.avatar-head {
			width: 65px;
			height: 72px;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			border-radius: 50% 50% 45% 45%;
			margin: 0 auto;
			position: relative;
			box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
		}

		.avatar-eyes {
			position: absolute;
			top: 28px;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			gap: 12px;
		}

		.eye {
			width: 10px;
			height: 10px;
			background: #fff;
			border-radius: 50%;
			animation: blink 4s infinite;
		}

		.avatar-mouth {
			position: absolute;
			bottom: 16px;
			left: 50%;
			transform: translateX(-50%);
			width: 16px;
			height: 6px;
			background: rgba(255, 255, 255, 0.4);
			border-radius: 0 0 8px 8px;
			animation: speak 0.5s infinite;
		}

		.avatar-body {
			width: 80px;
			height: 64px;
			background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
			border-radius: 16px 16px 24px 24px;
			margin: 4px auto 0;
			position: relative;
		}

		.avatar-halo {
			position: absolute;
			top: -16px;
			left: 50%;
			transform: translateX(-50%);
			width: 96px;
			height: 96px;
			border: 2px solid rgba(102, 126, 234, 0.25);
			border-radius: 50%;
			animation: rotate 10s linear infinite;
		}

		.avatar-halo::before {
			content: '';
			position: absolute;
			top: -8px;
			left: -8px;
			right: -8px;
			bottom: -8px;
			border: 1px solid rgba(240, 147, 251, 0.15);
			border-radius: 50%;
		}

		@keyframes breathe {

			0%,
			100% {
				transform: translateY(0);
			}

			50% {
				transform: translateY(-4px);
			}
		}

		@keyframes blink {

			0%,
			90%,
			100% {
				transform: scaleY(1);
			}

			95% {
				transform: scaleY(0.1);
			}
		}

		@keyframes speak {

			0%,
			100% {
				height: 6px;
			}

			50% {
				height: 10px;
			}
		}

		@keyframes rotate {
			from {
				transform: translateX(-50%) rotate(0deg);
			}

			to {
				transform: translateX(-50%) rotate(360deg);
			}
		}

		/* 播放控制区域 */
		.playback-section {
			padding: 16px;
			border-top: 1px solid #ebedf0;
		}

		.playback-controls {
			display: flex;
			align-items: center;
			gap: 12px;
		}

		.play-btn-wrapper {
			flex-shrink: 0;
		}

		.play-btn {
			width: 44px;
			height: 44px;
			background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
			border: none;
			border-radius: 50%;
			color: #fff;
			font-size: 18px;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: transform 0.2s;
			box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
		}

		.play-btn:active {
			transform: scale(0.95);
		}

		.play-btn.playing {
			animation: pulse 1s infinite;
		}

		@keyframes pulse {

			0%,
			100% {
				box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
			}

			50% {
				box-shadow: 0 2px 20px rgba(102, 126, 234, 0.6);
			}
		}

		.progress-wrapper {
			flex: 1;
		}

		.progress-bar {
			width: 100%;
			height: 4px;
			background: #ebedf0;
			border-radius: 2px;
			overflow: hidden;
			cursor: pointer;
			position: relative;
		}

		.progress-fill {
			height: 100%;
			background: linear-gradient(90deg, #667eea, #764ba2);
			width: 0%;
			transition: width 0.1s linear;
		}

		.time-display {
			display: flex;
			justify-content: space-between;
			font-size: 12px;
			color: #969799;
			margin-top: 6px;
		}
	}

	.audioCon {
		display: flex;
		margin-top: 20rpx;
		justify-content: space-between;
		align-items: center;

		&>view {
			display: flex;
			align-items: center;
		}

		image {
			width: 50rpx;
			height: 50rpx;
		}
	}

	/* 定义旋转动画 */
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	/* 应用动画的类 */
	.rotating {
		animation: spin 2s linear infinite;
		/* 2秒转一圈，线性速度，无限循环 */
	}
</style>