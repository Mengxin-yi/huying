const data = {
	weiguangType: [
		{ name: '招标采购', id: 'bid' }, 
		{ name: '工作招聘', id: 'job' }, 
		{ name: '周边友圈', id: 'publish' }, 
		{ name: '项目信息', id: 'project' }, 
		{ name: '会议信息', id: 'meeting' }, 
		{ name: '通知公告', id: 'notice' }
	],
	filterTimeType: [
		{ name: '不限', id: 0, current: true }, 
		{ name: '近1天', id: 1, current: false }, 
		{ name: '近3天', id: 2, current: false }, 
		{ name: '近1周', id: 3, current: false }, 
		{ name: '近1个月', id: 4, current: false }, 
		{ name: '近3个月', id: 5, current: false },
		{ name: '近半年', id: 6, current: false },
		{ name: '近1年', id: 7, current: false }
	],
	filterDataType: [
		{ name: '会议信息', id: 10, current: true }, 
		{ name: '项目信息', id: 11, current: false }, 
		{ name: '通知公告', id: 12, current: false }, 
		{ name: '人事招聘', id: 13, current: false }, 
		{ name: '招标采购', id: 14, current: false }, 
		{ name: '发布', id: 15, current: false }
	],
	filterSourceType: [
		{ name: '行业协会', id: 20, current: false }, 
		{ name: '企业', id: 21, current: false }, 
		{ name: '个体', id: 22, current: false },
		{ name: '教育机构', id: 23, current: false },
		{ name: '政府', id: 24, current: false },
		{ name: '军队', id: 25, current: false },
		{ name: '其他', id: 26, current: false }
	],
    sortNameType: [
		{ name: '标题', id: 10, current: true }, 
		{ name: '单位', id: 11, current: false }, 
		{ name: '时间', id: 12, current: false }, 
		{ name: '地址', id: 13, current: false }, 
		{ name: '阅读量', id: 14, current: false }, 
		{ name: '点赞量', id: 15, current: false }
	],
    sortOrderType: [
		{ name: '默认排序', id: 'default', current: true }, 
		{ name: '最新发布', id: 'publish_time', current: false }
	],
	icon: {
		refresh: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAB5QTFRFcHBw3Nzct7e39vb2ycnJioqK7e3tpqam29vb////D8oK7wAAAAp0Uk5T////////////ALLMLM8AAABxSURBVHja7JVBDoAgDASrjqj//7CJBi90iyYeOHTPMwmFZrHjYyyFYYUy1bwUZqtJIYVxhf1a6u0R7iUvWsCcrEtwJHp8MwMdvh2amHduiZD3rpWId9+BgPd7Cc2LIkPyqvlQvKxKBJ//Qwq/CacAAwDUv0a0YuKhzgAAAABJRU5ErkJggg=="
	}
};

export default data;