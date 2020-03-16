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
    exports: 'jQuery.fn.mCustomScrollbar',
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

	var location = {
		id: 'menu_location',
		className: 'menu_location',
		name: i18n('Menu_Location'),
		action: _this.navToLocation
	};
	var runningStatistic = {
		id: 'menu_running_statistic',
		name: i18n('Menu_Running_Statistic'),
		action: _this.navToRunningStatistic,
		hidden: true
	};
	var deviceHistory = {
		id: 'menu_device_history',
		name: i18n('Menu_Device_History'),
		action: _this.navToDeviceHistory
	};
	var basisRegion = {
		id: 'menu_basis_region',
		name: i18n('Menu_Basis_Region'),
		action: _this.navToBasisRegion
	};
	var basisDevice = {
		id: 'menu_basis_device',
		name: i18n('Menu_Basis_Device'),
		action: _this.navToBasisDevice
	};
	var basisProducer = {
		id: 'menu_basis_producer',
		name: i18n('Menu_Basis_Producer'),
		action: _this.navToBasisProducer
	};
	var basisModel = {
		id: 'menu_basis_model',
		name: i18n('Menu_Basis_Model'),
		action: _this.navToBasisModel
	};
	var deviceDTU = {
		id: 'menu_device_dtu',
		name: i18n('Menu_Device_DTU'),
		action: _this.navToDeviceDTU
	};
	var deviceHeatPump = {
		id: 'menu_device_heatpump',
		name: i18n('Menu_Device_HeatPump'),
		action: _this.navToHeatPump
	};
	var warningDevice = {
		id: 'menu_warning_device',
		name: i18n('Menu_Warning_Device'),
		action: _this.navToWarningDevice
	};
	var warningDTU = {
		id: 'menu_warning_dtu',
		name: i18n('Menu_Warning_DTU'),
		action: _this.navToWarningDTU
	};
	var userAdmin = {
		id: 'menu_user_admin',
		className: 'menu_users',
		name: i18n('Menu_User_Admin'),
		action: _this.navToUserAdmin
	};

	var viewDeviceHistory = {
		id: 'menu_view_device_history',
		name: i18n('Menu_View_Device_History'),
		action: _this.navToViewDeviceHistory
	}

	var menu = [
		{
			id: 'menu_home',
			name: i18n('Menu_Home'),
			className: 'menu_home',
			action: _this.navToMenuHome
		},
		location,
		{
			id: 'menu_running',
			name: i18n('Menu_Running'),
			className: 'menu_runs',
			children: [runningStatistic, deviceHistory]
		},
		{
			id: 'menu_basis',
			className: 'menu_basis',
			name: i18n('Menu_Basis'),
			children: [basisRegion, basisDevice, basisProducer, basisModel]
		},
		{
			id: 'menu_device',
			className: 'menu_device',
			name: i18n('Menu_Device'),
			children: [deviceDTU, deviceHeatPump]
		},
		{
			id: 'menu_warning',
			className: 'menu_warning',
			name: i18n('Menu_Warning'),
			children: [warningDevice, warningDTU]
		},
		{
			id: 'menu_ticket',
			className: 'menu_ticket',
			name: i18n('Menu_Ticket'),
			hidden: true
		},
		{
			id: 'menu_log',
			className: 'menu_log',
			name: i18n('Menu_Log'),
			hidden: true
		},
		userAdmin
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

	_this.menuTrunk[viewDeviceHistory.id] = viewDeviceHistory;

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

App.navToDeveloping = function(containerId){
	require(['Developing'], function(Developing){
		var develop = new Developing();
		develop.init(containerId);
	});
};

App.navToMenuHome = function(containerId){
	require(['content/menuHome/index'], function(menuHome){
		var menuHome_instance = new menuHome();
    menuHome_instance.init(containerId);
	});
};

App.navToDevTest = function(containerId, newParam){
	require(['content/devTest/devTest'], function(DevTest){
		var devTest = new DevTest();
		devTest.init(containerId, newParam);
	});
};

App.navToHeatPump = function(containerId){
	require(['content/device/heatpump/HeatPump'], function(HeatPump){
		var heatPump = new HeatPump();
		heatPump.init(containerId);
	});
};

App.navToWarningDevice = function(containerId, param){
	require(['content/warning_device/warning_device'], function(warningDevice){
		var warningDevice = new warningDevice();
		warningDevice.init(containerId, param);
	});
};

App.navToWarningDTU = function(containerId, param){
	require(['content/warning_DTU/warning_DTU'], function(navToWarningDTU){
		var navToWarningDTU = new navToWarningDTU();
		navToWarningDTU.init(containerId, param);
	});
};
App.navToDeviceDTU = function(containerId, param){
	require(['content/device/dtu/index'], function(DeviceDTU){
		var deviceDtu = new DeviceDTU();
		deviceDtu.init(containerId, param);
	})
}

App.navToRunningStatistic = function(containerId){
  require(['content/running/runningStatistic/index'], function(runningStatistic){
  	var runningStatistic_instance = new runningStatistic();
    runningStatistic_instance.init(containerId);
  });
};
App.navToDeviceHistory = function(containerId){
  require(['content/running/deviceHistory/index'], function(deviceHistory){
  	var deviceHistory_instance = new deviceHistory();
    deviceHistory_instance.init(containerId);
  });
};
App.navToBasisRegion= function(containerId){
  require(['content/basic/regionManage/index'], function(Region){
  	var region_instance = new Region();
    region_instance.init(containerId);
  });
};
App.navToBasisDevice= function(containerId){
  require(['content/basic/deviceType/index'], function(deviceType){
    var deviceType_instance = new deviceType();
    deviceType_instance.init(containerId);
  });
};
App.navToUserAdmin = function(containerId){
	require(['content/user_admin/user_admin'], function(navToUserAdmin){
		var navToUserAdmin = new navToUserAdmin();
		navToUserAdmin.init(containerId);
	});
};
App.navToLocation = function(containerId){
	require(['content/location/location'], function(navToLocation){
		var navToLocation = new navToLocation();
		navToLocation.init(containerId);
	});
};

App.navToViewDeviceHistory = function(containerId, param){
	require(['content/device/history/viewhistory.js'], function(ViewHistory){
		var viewHistory = new ViewHistory();
		viewHistory.init(containerId, param);
	});
};

App.navToBasisModel = function(containerId){
	require(['content/models/models'], function(BasisModel){
		var basisModel = new BasisModel();
		basisModel.init(containerId);
	});
};

App.navToBasisProducer = function(containerId) {
	require(['content/basic/producer/index'], function(Dialog){
		var dialog = new Dialog();
		dialog.init(containerId);
	})
}
