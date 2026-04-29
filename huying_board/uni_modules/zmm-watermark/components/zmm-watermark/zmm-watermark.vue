<template>
	<view class="zmm-watermark">
		<!-- 单个用于计算 -->
		<view class="zmm-watermark-mold" ref="mold" id="mold">
			<rich-text :style="moldStyle" :nodes="watermark"></rich-text>
		</view>
		<!-- 循环 -->
		<view class="zmm-watermark-content" :style="{opacity:opacity}">
			<rich-text :nodes="watermark" :style="itemStyle" v-for="(item,index) in forLength" :key="index"></rich-text>
		</view>
	</view>
</template>

<script>
	// #ifdef APP-NVUE
	const dom = weex.requireModule("dom");
	// #endif
	export default {
		data() {
			return {
				forLength: 0, //水印数量
				watermarkArea: 0 //水印大小(像素)
			};
		},
		props: {
			watermark: { //水印文字(支持html富文本)
				type: String,
				default: '水印文字'
			},
			color: { //水印文字默认颜色
				type: String,
				default: '#666'
			},
			fontSize: { //水印文字大小
				type: Number,
				default: 16
			},
			opacity: { //水印透明度
				type: Number,
				default: 0.15
			},
			margin: { //水印之间上下间距
				type: Number,
				default: 10
			},
			rotate: { //水印旋转角度
				type: Number,
				default: -21
			},
			column: { //水印列数
				type: Number,
				default: 3
			}
		},
		computed: {
			// 单个水印
			moldStyle() {
				return `width:${this.itemWidth}px;text-align: center;font-size:${this.fontSize}px;`
			},
			// 循环水印
			itemStyle() {
				return `color:${this.color};font-size:${this.fontSize}px;margin:${this.margin}px;width:${this.itemWidth}px;transform:rotate(${this.rotate}deg);text-align: center;`
			},
			// 屏幕像素
			screenArea() {
				let height = uni.getSystemInfoSync().windowHeight + uni.getSystemInfoSync().windowTop
				let width = uni.getSystemInfoSync().windowWidth
				return Math.floor(height * width * 1.2)
			},
			// 单个水印最大长度
			itemWidth() {
				let windowWidth = uni.getSystemInfoSync().windowWidth
				return Math.floor(windowWidth / this.column - this.margin * 2)
			}
		},
		watch: {
			watermark: {
				handler(v) {
					if (v) {
						this.countForLength();
					}
				},
				deep: true
			}
		},
		mounted() {
			if (this.watermark) {
				this.countForLength();
			}
		},
		methods: {
			countForLength() { //计算水印数量
				// #ifndef APP-NVUE
				const query = uni.createSelectorQuery().in(this);
				query.select('#mold').boundingClientRect(data => {
					let width = data.width ? data.width : this.itemWidth
					let height = data.height ? data.height : 30
					let itemWidth = width + this.margin * 2
					let itemHeight = height + this.margin * 2
					this.watermarkArea = Math.floor(itemWidth * itemHeight)
					this.forLength = Math.floor(this.screenArea / this.watermarkArea)
				}).exec();
				// #endif
				// #ifdef APP-NVUE
				setTimeout(() => {
					const result = dom.getComponentRect(this.$refs.mold, (option) => {
						let size = option.size;
						let itemWidth = size.width + this.margin * 2
						let itemHeight = size.height + this.margin * 2
						this.watermarkArea = Math.floor(itemWidth * itemHeight)
						this.forLength = Math.floor(this.screenArea / this.watermarkArea)
					});
				}, 50);
				// #endif
			},
		}
	}
</script>
<style lang="scss" scoped>
	.zmm-watermark {
		position: fixed;
		overflow: hidden;
		z-index: 999;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		pointer-events: none;
		/* #endif */
	}

	.zmm-watermark-content {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.zmm-watermark-mold {
		position: fixed;
		left: 0;
		top: 0;
		opacity: 0;
	}
</style>