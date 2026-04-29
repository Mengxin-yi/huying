import constant from './constant.js';
import webApi from './webapi.js';
import commonUtil from './common.js';
import sysdict from './sysdict.js';
import mappingUtil from './datamapping.js';
import graceChecker from '../../graceChecker.js';
import imgLogo from '../../../static/image/echoicon.jpg';
import cast from './cast.js';
import tipper from './tipper.js';
import mounter from './mounter.js';
import goodish from './goodish.js';

/*------ trivial object begin ------*/

// window.addEventListener("popstate",function(e){
// 	console.log(JSON.stringify(history.state) + ': ' + history.state.current === history.state.back);
// }, false);
const onBackPressed = () => {
	// #ifdef H5
	if (history.state.current === history.state.back) {
		history.go(-2);
		return true;
	}
	// #endif
	return false;
};

/*------ trivial object end ------*/

// in case of:
// 			- isValidRedirectUrl is not defined(名称形似，赋值时未定义)
const toast = (text) => {
	return new Promise((resolve, reject) => {
		var message = typeof(text) === 'string' ? text : '请返回上一步';
		if (text instanceof Error) {
			console.log(text.stack); // text.message
			webApi.echoSystem(text.stack); // text.name + ':' + text.message
			return;
		} else if (typeof(text) === 'object') {
			var obj_msg = JSON.stringify(text);
			console.log(obj_msg);
			webApi.echoSystem('obj_msg:' + obj_msg);
		}
		message = mappingUtil.mapSystemTip(message);
		uni.showToast({
			title: message,
			icon: 'none'
		});
		setTimeout(() => {
			resolve();
		}, 1500);
	});
};

const goBack = () => {
	uni.navigateBack({
		delta: 1
	});
};
const gotoPage = (pathInPages) => {
	if (!checkAuthOk(pathInPages)) {
		return;
	}
	// if (pathInPages.indexOf('publish/add') > -1) {prefer/user/signin
	if (pathInPages.indexOf('note/list') > -1) {
		uni.switchTab({
			url: '/pages/' + pathInPages
		});
	} else if (pathInPages.indexOf('weiguang/list') > -1) {
		uni.switchTab({
			url: '/pages/' + pathInPages
		});
	} else if (pathInPages.indexOf('order/index') > -1) {
		uni.switchTab({
			url: '/pages/' + pathInPages
		});
	} else if (pathInPages.indexOf('publish/list') > -1) {
		uni.switchTab({
			url: '/pages/' + pathInPages
		});
	} else if (pathInPages.indexOf('prefer/index') > -1) {
		uni.switchTab({
			url: '/pages/' + pathInPages
		});
	} else {
		var url = window.location.href;
		var list = ['prefer/user/signin', 'prefer/user/signup'];
		var isValidLandingUrl = true;
		// list.forEach(e => {
		// 	if (url.indexOf(e) > -1) {
		// 		isValidLandingUrl = false;
		// 	}
		// });
		if (isValidLandingUrl) {
			uni.preloadPage({
				url: '/pages/' + pathInPages,
				success() {
					uni.navigateTo({
						url: '/pages/' + pathInPages
					});
				},
				fail() {
					uni.navigateTo({
						url: '/pages/' + pathInPages
					});
				}
			});
		} else {
			uni.preloadPage({
				url: '/pages/' + pathInPages,
				success() {
					uni.redirectTo({
						url: '/pages/' + pathInPages
					});
				},
				fail() {
					uni.redirectTo({
						url: '/pages/' + pathInPages
					});
				}
			});
		}
	}
};
const goLandingPage = () => {
	var url = uni.getStorageSync('redirectUrl');
	if (url) {
		url = url.split('pages/')[1];

		var list = ['prefer/user/signin', 'prefer/user/signup', 'prefer/user/recover'];
		var isValidRedirectUrl = true;
		if (url) { // in case of tipping note feature in Weiguang/list, with href /.
			list.forEach(e => {
				if (url.indexOf(e) > -1) {
					isValidRedirectUrl = false;
				}
			});
		}
		uni.removeStorageSync('redirectUrl');
		if (isValidRedirectUrl && url) {
			gotoPage(url);
			return;
		}
	}
	gotoPage('weiguang/list');
};
const setNavBarTitle = (title) => {
	uni.setNavigationBarTitle({
		title: title
	});
};
const initRouteGuard = () => {
	uni.$on('beforeRouterEnter', (to, form, next) => {
		console.log(to);
		next();
	});

	let needLogin = [
		"/pages/tab/index",
	]

	let list = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
	list.forEach(item => {
		console.log(item, 'router list item')
		uni.addInterceptor(item, {
			invoke(e) { // 调用前拦截
				//获取用户的token
				console.log(e, 'routerjs invoke')
				const token = localStorage.getItem('token')
				//获取当前页面路径（即url去掉"?"和"?"后的参数）
				console.log(token, 'router index token')
				const url = e.url.split('?')[0]
				console.log(url, 'router index url')

				console.log(needLogin.includes(url))
				//判断要打开的页面是否需要验证登录
				if (needLogin.includes(url) && token == '') {
					uni.showToast({
						title: '该页面需要登录才能访问，请先登录',
						icon: 'none'
					})
					uni.navigateTo({
						url: "/pages/login/login"
					})
					return false
				}
				return true
			},
			fail(err) { // 失败回调拦截 
				console.log(err);
			},
		})
	})
};
const hasLogin = () => {
	var username = uni.getStorageSync('ms_username');
	return username !== undefined && username.length > 0;
};
const checkAuthOk = (toPage) => {
	checkDocumentTitle();
	var list = ['weiguang/list', 'weiguang/detail', 'prefer/user/signin', 'prefer/user/signup', 'prefer/privacy',
		'prefer/user/recover', 'prefer/user/policy', 'publish/detail'
	];
	var requireLogin = true;
	list.forEach(e => {
		if (toPage.indexOf(e) > -1) {
			requireLogin = false;
		}
	});
	if (requireLogin && !hasLogin()) {
		var url = toPage;
		var arr = url.split('pages/');
		if (arr.length > 1) {
			url = url.split('pages/')[1];
		}
		url = window.location.origin + '/pages/' + toPage;
		uni.setStorageSync('redirectUrl', url);
		uni.navigateTo({
			url: '/pages/' + 'prefer/user/signin'
		});
		return false;
	}
	return true;
};

const isWeixin = () => {
	let ua = navigator.userAgent.toLowerCase();
	// return ua.indexOf('micromessenger') > -1 && (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1);
	// 检测微信页眉，iOS微信“返回/前进”，Android三键导航
	if (ua.indexOf('windowswechat') > -1) {
		return false;
	}
	return window.screen.availHeight - window.innerHeight > 110; // iPhone SE: 175, Android YouYe: 103
};
const checkWechatAll = () => {
	var app = getApp();
	if (isWeixin()) {
		app.pageHead();
		var pages = getCurrentPages();
		let currentRoute = pages[pages.length - 1].route;
		if (currentRoute.indexOf('weiguang/list' > -1)) {
			uni.preloadPage({
				url: '/pages/note/list'
			});
			uni.preloadPage({
				url: '/pages/order/index'
			});
			// uni.preloadPage({
			// 	url: '/pages/publish/add'
			// });
			uni.preloadPage({
				url: '/pages/publish/list'
			});
			uni.preloadPage({
				url: '/pages/prefer/index'
			});
		}
	}

	checkUserProfile();
	checkDocumentTitle();
};
const pageHead = () => {
	var pageHead = document.getElementsByTagName('uni-page-head');
	uni.setStorageSync('navBarHeight', pageHead[0].offsetHeight);
	pageHead[0].style.display = 'none';
	//这一段如果你没有使用到uview  <u-sticky>组件可以省略
	let uSticky = document.getElementsByClassName('u-sticky')[0];
	if (uSticky) {
		this.$nextTick(() => {
			uSticky.style.top = 0
		});
	}
};

const submitForm = (form, rule) => {
	return new Promise((resolve, reject) => {
		var checkRes = graceChecker.check(form, rule);
		if (checkRes) {
			resolve();
		} else {
			if (!form._silent) {
				uni.showToast({
					title: graceChecker.error,
					icon: "none"
				});
			}
			reject();
		}
	});
};

const getUsername = () => {
	return uni.getStorageSync('ms_username');
};

const markState = (state, val) => {
	return uni.setStorageSync(state, val ? val : true);
};
const unmarkState = (state) => {
	return uni.removeStorageSync(state);
};
const isMarkState = (state, stateRef) => {
	if (stateRef) {
		var result = uni.getStorageSync(state) === uni.getStorageSync(stateRef);
		if (!result) {
			markState(stateRef, uni.getStorageSync(state));
		}
		return !result;
	} else {
		return uni.getStorageSync(state);
	}
};

const checkUserProfile = () => {
	if (!commonUtil.other.isEmpty(getUsername())) {
		var profile = uni.getStorageSync('profile');
		if (commonUtil.other.isEmpty(profile)) {
			webApi.getProfile({
					_silent: true
				})
				.then(res => {
					profile = res.item;
					uni.setStorageSync('profile', JSON.stringify(profile));
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
};
const checkDocumentTitle = () => {
	tipper.checkNote();
	mounter.checkAppInfo();
	// #ifdef H5
	if (isWeixin()) {
		return;
	}
	setTimeout(() => {
		document.title = '时代呼应';
	}, 0);
	// #endif
};

const getNavBarHeight = () => {
	return uni.getStorageSync('navBarHeight');
};
const cleanCache = () => {
	uni.removeStorageSync('profile');
	uni.removeStorageSync('note/list');
	uni.removeStorageSync('weiguang/list');
	uni.removeStorageSync('order/index');
	uni.removeStorageSync('prefer/user/signin');
};
const getCacheSize = () => {
	return '1 KB';
};
const prepareForWxShare = (obj, callback) => {
	if (window.hasOwnProperty('wx') && window.wx.hasOwnProperty('updateAppMessageShareData')) {
		prepareForWxShareHelp(obj, callback);
	} else {
		setTimeout(() => {
			prepareForWxShare(obj, callback);
		}, 100);
	}
};
const prepareForWxShareHelp = (obj, callback) => {
	var url = window.location.href; // window.location.host
	browserAlert('preShare: ' + url);
	webApi.getWxConfig({
			url: url,
			_silent: true
		})
		.then(res => {
			var entity = res.res;
			var keys = '';
			Object.keys(entity).forEach(e => keys += e + ':' + entity[e] + ', ');
			browserAlert(keys);

			wx.config({
				debug: obj
					._debug, // callback ? true : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				// 配置微信 JSSDK
				appId: entity.appId, // 必填，公众号的唯一标识
				timestamp: entity.timestamp, // 必填，生成签名的时间戳
				nonceStr: entity.nonceStr, // 必填，生成签名的随机串
				signature: entity.signature, // 必填，签名
				// jsApiList: ['scanQRCode']
				jsApiList: ['openLocation', 'updateAppMessageShareData', 'updateTimelineShareData',
					'scanQRCode'
				]
			});
			wx.error((res) => {
				browserAlert('wx.ready.error: ' + (typeof(res) === 'string' ? res : JSON.stringify(
					res)));
				// uni.showModal({ content: 'wx.ready.error', showCancel: false, success: (res) => { } });
				// console.log(res);
				// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				// getSignature()
			});
			wx.ready(function() {
				if (callback) {
					callback();
				}
				browserAlert('wx.ready');
				wx.checkJsApi({
					jsApiList: ['openLocation', 'updateAppMessageShareData',
						'updateTimelineShareData', 'scanQRCode'
					], // 需要检测的JS接口列表，所有JS接口列表见附录2,
					success: function(res) {
						browserAlert('checkJsApi: ' + (typeof(res) === 'string' ? res : JSON
							.stringify(res)));
						// 以键值对的形式返回，可用的api值true，不可用为false
						// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
					}
				});
				// wx.scanQRCode({
				//   needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				//   scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				//   success: function (res) {
				//     var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
				// 	browserAlert('扫描结果:' + result);
				//   }
				// });

				var imgLogoUrl = window.location.origin + imgLogo;
				var tempParam = {
					title: obj.title, // 分享标题
					desc: obj.description, // 分享描述
					link: obj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl: imgLogoUrl, // 分享图标
					success: (res) => {
						console.log(res)
					},
					cancel: function(res) {
						console.log('分享失败', res)
					},

				}
				// 分享到朋友
				wx.onMenuShareAppMessage(tempParam)
				// 分享到朋友圈
				wx.onMenuShareTimeline(tempParam)
				// 分享给朋友
				wx.updateAppMessageShareData(tempParam)
				wx.updateTimelineShareData(tempParam);
			});
		})
		.catch(err => {
			console.log(err);
		});
};
const initWx = () => {
	createdWxSdkScript(() => {
		browserAlert('wx-sdk loaded');
	});
};
const browserAlert = (e) => {
	// alert(e);
};
const createdWxSdkScript = (callback) => {
	window.wx = null;
	const script1 = document.createElement('script');
	script1.setAttribute('type', 'text/javascript');
	script1.setAttribute('src', 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js');
	document.head.appendChild(script1);
	script1.onload = function() {
		window.wx = window.jWeixin;
		callback && callback();
	};
};
const getEnvWechat = (debug) => {
	return new Promise((resolve, reject) => {
		if (window.hasOwnProperty('WeixinJSBridge') && wx.hasOwnProperty('ready')) {
			resolve('resolving...');
			var url = window.location.href;
			prepareForWxShare({
				title: '我的反馈',
				description: '时代呼应 触达美好',
				link: url,
				_debug: debug
			}, () => {
				wx.checkJsApi({
					jsApiList: ['openLocation', 'updateAppMessageShareData',
						'updateTimelineShareData', 'scanQRCode'
					],
					success: function(res) {
						var keys = 'WeixinJSBridge(';
						Object.keys(WeixinJSBridge).forEach(e => keys += e + ', ');
						keys = keys.substring(0, keys.length - 2) + '), wx(';
						keys += 'checkJsApi: ' + (typeof(res) === 'string' ? res : JSON
							.stringify(res));
						keys += ')';
						resolve(keys);
					}
				});
			});
		} else {
			resolve('dcloud native.');
		}
	});
};

const isFirstUse = () => {
	var cre = uni.getStorageSync('credential');
	if (!cre) {
		uni.showModal({
			title: '尚未登录，请先登录',
			content: '',
			showCancel: true,
			cancelText: '关闭',
			confirmText: '登录',
			success: (res) => {
				if (res.confirm) {
					var url = window.location.href;
					uni.setStorageSync('redirectUrl', url);
					uni.navigateTo({
						url: '/pages/' + 'prefer/user/signin'
					});
				}
			}
		});
		return true;
	}
	return false;
};
const applyForPermission = (page, text, link) => {
	var permissions = uni.getStorageSync('permissions');
	var pageName = mappingUtil.mapInsideName(page);
	if (permissions === undefined || !(permissions instanceof Array)) {
		// AndrewYy: 修改此处，感觉返回结果有问题
		return false;
		// return true;
	} else {
		var arrP = permissions.filter(e => {
			return e.name === pageName;
		});
		if (arrP.length > 0) {
			return true;
		} else {
			applyForPermissionHelp(pageName, text, link);
			return false;
		}
	}
};
const applyForPermissionHelp = (page, text, link) => {
	var obj = typeof(text) === 'object' ? text : {};
	var msg = obj.text ? obj.text : text;
	var pageUrl = obj.link ? obj.link : link;

	if (pageUrl) {
		uni.showModal({
			content: msg,
			showCancel: true,
			success: (res) => {
				if (res.confirm) {
					gotoPage(pageUrl);
				}
			}
		});
	} else if (msg) {
		toast(msg);
	}
};
const pageElement = () => {
	return {
		orderAdd: {
			keywords: applyForPermission('订阅添加关键词'),
			dataType: applyForPermission('订阅选择数据类别'),
			area: applyForPermission('订阅选择位置范围')
		},
		publishAdd: {
			contentComplete: applyForPermission('发布内容辅助扩写'),
			dataType: applyForPermission('发布添加数据类别'),
			picture: applyForPermission('发布添加图片')
		},
		vipShop: {
			setOpenTime: applyForPermission('会员商城卡指定启用时间')
		},
		noteAdd: {
			singlePush: applyForPermission('事程定制单个提醒'),
			// AndrewYy: 增加一些权限
			clickMe: applyForPermission('提醒我'),
		},
		weiguang: {
			// AndrewYy: 对权限进行一些修改
			like: applyForPermission('微逛点赞'),
			search: applyForPermission('微逛搜索'),
			viewComment: applyForPermission('微逛查看评论'),
			addComment: applyForPermission('添加评论'),
			similarData: applyForPermission("相似内容换一换"),
			dataSource: applyForPermission('数据来源'),
			share: applyForPermission('微逛分享代言标识'),
			commentAt: applyForPermission('微逛回复指定人'),
			singleColumn: applyForPermission('微逛配置栏目单选'),
			multiColumn: applyForPermission('微逛配置栏目多选'),
		},
		system: {
			dailyPush: applyForPermission('事程每日批量提醒')
		}
	};
};

const utils = {
	toast,
	onBackPressed,
	goBack,
	gotoPage,
	goLandingPage,
	setNavBarTitle,
	checkAuthOk,
	hasLogin,
	pageHead,
	isWeixin,
	checkWechatAll,
	submitForm,
	initRouteGuard,
	markState,
	unmarkState,
	isMarkState,
	getNavBarHeight,
	cleanCache,
	getCacheSize,
	checkDocumentTitle,
	prepareForWxShare,
	initWx,
	getEnvWechat,
	isFirstUse,
	applyForPermission,
	pageElement,
	user: {
		getUsername
	},
	constant,
	sysdict,
	webApi,
	helper: {
		date: commonUtil.dateUtils,
		other: commonUtil.other,
		goodish
	},
	mapping: mappingUtil,
	cast,
	graceChecker
};

export default utils;

// prepareForWxShare: require 3 initShare and 3 pageDisplayed, both need mounted and onShow to make sure window.location.href.