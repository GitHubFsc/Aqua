var orderReport = {
    init: function () {
	    this.initPara();
		this.drawList();
		this.bindEvents();
	},
	initPara:function(){
		this.pickerCalendar=null;
		this.pickerDropAnchor=null;
		this.namespace="booking";
		this.objectType="aditem";
		this.approvalStatus="pending";
	},
	seachContractContent:function(searchKey){
		var jq=jQuery;
		var name=jq('#order_report_page_container').find("[name='order_report_search_"+searchKey+"_container']").find("input").val();
		if(name==""){
			this.drawList()
		}
		else{
			var searchPara="&"+searchKey+"="+encodeURIComponent(name);
			this.drawList(searchPara)
		}
	},
	preZero:function(num, len) {
		var str = num.toString();
		while (str.length < len) {
		  str = '0' + str;
		}
		return str;
	},
	fromDateToString:function(obj) {
		var year = obj.getFullYear();
		var month = obj.getMonth();
		var date = obj.getDate();
		var str = '';
		str += year;
		str += '-';
		var preZero=self.preZero;
		str += preZero(month + 1, 2);
		str += '-';
		str += preZero(date, 2);
		return str;
	},
	handleDropdowns: function (target, delegate) {
	  var pickerDropAnchor=this.pickerDropAnchor
	  var jq=jQuery;
      var container = jq('.panel_calendar_time_container')[0];
      if (!container || (container !== pickerDropAnchor)) {
        window.dropdownHelper.removeDropdownHandler(this);
        return;
      }
      var isChild = window.dropdownHelper.checkIsChild(container, target, delegate);
      if (!isChild) {
        jq('.panel_calendar_time_container').hide();
      }
    },
	bindEvents:function(){
	    var self=this;
		var jq=jQuery;
		jq('#order_report_page_container').find("[name='order_report_search_name_container']").find("input").on('keydown', function(e){
			if(e.keyCode == 13){
			    self.seachContractContent("name")
			}
		}).siblings().on('click', function(){
			self.seachContractContent("name")
		});
		jq('#order_report_page_container').find("[name='order_report_search_user_name_container']").find("input").on('keydown', function(e){
			if(e.keyCode == 13){
			    self.seachContractContent("user_name")
			}
		}).siblings().on('click', function(){
			self.seachContractContent("user_name")
		});
		jq('#order_report_page_container').find("[name='order_report_search_contract_id_container']").find("input").on('keydown', function(e){
			if(e.keyCode == 13){
			    self.seachContractContent("contract_id")
			}
		}).siblings().on('click', function(){
			self.seachContractContent("contract_id")
		});
		self.pickerDropAnchor = jq('.panel_calendar_time_container')[0];
		if (self.pickerDropAnchor && window.dropdownHelper) {
			window.dropdownHelper.addDropdownHandler(this);
		}
		var tmdate = new Date();
		var tmyear = tmdate.getFullYear();
		var tmmonth = tmdate.getMonth();
		var tmdays = CalendarHelper.prototype.getMonthDays([tmyear, tmmonth]);
		var tmfirst = new Date(tmyear, tmmonth, 1);
		var tmlast = new Date();
		var fromDateToString=self.fromDateToString;
		fromdate = fromDateToString(tmfirst);//当月1日
		todate = fromDateToString(tmlast);
		jq("#order_report_order_list_page_container").find('input[name=date-from]').val(fromdate);
        jq("#order_report_order_list_page_container").find('input[name=date-to]').val(todate);
		jq("#order_report_order_list_page_container").find('.panel_calendar_selitem').on('click', jq('.panel_calendar_time_container')[0], function (ev) {
			ev.originalEvent = ev.originalEvent || {};
			ev.originalEvent.dropdownDelegate = ev.data;
			var $self = jq(this);
			var left = $self[0].offsetWidth + $self[0].offsetLeft - 300;
			jq('.panel_calendar_time_container').css('left', left).show();
			var dateInput = $self.find('.panel_calendar_input');
			var calendar = self.setDatePicker(dateInput.val());
			jq('#order_report_stattrend_timepicker_confirm').off().on('click', function () {
			  var year = calendar.getCurrYear();
			  var month = calendar.getCurrMonth();
			  var date = calendar.getCurrDate();
			  dateInput.val(self.formatToDateString(year, month, date));
			  jq('.panel_calendar_time_container').hide();
			  var dateRange=self.getDateRange();
			  self.drawOrderList(dateRange);
			});
		  });
		jq("#order_report_report_list").on("click","[data-opr='view']",function(){
		    var dataIndex=jq(this).parent().attr("data-index");
			var sucaiId=self.listData&&self.listData[dataIndex]&&self.listData[dataIndex].ad_id||"";
			var type=self.listData&&self.listData[dataIndex]&&self.listData[dataIndex].type||"";
			self.showSeeDialog(sucaiId,type);
		});
		jq("#order_report_report_list").on("click","[data-opr='order_list']",function(){
		    var dataIndex=jq(this).parent().attr("data-index");
			var sucaiId=self.listData&&self.listData[dataIndex]&&self.listData[dataIndex].ad_id||"";
			var sucaiName=self.listData&&self.listData[dataIndex]&&self.listData[dataIndex].name||"";
			self.goToOrderListPage(sucaiId,sucaiName);
		});
		jq("#order_report_order_list_page_container").find('[name=order_report_return_first_page]').on('click', function(){
			self.togglePage("order_report_order_list_page_container","order_report_page_container");
		});
		jq("#order_report_order_list_page_container").find('[name=order_report_export_order_list]').on('click', function(){
			var user_id=my.paas.user_id;
			var url= paasHost + "/aquapaas/rest/comment/admin/export/";
			url+=self.namespace+"/";
			url+=self.objectType+"/";
			url+=encodeURIComponent(self.sucaiId)+"/";
			url+=self.approvalStatus;
			url+="?user_id=" + user_id;
			url+="&access_token=" + my.paas.access_token;
			url+="&app_key=" + paasAppKey;
			url+="&timestamp=" + new Date().toISOString();
            url+=self.getDateRange();
			window.open(url, "_blank");
		});
	},
	getDateRange:function(){
	    var jq=jQuery;
		var dateRange="";
		dateRange+="&start_time=";
		var startTime=encodeURIComponent(jq("#order_report_order_list_page_container").find('input[name=date-from]').val()+"T00:00:00+0800");
		dateRange+=startTime;
		dateRange+=  "&end_time=";
		var endTime=encodeURIComponent(jq("#order_report_order_list_page_container").find('input[name=date-to]').val()+"T23:59:59+0800");
		dateRange+=endTime;
		return dateRange
	},
	goToOrderListPage:function(sucaiId,sucaiName){
		this.togglePage("order_report_page_container","order_report_order_list_page_container");
		var title=sucaiName+i18n("ORDER_REPORT_ORDER_LIST");
		jQuery("#order_report_order_list_page_container").find('[name=order_report_second_page_title]').text(title);
		this.sucaiId=sucaiId;
		var dateRange=this.getDateRange();
		this.drawOrderList(dateRange);
	},
	togglePage:function(hidePage,showPage){
		var jq=jQuery;
		jq('#'+hidePage+'').hide();
		jq('#'+showPage+'').show();
	},
	drawOrderList:function(searchPara){
	    var self=this;
		var jq=jQuery;
		var listRow = 11;
		var titlesArray = [
			i18n('ORDER_REPORT_ORDER_ID'),
			i18n('ORDER_REPORT_ORDER_CREATE_TIME'),
			i18n('ORDER_REPORT_CLIENT_NAME'),
			i18n('ORDER_REPORT_CLIENT_GENDER'),
			i18n('ORDER_REPORT_CLIENT_PHONE'),
			i18n('ORDER_REPORT_ANSWER_CHOOSE'),
			i18n('ORDER_REPORT_ANSWER_TIME'),
			i18n('ORDER_REPORT_NOTE')
		];
		var titlesArrayLabel = (titlesArray.map(function(item){
			return {label:item};
		}));
		var listOrderList = new StyledList({
		  async: true,
		  rows: listRow,
		  columns: titlesArray.length,
		  containerId: 'order_report_order_list',
		  titles: titlesArrayLabel,
		  listType: 1,
		  data: [],
		  styles: {
			borderColor: 'transparent',
			borderWidth: 1,
			titleHeight: 46,
			titleBg: 'rgb(93,161,192)',
			titleColor: 'white',
			cellBg: 'white',
			evenBg: 'rgb(245,245,245)',
			cellColor: 'rgb(114,114,114)',
			footBg: 'white',
			footColor: 'rgb(121,121,121)',
			iconColor: 'rgb(93,161,192)',
			inputBorder: '1px solid rgb(203,203,203)',
			inputBg: 'white',
			columnsWidth: [0.1, 0.14, 0.09, 0.07, 0.09, 0.09, 0.11, 0.28]
		  }
		});
		this.listOrderList=listOrderList;
		this.listOrderList.getPageData = function (pageNumber,gotDataOrder) {
			var listSelf = this;
			self.gotDataOrder=gotDataOrder;
			var start = (pageNumber - 1) * listRow;
			var end = pageNumber * listRow - 1;
			var namespace=self.namespace;
			var object_type=self.objectType;
			var object_id=encodeURIComponent(self.sucaiId);
			var approvalStatus=self.approvalStatus;
			var url= paasHost + "/aquapaas/rest/comment/admin/comment/";
			url+=(namespace+"/");
			url+=(object_type+"/");
			url+=(object_id+"/");
			url+=approvalStatus;
			url = url + "?user_id=" + my.paas.user_id;
			url = url + "&access_token=" + my.paas.access_token;
			url = url + "&app_key=" + paasAppKey;
			url = url + "&timestamp=" + new Date().toISOString();
			url = url + "&mode=2";
			url += '&start=' + start;
            url += '&end=' + end;
			if(typeof searchPara!="undefined"){
				url+=searchPara
			};
			jQuery.ajax({
			  type: 'GET',
			  async: false,
			  url: url,
			  headers: {
				'x-aqua-sign': getPaaS_x_aqua_sign('GET', url),
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			  },
			  error: function (error) {
			  }
			}).done(function (data, status, xhr) {
				self.listOrderList.onTotalCount(xhr.getResponseHeader('x-aqua-total-count'));
				self.listDataOrderList = data;
				self.gotDataOrder(self.formListDataOrderList(data));
			}).fail(function(xhr) {
				self.listOrderList.onTotalCount(0);
				self.listDataOrderList = [];
				self.gotDataOrder([]);
			});

		};
		this.listOrderList.create();
	},
	showSeeDialog:function (ad_id,type) {//here
		var that = this;
		switch(type){
		  case "img":
			that.showSeeImgDialog(ad_id);
			break;
		  case "video":
			that.showSeeVideoDialog(ad_id);
			break;
		  case "subtitle":
			that.showSeeSubtitleDialog(ad_id)
			break;
		}
	},
	showSeeImgDialog:function (ad_id) {
		var that = this;
		var app = new PreviewModel();
		app.previewSuCai(ad_id, {
		  viewDennyMsg: true
		});
	},
	showSeeVideoDialog:function (ad_id) {
		var that = this;
		var app = new PreviewModel();
		app.previewSuCai(ad_id, {
		  viewDennyMsg: true
		});
	},
	showSeeSubtitleDialog:function (ad_id) {
		var that = this;
		var app = new PreviewModel();
		app.previewSuCai(ad_id, {
		  viewDennyMsg: true
		});
	},
	setDatePicker:function(target) {
		var calendarStyle = {
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
	    var self=this;
		if (self.pickerCalendar == null) {
		  var calendar = new Calendar('order_report_panel_time_picker_calendar');
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
		  self.pickerCalendar = calendar;
		}
		if (target != null && target != '') {
		  var dates = /(\d{4})-(\d{2})-(\d{2})/.exec(target);
		  self.pickerCalendar.setCurrDate({
			year: Number(dates[1]),
			month: Number(dates[2]) - 1,
			date: Number(dates[3])
		  });
		}
		return self.pickerCalendar;
	},
	formatToDateString:function(year, month, date) {
		var str = '';
		str += year;
		str += '-';
		str += preZero(month + 1, 2);
		str += '-';
		str += preZero(date, 2);
		return str;
	},
	drawList:function(searchPara){
	    var self=this;
		var jq=jQuery;
		var listRow = 11;
		var titlesArray = [
			i18n('ORDER_REPORT_SUCAI_NAME'),
			i18n('ORDER_REPORT_CREATOR'),
			i18n('ORDER_REPORT_CONTRACT_ID'),
			i18n('ORDER_REPORT_ORDER_NUM'),
			i18n('ORDER_REPORT_ORDER_OPR')
		];
		var titlesArrayLabel = (titlesArray.map(function(item){
			return {label:item};
		}));
		
		var list = new StyledList({
		  async: true,
		  rows: listRow,
		  columns: titlesArray.length,
		  containerId: 'order_report_report_list',
		  titles: titlesArrayLabel,
		  listType: 1,
		  data: [],
		  styles: {
			borderColor: 'transparent',
			borderWidth: 1,
			titleHeight: 46,
			titleBg: 'rgb(93,161,192)',
			titleColor: 'white',
			cellBg: 'white',
			evenBg: 'rgb(245,245,245)',
			cellColor: 'rgb(114,114,114)',
			footBg: 'white',
			footColor: 'rgb(121,121,121)',
			iconColor: 'rgb(93,161,192)',
			inputBorder: '1px solid rgb(203,203,203)',
			inputBg: 'white',
			columnsWidth: [0.367, 0.13, 0.149, 0.149, 0.199]
		  }
		});
		this.list=list;
		this.list.getPageData = function (pageNumber,gotData) {
			var listSelf = this;
			self.gotData=gotData;
			var start = (pageNumber - 1) * listRow;
			var end = pageNumber * listRow - 1;
			var url = paasHost + paasAdvDomain + "/ads/aditem/aditems";
			url+= "?user_id=" + my.paas.user_id;
			url+= "&access_token=" + my.paas.access_token;
			url+= "&app_key=" + paasAppKey;
			url+= "&timestamp=" + new Date().toISOString();
			url+= "&user_type="+ my.paas.user_type;
			url+= "&start="+ start;
			url+= "&end="+ end;
			if(typeof searchPara!="undefined"){
				url+=searchPara
			};
			if(my.paas.platform_current_id){
			  url = url + "&platform_id_list=" + encodeURIComponent(my.paas.platform_current_id);
			};
			jq.ajax({
			  type: "GET",
			  async: false,
			  url: url,
			  headers: {
				'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
			  },
			  contentType: "application/json",
			  dataType: "json"
			}).done(function (data, status, xhr) {
			    self.listData=data;
				self.list.onTotalCount(xhr.getResponseHeader('x-aqua-total-count'));
				self.listData = data;
				self.gotData(self.formListData(data));
				self.fillOrderNum(data);
			}).fail(function(xhr) {
				self.list.onTotalCount(0);
				self.listData = [];
				self.gotData([]);
			});
		};
		this.list.create();
	},
	fillOrderNum:function(data){
	    var self=this;
		var namespace=this.namespace;
		var objectType=this.objectType;
		var dataFormat = data.map(function (item) {
			return {
				"namespace": namespace,
				"object_id": item.ad_id||"",
				"object_type": objectType
			}
		});
		var url= paasHost + "/aquapaas/rest/comment/public/comments/summary";
		url = url + "?user_id=" + my.paas.user_id;;
		url = url + "&access_token=" + my.paas.access_token;
		url = url + "&app_key=" + paasAppKey;
		url = url + "&timestamp=" + new Date().toISOString();
		jQuery.ajax({
		  type: 'POST',
		  async: true,
		  url: url,
		  data:JSON.stringify(dataFormat),
		  headers: {
			'x-aqua-sign': getPaaS_x_aqua_sign('POST', url),
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		  },
		  error: function (error) {
		  }
		}).done(function (data) {
			self.fillOrderNumInTable(data)
		})
	},
	fillOrderNumInTable:function(data){
		var jq=jQuery;
		var listData=this.listData;
		for(var i= 0,len = listData.length;i<len;i++){
			var sucaiId=listData[i].ad_id||"";
			for(var j= 0,lenB = data.length;j<lenB;j++){
			  var objectId=data[j].object_id||"";
			  if(sucaiId==objectId){
				var count=data[j].comment_count;
				jq("#order_report_report_list").find("tbody").find("tr").eq(i).find("[name='sucai_order_num']").text(count);
				continue
			  }
			}
		}
	},
	formListData:function(){
		var self=this;
		var listData=self.listData;
		var formatData = [];
		for (var i = 0,len =listData.length; i < len; i++) {
			var ops = '<div class="oprs-all" data-index="' + i + '">';
			ops += '<div class="opr-default" data-opr="view">' + i18n("ORDER_REPORT_ORDER_VIEW") + '</div>';
			ops += '<div class="opr-default" data-opr="order_list">' + i18n("ORDER_REPORT_ORDER_LIST") + '</div>';
			ops += '</div>';
			ops += '</div>';
			ops += '</div>';
			var rowData = [{
				label: listData[i].name||""
			},
			{
				label: listData[i].user_name||""
			},
			{
				label: listData[i].contract_id||""
			},
			{
				label: "<span name=\"sucai_order_num\"></span>"
			},
			{
				label: ops
			}];
			formatData.push(rowData);
		}
		return formatData
	},
	formListDataOrderList:function(){
		var self=this;
		var listData=self.listDataOrderList;
		var formatData = [];
		try{
			for (var i = 0,len =listData.length; i < len; i++) {
			    var commentTextTransfer=[];
			    var commentText=((typeof listData[i].comment_text!="undefined")?listData[i].comment_text:"");
				var commentTextReplace=commentText.replace(/\\#/g,'@@@');
				commentTextTransfer=commentTextReplace.split("#");
				var rowData = [{
					label: listData[i].comment_id||""
				},
				{
					label: listData[i].comment_time?(listData[i].comment_time.substring(0,19).replace("T"," ")):""
				},
				{
					label: (typeof commentTextTransfer[0]!="undefined")?commentTextTransfer[0].replace(/\@@@/g,'#'):""
				},
				{
					label: (typeof commentTextTransfer[1]!="undefined")?commentTextTransfer[1].replace(/\@@@/g,'#'):""
				},
				{
					label: (typeof commentTextTransfer[2]!="undefined")?commentTextTransfer[2].replace(/\@@@/g,'#'):""
				},
				{
					label: (typeof commentTextTransfer[3]!="undefined")?commentTextTransfer[3].replace(/\@@@/g,'#'):""
				},
				{
					label: (typeof commentTextTransfer[4]!="undefined")?commentTextTransfer[4].replace(/\@@@/g,'#'):""
				},
				{
					label: (typeof commentTextTransfer[5]!="undefined")?commentTextTransfer[5].replace(/\@@@/g,'#'):""
				}];
				formatData.push(rowData);
			}
		}catch(e){	
		};
		return formatData;
	}
};
orderReport.init()
