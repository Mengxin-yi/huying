# cc-rightPopup


##uniapp专属精品组件页面模板（由前端组件开发出品）精品组件页面模板

###●组件模板规划：
由前端组件开发出品的精品组件页面模板，将陆续发布，预计高达约几百种供您使用，是快速快发项目、创业的必备精品。

合集地址： uni-app模板合集地址：(https://ext.dcloud.net.cn/publisher?id=274945) 如查看全部页面模板，请前往上述uniapp插件市场合集地址；

###●组件模板效果图：
可下载项目后预览，效果图见右侧图片；

###●组件模板费用：
学习：免费下载，进行学习，无费用；

使用/商用：本页面地址赞赏10元后，可终身商用；

###●组件模板使用版权/商用：
本组件模板免费下载可供学习，如需使用及商用，请在本组件页面模板进行赞赏10元

（仅需10元获取精品页面模板代码-物有所值，1个组件页面市场价100元 ）

赞赏10元后（当前项目产生赞赏订单可追溯）即可终身商用当前本地址下载的页面模版代码，不同下载地址需进行不同的赞赏。（不赞赏就进行商用使用者，面临侵权！保留追究知识产权法律责任！后果自负！）

### 我的技术公众号(私信可加前端技术交流群)

群内气氛颇为不错，应该可能算为数不多专门进行技术交流的前端群，同时也涵盖后端技术产品交流，偶尔成员们会聊天摸鱼。

![图片](https://i.postimg.cc/RZ0sjnYP/front-End-Component.jpg)


#### 使用方法 
```使用方法
 <!-- pop-show:是否显示弹框 isSingleSel：是否单选 color:主题色 classList：分类数组 @changeClick：数据发生变化 @sureClick：筛选确认 @hideClick：隐藏事件  -->
<cc-rightPopup :pop-show="popShow" :colors="colors" :classList="classList" @sureClick="sureClick"
	@hideClick="hideright"></cc-rightPopup>	

// 数据发生变化
changeClick(arr) {
	// 适配小程序 样式需要在父级改变
	this.classList = arr;
},
// 隐藏处理				
hideright() {
	this.popShow = false;
},

// 筛选确认 
sureClick(paramDict, selArr) {

		this.popShow = false;
		uni.showModal({
			title: '筛选数据',
		    content: '筛选价格数据 = ' + JSON.stringify(paramDict) + ' 筛选按钮数据= ' + JSON.stringify(selArr)
		})

}

```

#### HTML代码实现部分
```html
<template>
	<view class="content">

		<button style="margin: 60px 90px;" @click="showPopClick">点击弹框</button>

        <!-- pop-show:是否显示弹框  color:主题色 classList：分类数组 @changeClick：数据发生变化 @sureClick：筛选确认 @hideClick：隐藏事件  -->
		<cc-rightPopup :pop-show="popShow" :colors="colors" :classList="classList" @change="changeClick"
			@sureClick="sureClick" @hideClick="hideright"></cc-rightPopup>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				colors: '#fa436a',
				popShow: false,
				classList: [{
					name: '营业事件',
					id: 1,
					child: [{
						name: '0-5时',
						id: 10,
						current: true
					}, {
						name: '5-10时',
						id: 11,
						current: false

					}, {
						name: '10-14时',
						id: 12,
						current: false

					}, {
						name: '14-18时',
						id: 13,
						current: false

					}, {
						name: '18-22时',
						id: 14,
						current: false

					}, {
						name: '22-24时',
						id: 15,
						current: false

					}]
				}, {
					name: '用餐人数',
					id: 2,
					child: [{
							name: '单人餐',
							id: 20,
							current: false

						}, {
							name: '双人餐',
							id: 21,
							current: false

						}, {
							name: '3-4人餐',
							id: 22,
							current: false

						},
						{
							name: '5-10人餐',
							id: 23,
							current: false

						}
					]
				}],



			}
		},

		methods: {
			changeClick(arr) {
				// 适配小程序 样式需要在父级改变
				this.classList = arr;
			},
			showPopClick() {

				this.popShow = true;
			},

			hideright() {
				this.popShow = false;
			},

			sureClick(paramDict, selArr) {


				this.popShow = false;
				uni.showModal({
					title: '筛选数据',
					content: '筛选价格数据 = ' + JSON.stringify(paramDict) + ' 筛选按钮数据= ' + JSON.stringify(selArr)
				})

			}

		}
	}
</script>

<style>
	page {

		background-color: #f2f2f2;
		margin-bottom: 50px;
	}
</style>
```