var jobManage = (function ($) {

  var TaskDefinitions = [];

  var option_type_list = {
    add_del_callback: function () {
    },
    init: function (container, parameters, value) {
      var that = this;
      that.container = container;
      that.parameters = parameters;
      that.storage = value || [];
      that.initList();
      that.bindEvent();
    },
    initInTaskList: function (container, parameters, value) {
      var that = this;
      if (!Array.isArray(value))return;
      that.container = container;
      that.parameters = parameters;
      that.storage = value;
      that.type = "tasklist";
      that.initList();
    },
    initList: function () {
      var that = this;
      that.addItem_subOptions = [];
      that.container.html("");
      var i = 0;
      var length = that.storage.length;
      for (i = 0; i < length; i++) {
        var data = that.storage[i];
        that.initItem(data, i);
      }
      that.initAddItem();
      that.add_del_callback();
    },
    initItem: function (data, index) {
      var that = this;
      var SingleItem = $('<div></div>');
      SingleItem.addClass("option_type_list");
      that.container.append(SingleItem);

      var content = $('<div></div>');
      content.addClass("content");
      SingleItem.append(content);

      var i = 0;
      var parameter;
      for (i = 0; i < that.parameters.length; i++) {
        parameter = that.parameters[i];
        var div = $('<div class="jobManage_option_halfRow"></div>');
        content.append(div);
        var subDiv = $('<div class="jobManage_option_label" style="padding-left:11px;"></div>');
        div.append(subDiv);
        var value = data[parameter.pname]

        if (that.type == "tasklist") {
          if (typeof value == "undefined") {
            subDiv.text(parameter.desc + i18n("JOBMANAGE_NOVALUE"));
            subDiv.attr('title', parameter.desc + i18n("JOBMANAGE_NOVALUE"));
          } else {
            subDiv.text(parameter.desc + "-" + value);
            subDiv.attr('title', parameter.desc + "-" + value);
          }
        } else {
          if (typeof value !== "undefined") {
            subDiv.text(data[parameter.pname]);
            subDiv.attr('title', data[parameter.pname]);
          }
        }
      }
      if (that.type == "tasklist")return;

      var delButton = $('<div data-opr="del" data-index="' + index + '"><img src="./images/jobManage/del.png" alt=""></div>');
      delButton.addClass("option_list_button");

      SingleItem.append(delButton);
    },
    initAddItem: function () {
      var that = this;
      if (that.type == "tasklist")return;
      var SingleItem = $('<div></div>');
      SingleItem.addClass("option_type_list");
      that.container.append(SingleItem);

      var content = $('<div></div>');
      content.addClass("content");
      SingleItem.append(content);

      var i = 0;
      var parameter;
      for (i = 0; i < that.parameters.length; i++) {
        var parameter = that.parameters[i];
        that.addSubOption(parameter, content);
      }

      var button = $('<div data-opr="add"><img src="./images/jobManage/add.png" alt=""></div>');
      button.addClass("option_list_button");
      SingleItem.append(button);
    },
    addSubOption: function (parameter, Container) {
      var that = this;
      //subContainer
      var SubOptionContainer = $('<div></div>');
      SubOptionContainer.attr('title', parameter.desc);
      SubOptionContainer.addClass("jobManage_option_halfRow");
      var OptionRequired = $('<span class="regist-star">*</span>')
      SubOptionContainer.append(OptionRequired);
      Container.append(SubOptionContainer);

      var result;
      switch (parameter.ptype) {
        case "string":
          result = that.addInput(parameter, SubOptionContainer);
          break;
        case "enum":
          result = that.addSelect(parameter, SubOptionContainer);
          break;
        case "date":
          result = that.addDate(parameter, SubOptionContainer);
          break;
        case "init":
          result = that.addInput(parameter, SubOptionContainer);
        case "list":
          alert(i18n("JOBMANAGE_ALERT1"));
          throw(new Error("页面暂且不支持list模块内嵌list模块"));
          break;
        default:
          break;
      }
      that.addItem_subOptions.push(result);
    },
    addInput: function (parameter, OptionContainer) {
      var that = this;
      var OptionInput = $('<input class="input" style="width:240px" type="text"/>');
      OptionInput.attr('placeholder', parameter.desc);
      OptionContainer.append(OptionInput);

      var obj = {
        pname: parameter.pname,
        required: parameter.required,
        container: OptionContainer,
        get: function () {
          return OptionInput.val();
        }
      }
      return obj;
    },
    addSelect: function (parameter, OptionContainer) {
      var that = this;
      var OptionDiv = $('<div></div>');
      OptionContainer.append(OptionDiv);

      var values = JSON.parse(JSON.stringify(parameter.values));
      var select_options = [];
      for (var key in values) {
        select_options.push({
          key: key,
          value: values[key]
        })
      }
      var Select = new newSelect(OptionDiv, [], {
        width: 240,
        height: 32,
        background: "white",
        fontSize: 14,
        liFontSize: 14,
        color: "rgb(121,121,121)",
        liColor: "rgb(121,121,121)",
        selectbackground: "white",
        headerBorder: "1px solid rgb(198,198,198)",
        liBorderColor: "rgb(198,198,198)",
        openIconUrl: "./uiWidget/images/open1.png",
        closeIconUrl: "./uiWidget/images/close1.png",
      });
      Select.updateSelectOptions(select_options);

      var obj = {
        pname: parameter.pname,
        required: parameter.required,
        container: OptionContainer,
        get: function () {
          return Select.getValue();
        }
      };
      return obj;
    },
    addDate: function (parameter, OptionContainer) {
      var that = this;
      var id = "taskDialog_option_" + parameter.pname;
      var OptionDiv = $('<div id="' + id + '" style="color: rgb(121,121,121);width:240px;z-index: 2"></div>');
      OptionContainer.append(OptionDiv);

      var calendarStyles = {
        width: 250,
        navTitleHeight: 25,
        navTitleBgColor: 'rgb(84,190,245)',
        datesViewHeight: 160,
        datesViewGridColor: 'rgb(226,226,226)',
        datesViewCellColor: 'rgb(254,254,254)',
        weekdaysHeight: 22,
        weekdaysColor: 'rgb(74,174,237)',
        currMonthColor: 'rgb(121,121,121)',
        nonCurrMonthColor: 'rgb(200,200,200)',
        align: 'right'
      };
      var calendar = new DatePicker({
        containerId: id,
        calendarStyles: calendarStyles,
        dateInputStyles: {
          width: 240,
          height: 32,
          borderColor: 'rgb(198,198,198)',
          borderWidth: '1',
        },
        editable: false
      });

      var obj = {
        pname: parameter.pname,
        required: parameter.required,
        container: OptionContainer,
        get: function () {
          return calendar.getDateStr();
        }
      };
      return obj;
    },
    bindEvent: function () {
      var that = this;
      that.container.on('click', 'div[data-opr]', function () {
        var opr = $(this);
        var type = opr.attr('data-opr');
        var index = parseInt(opr.attr('data-index'));
        switch (type) {
          case 'add':
            if (that.checkRequired()) {
              var result = that.getAddItem();
              that.storage.push(result);
              that.initList();
            }
            break;
          case 'del':
            that.storage.splice(index, 1);
            that.initList();
            break;
        }
      });
    },
    checkRequired: function () {
      var that = this;
      that.container.find(".jobManage_option_halfRow .regist-star").hide();
      var result = true;
      for (var i = 0; i < that.addItem_subOptions.length; i++) {
        var item = that.addItem_subOptions[i];
        if (item.required) {
          if (item.get() == "") {
            result = false;
            item.container.find(".regist-star").show();
          }
        }
      }
      return result;
    },
    getAddItem: function () {
      var that = this;
      var result = {};
      for (var i = 0; i < that.addItem_subOptions.length; i++) {
        var item = that.addItem_subOptions[i];
        var value = item.get();
        if (value) {
          result[item.pname] = (item.ptype == "init") ? parseInt(value) : value;
        }
      }
      return result;
    },
    get: function () {
      var that = this;
      return that.storage;
    },
  };

  function showMsgDialog(msg, callback) {
    var dialog = new OverlayDialog({
      url: 'content/userTag/msg-dialog.html',
      width: 470,
      height: 266,
      context: {},
      zIndex: 3000,
      id: 'user-admin-msg',
      callback: function () {
        $('#user-admin-msg-content').text(msg);
        $('#user-admin-msg-close').on('click', function () {
          dialog.close();
        });
        $('#user-admin-msg-cancel').on('click', function () {
          dialog.close();
        });
        $('#user-admin-msg-submit').on('click', function () {
          dialog.close();
          if (typeof callback == 'function') {
            callback();
          }
        });
      }
    });
    dialog.open();
  }

  var Main = {
    init: function () {
      var that = this;
      that.initParm();
      that.initModule();
      that.bindEvent();
      that.initTable();
    },
    initParm: function () {
      var that = this;
      that.options = {
        name: "",
        datePicker_start: null,
        datePicker_end: null,
      }
      that.data = [];
    },
    initModule: function () {
      var that = this;
      var calendarStyles = {
        width: 250,
        navTitleHeight: 25,
        navTitleBgColor: 'rgb(84,190,245)',
        datesViewHeight: 160,
        datesViewGridColor: 'rgb(226,226,226)',
        datesViewCellColor: 'rgb(254,254,254)',
        weekdaysHeight: 22,
        weekdaysColor: 'rgb(74,174,237)',
        currMonthColor: 'rgb(121,121,121)',
        nonCurrMonthColor: 'rgb(200,200,200)',
        align: 'right'
      };
      var dateInputStyles = {
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: '0',
        borderRadius: '5px',
        width: '143px',
      };
      that.options.datePicker_start = new DatePicker({
        containerId: 'jobManage_calendar_start',
        calendarStyles: calendarStyles,
        dateInputStyles: dateInputStyles,
        iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
        iconStyle: {
          left: 115
        },
        editable: true
      });
      that.options.datePicker_end = new DatePicker({
        containerId: 'jobManage_calendar_end',
        calendarStyles: calendarStyles,
        dateInputStyles: dateInputStyles,
        iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
        iconStyle: {
          left: 115
        },
        editable: true
      });
      that.options.datePicker_start.setCalendarDate = function(){
        var dateStr = this.jqDateInput.val();
        if(dateStr == ""){
          this.clear();
          this.onChange();
        }else{
          this.calendar.setCurrDate(this.parseDateStr(dateStr));
          this.setInputDate();
        }
      };
      that.options.datePicker_end.setCalendarDate = function(){
        var dateStr = this.jqDateInput.val();
        if(dateStr == ""){
          this.clear();
          this.onChange();
        }else{
          this.calendar.setCurrDate(this.parseDateStr(dateStr));
          this.setInputDate();
        }
      };

      var taskNameSelect_options = [{
        key: "",
        value: i18n("JOBMANAGE_TASKNAME")
      }]
      var taskNameSelect = new newSelect("#jobManage_select_taskName", [], {
        width: 111,
        height: 30,
        background: "#4FB8F1",
        fontSize: 12,
        liFontSize: 12,
        color: "white",
        liColor: "white",
        selectbackground: "#4FB8F1",
        headerBorder: "1px solid #0A85C7",
        liBorderColor: "#0A85C7",
        openIconUrl: "./uiWidget/images/open4.png",
        closeIconUrl: "./uiWidget/images/close4.png",
      });
      taskNameSelect.updateSelectOptions(taskNameSelect_options);
      that.options.taskNameSelect = taskNameSelect;
      API.getTaskDefinitions(function (data) {
        var result = data;
        TaskDefinitions = data;
        result = data.map(function (item) {
          return {
            key: item.tname,
            value: item.tname
          }
        });
        taskNameSelect_options = taskNameSelect_options.concat(result);
        taskNameSelect.updateSelectOptions(taskNameSelect_options);
      });

      var isTimingSelect_options = [{
        key: "",
        value: i18n("JOBMANAGE_TIMEORNOTTIME_ALL")
      }, {
        key: "1",
        value: i18n("JOBMANAGE_TIMETYPE")
      }, {
        key: "0",
        value: i18n("JOBMANAGE_NOTTIMETYPE")
      },]
      var isTimingSelect = new newSelect("#jobManage_select_isTiming", [], {
        width: 125,
        height: 30,
        background: "#4FB8F1",
        fontSize: 12,
        liFontSize: 12,
        color: "white",
        liColor: "white",
        selectbackground: "#4FB8F1",
        headerBorder: "1px solid #0A85C7",
        liBorderColor: "#0A85C7",
        openIconUrl: "./uiWidget/images/open4.png",
        closeIconUrl: "./uiWidget/images/close4.png",
      });
      isTimingSelect.updateSelectOptions(isTimingSelect_options);
      that.options.isTimingSelect = isTimingSelect;

      var enableSelect_options = [{
        key: "",
        value: i18n("JOBMANAGE_ENABLE_OR_DISABLE_ALL")
      }, {
        key: "1",
        value: i18n("JOBMANAGE_ENABLE")
      }, {
        key: "0",
        value: i18n("JOBMANAGE_DISABLE")
      },]
      var enableSelect = new newSelect("#jobManage_select_startStatus", [], {
        width: 125,
        height: 30,
        background: "#4FB8F1",
        fontSize: 12,
        liFontSize: 12,
        color: "white",
        liColor: "white",
        selectbackground: "#4FB8F1",
        headerBorder: "1px solid #0A85C7",
        liBorderColor: "#0A85C7",
        openIconUrl: "./uiWidget/images/open4.png",
        closeIconUrl: "./uiWidget/images/close4.png",
      });
      enableSelect.updateSelectOptions(enableSelect_options);
      that.options.enableSelect = enableSelect;

      var typeSelect_options = [{
        key: "",
        value: i18n("JOBMANAGE_SHOWALLTYPE")
      }, {
        key: "sys",
        value: i18n("JOBMANAGE_JOBTYPE_SYS")
      }, {
        key: "user",
        value: i18n("JOBMANAGE_JOBTYPE_USER")
      }]
      var typeSelect = new newSelect("#jobManage_select_type", [], {
        width: 121,
        height: 30,
        background: "#4FB8F1",
        fontSize: 12,
        liFontSize: 12,
        color: "white",
        liColor: "white",
        selectbackground: "#4FB8F1",
        headerBorder: "1px solid #0A85C7",
        liBorderColor: "#0A85C7",
        openIconUrl: "./uiWidget/images/open4.png",
        closeIconUrl: "./uiWidget/images/close4.png",
      });
      typeSelect.updateSelectOptions(typeSelect_options);
      that.options.typeSelect = typeSelect;

    },
    bindEvent: function () {
      var that = this;
      $('#job_list_search').keyup(function (event) {
        if (event.keyCode == 13) {
          that.options.taskNameSelect.setKey("")
          that.options.name = $("#job_list_search").val();
          that.list_table.update();
        }
      });
      $("#job_list_search_handle").click(function () {
        that.options.taskNameSelect.setKey("")
        that.options.name = $("#job_list_search").val();
        that.list_table.update()
      });
      that.options.datePicker_start.onChange = that.options.datePicker_end.onChange = function () {
        that.list_table.update()
      }
      that.options.isTimingSelect.listenLiClick = that.options.enableSelect.listenLiClick = that.options.typeSelect.listenLiClick = function () {
        that.list_table.update()
      }
      that.options.taskNameSelect.listenLiClick = function (value) {
        $("#job_list_search").val("");
        that.options.name = value;
        that.list_table.update()
      }
      $('#jobManage_list_table').on('click', '.opr', function () {
        var opr = $(this);
        if (opr.parents('.opr_more').length > 0) {
          var $more = opr.parents('.opr_more');
          if ($more.hasClass('open')) {
            $more.removeClass('open');
          } else {
            $('.opr-more-open').removeClass('open');
            $more.addClass('open');
          }
        }
        var type = opr.attr('data-type');
        var index = opr.attr('data-id');
        var item = that.data[index];
        switch (type) {
          case 'view':
            jobDetailPage.load(item, true);
            break;
          case 'history':
            jobListPage.init({
              id: item.id,
              name: item.name,
            });
            break;
          case 'disable':
            showMsgDialog(i18n('JOBMANAGE_ALERT2') + i18n('JOBMANAGE_DISABLE') + '"' + item.name + '"' + i18n('JOBMANAGE_ALERT3'), function () {
              API.changeJobStatus({
                id: item.id,
                action: "disable",
              }, function (error, data) {
                if (error) {
                  var msg = JSON.parse(data);
                  showMsgDialog(i18n("JOBMANAGE_DISABLEFAILED") + msg.errormsg || "");
                } else {
                  that.list_table.refreshList();
                }
              })
            });
            break;
          case 'enable':
            showMsgDialog(i18n('JOBMANAGE_ALERT2') + i18n('JOBMANAGE_ENABLE') + '"' + item.name + '"' + i18n('JOBMANAGE_ALERT3'), function () {
              API.changeJobStatus({
                id: item.id,
                action: "enable",
              }, function (error, data) {
                if (error) {
                  var msg = JSON.parse(data);
                  showMsgDialog(i18n("JOBMANAGE_ENABLEFAILED") + msg.errormsg || "");
                } else {
                  that.list_table.refreshList();
                }
              })
            });
            break;
          case 'more':
            break;
          case 'edit':
            jobDetailPage.load(item);
            break;
          case 'reset':
            showMsgDialog(i18n('JOBMANAGE_ALERT2') + i18n('JOBMANAGE_RESET') + '"' + item.name + '"' + i18n('JOBMANAGE_ALERT3'), function () {
              API.changeJobStatus({
                id: item.id,
                action: "reset",
              }, function (error, data) {
                if (error) {
                  var msg = JSON.parse(data);
                  showMsgDialog(i18n("JOBMANAGE_RESETFAILED") + msg.errormsg || "");
                } else {
                  that.list_table.refreshList();
                }
              })
            });
            break;
          case 'del':
            if(item.last_run_time){
              var now = new Date();
              var pass = new Date(item.last_run_time);
              if(now.getTime() - pass.getTime() <= 2678400000){
                showMsgDialog(i18n('JOBMANAGE_ALERT4'));
                break;
              }
            }
            showMsgDialog(i18n('JOBMANAGE_ALERT2') + i18n('JOBMANAGE_DELETE') + '"' + item.name + '"' + i18n('JOBMANAGE_ALERT3'), function () {
              API.delJob(item.id, function (error, data) {
                that.list_table.refreshList();
              }, function(status, data){
                var msg = JSON.parse(data);
                showMsgDialog(i18n("JOBMANAGE_DELETEJOBFAILED") + status + " " + msg.errormsg || "");
              })
            });
            break;
          default:
            break;
        }
      });
      $('#jobManage_new_btn').click(function () {
        jobDetailPage.init();
      });
      window.dropdownHelper.addDropdownHandler(that);
      that.listCnt = $('#jobManage_list')[0];
    },
    handleDropdowns: function (target, delegate) {
      var self = this;
      if (self.listCnt != $('#jobManage_list')[0]) {
        window.dropdownHelper.removeDropdownHandler(self);
      } else {
        if ($(target).parents('.opr_more').length > 0) {
        } else {
          $('.opr_more').removeClass('open');
        }
      }
    },
    initTable: function () {
      var that = this;
      var title = [{
        label: i18n("JOBMANAGE_TYPE")
      }, {
        label: i18n("JOBMANAGE_JOBNAME")
      }, {
        label: i18n("JOBMANAGE_ENABLE_OR_DISABLE")
      }, {
        label: i18n("JOBMANAGE_TIMEORNOTTIME")
      }, {
        label: i18n("JOBMANAGE_LASTRUNTIME")
      }, {
        label: i18n("JOBMANAGE_OPR")
      }];
      var widths = [0.106, 0.146, 0.1, 0.11, 0.34, 0.17];
      var list_table = new StyledList({
        rows: 13,
        columns: title.length,
        containerId: 'jobManage_list_table',
        titles: title,
        listType: 1,
        async: true,
        data: [],
        styles: {
          columnsWidth: widths,
          borderColor: 'rgb(226,226,226)',
          borderWidth: 1,
          titleHeight: 31,
          titleBg: 'rgb(69,209,244)',
          titleColor: 'white',
          cellBg: 'white',
          evenBg: 'rgb(245,253,255)',
          cellColor: 'rgb(121,121,121)',
          footBg: 'white',
          footColor: 'rgb(121,121,121)',
          iconColor: 'rgb(0,153,203)',
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white'
        }
      });
      list_table.getPageData = function (page, callback) {
        var timezoneOffset = encodeURIComponent("+") + "0800";
        var calendar_start = $("#jobManage_calendar_start-datepicker-input").val();
        var calendar_end = $("#jobManage_calendar_end-datepicker-input").val();
        var option = {
          page: page - 1,
          rows: 13
        }
        var name = that.options.name;
        var repeated = that.options.isTimingSelect.getValue();
        var enable = that.options.enableSelect.getValue();
        var type = that.options.typeSelect.getValue();
        var begin_time = calendar_start?(calendar_start + "T00:00:00" + timezoneOffset) : "" ;
        var end_time = calendar_end?(calendar_end + "T23:59:59" + timezoneOffset) : "" ;
        if (name) {
          option.name = name
        }
        if (repeated) {
          option.repeated = repeated
        }
        if (enable) {
          option.enable = enable
        }
        if (type) {
          option.type = type
        }
        if (begin_time) {
          option.begin_time = begin_time
        }
        if (end_time) {
          option.end_time = end_time
        }
        API.getList(option, function (data) {
          var listData = that.formListDataForList(data);
          list_table.onTotalCount(data.allCount);
          that.data = data;
          callback(listData);
        })
      };
      list_table.create();
      that.list_table = list_table;
      $(window).on("resize", function () {
        list_table.resize();
      })
    },
    formListDataForList: function (data) {
      var that = this;
      var list_data = [];
      for (var i = 0; i < data.length; i++) {
        var arr = getSingleItem(i);
        list_data.push(arr);
      }
      return list_data;

      function getSingleItem(i) {
        var item = data[i]
        var arr1 = item["type"] || "";
        var arr2 = item["name"] || "";
        var arr3 = item["enable"] || "";
        if (typeof item["enable"] !== 'undefined') {
          if (item["enable"]) {
            arr3 = i18n("JOBMANAGE_ENABLE")
          } else {
            arr3 = i18n("JOBMANAGE_DISABLE")
          }
        } else {
          arr3 = i18n("JOBMANAGE_ENABLE")
        }
        var arr4 = item["schedule"] ? i18n("JOBMANAGE_TIMETYPE") :i18n("JOBMANAGE_NOTTIMETYPE") ;
        var arr5 = item["last_run_time"] || "";
        var arr6 = getSingleItemOperation(item, i);
        var arr;
        arr = [{
          label: arr1
        }, {
          label: arr2
        }, {
          label: arr3
        }, {
          label: arr4
        }, {
          label: arr5
        }, {
          label: arr6
        }];
        return arr;
      }

      function getSingleItemOperation(item, i) {
        var oprView = '<span class="opr" data-type="view" data-id="' + i + '">' + i18n('JOBMANAGE_VIEW') + '</span>';
        var oprHistory = '<span class="opr" data-type="history" data-id="' + i + '">' + i18n('JOBMANAGE_RUNHISTORY') + '</span>';
        var enable_show = item.schedule ? true : false;
        var oprDisable = '<span class="opr" data-type="disable" data-id="' + i + '" style="' + (enable_show ? '' : 'visibility: hidden') + '">' + i18n('JOBMANAGE_DISABLE') + '</span>';
        var oprEnable = '<span class="opr" data-type="enable" data-id="' + i + '"  style="' + (enable_show ? '' : 'visibility: hidden') + '">' + i18n('JOBMANAGE_ENABLE') + '</span>';
        var oprMore_detail = '<div class="opr_more_detail">' +
          '<div class="opr">' + i18n('JOBMANAGE_MORE') + '&nbsp;<img src="images/users/more_up_arrow.png">' + '</div>' +
          '<div class="opr" data-type="edit" data-id="' + i + '">' + i18n('JOBMANAGE_EDIT') + '</div>' +
          '<div class="opr" data-type="reset" data-id="' + i + '">' + i18n('JOBMANAGE_RESET') + '</div>' +
          '<div class="opr" data-type="del" data-id="' + i + '">' + i18n('JOBMANAGE_DELETE') + '</div>' +
          '</div>';
        var oprMore = '<div class="opr_more">' +
          '<span class="opr" data-type="more" data-id="' + i + '">' + i18n('JOBMANAGE_MORE') + '&nbsp;<img src="images/users/more_down_arrow.png">' + '</span>' + oprMore_detail;
        '</div>'
        var opr = oprView + oprHistory;
        if (typeof item["enable"] !== 'undefined') {
          if (item["enable"]) {
            opr = opr + oprDisable;
          } else {
            opr = opr + oprEnable;
          }
        } else {
          opr = opr + oprDisable;
        }
        opr = opr + oprMore;
        return opr;
      }

    },
    recover: function () {
      var that = this;
      $("#jobManage_list").show();
      $("#jobManage_task").hide();
      $("#jobManage .panel_top_search_box").show();
      $("#jobManage .panel_page_head_right").show();
      $("#panel_page_head_joblist").show();
      $("#panel_page_head_jobHistory").hide();
      that.list_table.refreshList();
      that.list_table.resize();
    },
  };

  var jobDetailPage = {
    init: function (callback) {
      var that = this;
      $("#jobManage_list").hide();
      $("#panel_page_head_joblist").show();
      $("#panel_page_head_jobHistory").hide();
      $("#jobManage .panel_top_search_box").hide();
      $("#jobManage .panel_page_head_right").hide();
      that.initParm();
      $.ajax({
        type: "GET",
        url: "content/jobManage/jobDetail/index.html",
        async: true
      }).done(function (resp) {
        var template = patchHTML(resp);
        $("#jobManage_task").empty();
        $("#jobManage_task").html($(template));
        $("#jobManage_task").show();
        $("#jobManage_task_savebutton").show();
        $("#jobManage_task_cancelbutton").show();
        that.initModule();
        that.bindEvent();
        that.taskList.init(that);
        callback && callback();
      });
    },
    load: function (item, readonly) {
      var that = this;
      that.init(function () {
        that.taskData = item;
        that.readonly = readonly ? true : false;
        that.edit = true;
        if (!that.readonly) {
          $("#jobManage_task_savebutton").hide();
          $("#jobManage_task_updatebutton").show();
        } else {
          $("#jobManage_task_savebutton").hide();
          $("#jobManage_task_updatebutton").hide();
        }
        that.set(item);
      });
    },
    initParm: function () {
      var that = this;
      that.options = {};
      that.taskData = {};
      that.readonly = false;
      that.edit = false;
    },
    initModule: function () {
      var that = this;

      var isTimingSelect_options = [{
        key: 1,
        value: i18n("JOBMANAGE_YES")
      }, {
        key: 0,
        value: i18n("JOBMANAGE_NO")
      }]
      var isTimingSelect = new newSelect("#job_isTiming", [], {
        width: 295,
        height: 34,
        background: "white",
        fontSize: 14,
        liFontSize: 14,
        color: "#797979",
        liColor: "#797979",
        selectbackground: "white",
        headerBorder: "1px solid #CECDCB",
        liBorderColor: "#CECDCB",
        openIconUrl: "./uiWidget/images/open1.png",
        closeIconUrl: "./uiWidget/images/close1.png",
      });
      isTimingSelect.updateSelectOptions(isTimingSelect_options);
      that.options.isTimingSelect = isTimingSelect;

      var taskTypeSelect_options = [{
        key: "chain",
        value: i18n("JOBMANAGE_CHAIN")
      }, {
        key: "simple",
        value: i18n("JOBMANAGE_SIMPLE")
      }]
      var taskTypeSelect = new newSelect("#job_taskType", [], {
        width: 148,
        height: 34,
        background: "white",
        fontSize: 14,
        liFontSize: 14,
        color: "#797979",
        liColor: "#797979",
        selectbackground: "white",
        headerBorder: "1px solid #CECDCB",
        liBorderColor: "#CECDCB",
        openIconUrl: "./uiWidget/images/open1.png",
        closeIconUrl: "./uiWidget/images/close1.png",
      });
      taskTypeSelect.updateSelectOptions(taskTypeSelect_options);
      that.options.taskTypeSelect = taskTypeSelect;

      var scheduleSelect_options = [{
        key: "crontab",
        value: i18n("JOBMANAGE_DINGSHIMOSHI")
      }, {
        key: "interval",
        value: i18n("JOBMANAGE_JIANGEMOSHI")
      }]
      var scheduleSelect = new newSelect("#job_schedule", [], {
        width: 295,
        height: 34,
        background: "white",
        fontSize: 14,
        liFontSize: 14,
        color: "#797979",
        liColor: "#797979",
        selectbackground: "white",
        headerBorder: "1px solid #CECDCB",
        liBorderColor: "#CECDCB",
        openIconUrl: "./uiWidget/images/open1.png",
        closeIconUrl: "./uiWidget/images/close1.png",
      });
      scheduleSelect.updateSelectOptions(scheduleSelect_options);
      that.options.scheduleSelect = scheduleSelect;

      $('#option_job_schedule_crontab .day .item').each(function (index, element) {
        var value = parseInt($(element).attr('data-value'));
        if (value == "")
          return;
        if (value % 2 == 1) $(element).attr('data-daytype', 'odd');
        if (value % 2 == 0) $(element).attr('data-daytype', 'even');
      });

      var schedule_interval_period_select_options = [{
        key: "minutes",
        value: i18n("JOBMANAGE_MINUTE_UNIT")
      }, {
        key: "seconds",
        value: i18n("JOBMANAGE_SECOND_UNIT")
      }, {
        key: "hours",
        value: i18n("JOBMANAGE_HOUR_UNIT")
      }, {
        key: "days",
        value: i18n("JOBMANAGE_DAY_UNIT")
      }];
      var schedule_interval_period_select = new newSelect("#option_job_schedule_interval_period", [], {
        width: 102,
        height: 34,
        background: "white",
        fontSize: 14,
        liFontSize: 14,
        color: "#797979",
        liColor: "#797979",
        selectbackground: "white",
        headerBorder: "1px solid #CECDCB",
        liBorderColor: "#CECDCB",
        openIconUrl: "./uiWidget/images/open1.png",
        closeIconUrl: "./uiWidget/images/close1.png",
      });
      schedule_interval_period_select.updateSelectOptions(schedule_interval_period_select_options);
      that.options.schedule_interval_period_select = schedule_interval_period_select;

      $("#task_list_container").mCustomScrollbar({
        theme: "light"
      });
      jQuery("#task_list_container" + " .mCSB_inside > .mCSB_container").css({
        "margin-right": "0px"
      })
    },
    bindEvent: function () {
      var that = this;
      $('#createNewTaskButton').unbind("click").click(function () {
        that.taskDialog.open(null, function (result) {
          that.taskList.addTask(result);
        });
      });
      that.options.isTimingSelect.listenLiClick = function (value) {
        if (value == "1") {
          $("#option_job_schedule").show();
          $("#option_job_schedule_crontab").show();
        } else {
          $("#option_job_schedule").hide();
          that.options.scheduleSelect.setKey('crontab')
          clearCrontab()
          clearInterval();
        }
      };
      that.options.scheduleSelect.listenLiClick = function (value) {
        if (value == "crontab") {
          $("#option_job_schedule_crontab").show();
          clearInterval();
        } else {
          $("#option_job_schedule_interval").show();
          clearCrontab()
        }
      };
      $('#option_job_schedule_crontab').on('click', '.month .item', function () {
        var item = $(this);
        var value = item.attr('data-value');
        item.toggleClass("selected")
      });
      $('#option_job_schedule_crontab').on('click', '.oddeven .item', function () {
        var item = $(this);
        var type = item.attr('data-type');
        item.toggleClass("selected");


        var odd_selected = $("#option_job_schedule_crontab .oddeven .item[data-type=odd]").hasClass("selected");
        var even_selected = $("#option_job_schedule_crontab .oddeven .item[data-type=even]").hasClass("selected");
        $('#option_job_schedule_crontab .day .item').removeClass("selected");
        odd_selected ? $('#option_job_schedule_crontab .day .item[data-daytype=odd]').addClass('selected') : $('#option_job_schedule_crontab .day .item[data-daytype=odd]').removeClass('selected')
        even_selected ? $('#option_job_schedule_crontab .day .item[data-daytype=even]').addClass('selected') : $('#option_job_schedule_crontab .day .item[data-daytype=even]').removeClass('selected')
      });
      $('#option_job_schedule_crontab').on('click', '.week .item', function () {
        var item = $(this);
        var value = item.attr('data-value');
        item.toggleClass("selected")
      });
      $('#option_job_schedule_crontab').on('click', '.day .item', function () {
        var item = $(this);
        var value = item.attr('data-value');
        if (value == "")return;
        item.toggleClass("selected");

        var odd_length = $('#option_job_schedule_crontab .day .item[data-daytype=odd].selected').size();
        var even_length = $('#option_job_schedule_crontab .day .item[data-daytype=even].selected').size();
        if (odd_length == 16) {
          $("#option_job_schedule_crontab .oddeven .item[data-type=odd]").addClass('selected');
        } else {
          $("#option_job_schedule_crontab .oddeven .item[data-type=odd]").removeClass('selected');
        }
        if (even_length == 15) {
          $("#option_job_schedule_crontab .oddeven .item[data-type=even]").addClass('selected');
        } else {
          $("#option_job_schedule_crontab .oddeven .item[data-type=even]").removeClass('selected');
        }
      });

      $("#jobManage_task_cancelbutton").click(function () {
        that.close();
      });
      $("#jobManage_task_savebutton").click(function () {
        if (that.check()) {
          var data = that.get();
          API.addJob(data, function () {
            that.close();
          }, function(status){
            showMsgDialog(i18n("JOBMANAGE_CREATEJOBFAILED") + status);
          })
        }
      });
      $("#jobManage_task_updatebutton").click(function () {
        if (that.check()) {
          var data = that.get();
          if (data.type == "sys") {
            data = {
              tasks: data.tasks
            }
          }
          if(data.name == that.taskData.name){
            delete data.name
          }
          API.updateJob(that.taskData.id, data, function () {
            that.close();
          }, function(status){
            showMsgDialog(i18n("JOBMANAGE_EDITJOBFAILED") + status);
          })
        }
      });
      function clearCrontab() {
        $('#option_job_schedule_crontab .item').removeClass('selected');
        $("#option_job_schedule_crontab").hide();
      }

      function clearInterval() {
        $('#option_job_schedule_interval_every').val('');
        that.options.schedule_interval_period_select.setKey("minutes");
        $("#option_job_schedule_interval").hide();
      }
    },
    close: function () {
      var that = this;
      $("#jobManage_task").empty();
      $("#jobManage_task").hide();
      that.initParm();
      Main.recover();
    },
    check: function () {
      $("#jobManage_task .regist-star").hide();
      var that = this;
      var result = true;
      var job_name = $("#job_name").val();
      if (job_name == "") {
        result = false;
        $("#option_job_name .regist-star").show();
      }
      var job_isTiming = that.options.isTimingSelect.getValue();
      if (job_isTiming == "1") {
        var job_schedule = that.options.scheduleSelect.getValue();
        if (job_schedule == "crontab") {
          var length = $('#option_job_schedule_crontab .item.selected').size();
          if (length == 0) {
            result = false;
            $("#option_job_schedule_crontab .regist-star").show();
          }
          var hour = $('#option_job_schedule_crontab_hour').val();
          var minute = $('#option_job_schedule_crontab_minute').val();
          if ((hour == "") || (minute == "")) {
            result = false;
            $("#option_job_schedule_crontab .regist-star").show();
          }
        } else {
          var job_schedule_interval_every = $("#option_job_schedule_interval_every").val();
          if (job_schedule_interval_every == "") {
            result = false;
            $("#option_job_schedule_interval .regist-star").show();
          }
        }
      }

      var job_taskType = that.options.taskTypeSelect.getValue();
      var taskList = that.taskList.get();
      if (taskList.length == 0) {
        result = false;
        $("#option_job_tasks .regist-star").show();
      }
      if (job_taskType == "chain") {
      } else {
        if (taskList.length > 1) {
          result = false;
          $("#option_job_taskType .regist-star").show();
          showMsgDialog(i18n('JOBMANAGE_ALERT5'));
        }
      }
      return result;
    },
    set: function (item) {
      var that = this;
      if (that.readonly) {
        $("#jobManage_task input.option_content_input").attr("readonly", "");
        $("#createNewTaskButton").hide();
        that.options.isTimingSelect.setDisable();
        that.options.scheduleSelect.setDisable();
        that.options.taskTypeSelect.setDisable();
        that.options.schedule_interval_period_select.setDisable();
        $('#option_job_schedule_crontab').unbind("click");
        $('#option_job_schedule_crontab .item').addClass("readonly")
      }
      if (item.type == "user") {
        $("#job_type").val(i18n("JOBMANAGE_JOBTYPE_USER"));
      } else if (item.type == "sys") {
        $("#job_type").val(i18n("JOBMANAGE_JOBTYPE_SYS"));
      } else {
        $("#job_type").val(item.type);
      }
      $("#job_name").val(item.name);
      if (item.schedule) {
        that.options.isTimingSelect.setKey("1")
        if (item.schedule.crontab) {
          $("#option_job_schedule_crontab").show();
          $("#option_job_schedule_interval").hide();
          that.options.scheduleSelect.setKey("crontab");
          var hour, minute, day_of_month, day_of_week, month_of_year;
          hour = (item.schedule.crontab.hour == "*") ? Array.apply(null, Array(24)).map(function (v, i) {
              return i;
            }).join(",") : item.schedule.crontab.hour;
          minute = (item.schedule.crontab.minute == "*") ? Array.apply(null, Array(60)).map(function (v, i) {
              return i;
            }).join(",") : item.schedule.crontab.minute;
          $("#option_job_schedule_crontab_hour").val(hour);
          $("#option_job_schedule_crontab_minute").val(minute);
          day_of_month = (item.schedule.crontab.day_of_month == "*") ? Array.apply(null, Array(31)).map(function (v, i) {
              return i + 1;
            }) : (function(){
              if(item.schedule.crontab.day_of_month){
                return item.schedule.crontab.day_of_month.split(",").map(function (item) {
                  return parseInt(item)
                })
              }else{
                return [];
              }
            })();
          day_of_week = (item.schedule.crontab.day_of_week == "*") ? Array.apply(null, Array(7)).map(function (v, i) {
              return i;
            }) : (function(){
              if(item.schedule.crontab.day_of_week){
                return item.schedule.crontab.day_of_week.split(",").map(function (item) {
                  return parseInt(item)
                })
              }else{
                return [];
              }
            })();
          month_of_year = (item.schedule.crontab.month_of_year == "*") ? Array.apply(null, Array(12)).map(function (v, i) {
              return i + 1;
            }) : (function(){
              if(item.schedule.crontab.month_of_year){
                return item.schedule.crontab.month_of_year.split(",").map(function (item) {
                  return parseInt(item)
                })
              }else{
                return [];
              }
            })();
          day_of_month.forEach(function (item) {
            $('#option_job_schedule_crontab .day .item[data-value=' + item + ']').addClass("selected");
          });
          day_of_week.forEach(function (item) {
            $('#option_job_schedule_crontab .week .item[data-value=' + item + ']').addClass("selected");
          });
          month_of_year.forEach(function (item) {
            $('#option_job_schedule_crontab .month .item[data-value=' + item + ']').addClass("selected");
          });
          var odd_length = $('#option_job_schedule_crontab .day .item[data-daytype=odd].selected').size();
          var even_length = $('#option_job_schedule_crontab .day .item[data-daytype=even].selected').size();
          if (odd_length == 16) {
            $("#option_job_schedule_crontab .oddeven .item[data-type=odd]").addClass('selected');
          } else {
            $("#option_job_schedule_crontab .oddeven .item[data-type=odd]").removeClass('selected');
          }
          if (even_length == 15) {
            $("#option_job_schedule_crontab .oddeven .item[data-type=even]").addClass('selected');
          } else {
            $("#option_job_schedule_crontab .oddeven .item[data-type=even]").removeClass('selected');
          }
        } else {
          $("#option_job_schedule_crontab").hide();
          $("#option_job_schedule_interval").show();
          that.options.scheduleSelect.setKey("interval");
          $("#option_job_schedule_interval_every").val(item.schedule.interval.every || "");
          that.options.schedule_interval_period_select.setKey(item.schedule.interval.period)
        }
      } else {
        that.options.isTimingSelect.setKey("0");
        $("#option_job_schedule").hide();
        $("#option_job_schedule_crontab").hide();
        $("#option_job_schedule_interval").hide();
      }
      if (item.tasks[0].type == "simple") {
        that.options.taskTypeSelect.setKey("simple");
      } else {
        that.options.taskTypeSelect.setKey("chain");
      }
      var taskListData = [];
      getTaskListData(item.tasks[0])
      that.taskList.load(that, taskListData, that.readonly);
      if (item.type == "sys") {
        $("#jobManage_task input.option_content_input").attr("readonly", "");
        that.options.isTimingSelect.setDisable();
        that.options.scheduleSelect.setDisable();
        that.options.taskTypeSelect.setDisable();
        that.options.schedule_interval_period_select.setDisable();
        $('#option_job_schedule_crontab').unbind("click");
        $('#option_job_schedule_crontab .item').addClass("readonly")
      }
      if (typeof item.timeout !== 'undefined') {
        $("#job_timeout").val(item.timeout);
      }
      function getTaskListData(data) {
        if (data.type == "simple") {
          taskListData.push(data.task);
        } else {
          data.tasks.forEach(function (task) {
            getTaskListData(task);
          })
        }
      }
    },
    get: function () {
      var that = this;

      var obj = {};
      if (!that.edit) {
        obj.type = "user";
      }
      var job_name = $("#job_name").val();
      obj.name = job_name;
      obj.tasks = [];

      var job_isTiming = that.options.isTimingSelect.getValue();
      if (job_isTiming == "1") {
        obj.schedule = {};
        var job_schedule = that.options.scheduleSelect.getValue();
        if (job_schedule == "crontab") {
          obj.schedule.crontab = {};
          var crontab_minute = $('#option_job_schedule_crontab_minute').val();
          var crontab_hour = $('#option_job_schedule_crontab_hour').val();
          if(crontab_minute){
            obj.schedule.crontab["minute"] = crontab_minute;
          }
          if(crontab_hour){
            obj.schedule.crontab["hour"] = crontab_hour;
          }
          var day_of_week = [];
          $('#option_job_schedule_crontab .week .item.selected').each(function (index, element) {
            day_of_week.push($(element).attr('data-value'));
          });
          var day_of_month = [];
          $('#option_job_schedule_crontab .day .item.selected').each(function (index, element) {
            day_of_month.push($(element).attr('data-value'));
          });
          var month_of_year = [];
          $('#option_job_schedule_crontab .month .item.selected').each(function (index, element) {
            month_of_year.push($(element).attr('data-value'));
          });
          if (day_of_week.length > 0) {
            obj.schedule.crontab.day_of_week = day_of_week.sort().join(",");
          }
          if (day_of_month.length > 0) {
            obj.schedule.crontab.day_of_month = day_of_month.sort().join(",");
          }
          if (month_of_year.length > 0) {
            obj.schedule.crontab.month_of_year = month_of_year.sort().join(",");
          }
        } else {
          var job_schedule_interval_every = $("#option_job_schedule_interval_every").val();
          obj.schedule.interval = {
            "every": job_schedule_interval_every,
            "period": that.options.schedule_interval_period_select.getValue(),
          };
        }
      }

      var job_taskType = that.options.taskTypeSelect.getValue();
      var taskList = that.taskList.get();
      if (job_taskType == "chain") {
        obj.tasks.push({
          "type": "chain",
          "tasks": []
        });
        taskList.forEach(function (item) {
          obj.tasks[0]["tasks"].push({
            "type": "simple",
            "task": item
          });
        })
      } else {
        obj.tasks.push({
          "type": "simple",
          "task": taskList[0]
        })
      }
      var job_timeout = $("#job_timeout").val();
      if(job_timeout){
        obj.timeout = parseInt(job_timeout)
      }
      return obj;
    },
    taskDialog: {
      open: function (data, callback) {
        var that = this;
        var taskDialog = new PopupDialog({
          url: 'content/jobManage/taskDialog/index.html',
          width: 725,
          height: 219,
          context: that,
          callback: function () {
            var taskName_options = []
            var taskNameSelect = new newSelect("#dialog_taskName", [], {
              width: 306,
              height: 32,
              background: "white",
              fontSize: 14,
              liFontSize: 14,
              color: "rgb(121,121,121)",
              liColor: "rgb(121,121,121)",
              selectbackground: "white",
              headerBorder: "1px solid rgb(198,198,198)",
              liBorderColor: "rgb(198,198,198)",
              openIconUrl: "./uiWidget/images/open1.png",
              closeIconUrl: "./uiWidget/images/close1.png",
            });
            taskNameSelect.updateSelectOptions(taskName_options);
            taskNameSelect.setDisable();
            that.taskNameSelect = taskNameSelect;

            if (TaskDefinitions.length > 0) {
              taskName_options = TaskDefinitions.map(function (item) {
                return {
                  key: item.cname,
                  value: item.tname
                }
              });
              taskNameSelect.updateSelectOptions(taskName_options);
              taskNameSelect.setAvailable();
              taskNameSelect.setKey(TaskDefinitions[0].cname)
              taskNameSelect.listenLiClick = function (key) {
                var result = TaskDefinitions.findIndex((value, index, arr) => {
                  return value.cname == key
                });
                that.initOptions(TaskDefinitions[result]);
              }
              that.initOptions(TaskDefinitions[0]);
            } else {
            }

            if(data){
              $('#taskDialog_title').html(i18n('JOBMANAGE_EDITTASK'));
              $('#dialog_task_confirm').html(i18n('LECTURETICKET_BIANBSPNBSPJI'));
              that.set(data);
            }

            $("#dialog_task_confirm").click(function () {
              if (that.checkRequired()) {
                var result = that.get();
                taskDialog.close();
                callback && callback(result);
              }
            });
          }
        });
        taskDialog.open();
        that.taskDialog = taskDialog;
      },
      initOptions: function (taskDefinition, data) {
        var that = this;
        var container = $("#taskDialog_options");
        container.empty();
        that.container = container;
        that.taskDefinition = taskDefinition;
        that.options = [];

        var parameters = that.taskDefinition.parameters || [];
        var parameter;
        var length = parameters.length;
        for (var i = 0; i < length; i++) {
          parameter = parameters[i];
          that.addOption(parameter);
        }
        var height = $("#taskDialog_options").height() + 205;
        that.taskDialog.resize({
          height: height
        }, true)
      },
      addOption: function (parameter) {
        var that = this;
        var OptionContainer = $('<div></div>');
        OptionContainer.addClass("jobManage_option_halfRow");
        var OptionTitle = $('<div></div>')
        OptionTitle.addClass("jobManage_option_label");
        OptionTitle.html('<span class="regist-star">*</span>' + parameter.desc);
        OptionTitle.attr("title", parameter.desc);
        OptionContainer.append(OptionTitle);
        that.container.append(OptionContainer);
        var result;
        switch (parameter.ptype) {
          case "string":
            result = that.addInput(parameter, OptionContainer);
            break;
          case "enum":
            result = that.addSelect(parameter, OptionContainer);
            break;
          case "date":
            result = that.addDate(parameter, OptionContainer);
            break;
          case "int":
            result = that.addInput(parameter, OptionContainer);
            break;
          case "list":
            OptionContainer.addClass("oneRow");
            result = that.addList(parameter, OptionContainer);
            break;
          default:
            break;
        }
        that.options.push(result);
      },
      addInput: function (parameter, OptionContainer) {
        var that = this;
        var OptionInput = $('<input class="input" type="text"/>');
        OptionContainer.append(OptionInput);

        var obj = {
          pname: parameter.pname,
          required: parameter.required,
          container: OptionContainer,
          set: function (val) {
            OptionInput.val(val);
          },
          get: function () {
            return OptionInput.val();
          }
        }
        return obj;
      },
      addSelect: function (parameter, OptionContainer) {
        var that = this;
        var OptionDiv = $('<div></div>');
        OptionContainer.append(OptionDiv);

        var values = JSON.parse(JSON.stringify(parameter.values));
        var select_options = [];
        for (var key in values) {
          select_options.push({
            key: key,
            value: values[key]
          })
        }
        var Select = new newSelect(OptionDiv, [], {
          width: 306,
          height: 32,
          background: "white",
          fontSize: 14,
          liFontSize: 14,
          color: "rgb(121,121,121)",
          liColor: "rgb(121,121,121)",
          selectbackground: "white",
          headerBorder: "1px solid rgb(198,198,198)",
          liBorderColor: "rgb(198,198,198)",
          openIconUrl: "./uiWidget/images/open1.png",
          closeIconUrl: "./uiWidget/images/close1.png",
        });
        Select.updateSelectOptions(select_options);

        var obj = {
          pname: parameter.pname,
          required: parameter.required,
          container: OptionContainer,
          set: function (val) {
            Select.setKey(val);
          },
          get: function () {
            return Select.getValue();
          }
        };
        return obj;
      },
      addDate: function (parameter, OptionContainer) {
        var that = this;
        var id = "taskDialog_option_" + parameter.pname;
        var OptionDiv = $('<div id="' + id + '" style="color: rgb(121,121,121);width:306px;z-index: 2"></div>');
        OptionContainer.append(OptionDiv);

        var calendarStyles = {
          width: 300,
          navTitleHeight: 25,
          navTitleBgColor: 'rgb(84,190,245)',
          datesViewHeight: 160,
          datesViewGridColor: 'rgb(226,226,226)',
          datesViewCellColor: 'rgb(254,254,254)',
          weekdaysHeight: 22,
          weekdaysColor: 'rgb(74,174,237)',
          currMonthColor: 'rgb(121,121,121)',
          nonCurrMonthColor: 'rgb(200,200,200)',
          align: 'right'
        };
        var calendar = new DatePicker({
          containerId: id,
          calendarStyles: calendarStyles,
          dateInputStyles: {
            width: 306,
            height: 32,
            borderColor: 'rgb(198,198,198)',
            borderWidth: '1',
          },
          editable: false
        });

        var obj = {
          pname: parameter.pname,
          required: parameter.required,
          container: OptionContainer,
          set: function (val) {
            var curr = new Date(val);
            var curde = {year: curr.getFullYear(), month: curr.getMonth(), date: curr.getDate()};
            calendar.setCurrDate(curde);
          },
          get: function () {
            return calendar.getDateStr();
          }
        };
        return obj;
      },
      addList: function (parameter, OptionContainer) {
        var that = this;

        var OptionDiv = $('<div></div>');
        OptionContainer.append(OptionDiv);

        var parameters = JSON.parse(JSON.stringify(parameter.parameters));

        var model = Object.create(option_type_list);
        model.init(OptionDiv, parameters);
        model.add_del_callback = function (result) {
          var height = $("#taskDialog_options").height() + 205;
          that.taskDialog.resize({
            height: height
          }, true)
        };

        var obj = {
          pname: parameter.pname,
          required: parameter.required,
          container: OptionContainer,
          set: function (val) {
            model.storage = val;
            model.initList()
          },
          get: function () {
            return model.get();
          }
        };
        return obj;
        return;
      },
      checkRequired: function () {
        $("#taskDialog_options .jobManage_option_halfRow .regist-star").hide();
        var that = this;
        var result = true;
        for (var i = 0; i < that.options.length; i++) {
          var item = that.options[i];
          if (item.required) {
            var value = item.get();
            if ((value == "") || (Array.prototype.isPrototypeOf(value) && value.length === 0)) {
              result = false;
              item.container.find(".regist-star").show();
            }
          }
        }
        return result;
      },
      set: function (data) {
        var that = this;
        var taskDefinition = TaskDefinitions.filter(function (item) {
          return item.cname == data["celery_task_name"]
        });
        taskDefinition = taskDefinition[0]
        that.taskNameSelect.setKey(taskDefinition.cname);
        that.initOptions(taskDefinition);

        var options_value = data.parameters;
        that.options.forEach(function(item){
          var pname = item.pname;
          if(pname in options_value){
            item.set(options_value[pname]);
          }
        })
      },
      get: function () {
        var that = this;
        var result = {
          "celery_task_name": that.taskDefinition.cname,
          "parameters": {}
        };
        for (var i = 0; i < that.options.length; i++) {
          var item = that.options[i];
          var value = item.get();
          if (value) {
            result["parameters"][item.pname] = (item.ptype == "int") ? parseInt(value) : value;
          }
        }
        return result;
      }
    },
    taskList: {
      init: function (jobDetailPage) {
        var that = this;
        that.jobDetailPage = jobDetailPage;
        that.taskListData = [];
        that.id = 0;
        that.readonly = false;
        that.bindEvent();
      },
      load: function (jobDetailPage, data, readonly) {
        var that = this;
        that.init(jobDetailPage);
        that.readonly = readonly ? true : false;
        that.initList(data);
      },
      initList: function (data) {
        var that = this;
        data.forEach(function (task) {
          that.addTask(task);
        });
      },
      bindEvent: function () {
        var that = this;
        $('#jobManage_task .right .task_list_body .background').on('click', '.task_del[data-opr]', function () {
          var opr = $(this);
          var type = opr.attr('data-opr');
          var id = parseInt(opr.attr('data-id'));
          var index = that.taskListData.findIndex((value, index, arr) => {
            return value.id === parseInt(id)
          });
          switch (type) {
            case 'del':
              showMsgDialog(i18n("USERGROUP_DELETE_CONTENT1") + "Task_" + (index + 1) + i18n("USERGROUP_DELETE_CONTENT2"), function () {
                that.deleteTask(id);
                $("#task_list_container").mCustomScrollbar("update");
              });
              break;
            case 'edit':
              var item = that.taskListData[index];
              that.jobDetailPage.taskDialog.open(item.value, function(result){
                that.editTask(id, result);
              });
              break;
          }
        });
      },
      addTask: function (task) {
        var that = this;
        that.id++;

        var taskDefinition;
        var taskDefinition_index = TaskDefinitions.findIndex((value, index, arr) => {
          return value.cname == task.celery_task_name
        });
        taskDefinition = TaskDefinitions[taskDefinition_index];

        var task_value = task.parameters;

        var $container = $("#task_list_container .background");
        var $task = $('<div class="task_list_item"></div>');
        $container.append($task);

        var $next_step_icon = $('<div class="nextStep"><img src="./images/jobManage/nextStepIcon.png" alt=""></div>');
        $task.append($next_step_icon);
        var $background = $('<div class="task_list_item_background"></div>');
        $task.append($background);

        var task_edit = '<div class="task_del" data-opr="edit" data-id="' + that.id + '">' + "编辑Task" + '</div>';
        var task_del = '<div class="task_del" data-opr="del" data-id="' + that.id + '">' + i18n('JOBMANAGE_DELETETASK') + '</div>';
        var $head = $('<div class="task_list_item_head">' +
          '<div class="task_id">Task-</div>' + '<div class="task_name"></div>' + task_edit + task_del +
          '</div>');
        $background.append($head);
        $head.find(".task_name").text(taskDefinition.tname);
        that.readonly && $head.find('.task_del').hide();

        var $body = $('<div class="task_list_item_body"></div>');
        $background.append($body);

        var parameters = taskDefinition.parameters || [];
        var parameter;
        var length = parameters.length;
        for (var i = 0; i < length; i++) {
          parameter = parameters[i];
          that.addOption(parameter, task_value[parameter.pname], $body);
        }
        $("#task_list_container").mCustomScrollbar("update");

        var taskData = {
          id: that.id,
          $node: $task,
          value: task,
        };
        that.taskListData.push(taskData);
      },
      editTask: function (id, task) {
        var that = this;

        var taskIndex = that.taskListData.findIndex((x)=>{return x.id == id});
        var taskItem = that.taskListData[taskIndex];

        var taskDefinition;
        var taskDefinition_index = TaskDefinitions.findIndex((value, index, arr) => {
          return value.cname == task.celery_task_name
        });
        taskDefinition = TaskDefinitions[taskDefinition_index];

        var task_value = task.parameters;

        var $task = taskItem.$node;
        $task.empty();

        var $next_step_icon = $('<div class="nextStep"><img src="./images/jobManage/nextStepIcon.png" alt=""></div>');
        $task.append($next_step_icon);
        var $background = $('<div class="task_list_item_background"></div>');
        $task.append($background);

        var task_edit = '<div class="task_del" data-opr="edit" data-id="' + taskItem.id + '">' + "编辑Task" + '</div>';
        var task_del = '<div class="task_del" data-opr="del" data-id="' + taskItem.id + '">' + i18n('JOBMANAGE_DELETETASK') + '</div>';
        var $head = $('<div class="task_list_item_head">' +
          '<div class="task_id">Task-</div>' + '<div class="task_name"></div>' + task_edit + task_del +
          '</div>');
        $background.append($head);
        $head.find(".task_name").text(taskDefinition.tname);
        that.readonly && $head.find('.task_del').hide();

        var $body = $('<div class="task_list_item_body"></div>');
        $background.append($body);

        var parameters = taskDefinition.parameters || [];
        var parameter;
        var length = parameters.length;
        for (var i = 0; i < length; i++) {
          parameter = parameters[i];
          that.addOption(parameter, task_value[parameter.pname], $body);
        }
        $("#task_list_container").mCustomScrollbar("update");

        var taskData = {
          id: taskItem.id,
          $node: $task,
          value: task,
        };
        that.taskListData.splice(taskIndex, 1, taskData);
      },
      deleteTask: function(id){
        var that = this;
        var index = that.taskListData.findIndex((value, index, arr) => {
          return value.id === parseInt(id)
        });
        var delTask = that.taskListData.splice(index, 1);
        delTask[0].$node.remove();
      },
      addOption: function (parameter, value, OptionsContainer) {
        var that = this;
        var OptionContainer = $('<div></div>');
        OptionContainer.addClass("jobManage_option_halfRow");
        OptionsContainer.append(OptionContainer);
        var result;
        switch (parameter.ptype) {
          case "enum":
          case "string":
          case "date":
          case "int":
            result = that.addInput(parameter, OptionContainer, value);
            break;
          case "list":
            OptionContainer.addClass("oneRow");
            result = that.addList(parameter, OptionContainer, value);
            break;
          default:
            break;
        }
      },
      addInput: function (parameter, OptionContainer, value) {
        var that = this;
        var OptionInput = $('<input class="input" readonly type="text"/>');
        OptionContainer.append(OptionInput);
        if (typeof value == "undefined") {
          OptionInput.val(parameter.desc + i18n("JOBMANAGE_NOVALUE"));
        } else {
          OptionInput.val(parameter.desc + "-" + value);
        }
        that.readonly && OptionInput.addClass("readonly")
      },
      addList: function (parameter, OptionContainer, value) {
        var that = this;

        var OptionDiv = $('<div></div>');
        OptionContainer.append(OptionDiv);

        var parameters = JSON.parse(JSON.stringify(parameter.parameters));

        var model = Object.create(option_type_list);
        model.initInTaskList(OptionDiv, parameters, value);
      },
      get: function () {
        var that = this;
        var result = that.taskListData.map(function (item) {
          return item.value;
        });
        return JSON.parse(JSON.stringify(result));
      },
    },
  };

  var jobListPage = {
    init: function (option) {
      var that = this;
      $("#jobManage_list").hide();
      $("#jobManage .panel_page_head_right").hide();
      $("#panel_page_head_joblist").hide();
      $("#panel_page_head_jobHistory").show();
      $("#panel_page_head_jobHistory .panel_page_head_title").text(option.name);
      that.initParm(option.id);
      $.ajax({
        type: "GET",
        url: "content/jobManage/jobHistory/index.html",
        async: true
      }).done(function (resp) {
        var template = patchHTML(resp);
        $("#jobManage_task").empty();
        $("#jobManage_task").html($(template));
        $("#jobManage_task").show();
        that.initTable();
        that.bindEvent();
      });
    },
    initParm: function (id) {
      var that = this;
      that.id = id;
      that.jobHistoryData = [];
      that.taskHistoryData = [];
    },
    initTable: function () {
      var that = this;
      that.initJobHistory();
      that.initTaskHistory();

    },
    initJobHistory: function () {
      var that = this;

      var widths = [0.055, 0.4725, 0.4725];
      var titles = [{
        label: ""
      }, {
        label: i18n('JOBMANAGE_JOBSTARTTIME')
      }, {
        label: i18n('JOBMANAGE_JOBENDTIME')
      }];
      var jobHistoryList = new scrollBarList({
        rows: 12,
        columns: titles.length,
        containerId: 'jobHistory_Table',
        titles: titles,
        listType: 0,
        data: [],
        styles: {
          borderColor: 'rgb(225, 225, 225)',
          borderWidth: 1,
          titleHeight: 38,
          titleBg: '#45D1F4',
          titleColor: 'white',
          cellBg: 'white',
          evenBg: '#FBFBFB',
          cellColor: '#828282',
          cellHeight: 38,
          footBg: 'white',
          theadbold: true,
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white',
          columnsWidth: widths,
        }
      });
      jobHistoryList.create();
      that.jobHistoryList = jobHistoryList;

      API.getJobHistory(that.id, function (data) {
        that.jobHistoryData = data;
        that.jobHistoryList.update(that.formListDataForJobList(data));
        $("#jobManage_task .jobHistory_content .left").mCustomScrollbar("update");
        if(data.length > 0){
          $('#jobManage_task .jobHistory_content .left .scrollBarList_Body tr:first-child').addClass("selected");
          var item = that.jobHistoryData[0];
          API.getTaskHistory({
            id: that.id,
            job_execution_id: item.id
          }, function (data) {
            that.taskHistoryData = data;
            that.taskHistoryList.update(that.formListDataForTaskList(data));
            $("#jobManage_task .jobHistory_content .right").mCustomScrollbar("update");
          });
        }
      });

      $("#jobManage_task .jobHistory_content .left").mCustomScrollbar({
        theme: "dark-thick"
      });
      $("#jobManage_task .jobHistory_content .left" + " .mCSB_inside > .mCSB_container").css({
        "margin-right": "0px"
      });
      $("#jobManage_task .jobHistory_content .left").mCustomScrollbar("update");
    },
    initTaskHistory: function () {
      var that = this;

      var widths = [0.046, 0.25, 0.25, 0.164, 0.164];
      var titles = [{
        label: ""
      }, {
        label: i18n('JOBMANAGE_JOBSTARTTIME')
      }, {
        label: i18n('JOBMANAGE_JOBENDTIME')
      }, {
        label: i18n('JOBMANAGE_TASKNAME')
      }, {
        label: i18n('JOBMANAGE_STATUS')
      }, {
        label: i18n('JOBMANAGE_OPR')
      }];
      var taskHistoryList = new scrollBarList({
        rows: 12,
        columns: titles.length,
        containerId: 'taskHistory_Table',
        titles: titles,
        listType: 0,
        data: [],
        styles: {
          borderColor: 'rgb(225, 225, 225)',
          borderWidth: 1,
          titleHeight: 38,
          titleBg: '#45D1F4',
          titleColor: 'white',
          cellBg: 'white',
          evenBg: '#FBFBFB',
          cellColor: '#828282',
          cellHeight: 38,
          footBg: 'white',
          theadbold: true,
          inputBorder: '1px solid rgb(203,203,203)',
          inputBg: 'white',
          columnsWidth: widths,
        }
      });
      taskHistoryList.create();
      that.taskHistoryList = taskHistoryList;


      $("#jobManage_task .jobHistory_content .right").mCustomScrollbar({
        theme: "dark-thick"
      });
      $("#jobManage_task .jobHistory_content .right" + " .mCSB_inside > .mCSB_container").css({
        "margin-right": "0px"
      });
      $("#jobManage_task .jobHistory_content .right").mCustomScrollbar("update");
    },
    bindEvent: function () {
      var that = this;
      $('#panel_page_head_jobHistory .panel_page_head_button.back').unbind("click").click(function () {
        Main.recover();
      });
      $('#jobManage_task .jobHistory_content .left').on('click', '.scrollBarList_Body tr', function () {
        $('#jobManage_task .jobHistory_content .left .scrollBarList_Body tr').removeClass("selected");
        var tr = $(this);
        var index = tr.index();
        tr.addClass("selected");
        var item = that.jobHistoryData[index];
        API.getTaskHistory({
          id: that.id,
          job_execution_id: item.id
        }, function (data) {
          that.taskHistoryData = data;
          that.taskHistoryList.update(that.formListDataForTaskList(data));
          $("#jobManage_task .jobHistory_content .right").mCustomScrollbar("update");
        });
      });
      $('#jobManage_task .jobHistory_content .right').on('click', '.opr', function () {
        var tr = $(this);
        var index = tr.attr("data-id");
        var item = that.taskHistoryData[index];
        var id = item.id;
        window.open(JobManage_Flower_URL + id, "_blank");
      });
    },
    formListDataForJobList: function (data) {
      var that = this;
      var list_data = [];
      for (var i = 0; i < data.length; i++) {
        var arr = getSingleItem(i);
        list_data.push(arr);
      }
      return list_data;

      function getSingleItem(i) {
        var item = data[i];
        var arr1 = i + 1;
        var arr2 = item["run_time"] || "";
        var arr3 = item["finish_time"] || "";
        var arr;
        arr = [{
          label: arr1
        }, {
          label: arr2
        }, {
          label: arr3
        }];
        return arr;
      }
    },
    formListDataForTaskList: function (data) {
      var that = this;
      var list_data = [];
      for (var i = 0; i < data.length; i++) {
        var arr = getSingleItem(i);
        list_data.push(arr);
      }
      return list_data;

      function getSingleItem(i) {
        var item = data[i];
        var arr1 = i + 1;
        var arr2 = item["run_time"] || "";
        var arr3 = item["finish_time"] || "";
        var arr4 = item["task_name"] || "";
        var arr5 = item["status"] || "";
        var arr6 = getSingleItemOperation(item, i);
        var arr;
        arr = [{
          label: arr1
        }, {
          label: arr2
        }, {
          label: arr3
        }, {
          label: arr4
        }, {
          label: arr5
        }, {
          label: arr6
        }];
        return arr;
      }

      function getSingleItemOperation(item, i) {
        var oprView = '<span class="opr" data-type="view" data-id="' + i + '">' + i18n('JOBMANAGE_VIEWDETAIL') + '</span>';
        var opr = "" + oprView;
        return opr;
      }
    },
  };

  var API = {
    getList: function (options, callback) {
      var that = this;
      var url = job_aquapaas_host + "/aquapaas/rest/job/jobs";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      url = url + "&page=" + options.page;
      if (typeof options.type !== 'undefined') {
        url = url + "&type=" + options.type;
      }
      if (typeof options.name !== 'undefined') {
        url = url + "&name=" + options.name;
      }
      if (typeof options.repeated !== 'undefined') {
        url = url + "&repeated=" + options.repeated;
      }
      if (typeof options.enable !== 'undefined') {
        url = url + "&enable=" + options.enable;
      }
      if (typeof options.begin_time !== 'undefined') {
        url = url + "&begin_time=" + options.begin_time;
      }
      if (typeof options.end_time !== 'undefined') {
        url = url + "&end_time=" + options.end_time;
      }
      if (typeof options.rows !== 'undefined') {
        url = url + "&rows=" + options.rows;
      }
      url = url + "&order_by=last_run_time&order=desc";
      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        },
        contentType: "application/json",
        dataType: "JSON",
      }).done(function (data, status, xhr) {
        if (!data) {
          data = [];
        }
        var totalCount = xhr.getResponseHeader('Total-Count');
        data.allCount = totalCount;
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        var data = [];
        data.allCount = 0;
        callback && callback(data);
      });
    },
    getTaskDefinitions: function (callback) {
      var that = this;
      var url = job_aquapaas_host + "/aquapaas/rest/job/task/definitions";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        },
        contentType: "application/json",
        dataType: "JSON",
      }).done(function (data, status, xhr) {
        if (!data) {
          data = [];
        }
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        var data = [];
        callback && callback(data);
      });
    },
    addJob: function (options, callback, errorCallback) {
      var that = this;
      var url = job_aquapaas_host + "/aquapaas/rest/job/job";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      var result = null;
      $.ajax({
        type: "POST",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
        },
        contentType: "application/json",
        dataType: "text",
        data: JSON.stringify(options)
      }).done(function (data, status, xhr) {
        callback && callback();
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status, textStatus);
      });
    },
    updateJob: function (id, options, callback, errorCallback) {
      var that = this;
      var url = job_aquapaas_host + "/aquapaas/rest/job/job/";
      if (id) {
        url = url + id;
      }
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      var result = null;
      $.ajax({
        type: "PUT",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
        },
        contentType: "application/json",
        dataType: "text",
        data: JSON.stringify(options)
      }).done(function (data, status, xhr) {
        callback && callback();
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status);
      });
    },
    delJob: function (id, callback, errorCallback) {
      var that = this;
      var url = job_aquapaas_host + "/aquapaas/rest/job/job/";
      if (id) {
        url = url + id;
      }
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      var result = null;
      $.ajax({
        type: "DELETE",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', url)
        },
        contentType: "application/json",
        dataType: "text",
      }).done(function (data, status, xhr) {
        callback && callback();
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status, jqXHR.responseText);
      });
    },
    changeJobStatus: function (options, callback) {
      var that = this;
      var url = job_aquapaas_host + "/aquapaas/rest/job/job/" + options.id + "/" + options.action;
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      var result = null;
      $.ajax({
        type: "PUT",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
        },
        contentType: "application/json",
        dataType: "text"
      }).done(function (data, status, xhr) {
        callback && callback();
      }).fail(function (jqXHR, textStatus) {
        callback && callback(textStatus, jqXHR.responseText);
      });
    },
    getJobHistory: function (id, callback) {
      var that = this;
      var url = job_aquapaas_host + "/aquapaas/rest/job/job/";
      if (id) {
        url = url + id;
      }
      url = url + "/job_history";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      url = url + "&order_by=run_time&order=desc";
      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        },
        contentType: "application/json",
        dataType: "JSON",
      }).done(function (data, status, xhr) {
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        callback && callback([]);
      });
    },
    getTaskHistory: function (options, callback) {
      var that = this;
      var url = job_aquapaas_host + "/aquapaas/rest/job/job/";
      if (options.id) {
        url = url + options.id;
      }
      url = url + "/task_history";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      if (typeof options.job_execution_id !== 'undefined') {
        url = url + "&job_execution_id=" + options.job_execution_id;
      }
      url = url + "&order_by=run_time&order=desc";
      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
        },
        contentType: "application/json",
        dataType: "JSON",
      }).done(function (data, status, xhr) {
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        callback && callback([]);
      });
    },
  };

  return Main;
})(jQuery);

jobManage.init();
