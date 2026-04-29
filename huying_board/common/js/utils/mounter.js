import webApi from './webapi.js';
import commonUtil from './common.js';

const updateTerminalTheme = (appConfig) => {
	var app_navbar_front_color = commonUtil.linkUtils.getPropertySync(appConfig['app_navbar_front_color'], true);
	var app_navbar_background_color = commonUtil.linkUtils.getPropertySync(appConfig['app_navbar_background_color'], true);
	uni.setNavigationBarColor({
		frontColor: app_navbar_front_color ?  app_navbar_front_color : "#ffffff",
		backgroundColor: app_navbar_background_color ? app_navbar_background_color : "#007AFF"
	})
};

const doOtaUpdate = () => {
	var progress = uni.getStorageSync('ota_update_progress');
	if (progress !== 3) {
		uni.setStorageSync('ota_update_progress', progress + 1);
		window.location.reload();
	}
	else {
		var ota_updating_to = uni.getStorageSync('ota_updating_to');
		uni.setStorageSync('buildNumber', ota_updating_to);
		uni.removeStorageSync('ota_updating');
		uni.removeStorageSync('ota_update_progress');
		uni.showToast({
			title: '更新完成，请继续使用',
			icon: 'none'
		});
	}
};

const noteOtaUpdate = (appConfig) => {
	var build = commonUtil.linkUtils.getPropertySync(appConfig['app_build_number'], true);
	if (build) {
		var buildNum = parseInt(build);
		var oldNum = uni.getStorageSync('buildNumber');
		var showCancel = commonUtil.linkUtils.getPropertySync(appConfig['ota_update_as_demand'], true) === 'true' ? false: true;
		var updating = uni.getStorageSync('ota_updating');
		if (buildNum !== oldNum && !updating) {
			var msg = '收到新的更新版本(' + build + ')，请点击确定更新';
			uni.showModal({ content: msg, showCancel: showCancel, success: (res) => { 
				if (res.confirm) {
					uni.setStorageSync('ota_update_progress', 0);
					uni.setStorageSync('ota_updating', true);
					uni.setStorageSync('ota_updating_to', buildNum);
					uni.showToast({
						title: '请等待更新重启，大约需要10秒',
						icon: 'none'
					});
					setTimeout(() => {
						doOtaUpdate();
					}, 1500);
				}
			} });
		}
	}
};

const checkAppInfo = () => {
	var user = uni.getStorageSync('ms_username');
	if (!user) {
		return;
	}
	var updating = uni.getStorageSync('ota_updating');
	if (updating) {
		doOtaUpdate();
		return;
	}
	
	var appConfig = uni.getStorageSync('appConfig');
	webApi.getAppInfoList({})
	.then(res => {
		var list = res.datas;
		var dataConfig = {};
		list.forEach(e => {
			dataConfig[e.name] = e.meaning;
		});
		appConfig = dataConfig;
		uni.setStorageSync('appConfig', appConfig);
		noteOtaUpdate(appConfig);
		updateTerminalTheme(appConfig);
	})
	.catch(err => {
		console.log(err);
	});
	webApi.getInside({username: user, _silent: true})
	.then(res => {
		
	})
	.catch(err => {
		console.log(err);
	});
};

const utils = {
	checkAppInfo
};

export default utils;