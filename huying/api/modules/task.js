/**
 * 今日事（任务管理）相关接口
 */

import { bpi } from '../request.js'

/**
 * 获取任务列表
 * @param {Object} data - 查询参数
 * @param {string} data.remind_time - 日期（yyyy-MM-dd）
 * @param {number} data.is_finished - 状态（2=全部）
 * @param {string} data.order_type - 排序方式
 * @param {number} [data.page] - 页码
 * @param {number} [data.size] - 每页数量
 */
export const getNoteList = (data) => bpi.postPage('note_list', data)

/**
 * 获取任务详情（编辑用）
 * @param {Object} data - 参数
 * @param {string} data.id - 任务 ID
 */
export const getNoteDetail = (data) => bpi.post('note_editor_get', data)

/**
 * 新增任务
 * @param {Object} data - 任务数据
 * @param {string} data.title - 标题
 * @param {string} data.content - 内容
 * @param {string} data.push_time - 提醒时间
 */
export const addNote = (data) => bpi.post('note_add', data)

/**
 * 编辑任务
 * @param {Object} data - 任务数据
 * @param {string} data.id - 任务 ID
 */
export const editNote = (data) => bpi.post('note_editor', data)

/**
 * 删除任务
 * @param {Object} data - 参数
 * @param {string} data.id - 任务 ID
 */
export const deleteNote = (data) => bpi.post('note_del', data)

/**
 * 修改任务状态（完成/推迟等）
 * @param {Object} data - 参数
 * @param {string} data.id - 任务 ID
 * @param {number} data.state - 状态值
 */
export const editNoteStatus = (data) => bpi.post('note_state_set', data)

/**
 * 获取日历任务数量（按日期统计）
 * @param {Object} data - 参数
 * @param {string} data.time - 月份（yyyy-MM）
 */
export const getNoteCalendar = (data) => bpi.post('note_num', data)

/**
 * 获取推送通知设置
 */
export const getPushNoticeStatus = () => bpi.post('news_set_get')

/**
 * 修改推送通知设置
 * @param {Object} data - 通知设置
 */
export const editPushNoticeStatus = (data) => bpi.post('news_set', data)
