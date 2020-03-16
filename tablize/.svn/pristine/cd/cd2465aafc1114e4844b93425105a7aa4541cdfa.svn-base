var queryWin = function (option) {
  var _this = this;
  _this._isEdit = option.isEdit;
  _this.isPreset = true;

  var _destData = jQuery.extend(true, {}, option.data);
  var _data = {};
  _data.smartCardIds = option.data && option.data.smartCardIds.length > 0 ? option.data.smartCardIds: []
  if(_this._isEdit) {
    _this._data = option.data.data;
  } else {
    _this._data = {
      smartCardIds: []
    };
  }
  var callback = option.callback;
  _this._win = new PopupDialog({
    url: 'content/brodecastRecord/BatchQuery/BatchQueryWin.html',
    width: 452,
    height: 400,
    callback: queryWinEventBind,
    context: this,
    ajaxOnEachCreate: true
  });

  function zerolize(num, len) {
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

  function queryWinEventBind() {
    //关闭按钮事件
    jQuery(".popupCenterDivTop img").bind("click", function () {
      _this._win.close();
    });
    //查询按钮事件
    jQuery("[name='popUpQueryBtn']").bind("click", function () {
      var valid = checkData();
      if(valid) {
        _data.data = _this._data;
        console.log(_data);
        callback(_data);
        _this._win.close();
      }
      // batchQuery.query();
    });
    //取消按钮事件
    jQuery("[name='popUpCancelBtn']").bind("click", function () {
      _this._win.close();
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
        _this._data.endDate = _cur_date.getFullYear() + "-" + zerolize(_cur_date.getMonth() + 1, 2) + "-" + zerolize(_cur_date.getDate(), 2);
        var _begin_d = new Date(_cur_date);
        _begin_d.setMonth(_begin_d.getMonth() - Number(selector.value));
        _this._data.startDate = _begin_d.getFullYear() + "-" + zerolize(_begin_d.getMonth() + 1, 2) + "-" + zerolize(_begin_d.getDate(), 2);
        _data.dateRange = selector.value
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
        _data._isCustomized = false;
      } else {
        jQuery("#start_date_row,#end_date_row").show();
        _this.dateRangeComb.updateOptions([{
          label: "自定义",
          value: "自定义"
        }]);
        _this.dateRangeComb.setValue("自定义");
        _this.dateRangeComb.disable();
        _data._isCustomized = true;
      }
      _data.dateRange = _this.dateRangeComb.getValue();
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
      containerId: 'multiDetailList_start_date',
      calendarStyles: calendarStyles,
      dateInputStyles: {
        borderColor: '#d3d3d3'
      },
      iconImage: 'images/smallCalendarIcon.png'
    });
    _this.datePicker_endDate = new DatePicker({
      containerId: 'multiDetailList_end_date',
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
    //组合类型单选
    jQuery('[name=radio1]').bind("click", function (event) {
      jQuery('[name=radio1]').removeClass("radio_selected").addClass("radio");
      jQuery(event.target).removeClass("radio").addClass("radio_selected");
      var _index = jQuery(event.target).index('[name=radio1]');
      _this.isPreset = _index == 0 ? true : false;
      _data._isPreset = _this.isPreset;
      jQuery(".group").removeClass("type1").removeClass('type0').addClass("type" + _index);
      if(jQuery("#po_ids")[0].classList == 0) {
        jQuery("#po_type_list dd").click();
        jQuery("#po_type_list dd:eq(0)").click();
      }
      switch(_index) {
      case 0:
      case "0":
        var focus = jQuery("#selection_list").find(".radio_selected");
        if(focus.length == 0) {
          jQuery("#selection_list .radio").eq(0).click();
        } else {
          focus.click();
        }
        break;
      case 1:
      case "1":
        var poType = _this.poTypeComb.getValue() || "2,5";
        _this.poTypeComb.setValue(poType);
        break;
      default:

      }
    });
    //添加按钮事件
    jQuery("[name=addSmartCard]").bind("click", function () {
      var _new_id = jQuery("input[name=smartCardInput]").val();
      var arrayIDs = _this._data.smartCardIds || [];
      var _exist = false;
      for(var i = 0; i < arrayIDs.length; i++) {
        if(arrayIDs[i] == _new_id) {
          _exist = true;
        }
      }
      if(!_exist) {
        arrayIDs.push(_new_id);
        _data.smartCardIds = _this._data.smartCardIds = arrayIDs;
      }
      reload_card_table();
      jQuery("input[name=smartCardInput]").val("");
    });
    //日期范围下拉按钮
    jQuery("[name=dropDownListBtn],[name=dateRangeValue]").bind("click", function () {
      if(!jQuery(this).parent().hasClass("disabled")) {
        jQuery("#date_range_list").toggle();
      }
    });
    //点播类型下拉框
    _this.poTypeComb = new StyledSelector({
      containerId: "poTypeSelector",
      options: [{
        label: "服务包(SVOD)",
        value: "2,5"
        }, {
        label: "按次点播(RVOD)",
        value: "1,3"
        }, {
        label: "时移回看",
        value: "60010000,60010002,60010010,60010011,60010012"
        }],
      styles: {
        optionHeight: '28px',
        iconColor: "#2ea2d7"
      }
    });
    _this.poTypeComb.create();
    _this.poTypeComb.onChange = function (selector) {
        _this._data.poType = selector.value;
        var _class = "";
        switch(selector.value) {
        case "2,5":
          _class = "svod"
          break;
        case "1,3":
          _class = "rvod"
          break;
        default:
          _class = "none"
        }
        jQuery("#po_ids").removeClass().addClass(_class);
        _data.poids = _this._data.poids = jQuery("#po_ids input").val();
        _data.poTypeSelector = selector.value;
      }
      //选择组合类型
    function selectAPreSet() {
      jQuery("#selection_list .radio").removeClass("radio_selected");
      jQuery(this).parent().find(".radio").addClass('radio_selected');
      var _index = jQuery(this).parent().find(".radio").data("index");
      _this._data.poType = BROADCAST_PO_DEFAULT[_index].POTYPE;
      _this._data.poids = BROADCAST_PO_DEFAULT[_index].POIDS;
      _data.preset = _index;
    }
    jQuery("#selection_list").empty();
    for(var i = 0; i < BROADCAST_PO_DEFAULT.length; i++) {
      var item = BROADCAST_PO_DEFAULT[i];
      var row = document.createElement("div");
      row.className = "selection_item";
      var _radio = document.createElement("div");
      _radio.className = "radio";
      _radio.dataset["index"] = i;
      _radio.onclick = selectAPreSet;
      row.appendChild(_radio);
      var _label = document.createElement("div");
      _label.dataset["index"] = i;
      _label.innerHTML = item.name;
      _label.onclick = selectAPreSet;
      row.appendChild(_label);
      jQuery("#selection_list").append(row);
    };
    jQuery("#selection_list").mCustomScrollbar({
      theme: 'skyblue'
    });
    if(jQuery("[name=radio1].radio_selected").index("[name=radio1]") == 0) {
      jQuery("#selection_list .radio").eq(0).click();
    }
    //绑定滚动条
    jQuery("div[name=smartCardContainer] .smart_card_table_body").mCustomScrollbar({
      theme: 'skyblue'
    });

    if(document.getElementById("pageTitle_export_") != null) //在导入页面里。
    {
      //绑定导入文件的radio button
      var jQ_ = jQuery;
      jQ_("input[name=servicePackInput]").attr("disabled", true);
      jQ_("#missionDescContainer").show();
      jQ_("#popupCenterDiv_exportRadio").show();

      jQuery("#aquaBOexport_importFile").bind("click", batchExport.uploadFile);

      jQ_("[name=cardID_]").each(function () {
        jQ_(this).bind('click', function () {
          if(jQ_(this).children().eq(0).attr("class") == "radio") {
            jQ_(this).children().eq(0).attr("class", "radio_selected");
            jQ_(this).siblings().children().eq(0).attr("class", "radio");
            if(jQ_(this).index() == 1) {
              jQ_("#popupDiv_import").show();
              jQ_("#cardIDInput").hide();
            } else {
              jQ_("#popupDiv_import").hide();
              jQ_("#cardIDInput").show();
            }
          }
        });
      });

      var height_ = 0 - document.getElementById('batch').offsetHeight / 2 + "px";
      jQuery("#popup-dialog-dialog").css({
        "top": "50%",
        "margin-top": height_
      });
    }
    if (!jQuery.isEmptyObject(_destData)) {
      loadData(_destData);
    }
  };

  function reload_card_table() {
    var _self = this;

    loadSmartCard(_this._data)
  }
    function deleteSmartCard() {
      var _index = Number(jQuery(this)[0].dataset["index"]);
      _this._data.smartCardIds.removeByIndex(_index);
      reload_card_table();
    }
  function loadSmartCard (_data) {
    jQuery(".smart_card_table_body  table tbody").empty();
    var row = document.createElement("tr");
    for(var i = 0; i < Math.max(_data.smartCardIds.length, 6); i++) {
      var item = _data.smartCardIds[i];
      var _label = document.createElement("td");
      _label.innerHTML = item;
      _label.setAttribute("width", "32%")
      var _op = document.createElement("td");
      _op.onclick = deleteSmartCard;
      _op.dataset["index"] = i;
      _op.setAttribute("width", "18%");
      if(item) {
        _label.innerHTML = item;
        _op.innerHTML = "删除";
      } else {
        _label.innerHTML = "";
        _op.innerHTML = "";
      }
      row.appendChild(_label);
      row.appendChild(_op);
      if(i % 2 == 1) {
        jQuery(".smart_card_table_body  table tbody").append(row);
        row = document.createElement("tr");
      } else if(i == Math.max(_data.smartCardIds.length, 6) - 1) {
        row.appendChild(_label);
        row.appendChild(_op);

        var _label2 = document.createElement("td");
        _label2.innerHTML = "";
        _label2.setAttribute("width", "32%")
        var _op2 = document.createElement("td");
        _op2.dataset["index"] = i;
        _op2.setAttribute("width", "18%");
        row.appendChild(_label2);
        row.appendChild(_op2);
        jQuery(".smart_card_table_body  table tbody").append(row);
      }
    }
  }

  this.reload_card_table_ = reload_card_table;


  //检查数据可用性
  function checkData() {
    var ret = true;
    if(!_this._data.startDate) {
      alert("请输入开始日期");
      ret = false;
      return;
    };
    if(!_this._data.endDate) {
      alert("请输入结束日期");
      ret = false;
      return;
    };
    if(_this._data.smartCardIds.length == 0) {
      alert("请输入智能卡号");
      ret = false;
      return;
    };
    if(_this.isPreset) {
      if(_this._data.poType == "") {
        _this._data.poType = "1,2,3,5";
      }
    } else {
      if(_this._data.poType == "2,5") {
        var servicepackageids = jQuery(".dropDownListValue[name=poIdsValue]").val();
        if(servicepackageids !== "") {
          jQuery.ajax({
            url: LSMS_PATH + "servicepackage/" + servicepackageids,
            type: "GET",
            async: false,
            error: function (resp) {
              if(resp.status === 404) {
                alert("不存在此service package id");
                ret = false;
              };
            }
          }).done(function (resp) {
            po_ids = "";
            for(var i = 0; i < resp.length; i++) {
              po_ids += resp[i].po_id_list + ","
            }
            _this._data.poids = po_ids;
          });
        }
      }
    }
    return ret;
  }
  function loadData(data) {
    if (data._isCustomized) {
      jQuery('#setCustomize').click();
      _this.datePicker_startDate.setCurrDate(_this.datePicker_startDate.parseDateStr(data.data.startDate))
      _this.datePicker_endDate.setCurrDate(_this.datePicker_endDate.parseDateStr(data.data.endDate))
    } else {
      _this.dateRangeComb.setValue(data.dateRange)
    }

    jQuery('[name=radio1]:eq(' + (data._isPreset ? 0: 1) + ')').click();
    if (data._isPreset) {
      jQuery('.selection_item .radio:eq(' + data.preset + ')').click();
    } else {
      _this.poTypeComb.setValue(data.poTypeSelector)
    }
    loadSmartCard(data.data);
  }
  return this;
};
queryWin.prototype.create = function () {
  this._win.create()
};

queryWin.prototype.show = function () {
  this._win.show()
}
