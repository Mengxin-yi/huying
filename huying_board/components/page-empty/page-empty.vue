<template>
	<view class="component-inner">
		<image class="l-empty__image" mode="widthFix" v-if="image" :src="image"></image>
		<text class="l-empty__description" v-if="description">{{description}}</text>
		<view class="l-empty__bottom">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import imgEmpty from '../../static/image/empty.png';
	
	export default {
		name:"page-empty",
		props:{
			image:{
				type:[String],
				default:imgEmpty
			},
			description:{
				type:String,
				default:()=>{
					return '暂无数据';
				}
			}
		},
		data() {
			return {
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	$empty-padding: 64rpx 0;
	$empty-image-size: 200px;
	$empty-description-margin-top: 48rpx;
	$empty-description-padding: 0 60px;
	$empty-description-color: rgba(0,0,0,0.45);
	$empty-description-font-size: 28rpx;
	$empty-description-line-height: 1.5714285714285714;
	
	.component-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: $empty-padding;
			
			
		&__image {
			width: $empty-image-size;
			// height: $empty-image-size;
		}
		
		&__description {
			margin-top: $empty-description-margin-top;
			padding: $empty-description-padding;
			color: $empty-description-color;
			font-size: $empty-description-font-size;
			line-height: $empty-description-line-height;
		}
		&__bottom {
			 margin-top: $empty-description-margin-top;
		}
	}
</style>