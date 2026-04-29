/**
 * 发布相关接口
 */

import { cpi } from '../request.js'

/**
 * 获取发布列表
 * @param {Object} data - 查询参数
 * @param {string} data.date - 日期（yyyy-MM-dd）
 * @param {number} [data.page=1] - 页码
 * @param {number} [data.page_size=7] - 每页数量
 */
export const getPublishList = (data) => cpi.post('get_publish_list', data)

/**
 * 获取发布日历数量（按日期统计）
 * @param {Object} data - 参数
 * @param {string} data.date - 月份（yyyy-MM）
 */
export const getPublishNum = (data) => cpi.post('get_publish_num', data)

/**
 * 获取发布详情
 * @param {Object} data - 参数
 * @param {string} data.id - 发布 ID
 */
export const getPublishDetail = (data) => cpi.post('get_data_detail', data)

/**
 * 增加阅读次数
 * @param {Object} data - 参数
 * @param {string} data.data_id - 数据 ID
 * @param {string} data.data_type - 数据类型
 */
export const setReadNum = (data) => cpi.post('set_read_num', data)

/**
 * 新增发布（支持文件上传）
 * @param {Object} data - 发布数据
 */
export const addPublish = (data) => cpi.upload('set_publish_data', data)

/**
 * 删除发布
 * @param {Object} data - 参数
 * @param {string} data.id - 发布 ID
 */
export const deletePublish = (data) => cpi.post('delete_publish_data', data)

/**
 * 获取评论点赞数量
 * @param {Object} data - 参数
 */
export const getCommentLikeNum = (data) => cpi.post('get_publish_comment_like_num', data)

/**
 * 设置评论点赞
 * @param {Object} data - 参数
 */
export const setCommentLikeNum = (data) => cpi.post('set_publish_comment_like_num', data)

/**
 * 获取评论点赞数据
 * @param {Object} data - 参数
 */
export const getCommentLikeData = (data) => cpi.post('get_publish_comment_like_data', data)

/**
 * 获取推送数量
 */
export const getPushNum = () => cpi.post('get_push_num')

/**
 * 获取评论列表
 * @param {Object} data - 参数
 * @param {string} data.data_id - 数据 ID
 * @param {string} data.data_type - 数据类型
 */
export const getCommentList = (data) => cpi.post('get_commnet_detail', data)

/**
 * 提交评论/留言
 * @param {Object} data - 参数
 * @param {string} data.data_id - 数据 ID
 * @param {string} data.data_type - 数据类型
 * @param {string} data.content - 评论内容
 * @param {number} [data.re_user_id=0] - 回复目标用户 ID
 */
export const addComment = (data) => cpi.post('set_comment_msg', data)
