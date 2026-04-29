/**
 * 订阅管理相关接口
 */

import { cpi } from '../request.js'

/**
 * 获取订阅列表
 * @param {Object} data - 查询参数
 */
export const getOrderList = (data) => cpi.post('get_order_list', data)

/**
 * 获取订阅首页数据
 * @param {Object} data - 查询参数
 */
export const getOrderIndex = (data) => cpi.post('get_order_data', data)

/**
 * 新增订阅
 * @param {Object} data - 订阅数据
 */
export const addOrder = (data) => cpi.post('set_order', data)

/**
 * 更新订阅
 * @param {Object} data - 订阅数据
 */
export const updateOrder = (data) => cpi.post('update_order', data)

/**
 * 删除订阅
 * @param {Object} data - 参数
 * @param {string} data.id - 订阅 ID
 */
export const deleteOrder = (data) => cpi.post('delete_order', data)

/**
 * 获取公司列表（订阅关联）
 * @param {Object} data - 查询参数
 */
export const getCompanyList = (data) => cpi.post('get_company_list', data)

/**
 * 获取推送时间列表
 * @param {Object} data - 查询参数
 */
export const getOrderTimeList = (data) => cpi.post('get_push_time_list', data)
