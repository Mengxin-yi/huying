<template>
	<view class="piaoyi-btns" @tap="onLike">
		<!-- <view class="piaoyi-btn" :style="'background: url(' + image + ') no-repeat;background-size: 100% 100%;'"></view> -->
		<view class="piaoyi-btn">
			<slot></slot>
		</view>
		<view class="likebox">
			<view class="like-item" :style="'background: url(' + item.image + ') no-repeat;'" :animation="item.animationData" v-for="(item, index) in animationList"
				:key="index">
			</view>
		</view>
	</view>
</template>

<script>
	import imgLikeHL from '../../../../static/icon/misc/likeHL.png';
	
	export default {
		data() {
			return {
				animationList: []
			};
		},
		props: {
			enable: {
				type: Boolean,
				default: true
			},
			num: {
				type: Number,
				default: 5
			},
			duration: {
				type: Number,
				default: 1000,
				
			},
			// image: {
			// 	type: String,
			// 	default: require('../../components/piaoyi-like_effect/dianzan.png')
			// }, 
			imgList: {
				type: Array,
				default: () => [
					imgLikeHL
				]
			},
			offset: {
				type: Array,
				default: () => [-50, 50]
			}
		},
		mounted() {

		},
		methods: {
			onLike() {
				if (!this.enable) {
					return;
				}
				var animationList = []
				for (var i = 0; i < this.num; i++) {
					var animation = uni.createAnimation({
						duration: this.duration + this.random(-50, 50),
						timingFunction: 'ease',
					})
					animation.translate(this.random(...this.offset), -150 + this.random(-100, 120)).scale(1.2, 1.2).step()
					var image = this.imgList[this.random(0, this.imgList.length)]
					animationList.push({
						animation,
						image,
						animationData: animation.export()
					})
				}
				this.animationList = animationList
				setTimeout(() => {
					this.animationList = []
				}, this.duration + 100)
			},
			random(min, max) {
			    return Math.floor(Math.random() * (max - min)) + min;
			}
		}
	}
</script>

<style lang="scss">
	.piaoyi-btns {
		width: 110rpx;
		height: 100rpx;
		border-radius: 20rpx;
		line-height: 100rpx;
		text-align: center;
		position: relative;

		.piaoyi-btn {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 10;
			width: 100%;
			height: 100%;
		}

		.likebox {
			z-index: 8;
			position: absolute;
			width: 100%;
			height: 100%;

			.like-item {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background-size: 100% 100%!important;
				margin: auto;
			}
		}
	}
</style>
