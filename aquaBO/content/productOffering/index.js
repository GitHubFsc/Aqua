var productOffering = {
  _searchData: {},
  init: function () {
    var _this = this;
    _this.initWidgets();
  },
  initWidgets: function () {
    var _this = this;
    //有效策略下拉框
    _this.__validComb = new newSelect("#validity_filter", [{
        key: i18n("PRODUCTOFFERING_VALIDFILTER_VALID"),
        value: "1,2,3,4"
      }, {
        key: i18n("PRODUCTOFFERING_VALIDFILTER_INVALID"),
        value: "1"
      }, {
        key: i18n("PRODUCTOFFERING_VALIDFILTER_ALL"),
        value: "2"
    }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {
        //what to do
        // _this.__listTable.refreshList();
        _this.query();
      })
      //全部策略下拉框
    _this.__enabledComb = new newSelect("#enable_filter", [{
        key: i18n("PRODUCTOFFERING_ENDABLEFILTER_ALL"),
        value: "1,2,3,4"
      }, {
        key: i18n("PRODUCTOFFERING_ENDABLEFILTER_ENABLE"),
        value: "1"
      }, {
        key: i18n("PRODUCTOFFERING_ENDABLEFILTER_DISABLE"),
        value: "2"
    }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {
        //what to do
        this._searchData.active = this.getValue();
        _this.__listTable.refreshList();
        // _this.query();
      })
      //数据列表
    var _list_titles = [{
      label: i18n("PRODUCTOFFERING_TABLE_TITLE_ID")
    }, {
      label: i18n("PRODUCTOFFERING_TABLE_TITLE_NAME")
    }, {
      label: i18n("PRODUCTOFFERING_TABLE_TITLE_EFFECTIVETIME")
    }, {
      label: i18n("PRODUCTOFFERING_TABLE_TITLE_EXPIRATIONTIME")
    }, {
      label: i18n("PRODUCTOFFERING_TABLE_TITLE_CURRENCY")
    }, {
      label: i18n("PRODUCTOFFERING_TABLE_TITLE_TYPE")
    }, {
      label: i18n("PRODUCTOFFERING_TABLE_TITLE_STATUS")
    }, {
      label: i18n("PRODUCTOFFERING_TABLE_TITLE_OP")
    }]
    var _list_styles = {
      borderColor: "#E2E2E2",
      borderWidth: 1,
      titleBg: "#45D1F4",
      titleColor: "#FFFFFF",
      titleHeight: 31,
      cellBg: "white",
      evenBg: "#F5FDFF",
      cellColor: "#797979",
      cellHeight: 34,
      footBg: "#FFFFFF",
      footColor: "#494B58",
      inputBg: "#FFFFFF",
      inputBorder: "1px solid #CBCBCB",
      iconColor: "#0099CB",
      columnsWidth: [0.13, 0.12, 0.1, 0.1, 0.15, 0.15, 0.1, 0.15]
    }
    _this.__listTable = new StyledList({
      containerId: "list_table",
      rows: 15,
      columns: 8,
      titles: _list_titles,
      listType: 0,
      async: true,
      updateTitle: false,
      data: [],
      styles: _list_styles
    });
    // _this.__listTable.getPageData = _this.query;
    _this.__listTable.create();
    _this.query();
    jQuery(" #create.header_item").on("click", function () {
      _this.operationClick(this);
    })
  },
  query: function (pageNum, callback) {
    var _this = productOffering;
    //操作
    function operationString(index) {
      var data = _this._data[index];
      var html = "<span>";
      html += "<a onclick='productOffering.operationClick(this)' data-index='" + index + "' data-type='view'>" + i18n("PRODUCTOFFERING_TABLE_TITLE_OP_VIEW") + "</a>"; //查看
      html += "<a onclick='productOffering.operationClick(this)' data-index='" + index + "' data-type='edit'>" + i18n("PRODUCTOFFERING_TABLE_TITLE_OP_EDIT") + "</a>"; //编辑
      if(data.enable) {
        html += "<a onclick='productOffering.operationClick(this)' data-index='" + index + "' data-type='disable'>" + i18n("PRODUCTOFFERING_TABLE_TITLE_OP_DISABLE") + "</a>"; //下架
      } else {
        html += "<a onclick='productOffering.operationClick(this)' data-index='" + index + "' data-type='enable'>" + i18n("PRODUCTOFFERING_TABLE_TITLE_OP_ENABLE") + "</a>"; //上架
      }
      html += "<a onclick='productOffering.operationClick(this)' data-index='" + index + "' data-type='delete'>" + i18n("PRODUCTOFFERING_TABLE_TITLE_OP_DELETE") + "</a>"; //删除
      html += "</span>";
      return html;
    }
    //获取价格单位提示信息
    function getPriceCurrency(str) {
      var ret = ""
      switch(str) {
      case "RMB":
        ret = i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICECURRENCY_RMB")
        break;
      case "credit":
        ret = i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICECURRENCY_CREDIT")
        break;
      case "ticket_time":
        ret = i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICECURRENCY_TICKET")
        break;
      default:
        ret = str
      }
      return ret;
    }
    //获取价格类型提示信息
    function getPriceType(str) {
      var ret = ""
      switch(str) {
      case "fixed":
        ret = i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICETYPE_FIXED")
        break;
      case "discount":
        ret = i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICETYPE_DISCOUNT")
        break;
      case "alt_price":
        ret = i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICETYPE_ALTPRICE")
        break;
      case "minus":
        ret = i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICETYPE_MINUS")
        break;
      default:
        ret = str
      }
      return ret;
    }
    //格式化结果
    function formatData(data) {
      //组合成列表需要的
      var dataset = [];
      for(var i = 0; i < data.length; i++) {
        var row = [];
        var item = data[i];
        var col1 = item["offering_id"];
        var col2 = item["name"];
        var col3 = item["effective_time"];
        var col4 = item["expiration_time"];
        var purchase_options = getPOpts(item["purchase_options"]);

        function getPOpts(array) {
          var obj;
          for(var i = 0; i < array.length; i++) {
            if(array[i].scope == "user:self") {
              obj = item["purchase_options"][i];
              return obj;
            }
          }
        }
        var col5 = getPriceCurrency(purchase_options.price_currency)
        var col6 = getPriceType(purchase_options.price_type)
        var col7 = item["status"]
        var col8 = "<div>" + operationString(i) + "</div>";
        row.push({
          label: "<div title='" + col1 + "'>" + col1 + "<>"
        })
        row.push({
          label: col2
        })
        row.push({
          label: getDateStr(col3)
        })
        row.push({
          label: getDateStr(col4)
        })
        row.push({
          label: col5
        })
        row.push({
          label: col6
        })
        row.push({
          label: col7
        })
        row.push({
          label: col8
        })
        dataset.push(row);
      }
      return dataset;
    }

    function getDateStr(str) {
      var ret = "",
        _t, _y, _m, _d;
      if(str) {
        try {
          _t = new Date(str);
          _y = _t.getFullYear();
          _m = _t.getMonth() + 1;
          _d = _t.getDate();
          ret = zerolize(_y, 4) + "-" + zerolize(_m, 2) + "-" + zerolize(_d, 2)

          function zerolize(int, len) {
            var _ret = int + "";
            for(var i = 0; i < len - _ret.length; i++) {
              _ret = "0" + _ret;
            }
            return _ret
          }
        } catch(e) {
          console.error("http://www.baidu.com/s?wd=", +e.message.replace(/\s/g, ""));
        } finally {
          return ret;
        }
      } else {
        return ret
      }
    }
    //请求
    jQuery.ajax({
      // url: aquapaas_host + "/aquapaas/rest/offering?page=" + pageNum + "&size=15",
      url: aquapaas_host + "/aquapaas/rest/offering",
      async: true
    }).done(function (rsp) {
      var data;
      try {
        data = rsp;
      } catch(e) {
        data = []
        console.error("http://www.baidu.com/s?wd=" + e.message.replace(/\s/g, ""));
      } finally {
        _this._data = data;
        _this.__listTable.update(formatData(data));
      }
    })
  },
  operationClick: function (el) {
    var _this = productOffering,
      _index = jQuery(el).data("index"),
      _type = jQuery(el).data("type"),
      dialog;
    switch(_type) {
    case "create":
      // dialog = _this.policyDialog(_type, null, function () {
        // var ret = _this.createPolicy(dialog._data)
        // if(ret) {
          // dialog.close();
          // // _this.__listTable.refreshList();
          // _this.query();
        // }
      // });
      POEditor.add(function(){
        _this.query();
      });
      break;
    case "view":
      // dialog = _this.policyDialog(_type, _index, function () {
        // dialog.close();
        // _this.query();
      // })
      POEditor.view(productOffering._data[_index]);
      break;
    case "edit":
      // dialog = _this.policyDialog(_type, _index, function () {
        // var ret = _this.updatePolicy(dialog._data);
        // if(ret) {
          // dialog.close();
          // _this.query();
        // }
      // })
      POEditor.edit(productOffering._data[_index], function(){
        _this.query();
      });
      break;
    case "enable":
      var policy_name = _this._data[_index].name;
      var msg = i18n("PRODUCTOFFERING_DIALOG_ENABLE_HINT").replace("{{}}", policy_name)
      dialog = new _this.alertDialog(msg, function () {
        var ret = _this.enablePolicy(_index)
        if(ret) {
          dialog.close();
          // _this.__listTable.refreshList();
          _this.query();
        }
      });
      break;
    case "disable":
      var policy_name = _this._data[_index].name;
      var msg = i18n("PRODUCTOFFERING_DIALOG_DISABLE_HINT").replace("{{}}", policy_name)
      dialog = new _this.alertDialog(msg, function () {
        var ret = _this.disablePolicy(_index)
        if(ret) {
          dialog.close();
          // _this.__listTable.refreshList();
          _this.query();
        }
      });
      break;
    case "delete":
      var policy_name = _this._data[_index].name;
      var msg = i18n("PRODUCTOFFERING_DIALOG_DELETE_HINT").replace("{{}}", policy_name)
      dialog = new _this.alertDialog(msg, function () {
        var ret = _this.deletePolicy(_index)
        if(ret) {
          dialog.close();
          // _this.__listTable.refreshList();
          _this.query();
        }
      });
      break;
    default:

    }
    console.log("index:" + _index)
  },
  createPolicy: function (data) {
    var ret = false;
    jQuery.ajax({
      url: aquapaas_host + "/aquapaas/rest/offering",
      type: "POST",
      async: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        "Accept": "application/json"
      }
    }).done(function () {
      ret = true;
    })
    return true;
  },
  updatePolicy: function (data) {
    var ret = false;
    jQuery.ajax({
      url: aquapaas_host + "/aquapaas/rest/offering/" + data.offering_id,
      type: "PUT",
      async: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        "Accept": "application/json"
      }
    }).done(function () {
      ret = true;
    })
    return true;
  },
  enablePolicy: function (index) {
    var ret = false,
      _this = this,
      data = _this._data[index];
    data.enable = true;
    jQuery.ajax({
      url: aquapaas_host + "/aquapaas/rest/offering/" + data.offering_id,
      type: "PUT",
      async: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        "Accept": "application/json"
      }
    }).done(function () {
      ret = true;
    })
    return true;
  },
  disablePolicy: function (index) {
    var ret = false,
      _this = this,
      data = _this._data[index];
    data.enable = false;
    jQuery.ajax({
      url: aquapaas_host + "/aquapaas/rest/offering/" + data.offering_id,
      type: "PUT",
      async: false,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(data),
      headers: {
        "Accept": "application/json"
      }
    }).done(function () {
      ret = true;
    })
    return true;
  },
  deletePolicy: function (index) {
    var ret = false,
      _this = this,
      data = _this._data[index];
    jQuery.ajax({
      url: aquapaas_host + "/aquapaas/rest/offering/" + data.offering_id,
      type: "DELETE",
      async: false,
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        "Accept": "application/json"
      }
    }).done(function () {
      ret = true;
    })
    return true;
  },
  alertDialog: function (context, callback) {
    var dialog = new PopupDialog({
      url: "content/productOffering/alert_dialog.html",
      width: 484,
      height: 266,
      context: this,
      callback: function () {
        //初始化文字
        jQuery(".dialog .body").html(context);
        //确定按钮事件绑定
        jQuery(".dialog .foot .btn.confirm").bind('click', function () {
            callback(function () {
              dialog.close();
            })
          })
          //取消按钮事件绑定
        jQuery(".dialog .foot .btn.cancel").bind('click', function () {
          dialog.close();
        })
      }
    })
    dialog.create();
    this.close = dialog.close;
  },
  policyDialog: function (type, index, cb) {
    var _this = productOffering,
      _self = this;
    var datePickerStyle = {
      borderColor: "#e4e4e4",
      width: "298px",
      height: "30px"
    }
    var calendarStyles = {
      width: 279,
      navTitleHeight: 25,
      navTitleBgColor: 'rgb(84,190,245)',
      datesViewHeight: 160,
      datesViewGridColor: 'rgb(226,226,226)',
      datesViewCellColor: 'rgb(254,254,254)',
      weekdaysHeight: 22,
      weekdaysColor: 'rgb(74,174,237)',
      currMonthColor: 'rgb(121,121,121)',
      nonCurrMonthColor: 'rgb(200,200,200)',
      align: 'right'
    }
    var cacheData = function () {
        var data = {};
        if(jQuery(".product_policy_dialog #policy_id").val()) {
          data.offering_id = jQuery(".product_policy_dialog #policy_id").val();
        }
        data.name = jQuery(".product_policy_dialog #name").val();
        if(_self._effectiveDate.jqDateInput.val() !== "") {
          data.effective_time = _self._effectiveDate.jqDateInput.val() + "T00:00:00+0800";
        }
        if(_self._expirationDate.jqDateInput.val() !== "") {
          data.expiration_time = _self._expirationDate.jqDateInput.val() + "T00:00:00+0800";
        }
        data.rule_asset = {
          tags: jQuery(".product_policy_dialog #asset_tags").val()
        };
        var extra = jQuery(".product_policy_dialog #asset_extra").val().split(",")
        if(extra.length == 3) {
          data.rule_asset.extra = []
          data.rule_asset.extra[0] = {}
          data.rule_asset.extra[0][extra[0]] = {}
          data.rule_asset.extra[0][extra[0]][extra[1]] = extra[2]
        }
        data.rule_user = {
          tags: jQuery(".product_policy_dialog #user_tags").val()
        }
        if(_self._allowCombo.getValue() == "true") {
          data.allow_repeat_purchase = true;
        } else {
          data.allow_repeat_purchase = false;
        }
        var purchase_options = [{
          price_currency: _self._priceCurrencyCombo.getValue(),
          ticket_lifetime_type: _self._ticketTypeCombo.getValue(),
          scope: "user:self"
      }];
        switch(_self._priceTypeCombo.getValue()) {
        case "fixed":
        case "minus":
          purchase_options[0]["price_type"] = _self._priceTypeCombo.getValue();
          purchase_options[0]["price"] = jQuery(".product_policy_dialog #discount").val();
          break;
        case "discount":
          purchase_options[0]["price_type"] = _self._priceTypeCombo.getValue();
          purchase_options[0]["discount"] = jQuery(".product_policy_dialog #discount").val();
          break;
        case "alt_price":
          purchase_options[0]["price_type"] = _self._priceTypeCombo.getValue();
          purchase_options[0]["alt_price_metadata_key"] = "alt_price";
          break;
        default:
        }
        if(_self._ticketTypeCombo.getValue() == "offering") {
          if(jQuery(".product_policy_dialog #ticket_num").val() !== "") {
            purchase_options[0]["ticket_lifetime"] = jQuery(".product_policy_dialog #ticket_num").val() + _self._ticketCombo.getValue();
          }
        }
        data.purchase_options = purchase_options.concat(_self.purchase_options_other || [])
        data.description = jQuery(".product_policy_dialog textarea[name=desc]").val();
        var enableLimit = _self._limitEnableCombo.getValue();
        if(enableLimit == "true") {
          data.limit_use_offering = true;
          data.limit_count = jQuery("#limit_count").val();
          data.limit_time_range = _self._limitTimeCombo.getValue() + _self._limitTimeUnitCombo.getValue();
          data.limit_from_natural_time = _self._limitOpenCombo.getValue();
          data.limit_total_count = jQuery("#limit_total_count").val();
          data.limit_time_range_count = jQuery("#limit_time_range_count").val();
        } else {
          data.limit_use_offering = false;
          data.limit_count = "";
          data.limit_time_range = "";
          data.limit_from_natural_time = "";
          data.limit_total_count = "";
          data.limit_time_range_count = "";
        }
        return data;
      }
      //检查数据合格性
    var checkDataValid = function () {
      var data = _self._data,
        ret = true;
      if(!data.name) {
        alert(i18n("PRODUCTOFFERING_DIALOG_VALID_NAME"));
        ret = false;
        return;
      }
      if(data.purchase_options[0].price_type == "fixed" || data.purchase_options[0].price_type == "minus") {
        if(data.purchase_options[0].price == "") {
          alert(i18n("PRODUCTOFFERING_DIALOG_VALID_PRICE"))
          ret = false;
          return;
        }
      }
      if(data.purchase_options[0].price_type == "discount") {
        if(data.purchase_options[0].discount == "") {
          alert(i18n("PRODUCTOFFERING_DIALOG_VALID_DISCOUNT"))
          ret = false;
          return;
        }
      }
      if(data.purchase_options[0].ticket_lifetime_type == "offering") {
        var ticket_msg = /([\d]+)([y|M|d|h|m])/.exec(data.purchase_options[0].ticket_lifetime);
        if(data.purchase_options[0].ticket_lifetime == "offering" && (ticket_msg == null || ticket_msg.length !== 3)) {
          alert(i18n("PRODUCTOFFERING_DIALOG_VALID_TICKET"))
          ret = false;
          return;
        }
      }
      if(jQuery(".product_policy_dialog #asset_extra").val() !== "" && typeof data.rule_asset.extra == "undefined") {
        alert(i18n("PRODUCTOFFERING_DIALOG_VALID_CONTENT"));
        ret = false;
        return;
      }
      return ret;
    }
    var initWidgets = function () {
      //绑定生效时间日期框
      _self._effectiveDate = new DatePicker({
        containerId: "effective_date_picker",
        editable: true,
        dateInputStyles: datePickerStyle,
        calendarStyles: calendarStyles
      });
      //绑定失效时间日期框
      _self._expirationDate = new DatePicker({
        containerId: "expiration_date_picker",
        editable: true,
        dateInputStyles: datePickerStyle,
        calendarStyles: calendarStyles
      });
      //允许重复购买下拉框
      _self._allowCombo = new newSelect("#allow_repeat_purchase", [{
          key: i18n("PRODUCTOFFERING_DIALOG_COMBO_PURCHASE_ALLOW"),
          value: "true"
        }, {
          key: i18n("PRODUCTOFFERING_DIALOG_COMBO_PURCHASE_NOTALLOW"),
          value: "false"
        }], {
          backgroundIMGStyle: 2,
          width: "100%",
          height: "30px",
          background: "#ffffff",
          selectbackground: "#ffffff"
        }, function () {})
        //价格单位下拉框
      _self._priceCurrencyCombo = new newSelect("#price_currency", [{
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICECURRENCY_RMB"),
        value: 'RMB'
        }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICECURRENCY_CREDIT"),
        value: 'credit'
        }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICECURRENCY_TICKET"),
        value: 'ticket_time'
        }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {});
      //价格类型下拉框
      _self._priceTypeCombo = new newSelect("#price_type", [{
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICETYPE_FIXED"),
        value: 'fixed'
        }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICETYPE_DISCOUNT"),
        value: 'discount'
        }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICETYPE_ALTPRICE"),
        value: 'alt_price'
        }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_PRICETYPE_MINUS"),
        value: 'minus'
        }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {
        var label = jQuery(".product_policy_dialog #discount").parent().find("label")
        switch(this.getValue()) {
        case "fixed":
        case "minus":
          label.html(i18n("PRODUCTOFFERING_DIALOG_LABEL_PRICE"))
          break;
        case "discount":
          label.html(i18n("PRODUCTOFFERING_DIALOG_LABEL_DISCOUNT"))
          break;
        case "alt_price":
          label.html(i18n("PRODUCTOFFERING_DIALOG_LABEL_ALTPRICE"))
          break;
        default:
        }
        // console.log(this.getValue());
      });
      //Ticket有效期类型下拉框
      _self._ticketTypeCombo = new newSelect("#ticket_type", [{
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_TYPE_OFFERING"),
        value: 'offering'
        }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_ASSET"),
        value: 'asset'
        }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {});
      //Ticket有效期下拉框
      _self._ticketCombo = new newSelect("#ticket", [{
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_LIFETIME_YEAR"),
        value: "y"
      }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_LIFETIME_MONTH"),
        value: "M"
      }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_LIFETIME_DAY"),
        value: "d"
      }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_LIFETIME_HOUR"),
        value: "h"
      }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_LIFETIME_MINUTE"),
        value: "m"
      }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {});
      //配额周期下拉框-时间
      var array_month = [];
      for(var i = 1; i <= 12; i++) {
        array_month.push({
          key: i,
          value: i
        })
      }
      _self._limitTimeCombo = new newSelect("#limit_time_range_num", array_month, {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff",
        ScrollBarHeight: "128px"
      }, function () {});
      //配额周期下拉框-单位
      _self._limitTimeUnitCombo = new newSelect("#limit_time_range_unit", [{
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_LIFETIME_YEAR"),
        value: "y"
      }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_LIFETIME_MONTH"),
        value: "M"
      }, {
        key: i18n("PRODUCTOFFERING_DIALOG_COMBO_TICKET_LIFETIME_WEEK"),
        value: "w"
      }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {});
      //是否立刻开通
      _self._limitOpenCombo = new newSelect("#limit_from_natural_time", [{
        key: i18n("PRODUCTOFFERING_DIALOG_YES"),
        value: "false"
      }, {
        key: i18n("PRODUCTOFFERING_DIALOG_NO"),
        value: "true"
      }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {});
      //是否启用
      _self._limitEnableCombo = new newSelect("#limit_use_offering", [{
        key: i18n("PRODUCTOFFERING_DIALOG_YES"),
        value: "true"
      }, {
        key: i18n("PRODUCTOFFERING_DIALOG_NO"),
        value: "false"
      }], {
        backgroundIMGStyle: 2,
        width: "100%",
        height: "30px",
        background: "#ffffff",
        selectbackground: "#ffffff"
      }, function () {});
    }
    var updateFrameStatus = function (type) {
      //初始化按钮状态以及页面文字
      switch(type) {
      case "create":
        jQuery(".foot .btn.update").hide();
        jQuery(".foot .btn.back").hide();
        jQuery(".foot .btn.cancel").show();
        jQuery(".foot .btn.confirm").show();
        jQuery(".product_policy_dialog  .logo").html(i18n("PRODUCTOFFERING_DIALOG_TITLE_CREATE"))
        break;
      case "view":
        jQuery(".foot .btn.update").hide();
        jQuery(".foot .btn.cancel").hide();
        jQuery(".foot .btn.confirm").hide();
        jQuery(".foot .btn.back").show();
        jQuery(".product_policy_dialog  .logo").html(i18n("PRODUCTOFFERING_DIALOG_TITLE_VIEW"))
        break;
      case "edit":
        jQuery(".foot .btn.back").hide();
        jQuery(".foot .btn.confirm").hide();
        jQuery(".foot .btn.update").show();
        jQuery(".foot .btn.cancel").show();
        jQuery(".product_policy_dialog  .logo").html(i18n("PRODUCTOFFERING_DIALOG_TITLE_EDIT"))
        break;
      default:

      }
    }
    var loadData = function (data) {
      jQuery(".product_policy_dialog #policy_id").val(data.offering_id || "");
      jQuery(".product_policy_dialog #name").val(data.name || "");
      _self._effectiveDate.jqDateInput.val(convertTimeString(data.effective_time).split(" ")[0] || "")
      _self._expirationDate.jqDateInput.val(convertTimeString(data.expiration_time).split(" ")[0] || "")
      jQuery(".product_policy_dialog #asset_tags").val(data.rule_asset && data.rule_asset.tags || "");
      var extra = [];
      if(data.rule_asset&&data.rule_asset.extra) {
        for(var item in data.rule_asset.extra[0]) {
          if(data.rule_asset.extra[0].hasOwnProperty(item)) {
            extra.push(item);
            for(var jtem in data.rule_asset.extra[0][item]) {
              if(data.rule_asset.extra[0][item].hasOwnProperty(jtem)) {
                extra.push(jtem);
                extra.push(data.rule_asset.extra[0][item][jtem])
              }
            }
          }
        }
      }
      jQuery(".product_policy_dialog #asset_extra").val(extra.join(","));
      jQuery(".product_policy_dialog #user_tags").val(data.rule_user && data.rule_user.tags || "");
      if(data.allow_repeat_purchase == true) {
        _self._allowCombo.setValue("true")
      } else {
        _self._allowCombo.setValue("false");
        // _self._allowCombo.setValue(data.allow_repeat_purchase || "false")
      }
      var purchase_options;
      var purchase_options_other = [];
      for(var i = 0; i < data.purchase_options.length; i++) {
        if(data.purchase_options[i].scope == "user:self") {
          if(!purchase_options) {
            purchase_options = data.purchase_options[i]
          } else {
            purchase_options_other.push(data.purchase_options[i])
          }
        } else {
          purchase_options_other.push(data.purchase_options[i])
        }
      }
      _self.purchase_options_other = purchase_options_other;
      if(purchase_options) {
        _self._priceCurrencyCombo.setValue(purchase_options.price_currency || "")
        _self._priceTypeCombo.setValue(purchase_options.price_type || "")
        jQuery(".product_policy_dialog #discount").val(purchase_options.discount || purchase_options.price)
        _self._ticketTypeCombo.setValue(purchase_options.ticket_lifetime_type || "")
        var lifetime = /([\d]+)([y|M|d|h|m])/.exec(purchase_options.ticket_lifetime || "")
        if(lifetime && lifetime.length == 3) {
          jQuery(".product_policy_dialog #ticket_num").val(lifetime[1]);
          _self._ticketCombo.setValue(lifetime[2])
        }
      }
      jQuery(".product_policy_dialog textarea[name=desc]").val(data.description || "");
      //限次
      jQuery("#limit_count").val(data.limit_count || "");
      if(data.limit_time_range) {
        var limitTime = /([\d]+)([y|M|w])/.exec(data.limit_time_range)
        _self._limitTimeCombo.setValue(limitTime[1])
        _self._limitTimeUnitCombo.setValue(limitTime[2])
      }
      _self._limitEnableCombo.setValue((typeof data.limit_use_offering !== "undefined" ? data.limit_use_offering : false) + "");
      _self._limitOpenCombo.setValue((typeof data.limit_from_natural_time !== "undefined" ? data.limit_from_natural_time : true) + "");
      jQuery("#limit_total_count").val(data.limit_total_count || "");
      jQuery("#limit_time_range_count").val(data.limit_time_range_count || "");
    }
    var switchDialogDisableStatus = function (disabled) {
      if(disabled) {
        jQuery(".product_policy_dialog #name").attr("disabled", true);
        _self._effectiveDate.disable();
        _self._expirationDate.disable();
        jQuery(".product_policy_dialog #asset_tags").attr("disabled", true);
        jQuery(".product_policy_dialog #asset_extra").attr("disabled", true);
        jQuery(".product_policy_dialog #user_tags").attr("disabled", true);
        _self._allowCombo.setDisable();
        _self._priceCurrencyCombo.setDisable();
        _self._priceTypeCombo.setDisable();
        jQuery(".product_policy_dialog #discount").attr("disabled", true);
        _self._ticketTypeCombo.setDisable();
        jQuery(".product_policy_dialog #ticket_num").attr("disabled", true);
        _self._ticketCombo.setDisable();
        jQuery(".product_policy_dialog textarea").attr("disabled", true);
        //限次
        jQuery(".product_policy_dialog #limit_count").attr("disabled", true);
        jQuery(".product_policy_dialog #limit_total_count").attr("disabled", true);
        jQuery(".product_policy_dialog #limit_time_range_count").attr("disabled", true);
        _self._limitTimeCombo.setDisable();
        _self._limitTimeUnitCombo.setDisable();
        _self._limitOpenCombo.setDisable();
        _self._limitEnableCombo.setDisable();
      } else {
        jQuery(".product_policy_dialog #name").attr("disabled", null);
        _self._effectiveDate.enable();
        _self._expirationDate.enable();
        jQuery(".product_policy_dialog #asset_tags").attr("disabled", null);
        jQuery(".product_policy_dialog #asset_extra").attr("disabled", null);
        jQuery(".product_policy_dialog #user_tags").attr("disabled", null);
        _self._allowCombo.setAvailable();
        _self._priceCurrencyCombo.setAvailable();
        _self._priceTypeCombo.setAvailable();
        jQuery(".product_policy_dialog #discount").attr("disabled", null);
        _self._ticketTypeCombo.setAvailable();
        jQuery(".product_policy_dialog #ticket_num").attr("disabled", null);
        _self._ticketCombo.setAvailable();
        jQuery(".product_policy_dialog textarea").attr("disabled", null);
        //限次
        jQuery(".product_policy_dialog #limit_count").attr("disabled", null);
        jQuery(".product_policy_dialog #limit_total_count").attr("disabled", null);
        jQuery(".product_policy_dialog #limit_time_range_count").attr("disabled", null);
        _self._limitTimeCombo.setAvailable();
        _self._limitTimeUnitCombo.setAvailable();
        _self._limitOpenCombo.setAvailable();
        _self._limitEnableCombo.setAvailable();
      }
    }
    var bindBtnEvents = function () {
      //确定按钮事件绑定
      jQuery(".product_policy_dialog .foot .btn.confirm,.product_policy_dialog .foot .btn.update").unbind().bind('click', function () {
          _self._data = cacheData();
          if(checkDataValid()) {
            cb(function () {
              _self.close();
            })
          }
        })
        //取消按钮事件绑定
      jQuery(".product_policy_dialog .foot .btn.cancel, .product_policy_dialog .foot .btn.back").unbind().bind('click', function () {
        _self.close();
      });
    }
    var callback;
    switch(type) {
    case "create":
      callback = function () {
        if(!_self._isinited) {
          initWidgets();
        }
        bindBtnEvents();
        switchDialogDisableStatus(false);
        loadData({purchase_options:[]});
        _self._isinited = true;
      }
      break;
    case "view":
      var data = _this._data[index];
      callback = function () {
        if(!_self._isinited) {
          initWidgets();
        }
        bindBtnEvents();
        switchDialogDisableStatus(true);
        loadData(data);
        _self._isinited = true;
      }
      break;
    case "edit":
      var data = _this._data[index];
      callback = function () {
        if(!_self._isinited) {
          initWidgets();
        }
        bindBtnEvents();
        switchDialogDisableStatus(false);
        loadData(data);
        _self._isinited = true;
      }
      break;
    default:

    }
    // var dialog = new PopupDialog({
    //   url: "content/productOffering/product_policy_dialog.html",
    //   width: 760,
    //   height: 712,
    //   context: _self,
    //   callback: callback
    // })
    // dialog.create();
    // this.close = dialog.close;
    callback();
    updateFrameStatus(type);
    this.show = function () {
      jQuery(".product_policy_dialog").show();
      jQuery(".product_offering .main_page").hide();
    };
    this.close = function () {
      jQuery(".product_policy_dialog").hide();
      jQuery(".product_offering .main_page").show();
    }
    this.show();
    return this;
  }
};
