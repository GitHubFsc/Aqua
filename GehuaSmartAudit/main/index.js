var App = {};

App.userData = null;

App.modules = {
	Developing: {
		isRequireModule: false,
		depends: [],
		exports: 'Developing',
		path: 'content/developing/developing',
	},
	Calendar: {
		isRequireModule: false,
		depends: [],
		exports: 'Calendar',
		path: 'uiWidget/newCalendar',
	},
	DatePicker: {
		isRequireModule: false,
		depends: ['Calendar'],
		exports: 'DatePicker',
		path: 'uiWidget/datePicker',
	},
	StyledList: {
		isRequireModule: false,
		depends: [],
		exports: 'StyledList',
		path: 'uiWidget/styledList',
	},
	CalendarVersionTwo: {
		isRequireModule: false,
		depends: [],
		exports: 'CalendarVersionTwo',
		path: 'uiWidget/calendar_version_two',
	},
	DatePickerVersionTwo: {
		isRequireModule: false,
		depends: ['CalendarVersionTwo'],
		exports: 'DatePickerVersionTwo',
		path: 'uiWidget/datepicker_version_two',
	},
	StyledListVersionTwo: {
		isRequireModule: false,
		depends: [],
		exports: 'NewStyledListVersionTwo',
		path: 'uiWidget/styledlist_version_two',
	},
	PopupDialog: {
		isRequireModule: false,
		depends: [],
		exports: 'PopupDialog',
		path: 'uiWidget/popupDialog',
	},
	OverlayDialog: {
		isRequireModule: false,
		depends: [],
		exports: 'OverlayDialog',
		path: 'uiWidget/overlayDialog',
	},
	StyledSelector: {
		isRequireModule: false,
		depends: [],
		exports: 'StyledSelector',
		path: 'uiWidget/styledSelector',
	},
	StyleableList: {
		isRequireModule: false,
		depends: [],
		exports: 'StyleableList',
		path: 'uiWidget/styleableList'
	},
	NanoScroller:{
		isRequireModule: false,
		depends: ['jquery'],
		exports: 'jQuery.fn.nanoScroller',
		path: 'js/lib/jquery.nanoscroller',
	},
	mCustomScrollbar:{
		isRequireModule: false,
		depends: ['jquery'],
		exports: 'mCustomScrollbar',
		path: 'js/lib/jquery.mCustomScrollbar.concat.min',
	},
	ScrollBarList:{
		isRequireModule: false,
		depends: [],
		exports: 'scrollBarList',
		path: 'uiWidget/scrollBarList',
	},
	AlarmCommonAPI:{
		isRequireModule: false,
		depends: [],
		exports: 'AlarmCommonAPI',
		path: 'content/warning_device/alarm_common_api',
	},
	JGrid: {
		isRequireModule: false,
		depends: [],
		exports: 'jgrid',
		path: 'js/lib/jgrid'
	},
	Alert: {
		isRequireModule: false,
		depends: [],
		exports: 'Alert',
		path: 'uiWidget/Alert'
	}, 	
	VideoPlayer: {
		isRequireModule: false,
		depends: ['jquery'],
		exports: 'VideoPlayer',
		path: 'uiWidget/VideoPlayer'
	},
	NewSelect: {
		isRequireModule: false,
		depends: ['jquery'],
		exports: 'NewSelect',
		path: 'uiWidget/newSelect'
	},
	PosterAudit: {
		isRequireModule: false,
		depends: ['jquery'],
		exports: 'PosterAudit',
		path: 'content/menuVideoAudit/poster_audit/poster_audit'
	},
	TextAudit: {
		isRequireModule: false,
		depends: ['jquery'],
		exports: 'TextAudit',
		path: 'content/menuVideoAudit/text_audit/text_audit'
	}
};

App.init = function(){
	loadI18n(function(){
		App.initPage();
	});
	var shimConf = {
	};
	var pathConf = {
	};
	for(var module in this.modules){
		if(this.modules.hasOwnProperty(module)){
			var moduleConf = this.modules[module];
			if(!moduleConf.isRequireModule){
				shimConf[module] = {
					deps: moduleConf.depends,
					exports: moduleConf.exports
				};;
				pathConf[module] = moduleConf.path;
			}
		}
	}
	require.config({
		waitSeconds: 0,
		paths: pathConf,
		shim: shimConf
	});
};

App.getAnotherId = (function(){
	var id = 0;
	return function(){
		id += 1;
		return id;
	}
}());

App.initPage = function() {
	my.paas.host = window.paasHost;
	my.paas.appKey = window.paasAppKey;
	my.paas.appSecret = window.paasAppSecret;
	if (sessionStorage.historyLen != window.history.length || sessionStorage.logged != '1') {
		this.showLoginPage();
	} else {
		this.userData = JSON.parse(sessionStorage.userData);
		my.paas.user_name = this.userData.user_name;
		my.paas.user_id = this.userData.user_id;
		my.paas.access_token = this.userData.access_token;
		my.paas.refresh_token = this.userData.refresh_token;
		my.aqua.accessKeyId = this.userData.accessKeyId;
		my.aqua.secretAccessKey = this.userData.secretAccessKey;
		this.showMainPage();
	}
};

App.showMainPage = function() {
	var self = this;
	var menu = this.getMenu();
	var mainPage = new MainPage(menu);
	jQuery(mainPage).on('logout', function() {
		self.logOut();
	});
	this.page = mainPage;
	if (window._paas_token_refresh_interval) {
		clearInterval(window._paas_token_refresh_interval);
	}
	window._paas_token_refresh_interval = setInterval(function() {
		refreshPaaSToken(my.paas.refresh_token, function(data) {
			my.paas.access_token = data.access_token;
			my.paas.refresh_token = data.refresh_token;
		});
	}, paasTokenRefreshInterval);
};

App.showLoginPage = function() {
	var self = this;
	var loginPage = new LoginPage();
	jQuery(loginPage).on('login', function() {
		self.logIn();
	});
	this.page = loginPage;
};

App.logIn = function() {
	this.userData = {
		user_name: my.paas.user_name,
		user_id: my.paas.user_id,
		access_token: my.paas.access_token,
		refresh_token: my.paas.refresh_token,
		accessKeyId: my.aqua.accessKeyId,
		secretAccessKey: my.aqua.secretAccessKey
	};
	sessionStorage.userData = JSON.stringify(this.userData);
	sessionStorage.logged = '1';
	sessionStorage.historyLen = window.history.length;
	this.showMainPage();
};

App.logOut = function() {
	this.userData = null;
	sessionStorage.userData = '';
	sessionStorage.logged = '0';
	this.showLoginPage();
};

App.getMenu = function() {
	var _this = this;
	//目录
	var videoAudit = {
		id: 'menu_video_audit',
		className: 'menu_video_audit',
		name: i18n('Menu_Video_Audit'),
		action: _this.navToVideoAudit
	}

	var menu = [
		videoAudit
	];

	_this.menuTrunk = {};

	menu.forEach(function(item){
		if(item.children != null){
			item.children.forEach(function(child){
				_this.menuTrunk[child.id]  = child;
			})
		} else {
			_this.menuTrunk[item.id] = item;
		}
	});

	_this.menuTrunk[videoAudit.id] = videoAudit;

	return menu;
};

//非当前推荐方法，仅做后续支持 2019-02-21
App.addTab = function(id, param){
	var menu = this.menuTrunk[id];
	this.page.addMenuInstance(menu, param);
};

App.newTab = function(id, param){
	var menu = this.menuTrunk[id];
	this.page.newMenu(menu, param);
};

App.showTab = function(id){
	var menu = this.menuTrunk[id];
	this.page.showMenu(menu);
};

App.navToVideoAudit = function (containerId) {
	require(['content/menuVideoAudit/index'], function(menuVideoAudit) {
		var menuVideoAudit_instance = new menuVideoAudit()
		menuVideoAudit_instance.init(containerId);
	})
}
App.navToDeveloping = function(containerId){
	require(['Developing'], function(Developing){
		var develop = new Developing();
		develop.init(containerId);
	});
};
