var auth_dialog = (function ($, Dialog, Combo, TimeSelector) {
  let Data = {},
    callback;
  let Pane = {
    dialog: null,
    widget:{},
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
        url: "content/authmng/cancelAuthorization/single/query.html",
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
        containerId: "date_range",
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
        containerId: 'date_start',
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
        containerId: 'date_end',
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
        containerId: "type_range",
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
      $("._dialog_body #self_define").bind("click", (e) => {
        let value = $(e.target).html();
        if(value == i18n("AUTH_MNG_DIALOG_SELFDEFINE")) {
          $(e.target).html(i18n("AUTH_MNG_DIALOG_CANCELSELFDEFINE"));
          this.widget.date_range.updateOptions([{
            label: i18n("CANCELAUTHORIZATION_DIY"),
            value: ""
            }]);
          this.widget.date_range.setValue("");
          this.widget.date_range.disable();
          $("#date_start").parent("._dialog_row").show();
          $("#date_end").parent("._dialog_row").show();
          $("._dialog").removeClass("_dialog_center")
        } else {
          $(e.target).html(i18n("AUTH_MNG_DIALOG_SELFDEFINE"));
          this.widget.date_range.updateOptions(date_range_array);
          this.widget.date_range.setValue(date_range_array[0].value);
          this.widget.date_range.enable();
          $("#date_start").parent("._dialog_row").hide();
          $("#date_end").parent("._dialog_row").hide();
          $("._dialog").addClass("_dialog_center")
        }
      });
    },
    bindEvents() {
      $("._dialog_foot ._query").bind("click", () => {
        Pane.dialog.close();
        callback && callback(Data);
      });
      $("._dialog_title ._dialog_close").bind("click", () => {
        Pane.dialog.close();
      });
      $("._dialog_foot ._btn._cancel").bind("click", () => {
        Pane.dialog.close();
      });
      $("._dialog_body #app_key").bind("blur", (e) => {
        Data.appKey = $(e.target).val();
      });
      $("._dialog_body #smartcard_id").bind("blur", (e) => {
        Data.smartcardId = $(e.target).val();
      });
    },
    loadData(){
      this.widget.date_start.jqDateInput.val(Data.startDate);
      this.widget.date_end.jqDateInput.val(Data.endDate);
      this.widget.type_combo.setValue(Data.type);
      $("._dialog #app_key").val(Data.appKey);
      $("._dialog #smartcard_id").val(Data.smartcardId);
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
