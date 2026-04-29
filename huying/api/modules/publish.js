/**
 * 发布相关接口
 */

import { cpi } from '../request.js'

/**
 * 获取发布列表
 * @param {Object} data - 查询参数
 */
export const getPublishList = (data) => cpi.post('get_publish_list', data)

/**
 * 获取发布详情
 * @param {Object} data - 参数
 * @param {string} data.id - 发布 ID
 */
export const getPublishDetail = (data) => cpi.post('get_publish_detail', data)

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
 * 获取发布数量
 */
export const getPublishNum = () => cpi.post('get_publish_num')
