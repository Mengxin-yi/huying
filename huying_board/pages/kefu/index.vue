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
				<view class="digitalHuman-video">
					<view class="video-con">
						<video :src="videoSrc" id="video1" autoplay ref="video" show-play-btn="false" controls="false"
							@play="onVideoPlay" @error="onVideoError" @waiting="onVideoWaiting"
							@timeupdate="onVideoTimeUpdate"></video>
					</view>

				</view>
				<!-- 播报内容 -->
				<view class="digitalHuman-text">
					<!-- 播报内容 头部 -->
					<view class="text-title">
						<span>📝 播报内容</span>
						<uni-tag class="state-tag" size="normal" text="在线" type="success" />
					</view>
					<!-- 播报内容 文字区 -->
					<view class="text-con">
						<view class="text-con-intro">
							{{resObj.content}}
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
			<!-- 数字人对话 -->
			<view class="kefu-mid-con">
				<view v-for="item in user_ai_List" class="mid-con-item" :class="item.role">
					<view class="item-text" v-if="item.text">{{item.text}}</view>
				</view>
			</view>
		</view>
		<!-- 底部 -->
		<view class="kefu-buttom">
			<view class="kefu-button-voice" v-if="textFalg">
				<!-- 切换按钮 -->
				<view class="imagesItems">
					<image src="/static/image/jianpan.png" @click="textFalg=false"></image>
				</view>
				<view class="voice-con" :class="recorderFalg ? 'action':'' " @touchstart="handleTouchStart"
					@touchend="handleTouchEnd" @touchcancel="handleTouchEnd" @mousedown="handleMouseDown"
					@mouseup="handleMouseUp" @mouseleave="handleMouseLeave">
					<image src="/static/image/maikefeng.png"></image>
					<view>{{recorderText}}</view>
				</view>

			</view>
			<view class="kefu-buttom-text" v-else>
				<!-- 切换按钮 -->
				<view class="imagesItems" @click="textFalg=true">
					<image src="/static/image/maikefeng.png"></image>
				</view>
				<!-- 输入框 -->
				<view class="text-input">
					<input class="uni-input" v-model="user_text" :disabled="loading" placeholder="请输入内容" />
				</view>
				<view class="text-btn">
					<button type="primary" :loading='loading' class="text-btn-text" @click="fs">发送</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import pageUtil from '../../common/js/utils/page.js';
	import jzRecorder from '@/uni_modules/jz-h5RecorderManager/js/index.js'
	export default {
		data() {
			return {
				textFalg: false,
				loading: false,
				user_ai_List: [], // 用户输入数组
				user_text: '', // 用户输入框
				audioLoading: false,
				resObj: {
					content: '',
					items: [],
				},
				videoContext: null,
				videoSrc: '',
				// 录音相关
				recorderFalg: false,
				recorderText: '长按进行对话',
				recorderManager: null,
				audioContext: null,
				recordFile: null

			}
		},
		onShow() {
			pageUtil.webApi.getDigitalHumanDailyReport({}).then(res => {
				this.videoSrc = res.url.replace('192.168.1.102:7577', 'numbervedio.ugoolink.com');
				this.videoContext.play()
				this.resObj = res
			}).catch(error => {
				pageUtil.toast(err);
			})
		},
		onLoad() {
			// 获取录音管理器
			this.recorderManager = jzRecorder.getRecorderManager()
			// 获取音频播放器
			this.audioContext = uni.createInnerAudioContext()
			this.audioContext.autoplay = true
			// 监听录音事件
			this.initRecorderEvents()
		},
		// 在 onReady 生命周期中获取 video 上下文A
		onReady() {
			this.videoContext = uni.createVideoContext('video1', this);
			this.videoContext.hideStatusBar()
		},
		methods: {
			// 返回
			goBack() {
				uni.navigateBack({
					delta: 9999 // 设置一个较大的数字，如果超出页面栈深度，会自动返回到首页
				});
			},
			// 发送数据到服务器
			async fs() {
				this.loading = true
				if (this.user_text.trim() === '') {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					});
					return;
				}
				// 获取用户输入并清空输入框
				const userMessage = this.user_text;
				this.user_text = '';
				// 添加用户消息到列表
				this.user_ai_List.push({
					text: userMessage,
					role: 'user', // 统一用 'user' 表示用户
				});
				this.userDeepSeek()
			},
			async userDeepSeek() {
				// 设置加载状态
				this.loading = true;
				try {
					// 构建对话历史（包括当前用户消息）
					const messages = this.buildMessages();
					// 调用 DeepSeek API
					const aiReply = await this.callDeepSeekAPI(messages);
					// 添加 AI 回复到列表
					this.user_ai_List.push({
						text: aiReply,
						role: 'ai', // 使用 'ai' 表示助手，与模板中的样式对应
					});


				} catch (error) {
					console.error('API 调用失败', error);
					uni.showToast({
						title: '获取回复失败，请重试',
						icon: 'none'
					});
				} finally {
					this.loading = false;
					this.recorderText = '长按进行对话'
					this.recorderFalg = false
				}
			},
			// 构建 API 所需的 messages 格式
			buildMessages() {
				// 可选：添加系统消息，定义助手角色
				const messages = [{
					role: 'system',
					content: '你是一个智能客服助手，请友好、准确地回答用户问题。'
				}];

				// 将现有对话历史转换为 API 格式
				this.user_ai_List.forEach(item => {
					// 将我们的 role 映射为 API 要求的 role
					const role = item.role === 'user' ? 'user' : 'assistant';
					messages.push({
						role,
						content: item.text
					});
				});
				return messages;
			},
			// 调用 DeepSeek API
			callDeepSeekAPI(messages) {
				return new Promise((resolve, reject) => {
					// 获取 API Key（假设存储在全局变量或配置中）
					const apiKey = 'sk-c9d2f97bd94a46ff988653892de8253b';
					if (!apiKey) {
						reject(new Error('未配置 API Key'));
						return;
					}

					uni.request({
						url: 'https://api.deepseek.com/v1/chat/completions', // DeepSeek 兼容 OpenAI 的端点
						method: 'POST',
						header: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${apiKey}`
						},
						data: {
							model: 'deepseek-chat', // 或具体模型名称，如 'deepseek-v3'
							messages: messages,
							temperature: 0.7,
							max_tokens: 1000,
							stream: false // 非流式输出
						},
						success: (res) => {
							if (res.statusCode === 200) {
								const aiContent = res.data.choices[0].message.content;
								resolve(aiContent);
							} else {
								reject(new Error(
									`API 错误: ${res.statusCode} - ${JSON.stringify(res.data)}`));
							}
						},
						fail: (err) => {
							reject(err);
						}
					});
				});
			},
			// reset() {
			// 	if (this.videoContext) {
			// 		this.videoContext.pause();
			// 		// videoContext 没有直接的 src 设置方法，所以可能需要其他方式
			// 		// 清空 src	
			// 		this.videoSrc = '';
			// 	}
			// },

			// 视频事件处理函数
			onVideoPlay(e) {
				console.log('视频开始播放', e);
			},
			onVideoError(e) {
				if (this.videoSrc == '' && this.resObj.msg_type == 'vedio') {
					pageUtil.toast('视频生成失败！');
				}else if(this.resObj.msg_type != 'vedio'){
					pageUtil.toast('视频生成错误！');
				}
				console.error('视频播放错误', e);
			},
			onVideoWaiting(e) {
				console.log('视频等待缓冲', e);
			},
			onVideoTimeUpdate(e) {
				// console.log('视频播放时间更新', e.detail.currentTime);
			},
			goDetail(id) {
				var uname = uni.getStorageSync('ms_username');
				var uid = uname ? pageUtil.helper.other.base64Encode(uname) : '';
				pageUtil.gotoPage('weiguang/detail?data_id=' + id + '&data_type=' + this.resObj.data_type +
					'&type=weiguang&uid=' + uid);
			},

			// 初始化录音事件监听
			initRecorderEvents() {
				// 录音开始
				this.recorderManager.onStart(() => {
					console.log('录音开始')

				})
				// 录音停止
				this.recorderManager.onStop((res) => {
					this.recordFile = res.tempFilePath
					// 发送到服务器进行语音识别
					this.speechRecognition()
					this.resetRecorder()
				})
				// 录音错误
				this.recorderManager.onError((err) => {
					console.error('录音错误', err)
					uni.showToast({
						title: err.errMsg,
						icon: 'none'
					})
					this.resetRecorder()
				})
			},

			startRecord() {
				if (!this.recorderFalg) {
					// 开始录音
					this.recordFile = ''
					this.recorderManager.start({
						duration: 60000, // 录音时长60秒
						sampleRate: 44100, // 采样率
						numberOfChannels: 1, // 声道数
						encodeBitRate: 192000, // 编码码率
						format: 'mp3' // 录音格式
					})
					this.recorderFalg = true
					this.recorderText = '松开结束对话'
				} else {
					this.resetRecorder()
				}

			},

			// 语音识别
			async speechRecognition() {
				if (this.recordFile == '') {
					console.log('无音频文件')
					return
				}
				const data = {
					file: this.recordFile
				}
				pageUtil.webApi.getDigitalHumanTranscribe(data).then(res => {
					const userMessage = res.text;
					this.user_text = '';
					// 添加用户消息到列表
					this.user_ai_List.push({
						text: userMessage,
						role: 'user', // 统一用 'user' 表示用户
					});
					this.userDeepSeek()
				})

			},

			// 开始长按计时（触摸或鼠标按下）
			startPressTimer() {
				// 清除之前的定时器，避免重复
				this.resetRecorder()
				this.clearPressTimer();

				// 设置一个新的定时器，500ms后触发长按方法
				this.pressTimer = setTimeout(() => {
					this.startRecord(); // 触发你真正的录音方法
				}, 200); // 500ms 是常用的长按阈值 [citation:3][citation:10]
			},
			// 清除定时器
			clearPressTimer() {
				if (this.pressTimer) {
					clearTimeout(this.pressTimer);
					this.pressTimer = null;
				}
			},
			// --- 触摸事件 (用于手机) ---
			handleTouchStart() {
				this.startPressTimer();
			},
			handleTouchEnd() {
				// 手指松开，如果还没到500ms，就取消长按，不触发 startRecord
				this.clearPressTimer();
				console.log('触摸结束，取消长按');
				this.resetRecorder()

			},
			// --- 鼠标事件 (用于PC浏览器) ---
			handleMouseDown() {
				this.startPressTimer();
			},
			handleMouseUp() {
				this.clearPressTimer();
				console.log('鼠标松开，取消长按');
				this.resetRecorder()
			},
			handleMouseLeave() {
				// 鼠标移出元素范围，也应视为取消长按
				this.clearPressTimer();
				this.resetRecorder()
			},
			resetRecorder() {
				this.recorderManager.stop()
				this.recorderFalg = false
				this.recorderText = '长按进行对话'
			},

		},
		onUnload() {

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
						height: 400rpx;

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

		.kefu-buttom {
			height: 120rpx;
			padding: 0 25rpx;
			display: flex;
			align-items: center;

			.kefu-button-voice {
				display: flex;
				align-items: center;
				width: 100%;
				justify-content: center;
				position: relative;

				.imagesItems {
					position: absolute;
					left: 0;
					width: 75rpx;
					height: 75rpx;
					border: 1px solid #fff;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;


					image {
						width: 50rpx;
						height: 50rpx;
					}
				}

				.voice-con {
					width: 240rpx;
					padding: 10rpx 20rpx;
					border: 1px solid #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 50rpx;
					color: #fff;
					/* 过渡动画：对 transform 属性应用 0.3 秒的缓动效果 */
					transition: transform 0.3s ease;

					image {
						width: 50rpx;
						height: 50rpx;
					}
				}

				.action {
					transform: scale(1.2);
				}
			}

			.kefu-buttom-text {
				display: flex;
				align-items: center;
				width: 100%;
				justify-content: space-between;

				.imagesItems {
					width: 75rpx;
					height: 75rpx;
					border: 1px solid #fff;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;


					image {
						width: 50rpx;
						height: 50rpx;
					}
				}

				.text-input {
					flex: 1;
					padding: 0 25rpx;

					input {
						border-radius: 5rpx;
					}
				}

				.text-btn {

					.text-btn-text {
						font-size: 37.5rpx;

					}
				}
			}
		}
	}
</style>