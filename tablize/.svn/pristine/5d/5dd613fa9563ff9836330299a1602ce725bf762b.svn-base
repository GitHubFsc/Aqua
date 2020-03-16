var batchExport = new Object();
batchExport.init = function () {
	this.resizePage_container();
	this.initParam();
};
batchExport.initParam = function () {
	this.startIndex = 1;
	this.endIndex = 13;
	//this.spliter = [1,2,3,4,5,6,7,8,9,10];
	this.cur = null; //当前页按钮
	this.pageSize = 13;
	this.rowSize = parseInt((window.screen.width - 140) / 146);
	this.totalPage = 0; //总页数
	this.curPage = 1; //当前页
	this.spliter = new SpliterTwo("batchExport.spliter", "exportTask_page_spliter", this.pageSize,
		this.callBack, "skyblue");
	this.popupSource = "multiDetail";
	this.heightFromInnerToOuter = {
		date_notSelfDefined_inactive: ["284px", "284px"],
		date_selfDefined_inactive: ["328px", "328px"],
		date_notSelfDefined_active: ["284px", "284px"],
		date_selfDefined_active: ["372px", "372px"]
	}
	this.beginDate = "";
	this.endDate = "";
	this.month_(1);
};
batchExport.resizePage_container = function () {
	jQuery("#popup-dialog-dialog").remove();
	jQuery("#popup-dialog-mask").remove();
	jQuery(window).unbind("resize");
	jQuery(window).resize(function () {
		batchExport.resizePage();
	});
	batchExport.resizePage();
};
batchExport.resizePage = function () {
	jQuery(".brodecastRecordTable tbody td").outerHeight(0); //初始化高度为0;
	var clientHeight = jQuery(window).height() - jQuery("#page_head_container").outerHeight();
	var topHeight = jQuery(".pageTitleContainerB").outerHeight() + parseInt(jQuery(
		"#exportTask_pageAllBody").css("margin-top").replace("px", "")) + jQuery(
		".pageAllBodyContainerTitle").outerHeight() + (jQuery(".spanDivContainer").outerHeight() ===
		null ? 0 : jQuery(".spanDivContainer").outerHeight());
	var bottomHeight = 20;
	var tableHead = jQuery(".brodecastRecordTable thead td").outerHeight();
	jQuery(".brodecastRecordTable tbody td").outerHeight((clientHeight -
		topHeight - bottomHeight - tableHead) / 13);
	// jQuery("#tabs_content").outerHeight(clientHeight);
	jQuery(".exportTask_pageAllContainer").outerHeight(clientHeight);
	jQuery("#exportTask_resultTable").outerHeight(clientHeight - topHeight - bottomHeight -
		tableHead);
};
/*
 * 打开查询窗口
 */
batchExport.openQueryWin = function (el) {
	var _this = this,
		_type = jQuery(el).data("type");
	switch(_type) {
	case "detail":
	case "statistics":
		_this.queryWin = new BatchExportQuery({
			isEdit: false,
			data: {},
			callback: function (data) {
				data.jobName = jQuery("input#missionDesc").val();
				batchExport.query(data);
			}
		});
		break;
	case "user":
		_this.queryWin = new PopupDialog({
			url: "content/brodecastRecord/BatchExport/popupDiv-activeInactive.html",
			width: 462,
			height: 284,
			context: this
		});
		break;
	case "broadcast":
		_this.queryWin = new PopupDialog({
			url: 'content/brodecastRecord/BatchExport/BatchExportWinForBroadcast.html',
			width: 463,
			height: 386,
			callback: batchExport.queryWinEventBindForBroadcast,
			context: _this,
			ajaxOnEachCreate: true
		});
		break;
	default:

	}
	_this.queryWin.create();
	_this.queryWin.show();
	if(el.alt !== 'edit') {
		jQuery(".popupCenterDivTop .popupCenterDivTopLeft").html("查询条件");
	} else {
		jQuery(".popupCenterDivTop .popupCenterDivTopLeft").html("编辑条件");
	};
};
/*
 * 弹出窗口事件绑定
 */
batchExport.queryWinEventBind = function () {
	//关闭按钮事件
	jQuery(".popupCenterDivTop img").bind("click", function () {
		batchExport.queryWin.hide();
	});
	//查询按钮事件
	jQuery("[name='popUpQueryBtn']").bind("click", function () {
		batchExport.query();
	});
	//取消按钮事件
	jQuery("[name='popUpCancelBtn']").bind("click", function () {
		batchExport.queryWin.hide();
	});
	//单选
	jQuery('[name=radio1]').bind("click", function (event) {
		jQuery('[name=radio1]').removeClass("radio_selected").addClass("radio");
		jQuery(event.target).removeClass("radio").addClass("radio_selected");
	});
	//添加按钮事件
	jQuery("[name=addSmartCard]").bind("click", this.addSmartCardFloatDiv);
	//添加csv文件按钮
	jQuery(".pageTitleContainerRightButt[name=inputFileBtn]").bind("click", this.uploadFile);
	//上传按钮事件
	jQuery(".popupCenterDivBodyRow input[type=file]").bind("change", function () {
		jQuery("#inputfilevalue").text(this.value);
	});
	//任务描述
	jQuery(".popupCenterDivBodyRow input[name=jobNameInput]").bind("input",
		function () {
			jQuery("form input[name=job_name]").val(this.value);
		});
	//表单提交事件绑定
	jQuery('#submitForm').bind('submit', function (event) {
		event.preventDefault();
		if(jQuery("#broSingle_selfDefine").text() != "自定义") //自定义时间
		{
			if(jQuery(this).find("[name=start_date]").val() === "") {
				alert("请选择开始日期");
				return;
			}
			if(jQuery(this).find("[name=end_date]").val() === "") {
				alert("请选择结束日期");
				return;
			}
		}
		// if (jQuery(this).find("[type=file]").val() === "") {
		// if (jQuery("#inputfile").text().trim() === "" && jQuery(this).find(
		// 		"#smart_card_ids").val() === "") {
		// 	alert("请选择导入文件或添加智能卡号");
		// 	return;
		// }
		if(jQuery(this).find("[name=job_name]").val() === "") {
			var msg = confirm('任务描述没有填写！选择确认则自动帮您生成任务描述！');
			if(!msg) {
				return;
			}
		} else if(jQuery(this).find("[name=job_name]").val().search(
				/[\\]|[\/]|[\:]|[\*]|[\?]|[\"]|[\']|[\<]|[\>]|[\|]/) != -1) {
			alert("任务描述名称不能包含下列字符：\\\/:*?\"'<>|");
			return;
		};
		jQuery(this).ajaxSubmit({
			success: function () {
				batchExport.spliter.topage(1, true);
				batchExport.queryWin.hide();
			}
		});
	});
	//组合类型下拉按钮
	jQuery("[name=selectionTypeListBtn],[name=selectionTypeValue]").bind("click", function () {
		jQuery("#selection_type_list").toggle();
	});
	//选择组合类型
	jQuery("#selection_type_list dd").bind("click", function () {
		var value = jQuery(this).text();
		jQuery("[name=selectionTypeValue]").text(value);
		jQuery("[name=selectionTypeListBtn]").click();
		if(value == "预设组合") {
			var html = "";
			for(var i = 0; i < BROADCAST_PO_DEFAULT.length; i++) {
				var item = BROADCAST_PO_DEFAULT[i];
				html += "<div class='selection_item' data-index='" + i + "' onclick='batchExport.selectASelection(this)'>" + item.name + "</div>"
			};
			jQuery("#selection_list").empty().append(html);
			jQuery("#selection_list").show();
			jQuery("#service_pack_list").addClass("disabled");
			jQuery("#potypes_list").addClass("disabled");
		} else {
			jQuery("input[name=poIdsValue]").val("").removeAttr("disabled");
			jQuery("#selection_list").hide();
			jQuery("#service_pack_list").removeClass("disabled");
			jQuery("#potypes_list").removeClass("disabled");
		};
	});
	//服务包下拉按钮
	jQuery("[name=servicePackBtn],[name=servicePackValue]").bind("click", function () {
		var enable = !jQuery("#service_pack_list").hasClass("disabled");
		if(enable) {
			jQuery("#service_pack_list").toggle();
		}
	});
	//选择服务包
	jQuery("#service_pack_list dd").bind("click", function () {
		//alert(jQuery(this).text());
		jQuery("[name=servicePackValue]").text(jQuery(this).text());
		jQuery("[name=servicePackBtn]").click();
	});
	//点播类型下拉按钮
	jQuery("[name=potypesBtn],[name=potypesValue]").bind("click", function () {
		var enable = !jQuery("#potypes_list").hasClass("disabled");
		if(enable) {
			jQuery("#potypes_list").toggle();
		}
	});
	//选择点播类型
	jQuery("#potypes_list dd").bind("click", function () {
		jQuery("[name=potypesValue]").text(jQuery(this).text());
		jQuery("[name=potypesBtn]").click();
		if(jQuery("[name=potypesValue]").text() == "SVOD") {
			jQuery("form input[name=po_type]").val("2,5"); //为form中的点播类型赋值
		}
		if(jQuery("[name=potypesValue]").text() == "RVOD") {
			jQuery("form input[name=po_type]").val("1,3"); //为form中的点播类型赋值
		}
	});
	//日历
	batchExport.dataPickerIssue();
	//日期范围下拉按钮
	jQuery("[name=dropDownListBtn]").bind("click", function () {
		jQuery("#date_range_list").toggle();
	});
	//点击按钮旁的框也出现下拉框
	jQuery("[name=dateRangeValue]").bind("click", function () {
		jQuery("#date_range_list").toggle();
	});
	//选择日期范围
	jQuery("#date_range_list dd").bind("click", function () {
		jQuery("[name=dateRangeValue]").text(jQuery(this).text());
		jQuery("[name=dropDownListBtn]").click();
		if(jQuery("#start_date input").val() !== "") {
			var date = new Date(batchExport.datePicker_startDate.getYear(),
				batchExport.datePicker_startDate.getMonth() + batchExport.getMonthRange(),
				batchExport.datePicker_startDate.getDate());
			batchExport.datePicker_endDate.setCurrDate({
				year: date.getFullYear(),
				month: date.getMonth(),
				date: date.getDate()
			});
		}
	});
	//绑定滚动条
	jQuery(".popupCenterDivBodyRow[name=smartCardContainer]").mCustomScrollbar({
		theme: 'skyblue'
	});
};

/*
 * 弹出窗口事件绑定broadcast
 */
batchExport.queryWinEventBindForBroadcast = function () {
	var _parent = this,
		_this = this.queryWin;
	_this._data = {};
	//关闭按钮事件
	jQuery(".popupCenterDivTop img").bind("click", function () {
		_this.hide();
	});
	//查询按钮事件
	jQuery("[name='popUpQueryBtn']").bind("click", function () {
		_this._data.pid = jQuery("input[name=providerid]").val();
		_this._data.paid = jQuery("input[name=providerassetid]").val();
		_this._data.jobName = jQuery("input#missionDesc").val();
		_parent.query(_this._data);
		_this.close();
	});
	//取消按钮事件
	jQuery("[name='popUpCancelBtn']").bind("click", function () {
		_this.hide();
	});

	//日期范围下拉框
	_this.dateRangeComb = new StyledSelector({
		containerId: "dateRangeSelector",
		options: [{
			label: "一个月",
			value: "1"
			}, {
			label: "二个月",
			value: "2"
			}, {
			label: "三个月",
			value: "3"
			}, {
			label: "六个月",
			value: "6"
			}, {
			label: "一年",
			value: "12"
			}],
		styles: {
			optionHeight: '28px',
			iconColor: "#2ea2d7"
		}
	});
	_this.dateRangeComb.onChange = function (selector) {
		if(selector.value !== "自定义") {
			var _cur_date = new Date();
			_this._data.endDate = _cur_date.getFullYear() + "-" + batchExport.zerolize(_cur_date.getMonth() + 1, 2) + "-" + batchExport.zerolize(_cur_date.getDate(), 2);
			var _begin_d = new Date(_cur_date);
			_begin_d.setMonth(_begin_d.getMonth() - Number(selector.value));
			_this._data.startDate = _begin_d.getFullYear() + "-" + batchExport.zerolize(_begin_d.getMonth() + 1, 2) + "-" + batchExport.zerolize(_begin_d.getDate(), 2);
		}
	};
	_this.dateRangeComb.create();
	_this.dateRangeComb.setValue("1");
	//自定义/取消自定义
	jQuery("#setCustomize").bind('click', function () {
		var _isCustomized = jQuery(this).hasClass("customized") ? true : false;
		jQuery(this).removeClass(_isCustomized ? "customized" : "customize").addClass(_isCustomized ? "customize" : "customized");
		if(_isCustomized) {
			jQuery("#start_date_row,#end_date_row").hide();
			_this.dateRangeComb.updateOptions([{
				label: "一个月",
				value: "1"
				}, {
				label: "二个月",
				value: "2"
				}, {
				label: "三个月",
				value: "3"
				}, {
				label: "六个月",
				value: "6"
				}, {
				label: "一年",
				value: "12"
				}]);
			_this.dateRangeComb.enable();
			_this._data._isCustomized = true;
		} else {
			jQuery("#start_date_row,#end_date_row").show();
			_this.dateRangeComb.updateOptions([{
				label: "自定义",
				value: "自定义"
			}]);
			_this.dateRangeComb.setValue("自定义");
			_this.dateRangeComb.disable();
			_this._data._isCustomized = false;
		}
	});

	//开始日期，结束日期
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
	_this.datePicker_startDate = new DatePicker({
		containerId: 'start_date',
		calendarStyles: calendarStyles,
		dateInputStyles: {
			borderColor: '#d3d3d3'
		},
		iconImage: 'images/smallCalendarIcon.png'
	});
	_this.datePicker_endDate = new DatePicker({
		containerId: 'end_date',
		calendarStyles: calendarStyles,
		dateInputStyles: {
			borderColor: '#d3d3d3'
		},
		iconImage: 'images/smallCalendarIcon.png'
	});
	_this.datePicker_startDate.onChange = function () {
		var datestr = this.getDateStr();
		_this._data.startDate = datestr;
	};
	_this.datePicker_endDate.onChange = function () {
		var datestr = this.getDateStr();
		_this._data.endDate = datestr;
	};
};
//点击服务包中的servicepackage
batchExport.service_ServicePackClick = function () {
	jQuery("[name=servicePackValue]").text("ServicePackage");
	jQuery("[name=servicePackBtn]").click();
};
//点击服务包中的poid
batchExport.service_POIClick = function () {
	jQuery("[name=servicePackValue]").text("POID");
	jQuery("[name=servicePackBtn]").click();
};
batchExport.addSmartCardFloatDiv = function (event) {
	var smartCardValue = jQuery(event.target).prev().find('input').val();
	var isExist = true;
	var val = jQuery("form input#smart_card_ids").val();
	var len = val.length;
	var ids = val.split(",");
	if(ids.contains(smartCardValue) === -1 && smartCardValue !== "") {
		isExist = false;
	}
	if(!isExist) {
		jQuery("form input#smart_card_ids").val(val + (len > 0 ? "," : "") +
			smartCardValue);
		var smartCardFloatDiv = document.createElement("div");
		smartCardFloatDiv.className = "smartCardFloatDiv";
		smartCardFloatDiv.innerHTML =
			"<div class=\"deleteIcon\" onclick=\"batchExport.deleteSmartCardFloatDiv(this)\"></div>" +
			smartCardValue;
		jQuery(".popupCenterDivBodyRow[name='smartCardContainer'] .mCSB_container").append(
			smartCardFloatDiv);
		//清空
		jQuery(event.target).prev().find('input').val("");
	}
};
batchExport.deleteSmartCardFloatDiv = function (obj) {
	var floatDiv = jQuery(obj.parentNode);
	var id = jQuery(floatDiv).text();
	var ids = jQuery("form #smart_card_ids").val().split(",");
	ids.remove(id);
	floatDiv.remove();
	jQuery("form #smart_card_ids").val(ids.join(","));
};
batchExport.uploadFile = function (event) {
	if(jQuery(event.target).attr("name") === "inputFileBtn") {
		var upload = jQuery("form[method=POST] input[type=file]");
		upload.bind("change", function () {
			var files = this.files;
			if(files.length) {
				var file = files[0];
				var reader = new FileReader();
				reader.onload = function () {
					var old_ = array_ = this.result.split("\r\n");
					var new_ = [];
					for(var a = 0; a < old_.length; a++) {
						if(old_[a] == "") {
							continue
						} else {
							new_.push(old_[a])
						}
					}

					var temp_ = batchExport.queryWin;
					temp_._data.smartCardIds = new_;
					temp_.reload_card_table_();
					document.getElementById("aquaBO_importFileText").innerHTML = file.name
						//queryWin._data.smartCardIds
				};
				reader.readAsText(file);
			}

			if(/.csv$/.test(this.value)) {
				jQuery("#aquaBO_importFile").attr("src", "images/importB.png").empty().append(
					"<div onclick=\"batchExport.uploadFile(this)\" class=\"deleteIcon\"></div>" +
					this.value);
				jQuery(this).unbind('change');
			} else {
				alert("文件格式错误，请重新选择");
				return;
			};
		});
		upload.click();
	} else {
		jQuery("#aquaBO_importFile").attr("src", "images/importB.png").empty();
	};
};
batchExport.selectASelection = function (el) {
	var index = jQuery(el).data("index");
	var type = BROADCAST_PO_DEFAULT[index].POTYPE;
	var poids = BROADCAST_PO_DEFAULT[index].POIDS;
	jQuery("[name=potypesValue]").text(type);
	switch(type) {
	case "SVOD":
		jQuery("form input[name=po_type]").val("2,5");
		break;
	case "RVOD":
		jQuery("form input[name=po_type]").val("1,3");
		break;
	default:
		jQuery("form input[name=po_type]").val("1,2,3,5");
		break;
	}
	jQuery("[name=servicePackValue]").text("PO ID");
	jQuery("input[name=servicePackInput]").val(poids).attr("disabled", true);
	jQuery(el).parent().hide();
}
batchExport.query = function (data) {
	var smartCardIds = data.smartCardIds;
	var startDate = data.startDate;
	var endDate = data.endDate;
	var jobName = data.jobName;
	var po_type_original = data.poType;
	var po_type = "";
	var po_ids = data.poids;
	var pid = data.pid;
	var paid = data.paid;
	switch(po_type_original) {
	case "2,5":
	case "SVOD":
		po_type = "2,5";
		break;
	case "1,3":
	case "RVOD":
		po_type = "1,3";
		break;
	case "":
		po_type = "1,2,3,5";
		break;
	default:
		po_type = "1,3,2,5,60010000,60010002,60010010,60010011,60010012";
		break;
	}
	jQuery("form input[name=job_name]").val(jobName); //模拟数据
	jQuery("form input#smart_card_ids").val(smartCardIds);
	// jQuery("form input[name=po_type]").val(po_type);
	// jQuery("form input[name=po_type]").val(po_type);
	jQuery("form input[name=start_date]").val(startDate);
	jQuery("form input[name=end_date]").val(endDate);
	var isDetail = "";
	var poid__ = "";
	var url_param = [];
	url_param.push("app_key=" + paasAppKey);
	url_param.push("timestamp=" + new Date().toISOString());
	if(po_type == "60010000,60010002,60010010,60010011,60010012" || po_type == "1,3,2,5,60010000,60010002,60010010,60010011,60010012") {
		poid__ = "";
	} else {
		poid__ = "&poids=" + po_ids + "";
	}
	if(po_type) {
		url_param.push("potypes=" + po_type + poid__);
	}
	if(pid && paid) {
		url_param.push("providerid=" + pid + "&providerassetid=" + paid)
	}
	if(batchExport.popupSource == "multiStatistic") {
		isDetail = "statistics";
	} else {
		isDetail = "detail"
	}
	var url_ = aquapaas_host + '/aquapaas/rest/multiapp/viewhistory/batch_job/' + isDetail + '?' + url_param.join("&");
	jQuery('#submitForm').attr('action', url_);

	if(startDate == "") {
		alert("请选择开始日期");
		return;
	}
	if(endDate == "") {
		alert("请选择结束日期");
		return;
	}
	jQuery('#submitForm').bind('submit', function (event) {
		event.preventDefault();
		if(jQuery(this).find("[name=job_name]").val() === "") {
			return;
			var msg = confirm('任务描述没有填写！选择确认则自动帮您生成任务描述！');
			if(!msg) {
				return;
			}
		} else if(jQuery(this).find("[name=job_name]").val().search(/[\\]|[\/]|[\:]|[\*]|[\?]|[\"]|[\']|[\<]|[\>]|[\|]/) != -1) {
			alert("任务描述名称不能包含下列字符：\\\/:*?\"'<>|");
			return;
		} else {
			var sign = getPaaS_x_aqua_sign("POST", url_)
			jQuery(this).ajaxSubmit({
				headers: {
				"x-aqua-sign": sign
				},
				success: function () {
					batchExport.spliter.topage(1, true);
				}
			});
		}
	});
	jQuery('#submitForm').submit();
};
batchExport.dataPickerIssue = function () {
	var calendarStyles = {
		width: 200,
		navTitleHeight: 20,
		navTitleBgColor: '#2ea1d7',
		datesViewHeight: 150,
		datesViewGridColor: '#e2e2e2',
		datesViewCellColor: '#ffffff',
		weekdaysHeight: 20,
		weekdaysColor: '#000000',
		currMonthColor: '#737373',
		nonCurrMonthColor: '#e2e2e2'
	};
	this.datePicker_startDate = new DatePicker({
		containerId: 'date-input-from',
		calendarStyles: calendarStyles,
		dateInputStyles: {
			borderColor: '#d3d3d3'
		},
		iconImage: 'images/smallCalendarIcon.png'
	});
	this.datePicker_startDate.onChange = function () {
		var datestr = this.getDateStr();
		jQuery("form[method=POST] input[name=start_date]").val(datestr);
	};
	this.datePicker_endDate = new DatePicker({
		containerId: 'date-input-to',
		calendarStyles: calendarStyles,
		dateInputStyles: {
			borderColor: '#d3d3d3'
		},
		iconImage: 'images/smallCalendarIcon.png'
	});
	this.datePicker_endDate.onChange = function () {
		var datestr = this.getDateStr();
		jQuery("form[method=POST] input[name=end_date]").val(datestr);
	};
}
batchExport.showDateRangeList = function () {
	var container = jQuery("#date_range_list");
	if(container.css("display") === "none") {
		jQuery("#date_range_list").css("display", "block");
	} else {
		jQuery("#date_range_list").css("display", "none");
	};
};
batchExport.getMonthRange = function () {
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
/***************************************分页控制************************************/
batchExport.callBack = function (curPage, pageSize) {
	batchExport.curPage = curPage;
	batchExport.pageSize = pageSize;
	batchExport.queryData();
	batchExport.fillData();
	return batchExport.totalPage;
};
batchExport.queryData = function () {
	this.startIndex = (this.curPage - 1) * this.pageSize + 1;
	this.endIndex = this.curPage * this.pageSize;
	this.dataSet = [];
	this.totalCount = 0;
	jQuery.ajax({
		url: aqua_host + '/aqua/rest/cdmi/cdmi_query/?range=' + this.startIndex +
			"-" + this.endIndex + "&sort=metadata.cdmi_mtime-",
		type: 'PUT',
		headers: {
			'Accept': 'application/cdmi-node',
			'Content-Type': 'application/cdmi-node',
			//"Authorization", "AQUA " + my.aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my.aqua.secretAccessKey, StringToSign)),
			'x-aqua-date': new Date().getTime(),
			'x-aqua-read-reference-redirect': false
		},
		async: false,
		data: JSON.stringify({
			'cdmi_scope_specification': [{
				'parentURI': '== ' + aquapaas_job_container,
				'metadata': {
					'cdmi_job_action': 'multi- mapreduce_multiapp_viewhistory_batch,mapreduce_multiapp_viewhistory_activeuserset'
				}
			}]
		}),
		dataType: 'json'
	}).done(function (response) {
		var items = response.objects;
		batchExport.totalCount = response.count;
		for(var i = 0; i < items.length; i++) {
			try {
				var data = {};
				data.objectName = items[i].objectName;
				data.action = items[i].metadata.cdmi_job_action_params[5];
				if(items[i].metadata.cdmi_job_status) {
					data.completionStatus = items[i].metadata.cdmi_job_status;
					data.cdmi_job_startTime = items[i].metadata.cdmi_job_startTime;
					data.cdmi_job_endTime = items[i].metadata.cdmi_job_endTime;
					data.jobResult = items[i].metadata.cdmi_job_results;
				} else {
					data.completionStatus = "";
					data.cdmi_job_startTime = "";
					data.cdmi_job_endTime = "";
					data.jobResult = "";
				};
				batchExport.dataSet.push(data);
			} catch(e) {
				console.log(e);
			}
		}
	});
	if(this.totalCount % this.pageSize == 0) {
		this.totalPage = this.totalCount / this.pageSize;
	} else {
		this.totalPage = parseInt(this.totalCount / this.pageSize) + 1;
	}
};
batchExport.fillData = function () {
	var body = jQuery(".brodecastRecordTable tbody");
	body.find("td").html("&nbsp;");
	for(var i = 0; i < this.dataSet.length; i++) {
		body.find("tr:eq(" + i + ") td[name=status]").text(this.jobStatus2Cn(this.dataSet[
			i].completionStatus));
		body.find("tr:eq(" + i + ") td[name=objectName]").text(this.dataSet[i].objectName);
		body.find("tr:eq(" + i + ") td[name=startTime]").text(this.string2Date(this.dataSet[
			i].cdmi_job_startTime));
		body.find("tr:eq(" + i + ") td[name=endTime]").text(this.string2Date(this.dataSet[
			i].cdmi_job_endTime));
		body.find("tr:eq(" + i + ") td[name=action]").html(this.formatAction(this.dataSet[
			i].action, this.dataSet[i].jobResult, this.dataSet[i].completionStatus));
	}
};
batchExport.jobStatus2Cn = function (status) {
	switch(status.toUpperCase()) {
	case "PENDING":
		return "未开始";
	case "PROCESSING":
		return "处理中";
	case "COMPLETE":
		return "完成";
	case "CANCELED":
		return "已取消";
	default /*"ERROR"*/ :
		return "错误";
	}
};
batchExport.string2Date = function (timeString) {
	if(!timeString) {
		return "";
	};
	var tmpStr = (timeString.slice(0, 19)).replace(/-/g, '/');
	tmpStr = tmpStr.replace('T', ' ');
	var tmp = new Date(tmpStr);
	//trObj.children[3].children[0].innerHTML = tmp.format("yyyy-MM-dd
	// hh:mm:ss");
	var localOffset = tmp.getTimezoneOffset() * 60 * 1000;
	if(localOffset >= 0) {
		var tmpTime = tmp.getTime();
		var curDate = new Date(tmpTime + localOffset);
		//trObj.children[3].children[0].innerHTML = curDate.format('yyyy-MM-dd HH:mm:ss');
	} else {
		var tmpTime = tmp.getTime();
		var curDate = new Date(tmpTime - localOffset);
		//trObj.children[3].children[0].innerHTML = curDate.format('yyyy-MM-dd HH:mm:ss');
	}
	var curDateString = this.date2String(curDate, "yyyy-MM-dd");
	var defaultDateString = this.date2String(new Date(0), 'yyyy-MM-dd');
	if(curDateString === defaultDateString) {
		return "";
	} else {
		return this.date2String(curDate, "yyyy-MM-dd HH:mm:ss");
	}
};
batchExport.formatAction = function (status, jobResult, jobStatus) {
	switch(status.toUpperCase()) {
	case "BATCHCOUNT":
		if(jobStatus.toUpperCase() !== "COMPLETE") {
			return "<a style=\"color:#e2e2e2;text-decoration:none;cursor:default;\">导出统计</a>";
		} else {
			return "<a onclick=\"batchExport.export(0,'" + jobResult +
				"')\" style=\"color:#00a0e9;text-decoration:none;cursor:pointer;\">导出统计</a>";
		};
	case "BATCHDETAIL":
		if(jobStatus.toUpperCase() !== "COMPLETE") {
			return "<a style=\"color:#e2e2e2;text-decoration:none;cursor:default;\">导出详单</a>";
		} else {
			return "<a onclick=\"batchExport.export(1,'" + jobResult +
				"')\" style=\"color:#00a0e9;text-decoration:none;cursor:pointer;\">导出详单</a>";
		};
	default /*"BATCHDETAILCOUNT "*/ :
		if(jobStatus.toUpperCase() !== "COMPLETE") {
			return "<a style=\"color:#e2e2e2;text-decoration:none;cursor:default;\">导出全部</a>";
		} else {
			// return "<a onclick=\"batchExport.export(2,'" + jobResult + "')\" style=\"color:#e2e2e2;text-decoration:none;cursor:default;\">导出全部</a>";
			return "<a onclick=\"batchExport.export(2,'" + jobResult +
				"')\" style=\"color:#00a0e9;text-decoration:none;cursor:pointer;\">导出全部</a>";
		};
	}
};
batchExport.export = function (type, jobResult) {
	var requestUri = jobResult.replace(/\/cdmi\//g, '/compressed/');
	var downCWURL = '';
	var method = 'GET';
	var contentType = 'application/cdmi-object';
	var nowDateTime = new Date().getTime();
	var reg = /([\/0-9A-Za-z:.]+)(\/aqua\/rest\/[\s\S\+]+)/g; //支持中文和-
	var array = reg.exec(requestUri);
	if(array != null && array.length != 0) {
		var urlPath = array[2];
		//生成token
		var uriprefix = encodeURI(urlPath);
		var expires = nowDateTime + 2 * 7 * 24 * 60 * 60 * 1000; //2014-04-01将有效期扩展到课程/课时结束+2周(14天)时间
		var StringToSign = 'GET' + '\n' + expires + '\n' + uriprefix;
		var aquatoken = my.aqua.accessKeyId + ':' + my.base64Encode(str_hmac_sha1(my
			.aqua.secretAccessKey, StringToSign));
		var downCWURL = PaaSDownloadHost + urlPath + '?aquatoken=' + encodeURIComponent(aquatoken) +
			'&expires=' + expires + '&uriprefix=' + uriprefix.replace("+", "%2B");
		window.open(downCWURL, "_blank",
			"toolbar=no, location=no,resizable=no, directories=no, width=400, height=400"
		);
	}
};
/*
 * 打开创建用户导出任务窗口
 */
batchExport.openUserQueryWin = function (obj) {
	this.queryWin = new PopupDialog({
		url: 'content/brodecastRecord/BatchExport/UserExportWin.html',
		width: 338,
		height: 340,
		callback: batchExport.userQueryWinEventBind,
		context: this,
		ajaxOnEachCreate: true
	});
	// if(!this.queryWin) {
	this.queryWin.create();
	// } else {
	this.queryWin.show();
	// }
};

batchExport.lessTenPluwZero = function (object) { //如 把 2014-9-6 转化为 2014-09-06
		if(object < 10) {
			object = "0" + object;
		}
		return object;
	}
	/*
	 * 用户导出任务事件绑定
	 */
batchExport.userQueryWinEventBind = function () {
	//创建按钮
	jQuery(".popupCenterDivbottom [name=popUpQueryBtn]").bind("click", function () {
		batchExport.createUserExportTask();
	});
	//关闭按钮
	jQuery(".popupCenterDivbottom [name=popUpCancelBtn],.popupCenterDivTop img").bind(
		"click",
		function () {
			batchExport.queryWin.close();
		});
	//日历
	batchExport.dataPickerIssue();
	//导出类型下拉框
	jQuery("[name=exportTypeBtn]").bind("click", function () {
		jQuery("#export_types").toggle();
	});
	//选择导出类型
	jQuery("#export_types dd").bind("click", function () {
		console.log("IN DD");
		jQuery("[name=exportTypeValue]").text(jQuery(this).text());
		jQuery("[name=exportTypeBtn]").click();
		console.log("VALUE:" + jQuery("[name=exportTypeValue]").text());
		if(jQuery("[name=exportTypeValue]").text().trim() == "有点播记录") {
			jQuery("#end_date-datepicker-calendar").css("display", "block");
			jQuery("#end_date").css("background-color", "inherit");
			jQuery("#end_date-datepicker-input").css("background-color", "inherit").removeClass("noEndDate");
			jQuery("form input[name=export_type]").text("normal"); //为form中的点播类型赋值
			//jQuery("#end_date-datepicker-input").removeAttr("onfocus");
			jQuery("#end_date-datepicker-input").unbind("focus");
		} else if(jQuery("[name=exportTypeValue]").text().trim() == "无点播记录") {
			jQuery("#end_date-datepicker-calendar").css("display", "none");
			jQuery("#end_date").css("background-color", "#ececec");
			jQuery("#end_date-datepicker-input").css("background-color", "#ececec").addClass("noEndDate");
			jQuery("#end_date-datepicker-input").val("");
			jQuery("#end_date-datepicker-input").focus(function () {
				jQuery(this).blur();
			})
			jQuery("form input[name=export_type]").text("not"); //为form中的点播类型赋值
		}
		console.log(jQuery("form input[name=export_type]").text())
	});
	//
	// //表单提交事件绑定
	// jQuery('#submitForm').bind('submit', function (event) {
	// 	event.preventDefault();
	// 	if(jQuery(this).find("[name=start_date]").val() === "") {
	// 		alert("请选择开始日期");
	// 		return;
	// 	}
	// 	if(jQuery(this).find("[name=end_date]").val() === "") {
	// 		alert("请选择结束日期");
	// 		return;
	// 	}
	// 	if(jQuery("[name=export_type]").text().trim() === "") {
	// 		alert("请选择导出类型");
	// 		return;
	// 	}
	// 	if(jQuery(this).find("[name=job_name]").val() === "") {
	// 		var msg = confirm('任务描述没有填写！选择确认则自动帮您生成任务描述！');
	// 		if(!msg) {
	// 			return;
	// 		}
	// 	} else if(jQuery(this).find("[name=job_name]").val().search(
	// 			/[\\]|[\/]|[\:]|[\*]|[\?]|[\"]|[\']|[\<]|[\>]|[\|]/) != -1) {
	// 		alert("任务描述名称不能包含下列字符：\\\/:*?\"'<>|");
	// 		return;
	// 	};
	// 	jQuery(this).ajaxSubmit({
	// 		success: function () {
	// 			batchExport.spliter.topage(1, true);
	// 			batchExport.queryWin.hide();
	// 		}
	// 	});
	// });
};
/*
 * 创建用户导出任务
 */
batchExport.createUserExportTask = function () {
	if(jQuery("[name=jobNameInput]").val() === "") {
		alert("请输入任务名称");
		return;
	}
	if(jQuery("#date-input-from-datepicker-input").val() === "") {
		alert("请选择开始日期");
		return;
	}
	var startDate_ = jQuery("#date-input-from-datepicker-input").val();
	var endDate_ = jQuery("#date-input-to-datepicker-input").val();
	var user__ = document.getElementById("missionDesc").value;
	var active_ = "normal";
	if(jQuery("#broSingle_selfDefine").text() == "自定义") //非自定义
	{
		startDate_ = this.beginDate;
		endDate_ = this.endDate
	}
	if(jQuery("#radioB2").find("[name='radio1']").attr("class") == "radioB_selected") {
		active_ = "not";
		endDate_ = startDate_
	}
	jQuery.ajax({
		url: "/aquapaas/rest/multiapp/viewhistory/batch_job/activeuserset/" +
			user__,
		type: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		data: JSON.stringify({
			"start_date": startDate_,
			"end_date": endDate_,
			"result_object_name": "result.csv",
			"operation": active_
		}),
		error: function (xhr) {
			if(xhr.readyState == 4 && xhr.status == 409) {
				alert("任务描述已存在!");
				return;
			} else {
				alert("创建失败!");
				return;
			}
		}
	}).done(function () {
		batchExport.queryWin.close();
		// batchExport.spliter.topage(1, true);
		batchExport.query();
	})
};
batchExport.date2String = function (date, mask) {
	var d = date;
	var result = null;
	var zeroize = function (value, length) {
		if(!length) length = 2;
		value = String(value);
		for(var i = 0, zeros = ''; i < (length - value.length); i++) {
			zeros += '0';
		}
		return zeros + value;
	};
	result = mask.replace(
		/"[^"]*"|'[^']*'|(?:d{1,4}|m{1,4}|M{1,4}|tt|TT|TZ|yy(?:yy)?|([hHMs])\1?|[lLZ])/g,
		function ($0) {
			switch($0) {
			case 'd':
				{
					return d.getDate();
				}
			case 'dd':
				{
					return zeroize(d.getDate());
				}
			case 'ddd':
				{
					return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
				}
			case 'dddd':
				{
					return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
							'Friday', 'Saturday'
						][d.getDay()];
				}
			case 'M':
				{
					return d.getMonth() + 1;
				}
			case 'MM':
				{
					return zeroize(d.getMonth() + 1);
				}
			case 'MMM':
				{
					return ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'Jun.', 'Jul.', 'Aug.',
							'Sep.', 'Oct.', 'Nov.', 'Dec.'
						][d.getMonth()];
				}
			case 'MMMM':
				{
					return ['January', 'February', 'March', 'April', 'May', 'June', 'July',
							'August', 'September', 'October', 'November', 'December'
						][d.getMonth()];
				}
			case 'yy':
				{
					return String(d.getFullYear()).substr(2);
				}
			case 'yyyy':
				{
					return d.getFullYear();
				}
			case 'h':
				{
					return d.getHours() % 12 || 12;
				}
			case 'hh':
				{
					return zeroize(d.getHours() % 12 || 12);
				}
			case 'H':
				{
					return d.getHours();
				}
			case 'HH':
				{
					return zeroize(d.getHours());
				}
			case 'm':
				{
					return d.getMinutes();
				}
			case 'mm':
				{
					return zeroize(d.getMinutes());
				}
			case 's':
				{
					return d.getSeconds();
				}
			case 'ss':
				{
					return zeroize(d.getSeconds());
				}
			case 'l':
				{
					return zeroize(d.getMilliseconds(), 3);
				}
			case 'L':
				{
					var m = d.getMilliseconds();
					if(m > 99) m = Math.round(m / 10);
					return zeroize(m);
				}
			case 'tt':
				{
					return d.getHours() < 12 ? 'am' : 'pm';
				}
			case 'TT':
				{
					return d.getHours() < 12 ? 'AM' : 'PM';
				}
			case 'Z':
				{
					return d.toUTCString().match(/[A-Z]+$/);
				}
			case 'TZ':
				{
					var tmp = 0 - d.getTimezoneOffset();
					if(tmp >= 0) {
						return "+" + zeroize(tmp / 60) + ":" + zeroize(tmp % 60);
					} else {
						return zeroize(tmp / 60) + ":" + zeroize(tmp % 60);
					}
				}
				// Return quoted strings with the surrounding quotes removed
			default:
				return $0.substr(1, $0.length - 2);
			}
		});
	return result;
};
batchExport.mopen = function (object, id, isFather) {
	if(document.getElementById("centerPopupStyle") != null) {
		if(document.getElementById("broSingle_start").style.display != "none") //自定义时间
		{
			return
		}
	}
	var ddmenuitem = jQuery("#" + id);
	if(ddmenuitem.css("display") == "none") {
		ddmenuitem.css("display", "block");
	} else {
		ddmenuitem.css("display", "none");
	}
	if(!isFather) { //子节点
		if(object) {
			var inputText = jQuery(object).text();
			jQuery("#" + id + "_text").text(inputText)
		}
	}
}
batchExport.switchPopup = function (para) {
	switch(para) {
	case "multiDetail":
		this.popupSource = "multiDetail";
		this.openQueryWin();
		break;
	case "multiStatistic":
		this.popupSource = "multiStatistic";
		this.openQueryWin();
		break;
	case "active_deactive":
		this.popupSource = "active_deactive";
		jQuery("#popup-dialog-dialog").remove();
		jQuery("#popup-dialog-mask").remove();
		this.dialog.open();
		break;
	case "broadcast":
		this.popupSource = "broadcast";
		this.openQueryWin();
		break;
	default:
		break;
	}
};
// batchExport.openQueryWin = function () {
// 	var _this = this;
// 	if(true) {
//
// 	}
// 	switch(_this.popupSource) {
// 	case "multiDetail":
//
// 		break;
// 	case "multiStatistic":
//
// 		break;
// 	case "active_deactive":
//
// 		break;
// 	case "broadcast":
//
// 		break;
// 	default:
//
// 	}
// 	if(!this.queryWin) {
// 		this.queryWin = new queryWin({
// 			isEdit: false,
// 			data: {},
// 			callback: batchExport.query
// 		});
// 	}
// 	jQuery(".popupCenterDivTop .popupCenterDivTopLeft").html("多人详单");
// 	this.queryWin = new queryWin({
// 		isEdit: false,
// 		data: {},
// 		callback: batchExport.query
// 	});
// 	this.queryWin.create();
// 	this.queryWin.show();
// };
batchExport.closeCenterDiv = function () {
	jQuery("#popup-dialog-dialog").remove();
	jQuery("#popup-dialog-mask").remove();
}

batchExport.resetPopupSize = function (value_) {
	var temp_ = this.heightFromInnerToOuter[value_];
	jQuery("#singleSearchPopBody").height(temp_[0]);
	jQuery("#centerPopupStyle").height(temp_[1]);
	jQuery("#popup-dialog-dialog").height(temp_[1]);
	var marginTop_ = 0 - 0.5 * parseInt(temp_[1]) + "px";
	jQuery("#popup-dialog-dialog").css({
		"margin-top": marginTop_,
		"top": "50%"
	});
}

batchExport.month_ = function (num_) {
	var _cur_date = new Date();
	var _begin_d = new Date(_cur_date);
	_begin_d.setMonth(_begin_d.getMonth() - Number(num_));
	this.endDate = _cur_date.getFullYear() + "-" + batchExport.zerolize(_cur_date.getMonth() + 1, 2) + "-" + batchExport.zerolize(_cur_date.getDate(), 2);
	this.beginDate = _begin_d.getFullYear() + "-" + batchExport.zerolize(_begin_d.getMonth() + 1, 2) + "-" + batchExport.zerolize(_begin_d.getDate(), 2);
}

batchExport.userDefined = function (obj) {
	var test_ = jQuery(obj).text();
	switch(test_) {
	case "自定义":
		jQuery(obj).text("取消自定义");
		jQuery("#down_Menu").hide();
		jQuery(".popupCenterDivBody #down_Menu_text").html("自定义");
		jQuery("#broSingle_dateRegion").css("background-color", "#ebebeb");
		jQuery("#broSingle_dateRegion").find(".smallArrowInDiv").attr("src", "images/downArrow-dark.png");
		jQuery("#broSingle_start").show();
		if(jQuery("#radioB2").find("[name='radio1']").attr("class") == "radioB_selected") {} else {
			jQuery("#broSingle_end").show();
		}
		jQuery("#date-input-from").empty();
		jQuery("#date-input-to").empty();
		this.dataPickerIssue();
		jQuery("#exportTask_downMenu").css("display", "none");
		break;
	case "取消自定义":
		jQuery(obj).text("自定义");
		jQuery(".popupCenterDivBody #down_Menu_text").html("一个月");
		jQuery("#broSingle_dateRegion").css("background-color", "#ffffff");
		jQuery("#broSingle_dateRegion").find(".smallArrowInDiv").attr("src", "images/downArrow-SkyBlue.png");
		jQuery("#broSingle_start").hide();
		jQuery("#broSingle_end").hide();
		break;
	default:
		break;
	}
	var size_ = this.checkSizeStyle();
	this.resetPopupSize(size_)
}

batchExport.switchRedio = function (obj) {
	var curObjClassName_ = jQuery(obj).find("[name='radio1']").attr('class');
	var curObjNewClassName = "";
	switch(curObjClassName_) {
	case "radioB_selected":
		curObjNewClassName = "radioB_selected";
		break;
	case "radioB_noSelected":
		curObjNewClassName = "radioB_selected";
		jQuery(obj).siblings().find("[name='radio1']").attr('class', 'radioB_noSelected');
		break;
	default:
		break;
	}
	jQuery(obj).find("[name='radio1']").attr('class', 'radioB_selected');
	if(jQuery("#radioB2").find("[name='radio1']").attr("class") == "radioB_selected") {
		jQuery("#broSingle_end").hide()
	} else {
		if(jQuery("#broSingle_start").css("display") == "none") {} else {
			jQuery("#date-input-from").empty();
			jQuery("#date-input-to").empty();
			jQuery("#broSingle_end").show();
			this.dataPickerIssue();
		}
	}
	var text_ = jQuery(obj).attr("id");
	var size_ = this.checkSizeStyle();
	this.resetPopupSize(size_)
}
batchExport.checkSizeStyle = function () { //伸缩弹出窗体
	if(document.getElementById("broSingle_start").style.display == "none") //日期部分为非自定义
	{
		if(jQuery("#radioB2").find("[name='radio1']").attr("class") == "radioB_selected") {
			return "date_notSelfDefined_inactive"
		} else {
			return "date_notSelfDefined_active"
		}
	} else { //日期部分为自定义
		if(jQuery("#radioB2").find("[name='radio1']").attr("class") == "radioB_selected") {
			return "date_selfDefined_inactive"
		} else {
			return "date_selfDefined_active"
		}
	}
}

batchExport.zerolize = function (num, len) {
	var _returnValue = "";
	if(typeof num == "number") {
		_returnValue = num + "";
	} else if(typeof num == 'string') {
		_returnValue = num
	}
	var _o = _returnValue.length;
	for(var i = _o; i < len; i++) {
		_returnValue = "0" + _returnValue;
	}
	return _returnValue;
}
batchExport.init();
