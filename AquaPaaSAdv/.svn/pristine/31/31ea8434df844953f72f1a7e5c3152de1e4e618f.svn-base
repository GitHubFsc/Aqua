//启动页面：MyPage.navToShouZhongGuanLi();
var toufang_report= new Object();
toufang_report.init = function () {
  /*
  if(my.paas.user_type!=1){
		this.noRightAction();
		return;
	}
	else{
		jQuery("#adv_toufang_report_container").show();
	}
	*/
	jQuery("#adv_toufang_report_container").show();
	this.initPara();
  this.draw_page_elements();
  this.day_after_solved={};//点按钮后的时间。
	this.pickerCalendar=null;
	this.initSeachCondition();//一开始默认搜素今天
	this.searchPlacementReport();
  this.time_period={};//开始结束时间。
  this.bindEvent();
};

toufang_report.initPara=function(){
  var self=this;
	this.objForPlacementReportRequest={};
	var viewToufangDetailDialog= {
		url: "content/tou_fang_bao_gao/toufang_view_detail.html",
		width: 806,
		height: window.innerHeight,
		context: this,
		callback: self.fillToufangDetailDialog
	};
	this.viewToufangDetailDialog = new PopupDialog(viewToufangDetailDialog);
	var viewCoordinateDialog= {
		url: "content/tou_fang_bao_gao/toufang_coordinate.html",
		width: 754,
		height: 582,
		context: {},
		zIndex: 3000,
		callback: self.draUserCoordinate
	};
	this.viewCoordinateDialog = new OverlayDialog(viewCoordinateDialog);
};

toufang_report.draUserCoordinate=function(){
	var self=toufang_report;
	var jq=jQuery;
	jq("#toufang_coordinate_map_close_button,#toufang_coordinate_map_close_icon").click(function(){ 
		self.viewCoordinateDialog.close()
	});
	jq("#toufang_coordinate_map_title").text(jq("#toufang_adv_username").text());
	var map = new BMap.Map("toufang_coordinate_map"); 
	var currentToufangResponseText=self.toufangResponseText[self.rowIndex];
	if(currentToufangResponseText.location){
	  var location=currentToufangResponseText.location.split(",");
		var point = new BMap.Point(location[1],location[0]);
		var zoom=19;
		map.centerAndZoom(point, zoom);
		map.addControl(new BMap.NavigationControl());
		var myIcon = new BMap.Icon("content/tou_fang_bao_gao/images/mark.png", new BMap.Size(35, 56), {//标注图片      
       anchor: new BMap.Size(17,56)   
    });
		var marker=new BMap.Marker(point,{icon:myIcon});
		map.addOverlay(marker); 
		self.mapObj=map;
		var opts = {
			position : point,    // 指定文本标注所在的地理位置
			//offset   : new BMap.Size(17, -28)    //设置文本偏移量
			offset   : new BMap.Size(0, -10)    //设置文本偏移量
		};  
		var gc = new BMap.Geocoder();
    gc.getLocation(point, function (rs) {
			var address=rs.address||"";
			var label = new BMap.Label(address,{offset:new BMap.Size(36,-10)});
			/*
			label.setStyle({
				 //color : "red",
				 fontSize : "12px",
				 height : "20px",
				 lineHeight : "20px",
				 fontFamily:"微软雅黑",
				 border:0,
				 backgroundColor:'transparent',
         color:"#d24949",
				 textAlign:"center"
			 });
			 */
			 
			marker.setLabel(label);
			/*
			var opts = {
				offset: new BMap.Size(30, -6)    //设置文本偏移量
			};  
			console.log(1);
			marker.openInfoWindow(new BMap.InfoWindow(address,opts))
			*/
			//map.addOverlay(label); 
		})
		/*
		var Combo=InputCombo;
		var mapStyle = new Combo({
			el: '#toufang_coordinate_map_select',
			width: 156,
			height: 30,
			showCombo: true,
			enable: false,
			content: [{
				label: i18n('ADPOLICYMANAGE_MAP_SHOW_CENTER'),
				value: 0
			}/*, {
				label: i18n('ADPOLICYMANAGE_MAP_SHOW_RADIUS'),
				value: 1
			}*//*],
			icon: 'url(./image/adPolicyManage/arrow.png)',
			color: '#797979',
			callback: (val) => {
				if (val) {
					//_this.zoom = _this.api.setScaleByDistance(_this.widget.radius.getValue());
					//_this.widget.map.setZoom(_this.zoom)
				} else {
					var zoom = 19;
					var point = new BMap.Point(location[1],location[0]);
					var zoom=19;
					map.centerAndZoom(point, zoom);
				}
			}
		})
		mapStyle.setValue(0);
		*/
	}
}

toufang_report.fillToufangDetailDialog=function(){
  var jq=jQuery;
	var innerHeight=window.innerHeight-34-32-20;
	jq("#toufang_detail_dialog_container").css({
		"max-height":innerHeight+"px"
	});
	var self=this;
	var timeKeyList=["placement_time","save_time"];
	var currentToufangResponseText=self.toufangResponseText[self.rowIndex];
	var userIds="";
	var userIdsList=[];
	if(currentToufangResponseText["user_id"]){
		userIdsList.push(currentToufangResponseText["user_id"])
	};
	if(currentToufangResponseText["adp_user_id"]){
		userIdsList.push(currentToufangResponseText["adp_user_id"])
	};
	if(currentToufangResponseText["ad_user_id"]){
		userIdsList.push(currentToufangResponseText["ad_user_id"])
	};
	userIds=userIdsList.join(",");
	if(userIdsList.length>0){
		var url_ = paasHost + "/aquapaas/rest/users/public?user_ids=" + userIds;
		url_ = url_ + "&app_key=" + paasAppKey;
		url_ = url_ + "&timestamp=" + new Date().toISOString();
		jQuery.ajax({
			type: 'GET',
			async: true,
			url: url_,
			headers: {
				'x-aqua-sign': getPaaS_x_aqua_sign('GET', url_),
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			error: function (error) {
			}
		}).done(function (data, status, xhr) {
		  var data=data;
		  for(var i= 0,len = data.length;i<len;i++){
				if(data[i].user_id){
					if(currentToufangResponseText["user_id"]&&(currentToufangResponseText["user_id"]==data[i].user_id)){
						jq("#toufang_adv_username").text(data[i]["user_name"]||"")
					};
					if(currentToufangResponseText["adp_user_id"]&&(currentToufangResponseText["adp_user_id"]==data[i].user_id)){
						jq("#toufang_adp_creator").text(data[i]["user_name"]||"")
					};
					if(currentToufangResponseText["ad_user_id"]&&(currentToufangResponseText["ad_user_id"]==data[i].user_id)){
						jq("#toufang_ad_creator").text(data[i]["user_name"]||"")
					};
				}
			};
	    if((!currentToufangResponseText.location)||(currentToufangResponseText.location=="")){
				jq("#toufang_view_user_coordinate").hide()
			};
			jq("#toufang_view_user_coordinate").on("click",function(){
			  self.viewCoordinateDialog.open();
			});
		})
	};
	jq(".toufang_dialog_content_input").each(function(){
     if(jq(this).attr("data-key")){
			var dataKey=jq(this).attr("data-key");
			var currentToufangResponseText=self.toufangResponseText[self.rowIndex];
			var dataKeyIsExistInData=false;
      if(currentToufangResponseText[dataKey]||( (typeof(currentToufangResponseText[dataKey])!="undefined")&&(currentToufangResponseText[dataKey]==0) ) ){
				if(jq.inArray(dataKey,timeKeyList)!=-1){
					jq(this).text(convertTimeString(currentToufangResponseText[dataKey]))
				}
				else if(dataKey=="charge_type"){
					var charge_type_transfer=(currentToufangResponseText[dataKey]==1?i18n("TOUFANGBAOGAO_DIANJI"):i18n("TOUFANGBAOGAO_MEIYOUDIANJIDIANJI"));
					jq(this).text(charge_type_transfer)
				}
				else if(dataKey=="dimension"){
				  var demensionRawData=currentToufangResponseText[dataKey];
					var demensionDataList=[];
					if(demensionRawData.indexOf("×")!=-1){
						demensionDataList=demensionRawData.split("×")
					};
					if(demensionRawData.indexOf("*")!=-1){
						demensionDataList=demensionRawData.split("*")
					}
					var dataValue=jq(this).attr("data-value");
					if(dataValue=="dimension1"){
						jq(this).text(demensionDataList[0])
					}
					else{
						jq(this).text(demensionDataList[1])
					}
				}
				else if(dataKey=="duration"){
					if(currentToufangResponseText[dataKey]==0){
						jq(this).text("0")
					}
					else{
						jq(this).text(currentToufangResponseText[dataKey])
					}
				}
				else if(dataKey=="shot_tag"){
					jq(this).text(currentToufangResponseText[dataKey].join(","))
				}
				else{
					jq(this).text(currentToufangResponseText[dataKey])
				}
			};
			if(dataKey=="program"){
				var str="";
				if(currentToufangResponseText["provider_id"]){
					str+=currentToufangResponseText["provider_id"];
					if(currentToufangResponseText["provider_asset_id"]){
						str+="_"+currentToufangResponseText["provider_asset_id"]
					};
					jq(this).text(str)
				}
			}
		 }
  })
};

toufang_report.bindEvent=function(){
  var jq=jQuery;
	var self=this;
	jq("#adv_toufang_manage_table_Conainer2").on('click', '.toufang_adPos_operation', function (event,index) {
		 self.rowIndex=jq(this).attr("data-index");
		 self.viewToufangDetailDialog.open();
	})
};

toufang_report.lessTenPluwZero = function(object){//如 把 2014-9-6 转化为 2014-09-06
if (object < 10) 
	{object="0" + object;} 
	return object;
}

toufang_report.format_date=function(date_){
	var y = this.lessTenPluwZero(date_.getFullYear());
    var m = this.lessTenPluwZero(date_.getMonth()+1);//获取当前月份的日期
    var d = this.lessTenPluwZero(date_.getDate());
    return y+"-"+m+"-"+d;
}

toufang_report.initSeachCondition=function(){
	var today = new Date();
	var formateDate=this.format_date(today);
	this.objForPlacementReportRequest={
    "begin_time":""+formateDate+"T00:00:00+0800",
    "end_time": ""+formateDate+"T23:59:59+0800"
  };
};

toufang_report.searchPlacementReport=function(){
  var self=this;
	//var widths = ["0.171","0.158","0.154","0.108","0.157","0.099","0.141"];
	var widths = ["0.171","0.158","0.2516","0.108","0.0792","0.0792","0.141"];
	this.placementReportData = new StyledList({
		rows: 11,
		columns: 7,
		containerId: 'adv_toufang_manage_table_Conainer2',
		titles: [{
				label: i18n('TOUFANGBAOGAO_TOUFANGSHIJIAN')
			},{
				label: i18n('TOUFANGBAOGAO_GGWNAME')
			}, {
				label: i18n('TOUFANGBAOGAO_SUCAI_GGWNAME')
			}, {
				label: i18n('TOUFANGBAOGAO_SUCAI_MZBQ')
			}, {
				label: i18n('TOUFANGBAOGAO_SHICHANG')
			}, {
				label: i18n('TOUFANGBAOGAO_SHIFOUDIANJI')
			}, {
				label: i18n('TOUFANGBAOGAO_OPR')
			}
		],
		listType: 1,
		data: [],
		styles: {
			borderColor: '#ebebeb',
			borderWidth: 1,
			titleHeight: 46,
			titleBg: '#5da1c0',
			titleColor: '#ffffff',
			cellBg: 'white',
      evenBg: 'rgb(245,245,245)',
			cellColor: 'rgb(114,114,114)',
			footBg: '#ffffff',
			footColor: '#797979',
			iconColor: '#5da1c0',
			inputBorder: '1px solid rgb(203,203,203)',
			inputBg: 'white',
			columnsWidth:widths
		}
	});
	this.placementReportData.getPageData = function (pageNumber) {
	  var currentTable=this;
	  var returnData=[];
	  var placementReportData=self.getPlacementReportData(pageNumber,currentTable);
		if(placementReportData){
			returnData=placementReportData
		};
		return placementReportData
	};
	this.placementReportData.create()
  /*
	var url=paasHost + paasAdvDomain+"/ads/placement/detail";
	url+="?user_id="+my.paas.user_id+"&user_type=1&access_token="+my.paas.access_token+"";
	url+="&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
	*/
};

toufang_report.getPlacementReportData=function(pageNumber,currentTable){
	//try{
	  var self=this;
		var objForPlacementReportRequest=this.objForPlacementReportRequest;
		objForPlacementReportRequest["platform_id"]=my.paas.platform_current_id;
		var start = (pageNumber - 1) * 11;
		var end = pageNumber * 11 - 1;
		var query = '&start=' + start;
		query += '&end=' + end;
		var url=paasHost + paasAdvDomain+"/ads/placement/detail";
		url+="?user_id="+my.paas.user_id+"&user_type=1&access_token="+my.paas.access_token+"";
		url+="&app_key="+paasAppKey+"&timestamp="+ new Date().toISOString()+"";
		url+=query;
		url+="&sort_by=placement_time&sort_mode=d";
		var xhr= new XMLHttpRequest();
		var method="POST";
		xhr.open(method, url, false);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("x-aqua-sign",getPaaS_x_aqua_sign(method,url));
		xhr.send(JSON.stringify(objForPlacementReportRequest));
		if((xhr.readyState == 4)&&(xhr.status >199&&(xhr.status<300))&&(xhr.responseText)){
			var totalCount = xhr.getResponseHeader('x-aqua-total-count');
      currentTable.onTotalCount(totalCount || 0);
			var returnData=[];
			if(xhr.responseText){
				var jsonData=JSON.parse(xhr.responseText);
				self.toufangResponseText=jsonData;
				for(var i= 0,len = jsonData.length;i<len;i++){
				   var charge_type="";
					 if(typeof(jsonData[i].charge_type)!="undefined"){
						charge_type=jsonData[i].charge_type
					 };
					 var charge_type_transfer="";
					 if(typeof(jsonData[i].charge_type)!="undefined"){
						charge_type_transfer=(charge_type==1?i18n("TOUFANGBAOGAO_DIANJI"):i18n("TOUFANGBAOGAO_MEIYOUDIANJIDIANJI"));
					 };
					 var placement_time=jsonData[i].placement_time||"";
           if(placement_time!=""){
						placement_time=convertTimeString(placement_time)
					 };
					 var shot_tag=jsonData[i].shot_tag||"";
					 if(shot_tag!=""){
						shot_tag=shot_tag.join(",")
					 };
					 var duration=jsonData[i].duration||"";
					 if(jsonData[i].duration==0){
						duration=jsonData[i].duration
					 }
					 var returnDataUnit = [
						{label: placement_time},
						{label: jsonData[i].adp_name||""},
						{label: jsonData[i].ad_name||""},
						{label: shot_tag},
						{label: duration},
						{label: charge_type_transfer},
						{label: "<span data-index=\""+i+"\" class=\"toufang_adPos_operation\">"+i18n('TOUFANGBAOGAO_VIEW')+"</span>"}
					];
					returnData.push(returnDataUnit)
				}
			}
			return(returnData)
		}
		else{
		 return []
		}
	//}catch(e){
   
  //}
};

toufang_report.draw_page_elements = function () {
  this.draw_page_elements_x_1()//画上部分的所有UI.
};

toufang_report.noRightAction=function(){
  alert("你好，你没有权限查看这里。");
  jQuery("#adv_toufang_report_container").hide();
},

toufang_report.draw_page_elements_x_1 = function () {
	var jq=jQuery;
	var self=this;
	if(window.screen.width<1400){
		jq("#toufang_panel_calendar_selectors").css("margin-right","0px");
		jq(".panel_calendar_container").each(function(){
			jq(this).css("width","138px")
		});
		jq(".panel_calendar_input").each(function(){
			jq(this).css("width","130px")
		});
	};
	var container=jq("#adv_toufang_report_container");
	var totalTopELeWidth=jq(container).find(".input_search_container_").outerWidth();
	var inputContainerWidth=totalTopELeWidth;
	totalTopELeWidth+=(parseInt(jq(container).find(".input_search_container_").css("marginLeft")));
	totalTopELeWidth+=(jq(container).find("#adv_toufang_time_tabswitch").outerWidth());
	totalTopELeWidth+=(parseInt(jq(container).find("#adv_toufang_time_tabswitch").css("marginLeft")));
	totalTopELeWidth+=(jq(container).find("#toufang_pre_day").outerWidth());
	totalTopELeWidth+=(parseInt(jq(container).find("#toufang_pre_day").css("marginLeft")));
	totalTopELeWidth+=(jq(container).find("#toufang_next_day").outerWidth());
	totalTopELeWidth+=(parseInt(jq(container).find("#toufang_next_day").css("marginLeft")));
	totalTopELeWidth+=(jq(container).find("#toufang_panel_calendar_selectors").outerWidth());
	var diverse=2;
	if(totalTopELeWidth>jq("#adv_toufang_report_container").children().eq(0).outerWidth()){//顶部元素放不下折行
		var needReducedWidth=(totalTopELeWidth-jq("#adv_toufang_report_container").children().eq(0).outerWidth()+diverse);
		if(needReducedWidth>0){
		  var newInputContainerWidth=inputContainerWidth-needReducedWidth;
			var newInputWidth=jq(container).find("#toufang_top_search_input").outerWidth()-40-needReducedWidth;//40为padding值
			jq(container).find(".input_search_container_").css("width",newInputContainerWidth+"px");		
			jq(container).find("#toufang_top_search_input").css("width",newInputWidth+"px");
		}
	};
  jQuery("#toufang_baogao_main_container").append("<div id=\"toufang_baogao_topContainer\"class=\"adv_top_container\"><div id=\"toufang_baogao_topContainer_son\" style=\"height:36px\" class=\"adv_top_container_son\"></div></div>");
  jQuery("#toufang_baogao_topContainer_son").append("<div class=\"input_search_container_\" style=\"display:block;float:left;margin-top:12px;margin-left:9px;width:400px;\"><div id=\"toufang_baogao_search_container\" class=\"filterSelect\"></div><input id=\"toufangbaogao_search_input\" class=\"panel_top_search_box_input\" type=\"text\"><div id=\"toufangbaogao_search_button\" class=\"panel_top_search_box_handle\"></div></div>");
	var isTimingSelect_options = [{
		key: "adp_name",
		value: i18n("TOUFANGBAOGAO_GGWNAME")
	},{
		key: "ad_name",
		value: i18n("TOUFANGBAOGAO_SUCAI_GGWNAME")
	}];
	var isTimingSelect = new newSelect("#toufangbaogao_select", [], {
		width: 108,
		height: 30,
		background: "#7EB7D4",
		fontSize: 14,
		liFontSize: 14,
		color: "white",
		liColor: "white",
		selectbackground: "#7EB7D4",
		selectLibackground: "#7EB7D4",
		headerBorder: "1px solid #6D9FBA",
		liBorderColor: "#6D9FBA",
		openIconUrl: "content/tou_fang_bao_gao/images/open4.png",
		closeIconUrl: "content/tou_fang_bao_gao/images/close4.png",
		iconWidth:20
	},function(value){
	});
	isTimingSelect.updateSelectOptions(isTimingSelect_options);
	
	jq("#toufang_top_search_button").on("click",function(){
		self.searchContent()
	});
	jq("#toufang_top_search_input").on("keyup",function(event){
		var key = event.which || event.keycode;
		if(key&&(key==13)){
			self.searchContent()
		}
	});
	jq(".toufang_tab_toggle_unit").each(function(){
		jq(this).click(function(){
      jq(this).siblings().removeClass("toufang_tab_focus_style").addClass("toufang_tab_unfocus_style");
			jq(this).removeClass("toufang_tab_unfocus_style").addClass("toufang_tab_focus_style");
			var beginDate="";
			var endDate="";
			var today= new Date();
			switch(jq(this).index())
			{
				case 0:
					beginDate=self.format_date(today);
					endDate=self.format_date(today);
					break;
				case 1:
					today.setDate(today.getDate()-1);
					beginDate=self.format_date(today);
					endDate=self.format_date(today);
					break;
				case 2:
				  var dateYear = today.getFullYear();
					var dateMonth = today.getMonth();
					var weekday_1 = today.getDate() - today.getDay() + 0 + 1;
					var weekday_7 = today.getDate() - today.getDay() + 0 + 7;
					beginDate=self.format_date(new Date(dateYear, dateMonth, weekday_1));
          endDate=self.format_date(new Date(dateYear, dateMonth, weekday_7));
					break;
				case 3:
					var year=today.getFullYear();
	        var month=today.getMonth()+1;
          beginDate =self.lessTenPluwZero(year)+"-"+self.lessTenPluwZero(month)+"-"+'01';//当月的第一天。
					endDate = self.format_date(new Date(year,month,0));//当月的最后一天。
					break;
				default: //4
				  var thirtyDaysAgo= new Date();
					thirtyDaysAgo.setDate(thirtyDaysAgo.getDate()-30);
					beginDate =self.format_date(thirtyDaysAgo);
					endDate = self.format_date(today);
					break;
			}
			jq(".panel_calendar_input").eq(0).val(beginDate)
			jq(".panel_timesel_input").eq(0).val("00:00:00");
			jq(".panel_calendar_input").eq(1).val(endDate)
			jq(".panel_timesel_input").eq(1).val("23:59:59");
	    self.searchContent();
    });
	});
	jq("#toufang_pre_day").click(function(){
	  var startDay=jq(".panel_calendar_input").eq(0).val().replace(/-/g,"/");
    var startDayObj=new Date(startDay);
		var startDayMonth=startDayObj.getMonth();
    var startDayYear=startDayObj.getFullYear();
		var startDayDay=(startDayObj.getDate()-1);//前一天
		var startDateStr=self.format_date(new Date(startDayYear,startDayMonth,startDayDay));
		var endDay=jq(".panel_calendar_input").eq(1).val().replace(/-/g,"/");
	  var endDayObj=new Date(endDay);
		var endDayMonth=endDayObj.getMonth();
    var endDayYear=endDayObj.getFullYear();
		var endDayDay=(endDayObj.getDate()-1);//前一天
		var endDateStr=self.format_date(new Date(endDayYear,endDayMonth,endDayDay));
		jq(".panel_calendar_input").eq(0).val(startDateStr)
		jq(".panel_timesel_input").eq(0).val("00:00:00");
		jq(".panel_calendar_input").eq(1).val(endDateStr)
		jq(".panel_timesel_input").eq(1).val("23:59:59");
		self.searchContent();
	});
	jq("#toufang_next_day").click(function(){
		var startDay=jq(".panel_calendar_input").eq(0).val().replace(/-/g,"/");
    var startDayObj=new Date(startDay);
		var startDayMonth=startDayObj.getMonth();
    var startDayYear=startDayObj.getFullYear();
		var startDayDay=(startDayObj.getDate()+1);
		var startDateStr=self.format_date(new Date(startDayYear,startDayMonth,startDayDay));
		var endDay=jq(".panel_calendar_input").eq(1).val().replace(/-/g,"/");
	  var endDayObj=new Date(endDay);
		var endDayMonth=endDayObj.getMonth();
    var endDayYear=endDayObj.getFullYear();
		var endDayDay=(endDayObj.getDate()+1);//前一天
		var endDateStr=self.format_date(new Date(endDayYear,endDayMonth,endDayDay));
		jq(".panel_calendar_input").eq(0).val(startDateStr)
		jq(".panel_timesel_input").eq(0).val("00:00:00");
		jq(".panel_calendar_input").eq(1).val(endDateStr)
		jq(".panel_timesel_input").eq(1).val("23:59:59");
		self.searchContent();
	});
	this.draw_top_calendar();
  this.draw_table_outer();
};

toufang_report.searchContent = function () {
  var jq=jQuery;
	this.objForPlacementReportRequest={};
	this.objForPlacementReportRequest.begin_time=jq(".panel_calendar_input").eq(0).val()+"T"+jq(".panel_timesel_input").eq(0).val()+"+0800";
	this.objForPlacementReportRequest.end_time=jq(".panel_calendar_input").eq(1).val()+"T"+jq(".panel_timesel_input").eq(1).val()+"+0800";
	var dataKey=jq("#toufangbaogao_select").find(".select-header").attr("data-key");
	if(jq("#toufang_top_search_input").val()!=""){
		this.objForPlacementReportRequest[dataKey]=jq("#toufang_top_search_input").val()
  };
	this.searchPlacementReport();
};

toufang_report.draw_table_outer = function () {
  jQuery("#adv_toufang_report_container").append("<div class=\"panel_page_list\" id=\"adv_toufang_manage_table_Conainer2\" style=\"top:60px\"></div>")
}

toufang_report.setTimeSelector=function(target) {
	var self=this;
  var timeSelector=this.timeSelector;
	if (timeSelector == null) {
		timeSelector = {
			getSelectors: function () {
				this.hourSel = self.getSelector('stat_timesel_hour', 0, 24);
				this.minSel = self.getSelector('stat_timesel_mins', 0, 60);
				this.secSel = self.getSelector('stat_timesel_sec', 0, 60);
			},
			setHour: function (val) {
				this.hourSel.setValue(val);
			},
			setMins: function (val) {
				this.minSel.setValue(val);
			},
			setSec: function (val) {
				this.secSel.setValue(val);
			},
			getTimeString: function () {
				return this.hourSel.getValue() + ':' + this.minSel.getValue() + ':' + this.secSel.getValue();
			}
		};
		timeSelector.getSelectors();
	}
	if (target != null && target != '') {
		var times = /(\d{2}):(\d{2}):(\d{2})/.exec(target);
		var hour = times[1];
		var mins = times[2];
		var sec = times[3];
	}
	hour = hour != null ? hour : '00';
	mins = mins != null ? mins : '00';
	sec = sec != null ? sec : '00';
	timeSelector.setHour(hour);
	timeSelector.setMins(mins);
	timeSelector.setSec(sec);
	return timeSelector;
};

toufang_report.getSelector=function(id, start, length){
	var options = [];
	for (var i = 0; i < length; i += 1) {
		var str = '';
		var num = start + i;
		str = preZero(num, 2);
		options.push({
			label: str,
			value: str
		});
	}
	var selectorStyle=this.selectorStyle;
	var selector = new StyledSelector({
		containerId: id,
		options: options,
		styles: selectorStyle
	});
	selector.getCloseIcon = function () {
		return '<div class="styled-selector-up-arrow"></div>';
	};
	selector.getOpenIcon = function () {
		return '<div class="styled-selector-down-arrow"></div>';
	};
	selector.create();
	return selector;
};

toufang_report.fromDateToString=function(obj, needtime) {
	var year = obj.getFullYear();
	var month = obj.getMonth();
	var date = obj.getDate();

	var str = '';
	str += year;
	str += '-';
	str += preZero(month + 1, 2);
	str += '-';
	str += preZero(date, 2);

	if (needtime) {
		var hours = obj.getHours();
		var mins = obj.getMinutes();
		var secs = obj.getSeconds();
		str += ' ';
		str += preZero(hours, 2);
		str += ':';
		str += preZero(mins, 2);
		str += ':';
		str += preZero(secs, 2);
	}

	return str;
};


toufang_report.formatToDateString=function(year, month, date) {
	var str = '';
	str += year;
	str += '-';
	str += preZero(month + 1, 2);
	str += '-';
	str += preZero(date, 2);
	return str;
};

toufang_report.checkTime=function () {
  var $=jQuery;
	function getTimezone() {
    var offset = new Date().getTimezoneOffset();
    var sign;
    if (offset == 0) {
      return 'Z';
    } else if (offset < 0) {
      offset = 0 - offset;
      sign = '+';
    } else {
      sign = '-';
    }
    var hours = Math.floor(offset / 60);
    var mins = offset - hours * 60;

    return sign + preZero(hours, 2) + preZero(mins, 2);
  };
	var ret = null;
	var fromdate = $('input[name=date-from]').val();
	var fromtime = $('input[name=time-from]').val();
	var todate = $('input[name=date-to]').val();
	var totime = $('input[name=time-to]').val();

	if (fromdate == '' || todate == '') {
		ret = 0;
		return ret;
	}
	var timezone = getTimezone();
	var fromfullstr = fromdate + 'T' + fromtime + timezone;
	var tofullstr = todate + 'T' + totime + timezone;
	if (fromfullstr > tofullstr) {
		ret = 1;
		return ret;
	}
	ret = {
		fromdate: fromdate,
		todate: todate,
		fromtime: fromtime,
		totime: totime,
		fromfullstr: fromfullstr,
		tofullstr: tofullstr
	};
	return ret;
};


toufang_report.draw_top_calendar = function () {
	var tdate = new Date();
	var fromdate = '', todate = '', fromtime = '00:00:00', totime = '23:59:59';
  var tdatestr = this.fromDateToString(tdate);
	fromdate = tdatestr;
  todate = tdatestr;
	this.calendarStyle={
    width: 278,
    navTitleHeight: 25,
    navTitleBgColor: '#64a5c2',
    datesViewHeight: 160,
    datesViewGridColor: '#e2e2e2',
    datesViewCellColor: '#fefefe',
    weekdaysHeight: 22,
    weekdaysColor: '#5da1c0',
    currMonthColor: '#797979',
    nonCurrMonthColor: 'rgb(200,200,200)'
  };
	this.selectorStyle = {
    optionHeight: 30,
  };
	this.timeSelector=null;
  var $=jQuery;
	var self=this;
	$('.panel_calendar_selitem').on('click', $('.panel_calendar_time_container')[0], function (ev) {
		ev.originalEvent = ev.originalEvent || {};
		ev.originalEvent.dropdownDelegate = ev.data;
		var $self = $(this);
		var left = $self[0].offsetWidth + $self[0].offsetLeft - 300;
		$('.panel_calendar_time_container').css('left', left).show();
		var dateInput = $self.find('.panel_calendar_input');
		var calendar = self.setDatePicker(dateInput.val());
	  var timeInput = $self.find('.panel_timesel_input');
		var timeSel = self.setTimeSelector(timeInput.val());
		$('#stattrend_timepicker_confirm').off().on('click', function () {
			var year = calendar.getCurrYear();
			var month = calendar.getCurrMonth();
			var date = calendar.getCurrDate();
			dateInput.val(self.formatToDateString(year, month, date));
			timeInput.val(timeSel.getTimeString());
			$('.panel_calendar_time_container').hide();
			var chkRet = self.checkTime();
      if (chkRet == 0) {
        alert(i18n('STATS_ALERT_NEED_TIME'));
        return;
      }
			if (chkRet == 1) {
        alert(i18n('STATS_ALERT_TIME_ERRP'));
        return;
      }
			self.searchContent();
			//self.checkTimeAndSearch();
		});
	});
  /*
  this.adv_datePicker_endDate = new DatePicker({
    containerId: 'adv_toufang_baogao_top_end_time',
    calendarStyles: calendarStyles,
    dateInputStyles: {
      borderColor: '#eaeaea'
    },
    iconImage: 'image/adv_calendar_icon.png'
  });
  */
	/*
  this.adv_datePicker_endDate.onChange = function() {
    var datestr = this.getDateStr();
    jQuery("form[method=POST] input[name=end_date]").val(datestr);
  };
	*/
	$('input[name=date-from]').val(fromdate);
	$('input[name=date-to]').val(todate);
	$('input[name=time-from]').val(fromtime);
	$('input[name=time-to]').val(totime);
	var pickerDropAnchor = $('.panel_calendar_time_container')[0];
	if (pickerDropAnchor && window.dropdownHelper) {
		window.dropdownHelper.addDropdownHandler(this);//here
	}
};

toufang_report.handleDropdowns=function (target, delegate) {//here
  var jq=jQuery;
	var container = jq('.panel_calendar_time_container')[0];
	if (!container) {
		window.dropdownHelper.removeDropdownHandler(this);
		return;
	};
	var isChild = window.dropdownHelper.checkIsChild(container, target, delegate);//here
	if (!isChild) {
		jq('.panel_calendar_time_container').hide();
	}
};
toufang_report.setDatePicker=function(target) {
	var pickerCalendar = this.pickerCalendar;
	if (pickerCalendar == null) {
		var calendar = new Calendar('panel_time_picker_calendar');
		var calendarStyle=this.calendarStyle;
		calendar.setStyles(calendarStyle);
		calendar.onCalendarClick = function (el) {
			var els = this.getCurrMonthDateElements();
			for (var i = 0, len = els.length; i < len; i += 1) {
				els[i].style.backgroundColor = '#fefefe';
				els[i].style.color = '#797979';
			}
			el.style.backgroundColor = '#5da1c0';
			el.style.color = '#fffefe';
		};
		calendar.onCalendarRefresh = function (els) {
			for (var i = 0, len = els.length; i < len; i += 1) {
				if (i == this.helper.curr_date - 1) {
					els[i].style.backgroundColor = '#5da1c0';
					els[i].style.color = '#fffefe';
				}
			}
		};
		calendar.open();
		pickerCalendar = calendar;
	}
	if (target != null && target != '') {
		var dates = /(\d{4})-(\d{2})-(\d{2})/.exec(target);
		pickerCalendar.setCurrDate({
			year: Number(dates[1]),
			month: Number(dates[2]) - 1,
			date: Number(dates[3])
		});
	}
	return pickerCalendar;
};


//页面初始化入口。
toufang_report.init();