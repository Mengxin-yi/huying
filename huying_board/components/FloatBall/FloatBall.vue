<template>
	<movable-area class="movableArea">
		<movable-view class="movableView" :position="position" :x="x" :y="y" :direction="direction" :damping="damping"
			@change="onChange" @touchend="onTouchend">
			<image src="../../static/image/zxkf.png" @click="handledClick" mode="widthFix" class="iconImage"></image>
		</movable-view>
	</movable-area>
</template>

<script>
	// 全屏按钮
	export default {
		name: "FloatBall",
		data() {
			return {
				x: 0,
				y: 0,
				x1: 0,
				x2: 0,
				y1: 0,
				y2: 0,
				move: {
					x: 0,
					y: 0
				},

			};
		},
		emits: ['myClick'],
		props: {
			damping: {
				type: Number,
				default: 10
			},
			direction: {
				type: String,
				default: "all"
			},
			position: {
				type: Number,
				default: 4
			}
		},
		mounted() {
			uni.getSystemInfo({
				success: (res) => {
					this.x1 = -22;
					this.x2 = parseInt(res.windowWidth) - 50;
					this.y1 = 0;
					this.y2 = parseInt(res.windowHeight) - 20;
					if (this.position == 1 || this.position == 2) this.y = parseInt(this.y2 * 0.2);
					if (this.position == 3 || this.position == 4) this.y = parseInt(this.y2 * 0.8);
					if (this.position == 1 || this.position == 3) this.x = parseInt(this.x1);
					if (this.position == 2 || this.position == 4) this.x = parseInt(this.x2);
					this.move.x = this.x;
					this.move.y = this.y
				}
			})
		},
		methods: {
			onChange(e) {
				if (e.detail.source === "touch") {
					this.move.x = e.detail.x;
					this.move.y = e.detail.y;
				}
			},
			handledClick() {
				this.$emit('myClick')
			},
			onTouchend() {
				this.x = this.move.x;
				this.y = this.move.y;
				setTimeout(() => {
					if (this.move.x < this.x2 / 2) this.x = this.x1;
					else this.x = this.x2;
					console.log(this.x, this.y)
				}, 100)
			},
		}
	}
</script>

<style lang="less">
	.movableArea {
		position: fixed;
		top: 0;
		// left: calc(15px + var(--window-right));
		// right: calc(15px + var(--window-right));
		width: calc(100% - (15px + var(--window-right)));
		height: 100%;
		pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素
		z-index: 999;

		.movableView {
			pointer-events: auto; //可以点击
			width: 50px;
			height: 50px;
			padding: 4.5px;
			border-radius: 100%;
			background-color: rgb(0, 122, 255);
			opacity: 0.6;

			display: flex;
			align-items: center;
			justify-content: center;

			// border: 2px solid #f8931f;

			.iconImage {
				display: block;
				width: 35px;
				height: 35px;
				// animation: iconImage 5s linear infinite;
			}

			@keyframes iconImage {
				0% {
					-webkit-transform: rotate(0deg);
				}

				25% {
					-webkit-transform: rotate(90deg);
				}

				50% {
					-webkit-transform: rotate(180deg);
				}

				75% {
					-webkit-transform: rotate(270deg);
				}

				100% {
					-webkit-transform: rotate(360deg);
				}
			}


		}
	}
</style>