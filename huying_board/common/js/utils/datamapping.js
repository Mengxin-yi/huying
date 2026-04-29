import commonUtil from './common.js';
import webApi from './webapi.js';
import goodish from './goodish.js';

const mapWeiguangDetail = (m) => {
	var n = {
		"datetime": m.publish_time,
		"article_type": 5,
		"title": m.title,
		"image_url": m.avatar_url,
		"source": m.source_name,
		"company": m.company_name,
		"abstract": m.data_abstract,
		"content": m.data_abstract, // m.content_str,
		"location": m.location,
		"url": m.url,
		"read_num": m.read_num,
		"comment_num": m.comment_num,
		"like_num": m.like_num,
		// AndrewYy: 增加了一个分享点击数量字段
		"share_click_num": m.share_click_num,
		"comment_list": []
	};
	// n.comment_list = [
	// 	{ "author": "YY", "reply_at": "", "content": "需要预约吗？" },
	// 	{ "author": "YY", "reply_at": "XX", "content": "你约到了吗？我填写了预约申请表格已经发送邮箱了。" },
	// 	{ "author": "YY", "reply_at": "XX", "content": "需要预约吗？" }
	// ];
	// n.datetime = pageUtil.helper.date.humanize(pageUtil.helper.date.parse(m.publish_time + ' 00:00:00').getTime());
	// console.log(m.content_str);
	n.data_id = m.data_id;
	n.data_type = m.data_type;
	n.contentHtml = m.content;
	n.like_status = m.like_status;
	n.read_status = m.read_status;
	n.title_html = m.title_html;
	n.title_keywords = m.title_keywords;
	n.data_keywords = m.data_keywords;
	n.id = commonUtil.other.newGuid();
	return n;
};

const mapWeiguangComment = (m) => {
	var n = {
		"author": m.username, 
		"reply_at": m.re_username, 
		"content": m.content
	};
	n.user_id = m.user_id;
	n.re_user_id = m.re_user_id;
	n.id = commonUtil.other.newGuid();
	return n;
};

const mapWeiguangYouquan = (m) => {
	var n = {
		"datetime": m.publish_time,
		"article_type": 5,
		"title": m.username,
		"image_url": m.avatar_url,
		"source": m.source_name,
		"company": m.title,
		"abstract": m.content,
		"content": m.content,
		"location": m.location,
		"url": m.url,
		"read_num": m.read_num,
		"comment_num": m.comment_num,
		"like_num": m.like_num,
		// AndrewYy: 增加了一个分享点击数量字段
		"share_click_num": m.share_click_num,
		"comment_list": []
	};
	n.data_id = m.data_id;
	n.data_type = m.data_type;
	n.like_status = m.like_status;
	n.read_status = m.read_status;
	n.image_list = m.img_list.map(mi => {
		return {
			url: mi
		};
	});
	n.content = m.content.replaceAll('\r\n', '<br />');
	n.content = m.content.replaceAll('\n', '<br />');
	// n._avatar = commonUtil.dateUtils.addUrlTimestamp(webApi.userAvatarById(m.user_id));
	n.id = commonUtil.other.newGuid();
	return n;
};

const mapNote = (m) => {
	var n = Object.assign({}, m, {type: ''});
	if (m.is_finished === 1) {
		n.type = 'success';
	}
	else if (m.is_overdue === 1) {
		n.type = 'expired';
	}
	
	goodish.note.explainWeight(n);
	return n;
};

const mapSystemTip = (str) => {
	var m = str.toLowerCase();
	var n = str;
	if (m.indexOf('openid') > -1) {
		n = '无用户微信授权信息，请联系客服';
		// n = '当前微信已绑定其它账户，无法进行购买';
	}
	else if (m.indexOf('无权限') > -1) {
		n = {text: '请购买(高级)会员或联系客服开通', link: 'prefer/vip/index'};
	}
	return n;
};

const mapInsideName = (str) => {
	var name = str;
	for (var key in dataInsideMap) {
		if (dataInsideMap[key].includes(str)) {
			name = key;
			return name;
		}
	}
	return name;
};

const dataInsideMap = {
	'订阅添加关键词': [],
	'订阅新增': [],
	'订阅选择数据类别': [],
	'订阅选择位置范围': [],
	'发布内容辅助扩写': [],
	'发布添加数据类别': [],
	'发布添加图片': [],
	'发布新增内容': [],
	'会员商城卡指定启用时间': [],
	'事程终端页面提醒': [],
	'事程定制单个提醒': [],
	'事程每日批量提醒': [],
	'事程新增内容': [],
	'微逛查看评论': ['微逛查看回复'],
	'微逛点赞': ['点赞操作'],
	'微逛分享代言标识': [],
	'微逛回复指定人': [],
	'微逛配置栏目单选': [],
	'微逛配置栏目多选': [],
	'微逛搜索': [],
	'微逛新增回复': ['添加评论'],
	'无广告浏览': [],
	'微逛查看单位': [],
	'微逛查看地区': [],
	'微逛查看相似信息': ['相似内容换一换'],
	'微逛查看关键词': [],
	'微逛查看摘要': []
};

const utils = {
	mapWeiguangDetail,
	mapWeiguangComment,
	mapWeiguangYouquan,
	mapNote,
	mapSystemTip,
	mapInsideName
};

export default utils;