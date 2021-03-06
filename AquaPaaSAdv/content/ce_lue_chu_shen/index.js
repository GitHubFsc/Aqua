var adPolicyAudit = new Object();
adPolicyAudit.init = function () {
  this.token = "user_id=" + my.paas.user_id + "&user_type=" + my.paas.user_type +
    "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey +
    "&timestamp=";
  this.token2 = "user_type=" + my.paas.user_type +
    "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey +
    "&timestamp=";
  this.auditType = 0; //0：图文；1：视频
  this.auditStep = 0; //0:初审；1：终审；2：启用；3：禁用
  this.policyName = "";
  //this.enabled = 0; //当且仅当 auditStep为3时才有作用；0：启用；1：禁用
  this.listData = []; //重置当前列表数据
  this.data = [];
  this.isRefreshTable = { //焦点记忆
    isTrue: false,
    page: 0
  }
  var ret = this.initPage();
  if(ret) {
    this.bindBtnEvents();
    this.formatterData();
  };
};
adPolicyAudit.initPage = function () {
  if(my.paas.user_type === "0") {
    jQuery("#adPolicyAuditContainer").html("<div style='height:100%;color:#797979;font-size:26px;text-align:center;line-height:600px;background-color:#fcfcf2;'>" + i18n("ADV_SYSUSER_NOTE_NORIGHT") + "</div>");
    return false;
  };
  // if(this.auditType == 0) {
  //   jQuery(".adPolicyAuditMenu .policy_type div[name=type]").removeClass("focus");
  //   jQuery(".adPolicyAuditMenu #policy_img").addClass("focus");
  // } else {
  //   jQuery(".adPolicyAuditMenu .policy_type div[name=type]").removeClass("focus");
  //   jQuery(".adPolicyAuditMenu #policy_video").addClass("focus");
  // }
  jQuery(".adPolicyAuditMenu .policy_type div[name=type]").removeClass("focus");
  jQuery(".adPolicyAuditMenu .policy_type div[name=type]:eq(" + this.auditType + ")").addClass("focus");
  if(this.auditStep === 0) {
    //初审
    jQuery(".adPolicyAuditMenu .policy_status div[name=status]").removeClass("focus");
    jQuery(".adPolicyAuditMenu #policy_firstAudit").addClass("focus");
  } else if(this.auditStep === 1) {
    //终审
    jQuery(".adPolicyAuditMenu .policy_status div[name=status]").removeClass("focus");
    jQuery(".adPolicyAuditMenu #policy_secondAudit").addClass("focus");
  } else if(this.auditStep === 2) {
    //启用
    jQuery(".adPolicyAuditMenu .policy_status div[name=status]").removeClass("focus");
    jQuery(".adPolicyAuditMenu #policy_enable").addClass("focus");
  } else if(this.auditStep === 3) {
    //禁用
    jQuery(".adPolicyAuditMenu .policy_status div[name=status]").removeClass("focus");
    jQuery(".adPolicyAuditMenu #policy_disable").addClass("focus");
  }
  return true;
};
adPolicyAudit.bindBtnEvents = function () {
  jQuery(".adPolicyAuditMenu .policy_type div[name=type]").click(function () {
    jQuery(".adPolicyAuditMenu .policy_type div[name=type]").removeClass(
      "focus");
    jQuery(this).addClass("focus")
    adPolicyAudit.auditType = jQuery(this).index();
    adPolicyAudit.formatterData();
  });
  jQuery(".adPolicyAuditMenu .policy_status div[name=status]").click(function () {
    jQuery(".adPolicyAuditMenu .policy_status div[name=status]").removeClass(
      "focus");
    jQuery(this).addClass("focus")
    adPolicyAudit.auditStep = jQuery(this).index();
    adPolicyAudit.formatterData();
  });
  jQuery("#policy_searchInput").focusout([], function (event) {
    adPolicyAudit.policyName = jQuery(this).val()
  });
  jQuery("#policy_searchInput").keydown(function (event) {  //回车查询事件
    if(event.keyCode === 13) {
      adPolicyAudit.policyName = jQuery(this).val()
      adPolicyAudit.formatterData();
    }
  });
  jQuery("#policy_searchBtn").click(function () {  //查询按钮查询事件
    adPolicyAudit.policyName = jQuery("#policy_searchInput").val()
    adPolicyAudit.formatterData();
  });
};
/**
 * 返回后台需要的审核类型
 * @method function
 * @param  {int} auditType 审核类型，0：图文 1：视频 2：字幕
 * @return {string}        审核类型
 */
adPolicyAudit.getTypeTextByAuditType = function (auditType) {
  var ret = "";
  switch(auditType) {
  case 0:
    ret = "img";
    break;
  case 1:
    ret = "video";
    break;
  case 2:
    ret = "subtitle";
    break;
  default:

  }
  return ret;
};
/**
 * 根据传递进来的审核步骤返回审核步骤所代表的state
 * @method getStateTextByAuditStep
 * @param  {int}                step 审核步骤
 * @return {string}                  审核步骤所代表的后台数据
 */
adPolicyAudit.getStateTextByAuditStep = function (step) {
  var ret = "";
  switch(step) {
  case 0:
    ret = "first_audit:prepare_audit";
    break;
  case 1:
    ret = "third_audit:prepare_audit";
    break;
  case 2:
    ret = "enabled";
    break;
  case 3:
    ret = "disabled";
    break;
  default:

  }
  return ret;
};
/**
 * query data according to the params
 * @method function
 * @return {undefined} [bind query data to this.listData]
 */
adPolicyAudit.queryData = function (pageNumber) {
  var _this = adPolicyAudit,
    start = (pageNumber - 1) * 11,
    end = pageNumber * 11 - 1,
    policydata = {};
  var url = paasHost + paasAdvDomain + "/ads/adpolicy/adpolicys?" + adPolicyAudit.token + new Date().toISOString() + "&type=" + _this.getTypeTextByAuditType(_this.auditType) + "&state=" + _this.getStateTextByAuditStep(_this.auditStep) + "&name=" + _this.policyName + "&start=" + start + "&end=" + end;
  if (my.paas.platform_current_id) {
    url += "&platform_id_list=" + my.paas.platform_current_id;  
  }
  jQuery.ajax({
    type: "GET",
    url: url,
    async: false,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
    },
    success: function (resp2) {
      policydata = resp2
    }
  }).done(function (rsp, status, xhr) {
    policydata = rsp;
    var totalCount = xhr.getResponseHeader('x-aqua-total-count');
    _this.styledList.onTotalCount(totalCount || 0);
  });
  _this.data = policydata;
  // for(var item in policydata) {
  //   if(policydata.hasOwnProperty(item)) {
  //     adPolicyAudit.data[i][item] = policydata[item]
  //   }
  // }
  // }
  //   }
  // });
  // this.formatterData();
  _this.transformData();
  return _this.listData;
};
adPolicyAudit.transformData = function () {
  var _this = this;
  _this.listData = [];
  for(var i = 0; i < _this.data.length; i++) {
    let item = _this.data[i];
    if(typeof item === "undefined") {
      continue;
    }
    if(item.type !== _this.getTypeTextByAuditType(_this.auditType)) {
      continue;
    }

    // if(item.name.indexOf(adPolicyAudit.policyName) == -1) {
    //   continue;
    // }
    var row = [];
    row.push({
      label: "<div title='" + item.name + "'>" + item.name + "</div>"
    });
    row.push({
      label: item.user_name
    });
    if(_this.auditStep === 2 || _this.auditStep === 3) {
      var state = item.enable ? i18n("ADPOLICYAUDIT_TABLE_STATE_ENABLE") : i18n("ADPOLICYAUDIT_TABLE_STATE_DISABLE")
      row.push({
        label: state
      });
    }
    var metadata_tag = _this.setTag(item.metadata, null);
    var tag_text = metadata_tag.tag.join(",");
    var channel_text = "";
    var channel_key = metadata_tag.tag.map(function (item) {
      return "channel:" + item;
    });
    console.log(channel_key);
    var channel_list = [];
    if(channel_key.length !== 0) {
      channel_list = _this.listChannelOfChannelTag(channel_key.join(","));
    }
    channel_list = channel_list.map(function (item) {
      return _this.find_channel_name(item.obj_id);
    });

    channel_text = channel_list.join(",");
    var tag = metadata_tag.tag.join(",");
    row.push({
      label: "<div title='" + tag_text + "'>" + tag_text + "</div>"
    });
    row.push({
      label: "<div title='" + channel_text + "'>" + channel_text + "</div>"
    });
    row.push({
      label: item.priority
    });
    row.push({
      label: item.weight
    });
    if(item.adgroup_id) {
      var ad_name = _this.getAdEl(0, item.adgroup_id)
      row.push({
        label: "<div title='" + ad_name + "'>" + ad_name + "</div>"
      });
    } else {
      var ad_name = _this.getAdEl(1, item.ad_single_id)
      row.push({
        label: "<div title='" + ad_name + "'>" + ad_name + "</div>"
      });
    }
    var showTime = function (time) {
      if(time.indexOf("T") >= 0) {
        time = time.replace("T", " ");
      }
      var result = "";
      if(time) {
        if(time.indexOf("+") >= 0) {
          result = time.split("+")[0];
        } else {
          if(time.substr(-5).indexOf("-") >= 0) {
            result = time.split(time.substr(-5))[0];
          } else {
            result = time;
          }
        }
      }
      return result;
    };
    var active_time = showTime(item.activatetime) + " -- " + showTime(item.expiretime)
    row.push({
      label: "<div title='" + active_time + "'>" + active_time + "</div>"
    });
    var play_time = showTime(item.play_begintime) + " -- " + showTime(item.play_endtime);
    row.push({
      label: "<div title='" + play_time + "'>" + play_time + "</div>"
    });
    let op_view = "<span onclick='adPolicyAudit.view(" + i + ")'>" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_VIEW") + "</span>";
    let op_enable = "<span " + (my.paas.user_type == "1" ? "onclick='adPolicyAudit.enablePolicy(" + item.enable + "," + i + ")'" : "style='cursor:default;color:#797979'") + ">" + (_this.auditStep === 2 ? i18n("ADPOLICYAUDIT_TABLE_OPERATION_DISABLE") : i18n("ADPOLICYAUDIT_TABLE_OPERATION_ENABLE")) + "</span>";
    let op_deney = "<span " + (my.paas.user_type == "1" ? "onclick='adPolicyAudit.showDialog(" + i + ")'" : "style='cursor:default;color:#797979'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_DENEY") + "</span>";
    let op_pass = "<span " + (my.paas.user_type == "1" ? "onclick='adPolicyAudit.passAudit_ext(" + i + ")'" : "style='cursor:default;color:#797979'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_PASS") + "</span>";
    let op_audithis = "<span " + (my.paas.user_type == "1" ? "onclick='adPolicyAudit.viewAuditHis(" + i + ")'" : "style='cursor:default;color:#797979'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS") + "</span>";
    if(_this.auditStep === 2 || _this.auditStep === 3) {
      if(AdvSystemType == "central" && (item.site_id !== AdvSelfSiteId)) {
        //2启用、3禁用
        row.push({
          label: [op_view].join("")
        });
      } else {
        row.push({
          label: [op_view, op_audithis, op_enable].join("")
        });
      }
    } else {
      row.push({
        label: [op_view, op_audithis, op_deney, op_pass].join("")
      });
    }
    switch(item.state.indexOf(":") !== -1 ? item.state.split(":")[0] : item.state) {
    case "first_audit":
    case "second_audit":
      //合并初审复审状态
      if(_this.auditStep == 0) {
        _this.listData.push(row);
      }
      break;
    case "third_audit":
      //终审
      if(_this.auditStep == 1) {
        _this.listData.push(row);
      }
      break;
    case "enabled":
      //启用
      if(_this.auditStep == 2) {
        _this.listData.push(row);
      }
      break;
    case "disabled":
      //禁用
      if(_this.auditStep == 3) {
        _this.listData.push(row);
      }
      break;
    default:
    }
    // this.listData.push(row);
  }
};

/**
 * [listChannelOfChannelTag description]
 * @method listChannelOfChannelTag
 * @param  {[type]}                tag [description]
 * @return {[type]}                    [description]
 */
adPolicyAudit.listChannelOfChannelTag = function (tag) {
  var _this = this;
  var result = false;
  var url = paasHost + 　paasDomain　 + "/tag/application/global/channel/";
  if(tag) {
    url = url + "?tags=" + encodeURI(tag);
  }
  url += "&" + _this.token + new Date().toISOString();
  jQuery.ajax({
    type: "GET",
    async: false,
    url: url,
    contentType: "application/json",
    dataType: "json",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
    }
  }).done(function (data) {
    result = data;
  }).fail(function () {
    result = [];
  });
  return result;
};
/**
 * fresh list & update this.styledList
 * @method function
 * @return {undefined} [description]
 */
adPolicyAudit.formatterData = function () {
  this.styledList = new StyledList({
    containerId: "adPolicyAuditTable",
    rows: 11,
    columns: this.auditStep < 2 ? 10 : 11,
    data: this.listData,
    titles: this.auditStep < 2 ? this._listTitle : this._enabledListTitle,
    listType: 1,
    styles: this.auditStep < 2 ? this._listStyle : this._enabledListStyle,
    // totalCount: conf.totalCount || 0,
    updateTitle: true
  });
  this.styledList.getPageData = this.queryData;
  this.styledList.create();
  //添加焦点记忆功能，判断是否为修改刷新列表
  var isEditObj = this.isRefreshTable;
  if(isEditObj && isEditObj.isTrue === true) {
    isEditObj.isTrue = false;
    this.styledList.changePage(isEditObj.page);
  }
};
adPolicyAudit.showDialog = function (index) {
  var dialogContentURL = "",
    dialogHeight = "",
    dialogWidth = "",
    afterDrawn, _that = this;
  dialogContentURL = "content/ce_lue_shen_he/auditDeneyDialog.html";
  dialogHeight = 342;
  dialogWidth = 760;
  afterDrawn = function () {
    _that.afterDrawn(index)
  }
  this.dialog = new PopupDialog({
    url: dialogContentURL,
    width: dialogWidth,
    height: dialogHeight,
    context: this,
    callback: afterDrawn
  });
  this.dialog.open();
};
/**
 * [function description]
 * @method function
 * @return {[type]} [description]
 */
adPolicyAudit.afterDrawn = function (index) {
  var _that = this;
  jQuery(".auditDialogCloseBtn,.auditDialogCancelBtn").click(function () {
    _that.dialog.close();
  });
  jQuery(".auditDialogSubmitBtn").click(function () {
    _that.sendDeneyMsg(index);
  });
};
/**
 * 发送否决原因
 * @method function
 * @return {[type]} [description]
 */
adPolicyAudit.sendDeneyMsg = function (index) {
  var msg = jQuery(".auditDialogDeneyReason").val();
  //send Msg
  console.log("sendMsg:" + msg);
  console.log("sendindex:" + index);
  var url = paasHost + paasDomain + "/auditflow/instance/ad_policy/" + this.data[index].adpolicy_id +
    "?" + this.token + new Date().toISOString();
  jQuery.ajax({
    type: "PUT",
    url: url,
    async: true,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("PUT", url)
    },
    data: JSON.stringify({
      "no": this.auditStep + 1 + "",
      "status": "deprecated",
      "reason": "failure reason " + msg
    }),
    success: function () {
      adPolicyAudit.dialog.close();
      adPolicyAudit.isRefreshTable = {
        isTrue: true,
        page: String(adPolicyAudit.styledList.currPage + 1)
      };
      adPolicyAudit.formatterData();
    },
    error: function () {
      return;
    }
  });
  //end send function
};
/**
 * 显示策略内容
 * @method function
 * @return {undefined} view policy
 */
adPolicyAudit.view = function (index) {
  console.log("view policy");
  this.dialog = new PopupDialog({
    url: "content/ce_lue_shen_he/adPolicyEdit.html",
    width: 760,
    height: 599,
    context: this,
    callback: function () {
      this.dialog.data = this.data[index];
      this.initDialog();
      this.bindDialogEvents();
      this.loadDialogData();
    }
  });
  this.dialog.open();
};
adPolicyAudit.initDialog = function () {
  var _this = this,
    dialog = _this.dialog;
  dialog.currTagType = dialog.currTagType ? dialog.currTagType : "ADPOLICYMANAGE_TABLE_CHANNEL";
  //日历控件样式
  var calendarStyles = {
    width: 370,
    navTitleHeight: 20,
    navTitleBgColor: '#5da1c0',
    datesViewHeight: 150,
    datesViewGridColor: '#E2E2E2',
    datesViewCellColor: '#FFFFFF',
    weekdaysHeight: 20,
    weekdaysColor: '#E2E2E2',
    currMonthColor: '#737373',
    nonCurrMonthColor: '#E2E2E2'
  }
  var adv_list = {};
  //策略类型下拉框初始化
  dialog.policyTypeBox = new newSelect("#policy_type", {
    "img": i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_IMG"),
    "video": i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_VIDEO"),
    "subtitle": i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_VIDEO")
  }, {
    width: 298,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#F0F0F0",
    disablebackground: "#F0F0F0"
  });
  dialog.policyTypeBox.setDisable();
  //策略权重下拉框初始化
  dialog.policyWeightBox = new newSelect("#policy_weight", {
    "00": "00",
    "50": "50",
    "100": "100"
  }, {
    width: 298,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF"
  });
  dialog.policyWeightBox.setDisable();

  //生效时间UI初始化
  dialog.validTimeDataPicker = new DatePicker({
    containerId: 'validtime_date',
    calendarStyles: calendarStyles,
    dateInputStyles: {
      borderColor: '#d3d3d3'
    },
    iconImage: 'image/adPolicyManage/datePickerIcon.png'
  });
  dialog.validTimeHourBox = new newSelect("#validtime_hour", _this._hourArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF"
  });
  dialog.validTimeHourBox.setDisable();
  dialog.validTimeMinuteBox = new newSelect("#validtime_minute", _this._minuteArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF"
  });
  dialog.validTimeMinuteBox.setDisable();
  dialog.validTimeSecondBox = new newSelect("#validtime_second", _this._secondArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF"
  });
  dialog.validTimeSecondBox.setDisable();
  //投放开始时间时间UI初始化
  dialog.durationStartTimeHourBox = new newSelect("#duationstarttime_hour",
    _this._hourArray, {
      width: 70,
      height: 32,
      background: "#FFFFFF",
      selectbackground: "#FFFFFF"
    });
  dialog.durationStartTimeHourBox.setDisable();
  dialog.durationStartTimeMinuteBox = new newSelect("#duationstarttime_minute",
    _this._minuteArray, {
      width: 70,
      height: 32,
      background: "#FFFFFF",
      selectbackground: "#FFFFFF"
    });
  dialog.durationStartTimeMinuteBox.setDisable();
  dialog.durationStartTimeSecondBox = new newSelect("#duationstarttime_second",
    _this._secondArray, {
      width: 70,
      height: 32,
      background: "#FFFFFF",
      selectbackground: "#FFFFFF"
    });
  dialog.durationStartTimeSecondBox.setDisable();
  //失效时间UI初始化
  dialog.invalidTimeDataPicker = new DatePicker({
    containerId: 'invalidtime_date',
    calendarStyles: calendarStyles,
    dateInputStyles: {
      borderColor: '#d3d3d3'
    },
    iconImage: 'image/adPolicyManage/datePickerIcon.png'
  });
  dialog.invalidTimeHourBox = new newSelect("#invalidtime_hour", _this._hourArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF"
  });
  dialog.invalidTimeHourBox.setDisable();
  dialog.invalidTimeMinuteBox = new newSelect("#invalidtime_minute", _this._minuteArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF"
  });
  dialog.invalidTimeMinuteBox.setDisable();
  dialog.invalidTimeSecondBox = new newSelect("#invalidtime_second", _this._secondArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF"
  });
  dialog.invalidTimeSecondBox.setDisable();
  //投放结束时间UI初始化
  dialog.durationEndTimeHourBox = new newSelect("#durationendtime_hour", _this._hourArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF"
  });
  dialog.durationEndTimeHourBox.setDisable();
  dialog.durationEndTimeMinuteBox = new newSelect("#durationendtime_minute",
    _this._minuteArray, {
      width: 70,
      height: 32,
      background: "#FFFFFF",
      selectbackground: "#FFFFFF"
    });
  dialog.durationEndTimeMinuteBox.setDisable();
  dialog.durationEndTimeSecondBox = new newSelect("#durationendtime_second",
    _this._secondArray, {
      width: 70,
      height: 32,
      background: "#FFFFFF",
      selectbackground: "#FFFFFF"
    });
  dialog.durationEndTimeSecondBox.setDisable();

  // var channelBox_ScrollBarHeight = "150px";
  // if(this.channelArray.length > 5) {
  //   channelBox_ScrollBarHeight = "150px";
  // } else {
  //   channelBox_ScrollBarHeight = "auto";
  // }
  // this.channelBox = new newSelect("#channel_type", this.channelArray, {
  //   width: 298,
  //   height: 32,
  //   background: "#FFFFFF",
  //   selectbackground: "#FFFFFF",
  //   ScrollBarHeight: channelBox_ScrollBarHeight,
  //   multipleChoice: true
  // });
  //标签类型
  dialog.tagTypeSelect = new newSelect("#tag_type", _this._tagTypeArray, {
    width: 298,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px",
    disablebackground: "#F0F0F0"
  }, function () {
    var type = this.getValue()
    jQuery(".policy_channel").prev().html(i18n(type));
    dialog.currTagType = type;
    jQuery("#channel_type").html(_this.setTag(dialog.data.metadata, dialog.currTagType).tag.join(",")).attr("title", jQuery("#channel_type").html());
  });

  //广告位
  var url = paasHost + paasAdvDomain;
  if(_this.auditType == 0) {
    url += "/ads/imgadp/imgadps?";
  } else if(_this.auditType == 1) {
    url += "/ads/videoadp/videoadps?";
  } else {
    url += "/ads/subtitleadp/subtitleadps?";
  }
  url += _this.token + new Date().toISOString();
  jQuery.ajax({
    type: "GET",
    async: false,
    url: url,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
    }
  }).done(function (resp) {
    for(var i = 0; i < resp.length; i++) {
      adv_list[resp[i].ext_id] = resp[i].name;
    }
  });
  //广告位列表
  this.bindAdvBox = new newSelect("#policy_bindadv", adv_list, {
    width: 239,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    disablebackground: "#F0F0F0"
  });
  this.bindAdvBox.setDisable();
  //素材列表
  this.elSelectBox = new newSelect("#el_name", {}, {
    width: 239,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF"
  });
  this.elSelectBox.setDisable();

};
adPolicyAudit.bindDialogEvents = function () {
  var _this = this,
    dialog = _this.dialog,
    $ = jQuery;
  $(".editDialog")
  .on('click', '.controls .btn', ({currentTarget, target}) => {
    if (currentTarget == target) {
      var type = $(currentTarget).attr('name');
      $(currentTarget).addClass('focus').siblings().removeClass('focus')
      $('.editDialog .info_pane').hide()
      $('.editDialog .info_pane.' + type + '_info').show()
      _this.dialog.currentTab = type
      if (type == 'accurate') {
        _this.dialog.resize({
          width: 701,
          height: 495
        }, true)
      } else {
        _this.dialog.resize({
          width: 760,
          height: 644
        }, true)
      }
    }
  })
  .on('click', ".editDialogCloseBtn,.editDialogCancelBtn", function () {
    _this.dialog.close();
  })
  .on('click', ".editDialogSubmitBtn", function () {
    _this.dialog.close();
  })
  .on('click', "#policy_sucai_choose.policy_choose", function () {
  //素材/素材组预览
    var is_sucai = jQuery(".editDialog .radio.select").index(".editDialog .radio");
    var app = new PreviewModel();
    if(is_sucai == 0) {
      app.previewSuCaiZu(dialog.data.adgroup_id);
    } else {
      app.previewSuCai(dialog.data.ad_single_id);
    }
  })
  .on('click', '#map_selector', ({currentTarget, target}) => {
    if (currentTarget, target) {
      var data = {}
      if (_this.dialog.data.shape_range) {
        data.shape_range = _this.dialog.data.shape_range
      }
      if (_this.dialog.data.locationInfoDetail) {
        data.locationInfoDetail = _this.dialog.data.locationInfoDetail
      }
      var dialog = mapAccurate({
        data: data,
        confirm: (data) => {
          $.extend(_this.dialog.data, data)
          dialog.close();
          _this.closeSelectDialog();
        },
        callback: () => {
          dialog.close();
          _this.closeSelectDialog();
        }
      })
    }
  });
};
adPolicyAudit.loadDialogData = function () {
  var _this = this,
    dialog = _this.dialog,
    data = dialog.data,
    $ = jQuery;
  $("#policy_name").val(data.name);

  if (dialog.currentTab == 'accurate') {
    $('.editDialog .controls .btn[name=accurate]').click()
  } else {
    $('.editDialog .controls .btn[name=basic]').click()
  }

  if(data.type === "img") {
    dialog.policyTypeBox.setValue(i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_IMG"))
  } else if(data.type === "video") {
    dialog.policyTypeBox.setValue(i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_VIDEO"))
  } else {
    dialog.policyTypeBox.setValue(i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_SUBTITLE"))
  }
  jQuery("#policy_priority").val(data.priority);
  dialog.policyWeightBox.setValue(data.weight);
  if(data.activatetime.indexOf("T") >= 0) {
    data.activatetime = data.activatetime.replace("T", " ");
  }
  if(data.expiretime.indexOf("T") >= 0) {
    data.expiretime = data.expiretime.replace("T", " ");
  }
  dialog.validTimeDataPicker.setCurrDate(dialog.validTimeDataPicker.parseDateStr(data.activatetime.split(" ")[0]));
  dialog.validTimeHourBox.setValue(data.activatetime.split(" ")[1].split(":")[0]);
  dialog.validTimeMinuteBox.setValue(data.activatetime.split(" ")[1].split(":")[1]);
  var showTimeSecond = function (time) {
    var result = "";
    if(time) {
      if(time.substr(-5).indexOf("+") >= 0) {
        result = time.split(time.substr(-5))[0];
      } else {
        if(time.substr(-5).indexOf("-") >= 0) {
          result = time.split(time.substr(-5))[0];
        } else {
          result = time;
        }
      }
    }
    return result;
  };
  dialog.validTimeSecondBox.setValue(showTimeSecond(data.activatetime.split(" ")[1].split(":")[2]));
  dialog.durationStartTimeHourBox.setValue(data.play_begintime.split(":")[0]);
  dialog.durationStartTimeMinuteBox.setValue(data.play_begintime.split(":")[1]);
  dialog.durationStartTimeSecondBox.setValue(showTimeSecond(data.play_begintime.split(":")[2]));
  dialog.invalidTimeDataPicker.setCurrDate(dialog.validTimeDataPicker.parseDateStr(data.expiretime.split(" ")[0]));
  dialog.invalidTimeHourBox.setValue(data.expiretime.split(" ")[1].split(":")[0]);
  dialog.invalidTimeMinuteBox.setValue(data.expiretime.split(" ")[1].split(":")[1]);
  dialog.invalidTimeSecondBox.setValue(showTimeSecond(data.expiretime.split(":")[2]));
  dialog.durationEndTimeHourBox.setValue(data.play_endtime.split(":")[0]);
  dialog.durationEndTimeMinuteBox.setValue(data.play_endtime.split(":")[1]);
  dialog.durationEndTimeSecondBox.setValue(showTimeSecond(data.play_endtime.split(":")[2]));

  switch(dialog.currTagType) {
  case "ADPOLICYMANAGE_TABLE_CHANNEL":
    dialog.tagTypeSelect.setValue(dialog.tagTypeSelect.selectItem[0].value)
    break;

  case "ADPOLICYMANAGE_TABLE_CATEGORY":
    dialog.tagTypeSelect.setValue(dialog.tagTypeSelect.selectItem[1].value)
    break;

  case "ADPOLICYMANAGE_TABLE_AREA":
    dialog.tagTypeSelect.setValue(dialog.tagTypeSelect.selectItem[2].value)
    break;
  default:

  }
  //todo 获得标签 名字
  // var tag_data = _this.setTag(data.metadata, dialog.currTagType);
  // jQuery("#policy_tag").val(tag_data.tag.join(","));
  // jQuery("#channel_type").html(tag_data.tag.join(",")).attr("title", jQuery("#channel_type").html());
  var tags = data.metadata
  $("#channel_tags").val((tags.channel_tags||[]).map(item => item.replace('channel:','')).join(",")).attr("title", $("#channel_tags").html());
  $("#catalog_tags").val((tags.catalog_tags||[]).map(item => item.replace('catalog:','')).join(",")).attr("title", $("#catalog_tags").html());
  $("#area_tags").val((tags.area_tags||[]).map(item => item.replace('area:','')).join(",")).attr("title", $("#area_tags").html());

  if(data.adp_list.length === 0) {
    jQuery("#unbind_adv.check_box").addClass("checked");
  } else {
    _this.bindAdvBox.setValue(_this.bindAdvBox.selectItem[data.adp_list[0]]);
  }
  if(data.ad_single_id) {
    jQuery(".radio:eq(1)").addClass("select");
  } else {
    jQuery(".radio:eq(0)").addClass("select");
  }
  _this.elSelectBox.setValue(_this.getAdEl(jQuery(".radio:eq(0)").hasClass("select") ? 0 : 1, data.ad_single_id || data.adgroup_id));

  //加载地图信息
  if (data.locationInfoDetail) {
    $('.editDialog #policy_addr').val(data.locationInfoDetail.address)
  }
  $('.editDialog #policy_radius').val(data.shape_range)
};
adPolicyAudit.getAdEl = function (type, id) {
  var result = "";
  var url = "";
  if(type === 0) {
    url = paasHost + paasAdvDomain + "/ads/adgroup/" + id + "?";
  } else {
    url = paasHost + paasAdvDomain + "/ads/aditem/" + id + "?";
  }
  url += this.token + new Date().toISOString();
  jQuery.ajax({
    type: "GET",
    async: false,
    url: url,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
    },
    success: function (data) {
      result = data.name || data.title;
    }
  });
  return result;
};
adPolicyAudit._tagTypeArray = [{
  key: "ADPOLICYMANAGE_TABLE_CHANNEL",
  value: i18n("ADPOLICYMANAGE_TABLE_CHANNEL")
}, {
  key: "ADPOLICYMANAGE_TABLE_CATEGORY",
  value: i18n("ADPOLICYMANAGE_TABLE_CATEGORY")
  }, {
  key: "ADPOLICYMANAGE_TABLE_AREA",
  value: i18n("ADPOLICYMANAGE_TABLE_AREA")
}];
adPolicyAudit.passAudit_ext = function (index) {
    var dialogContentURL = "",
      dialogHeight = "",
      dialogWidth = "",
      afterDrawn, _that = this;
    dialogContentURL = "content/ce_lue_shen_he/auditPassConfirmDialog.html";
    dialogHeight = 288;
    dialogWidth = 480;
    afterDrawn = function () {
      jQuery(".auditDialogCloseBtn,.auditDialogCancelBtn").click(function () {
        _that.dialog.close();
      });
      jQuery(".auditDialogConfirmBtn").click(function () {
        _that.passAudit(index, _that.auditStep, function () {
          _that.dialog.close();
        });
      });
    }
    this.dialog = new PopupDialog({
      url: dialogContentURL,
      width: dialogWidth,
      height: dialogHeight,
      context: this,
      callback: afterDrawn
    });
    this.dialog.open();
    // var confirm_result = confirm(i18n("ADPOLICYAUDIT_AUDITPASSHINT"));
    // if(!confirm_result) {
    //   return;
    // }
    // this.passAudit(index, this.auditStep);
  }
  /**
   * pass audit btn
   * @method function
   * @return {undefined} pass this audit
   */
adPolicyAudit.passAudit = function (index, state, callback) {
  var _self = this;
  console.log("pass audit function");
  console.log("sendindex:" + index);
  var url = paasHost + paasDomain + "/auditflow/instance/ad_policy/" + this.data[index].adpolicy_id +
    "?" + this.token + new Date().toISOString();
  jQuery.ajax({
    type: "PUT",
    url: url,
    async: true,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("PUT", url)
    },
    data: JSON.stringify({
      "no": state + 1 + "",
      "status": "passed"
    }),
    success: function () {
      adPolicyAudit.isRefreshTable = {
        isTrue: true,
        page: String(adPolicyAudit.styledList.currPage + 1)
      };
      callback && callback();
      _self.formatterData();
    },
    error: function () {
      return;
    }
  })
};
adPolicyAudit.enablePolicy = function (ret, index) {
  console.log(ret);
  var confirm_result = confirm(ret ? i18n("ADPOLICYAUDIT_AUDITDISABLEHINT") :
    i18n("ADPOLICYAUDIT_AUDITENABLEHINT"));
  if(!confirm_result) {
    return;
  }
  var url = paasHost + paasAdvDomain + "/ads/adpolicy/state?state=" + (ret ? "disabled" :
    "enabled") + "&" + this.token + new Date().toISOString();
  jQuery.ajax({
    type: "PUT",
    url: url,
    async: true,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("PUT", url)
    },
    data: JSON.stringify([
      this.data[index]
      .adpolicy_id
    ]),
    success: function () {
      console.log("success");
      // alert(ret ? i18n("ADPOLICYAUDIT_AUDITDISABLEHINT") : i18n(
      //   "ADPOLICYAUDIT_AUDITENABLEHINT"))
      //adPolicyAudit.formatterData();
      adPolicyAudit.isRefreshTable = {
        isTrue: true,
        page: String(adPolicyAudit.styledList.currPage + 1)
      };
      adPolicyAudit.formatterData();
    },
    error: function () {
      return;
    }
  })
}
adPolicyAudit.setTag = function (tag, type) {
  var result = {
    tag: [],
    channel: []
  };
  if(tag) {
    switch(type) {
    case "ADPOLICYMANAGE_TABLE_CHANNEL":
      if((typeof tag.channel_tags == 'object') && tag.channel_tags.constructor == Array) {
        tag.channel_tags.forEach(function (item, i) {
          result.tag.push(item.slice(8));
        });
      }
      break;
    case "ADPOLICYMANAGE_TABLE_CATEGORY":
      if((typeof tag.catalog_tags == 'object') && tag.catalog_tags.constructor == Array) {
        tag.catalog_tags.forEach(function (item, i) {
          result.tag.push(item.slice(8));
        });
      }
      break;
    case "ADPOLICYMANAGE_TABLE_AREA":
      if((typeof tag.area_tags == 'object') && tag.area_tags.constructor == Array) {
        tag.area_tags.forEach(function (item, i) {
          result.tag.push(item.slice(5));
        });
      }
      break;
    default:
      if((typeof tag.channel_tags == 'object') && tag.channel_tags.constructor == Array) {
        tag.channel_tags.forEach(function (item, i) {
          result.tag.push(item.slice(8));
        });
      }
      if((typeof tag.catalog_tags == 'object') && tag.channel_tags.constructor == Array) {
        tag.catalog_tags.forEach(function (item, i) {
          result.tag.push(item.slice(8));
        });
      }
      if((typeof tag.area_tags == 'object') && tag.channel_tags.constructor == Array) {
        tag.area_tags.forEach(function (item, i) {
          result.tag.push(item.slice(5));
        });
      }
    }
  }
  return result;
};
adPolicyAudit.find_channel_name = function (key) {
  var result = "";
  channel_list.forEach(function (item) {
    if(item.channel_value == key) {
      result = item.channel_name;
    }
  })
  return result;
}
adPolicyAudit._listTitle = [{
  label: i18n("ADPOLICYAUDIT_TABLE_POLICYID")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_CREATOR")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_TAG")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_CHANNEL")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_PRIORITY")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_WEIGHT")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_BIND")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_ACTIVETIME")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_DURATION")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_OPERATION")
}];
adPolicyAudit._listStyle = {
  borderColor: 'rgb(226,226,226)',
  borderWidth: 1,
  titleHeight: 40,
  titleBg: '#5DA1C0',
  titleColor: '#FFFFFF',
  cellBg: '#FFFFFF',
  evenBg: '#F5F5F5',
  cellColor: '#949494',
  footBg: '#FFFFFF',
  footColor: '#797979',
  iconColor: '#5DA1C0',
  inputBorder: '1px #CBCBCB solid',
  inputBg: '#FFFFFF',
  columnsWidth: [0.20, 0.05, 0.05, 0.07, 0.04, 0.03, 0.12, 0.20, 0.10, 0.10]
};
adPolicyAudit._enabledListTitle = [{
  label: i18n("ADPOLICYAUDIT_TABLE_POLICYID")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_CREATOR")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_STATE")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_TAG")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_CHANNEL")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_PRIORITY")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_WEIGHT")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_BIND")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_ACTIVETIME")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_DURATION")
}, {
  label: i18n("ADPOLICYAUDIT_TABLE_OPERATION")
}];
adPolicyAudit._enabledListStyle = {
  borderColor: 'rgb(226,226,226)',
  borderWidth: 1,
  titleHeight: 40,
  titleBg: '#5DA1C0',
  titleColor: '#FFFFFF',
  cellBg: '#FFFFFF',
  evenBg: '#F5F5F5',
  cellColor: '#949494',
  footBg: '#FFFFFF',
  footColor: '#797979',
  iconColor: '#5DA1C0',
  inputBorder: '1px #CBCBCB solid',
  inputBg: '#FFFFFF',
  columnsWidth: [0.21, 0.05, 0.05, 0.05, 0.06, 0.05, 0.05, 0.09, 0.20, 0.10, 0.05]
};
adPolicyAudit.channelArray = [];
channel_list.forEach(function (item) {
  var obj = {
    key: item.channel_value,
    value: item.channel_name
  };
  adPolicyAudit.channelArray.push(obj);
});
adPolicyAudit.viewAuditHis = function(index) {
  var data = this.data[index];
  var dialog = new AuditHis({
    type: 'ad_policy',
    id: data.adpolicy_id
  })
}
adPolicyAudit.init();
