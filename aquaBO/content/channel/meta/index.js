var ChannelMeta = (function ($, Table, Dialog, Combo) {
  let Pane = {
    table: null,
    search: [],
    init() {
      this.initTable();
      this.bindEvents();
    },
    initTable() {
      let title = [{
        label: i18n("CHANNEL_META_TABLE_NAME")
          }, {
        label: i18n("CHANNEL_META_TABLE_TITLE")
          }, {
        label: i18n("CHANNEL_META_TABLE_TYPE")
          }, {
        label: i18n("CHANNEL_META_TABLE_OPTIONAL")
          }, {
        label: i18n("CHANNEL_META_TABLE_READONLY")
          }, {
        label: i18n("CHANNEL_META_TABLE_MULTI")
          }, {
        label: i18n("CHANNEL_META_TABLE_DETAIL")
          }, {
        label: i18n("CHANNEL_META_TABLE_OPR")
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
        columnsWidth: [0.09, 0.07, 0.07, 0.09, 0.08, 0.10, 0.28, 0.22]
      }
      Pane.table = new Table({
        containerId: "channel_list_table",
        rows: 15,
        columns: 8,
        titles: title,
        styles: style,
        listType: 1,
        async: true
      });
      Pane.table.getPageData = API.getList;
      Pane.table.create();
    },
    bindEvents() {
      //新建元信息
      $(".channel_meta .header .btn#channel_create_meta").bind("click", (e)=>{
        let cb = ()=>{
          Pane.table.refreshList();
        }
        let dialog  = new ChannelMetaDialog({
          state: "add",
          confirmFn: cb
        });
      });
      //列表操作栏
      $(".channel_meta #channel_list_table").on("click", "a[name=view]", (e) => {
        let cb = ()=>{
          Pane.table.refreshList();
        }
        let el = $(e.target);
        let index = el.data("index");
        let data = API.data[index];
        let dialog  = new ChannelMetaDialog({
          state: "view",
          data: data,
          confirmFn: cb
        });
      })
      .on("click", "a[name=edit]", (e) => {
        let cb = ()=>{
          Pane.table.refreshList();
        }
        let el = $(e.target);
        let index = el.data("index");
        let data = API.data[index];
        let dialog  = new ChannelMetaDialog({
          state: "edit",
          data: data,
          confirmFn: cb
        });
      })
      .on("click", "a[name=del]", (e) => {
        let el = $(e.target);
        let index = el.data("index");
        let data = API.data[index];
        let message = i18n("CHANNEL_META_TABLE_OPR_DEL_HINT").replace(/{{}}/, data.name)
        let dialog  = new AlertDialog({
          message: message,
          confirmFn: (callback) => {
            API.delete(data, ()=>{
              Pane.table.refreshList();
              callback&&callback();
            })
          }
        });
      })
    }
  };
  let API = {
    data : [],
    getList(pageNum, callback) {
      // let url = "http://172.16.20.201:8090/aquapaas/rest/assetdef/metadata/channel";
      let url = aquapaas_host + "/aquapaas/rest/assetdef/metadata/channel";
      let method = "GET";
      let urlParam = [];
          urlParam.push("start=" + (pageNum - 1) * this.rowsLmt);
          urlParam.push("end=" + (pageNum * this.rowsLmt));
      url += '?' + urlParam.join('&');
      $.ajax({
				url: url,
				type: method,
        async: true,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
      }).always((resp, status, xhr)=>{
        if (status == "success") {
          API.data = resp;
          Pane.table.onTotalCount(xhr.getResponseHeader("x-aqua-total-count"));
          callback&&callback(Model.table(resp));
        }
      });
    },
    delete(data, callback){
      // let url = "http://172.16.20.201:8090/aquapaas/rest/assetdef/metadata/channel/" + data.name;
      let url = aquapaas_host + "/aquapaas/rest/assetdef/metadata/channel/" + data.name;
      let method = "delete";
      $.ajax({
        url: url,
        type: method,
        async: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).always((resp, status, xhr)=>{
        if (status == "success") {
          callback&&callback();
        }
      })
    }
  };
  let Model = {
    table(data) {
      let dataset = [];
      try {
        for(var i = 0; i < data.length; i++) {
          let item = data[i];
          let row = [];
          let name = item.name;
          let title = item.title;
          let type = item.type;
          let mandatory = item.mandatory;
          let readonly = item.readonly;
          let multiple_value = item.multiple_value;
          let value_definition = item.value_definition;
          row.push({
            label: name
          })
          row.push({
            label: title
          })
          row.push({
            label: type
          })
          row.push({
            label: i18n("CHANNEL_META_TABLE_OPR_"+String(mandatory).toUpperCase())
          })
          row.push({
            label: i18n("CHANNEL_META_TABLE_OPR_"+String(readonly).toUpperCase())
          })
          row.push({
            label: i18n("CHANNEL_META_TABLE_OPR_"+String(multiple_value).toUpperCase())
          })
          row.push({
            label: (value_definition&&value_definition.enum_values)
          });

          let op_view = "<a name='view' data-index='" + i + "'>" + i18n("CHANNEL_META_TABLE_OPR_VIEW") + "</a>"
          let op_edit = "<a name='edit' data-index='" + i + "'>" + i18n("CHANNEL_META_TABLE_OPR_EDIT") + "</a>"
          let op_del = "<a name='del' data-index='" + i + "'>" + i18n("CHANNEL_META_TABLE_OPR_EDL") + "</a>"
          row.push({
            label: "<span>" + [op_view, op_edit, op_del].join("") + "</span>"
          });
          dataset.push(row)
        }
      } catch(e) {
        console.error("http://www.baidu.com/s?wd=" + e.message);
      } finally {
        return dataset
      }
    }
  };
  return {
    init() {
      Pane.init();
    }
  }
})(jQuery, StyledList, PopupDialog, newSelect)
