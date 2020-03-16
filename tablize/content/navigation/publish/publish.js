((function(global, factory) {
  global.NavPublishSet = factory(jQuery, newSelect, DatePicker, OverlayDialog)
})(this, (function($, Combo, Timer, Dialog) {
  var dialog = function(opts) {
    var pane = $.extend(true, {}, Pane)
    var api = $.extend(true, {}, API)
    var model = $.extend(true, {}, Model)
    pane.init(opts);
  }
  var Pane = {
    init({id}) {
      var dialog = this.initDialog({id})
      dialog.create();
      var widgets = this.initWidgets({id})
      this.bindEvents({dialog, widgets})
    },
    initDialog({id}) {
      var dom = `<div class='_dialog' id='${id}'>
        <style>
          label.hint {margin: 0 5px 0 0;}
          .select-status .select-header {background-image:none;text-indent: 0px;}
          .calendar-nav-title,.calendar-dates-view {z-index: 10}
        </style>
        <div class='_dialog_title'>
          <div class='_dialog_title_label'>${i18n('NAVIGATIONPUBLISH_TABLE_OP_PUBLISHTIME')}</div>
          <div class='_dialog_span'></div>
          <div class='_dialog_close'></div>
        </div>
        <div class='_dialog_body _dialog_span' style='margin: 19px 34px;flex-flow: column;display: flex;justify-content: space-evenly;'>
          <div class='_dialog_row'>
            <label>发布日期：</label>
            <div id='${id}_date'></div>
          </div>
          <div class='_dialog_row'>
            <label>发布时间：</label>
            <div id='${id}_hour'></div>
            <label class='hint'>${i18n('ASSET_UNIT_HOUR')}</label>
            <div id='${id}_minute'></div>
            <label class='hint'>${i18n('ASSET_UNIT_MINUTE')}</label>
            <div id='${id}_second'></div>
            <label class='hint'>${i18n('ASSET_UNIT_SECOND')}</label>
          </div>
        </div>
        <div class='_dialog_foot'>
          <div class='btn cancel'>${i18n('DIALOG_CANCEL')}</div>
          <div class='btn confirm'>${i18n('DIALOG_PUBLISH')}</div>
        </div>
      </div>`;
      var dialog = new Dialog({
        id: id,
        content: dom,
        width: 452,
        height: 247,
        local: true,
        callback: () => {
          console.log('dialog inited');
        }
      })
      return dialog
    },
    initWidgets({id}) {
      var date = new Timer({
        containerId: id + '_date',
        calendarStyles: {
          width: 190,
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
        },
        dateInputStyles: {
          borderColor: '#e2e2e2',
          borderWidth: '1px',
          borderRadius: '0px',
          width: '143px',
          height: 30
        },
        iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
        iconStyle: {
          left: 115
        },
        editable: true
      })
      var comboStyle = {
        width: 65,
        height: 30,
        background: '#ffffff',
        selectbackground: '#ffffff',
        disablebackground: '#ffffff',
        ScrollBarHeight: 90
      }
      var hour = new Combo('#' + id + '_hour', Array.apply(null, {length: 24}).map((item, index) => {
        return {
          key: String(index).padStart(2, '0'),
          value: String(index).padStart(2, '0')
        }
      }), comboStyle, ()=>{})
      var minute = new Combo('#' + id + '_minute', Array.apply(null, {length: 60}).map((item, index) => {
        return {
          key: String(index).padStart(2, '0'),
          value: String(index).padStart(2, '0')
        }
      }), comboStyle)
      var second = new Combo('#' + id + '_second', Array.apply(null, {length: 60}).map((item, index) => {
        return {
          key: String(index).padStart(2, '0'),
          value: String(index).padStart(2, '0')
        }
      }), comboStyle)
      return {date, hour, minute, second}
    },
    bindEvents({dialog, widgets}) {
      var {date, hour, minute, second} = widgets;
      $('#' + dialog.dialogId)
      .on('click', '._dialog_foot .btn.cancel', ({currentTarget, target}) => {
        if (currentTarget == target) {
          dialog.close()
        }
      })
      .on('click', '._dialog_foot .btn.confirm', ({currentTarget, target}) => {
        if (currentTarget == target) {
          console.log('time:',[date.inputDateStr, hour.getValue(), minute.getValue(), second.getValue()].join(','));
          dialog.close();
        }
      })
    }
  };
  var API = {}
  var Model = {}
  return dialog;
})))
