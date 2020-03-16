var navigate = new Object();
navigate.aquaLogin = function() {
    var loginAquaUserName = LOGIN_AQUA_USERNAME;
    var loginAquaPassword = LOGIN_AQUA_PWD;
    var loginAquaDomain = LOGIN_AQUA_DOMAIN_URI;
    //登录
    var base64Encode = my.base64Encode;
    var authStrToEncode = loginAquaUserName + ':' + loginAquaPassword;
    var secretAccessKey = null;
    var accessKeyId = null;
    //验证
    if (!loginAquaUserName || !loginAquaPassword || !loginAquaDomain) {
        alert("用户名或密码不正确！");
        return;
    };
    //登陆
    jQuery.ajax({
        type: 'GET',
        // url: '/rest/dojo/organization/users/login/' + loginAquaUserName,
        url: aqua_host + '/aqua/rest/cdmi/cdmi_users/' + loginAquaUserName,
        async: false,
        dataType: 'json',
        headers: {
            'Accept': 'application/cdmi-user',
            'Authorization': 'Basic ' + base64Encode(authStrToEncode),
            'x-aqua-user-domain-uri': loginAquaDomain,
            'X-CDMI-Specification-Version': '1.0.2'
        },
        contentType: 'application/json'
    }).done(function(data) {
        my.aqua.secretAccessKey = data.secretAccessKey;
        my.aqua.accessKeyId = data.objectID;
    });
};
navigate.initIndex = function() {

    if (window.location.search.length > 0) {
        var search = window.location.search;
        var parameters = my.base64Decode(search.replace("?", "")).split(";");
        if (parameters.length == 2) {
            my.aqua.accessKeyId = parameters[0];
            my.aqua.secretAccessKey = parameters[1];
        } else {
            navigate.aquaLogin();
        };
    } else {
        navigate.aquaLogin();
    };
    navigate.initFrame();
    PanelMenu.init();
};

/**
 * 初始化框架样式
 */
navigate.initFrame = function() {
    //设置页面右上角用户名称和用户角色
    // jQuery("#user_name").text("测试用户").attr("title","测试用户");
    // jQuery("#user_role").text("管理员");
	jQuery("#menu_top").empty();
	var demandRecordStr = '<div id="m_20" style="display:block" class="demand_record_out" onclick="navigate.toDemandRecord(this);"></div>'; //点播记录

	var realTimeAnalysis = '<div id="realtime_analysis" style="display:block" class="realtime_analysis_out" onclick="navigate.toRealtimeAnalysis(this);"></div>'; //实时收看行为分析

	var $menuTop = jQuery("#menu_top");
	$menuTop.append(demandRecordStr);
	if(typeof REALTIME_ANALYSIS_HIDDEN == 'undefined' || !REALTIME_ANALYSIS_HIDDEN){
	   $menuTop.append(realTimeAnalysis);
	}
};


/**
 *导航到点播记录
 */
navigate.toDemandRecord = function(container, obj, callback) {
    if (this.isStudent) return;
    if (this.curModule) {
        this.curModule.className = this.curModule.className.replace("focus", "out");
    }
    obj.className = "demand_record_focus"; //"meeting_focus";
    this.curModule = obj;
    navigate.changeV(obj);
    var jses = [{
        "name": "demandRecord.js",
        "removable": true
    }];
    includePage(container, "content/demandRecord", "", jses, callback);
};
/**
 *导航到实时收看行为分析
 */
navigate.toRealtimeAnalysis = function(container, obj, callback){
	if(this.curModule){
		this.curModule.className = this.curModule.className.replace('focus', 'out');
	}
	obj.className = 'realtime_analysis_focus';
	this.curModule = obj;
	navigate.changeV(obj);
	var jses = window.JS.loadDependence([{
	        module: 'auAnalysis.ChannelPicker',
	        path: 'channelPicker.js'
	    }, {
			module: 'auAnalysis.realtimeAnalysis',
			path: 'realtimeAnalysis.js',
		}]);
	jses.push({name: 'rlAninit.js', removable: true});

	includePage(container, 'content/realtimeAnalysis', 'analysis_framework.html', jses, callback);
};

navigate.toDeveloping = function(container){
	var jses = [];
	includePage(container, 'content/developing', 'developing.html', jses);
};

navigate.toUserAdmin = function(container){
	var jses = [
		{name: '../../uiWidget/styledList.js', removable: true},
		{name: '../../uiWidget/noPagiList.js', removable: true},
		{name: '../../uiWidget/popupDialog.js', removable: true},
		{name: '../../uiWidget/overlayDialog.js', removable: true},
		{name: '../../uiWidget/styledSelector.js', removable: true},
		{name: '../../uiWidget/styledFlowList.js', removable: true},
    {name: 'packageCalendar.js', removable: true},
    {name: 'index.js', removable: true}
	];
	includePage(container, 'content/userAdmin', 'index.html', jses);
};

navigate.toUserGroupAdmin = function(container){
  var jses = [
    {name: '../../uiWidget/styledList.js', removable: true},
    {name: '../../uiWidget/popupDialog.js', removable: true},
    {name: '../../uiWidget/overlayDialog.js', removable: true},
    {name: 'index.js', removable: true}
  ];
  includePage(container, 'content/userGroupAdmin', 'index.html', jses);
};

navigate.toUserTag = function(container){
  var jses = [
    {name: '../../uiWidget/styledList.js', removable: true},
    {name: '../../uiWidget/popupDialog.js', removable: true},
    {name: '../../uiWidget/overlayDialog.js', removable: true},
    {name: 'index.js', removable: true}
  ];
  includePage(container, 'content/userTag', 'index.html', jses);
};

navigate.toAppAdmin = function(container){
	var jses = [
    {name:'styledList.js', removable:true},
    {name:'appAdmin.js', removable:true},
    {name: "../../uiWidget/newSelect.js", "removable": true}
  ];
	includePage(container, 'content/appAdmin', 'appAdmin.html', jses);
};

navigate.toLectureTicket = function(container, callback){
  var jses = [
    {name: '../../js/lib/popper.js', removable: true},
    {name: '../../uiWidget/styledList.js', removable: true},
    {name: "../../uiWidget/popupDialog.js","removable":true},
    {name: '../../uiWidget/overlayDialog.js', removable: true},
    {name: 'aquaUtil.js', removable: true},
    {"name":"newCalendar.js","removable":true},
    {"name":"newSelect.js","removable":true},
    {"name":"aqua.js","removable":true},
    {name:'lecture_ticket.js', removable:true},
  ];
  includePage(container, 'content/ticket', 'lecture_ticket.html', jses, callback);
};

navigate.toHeatStats = function(container){
	var jses = [{name: '../../uiWidget/styledList.js', removable: true},
		{name: '../../uiWidget/newCalendar.js', removable: true},
		{name: '../../uiWidget/datePicker.js', removable: true},
		{name: 'heatStats.js', removable: true}];
	includePage(container, 'content/heatStats', 'heat_stats.html', jses);
};

navigate.toProductPkg = function(container, callback){
	var jses = [{name: '../../uiWidget/styledList.js', removable: true},
		{name: "../../uiWidget/newSelect.js", "removable": true},
		{name: 'newCalendar.js', removable: true},
		{name: "productpackage.js", removable: true}];
	includePage(container, 'content/productPackage', 'productPackageManage.html', jses, callback);
};

navigate.toSupervisor = function(container, callback){
  	var jses = [
      {name: "index.js", removable: true},
      {name: "modules/pane.js", removable: true},
      {name: "modules/block.js", removable: true},
      {name: "modules/set.js", removable: true},
      {name: "modules/echarts.common.min.js", removable: true},
      {name: "live/live.js", removable: true},
      {name: '../../js/echarts.min.js',removable: true},
      {name: '../../content/history_records/newCalendar.js',removable: true},
      {name: '../../content/history_records/index.js',removable: true}
    ];
  	includePage(container, 'content/supervisor', 'index.html', jses, callback);
}
/**
 * 鉴权管理-单人查询
 * @method
 * @param  {Function} callback 页面内部的回调函数
 * @return {[type]}            [description]
 */
navigate.toAutheSingle = function(container, callback){
  	var jses = [
      {name: "../../../../uiWidget/styledList.js", removable: true},
      {name: "../../../../uiWidget/styledSelector.js", removable: true},
      {name: "dialog.js", removable: true},
      {name: "detail_dialog.js", removable: true},
      {name: "index.js", removable: true}
    ];
  	includePage(container, 'content/authmng/authentication/single', 'index.html', jses, callback);
}
/**
 * 鉴权管理-多查询
 * @method
 * @param  {Function} callback 页面内部的回调函数
 * @return {[type]}            [description]
 */
navigate.toAutheBatch = function(container, callback){
  	var jses = [
      {name: "../../../../uiWidget/styledList.js", removable: true},
      {name: "../../../../uiWidget/styledSelector.js", removable: true},
      {name: "../../../../uiWidget/newCalendar.js", "removable": true},
      {name: "dialog.js", removable: true},
      {name: "detail_dialog.js", removable: true},
      {name: "index.js", removable: true}
    ];
  	includePage(container, 'content/authmng/authentication/batch', 'index.html', jses, callback);
}
/**
 * 鉴权管理-多查询
 * @method
 * @param  {Function} callback 页面内部的回调函数
 * @return {[type]}            [description]
 */
navigate.toAutheInfo = function(container, callback){
  	var jses = [
      {name: "../../../../uiWidget/styledList.js", removable: true},
      {name: "../../../../uiWidget/styledSelector.js", removable: true},
      {name: "../../../../uiWidget/newCalendar.js", "removable": true},
      {name: "dialog.js", removable: true},
      {name: "detail_dialog.js", removable: true},
      {name: "index.js", removable: true}
    ];
  	includePage(container, 'content/authmng/authentication/info', 'index.html', jses, callback);
}
/**
 * 授权管理-单人查询
 * @method
 * @param  {Function} callback 页面内部的回调函数
 * @return {[type]}            [description]
 */
navigate.toAuthoSingle = function(container, callback){
  	var jses = [
      {name: "../../../../uiWidget/styledList.js", removable: true},
      {name: "../../../../uiWidget/styledSelector.js", removable: true},
      {name: "../../../../uiWidget/newCalendar.js", "removable": true},
      {name: "dialog.js", removable: true},
      {name: "detail_dialog.js", removable: true},
      {name: "index.js", removable: true}
    ];
  	includePage(container, 'content/authmng/authorization/single', 'index.html', jses, callback);
}
/**
 * 鉴权管理-多查询
 * @method
 * @param  {Function} callback 页面内部的回调函数
 * @return {[type]}            [description]
 */
navigate.toAuthoBatch = function(container, callback){
  	var jses = [
      {name: "../../../../uiWidget/styledList.js", removable: true},
      {name: "../../../../uiWidget/styledSelector.js", removable: true},
      {name: "../../../../uiWidget/newCalendar.js", "removable": true},
      {name: "dialog.js", removable: true},
      {name: "detail_dialog.js", removable: true},
      {name: "index.js", removable: true}
    ];
  	includePage(container, 'content/authmng/authorization/batch', 'index.html', jses, callback);
}
/**
 * 鉴权管理-多查询
 * @method
 * @param  {Function} callback 页面内部的回调函数
 * @return {[type]}            [description]
 */
navigate.toAuthoInfo = function(container, callback){
  	var jses = [
      {name: "../../../../uiWidget/styledList.js", removable: true},
      {name: "../../../../uiWidget/styledSelector.js", removable: true},
      {name: "../../../../uiWidget/newCalendar.js", "removable": true},
      {name: "dialog.js", removable: true},
      {name: "detail_dialog.js", removable: true},
      {name: "index.js", removable: true}
    ];
  	includePage(container, 'content/authmng/authorization/info', 'index.html', jses, callback);
}
/**
 * 取消授权请求-单人查询
 */
navigate.toCancelAuthoSingle = function(container, callback){
  var jses = [
    {name: "../../../../uiWidget/styledList.js", removable: true},
    {name: "../../../../uiWidget/styledSelector.js", removable: true},
    {name: "../../../../uiWidget/newCalendar.js", "removable": true},
    {name: "dialog.js", removable: true},
    {name: "detail_dialog.js", removable: true},
    {name: "index.js", removable: true}
  ];
  includePage(container, 'content/authmng/cancelAuthorization/single', 'index.html', jses, callback);
}
/**
 * 取消授权请求-多人查询
 */
navigate.toCancelAuthoBatch = function(container, callback){
  var jses = [
    {name: "../../../../uiWidget/styledList.js", removable: true},
    {name: "../../../../uiWidget/styledSelector.js", removable: true},
    {name: "../../../../uiWidget/newCalendar.js", "removable": true},
    {name: "dialog.js", removable: true},
    {name: "detail_dialog.js", removable: true},
    {name: "index.js", removable: true}
  ];
  includePage(container, 'content/authmng/cancelAuthorization/batch', 'index.html', jses, callback);
}

navigate.toAuthStats = function(container, callback){
	var jses = [
		{name: '../../../uiWidget/newCalendar.js', removable: true},
		{name: '../../../uiWidget/datePicker.js', removable: true},
		{name: '../../../js/echarts.min.js', removable: true},
		{name: 'index.js', removable: true}
	];
	includePage(container, 'content/authmng/authStats', 'index.html', jses, callback);
};

/**
 * 导航-产品管理-营销策略
 */
navigate.toProductOffering = function(container, callback){
  var jses = [
  {"name":"../../uiWidget/newCalendar.js","removable":true},
  {"name":"../../uiWidget/datePicker.js","removable":true},
  {"name":"../../uiWidget/styledSelector.js","removable":true},
  {"name":"../../uiWidget/newSelect.js","removable":true},
  {"name":"../../uiWidget/popupDialog.js","removable":true},
  {"name":"../../uiWidget/styledList.js","removable":true},
  {"name":"editor.js","removable":true},
  {"name":"index.js","removable":true}];
  includePage(container, 'content/productOffering', 'index.html', jses, callback);
}
/**
 * 导航-资产管理-资产-资产管理
 */
navigate.toAsset = function(container, callback) {
  var jses = [
  {"name":"../../../js/lib/jquery.ztree.all.min.js","removable":true},
  {"name":"../../../uiWidget/alert_dialog.js","removable":true},
  {"name":"../../../uiWidget/newCalendar.js","removable":true},
  {"name":"../../../uiWidget/datePicker.js","removable":true},
  {"name":"../../../uiWidget/newSelect.js","removable":true},
  {"name":"../../../uiWidget/popupDialog.js","removable":true},
  {"name":"../../../uiWidget/styledList.js","removable":true},
  {"name":"../../../uiWidget/styledSwitcher.js","removable":true},
  {"name":"../../../uiWidget/styledFlowList.js","removable":true},
  {"name":"../../../uiWidget/loading.js","removable":true},
  {"name":"asset.js","removable":true},
	{"name":"../assetTagLib/styledFlowList_new.js","removable":true},
	{"name":"../assetTagLib/commonDialog_setTagForProduct.js","removable":true},
	{"name":"../assetTagLib/assetTag.js","removable":true},
	{"name":"asset/index.js","removable":true},
	{"name":"asset/add_asset.js","removable":true},
	{"name":"asset/time_picker.js","removable":true},
	{"name":"asset/auto_match.js","removable":true},
	{"name":"asset/policy_edit.js","removable":true},
  {"name":"asset/manual_match.js","removable":true},
  {"name":"content.js","removable":true},
  {"name":"index.js","removable":true}
	];
  includePage(container, 'content/asset/manage', 'index.html', jses, callback);
}
/**
 * 导航-资产管理-资产-上下架
 */
navigate.toAssetShelf = function(container, callback){
  var jses = [
  {"name":"../../../uiWidget/newCalendar.js","removable":true},
  {"name":"../../../uiWidget/datePicker.js","removable":true},
  {"name":"../../../uiWidget/styledSelector.js","removable":true},
  {"name":"../../../uiWidget/newSelect.js","removable":true},
  {"name":"../../../uiWidget/popupDialog.js","removable":true},
  {"name":"../../../uiWidget/styledList.js","removable":true},
  {"name":"index.js","removable":true}];
  includePage(container, 'content/asset/shelf', 'index.html', jses, callback);
}
/**
 * 导航-资产管理-资产-节目删除
 */
navigate.toAssetDel = function(container, callback) {
  var jses = [
  {"name":"../../../uiWidget/alert_dialog.js","removable":true},
  {"name":"../../../uiWidget/popupDialog.js","removable":true},
  {"name":"../../../uiWidget/styledList.js","removable":true},
  {"name":"index.js","removable":true}];
  includePage(container, 'content/asset/del', 'index.html', jses, callback);
}
navigate.setTagByTag = function(container, callback){
  var jses = [
  {"name":"../../../uiWidget/popupDialog.js","removable":true},
	{"name":"styledFlowList_new.js","removable":true},
	{"name":"styledList_assetTagLib_new.js","removable":true},
	{"name":"commonDialog_setTagForProduct.js","removable":true},
  {"name":"setAssetTagByTag.js","removable":true}];
  includePage(container, 'content/asset/assetTagLib', 'setAssetTagByTag.html', jses, callback);
}
/**
 * 导航-资产管理-资产-元数据定义
 */
navigate.toAssetMeta = function(container, callback){
  var jses = [
  {"name":"../../../uiWidget/alert_dialog.js","removable":true},
  {"name":"../../../uiWidget/newCalendar.js","removable":true},
  {"name":"../../../uiWidget/datePicker.js","removable":true},
  {"name":"../../../uiWidget/styledSelector.js","removable":true},
  {"name":"../../../uiWidget/newSelect.js","removable":true},
  {"name":"../../../uiWidget/popupDialog.js","removable":true},
  {"name":"../../../uiWidget/styledList.js","removable":true},
  {"name":"meta.js","removable":true},
  {"name":"index.js","removable":true}];
  includePage(container, 'content/asset/meta', 'index.html', jses, callback);
}

navigate.toAssetImport = function(container, callback) {
  var jses = [
		{"name": '../../uiWidget/styledList.js', "removable": true},
		{"name": '../../uiWidget/overlayDialog.js',"removable":true},
	  {"name":"datePicker.js", "removable": true},
		{"name":"styledSelector.js","removable":true},
		{"name":"index.js","removable":true}
	];
  includePage(container, 'content/asset_import', 'index.html', jses, callback);
}

navigate.toAssetTagLib = function(container, callback){
	 var jses = [
	{"name":"../../../uiWidget/popupDialog.js","removable":true},
  {"name":"styledList_assetTagLib.js","removable":true},
  {"name":"assetTagLib.js","removable":true}];
  includePage(container, 'content/asset/assetTagLib', 'assetTagLib.html', jses, callback);
}

/**
 * 运营分析
 */
navigate.toOperateDaySum = function(container, callback){
	var jses = [
	{name: '../../js/echarts.min.js',removable: true},
	{name: '../../uiWidget/indexChecker.js', removable: true},
	{name: '../../uiWidget/styledSelector.js', removable: true},
	{name: 'daySum.js', removable: true}];
	includePage(container, 'content/operateDaySum', 'day-sum.html', jses, callback);
};

navigate.toOASumDay = function(container, callback){
	var jses = [
	{name: '../../../js/echarts.min.js',removable: true},
	{name: '../../../uiWidget/newCalendar.js', removable: true},
	{name: '../../../uiWidget/datePicker.js', removable: true},
	{name: 'sumDay.js', removable: true}];
	includePage(container, 'content/oaIndex/sumDay', 'sum-day.html', jses, callback);
};

navigate.toOATrendHour = function(container, callback){
	var jses = [
	{name: '../../../js/echarts.min.js',removable: true},
	{name: '../../../uiWidget/newCalendar.js', removable: true},
	{name: '../../../uiWidget/datePicker.js', removable: true},
	{name: '../../../uiWidget/indexChecker.js', removable: true},
	{name: '../../../uiWidget/styledSelector.js', removable: true},
	{name: 'trendHour.js', removable: true}];
	includePage(container, 'content/oaIndex/trendHour', 'trend-hour.html', jses, callback);
};

navigate.toOATrendDay = function(container, callback){
	var jses = [
	{name: '../../../js/echarts.min.js',removable: true},
	{name: '../../../uiWidget/newCalendar.js', removable: true},
	{name: '../../../uiWidget/datePicker.js', removable: true},
	{name: '../../../uiWidget/indexChecker.js', removable: true},
	{name: '../../../uiWidget/styledSelector.js', removable: true},
	{name: 'trendDay.js', removable: true}];
	includePage(container, 'content/oaIndex/trendDay', 'trend-day.html', jses, callback);
};

navigate.toOATrendWeek = function(container, callback){
	var jses = [
	{name: '../../../js/echarts.min.js',removable: true},
	{name: '../../../uiWidget/newCalendar.js', removable: true},
	{name: '../../../uiWidget/datePicker.js', removable: true},
	{name: '../../../uiWidget/indexChecker.js', removable: true},
	{name: '../../../uiWidget/styledSelector.js', removable: true},
	{name: 'trendWeek.js', removable: true}];
	includePage(container, 'content/oaIndex/trendWeek', 'trend-week.html', jses, callback);
};

navigate.toOATrendMonth = function(container, callback){
	var jses = [
	{name: '../../../js/echarts.min.js',removable: true},
	{name: '../../../uiWidget/newCalendar.js', removable: true},
	{name: '../../../uiWidget/datePicker.js', removable: true},
	{name: '../../../uiWidget/indexChecker.js', removable: true},
	{name: '../../../uiWidget/styledSelector.js', removable: true},
	{name: 'trendMonth.js', removable: true}];
	includePage(container, 'content/oaIndex/trendMonth', 'trend-month.html', jses, callback);
};

navigate.toDistributionAnalysis = function(container, callback){
    var jses = [
		{"name": "../../uiWidget/indexChecker.js", "removable": true},
		{"name":"../../js/echarts.min.js","removable":true},
		{"name":"../../uiWidget/newCalendar.js","removable":true},
		{"name":"datePicker_new.js","removable":true},
		{"name":"common.js","removable":true},
	  {"name":"../../uiWidget/popupDialog.js","removable":true},
    {name: '../../js/lib/popper.js', removable: true},
    {"name": '../ticket/newSelect.js', removable: true},
    {"name": '../../uiWidget/scrollBarList.js', removable: true},
    {"name": '../trendAnalysis/lib.js', removable: true},
		{"name":"distributionAnalysis_popup.js","removable":true},
		{"name":"distributionAnalysis.js","removable":true}];
    includePage(container,"content/distributionAnalysis","distributionAnalysis.html",jses);
};

navigate.toTrendAnalysis = function(container, callback){
	 var jses = [
     {name: '../../js/lib/jquery.nanoscroller.js', removable: true},
     {name: '../../uiWidget/newCalendar.js', removable: true},
     {name: '../../uiWidget/datePicker.js', removable: true},
     {name: "../../uiWidget/popupDialog.js","removable":true},
     {name: '../../uiWidget/scrollBarList.js', removable: true},
     {name: '../../uiWidget/indexChecker.js', removable: true},
     {name:"../../js/echarts.min.js","removable":true},
     {name: '../../js/lib/popper.js', removable: true},
     {name: '../ticket/newSelect.js',removable: true},
     {name: 'lib.js', removable: true},
     {name: 'index.js', removable: true}];
  includePage(container, 'content/trendAnalysis', 'index.html', jses, callback);
};

navigate.toUserAction = function(container, callback){
	 var jses = [
     {name: '../../js/lib/jquery.nanoscroller.js', removable: true},
     {name: '../../uiWidget/newCalendar.js', removable: true},
     {name: '../../uiWidget/datePicker.js', removable: true},
     {name: "../../uiWidget/popupDialog.js","removable":true},
     {name: '../../uiWidget/scrollBarList.js', removable: true},
     {name: '../../uiWidget/indexChecker.js', removable: true},
     {name:"../../js/echarts.min.js","removable":true},
     {name: '../../js/lib/popper.js', removable: true},
     {name: '../ticket/newSelect.js',removable: true},
     {name: 'lib.js', removable: true},
     {name: 'index.js', removable: true}];
  includePage(container, 'content/userAction', 'index.html', jses, callback);
};

navigate.toJobManage = function(container, callback){
	 var jses = [
     {name: '../../uiWidget/newCalendar.js', removable: true},
     {name: '../../uiWidget/datePicker.js', removable: true},
     {name: "../../uiWidget/popupDialog.js","removable":true},
     {name: '../../uiWidget/scrollBarList.js', removable: true},
     {name: '../../uiWidget/overlayDialog.js', removable: true},
     {name: '../../uiWidget/indexChecker.js', removable: true},
     {name: '../../js/lib/popper.js', removable: true},
     {name: '../ticket/newSelect.js',removable: true},
     {name: 'index.js', removable: true}];
  includePage(container, 'content/jobManage', 'index.html', jses, callback);
};

/**
 * 注销用户
 */
navigate.logout = function() {
    //清空本地缓存
	location.reload(true);
	if(navigate.session){
		localStorage[navigate.session.userName + '_webpanel_UserInOrganization'] = null;
	}
    sessionStorage.webpanelLogin = 0;
    //返回登录页面
    //window.location.href = "http://" + window.location.host + "/" + window.location.pathname.split("/")[1] + "/index.html";
	jQuery("#part1").css("display","block");
	jQuery("#part2").css("display","none");
	jQuery("#pwd").val("");
};
/**
 * 编排管理
 */
navigate.toNavMng = function(container, callback){
  var jses = [
  {"name":"../../uiWidget/alert_dialog.js","removable":true},
  {"name":"../ticket/aquaUtil.js","removable":true},
  {"name": "../../uiWidget/popupDialog.js", "removable": true},
  {"name": "../../uiWidget/overlayDialog.js", "removable": true},
  {"name": "../../uiWidget/styledList.js", "removable": true},
  {"name":"../../js/lib/jquery.ztree.all.min.js","removable":true},
  {"name": "../../uiWidget/ueditor/ueditor.config.js", "removable": true},
  {"name": "../../uiWidget/ueditor/ueditor.all.js", "removable": true},
  {"name":"../../uiWidget/newSelect.js","removable":true},
  {"name": "input_combo.js", "removable": true},
  {"name": "../../js/UploadModule.js", "removable": true},
  {"name": "metauploader.js", "removable": true},
  {"name": "meta.js", "removable": true},
  {"name": "create_tree.js", "removable": true},
  {"name": "node_attr.js", "removable": true},
  {"name": "node_file_attr.js", "removable": true},
  {"name": "node_bundle.js", "removable": true},
  {"name": "node_search.js", "removable": true},
  {"name": "node_folder.js", "removable": true},
  {"name": "node_version.js", "removable": true},
  {"name": "node_audit.js", "removable": true},
  {"name": "node_his.js", "removable": true},
  {"name": "create_folder.js", "removable": true},
  {"name": "adjust_index.js", "removable": true},
  {"name": "add_asset.js", "removable": true},
  {"name": "asset_edit.js", "removable": true},
  {"name": "tree_editor.js", "removable": true},
  {"name": "audit_frame.js", "removable": true},
  {"name": "index.js", "removable": true}];
  includePage(container, 'content/navigation', 'index.html', jses, callback);
}
/**
 * 编排审核入口
 * @param  {Function} callback 加载完js的回掉函数
 */
navigate.toNavigationAudit = function(container, callback) {
  var jses = [
    {'name': '../../../uiWidget/alert_dialog.js', 'removable': true},
    {'name': 'index.js', 'removable': true}
  ]
  includePage(container, 'content/navigation/audit', 'index.html', jses, callback)
}
/**
 * 编排发布入口
 * @param  {Function} callback 加载完js的回掉函数
 */
navigate.toNavigationPublish = function(container, callback) {
  var jses = [
    {'name': '../../../uiWidget/alert_dialog.js', 'removable': true},
    {'name': '../../../uiWidget/overlayDialog.js', 'removable': true},
    {'name': '../../../uiWidget/newSelect.js', 'removable': true},
    {'name': '../../../uiWidget/datePicker.js', 'removable': true},
    {'name': 'publish.js', 'removable': true},
    {'name': 'index.js', 'removable': true}
  ]
  includePage(container, 'content/navigation/publish', 'index.html', jses, callback)
}
/**
 * 编排发布入口
 * @param  {Function} callback 加载完js的回掉函数
 */
navigate.toNavigationPublishVersion = function(container, callback) {
  var jses = [
    {'name': '../../../uiWidget/alert_dialog.js', 'removable': true},
    {'name': '../../../uiWidget/overlayDialog.js', 'removable': true},
    {'name': 'ver_change.js', 'removable': true},
    {'name': 'index.js', 'removable': true}
  ]
  includePage(container, 'content/navigation/version', 'index.html', jses, callback)
}

/**
 * 轮播编排
 */
navigate.toNavMngSlider = function(container, callback){
  var jses = [
    {name: '../../uiWidget/styledList.js', removable: true},
    {name: '../../uiWidget/newCalendar.js', removable: true},
    {name: 'datePicker.js', removable: true},
    {name: "../../uiWidget/popupDialog.js","removable":true},
    {name: '../../uiWidget/scrollBarList.js', removable: true},
    {name: '../../uiWidget/overlayDialog.js', removable: true},
    {name: '../../uiWidget/indexChecker.js', removable: true},
    {name: '../../js/lib/popper.js', removable: true},
    {name: '../ticket/newSelect.js',removable: true},
    {name: '../../js/UploadModule.js',removable: true},
    {name: 'index.js', removable: true}];
  includePage(container, 'content/navigationSlider', 'index.html', jses, callback);
}


navigate.toSysUser = function(container, callback){
	var jses = [
		{name: '../../uiWidget/popupDialog.js', removable: true},
		{name: '../../uiWidget/overlayDialog.js', removable: true},
		{name: '../../uiWidget/styledList.js', removable: true},
		{name: 'jquery.ztree.all.min.js',removable:true},
		{name: 'index.js', removable: true}
	];
	includePage(container, 'content/sys_user_admin', 'index.html', jses, callback);
}

navigate.toCMSAppAdmin = function(container, callback) {
	 var jses = [
	  {"name":"aquaUtil.js","removable":true},
		{"name": "create_folder.js", "removable": true},
	 	{"name": '../../uiWidget/styledList.js', "removable": true},
		{"name":"../../uiWidget/popupDialog.js","removable":true},
	  {"name":"datePicker.js", "removable": true},
		{"name":"../../uiWidget/styledSelector.js","removable":true},
		{name: '../../js/UploadModule.js',removable: true},
		{"name":"jquery.ztree.all.min.js","removable":true},
		{"name":"upload.js","removable":true},
		{"name":"object2ObjectEx.js","removable":true},
		{"name":"index.js","removable":true}
	];
  includePage(container, 'content/CMS', 'index.html', jses, callback);
}
/**
 * CMS编排审核入口
 * @param  {Function} callback 加载完js的回掉函数
 */
navigate.toCMSNavigationAudit = function(container, callback) {
  var jses = [
    {'name': '../../../uiWidget/alert_dialog.js', 'removable': true},
    {'name': '../../navigation/audit/index.js', 'removable': true}
  ]
  includePage(container, 'content/CMS/audit', 'index.html', jses, callback)
}
/**
 * CMS版本发布入口
 * @param  {Function} callback 加载完js的回掉函数
 */
navigate.toCMSNavigationPublish = function(container, callback) {
  var jses = [
    {'name': '../../../uiWidget/alert_dialog.js', 'removable': true},
    {'name': '../../../uiWidget/overlayDialog.js', 'removable': true},
    {'name': '../../../uiWidget/newSelect.js', 'removable': true},
    {'name': '../../../uiWidget/datePicker.js', 'removable': true},
    {'name': '../../navigation/publish/publish.js', 'removable': true},
    {'name': '../../navigation/publish/index.js', 'removable': true}
  ]
  includePage(container, 'content/CMS/publish', 'index.html', jses, callback)
}
/**
 * CMS版本变更入口
 * @param  {Function} callback 加载完js的回掉函数
 */
navigate.toCMSNavigationPublishVersion = function(container, callback) {
  var jses = [
    {'name': '../../../uiWidget/alert_dialog.js', 'removable': true},
    {'name': '../../../uiWidget/overlayDialog.js', 'removable': true},
    {'name': '../../navigation/version/ver_change.js', 'removable': true},
    {'name': '../../navigation/version/index.js', 'removable': true}
  ]
  includePage(container, 'content/CMS/version', 'index.html', jses, callback)
}
navigate.toPostManagement = function(container, callback) {
  var jses = [
	{"name": "../../uiWidget/ueditor/ueditor.config.js", "removable": true},
    {"name": "../../uiWidget/ueditor/ueditor.all.js", "removable": true},
	{"name":"../../uiWidget/styledList.js","removable":true},
	{"name":"../../js/UploadModule.js","removable": true},
	{"name":"../../uiWidget/newCalendar.js","removable":true},
    {"name":"../../uiWidget/datePicker.js","removable":true},
    {"name":"../../uiWidget/newSelect.js","removable":true},
	{"name":"newInputSelect.js","removable":true},
	{"name":"post_list.js","removable":true}
  ];
  includePage(container, 'content/post_list', 'post_list.html', jses, callback);
}
/**
 * 切换菜单左侧的尖角形,并加载二级菜单（如何存在）
 */
navigate.changeV = function(obj) {
    //隐藏二级菜单
    jQuery("#second_menu > div").hide();

    var focusId = jQuery(obj).attr("id");
    var focusSrc = "";
    var focusBackgroundColor = "";
    switch (focusId) {
        case "m_20": //点播记录模块
            focusSrc = "images/demand_record_menu_v.png";
            focusBackgroundColor = "#1B9EBE";
            break;
        case 'realtime_analysis':
        	focusSrc = 'images/realtimeAnalysis/realtime_analysis_menu_v.png';
        	focusBackgroundColor = '#12a0ea';
        	break;
        default:
            focusSrc = "images/menu_v.png";
            focusBackgroundColor = "#767c9f";
            break;
    }

    jQuery(".menu_v_row img").attr("src", focusSrc);
    jQuery(".menu_v_background").css("background", focusBackgroundColor);

    var offsetNum = null;
    if (jQuery(obj).parent().attr("id") == "menu_top") {
        offsetNum = jQuery(obj).position().top + jQuery("#page_head_container").height();
        jQuery("#menu_move").css({
            top: offsetNum,
            bottom: ""
        }).show();
    } else if ((jQuery(obj).parent().attr("id") == "menu_bottom")) {
        offsetNum = jQuery("#menu_bottom").height() - jQuery(obj).height() - jQuery(obj).position().top;
        jQuery("#menu_move").css({
            bottom: offsetNum,
            top: ""
        }).show();
    }
};

/**
 * 定时向tif发送请求，避免session过期
 */
function heartBeat() {
    var xhr = new XmlHttpReq();
    var url = my.tifAdmin.host + "/rest/general/liveevent/user/heartbeat;jsessionid=" + my.tifAdmin.jsessionId;
    xhr.open("GET", url, false);
    try {
        xhr.send();
    } catch (e) {
        console.log(e);
        //返回登录页面
        window.location.href = "http://" + window.location.host + "/" + window.location.pathname.split("/")[1] + "/login.html";
    }
};

/**
 * 如果response中的errorcode
 * 为session过期，则重新登录
 */
function reloginOption(response) {
    if (response && response.responseText) {
        var rspObj = dojo.fromJson(response.responseText);
        if (rspObj && rspObj.items && rspObj.items[0] && (rspObj.items[0].errorCode == "LES00014" || rspObj.items[0].errorCode == "LES17001")) {
            window.location.href = "http://" + window.location.host + "/" + window.location.pathname.split("/")[1] + "/login.html";
        }
    }
}
