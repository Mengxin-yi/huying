<template>
	<view v-if="productList.length>0">
		<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item, index) in productList"
			:key="item.id">
			<view class="topTitleV">{{toSting(item.title,20)}}</view>
			<view class=" unitV">起止时间:<span class="frts">{{item.start_time+'-'+item.end_time}}</span> </view>
			<view class=" unitV">创建时间:<span class="frts">{{item.create_time}}</span> </view>
			<view class=" unitV">数据类型:<span class="frts">{{item.type}}</span> </view>
			<view class=" unitV">推送次数:<span class="frts">{{item.push_num}}</span> </view>
			<view class=" unitV">状态:<span class="frts">{{item.status}}</span> </view>
			<view class=" unitV" v-if="item.city.length > 0">省份地区:<span class="frts">{{item.city.join(', ')}}</span>
			</view>
			<view class=" unitV" v-if="item.company.length > 0">单位名称:<span
					class="frts">{{item.company.join(', ')}}</span> </view>
			<view class=" unitV" v-if="item.keywords.length > 0">关键词:
			</view>
			<view v-if="item.keywords.length > 0"
				style="display: flex; flex-wrap: wrap; margin-top: -30px; margin-left: 40px;  width:calc(100vw-62px);flex-direction: row;">
				<view class="cellView" :style="{ color: bindColor(index), backgroundColor: bindBgColor(index) }"
					v-for="(tagItem, index) in item.keywords" :key="index">
					{{tagItem}}
				</view>
			</view>

			<uni-grid style="display: flex;justify-content: center;align-items: center;margin:30rpx 0" :column="3"
				:highlight="true"  borderColor="#e5e5e5" v-if="!item._media">
				<button type="default" size="mini" v-if="item.status == '过期失效'" style="background-color: #E6A23C; color: #fff;"  @click.native="handleRenew(item)">续订</button>
				<button type="default" size="mini"  :style=" item.status == '过期失效' ? 'margin-left: 40rpx;' :''" @click.native="handleDetail(item)">详情</button>
				<button style="margin-left: 40rpx;" type="primary" size="mini"
					@click.native="handleEdit(item)">编辑</button>
				<button style="margin-left: 40rpx;" type="warn" size="mini"
					@click.native="handleDelete(item)">删除</button>
			</uni-grid>
		</view>
	</view>
</template>

<script>
	export default {
		props: {

			productList: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {

			}
		},
		methods: {
			toSting(str, maxLength) {
				if (str.length > maxLength) {
					return str.slice(0, maxLength - 1) + '...';
				}
				return str;
			},
			handleDetail(item) {
				this.$emit('Detail', item)
			},
			handleEdit(item) {
				this.$emit('Edit', item)
			},
			handleDelete(item) {
				this.$emit('Delete', item)
			},
			handleRenew(item){
				this.$emit('Renew', item)
			},
			bindTag(item) {
				return [item.area, item.proType, item.stage]
			},
			bindColor(index) {
				let colorArr = ['#4473FF', '#FFA01B', '#41D380'];
				return colorArr[index % 3];
			},
			bindBgColor(index) {
				let bgColorArr = ['#F1F4FA', '#FFF5E8', '#ECFAF2'];
				return bgColorArr[index % 3];
			},

		}
	}
</script>

<style scoped>
	.uni-list-cell {
		flex-direction: column;
		margin-top: 10px;
		background-color: white;
		padding: 6px 12px;
		border-radius: 10rpx;

	}

	.uni-list-cell::after {
		background-color: transparent;
	}

	.topTitleV {

		height: 26px;
		line-height: 26px;
		color: #333333;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 500;
		font-size: 16px;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

	}

	.unitV {
		color: #555555;
		font-size: 14px;
		margin-top: 0px;
		font-family: PingFangSC-Regular, PingFang SC;
		display: flow;
		line-height: 46rpx;

	}
	.frts {
		color: #999;
		margin-left: 20rpx;
	}

	.cellView {
		margin-top: 8px;
		margin-left: 8px;
		height: 22px;
		line-height: 22px;
		text-align: center;
		border-radius: 2px;
		padding: 0px 4px !important;
		font-size: 12px;
		color: #4272FF;
		background: #F3F4F6;
	}
</style>