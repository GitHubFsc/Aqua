/**
 * 节目列表-手动/自动
 * @log   2019-04-26 去除下挂目录列表中标签的内容,并且新增对节目、节目包的删除
 * @log   2019-08-27 删除节目根据路径来删除
 * @log   2019-09-06 添加目录混合排序
 */
var node_bundle = (function($, Table){
  var Pane = {
    checkBox:false,
    init({type = Pane.type, el}) {
      var dom = `<div id='bundle-pane'>${
            type == 'manul'  ?
            `
            <div class='btn-bar'>
              <div class='btn-head'>${i18n('NAVMNGSLIDER_JIEMULIEBIAO')}</div>
              <div class='btn-body'>
                <div class='btn' name='settop'>${i18n('NAVIGATE_EDITOR_SETTOP')}</div>
                <div class='btn' name='setbottom'>${i18n('NAVIGATE_EDITOR_SETBOTTOM')}</div>
                <div class='btn' name='del'>${i18n('NAVIGATE_EDITOR_SHELFOFF')}</div>
                <div class='btn' name='add_asset'>${i18n('NAVIGATE_EDITOR_ADDASSET')}</div>
                <div class="i-check"><input name="check" id="checkBox" type="checkbox"><label></label></div>
                <div class="btnfoottext">${i18n('NAVIGATE_DIRECTORYSORTING')}</div>
              </div>
            </div>
            ` :
            ``
          }
          <div id='asset_list' class='list_table' style='margin: 0;'></div>
          </div>`
      $(el).empty().append($(dom))
      this.initTable();
      this.bindEvents();
    },
    initTable() {
      let {type} = Pane;
      let title = [
        {label: ''},
        {label: i18n('NAVIGATE_TYPE')},
        {label: i18n('NAVIGATE_NAME')}
        ];
          if(type == 'manul'){
            title = [{
              label: ''
            }].concat(title).concat([
              {
                label: i18n('NAVIGATE_STATE')
              }, {
                label: i18n('NAVIGATE_EDITOR_OPR')
              }
            ])
          }
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
        columnsWidth: type == 'manul'?[0.05, 0.05, 0.12, 0.31, 0.17, 0.28]:[0.11, 0.38, 0.51]
      }
      Pane.table = new Table({
        containerId: "asset_list",
        rows: type=='manul'? 10: 11,
        columns: type == 'manul' ? 6: 3,
        titles: title,
        styles: style,
        listType: 0,
        data: []
      });
      Pane.table.create();
      API.getNode();
    },
    bindEvents(){
      $('#bundle-pane #asset_list.list_table ')
      .on('click', '[name=on]', ({target, currentTarget}) => {
        if (target == currentTarget) {
          var index = $(currentTarget).data('index');
          var data = Model.data[index];
          var dialog = new AlertDialog({
            message: i18n('NAVIGATE_EDITOR_SHELFONINFO').replace(/{{}}/, data.name),
            confirmFn: (callback) => {
              API.on(data, () => {
                callback && callback();
                API.confirmFn && API.confirmFn();
              })
            }
          })
        }
      })
      .on('click', '[name=off]', ({target, currentTarget}) => {
        if (target == currentTarget) {
          var index = $(currentTarget).data('index');
          var data = Model.data[index];
          var dialog = new AlertDialog({
            message: i18n('NAVIGATE_EDITOR_SHELFOFFINFO').replace(/{{}}/, data.name),
            confirmFn: (callback) => {
              API.off(data, () => {
                callback && callback();
                API.confirmFn && API.confirmFn();
              })
            }
          })
        }
      })
      .on('click', '[name=order]', ({target, currentTarget}) => {
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
      .on('click', '[name=edit]', ({target, currentTarget}) => {
        if (target == currentTarget) {
          var index = $(currentTarget).data('index');
          var data = Model.data[index];
          var dialog = new navigation_edit_asset({
            tree: Model.tree,
            node: Model.parentNode,
            data: data,
            confirmFn: () => {
              API.getNode();
              API.confirmFn && API.confirmFn();
            }
          })
          console.log('edit:', index);
        }
      })
      .on('click', '[name=del]', ({currentTarget, target}) => {
        if (target == currentTarget) {
          var index = $(currentTarget).data('index'),
              data = Model.data[index],
              {path} = Model.parentNode,
              {name, id} = data;
          var dialog = new AlertDialog({
            message: i18n('NAVIGATE_EDITOR_SHELFOFFINFO').replace(/{{}}/, name),
            confirmFn: (callback) => {
              API.del({name, path}, () => {
                callback && callback();
                API.getNode();
                API.confirmFn && API.confirmFn();
              })
            }
          })
        }
      });
      $('#bundle-pane .btn-bar')
      //节目上架
      .on('click', '.btn[name=add_asset]', ({target, currentTarget}) => {
        if (currentTarget == target) {
          var dialog = new navigation_add_asset({
            type: 'vod',
            node: Model.parentNode,
            tree: Model.tree,
            index: parseInt(Model.data.map(item => item.index).reverse()[0]||0) + 1,
            confirmFn: () => {
              API.getNode();
              API.confirmFn && API.confirmFn();
            }
          })
        }
      })
      .on('click', '.btn[name=settop]', ({target, currentTarget}) => {
        if (currentTarget == target) {
          var selectedEl = $('#bundle-pane #asset_list.list_table .i-check input:checked')
          var selects = []
          for (var i = 0; i < selectedEl.length; i++) {
            selects.push(selectedEl[i])
          }
          function setTop(formattedData, selects) {
            if (selects.length > 0) {
              var select = selects.slice(0,1);
              var index = $(select).data('index')
              var data = Model.data[index];
              formattedData.push({
                id: data.id,
                index: formattedData.length + 1
              })
              setTop(formattedData, selects.slice(1))
            } else {
              API.adjustIndex(formattedData, () => {
                API.getNode();
                API.confirmFn && API.confirmFn();
              })
            }
          }
          setTop([], selects)
        }
      })
      .on('click', '.btn[name=setbottom]', ({target, currentTarget}) => {
        if (currentTarget == target) {
          var selectedEl = $('#bundle-pane #asset_list.list_table .i-check input:checked')
          var selects = []
          for (var i = 0; i < selectedEl.length; i++) {
            selects.push(selectedEl[i])
          }
          var maxIndex = Math.max.apply(null, Model.data.map(item => parseInt(item.index)).filter(item => item))
          function setBottom(formattedData, selects, maxIndex) {
            if (selects.length > 0) {
              var select = selects.slice(0, 1);
              var index = $(select).data('index')
              var data = Model.data[index];
              maxIndex += 1;
              formattedData.push({
                id: data.id,
                index: maxIndex
              })
              setBottom(formattedData, selects.slice(1), maxIndex)
            } else {
              API.adjustIndex(formattedData, () => {
                API.getNode();
                API.confirmFn && API.confirmFn();
              })
            }
          }
          setBottom([], selects, maxIndex)
        }
      })
      .on('click', '.btn[name=del]', ({target, currentTarget}) => {
        if (currentTarget == target) {
          var selectedEl = $('#bundle-pane #asset_list.list_table .i-check input:checked')
          var selects = []
          for (var i = 0; i < selectedEl.length; i++) {
            selects.push(selectedEl[i])
          }
          function del(selects) {
            if (selects.length > 0) {
              var select = selects.pop();
              var index = $(select).data('index')
              var {path} = Model.parentNode;
              var {name} = Model.data[index];
              API.del({path, name}, () => {
                del(selects)
              })
            } else {
              API.getNode();
              API.confirmFn && API.confirmFn();
            }
          }
          del(selects)
        }
      })
      .on('click', '#checkBox', ({target, currentTarget}) => {
        if (currentTarget == target) {
          Pane.checkBox =target.checked;
          API.getNode();
        }
      })
    }
  };
  var API = {
    getNode(){
      let {name, creator_app_key} = Model.tree,
          {id} = Model.parentNode,
          method = 'Get',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/by_id:'+id,
          urlParam = [];
      urlParam.push('children=1')
      urlParam.push('enable=all')
      urlParam.push('app_key=' + creator_app_key)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('tree_version=00');
      url += '?' + urlParam.join('&');
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
          if (Pane.checkBox) {
            Pane.table.update(Model.table({type: Pane.type, data:resp.children}));
          }else{
            Pane.table.update(Model.table({type: Pane.type, data:resp.children.filter(item => item.node_class !== 'folder')}));
          }
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
    del(data, callback) {
      let {creator_app_key} = Model.tree,
          {name, path} = data,
          method = 'Delete',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + path + '/' + name,
          urlParam = [];
      urlParam.push('app_key=' + creator_app_key)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
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
          callback && callback();
        }
      })
    },
    adjustIndex(data, callback) {
      let method = 'Put',
      {name, creator_app_key} = Model.tree,
      url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/batchupdate',
      urlParam = [],
      putData = data
      urlParam.push('app_key=' + creator_app_key);
      urlParam.push('timestamp=' + new Date().toISOString());
      url += '?' + urlParam.join('&')
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
  var Model = {
    data: null,
    table({type = Pane.type, data}){
      var ds = [];
      Model.data = data;
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var row = [];
        let check_box = '<div class="i-check"><input name="check" type="checkbox" data-index="' + i + '"><label></label></div>';
        row.push({
          label: check_box
        })
        row.push({
          label: item.index
        })
        if(item.node_class=="folder"){
          row.push({
            label: i18n('NAVIGATE_CREATE_FOLDER_FOLDER')
          })
        }else{
          row.push({
            label: item.node_class || (item.metadata.entryType == '5' ? 'bundle': 'asset')
          })
        } 
        row.push({
          label: item.name
        })
        if (type == 'manul') {
          if(item.node_class=="folder"){
            row.push({
              label: "——"
            })
          }else{
           row.push({
              label: i18n('ASSET_SHELF_TABLE_STATUS_' + String(item.enable).toUpperCase())//启用
            });
          } 
          var op_shelf_on = '<a name="on" data-index="' + i + '">' + i18n('NAVIGATE_EDITOR_SHELFON') + '</a>'
          var op_shelf_off = '<a name="off" data-index="' + i + '">' + i18n('NAVIGATE_EDITOR_SHELFOFF') + '</a>'
          var op_order = '<a name="order" data-index="' + i + '">' + i18n('NAVIGATE_ADJUST_INDEX_LABEL') + '</a>'
          var op_edit = '<a name="edit" data-index="' + i + '">' + i18n('NAVIGATE_EDITOR_EDIT') + '</a>'
          var op_del = '<a name="del" data-index="' + i + '">' + i18n('NAVIGATE_EDITOR_SHELFOFF') + '</a>'
          if(item.node_class=="folder"){
            row.push({
              label: ['<span>', op_order,'</span>'].join('')
            })
          }else{
            row.push({
              label: ['<span>', op_order,op_edit,op_del,'</span>'].join('')
            })
          }
        }
        ds.push(row)
      }
      return ds;
      }
  };
  function a({el, type, parentNode, confirmFn, tree, node}) {
    Pane.type = API.confirmFn = Model.parentNode = Model.tree = Model.data = Model.node = null;
    Pane.checkBox = false;
    Pane.type = type;
    API.confirmFn = confirmFn;
    Model.parentNode = parentNode;
    Model.tree = tree;
    Model.node = node;
    Pane.init({el});
  }
  return a;
})(jQuery, StyledList);
