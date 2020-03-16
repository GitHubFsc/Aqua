var MyStorage = (function(){
	var storage = {
		setNamespace: function(str){
			this.namespace = str;
		},
		setValue: function(name, value){
			if(this.namespace != null){
				name = this.namespace + '.' + name;
			}
			if(typeof this.setter == 'function'){
				this.setter(name, value);
				return true;
			} else {
				return false;
			}
		},
		getValue: function(name){
			if(this.namespace != null){
				name = this.namespace + '.' + name;
			}
			if(typeof this.getter == 'function'){
				return this.getter(name);
			}
			return false;
		},
		setter: null,
		getter: null,
	};

	var hasher = {
		setter: function(name, value){
			name = encodeURIComponent(name);
			value = encodeURIComponent(value);
			this.store[name] = value;
			this.toHash();
		},
		getter: function(name){
			name = encodeURIComponent(name);
			var value = this.store[name];
			if(typeof value == 'string'){
				return decodeURIComponent(value);
			}
		},
		store: {},
		toHash: function(){
			var vals = [];
			for(var prop in this.store){
				if(this.store.hasOwnProperty(prop)){
					var val = this.store[prop];
					val = val != null ? val : '';
					vals.push(prop + '=' + val);
				}
			}
			location.hash = vals.join('&');
		},
		fromHash: function(){
			this.store = {};
			hash = location.hash;
			if(hash != ''){
				hash = hash.slice(1);
				var vals = hash.split('&');
				for(var i = 0, len = vals.length; i < len; i+=1){
					var pair = vals[i];
					if(pair.indexOf('=') > -1){
						var arr = pair.split('=');
						var key = arr[0];
						if(key != null && key != ''){
							this.store[key] = arr[1];
						}
					}
				}
			}
		}
	}

	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		};
	}

	function setCookie(cname,cvalue,exdays){
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}


	function getCookie(cname){
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++){
			var c = ca[i].trim();
			if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}
		return "";
	}

	var cookie = {
		setCookieItem: function(name, value){
			setCookie(encodeURIComponent(name), encodeURIComponent(value), 5);
		},
		getCookieItem: function(name){
			return decodeURIComponent(getCookie(encodeURIComponent(name)));
		}
	};

	function Storage(option){
		option = option != null ? option : {};

		if(option.type == 'hash'){
			hasher.fromHash();
			this.setNamespace = function(str){
				this.namespace = null;
			};
			this.setter = function(name, value){
				hasher.setter(name, value);
			}
			this.getter = function(name){
				return hasher.getter(name);
			}
			this.type = 'hash';
			return this;
		}
		if(typeof iPanel != 'undefined'){
			this.setter = function(name, value){
				iPanel.setGlobalVar(name, value);
			};
			this.getter = function(name){
				return iPanel.getGlobalVar(name);
			}
			this.type = 'iPanel';
		} else if(typeof CyberCloud != 'undefined'){
			this.setter = function(name, value){
				cookie.setCookieItem(name, value);
			}
			this.getter = function(name){
				return cookie.getCookieItem(name);
			};
			this.type = 'thinClient';
		} else if(typeof DataAccess != 'undefined') {
			this.setNamespace = function(str){
				this.namespace = str;
				var id = DataAccess.getUserPropertyTable(this.namespace);
				if(id > 0){
					this.tableId = id;
				} else {
					id = DataAccess.createUserPropertyTable(this.namespace);
					if(id > 0){
						this.tableId = id;
					}
				}
			};
			this.setValue = function(name, value){
				if(this.tableId != null){
					var ret = DataAccess.setProperty(this.tableId, name, value);
					if(ret == -1){
						DataAccess.createItem(this.tableId, name, value);
					}
				}
			};
			this.getValue = function(name){
				if(this.tableId != null){
					return DataAccess.getProperty(this.tableId, name);
				}
			};
			this.type = 'dataAccess';
		} else if(typeof localStorage != 'undefined'){
			this.setter = function(name, value){
				localStorage.setItem(name, value);
			};
			this.getter = function(name){
				return localStorage.getItem(name);
			};
			this.type = 'localStorage';
		}
	}

	Storage.prototype = storage;

	return {
		getStorage: function(option){
			return new Storage(option);
		}
	};
})();
