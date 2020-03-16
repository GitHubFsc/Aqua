(($, Table, Dialog, Selector, content) => {
  var template = "",
    user_id,
    ad_id,
    dialogContext,
    frame,
    frame_name,
    list_table,
    site_array = [],
    closeCallback,
    isEdit = false;
  var Pane = {
    init: function () {
      $.ajax({
        type: "GET",
        url: "content/su_cai/editLimit.html",
        async: true
      }).done(function (resp) {
        template = patchHTML(resp);
        $(dialogContext).append($(template));
        if (AdvSystemType == 'solo') {
          $('#editLimit .add_site').html(i18n('SUCAI_ADD_SITE_SOLO'))
          $('#editLimit .table_title_text').html(i18n('SUCAI_LIMITSITE_INFO_SOLO'))
        } else {
          $.ajax({
        async: false,
        url: paasHost + paasDomain + "/dm/site",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }).done((resp) => {
        site_array = [];
        for(var i = 0; i < resp.length; i++) {
          site_array.push(resp[i]);
        }
      });
        }
        Pane.bindEvents();
        Pane.loadData();
      });
    },
    bindEvents: function () {
      $(".editLimit .sucai_name").html(frame_name);
      $(".editLimit .popup_dialog_clear").bind("click", () => {
        closeCallback();
        $(".editLimit").remove();
      })
      $(".editLimit .radio1").bind("click", function () {
        $(".editLimit .radio1").removeClass("focus");
        $(this).addClass("focus");
        let value = $(this).data("value");
        Data.needLimit = parseInt(value);
      });
      $(".editLimit #limit_total_quota").bind("blur", function () {
        var value = $(this).val();
        Data.total_quota = parseInt(value);
      });
      if(isEdit) {
        // $(".radio1").unbind();
        // $("#limit_total_quota").attr("disabled", "disabled");
        $(".editLimit #placement_times").attr("disabled", "disabled");
        // $(".editLimit .save_info").addClass("disabled");
      }
      $(".editLimit .save_info").bind("click", () => {
        API.updateLimit(Data, "save");
      });
      $(".editLimit .add_site").bind("click", Pane.showAddSiteDialog)
      let titles = [{
          label: ""
          }],
          columnsWidth = [0.02, 0.15, 0.16, 0.15, 0.14, 0.19, 0.19]
      if (AdvSystemType !== 'solo') {
        titles.push({
          label: i18n("SUCAI_TABLE_SITE")
        })
        columnsWidth = [0.02, 0.125, 0.12, 0.125, 0.12, 0.15, 0.15, 0.19]
      }
      titles = titles.concat([{
          label: i18n("SUCAI_TABLE_COUNT_DISPATCH")
        }, {
          label: i18n("SUCAI_TABLE_COUNT_TOUFANG")
        }, {
          label: i18n("SUCAI_TABLE_COUNT_REST")
        }, {
          label: i18n("SUCAI_TABLE_TEMINAL_QUOTA")
        }, {
          label: i18n("SUCAI_TABLE_TEMINAL_LIMIT")
        }, {
          label: i18n("SUCAI_TABLE_OPR")
      }])
      list_table = new Table({
        containerId: "list_table_sites",
        rows: 10,
        columns: titles.length,
        data: [],
        titles: titles,
        listType: 0,
        styles: {
          borderColor: 'rgb(226,226,226)',
          borderWidth: 1,
          titleHeight: 40,
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
          columnsWidth: columnsWidth
        },
        updateTitle: true
      });
      list_table.create();
      $(window).on("resize", () => {
        list_table.resize();
      })
      $(".editLimit .list_table_main").on("click", ".del", (e) => {
        var el = e.target;
        var index = $(el).data("index");
        Data.site_assign_quota.removeByIndex(index);
        API.updateLimit(Data);
      });
      $(".editLimit .list_table_main").on("click", ".edit", (e) => {
        var el = e.target;
        var index = $(el).data("index");
        // Data.site_assign_quota.removeByIndex(index);
        var _data = Data.site_assign_quota[index];
        Pane.showAddSiteDialog(_data, index);
        // API.updateLimit(Data);
      });
    },
    loadData: function () {
      $(".editLimit .radio1").eq(Data.needLimit == 1 ? 0 : 1).addClass("focus");
      $(".editLimit #limit_total_quota").val(Data.total_quota);
      $(".editLimit #placement_times").val(Data.placement_times);
      if(Data.site_assign_quota) {
        list_table.update(API.formatterListData(Data.site_assign_quota));
      }
    },
    showAddSiteDialog: function (data, dataIndex) {
      const _content = "#add_site";
      let enableCount = true,
        enablePeriod = true,
        isEdit = false,
        SiteData = {
          siteId: "",
          site_quota: -1,
          teminal_quota: 0,
          teminal_period_quota: "0:0"
        };
      if(data.siteId) {
        isEdit = true;
        $.extend(SiteData, data);
      }
      var afterDrawn = () => {
        if(AdvSystemType == 'solo') {
          $('#add_site .title_content').html(i18n('SUCAI_ADD_SITE_SOLO'))
          $('#add_site ._dialog_body .row:eq(0)').hide()
          dialog.resize({
            width: 620,
            height: 360
          }, true)
        }
        if(!isEdit) {
          var el = $(_content + " #placement_times");
          el.hide();
          el.prev().hide();
          el.next().hide();
        }
        let Site_Array = [];
        jQuery.ajax({
          async: false,
          url: paasHost + paasDomain + "/dm/site",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }).done(function (data) {
          Site_Array = [];
          for(var i = 0; i < data.length; i++) {
            var item = data[i]
            Site_Array.push({
              key: item.id,
              value: item.name
            });
          }
        });
        //目标站点
        var combo = new Selector("#site_list", Site_Array, {
          width: "100%",
          height: "100%",
          background: "#ffffff",
          selectbackground: "#d3d3d3"
        }, () => {
          SiteData.siteId = combo.getValue();
        });
        //设置单终端次�?
        $(_content + " .radio1.teminalcountset").bind("click", (e) => {
          let el = e.target;
          $(el).addClass("focus").siblings().removeClass("focus");
          let index = $(el).index(_content + " .radio1.teminalcountset");
          if(index == 1) {
            enableCount = false;
            SiteData.teminal_quota = -1
          } else {
            enableCount = true;
            let quota = $(_content + " #teminal_counts").val();
            SiteData.teminal_quota = parseInt(quota);
          }
        });
        //设置单终端周期次�?
        $("#add_site .radio1.teminalperiodset").bind("click", (e) => {
          let el = e.target;
          $(el).addClass("focus").siblings().removeClass("focus");
          let index = $(el).index(_content + " .radio1.teminalperiodset");
          if(index == 1) {
            enablePeriod = false;
            SiteData.teminal_period_quota = "-1"
          } else {
            enablePeriod = true;
            let period = $(_content + " #tenimal_period").val();
            let times = $(_content + " #tenimal_period_times").val();
            SiteData.teminal_period_quota = [period, times].join(":")
          }
        });
        //设置单终端周期次�?
        $(".confirm").bind("click", () => {
          patch_times = $("#dispatch_times").val();
          if(patch_times == "") {
            alert(i18n("SUCAI_LIMIT_SAVE_INFO3"));
            return;
          }
          if(patch_times == 0) {
            alert(i18n("SUCAI_LIMIT_SAVE_INFO4"));
            return;
          }
          if($(_content + " #teminal_counts").val() == "" && enableCount) {
            alert(i18n("SUCAI_LIMIT_SAVE_INFO5"));
            return;
          }
          if($(_content + " #tenimal_period").val() == "" && enablePeriod) {
            alert(i18n("SUCAI_LIMIT_SAVE_INFO6"));
            return;
          }
          if($(_content + " #tenimal_period_times").val() == "" && enablePeriod) {
            alert(i18n("SUCAI_LIMIT_SAVE_INFO7"));
            return;
          }
          $.extend(SiteData, {
            siteId: combo.getValue(),
            site_quota: parseInt(patch_times),
            teminal_quota: enableCount ? parseInt($(_content + " #teminal_counts").val()) : -1,
            teminal_period_quota: enablePeriod ? ($(_content + " #tenimal_period").val() + ":" + $(_content + " #tenimal_period_times").val()) : "-1"
          });
          let _Data = JSON.parse(JSON.stringify(Data));
          if(typeof dataIndex !== "undefined") {
            _Data.site_assign_quota[dataIndex] = SiteData;
          } else {
            if (!Array.isArray(_Data.site_assign_quota)) {
              _Data.site_assign_quota = []
            }
            _Data.site_assign_quota.push(SiteData);
          }
          API.updateLimit(_Data);
          dialog.close();
        });
        $(".cancel, .popup_dialog_clear").bind("click", () => {
          dialog.close();
        });

        function loadData() {
          combo.setValue(combo.selectItem.find(SiteData.siteId, 2, "key")&&combo.selectItem.find(SiteData.siteId, 2, "key").value||'');
          $(_content + " #dispatch_times").val(SiteData.site_quota);
          $(_content + " #placement_times").val(SiteData.site_placement_times);
          if(SiteData.teminal_quota == -1) {
            $(_content + " .radio1.teminalcountset").eq(1).click();
          } else {
            $(_content + " #teminal_counts").val(SiteData.teminal_quota);
          };
          if(SiteData.teminal_period_quota == "-1") {
            $(_content + " .radio1.teminalperiodset").eq(1).click();
          } else {
            var array = SiteData.teminal_period_quota.split(":");
            var day = array[0];
            var times = array[1];
            $(_content + " #tenimal_period").val(day);
            $(_content + " #tenimal_period_times").val(times);
          }
        };
        loadData();
      }
      var dialog = new Dialog({
        url: "content/su_cai/add_site.html",
        width: 597,
        height: 411,
        context: this,
        callback: afterDrawn
      });
      dialog.create();
    }
  };
  var API = {
    formatterListData: function (data) {
      var ret = [];
      for(var i = 0; i < data.length; i++) {
        var row = [];
        var item = data[i];
        var site_id = item.siteId;
        var site_quota = item.site_quota;
        var placement_times = item.site_placement_times || 0;
        var rest_times = parseInt(site_quota) - parseInt(placement_times);
        var teminal_quota = item.teminal_quota || -1
        let teminal_period = "";
        if(item.teminal_period_quota != "-1") {
          let teminal_period_array = item.teminal_period_quota.split(":");
          teminal_period = teminal_period_array[1] + i18n("SUCAI_TIME") + "/" + teminal_period_array[0] + i18n("SUCAI_PERIOD");
        } else {
          teminal_period = i18n("SUCAI_NOLIMIT");
        }
        var opr_edit = "<span class='edit opr' data-index='" + i + "'>" + i18n("SUCAI_TABLE_OPR_EDIT_" + AdvSystemType.toUpperCase()) + "</span>";
        var opr_del = "<span class='del opr' data-index='" + i + "'>" + i18n("SUCAI_TABLE_OPR_DEL_" + AdvSystemType.toUpperCase()) + "</span>";
        row.push({
          label: i + 1
        });
        if (AdvSystemType !== 'solo') {
          row.push({
            label: (site_array.find(site_id, 2, "id") && site_array.find(site_id, 2, "id").name) || ""
          })
        }
        row.push({
          label: site_quota + i18n("SUCAI_TIME")
        }, {
          label: placement_times + i18n("SUCAI_TIME")
        }, {
          label: rest_times + i18n("SUCAI_TIME")
        }, {
          label: teminal_quota + i18n("SUCAI_TIME")
        }, {
          label: teminal_period
        }, {
          label: [opr_edit, opr_del].join("")
        })
        ret.push(row);
      }
      return ret;
    },
    updateLimit: function (_data, flag) {
      if(_data.total_quota < _data.placement_times) {
        alert(i18n("SUCAI_LIMIT_SAVE_INFO1"));
        return;
      }
      var site_place = 0;
      for(var i = 0; i < _data.site_assign_quota.length; i++) {
        site_place += parseInt(_data.site_assign_quota[i].site_quota);
      }
      if(_data.total_quota < site_place) {
        alert(i18n("SUCAI_LIMIT_SAVE_INFO2"));
        return;
      }
      let ret = confirm(i18n("SUCAI_LIMIT_AUDITAUTH"));
      if(!ret) {
        return;
      }
      var method = "PUT",
        url = paasHost + paasAdvDomain + "/ads/aditem/limit/" + ad_id + "?user_id=" + user_id + "&user_type=0&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString()
      $.ajax({
        type: method,
        url: url,
        async: true,
        data: JSON.stringify(_data),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
        }
      }).done((resp, status, xhr) => {
        if(status == "success") {
          Data = _data
          if(flag) {
            alert(i18n("SUCAI_LIMIT_SAVE_SUCCESS"));
          }
          API.updateAudit(() => {
            API.refreshList(() => {
              Pane.loadData();
            });
          });
        }
      });
    },
    refreshList(callback) {
      let placement_times = 0;
      for(var i = 0; i < Data.site_assign_quota.length; i++) {
        let item = Data.site_assign_quota[i];
        placement_times += item.site_quota;
      }
      Data.placement_times = placement_times;
      callback && callback();
    },
    updateAudit(callback) {
      let token = "user_id=" + my.paas.user_id + "&user_type=" + my.paas.user_type +
        "&access_token=" + my.paas.access_token + "&app_key=" + paasAppKey +
        "&timestamp=" + new Date().toISOString();
      let url = paasHost + paasDomain + "/auditflow/instance/ad_item/" + Data.ad_id + "?" + token;
      alert
      jQuery.ajax({
        type: "POST",
        url: url,
        async: false,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-aqua-sign": getPaaS_x_aqua_sign("PUT", url)
        }
      }).always((resp, status, xhr) => {
        if(status == "success") {
          callback && callback();
        }
      })
    }
  }
  var Data = {
    needLimit: 1,
    total_quota: -1,
    site_assign_quota: []
  };
  var win = {
    editLimit: {
      init: function ({
        el, uid, title = "", data = Data, edit, callback
      } = {}) {
        dialogContext = el;
        user_id = uid;
        Data = data;
        frame_name = title;
        isEdit = edit
        ad_id = data.ad_id;
        closeCallback = callback;
        Pane.init();
      }
    }
  }
  $.extend(content, win);
})(jQuery, StyledList, PopupDialog, newSelect, sucai);
