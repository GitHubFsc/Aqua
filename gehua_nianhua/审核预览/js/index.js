var AuditView = {
	init: function(){
		var _this = this;
		my.paas.directLogin(window.paasBossUser, function(){
			_this.setView();
		});
		setFocus(this);
	},
	focus: {
		row: 0,
		lmt: 2
	},
	setView: function(){
		var _this = this;
		_this.setVerView();
		_this.setAppView();
	},
	setVerView: function(){
		var _this = this;
		_this.getTreeVersions(function(vers){
			vers = vers.sort(function(a, b){
				return Number(b) - Number(a);
			})
			_this.versions = vers;
			_this.verCaro = new CaroNav({
				num: vers.length,
				loop: true
			});
			_this.changeVerChoice();
		});
	},
	getTreeVersions: function(callback){
		var url = my.paas.host + '/aquapaas/rest/navigation/trees?tree_name=' + window.AuditTree
			+ '&audit_status=first_audit:prepare_audit';
		my.paas.request({
			url: url,
			type: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			done: function(txt){
				try{
					var json = JSON.parse(txt);
					var versions = [];
					for(var i = 0, len = json.length; i < len; i+=1){
						var ver = json[i].metadata_public.version;
						if(ver != null){
							versions.push(ver);
						}
					}
					if(typeof callback == 'function'){
						callback(versions);
					}
				}catch(e){

				}
			}

		}, ['app']);
	},
	setAppView: function(){
		var _this = this;
		_this.appCaro = new CaroNav({
			num: AuditApps.length,
			loop: true
		});
		_this.changeAppChoice();
	},
	onKeyEvent: function(e){
		var key = e.which || e.keyCode;
		switch(key){
		case keyValue.up:
		case keyValue.UP:
			if(this.focus.row > 0){
				this.focus.row -= 1;
				this.changeRowFocus();
			}
			return false;
			break;
		case keyValue.down:
		case keyValue.DOWN:
			if(this.focus.row < this.focus.lmt){
				this.focus.row += 1;
				this.changeRowFocus();
			}
			break;
		case keyValue.left:
		case keyValue.LEFT:
			if(this.focus.row == 0){
				if(this.verCaro != null){
					this.verCaro.minus();
					this.changeVerChoice();
				}
			} else if(this.focus.row == 1){
				if(this.appCaro != null){
					this.appCaro.minus();
					this.changeAppChoice();
				}
			}
			return false;
			break;
		case keyValue.right:
		case keyValue.RIGHT:
			if(this.focus.row == 0){
				if(this.verCaro != null){
					this.verCaro.plus();
					this.changeVerChoice();
				}
			} else if(this.focus.row == 1){
				if(this.appCaro != null){
					this.appCaro.plus();
					this.changeAppChoice();
				}
			}
			return false;
			break;
		case keyValue.enter:
		case keyValue.ENTER:
			this.goAuditApp();
			return false;
			break;
		case keyValue.back:
		case keyValue.BACK:
		case keyValue.Back:
			App.back();
			return false;
			break;
		default:
			break;
		}
	},
	onFocusIn: function(){
		this.changeRowFocus();
	},
	onFocusOut: function(){

	},
	changeRowFocus: function(){
		var $pf = $_class('focus')[0];
		if($pf != null){
			$pf.classList.remove('focus');
		}
		if(this.focus.row <= 1){
			var $f = $_class('choice-row')[this.focus.row];
			$f.classList.add('focus');
		} else if(this.focus.row == 2){
			var $btn = $_class('btn-ok')[0];
			if($btn != null){
				$btn.classList.add('focus');
			}
		}
	},
	changeVerChoice: function(){
		var index = this.verCaro.focus.index;
		var ver = this.versions[index];
		var $c = $_id('ver-choice');
		if($c != null){
			$c.innerText = ver;
		}
	},
	changeAppChoice: function(){
		var index = this.appCaro.focus.index;
		var app = window.AuditApps[index];
		var $c = $_id('app-choice');
		if($c != null){
			$c.innerText = app.appname;
		}
	},
	goAuditApp: function(){
		try{
			var verIndex = this.verCaro && this.verCaro.focus.index;
			var ver = this.versions && this.versions[verIndex] || '';

			var appUrl = window.AuditApps[this.appCaro.focus.index].appurl;

			var link = appUrl;
			if(link.indexOf('?') > -1){
				link += '&tree_version=' + ver;
			} else {
				link += '?tree_version=' + ver;
			}
			location.href = link;
		}catch(e){
			log(e.message);
		}
	},
};
