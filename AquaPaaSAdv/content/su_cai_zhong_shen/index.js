(function(global, factory){
  global.SuCaiZhongShen = factory(jQuery, StyledList, UserInfo);
  var app = new SuCaiZhongShen();
})(this, (function($, Table, UserInfo) {
  var Pane = {
    table: null,
    search: {
      type: 'img',   //img：图文；video：视频；subtitle：字幕；
      state: 'third',
      psdName: ''
    },
    isRefreshTable: { //焦点记忆
      isTrue: false,
      page: 0
    },
    init() {
      if(SUCAI_ENHANCE) {
        Pane.search.state = 'second';
      };
      this.initPage();
      this.bindBtnEvents();
      this.initTable();
    },
    initPage() {   //type 聚焦
      var audit_type = Pane.search.type;
      $('#su_cai_zhong_shen .psdAuditMenu .policy_type div[name=type]').removeClass('focus');
      $('#su_cai_zhong_shen .psdAuditMenu .policy_type div[name=type]#psdEndAudit_policy_' + audit_type).addClass('focus');
    },
    // 事件绑定
    bindBtnEvents() {
      // type 按钮切换
      $('#su_cai_zhong_shen .psdAuditMenu .policy_type div[name=type]').click(function () {
        $("#su_cai_zhong_shen .psdAuditMenu .policy_type div[name=type]").removeClass("focus");
        $(this).addClass("focus");
        switch ($(this).index()) {
          case 0:
            Pane.search.type = 'img';
            break;
          case 1:
            Pane.search.type = 'video';
            break;
          case 2:
            Pane.search.type = 'subtitle';
            break;
          default:
            break;
        }
        Pane.initTable();
      });
      $('#su_cai_zhong_shen #psdEndAudit_policy_searchInput').unbind().bind("keyup", (e) => {   // 查询框回车查询
        let key = e.keyCode||e.which;
        if (key == 13) {
          Pane.search.psdName = $(e.target).val();
          Pane.initTable();
        }
      });
      $('#su_cai_zhong_shen #psdEndAudit_policy_searchBtn').unbind().bind("click", (e) => {  // 查询按钮查询
        Pane.search.psdName = $('#su_cai_zhong_shen #psdEndAudit_policy_searchInput').val();
        Pane.initTable();
      });
      // 列表操作
      $('#su_cai_zhong_shen #psdEndAuditTable')
      .on('click', '.username', (e) => {    //创建者
        var user_id = $(e.target).data('id');
        var user_name = $(e.target).html();
        var dialog = new UserInfo({
          id: user_id,
          type: user_id == my.paas.user_id ? 'self': 'others',
          name: user_name,
          scope: e.target
        })
      })
      .on('click', '.view', (e) => {    //查看
        let index = $(e.target).data("index");
        var app = new PreviewModel();
        app.previewSuCai(API.data[index].ad_id);
      })
      .on('click', '.audithis', (e) => {    //审核历史
        let index = $(e.target).data("index");
        var data = API.data[index]
        var dialog = new AuditHis({
          type: 'ad_item',
          id: data.ad_id
        });
      })
      .on('click', '.deney', (e) => {    //否决
        let index = $(e.target).data("index");
        var afterDrawn = () => {
          $(".auditDialog .auditDialogCloseBtn, .auditDialog .auditDialogCancelBtn").click(function () {
            dialog.close();  //关闭dialog
          });
          $(".auditDialog .auditDialogSubmitBtn").click(function () {
            API.sendDeneyMsg(index, () => {
              dialog.close();  //关闭dialog
              Pane.isRefreshTable = {
                isTrue: true,
                page: String(Pane.table.currPage)
              };
              Pane.initTable();
            });
          });
        };
        var dialog = new PopupDialog({
          url: 'content/su_cai_chu_shen/auditDeneyDialog.html',
          width: 760,
          height: 342,
          context: this,
          callback: afterDrawn
        });
        dialog.open();
      })
      .on('click', '.pass', (e) => {    //通过
        let index = $(e.target).data("index");
        API.passAudit(index, () => {
          Pane.isRefreshTable = {
            isTrue: true,
            page: String(Pane.table.currPage)
          };
          Pane.initTable();
        });
      })
    },
    // 加载表格
    initTable() {
      var titles = [
        [{
          label: i18n("PSDAUDIT_TABLE_PSDNAME")
        }, {
          label: i18n("PSDAUDIT_TABLE_CREATOR")
        }, {
          label: i18n("PSDAUDIT_TABLE_SIZE")
        }, {
          label: i18n("PSDAUDIT_TABLE_WEIGHT")
        }, {
          label: i18n("PSDAUDIT_TABLE_OPERATION")
        }],
        [{
          label: i18n("PSDAUDIT_TABLE_PSDNAME")
        }, {
          label: i18n("PSDAUDIT_TABLE_CREATOR")
        }, {
          label: i18n("PSDAUDIT_TABLE_LENGTH")
        }, {
          label: i18n("PSDAUDIT_TABLE_WEIGHT")
        }, {
          label: i18n("PSDAUDIT_TABLE_OPERATION")
        }],
        [{
          label: i18n("PSDAUDIT_TABLE_PSDNAME")
        }, {
          label: i18n("PSDAUDIT_TABLE_CREATOR")
        }, {
          label: i18n("SUCAI_ZIMUNEIRONG")
        }, {
          label: i18n("PSDAUDIT_TABLE_OPERATION")
        }],
      ];
      columnsWidths = [
        [0.5, 0.1, 0.15, 0.1, 0.15],
        [0.5, 0.1, 0.15, 0.1, 0.15],
        [0.25, 0.1, 0.5, 0.15]
      ];
      var title_list = [], columnsWidth_list = [];
      if(Pane.search.type  == 'img'){
        title_list = titles[0];
        columnsWidth_list = columnsWidths[0];
      } else if(Pane.search.type == 'video'){
        title_list = titles[1];
        columnsWidth_list = columnsWidths[1];
      } else if(Pane.search.type  == 'subtitle'){
        title_list = titles[2];
        columnsWidth_list = columnsWidths[2];
      }
      var styles = {
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
        columnsWidth: columnsWidth_list
      };
      Pane.table = new Table({
        containerId: 'psdEndAuditTable',
        rows: 11,
        columns: title_list.length,
        titles: title_list,
        styles: styles,
        listType: 1,
        async: true,
      });
      Pane.table.getPageData = API.getList;
      Pane.table.create();
      //添加焦点记忆功能，判断是否为修改刷新列表
      var isEditObj = Pane.isRefreshTable;
      if(isEditObj && isEditObj.isTrue === true) {
        isEditObj.isTrue = false;
        var cur_page = Pane.table.pagesLmt < parseInt(isEditObj.page) ? Pane.table.pagesLmt : parseInt(isEditObj.page)
        Pane.table.changePage(cur_page);
      }
    }
  };
  var API = {
    data: [],
    // 获取数据
    getList(pageNum, callback) {
      let url = paasHost + paasAdvDomain + "/ads/aditem/aditems";
      let method = "GET";
      let urlParam = [];
          urlParam.push("user_id=" + my.paas.user_id);
          urlParam.push("user_type=" + my.paas.user_type);
          urlParam.push("access_token=" + my.paas.access_token);
          urlParam.push("app_key=" + paasAppKey);
          urlParam.push("timestamp=" + new Date().toISOString());
          urlParam.push("type=" + Pane.search.type);
          urlParam.push("state=" + Pane.search.state + "_audit:prepare_audit");
          urlParam.push("name=" + Pane.search.psdName);
          urlParam.push("start=" + (pageNum - 1) * this.rowsLmt);
          urlParam.push("end=" + (pageNum* this.rowsLmt - 1));
          if (my.paas.platform_current_id) {
            urlParam.push("platform_id_list=" + my.paas.platform_current_id);
          }
        url += '?' + urlParam.join('&');
      $.ajax({
        type: method,
        url: url,
        async: false,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
        }
      }).done(function (resp, status, xhr) {
        if(status == 'success'){
          API.data = resp;
          Pane.table.onTotalCount(parseInt(xhr.getResponseHeader("x-aqua-total-count")));
          callback&&callback(Model.table(resp));
        } else {
          callback&&callback([]);
        }
      });
    },
    // 否决并发送原因
    sendDeneyMsg (index, callback) {
      var msg = $(".auditDialog .auditDialogDeneyReason").val();
      let url = paasHost + paasDomain + "/auditflow/instance/";
      let method = "PUT";
      let ad_item = "ad_item";
      if(SUCAI_ENHANCE){
        ad_item = "ad_item_2";
      }
      let id = API.data[index].ad_id;
      let urlParam = [];
          urlParam.push("user_id=" + my.paas.user_id);
          urlParam.push("user_type=" + my.paas.user_type);
          urlParam.push("access_token=" + my.paas.access_token);
          urlParam.push("app_key=" + paasAppKey);
          urlParam.push("timestamp=" + new Date().toISOString());
      url += ad_item + '/' + id + '?' + urlParam.join('&');
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify({
          "no": "2",
          "status": "deprecated",
          "reason": "failure reason " + msg
        })
      })
      .done((resp, status, xhr) => {
        if(status == 'success'){
          callback&&callback();
        } else {
          return;
        }
      });
    },
    // 通过审核
    passAudit(index, callback) {
      var confirm_result = confirm(i18n("ADPOLICYAUDIT_AUDITPASSHINT"));
      if(!confirm_result) {
        return;
      }
      let url = paasHost + paasDomain + "/auditflow/instance/";
      let method = "PUT";
      let ad_item = "ad_item";
      if(SUCAI_ENHANCE){
        ad_item = "ad_item_2";
      }
      let id = API.data[index].ad_id;
      let urlParam = [];
          urlParam.push("user_id=" + my.paas.user_id);
          urlParam.push("user_type=" + my.paas.user_type);
          urlParam.push("access_token=" + my.paas.access_token);
          urlParam.push("app_key=" + paasAppKey);
          urlParam.push("timestamp=" + new Date().toISOString());
      url += ad_item + '/' + id + '?' + urlParam.join('&');
      $.ajax({
        type: "PUT",
        url: url,
        async: true,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "x-aqua-sign": getPaaS_x_aqua_sign("PUT", url)
        },
        data: JSON.stringify({
          "no": "2",
          "status": "passed"
        })
      })
      .done((resp, status, xhr) => {
        if(status == 'success'){
          callback&&callback()
        }
      });
    }
  };
  var Model = {
    table(data) {
      var listData = [];
      for(var i = 0; i < data.length; i++) {
        if(typeof data[i] === "undefined") {
          continue;
        }
        if(data[i].type == "img" && Pane.search.type != "img") {
          continue;
        } else if(data[i].type == "video" && Pane.search.type != "video") {
          continue;
        } else if(data[i].type == "subtitle" && Pane.search.type != "subtitle") {
          continue;
        }
        if((typeof data[i].name !== "undefined" ? data[i].name : "").indexOf(Pane.search.psdName) == -1) {
          continue;
        }
        var row = [];
        row.push({
          label: data[i].name
        });
        var username = '<a class="username" style="text-decoration: underline;cursor: pointer;color: #3c94bb;" data-id="' + data[i].user_id + '">' + (data[i].user_name || '') + '</a>'
        row.push({
          label: username
        });
        row.push({
          label: data[i].type === "subtitle" ? ("<div title=\"" + data[i].subtitle_content + "\">" + data[i].subtitle_content + "</div>") : (data[i].type === "img" ? data[i].width + "x" + data[i].height : data[i].size)
        });
        if(data[i].type != "subtitle") {
          row.push({
            label: data[i].level
          });
        }
        var op_view = "<span class='view' data-index=" + i + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_VIEW") + "</span>"
        if(my.paas.user_type == "1"){
          var op_audithis = "<span class='audithis' data-index=" + i + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS") + "</span>"
          var op_deney = "<span class='deney' data-index=" + i + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_DENEY") + "</span>"
          var op_pass = "<span class='pass' data-index=" + i + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_PASS") + "</span>"
        } else {
          var op_audithis = "<span style='cursor:default;color:#797979'>" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS") + "</span>"
          var op_deney = "<span style='cursor:default;color:#797979'>" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_DENEY") + "</span>"
          var op_pass = "<span style='cursor:default;color:#797979'>" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_PASS") + "</span>"
        }
        row.push({
          label: [op_view, op_audithis, op_deney, op_pass].join('')
        });
        switch((typeof data[i].state !== "undefined" ? data[i].state : "").indexOf(":") !== -1 ? data[i].state.split(":")[0] : data[i].state) {
          case "second_audit":
            if(Pane.search.state == 'second') {
              listData.push(row);
            }
            break;
          case "third_audit":
            if(Pane.search.state == 'third') {
              listData.push(row);
            }
            break;
          default:
        }
      }
      return listData;
    }
  };
  var frame = function (){
    Pane.init();
  };
  return frame;
}))
