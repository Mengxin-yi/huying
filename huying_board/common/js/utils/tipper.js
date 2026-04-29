import webApi from './webapi.js';
import commonUtil from './common.js';
import goodish from './goodish.js';

const isValidTipNotePage = () => {
	var url = window.location.href;
	var list = ['prefer/user/signin', 'prefer/user/signup', 'prefer/privacy', 'prefer/user/recover', 'prefer/user/policy'];
	var inUserPage = true;
	list.forEach(e => {
		if (url.indexOf(e) > -1) {
			inUserPage = false;
		}
	});
	var session = uni.getStorageSync('token');
	return session && inUserPage;
};

const isValidTabPage = () => {
	var url = window.location.href;
	var list = ['weiguang/list', 'note/list', 'order/index', 'publish/list', 'prefer/index'];
	var inTabPage = false;
	list.forEach(e => {
		if (url.indexOf(e) > -1) {
			inTabPage = true;
		}
	});
	if (url.split(window.location.origin)[1].length < 5) {
		inTabPage = true;
	}
	var session = uni.getStorageSync('token');
	return session && inTabPage;
};

const sumNearlyNoteNumber = (list) => {
	var nowadays = new Date();
	var appConfig = uni.getStorageSync('appConfig');
	var note_nearly_time = appConfig && commonUtil.linkUtils.getPropertySync(appConfig['note_nearly_time'], true) ? parseInt(commonUtil.linkUtils.getPropertySync(appConfig['note_nearly_time'], true)) : 3600;
	if (note_nearly_time < 0) {
		return 0;
	}
	var note_in_app_remind = appConfig && commonUtil.linkUtils.getPropertySync(appConfig['note_in_app_remind'], true) ? parseInt(commonUtil.linkUtils.getPropertySync(appConfig['note_in_app_remind'], true)) : 0;
	var arr = list.filter(e => {
		if (note_in_app_remind === 0 && e.news_set === 0) {
			return false;
		}
		var time = commonUtil.dateUtils.parse(e.remind_time);
		var diff = time.getTime() - nowadays.getTime();
		return diff > 0 && diff < note_nearly_time * 1000;
	});
	return arr.length;
};

const tipNoteNumber = (str) => {
	// #ifdef H5
	if (window._tipping) {
		return;
	}
	window._tipping = true;
	var url = window.location.origin + '/pages/note/list';
	var view = document.querySelector('.content-inner');
	var oldPosition = view.getAttribute('style');
	view.setAttribute('style', 'position: relative;');
	var view1 = document.querySelector('.uni-common-mt');
	var oldPosition1;
	if (view1) {
		oldPosition1 = view1.getAttribute('style');
		view1.setAttribute('style', 'margin-top: 0px;');
	}
	
	var container = document.createElement('div');
	container.setAttribute('style', 'position: absolute; top: 0px; left: 0px; right: 0px; ');
	container.innerHTML = '<div style="background-color: #faecd8;"><a href="'+ url +'" style="display: block; text-decoration: none; color: #e6a23c; padding: 10px 10px;">您有'+ str +'条事程须在2小时内处理，请点击查看。</a></div>';
	view.appendChild(container);
	
	setTimeout(() => {
		container.remove();
		
		if (view1) {
			view1.setAttribute('style', oldPosition1);
		}
		view.setAttribute('style', oldPosition);
		delete window._tipping;
	}, 2000);
	// #endif
};

const checkNote = () => {
	if (!isValidTipNotePage() || !goodish._inside.applyForPermission('事程终端页面提醒')) {
		return;
	}
	var param = {
		remind_time: commonUtil.dateUtils.formatDateTime(new Date()).substring(0, 10),
		is_finished: 2,
		order_type: '',
		page: 1,
		size: 100,
		_silent: true,
		_no_disturb: true
	};
	
	webApi.getNoteList(param)
	.then(res => {
		var list = res.items.filter(e => e.is_overdue === 0 && e.is_finished === 0);
		if (list.length) {
			if (isValidTabPage()) {
				uni.setTabBarBadge({
					index: 0,
					text: ''
					// text: '' + list.length
				});
			}
			var numOfNearly = sumNearlyNoteNumber(list);
			if (numOfNearly > 0) {
				tipNoteNumber(numOfNearly + '');
			}
		}
		else {			
			if (isValidTabPage()) {
				uni.hideTabBarRedDot({
					index: 0
				});
			}
		}
	})
	.catch(err => {
		console.log(err);
	});
};

const utils = {
	checkNote
};

export default utils;