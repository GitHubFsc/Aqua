var contract_delete = (function ($, Dialog) {
  let Data = {},
    closecCallback;
  let Pane = {
    dialog: null,
    init() {
      this.initDialog()
    },
    initDialog() {
      let opt = {
        url: 'content/contracts/contract_del.html',
        width: 480,
        height: 268,
        context: this,
        callback: function () {
          this.bindEvents();
        }
      }
      this.dialog = new Dialog(opt);
      this.dialog.create();
    },
    bindEvents() {
      let info = $(".contract ._dialog_body").html().replace("{{ID}}", Data.contract_id);
      $(".contract ._dialog_body").html(info);
      $(".contract ._dialog_foot .confirm._btn").bind("click", () => {
        API.deleteContract(() => {
          Pane.dialog.close();
          closecCallback && closecCallback();
        })
      });
      $(".contract ._dialog_foot .cancel._btn").bind("click", () => {
        Pane.dialog.close();
      });
    }
  };
  let API = {
    deleteContract(callback) {
      $.ajax({
        type:"Delete",
        url: paasHost+ paasAdvDomain + "/ads/contract/"+ Data.id+ "?user_id="+ my.paas.user_id,
        async: false,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).always((resp,status,xhr)=>{
        if (status == "success") {
          callback&&callback();
        }
      })
    }
  }
  return {
    init({
      data, closeFn
    } = {
      data: Data
    }) {
      Data = data
      closecCallback = closeFn;
      Pane.init();
    }
  }
})(jQuery, PopupDialog);
