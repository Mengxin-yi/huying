import data from './constant.js';
import base from './request.js';

/*------ Api InSys Begin ------*/

// 数字人
const getDigitalHumanDailyReport = (query) => {
	return base.postReqeustSys(query, 'new/index_media ')
}
// 语音转文字
const getDigitalHumanTranscribe = (query) => {
	return base.wcqPostUploadReqeust(query, 'transcribe')
}
// 文字转语音
const textToSpeechFun = (query) => {
	return base.wcqPostReqeust(query, 'tts')
}


const getPushNoticeStatus = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'news_set_get');
};
const editPushNoticeStatus = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'news_set');
};
const getNoteList = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'note_list');
};
const addNote = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'note_add');
};
const getNoteDetail = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'note_editor_get');
};
const editNote = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'note_editor');
};
const deleteNote = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'note_del');
};
const editNoteStatus = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'note_state_set');
};
const getAuthDetail = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_verify_get');
};
const usercancelverify = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_cancel_verify');
};
const editAuth = (query) => {
	return base.uploadReqeustSys(base.queryWithToken(query), 'user_verify');
};
const getProfile = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_info_editor_get');
};
const editProfile = (query) => {
	return base.uploadReqeustSys(base.queryWithToken(query), 'user_info_editor');
};
const changePassword = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_reset_pw');
};
const getpublishcommentlikenum = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_publish_comment_like_num');
};
const setpublishcommentlikenum = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'set_publish_comment_like_num');
};
const getpublishcommentlikedata = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_publish_comment_like_data');
};
const getVipList = (query) => {
	return base.postReqeustSys(base.queryWithSearch(base.queryWithToken(query)), 'vip_list');
};
const getUserVip = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_vip_info');
};
const userdefaultavatarlist = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_default_avatar_list');
};
const getPayConfig = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'pay_js_info');
};
const getSmscode = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'tel_code');
};
const registertelcode = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'register_tel_code');
};
const usercheckusername = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_check_username');
};
const userchecktel = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_check_tel');
};
const getUserCode = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_tel_code');
};
const cardget = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'card_get');
};
const myedulist = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'my_edu_list');
};
const myskilllist = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'my_skill_list');
};
const edudel = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'edu_del');
};
const skilldel = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'skill_del');
};
const cardeditor = (query) => {
	return base.uploadReqeust(base.queryWithToken(query), 'card_editor');
};
const editPassword = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'forgot_pw');
};
const loginByMobile = (query) => {
	return new Promise((resolve, reject) => {
		base.postReqeustSys(base.queryWithToken(query), 'tel_login').then(res => {
			uni.setStorageSync('token', res.token);
			uni.setStorageSync('credential', query);
			loginHelper(query, res, resolve, reject);
			// resolve(res);
		}).catch(err => {
			reject('用户名或密码错误');
		})
	});
};
const getNoteCalendar = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'note_num');
};
const getPushNum = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_push_num');
};
const getPublishNum = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_publish_num');
};
const getWxConfig = (query) => {
	return base.postReqeustSys(base.queryWithToken(Object.assign({}, {
		_no_disturb: true
	}, query)), 'wx_config');
};
const getMobileToken = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_tel_code');
};
const checkMobile = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_tel_check');
};
const ussrnameeditor = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'username_editor');
};
const userteleditor = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_tel_editor');
};
const getMobile = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_tel_editor_get');
};
const changeMobile = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_tel_editor');
};
const usernewtelcode = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'user_new_tel_code');
};
const getMyCouponList = (query) => {
	return base.postReqeustSys(base.queryWithSearch(base.queryWithToken(query)), 'my_coupon');
};
const getCouponDetail = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'coupon_editor_get');
};
const getCastBannerList = (query) => {
	return base.postReqeustSys(base.queryWithSearch(base.queryWithToken(Object.assign({}, {
		start: '',
		end: '',
		ad_type: '横幅',
		kw: '',
		page: 1,
		size: 10,
		ad_stat: 1,
		_no_disturb: true
	}, query))), 'ad_msg_list');
};
const getCastDetail = (query) => {
	return base.postReqeustSys(base.queryWithToken(Object.assign({}, {
		_no_disturb: true
	}, query)), 'ad_msg_editor_get');
};
const getBillList = (query) => {
	return base.postReqeustSys(base.queryWithToken(Object.assign({}, {
		start_time: '',
		end_time: '',
		other_type: '',
		state: '',
		kw: '',
		page: 1,
		size: 10
	}, query)), 'order_list');
};
const myOrderList = (query) => {
	return base.postReqeustSys(base.queryWithToken(Object.assign({}, {
		start_time: '',
		end_time: '',
		other_type: '',
		state: '',
		kw: '',
		page: 1,
		size: 100
	}, query)), 'my_order_list');
};
const getWordCheck = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'word_check');
};
const editVipStartTime = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'my_order_time_set');
};
const editWechatToUnbind = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'wx_unbind');
};
const getWechatBindLink = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'bind_qrcode');
};
const editCastReadNum = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'ad_msg_read_num_add');
};
const editCastShareNum = (query) => {
	return base.postReqeustSys(base.queryWithToken(query), 'ad_msg_share_num_add');
};
const getUsers = (query) => {
	return base.postReqeustSys(Object.assign({}, query, {
		token: getAccessSecret()
	}), 'user_list');
};
const getRoles = (query) => {
	return base.postReqeustSys(Object.assign({}, query, {
		token: getAccessSecret()
	}), 'user_group_list');
};
const userInfo = (query) => {
	return base.postReqeustSys(Object.assign({}, query, {
		token: getAccessSecret()
	}), 'user_info_editor_get');
};
// AndrewYy: 修改权限接口
const getUserGroupPermissions = (query) => {
	return base.postReqeustSys(base.queryWithSearch(Object.assign({}, query, {
		token: getAccessSecret()
	})), 'user_perm_list');
};
// const getUserGroupPermissions = (query) => {
//     return base.postReqeustSys(base.queryWithSearch(Object.assign({}, query, {token: getAccessSecret()})), 'user_group_perm_get');
// };

/*------ Api InSys End ------*/

/*------ Api InPro Begin ------*/

const getWeiguangList = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_weiguang_list');
};
const getLongLat = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_long_lat');
};
const getWeiguangDetail = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_note_data_detail');
};
const getWeiguangSupplyment = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_data_detail');
};
const getWeiguangCommentList = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_commnet_detail');
};
const setsourcedata = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'set_source_data');
};
const getWeiguangRelative = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'change_similar');
};
const addWeiguangLike = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'set_like_num');
};
const addWeiguangComment = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'set_comment_msg');
};
const addPublish = (query) => {
	return base.uploadReqeust(base.queryWithToken(query), 'set_publish_data');
};
const getPublishList = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_publish_list');
};
const getPublishDetail = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_publish_detail');
};
const deletePublish = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'delete_publish_data');
};
const userAvatarById = (query) => {
	return '/media/user_avatar/' + query + '.png';
};
const getOrderList = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_order_list');
};
const getCompanyList = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_company_list');
};
const addOrder = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'set_order');
};
const getOrderIndex = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_order_data');
};
const deleteOrder = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'delete_order');
};
const updateOrder = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'update_order');
};
const addFeedback = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'set_feedback');
};
const getWeiguangChannel = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_columns'); // get_weiguang_list
};
const updateWeiguangChannel = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'save_columns');
};
const getOrderTimeList = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'get_push_time_list');
};
const getAppInfoList = (query) => {
	return base.postReqeust(base.queryWithToken(Object.assign({}, {
		search_text: '',
		sort_param: '',
		sort_by: '',
		page: 1,
		page_size: 10,
		sift_type: '',
		sift_allow: '',
		sift_platform: '',
		_silent: true
	}, query)), 'get_app_info_list');
};
const updateWeiguangReadNum = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'set_read_num');
};
const updateWeiguangShareClick = (query) => {
	return base.postReqeust(base.queryWithToken(query), 'set_share_click_num');
};


/*------ Api InPro End ------*/

/*------ Api 3rd Begin ------*/

const do3rdApiRequest = (query, url) => {
	return base.postReqeust3rd(query, url);
};

/*------ Api 3rd End ------*/

/*------ Api Helper Begin ------*/

const loginHelper = (query, res, resolve, reject) => {
	// if (query.username === 'admin') {
	// 	resolve(res);
	// 	return;
	// }
	// getUsers(base.queryWithSearch({
	// 	kw: query.username,
	// 	user_role: '普通用户',
	// 	user_group: '',
	// 	_silent: query._silent
	// })).then(resUsers => {
	// 	console.log('roleName',resUsers,query)
	// 	var user = resUsers.items.filter(eu => {
	// 		return eu.username === query.username || eu.tel === query.tel;
	// 	})[0];
	// 	console.log('user',user)
	// 	var roleName = user.user_role;
	// 	uni.setStorageSync('role_name', roleName);
	// 	getRoles(base.queryWithSearch({
	// 		kw: roleName,
	// 		_silent: query._silent
	// 	})).then(resRoles => {
	// 		var role = resRoles.items.filter(er => {
	// 			return er.name === roleName;
	// 		})[0];
	// 		console.log('role',role)
	// 		var roleId = role.id;
	// 		getUserGroupPermissions({
	// 			pk: roleId,
	// 			_silent: query._silent
	// 		}).then(resPerms => {
	// 			// AndrewYy: 接口修改了
	// 			var perms = resPerms.items;
	// 			// var perms = resPerms.perms.filter(ep => {
	// 			// 	return ep.checked === 1;
	// 			// });
	// 			uni.setStorageSync('permissions', perms);
	// 			console.log('{{{}}}',res)
	// 			resolve(res);
	// 		}).catch(err => {
	// 			reject(err);
	// 		});
	// 	}).catch(err => {
	// 		reject(err);
	// 	});
	// }).catch(err => {
	// 	reject(err);
	// });
	getUserGroupPermissions({}).then(resPerms => {
		// AndrewYy: 接口修改了
		var perms = resPerms.items;
		// var perms = resPerms.perms.filter(ep => {
		// 	return ep.checked === 1;
		// });
		uni.setStorageSync('permissions', perms);
		resolve(res);
	}).catch(err => {
		reject(err);
	});
};

const getAccessSecret = () => {
	var obj = base.queryWithToken({});
	return obj.token;
	// return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIn0.0GUrALypjhRpYLs0unb3Ueb7jC-Cgu4x2m4LkLik-6I';
};

/*------ Api Helper End ------*/

const utils = {
	register: query => {
		return new Promise((resolve, reject) => {
			base.postReqeustSys(query, 'register').then(res => {
				uni.setStorageSync('token', res.token)
				loginHelper(query, res, resolve, reject);
				// resolve(res);
			}).catch(err => {
				reject(err);
			});
		});
	},
	login: query => {
		return new Promise((resolve, reject) => {
			base.postReqeustSys(query, 'login').then(res => {
				uni.setStorageSync('token', res.token);
				uni.setStorageSync('credential', query);
				loginHelper(query, res, resolve, reject);
				// resolve(res);
			}).catch(err => {
				console.log(err);
				reject('用户名或密码错误');
			});
		});
	},
	logout: () => {
		return base.postReqeustSys(base.queryWithToken({}), 'logout');
	},
	getDigitalHumanDailyReport,
	getDigitalHumanTranscribe,
	textToSpeechFun,
	getPushNoticeStatus,
	editPushNoticeStatus,
	getNoteList,
	getLongLat,
	addNote,
	getNoteDetail,
	editNote,
	deleteNote,
	editNoteStatus,
	getAuthDetail,
	usercancelverify,
	editAuth,
	getProfile,
	editProfile,
	changePassword,
	setpublishcommentlikenum,
	getpublishcommentlikenum,
	getpublishcommentlikedata,
	getVipList,
	getUserVip,
	userdefaultavatarlist,
	getPayConfig,
	getSmscode,
	registertelcode,
	usercheckusername,
	userchecktel,
	editPassword,
	loginByMobile,
	getNoteCalendar,
	getPushNum,
	getPublishNum,
	getWxConfig,
	getMobileToken,
	checkMobile,
	ussrnameeditor,
	userteleditor,
	getMobile,
	changeMobile,
	usernewtelcode,
	getMyCouponList,
	getCouponDetail,
	getCastBannerList,
	getCastDetail,
	getBillList,
	myOrderList,
	getUserCode,
	cardget,
	myedulist,
	myskilllist,
	edudel,
	skilldel,
	cardeditor,
	getWordCheck,
	editVipStartTime,
	editWechatToUnbind,
	getWechatBindLink,
	editCastReadNum,
	editCastShareNum,
	getWeiguangList,
	getWeiguangDetail,
	getWeiguangSupplyment,
	getWeiguangCommentList,
	setsourcedata,
	getWeiguangRelative,
	addWeiguangLike,
	addWeiguangComment,
	addPublish,
	getPublishList,
	getPublishDetail,
	deletePublish,
	userAvatarById,
	getOrderList,
	getCompanyList,
	addOrder,
	getOrderIndex,
	deleteOrder,
	updateOrder,
	addFeedback,
	getWeiguangChannel,
	updateWeiguangChannel,
	getAppInfoList,
	updateWeiguangReadNum,
	updateWeiguangShareClick,
	do3rdApiRequest,
	echoSystem: base.echoSystem,
	getInside: (query) => {
		return new Promise((resolve, reject) => {
			loginHelper(query, {}, resolve, reject);
		});
	},
};

export default utils;