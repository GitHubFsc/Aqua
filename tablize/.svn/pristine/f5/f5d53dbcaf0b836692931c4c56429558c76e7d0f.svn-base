(function ($, Table) {
  let Pane = {
    table: null,
    _data: null,
    init() {
      this.initWidgets();
      this.initTable();
    },
    initWidgets() {
      $("#autho_batch ._frame_foot ._btn._download").bind("click", () => {
        let el = $("#autho_batch #authoBatch_results > div");
        let data = {};
        let srcdata = el.data();
        for(var variable in srcdata) {
          if(srcdata.hasOwnProperty(variable)) {
            data[variable] = srcdata[variable];
          }
        }
        API.download(data);
      })
      $("#autho_batch ._btn._query").bind("click", () => {
        authoBatch_dialog.init(undefined, (data) => {
          var dom = $("<div></div>");
          for(var variable in data) {
            if(data.hasOwnProperty(variable)) {
              dom.data(variable, data[variable]);
            }
          }
          dom.html(data.smartcardId + ",(" + data.startDate + "--" + data.endDate + ")");
          $("#autho_batch #authoBatch_results").empty().append(dom);
          $("#autho_batch ._btn._edit").show();
          API.getList(data, (resp) => {
            Pane.table.update(Models.table(resp))
          });
        });
      });
      $("#autho_batch ._query_condition ._btn._edit").bind("click", () => {
        let el = $("#autho_batch #authoBatch_results > div");
        let data = {
          type: el.data("type"),
          startDate: el.data("startDate"),
          endDate: el.data("endDate"),
          smartcardId: el.data("smartcardId"),
          appKey: el.data("appKey")
        }
        authoBatch_dialog.init(data, (data) => {
          var dom = $("<div></div>");
          for(var variable in data) {
            if(data.hasOwnProperty(variable)) {
              dom.data(variable, data[variable]);
            }
          }
          dom.html(data.smartcardId.join(",") + ",(" + data.startDate + "--" + data.endDate + ")");
          $("#autho_batch #authoBatch_results").empty().append(dom);
          API.getList(data, (resp) => {
            Pane.table.update(Models.table(resp))
          });
        });
      });
      $("#autho_batch #authoBatch_list_table").on("click", "a[name=detail]", (e) => {
        let index = $(e.target).data("index");
        let data = Pane._data[index];
        AuthoBatchDetailDialog.init(data);
      })
    },
    initTable() {
      let title = [
        {
          label: i18n("AUTH_MNG_QUERYTABLE_CARDID")
        },
        {
          label: i18n("AUTH_MNG_QUERYTABLE_TICKETID")
        },
        {
          label: i18n("AUTH_MNG_QUERYTABLE_ASSETID")
        },
        {
          label: i18n("AUTH_MNG_QUERYTABLE_BUNDLEID")
        },
        {
          label: i18n("AUTH_MNG_QUERYTABLE_PRODUCTID")
        },
        {
          label: i18n("AUTH_MNG_QUERYTABLE_CREATETIME")
        },
        {
          label: i18n("AUTH_MNG_QUERYTABLE_ACTIVETIME")
        },
        {
          label: i18n("AUTH_MNG_QUERYTABLE_EXPIRETIME")
        },
        {
          label: i18n("AUTH_MNG_QUERYTABLE_RESULT_AUTHO")
        },
        {
          label: i18n("AUTH_MNG_QUERYTABLE_OPR")
        }
      ];
      let style = {
        borderColor: "#E2E2E2",
        borderWidth: 1,
        titleBg: "#45d1f4",
        titleColor: "#FFFFFF",
        titleHeight: 31,
        cellBg: "white",
        evenBg: "#F5FDFF",
        cellColor: "#797979",
        cellHeight: 40,
        footBg: "#FFFFFF",
        footColor: "#797979",
        inputBg: "#FFFFFF",
        inputBorder: "1px solid #CBCBCB",
        iconColor: "#0099CB",
        columnsWidth: [0.10, 0.08, 0.08, 0.08, 0.09, 0.14, 0.13, 0.14, 0.08, 0.08]
      }
      this.table = new Table({
        containerId: "authoBatch_list_table",
        rows: 13,
        columns: 10,
        titles: title,
        styles: style,
        listType: 0,
        async: false,
        data: []
      });
      this.table.create();
    }
  };
  let API = {
    getList(data, callback) {
        let putData = [];
        for(var i = 0; i < data.smartcardId.length; i++) {
          let card_id = data.smartcardId[i];
          putData.push("event_time=" + data.startDate + "T00:00:00+0800&event_time_op=gt&event_time=" + data.endDate + "T23:59:59+0800&event_time_op=lt&user_id=" + card_id + "&user_id_op=eq&asset_type=" + data.type + "&asset_type_op=eq");
        }
        $.ajax({
          type: "POST",
          url: aquapaas_host + "/aquapaas/rest/search/contents/auditauthorization?app_key=" + data.appKey,
          async: false,
          data: JSON.stringify(putData),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }).always((xhr, status) => {
          if(status == "success") {
            Pane._data = xhr;
            callback && callback(xhr);
          } else {
            alert(xhr.getAllResponseHeader("x-aqua-error"));
            return;
          }
        })
      },
      download(data) {
        let putData = [];
        for(var i = 0; i < data.smartcardId.length; i++) {
          let item = data.smartcardId[i];
          putData.push("event_time=" + encodeURIComponent(data.startDate + "T00:00:00+0800") + "&event_time_op=gt&event_time=" + encodeURIComponent(data.endDate + "T23:59:59+0800") + "&event_time_op=lt&user_id=" + item + "&user_id_op=eq&asset_type=" + data.type + "&asset_type_op=eq");
        }
        let url = aquapaas_host + "/aquapaas/rest/search/contents/auditauthorization/report?properties=user_id,ticket_id,asset_id,bundle_id,product_id,create_time,effective_time,expire_time,state";

        var form = $("<form>"); //定义一个form表单
        form.attr('style', 'display:none'); //在form表单中添加查询参数
        form.attr('target', '');
        form.attr('method', 'post');
        form.attr('action', url);

        var input1 = $('<input>');
        input1.attr('type', 'hidden');
        input1.attr('name', 'script');
        input1.attr('value', putData.join("|"));

        $('body').append(form); //将表单放置在web中
        form.append(input1); //将查询参数控件提交到表单上
        form.submit(); //表单提交
        form.remove();
      },
      convertTimeString(str) {
        var ret = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|([+-])(\d{2})(\d{2})?)/.exec(str);
        if(ret) {
          var tmpYear = Number(ret[1]);
          var tmpMonth = Number(ret[2]) - 1;
          var tmpDate = Number(ret[3]);
          var tmpHours = Number(ret[4]);
          var tmpMins = Number(ret[5]);
          var tmpSecs = Number(ret[6]);
          var tmpTimeInMyZone = new Date(tmpYear, tmpMonth, tmpDate, tmpHours, tmpMins, tmpSecs);

          var myZoneOffset = tmpTimeInMyZone.getTimezoneOffset();
          var origZoneOffset = 0;
          if(ret[7] != 'Z') {
            origZoneOffset = Number(ret[9]) * 60 + (ret[10] ? Number(ret[10]) : 0);
            if(ret[8] == '+') {
              origZoneOffset = 0 - origZoneOffset;
            }
          }
          var origToMyOffset = origZoneOffset - myZoneOffset;
          var timeMillSecs = tmpTimeInMyZone.getTime() + origToMyOffset * 60 * 1000;
          var timeInMyZone = new Date(timeMillSecs);

          var myZoneStr = '';
          var year = timeInMyZone.getFullYear();
          var month = timeInMyZone.getMonth();
          var date = timeInMyZone.getDate();
          var hours = timeInMyZone.getHours();
          var mins = timeInMyZone.getMinutes();
          var secs = timeInMyZone.getSeconds();

          myZoneStr += year;
          myZoneStr += '-';
          myZoneStr += month > 8 ? month + 1 : '0' + (month + 1);
          myZoneStr += '-';
          myZoneStr += date > 9 ? date : '0' + date;
          myZoneStr += ' ';
          myZoneStr += hours > 9 ? hours : '0' + hours;
          myZoneStr += ':';
          myZoneStr += mins > 9 ? mins : '0' + mins;
          myZoneStr += ':';
          myZoneStr += secs > 9 ? secs : '0' + secs;

          return myZoneStr;
        }
        return '';
      }
  };
  let Models = {
    table(data) {
      var ret = [];
      for(var i = 0; i < data.length; i++) {
        let item = data[i];
        let row = [];
        row.push({
          label: item.user_id || ""
        });
        row.push({
          label: "<div title='" + (item.ticket_id || "") + "'>" + (item.ticket_id || "") + "</div>"
        });
        row.push({
          label: "<div title='" + (item.asset_id || "") + "'>" + (item.asset_id || "") + "</div>"
        });
        row.push({
          label: "<div title='" + (item.bundle_id || "") + "'>" + (item.bundle_id || "") + "</div>"
        });
        row.push({
          label: "<div title='" + (item.product_id || "") + "'>" + (item.product_id || "") + "</div>"
        });
        row.push({
          label: API.convertTimeString(item.create_time || "")
        });
        row.push({
          label: API.convertTimeString(item.effective_time || "")
        });
        row.push({
          label: API.convertTimeString(item.expire_time || "")
        });
        row.push({
          label: i18n("AUTH_MNG_DIALOG_DETAIL_STATE_" + (item.state || "").toUpperCase())
        });
        let op = "<a name='detail' data-index='" + i + "'>" + i18n("AUTH_MNG_QUERYTABLE_OPR_DETAIL") + "</a>"
        row.push({
          label: [op].join()
        });
        ret.push(row)
      }
      return ret;
    }
  };
  Pane.init();
})(jQuery, StyledList)
