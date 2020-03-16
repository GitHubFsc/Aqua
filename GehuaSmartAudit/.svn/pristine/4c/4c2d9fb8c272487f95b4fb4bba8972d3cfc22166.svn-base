if (!window.my) {
	window.my = {};
}

if (!my.paas) {
	my.paas = {};
}

my.paas.host = null;
my.paas.appSecret = null;
my.paas.appKey = null;
my.paas.user_id = null;
my.paas.user_name = null;
my.paas.access_token = null;
my.paas.refresh_token = null;

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
    var x_aqua_sign = my.base64Encode(my.str_hmac_sha1(this.appSecret, my.utf16to8(string_to_sign)));
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
			param.push('timestamp=' + encodeURIComponent(this.getTimeStamp()));
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
	return jQuery.ajax(obj);
};

my.paas.getTimeStamp = function(){
	return (new Date().toISOString()).substr(0,19) + 'Z';
};
