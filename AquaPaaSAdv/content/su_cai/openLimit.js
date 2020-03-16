(($, Dialog, content) => {
  var dialogContentURL = "",
    dialogHeight = "",
    dialogWidth = "",
    afterDrawn, dialog, _that = this,
    dialogTitle, dialogContext, confirmCB;
  dialogContentURL = "content/su_cai/openLimit.html";
  dialogHeight = 254;
  dialogWidth = 480;
  afterDrawn = () => {
    $(".title_content").html(dialogTitle);
    $("._dialog_body").html(dialogContext);
    $(".cancel").bind("click", () => {
      dialog.close();
    });
    $(".confirm").bind("click", () => {
      dialog.close();
      confirmCB();
    });
    $("._dialog_win_close").bind("click", () => {
      dialog.close();
    });
  };
  var win = {
    openLimit: {
      init: function ({
        title = "", content = "", callback = () => {}
      } = {}) {
        dialogTitle = title;
        dialogContext = content;
        confirmCB = callback;
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
  }
  $.extend(content, win)
})(jQuery, PopupDialog, sucai)
