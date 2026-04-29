import commonUtil from './common.js';
import lzstring from '../sdk/lzstring.js';
import {
	version
} from '../../../package.json';

const host = ''; // https://ugoo.ugoolink.com
const baseUrl = host + '/cpi/'; // CONNECTED with auto-signin
const baseSysUrl = host + '/bpi/'; // CONNECTED with auto-signin

const getReqeustSys = (query, url) => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: ''
		});
		uni.request({
			url: baseSysUrl + url,
			method: 'get',
			data: query,
			header: {
				'app-name': 'huying'
			},
			success: (res) => {
				uni.hideLoading();
				console.log(res.data);
				resolve(res);
			},
			fail(err) {
				uni.hideLoading();
				console.log(err);
				reject(err);
			}
		});
	});
};

const postReqeustSys = (query, url) => {
	return new Promise((resolve, reject) => {
		if (query && query._silent) {} else {
			uni.showLoading({
				title: ''
			})
		}
		uni.request({
			url: baseSysUrl + url,
			method: 'post',
			data: query,
			header: {
				'app-name': 'huying',
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
			},
			success: (res) => {
				if (query && query._silent) {} else {
					uni.hideLoading();
				}
				var resInfo = res.data;
				if (resInfo.status === 200) {
					resolve(resInfo);
				} else if (resInfo.status === 404 || resInfo.status === 403) {
					uni.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 3000
					});
				} else if (isInvalidUserSession(resInfo, {
						url: baseSysUrl + url,
						data: query,
						_feedback: {
							resolve,
							reject
						}
					})) {} else {
					rejectionHelper(resInfo, resolve, reject);
				}
			},
			fail(err) {
				if (query && query._silent) {} else {
					uni.hideLoading();
				}
				reject(err);
			}
		});
	});
};

const uploadReqeustSys = (query, url) => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: ''
		});
		var param = Object.assign({}, query);
		delete param.files;

		if (query.files === undefined || query.files.length === 0) {
			postReqeustSys(query, url)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
			return;
		}
		uni.uploadFile({
			url: baseSysUrl + url,
			files: query.files,
			// file: query.files[0],
			// name: 'file',
			formData: param,
			header: {
				'app-name': 'huying'
				// 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'//'multipart/form-data'
			},
			success: (res) => {
				uni.hideLoading();
				var resInfo = res.data;
				if (typeof(resInfo) === 'string') {
					resInfo = JSON.parse(resInfo);
				}
				if (resInfo.status === 200) {
					resolve(resInfo);
				} else if (isInvalidUserSession(resInfo, {
						url: baseSysUrl + url,
						data: param,
						files: query.files,
						_feedback: {
							resolve,
							reject
						}
					})) {} else {
					rejectionHelper(resInfo, resolve, reject);
				}
			},
			fail(err) {
				uni.hideLoading();
				reject(err);
			}
		});
	});
};

const getReqeust = (query, url) => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: ''
		});
		uni.request({
			url: baseUrl + url,
			method: 'get',
			data: query,
			header: {
				'app-name': 'huying'
			},
			success: (res) => {
				uni.hideLoading();
				console.log(res.data);
				resolve(res);
			},
			fail(err) {
				uni.hideLoading();
				console.log(err);
				reject(err);
			}
		});
	});
};

const postReqeust = (query, url) => {
	return new Promise((resolve, reject) => {
		if (query && query._silent) {} else {
			uni.showLoading({
				title: ''
			});
		}
		uni.request({
			url: baseUrl + url,
			method: 'post',
			data: query,
			header: {
				'app-name': 'huying',
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
			},
			success: (res) => {
				if (query && query._silent) {} else {
					uni.hideLoading();
				}
				var resInfo = res.data;
				if (resInfo.status_code === 200) {
					resolve(resInfo);
				} else if (isInvalidUserSession(resInfo, {
						url: baseUrl + url,
						data: query,
						_feedback: {
							resolve,
							reject
						}
					})) {} else {
					rejectionHelper(resInfo, resolve, reject);
				}
			},
			fail(err) {
				if (query && query._silent) {} else {
					uni.hideLoading();
				}
				reject(err);
			}
		});
	});
};
const uploadReqeust = (query, url) => {
	return new Promise((resolve, reject) => {
		uni.showLoading({
			title: ''
		});
		var param = Object.assign({}, query);
		delete param.files;

		if (query.files === undefined || query.files.length === 0) {
			postReqeust(query, url)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
			return;
		}
		uni.uploadFile({
			url: baseUrl + url,
			files: query.files,
			formData: param,
			header: {
				'app-name': 'huying'
			},
			success: (res) => {
				uni.hideLoading();
				var resInfo = res.data;
				if (typeof(resInfo) === 'string') {
					resInfo = JSON.parse(resInfo);
				}
				if (resInfo.status_code === 200) {
					resolve(resInfo);
				} else if (isInvalidUserSession(resInfo, {
						url: baseUrl + url,
						data: param,
						files: query.files,
						_feedback: {
							resolve,
							reject
						}
					})) {} else {
					rejectionHelper(resInfo, resolve, reject);
				}
			},
			fail(err) {
				uni.hideLoading();
				reject(err);
			}
		});
	});
};


// 数字人
const wcqPostUploadReqeust = (data, url) => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: '/api/' + url,
			filePath: data.file, // 例如录音文件的临时路径
			name: 'file', // 与后端约定的字段名
			formData: data,
			success: (res) => {
				uni.hideLoading();
				var resInfo = res.data;
				if (typeof(resInfo) === 'string') {
					resInfo = JSON.parse(resInfo);
				}
				if (resInfo.status === 200) {
					resolve(resInfo);
				} else if (isInvalidUserSession(resInfo, {
						url: '/api/' + url,
						data: data,
						file: data.file,
						_feedback: {
							resolve,
							reject
						}
					})) {} else {
					rejectionHelper(resInfo, resolve, reject);
				}
			},
			fail: (e) => {
				console.log(e);
			}
		});
	});
}

const wcqPostReqeust = (query, url) => {
	return new Promise((resolve, reject) => {
		if (query && query._silent) {} else {
			uni.showLoading({
				title: ''
			});
		}
		uni.request({
			url: '/api/' + url,
			method: 'post',
			data: query,
			 responseType: 'arraybuffer',
			header: {
				'Content-Type': 'application/json'
			},
			success: (res) => {
				if (query && query._silent) {} else {
					uni.hideLoading();
				}
				var resInfo = res;
				if (resInfo.statusCode === 200) {
					const audioBlob = new Blob([resInfo.data], { type: 'audio/wav' });
					const audioUrl = URL.createObjectURL(audioBlob);
					resolve(audioUrl);
				} else if (isInvalidUserSession(resInfo, {
						url:'/api/' + url,
						data: query,
						_feedback: {
							resolve,
							reject
						}
					})) {} else {
					rejectionHelper(resInfo, resolve, reject);
				}
			},
			fail(err) {
				if (query && query._silent) {} else {
					uni.hideLoading();
				}
				reject(err);
			}
		});
	});
}



const postReqeust3rd = (query, url) => {
	return new Promise((resolve, reject) => {
		if (query && query._silent) {} else {
			uni.showLoading({
				title: ''
			});
		}
		uni.request({
			url: url,
			method: 'post',
			data: query,
			header: {
				'app-name': 'huying',
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
			},
			success: (res) => {
				if (query && query._silent) {} else {
					uni.hideLoading();
				}
				uni.showModal({
					content: JSON.stringify(res),
					success: (res) => {}
				});
				resolve(res);
			},
			fail(err) {
				if (query && query._silent) {} else {
					uni.hideLoading();
				}
				uni.showModal({
					content: url + '\n' + JSON.stringify(err),
					success: (res) => {}
				});
				reject(err);
			}
		});
	});
};

const isInvalidUserSession = (res, requestPack) => {
	// status for sys/bpi, status_code for cpi; 用户不存在code-404
	if (!res.msg) {
		return false;
	}
	if (res.msg.indexOf('用户不存在') > -1 || res.msg.indexOf('用户角色不存在') > -1) {
		missingCredential(res, requestPack);
		return true;
	} else if (res.msg.indexOf('token') > -1) {
		var cre = uni.getStorageSync('credential');
		if (cre) {
			if (cre.tel) {
				postReqeustSys(queryWithToken(cre), 'tel_login').then(res => {
					uni.setStorageSync('token', res.token);
					requestPack.data.token = res.token;
					doTransaction(requestPack);
				}).catch(err => {
					missingCredential(res, requestPack);
				});
			} else {
				postReqeustSys(cre, 'login').then(res => {
					uni.setStorageSync('token', res.token);
					requestPack.data.token = res.token;
					doTransaction(requestPack);
				}).catch(err => {
					console.log(err);
					missingCredential(res, requestPack);
				});
			}
		} else {
			missingCredential(res, requestPack);
		}
		return true;
	} else {
		return false;
	}
};
const doTransaction = (requestPack) => {
	if (requestPack.data._silent) {} else {
		uni.showLoading({
			title: ''
		});
	}

	if (requestPack.url.indexOf('/bpi/') > -1) {
		var url = requestPack.url.split('/bpi/')[1];
		if (requestPack.files) {
			uploadReqeustSys(Object.assign({}, requestPack.data, {
					files: requestPack.files
				}), url)
				.then(res => {
					transactionScapegoatResolver(requestPack, res);
				})
				.catch(err => {
					requestPack._feedback.reject(err);
				});
		} else {
			postReqeustSys(Object.assign({}, requestPack.data), url)
				.then(res => {
					transactionScapegoatResolver(requestPack, res);
				})
				.catch(err => {
					requestPack._feedback.reject(err);
				});
		}
	} else {
		var url = requestPack.url.split('/cpi/')[1];
		if (requestPack.files) {
			uploadReqeust(Object.assign({}, requestPack.data, {
					files: requestPack.files
				}), url)
				.then(res => {
					transactionScapegoatResolver(requestPack, res);
				})
				.catch(err => {
					requestPack._feedback.reject(err);
				});
		} else {
			postReqeust(Object.assign({}, requestPack.data), url)
				.then(res => {
					transactionScapegoatResolver(requestPack, res);
				})
				.catch(err => {
					requestPack._feedback.reject(err);
				});
		}
	}
};
const transactionScapegoatResolver = (requestPack, res) => {
	if (requestPack.data._silent) {} else {
		uni.hideLoading();
	}
	var resInfo = res; // var resInfo = res.data;
	var {
		resolve,
		reject
	} = requestPack._feedback;

	if (requestPack.url.indexOf('/bpi/') > -1) {
		if (typeof(resInfo) === 'string') { // in case of return value of uploading.
			resInfo = JSON.parse(resInfo);
		}
		if (resInfo.status === 200) {
			resolve(resInfo);
		} else {
			rejectionHelper(resInfo, resolve, reject);
		}
	} else {
		if (typeof(resInfo) === 'string') { // in case of return value of uploading.
			resInfo = JSON.parse(resInfo);
		}
		if (resInfo.status_code === 200) {
			resolve(resInfo);
		} else {
			rejectionHelper(resInfo, resolve, reject);
		}
	}
};
const rejectionHelper = (resInfo, resolve, reject) => {
	if (resInfo.message) {
		reject(resInfo.message, resInfo);
	} else if (resInfo.msg) {
		reject(resInfo.msg, resInfo);
	} else {
		reject('服务器错误');
	}
};
const missingCredential = (res, requestPack) => {
	if (requestPack.data._no_disturb) {
		var {
			resolve,
			reject
		} = requestPack._feedback;
		var msg = 'may need token.';
		// echoSystem(requestPack.url + ' ' + msg);
		reject(msg);
		return;
	}

	var cre = uni.getStorageSync('credential');
	var loginType = cre ? '会话失效，请重新登录' : '尚未登录，请先登录';

	var msg = typeof(requestPack) === 'string' ? requestPack : JSON.stringify(requestPack);
	msg += ' res: ' + JSON.stringify(res);
	msg = loginType + ': (' + msg + ')';
	// uni.showModal({ title: '会话失效，请重新登录', content: msg, showCancel: false, success: (res) => { } });
	echoSystem(msg);

	localStorage.removeItem('ms_username');
	var url = window.location.href;
	uni.setStorageSync('redirectUrl', url);
	// AndrewYy: 仅用了下面5行代码，解决游客身份无法查看数据问题
	// setTimeout(() => {
	// 	uni.navigateTo({
	// 		url: '/pages/' + 'prefer/user/signin'
	// 	});
	// }, 1500);
};
const echoSystem = (msg) => {
	let ua = navigator.userAgent.toLowerCase();
	let deviceId = uni.getStorageSync('__DC_STAT_UUID');
	if (!deviceId) {
		deviceId = uni.getStorageSync('ms_uuid');
		if (!deviceId) {
			var uuid = commonUtil.other.newGuid();
			uni.setStorageSync('ms_uuid', uuid);
			deviceId = 'HY-' + uuid;
		} else {
			deviceId = 'HY-' + deviceId;
		}
	} else {
		deviceId = 'HY-DC-' + deviceId;
	}
	let box = {
		ua,
		devId: deviceId,
		msg,
		v: version
	};
	// var base64Str = commonUtil.other.base64Encode(JSON.stringify(box));
	var zippedStr = lzstring.compressToUTF16(JSON.stringify(box));

	// postReqeust(queryWithToken({msg_type: '系统回传', message: zippedStr, _silent: true}), 'set_feedback')
	// .then(res => {
	// 	console.log('posted a feedback.');
	// }).catch(err => {
	// 	console.log(err);
	// });
};

function getToken() {
	return uni.getStorageSync('token');
};

function queryWithToken(query) {
	var queryNew = {
		'token': getToken()
	}
	for (var key in query) {
		var item = query[key];
		queryNew[key] = item;
	}
	return queryNew;
}

function queryWithSearch(query) {
	var queryNew = {
		'kw': '',
		'page': 1,
		'size': 20
	}
	for (var key in query) {
		var item = query[key];
		queryNew[key] = item;
	}
	return queryNew;
}

function json2FormData(dictionary) {
	var formdata = new FormData()
	for (var key in dictionary) {
		var item = dictionary[key];
		formdata.append(key, item);
	}
	return formdata
}

const utils = {
	getReqeustSys,
	postReqeustSys,
	uploadReqeustSys,
	getReqeust,
	postReqeust,
	wcqPostReqeust,
	wcqPostUploadReqeust,
	uploadReqeust,
	postReqeust3rd,
	queryWithToken,
	queryWithSearch,
	echoSystem
};

export default utils;

// _silent: silent request without indication
// _no_disturb: no disturb for user action; need to hide redirection, dialog