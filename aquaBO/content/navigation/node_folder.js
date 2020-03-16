var node_folder = (function($, Table){
  let Pane = {
    init(el){
      this.initFrame(el);
      this.initTable();
      this.bindEvents();
    },
    initFrame(el){
      var dom = `<div id='folder_list' class='list_table'></div>`;
      $(el).empty().append($(dom));
    },
    initTable(){
      let title = [{
        label: ''
          }, {
        label: i18n('NAVIGATE_CREATE_FOLDER_FOLDERNAME')
          }, {
        label: i18n('NAVIGATE_EDITOR_SHELFSTATUS')
          }, {
        label: i18n('NAVIGATE_EDITOR_FOLDERTITLE')
          }, {
        label: i18n('NAVIGATE_EDITOR_OPR')
          }];
      let style = {
        borderColor: "#E2E2E2",
        borderWidth: 1,
        titleBg: "#45d1f4",
        titleColor: "#FFFFFF",
        titleHeight: 31,
        cellBg: "white",
        evenBg: "#F5FDFF",
        cellColor: "#797979",
        cellHeight: 34,
        footBg: "#FFFFFF",
        footColor: "#797979",
        inputBg: "#FFFFFF",
        inputBorder: "1px solid #CBCBCB",
        iconColor: "#0099CB",
        columnsWidth: [0.05, 0.26, 0.16, 0.24, 0.29]
      }
      Pane.table = new Table({
        containerId: "folder_list",
        rows: 11,
        columns: 5,
        titles: title,
        styles: style,
        listType: 0,
        data: []
      });
      Pane.table.create();
      API.getNode();
    },
    bindEvents(){
      $('#folder_list.list_table')
      .on('click', '[name=on]', ({currentTarget, target}) => {
        if (target == currentTarget) {
          var index = $(currentTarget).data('index');
          var data = Model.data[index];
          var dialog = new AlertDialog({
            message: i18n('NAVIGATE_EDITOR_SHELFONINFO').replace(/{{}}/, data.name),
            confirmFn: (callback) => {
              API.on(data, () => {
                callback && callback();
                API.getNode()
                API.confirmFn && API.confirmFn();
              })
            }
          })
        }
      })
      .on('click', '[name=off]', ({currentTarget, target}) => {
        if (target == currentTarget) {
          var index = $(currentTarget).data('index');
          var data = Model.data[index];
          var dialog = new AlertDialog({
            message: i18n('NAVIGATE_EDITOR_SHELFOFFINFO').replace(/{{}}/, data.name),
            confirmFn: (callback) => {
              API.off(data, () => {
                callback && callback();
                API.getNode()
                API.confirmFn && API.confirmFn();
              })
            }
          })
        }
      })
      .on('click', '[name=order]', ({currentTarget, target}) => {
        if (target == currentTarget) {
          var index = $(currentTarget).data('index');
          var data = Model.data[index];
          var dialog = new adjust_index({
            tree_name: Model.tree.name,
            id: data.id,
            app_key: Model.tree.creator_app_key,
            confirmFn: () => {
              API.getNode();
              API.confirmFn && API.confirmFn();
            }
          })
        }
      })
      .on('click', '[name=del]', ({currentTarget, target}) => {
        if (target == currentTarget) {
          var index = $(currentTarget).data('index');
          var data = Model.data[index];
          var dialog = new AlertDialog({
            message: i18n('NAVIGATE_EDITOR_DELETEINFO') + i18n('NAVIGATE_EDITOR_DELHIT').replace(/{{}}/, data.name),
            confirmFn: (callback) => {
              API.delete(data, () => {
                callback && callback();
                API.getNode()
                API.confirmFn && API.confirmFn();
              })
            }
          })
        }
      })
    }
  };
  let API = {
    getNode() {
      let {name, creator_app_key} = Model.tree,
          {id} = Model.parentNode,
          method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/by_id:' + id,
          urlParam = [];
      urlParam.push('children=1')
      urlParam.push('enable=all')
      urlParam.push('app_key=' + creator_app_key)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('tree_version=00');
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          Pane.table.update(Model.folder(resp.children.filter(item => item.node_class == 'folder')));
        }
      })
    },
    on(data, callback) {
      let {name, creator_app_key} = Model.tree,
          {id} = data,
          method = 'Put',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/toggle/visible?node_id=' + id + '&app_key=' + creator_app_key;
      $.ajax({
        type:  method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
    },
    off(data, callback) {
      let {name, creator_app_key} = Model.tree,
          {id} = data,
          method = 'Put',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/toggle/invisible?node_id=' + id + '&app_key=' + creator_app_key;
      $.ajax({
        type:  method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
    },
    delete(data, callback){
      let {creator_app_key} = Model.tree,
          path = Model.path,
          {name} = data,
          method = 'Delete',
          // url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/by_id:' + id + '?app_key=' + creator_app_key;
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + path + '/' + name + '?app_key=' + creator_app_key;
      $.ajax({
        type:  method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
    }
  };
  let Model = {
    tree: null,
    parentNode: null,
    data: null,
    folder(data){
      Model.data = data;
      var ds = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var row = [];
        row.push({
          label: item.index
        })
        row.push({
          label: item.name
        })
        row.push({
          label: i18n(item.enable?'PRODUCTOFFERING_TABLE_TITLE_OP_ENABLE':'PRODUCTOFFERING_TABLE_TITLE_OP_DISABLE')
        })
        row.push({
          label: item.title
        })
        var op_shelf_on = '<a name="on" data-index="' + i + '">' + i18n('NAVIGATE_EDITOR_SHELFON') + '</a>'
        var op_shelf_off = '<a name="off" data-index="' + i + '">' + i18n('NAVIGATE_EDITOR_SHELFOFF') + '</a>'
        var op_order = '<a name="order" data-index="' + i + '">' + i18n('NAVIGATE_ADJUST_INDEX_LABEL') + '</a>'
        var op_del = '<a name="del" data-index="' + i + '">' + i18n('NAVIGATE_EDITOR_DEL') + '</a>'
        row.push({
          label: ['<span>', item.enable ? op_shelf_off:op_shelf_on,op_order,op_del,'</span>'].join('')
        })
        ds.push(row)
      }
      return ds;
    }
  };
  function a({el, tree, parentNode, confirmFn, path}) {
    API.confirmFn = Model.tree = Model.parentNode = Model.data = Model.path = null;
    Model.tree = tree;
    Model.path = path;
    Model.parentNode = parentNode;
    API.confirmFn = confirmFn;
    Pane.init(el);
  }
  return a
})(jQuery, StyledList);
