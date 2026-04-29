import qrcode from '../sdk/qrcode.js';

const padDate = (date) => {
	return date ? date.replace(/-(\d)(?!\d)/g, '-0$1') : '';
};

const formatDateTime = (date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return `${year}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
};

const pad = (num) => {
	return num.toString().padStart(2, "0");
};

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
};

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const addHours = (date, hours) => {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
};

const convertSecondsToTime = (seconds) => {
    // 确保输入是数字
    if (typeof seconds !== 'number') {
        throw new Error('Input must be a number');
    }

    // 计算天
    const days = Math.floor(seconds / 3600 / 24);
    // 计算小时
    const hours = Math.floor(seconds / 3600 % 24);
    // 计算剩余的分钟
    const minutes = Math.floor((seconds % 3600) / 60);
    // 计算剩余的秒
    const remainingSeconds = Math.floor(seconds % 60);

    // 格式化输出
    const formattedDays = String(days) + '天';
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedDays} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

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
};

const newGuid = () => {
	let s4 = function() {
		return (65536 * (1 + Math.random()) | 0).toString(16).substring(1);
	}
	return (s4() + s4() + "-" + s4() + "-4" + s4().substr(0, 3) + "-" + s4() + "-" + s4() + s4() + s4()).toUpperCase();
};

const addUrlTimestamp = (url) => {
	var timestamp = 't=' + Date.now();
	if (url.indexOf('?') === -1) {
		return url + '?' + timestamp;
	}
	else if (url.indexOf('&') === url.length - 1){
		return url + timestamp;
	}
	else {
		return url + '&' + timestamp;
	}
};

const roundedMinuteTimeString = (obj) => {
	var min = obj.getMinutes() + 5 - new Date().getMinutes() % 5;
	var time1 = new Date(obj.setHours(obj.getHours() + 1));
	var time2 = new Date(time1.setMinutes(min));
	return formatDateTime(time2);
};

var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var diff = Date.now() - milliseconds;
		var humanize = '';
		for (var key in this.UNITS) {
			if (diff >= this.UNITS[key]) {
				humanize = Math.floor(diff / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	},
	formatDateTime,
	addUrlTimestamp,
	padDate,
	convertSecondsToTime,
	roundedMinuteTimeString,
	addDays,
	addHours
};

const integerRandom = (lower, upper) => {
	return Math.floor(Math.random() * (upper - lower + 1)) + lower;
};

const isEmpty = (str) => {
	return str === undefined || str === null || str.length === 0;
};

const copyToClipboard = (text) => {
	const textArea = document.createElement('textarea');
	textArea.style.position = 'fixed';
	textArea.style.visibility = '-10000px';
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	textArea.id = '_helperCopy';

	if (!document.execCommand('copy')) {
		console.warn('浏览器不支持 document.execCommand("copy")');
		document.body.removeChild(textArea);
		return false;
	} else {
		console.log("复制成功");
		document.body.removeChild(textArea);
		return true;
	}
};

const base64Encode = (str) => {
	return window.btoa(unescape(encodeURIComponent(str)));
};

const base64Decode = (str) => {
	return decodeURIComponent(escape(window.atob(str)));
};

const chineseToHex = (ch) => {
	if (ch) {
		var arr = ch.split('');
		var res = '';
		for (var i = 0; i < arr.length; i++) {
			res += arr[i].charCodeAt().toString(16);
			if (i != arr.length - 1) { res += ','; }
		}
		console.log(res);
		return res;
	}
	return false;
};

const hexToChinese = (ch) => {
	if (ch) {
		var arr = ch.split(',');
		var res = '';
		for (var i = 0; i < arr.length; i++) {
			res += String.fromCharCode(parseInt(arr[i], 16));
		}
		console.log(res);
		return res;
	}
	return false;
};

const desensitizePhoneNumber = (phoneNumber) => {
	if (phoneNumber.length !== 11) {
		throw new Error("Invalid phone number length");
	}
	return phoneNumber.slice(0, 3) + '****' + phoneNumber.slice(7);
};

const isMobileNumber = (phoneNumber) => {
	var reg = /^1[0-9]{10,10}$/;
	return reg.test(phoneNumber);
};

const getPropertySync = (obj, valueOnly) => {
	try {
		if (!obj) {
			return obj;
		}
		else if (typeof(obj) === 'string') {
			if (!obj.trim().length) {
				return obj;
			}
			else if (obj.indexOf('{') === 0 || obj.indexOf('[') === 0) {
				var data = JSON.parse(obj);
				if (valueOnly && data['value']) {
					return data['value'];
				}
				return data;
			}
			else {
				return obj;
			}
		}
		else {
			return obj;
		}
	}
	catch (err) {
		console.log(err);
		return obj;
	}
};

const utils = {
	linkUtils: {
		getPropertySync
	},
	dateUtils,
	other: {
		formatLocation,
		newGuid,
		integerRandom,
		isEmpty,
		copyToClipboard,
		base64Encode,
		base64Decode,
		desensitizePhoneNumber,
		isMobileNumber,
		qrcode
	}
};

export default utils;