var demandRrecord = new Object();
demandRrecord.layout =
  '<div id="demand_record_second_menu" class="second_menu">' +
  '<div id="demand_record_single_query_container" onclick="demandRrecord.toSingleQuery(this);">' +
  '<img src="images/single_query_dark.png"/>' +
  '</div>' +
  '<div id="demand_record_batch_query_container" onclick="demandRrecord.toBatchQuery(this);">' +
  '<img src="images/batch_query_dark.png"/>' +
  '</div>' +
  '<div id="demandRrecord_invit_list_container" onclick="demandRrecord.toBatchExport(this);">' +
  '<img src="images/batch_export_dark.png"/>' +
  '</div>' +
  '<div id="demand_record_basicsetting" onclick="demandRrecord.toBasicSettings(this);">' +
  '<img src="images/basic_settings_dark.png"/>' +
  '</div>' +
  '</div>';

/**
 * 页面初始化
 * @description:
 *        1、初始化参数
 *        2、初始化模块菜单
 *        3、初始化查询事件
 *        4、初始化grid
 */
demandRrecord.initWindow = function () {
    this.initParams();

    //初始化顶部二级菜单
    this.initMenu();

    //默认选中该二级菜单
    // this.toSingleQuery($("demand_record_single_query_container"));
};

/**
 * 参数初始化
 */
demandRrecord.initParams = function () {

};

/**
 * 初始化顶部二级菜单
 */
demandRrecord.initMenu = function () {
    jQuery("#second_menu_container").empty().append(demandRrecord.layout);
};

/**
 * 单人查询
 */
demandRrecord.toSingleQuery = function (container,obj) {
    this.changeMenuStyle(obj);
    var jses = [{
        "name": "../../../js/jquery.mCustomScrollbar.concat.min.js",
        "removable": true
    }, {
        "name": "brodecaSingleSearch.js",
        "removable": true
    }, {
        "name": "../../../uiWidget/newCalendar.js",
        "removable": true
    }];   
    includePage(container,"content/brodecastRecord/brodecaSingleSearch","brodecaSingleSearch.html",jses);
 	//includePage("page_container", "content/brodecastRecord/brodecaSingleSearch", "brodecaSingleSearch.html", jses);
};

/**
 * 批量查询-详单
 */
demandRrecord.toBatchQuery = function (container,obj) {
    this.changeMenuStyle(obj);
    var jses = [{
        "name": "../../../js/jquery.mCustomScrollbar.concat.min.js",
        "removable": true
    }, {
        "name": "jquery.form.js",
        "removable": true
    }, {
        "name": "queryWin.js",
        "removable": true
    }, {
        "name": "BatchQuery.js",
        "removable": true
    }];
    includePage(container, "content/brodecastRecord/BatchQuery", "BatchQuery.html", jses);
    console.log("detail");
};
/**
 * 批量查询-统计
 */
demandRrecord.toBatchQueryStatistics = function (container,obj) {
    this.changeMenuStyle(obj);
    var jses = [{
        "name": "../../../js/jquery.mCustomScrollbar.concat.min.js",
        "removable": true
    }, {
        "name": "BatchQueryWin.js",
        "removable": true
    }, {
        "name": "BatchQuery_statistics.js",
        "removable": true
    }];
    includePage(container, "content/brodecastRecord/BatchQuery", "BatchQuery_statistics.html", jses);
    console.log("statistics");
};


/**
 * 批量导出
 */
demandRrecord.toBatchExport = function (container,obj) {
    this.changeMenuStyle(obj);
    var jses = [{
        "name": "pageSpliterTwo.js",
        "removable": true
    }, {
        "name": "jquery.form.js",
        "removable": true
    }, {
        "name": "BatchExportQuery.js",
        "removable": true
    }, {
        "name": "BatchExport.js",
        "removable": true
    }];
    includePage(container, "content/brodecastRecord/BatchExport", "BatchExport.html", jses);
};

/**
 * 基本设置
 */
demandRrecord.toBasicSettings = function (container,obj) {
    this.changeMenuStyle(obj);
    var jses = [];
    var jses = [{
        "name": "../../../js/jquery.mCustomScrollbar.concat.min.js",
        "removable": true
    }, {
        "name": "BasicSettings.js",
        "removable": true
    }];
    includePage(container, "content/brodecastRecord/BasicSetting", "BasicSettings.html", jses);
};


/**
 * 更换二级菜单样式
 */
demandRrecord.changeMenuStyle = function (obj) {
    var $second_menu_v = jQuery(".second_menu_v");
    if($second_menu_v.length > 0) {
        $second_menu_v.children().attr("src", $second_menu_v.children().attr("src").replace("white", "dark"));
        $second_menu_v.removeClass("second_menu_v");
    }
    jQuery(obj).addClass("second_menu_v");
    jQuery(obj).children().attr("src", jQuery(obj).children().attr("src").replace("dark", "white"));
};

/**
 * 初始化window
 */
demandRrecord.initWindow();
