/**
 * 公共接口
 */

import { bpi, cpi } from '../request.js'

/**
 * 提交反馈
 * @param {Object} data - 反馈数据
 * @param {string} data.msg_type - 反馈类型
 * @param {string} data.message - 反馈内容
 */
export const addFeedback = (data) => cpi.post('set_feedback', data)

/**
 * 获取 VIP 列表
 * @param {Object} data - 查询参数
 */
export const getVipList = (data) => bpi.postPage('vip_list', data)

/**
 * 获取用户 VIP 信息
 */
export const getUserVip = () => bpi.post('user_vip_info')

/**
 * 获取支付配置
 * @param {Object} data - 支付参数
 */
export const getPayConfig = (data) => bpi.post('pay_js_info', data)

/**
 * 获取订单列表
 * @param {Object} data - 查询参数
 */
export const getBillList = (data) => bpi.post('order_list', data)

/**
 * 获取我的订单列表
 * @param {Object} data - 查询参数（覆盖默认值）
 */
export const myOrderList = (data) => bpi.post('my_order_list', {
	start_time: '',
	end_time: '',
	other_type: '',
	state: '',
	kw: '',
	page: 1,
	size: 1000,
	...data
})

/**
 * 文字内容审核
 * @param {Object} data - 参数
 * @param {string} data.text - 待审核文本
 */
export const getWordCheck = (data) => bpi.post('word_check', data)

/**
 * 修改 VIP 开始时间
 * @param {Object} data - 参数
 */
export const editVipStartTime = (data) => bpi.post('my_order_time_set', data)

/**
 * 获取我的优惠券列表
 * @param {Object} data - 查询参数
 */
export const getMyCouponList = (data) => bpi.post('my_coupon', data)

/**
 * 获取优惠券详情
 * @param {Object} data - 参数
 */
export const getCouponDetail = (data) => bpi.post('coupon_editor_get', data)

/**
 * 获取广告横幅列表
 * @param {Object} data - 查询参数
 */
export const getCastBannerList = (data) => bpi.postPage('ad_msg_list', {
	ad_type: '横幅',
	ad_stat: 1,
	...data,
	_no_disturb: true
})

/**
 * 获取广告详情
 * @param {Object} data - 参数
 */
export const getCastDetail = (data) => bpi.post('ad_msg_editor_get', {
	...data,
	_no_disturb: true
})

/**
 * 增加广告阅读数
 * @param {Object} data - 参数
 */
export const editCastReadNum = (data) => bpi.post('ad_msg_read_num_add', data)

/**
 * 增加广告分享数
 * @param {Object} data - 参数
 */
export const editCastShareNum = (data) => bpi.post('ad_msg_share_num_add', data)

/**
 * 获取应用信息列表
 * @param {Object} data - 查询参数
 */
export const getAppInfoList = (data) => cpi.post('get_app_info_list', {
	search_text: '',
	sort_param: '',
	sort_by: '',
	page: 1,
	page_size: 10,
	sift_type: '',
	sift_allow: '',
	sift_platform: '',
	_silent: true,
	...data
})

/**
 * 获取微信 JS-SDK 配置
 * @param {Object} data - 参数
 * @param {string} data.url - 当前页面 URL
 */
export const getWxConfig = (data) => bpi.post('wx_config', {
	...data,
	_no_disturb: true
})

/**
 * 数字人每日报告
 * @param {Object} data - 参数
 */
export const getDigitalHumanDailyReport = (data) => bpi.post('new/index_media', data)
