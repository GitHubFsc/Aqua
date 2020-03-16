var App = {
	init: function(){
		log(navigator.userAgent);
		log(new Date().toString());
		log('v201911181609');
		var _this = this;
		my.paas.host = paasHost;
		my.paas.appKey = paasAppKey;
		my.paas.appSecret = paasAppSecret;
		this.store = MyStorage.getStorage();
		this.store.setNamespace('nianhua.hxzq');
		var search = location.search;
		log(search);
		_this.portalParam = decodeURIComponent(getURLParameter('AppBackParam'));
		var backUrlPos = search.indexOf('backUrl=');
		if(backUrlPos > -1){
			_this.portalUrl = decodeURIComponent(search.slice(backUrlPos + 8));
		}
		window.AuditTreeVersion = getURLParameter('tree_version');
		Tabsv.init();
	},
	getHtml: function(url, callback) {
		makeRequest({
			url: url,
			type: 'GET',
			async: true,
			headers: {
				'Accept': 'text/html;charset=utf-8',
				'Content-Type': 'text/html;charset=utf-8'
			},
			done: function(data) {
				if ( typeof callback == 'function') {
					callback(data);
				}
			},
			fail: function(xhr) {
				log('get page fail: ' + xhr.status);
			}
		});
	},
	getTemplate: function(id){
		var $tem = $$('#' + id);
		if($tem != null){
			return $tem.innerHTML;
		}
		return '';
	},
	getJson: function(url, callback) {
		makeRequest({
			url: url,
			type: 'GET',
			async: true,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			done: function(data) {
				data = JSON.parse(data);
				if ( typeof callback == 'function') {
					callback(data);
				}
			},
			fail: function(xhr) {

			}
		});
	},
	onKeyEvent: function(e){
		var code = e.which || e.keyCode;
		switch(code){
		case keyValue.back:
		case keyValue.BACK:
		case keyValue.Back:
		case keyValue.quit:
		case keyValue.QUIT:
		case keyValue.Quit:
			this.back();
			return false;
			break;
		}
	},
	back: function(){
		this.store.setValue('page', '');
		this.store.setValue('pageFocus', '');
		// try{
			// history.back();
		// }catch(e){
			// log(e.message);
		// }
		try{
			if(window.DeviceType != 3){
				if(window.Collect && typeof Collect.sendAll == 'function'){
					Collect.sendAll();
				} else {
					log('no Collect sendAll');
				}
			}
		}catch(e){
			log(e.message);
		}
		switch(DeviceType){
		case 2:
			var startParam = null;
			try{
				if(this.portalParam != null && this.portalParam != ''){
					startParam = JSON.parse(this.portalParam);
				}
			}catch(e){
				log(e.message);
			}
			if(startParam == null){
				startParam = window.HomeStartParam;
			}
			try{
				GHWEBAPI.StartApp(startParam, null, "");
			}catch(e){
				log(e.message);
			}
			break;
		case 1:
		case 3:
			var backUrl = '';
			if(this.portalUrl != null && this.portalUrl != ''){
				backUrl = this.portalUrl;
			} else if(window.HomePageUrl != null){
				backUrl = window.HomePageUrl + new Date().getTime();
			}
			location.href = backUrl;
			break;
		}
	},

	goPlayer: function(vod){
		switch(window.DeviceType){
		case 1:
		case 2:
			var playParam = window.PlayParam;
			if(vod != null) {
				if(vod.provider_id != null){
					playParam.ProviderID = vod.provider_id;
				}
				if(vod.provider_asset_id != null){
					playParam.ProviderAssetID = vod.provider_asset_id;
				}
			}

			var backParam = window.AppBackParam;
			var url = location.href;
			log(url);
			backParam.AppParam = {
				Linux: url,
				Android: url,
				ThinClient: url
			};

			this.getVSPRev({
				paid: playParam.ProviderAssetID,
				caid: getSmartCardId(),
			}, function(json){

			try{
				playParam.ExtParam = 'app=' + window.PlayParamExtApp + ';poid=' + json.result.list[0].provider.poid;
				// playParam.ExtParam += ';ad=1;businessType=' + json.result.list[0].extra.extra5;

				log(JSON.stringify(playParam));
				var ret = GHWEBAPI.PlayVedioOnDemand_VSP(playParam, backParam);
				if(ret.ResultCode == 0){
					log('play ok.');
				} else {
					log('play fail: ' + ret.Description);
				}
			}catch(e){
				log(e.message);
			}

			});
		break;
		case 3:
			var player = window.LinuxPlayerUrl;
			var param = window.LinuxPlayParam;
			try{
				var CAID = CA.card.serialNumber;
				var serviceGroupId = Math.floor(VOD.server.nodeGroupId);
			}catch(e){
				log(e.message);
			}
			player += '?caid=' + CAID;
			player += '&key=' + (param.key != null ? param.key : '');
			if(vod != null) {
				if(vod.provider_id != null && vod.provider_asset_id != null){
					player += '&pid=' + vod.provider_id + ';' + vod.provider_asset_id;
					// player += '?' + vod.provider_id + '_' + vod.provider_asset_id;
				}
			} else {
				player += '&pid=' + (param.pid != null ? param.pid : '');
				// player += '?' + (param.pid != null ? param.pid : '');
			}
			player += '&nodeGroup=' + serviceGroupId;
			player += '&ip=' + (param.ip != null ? param.ip : '');
			player += '&back=' + encodeURIComponent(location.href);
			log(player);
			location.href = player;
			break;
		default:
			break;
		}
	},
	getVSPRev: function(param, callback){
		log('reverse query by cardid ' + param.caid + ' on paid ' + param.paid);
		makeRequest({
			type: 'GET',
			url: VSP_Host + '/vsp_outlet/catalog/reverse/json?id=' + VSP_ProgramId
				+ '&paids=' + param.paid + '&caid=' + param.caid + '&key=' + VSP_AppKey,
				// + '&extra=extra5',
			async: true,
			headers: {
				'Accept': 'application/json',
				// 'Content-Type': 'application/json', //removed for CORS restrict on Changhong Android.
			},
			done: function(data){
				try{
					var json = JSON.parse(data);
					if(typeof callback == 'function'){
						callback(json);
					}
				}catch(e){
					log(e.message);
				}
			},
			fail: function(xhr){
				log('reverse fail: ' + xhr.status);
			}
		});
	},
	preloadImg: function(){
		var imgs = [];
		for(var i = 0, len = imgs.length; i < len; i+= 1){
			var img = new Image();
			img.onload = function(){
				log('preloaded ' + this.src);
			}
			img.src = imgs[i];
		}
	}
};

function getSmartCardId(){
	if(typeof GHWEBAPI != 'undefined'){
		var ret = GHWEBAPI.GetParam('CardID');
		if(ret.ResultCode == 0){
			return ret.ParamValue;
		} else {
			log(ret.Description);
		}
	} else if(typeof CA != 'undefined'){
		return CA.card.serialNumber;
	}
	return '';
}

function init(){
	setTimeout(function(){
		App.init();
	}, 50);
}

var MyFocus = App;
var MyFocusLast = null;
var cloudTimeout = null;
function grabEvent(e){
	var ret;

	if (MyFocus != null && typeof MyFocus.onKeyEvent == 'function') {
		try{
			ret = MyFocus.onKeyEvent(e);
			if(ret != null && !ret) {
				if(typeof e.preventDefault == 'function'){
					e.preventDefault();
				} else {
					e.returnValue = false;
				}
			}
		}catch(error){
			log([error.name, error.message, error.lineNumber, error.fileName].join(', '));
		}
	} else {
		MyFocus = App;
	}

	if(window.CyberCloud){
		if(window.cloudTimeout != null){
			clearTimeout(window.cloudTimeout);
		}
		window.cloudTimeout = setTimeout(function(){
			log('try exit cloud.');
			try{
				GHWEBAPI.ExitCloud();
			}catch(e){
				log(e.message);
			}
		}, 3 * 60 * 1000);
	}
	return ret;
}

function setFocus(obj, isSilentOut, isSilentIn){
	if(obj == null){
		return false;
	}
	if(typeof obj.onKeyEvent != 'function'){
		return false;
	}
	MyFocusLast = MyFocus;
	MyFocus = obj;
	if(!isSilentOut && MyFocusLast != null && typeof MyFocusLast.onFocusOut == 'function'){
		MyFocusLast.onFocusOut();
	}
	if(!isSilentIn && MyFocus != null && typeof MyFocus.onFocusIn == 'function'){
		MyFocus.onFocusIn();
	}
	return true;
}

document.onkeydown = grabEvent;

window.onerror = function(message, source, lineno, colno, error){
	log([message, 'line ' + lineno, 'col ' + colno, source].join(', '));
};