### piaoyi-like-effect 点击特效动画

**使用示例如下：**

```
<template>
	<view
		style="padding: 400rpx 100rpx;display: flex;align-items: center;justify-content: center;flex-direction: column;">
		<piaoyi-like-effect :num="num" :duration="duration" :imgList="imgList" :offset="offset">
			<image class="imgs" src="../../components/piaoyi-like_effect/dianzan.png" mode=""></image>
		</piaoyi-like-effect>
		<view class="box">
			<view class="box-title">图标数量</view>
			<radio-group @change="radioChange">
				<label class="radios" v-for="(item, index) in numList" :key="item.num">
					<radio :value="item.num"  :checked="item.num == num"/>{{item.num}}
				</label>
			</radio-group>
		</view>
		<view class="box">
			<view class="box-title">可偏移量</view>
			<radio-group @change="offsetChange" class="radioGroup">
				<label class="radios" v-for="(item, index) in offsetList" :key="item.offset">
					<radio :value="item.offset"  :checked="item.offset == offset[1]"/>{{[-item.offset, item.offset]}}
				</label>
			</radio-group>
		</view>
	</view>
</template>

<script>
	import piaoyiLikeEffect from '@/uni_modules/piaoyi-like_effect/components/piaoyi-like_effect/piaoyi-like_effect.vue'
	export default {
		data() {
			return {
				num: 5,
				duration: 3000,
				offset: [-50, 50],
				imgList: [
					require('../../components/piaoyi-like_effect/xiaolian.png'),
					require('../../components/piaoyi-like_effect/aixin.png'),
					require('../../components/piaoyi-like_effect/kaitonghuiyuan.png'),
				],
				numList: [{
					num: '5'
				}, {
					num: '20'
				}, {
					num: '40'
				}],
				offsetList: [{
					offset: '10'
				}, {
					offset: '50'
				}, {
					offset: '100'
				}]
			};
		},
		components: {
			piaoyiLikeEffect
		},
		methods: {
			radioChange(e) {
				this.num = parseInt(e.detail.value)
			},
			offsetChange(e) {
				this.offset = [...[-e.detail.value, parseInt(e.detail.value)]]
			}
		}
	}
</script>

<style lang="scss">
	.box {
		margin-top: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10rpx 0;
		&-title {
			margin-bottom: 20rpx;
			font-size: 24rpx;
			line-height: 24rpx;
			font-weight: 700;
		}
		.radioGroup {
			display: flex;
			flex-direction: column;
		}
		.radios {
			margin-right: 10rpx;
			radio {
				transform: scale(0.8);
			}
		}
	}
	.imgs {
		width: 90rpx;
		height: 80rpx;
	}
</style>

```
#### 使用说明

此插件包含多种动画，直接引入插件，通过slot插槽插入自己的内容

#### Prop

| 参数名称 | 描述                           |
| -------- | ------------------------------ |
| num | 图标数量，默认值 5 |
| duration | 动画时长,默认值1000 |
| offset | 动画左右偏移范围,默认值[-50, 50] |
| imgList | 动画的图片数组，格式见图上示例 |

### 可接定制化组件开发
### 右侧有本人代表作小程序二维码，可以扫码体验
### 如使用过程中有问题或有一些好的建议，欢迎加QQ群互相学习交流：120594820