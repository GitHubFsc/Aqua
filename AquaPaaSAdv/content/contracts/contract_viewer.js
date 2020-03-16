var contract_viewer = (function ($, Dialog) {
  let Data = {};
  let Pane = {
    dialog: null,
    init() {
      my_aqua.init(storage_username, storage_password, storage_domain);
      this.initDialog();
    },
    initDialog() {
      let opt = {
        url: 'content/contracts/contract_viewer.html',
        width: 760,
        height: 394,
        context: this,
        callback: function () {
          this.bindEvents();
        }
      }
      this.dialog = new Dialog(opt);
      this.dialog.create();
    },
    bindEvents() {
      let url = my_aqua.getDownloadFileURL(Data.contract_file_url);
      $(".contract #pdf_viewer").attr("src", url);
    }
  };
  return {
    init({
      data
    } = {
      data: Data
    }) {
      Data = data
      Pane.init();
    }
  }
})(jQuery, PopupDialog);
