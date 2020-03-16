var add_asset = (function ($, Table, Dialog) {
  let Pane = {
    dialog: null,
    table: null,
    search: [],
    init() {
      let cb = () => {
        API.checked = [];
        Pane.initTable();
        //bind search events
        $("._dialog .search_bar input#search").bind("keypress", (e) => {
          let key = e.which||e.keyCode;
          let val = $(e.target).val()
          if(key == 13) {
            Pane.search=['m_search=' + val];
            Pane.table.refreshList();
          }
        });
        $("._dialog .search_bar .search_btn").bind("click", (e) => {
          let key = e.which||e.keyCode;
          let val = $(e.target).prev().val();
          Pane.search=['m_search=' + val];
          Pane.table.refreshList();
        });
        //bind btn events
        $("._dialog ._dialog_foot ._cancel.btn").bind("click", () => {
          Pane.dialog.close();
        });
        $("._dialog ._dialog_foot ._confirm.btn").bind("click", () => {
          API.bindAsset(()=>{
          if(API.confirmFn) {
            Pane.dialog.close();
            API.confirmFn();
          } else {
            Pane.dialog.close();
          }
          })
        });
        $('.add_asset #list_table_asset_asset').on('click', 'input', (e)=>{
          let el = $(e.target);
          let index = el.data("index");
          let data = API.data[index];
          let checked = el.prop('checked');
          if(typeof index !== 'undefined') {
            API.checkData(checked, [data])
          } else {
            $("#list_table input[type=checkbox]").prop('checked', checked)
            API.checkData(checked, API.data)
          }
        })
      }
      let dialog = new Dialog({
        url: "content/asset/manage/asset/add_asset.html",
        context: this,
        width: 954,
        height: 661,
        callback: cb
      });
      dialog.create();
      this.dialog = dialog;
    },
    initTable() {
      let title = [{
        label: ''
      }, {
        label: i18n("ASSET_TABLE_PID")
              }, {
        label: i18n("ASSET_TABLE_PAID")
          }, {
        label: i18n("ASSET_TABLE_TITLE")
          }, {
        label: i18n("ASSET_TABLE_AFFECTIVE")
          }, {
        label: i18n("ASSET_TABLE_PATH")
          }, {
        label: i18n("ASSET_TABLE_STATUS")
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
        columnsWidth: [0.05, 0.09, 0.13, 0.29, 0.19, 0.17, 0.08]
      }
      this.table = new Table({
        containerId: "list_table_asset_asset",
        rows: 12,
        columns: 7,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      this.table.getPageData = API.getList;
      this.table.create();
    }
  };
  let API = {
    checked: [],
    data: [],
    getList(pageNum, callback) {
      let opts = [];
      opts.push("start=" + (pageNum - 1) * this.rowsLmt)
      opts.push("end=" + (pageNum * this.rowsLmt - 1))
      opts.push("visible=all");
      if(Pane.search.length> 0) {
        for(var i = 0;i<Pane.search.length;i++){
          opts.push(Pane.search[i]);
        }
      }
      $.ajax({
        type: 'get',
        url: aquapaas_host + '/aquapaas/rest/search/contents/asset?' + opts.join('&'),
        async: true,
        dataType: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application'
        }
      }).always((resp, status, xhr)=>{
        if(status == 'success') {
          API.data = resp;
          Pane.table.onTotalCount(xhr.getResponseHeader('x-aqua-total-count'))
          callback && callback(Model.table(resp))  
        } else {
          callback && callback(Model.table([]))  
        }
      });
    },
    bindAsset(callback){
      var url = aquapaas_host + '/aquapaas/rest/asset/bundle_info';
      var opts=[];
      var ids=[];
      for(var i=0;i<API.checked.length;i++){
        ids.push(API.checked[i].doc_id);
      }
      url += '?ids=' + ids.join(',') + '&bundle_id=' + Pane.id + '&app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString() + '&mode=0'
      var req = new XMLHttpRequest();
      let method = 'PUT'
      req.open(method, url, true);
      req.setRequestHeader('Accept', 'application/json')
      req.setRequestHeader('Content-Type', 'application/json')
      req.setRequestHeader('x-aqua-sign', getPaaS_x_aqua_sign(method, url));
      req.onreadystatechange = function(){
        if(this.status == 200 && this.readyState == 4) {
          callback && callback();
        }
      }
      req.send();
    },
    checkData(add, datasets) {
      for(var i = 0; i < datasets.length; i++) {
        let item = datasets[i];
        let exist = this.checked.find(item.doc_id, 2, 'doc_id') !== null ? true : false;
        if(exist ^ add) {
          this.checked[add ? 'push' : 'remove'](this.checked.find(item.doc_id, 2, 'doc_id') || item)
        }
      }
    },
    isChecked(data) {
      return API.checked.find(data.doc_id, 2, 'doc_id') !== null ? true : false;
    }
  };
  let Model = {
    table(data) {
      let list = [];
      for(var i=0;i<data.length;i++){
        var row = [];
        var item = data[i];
        var check_box = '<div class="i-check"><input name="check" type="checkbox" data-index="' + i + '" '+ (API.isChecked(item)?'checked':'') +' data-index="' + i + '"><label></label></div>';
        var pid = item.provider_id;
        var paid = item.provider_asset_id;
        var title = item.title||'';
        var activatetime = convertTimeString(item.licensing_window_start);
        var path = item.category||'';
        var status = item.visible?true:false;
        row.push({
          label: check_box
        });
        row.push({
          label: pid
        });
        row.push({
          label: paid
        });
        row.push({
          label: title
        });
        row.push({
          label: activatetime
        });
        row.push({
          label: path
        });
        row.push({
          label: i18n("ASSET_SHELF_TABLE_STATUS_" + String(status).toUpperCase())
        });

        list.push(row)
      }
      return list;
    }
  };
  return function (opts) {
    API.confirmFn = opts.confirmFn;
    Pane.id = opts.id;
    Pane.init();
  }
})(jQuery, StyledList, PopupDialog);
