if (!window.my) {
	window.my = {};
}

if (!my.aqua) {
	my.aqua = {};
}

my.aqua.host = null;
my.aqua.restRoot = null;
my.aqua.accessKeyId = null;
my.aqua.secretAccessKey = null;

my.aqua.trimURL = function(url) {
	if ( typeof url !== 'string') {
		return '';
	}

	if (url.indexOf('//') > -1) {
		url = url.split('//')[1];
	}

	var tmp1 = url.indexOf("/") >= 0 ? url.indexOf("/") : 0;
	var tmp2 = url.indexOf("?");
	var urlPath = url.substr(tmp1, (tmp2 >= 0 ? tmp2 : url.length) - tmp1);

	return urlPath;
};

my.aqua.getAquatoken = function(url, method, contentType, nowDateTime) {
	var urlPath = encodeURI(this.trimURL(url));

	if (!method) {
		method = 'GET';
	}
	if (contentType === null || typeof contentType === 'undefined') {
		contentType = '';
	}
	if ( typeof nowDateTime === 'undefined') {
		nowDateTime = new Date().getTime();
	}
	var stringToSign = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;

	var token = this.accessKeyId + ":" + my.base64Encode(my.str_hmac_sha1(this.secretAccessKey, stringToSign));
	return encodeURIComponent(token);
};

my.aqua.getAuthorization = function(url, method, contentType, nowDateTime) {
	var urlPath = encodeURI(this.trimURL(url));

	if ( typeof nowDateTime === 'undefined') {
		nowDateTime = new Date().getTime();
	}

	var stringToSign = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;

	var authorization = 'AQUA ' + this.accessKeyId + ":" + my.base64Encode(my.str_hmac_sha1(this.secretAccessKey, stringToSign));
	return authorization;
};

my.aqua.addXHRHeaderRequest = function(xhr, method, url, contentType) {
	var nowDateTime = new Date().getTime();

	if (xhr != null) {
		xhr.setRequestHeader("Accept", contentType);
		xhr.setRequestHeader("Content-Type", contentType);
		xhr.setRequestHeader("Authorization", this.getAuthorization(url, method, contentType, nowDateTime));
		xhr.setRequestHeader("x-aqua-date", nowDateTime);
		xhr.setRequestHeader("x-aqua-read-reference-redirect", false);
	}
};
