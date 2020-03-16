if (!window.my) {
	window.my = {};
}

if (!my.paas) {
	my.paas = {};
}

my.paas.host = null;
my.paas.user_name = null;
my.paas.user_id = null;
my.paas.access_token = null;
my.paas.refresh_token = null;
my.paas.appSecret = null;
my.paas.appKey = null;
my.paas.tokenRefreshInterval = null;

function strictEncodeURIComponent(s) {
	s = encodeURIComponent(s);
	var i = s.search(/[!\*'\(\)]/);
	if(i == -1){ return s; }
	return s.replace("!", '%21').replace("*", '%2A').replace("'", '%27').replace("(", '%28').replace(")", '%29');
}

my.paas.x_aqua_sign = function(method, url){
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
    // log(string_to_sign);
    var x_aqua_sign = my.base64Encode(str_hmac_sha1(this.appSecret, my.utf16to8(string_to_sign)));
    return x_aqua_sign;
}

my.paas.x_aqua_sign_v1 = function(method, url) {
	if (typeof url !== 'string' || typeof method !== 'string') {
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
			paramArray.push({
				key: paramParts[0].toLowerCase(),
				value: paramParts[1].toLowerCase()
			});
		}
		paramArray.sort(function(a, b) {
			return a.key.localeCompare(b.key);
		});
		var joinedParams = [];
		for (var j = 0, jLen = paramArray.length; j < jLen; j++) {
			var paramObj = paramArray[j];
			joinedParams.push(paramObj.key + ':' + paramObj.value);
		}
		string_to_sign = method + urlPath + '?' + joinedParams.join(':');
	} else {
		string_to_sign = method + url;
	}
	string_to_sign = string_to_sign.toLowerCase();
	var x_aqua_sign = my.base64Encode(str_hmac_sha1(this.appSecret, my.utf16to8(string_to_sign)));
	return x_aqua_sign;
};

my.paas.request = function(obj, auth) {
	var method = obj.type != null ? obj.type : 'GET';
	var url = obj.url;
	if(auth != null){
		var param = [];
		if(auth.indexOf('user') > -1){
			param.push('user_id=' + this.user_id);
			param.push('access_token=' + this.access_token);
		}
		if(auth.indexOf('app') > -1){
			param.push('app_key=' + this.appKey);
			param.push('timestamp=' + encodeURIComponent(getTimeStamp()));
			var tmpUrl = url;
			var tmpStr = param.join('&');
			if(tmpUrl.indexOf('?') > -1){
				tmpUrl += '&' + tmpStr;
			} else {
				tmpUrl += '?' + tmpStr;
			}
			if(obj.headers == null){
				obj.headers = {};
			}
			obj.headers['x-aqua-sign'] = this.x_aqua_sign(method, tmpUrl);
		}
		if(param.length > 0){
			var paramStr = param.join('&');
			if(url.indexOf('?') > -1){
				url += '&' + paramStr;
			} else {
				url += '?' + paramStr;
			}
			obj.url = url;
		}
	}
	makeRequest(obj);
};

my.paas.directLogin = function(user_name, callback, async){
	var _this = this;
	this.user_name = user_name != null ? user_name : this.user_name;
	this.request({
		url: this.host + '/aquapaas/rest/users/access_token/direct/' + this.user_name,
		type: 'GET',
		async: !!async,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-third-party': 'boss'
		},
		always: function(xhr){
			if(xhr.status == 200 || xhr.status == 201){
				var data = xhr.responseText;
				log(data);
				data = JSON.parse(data);
				_this.user_id = data.user_id;
				_this.access_token = data.access_token;
				_this.refresh_token = data.refresh_token;

				if(_this.storage != null){
					_this.storage.setValue('user_id', data.user_id);
					_this.storage.setValue('access_token', data.access_token);
					_this.storage.setValue('refresh_token', data.refresh_token);
				}

				_this.setTokenRefresh();

				if(typeof callback == 'function'){
					callback();
				}
			} else {
				log('access fail status: ' + xhr.status);
			}
		},
	}, ['app']);
};

my.paas.setTokenRefresh = function(){
	var _this = this;
	if(this._refreshInterval){
		clearInterval(this._refreshInterval);
	}
	this._refreshInterval = setInterval(function(){
		_this.refreshToken();
	}, this.tokenRefreshInterval);
};

my.paas.stopRefresh = function(){
	if(this._refreshInterval != null){
		clearInterval(this._refreshInterval);
		this._refreshInterval = null;
	}
};

my.paas.refreshToken = function(){
	var _this = this;
	this.request({
		url: this.host + '/aquapaas/rest/users/access_token/refresh_token' + '?refresh_token=' + this.refresh_token,
		async: true,
		type: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		done: function(data){
			data = JSON.parse(data);
			_this.access_token = data.access_token;
			_this.refresh_token = data.refresh_token;

			if(_this.storage != null){
				_this.storage.setValue('access_token', data.access_token);
				_this.storage.setValue('refresh_token', data.refresh_token);
			}

		},
		fail: function(xhr){
			log('access refresh fail status: ' + xhr.status);
			_this.directLogin(null, null, true);
		}
	}, ['app']);
};

my.paas.checkToken = function(callback){
	var _this = this;
	this.request({
		url: this.host + '/aquapaas/rest/users/access_token/refresh_token' + '?refresh_token=' + this.refresh_token,
		async: true,
		type: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		done: function(data){
			data = JSON.parse(data);
			_this.access_token = data.access_token;
			_this.refresh_token = data.refresh_token;

			if(_this.storage != null){
				_this.storage.setValue('access_token', data.access_token);
				_this.storage.setValue('refresh_token', data.refresh_token);
			}

			_this.setTokenRefresh();

			if(typeof callback == 'function'){
				callback()
			}
		},
		fail: function(xhr){
			log('access refresh fail status: ' + xhr.status);
			_this.directLogin(null, callback, true);
		}
	}, ['app']);
};

my.paas.getUserData = function(){
	var userData = {};
	this.request({
		type: 'GET',
		url: this.host + '/aquapaas/rest/users/user/' + this.user_id,
		async: false,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		done: function(data){
			log(data);
			userData = JSON.parse(data);
		},
		fail: function(xhr){
			log('get user data fail: ' + xhr.status);
		},
	}, ['user', 'app']);
	return userData;
};

my.paas.getPlayUrl = function(asset, callback){
	var url = this.host + '/aquapaas/rest/vod/contents';
	url += '?provider_id=' + asset.provider_id;
	url += '&provider_asset_id=' + asset.provider_asset_id;
	this.request({
		url: url,
		type: 'GET',
		async: true,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		done: function(raw){
			var data = JSON.parse(raw);
			data = data[0];
			if(data != null){
				var playUrl = data.url;
				if(typeof callback == 'function'){
					callback(playUrl);
				}
			}
		},
		fail: function(xhr){
			log('Get play url fail: ' + xhr.status);
		}
	}, ['app']);
};

my.paas.getNavigation = function(path, callback){
	var data = {};
	this.request({
		type: 'GET',
		url: this.host + path + '?children=1' + (window.AuditTreeVersion != null && window.AuditTreeVersion != '' ? '&tree_version=' + window.AuditTreeVersion : ''),
		async: true,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		done: function(raw){
			log('Get navigation ok: ' + path);
			try{
				data = JSON.parse(raw);
				callback(data);
			}catch(e){
				log(e.message);
			}
		},
		fail: function(xhr){
			log('Get navigation fail: ' + path + ' , ' + xhr.status);
			callback(null);
		}
	}, ['app']);
}
