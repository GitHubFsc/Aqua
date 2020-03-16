var CancelAuthoBatchDetailDialog = (function ($, Dialog) {
  let Data = {
    device_id: "",
    ticket_id: "",
    asset_id: "",
    order_id: "",
    create_time: "",
    effective_time: "",
    expire_time: "",
    event_time: "",
    delete_type: "",
    state: ""
  }
  let Pane = {
    init() {
      this.initDialog();
      this.loadData();
    },
    initDialog() {
      let callback = () => {
        $("._dialog_cancelAuthoBatch ._dialog_foot ._btn._cancel").bind("click", () => {
          dialog.close();
        });
        $("._dialog_cancelAuthoBatch ._dialog_title ._dialog_close").bind("click", () => {
          dialog.close();
        });
        this.loadData();
      }
      let dialog = new Dialog({
        url: "content/authmng/cancelAuthorization/batch/detail.html",
        context: this,
        height: 525,
        width: 700,
        callback: callback
      });
      dialog.create();
    },
    loadData() {
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_card_id").val(Data.user_id);
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_ticket_id").val(Data.ticket_id);
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_asset_type").val(Data.asset_type);
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_asset_id").val(Data.asset_id);
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_app_key").val(Data.app_key);
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_order_id").val(Data.order_id);
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_home_id").val(Data.home_id);
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_effective_time").val(API.convertTimeString(Data.effective_time));
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_expire_time").val(API.convertTimeString(Data.expire_time));
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_create_time").val(API.convertTimeString(Data.create_time));
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_state").val(i18n("AUTH_MNG_DIALOG_DETAIL_STATE_"+Data.state.toUpperCase()));
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_event_time").val(API.convertTimeString(Data.event_time));
      $("._dialog_cancelAuthoBatch ._dialog_body input#cancelAuthoBatch_delete_type").val(Data.delete_type);
    }
  };
  let API = {
    convertTimeString(str) {
      var ret = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|([+-])(\d{2})(\d{2})?)/.exec(str);
      if(ret) {
        var tmpYear = Number(ret[1]);
        var tmpMonth = Number(ret[2]) - 1;
        var tmpDate = Number(ret[3]);
        var tmpHours = Number(ret[4]);
        var tmpMins = Number(ret[5]);
        var tmpSecs = Number(ret[6]);
        var tmpTimeInMyZone = new Date(tmpYear, tmpMonth, tmpDate, tmpHours, tmpMins, tmpSecs);

        var myZoneOffset = tmpTimeInMyZone.getTimezoneOffset();
        var origZoneOffset = 0;
        if(ret[7] != 'Z') {
          origZoneOffset = Number(ret[9]) * 60 + (ret[10] ? Number(ret[10]) : 0);
          if(ret[8] == '+') {
            origZoneOffset = 0 - origZoneOffset;
          }
        }
        var origToMyOffset = origZoneOffset - myZoneOffset;
        var timeMillSecs = tmpTimeInMyZone.getTime() + origToMyOffset * 60 * 1000;
        var timeInMyZone = new Date(timeMillSecs);

        var myZoneStr = '';
        var year = timeInMyZone.getFullYear();
        var month = timeInMyZone.getMonth();
        var date = timeInMyZone.getDate();
        var hours = timeInMyZone.getHours();
        var mins = timeInMyZone.getMinutes();
        var secs = timeInMyZone.getSeconds();

        myZoneStr += year;
        myZoneStr += '-';
        myZoneStr += month > 8 ? month + 1 : '0' + (month + 1);
        myZoneStr += '-';
        myZoneStr += date > 9 ? date : '0' + date;
        myZoneStr += ' ';
        myZoneStr += hours > 9 ? hours : '0' + hours;
        myZoneStr += ':';
        myZoneStr += mins > 9 ? mins : '0' + mins;
        myZoneStr += ':';
        myZoneStr += secs > 9 ? secs : '0' + secs;

        return myZoneStr;
      }
      return '';
    }
  }
  let Models = {}
  return {
    init(data = Data) {
      Data = data;
      Pane.init();
    }
  }
})(jQuery, PopupDialog)
