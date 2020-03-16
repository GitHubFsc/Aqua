var psdAudit = new Object();
psdAudit.init = function () {
  this.token = "user_id=" + my.paas.user_id + "&user_type=" + my.paas.user_type +
    "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey +
    "&timestamp=";
  this.token2 = "user_type=" + my.paas.user_type +
    "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey +
    "&timestamp=";
  this.auditType = 0; //0：图文；1：视频; 2.字幕
  this.auditStep = 'first'; //0:审核；1：启用；2：禁用 --> first:初审|审核 third:终审 second:终审（仅在增强素材审核的时候） enable:启用 disable:禁用
  this.listData = []; //重置当前列表数据
  this.psdName = "";
  this.data = []; //重置当前列表数据
  this.isRefreshTable = { //焦点记忆
    isTrue: false,
    page: 0
  }
  this.initPage();
  this.bindBtnEvents();
  // this.queryData();
  this.formatterData();
};
psdAudit.initPage = function () {
  if(this.auditType == 0) {
    jQuery(".psdAuditMenu .policy_type div[name=type]").removeClass("focus");
    jQuery(".psdAuditMenu #policy_img").addClass("focus");
  } else if(this.auditType == 1) {
    jQuery(".psdAuditMenu .policy_type div[name=type]").removeClass("focus");
    jQuery(".psdAuditMenu #policy_video").addClass("focus");
  } else if(this.auditType == 2) {
    jQuery(".psdAuditMenu .policy_type div[name=type]").removeClass("focus");
    jQuery(".psdAuditMenu #policy_subtitle").addClass("focus");
  }
  jQuery(".psdAuditMenu .policy_status div[name=status]").removeClass("focus").filter('[data-state=' + this.auditStep + ']').addClass('focus');
  //不启用二级审核时，隐藏终审
  switch (SUCAI_AUDIT_LEVEL) {
    case 2:
      if (SUCAI_ENHANCE) {
        jQuery('.psdAuditMenu .policy_status [data-state="third"]').data('state', 'second')
      }
      break;
    default:
    jQuery('.psdAuditMenu .policy_status [data-state="third"]').hide().prev().html(i18n('SUCAI_AUDIT'))
  }
};
psdAudit.bindBtnEvents = function () {
  jQuery(".psdAuditMenu .policy_type div[name=type]").click(function () {
    jQuery(".psdAuditMenu .policy_type div[name=type]").removeClass(
      "focus");
    jQuery(this).addClass("focus")
    psdAudit.auditType = jQuery(this).index();
    psdAudit.formatterData();
  });
  jQuery(".psdAuditMenu .policy_status div[name=status]").click(function () {
    jQuery(".psdAuditMenu .policy_status div[name=status]").removeClass(
      "focus");
    jQuery(this).addClass("focus")
    psdAudit.auditStep = jQuery(this).data('state');
    psdAudit.formatterData();
  });
  jQuery("#policy_searchInput").focusout([], function (event) {
    psdAudit.psdName = jQuery(this).val()
  });
  jQuery("#policy_searchInput").keydown(function (event) {  //回车查询事件
    if(event.keyCode === 13) {
      psdAudit.psdName = jQuery(this).val()
      psdAudit.formatterData();
    }
  });
  jQuery("#policy_searchBtn").click(function () {  //查询按钮查询事件
    psdAudit.psdName = jQuery("#policy_searchInput").val()
    psdAudit.formatterData();
  });
};
/**
 * 返回数字所代表的类型
 * @method function
 * @param  {int} type 素材审核的类型查询条件
 * @return {string}   素材类型
 */
psdAudit.getTypeTextByAuditType = function (type) {
  var ret = "";
  switch(type) {
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
 * @param  {str}                step 审核步骤
 * @return {string}                  审核步骤所代表的后台数据
 */
psdAudit.getStateTextByAuditStep = function (step) {
  var ret = "";
  switch(step) {
  case 'first':
    ret = "first_audit:prepare_audit";
    break;
  case 'second':
    ret = "second_audit:prepare_audit";
    break;
  case 'third':
    ret = "third_audit:prepare_audit";
    break;
  case 'enable':
    ret = "enabled";
    break;
  case 'disable':
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
psdAudit.queryData = function (pageNumber) {
  var _this = psdAudit,
    start = (pageNumber - 1) * 11,
    end = pageNumber * 11 - 1,
    policydata = {};
  var url = paasHost + paasAdvDomain + "/ads/aditem/aditems?" + _this.token + new Date().toISOString() + "&type=" + _this.getTypeTextByAuditType(_this.auditType) + "&state=" + _this.getStateTextByAuditStep(_this.auditStep) + "&name=" + _this.psdName + "&start=" + start + "&end=" + end;
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
    }
  }).done(function (rsp, status, xhr) {
      policydata = rsp;
      var totalCount = xhr.getResponseHeader('x-aqua-total-count');
      _this.styledList.onTotalCount(totalCount || 0);
  });
  _this.data = policydata;
  // for(var item in policydata) {
  //   if(policydata.hasOwnProperty(item)) {
  // psdAudit.data[i][item] = policydata[item] || ""
  //   }
  // }
  // }
  // }
  // });
  _this.transformData();
  return _this.listData;
};
psdAudit.transformData = function () {
  this.listData = [];
  for(var i = 0; i < this.data.length; i++) {
    if(typeof this.data[i] === "undefined") {
      continue;
    }
    if(this.data[i].type == "img" && this.auditType != 0) {
      continue;
    } else if(this.data[i].type == "video" && this.auditType != 1) {
      continue;
    } else if(this.data[i].type == "subtitle" && this.auditType != 2) {
      continue;
    }
    if((typeof this.data[i].name !== "undefined" ? this.data[i].name : "").indexOf(psdAudit.psdName) == -1) {
      continue;
    }
    var row = [];
    row.push({
      label: this.data[i].name
    });
    if(this.auditStep === 'enable' || this.auditStep === 'disable') {
      row.push({
        label: this.data[i].enable ? i18n(
          "ADPOLICYAUDIT_TABLE_STATE_ENABLE") : i18n(
          "ADPOLICYAUDIT_TABLE_STATE_DISABLE")
      });
    }
    // var username = '<a style="text-decoration: underline;cursor: pointer;color: #3c94bb;" data-id="' + this.data[i].user_id + '" onclick="psdAudit.showUserDialog(this)" onmouseover="psdAudit.showUserDialog(this, true)">' + (this.data[i].user_name || '') + '</a>'
    var username = '<a style="text-decoration: underline;cursor: pointer;color: #3c94bb;" data-id="' + this.data[i].user_id + '" onclick="psdAudit.showUserDialog(this)">' + (this.data[i].user_name || '') + '</a>'
    row.push({
      label: username
    });
    row.push({
      label: this.data[i].type === "subtitle" ? ("<div title=\"" + this.data[i].subtitle_content + "\">" + this.data[i].subtitle_content + "</div>") : (this.data[i].type === "img" ? this.data[i].width + "x" + this.data[i].height : this.data[i].size)
    });
    if(this.data[i].type != "subtitle") {
      row.push({
        label: this.data[i].level
      });
    }
    var op_view = "<span onclick='psdAudit.view(" + i + ")'>" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_VIEW") + "</span>"
    var op_disable = "<span " + (my.paas.user_type == "1" ? "onclick='psdAudit.enablePolicy(true," + i + ")'" : "style='cursor:default;color:#797979'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_DISABLE") + "</span>"
    var op_enable = "<span " + (my.paas.user_type == "1" ? "onclick='psdAudit.enablePolicy(false," + i + ")'" : "style='cursor:default;color:#797979'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_ENABLE") + "</span>"
    var op_deney = "<span " + (my.paas.user_type == "1" ? "onclick='psdAudit.showDialog(" + i + ")'" : "style='cursor:default;color:#797979'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_DENEY") + "</span>"
    var op_pass = "<span " + (my.paas.user_type == "1" ? "onclick='psdAudit.passAudit(" + i + ")'" : "style='cursor:default;color:#797979'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_PASS") + "</span>"
    var op_audithis = "<span " + (my.paas.user_type == "1" ? "onclick='psdAudit.viewAuditHis(" + i + ")'" : "style='cursor:default;color:#797979'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS") + "</span>"
    if(this.auditStep === 'enable' || this.auditStep === 'disable') {
      row.push({
        label: [op_view, op_audithis, this.data[i].enable ? op_disable : op_enable].join('')
      });
    } else {
      row.push({
        label: [op_view, op_audithis, op_deney, op_pass].join('')
      });
    }
    switch((typeof this.data[i].state !== "undefined" ? this.data[i].state : "").indexOf(":") !== -1 ? this.data[i].state.split(":")[0] : this.data[i].state) {
    case "first_audit":
      if(this.auditStep == 'first') {
        this.listData.push(row);
      }
      break;
      case "second_audit":
        if(this.auditStep == 'second') {
          this.listData.push(row);
        }
        break;
    case "third_audit":
      if(this.auditStep == 'third') {
        this.listData.push(row);
      }
      break;
    case "enabled":
      if(this.auditStep == 'enable') {
        this.listData.push(row);
      }
      break;
    case "disabled":
      if(this.auditStep == 'disable') {
        this.listData.push(row);
      }
      break;
    default:
    }
  }
};
/**
 * fresh list & update this.styledList
 * @method function
 * @return {undefined} [description]
 */
psdAudit.formatterData = function () {
  var that = this;
  var titles = ['first', 'third', 'second'].includes(that.auditStep) ? this._listTitle[this.auditType] : this._enabledListTitle[this.auditType];
  var styledList_config = {
    containerId: "psdAuditTable",
    rows: 11,
    columns: ['first', 'third', 'second'].includes(that.auditStep) ? 5 : 6,
    data: that.listData,
    titles: titles,
    listType: 1,
    styles: ['first', 'third', 'second'].includes(that.auditStep) ? that._listStyle : that._enabledListStyle,
    // totalCount: conf.totalCount || 0,
    updateTitle: true
  };
  if(this.auditType == "2") {
    styledList_config.columns = ['first', 'third', 'second'].includes(that.auditStep) ? 4 : 5;
    styledList_config.styles = JSON.parse(JSON.stringify(styledList_config.styles));
    styledList_config.styles.columnsWidth = ['first', 'third', 'second'].includes(that.auditStep) ? [0.25, 0.1, 0.5, 0.15] : [0.15, 0.1, 0.1, 0.5, 0.15];
  }
  this.styledList = new StyledList(styledList_config);
  this.styledList.getPageData = this.queryData;
  this.styledList.create();
  //添加焦点记忆功能，判断是否为修改刷新列表
  var isEditObj = this.isRefreshTable;
  if(isEditObj && isEditObj.isTrue === true) {
    isEditObj.isTrue = false;
    var cur_page = this.styledList.pagesLmt < parseInt(isEditObj.page) ? this.styledList.pagesLmt : parseInt(isEditObj.page)
    this.styledList.changePage(cur_page);
  }
};
psdAudit.showDialog = function (index) {
  var dialogContentURL = "",
    dialogHeight = "",
    dialogWidth = "",
    afterDrawn, _that = this;
  dialogContentURL = "content/su_cai_shen_he/auditDeneyDialog.html";
  dialogHeight = 342;
  dialogWidth = 760;
  afterDrawn = function () {
    _that.afterDrawn(index)
  };
  // if (my.paas.user_type !== "1") {
  //   alert(i18n("ADPOLICYAUDIT_NORIGHTS"));
  //   return;
  // };
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
psdAudit.afterDrawn = function (index) {
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
psdAudit.sendDeneyMsg = function (index) {
  var msg = jQuery(".auditDialogDeneyReason").val();
  //send Msg
  console.log("sendMsg:" + msg);
  console.log("sendindex:" + index);
  // var url = paasHost + paasDomain + "/auditflow/instance/ad_item/" + this.data[index].ad_id + "?" + this.token + new Date().toISOString(),
  var url = `${paasHost + paasDomain}/auditflow/instance/${SUCAI_ENHANCE ? 'ad_item_2' : 'ad_item'}/${this.data[index].ad_id}?${this.token + new Date().toISOString()}`
      no = 1;
  if (SUCAI_AUDIT_LEVEL == 2) {
    if (this.auditStep == 'third') {
      no = 2
    }
  }
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
      "no": String(no),
      "status": "deprecated",
      "reason": "failure reason " + msg
    }),
    success: function () {
      psdAudit.dialog.close();
      psdAudit.isRefreshTable = {
        isTrue: true,
        page: String(psdAudit.styledList.currPage)
      };
      psdAudit.formatterData();
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
psdAudit.view = function (index) {
  console.log("view policy");
  var app = new PreviewModel();
  app.previewSuCai(this.data[index].ad_id);
};
/**
 * add token to url
 * @method function
 * @return {string} ret
 */
psdAudit.addToken = function (url) {
    var ret = url;
    // var arrObj = url.split("//");
    // var tmp1 = (arrObj[1].indexOf("/") >= 0) ? arrObj[1].indexOf("/") : 0;
    // var tmp2 = arrObj[1].indexOf("?");
    // var urlPath = arrObj[1].substr(tmp1, ((tmp2 >= 0) ? (tmp2) : arrObj[1].length) -
    //   tmp1);
    var tmp1 = (url.indexOf("/") >= 0) ? url.indexOf("/") : 0;
    var tmp2 = url.indexOf("?");
    var urlPath = url.substr(tmp1, ((tmp2 >= 0) ? (tmp2) : url.length) - tmp1);
    var nowDateTime = new Date().getTime();
    var StringToSign = "GET" + "\n" + "" + "\n" + nowDateTime + "\n" + urlPath;
    var isTokenExist = ret.indexOf("aquatoken") > 0 ? true : false;
    if(isTokenExist) {
      ret = ret.replace(ret.substr(ret.indexOf("aquatoken")), "")
    } else {
      if(tmp2 < 0) {
        ret += "?";
      } else {
        ret += "&";
      }
    }
    ret += "aquatoken=" + encodeURIComponent(my.aqua.accessKeyId) + ":" +
      encodeURIComponent(my.base64Encode(str_hmac_sha1(my.aqua.secretAccessKey,
        StringToSign)));
    ret += "&xaquadate=" + nowDateTime;
    return ret;
  }
  /**
   * pass audit btn
   * @method function
   * @return {undefined} pass this audit
   */
psdAudit.passAudit = function (index) {
  var _self = this;
  console.log("pass audit function");
  console.log("sendindex:" + index);
  var confirm_result = confirm(i18n("ADPOLICYAUDIT_AUDITPASSHINT"));
  if(!confirm_result) {
    return;
  }
  // var url = paasHost + paasDomain + "/auditflow/instance/ad_item/" + this.data[index].ad_id + "?" + this.token + new Date().toISOString();
  var data = this.data[index]
  var url = `${paasHost + paasDomain}/auditflow/instance/${SUCAI_ENHANCE ? 'ad_item_2': 'ad_item'}/${data.ad_id}?${this.token + new Date().toISOString()}`;
  var no = 1;
  if (SUCAI_AUDIT_LEVEL == 2) {
    if (_self.auditStep == 'third' || _self.auditStep == 'second') {
      no  = 2
    }
  }
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
      "no": String(no),
      "status": "passed"
    }),
    success: function () {
      psdAudit.isRefreshTable = {
        isTrue: true,
        page: String(psdAudit.styledList.currPage)
      };
      psdAudit.formatterData();
    },
    error: function () {
      return;
    }
  })
};
psdAudit.enablePolicy = function (ret, index) {
  var confirm_result = confirm(ret ? i18n("ADPOLICYAUDIT_AUDITDISABLEHINT") :
    i18n("ADPOLICYAUDIT_AUDITENABLEHINT"));
  if(!confirm_result) {
    return;
  }
  var url = paasHost + paasAdvDomain + "/ads/aditem/state?state=" + (ret ? "disabled" :
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
    data: JSON.stringify([this.data[index].ad_id]),
    success: function () {
      psdAudit.isRefreshTable = {
        isTrue: true,
        page: String(psdAudit.styledList.currPage + 1)
      };
      psdAudit.formatterData();
    },
    error: function () {
      return;
    }
  })
}
psdAudit._listTitle = [
  [{
    label: i18n("PSDAUDIT_TABLE_PSDNAME")
  }, {
    label: i18n("PSDAUDIT_TABLE_CREATOR")
  }, {
    label: i18n("PSDAUDIT_TABLE_SIZE")
  }, {
    label: i18n("PSDAUDIT_TABLE_WEIGHT")
  }, {
    label: i18n("PSDAUDIT_TABLE_OPERATION")
  }],
  [{
    label: i18n("PSDAUDIT_TABLE_PSDNAME")
  }, {
    label: i18n("PSDAUDIT_TABLE_CREATOR")
  }, {
    label: i18n("PSDAUDIT_TABLE_LENGTH")
  }, {
    label: i18n("PSDAUDIT_TABLE_WEIGHT")
  }, {
    label: i18n("PSDAUDIT_TABLE_OPERATION")
  }],
  [{
    label: i18n("PSDAUDIT_TABLE_PSDNAME")
  }, {
    label: i18n("PSDAUDIT_TABLE_CREATOR")
  }, {
    label: i18n("SUCAI_ZIMUNEIRONG")
  }, {
    label: i18n("PSDAUDIT_TABLE_OPERATION")
  }],
];
psdAudit._listStyle = {
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
  columnsWidth: [0.5, 0.1, 0.15, 0.1, 0.15]
};
psdAudit._enabledListTitle = [
  [{
    label: i18n("PSDAUDIT_TABLE_PSDNAME")
  }, {
    label: i18n("PSDAUDIT_TABLE_STATE")
  }, {
    label: i18n("PSDAUDIT_TABLE_CREATOR")
  }, {
    label: i18n("PSDAUDIT_TABLE_SIZE")
  }, {
    label: i18n("PSDAUDIT_TABLE_WEIGHT")
  }, {
    label: i18n("PSDAUDIT_TABLE_OPERATION")
  }],
  [{
    label: i18n("PSDAUDIT_TABLE_PSDNAME")
  }, {
    label: i18n("PSDAUDIT_TABLE_STATE")
  }, {
    label: i18n("PSDAUDIT_TABLE_CREATOR")
  }, {
    label: i18n("PSDAUDIT_TABLE_LENGTH")
  }, {
    label: i18n("PSDAUDIT_TABLE_WEIGHT")
  }, {
    label: i18n("PSDAUDIT_TABLE_OPERATION")
  }],
  [{
    label: i18n("PSDAUDIT_TABLE_PSDNAME")
  }, {
    label: i18n("PSDAUDIT_TABLE_STATE")
  }, {
    label: i18n("PSDAUDIT_TABLE_CREATOR")
  }, {
    label: i18n("SUCAI_ZIMUNEIRONG")
  }, {
    label: i18n("PSDAUDIT_TABLE_OPERATION")
  }],
];
psdAudit._enabledListStyle = {
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
  columnsWidth: [0.4, 0.1, 0.1, 0.15, 0.1, 0.15]
};
psdAudit.showUserDialog = function(el, hoverstate) {
  var user_id = jQuery(el).data('id');
  var user_name = jQuery(el).html();
  var dialog = new UserInfo({
    id: user_id,
    type: user_id == my.paas.user_id ? 'self': 'others',
    name: user_name,
    isfloat: hoverstate ? hoverstate : false,
    scope: el
  })
}
psdAudit.viewAuditHis = function (index) {
  var data = this.data[index]
  var dialog = new AuditHis({
    type: 'ad_item',
    id: data.ad_id
  });
}
psdAudit.init();
