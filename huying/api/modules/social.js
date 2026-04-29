/**
 * 微逛（内容浏览）相关接口
 */

import { cpi } from '../request.js'

/**
 * 获取微逛内容列表
 * @param {Object} data - 查询参数
 * @param {string} data.kw - 搜索关键词
 * @param {number} data.page - 页码
 * @param {number} data.size - 每页条数
 */
export const getWeiguangList = (data) => cpi.post('get_weiguang_list', data)

/**
 * 获取微逛内容详情
 * @param {Object} data - 参数
 * @param {string} data.id - 内容 ID
 */
export const getWeiguangDetail = (data) => cpi.post('get_note_data_detail', data)

/**
 * 获取微逛内容补充数据
 * @param {Object} data - 参数
 * @param {string} data.id - 内容 ID
 */
export const getWeiguangSupplyment = (data) => cpi.post('get_data_detail', data)

/**
 * 获取评论列表
 * @param {Object} data - 参数
 * @param {string} data.id - 内容 ID
 */
export const getWeiguangCommentList = (data) => cpi.post('get_commnet_detail', data)

/**
 * 获取相似内容（换一换）
 * @param {Object} data - 参数
 * @param {string} data.id - 当前内容 ID
 */
export const getWeiguangRelative = (data) => cpi.post('change_similar', data)

/**
 * 点赞
 * @param {Object} data - 参数
 * @param {string} data.id - 内容 ID
 */
export const addWeiguangLike = (data) => cpi.post('set_like_num', data)

/**
 * 添加评论
 * @param {Object} data - 参数
 * @param {string} data.id - 内容 ID
 * @param {string} data.msg - 评论内容
 */
export const addWeiguangComment = (data) => cpi.post('set_comment_msg', data)

/**
 * 获取微逛栏目列表
 */
export const getWeiguangChannel = () => cpi.post('get_columns')

/**
 * 保存微逛栏目配置
 * @param {Object} data - 栏目配置
 */
export const updateWeiguangChannel = (data) => cpi.post('save_columns', data)

/**
 * 更新阅读数
 * @param {Object} data - 参数
 * @param {string} data.id - 内容 ID
 */
export const updateWeiguangReadNum = (data) => cpi.post('set_read_num', data)

/**
 * 更新分享点击数
 * @param {Object} data - 参数
 * @param {string} data.id - 内容 ID
 */
export const updateWeiguangShareClick = (data) => cpi.post('set_share_click_num', data)

/**
 * 获取数据来源信息
 * @param {Object} data - 参数
 */
export const getSourceData = (data) => cpi.post('set_source_data', data)

/**
 * 获取经纬度信息
 * @param {Object} data - 参数
 */
export const getLongLat = (data) => cpi.post('get_long_lat', data)
