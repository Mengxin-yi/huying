**插件使用说明**

```
<template>
	<view>
		...
		<novice-guidance :step="step"></novice-guidance>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				step: {
					name: 'workbenchSet3',
					guideList: [{
						el: '.drag',
						tips: '这里是常用的应用，长按并拖动应用可调整位置哦~',
						next: '下一步',
					}, {
						el: '.guida',
						tips: '点击应用的右上角“+”可以添加到常用中',
						next: '下一步',
					}, {
						el: '.icon-jian',
						tips: '点击应用的右上角“-”可以从常用中移除',
						next: '完成',
					}]
				}
			}
		},
	}
</script>
```