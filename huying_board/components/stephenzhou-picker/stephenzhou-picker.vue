<template>
	<view>
		<Popup 
			ref="popup" 
			type="bottom" 
			height="600" 
			radius="12" 
			:maskClickClose="maskClickClose"
			:showCloseIcon="false"
			:visible.sync="show"
			@handleHide="handleHide"
			>
		    <view class="popup-content" v-if="show">
		        <view class="popup_content_title"> {{ pickerTittle }}
					<view class="iconfont icon-icon_close icon_top" @tap="$refs.popup.hide()" v-if="showCloseIcon">取消</view>
					<view class="confirm" @tap="confirm" v-if="multiple">确定{{ '(' + checkList.length + ')' }}</view>
				</view>
		        <view class="dialog_search_box">
					<view class="iconfont icon-sousuo text-grey dialog_search_text"></view>
					<input type="text" @input="inputValue" v-model="input_value" placeholder="请输入搜索内容" class="dialog_search_inp"/>
				</view>
				<scroll-view 
				scroll-y="true" 
				class="select_item_box" 
				@scrolltolower="handleReachBottom">
					<view 
					class="select_item" 
					hover-class="select_item_hover" 
					@click="handleSelect(data)" 
					v-for="(data, index) in options" 
					:class="data.selected ? 'active' : ''"
					:key="index">
						{{ data[keyName] }}
						<!-- 选中状态 -->
						<view v-if="data.selected" class="iconfont icon-xuanzhong check-icon"></view>
					</view>
					<!-- 加载状态 -->
					<view class="list-state" v-if="pagination && !static">
						<view v-if="state === 'loadmore'" class="flex-cen">
							<view class="state-line"></view>
							<view class="text mx30">查看更多</view>
							<view class="state-line"></view>
						</view>
						<view v-if="state === 'loading'" class="flex-cen">
							<view class="loading"></view>
							<view class="text ml10">加载中...</view>
						</view>
						<view v-if="state === 'nomore'" class="flex-cen">
							<view class="state-line"></view>
							<view class="text mx30">没有更多数据了</view>
							<view class="state-line"></view>
						</view>
					</view>
				</scroll-view>
		    </view>
		</Popup>
	</view>
</template>


<script>
import Popup from './popup.vue'
import listMixin from './mixin'
export default {
	components: {
		Popup
	},
	mixins: [listMixin],
	props: {
		// 是否显示弹框
		visible: {
			type: Boolean,
			default: false
		},
		// 是否静态数据
		static: {
			type: Boolean,
			default: false
		},
		// 数据分页api
		api: {
			type: Function,
		},
		// 是否需要分页
		pagination: {
			type: Boolean,
			default: true
		},
		// 弹框标题
		pickerTittle:{
			type: String,
			default: '选择'
		},
		// 数据键名
		keyName: {
			type: String,
			default: 'value'
		},
		// 回显的字段
		target: {
			type: String,
			default: 'key'
		},
		// 数据源
		dataSource: {
			type: Array,
			default: () => {
				return [];
			}
		},
		// 回显值
		echoVal: {
			type: Array,
			default: () => {
				return [];
			}
		},
		// 回显标识
		echoKey: {
			type: String,
			default: 'id'
		},
		// 是否多选
		multiple: {
			type: Boolean,
			default: true
		},
		// 是否展示弹框关闭按钮
		showCloseIcon: {
			type: Boolean,
			default: true
		},
		// 是否点击遮罩关闭弹框
		maskClickClose: {
			type: Boolean,
			default: true
		},
	},
	data() {
		return {
			input_value:'',
			list:[],
			options: [],
			checkList: [],
			data: this.dataSource,
			listApi: this.api,
			show: false,
		}
	},
	computed: {},
	watch: {
		data: {
			handler: function(val, oldVal) {
				val.map(item => {
					this.checkList.map(child => {
						if(item[this.echoKey] === child[[this.echoKey]]) {
							item.selected = true;
						}
					})
				})
				this.list = val;
				this.options = val;
			},
			deep: true,
			immediate: true
		},
		visible(val, oldVal) {
			this.show = val;
			if(val) {
				this.handleShow()
			}
		},
		dataSource(val, oldVal) {
			this.data = val;
		}
	},
	methods: {
		handleReachBottom() {
			if(this.static) {
				return;
			}
			this.loadmore(this)
		},
		handleHide(){
			this.$emit('update:visible', false);
			let self = this;
			setTimeout(() => {
				self.input_value = ''
				self.options = self.list
				this.init(this, 'data'); // 关闭后重置分页数据
			}, 100)
		},
		handleShow(){
			this.checkList = this.echoVal;
			if(this.static) {
				return;
			}
			if(this.pagination) {
				this.getPage(this)
			} else {
				this.getList(this);
			}
			console.log(456);
		},
		handleSelect(item){
			// 多选
			if(this.multiple) {
				const current = this.checkList.findIndex(x => x[this.echoKey] === item[this.echoKey]);
				if(current === -1) {
					item.selected = true;
					this.checkList.push(item);
				} else {
					item.selected = false;
					this.checkList.splice(current, 1);
				}
			// 单选
			} else {
				this.checkList = [item];
				this.options.map(x => {
					x.selected = false;
					if(x[this.echoKey] === item[this.echoKey]) {
						x.selected = true;
					}
				})
				this.confirm();
			}
		},
		confirm() {
			this.$emit('change', { data: this.checkList, key: this.target })
			let self = this;
			self.$refs.popup.hide()
			setTimeout(( )=> {
				self.input_value = ''
				self.options = self.list
			}, 100)
		},
		inputValue(e) {
			var self = this
			var inputTxt = e.detail.value;
			self.options = []
			if(inputTxt.length == 0) {
				self.options = self.list;
			} else {
				// 判断传入数组类型
				self.options = self.list.filter(o => {
					return String(o[this.keyName]).indexOf(e.detail.value) >= 0
				})
			}
		},
	},
}
</script>

<style lang="scss">
@import "./iconfont.css";
$text-color: #606266;
.flex-cen {
	display: flex;
	align-items: center;
	justify-content: center;
}
.popup_content_title{
	padding-top: 30rpx;
	text-align: center;
	margin-bottom:30rpx;
	position: relative;
	font-size: 36rpx;
	.icon_top{
		font-size: 36rpx;
		position: absolute;
		top:20rpx;
		left: 20rpx;
	}
	.confirm {
		font-size: 32rpx;
		position: absolute;
		top:20rpx;
		right: 20rpx;
		color: #3c9cff;
	}
}

.dialog_search_box{
	width:680rpx;
	height: 80rpx;
	background-color: #f8f8f8;
	border-radius: 12rpx;
	margin: 0 auto;
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;
	.dialog_search_text{
		margin-left: 30rpx;
		font-size: 30rpx;
	}
	.dialog_search_inp{
		height: 76rpx;
		line-height: 76rpx;
		text-align: left;
		padding-left: 20rpx;
		width: 590rpx;
	}
}
.select_item_box{
		width: 750rpx;
		height:380rpx ;
		color: #333;
		.select_item{
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			width:680rpx;
			margin: 0 auto;
			padding: 16rpx 0;
			font-size: 30rpx;
			.check-icon {
				font-size: 30rpx;
				position: absolute;
				right: 0;
			}
		}
		.list-state {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.text {
				font-size: 26rpx;
				color: $text-color;
			}
			.mx30 {
				margin: 0 30rpx;
			}
			.ml10 {
				margin-left: 10rpx;
			}
			.state-line {
				margin: 0px;
				border-bottom: 1px solid rgb(230, 232, 235);
				width: 53px;
				border-top-color: rgb(230, 232, 235);
				border-right-color: rgb(230, 232, 235);
				border-left-color: rgb(230, 232, 235);
			}
		}
		.active {
			color: #2979ff;
		}
		.select_item_hover{
			background-color: #f8f8f8;
		}
}

.loading{
    width: 30rpx;
    height: 30rpx;
    background: $text-color;
    -webkit-mask: 
    radial-gradient( closest-side circle, royalblue 99%, transparent 100%) center top/25% 25% no-repeat,
    radial-gradient( closest-side circle, transparent 49%, red 50% 99%, transparent 100%),
    conic-gradient(transparent 10%, royalblue 90%);
    -webkit-mask-composite: source-over, source-in;
	animation: rotate 1s linear infinite;
}

@keyframes rotate{
  to {
	transform: rotate(360deg); 
  }
}
</style>
