var i18nLib = {};
function i18n(key) {
    return i18nLib[key];
}

localeLanguage = localStorage.getItem('localeLanguage') || localeLanguage;
jQuery.ajax({
    url: 'i18n/' + localeLanguage,
    async: false,
    contentType: 'application/json',
    dataType: 'json'
}).done(function(data) {
    i18nLib = data;
    jQuery(function() {
        var bodyClass = localeLanguage.slice(0, 5);
        var jBody = jQuery(document.body);
        if (!jBody.hasClass(bodyClass)) {
            jBody.addClass(bodyClass);
        }
    });
});

function patchHTML(html){
    return html.replace(/{{(\w+)}}/g, function(match, key){
        return i18n(key);
    });
}

function paasLogin(user_name, pwd, callback, errCallback){
	var queryUrl = paasHost + '/aquapaas/rest/users/access_token/basic';
	queryUrl += '?app_key=' + paasAppKey;
	queryUrl += '&timestamp=' + new Date().toISOString();
    jQuery.ajax({
        url: queryUrl,
        type: 'GET',
        headers: {
            'Authorization': 'Basic ' + my.base64Encode(my.utf16to8(user_name + ':' + pwd)),
            'x-aqua-sign': getPaaS_x_aqua_sign('GET',queryUrl)
        },
        dataType: 'json'
    }).done(function(data){
        if(typeof callback === 'function'){
            callback(data);
        }
    }).fail(function(){
        if(typeof errCallback === 'function'){
            errCallback();
        }
    });
}

function refreshPaaSToken(rfToken, callback){
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
            'x-aqua-sign': getPaaS_x_aqua_sign('GET',queryUrl)
        }
    }).done(function(data){
        if(typeof callback === 'function'){
            callback(data);
        }
    });
}

function getPaaSUser(id, token, callback){
    var query = '?access_token=' + token + '&user_id=' + id;
    query += '&app_key=' + paasAppKey;
    query += '&timestamp=' + new Date().toISOString();
    var queryUrl = paasHost + '/aquapaas/rest/users/user/' + id + query;
    jQuery.ajax({
        type: 'GET',
        url: queryUrl,
        dataType: 'json',
        headers: {
            'x-aqua-sign': getPaaS_x_aqua_sign('GET',queryUrl)
        }
    }).done(function(data){
        if(typeof callback === 'function'){
            callback(data);
        }
    });
}

function aquaLogin(name, pwd, domainUri, callback, errCallback){
    jQuery.ajax({
        type: 'GET',
        url: aquaHost + '/aqua/rest/cdmi/cdmi_users/' + name,
        headers: {
            'Accept': 'application/cdmi-user',
            'Authorization': 'Basic ' + my.base64Encode(my.utf16to8(name + ':' + pwd)),
            'x-aqua-user-domain-uri': domainUri
        },
        dataType: 'json'
    }).done(function(data){
        if(typeof callback === 'function'){
            callback(data);
        }
    }).fail(function(){
        if(typeof errCallback === 'function') {
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
	if(i == -1){ return s; }
	return s.replace("!", '%21').replace("*", '%2A').replace("'", '%27').replace("(", '%28').replace(")", '%29');
}
function getPaaS_x_aqua_sign(method, url){
    if(typeof url !== 'string' || typeof method !== 'string'){
        return '';
    }
    if(url.indexOf('//') > -1){
        url = url.split('//')[1];
        url = url.slice(url.indexOf('/'));
    }
    var string_to_sign;
    if(url.indexOf('?') > -1){
        var urlParts = url.split('?');
        var urlPath = urlParts[0];
        var urlParam = urlParts[1];
        var params = urlParam.split('&');
        var paramArray = [];
        for(var i = 0, len = params.length; i < len; i++){
            var param = params[i];
            var paramParts = param.split('=');
            var paramKey = paramParts[0];
            var paramValue = paramParts[1];
            if(paramValue.match(/%[a-fA-F0-9]{2}/)){
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
    var x_aqua_sign = my.base64Encode(str_hmac_sha1(paasAppSecret, my.utf16to8(string_to_sign)));
    return x_aqua_sign;
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

function openMsgDialog(msg, callback){
	var $ = jQuery;
	var dialog = new PopupDialog({
		url: 'content/utils/msg_dialog.html',
		width: 480,
		height: 268,
		context: {},
		callback: function() {
			$('#utils_dialog_info_msg').text(msg);
			$('#utils_dialog_info_submit').on('click', function() {
				dialog.close();
				if(typeof callback == 'function'){
					callback();
				}
			});
		}
	});
	dialog.open();
}

function getInUsePolicy(operation){
	var ret;
	var query = paasHost + paasAdvDomain + '/ads/adpolicy/adpolicys/inuse';
	query += '?value=' + operation.value;
	query += '&type=' + operation.type;
	query += '&mode=' + operation.mode;
	query += '&user_id=' + my.paas.user_id;
	query += '&access_token=' + my.paas.access_token;
	query += '&app_key=' + paasAppKey;
	query += '&timestamp=' + new Date().toISOString();
	jQuery.ajax({
		url: query,
		type: 'GET',
		dataType: 'json',
		async: false,
		headers: {
			'x-aqua-sign': getPaaS_x_aqua_sign('GET',query)
		}
	}).done(function(data){
		ret = data;
	});
	return ret;
}

// /aquapaas_adv/rest/ads/adpolicy/inuseadpolicys params
// value: aditem id, ad_group id, ad_position ext_id, tag
// type: aditem, ad_group, ad_position, tag
// mode: delete, update
function showPolicyBindingOperatingMsg(operation, callback){
	var inUsePolicy = getInUsePolicy(operation);

	var allowed = !(inUsePolicy && inUsePolicy.length > 0);

	var msgKey = 'msg_' + operation.type + '_' + operation.mode + (allowed ? '_ask' : '_no');

	if(!allowed){
		callback = null;
	}
	openMsgDialog(getOperatingMsg(msgKey), callback);
}

function getOperatingMsg(key){
	return i18n(key.toUpperCase()) || '';

	var Msgs = {
		msg_ad_position_update_ask: '',
		msg_ad_position_update_no: '',
		msg_ad_position_delete_ask: '',
		msg_ad_position_delete_no: '',
		msg_ad_group_update_ask: '',
		msg_ad_group_update_no: '',
		msg_ad_group_delete_ask: '',
		msg_ad_group_delete_no: '',
		msg_aditem_update_ask: '',
		msg_aditem_update_no: '',
		msg_aditem_delete_ask: '',
		msg_aditem_delete_no: '',
		msg_tag_update_ask: '',
		msg_tag_update_no: '',
		msg_tag_delete_ask: '',
		msg_tag_delete_no: '',
		msg_adPolicy_update_ask: '',
		msg_adPolicy_update_no: '',
		msg_adPolicy_delete_ask: '',
		msg_adPolicy_delete_no: ''
	};

	for(var item in Msgs){
		if(Msgs.hasOwnProperty(item)){
			Msgs[item] = i18n(item.toUpperCase());
		}
	}

	return Msgs[key] || '';
}

function showPolicyOperatingMsg(mode, state, callback){
	var msgKey = '';
	if(state == 'disabled'){
		if(typeof callback == 'function'){
			callback();
		}
		return;
	}else if(state == 'enabled'){
		callback = null;
		msgKey = 'msg_adPolicy_' + mode + '_no';
	}else{
		msgKey = 'msg_adPolicy_' + mode + '_ask';
	}

	openMsgDialog(getOperatingMsg(msgKey), callback);
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

function preZero(str, num){
	num = num != null ? num : 2;
	str = str.toString();
	while(str.length < num){
		str = '0' + str;
	}
	return str;
}

/**
 * 判断浏览器的类型
 * @returns number
 * {0:示知，1：IE浏览器，2：firefox浏览器，3:chrome，4、opera，5、safari}
 */
function isBrowser(){
	var ret = 0;
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if(Sys.ie){//Js判断为IE浏览器
        ret = 1;
    }
    if(Sys.firefox){//Js判断为火狐(firefox)浏览器
        ret = 2;
    }
    if(Sys.chrome){//Js判断为谷歌chrome浏览器
        ret = 3;
    }
    if(Sys.opera){//Js判断为opera浏览器
        ret = 4;
    }
    if(Sys.safari){//Js判断为苹果safari浏览器
        ret = 5;
    }
    return ret;
}

/**
 * 兼容低版本firefox 不支持ES6 的String.prototype.padStart 以及 String.prototype.padEnd特性
 * @return {string} [返回填充了内容的字符串]
 */
(function() {
	//如果不支持则使用自己写的padStart方法
	if (typeof String.prototype.padStart !== 'function') {
		/**
		 * 字符串前填充自定义字符
		 * @param  {Number} len  需返回的字符串长度
		 * @param  {String} fill 填充字符串
		 * @return {String}      填充过后的字符串
		 */
		String.prototype.padStart = function(len, fill) {
			var ret = this.toString();
			len = parseInt(len)
			if (!isNaN(len)) {
				if (this.length < len) {
					var fill_len = fill.length,
							prefix_len = len - this.length,
							times = Math.floor(prefix_len / fill_len),
							mod = prefix_len % fill_len,
							prefix='';
					while (times > 0) {
						times --;
						prefix += fill
					}
					prefix += fill.slice(0, mod)
					ret = prefix + ret
				}
			}
			return ret;
		}
	}
	//如果不支持则使用自己写的padEnd方法
	if (typeof String.prototype.padEnd !== 'function') {
		/**
	 	* 字符串后填充自定义字符
	 	* @param  {Number} len  需返回的字符串长度
	 	* @param  {String} fill 填充字符串
	 	* @return {String}      填充过后的字符串
	 	*/
		String.prototype.padEnd = function(len, fill) {
			var ret = this.toString();
			len = parseInt(len)
			if (!isNaN(len)) {
				if (this.length < len) {
					var fill_len = fill.length,
							tail_len = len - this.length,
							times = Math.floor(tail_len / fill_len),
							mod = tail_len % fill_len,
							tail='';
					while (times > 0) {
						times --;
						tail += fill
					}
					tail += fill.slice(0, mod)
					ret += tail
				}
			}
			return ret;
		}
	}
})()
