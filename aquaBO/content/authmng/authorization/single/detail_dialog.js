var DetailDialog = (function ($, Dialog) {
  let Data = {
    device_id: "",
    ticket_id: "",
    asset_id: "",
    bundle_id: "",
    product_id: "",
    create_time: "",
    effective_time: "",
    expire_time: "",
    state: ""
  }
  let Pane = {
    init() {
        this.initDialog();
        this.loadData();
      },
      initDialog() {
        let callback = () => {
          $("._dialog_foot ._btn._cancel").bind("click", () => {
            dialog.close();
          });
          $("._dialog_title ._dialog_close").bind("click", () => {
            dialog.close();
          });
          this.loadData();
        }
        let dialog = new Dialog({
          url: "content/authmng/authentication/single/detail.html",
          context: this,
          height: 525,
          width: 700,
          callback: callback
        });
        dialog.create();
      },
      loadData() {
        $("._dialog_body input#card_id").val(Data.user_id);
        $("._dialog_body input#ticket_id").val(Data.ticket_id);
        $("._dialog_body input#asset_type").val(Data.asset_type);
        $("._dialog_body input#asset_id").val(Data.asset_id);
        $("._dialog_body input#app_key").val(Data.app_key);
        $("._dialog_body input#product_id").val(Data.product_id);
        $("._dialog_body input#bundle_id").val(Data.bundle_id);
        $("._dialog_body input#home_id").val(Data.home_id);
        $("._dialog_body input#effective_time").val(API.convertTimeString(Data.effective_time));
        $("._dialog_body input#expire_time").val(API.convertTimeString(Data.expire_time));
        $("._dialog_body input#create_time").val(API.convertTimeString(Data.create_time));
        $("._dialog_body input#state").val(i18n("AUTH_MNG_DIALOG_DETAIL_STATE_"+Data.state.toUpperCase()));
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
