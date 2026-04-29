import constant from './constant.js';
import mappingUtil from './datamapping.js';

const isNotePostpone = (weight) => {
	var arr = ((weight / constant.noteWeightPostponeSurplus).toFixed(0) + '').split('');
	return arr[arr.length - 1] === '1';
};

const makeWeight = (note) => {
	note.weight = note.severe + note.emergent * 10;
	if (note.postpone) {
		makePostpone(note);
	}
	return note.weight;
};

const makePostpone = (note) => {
	note.weight += constant.noteWeightPostponeSurplus;
	note.postpone = true;
};

const explainWeight = (note) => {
	var baseWeight = note.weight;
	if (note.weight >= constant.noteWeightPostponeSurplus) {
		var str = note.weight + '';
		baseWeight = parseInt(str.substring(str.length - 2, str.length));
		note.postpone = true;
	}
	note.severe = baseWeight % 10;
	note.emergent = Math.floor(baseWeight / 10);
};

const applyForPermission = (page) => {
	var permissions = uni.getStorageSync('permissions');
	var pageName = mappingUtil.mapInsideName(page);
	if (permissions === undefined || !(permissions instanceof Array)) {
		// AndrewYy: 修改了权限判断
		return false;
		// return true;
	}
	else {
		var arrP = permissions.filter(e => {
			return e.name === pageName;
		});
		if (arrP.length > 0) {
			return true;
		}
		else {
			return false;
		}
	}
};

const utils = {
	note: {
		isNotePostpone,
		makeWeight,
		makePostpone,
		explainWeight
	},
	_inside: {
		applyForPermission
	}
};

export default utils;