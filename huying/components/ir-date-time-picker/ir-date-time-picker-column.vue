<template>
	<view class="picker-view-coloumn">
		<view class="uni-picker-view-group">
			<view class="uni-picker-view-mask ir-datetime-picker-mask"></view>
			<view class="uni-picker-view-indicator ir-datetime-picker" style="height: 50px;"></view>
			<view class="uni-picker-view-content">							
				<swiper class="swiper" circular :indicator-dots="false" :autoplay="false" :duration="500" vertical :current="indexCurrent" @change="handleColumn">
					<swiper-item v-for="(item,index) in listData"
			:key="index">
						<view class="swiper-item">
						{{format.replace('%%val%%', item)}}
						</view>
					</swiper-item>
					<!-- <swiper-item>
						<view class="swiper-item uni-bg-red">A</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item uni-bg-green">B</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item uni-bg-blue">C</view>
					</swiper-item> -->
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "IrDateTimePickerColumn",
		props:{
			indexCurrent:{
				type:[Number],
				default:-1
			},
			indexColumn:{
				type:[Number],
				default:0
			},
			listData:{
				type:Array,
				default:()=>{
					return [];
				}
			},
			format:{
				type:[String],
				default:'%%val%%'
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			handleColumn(e) {
				// console.log(e.detail.current + ' - ' + this.indexColumn);
				this.$emit('change', {currentIndex: e.detail.current, currentColumn: this.indexColumn});
			}
		}
	}
</script>

<style lang="scss" scoped>

.picker-view-coloumn {
	width: 20vw;
	
	.uni-picker-view-group {
		
		.uni-picker-view-indicator.ir-datetime-picker {
			height: 100rpx;
			top: 50%;
			position: absolute;
		}
		.uni-picker-view-content {
			position: absolute;
			height: 100%;
			
			.swiper {
				position: absolute;
				top: 0rpx;
				height: 100%;
				width: 100%;
				
				:deep(.uni-swiper-slides) {
					top: calc(50% - 50rpx);
					bottom: auto;
					height: 100rpx;
					
					.uni-swiper-slide-frame {
						
						.swiper-item {
							height: 100rpx;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
		}
	}
}

</style>
