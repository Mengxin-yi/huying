<template>
	<view class="content-inner">
		<view class="district">
			<div id="qrcode"></div>
			<!-- <div id="QRCodeNone"></div>
			<canvas id="qrcode"></canvas> -->
		</view>
		<view class="district description">
			<view class="action">长按二维码进行操作</view>
			<view class="note">(可以保存或扫描二维码)</view>
		</view>
	</view>
</template>

<script>
	import pageUtil from '../../../common/js/utils/page.js';

	export default {
		data() {
			return {
				linkWechat: ''
			}
		},
		onShow() {
			// this.getData();
		},
		mounted() {
			pageUtil.checkWechatAll();
			//兼容安卓二维码长按问题
			this.$nextTick(() => {
				pageUtil.webApi.getWechatBindLink({
						_silent: true
					})
					.then(res => {
						this.linkWechat = res.link;
						const canvas = document.getElementById('qrcode');
						while (canvas.firstChild) {
							canvas.removeChild(canvas.firstChild);
						}
						new pageUtil.helper.other.qrcode(canvas, {
							text: this.linkWechat,
							width: 300,
							height: 300,
							colorDark: '#000000',
							colorLight: '#ffffff',
							correctLevel: 3
						});
						if (uni.getSystemInfoSync().platform == 'android') {
							let myCanvas = document.getElementsByTagName("canvas")[0];
							myCanvas.style.display = "none"
							let img = this.convertCanvasToImage(myCanvas);
							let code = document.getElementById("qrcode");
							code.appendChild(img);
						}
					})
					.catch(err => {
						pageUtil.toast(err);
					});
			})
		},
		methods: {
			convertCanvasToImage(canvas) {
				var _fixType = function(type) {
					type = type.toLowerCase().replace(/jpg/i, 'jpeg');
					var r = type.match(/png|jpeg|bmp|gif/)[0];
					return 'image/' + r;
				};
				var type = 'png';
				var fixType = _fixType(type);
				var downLoadImgUrl = canvas.toDataURL(fixType);
				var downLoadImgUrl1 = downLoadImgUrl;
				var image = new Image();
				image.src = downLoadImgUrl1;
				return image;
			},
			getData() {
				pageUtil.webApi.getWechatBindLink({
						_silent: true
					})
					.then(res => {
						this.linkWechat = res.link;
						const canvas = document.getElementById('qrcode');
						while (canvas.firstChild) {
							canvas.removeChild(canvas.firstChild);
						}
						new pageUtil.helper.other.qrcode(canvas, {
							text: this.linkWechat,
							width: 300,
							height: 300,
							colorDark: '#000000',
							colorLight: '#ffffff',
							correctLevel: 3
						});
					})
					.catch(err => {
						pageUtil.toast(err);
					});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content-inner {
		padding: 30rpx 0rpx;

		.district {
			background-color: #fff;
			padding: 30rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			uni-canvas {
				height: 600rpx;
			}

			&.description {
				display: flex;
				flex-direction: column;

				.action {
					font-size: 34rpx;
				}

				.note {
					color: var(--text-2nd-color);
				}
			}
		}

		uni-button {
			margin: 0rpx 20rpx;
		}
	}
</style>