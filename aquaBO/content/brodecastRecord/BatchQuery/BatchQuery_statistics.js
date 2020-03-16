var batchQueryStatistics = new Object();

batchQueryStatistics.init = function () {
	this.rowNum = 14;
	//绑定滚动条
	jQuery("#resultTable").mCustomScrollbar({
		theme: "skyblue"
	});
	batchQueryStatistics.createTable();
	this.resizePage_container();
	this.smartCardIds = "";
};
batchQueryStatistics.createTable = function () {
	var container = jQuery("#resultTable .mCSB_container");
	var html = "<table class=\"brodecastRecordTable\"><tbody>";
	for(var i = 0; i < this.rowNum; i++) {
		html += "<tr><td width=\"12%\">&nbsp;</td><td width=\"12%\">&nbsp;</td><td width=\"12%\">&nbsp;</td><td width=\"12%\">&nbsp;</td><td width=\"12%\">&nbsp;</td><td width=\"12%\">&nbsp;</td><td width=\"12%\">&nbsp;</td><td width=\"16%\">&nbsp;</td></tr>";
	};
	html += "</tbody></table>";
	container.append(html);
};
batchQueryStatistics.resizePage_container = function () {
	jQuery(window).unbind("resize");
	jQuery(window).resize(function () {
		batchQueryStatistics.resizePage();
	});
	batchQueryStatistics.resizePage();

};
/*
 * 自适应
 */
batchQueryStatistics.resizePage = function () {
	jQuery(".brodecastRecordTable tbody td").outerHeight(0); //初始化高度为0;
	var clientHeight = jQuery(window).height() - jQuery("#page_head_container").outerHeight();
	var topHeight = jQuery(".pageTitleContainer").outerHeight() + parseInt(jQuery("#pageAllBody").css("margin-top").replace("px", "")) + jQuery(".pageAllBodyContainerTitle").outerHeight() + (jQuery(".spanDivContainer").outerHeight() === null ? 0 : jQuery(".spanDivContainer").outerHeight());
	var bottomHeight = 20;
	var tableHead = jQuery(".brodecastRecordTable thead td").outerHeight();
	jQuery(".brodecastRecordTable tbody td").outerHeight((clientHeight - topHeight - bottomHeight - tableHead) / 13);
	jQuery("#page_container").outerHeight(clientHeight);
	jQuery(".pageAllContainer").outerHeight(clientHeight);
	jQuery("#resultTable").outerHeight(clientHeight - topHeight - bottomHeight - tableHead);
};
/*
 * 打开查询窗口
 */
batchQueryStatistics.openQueryWin = function (obj) {
	// if(!this.queryWin) {
	// 	this.queryWin = new queryWin({
	// 		isEdit: false,
	// 		data: {},
	// 		callback: batchQueryStatistics.seriesData
	// 	});
	// }
	if(jQuery(obj).attr("alt") !== 'edit') {
		this.queryWin = new queryWin({
			isEdit: false,
			// data: {},
			callback: batchQueryStatistics.seriesData
		});
		this.queryWin.create();
		jQuery(".popupCenterDivTop .popupCenterDivTopLeft").html("查询条件");
	} else {
		var data = jQuery('[name=requestPanel]').data('value')
		this.queryWin = new queryWin({
			isEdit: true,
			data: JSON.parse(data),
			callback: batchQueryStatistics.seriesData
		});
		this.queryWin.show();
		jQuery(".popupCenterDivTop .popupCenterDivTopLeft").html("编辑条件");
	};
};
batchQueryStatistics.query = function (data) {
	this.initTable();
	this.seriesData(data);

};
batchQueryStatistics.initTable = function () {
	jQuery(".brodecastRecordTable:eq(1) tbody").empty();
	for(var i = 0; i < this.rowNum; i++) {
		jQuery(".brodecastRecordTable:eq(1) tbody").append("<tr></tr>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"12%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"12%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"12%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"12%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"12%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"12%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"12%\">&nbsp;</td>");
		jQuery(".brodecastRecordTable:eq(1) tbody tr:eq(" + i + ")").append("<td width=\"16%\">&nbsp;</td>");
	};
};
batchQueryStatistics.refreshRequestOnMainPanel = function () {
	jQuery("[name=requestPanel]").empty();
	jQuery("[name=requestPanel]").append(this.result.smart_card_ids.join("、") + "，"); //smartcard
	jQuery("[name=requestPanel]").append("(" + this.result.start_date + "--" + this.result.end_date + ")"); //daterange
	jQuery("[name=requestPanel]").append("<div alt=\"edit\" class=\"pageTitleContainerRightButt\" style=\"width:70px;height:30px;line-height:30px;margin:3px;font-size:14px;\" onclick=\"batchQueryStatistics.openQueryWin(this)\">编&nbsp;辑</div>"); //editBtn
};
batchQueryStatistics.seriesData = function (putData) {
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
	var url = aquapaas_host + "/aquapaas/rest/multiapp/viewhistory/batch_query/statistics?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
	url += "&potypes=" + po_type;
	jQuery('[name=requestPanel]').data('value', JSON.stringify(putData))
	batchQueryStatistics.queryData(url, params);
};
batchQueryStatistics.queryData = function (url, params) {
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
				batchQueryStatistics.queryWin.hide();
			}
		}
	}).done(function (response) {
		batchQueryStatistics.result = response;
		batchQueryStatistics.loadData();
		batchQueryStatistics.resizePage();
		batchQueryStatistics.refreshRequestOnMainPanel();
	});
}
batchQueryStatistics.loadData = function () {
	var dataSet = this.result.result.items;
	var dataCount = 0;
	//清空
	jQuery("#resultTable .mCSB_container .brodecastRecordTable tbody").empty();
	//加载
	for(var i = 0; i < dataSet.length; i++) {
		var html = "";
		// if(type === 0) { //统计
		html = "<tr>";
		html += "<td width=\"12%\" title=\"" + this.validTableCell(dataSet[i].subscriber_id) + "\">" + this.validTableCell(dataSet[i].subscriber_id) + "</td>";
		html += "<td width=\"12%\" title=\"" + this.validTableCell(dataSet[i].subscriber_name) + "\">" + this.validTableCell(dataSet[i].subscriber_name) + "</td>";
		html += "<td width=\"12%\" title=\"" + this.validTableCell(dataSet[i].smart_card_id) + "\">" + this.validTableCell(dataSet[i].smart_card_id) + "</td>";
		html += "<td width=\"12%\" title=\"" + this.validTableCell(dataSet[i].statistics === undefined ? "&nbsp;" : dataSet[i]["statistics"].total_purchase_success) + "\">" + this.validTableCell(dataSet[i].statistics === undefined ? "&nbsp;" : dataSet[i]["statistics"].total_purchase_success) + "</td>";
		html += "<td width=\"12%\" title=\"" + this.validTableCell(dataSet[i].statistics === undefined ? "0元" : (dataSet[i]["statistics"].total_purchase_price) + "元") + "\">" + this.validTableCell(dataSet[i].statistics === undefined ? "0元" : (dataSet[i]["statistics"].total_purchase_price) + "元") + "</td>";
		html += "<td width=\"12%\" title=\"" + this.validTableCell(dataSet[i].statistics === undefined ? "&nbsp;" : dataSet[i]["statistics"].total_view_count) + "\">" + this.validTableCell(dataSet[i].statistics === undefined ? "&nbsp;" : dataSet[i]["statistics"].total_view_count) + "</td>";
		html += "<td width=\"12%\" title=\"" + this.validTableCell(dataSet[i].statistics === undefined ? "&nbsp;" : this.getFormattedViewLengh(dataSet[i]["statistics"].total_view_length)) + "\">" + this.validTableCell(dataSet[i].statistics === undefined ? "&nbsp;" : this.getFormattedViewLengh(dataSet[i]["statistics"].total_view_length)) + "</td>";
		html += "<td width=\"16%\" title=\"" + this.result.start_date + "--" + this.result.end_date + "\">" + this.result.start_date + "--" + this.result.end_date + "</td>";
		html += "</tr>";
		dataCount++;
		jQuery("#resultTable .mCSB_container .brodecastRecordTable tbody").append(html);
		// }
	};
	//不撑满则补充满行数
	if(dataCount < this.rowNum) {
		for(var i = 0; i < this.rowNum - dataCount; i++) {
			var html = "<tr>";
			html += "<td width=\"12%\">&nbsp;</td>";
			html += "<td width=\"12%\">&nbsp;</td>";
			html += "<td width=\"12%\">&nbsp;</td>";
			html += "<td width=\"12%\">&nbsp;</td>";
			html += "<td width=\"12%\">&nbsp;</td>";
			html += "<td width=\"12%\">&nbsp;</td>";
			html += "<td width=\"12%\">&nbsp;</td>";
			html += "<td width=\"16%\">&nbsp;</td>";
			html += "</tr>";
			jQuery("#resultTable .mCSB_container .brodecastRecordTable tbody").append(html);
		};
	};
};
batchQueryStatistics.dataPickerIssue = function () {
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
			var addMonth = batchQueryStatistics.getMonthRange();
			var date = new Date(batchQueryStatistics.datePicker_startDate.getYear(), batchQueryStatistics.datePicker_startDate.getMonth() + batchQueryStatistics.getMonthRange(), batchQueryStatistics.datePicker_startDate.getDate());
			batchQueryStatistics.datePicker_endDate.setCurrDate({
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
batchQueryStatistics.showDateRangeList = function () {
	var container = jQuery("#date_range_list");
	if(container.css("display") === "none") {
		jQuery("#date_range_list").css("display", "block");
	} else {
		jQuery("#date_range_list").css("display", "none");
	};

};
batchQueryStatistics.getMonthRange = function () {
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
batchQueryStatistics.validTableCell = function (value) {
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
batchQueryStatistics.getFormattedViewLengh = function (value) {
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
batchQueryStatistics.init();
