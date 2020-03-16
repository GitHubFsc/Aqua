var adjust_index = (function($, Dialog){
  let Pane = {
    dialog: null,
    init() {
      this.initDialog();
    },
    initDialog(){
      var callback = () => {
        this.bindEvents();
      }
      this.dialog = new Dialog({
        url: "content/navigation/adjust_index.html",
        height: 232,
        width: 470,
        context: this,
        callback: callback
      });
      this.dialog.create();
    },
    bindEvents(){
      $('#navigation_adjust_index')
      .on('click', '._dialog_foot .btn._cancel', () => {
        this.dialog.close();
      })
      .on('click', '._dialog_foot .btn._confirm', () => {
        var data = {
            name: Model.tree_name,
            index: Model.getIndex()
          }
        API.adjust(data, () => {
          this.dialog.close();
          API.confirmFn && API.confirmFn();
        })
      })
    }
  };
  let API = {
    adjust(data, callback) {
      if(data.index == ''){
        alert(i18n('NAVIGATE_INDEXPLEASE'))
        return
      }
      let method = 'Put',
      url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + data.name + '/by_id:' + Model.id + '?updatefield=index&app_key=' + Model.app_key,
      putData = {
        index: parseInt(data.index)
      }
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(putData)
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
    }
  };
  let Model = {
    id: null,
    getIndex() {
      return $('#navigation_adjust_index_index').val();
    }
  };
  let a = function({id, app_key, tree_name, confirmFn}){
    Pane.dialog = API.confirmFn = Model.id = Model.app_key = Model.tree_name = null;
    Pane.init();
    API.confirmFn = confirmFn;
    Model.id = id;
    Model.app_key = app_key;
    Model.tree_name = tree_name;
  }
  return a;
})(jQuery, PopupDialog)
