/**
 * 通用工具函数
 */

const pad = (num) => {
	return num.toString().padStart(2, '0') // 补零
}

/**
 * 格式化日期时间为 yyyy-MM-dd HH:mm:ss
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的字符串
 */
const formatDateTime = (date) => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`
}

/**
 * 日期补零（将 "2026-1-1" 格式化为 "2026-01-01"）
 * @param {string} date - 日期字符串
 * @returns {string} 补零后的日期
 */
const padDate = (date) => {
	return date ? date.replace(/-(\d)(?!\d)/g, '-0$1') : ''
}

/**
 * 日期加减天数
 * @param {Date} date - 基准日期
 * @param {number} days - 增加的天数（负数为减少）
 * @returns {Date} 新日期
 */
const addDays = (date, days) => {
	const result = new Date(date)
	result.setDate(result.getDate() + days)
	return result
}

/**
 * 日期加减小时
 * @param {Date} date - 基准日期
 * @param {number} hours - 增加的小时数
 * @returns {Date} 新日期
 */
const addHours = (date, hours) => {
	const result = new Date(date)
	result.setHours(result.getHours() + hours)
	return result
}

/**
 * 秒数转换为 "X天 HH:mm:ss" 格式
 * @param {number} seconds - 总秒数
 * @returns {string} 格式化时间
 */
const convertSecondsToTime = (seconds) => {
	if (typeof seconds !== 'number') {
		throw new Error('Input must be a number')
	}
	const days = Math.floor(seconds / 3600 / 24)
	const hours = Math.floor(seconds / 3600 % 24)
	const minutes = Math.floor((seconds % 3600) / 60)
	const remainingSeconds = Math.floor(seconds % 60)
	const formattedDays = String(days) + '天'
	const formattedHours = String(hours).padStart(2, '0')
	const formattedMinutes = String(minutes).padStart(2, '0')
	const formattedSeconds = String(remainingSeconds).padStart(2, '0')
	return `${formattedDays} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

/**
 * 秒数转为 "HH:mm:ss" 格式
 * @param {number} time - 秒数
 * @returns {string} 格式化时间
 */
const formatTime = (time) => {
	if (typeof time !== 'number' || time < 0) {
		return time
	}
	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time
	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

const dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	/**
	 * 将毫秒时间戳转为友好文字（如 "3天前"、"刚刚"）
	 * @param {number} milliseconds - 时间戳
	 * @returns {string} 友好时间文字
	 */
	humanize: function(milliseconds) {
		var diff = Date.now() - milliseconds
		var humanize = ''
		for (var key in this.UNITS) {
			if (diff >= this.UNITS[key]) {
				humanize = Math.floor(diff / this.UNITS[key]) + key + '前'
				break
			}
		}
		return humanize || '刚刚'
	},
	/**
	 * 格式化日期字符串为友好文字或标准格式
	 * @param {string} dateStr - "yyyy-mm-dd HH:MM:ss" 格式字符串
	 * @returns {string} 友好时间或 "yyyy/mm/dd-HH:MM"
	 */
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime()
		if (diff < this.UNITS['天']) {
			return this.humanize(diff)
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number)
		}
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes())
	},
	/**
	 * 将 "yyyy-mm-dd HH:MM:ss" 解析为 Date 对象
	 * @param {string} str - 日期字符串
	 * @returns {Date} 日期对象
	 */
	parse: function(str) {
		var a = str.split(/[^0-9]/)
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5])
	},
	formatDateTime,
	padDate,
	convertSecondsToTime,
	formatTime,
	addDays,
	addHours
}

/**
 * 生成 GUID
 * @returns {string} 大写 GUID 字符串
 */
const newGuid = () => {
	let s4 = function() {
		return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
	}
	return (s4() + s4() + '-' + s4() + '-4' + s4().substr(0, 3) + '-' + s4() + '-' + s4() + s4() + s4()).toUpperCase()
}

/**
 * 判断字符串是否为空
 * @param {*} str - 待检测值
 * @returns {boolean} 是否为空
 */
const isEmpty = (str) => {
	return str === undefined || str === null || str === '' || (typeof str === 'string' && str.trim().length === 0)
}

/**
 * 手机号脱敏
 * @param {string} phoneNumber - 11位手机号
 * @returns {string} 脱敏后的手机号
 */
const desensitizePhoneNumber = (phoneNumber) => {
	if (!phoneNumber || phoneNumber.length !== 11) {
		return phoneNumber || ''
	}
	return phoneNumber.slice(0, 3) + '****' + phoneNumber.slice(7)
}

/**
 * 验证手机号格式
 * @param {string} phoneNumber - 手机号
 * @returns {boolean} 是否合法
 */
const isMobileNumber = (phoneNumber) => {
	var reg = /^1[0-9]{10,10}$/
	return reg.test(phoneNumber)
}

/**
 * 格式化经纬度
 * @param {number|string} longitude - 经度
 * @param {number|string} latitude - 纬度
 * @returns {Object} 格式化后的经纬度
 */
const formatLocation = (longitude, latitude) => {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}
	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)
	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

/**
 * 随机整数
 * @param {number} lower - 下界
 * @param {number} upper - 上界
 * @returns {number} 随机整数
 */
const integerRandom = (lower, upper) => {
	return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

/**
 * 复制文本到剪贴板（多端兼容）
 * @param {string} text - 待复制文本
 * @returns {Promise<void>}
 */
const copyToClipboard = (text) => {
	return new Promise((resolve, reject) => {
		uni.setClipboardData({
			data: text,
			success: () => resolve(),
			fail: (err) => reject(err)
		})
	})
}

export default {
	dateUtils,
	newGuid,
	isEmpty,
	desensitizePhoneNumber,
	isMobileNumber,
	formatLocation,
	integerRandom,
	copyToClipboard
}
