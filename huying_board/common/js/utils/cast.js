import webApi from './webapi.js';
import commonUtil from './common.js';
import goodish from './goodish.js';

var baseUrl = 'https://echotime.ugoolink.com';

const _onCastClick = (objId, objLink) => {
	webApi.editCastReadNum({pk: objId})
	.then(res => {
		window.location.href = objLink;
	})
	.catch(err => {
		var msg = typeof(err) === 'object' || err instanceof Array ? JSON.stringify(err) : err + '';
		webApi.echoSystem(msg);
		window.location.href = objLink;
	});
};
const _HyCast = {
	_onCastClick
};
window._HyCast = _HyCast;

const mapCastDetail = (m) => {
	var media = m;
	var htmlReact = '<div class="_media" style="background: url(\''+ baseUrl + media.imgs[0].url +'\') no-repeat; background-size: 100% 100%; width: 100%; height:80px; overflow: hidden;"><a onclick="window._HyCast._onCastClick('+ media.id +', \''+ media.content +'\')" style="display: block; height: 100%; text-decoration: none;"><div class="media-title" style="background-color: rgba(0, 0, 0, 0.2); color: #fff; text-shadow:1px 1px 2px black;">'+ '[广告] ' + media.title +'</div></a></div>';
	var n = {_media: true, content: htmlReact};
	return n;
};
const mapCastVideo = (m) => {
	var media = m;
	var link = media.content.trim().length ? media.content.trim() : '#';
	var htmlReact = '<div class="_media" style="position: relative; width: 100%; height:80px; overflow: hidden;"><a onclick="window._HyCast._onCastClick('+ media.id +', \''+ link +'\')" style="display: block; height: 100%; text-decoration: none;"><div class="media-title" style="position: relative; background-color: rgba(0, 0, 0, 0.2); color: #fff; text-shadow:1px 1px 2px black; z-index: 1;">'+ '[广告] ' + media.title +'</div><video style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px; width: 100%;" muted autoplay="autoplay" loop="loop"><source src="'+ baseUrl + media.video[0].url +'" type="video/mp4"></source></video></a></div>'; // fullscreen: webkit-playsinline="false" playsinline="false", if not defined and then default full-screen
	var n = {_media: true, content: htmlReact};
	return n;
};

const getInListCast = (list) => {
	return new Promise((resolve, reject) => {
		if (goodish._inside.applyForPermission('无广告浏览')) {
			resolve(list);
			return;
		}
		var media = {_media: true};
		webApi.getCastBannerList({ad_type: '横幅-图文'})
		.then(res => {
			if (res.items.length) {
				var index = commonUtil.other.integerRandom(0, res.items.length - 1)
				webApi.getCastDetail({pk: res.items[index].id})
				.then(res => {
					media = Object.assign({}, res.item, media);
					var listNew = list && list.length ? list : [];
					var index = listNew.length ? commonUtil.other.integerRandom(0, list.length - 1) : 0;
					
					var item = mapCastDetail(media);
					listNew.splice(index, 0, item);
					resolve(listNew);
				})
				.catch(err => {
					console.log(err);
					resolve(list);
				});
			}
			else {
				resolve(list);
			}
		})
		.catch(err => {
			console.log(err);
			resolve(list);
		});
	});
};

const getInListVideo = (list) => {
	return new Promise((resolve, reject) => {
		if (goodish._inside.applyForPermission('无广告浏览')) {
			resolve(list);
			return;
		}
		var media = {_media: true};
		webApi.getCastBannerList({ad_type: '横幅-视频'})
		.then(res => {
			if (res.items.length) {
				webApi.getCastDetail({pk: res.items[0].id})
				.then(res => {
					media = Object.assign({}, res.item, media);
					var listNew = list && list.length ? list : [];
					var index = listNew.length ? commonUtil.other.integerRandom(0, list.length - 1) : 0;
					
					var item = mapCastVideo(media);
					listNew.splice(index, 0, item);
					resolve(listNew);
				})
				.catch(err => {
					console.log(err);
					resolve(list);
				});
			}
			else {
				resolve(list);
			}
		})
		.catch(err => {
			console.log(err);
			resolve(list);
		});
	});
};

const utils = {
	getInListCast,
	getInListVideo
};

export default utils;