var AutoVod = {
	init: function(type){
		switch(type){
		case 1:
			this.player = getAndroidPlayer();
			break;
		case 2:
			this.player = getThinClientPlayer();
			break;
		case 3:
			this.player = getIPanelPlayer();
			break;
		}
	},
	play: function(vod, size){
		log('play ' + JSON.stringify(vod));
		log('size ' + JSON.stringify(size));

		try{
			if(vod.provider_id && vod.provider_asset_id){
				this.player && this.player.play(vod, size);
			} else {
				log('vod param error.');
			}
		}catch(e){
			log(e.message);
		}
	},
	close: function(){
		try{
			this.player && this.player.close();
		}catch(e){
			log(e.message);
		}
	}
};

function getIPanelPlayer(){
	var player = {};
	player.type = 'iPanel';
	player.onSystemEvent = function(e){
		var code = e.which || e.keyCode;
		log(code);
		switch(code){
		case 5202: //setup ok
			media.AV.play();
			break;
		case 5203: //setup fail
			break;
		case 5205: //play ok
			break;
		case 5206: //play fail
			break;
		case 5225:
			var p2 = e.modifiers;
			log('p2: ' + p2);
			break;
		case 5226:
			break;
		case 5227: //fail
			break;
		case 5210: //play ended
			this.replay();
			break;
		}
	};
	player.play = function(vod, size){
		var _this = this;
		SystemEventHandle.add(this);
		this.vod = vod;
		this.size = size;
		if(!this.smartCardId){
			this.getVodParams(function(){
				_this.setup();
			});
		} else {
			this.setup();
		}
	};
	player.replay = function(){
		media.AV.close();
		this.setup();
	};
	player.setup = function(){
		var videoPID = this.vod.provider_id;
		var videoPAID = this.vod.provider_asset_id;
		var rtspURL = this.rtspAddr + "/60010000?";
		var transport = "MP2T/DVBC/QAM;unicast";
		var ServiceGroup = this.ServiceGroup;
		var client_mac = this.macAddress;
		var url = rtspURL + "asset=" + videoPID + "#" + videoPAID + "&folderId=" +
			"&transport=" + transport + "&ServiceGroup=" + ServiceGroup +
			"&smartcard-id=" + this.smartCardId + "&device-id=" + this.smartCardId +
			"&home-id=" + this.homeId + "&client_mac=" + client_mac +
			"&purchase-id=" + "&Longlink=no";
		log(url);
		media.video.setPosition(this.size.left,this.size.top,this.size.width,this.size.height);
		media.AV.open(url, "VOD");
	};
	player.close = function(){
		SystemEventHandle.remove(this);
		media.AV.close();
	};
	player.getVodParams = function(callback){
		var _this = this;
		this.smartCardId = getSmartCardId();
		this.ServiceGroup = Math.floor(VOD.server.nodeGroupId);
		this.macAddress = network.ethernets[0].MACAddress;
		getVodParam(vod_API_Servlet + "?attribute=json_libs_oss_get_user_data&device_id=" + _this.smartCardId, function(homeIdInfo){
			var homeId = homeIdInfo.DataArea[0].tagAttribute.homeID;
			_this.homeId = homeId;
			getVodParam(vod_API_Servlet + "?attribute=ewf_json_ote_get_server_load_info&node_group=" + _this.ServiceGroup, function(serverLoad){
				var rtspAddr = "rtsp://" + serverLoad.DataArea.ListOfServerList[0].tagAttribute.IPAddress +
					":" + serverLoad.DataArea.ListOfServerList[0].tagAttribute.Port;
				_this.rtspAddr = rtspAddr;
				if(typeof callback == 'function'){
					callback();
				}
			});
		});
	};
	return player;
}

function getAndroidPlayer(){
	var player = {};
	player.type = 'Android';
	player.onSystemEvent = function(e){
		var code = e.which || e.keyCode;
		log(code);
		switch(code){
		case 13001: // url valid
			break;
		case 13002: // url invalid
			break;
		case 13003: // play ok
			break;
		case 13004: // play fail
			break;
		case 13015: // play ended
			this.replay();
			break;
		}
	};
	player.play = function(vod, size){
		var _this = this;
		SystemEventHandle.add(this);
		this.vod = vod;
		this.size = size;
		this.getVodParams(function(){
			_this.setup();
		});
	};
	player.replay = function(){
		if(this.mp != null){
			this.mp.stop();
			this.mp.unbindPlayerInstance(this.nativePlayerInstanceID);
		}
		this.setup();
	};
	player.setup = function(){
		log(this.playURL);
		this.mp = new MediaPlayer();
		this.nativePlayerInstanceID = this.mp.getPlayerInstanceID();
		this.mp.bindPlayerInstance(this.nativePlayerInstanceID);
		this.mp.setMediaSource(this.playURL);
		this.mp.setVideoDisplayMode(0);
		var rect = new Rectangle();
		rect.left = this.size.left;
		rect.top = this.size.top;
		rect.width = this.size.width;
		rect.height = this.size.height;
		this.mp.setVideoDisplayArea(rect);
		this.mp.refresh();
		this.mp.play();
	};
	player.close = function(){
		SystemEventHandle.remove(this);
		if(this.mp != null){
			this.mp.stop();
			this.mp.unbindPlayerInstance(this.nativePlayerInstanceID);
			this.mp = null;
		}
	};
	player.getVodParams = function(callback){
		var _this = this;
		getVodParam(vod_API_getPlayURL + '?assetID=' + this.vod.provider_asset_id +
			'&playType=1&providerID=' + this.vod.provider_id +
			'&resolution=1280*720&terminalType=7&version=V002', function(tmp){
				var retcode = tmp.ret;
				if(retcode != "0"){
					log(tmp.retInfo);
				}
				if(tmp.bitPlayUrlList && tmp.bitPlayUrlList.length > 0){
					var playURL = vod_getMaxVideoRateURL(tmp.bitPlayUrlList);
					_this.playURL = playURL;
					if(typeof callback == 'function'){
						callback();
					}
				} else {
					log('no play url.');
				}
		});
	};
	return player;
}

function getThinClientPlayer(){
	var player = {};
	player.type = 'ThinClient';
	player.play = function(vod, size){
		var _this = this;
		this.vod = vod;
		this.size = size;
		this.getVodParams(function(){
			_this.setup();
		});
	};
	player.replay = function(){
		this.setup();
	};
	player.setup = function(){
		var _this = this;
		log(this.playURL);
		var PlayParam = {
			"Top": this.size.top,
			"Left": this.size.left,
			"Width": this.size.width,
			"Height": this.size.height,
			"AutoPlay": false,
			"Url": this.playURL
		};
		function PlayStateChangeCallback(PlayState){
			log(PlayState);
			if(PlayState == "Stopped"){
				_this.close();
				_this.setup();
			}
		};
		var retInit = GHWEBAPI.WindowPlayer_Init(PlayParam, PlayStateChangeCallback);
		if(retInit.ResultCode == 0){
			var retPlay = GHWEBAPI.WindowPlayer_Play();
			if(retPlay.ResultCode == 0){

			} else {
				log(retPlay.Description);
			}
		} else {
			log(retInit.Description);
		}
	};
	player.close = function(){
		GHWEBAPI.WindowPlayer_Stop();
		GHWEBAPI.WindowPlayer_Uninit();
	};
	player.getVodParams = function(callback){
		var _this = this;
		getVodParam(vod_API_getPlayURL + '?assetID=' + this.vod.provider_asset_id +
			'&playType=1&providerID=' + this.vod.provider_id +
			'&resolution=1280*720&terminalType=7&version=V002', function(tmp){
				var retcode = tmp.ret;
				if(retcode != "0"){
					log(tmp.retInfo);
				}
				if(tmp.bitPlayUrlList && tmp.bitPlayUrlList.length > 0){
					var playURL = vod_getMaxVideoRateURL(tmp.bitPlayUrlList);
					_this.playURL = playURL;
					if(typeof callback == 'function'){
						callback();
					}
				} else {
					log('no play url.');
				}
		});
	};

	return player;
}

function getVodParam(url, callback){
	try{
		makeRequest({
			type: 'GET',
			url: url,
			done: function(text){
				var response;
				eval("response = " + text);
				if(typeof callback == 'function'){
					callback(response);
				}
			},
			fail: function(xhr){
				log(url + ', fail: ' + xhr.status);
				if(typeof callback == 'function'){
					callback(null);
				}
			}
		});

	}catch(e){
		log(e.message);
	}
}

function vod_getMaxVideoRateURL(urlArr) {
	var maxIndex = 0;
	var bitArr = [], tmpIndex, rate;
	for (var i = 0; i < urlArr.length; i++) {
		tmpIndex = urlArr[i].url.indexOf(".m3u8");
		rate = Number(urlArr[i].url.substring(tmpIndex - 4, tmpIndex).replace("_", ""));
		bitArr.push(rate);
		if (rate > bitArr[maxIndex]) {
			maxIndex = i;
		}
	}
	return urlArr[maxIndex].url;
}


var vod_API_Servlet = "http://172.16.188.76:80/stbservlet";
var vod_API_getPlayURL = "http://api.ott.yun.gehua.net.cn:8080/msis/getPlayURL";
