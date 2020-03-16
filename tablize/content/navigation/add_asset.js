/**
 * 添加节目/节目包
 * @param  依赖的js脚本
 * @return 模块
 * @author yubin.fu
 * @log 2019-05-09 方利要求添加节目/节目包 更改接口，要求添加的时候通过节点路径的方式，而非之前约定的根据node_id来添加
 */
var navigation_add_asset = (function($, Table, Dialog){
  let Pane = {
    dialog: null,
    table: null,
    init(){
      this.initDialog();
    },
    initDialog(){
      var callback = () => {
        Pane.bindEvents();
        Pane.initTable();
      }
      this.dialog = new Dialog({
        url: "content/navigation/add_asset.html",
        height: 661,
        width: 954,
        context: this,
        callback: callback
      });
      this.dialog.create();
    },
    initTable(){
      let title = [{
        label: ''
          }, {
        label: i18n('NAVIGATE_PROVIDERID')
          }, {
        label: i18n('NAVIGATE_PROVIDERASSETID')
          }, {
        label: i18n('NAVIGATE_EDIT_ASSET_TITLE')
          }, {
        label: i18n('NAVIGATE_ACTIVETIME')
          }, {
        label: i18n('NAVIGATE_FULLPATH')
          }, {
        label: i18n('NAVIGATE_STATE')
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
        columnsWidth: [0.06, 0.09, 0.13, 0.28, 0.19, 0.17, 0.08]
      }
      Pane.table = new Table({
        containerId: "navigation_asset_list",
        rows: 12,
        columns: 7,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      Pane.table.getPageData = API.getAsset
      Pane.table.create();
    },
    bindEvents(){
      $('#navigation_add_asset')
      .on('click', '._dialog_foot ._cancel', () => {
        this.dialog.close();
      })
      .on('click', '._dialog_foot ._confirm', ({currentTarget, target}) => {
        if (currentTarget ==  target) {
          var selectedEl = $('#navigation_asset_list .i-check input:checked')
          var selects = []
          for (var i = 0; i < selectedEl.length; i++) {
            selects.push(selectedEl[i])
          }
          function addAsset(selects){
            if (selects.length > 0) {
              var select = selects.pop();
              var index = $(select).data('index')
          var data = Model.data[index];
          API.add(data, () => {
                addAsset(selects)
              })
            } else {
            API.confirmFn && API.confirmFn();
              }
        }
          addAsset(selects);
        }
        this.dialog.close();
      })
      .on('keyup', '.search_bar input', ({currentTarget, target, keyCode, which}) => {
        if (target ==currentTarget) {
          var key = keyCode || which
          if (key ==13) {
            Model.search = $(currentTarget).val();
            Pane.table.refreshList();
          }
        }
      })
      .on('click', '.search_bar .btn', ({currentTarget, target}) => {
        if (target ==currentTarget) {
          Model.search = $(currentTarget).siblings('input').val();
          Pane.table.refreshList();
        }
      })
      .on('click', '#navigation_asset_list .i-check input', ({currentTarget, target}) => {
        if (currentTarget == target) {
          // $('#navigation_asset_list .i-check input').prop('checked', null);
          $(currentTarget).prop('checked', 'checked');
        }
      })

    }
  };
  let API = {
    getAsset(pageNum, callback) {
      let method = 'Post',
          url = aquapaas_host + "/aquapaas/rest/search/contents/" + Model.type,
          opts = [], body = [], urlParam = [];
          urlParam.push('app_type=' + paasAppKey);
          urlParam.push('timestamp=' + new Date().toISOString())
          urlParam.push("start=" + (pageNum - 1) * this.rowsLmt)
          urlParam.push("end=" + (pageNum * this.rowsLmt - 1))
          urlParam.push("visible=all");
          url += '?' + urlParam.join('&')
          // 申明两个变量，用来控制权限情况下的pid以及pid搜索标志符
          var pids=[], pid_op='in';
          if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {//设置了权限时，根据权限显示需要显示的pid的内容
            pids = my.paas.user.metadata.AquaBO_mediaUserRight.split(',')
          }
          if (pids.length > 0) {
          opts.push('provider_id=' + pids.join(',') + '&provider_id_op=in')
          }
            if (Model.search) {
            var titles = Model.search.split(',')
            for (var i = 0; i < titles.length; i++) {
              var item = titles[i]
              var queryStr = [].concat(opts)
              if (item) {
                queryStr.push('title=' + item + '&title_op=lk')
                }
              body.push(queryStr.join('&'))
          }
            } else {
            body.push(opts.join('&'))
            }
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(body.filter(item => item))
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          Model.data = resp;
          Pane.table.onTotalCount(parseInt(xhr.getResponseHeader("x-aqua-total-count")));
          callback && callback(Model.table(resp));
        }
      })
    },
    add(data, callback) {
      let method = 'Post',
          {ext_id, path} = Model.node,
          {name, creator_app_key} = Model.tree,
          putData = API.assetData(data),
          // url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/by_ext_id:' + ext_id + '/' + putData.name + '?app_key=' + creator_app_key,
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + path + '/' + putData.name + '?app_key=' + creator_app_key;
          delete putData.name;
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
    },
    assetData(asset) {
      let {name, title, doc_type, provider_id, provider_asset_id} = asset,
          {index} = Model;
      return {
        name: name,
        title: title,
        description: '',
        enable: true,
        is_manual: true,
        node_class: doc_type,
        index: 1,
        metadata_public: {
          entryType: doc_type =='asset' ? '6':'5',
          ProviderId: provider_id,
          ProviderAssetId: provider_asset_id
        },
        entry_id: [provider_id,provider_asset_id].join('_')
      }
    }
  };
  let Model = {
    search: null,
    type: null,
    tree: null,
    data: null,
    table(resp){
      var dataset = [];
      for (var i = 0; i < resp.length; i++) {
        var item = resp[i];
        var row = [],
        {provider_id, provider_asset_id, title, licensing_window_start, visible, category = []} = item;
        let check_box = '<div class="i-check"><input name="check" type="checkbox" data-index="' + i + '"><label></label></div>';
        row.push({
          label: check_box
        })
        row.push({
          label: provider_id
        })
        row.push({
          label: provider_asset_id
        });
        row.push({
          label: title
        })
        row.push({
          label: convertTimeString(licensing_window_start)
        });
        row.push({
          label: Array.isArray(category) ? category.join(',') : category
        })
        row.push({
          label: i18n('ASSET_SHELF_TABLE_STATUS_' + String(visible).toUpperCase())
        })
        dataset.push(row)
      }
      return dataset;
    }
  };
  let a = function({type, tree, node, index, confirmFn}){
    Pane.dialog = Pane.table = Model.search = Model.type = Model.tree = Model.data = Model.node = Model.index = null;
    Pane.init();
    Model.type = type;
    Model.node = node;
    Model.tree = tree;
    Model.index = index||1;
    API.confirmFn = confirmFn;
  }
  return a;
})(jQuery, StyledList, PopupDialog)
