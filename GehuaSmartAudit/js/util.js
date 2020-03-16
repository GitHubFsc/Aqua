var i18nData = {};
function i18n(key) {
	return i18nData[key];
}

localeLanguage = localStorage.getItem('localeLanguage') || localeLanguage;

function loadI18n(callback){
	jQuery.ajax({
		url: 'i18n/' + localeLanguage,
		async: true,
		contentType: 'application/json',
		dataType: 'json'
	}).done(function(data) {
		i18nData = data;
		jQuery(function() {
			var bodyClass = localeLanguage.slice(0, 5);
			var jBody = jQuery(document.body);
			if (!jBody.hasClass(bodyClass)) {
				jBody.addClass(bodyClass);
			}
		});
		if(typeof callback == 'function'){
			callback();
		}
	});
}

function patchHTML(html) {
	return html.replace(/{{(\w+)}}/g, function(match, key) {
		return i18n(key);
	});
}

function paasLogin(user_name, pwd, callback, errCallback) {
	var queryUrl = paasHost + '/aquapaas/rest/users/access_token/basic';
	queryUrl += '?app_key=' + paasAppKey;
	queryUrl += '&timestamp=' + new Date().toISOString();
	jQuery.ajax({
		url: queryUrl,
		type: 'GET',
		headers: {
			'Authorization': 'Basic ' + my.base64Encode(my.utf16to8(user_name + ':' + pwd)),
			'x-aqua-sign': getPaaS_x_aqua_sign('GET', queryUrl)
		},
		dataType: 'json'
	}).done(function(data) {
		if ( typeof callback === 'function') {
			callback(data);
		}
	}).fail(function() {
		if ( typeof errCallback === 'function') {
			errCallback();
		}
	});
}

function refreshPaaSToken(rfToken, callback) {
	var query = '?refresh_token=' + rfToken;
	query += '&app_key=' + paasAppKey;
	query += '&timestamp=' + new Date().toISOString();
	var queryUrl = paasHost + '/aquapaas/rest/users/access_token/refresh_token' + query;
	jQuery.ajax({
		url: queryUrl,
		type: 'GET',
		async: false,
		dataType: 'json',
		headers: {
			'x-aqua-sign': getPaaS_x_aqua_sign('GET', queryUrl)
		}
	}).done(function(data) {
		if ( typeof callback === 'function') {
			callback(data);
		}
	});
}

function getPaaSUser(id, token, callback, errCallback) {
	var query = '?access_token=' + token + '&user_id=' + id;
	query += '&app_key=' + paasAppKey;
	query += '&timestamp=' + new Date().toISOString();
	var queryUrl = paasHost + '/aquapaas/rest/users/user/' + id + query;
	jQuery.ajax({
		type: 'GET',
		url: queryUrl,
		dataType: 'json',
		headers: {
			'x-aqua-sign': getPaaS_x_aqua_sign('GET', queryUrl)
		}
	}).done(function(data) {
		if ( typeof callback === 'function') {
			callback(data);
		}
	}).fail(function(){
		if (typeof errCallback == 'function'){
			errCallback();
		}
	});
}

function aquaLogin(name, pwd, domainUri, callback, errCallback) {
	jQuery.ajax({
		type: 'GET',
		url: aquaHost + '/aqua/rest/cdmi/cdmi_users/' + name,
		headers: {
			'Accept': 'application/cdmi-user',
			'Authorization': 'Basic ' + my.base64Encode(my.utf16to8(name + ':' + pwd)),
			'x-aqua-user-domain-uri': domainUri
		},
		dataType: 'json'
	}).done(function(data) {
		if ( typeof callback === 'function') {
			callback(data);
		}
	}).fail(function() {
		if ( typeof errCallback === 'function') {
			errCallback();
		}
	});
}

/**
 * 严格遵循RFC3986规范<br> // doubted
 * 不被编码字符有：<b> 字母、数字、-_.~ </b><br>
 * 有部分语言的相关lib会对<b> -_.~ </b>的子集进行编码请自行测试并修正<br>
 * 有部分语言的相关lib不会对<b> !*'();:@&=+$,/?#[] </b>的子集进行编码请自行测试并修正<br>
 * 有部分语言的相关lib会将空格编码为+，请自行测试并修正
 */
function strictEncodeURIComponent(s) {
	s = encodeURIComponent(s);
	var i = s.search(/[!\*'\(\)]/);
	if (i == -1) {
		return s;
	}
	return s.replace("!", '%21').replace("*", '%2A').replace("'", '%27').replace("(", '%28').replace(")", '%29');
}

function getPaaS_x_aqua_sign(method, url) {
	if ( typeof url !== 'string' || typeof method !== 'string') {
		return '';
	}
	if (url.indexOf('//') > -1) {
		url = url.split('//')[1];
		url = url.slice(url.indexOf('/'));
	}
	var string_to_sign;
	if (url.indexOf('?') > -1) {
		var urlParts = url.split('?');
		var urlPath = urlParts[0];
		var urlParam = urlParts[1];
		var params = urlParam.split('&');
		var paramArray = [];
		for (var i = 0, len = params.length; i < len; i++) {
			var param = params[i];
			var paramParts = param.split('=');
			var paramKey = paramParts[0];
			var paramValue = paramParts[1];
			if (paramValue.match(/%[a-fA-F0-9]{2}/)) {
				paramValue = decodeURIComponent(paramValue);
			}
			paramArray.push((paramKey + ':' + paramValue).toLowerCase());
		}
		paramArray.sort();
		string_to_sign = (method + urlPath).toLowerCase() + '?' + paramArray.join(':');
	} else {
		string_to_sign = (method + url).toLowerCase();
	}
	string_to_sign = strictEncodeURIComponent(string_to_sign).toLowerCase();
	var x_aqua_sign = my.base64Encode(my.str_hmac_sha1(paasAppSecret, my.utf16to8(string_to_sign)));
	return x_aqua_sign;
}

function convertTimeString(str) {
	var ret = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|([+-])(\d{2})(\d{2})?)/.exec(str);
	if (ret) {
		var tmpYear = Number(ret[1]);
		var tmpMonth = Number(ret[2]) - 1;
		var tmpDate = Number(ret[3]);
		var tmpHours = Number(ret[4]);
		var tmpMins = Number(ret[5]);
		var tmpSecs = Number(ret[6]);
		var tmpTimeInMyZone = new Date(tmpYear, tmpMonth, tmpDate, tmpHours, tmpMins, tmpSecs);

		var myZoneOffset = tmpTimeInMyZone.getTimezoneOffset();
		var origZoneOffset = 0;
		if (ret[7] != 'Z') {
			origZoneOffset = Number(ret[9]) * 60 + (ret[10] ? Number(ret[10]) : 0);
			if (ret[8] == '+') {
				origZoneOffset = 0 - origZoneOffset;
			}
		}
		var origToMyOffset = origZoneOffset - myZoneOffset;
		var timeMillSecs = tmpTimeInMyZone.getTime() + origToMyOffset * 60 * 1000;
		var timeInMyZone = new Date(timeMillSecs);

		var myZoneStr = '';
		var year = timeInMyZone.getFullYear();
		var month = timeInMyZone.getMonth();
		var date = timeInMyZone.getDate();
		var hours = timeInMyZone.getHours();
		var mins = timeInMyZone.getMinutes();
		var secs = timeInMyZone.getSeconds();

		myZoneStr += year;
		myZoneStr += '-';
		myZoneStr += month > 8 ? month + 1 : '0' + (month + 1);
		myZoneStr += '-';
		myZoneStr += date > 9 ? date : '0' + date;
		myZoneStr += ' ';
		myZoneStr += hours > 9 ? hours : '0' + hours;
		myZoneStr += ':';
		myZoneStr += mins > 9 ? mins : '0' + mins;
		myZoneStr += ':';
		myZoneStr += secs > 9 ? secs : '0' + secs;

		return myZoneStr;
	}
	return '';
}

function addLoadingLayer(){
    jQuery('.loading_layer').remove();
    jQuery('<div>').addClass('loading_layer').appendTo(document.body);
}

function removeLoadingLayer(){
    jQuery('.loading_layer').remove();
}

function removeInputErr(){
    var $ = jQuery;
    $(this).removeClass('input_restrict_err').off('focus', removeInputErr);
}

function showInputErr(input, message){
    var $ = jQuery;
    var $input = $(input).addClass('input_restrict_err').on('focus', removeInputErr);
    var rect = $input[0].getBoundingClientRect();
    $('<div>').addClass('input_restrict_message').append(
        $('<div>').addClass('input_restrict_message_arrow')
    ).append(
        $('<div>').addClass('input_restrict_message_info').append(message)
    ).css({
        top: rect.top,
        left: rect.left
    }).appendTo(document.body);
    if(window.inputErrTimeout){
        clearTimeout(window.inputErrTimeout);
    }
    window.inputErrTimeout = setTimeout(function(){
        $('.input_restrict_message').remove();
    }, 2000);
}

function parseStringToDate(str) {
	var ret = null;
	//         1       2       3      4     5       6       7        8  9     10     11
	var mat = /(\d{4})-(\d{2})-(\d{2})([T\s](\d{2}):(\d{2}):(\d{2}))?(Z|([+-])(\d{2})(\d{2})?)?/.exec(str);
	if(mat != null){
		var _y = +mat[1];
		var _m = +mat[2] - 1;
		var _d = +mat[3];

		if(mat[4] != null){
			var _h = +mat[5];
			var _min = +mat[6];
			var _s = +mat[7];
		}

		var tmp = new Date(_y, _m, _d, _h, _min, _s);

		if(mat[8] != null){
			var _thisOffset = tmp.getTimezoneOffset();
			var _targetOffset = 0;
			if(mat[8] != 'Z'){
				_targetOffset = mat[10] * 60 + (mat[11] != null ? +mat[11] : 0);
				if(mat[9] == '+'){
					_targetOffset = 0 - _targetOffset;
				}
			}
			var relMills = tmp.getTime() + (_targetOffset - _thisOffset ) * 60 * 1000;

			ret = new Date(relMills);

		} else {
			ret = tmp;
		}

	}
	return ret;
}

function preZero(str, num){
	num = num != null ? num : 2;
	str = str.toString();
	while(str.length < num){
		str = '0' + str;
	}
	return str;
}

function dateToStr(date){
	var str = '';
	var y = date.getFullYear();
	var m = date.getMonth();
	var d = date.getDate();

	var h = date.getHours();
	var min = date.getMinutes();
	var s = date.getSeconds();

	str += y;
	str += '-' + preZero(m+1);
	str += '-' + preZero(d);
	str += ' ';
	str += preZero(h);
	str += ':' + preZero(min);
	str += ':' + preZero(s);

	return str;
}

function getTimeZone(){
	var offset = new Date().getTimezoneOffset();
	var str = '';
	if(offset > 0){
		str += '-';
	} else if(offset < 0){
		str += '+';
	} else {
		return 'Z';
	}
	var min = Math.abs(offset);
	var h = Math.floor(min/60);
	var s = min - h * 60;
	str += preZero(h) + preZero(s);
	return str;
}
