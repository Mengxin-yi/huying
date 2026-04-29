/**
 * 用户相关接口
 */

import { bpi } from '../request.js'

/**
 * 账号密码登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 */
export const login = (data) => bpi.post('login', data)

/**
 * 手机验证码登录
 * @param {Object} data - 登录参数
 * @param {string} data.tel - 手机号
 * @param {string} data.code - 验证码
 */
export const loginByMobile = (data) => bpi.post('tel_login', data)

/**
 * 注册
 * @param {Object} data - 注册参数
 * @param {string} data.username - 用户名
 * @param {string} data.tel - 手机号
 * @param {string} data.code - 验证码
 * @param {string} data.password - 密码
 */
export const register = (data) => bpi.post('register', data)

/**
 * 退出登录
 */
export const logout = () => bpi.post('logout')

/**
 * 获取用户资料
 */
export const getProfile = () => bpi.post('user_info_editor_get', { _silent: true })

/**
 * 编辑用户资料（支持文件上传）
 * @param {Object} data - 用户资料
 */
export const editProfile = (data) => bpi.upload('user_info_editor', data)

/**
 * 修改密码
 * @param {Object} data - 参数
 * @param {string} data.old_password - 旧密码
 * @param {string} data.new_password - 新密码
 */
export const changePassword = (data) => bpi.post('user_reset_pw', data)

/**
 * 忘记密码重置
 * @param {Object} data - 参数
 * @param {string} data.tel - 手机号
 * @param {string} data.code - 验证码
 * @param {string} data.password - 新密码
 */
export const forgotPassword = (data) => bpi.post('forgot_pw', data)

/**
 * 获取短信验证码
 * @param {Object} data - 参数
 * @param {string} data.tel - 手机号
 */
export const getSmsCode = (data) => bpi.post('tel_code', data)

/**
 * 获取注册验证码
 * @param {Object} data - 参数
 * @param {string} data.tel - 手机号
 */
export const getRegisterCode = (data) => bpi.post('register_tel_code', data)

/**
 * 检查用户名是否可用
 * @param {Object} data - 参数
 * @param {string} data.username - 用户名
 */
export const checkUsername = (data) => bpi.post('user_check_username', data)

/**
 * 检查手机号是否可用
 * @param {Object} data - 参数
 * @param {string} data.tel - 手机号
 */
export const checkTel = (data) => bpi.post('user_check_tel', data)

/**
 * 修改用户名
 * @param {Object} data - 参数
 * @param {string} data.username - 新用户名
 */
export const editUsername = (data) => bpi.post('username_editor', data)

/**
 * 获取绑定的手机号
 */
export const getMobile = () => bpi.post('user_tel_editor_get')

/**
 * 修改绑定手机号
 * @param {Object} data - 参数
 * @param {string} data.tel - 新手机号
 * @param {string} data.code - 验证码
 */
export const changeMobile = (data) => bpi.post('user_tel_editor', data)

/**
 * 获取换绑手机号验证码
 * @param {Object} data - 参数
 * @param {string} data.tel - 新手机号
 */
export const getNewTelCode = (data) => bpi.post('user_new_tel_code', data)

/**
 * 获取用户验证码（通用）
 * @param {Object} data - 参数
 */
export const getUserCode = (data) => bpi.post('user_tel_code', data)

/**
 * 验证手机号绑定状态
 * @param {Object} data - 参数
 */
export const checkMobileBind = (data) => bpi.post('user_tel_check', data)

/**
 * 解绑微信
 */
export const unbindWechat = () => bpi.post('wx_unbind')

/**
 * 获取微信绑定二维码链接
 */
export const getWechatBindLink = () => bpi.post('bind_qrcode')

/**
 * 获取认证详情
 */
export const getAuthDetail = () => bpi.post('user_verify_get')

/**
 * 提交认证信息（支持文件上传）
 * @param {Object} data - 认证资料
 */
export const editAuth = (data) => bpi.upload('user_verify', data)

/**
 * 取消认证
 */
export const cancelVerify = () => bpi.post('user_cancel_verify')

/**
 * 获取默认头像列表
 */
export const getDefaultAvatarList = () => bpi.post('user_default_avatar_list')

/**
 * 获取用户权限列表
 */
export const getUserPermissions = () => bpi.postPage('user_perm_list', {})
