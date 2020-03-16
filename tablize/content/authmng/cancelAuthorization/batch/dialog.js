var cancelAuthoBatch_dialog = (function ($, Dialog, Combo, TimeSelector) {
  let Data = {
      smartcardId: []
    },
    callback;
  let Pane = {
    dialog: null,
    widget: {},
    init() {
      this.initDialog();
    },
    initDialog() {
      let callback = () => {
        this.initWidgets();
        this.bindEvents();
        this.loadData();
      }
      this.dialog = new Dialog({
        url: "content/authmng/cancelAuthorization/batch/query.html",
        height: 460,
        width: 453,
        context: this,
        callback: callback
      });
      this.dialog.create();
    },
    initWidgets() {
      let date_range_array = [{
        label: i18n("CANCELAUTHORIZATION_ONEMONTHS"),
        value: "1"
      }, {
        label: i18n("CANCELAUTHORIZATION_TWOMONTHS"),
        value: "2"
      }, {
        label: i18n("CANCELAUTHORIZATION_THREEMONTHS"),
        value: "3"
      }, {
        label: i18n("CANCELAUTHORIZATION_SIXMONTHS"),
        value: "6"
      }, {
        label: i18n("CANCELAUTHORIZATION_ONEYEAR"),
        value: "12"
      }]
      this.widget.date_range = new Combo({
        containerId: "cancelAuthoBatch_date_range",
        options: [{
          label: i18n("AUTH_MNG_DIALOG_SELFDEFINE"),
          value: ""
        }],
        styles: {
          optionHeight: '28px',
          iconColor: "#2ea2d7"
        }
      });
      this.widget.date_range.onChange = function (selector) {
        if(selector.value !== i18n("CANCELAUTHORIZATION_DIY")) {
          var _cur_date = new Date();
          Data.endDate = _cur_date.getFullYear() + "-" + API.zerolize(_cur_date.getMonth() + 1, 2) + "-" + API.zerolize(_cur_date.getDate(), 2);
          var _begin_d = new Date(_cur_date);
          _begin_d.setMonth(_begin_d.getMonth() - Number(selector.value));
          Data.startDate = _begin_d.getFullYear() + "-" + API.zerolize(_begin_d.getMonth() + 1, 2) + "-" + API.zerolize(_begin_d.getDate(), 2);
        }
      };
      this.widget.date_range.create();
      this.widget.date_range.disable();
      //开始日期，结束日期
      let calendarStyles = {
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
      this.widget.date_start = new TimeSelector({
        containerId: 'cancelAuthoBatch_date_start',
        calendarStyles: calendarStyles,
        dateInputStyles: {
          borderColor: '#d3d3d3'
        },
        iconImage: 'images/smallCalendarIcon.png'
      });
      this.widget.date_start.onChange = function () {
        var datestr = this.getDateStr();
        Data.startDate = datestr;
      }
      this.widget.date_end = new TimeSelector({
        containerId: 'cancelAuthoBatch_date_end',
        calendarStyles: calendarStyles,
        dateInputStyles: {
          borderColor: '#d3d3d3'
        },
        iconImage: 'images/smallCalendarIcon.png'
      });
      this.widget.date_end.onChange = function () {
        var datestr = this.getDateStr();
        Data.endDate = datestr;
      };
      this.widget.type_combo = new Combo({
        containerId: "cancelAuthoBatch_type_range",
        options: [{
          label: "asset",
          value: "asset"
    			}, {
          label: "bundle",
          value: "bundle"
    			}, {
          label: "product",
          value: "product"
    			}],
        styles: {
          optionHeight: '28px',
          iconColor: "#2ea2d7"
        }
      });
      this.widget.type_combo.onChange = function (selector) {
        Data.type = selector.value;
      }
      this.widget.type_combo.create();
      $(".query_dialog_cancelAuthoBatch ._dialog_body #cancelAuthoBatch_self_define").bind("click", (e) => {
        let value = $(e.target).html();
        if(value == i18n("AUTH_MNG_DIALOG_SELFDEFINE")) {
          $(e.target).html(i18n("AUTH_MNG_DIALOG_CANCELSELFDEFINE"));
          this.widget.date_range.updateOptions([{
            label: i18n("CANCELAUTHORIZATION_DIY"),
            value: ""
            }]);
          this.widget.date_range.setValue("");
          this.widget.date_range.disable();
          $("#cancelAuthoBatch_date_start").parent("._dialog_row").show();
          $("#cancelAuthoBatch_date_end").parent("._dialog_row").show();
          $(".query_dialog_cancelAuthoBatch").removeClass("_dialog_center")
        } else {
          $(e.target).html(i18n("AUTH_MNG_DIALOG_SELFDEFINE"));
          this.widget.date_range.updateOptions(date_range_array);
          this.widget.date_range.setValue(date_range_array[0].value);
          this.widget.date_range.enable();
          $("#cancelAuthoBatch_date_start").parent("._dialog_row").hide();
          $("#cancelAuthoBatch_date_end").parent("._dialog_row").hide();
          $(".query_dialog_cancelAuthoBatch").addClass("_dialog_center")
        }
      });
    },
    bindEvents() {
      $(".query_dialog_cancelAuthoBatch ._dialog_foot ._query").bind("click", () => {
        Pane.dialog.close();
        callback && callback(Data);
      });
      $(".query_dialog_cancelAuthoBatch ._dialog_title ._dialog_close").bind("click", () => {
        Pane.dialog.close();
      });
      $(".query_dialog_cancelAuthoBatch ._dialog_foot ._btn._cancel").bind("click", () => {
        Pane.dialog.close();
      });
      $(".query_dialog_cancelAuthoBatch ._dialog_body #cancelAuthoBatch_app_key").bind("blur", (e) => {
        Data.appKey = $(e.target).val();
      });
      // $("._dialog_body #smartcard_id").bind("blur", (e) => {
      //   Data.smartcardId = $(e.target).val();
      // });
      $(".query_dialog_cancelAuthoBatch ._dialog_body ._btn._add").bind("click", (e) => {
        let _exist = false;
        let _val = $(".query_dialog_cancelAuthoBatch ._dialog_body #cancelAuthoBatch_smartcard_id").val();
        for(var i = 0; i < Data.smartcardId.length; i++) {
          let item = Data.smartcardId[i];
          if(item == _val) {
            _exist = true;
          }
        }
        if(!_exist) {
          Data.smartcardId.push(_val);
        }
        Data.smartcardId = Data.smartcardId.join(",").replace(/^,|,$/g, "").replace(/,+/g, ",").split(",")
        this.loadSmartCard(Data.smartcardId);
         $(".query_dialog_cancelAuthoBatch ._dialog_body #cancelAuthoBatch_smartcard_id").val("");
      });
      $(".query_dialog_cancelAuthoBatch ._dialog_body ._table").on("click", "._table_cell[name=del]", (e) => {
        let _exist = false;
        let _val = $(e.target).data("id");
        for(var i = 0; i < Data.smartcardId.length; i++) {
          let item = Data.smartcardId[i];
          if(item == _val) {
            delete Data.smartcardId[i];
          }
        }
        Data.smartcardId = Data.smartcardId.join(",").replace(/^,|,$/g, "").replace(/,+/g, ",").split(",");
        this.loadSmartCard(Data.smartcardId);
      });
    },
    loadData() {
      this.widget.date_start.jqDateInput.val(Data.startDate);
      this.widget.date_end.jqDateInput.val(Data.endDate);
      this.widget.type_combo.setValue(Data.type);
      $(".query_dialog_cancelAuthoBatch #cancelAuthoBatch_app_key").val(Data.appKey);
      this.loadSmartCard(Data.smartcardId);
    },
    loadSmartCard(data) {
      let ctn = $(".query_dialog_cancelAuthoBatch ._dialog_body ._table ._table_body").empty();
      for(var i = 0; i < Math.max(Math.ceil(data.length / 2), 1); i++) {
        let item_1 = data[2 * i]
        let item_2 = data[2 * i + 1]
        let row = $("<div class='_table_row'></div>");
        if(item_1 && item_1 !== "") {
          row.append("<div class='_table_cell'>" + item_1 + "</div><div class='_table_cell' name='del' data-id='" + item_1 + "'>删除</div>")
        } else {
          row.append("<div class='_table_cell'></div><div class='_table_cell'></div>")
        }
        if(item_2 && item_2 !== "") {
          row.append("<div class='_table_cell'>" + item_2 + "</div><div class='_table_cell' name='del' data-id='" + item_2 + "'>删除</div>")
        } else {
          row.append("<div class='_table_cell'></div><div class='_table_cell'></div>")
        }
        ctn.append(row);
      }
    }
  };
  let API = {
    zerolize(num, len) {
      var ret = "";
      if(typeof num == "number") {
        ret = num + "";
      } else if(typeof num == 'string') {
        ret = num
      }
      ret = ret.padStart(len, "0");
      return ret;
    }
  };
  let Models = {};
  return {
    init(data = Data, cb) {
      Data = data;
      Pane.init();
      callback = cb;
    }
  }
})(jQuery, PopupDialog, StyledSelector, DatePicker)
