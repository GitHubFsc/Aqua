var batchQuery = new Object();

batchQuery.init = function () {
	this.rowNum = 14;
	//绑定滚动条
	jQuery("#multiDetailList_resultTable").mCustomScrollbar({
		theme: "skyblue"
	});
	batchQuery.createTable();
	this.resizePage_container();
	this.smartCardIds = "";
};
batchQuery.createTable = function () {
	var container = jQuery("#multiDetailList_resultTable .mCSB_container");
	var html = "<table class=\"brodecastRecordTable\"><tbody>";
	for(var i = 0; i < this.rowNum; i++) {
		html += "<tr><td width=\"10%\">&nbsp;</td><td width=\"6%\">&nbsp;</td><td width=\"6%\">&nbsp;</td><td width=\"6%\">&nbsp;</td><td width=\"6%\">&nbsp;</td><td width=\"6%\">&nbsp;</td><td width=\"10%\">&nbsp;</td><td width=\"10%\">&nbsp;</td><td width=\"4%\">&nbsp;</td><td width=\"8%\">&nbsp;</td><td width=\"8%\">&nbsp;</td><td width=\"8%\">&nbsp;</td><td width=\"6%\">&nbsp;</td><td width=\"6%\">&nbsp;</td></tr>";
	};
	html += "</tbody></table>";
	container.append(html);
};
batchQuery.resizePage_container = function () {
	jQuery(window).unbind("resize");
	jQuery(window).resize(function () {
		batchQuery.resizePage();
	});
	batchQuery.resizePage();

};
/*
 * 自适应
 */
batchQuery.resizePage = function () {
	jQuery(".brodecastRecordTable tbody td").outerHeight(0); //初始化高度为0;
	var clientHeight = jQuery(window).height() - jQuery("#page_head_container").outerHeight();
	var topHeight = jQuery(".pageTitleContainer").outerHeight() + parseInt(jQuery("#multiDetailList_pageAllBody").css("margin-top").replace("px", "")) + jQuery(".pageAllBodyContainerTitle").outerHeight() + (jQuery(".spanDivContainer").outerHeight() === null ? 0 : jQuery(".spanDivContainer").outerHeight());
	var bottomHeight = 20;
	var tableHead = jQuery(".brodecastRecordTable thead td").outerHeight();
	jQuery(".brodecastRecordTable tbody td").outerHeight((clientHeight - topHeight - bottomHeight - tableHead) / 13);
	// jQuery("#tabs_content").outerHeight(clientHeight);
	jQuery(".multiDetailList_pageAllContainer").outerHeight(clientHeight);
	jQuery("#multiDetailList_resultTable").outerHeight(clientHeight - topHeight - bottomHeight - tableHead);
};
/*
 * 打开查询窗口
 */
batchQuery.openQueryWin = function (obj) {
	// if(!this.queryWin) {
	// 	this.queryWin = new queryWin({
	// 		isEdit: false,
	// 		data: {},
	// 		callback: batchQuery.seriesData
	// 	});
	// }
	if(jQuery(obj).attr("alt") !== 'edit') {
		jQuery(".popupCenterDivTop .popupCenterDivTopLeft").html("查询条件");
		this.queryWin = new queryWin({
			isEdit: false,
			// data: {},
			callback: batchQuery.seriesData
		});
		this.queryWin.create();
	} else {
		var data = jQuery('#multiDetailList_requestPanel').data('value')
		this.queryWin = new queryWin({
			isEdit: true,
			data: JSON.parse(data),
			callback: batchQuery.seriesData
		});
		this.queryWin.show();
		jQuery(".popupCenterDivTop .popupCenterDivTopLeft").html("编辑条件");
	};
};
batchQuery.query = function (data) {
	this.initTable();
	this.seriesData(data);

};
batchQuery.initTable = function () {
	jQuery(".brodecastRecordTable:eq(1) tbody").empty();
	for(var i = 0; i < this.rowNum; i++) {
		jQuery(".brodecastRecordTable:eq(1) tbody").append("<tr></tr>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"10%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"6%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"6%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"6%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"6%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"6%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"10%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"10%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"4%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"8%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"8%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"8%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"6%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"6%\">&nbsp;</td>");
	};
};
batchQuery.refreshRequestOnMainPanel = function () {
	jQuery("#multiDetailList_requestPanel").empty();
	jQuery("#multiDetailList_requestPanel").append(this.result.smart_card_ids.join("、") + "，"); //smartcard
	jQuery("#multiDetailList_requestPanel").append("(" + this.result.start_date + "--" + this.result.end_date + ")"); //daterange
	jQuery("#multiDetailList_requestPanel").append("<div alt=\"edit\" class=\"pageTitleContainerRightButt\" style=\"width:70px;height:30px;line-height:30px;margin:3px;font-size:14px;\" onclick=\"batchQuery.openQueryWin(this)\">编&nbsp;辑</div>"); //editBtn
};
batchQuery.seriesData = function (putData) {
	var data = putData.data
	var smartCardIds = data.smartCardIds;
	this.startDate = data.startDate;
	this.endDate = data.endDate;
	var po_type = data.poType;
	var po_ids = data.poids;
	var params = {
		"smart_card_ids": smartCardIds,
		"start_date": this.startDate,
		"end_date": this.endDate
	}
	var url = aquapaas_host + "/aquapaas/rest/multiapp/viewhistory/batch_query/detail?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
	url += "&potypes=" + po_type;
	jQuery('#multiDetailList_requestPanel').data('value', JSON.stringify(putData))
	batchQuery.queryData(url, params);
};
batchQuery.queryData = function (url, params) {
	var sign = getPaaS_x_aqua_sign("POST", url)
	jQuery.ajax({
		type: "POST",
		url: url,
		headers: {
			"accept": "application/multiapp-viewhistory",
			"content-type": "application/multiapp-viewhistory",
			"x-aqua-sign": sign
		},
		async: false,
		data: JSON.stringify(params),
		dataType: "json",
		error: function (xhr, err) {
			if(xhr.status == 500) {
				batchQuery.queryWin.hide();
			}
		}
	}).done(function (response) {
		batchQuery.result = response;
		batchQuery.loadData();
		batchQuery.resizePage();
		batchQuery.refreshRequestOnMainPanel();
	});
}
batchQuery.loadData = function () {
	var dataSet = this.result.result.items;
	var dataCount = 0;
	//清空
	jQuery("#multiDetailList_resultTable .mCSB_container .brodecastRecordTable tbody").empty();
	//加载
	for(var i = 0; i < dataSet.length; i++) {
		var html = ""; //详单
		var count = dataSet[i].details;
		if(count) {
			for(var j = 0; j < count.length; j++) {
				html = "<tr>";
				html += "<td width=\"10%\" title=\"" + this.validTableCell(dataSet[i].subscriber_id) + "\">" + this.validTableCell(dataSet[i].subscriber_id) + "</td>";
				html += "<td width=\"6%\" title=\"" + this.validTableCell(dataSet[i].subscriber_name) + "\">" + this.validTableCell(dataSet[i].subscriber_name) + "</td>";
				html += "<td width=\"6%\" title=\"" + this.validTableCell(dataSet[i].smart_card_id) + "\">" + this.validTableCell(dataSet[i].smart_card_id) + "</td>";
				html += "<td width=\"6%\" title=\"" + this.validTableCell(count[j].asset_name) + "\">" + this.validTableCell(count[j].asset_name) + "</td>";
				html += "<td width=\"6%\" title=\"" + this.validTableCell(count[j].purchase_time) + "\">" + this.validTableCell(count[j].purchase_time) + "</td>";
				html += "<td width=\"6%\" title=\"" + this.validTableCell(count[j].price).toString().replace(/&nbsp;/, "0") + "元" + "\">" + this.validTableCell(count[j].price).toString().replace(/&nbsp;/, "0") + "元" + "</td>";
				html += "<td width=\"10%\" title=\"" + this.validTableCell(count[j].view_begin_time) + "\">" + this.validTableCell(count[j].view_begin_time) + "</td>"; //starttime
				html += "<td width=\"10%\" title=\"" + this.validTableCell(count[j].view_end_time) + "\">" + this.validTableCell(count[j].view_end_time) + "</td>"; //endtime
				html += "<td width=\"4%\" title=\"" + this.getFormattedViewLengh(this.validTableCell(count[j].view_length)) + "\">" + this.getFormattedViewLengh(this.validTableCell(count[j].view_length)) + "</td>";
				html += "<td width=\"8%\" title=\"" + this.validTableCell(count[j].product_info) + "\">" + this.validTableCell(count[j].product_info) + "</td>";
				html += "<td width=\"8%\" title=\"" + this.validTableCell(count[j].bundle_info) + "\">" + this.validTableCell(count[j].bundle_info) + "</td>";
				html += "<td width=\"8%\" title=\"" + this.validTableCell(count[j].provider_id) + "\">" + this.validTableCell(count[j].provider_id) + "</td>";
				html += "<td width=\"6%\" title=\"" + this.validTableCell(count[j].provider_asset_id) + "\">" + this.validTableCell(count[j].provider_asset_id) + "</td>";
				html += "<td width=\"6%\" title=\"" + this.validTableCell(count[j].content_url) + "\">" + this.validTableCell(count[j].content_url) + "</td>";
				html += "</tr>";
				dataCount++;
				jQuery("#multiDetailList_resultTable .mCSB_container .brodecastRecordTable tbody").append(html);
			};
		} else {
			html = "<tr>";
			html += "<td width=\"10%\" title=\"" + this.validTableCell(dataSet[i].subscriber_id) + "\">" + this.validTableCell(dataSet[i].subscriber_id) + "</td>";
			html += "<td width=\"6%\" title=\"" + this.validTableCell(dataSet[i].subscriber_name) + "\">" + this.validTableCell(dataSet[i].subscriber_name) + "</td>";
			html += "<td width=\"6%\" title=\"" + this.validTableCell(dataSet[i].smart_card_id) + "\">" + this.validTableCell(dataSet[i].smart_card_id) + "</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "<td width=\"6%\">0元</td>";
			html += "<td width=\"10%\" title=\"" + this.validTableCell(dataSet[i].view_begin_time) + "\">" + this.validTableCell(dataSet[i].view_begin_time) + "</td>";
			html += "<td width=\"10%\" title=\"" + this.validTableCell(dataSet[i].view_end_time) + "\">" + this.validTableCell(dataSet[i].view_end_time) + "</td>";
			html += "<td width=\"4%\">&nbsp;</td>";
			html += "<td width=\"8%\">&nbsp;</td>";
			html += "<td width=\"8%\">&nbsp;</td>";
			html += "<td width=\"8%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "</tr>";
			dataCount++;
			jQuery("#multiDetailList_resultTable .mCSB_container .brodecastRecordTable tbody").append(html);
		};
	};
	//不撑满则补充满行数
	if(dataCount < this.rowNum) {
		for(var i = 0; i < this.rowNum - dataCount; i++) {
			var html = "<tr>";
			html += "<td width=\"10%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "<td width=\"10%\">&nbsp;</td>";
			html += "<td width=\"10%\">&nbsp;</td>";
			html += "<td width=\"4%\">&nbsp;</td>";
			html += "<td width=\"8%\">&nbsp;</td>";
			html += "<td width=\"8%\">&nbsp;</td>";
			html += "<td width=\"8%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "<td width=\"6%\">&nbsp;</td>";
			html += "</tr>";
			jQuery("#multiDetailList_resultTable .mCSB_container .brodecastRecordTable tbody").append(html);
		};
	};
};
batchQuery.dataPickerIssue = function () {
	var calendarStyles = {
		width: 200,
		navTitleHeight: 20,
		navTitleBgColor: '#0f84a1',
		datesViewHeight: 150,
		datesViewGridColor: '#e2e2e2',
		datesViewCellColor: '#ffffff',
		weekdaysHeight: 20,
		weekdaysColor: '#000000',
		currMonthColor: '#737373',
		nonCurrMonthColor: '#e2e2e2'
	};
	this.datePicker_startDate = new DatePicker({
		containerId: 'start_date',
		calendarStyles: calendarStyles,
		dateInputStyles: {
			borderColor: '#d3d3d3'
		},
		iconImage: 'images/smallCalendarIcon.png'
	});
	this.datePicker_endDate = new DatePicker({
		containerId: 'end_date',
		calendarStyles: calendarStyles,
		dateInputStyles: {
			borderColor: '#d3d3d3'
		},
		iconImage: 'images/smallCalendarIcon.png'
	});
	this.datePicker_startDate.onChange = function () {
		var datestr = this.getDateStr();
		jQuery("form[method=POST] input[name=start_date]").val(datestr);
		// console.log(datestr);
		if(jQuery(".dropDownListValue[name=dateRangeValue]").text() !== "" && jQuery(".dropDownListValue[name=dateRangeValue]").text() !== "自定义") {
			var addMonth = batchQuery.getMonthRange();
			var date = new Date(batchQuery.datePicker_startDate.getYear(), batchQuery.datePicker_startDate.getMonth() + batchQuery.getMonthRange(), batchQuery.datePicker_startDate.getDate());
			batchQuery.datePicker_endDate.setCurrDate({
				year: date.getFullYear(),
				month: date.getMonth(),
				date: date.getDate()
			});
		};
	};
	this.datePicker_endDate.onChange = function () {
		var datestr = this.getDateStr();
		// var year = this.getYear();
		// var month = this.getMonth();
		// var date = this.getDate();
		jQuery("form[method=POST] input[name=end_date]").val(datestr);
		// console.log(datestr);
	};
};
batchQuery.showDateRangeList = function () {
	var container = jQuery("#date_range_list");
	if(container.css("display") === "none") {
		jQuery("#date_range_list").css("display", "block");
	} else {
		jQuery("#date_range_list").css("display", "none");
	};

};
batchQuery.getMonthRange = function () {
	var monthRange = jQuery("[name=dateRangeValue]").text();
	switch(monthRange) {
	case "一个月":
		return 1;
	case "二个月":
		return 2;
	case "三个月":
		return 3;
	case "六个月":
		return 6;
	case "一年":
		return 12;
	default:
		return 0;
	}
};
batchQuery.validTableCell = function (value) {
	try {
		if(value === "" || value === undefined) {
			return "&nbsp";
		} else {
			return value;
		};
	} catch(e) {
		return "&nbsp";
	}
};
batchQuery.getFormattedViewLengh = function (value) {
	if(value.toString().indexOf("&nbsp") != -1) {
		return "&nbsp;"
	} else {
		var hours = Math.floor((value) / 60 / 60);
		var minitus = Math.floor((value - hours * 60 * 60) / 60);
		var seconds = Math.floor((value - hours * 60 * 60 - minitus * 60));
		if(hours < 9) {
			hours = "0" + hours;
		};
		if(minitus < 9) {
			minitus = "0" + minitus;
		};
		if(seconds < 9) {
			seconds = "0" + seconds;
		};
		return hours + ":" + minitus + ":" + seconds;
	}

}
batchQuery.init();
