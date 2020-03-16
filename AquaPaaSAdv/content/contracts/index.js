(function ($, Table, DatePicker) {
  let Pane = {
    table: null,
    search_condition: {
      contract_type: "0",
      first_party: "",
      second_party: "",
      ad_content: "",
      contract_starttime: "",
    },
    init() {
      this.initTable();
      this.bindEvents();
    },
    initTable() {
      let titles = [{
        label: i18n("CONTRACTS_TABLE_NO")
      }, {
        label: i18n("CONTRACTS_TABLE_TYPE")
        }, {
        label: i18n("CONTRACTS_TABLE_FIRSTPARTY")
      }, {
        label: i18n("CONTRACTS_TABLE_SECONDPARTY")
      }, {
        label: i18n("CONTRACTS_TABLE_ACTIVETIME")
      }, {
        label: i18n("CONTRACTS_TABLE_EXPIRETIME")
      }, {
        label: i18n("CONTRACTS_TABLE_MODIFYTIME")
      }, {
        label: i18n("CONTRACTS_TABLE_OPR")
      }];
      let styles = {
        borderColor: 'rgb(226,226,226)',
        borderWidth: 1,
        titleHeight: 45,
        titleBg: '#5DA1C0',
        titleColor: '#FFFFFF',
        cellBg: '#FFFFFF',
        evenBg: '#F5F5F5',
        cellColor: '#949494',
        footBg: '#FFFFFF',
        footColor: '#797979',
        iconColor: '#5DA1C0',
        inputBorder: '1px #CBCBCB solid',
        inputBg: '#FFFFFF',
        columnsWidth: [0.10, 0.10, 0.14, 0.14, 0.12, 0.12, 0.12, 0.16]
      }
      this.table = new Table({
        containerId: "list_table",
        rows: 11,
        columns: 8,
        data: [],
        titles: titles,
        listType: 1,
        styles: styles,
        updateTitle: true
      });
      this.table.getPageData = API.table;
      this.table.create();
    },
    bindEvents() {
      //
      $("#contracts_management #search_widget input").bind("focus", () => {
        Pane.loadQueryPane();
      });
      //
      $("#contracts_management ._frame_header .clear_condition").bind("click", () => {
        for(var item in Pane.search_condition) {
          if(Pane.search_condition.hasOwnProperty(item)) {
            if(item == 'contract_type'){
              Pane.search_condition.contract_type = '0'
            } else {
              Pane.search_condition[item] = "";
            }
          }
        }
        $("#contracts_management #search_widget input").val("").attr("disabled", false);
        Pane.table.refreshList();
      });
      //新建合同
      $("#contracts_management ._query._btn").bind("click", () => {
        contract.init({
          status: "new",
          closeFn: () => {
            Pane.table.refreshList()
          }
        });
      });
      //opr_详情
      $("#contracts_management #list_table").on("click", "a[name=detail]", (e) => {
        let index = $(e.target).data("index");
        let data = API.dataset[index];
        contract_viewer.init({
          data: data
        })
      });
      //opr_编辑
      $("#contracts_management #list_table").on("click", "a[name=edit]", (e) => {
        let index = $(e.target).data("index");
        let data = API.dataset[index];
        contract.init({
          status: "edit",
          data: data,
          closeFn: () => {
            Pane.table.refreshList()
          }
        });
      });
      //opr_删除
      $("#contracts_management #list_table").on("click", "a[name=del]", (e) => {
        let index = $(e.target).data("index");
        let data = API.dataset[index];
        contract_delete.init({
          data: data,
          closeFn: () => {
            Pane.table.refreshList();
          }
        })
      });
    },
    loadQueryPane() {
      $.ajax({
        url: "./content/contracts/query.html"
      }).done((resp, status, xhr) => {
        let dialog = $(patchHTML(resp));
        $("#contracts_management #search_widget .query._dialog").remove();
        $("#contracts_management #search_widget").append(dialog);
        dialog.find("div._btn.search").bind("click", () => {
          dialog.remove();
          let value = [];
          for(var item in Pane.search_condition) {
            if(Pane.search_condition.hasOwnProperty(item)) {
              if(Pane.search_condition[item]){
                if(item == 'contract_type'){
                  if(Pane.search_condition.contract_type == '0') {
                    value.push(i18n("CONTRACTS_DIALOG_ALLCONTRACTS"));
                  } else if(Pane.search_condition.contract_type == '1'){
                    value.push(i18n("CONTRACTS_DIALOG_COMMONCONTRACTS"));
                  } else if(Pane.search_condition.contract_type == '2'){
                    value.push(i18n("CONTRACTS_DIALOG_OFFLINECONTRACTS"));
                  }
                } else {
                  value.push(Pane.search_condition[item]);
                }
              }
            }
          }
          $("#contracts_management #search_widget>input").val(value.join(",")).attr("disabled", "true");
          Pane.table.refreshList();
        });
        // $("#contracts_management #search_widget input").bind("blur", ()=>{
        //   dialog.remove();
        // });
        // 添加合同类型下拉框
        var select_data = [{
          key: 0,
          value: i18n("CONTRACTS_DIALOG_ALLCONTRACTS")
        }, {
          key: 1,
          value: i18n("CONTRACTS_DIALOG_COMMONCONTRACTS")
        }, {
          key: 2,
          value: i18n("CONTRACTS_DIALOG_OFFLINECONTRACTS")
        }];
        var style = {
          width: 202,
          height: 30,
          background: "#FFFFFF",
          selectbackground: "#FFFFFF",
        };
        var query_select = new newSelect('#query_contract_type', select_data, style, function(index) {
          Pane.search_condition.contract_type = JSON.stringify(select_data[index].key);
        })
        $("#contracts_management #search_widget .query._dialog #first_party").bind("keyup", (e) => {
          let value = $(e.target).val();
          Pane.search_condition.first_party = value;
        });
        $("#contracts_management #search_widget .query._dialog #second_party").bind("keyup", (e) => {
          let value = $(e.target).val();
          Pane.search_condition.second_party = value;
        });
        $("#contracts_management #search_widget .query._dialog #ad_content").bind("keyup", (e) => {
          let value = $(e.target).val();
          Pane.search_condition.ad_content = value;
        });
        let calendarStyles = {
          width: 370,
          navTitleHeight: 20,
          navTitleBgColor: '#5da1c0',
          datesViewHeight: 150,
          datesViewGridColor: '#E2E2E2',
          datesViewCellColor: '#FFFFFF',
          weekdaysHeight: 20,
          weekdaysColor: '#E2E2E2',
          currMonthColor: '#737373',
          nonCurrMonthColor: '#E2E2E2'
        };
        let start_date = new DatePicker({
          containerId: "query_start_date",
          calendarStyles: calendarStyles,
          editable: true,
          dateInputStyles: {
            borderColor: '#d3d3d3'
          },
          iconImage: 'image/adPolicyManage/datePickerIcon.png'
        });
        start_date.onChange = function (value) {
          let dateStr = this.getDateStr();
          let timezone = ((new Date().getTimezoneOffset() * -1) / 60)
          Pane.search_condition.contract_begintime = dateStr + encodeURIComponent("+") + String(timezone).padStart(2, "0") + "00";
        }
        let end_date = new DatePicker({
          containerId: "query_end_date",
          calendarStyles: calendarStyles,
          editable: true,
          dateInputStyles: {
            borderColor: '#d3d3d3'
          },
          iconImage: 'image/adPolicyManage/datePickerIcon.png'
        });
        end_date.onChange = function (value) {
          let dateStr = this.getDateStr();
          let timezone = ((new Date().getTimezoneOffset() * -1) / 60)
          Pane.search_condition.contract_endtime = dateStr + encodeURIComponent("+") + String(timezone).padStart(2, "0") + "00";
        }
      })
    }
  }
  let API = {
    dataset: [],
    table(pageNum) {
      let data = [];
      let opts = [];
      let totalCount = 0;
      opts.push("user_id=" + my.paas.user_id);
      opts.push("user_type=" + my.paas.user_type);
      opts.push("user_name=" + my.paas.user_name);
      opts.push("start=" + ((pageNum - 1) * this.rowsLmt))
      opts.push("end=" + (pageNum * this.rowsLmt - 1))
      if(JSON.parse(Pane.search_condition.contract_type) > 0) {
        opts.push("contract_type=" + JSON.stringify(JSON.parse(Pane.search_condition.contract_type) - 1));
      }
      if(Pane.search_condition.first_party) {
        opts.push("first_party=" + Pane.search_condition.first_party);
      }
      if(Pane.search_condition.second_party) {
        opts.push("second_party=" + Pane.search_condition.second_party);
      }
      if(Pane.search_condition.ad_content) {
        opts.push("ad_content=" + Pane.search_condition.ad_content);
      }
      if(Pane.search_condition.contract_begintime) {
        opts.push("begintime=" + Pane.search_condition.contract_begintime);
      }
      if(Pane.search_condition.contract_endtime) {
        opts.push("endtime=" + Pane.search_condition.contract_endtime);
      }
      if(my.paas.platform_current_id) {
        opts.push("platform_id_list=" + my.paas.platform_current_id);
      }
      let url = paasHost + paasAdvDomain + "/ads/contract/contracts?" + opts.join("&");
      $.ajax({
        url: url,
        type: "Get",
        async: false,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).always((resp, status, xhr) => {
        if(status == "success") {
          totalCount = xhr.getResponseHeader("x-aqua-total-count");
          data = Model.table(resp);
          API.dataset = resp;
        }
      });
      this.onTotalCount(totalCount);
      return data;
    }
  }
  let Model = {
    table(data) {
      let dataset = [];
      for(var i = 0; i < data.length; i++) {
        let item = data[i];
        let row = [];
        row.push({
          label: item.contract_id || ""
        });
        let contract_type = '';
        if(item.contract_type == '0'){
          contract_type = i18n("CONTRACTS_DIALOG_COMMONCONTRACTS");
        } else if(item.contract_type == '1'){
          contract_type = i18n("CONTRACTS_DIALOG_OFFLINECONTRACTS");
        }
        row.push({
          label: contract_type
        });
        let first_party = item.first_party || "";
        row.push({
          label: "<div title='" + first_party + "'>" + first_party + "</div>"
        });
        let second_party = item.second_party || "";
        row.push({
          label: "<div title='" + second_party + "'>" + second_party + "</div>"
        });
        row.push({
          label: item.contract_begintime.split("+")[0]
        });
        row.push({
          label: item.contract_endtime.split("+")[0]
        });
        row.push({
          label: convertTimeString(item.update_time || "")
        });
        let op_detail = "<a name='detail' data-index='" + i + "'>" + i18n("CONTRACTS_TABLE_OP_DETAIL") + "</a>";
        let op_edit = "<a name='edit' data-index='" + i + "'>" + i18n("CONTRACTS_TABLE_OP_EDIT") + "</a>";
        let op_del = "<a name='del' data-index='" + i + "'>" + i18n("CONTRACTS_TABLE_OP_DEL") + "</a>";
        row.push({
          label: "<div class='opr'>" + [op_detail, op_edit, op_del].join("") + "</div>"
        });
        dataset.push(row)
      }
      return dataset;
    }
  }
  Pane.init();
})(jQuery, StyledList, DatePicker)
