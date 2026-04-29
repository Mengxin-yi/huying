<template>
	<view class="content-inner">
		<view>
			<uni-notice-bar v-if="!data || Object.keys(data).length === 0" @click="sdsds" show-icon scrollable
				text="卓越人生都在高效工作，立刻开始第一项事程吧" />
			<view class="action">
				<lxCalendar @change="changeCalendar" :date_tip="dateNum" brief></lxCalendar>
			</view>

			<page-empty v-if="!data || Object.keys(data).length === 0"></page-empty>
			<uni-swipe-action class="list-item" style="width: 96%;margin: 5px auto;" v-for="(obj,index) in data"
				:key="index" @click="handleDetail(obj)">
				<!-- <view v-if="obj._media" @click.stop="" v-html="obj.content"></view> -->
				<!-- {{obj.is_finished}}{{obj.is_overdue}} -->
				<uni-swipe-action-item :left-options="optionLeft" :right-options="getOptionRight(obj)"
					:auto-close="false" @change="changeListItem" @click="bindClick($event, obj)" v-if="!obj._media">
					<uni-icons v-if="obj.news_set==1" class="tssd" type="notification-filled" size="23"
						color="#cb5555"></uni-icons>
					<view :class="{'content-box': true}">
						<!-- <view :class="{'generally':true,}">
							<view class="ribbon" v-if="obj.is_overdue === 1">已过期</view>
							<view class="ribbon" v-else-if="obj.is_finished === 1">已完成</view>
						</view> -->
						<view v-if="obj.is_finished === 0&&obj.is_overdue === 0"
							:class="{'generally': true, 'expirea': true}">
							<view class="ribbonb">计划中</view>
						</view>
						<view v-if="obj.is_finished === 1"
							:class="{'generally': true, 'success': true, 'expiredb':true}">
							<view class="ribbon">已完成</view>
						</view>
						<view v-else-if="obj.is_overdue === 1"
							:class="{'generally': true, 'success': true, 'expiredc':true}">
							<view class="ribbon">已过期</view>
						</view>

						<view class="content-text">
							<view class="row">
								<view class="time">{{obj.remind_time.substring(11, 16)}}</view>
								<view class="names">
									<view class="name multi-line title">
										{{obj.title}}
									</view>
									<view class="name single-line content" v-if="obj.content !== obj.title">
										{{obj.content}}
									</view>
								</view>
							</view>
							<view class="row rating">
								<view class="info-text">紧急<span>{{obj.weight==0?0:obj.weight.toString()[0]}}</span>
								</view>
								<view class="info-text">重要<span>{{obj.weight==0?0:obj.weight.toString()[1]}}</span>
								</view>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
			<uni-fab ref="fab" :pattern="pattern" horizontal="right" vertical="bottom" direction="horizontal"
				@fabClick="fabClick" />
		</view>
		<novice-guidance :step="step"></novice-guidance>
	</view>
</template>
<script>
	import pageUtil from '../../common/js/utils/page.js';
	import lxCalendar from '../../components/lx-calendar/lx-calendar.vue';

	export default {
		components: {
			lxCalendar,
		},
		data() {
			return {
				query: {
					remind_time: '',
					is_finished: 2,
					order_type: '',
					page: 1,
					size: 20
				},
				title: '下拉刷新 + 加载更多',
				data: [],
				loadMoreText: "加载中...",
				showLoadMore: false,
				max: 0,
				startDate: '',
				endDate: '',
				date: '',
				current: 3,
				total: 10,
				pageSize: 1,
				show: false,
				isOpened: 'none',
				optionLeft: [{
					text: '顺延',
					style: {
						backgroundColor: '#007aff'
					}
				}],
				optionRight: [{
						text: '删除',
						style: {
							backgroundColor: '#F56C6C'
						}
					},
					{
						text: '完成',
						style: {
							backgroundColor: '#007aff'
						}
					}
				],
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF',
					iconColor: '#fff'
				},
				step: {
					name: 'note/list',
					vueFixes: true,
					guideList: [{
							el: '.action',
							tips: '这里可以选择日期，查看对应日期的日程安排列表',
							next: '下一步',
							part: 'left',
							weixin: {
								grid: {
									top: 'navBarHeight'
								}
							}
						},
						{
							el: '.uni-fab__circle',
							tips: '点击"+"号按钮，可以添加新的日程安排',
							next: '下一步',
							part: 'right',
							weixin: {
								grid: {
									top: 'navBarHeight'
								}
							}
						}
					]
				},
				dateNum: {},
				pageDisplayed: false,
			}
		},
		onLoad() {
			this.query.remind_time = pageUtil.helper.date.formatDateTime(new Date()).substring(0, 10);
			this.initData();
			this.date = this.getDate({
				format: true
			});
			this.startDate = this.getDate('start');
			this.endDate = this.getDate('end');
		},
		onShow() {
			pageUtil.webApi.getpublishcommentlikenum().then((res) => {
				if (res.status_code == 200) {
					if (res.num > 0) {
						uni.setTabBarBadge({
							index: 3,
							text: res.num + ''
						})
					} else {
						uni.removeTabBarBadge({
							index: 3,
						})
					}
				}
			})
			pageUtil.checkAuthOk('note/list');

			if (pageUtil.isMarkState('note/add') || pageUtil.isMarkState('note/update') || pageUtil.isMarkState(
					'prefer/user/signin', 'note/list')) {
				this.initData();
				pageUtil.unmarkState('note/add');
				pageUtil.unmarkState('note/update');
			}
			this.pageDisplayed = true;
		},
		onUnload() {
			this.max = 0,
				this.data = [],
				this.loadMoreText = "加载更多",
				this.showLoadMore = false;
		},
		onReachBottom() {
			console.log("onReachBottom");
			// if (this.max > 40) {
			if (this.max <= this.data.length) {
				this.loadMoreText = "没有更多数据了!"
				return;
			}
			this.showLoadMore = true;
			setTimeout(() => {
				this.setListData();
			}, 300);
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh');
			this.query.page = 1;
			this.initData();
		},
		mounted() {
			// pageUtil.checkWechatAll();

			this.initShare();
		},
		methods: {
			sdsds() {
				pageUtil.gotoPage('note/add?data=' + JSON.stringify({
					type: "add",
					date: this.query.remind_time
				}));
			},
			initData() {
				uni.stopPullDownRefresh();

				this.query.page = 1;
				pageUtil.webApi.getNoteList(this.query)
					.then(res => {
						this.data = res.items
						// var list = res.items.map(m => {
						// 	var n = pageUtil.mapping.mapNote(m);
						// 	return n;
						// }).reverse();
						// pageUtil.cast.getInListCast(list)
						// .then(resList => {
						// 	console.log('res',resList)
						// 	this.data = resList;
						// 	this.max = res.total;
						// });
					})
					.catch(err => {
						pageUtil.toast(err);
						// uni.stopPullDownRefresh();
					});
				this.initCalendar();

				// setTimeout(() => {
				// 	this.max = 0;
				// 	this.data = [];
				// 	let data = [];
				// 	this.max += 20;
				// 	for (var i = this.max - 19; i < this.max + 1; i++) {
				// 		var type = '';
				// 		if (i % 3 === 1) {
				// 			type = 'success';
				// 		}
				// 		else if (i % 3 === 2) {
				// 			type = 'expired';
				// 		}
				// 		data.push({num: i, type})
				// 	}
				// 	this.data = this.data.concat(data);
				// 	uni.stopPullDownRefresh();
				// }, 300);
			},
			initCalendar() {
				var timeStr = this.query.remind_time + ' 08:00:00';
				var time = pageUtil.helper.date.parse(timeStr);
				var timeNextMonth = new Date(time.setMonth(time.getMonth() + 1));
				time = pageUtil.helper.date.parse(timeStr);
				var timePrevMonth = new Date(time.setMonth(time.getMonth() - 1));
				var monthStr = timeStr.substring(0, 7);
				var monthNextStr = pageUtil.helper.date.formatDateTime(timeNextMonth).substring(0, 7);
				var monthPrevStr = pageUtil.helper.date.formatDateTime(timePrevMonth).substring(0, 7);
				this.initCalendarByMonth(monthStr);
				// this.initCalendarByMonth(monthNextStr);
				// this.initCalendarByMonth(monthPrevStr);
			},
			initCalendarByMonth(monthStr) {
				pageUtil.webApi.getNoteCalendar({
						time: monthStr,
						_silent: true
					})
					.then(res => {
						var nowMonth = parseInt(monthStr.substring(5, 7));
						var nowYear = parseInt(monthStr.substring(0, 4));
						var days = this.get_month_days(nowMonth, nowYear);
						var list = res.res;
						if (list && list.length === days) {
							for (var i = 0; i < days; i++) {
								var date = (nowYear + '-' + nowMonth + '-' + (i + 1)).replace(/-(\d)(?!\d)/g, '-0$1');
								if (list[i]) {
									this.dateNum[date] = list[i];
								} else {
									delete this.dateNum[date];
								}
							}
						}
					})
					.catch(err => {
						console.log(err);
					});
			},
			initShare() {
				var that = this;
				if (this.pageDisplayed) {
					pageUtil.prepareForWxShare({
						link: window.location.href,
						description: '事程管理',
						title: '今日'
					});
				} else {
					setTimeout(() => {
						that.initShare();
					}, 100);
				}
			},
			get_month_days(nowMonth, nowYear) {
				let month_arr = [1, 3, 5, 7, 8, 10, 12];
				let days = 0;
				if (nowMonth == 2) {
					if (nowYear % 4 == 0) {
						days = 29;
					} else {
						days = 28;
					}
				} else if (month_arr.indexOf(nowMonth) >= 0) {
					days = 31;
				} else {
					days = 30;
				}
				return days;
			},
			setListData() {
				var param = Object.assign({}, this.query);
				param.page += 1;
				pageUtil.webApi.getNoteList(param)
					.then(res => {
						if (res.items.length > 0) {
							this.query.page += 1;
						}
						this.data = this.data.concat(res.items.map(m => {
							var n = pageUtil.mapping.mapNote(m);
							return n;
						}));
						uni.stopPullDownRefresh();
					})
					.catch(err => {
						pageUtil.toast(err);
					});
				// let data = [];
				// this.max += 10;
				// for (var i = this.max - 9; i < this.max + 1; i++) {
				// 	var type = '';
				// 	if (i % 3 === 1) {
				// 		type = 'success';
				// 	}
				// 	else if (i % 3 === 2) {
				// 		type = 'expired';
				// 	}
				// 	data.push({num: i, type})
				// }
				// this.data = this.data.concat(data);
			},
			bindDateChange(e) {
				this.date = e.detail.value
			},
			getDate(type) {
				const date = new Date();

				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 10;
				} else if (type === 'end') {
					year = year + 10;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;

				return `${year}-${month}-${day}`;
			},
			change(e) {
				console.log(e)
				this.current = e.current
			},
			bindClick(e, obj) {
				// uni.showToast({
				// 	title: `点击了${e.position === 'left' ? '左侧' : '右侧'} ${e.content.text}按钮${obj.title}`,
				// 	icon: 'none'
				// });
				if (e.content.text === '删除') {
					uni.showModal({
						content: '是否删除本条信息？',
						success: (res) => {
							if (res.confirm) {
								pageUtil.webApi.deleteNote({
										pk: obj.id
									})
									.then(res => {
										pageUtil.toast('删除成功');
										this.initData();
									})
									.catch(err => {
										pageUtil.toast(err);
									});
							}
						}
					})
				} else if (e.content.text === '完成') {
					pageUtil.webApi.editNoteStatus({
							pk: obj.id,
							is_finished: 1
						})
						.then(res => {
							pageUtil.toast('操作成功');
							this.initData();
						})
						.catch(err => {
							pageUtil.toast(err);
						});
				} else if (e.content.text === '撤销') {
					pageUtil.webApi.editNoteStatus({
							pk: obj.id,
							is_finished: 0
						})
						.then(res => {
							pageUtil.toast('操作成功');
							this.initData();
						})
						.catch(err => {
							pageUtil.toast(err);
						});
				} else if (e.content.text === '顺延') {
					this.handleOnceMore(obj);
				}
			},
			changeListItem(e) {
				this.isOpened = e;
				console.log('返回：', e);
			},
			getOptionRight(obj) {
				var opt = [{
						text: '删除',
						style: {
							backgroundColor: '#F56C6C'
						}
					},
					{
						text: '完成',
						style: {
							backgroundColor: '#007aff'
						}
					}
				];
				if (obj.type === 'success') {
					opt = [{
							text: '删除',
							style: {
								backgroundColor: '#F56C6C'
							}
						},
						{
							text: '撤销',
							style: {
								backgroundColor: '#007aff'
							}
						}
					];
				} else if (obj.type === 'expired') {
					opt = [{
							text: '删除',
							style: {
								backgroundColor: '#F56C6C'
							}
						},
						{
							text: '完成',
							style: {
								backgroundColor: '#007aff'
							}
						}
					];
				}
				return opt;
			},
			fabClick() {
				pageUtil.gotoPage('note/add?data=' + JSON.stringify({
					type: "add",
					date: this.query.remind_time
				}));
			},
			handleDetail(obj) {
				pageUtil.gotoPage('note/add?data=' + JSON.stringify({
					type: "view",
					id: obj.id
				}));
			},
			changeCalendar(e) {
				// console.log(e);
				this.query.remind_time = e.fulldate;
				this.initData();
			},
			handleOnceMore(obj) {
				if (obj.postpone) {
					pageUtil.toast('该事程已顺延，无法重复操作');
					return;
				}
				var time = new Date(Date.parse(obj.remind_time));
				time = new Date(time.setDate(time.getDate() + 1));

				var param = Object.assign({}, obj, {
					remind_time: pageUtil.helper.date.formatDateTime(time),
					is_overdue: 0,
					is_finished: 0
				});

				pageUtil.webApi.addNote(param)
					.then(res => {
						pageUtil.toast('成功顺延到下一天');
						pageUtil.helper.goodish.note.makePostpone(obj);
						pageUtil.webApi.editNote(Object.assign({}, obj, {
								pk: obj.id
							}))
							.then(res => {
								pageUtil.toast('成功顺延到下一天');
								pageUtil.helper.goodish.note.makePostpone(obj);
								this.initData();
							})
							.catch(err => {
								pageUtil.toast(err);
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
		.text {
			margin: 16rpx 0;
			background-color: #fff;
			text-align: left;
			color: #555;
			border-radius: 8rpx;
			padding: 20rpx 20rpx;
		}

		.action {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			color: #6a6a6a;
			padding-bottom: 20rpx;
			border-radius: 8rpx;
			// color: var(--primary-color);

			&>* {}

			uni-button {
				height: 80rpx;
				background-color: #fff;
				color: var(--primary-color);

				uni-text {
					color: var(--primary-color) !important;
				}
			}

			uni-button:after {
				border: none;
			}

			uni-picker {
				flex: 1;
				text-align: center;
			}
		}

		.list-item {
			background-color: #fff;
			margin: 50rpx 0;
			border-radius: 15rpx;

			.content-box {
				position: relative;
				overflow: hidden;
				padding: 0rpx 0rpx;
				// border-bottom: 1rpx solid var(--primary-color); // 5rpx solid var(--primary-color);
				border-radius: 8rpx;

				.content-text {
					padding: 40rpx 20rpx;
					// display: inline-block;
					width: 100%;
					box-sizing: border-box;

					.row {
						display: flex;
						flex-direction: row;
						align-items: flex-start;

						.time {
							font-size: 60rpx;
							display: inline-block;
							width: 150rpx; // 130rpx;
							color: var(--primary-color);
							position: relative;
							line-height: 60rpx;
							// top: -10rpx;
						}

						&.rating {
							display: flex;
							align-items: flex-end;
							justify-content: flex-end;
							flex-direction: row;

							.info-text {
								color: var(--default-color);
								font-size: 24rpx;

								span {
									font-size: 50rpx;
									display: inline-block;
									padding: 0rpx 5rpx;
									color: var(--primary-color);
								}

								&:last-child {
									margin-left: 10rpx;
								}
							}
						}

						.names {
							width: calc(100vw - 280rpx);

							.content {
								color: var(--default-color);
								font-size: 24rpx;

							}

							.name {
								// width: 15%;
								margin-left: 20rpx;
							}
						}
					}
				}
			}

			.content-box.success {
				border-color: var(--success-color);

				.content-text {
					.time {
						color: var(--success-color);
					}
				}
			}

			.content-box.expired {
				border-color: var(--info-color);

				span {
					color: var(--info-color);
				}

				.content-text {
					.time {
						color: var(--info-color);
					}
				}
			}
		}

		.generally {
			background: var(--primary-color); // #3588bc
			overflow: hidden;
			white-space: nowrap;
			position: absolute;
			left: -115rpx;
			top: -25rpx;
			-webkit-transform: rotate(-47deg);
			-moz-transform: rotate(-47deg);
			-ms-transform: rotate(-47deg);
			-o-transform: rotate(-47deg);
			transform: rotate(-47deg);
			opacity: 0.95;
			display: none;

			&.success {
				background-color: var(--success-color);
				display: inherit;
			}

			&.expirea {
				background-color: #007AFF;
				display: inherit;
			}

			&.expired {
				background-color: var(--info-color);
				display: inherit;
			}

			&.expiredb {
				background-color: var(--success-color);
				display: inherit;
			}

			&.expiredc {
				background-color: #ff4700;
				display: inherit;
			}

			&.expireda {
				background-color: #007AFF;
				display: inherit;
			}

			.ribbon {
				color: #fff; // rgba(254, 254, 254, 1)
				display: block;
				font-size: 20rpx;
				padding: 40rpx 100rpx 4rpx 96rpx; // 20px 50px 8px 50px;
				text-align: center;
				text-decoration: none;
			}

			.ribbonb {
				color: #fff; // rgba(254, 254, 254, 1)
				display: block;
				font-size: 22rpx;
				padding: 40rpx 100rpx 4rpx 90rpx; // 20px 50px 8px 50px;
				text-align: center;
				text-decoration: none;
			}
		}

		:deep(._media) {
			height: 200rpx !important;
			border-radius: 8rpx;
		}
	}

	.tssd {
		position: absolute;
		right: 0px;
		top: 0px;
		// transform: rotate(60deg);
	}
</style>