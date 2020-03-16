var adPolicyManage = new Object();
adPolicyManage.init = function () {
  //my.paas.user_type  0:广告主 1：运营商 2:出版者
  // this.token = "user_id=" + my.paas.user_id + "&user_type=" + my.paas.user_type + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=";
  // this.token2 = "user_type=" + my.paas.user_type + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=";
  this.policyType = 0; //0:图文；1:贴片 2:字幕
  this.policyState = -1; //-1:所有；0：初审；1：复审；2：终审；3：启用；4：禁用 5：否决
  this.policyName = "";
  this.listData = []; //重置当前列表数据
  this.site = ""; //当前过滤器选择站点
  this.data = []; //当前数据
  this.version = "solo";
  this.siteList = {}; //站点列表
  this.adpArray = []; //广告位列表
  if(window.AdvSystemType) {
    this.version = window.AdvSystemType
  }
  this.initPage();
  this.bindBtnEvents();
  // this.queryData();
  this.formatterData();
};
adPolicyManage.getToken = function ({type, user_type = my.paas.user_type, user_id = my.paas.user_id}) {
  //默认token为审核token
  var token = "user_type=" + user_type + "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString();
  if (type == 1) {//普通的token
    token += '&user_id=' + user_id;
  }
  return token;
}
adPolicyManage.initPage = function () {
  //获取site列表
  this.getSiteList();
  //初始化页面按钮状态以及UI
  jQuery(".adPolicyManageMenu .policy_type div[name=type]").removeClass("focus");
  jQuery(".adPolicyManageMenu .policy_type div[name=type]:eq(" + this.policyType + ")").addClass("focus");
  this.policyStateBox = new newSelect("#policy_state", {
    "-1": i18n("ADPOLICYMANAGE_POLICYSTATUE_ALLSTATE"),
    "0": i18n("ADPOLICYMANAGE_POLICYSTATUE_FIRSTAUDIT"),
    "1": i18n("ADPOLICYMANAGE_POLICYSTATUE_SECONDAUDIT"),
    "2": i18n("ADPOLICYMANAGE_POLICYSTATUE_THIRDAUDIT"),
    "3": i18n("ADPOLICYMANAGE_POLICYSTATUE_ENABLE"),
    "4": i18n("ADPOLICYMANAGE_POLICYSTATUE_DISABLE"),
    "5": i18n("ADPOLICYMANAGE_POLICYSTATUE_DEPRECATED")
  }, {
    width: 120,
    height: 36,
    background: "#f4f4f4",
    selectbackground: "#d3d3d3"
  }, function () {
    adPolicyManage.policyState = this.header.attr("data-key");
    adPolicyManage.formatterData();
  });
  let channel = [];
  for(var item in this.siteList) {
    if(this.siteList.hasOwnProperty(item)) {
      channel.push({
        label: this.siteList[item],
        site: item
      })
    }
  }
  if (AdvSystemType == "central") {
    this.filter = getCombiSelector({
      label: i18n("ADPOLICYMANAGE_FILTER_TITLE"),
      container: "#policy_filter",
      channels: channel,
      onChange: (channels) => {
        filterSites = channels.map(function (channel) {
          return channel.site
        })
        this.site = filterSites.join(",");
        this.formatterData();
      }
    });
    this.filter.create();
  } else {
    jQuery(".policy_filter").hide();
  }
  if (my.paas.user_type == '1') {
    jQuery('.policy_choose_user').show()
  } else {
    jQuery('.policy_choose_user').hide();
  }
  //设置初始值
  jQuery("#policy_state .select-header").attr("data-key", "-1");
  jQuery("#policy_state .select-header").text(i18n("ADPOLICYMANAGE_POLICYSTATUE_ALLSTATE"));
};
adPolicyManage.bindBtnEvents = function () {
  let $ = jQuery;
  $('.adPolicyManageMenu').
  on('click', '.policy_type div[name=type]', ({target, currentTarget}) => {
    if (target == currentTarget) {
      $(".adPolicyManageMenu .policy_type div[name=type]").removeClass("focus");
      $(currentTarget).addClass("focus")
      adPolicyManage.policyType = $(currentTarget).index();
    delete adPolicyManage.styledList;
    adPolicyManage.formatterData();
    }
  })
  .on('click', '#policy_add_btn', ({target, currentTarget}) => {
      switch (my.paas.user_type) {
        case '1':
          $(currentTarget).find('.policy_choose_user').toggleClass('open')
          break;
        default:
          adPolicyManage.showDialog(true);
      }
  })
  .on('click', '#policy_add_btn .policy_choose_user > div', ({currentTarget, target}) => {
    if (my.paas.user_type == '1') {
      if($(currentTarget).attr('name') == 'adv'){
        var dialog = new chooseSelfAdvUser();
        dialog.init((user_id, user_name)=>{
          adPolicyManage.showDialog(true, null, null, user_id, user_name);
        })
      } else {
    adPolicyManage.showDialog(true);
      }
    }
  })
  .on('focusout', '#search_by_name #policy_searchInput', ({target, currentTarget}) => {
    if (currentTarget == target) {
      adPolicyManage.policyName = $(currentTarget).val();
    }
  })
  .on('keydown', '#search_by_name #policy_searchInput', ({currentTarget, target, keyCode, which}) => {
    if (target == currentTarget) {
      var key = keyCode || which;
      if (key ==13) {
        adPolicyManage.policyName = $(currentTarget).val()
        adPolicyManage.styledList.currPage = 0;
        adPolicyManage.formatterData();
      }
    }
  })
  .on('click', '#search_by_name #policy_searchBtn', ({currentTarget, target}) => {
    if (currentTarget == target) {
      adPolicyManage.policyName = $(currentTarget).siblings('#policy_searchInput').val()
      adPolicyManage.styledList.currPage = 0;
      adPolicyManage.formatterData();
    }
  })
  .on('focusout', '#search_by_user #policy_searchInput', ({target, currentTarget}) => {
    if (currentTarget == target) {
      adPolicyManage.user = $(currentTarget).val();
    }
  })
  .on('keydown', '#search_by_user #policy_searchInput', ({currentTarget, target, keyCode, which}) => {
    if (target == currentTarget) {
      var key = keyCode || which;
      if (key ==13) {
        adPolicyManage.user = $(currentTarget).val()
        adPolicyManage.styledList.currPage = 0;
        adPolicyManage.formatterData();
      }
    }
  })
  .on('click', '#search_by_user #policy_searchBtn', ({currentTarget, target}) => {
    if (currentTarget == target) {
      adPolicyManage.user = $(currentTarget).siblings('#policy_searchInput').val()
      adPolicyManage.styledList.currPage = 0;
      adPolicyManage.formatterData();
    }
  })
};
/**
 * 返回后台所需要的type类型
 * @method getTypeTextByPolicyType
 * @param  {int}                policyType 页面上的policyType主要是图文（0）、贴片（1）、字幕（1）
 * @return {string}                        后台所需要的type类型
 */
adPolicyManage.getTypeTextByPolicyType = function (policyType) {
  var ret = "";
  switch(policyType) {
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
 * 返回请求中所需要的策略状态值
 * @method getAuditStateByPolicyState
 * @param  {string}                   policyState 状态下拉框所传递的值 -1:全部 0:初审 1:复审 2:终审 3:启用 4:禁用 5:审核失败
 * @return {string}                               策略state的值
 */
adPolicyManage.getAuditStateByPolicyState = function (policyState) {
  var ret = "";
  switch(policyState) {
  case "0":
    ret = "first_audit:prepare_audit"
    break;
  case "1":
    ret = "second_audit:prepare_audit"
    break;
  case "2":
    ret = "third_audit:prepare_audit"
    break;
  case "3":
    ret = "enabled"
    break;
  case "4":
    ret = "disabled"
    break;
  case "5":
    ret = "deprecated"
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
adPolicyManage.queryData = function (pageNumber) {
  var _this = adPolicyManage,
    start = (pageNumber - 1) * 11,
    end = pageNumber * 11 - 1,
    options = ["start=" + start,"end=" + end,_this.getToken({type: 1, user_id: my.paas.user_id})],
    url = paasHost + paasAdvDomain + "/ads/adpolicy/adpolicys?";
    if (_this.getTypeTextByPolicyType(_this.policyType)) {
      options.push("type=" + _this.getTypeTextByPolicyType(_this.policyType));
    }
    if (_this.policyName) {
      options.push("name=" + _this.policyName);
    }
    if (_this.user) {
      options.push("user_name=" + _this.user);
    }
    if (_this.getAuditStateByPolicyState(_this.policyState)) {
      options.push("state=" + _this.getAuditStateByPolicyState(_this.policyState));
    }
  if(_this.site) {
    options.push("site_id=" + _this.site);
  }
  if (my.paas.platform_current_id) {
    options.push('platform_id_list=' + my.paas.platform_current_id)
  }
  url += options.join("&")
  //查询广告位数据
  _this.listAdp({save: true, user_id: my.paas.user_id});
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
    var totalCount = xhr.getResponseHeader('x-aqua-total-count');
    _this.styledList.onTotalCount(totalCount || 0);
    _this.data = rsp;
    _this.listData = _this.transformData(rsp);
  });
  return _this.listData;
  // _this.formatterData();
};
adPolicyManage.transformData = function (data) {
  var _this = adPolicyManage;
  var that = this;
  var result = [];
  for(var i = 0; i < data.length; i++) {
    var obj = [];
    var item = data[i];

    var metadata_tag = _this.setTag(data[i].metadata, null);
    var tag_text = metadata_tag.tag.join(",");
    var channel_text = "";
    var channel_key = metadata_tag.tag.map(function (item) {
      return "channel:" + item;
    });
    var channel_list = [];
    if(channel_key.length !== 0) {
      channel_list = this.listChannelOfChannelTag(channel_key.join(","));
    }
    channel_list = channel_list.map(function (item) {
      return that.find_channel_name(item.obj_id);
    });
    channel_text = channel_list.join(",");

    //数据
    var site = ((_this.siteList && _this.siteList[item.site_id]) || "") + (item.site_id == window.AdvSelfSiteId ? i18n("ADPOS_SITE_SELF_SUFFIX") : "");
    var name = item.name;
    var state = i18n("ADPOLICYMANAGE_TABLE_STATE_" + item.state.split(":")[0].toUpperCase()) || "";
    var creator = item.user_name || "";
    var tag = tag_text;
    var channel = channel_text
    var priority = item.priority;
    var weight = item.weight;
    var adname = item.adgroup_id ? _this.getAdEl(0, item.adgroup_id) : _this.getAdEl(1, item.ad_single_id);
    var adpos = "";
    var active_time = _this.showTime(data[i].activatetime || "") + " -- " + _this.showTime(data[i].expiretime || "");
    var play_time = _this.showTime(data[i].play_begintime) + " -- " + _this.showTime(data[i].play_endtime);
    var adp = item.adp_list && item.adp_list[_this.policyType]


    var siteEl = "<div title=" + site + ">" + site + "</div>";
    var nameEl = "<div title=" + name + ">" + name + "</div>";
    var stateEl = "<div title=" + state + ">" + state + "</div>";
    var creatorEl = "<div title=" + creator + ">" + creator + "</div>";
    var tagEl = "<div title=" + tag + ">" + tag + "</div>";
    var channelEl = "<div title=" + channel + ">" + channel + "</div>";
    var priorityEl = "<div title=" + priority + ">" + priority + "</div>";
    var weightEl = "<div title=" + weight + ">" + weight + "</div>";
    var adnameEl = "<div title=" + adname + ">" + adname + "</div>";
    var adposEl = "<div title=" + adpos + ">" + adpos + "</div>";
    var active_timeEl = "<div title=" + active_time + ">" + active_time + "</div>";
    var play_timeEl = "<div title=" + play_time + ">" + play_time + "</div>";
    var op_view = "<span " + (my.paas.user_type !== "2" ? "onclick='adPolicyManage.showDialog(false," + i + ",true)'" : "style='cursor:default;color:#797979;'") + ">" + i18n("ADPOLICYMANAGE_VIEW") + "</span>";
    var op_edit = "<span " + (my.paas.user_type !== "2" ? "onclick='adPolicyManage.showDialog(false," + i + ")'" : "style='cursor:default;color:#797979;'") + ">" + i18n("ADPOLICYMANAGE_TABLE_EDIT") + "</span>";
    var op_more = "<span name='" + i18n('SELF_SERVICE_ADVISER_MANAGE_MORE') + "' class='more' onClick='adPolicyManage.toggleExpand(this, " + i + ", event)'></span>"
    var op_patch = "<span " + (my.paas.user_type !== "2" ? "onclick='adPolicyManage.viewDistribute(" + i + ")'" : "style='cursor:default;color:#797979;'") + ">" + i18n("ADPOS_OPERATION_DIST") + "</span>";
    var op_del = "<span " + (my.paas.user_type !== "2" ? "onclick='adPolicyManage.deletePolicy(" + i + ")'" : "style='cursor:default;color:#797979;'") + ">" + i18n("ADPOLICYMANAGE_TABLE_DELETE") + "</span>";
    var op_audit_his = "<span " + (my.paas.user_type !== "2" ? "onclick='adPolicyManage.viewAuditHis(" + i + ")'" : "style='cursor:default;color:#797979;'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS") + "</span>";
    var op_connect = "<span onclick='adPolicyManage.showConnect(" + i + ")'>" + i18n("ADPOS_OPERATION_CONNECT") + "</span>";
    if(window.AdvSystemType !== "solo") {
      obj.push({
        label: siteEl
      });
    }
    obj.push({
      label: nameEl
    });
    obj.push({
      label: stateEl
    });
    obj.push({
      label: creatorEl
    });
    obj.push({
      label: tagEl
    });
    obj.push({
      label: channelEl
    });
    obj.push({
      label: priorityEl
    });
    obj.push({
      label: weightEl
    });
    obj.push({
      label: adnameEl
    });
    if(_this.policyType == 1) {
      obj.push({
        label: adposEl
      });
    }
    obj.push({
      label: active_timeEl
    });
    obj.push({
      label: play_timeEl
    });
    if(window.AdvSelfSiteId == item.site_id) {
      if(window.AdvSelfSiteId == window.AdvCentralSiteId && window.AdvSystemType == "central") {
        obj.push({
          label: [op_connect, op_view, op_edit, op_more].join('')
        });
      } else {
        obj.push({
          label: [op_view, op_edit, op_more].join('')
        });
      }
    } else {
      obj.push({
        label: op_view
      });
    }

    switch(item.state.indexOf(":") !== -1 ? item.state.split(":")[0] : item.state) {
    case "first_audit":
      if(this.policyState == "0" || this.policyState == "-1") {
        result.push(obj);
      }
      break;
    case "second_audit":
      if(this.policyState == "1" || this.policyState == "-1") {
        result.push(obj);
      }
      break;
    case "third_audit":
      if(this.policyState == "2" || this.policyState == "-1") {
        result.push(obj);
      }
      break;
    case "enabled":
      if(this.policyState == "3" || this.policyState == "-1") {
        result.push(obj);
      }
      break;
    case "disabled":
      if(this.policyState == "4" || this.policyState == "-1") {
        result.push(obj);
      }
      break;
    case "deprecated":
      if(this.policyState == "5" || this.policyState == "-1") {
        result.push(obj);
      }
      break;
    default:
      if(this.policyState == "-1") {
        result.push(obj);
      }
      break;
    }
  }
  return result;
};
/**
 * fresh list & update this.styledList
 * @method function
 * @return {undefined} [description]
 */
adPolicyManage.formatterData = function () {
  if(this.styledList) {
    this.styledList.data = this.listData;
    this.styledList.refreshList();
  } else {
    var conf = this.getTableConfiguration();
    this.styledList = new StyledList(conf);
    this.styledList.getPageData = this.queryData;
    this.styledList.create();
  };
};
adPolicyManage.getTableConfiguration = function () {
  var _this = adPolicyManage,
    columns = 11,
    titles = [].concat(_this._defaultListTitle),
    styles = new _this._defaultListStyle();
  switch(_this.policyType) {
  case 0: //图文策略
    if(_this.version !== "solo") {
      columns = 12;
      titles.insert(0, {
        label: i18n("ADPOS_SITE_NAME")
      });
      styles.columnsWidth = [0.05, 0.08, 0.04, 0.05, 0.04, 0.06, 0.04, 0.03, 0.1, 0.16, 0.1, 0.25];
    }
    break;
  case 1: //贴片策略
    columns = 12;
    titles = [].concat(_this._videoListTitle);
    styles.columnsWidth = [0.06, 0.05, 0.06, 0.05, 0.06, 0.05, 0.04, 0.1, 0.05, 0.15, 0.08, 0.25];
    if(_this.version !== "solo") {
      columns = 13;
      titles.insert(0, {
        label: i18n("ADPOS_SITE_NAME")
      });
      styles.columnsWidth = [0.05, 0.08, 0.04, 0.05, 0.04, 0.05, 0.04, 0.03, 0.1, 0.05, 0.14, 0.08, 0.25];
    }
    break;
  case 2: //字幕策略
    if(_this.version !== "solo") {
      columns = 12;
      titles.insert(0, {
        label: i18n("ADPOS_SITE_NAME")
      });
      styles.columnsWidth = [0.05, 0.08, 0.04, 0.05, 0.04, 0.06, 0.04, 0.03, 0.1, 0.16, 0.1, 0.25];
    }
    break;
  default:
  }
  return {
    containerId: "adPolicyManageTable",
    rows: 11,
    columns: columns,
    data: _this.listData,
    titles: titles,
    listType: 1,
    styles: styles,
    updateTitle: true
  };
};
/**
 * show policy dialog
 * @method function
 * @param isNew true:create  false:edit
 * @param index data index,if null means there is no such data,u can read the data from tmpData
 * @param readOnly
 * @param user_id  creator's paas_id
 * @param user_name  creator's name
 * @return {undefined} [description]
 */
adPolicyManage.showDialog = function (isNew, index, readOnly, user_id, user_name) {
  var _this = this,
    data,
    dialogContentURL = "content/ce_lue_guan_li/adPolicyEdit.html",
    dialogHeight = 674,
    dialogWidth = 760,
    defaultData = {
      "name": "",
      "type": _this.getTypeTextByPolicyType(_this.policyType),
      "priority": 0,
      "weight": 1,
      "activatetime": "1970-01-01T00:00:00" + _this.getGMT(),
      "expiretime": "2099-01-01T00:00:00" + _this.getGMT(),
      "play_begintime": "00:00:00" + _this.getGMT(),
      "play_endtime": "00:00:00" + _this.getGMT(),
      "adp_list": [],
      "tags": [],
      "adgroup_id": null,
      "ad_single_id": null,
      "patch_location": "",
      "metadata": {
        "channel_tags": [],
        "catalog_tags": [],
        "area_tags": [],
      },
      "user_id": user_id||my.paas.user_id,
      "user_name": user_name||my.paas.user_name
    };
  if(my.paas.user_type === "2") {
    alert(i18n("ADPOLICYMANAGE_NORIGHTTOCREATEPOLICY"));
    return;44};
  _this.dialog = new PopupDialog({
    url: dialogContentURL,
    width: dialogWidth,
    height: dialogHeight,
    context: this,
    callback: _this.afterDrawnDialog
  });
  _this.dialog.readOnly = !!readOnly;
  if(isNew) {
    data = defaultData;
  } else {
    data = typeof index !== "undefined" ? _this.data[index] : _this.dialog.data;
    if(typeof data.metadata.channel_tags == "undefined") {
      data.metadata.channel_tags = [];
    }
    if(typeof data.metadata.area_tags == "undefined") {
      data.metadata.area_tags = [];
    }
    if(typeof data.metadata.catalog_tags == "undefined") {
      data.metadata.catalog_tags = [];
    }
  }
  _this.dialog.data = JSON.parse(JSON.stringify(data));
  _this.dialog.isNew = isNew;
  this.dialog.open();
};
/**
 * [加载完成策略弹框后的数据绑定以及按键绑定]
 * @method function
 * @return {[type]} [description]
 */
adPolicyManage.afterDrawnDialog = function () {
  var _this = this;
  _this.initDialog();
  _this.bindDialogEvents();
  // jQuery(".radio:eq(0)").click()
  // if(!_this.dialog.isNew) {
  _this.loadDialogData();
  // }
};
adPolicyManage.loadDialogData = function (index) {
  var _this = this,
    dialog = _this.dialog,
    data = _this.dialog.data,
    $ = jQuery;
  $("#creator").val(data.user_name);
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
  // 计费方式
  if (dialog.chargeType && data.charge_type) {
    dialog.chargeType.setValue(dialog.chargeType.selectItem.filter(item => item.key == data.charge_type)[0].value)
  }
  $("#policy_priority").val(data.priority);
  dialog.policyWeightBox.setValue(data.weight);
  //兼容处理
  if(data.activatetime.indexOf("T") >= 0) {
    data.activatetime = data.activatetime.replace("T", " ");
  }
  if(data.expiretime.indexOf("T") >= 0) {
    data.expiretime = data.expiretime.replace("T", " ");
  }
  dialog.validTimeDataPicker.setCurrDate(dialog.validTimeDataPicker.parseDateStr(data.activatetime.split(" ")[0]));
  dialog.validTimeHourBox.setValue((data.activatetime.split(" ")[1] ? data.activatetime.split(" ")[1] : "00:00:00").split(":")[0]);
  dialog.validTimeMinuteBox.setValue((data.activatetime.split(" ")[1] ? data.activatetime.split(" ")[1] : "00:00:00").split(":")[1]);
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
  dialog.validTimeSecondBox.setValue(showTimeSecond((data.activatetime.split(" ")[1] ? data.activatetime.split(" ")[1] : "00:00:00").split(":")[2]));

  dialog.durationStartTimeHourBox.setValue(data.play_begintime.split(":")[0]);
  dialog.durationStartTimeMinuteBox.setValue(data.play_begintime.split(":")[1]);
  dialog.durationStartTimeSecondBox.setValue(showTimeSecond(data.play_begintime.split(":")[2]));
  dialog.invalidTimeDataPicker.setCurrDate(dialog.validTimeDataPicker.parseDateStr(data.expiretime.split(" ")[0]));
  dialog.invalidTimeHourBox.setValue((data.expiretime.split(" ")[1] ? data.expiretime.split(" ")[1] : "00:00:00").split(":")[0]);
  dialog.invalidTimeMinuteBox.setValue((data.expiretime.split(" ")[1] ? data.expiretime.split(" ")[1] : "00:00:00").split(":")[1]);
  dialog.invalidTimeSecondBox.setValue(showTimeSecond((data.expiretime.split(" ")[1] ? data.expiretime.split(" ")[1] : "00:00:00").split(":")[2]));

  dialog.durationEndTimeHourBox.setValue(data.play_endtime.split(":")[0]);
  dialog.durationEndTimeMinuteBox.setValue(data.play_endtime.split(":")[1]);
  dialog.durationEndTimeSecondBox.setValue(showTimeSecond(data.play_endtime.split(":")[2]));

  //todo 获得标签 名字
  // var tag_data = this.setTag(data.metadata, dialog.currTagType);
  // $("#policy_tag").val(tag_data.tag.join(","));
  $("#channel_tags").val(data.metadata.channel_tags.map(item => item.replace('channel:','')).join(",")).attr("title", $("#channel_tags").html());
  $("#catalog_tags").val(data.metadata.catalog_tags.map(item => item.replace('catalog:','')).join(",")).attr("title", $("#catalog_tags").html());
  $("#area_tags").val(data.metadata.area_tags.map(item => {
    if (/^area:/g.test(item)) {
      return item.replace('area:','')
    }
  }).filter(item => item).join(",")).attr("title", $("#area_tags").html());
  //加载带星号的区域精准
  if (data.area_tags2 && data.area_tags2.length > 0) {
    $('#area_tags_2').val(data.area_tags2.filter(item => item).join(',')).attr('title', $('#area_tags2').html())
  } else {
    $('#area_tags_2').val(data.metadata.area_tags.map(item => {
      if (!/^area:/g.test(item)) {
        return item
      }
    }).filter(item => item).join(',')).attr('title', $('#area_tags2').html())

  }
  if(!data.adp_list || data.adp_list.length === 0) {
    $("#unbind_adv.check_box").click();
  } else {
    // dialog.bindAdvBox.setValue(this.bindAdvBox.selectItem[data.adp_list[0]]);
    var ext_id = data.adp_list[0];
    var adv_name = _this.findAdpNameByExtId(ext_id);
    $("#policy_bindadv").html(adv_name);
    //根据广告位加载贴片位信息
    var adp = _this.adpArray[_this.policyType].find(adv_name, 2, "name");
    if(adp) {
      dialog.patchs = adp.patchs;
    }
    if(dialog.patchs) {
      var array = [{
        key: "all",
        value: i18n("ADPOLICYMANAGE_DIALOG_PATCHBOX_ALL")
    }];
      var hasFront = dialog.patchs.find("0", 2, "relative_offset") ? true : false;
      var hasCenter = dialog.patchs.findIndex(function (item) {
        if(/\//.test(item.relative_offset)) {
          return item
        }
      }) !== -1 ? true : false;
      var hasBehind = dialog.patchs.find("1", 2, "relative_offset") ? true : false;
      if(hasFront) {
        array.push({
          key: "front",
          value: i18n("ADPOLICYMANAGE_DIALOG_PATCHBOX_FRONT")
        })
      }
      if(hasCenter) {
        array.push({
          key: "center",
          value: i18n("ADPOLICYMANAGE_DIALOG_PATCHBOX_CENTER")
        })
      }
      if(hasBehind) {
        array.push({
          key: "behind",
          value: i18n("ADPOLICYMANAGE_DIALOG_PATCHBOX_BEHIND")
        })
      }
      $("#policy_patchs").empty();
      dialog.patchsBox = new newSelect("#policy_patchs", array, {
        width: 298,
        height: 32,
        background: "#FFFFFF",
        selectbackground: "#FFFFFF",
        ScrollBarHeight: "150px",
        disablebackground: "#F0F0F0"
      }, function () {
        data.patch_location = this.getValue();
      });
    }
    if(data.patch_location) {
      _this.setDialogPatchLocation(data.patch_location)
    } else {
      _this.setDialogPatchLocation("all")
    }
  }
  var sucai_name = "";
  if(dialog.selectSucai) {
    $(".radio:eq(1)").click();
    var sucai_id = data.ad_single_id;
    sucai_name = _this.findSuCaiNameByAdId(sucai_id)
  } else {
    if(typeof dialog.selectSucai == "boolean") {
      $(".radio:eq(0)").click();
      var sucai_id = data.adgroup_id;
      sucai_name = _this.findSuCaiZuNameByAdgroupId(sucai_id);
    } else {
      if(data.ad_single_id) {
        $(".radio:eq(1)").click();
        var sucai_id = data.ad_single_id;
        sucai_name = _this.findSuCaiNameByAdId(sucai_id)
      } else {
        $(".radio:eq(0)").click();
        var sucai_id = data.adgroup_id;
        sucai_name = _this.findSuCaiZuNameByAdgroupId(sucai_id)
      }
    }

  }
  $("#el_name").html(sucai_name);
  // this.sucaiSelectBox.setValue(this.sucaiSelectBox.selectItem[data.ad_single_id || data.adgroup_id]);
  //加载地图信息
  if (data.locationInfoDetail) {
    $('.editDialog #policy_addr').val(data.locationInfoDetail.address)
  }
  $('.editDialog #policy_radius').val(data.shape_range)

  if(dialog.readOnly) {
    if(data.state == "deprecated") {
      $(".editDialogViewDeneyReasonBtn").show();
    } else {
      $(".editDialogConfirmBtn").show();
    }
  } else {
    $(".editDialogCancelBtn").show();
    $(".editDialogSubmitBtn").show();
  }
};
adPolicyManage.initDialog = function (type) {
  var _this = this,
  $ = jQuery,
    dialog = _this.dialog;
  dialog.currTagType = dialog.currTagType ? dialog.currTagType : "ADPOLICYMANAGE_TABLE_CHANNEL";
  if(_this.policyType == "1") {
    $("#policy_patchs").parent().show();
  }
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
    //策略类型下拉框初始化
  dialog.policyTypeBox = new newSelect("#policy_type", {
    "img": i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_IMG"),
    "video": i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_VIDEO"),
    "subtitle": i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_SUBTITLE")
  }, {
    width: 298,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#F0F0F0",
    disablebackground: "#F0F0F0"
  });
  dialog.policyTypeBox.setDisable();
  if(_this.policyType === 0) {
    dialog.policyTypeBox.setValue(i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_IMG"))
  } else if(_this.policyType === 1) {
    dialog.policyTypeBox.setValue(i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_VIDEO"))
  } else {
    dialog.policyTypeBox.setValue(i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_SUBTITLE"))
  }
  //策略权重下拉框初始化
  dialog.policyWeightBox = new newSelect("#policy_weight", _this.weightArray, {
    width: 298,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px",
    disablebackground: "#F0F0F0"
  });
  dialog.policyWeightBox.setValue("01");
  if(my.paas.user_type == "2") {
    dialog.policyWeightBox.setDisable();
    jQuery("input#policy_priority").attr("disabled", true).css("background-color", "#F0F0F0");
  }
  var channelBox_ScrollBarHeight = "150px";

  _this.channelTagArray = _this.listChannelTag();
  if(_this.channelTagArray) {} else {
    _this.channelTagArray = [];
  }
  _this.channelTagArray = _this.channelTagArray.map(function (item) {
    return {
      key: item.name,
      value: item.title
    }
  });
  if(_this.channelTagArray.length > 5) {
    channelBox_ScrollBarHeight = "150px";
  } else {
    channelBox_ScrollBarHeight = "auto";
  }
  //生效时间UI初始化
  dialog.validTimeDataPicker = new DatePicker({
    containerId: 'validtime_date',
    calendarStyles: calendarStyles,
    editable: true,
    dateInputStyles: {
      borderColor: '#d3d3d3'
    },
    iconImage: 'image/adPolicyManage/datePickerIcon.png'
  });
  dialog.validTimeHourBox = new newSelect("#validtime_hour", _this._hourArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.validTimeHourBox.setValue("00");
  dialog.validTimeMinuteBox = new newSelect("#validtime_minute", _this._minuteArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.validTimeMinuteBox.setValue("00");
  dialog.validTimeSecondBox = new newSelect("#validtime_second", _this._secondArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.validTimeSecondBox.setValue("00");
  //投放开始时间时间UI初始化
  dialog.durationStartTimeHourBox = new newSelect("#duationstarttime_hour", _this._hourArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.durationStartTimeHourBox.setValue("00")
  dialog.durationStartTimeMinuteBox = new newSelect("#duationstarttime_minute",
    _this._minuteArray, {
      width: 70,
      height: 32,
      background: "#FFFFFF",
      selectbackground: "#FFFFFF",
      ScrollBarHeight: "150px"
    });
  dialog.durationStartTimeMinuteBox.setValue("00")
  dialog.durationStartTimeSecondBox = new newSelect("#duationstarttime_second",
    _this._secondArray, {
      width: 70,
      height: 32,
      background: "#FFFFFF",
      selectbackground: "#FFFFFF",
      ScrollBarHeight: "150px"
    });
  dialog.durationStartTimeSecondBox.setValue("00")
    //失效时间UI初始化
  dialog.invalidTimeDataPicker = new DatePicker({
    containerId: 'invalidtime_date',
    calendarStyles: calendarStyles,
    editable: true,
    dateInputStyles: {
      borderColor: '#d3d3d3'
    },
    iconImage: 'image/adPolicyManage/datePickerIcon.png'
  });
  dialog.invalidTimeHourBox = new newSelect("#invalidtime_hour", _this._hourArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.invalidTimeHourBox.setValue("00");
  dialog.invalidTimeMinuteBox = new newSelect("#invalidtime_minute", _this._minuteArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.invalidTimeMinuteBox.setValue("00");
  dialog.invalidTimeSecondBox = new newSelect("#invalidtime_second", _this._secondArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.invalidTimeSecondBox.setValue("00");
  //投放结束时间UI初始化
  dialog.durationEndTimeHourBox = new newSelect("#durationendtime_hour", _this._hourArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.durationEndTimeHourBox.setValue("00")
  dialog.durationEndTimeMinuteBox = new newSelect("#durationendtime_minute", _this._minuteArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.durationEndTimeMinuteBox.setValue("00")
  dialog.durationEndTimeSecondBox = new newSelect("#durationendtime_second", _this._secondArray, {
    width: 70,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px"
  });
  dialog.durationEndTimeSecondBox.setValue("00");

  //标签类型
  //于社区精准是废弃 2019-3-25
  //@editor yubin.fu
  // dialog.tagTypeSelect = new newSelect("#tag_type", _this._tagTypeArray, {
  //   width: 298,
  //   height: 32,
  //   background: "#FFFFFF",
  //   selectbackground: "#FFFFFF",
  //   ScrollBarHeight: "150px",
  //   disablebackground: "#F0F0F0"
  // }, function () {
  //   var type = this.getValue()
  //   jQuery(".policy_channel").prev().html(i18n(type));
  //   dialog.currTagType = type;
  //   jQuery("#channel_type").html(_this.setTag(dialog.data.metadata, dialog.currTagType).tag.join(",")).attr("title", jQuery("#channel_type").html());
  // });
  jQuery("#unbind_adv.check_box").click(function () {
    jQuery(this).toggleClass("checked");
    if(jQuery(this).hasClass("checked")) {
      _this.dialog.unbindAdv = true;
    } else {
      _this.dialog.unbindAdv = false;
    }
  });
  //贴片位下拉框
  dialog.patchsBox = new newSelect("#policy_patchs", _this._defaultPatchsArray, {
    width: 298,
    height: 32,
    background: "#FFFFFF",
    selectbackground: "#FFFFFF",
    ScrollBarHeight: "150px",
    disablebackground: "#F0F0F0"
  }, function () {
    data.patch_location = this.getValue();
  });
  //查询素材数据
  _this.listSuCai()
    //查询素材组数据
  _this.listSuCaiZu();
  if(!dialog.isNew) {
    $(".editDialogTitle .editDialogTitleText").text(i18n("ADPOLICYMANAGE_DIALOGTITLE_OLD"));
    $(".editDialogFoot .editDialogSubmitBtn").text(i18n("ADPOLICYMANAGE_DIALOG_CONFIRM"));
  }
  if (dialog.readOnly) {
    $('.editDialogTitleText').html(i18n('ADPOLICYAUDIT_DIALOGTITLE_NEW'))
    $('#policy_adv_choose').css('visibility', 'hidden');
    $('#policy_sucai_choose').html(i18n('SUCAI_CHAKAN'))
  }
  if (my.paas.user_type == '0' || (my.paas.user_type == '1' &&　dialog.data.user_id !== my.paas.user_id)) {//供应商-自主广告主或广告主
    //显示计费方式
    $('.charge_type').show();
    var chargeTypeArray = [{
      key: 'cpm',
      value: i18n('ADPOLICYMANAGE_CHARGETYPE_CPM')
    }, {
      key: 'cpc',
      value: i18n('ADPOLICYMANAGE_CHARGETYPE_CPC')
    }, {
      key: 'cp_contract',
      value: i18n('ADPOLICYMANAGE_CHARGETYPE_CONTRACT')
    }]
    dialog.chargeType = new newSelect("#charge_type", chargeTypeArray, {
      width: 227,
      height: 32,
      background: "#FFFFFF",
      selectbackground: "#FFFFFF",
      ScrollBarHeight: "150px"
    });
    dialog.chargeType.setValue(chargeTypeArray[0].value)
    // dialog.data.charge_type = chargeTypeArray[0].key
  }
};
adPolicyManage.setDialogPatchLocation = function (state) {
    var text = "";
    switch(state) {
    case "all":
      text = "ADPOLICYMANAGE_DIALOG_PATCHBOX_ALL";
      break;
    case "front":
      text = "ADPOLICYMANAGE_DIALOG_PATCHBOX_FRONT";
      break;
    case "center":
      text = "ADPOLICYMANAGE_DIALOG_PATCHBOX_CENTER";
      break;
    case "behind":
      text = "ADPOLICYMANAGE_DIALOG_PATCHBOX_BEHIND";
      break;
    default:
      text = "ADPOLICYMANAGE_DIALOG_PATCHBOX_ALL";
    }
    adPolicyManage.dialog.patchsBox.setValue(i18n(text));
  }
  /**
   * 创建/查看策略弹窗中按钮的事件绑定
   * @method bindDialogEvents
   * @param  {string}         type true:新建窗口  false:编辑窗口
   * @return {void}              无返回值
   */
adPolicyManage.bindDialogEvents = function (type) {
  var _this = this,
      $ = jQuery;
  $('.editDialog')
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
          height: 505
        }, true)
      } else {
        _this.dialog.resize({
          width: 760,
          height: 674
        }, true)
      }
    }
  })
  .on('click', '.editDialogCloseBtn,.editDialogCancelBtn,.editDialogConfirmBtn', ({currentTarget, target}) => {
  //关闭弹窗
    if (currentTarget == target) {
    _this.dialog.close();
    }
  })
  .on('click', '.editDialogViewDeneyReasonBtn', ({currentTarget, target}) => {
  //显示否决原因
    if (currentTarget == target) {
    _this.showDeneyReason();
    }
  })
  .on('click', '.editDialogSubmitBtn', ({currentTarget, target}) => {
  //提交数据
    if (currentTarget == target) {
    _this.cacheDialogData();
      var data = _this.getPolicyData();   //拿到新增策略数据
      var ret = _this.checkPolicyDataValid(data)  //发送数据前检测数据有效性，数据是否完整
      if (!ret) {
        return;
      } else {
        _this.checkPolicyContract(data, (contract_ids) => {   //根据合同计费来拿到素材/素材组中的合同编号
          if(contract_ids){
            _this.contractType(contract_ids, (isAllOfflineContracts) => {  //根据合同编号拿到合同类型
              if(isAllOfflineContracts == true){  //所有素材都绑定了合同，且合同类型都是"线下合同"！
                _this.checkPolicyExist(data, (exist) => {
                  if(exist) {
                    _this.cacheDialogData();
                      _this.showConflictDialog(() => {
                        _this.sendPolicy(data);
                      });
                  } else {
                    _this.sendPolicy(data);
                  }
                })
              } else {
                var error_dialog = new OverlayDialog({  //您绑定的合同不是线下合同，所以无法完成新建策略。
                  id: '#ce_lue_guan_li_dialog',
                  url: 'content/ce_lue_guan_li/error_dialog.html',
                  width: 477,
                  height: 255,
                  context: {},
                  callback: function () {
                    $('#ce_lue_guan_li_dialog #utils_dialog_info_msg').text(i18n("MAIN_MENU_CELUESHENHE_ERRORMSG"));
                    $('#ce_lue_guan_li_dialog .popup_dialog_clear_').on('click', function () {
                      error_dialog.close();
                    });
                    $('#ce_lue_guan_li_dialog #utils_dialog_info_submit').on('click', function () {
                      error_dialog.close();
                    });
                  }
                });
                error_dialog.open();
              }
            });
          } else {
            _this.sendPolicy(data);
          }
        });
      }
    }
  })
  .on('click', '#unbind_adv', ({currentTarget, target}) => {
  //绑定广告位
    if (currentTarget == target) {
      $(this).toggleClass("checked");
      _this.dialog.bindAdv = !$(this).hasClass("checked");
    }
  })
  .on('click', '.radio', ({currentTarget, target}) => {
  //绑定素材/素材组 选择按钮事件
    if (currentTarget == target) {
      $(".editDialog .radio").removeClass("select");
      $(currentTarget).addClass("select");
      _this.dialog.selectSucai = $(".editDialog .radio").eq(1).hasClass("select");
    var sucai_id = "",
      sucai_name = "";
    if(_this.dialog.selectSucai) {
      sucai_id = _this.dialog.data.ad_single_id;
      sucai_name = _this.findSuCaiNameByAdId(sucai_id);
    } else {
      sucai_id = _this.dialog.data.adgroup_id;
      sucai_name = _this.findSuCaiZuNameByAdgroupId(sucai_id);
    }
      $("#el_name").html(sucai_name);
    }
  })
  .on('click', '#policy_adv_choose', ({currentTarget, target}) => {
  //广告位选择按钮
    if (currentTarget == target) {
    let {user_id} = _this.dialog.data,
        user_type = user_id !== my.paas.user_id ? '0': my.paas.user_type;
    _this.chooseAdv({user_id: user_id, user_type: user_type});
    }
  })
  .on('click', '.type_choosor', ({currentTarget, target}) => {
  //栏目选择按钮事件
    if (currentTarget == target) {
      let type = $(currentTarget).data('name');
      _this.chooseTag(type);
    }
  })
  .on('click', '#policy_sucai_choose', ({currentTarget, target}) => {
  //素材/素材组选择按钮
    if (currentTarget == target) {
      var index = $(".radio.select").index(".radio");
      var readOnly = _this.dialog.readOnly
      if (readOnly) {
        var app = new PreviewModel();
        if(index) {
          app.previewSuCai(_this.dialog.data.ad_single_id);
        } else {
          app.previewSuCaiZu(_this.dialog.data.adgroup_id);
        }
      } else {
    if(index) {
      _this.chooseSuCai();
    } else {
      _this.chooseSuCaiZu();
    }
      }
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
  })
  .on('click', '#charge_type_info', ({currentTarget, target}) => {
    if (currentTarget == target) {
      window.open(ChargeTypeLink)
    }
  })


  jQuery("#policy_name").change(function () {
    adPolicyManage.dialog.data.name = jQuery(this).val()
  });
};
/**
 * 根据合同计费来检查素材/素材组中的合同编号
 * @param  {object}   data     策略数据
 * @param  {Function} callback 回掉函数
 */
adPolicyManage.checkPolicyContract = function(data, callback) {
  if (data.charge_type == 'cp_contract') {
    var dialog = new SucaiContractHint({
      type: data['adgroup_id'] ? 'sucaizu':'sucai',
      data: data['adgroup_id'] ? adPolicyManage.getSuCaiBySuCaiZuId(data['adgroup_id']) : adPolicyManage.sucaiArray.map((item, index) => {
        return {
          name: item.label,
          ad_id: item.value,
          contract_id: item.contractid
        }
      }).filter(item => item.ad_id == data['ad_single_id']),
      confirm: (contract_ids) => {
        callback && callback(contract_ids)
      }
    })
  } else {
    callback && callback()
  }
}
/**
 * 根据合同编号批量拿到合同类型
 * @param {object}  ids  合同编号
 * @param return 最终返回是否全都是线下合同(true/false)
 */
adPolicyManage.contractType = function (ids, callback) {
  var _this = this,
    $ = jQuery,
    method = 'GET';
  var urlParam = [];
    urlParam.push('user_id=' + my.paas.user_id);
    urlParam.push('access_token=' + my.paas.access_token);
    urlParam.push('app_key=' + paasAppKey);
    urlParam.push('timestamp=' + new Date().toISOString());
  var url = paasHost + paasAdvDomain + "/ads/contract/contractids?" + urlParam.join('&') + "&contract_id=" + ids.join(',');
  $.ajax({
    type: method,
    url: url,
    async: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
    },
    contentType: 'application/json',
    dataType: 'json',
    failure: function () {},
    success: function (data) {
      var contract_types = [];
      for(var i = 0; i < data.length; i++){
        contract_types.push(data[i].contract_type);
      }
      if(contract_types.length > 0){  //当返回数据为[]，return false;
        var isAllOfflineContracts = contract_types.every(function(value){ return value == '1' });
      } else {
        var isAllOfflineContracts = false
      }
      callback && callback(isAllOfflineContracts)
    }
  })
}
/**
 * 发送创建/更新策略之前的数据有效性的处理
 * @method checkPolicyDataValid
 * @param  {object}    putData 发送的数据
 * @return {boolean}            是否为有效数据 true:有效 false:存在不规范的数据
 */
adPolicyManage.checkPolicyDataValid = function (putData) {
  var ret = true,
    _this = this,
    dialog = _this.dialog;
  _this.cacheDialogData();
  if(!putData.name) {
    showInputErr("#policy_name", i18n("ADPOLICYMANAGE_COMMITHIT_NAME"));
    ret = false;
  }
  if(putData.play_begintime.localeCompare(putData.play_endtime) == 1) {
    showInputErr("#policy_duationstarttime_container", i18n("ADPOLICYMANAGE_COMMITHIT_BEGINTIME"));
    ret = false;
  }
  if(putData.activatetime.localeCompare(putData.expiretime) == 1) {
    showInputErr("#policy_validtime_container", i18n("ADPOLICYMANAGE_COMMITHIT_ACTIVATETIME"));
    ret = false;
  }
  if(putData.adp_list.length == 0 && dialog.bindAdv) {
    showInputErr("#policy_bindadv", i18n("ADPOLICYMANAGE_DIALOG_ADVBINDHINT"));
    ret = false;
  }
  if((!dialog.selectSucai || !putData.ad_single_id) && (dialog.selectSucai || !putData.adgroup_id)) {
    showInputErr("#el_name", i18n("ADPOLICYMANAGE_DIALOG_PSDBINDINT"));
    ret = false;
  }
  if (putData['charge_type'] == 'cp_contract') {
    if (putData['adgroup_id']) {
      contract_valid = _this.checkContractIdByAdgroupId(putData['adgroup_id'])
    } else {
      contract_valid = _this.checkContractIdByAdId(putData['ad_single_id'])
    }
    if (!contract_valid) {
      showInputErr("#el_name", '选择的素材/素材组不包括合同编号');
      ret = false
    }
  }
  return ret;
};
/**
 * 检查策略是否具有相同的广告排期
 * @method checkPolicyExist
 * @return {boolean}         是否存在相同排期,true:存在，false:不存在
 */
adPolicyManage.checkPolicyExist = function (data, callback) {
  var _this = this,
      $ = jQuery,
      method = 'POST',
      url = paasHost + paasAdvDomain + "/ads/adpolicy/check/exist?" + _this.getToken({type: 1, user_id: my.paas.user_id}) + "&user_name=" + my.paas.user_name;
  $.ajax({
    type: method,
    url: url,
    async: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
    },
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(data),
    failure: function () {},
    success: function (data) {
      callback && callback(data.exist)
    }
  })
};
/**
 * 返回新建/更新策略页面数据
 * @return {object} 策略数据
 */
adPolicyManage.getPolicyData = function() {
  var _this = this,
    data = JSON.parse(JSON.stringify(_this.dialog.data)),
      extra_area_tags = data.area_tags2;
  delete data.area_tags2;
  if(_this.dialog.selectSucai) {
    data["adgroup_id"] = null
  } else {
    data["ad_single_id"] = null
  }
  if(_this.dialog.unbindAdv) {
    data["adp_list"] = [];
  }
  // data["metadata"] = {};
  if(data.metadata) {
    if(!data.metadata.channel_tags) {
      data.metadata.channel_tags = [];
    }
    if(!data.metadata.catalog_tags) {
      data.metadata.catalog_tags = [];
    }
    if(!data.metadata.area_tags) {
      data.metadata.area_tags = [];
    }
    data.metadata.area_tags = data.metadata.area_tags.filter(item => /^area:/.test(item))
    for (var i = 0; i < extra_area_tags.length; i++) {
      var item = extra_area_tags[i]
      if (!data.metadata.area_tags.includes(item)) {
        data.metadata.area_tags.push(item)
      }
    }
  }
  return data;
    }
/**
 * update/create a policy
 * @param  {object} data [description]
 */
adPolicyManage.sendPolicy = function(data) {
  var _this = this,
      is_create = !!!data.adpolicy_id;
  //send Msg
  var url = "",
    method = "";
  if(!is_create) {
    var ret = confirm(i18n("ADPOLICYMANAGE_TABLE_EDITHINT"));
    if(!ret) {
      return;
    }
    method = "PUT";
    url = paasHost + paasAdvDomain + "/ads/adpolicy/" + data.adpolicy_id + "?"
  } else {
    method = "POST";
    url = paasHost + paasAdvDomain + "/ads/adpolicy/" + _this.getTypeTextByPolicyType(_this.policyType) + "?"
    data["distribute_relation_site"] = [];
    data["distribute_appoint_site"] = true;
    data["platform_id_list"] = my.paas.platform_id_list ? [my.paas.platform_id_list] : null
  }
  url += this.getToken({type: 1, user_id: my.paas.user_id}) + "&user_name=" + my.paas.user_name;
  adPolicyManage.policyAjax({method, url, is_create, putData: data});
};
adPolicyManage.policyAjax = function({method, url, is_create, putData}) {
  // //filter query data
  jQuery.ajax({
    type: method,
    url: url,
    async: false,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
    },
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(putData),
    failure: function () {
      return;
    },
    success: function (data) {
      adPolicyManage.updateAuditInstance(is_create, data);
      adPolicyManage.updateAuditWeightAndPriority(is_create, data);
      adPolicyManage.dialog.close();
      adPolicyManage.formatterData();
    },
    error: function (xhr) {
      if(xhr.readyState === 4 && xhr.status === 200) {
        adPolicyManage.updateAuditInstance(is_create);
        adPolicyManage.updateAuditWeightAndPriority(is_create);
        adPolicyManage.dialog.close();
        adPolicyManage.formatterData();
      }
    }
  });
  //end send function
}
adPolicyManage.updateAuditWeightAndPriority = function (isNew, data) {
  // if (my.paas.user_type !== "0") {
  //   console.log("no right to update weight and priority");
  //   return;
  // }
  var _this = this,
    dialog = _this.dialog;
  var priority = dialog.data.priority;
  var weight = dialog.data.weight;
  var accurate_priority = 0;
  if(dialog.data.metadata.channel_tags.length !== 0) {
    accurate_priority += 1;
  }
  if(dialog.data.metadata.catalog_tags.length !== 0) {
    accurate_priority += 1;
  }
  if(dialog.data.metadata.area_tags.length !== 0) {
    accurate_priority += 1;
  }
  accurate_priority += "";
  var method = "PUT";
  var url = paasHost + paasAdvDomain + "/ads/adpolicy/priority_weight/" + (isNew ? data.id : dialog.data.adpolicy_id) + "?" + _this.getToken({type: 1, user_id: my.paas.user_id})
  jQuery.ajax({
    type: method,
    url: url,
    async: true,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
    },
    data: JSON.stringify({
      "priority": priority,
      "weight": weight,
      "accurate_priority": accurate_priority
    }),
    failure: function () {
      console.warn("failure");
      return;
    }
  }).done(function () {
    console.log("change weight/priority successful");
  })
}
adPolicyManage.updateAuditInstance = function (isNew, data) {
  var _this = this,
    dialog = _this.dialog;
  var method = "POST",
    url = paasHost + paasDomain + "/auditflow/instance/ad_policy/" + (isNew ? data.id : dialog.data.adpolicy_id) + "?" + _this.getToken({type: 1, user_id: my.paas.user_id})
  jQuery.ajax({
    type: method,
    url: url,
    async: false,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
    },
    failure: function () {
      console.warn("failure");
      return;
    }
  }).done(function () {
    console.log("update/create audit success");
  });
};
adPolicyManage.deletePolicy = function (index) {
  var message = i18n('ADPOLICYMANAGE_DIALOG_DELETEHINT').replace(/{{}}/g, adPolicyManage.data[index].name);
  var dialog = new AlertDialog({
    title: i18n('ADPOLICYMANAGE_DIALOG_DELETE'),
    message: message,
    confirmFn: (callback) => {
        var url = paasHost + paasAdvDomain + "/ads/adpolicy/" + adPolicyManage.data[index].adpolicy_id + "?" + adPolicyManage.getToken({type: 1, user_id: my.paas.user_id})
        jQuery.ajax({
          type: "DELETE",
          url: url,
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "x-aqua-sign": getPaaS_x_aqua_sign("DELETE", url)
          },
          failure: function () {
            return;
          }
        }).done(function () {
          callback && callback()
          adPolicyManage.formatterData();
        });
    }
      })
};
adPolicyManage.getAdEl = function (type, id) {
    var result = "";
    if(id == "") {
      return result;
    }

    var url = "";
    if(type === 0) {
      url = paasHost + paasAdvDomain + "/ads/adgroup/" + id + "?"
    } else {
      url = paasHost + paasAdvDomain + "/ads/aditem/" + id + "?"
    }
    url += adPolicyManage.getToken({type: 1, user_id: my.paas.user_id});
    if (my.paas.platform_current_id) {
      url += '&platform_id_list=' + my.paas.platform_current_id
    }
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
  }
  /**
   * [获取栏目列表]
   * @return array 栏目列表
   */
adPolicyManage.listChannelTag = function () {
  var that = this;
  var result = false;
  var url = paasHost + 　paasDomain　 + "/tagdef/channel/"　 + "?" + that.getToken({type: 1, user_id: my.paas.user_id});
  if(my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
  jQuery.ajax({
    type: "GET",
    async: false,
    url: url,
    contentType: "application/json",
    dataType: "json",
    error: function (error) {},
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
    }
  }).done(function (data, status, xhr) {
    result = data;
    // var totalCount = xhr.getResponseHeader('x-aqua-total-count');
    // result.allCount = totalCount;
  });
  return result;
};
/**
 * [listChannelOfChannelTag description]
 * @method listChannelOfChannelTag
 * @param  {[type]}                tag [description]
 * @return {[type]}                    [description]
 */
adPolicyManage.listChannelOfChannelTag = function (tag) {
  var that = this;
  var result = false;
  var url = paasHost + 　paasDomain　 + "/tag/application/global/channel/";
  if(tag) {
    url = url + "?tags=" + encodeURI(tag);
  }
  url += "&" + that.getToken({type: 1, user_id: my.paas.user_id});
  if (my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
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
  }).fail(function (data) {
    result = [];
  });
  return result;
};
adPolicyManage.getTag = function () {
  var that = this;
  var result = [];
  var tag_arr = [];
  /*
  if(tag_str !== ""){
    tag_arr = tag_str.split(",")
  }
  */
  result = result.concat(tag_arr);
  var channel_value = adPolicyManage.channelBox.getValue();
  var channel_result = channel_value.map(function (item) {
    return "channel:" + item;
  });
  result = result.concat(channel_result);
  return result;
};
adPolicyManage.setTag = function (tag, type) {
  var result = {
    tag: [],
    channel: []
  };
  if(tag) {
    switch(type) {
    case "ADPOLICYMANAGE_TABLE_CHANNEL":
      if((typeof tag.channel_tags == 'object') && Object.prototype.toString.call(tag.channel_tags) == '[object Array]') {
        tag.channel_tags.forEach(function (item, i) {
          result.tag.push(item.slice(8));
        });
      }
      break;
    case "ADPOLICYMANAGE_TABLE_CATEGORY":
      if((typeof tag.catalog_tags == 'object') && Object.prototype.toString.call(tag.catalog_tags) == '[object Array]') {
        tag.catalog_tags.forEach(function (item, i) {
          result.tag.push(item.slice(8));
        });
      }
      break;
    case "ADPOLICYMANAGE_TABLE_AREA":
      if((typeof tag.area_tags == 'object') && Object.prototype.toString.call(tag.area_tags) == '[object Array]') {
        tag.area_tags.forEach(function (item, i) {
          result.tag.push(item.slice(5));
        });
      }
      break;
    default:
      if((typeof tag.channel_tags == 'object') && Object.prototype.toString.call(tag.channel_tags) == '[object Array]') {
        tag.channel_tags.forEach(function (item, i) {
          result.tag.push(item.slice(8));
        });
      }
      if((typeof tag.catalog_tags == 'object') && Object.prototype.toString.call(tag.channel_tags) == '[object Array]') {
        tag.catalog_tags.forEach(function (item, i) {
          result.tag.push(item.slice(8));
        });
      }
      if((typeof tag.area_tags == 'object') && Object.prototype.toString.call(tag.channel_tags) == '[object Array]') {
        tag.area_tags.forEach(function (item, i) {
          result.tag.push(item.slice(5));
        });
      }
    }
  }
  return result;
};

adPolicyManage.find_channel_name = function (key) {
  var result = "";
  channel_list.forEach(function (item) {
    if(item.channel_value == key) {
      result = item.channel_name;
    }
  })
  return result;
};
/**
 * [列出广告位列表数据]
 * @method function
 * @return {objectarray} [{lanel: adp name;value:adp ext_id}]
 */
adPolicyManage.listAdp = function ({save, user_id, user_type = my.paas.user_type}) {
  var _this = this,
    result = [],
    url = paasHost + paasAdvDomain;
  // if(_this.adpArray[_this.policyType] && _this.adpArray[_this.policyType].length !== 0) {
  //   return _this.adpArray[_this.policyType];
  // }
  if(_this.policyType == 0) {
    url += "/ads/imgadp/imgadps?";
  } else if(_this.policyType == 1) {
    url += "/ads/videoadp/videoadps?";
  } else {
    url += "/ads/subtitleadp/subtitleadps?";
  }
  url += _this.getToken({type: 1, user_id: user_id, user_type: user_type});
  if (my.paas.platform_current_id) {
    url += '&platform_id=' +  my.paas.platform_current_id
  }
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
    // for(var i = 0; i < resp.length; i++) {
    // result.push({
    //   label: resp[i].name,
    //   value: resp[i].ext_id,
    //   patchs: resp[i].patchs
    // })
    result = resp;
    // };
  });
  if (save) {
  if(!_this.adpArray) {
    this.adpArray = [];
  }
  _this.adpArray[_this.policyType] = result;
  }
  return result;
};
/**
 * 根据广告的ext_id的值来获得广告名称
 * @method function
 * @param  {string} ext_id 广告的ext_id的值
 * @return {string}        广告显示的名称
 */
adPolicyManage.findAdpNameByExtId = function (ext_id) {
  var _this = this,
    array = _this.adpArray[_this.policyType],
    result = "";
  if(array) {
    array.forEach(function (item) {
      if(item.ext_id == ext_id) {
        result = item.name
      }
    })
  }
  return result;
};
/**
 * 根据广告的ext_id的值来获得贴片位信息
 * @method findPatchsByExtId
 * @param  {string}          ext_id 广告的ext_id的值
 * @return {array}                  贴片广告位的数组
 */
adPolicyManage.findPatchsByExtId = function (ext_id) {
  var _this = this,
    array = _this.adpArray[_this.policyType],
    patchs = [];
  if(array) {
    array.forEach(function (item) {
      if(item.ext_id == ext_id) {
        patchs = item.patchs;
      }
    });
  }
  return patchs;
};
/**
 * 查询素材数据，并且绑定到模块的变量中
 * @method function
 * @return {array} object array {label:素材名称,value:素材id}
 */
adPolicyManage.listSuCai = function () {
  var _this = this,
    result = [];
  var url = paasHost + paasAdvDomain + "/ads/aditem/aditems?type=" + _this.getTypeTextByPolicyType(_this.policyType) + "&state=enabled&" + _this.getToken({type: 1, user_id: my.paas.user_id});
  if(window.AdvSystemType == "central" && window.AdvSelfSiteId == window.AdvCentralSiteId) {
    url += "&site_id=" + window.AdvSelfSiteId
  }
  if (my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
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
      result.push({
        label: resp[i].name,
        value: resp[i].ad_id,
        contractid: resp[i].contract_id
      })
    };
  });
  _this.sucaiArray = result;
  return result;
};
/**
 * 根据素材的id获取素材的名称
 * @method findSuCaiNameByAdId
 * @param  {string}            ad_id 素材id
 * @return {string}                  素材名称
 */
adPolicyManage.findSuCaiNameByAdId = function (ad_id) {
  var _this = this,
    array = _this.sucaiArray,
    result = "";
  if(array) {
    array.forEach(function (item) {
      if(item.value == ad_id) {
        result = item.label
      }
    })
  }
  return result;
};
/**
 * 查询素材组数据并且绑定到模块变量
 * @method function
 * @return {array} object array {label:素材组名称,value:素材组id}
 */
adPolicyManage.listSuCaiZu = function () {
  var _this = this,
    result = [];
  var url = paasHost + paasAdvDomain + "/ads/adgroup/adgroups?type=" + _this.getTypeTextByPolicyType(_this.policyType) + "&" + _this.getToken({type: 1, user_id: my.paas.user_id});
  if(window.AdvSystemType == "central" && window.AdvSelfSiteId == window.AdvCentralSiteId) {
    url += "&site_id=" + window.AdvSelfSiteId
  }
  if (my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
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
      result.push({
        label: resp[i].title,
        value: resp[i].ad_group_id,
        contractid: resp[i].contract_id
      })
    };
  });
  _this.sucaizuArray = result;
  return result;
};
/**
 * 根据素材组的groupid来获得该素材组的名称
 * @method findSuCaiZuNameByAdgroupId
 * @param  {string}                   adgroup_id 素材组的id
 * @return {string}                               素材组的名称
 */
adPolicyManage.findSuCaiZuNameByAdgroupId = function (adgroup_id) {
  var _this = this,
    array = _this.sucaizuArray,
    result = "";
  if(array) {
    array.forEach(function (item) {
      if(item.value == adgroup_id) {
        result = item.label;
      }
    })
  }
  return result;

};
/**
 * 列出频道标签的数据
 * @method function
 * @return {array} 栏目列表数据{label:栏目名称,value:栏目namespace:name}
 */
adPolicyManage.listChannelTags = function () {
  var _this = this;
  var result = [];
  var url = paasHost + 　paasDomain　 + "/tagdef/channel/"　 + "?" + _this.getToken({type: 1, user_id: my.paas.user_id});
  if (my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
  jQuery.ajax({
    type: "GET",
    async: false,
    url: url,
    contentType: "application/json",
    dataType: "json",
    error: function (error) {},
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
    }
  }).done(function (data, status, xhr) {
    for(var i = 0; i < data.length; i++) {
      var item = data[i];
      result.push({
        label: item.name,
        value: item.namespace_name + ":" + item.name
      })
    }
  });
  if(!_this.channelTagsArray) {
    this.channelTagsArray = [];
  }
  _this.channelTagsArray = result;
  return result;
};
/**
 * 列出栏目标签的数据
 * @method function
 * @return {array} 栏目列表数据{label:栏目名称,value:栏目namespace:name}
 */
adPolicyManage.listCategoryTags = function () {
  var _this = this;
  var result = [];
  var url = paasHost + 　paasDomain　 + "/tagdef/catalog/"　 + "?" + _this.getToken({type: 1, user_id: my.paas.user_id})
  if (my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
  jQuery.ajax({
    type: "GET",
    async: false,
    url: url,
    contentType: "application/json",
    dataType: "json",
    error: function (error) {},
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
    }
  }).done(function (data, status, xhr) {
    for(var i = 0; i < data.length; i++) {
      var item = data[i];
      result.push({
        label: item.name,
        value: item.namespace_name + ":" + item.name
      })
    }
  });
  if(!_this.categoryTagsArray) {
    this.categoryTagsArray = [];
  }
  _this.categoryTagsArray = result;
  return result;
};
/**
 * 列出区域标签的数据
 * @method function
 * @return {array} 栏目列表数据{label:栏目名称,value:栏目namespace:name}
 */
adPolicyManage.listAreaTags = function () {
  var _this = this;
  var result = [];
  var url = paasHost + 　paasDomain　 + "/tagdef/area/"　 + "?" + _this.getToken({type: 1, user_id: my.paas.user_id})
  if (my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
  jQuery.ajax({
    type: "GET",
    async: false,
    url: url,
    contentType: "application/json",
    dataType: "json",
    error: function (error) {},
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
    }
  }).done(function (data, status, xhr) {
    for(var i = 0; i < data.length; i++) {
      var item = data[i];
      result.push({
        label: item.name,
        value: item.namespace_name + ":" + item.name
      })
    }
  });
  if(!_this.areaTagsArray) {
    this.areaTagsArray = [];
  }
  _this.areaTagsArray = result;
  return result;
};
/**
 * 获得标签中所绑定的频道
 * @method function
 * @param  {string} tag 栏目标签的名字，channel:频道名称
 * @return {array}     返回一个对象数组 {label:频道名称,value:频道名称}
 */
adPolicyManage.listChannelFromChannelTags = function (tag) {
  var _this = this;
  var result = [];
  var url = paasHost + 　paasDomain　 + "/tag/application/global/channel/";
  if(tag) {
    url = url + "?tags=" + encodeURI(tag);
  }
  url += "&" + _this.getToken({type: 1, user_id: my.paas.user_id});
  if (my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
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
    for(var i = 0; i < data.length; i++) {
      var channel = data[i];
      channel_list.forEach(function (item) {
        if(item.channel_value == channel.obj_id) {
          result.push({
            label: item.channel_name,
            value: item.channel_name
          })
        }
      })
    }
  });
  return result;
};
/**
 * 获得标签中所绑定的栏目
 * @method function
 * @param  {string} tag 栏目标签的名字，catalog:栏目名称
 * @return {array}     返回一个对象数组 {label:栏目名称,value:栏目名称}
 */
adPolicyManage.listCatalogFromChannelTags = function (tag) {
  var _this = this;
  var result = [];
  var url = paasHost + 　paasDomain　 + "/tag/application/global/catalog/";
  if(tag) {
    url = url + "?tags=" + encodeURI(tag);
  }
  url += "&" + _this.getToken({type: 1, user_id: my.paas.user_id})
  if (my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
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
    for(var i = 0; i < data.length; i++) {
      var channel = data[i];
      category_list.forEach(function (item) {
        if(item.category_value == channel.obj_id) {
          result.push({
            label: item.category_name,
            value: item.category_name
          })
        }
      })
    }
  });
  return result;
};
/**
 * 获得标签中所绑定的区域
 * @method function
 * @param  {string} tag 区域标签的名字，area:区域名称
 * @return {array}     返回一个对象数组 {label:区域名称,value:区域名称}
 */
adPolicyManage.listAreaFromChannelTags = function (tag) {
  var _this = this;
  var result = [];
  var url = paasHost + 　paasDomain　 + "/tag/application/global/area/";
  if(tag) {
    url = url + "?tags=" + encodeURI(tag);
  }
  url += "&" + _this.getToken({type: 1, user_id: my.paas.user_id});
  if (my.paas.platform_current_id) {
    url += '&platform_id_list=' +  my.paas.platform_current_id
  }
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
    var _queryString = "";
    for(var i = 0; i < data.length; i++) {
      var channel = data[i];
      _queryString += channel.obj_id + ","
    }
    if (_queryString) {
    var _url = paasHost + 　paasDomain　 + "/area?id=" + _queryString.replace(/\,$/, "");
    _url += "&" + _this.getToken({type: 1, user_id: my.paas.user_id});
    if (my.paas.platform_current_id) {
      url += '&platform_id_list=' +  my.paas.platform_current_id
    }
    jQuery.ajax({
      type: "GET",
      async: false,
      url: _url,
      contentType: "application/json",
      dataType: "json",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "x-aqua-sign": getPaaS_x_aqua_sign("GET", url)
      }
    }).done(function (resp) {
      resp.forEach(function (item2) {
        result.push({
          label: item2.simple_area_name,
          value: item2.simple_area_name
        })
      })
    })
    }
  });
  return result;
};
adPolicyManage._defaultListTitle = [{
  label: i18n("ADPOLICYMANAGE_TABLE_POLICYNAME")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_STATE")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_CREATOR")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_TAG")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_BIAOQIANXIANGQING")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_PRIORITY")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_WEIGHT")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_BIND")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_VALIDTIME")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_DURATION")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_OPERATION")
}];
adPolicyManage._videoListTitle = [{
  label: i18n("ADPOLICYMANAGE_TABLE_POLICYNAME")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_STATE")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_CREATOR")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_TAG")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_BIAOQIANXIANGQING")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_PRIORITY")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_WEIGHT")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_BIND")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_PATCHS")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_VALIDTIME")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_DURATION")
}, {
  label: i18n("ADPOLICYMANAGE_TABLE_OPERATION")
}];
adPolicyManage._defaultListStyle = function () {
  return {
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
    columnsWidth: [0.07, 0.06, 0.07, 0.06, 0.07, 0.06, 0.05, 0.08, 0.20, 0.11, 0.17]
  }
};
adPolicyManage._hourArray = Array.apply(null, {length: 24}).map((item, index) => {
  return {
    key: String(index).padStart(2, '0'),
    value: String(index).padStart(2, '0')
  }
});;
adPolicyManage._minuteArray = adPolicyManage._secondArray = Array.apply(null, {length: 60}).map((item, index) => {
  return {
    key: String(index).padStart(2, '0'),
    value: String(index).padStart(2, '0')
  }
});
adPolicyManage.weightArray = Array.apply(null, {length: 100}).map((item, index) => {
  return {
    key: String(index + 1).padStart(2, '0'),
    value: String(index + 1).padStart(2, '0')
  }
});
adPolicyManage._tagTypeArray = [{
  key: "ADPOLICYMANAGE_TABLE_CHANNEL",
  value: i18n("ADPOLICYMANAGE_TABLE_CHANNEL")
}, {
  key: "ADPOLICYMANAGE_TABLE_CATEGORY",
  value: i18n("ADPOLICYMANAGE_TABLE_CATEGORY")
  }, {
  key: "ADPOLICYMANAGE_TABLE_AREA",
  value: i18n("ADPOLICYMANAGE_TABLE_AREA")
}];
adPolicyManage._defaultPatchsArray = [{
  key: "all",
  value: i18n("ADPOLICYMANAGE_DIALOG_PATCHBOX_ALL")
}];
/**
 * 广告位、频道、素材、素材组选择窗口
 * @method selectDialog
 * @return {[type]}     [description]
 */
adPolicyManage.SelectDialog = function () {
    this.resultArray = [];
    var dialog;
    var listStyle = {
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
      columnsWidth: [0.03, 0.17, 0.13, 0.03, 0.17, 0.13, 0.04, 0.17, 0.13]
    };
    var titles = [];
    for(var i = 0; i < 3; i++) {
      titles.push({
        label: ""
      });
      titles.push({
        label: "{{title}}"
      });
      titles.push({
        label: i18n("ADPOLICYAUDIT_TABLE_OPERATION")
      });
    }
    //格式化表格数据
    var formatterData = function (list, operations) {
      var dataset = [];
      var rowset = [];
      for(var i = 0; i < list.length; i++) {
        var item = list[i];
        rowset.push({
          label: i + 1
        })
        rowset.push({
          label: "<div title='" + item.label + "' data-value='" + item.value + "'>" + item.label + "</div>"
        });
        if(operations) {
          var operationString = "";
          for(var j = 0; j < operations.length; j++) {
            var operation = operations[j];
            var callbackName = operation.callbackName;
            var operationDom = jQuery("<span style='flex:1;' onclick='" + callbackName + "(\"" + item.label + "\",\"" + item.value + "\",this)'>" + operation.name + "</span>");
            operationString += operationDom[0].outerHTML;
          }
          rowset.push({
            label: "<div style='display: flex'>" + operationString + "</div>"
          })
          if(rowset.length == 9) {
            dataset.push(rowset);
            rowset = [];
          }
        } else {
          if(rowset.length == 6) {
            dataset.push(rowset);
            rowset = [];
          }
        }
      }
      if(rowset.length !== 0) {
        dataset.push(rowset);
      }
      return dataset;
    }
    this.styledList = new StyledList({
      containerId: "select_table",
      rows: 8,
      columns: 9,
      data: [], //this.listData,
      titles: titles,
      listType: 0,
      styles: listStyle,
      updateTitle: true
    });
    this.init = function (options) {
      this.options = options;
      this.operations = options.operations;
      this.data = options.data;
      this.callback = options.callback;
      var tmpTitles = this.styledList.titles;
      if(!this.operations) {
        tmpTitles = [];
        //更新table的title
        for(var i = 0; i < 3; i++) {
          tmpTitles.push({
            label: ""
          });
          tmpTitles.push({
            label: "{{title}}"
          });
        }
        //更新table的style
        this.styledList.styles.columnsWidth = [0.03, 0.3, 0.03, 0.3, 0.04, 0.3];
        this.styledList.columnsLmt = 6;
      }
      for(var i = 0; i < tmpTitles.length; i++) {
        var label = tmpTitles[i].label;
        if(label == "{{title}}") {
          label = options.tableTitle;
          tmpTitles[i].label = label;
        }
      }
      this.styledList.titles = tmpTitles;
      this.styledList.data = formatterData(this.data, this.operations);
      this.styledList.onTotalCount(this.styledList.data.length);
      var afterDrawn = function () {
        var _this = this;
        //初始化对话框标题
        jQuery("#policy_select_dialog .title_content").html(_this.options.dialogTitle)
        if(!_this.options.queryTitle) {
          jQuery("#policy_select_dialog .query_tab").hide();
          jQuery("#policy_select_dialog .result_table").css({
            "height": "457px",
            "margin": "9px 10px 0"
          })
        } else {
          //初始化查询表头的文字
          jQuery("#policy_select_dialog .tab_context").html(_this.options.queryTitle)
        }
        _this.styledList.create();
        //查询按钮事件
        jQuery("#policy_select_dialog .query_btn").click(function () {
          _this.queryData();
        });
        //输入框回车查询数据
        jQuery("#policy_select_dialog .query_input").keydown(function () {
          var key = event.keyCode || event.which;
          if(key == 13) {
            _this.queryData();
          }
        });
        //窗口标题上方关闭按钮以及取消按钮事件
        jQuery("#policy_select_dialog .close_btn, #policy_select_dialog .cancel_btn").click(function () {
          _this.close();
        });
        if(_this.options.confirm) {
          //确认按钮事件
          jQuery("#policy_select_dialog .confirm_btn").click(function () {
            _this.options.confirm(_this.resultArray);
            _this.close();
          })
        } else {
          jQuery("#policy_select_dialog .confirm_btn").hide();
        }
        if(_this.options.afterDrawn) {
          _this.options.afterDrawn();
        }
      };
      dialog = new PopupDialog({
        url: "content/ce_lue_guan_li/selectDialog.html",
        width: 864,
        height: 548,
        context: this,
        callback: afterDrawn
      });
    };
    this.open = function () {
      dialog.open();
    };
    this.close = function () {
      dialog.close();
      this.callback();
    }
    this.queryData = function () {
      var queryValue = jQuery("#policy_select_dialog .query_input").val();
      var list = [];
      for(var i = 0; i < this.data.length; i++) {
        var item = this.data[i];
        if(item.label.indexOf(queryValue) !== -1) {
          list.push(item)
        }
      };
      this.styledList.data = formatterData(list, this.operations);
      // this.styledList.currPage = 0;
      this.styledList.refreshList();
    }
  }
  /**
   * 弹出广告选择窗口
   * @method chooseAdv
   * @return {void}  无返回值
   */
adPolicyManage.chooseAdv = function ({user_id, user_type}) {
  var _this = this,
    result = _this.listAdp({user_id: user_id, user_type: user_type});
  _this.cacheDialogData();
  var afterDrawn = function () {
    var data = _this.dialog.data.adp_list;
    if(data.length !== 0) {
      var ret = data
      for(var i = 0; i < ret.length; i++) {
        var ext_id = ret[i];
        var label = _this.findAdpNameByExtId(ext_id);
        _this.selectDialog.resultArray.push({
          label: label,
          value: ext_id
        })
        jQuery("span[onclick='adPolicyManage.selectOne(\"" + label + "\",\"" + ext_id + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CHOOSED"));
      }
    }
  }
  _this.selectDialog = new _this.SelectDialog();
  _this.selectDialog.init({
    dialogTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TITLE_ADV"),
    queryTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_QUERY_ADV"),
    tableTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TABLE_ADV"),
    confirm: _this.getSelectedAdv,
    operations: [{
      name: i18n("ADPOLICYMANAGE_CHOOSE"),
      callbackName: "adPolicyManage.selectOne"
    }],
    data: result.map(function (item) {
      return {
        label: item.name,
        value: item.ext_id
      }
    }),
    afterDrawn: afterDrawn,
    callback: _this.closeSelectDialog
  });
  _this.selectDialog.open();

};
/**
 * 广告选择弹窗的确认按钮回调事件
 * @method getSelectedAdv
 * @param  {array}       result 广告数据｛label:广告名称,value:广告的ext_id｝
 * @return {void}              无返回值
 */
adPolicyManage.getSelectedAdv = function (result) {
  var _this = adPolicyManage;
  var ext_id = [];
  if(result[0]) {
    ext_id.push(result[0].value);
    _this.dialog.data.adp_list = ext_id;
    _this.dialog.unbindAdv = false;
    _this.dialog.patchs = _this.findPatchsByExtId(ext_id);
  }
};
/**
 * 弹出素材选择窗口
 * @method chooseSuCai
 * @return {void}    无返回值
 */
adPolicyManage.chooseSuCai = function () {
  var _this = this;
  var result = _this.listSuCai();
  _this.cacheDialogData();
  var afterDrawn = function () {
    var data = _this.dialog.data.ad_single_id;
    if(data) {
      var ad_single_id = data;
      var label = _this.findSuCaiNameByAdId(ad_single_id);
      _this.selectDialog.resultArray.push({
        label: label,
        value: ad_single_id
      })
      jQuery("span[onclick='adPolicyManage.selectOne(\"" + label + "\",\"" + ad_single_id + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CHOOSED"));
    }
  }
  _this.selectDialog = new _this.SelectDialog();
  _this.selectDialog.init({
    dialogTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TITLE_SUCAI"),
    queryTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_QUERY_SUCAI"),
    tableTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TABLE_SUCAI"),
    confirm: _this.getSelectedSuCai,
    operations: [{
      name: i18n("ADPOLICYMANAGE_VIEW"),
      callbackName: "adPolicyManage.viewSucai"
        }, {
      name: i18n("ADPOLICYMANAGE_CHOOSE"),
      callbackName: "adPolicyManage.selectOne"
    }],
    data: result,
    afterDrawn: afterDrawn,
    callback: _this.closeSelectDialog
  });
  _this.selectDialog.open();
  if(_this.selectDialog.resultArray.length !== 0) {
    var ret = _this.selectDialog.resultArray
    for(var i = 0; i < ret.length; i++) {
      var item = ret[i];
      jQuery("span[onclick='adPolicyManage.selectOne(\"" + item.label + "\",\"" + item.value + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CHOOSED"));
    }
  }
};
/**
 * 弹出素材组选择窗口
 * @method chooseSuCaiZu
 * @return {void}      无返回值
 */
adPolicyManage.chooseSuCaiZu = function () {
  var _this = this;
  var result = _this.listSuCaiZu();
  _this.cacheDialogData();
  var afterDrawn = function () {
    var data = _this.dialog.data.adgroup_id;
    if(data) {
      var adgroup_id = data;
      var label = _this.findSuCaiZuNameByAdgroupId(adgroup_id);
      _this.selectDialog.resultArray.push({
        label: label,
        value: adgroup_id
      })
      jQuery("span[onclick='adPolicyManage.selectOne(\"" + label + "\",\"" + adgroup_id + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CHOOSED"));
    }
  }
  _this.selectDialog = new _this.SelectDialog();
  _this.selectDialog.init({
    dialogTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TITLE_SUCAIZU"),
    queryTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_QUERY_SUCAIZU"),
    tableTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TABLE_SUCAIZU"),
    confirm: _this.getSelectedSuCai,
    operations: [{
      name: i18n("ADPOLICYMANAGE_VIEW"),
      callbackName: "adPolicyManage.viewSucaizu"
        }, {
      name: i18n("ADPOLICYMANAGE_CHOOSE"),
      callbackName: "adPolicyManage.selectOne"
    }],
    data: result,
    afterDrawn: afterDrawn,
    callback: _this.closeSelectDialog
  });
  _this.selectDialog.open();
  if(_this.selectDialog.resultArray.length !== 0) {
    var ret = _this.selectDialog.resultArray
    for(var i = 0; i < ret.length; i++) {
      var item = ret[i];
      jQuery("span[onclick='adPolicyManage.selectOne(\"" + item.label + "\",\"" + item.value + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CHOOSED"));
    }
  }
};
/**
 * 根据选择的素材/素材组来刷新策略窗口的data数据
 * @method getSelectedSuCai
 * @param  {array}         result 素材/素材组的选中数据｛label:素材/素材组的名称,value:素材/素材组的id｝
 * @return {void}                 无返回值
 */
adPolicyManage.getSelectedSuCai = function (result) {
  var _this = adPolicyManage,
    is_sucai = _this.dialog.selectSucai;
  if(result[0]) {
    if(is_sucai) {
      _this.dialog.data.ad_single_id = result[0].value
    } else {
      _this.dialog.data.adgroup_id = result[0].value
    }
  }
};
adPolicyManage.selectOne = function (label, value, el) {
  var selectedObj;
  if(this.selectDialog.resultArray.length == 1) {
    selectedObj = this.selectDialog.resultArray[0];
    jQuery("span[onclick='adPolicyManage.selectOne(\"" + selectedObj.label + "\",\"" + selectedObj.value + "\",this)']").removeClass("selected").html(i18n("ADPOLICYMANAGE_CHOOSE"));
    this.selectDialog.resultArray.length = 0;
  }
  this.selectDialog.resultArray.push({
    label: label,
    value: value
  });
  jQuery(el).addClass("selected").html(i18n("ADPOLICYMANAGE_CHOOSED"));
};
/**
 * 选择多个数据
 * @method selectMulti
 * @param  {string}    label 选择对象的表面显示
 * @param  {string}    value 选择对象的值
 * @param  {element}   el    选择对象的元素
 * @return {void}            无返回值
 */
adPolicyManage.selectMulti = function (label, value, el) {
  var _this = this;
  var isExist = false;
  _this.selectDialog.resultArray.forEach(function (item) {
    if(item.value == value) {
      isExist = true;
    }
  });
  if(isExist) {
    var index = _this.selectDialog.resultArray.findIndex(function (item) {
      return item.value == value;
    });
    var tmpObj = _this.selectDialog.resultArray[0];
    _this.selectDialog.resultArray[0] = _this.selectDialog.resultArray[index];
    _this.selectDialog.resultArray[index] = tmpObj;
    _this.selectDialog.resultArray.shift();
    jQuery(el).removeClass("selected").html(i18n("ADPOLICYMANAGE_CHOOSE"));
  } else {
    _this.selectDialog.resultArray.push({
      label: label,
      value: value
    });
    jQuery(el).addClass("selected").html(i18n("ADPOLICYMANAGE_CANCELCHOOSE"));
  }
};
adPolicyManage.viewSucai = function (label, value, el) {
  var app = new PreviewModel();
  app.previewSuCai(value);
};
adPolicyManage.viewSucaizu = function (label, value, el) {
  var app = new PreviewModel();
  app.previewSuCaiZu(value);
};
adPolicyManage.chooseTag = function (type) {
  var _this = adPolicyManage;
  switch(type) {
  case "ADPOLICYMANAGE_TABLE_CHANNEL":
    _this.chooseChannel();
    break;
  case "ADPOLICYMANAGE_TABLE_CATEGORY":
    _this.chooseCategory();

    break;
  case "ADPOLICYMANAGE_TABLE_AREA":
    _this.chooseArea();
    break;
  default:

  }
};
/**
 * 选择频道
 * @method chooseChannel
 * @return {[type]}      [description]
 */
adPolicyManage.chooseChannel = function () {
  var _this = this;
  var result = _this.listChannelTags();
  _this.cacheDialogData();
  var afterDrawn = function () {
    var data = [];
    if(_this.dialog.data.metadata.channel_tags) {
      _this.dialog.data.metadata.channel_tags.forEach(function (item) {
        if(item.indexOf("channel:") == 0) {
          data.push(item);
        }
      })
    }
    if(data.length !== 0) {
      var ret = data
      for(var i = 0; i < ret.length; i++) {
        var value = ret[i];
        var label = value.replace(/^channel:/, "");
        _this.selectDialog.resultArray.push({
          label: label,
          value: value
        });
        jQuery("span[onclick='adPolicyManage.selectMulti(\"" + label + "\",\"" + value + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CANCELCHOOSE"));
      }
    }
  }
  _this.selectDialog = new _this.SelectDialog();
  _this.selectDialog.init({
    dialogTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TITLE_CHANNELTAG"),
    queryTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_QUERY_CHANNELTAG"),
    tableTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TABLE_CHANNELTAG"),
    confirm: _this.getSelectedChannelTags,
    operations: [{
      name: i18n("ADPOLICYMANAGE_VIEW"),
      callbackName: "adPolicyManage.viewChannel"
        }, {
      name: i18n("ADPOLICYMANAGE_CHOOSE"),
      callbackName: "adPolicyManage.selectMulti"
    }],
    data: result,
    afterDrawn: afterDrawn,
    callback: _this.closeSelectDialog
  });
  _this.selectDialog.open();
};
/**
 * 选择栏目
 * @method chooseCategory
 * @return {[type]}      [description]
 */
adPolicyManage.chooseCategory = function () {
  var _this = this;
  var result = _this.listCategoryTags();
  _this.cacheDialogData();
  var afterDrawn = function () {
    var data = [];
    if(_this.dialog.data.metadata.catalog_tags) {
      _this.dialog.data.metadata.catalog_tags.forEach(function (item) {
        if(item.indexOf("catalog:") == 0) {
          data.push(item);
        }
      })
    }
    if(data.length !== 0) {
      var ret = data
      for(var i = 0; i < ret.length; i++) {
        var value = ret[i];
        var label = value.replace(/^catalog:/, "");
        _this.selectDialog.resultArray.push({
          label: label,
          value: value
        });
        jQuery("span[onclick='adPolicyManage.selectMulti(\"" + label + "\",\"" + value + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CANCELCHOOSE"));
      }
    }
  }
  _this.selectDialog = new _this.SelectDialog();
  _this.selectDialog.init({
    dialogTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TITLE_CATEGORYTAG"),
    queryTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_QUERY_CATEGORYTAG"),
    tableTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TABLE_CATEGORYTAG"),
    confirm: _this.getSelectedCategoryTags,
    operations: [{
      name: i18n("ADPOLICYMANAGE_VIEW"),
      callbackName: "adPolicyManage.viewCategory"
        }, {
      name: i18n("ADPOLICYMANAGE_CHOOSE"),
      callbackName: "adPolicyManage.selectMulti"
    }],
    data: result,
    afterDrawn: afterDrawn,
    callback: _this.closeSelectDialog
  });
  _this.selectDialog.open();
};
/**
 * 选择区域
 * @method chooseArea
 * @return {[type]}      [description]
 */
adPolicyManage.chooseArea = function () {
  var _this = this;
  var result = _this.listAreaTags();
  _this.cacheDialogData();
  var afterDrawn = function () {
    var data = [];
    if(_this.dialog.data.metadata.area_tags) {
      _this.dialog.data.metadata.area_tags.forEach(function (item) {
        if(item.indexOf("area:") == 0) {
          data.push(item);
        }
      })
    }
    if(data.length !== 0) {
      var ret = data
      for(var i = 0; i < ret.length; i++) {
        var value = ret[i];
        var label = value.replace(/^area:/, "");
        _this.selectDialog.resultArray.push({
          label: label,
          value: value
        });
        jQuery("span[onclick='adPolicyManage.selectMulti(\"" + label + "\",\"" + value + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CANCELCHOOSE"));
      }
    }
  }
  _this.selectDialog = new _this.SelectDialog();
  _this.selectDialog.init({
    dialogTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TITLE_AREATAG"),
    queryTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_QUERY_AREATAG"),
    tableTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TABLE_AREATAG"),
    confirm: _this.getSelectedAreaTags,
    operations: [{
      name: i18n("ADPOLICYMANAGE_VIEW"),
      callbackName: "adPolicyManage.viewArea"
        }, {
      name: i18n("ADPOLICYMANAGE_CHOOSE"),
      callbackName: "adPolicyManage.selectMulti"
    }],
    data: result,
    afterDrawn: afterDrawn,
    callback: _this.closeSelectDialog
  });
  _this.selectDialog.open();
};
/**
 * 弹出频道查看页面
 * @method function
 * @param  {string} label 频道的
 * @param  {[type]} value [description]
 * @param  {[type]} el    [description]
 * @return {[type]}       [description]
 */
adPolicyManage.viewChannel = function (label, value, el) {
  //todo
  //open a selectDialog which has no confirm btn and no operation column and no query bar
  var _this = this;
  var result = _this.listChannelFromChannelTags(value);
  var dialog = new _this.SelectDialog();
  var closeCallback = function () {
    var _this = adPolicyManage;
    _this.selectDialog.open();
    if(_this.selectDialog.resultArray.length !== 0) {
      var ret = _this.selectDialog.resultArray
      for(var i = 0; i < ret.length; i++) {
        var item = ret[i];
        jQuery("span[onclick='adPolicyManage.selectMulti(\"" + item.label + "\",\"" + item.value + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CANCELCHOOSE"));
      }
    }
  };
  dialog.init({
    dialogTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TITLE_CHANNEL") + label,
    tableTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TABLE_CHANNEL"),
    data: result,
    callback: closeCallback
  });
  dialog.open();
};

/**
 * 弹出栏目查看页面
 * @method function
 * @param  {string} label 栏目的
 * @param  {[type]} value [description]
 * @param  {[type]} el    [description]
 * @return {[type]}       [description]
 */
adPolicyManage.viewCategory = function (label, value, el) {
  //todo
  //open a selectDialog which has no confirm btn and no operation column and no query bar
  var _this = this;
  var result = _this.listCatalogFromChannelTags(value);
  var dialog = new _this.SelectDialog();
  var closeCallback = function () {
    var _this = adPolicyManage;
    _this.selectDialog.open();
    if(_this.selectDialog.resultArray.length !== 0) {
      var ret = _this.selectDialog.resultArray
      for(var i = 0; i < ret.length; i++) {
        var item = ret[i];
        jQuery("span[onclick='adPolicyManage.selectMulti(\"" + item.label + "\",\"" + item.value + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CANCELCHOOSE"));
      }
    }
  };
  dialog.init({
    dialogTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TITLE_CHANNEL") + label,
    tableTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TABLE_CATEGORY"),
    data: result,
    callback: closeCallback
  });
  dialog.open();
};

/**
 * 弹出区域查看页面
 * @method function
 * @param  {string} label 栏目的
 * @param  {[type]} value [description]
 * @param  {[type]} el    [description]
 * @return {[type]}       [description]
 */
adPolicyManage.viewArea = function (label, value, el) {
  //todo
  //open a selectDialog which has no confirm btn and no operation column and no query bar
  var _this = this;
  var result = _this.listAreaFromChannelTags(value);
  var dialog = new _this.SelectDialog();
  var closeCallback = function () {
    var _this = adPolicyManage;
    _this.selectDialog.open();
    if(_this.selectDialog.resultArray.length !== 0) {
      var ret = _this.selectDialog.resultArray
      for(var i = 0; i < ret.length; i++) {
        var item = ret[i];
        jQuery("span[onclick='adPolicyManage.selectMulti(\"" + item.label + "\",\"" + item.value + "\",this)']").addClass("selected").html(i18n("ADPOLICYMANAGE_CANCELCHOOSE"));
      }
    }
  };
  dialog.init({
    dialogTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TITLE_CHANNEL") + label,
    tableTitle: i18n("ADPOLICYMANAGE_SELECTDIALOG_TABLE_AREA"),
    data: result,
    callback: closeCallback
  });
  dialog.open();
};
/**
 * 栏目选择窗口确认按钮事件
 * @method function
 * @param  {array} result 选择的数据[{label:栏目名称,value:栏目的tag值}]
 * @return {void}        无返回值
 */
adPolicyManage.getSelectedChannelTags = function (result) {
  var _this = adPolicyManage;
  var ret = [];
  for(var i = 0; i < result.length; i++) {
    var item = result[i];
    ret.push(item.value);
  }
  var tmpTags = [];
  (_this.dialog.data.tags||[]).forEach(function (item, index) {
    if(item.indexOf("channel:") !== 0) {
      tmpTags.push(item)
    }
  });
  tmpTags = tmpTags.concat(ret);
  if(_this.dialog.data.metadata) {
    _this.dialog.data.metadata.channel_tags = ret;
  } else {
    _this.dialog.data.metadata = {
      channel_tags: ret
    }
  };
  // _this.dialog.data.tags = tmpTags;
};
/**
 * 栏目选择窗口确认按钮事件
 * @method function
 * @param  {array} result 选择的数据[{label:栏目名称,value:栏目的tag值}]
 * @return {void}        无返回值
 */
adPolicyManage.getSelectedCategoryTags = function (result) {
  var _this = adPolicyManage;
  var ret = [];
  for(var i = 0; i < result.length; i++) {
    var item = result[i];
    ret.push(item.value);
  }
  var tmpTags = [];
  (_this.dialog.data.tags||[]).forEach(function (item, index) {
    if(item.indexOf("catalog:") !== 0) {
      tmpTags.push(item)
    }
  });
  tmpTags = tmpTags.concat(ret);
  if(_this.dialog.data.metadata) {
    _this.dialog.data.metadata.catalog_tags = ret;
  } else {
    _this.dialog.data.metadata = {
      catalog_tags: ret
    }
  };
  // _this.dialog.data.tags = tmpTags;
};
/**
 * 栏目选择窗口确认按钮事件
 * @method function
 * @param  {array} result 选择的数据[{label:栏目名称,value:栏目的tag值}]
 * @return {void}        无返回值
 */
adPolicyManage.getSelectedAreaTags = function (result) {
  var _this = adPolicyManage;
  var ret = [];
  for(var i = 0; i < result.length; i++) {
    var item = result[i];
    ret.push(item.value);
  }
  var tmpTags = [];
  (_this.dialog.data.tags||[]).forEach(function (item, index) {
    if(item.indexOf("area:") !== 0) {
      tmpTags.push(item)
    }
  });
  tmpTags = tmpTags.concat(ret);
  if(_this.dialog.data.metadata) {
    _this.dialog.data.metadata.area_tags = ret;
  } else {
    _this.dialog.data.metadata = {
      area_tags: ret
    }
  };
  // _this.dialog.data.tags = tmpTags;
};
/**
 * 选择窗口关闭后的回调事件
 * @method closeSelectDialog
 * @return {void}          无返回值
 */
adPolicyManage.closeSelectDialog = function () {
  var _this = adPolicyManage;
  _this.dialog.show();
};
/**
 * [获得当前环境的时区]
 * @method function
 * @return string 时区信息，例如：+0800
 */
adPolicyManage.getGMT = function () {
  var _this = this;
  var showTime = function (time) {
    if(time < 10) return "0" + time;
    return time
  }
  var TimezoneOffset = (new Date()).getTimezoneOffset();
  var GMT = "";
  if(TimezoneOffset <= 0) {
    GMT = "+" + showTime(Math.floor(Math.abs(TimezoneOffset) / 60)) + showTime(Math.abs(TimezoneOffset) % 60);
  } else {
    GMT = "-" + showTime(Math.floor(Math.abs(TimezoneOffset) / 60)) + showTime(Math.abs(TimezoneOffset) % 60);
  };
  return GMT;
};
/**
 * [获得当前环境的时间]
 * @method function
 * @return string 不带时区信息的时间
 */
adPolicyManage.showTime = function (time) {
  var t;
  if(typeof time == "number") {
    t = time + ""
  } else if(typeof time == "string") {
    t = time
  }
  if(t.indexOf("T") >= 0) {
    t = t.replace("T", " ");
  }
  var result = "";
  if(t) {
    if(t.indexOf("+") >= 0) {
      result = t.split("+")[0];
    } else {
      if((t.substr(-5).indexOf("-") >= 0) && (t.length > 19)) {
        result = t.split(t.substr(-5))[0];
      } else {
        result = t;
      }
    }
  }
  return result;
};
/**
 * 暂存策略dialog中的时间
 * @method function
 * @return {[type]} [description]
 */
adPolicyManage.cacheDialogData = function () {
  var _this = this,
    dialog = _this.dialog,
    GMT = _this.getGMT();
  //保存时间
  var e = new jQuery.Event("keydown");
  e.which = 13;
  dialog.validTimeDataPicker.jqDateInput.trigger(e);
  dialog.invalidTimeDataPicker.jqDateInput.trigger(e);
  //结束

  var play_begintime = dialog.durationStartTimeHourBox.getValue() + ":" + dialog.durationStartTimeMinuteBox.getValue() + ":" + dialog.durationStartTimeSecondBox.getValue() + GMT;
  var play_endtime = dialog.durationEndTimeHourBox.getValue() + ":" + dialog.durationEndTimeMinuteBox.getValue() + ":" + dialog.durationEndTimeSecondBox.getValue() + GMT;
  var activatetime = dialog.validTimeDataPicker.getDateStr() + "T" + dialog.validTimeHourBox.getValue() + ":" + dialog.validTimeMinuteBox.getValue() + ":" + dialog.validTimeSecondBox.getValue() + GMT;
  var expiretime = dialog.invalidTimeDataPicker.getDateStr() + "T" + dialog.invalidTimeHourBox.getValue() + ":" + dialog.invalidTimeMinuteBox.getValue() + ":" + dialog.invalidTimeSecondBox.getValue() + GMT;
  var priority = parseInt(jQuery("#policy_priority").val());
  var weight = parseInt(dialog.policyWeightBox.getValue());
  var extra_area_tags = jQuery('#area_tags_2').val().split(',').filter(item => item !== '')

  if (dialog.chargeType) {
    dialog.data.charge_type = dialog.chargeType.getValue();
  }

  dialog.data.priority = priority;
  dialog.data.weight = weight;
  dialog.data.activatetime = activatetime;
  dialog.data.expiretime = expiretime
  dialog.data.play_begintime = play_begintime
  dialog.data.play_endtime = play_endtime
  dialog.data.area_tags2 = extra_area_tags;
};
/**
 * 显示冲突页面
 * @method function
 * @return {void} undefined
 */
adPolicyManage.showConflictDialog = function (callback) {
  var _this = this;
  var dialog = new PopupDialog({
    url: "content/ce_lue_guan_li/conflictDialog.html",
    width: 480,
    height: 268,
    context: this,
    callback: function () {
      jQuery(".conflict_dialog .confirm_btn").click(function () {
        callback && callback()
      });
      jQuery(".conflict_dialog .cancel_btn").click(function () {
        _this.dialog.open();
      })
    }
  });
  dialog.open();
};
/**
 * 显示否决原因
 * @method function
 * @return {void} undefined
 */
adPolicyManage.showDeneyReason = function () {
  var _this = this;
  _this.deneyDialog = new PopupDialog({
    url: "content/ce_lue_guan_li/auditDeneyDialog.html",
    width: 760,
    height: 342,
    context: this,
    callback: function () {
      jQuery(".auditDialogCloseBtn,.auditDialogCancelBtn").click(function () {
        _this.deneyDialog.close();
      });
      jQuery(".auditDialogSubmitBtn").hide();
      var _url = paasHost + paasDomain + "/auditflow/instance/ad_policy/" + _this.dialog.data.adpolicy_id + "?" + _this.getToken()
      jQuery.ajax({
        url: _url,
        method: "GET",
        dataType: "JSON",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-aqua-sign": getPaaS_x_aqua_sign("GET", _url)
        }
      }).done(function (resp) {
        var ret = "";
        for(var i = 0; i < resp.step.length; i++) {
          if(resp.step[i].status == "deprecated") {
            ret = resp.step[i].reason.replace(/^failure reason /, "");
          }
        }
        jQuery("textarea.auditDialogDeneyReason").val(ret);
      })
    }
  });
  _this.deneyDialog.open();
};
/**
 * 获取站点列表
 * @method
 * @return {void} undefined
 */
adPolicyManage.getSiteList = function () {
  var _this = this;
  jQuery.ajax({
    async: false,
    url: paasHost + paasDomain + "/dm/site",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  }).done(function (data) {
    _this.siteList[AdvSelfSiteId] = AdvSelfSiteName;
    for(var i = 0; i < data.length; i++) {
      var item = data[i]
      if(!_this.siteList[item.id]) {
        _this.siteList[item.id] = item.name;
      }
    }
  });
};
adPolicyManage.viewDistribute = function (index) {
  var _this = this,
    data = _this.data[index],
    adpExtId = data.adp_list[0],
    adp = _this.adpArray[_this.policyType].find(adpExtId, 2, "ext_id"),
    opts = {
      id: data.adpolicy_id,
      name: data.name,
      site_id: data.site_id
    };

  viewDistributeState("#ad-disites-layer", "adpolicy", opts);
};
adPolicyManage.showConnect = function (index) {
  var _this = this,
    data = _this.data[index];
  openAdPosConnect('#ad-connect-layer', data);
}
adPolicyManage.viewAuditHis = function(index) {
  var _this = this,
    data = _this.data[index]
  var dialog = new AuditHis({type: 'ad_policy', id: data.adpolicy_id});
}
adPolicyManage.toggleExpand = function(el, i, e) {
  e.preventDefault();
  e.stopPropagation()
  var $ = jQuery;
  var dom = $("<div class='opDropDown'>")
  var targetRect = $(el)[0].getBoundingClientRect()
  dom.css({
    'top':  targetRect.top,
    'left':  targetRect.right - 90,
  })
  var op_more = "<span class='more'>" + i18n('SELF_SERVICE_ADVISER_MANAGE_MORE') + "</span>"
  var op_patch = "<span " + (my.paas.user_type !== "2" ? "onclick='adPolicyManage.viewDistribute(" + i + ")'" : "style='cursor:default;color:#797979;'") + ">" + i18n("ADPOS_OPERATION_DIST") + "</span>";
  var op_del = "<span " + (my.paas.user_type !== "2" ? "onclick='adPolicyManage.deletePolicy(" + i + ")'" : "style='cursor:default;color:#797979;'") + ">" + i18n("ADPOLICYMANAGE_TABLE_DELETE") + "</span>";
  var op_audit_his = "<span " + (my.paas.user_type !== "2" ? "onclick='adPolicyManage.viewAuditHis(" + i + ")'" : "style='cursor:default;color:#797979;'") + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS") + "</span>";
  dom.html([op_more, op_patch, op_audit_his, op_del].join(''))
  dom.one('click', (e) => {
    dom.remove();
  })
  $('.opDropDown').remove();
  $(document.body).append(dom)
  $(document.body).one('click', (e) => {
    dom.remove();
  })
}
/**
 * 根据素材的id获取素材的合同id
 * @method checkContractIdByAdId
 * @param  {string}            ad_id 素材id
 * @return {boolean}                 是否包含合同id
 */
adPolicyManage.checkContractIdByAdId = function (ad_id) {
  var _this = this,
    array = _this.sucaiArray,
    result = false;
  if(array) {
    array.forEach(function (item) {
      if(item.value == ad_id && item.contractid) {
        result = true
      }
    })
  }
  return result;
};
/**
 * 根据素材组的id获取素材的合同id
 * @method checkContractIdByAdgroupId
 * @param  {string}            ad_id 素材id
 * @return {boolean}                 是否包含合同id
 */
adPolicyManage.checkContractIdByAdgroupId = function (ad_id) {
  var _this = this,
    array = _this.sucaizuArray,
    result = false;
  if(array) {
    array.forEach(function (item) {
      if(item.value == ad_id) {
        result = adPolicyManage.getSuCaiBySuCaiZuId(ad_id).map(item => item.contract_id ? true: false).filter(item => !item).length > 0 ? false: true;
      }
    })
  }
  return result;
};
/**
 * 根据素材组id获取素材组下所有素材
 */
adPolicyManage.getSuCaiBySuCaiZuId = function(ad_id) {
  var $=jQuery,
      method = 'Get',
      url = paasHost + '/aquapaas_adv/rest/ads/aditem/aditems',
      urlParam = [],
      ret = null;
  switch (this.policyType) {
    case 0:
      urlParam.push('type=img')
      break;
    case 1:
      urlParam.push('type=video')
      break;
    default:
      urlParam.push('type=subtitle')
  }
  urlParam.push('user_id=' + my.paas.user_id)
  urlParam.push('user_type=' + my.paas.user_type)
  urlParam.push('access_token=' + my.paas.access_token)
  urlParam.push('app_key=' + paasAppKey)
  urlParam.push('timestamp=' + new Date().toISOString())
  urlParam.push('ad_group_id=' + ad_id)
  url +=  '?' + urlParam.join('&')
  $.ajax({
    type: method,
    url: url,
    async: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).always((resp, status, xhr) => {
    if (status == 'success') {
      ret = resp
    }
  })
  return ret;
}
adPolicyManage.init();
