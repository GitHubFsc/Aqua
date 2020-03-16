(function ($, Dialog, content) {
  var dialogContentURL = "",
    dialogHeight = "",
    dialogWidth = "",
    afterDrawn, _that = this,
    dialogTitle,dialogContext;
  dialogContentURL = "content/su_cai/alertDialog.html";
  dialogHeight = 254;
  dialogWidth = 480;
  afterDrawn = () => {
    $(".title_content").html(dialogTitle);
    $("._dialog_body").html(dialogContext);
    $(".cancel").bind("click", () => {
        dialog.close();
      });
    $("._dialog_win_close").bind("click", () => {
        dialog.close();
      });
    };
  $.extend(content, {
    alertDialog: {
      init: function ({title = "", text = ""}={}) {
        dialogTitle = title;
        dialogContext = text;
        dialog = new Dialog({
          url: dialogContentURL,
          width: dialogWidth,
          height: dialogHeight,
          context: this,
          callback: afterDrawn
        })
        dialog.create();
      }
    }
  });
})(jQuery, PopupDialog, sucai)
