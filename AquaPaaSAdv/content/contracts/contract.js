var contract = (function ($, Dialog, DatePicker) {
  const DefaultData = {
    contract_id: "",
    ad_content: "",
    contract_type: "0",
    first_party: "",
    second_party: "",
    contract_begintime: [new Date().toISOString().split("T")[0], String((new Date().getTimezoneOffset() * -1) / 60).padStart(2, "0") + "00"].join("+"),
    contract_endtime: [new Date().toISOString().split("T")[0], String((new Date().getTimezoneOffset() * -1) / 60).padStart(2, "0") + "00"].join("+"),
    contract_file_url: ""
  };
  let closeCallback, Data;
  let Pane = {
    dialog: null,
    widgets: {},
    init() {
      this.initDialog();
    },
    initDialog() {
      let opt = {
        url: 'content/contracts/contract.html',
        width: 760,
        height: 440,
        context: this,
        ajaxOnEachCreate: true,
        callback: function () {
          $(".contract ._dialog_title_label").html(i18n("CONTRACTS_DIALOG_" + Pane.status.toUpperCase()));
          $(".contract ._dialog_foot ._btn.confirm").html(i18n("CONTRACTS_DIALOG_BTN_CONFIRM_" + Pane.status.toUpperCase()));
          this.bindEvents();
          this.initDialogSelect();
          this.initWidgets();
          this.loadData();
        }
      }
      this.dialog = new Dialog(opt);
      this.dialog.create();
    },
    // 添加合同类型下拉框
    initDialogSelect() {
      $("#recognition_select").html('');
      if(Data.contract_type == "0"){
        $('.contract._dialog ._dialog_body #contract_info').css({'display': 'block'});
      }
      if(my.paas.user_type == '1'){  //只有运营商，才允许创建线下合同;
        this.select_data = [{
          key: 0,
          value: i18n("CONTRACTS_DIALOG_COMMONCONTRACTS")
        }, {
          key: 1,
          value: i18n("CONTRACTS_DIALOG_OFFLINECONTRACTS")
        }];
      } else {
        this.select_data = [{
          key: 0,
          value: i18n("CONTRACTS_DIALOG_COMMONCONTRACTS")
        }];
      }
      var style = {
        width: 230,
        height: 30,
        background: "#FFFFFF",
        selectbackground: "#FFFFFF",
      };
      this.dialog_select = new newSelect('#contract_type', Pane.select_data, style, function(key) {
        Data.contract_type = JSON.stringify(Pane.select_data[key].key);
        if(Data.contract_type == "0"){
          $('.contract._dialog ._dialog_body #contract_info').css({'display': 'block'});
        } else {
          $('.contract._dialog ._dialog_body #contract_info').css({'display': 'none'});
        }
      })
    },
    initWidgets() {
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
      this.widgets.active_time_date = new DatePicker({
        containerId: "active_time",
        calendarStyles: calendarStyles,
        editable: true,
        dateInputStyles: {
          borderColor: '#d3d3d3'
        },
        iconImage: 'image/adPolicyManage/datePickerIcon.png'
      });
      this.widgets.active_time_date.onChange = function (value) {
        let dateStr = this.getDateStr();
        let timezone = ((new Date().getTimezoneOffset() * -1) / 60)
        Data.contract_begintime = dateStr + "+" + String(timezone).padStart(2, "0") + "00";
      }

      this.widgets.expire_time_date = new DatePicker({
        containerId: "expire_time",
        calendarStyles: calendarStyles,
        editable: true,
        dateInputStyles: {
          borderColor: '#d3d3d3'
        },
        iconImage: 'image/adPolicyManage/datePickerIcon.png'
      });
      this.widgets.expire_time_date.onChange = function () {
          let dateStr = this.getDateStr();
          let timezone = ((new Date().getTimezoneOffset() * -1) / 60);
          let endtime = dateStr + "+" + String(timezone).padStart(2, "0") + "00";
          if(endtime.localeCompare(Data.contract_begintime) == -1) {
            alert(i18n("CONTRACTS_ADD_HINT1"));
            Data.contract_endtime = "";
          } else {
          Data.contract_endtime = endtime;
          }
        }
        //uploader
      var that = this;
      my_aqua.init(storage_username, storage_password, storage_domain);
      var container = new my_aqua.folder({
        path: 'contract'
      });
      if (!container.checkExist()) {
        container.create();
      }
      this.widgets.upload = new inputFile(my_aqua);
      this.widgets.upload.init({
        selectFileBottom: "#file_uploader",
        uploadPath: "contract",
        accept: "application/pdf",
        startUploadBottom: true
      }, {
        _isExistFun: function (file_name) {
          console.log("exist");
          let url = my_aqua.restRoot + my_aqua.netdiskRoot + "/contract/" + file_name;
          if(url.slice(url.lastIndexOf('.')) == '.pdf'){
            $(".contract ._dialog_body #contract_file_url").val(url);
            Data.contract_file_url = url;
          } else {
            alert(i18n("ADV_SYSUSER_SHANGCHUANZIZHIWENJIAN_ERROR"));
          }
        },
        _getfilenamefun: function (name) {
          console.log("getname");
          this.startuploadFile();
        },
        _startfun: function (file_name, updateSize, fileSize, self) {
          var console_message = file_name + "start";
          console.log(console_message);
        },
        _progressfun: function (file_name, updateSize, fileSize, self) {
          var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
          console.log(console_message);
        },
        _errorfun: function (e) {
          console.error(e);
        },
        _endfun: function (file_name, updateSize, fileSize, file_url, self) {
          console.log("end");
          let url = file_url.replace(/^..\/aqua\/rest\/cdmi/, my_aqua.restRoot);
          if(url.slice(url.lastIndexOf('.')) == '.pdf'){
            $(".contract ._dialog_body #contract_file_url").val(url);
            Data.contract_file_url = url;
          } else {
            alert(i18n("ADV_SYSUSER_SHANGCHUANZIZHIWENJIAN_ERROR"));
          }
        }
      });
    },
    bindEvents() {
      $(".contract ._dialog_body #contract_id").bind("keyup", (e) => {
        let val = $(e.target).val();
        Data.contract_id = val;
      });
      $(".contract ._dialog_body #ad_content").bind("keyup", (e) => {
        let val = $(e.target).val();
        Data.ad_content = val;
      });
      if(!Data.contract_type){
        Data.contract_type = DefaultData.contract_type;
      } 
      $(".contract ._dialog_body #first_party").bind("keyup", (e) => {
        let val = $(e.target).val();
        Data.first_party = val;
      });
      $(".contract ._dialog_body #second_party").bind("keyup", (e) => {
        let val = $(e.target).val();
        Data.second_party = val;
      });
      $(".contract ._dialog_foot .confirm._btn").bind("click", () => {
        API.contract(() => {
          Pane.dialog.close();
          closeCallback && closeCallback();
        });
      });
      $(".contract ._dialog_foot .cancel._btn").bind("click", () => {
        Pane.dialog.close();
      });
    },
    loadData() {
      $(".contract #contract_id").val(Data.contract_id);
      $(".contract #ad_content").val(Data.ad_content);
      Pane.dialog_select.setValue(Pane.select_data[JSON.parse(Data.contract_type)].value);
      $(".contract #first_party").val(Data.first_party);
      $(".contract #second_party").val(Data.second_party);
      let beginday = Data.contract_begintime.split("+")[0];
      Pane.widgets.active_time_date.jqDateInput.val(beginday);
      let endday = Data.contract_endtime.split("+")[0];
      Pane.widgets.expire_time_date.jqDateInput.val(endday);
      $(".contract #contract_file_url").val(Data.contract_file_url);
    }
  };
  let API = {
    contract(callback) {
        if(!this.checkValidate()) {
          alert(i18n("CONTRACTS_ADD_HINT2"));
          return;
        }
        switch(Pane.status) {
        case "new":
          this.createContract(callback);
          break;
        case "edit":
          this.updateContract(callback);
          break;
        default:

        }
      },
      createContract(callback) {
        Data.platform_id_list = [];
        if (my.paas.platform_current_id) {
          var platform_id = my.paas.platform_current_id
          for(var i = 0; i < platform_id.length; i++){
            platform_id =platform_id.replace('[','').replace(']','').replace('"','');
          }
          if(platform_id.split(',').length > 0){  //使用","将平台id隔开
            Data.platform_id_list = platform_id.split(',');
          } else {
            Data.platform_id_list.push(platform_id);
          }
        }
        $.ajax({
          type: "Post",
          url: paasHost + paasAdvDomain + "/ads/contract?user_id=" + my.paas.user_id + "&user_type=" + my.paas.user_type + "&user_name=" + my.paas.user_name,
          async: true,
          data: JSON.stringify(Data),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }).always((resp, status, xhr) => {
          if(status == "success") {
            callback && callback();
          }
        })
      },
      updateContract(callback) {
        $.ajax({
          type: "Put",
          url: paasHost + paasAdvDomain + "/ads/contract/" + Data.id + "?user_id=" + my.paas.user_id + "&user_name=" + my.paas.user_name,
          async: true,
          data: JSON.stringify(Data),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }).always((resp, status, xhr) => {
          if(status == "success") {
            callback && callback();
          } else {
            alert(decodeURIComponent(resp.getResponseHeader("x-aqua-error-message")))
          }
        })
      },
      checkValidate() {
        let valid = false;
        if(!isNullorEmpty(Data.contract_id && Data.ad_content && Data.contract_type && Data.first_party && Data.second_party && Data.contract_begintime && Data.contract_endtime && Data.contract_file_url)) {
          valid = true;
        }
        return valid;
      },
      uploadAquaFile() {}

  };
  let Model = {};
  return {                                                                                                                                                         
    init({
      data = DefaultData, status, closeFn
    } = {
      data: DefaultData,
      status: "new"
    }) {
      Data = JSON.parse(JSON.stringify(data));
      closeCallback = closeFn;
      Pane.status = status;
      Pane.init();
    }
  }
})(jQuery, PopupDialog, DatePicker)
