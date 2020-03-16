var App = {
	init: function(){
		log(navigator.userAgent);
		log(new Date().toString());
		var _this = this;
		this.storage = MyStorage.getStorage();
		this.storage.setNamespace('xor.kgqws.home');
		var search = location.search;
		log(search);
		setupPaaS(function(){
			log('paas ready.');
			FolderNav.init();
		});
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
		this.storage.setValue('page', '');
		this.storage.setValue('focus', '');


	},
	goPlayer: function(vod){
		//TODO play
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


function init(){
	setTimeout(function(){
		var smartCardId = getSmartCardId();
		if(!smartCardId){
			var $tip = $_id('auth_tip');
			$tip.style.visibility = 'visible';
		} else {
			App.init();
		}
	}, 50);
}

function doUninit(){
}

function doSystemEvent(e){
	return SystemEventHandle.onSystemEvent(e);
}

SystemEventHandle = {
	handles: [],
	add: function(obj){
		var index = this.handles.indexOf(obj);
		if(index == -1){
			this.handles.push(obj);
		}
	},
	remove: function(obj){
		var index = this.handles.indexOf(obj);
		if (index > -1) {
			this.handles.splice(index, 1);
		}
	},
	onSystemEvent: function(e){
		var ret = true;
		try{
			for (var i = 0, len = this.handles.length; i < len; i++) {
				var handle = this.handles[i];
				if (handle && (typeof handle.onSystemEvent === 'function')) {
					ret = ret && handle.onSystemEvent(e);
				}
			}
		}catch(err){
			log([err.name, err.message, err.lineNumber, err.fileName].join(', '));
		}
		return ret;
	}
};

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

	// if(window.CyberCloud){
		// if(window.cloudTimeout != null){
			// clearTimeout(window.cloudTimeout);
		// }
		// window.cloudTimeout = setTimeout(function(){
			// log('try exit cloud.');
			// try{
				// GHWEBAPI.ExitCloud();
			// }catch(e){
				// log(e.message);
			// }
		// }, 3 * 60 * 1000);
	// }
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

function isFocusing(obj){
	return MyFocus == obj;
}

document.onkeydown = grabEvent;
