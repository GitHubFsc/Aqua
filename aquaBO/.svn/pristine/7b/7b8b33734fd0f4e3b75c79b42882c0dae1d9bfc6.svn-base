var navigationSlider = (function ($) {
  var navigationSlider_LOGIN_AQUA_USERNAME = LOGIN_AQUA_USERNAME;
  var navigationSlider_LOGIN_AQUA_PWD = LOGIN_AQUA_PWD;
  var navigationSlider_LOGIN_AQUA_DOMAIN_URI = LOGIN_AQUA_DOMAIN_URI;

  //var aquapaas_host = "http://172.16.20.201:8090";
  //var aquapaas_host = "http://api.xor-live.io";

  function showMsgDialog(option, callback) {
    var msg = option.msg;
    var width = option.width || 470;
    var dialog = new OverlayDialog({
      url: 'content/navigationSlider/msg-dialog.html',
      width: width,
      height: 266,
      context: {},
      zIndex: 3000,
      id: 'user-admin-msg',
      callback: function () {
        if (option.buttonMsg) {
          $('#user-admin-msg-submit').html(option.buttonMsg)
        }
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
      that.bindEvent();
      that.initTable();
    },
    initParm: function () {
      var that = this;
      that.data = [];
      var upload = new UploadModule(aqua_host, navigationSlider_LOGIN_AQUA_USERNAME, navigationSlider_LOGIN_AQUA_PWD, navigationSlider_LOGIN_AQUA_DOMAIN_URI)
      that.upload = upload;
    },
    bindEvent: function () {
      var that = this;
      $('#navigationSlider_list_table').on('click', '.opr', function () {
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
            ViewProgramListPage.init(item);
            break;
          case 'stop':
            showMsgDialog({
              msg: i18n("NAVMNGSLIDER_MSG1"),
              buttonMsg: i18n("NAVMNGSLIDER_CONTINUE"),
            }, function () {
              API.changeStatus({
                channel_id: item['metadata_public']["channelID"],
                action: 'stop',
                clear: "1"
              },function(){
                that.updateTable(true);
              })
            });
            break;
          case 'start':
            API.changeStatus({
              channel_id: item['metadata_public']["channelID"],
              action: 'start'
            },function(){
              that.updateTable(true);
            })
            break;
          case 'edit':
            if(item["status"] == "run"){
              showMsgDialog({
                msg: i18n("NAVMNGSLIDER_MSG3"),
                buttonMsg: i18n("NAVMNGSLIDER_CONTINUE"),
              }, function () {
                EditProgramListPage.init(item);
              });
            } else {
              EditProgramListPage.init(item);
            }
            break;
          default:
            break;
        }
      });

      that.upload.init({
        selectFileBottom: "#navigationSlider_import_btn",
        uploadPath: navigationSlider_uploadPath,
        checkExist_Boolean: true,
        uploadNow_Boolean: true
      }, {
        _errorfun: function (e, file_name) {
          //单个文件上传失败的回调函数
          console.log(e);
          that.importDialog.updateSingleItemStatus(file_name, "failed")
        },
        _endfun: function (file_name, updateSize, fileSize, file_url, self) {
          //单个文件上传结束的回调函数
          var console_message = file_name + " end. The url = " + file_url;
          console.log(console_message);
          that.importDialog.updateSingleItemStatus(file_name, "complete")
        },
      }, {
        _beforeAllStartFun: function (files, next) {
          //点击selectFileBottom，选择文件后，回调该函数
          var result = [];
          var i = 0;
          for (i = 0; i < files.files.length; i++) {
            var name = files.files[i].name;
            result.push({
              name: name,
              status: "running",
            });
          }
          that.importDialog.open(result, next);
        },
        _allStartFun: function (next) {
          //upload.startuploadFile运行后，正式上传前回调该函数
          var createStatus = false;
          while(!createStatus){
            var time = (new Date()).getTime();
            var folder = new that.upload.my_aqua.folder({
              path: navigationSlider_uploadPath,
              name: time
            });
            createStatus = folder.create();
            that.upload.uploadPath = navigationSlider_uploadPath + time;
          }
          next();
        },
        _checkAllExistFun: function (existArray, next) {
          //如果checkExist_Boolean为true，正式上传前发现有已存在的文件，则回调该函数
          var file_name = existArray.join(",");
          var console_message = file_name + "已存在";
          console.log(console_message);
          next()
        },
        _afterAllEndFun: function (result) {
          if (result.data) {
            console.log(result.data);
            console.log("上传完毕");
            if(result.data.filter(x => x.file_url).length  == result.data.length){
              var url = result.data[0].file_url;
              var urlArray = url.split('/');
              urlArray.pop();
              url = urlArray.join('/');
              that.importDialog.url = url + '/';
              that.importDialog.readyJumpToImportLog();
            }else{
              var errorData = result.data.filter(x => x.error)
              console.log('上传失败',errorData);
            }
            this.clear();
          }
        }
      });
      $("#navigationSlider_import_btn").unbind("click").click(function () {
        API.checkScheduletvImporting(function (data) {
          if (data["rnum"] > 0) {
            showMsgDialog({
              msg: i18n("NAVMNGSLIDER_MSG2"),
              buttonMsg: i18n("NAVMNGSLIDER_GOTOVIEW"),
            }, function () {
              ViewImportLogListPage.init();
            });
          } else {
            that.upload.systemFile.click();
          }
        }, function () {
          console.log("接口返回错误");
        });
      });

      $('#navigationSlider_viewLog_btn').click(function () {
        ViewImportLogListPage.init();
      });
    },
    initTable: function () {
      var that = this;
      var title = [{
        label: i18n("NAVMNGSLIDER_PINDAOHAIBAOTUPIAN")
      }, {
        label: i18n("NAVMNGSLIDER_PINDAOID")
      }, {
        label: i18n("NAVMNGSLIDER_PINDAOMINGCHENG")
      }, {
        label: i18n("NAVMNGSLIDER_PINDAOYUNXINGMINGCHENG")
      }, {
        label: i18n("NAVMNGSLIDER_CAOZUO")
      }];
      var widths = [0.148, 0.215, 0.266, 0.186, 0.34, 0.188];
      var list_table = new StyledList({
        rows: 5,
        columns: title.length,
        containerId: 'navigationSlider_list_table',
        titles: title,
        listType: 0,
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
      list_table.create();
      that.list_table = list_table;
      that.updateTable();
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
        var item = data[i];
        var src = item['metadata_public']["FILE_poster"] || "";
        var arr1 = "";
        if(src){
          arr1 = '<div class="maxPic opr" data-type="view"  data-id="' + i + '"><img src="' + src + '" alt=""></div>'
        }else{
          arr1 = "";
        }
        var arr2 = item['metadata_public']["channelID"] || "";
        var arr3 = item["name"] || "";
        var arr4;
        if (item["status"] == "run") {
          arr4 = '<div class="pic"><img src="./images/navigationSlider/status_run.png" alt=""></div>'//item["pic"] || "";
        } else if(item["status"] == "stop") {
          arr4 = '<div class="pic"><img src="./images/navigationSlider/status_stop.png" alt=""></div>'//item["pic"] || "";
        }else{
          arr4 = ""
        }
        var arr5 = getSingleItemOperation(item, i);
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
        }];
        return arr;
      }

      function getSingleItemOperation(item, i) {
        var oprStop;
        if (item["status"] == "run") {
          oprStop = '<div class="opr" data-type="stop" data-id="' + i + '">' + i18n('NAVMNGSLIDER_STOP') + '</div>';
        } else if(item["status"] == "stop"){
          oprStop = '<div class="opr" data-type="start" data-id="' + i + '">' + i18n('NAVMNGSLIDER_START') + '</div>';
        }else{
          oprStop = "";
        }
        var oprView = '<span class="opr" data-type="view" data-id="' + i + '">' + i18n('NAVMNGSLIDER_CHAKANJIEMULIEBIAO') + '</span>';
        var oprEdit = '<div class="opr" data-type="edit" data-id="' + i + '">' + i18n('NAVMNGSLIDER_EDIT') + '</div>';
        var oprMore_detail = '<div class="opr_more_detail">' +
          '<div class="opr">' + i18n('NAVMNGSLIDER_GUANLI') + '&nbsp;<img src="images/users/more_up_arrow.png">' + '</div>' +
          oprEdit + oprStop +
          '</div>';
        var oprMore = '<div class="opr_more">' +
          '<span class="opr" data-type="more" data-id="' + i + '">' + i18n('NAVMNGSLIDER_GUANLI') + '&nbsp;<img src="images/users/more_down_arrow.png">' + '</span>' + oprMore_detail;
        '</div>'


        var opr = oprView + oprMore;
        opr = opr;
        return opr;
      }

    },
    updateTable: function(updateInPage){
      var that = this;
      API.getList(null, function (data) {
        var items = data.children || [];
        that.getStatus(items, function(items){
          that.data = items;
          var listData = that.formListDataForList(items);
          that.list_table.onTotalCount(items.length);
          if(updateInPage){
            that.list_table.updateInPage(listData);
          }else{
            that.list_table.update(listData);
          }
        })
      })
    },
    getStatus: function(data, successCallback, errorCallback){
      var obj = {};
      data.forEach(function(item){
        var key = item['metadata_public']["channelID"] ;
        if(key && (typeof obj[key] == 'undefined')){
          obj[key] = "null";
        }else{
        }
      });
      var keys = Object.keys(obj);
      var result = JSON.parse(JSON.stringify(data));
      API.getChannelStatus({
        channels: keys
      }, function(statusArray){
        keys.forEach(function(item){
          if(statusArray[item] === 0){
            obj[item] = "stop"
          }else if(statusArray[item] === 1){
            obj[item] = "run"
          }else{
            obj[item] = "null"
          }
        });
        result = result.map(function(item){
          item.status = obj[item['metadata_public']["channelID"]];
          return item
        });
        successCallback(result);
      }, function(){
        result = result.map(function(item){
          item.status = "null";
          return item
        });
        successCallback(result);
      });
    },
    recover: function () {
      var that = this;
      $(".panel_page_body .module").hide();
      $("#navigationSlider .panel_page_head_right .module").hide();
      $("#navigationSlider .panel_page_head_left .module").hide();


      $("#panel_page_head_joblist").show();
      $("#panel_page_head_jobHistory .panel_page_head_title").text("");

      $("#navigationSlider .panel_page_head_right .list").show();
      $("#navigationSlider_viewImportLog_table").empty();
      $("#navigationSlider_list").show();
      that.list_table.refreshList();
      that.list_table.resize();
    },
    importDialog: {
      open: function (data, callback) {
        var that = this;
        that.uploadFileList = data;
        that.url = "";
        var taskDialog = new PopupDialog({
          url: 'content/navigationSlider/importDialog/index.html',
          width: 495,
          height: 530,
          context: that,
          callback: function () {
            var widths = [0.5, 0.5];
            var titles = [{
              label: i18n('NAVMNGSLIDER_FILENAME')
            }, {
              label: i18n('NAVMNGSLIDER_CURRENTSTATUS')
            }];
            var list = new scrollBarList({
              rows: 10,
              columns: titles.length,
              containerId: 'importDialog_list',
              titles: titles,
              listType: 0,
              data: [],
              styles: {
                borderColor: 'rgb(225, 225, 225)',
                borderWidth: 1,
                titleHeight: 33,
                titleBg: '#45D1F4',
                titleColor: 'white',
                cellBg: 'white',
                evenBg: '#FBFBFB',
                cellColor: '#828282',
                cellHeight: 33,
                footBg: 'white',
                theadbold: true,
                inputBorder: '1px solid rgb(203,203,203)',
                inputBg: 'white',
                columnsWidth: widths,
                BodyTableDiv_height: 343
              }
            });
            list.create();
            that.importList = list;
            that.importList.update(that.formListDataForImportList(data));
            $("#dialog_task_confirm").click(function () {
              if ($("#dialog_task_confirm").hasClass('disable')) {
              } else {
                taskDialog.close();
                ViewImportLogListPage.init();
              }
            });
            callback && callback();
          }
        });
        taskDialog.open();
        that.taskDialog = taskDialog;
      },
      update: function (data) {
        var that = this;
        that.uploadFileList = data;
        that.importList.update(that.formListDataForImportList(data));
      },
      updateSingleItemStatus: function (name, status) {
        var that = this;
        var i = 0;
        for (i = 0; i < that.uploadFileList.length; i++) {
          var item = that.uploadFileList[i];
          if (item.name == name) {
            item.status = status;
          }
        }
        that.importList.update(that.formListDataForImportList(that.uploadFileList));
      },
      formListDataForImportList: function (data) {
        var that = this;
        var list_data = [];
        for (var i = 0; i < data.length; i++) {
          var arr = getSingleItem(i);
          list_data.push(arr);
        }
        return list_data;

        function getSingleItem(i) {
          var item = data[i];
          var arr1 = item["name"] || "";
          var arr2 = item["status"] || "";
          if (arr2 == "complete") {
            arr2 = '<div class="pic"><img src="./images/navigationSlider/status_complete.png" alt=""></div>'
          } else if (arr2 == "running") {
            arr2 = '上传中...'
          } else {
            arr2 = '上传失败'
          }

          var arr;
          arr = [{
            label: arr1
          }, {
            label: arr2
          }];
          return arr;
        }
      },
      readyJumpToImportLog: function () {
        var that = this;
        $("#dialog_task_confirm").removeClass('disable');
        API.scheduletvImport(that.url, function () {

        }, function () {

        });
      }
    },
  };

  var ViewImportLogListPage = {
    init: function () {
      var that = this;
      $(".panel_page_body .module").hide();
      $("#navigationSlider .panel_page_head_right .module").hide();
      $("#navigationSlider .panel_page_head_left .module").hide();


      $("#panel_page_head_jobHistory").show();
      $("#panel_page_head_jobHistory .panel_page_head_title").text(i18n('NAVMNGSLIDER_PINDAODAORURIZHI'));

      $("#navigationSlider .panel_page_head_right .viewImportLog").show();

      $("#navigationSlider_viewImportLog_table").empty();
      $("#navigationSlider_viewImportLog").show();
      that.initParm();
      that.initTable();
      that.bindEvent();
    },
    initParm: function (id) {
      var that = this;
      that.data = [];
    },
    initTable: function () {
      var that = this;
      var title = [{
        label: i18n("NAVMNGSLIDER_IMPORTTIME")
      }, {
        label: i18n("NAVMNGSLIDER_IMPORTREPORTID")
      }, {
        label: i18n("NAVMNGSLIDER_CHANNELNAME")
      }, {
        label: i18n("NAVMNGSLIDER_FILENAME")
      }, {
        label: i18n("NAVMNGSLIDER_FROM")
      }, {
        label: i18n("NAVMNGSLIDER_PLAYLISTSTARTTIME")
      }, {
        label: i18n("NAVMNGSLIDER_PLAYLISTENDTIME")
      }, {
        label: i18n("NAVMNGSLIDER_CURRENTSTATUS")
      }, {
        label: i18n("NAVMNGSLIDER_CAOZUO")
      }];
      var widths = [0.136, 0.099, 0.1178, 0.1178, 0.06425, 0.1359, 0.1359, 0.10296, 0.09637];
      var list_table = new StyledList({
        rows: 14,
        columns: title.length,
        containerId: 'navigationSlider_viewImportLog_table',
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
        var start = (page - 1) * 14;
        var end = page * 14 - 1;
        var option = {
          page: start + '-' + end,
        }
        API.getImportLogList(option, function (data, allCount) {
          that.data = data;
          var listData = that.formListDataForList(data);
          list_table.onTotalCount(allCount);
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
    bindEvent: function () {
      var that = this;
      $('#panel_page_head_jobHistory .panel_page_head_button.back').unbind("click").click(function () {
        Main.recover();
      });
      $('#navigationSlider_refresh_btn').unbind("click").click(function () {
        that.list_table.refreshList();
      });
      $('#navigationSlider_viewImportLog_table').on('click', '.opr', function () {
        var opr = $(this);
        var type = opr.attr('data-type');
        var index = opr.attr('data-id');
        var item = that.data[index];
        switch (type) {
          case 'view':
            that.detailDialog.open(item);
            break;
          default:
            break;
        }
      });
    },
    formListDataForList: function (data) {
      var that = this;
      var list_data = [];
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var arr = getSingleItem(item, i);
        list_data.push(arr);
      }
      return list_data;

      function getSingleItem(item, i) {
        var showtime = function (number) {
          if (number < 10) {
            number = '0' + number;
          }
          return number
        }
        var item = data[i]
        var arr1;
        var time;
        if (item['importtime']) {
          time = new Date(item['importtime']);
          var date = time.getYear() + 1900 + "-" + showtime(time.getMonth() + 1) + "-" + showtime(time.getDate()) + " " + showtime(time.getHours()) + ':' + showtime(time.getMinutes()) + ':' + showtime(time.getSeconds());
          var arr1 = date;
        } else {
          arr1 = "";
        }
        var arr2 = item['id'] || "";
        var arr3 = item['channel_name'] || "";
        var arr4 = item['name'] || "";
        var arr5 = item['source'] || "";
        if (arr5 == 0) {
          arr5 = "后台目录"
        } else if (arr5 == 1) {
          arr5 = "ui接口导入"
        } else {
        }
        if (item['starttime']) {
          time = new Date(item['starttime']);
          var date = time.getYear() + 1900 + "-" + showtime(time.getMonth() + 1) + "-" + showtime(time.getDate()) + " " + showtime(time.getHours()) + ':' + showtime(time.getMinutes()) + ':' + showtime(time.getSeconds());
          var arr6 = date;
        } else {
          arr6 = "";
        }
        if (item['endtime']) {
          time = new Date(item['endtime']);
          var date = time.getYear() + 1900 + "-" + showtime(time.getMonth() + 1) + "-" + showtime(time.getDate()) + " " + showtime(time.getHours()) + ':' + showtime(time.getMinutes()) + ':' + showtime(time.getSeconds());
          var arr7 = date;
        } else {
          arr7 = "";
        }
        var arr8 = item['state'];
        if (arr8 == 0) {
          arr8 = "创建"
        } else if (arr8 == 1) {
          arr8 = "导入"
        } else if (arr8 == 2) {
          arr8 = "导入完毕"
        } else if (arr8 == 3) {
          arr8 = "导入出错"
        } else {
          arr8 = ""
        }
        var arr9 = getSingleItemOperation(item, i);
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
        }, {
          label: arr7
        }, {
          label: arr8
        }, {
          label: arr9
        }];
        return arr;
      }

      function getSingleItemOperation(item, i) {
        var oprView = '<span class="opr" data-type="view" data-id="' + i + '">' + i18n('NAVMNGSLIDER_VIEWDETAIL') + '</span>';
        var opr = oprView;
        return opr;
      }

    },
    detailDialog: {
      open: function (item, callback) {
        var that = this;
        var taskDialog = new PopupDialog({
          url: 'content/navigationSlider/importLogDetailDialog/index.html',
          width: 725,
          height: 649,
          context: that,
          callback: function () {
            $('#taskDialog_title').text((item.id || "") + i18n('NAVMNGSLIDER_DETAIL'));

            var showtime = function (number) {
              if (number < 10) {
                number = '0' + number;
              }
              return number
            }
            var arr1;
            var time;
            if (item['importtime']) {
              time = new Date(item['importtime']);
              var date = time.getYear() + 1900 + "-" + showtime(time.getMonth() + 1) + "-" + showtime(time.getDate()) + " " + showtime(time.getHours()) + ':' + showtime(time.getMinutes()) + ':' + showtime(time.getSeconds());
              var arr1 = date;
            } else {
              arr1 = "";
            }
            var arr2 = item['id'] || "";
            var arr3 = item['channel_name'] || "";
            var arr4 = item['name'] || "";
            var arr5 = item['source'] || "";
            if (arr5 == 0) {
              arr5 = "后台目录"
            } else if (arr5 == 1) {
              arr5 = "ui接口导入"
            } else {
            }
            if (item['starttime']) {
              time = new Date(item['starttime']);
              var date = time.getYear() + 1900 + "-" + showtime(time.getMonth() + 1) + "-" + showtime(time.getDate()) + " " + showtime(time.getHours()) + ':' + showtime(time.getMinutes()) + ':' + showtime(time.getSeconds());
              var arr6 = date;
            } else {
              arr6 = "";
            }
            if (item['endtime']) {
              time = new Date(item['endtime']);
              var date = time.getYear() + 1900 + "-" + showtime(time.getMonth() + 1) + "-" + showtime(time.getDate()) + " " + showtime(time.getHours()) + ':' + showtime(time.getMinutes()) + ':' + showtime(time.getSeconds());
              var arr7 = date;
            } else {
              arr7 = "";
            }
            var arr8 = item['state'];
            if (arr8 == 0) {
              arr8 = "创建"
            } else if (arr8 == 1) {
              arr8 = "导入"
            } else if (arr8 == 2) {
              arr8 = "导入完毕"
            } else if (arr8 == 3) {
              arr8 = "导入出错"
            } else {
              arr8 = ""
            }
            var arr9 = item['appid'] || "";
            var arr10 = item['message'] || "";
            $('#importLogDetail_id').val(arr2);
            $('#importLogDetail_channel_name').val(arr3);
            $('#importLogDetail_name').val(arr4);
            $('#importLogDetail_source').val(arr5);
            $('#importLogDetail_importtime').val(arr1);
            $('#importLogDetail_starttime').val(arr6);
            $('#importLogDetail_endtime').val(arr7);
            $('#importLogDetail_state').val(arr8);
            $('#importLogDetail_appid').val(arr9);
            $('#importLogDetail_message').val(arr10);
          }
        });
        taskDialog.open();
        that.taskDialog = taskDialog;
      }
    },
  };

  var ViewProgramListPage = {
    init: function (option) {
      var that = this;
      $(".panel_page_body .module").hide();
      $("#navigationSlider .panel_page_head_right .module").hide();
      $("#navigationSlider .panel_page_head_left .module").hide();


      $("#panel_page_head_jobHistory").show();
      $("#panel_page_head_jobHistory .panel_page_head_title").text(option.name + i18n("NAVMNGSLIDER_JIEMULIEBIAO"));

      $("#navigationSlider .panel_page_head_right .viewProgramList").show();

      $("#navigationSlider_viewProgramList_table").empty();
      $("#navigationSlider_viewProgramList").show();
      that.initParm(option);
      that.emitCalendarsButtonEvent('playing');
      that.initTable();
      that.bindEvent();

    },
    initParm: function (option) {
      var that = this;
      that.channel_ids = option && option['metadata_public'] && option['metadata_public']["channelID"] || "";
      $("#viewProgramList_calendar_start").empty();
      $("#viewProgramList_calendar_end").empty();
      var calendarStyles = {
        width: 282,
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
      var hmsInputStyles = {
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: '0',
        borderRadius: '5px',
        width: '100px',
      };
      that.datePicker_start = new DatePicker({
        containerId: 'viewProgramList_calendar_start',
        calendarStyles: calendarStyles,
        dateInputStyles: dateInputStyles,
        hmsInputStyles: hmsInputStyles,
        iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
        iconStyle: {
          left: 115
        },
        showHMS: true,
        editable: true
      });
      that.datePicker_end = new DatePicker({
        containerId: 'viewProgramList_calendar_end',
        calendarStyles: calendarStyles,
        dateInputStyles: dateInputStyles,
        hmsInputStyles: hmsInputStyles,
        iconImage: 'images/operateanalyze/oa-dp-cal-icon.png',
        iconStyle: {
          left: 115
        },
        showHMS: true,
        editable: true
      });
      that.datePicker_start.setCalendarDate = function () {
        var dateStr = this.jqDateInput.val();
        if (dateStr == "") {
          this.clear();
          this.onChange();
        } else {
          this.calendar.setCurrDate(this.parseDateStr(dateStr));

          var hmsStr = this.jqHourMinuteSecondInput.val();
          var hmsArray = hmsStr.split(':');
          var hour = hmsArray[0];
          var minute = hmsArray[1];
          if((!isNaN(hour) && (parseInt(hour)<24)) && (!isNaN(minute) && (parseInt(minute)<60))){
            this.hourSelect.setKey(hour);
            this.minuteSelect.setKey(minute);
          }else{
            hour = "00";
            minute = "00";
            this.hourSelect.setKey(hour);
            this.minuteSelect.setKey(minute);
          }

          this.setInputDate();
        }
      };
      that.datePicker_end.setCalendarDate = function () {
        var dateStr = this.jqDateInput.val();
        if (dateStr == "") {
          this.clear();
          this.onChange();
        } else {
          this.calendar.setCurrDate(this.parseDateStr(dateStr));
          var hmsStr = this.jqHourMinuteSecondInput.val();
          var hmsArray = hmsStr.split(':');
          var hour = hmsArray[0];
          var minute = hmsArray[1];
          if((!isNaN(hour) && (parseInt(hour)<24)) && (!isNaN(minute) && (parseInt(minute)<60))){
            this.hourSelect.setKey(hour);
            this.minuteSelect.setKey(minute);
          }else{
            hour = "00";
            minute = "00";
            this.hourSelect.setKey(hour);
            this.minuteSelect.setKey(minute);
          }

          this.setInputDate();
        }
      };
    },
    initTable: function () {
      var that = this;
      var title = [{
        label: i18n("NAVMNGSLIDER_PROGRAMSTARTTIME")
      }, {
        label: i18n("NAVMNGSLIDER_PROGRAMENDTIME")
      }, {
        label: i18n("NAVMNGSLIDER_PROGRAMTITLE")
      }, {
        label: i18n("NAVMNGSLIDER_PLAYALLTIME")
      }, {
        label: i18n("NAVMNGSLIDER_LIANXUXING")
      }, {
        label: i18n("NAVMNGSLIDER_CURRENTSTATUS")
      }, {
        label: i18n("NAVMNGSLIDER_PROGRAMLOAD")
      }, {
        label: i18n("NAVMNGSLIDER_ERRORMSG")
      }, {
        label: i18n("NAVMNGSLIDER_CAOZUO")
      }];
      var widths = [0.1268, 0.1268, 0.17792, 0.08566, 0.08401, 0.0864, 0.0766, 0.14415, 0.097];
      var list_table = new StyledList({
        rows: 14,
        columns: title.length,
        containerId: 'navigationSlider_viewProgramList_table',
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
        var start = (page - 1) * 14;
        var end = page * 14 - 1;
        var option = {
          start: start,
          end: end,
          channel_ids: that.channel_ids
        };
        var calendar_start = $("#viewProgramList_calendar_start-datepicker-input").val();
        var calendar_end = $("#viewProgramList_calendar_end-datepicker-input").val();
        var start_hourminute = $("#viewProgramList_calendar_start-hms-input").val() || "00:00";
        var end_hourminute = $("#viewProgramList_calendar_end-hms-input").val() || "23:59";
        var begin_time = calendar_start ? (calendar_start + "T" + start_hourminute + ":00Z") : "";
        var end_time = calendar_end ? (calendar_end + "T" + end_hourminute + ":59Z") : "";
        if (begin_time) {
          option.start_time_range_start = encodeURIComponent(that.datePicker_start.getISOString());
        }
        if (end_time) {
          option.end_time_range_end = encodeURIComponent(that.datePicker_end.getISOString());
        }
        API.getProgramList(option, function (data, allCount) {
          that.data = data;
          var listData = that.formListDataForList(data);
          list_table.onTotalCount(allCount);
          callback(listData);
        })
      };
      list_table.create();
      that.list_table = list_table;
      $(window).on("resize", function () {
        list_table.resize();
      })
    },
    bindEvent: function () {
      var that = this;
      $('#panel_page_head_jobHistory .panel_page_head_button.back').unbind("click").click(function () {
        Main.recover();
      });
      $('#navigationSlider_viewProgramList').on('click', '.opr', function () {
        var opr = $(this);
        var type = opr.attr('data-type');
        var index = opr.attr('data-id');
        var item = that.data[index];
        switch (type) {
          case 'view':
            that.detailDialog.open(item);
            break;
          default:
            break;
        }
      });
      that.datePicker_start.onChange = that.datePicker_end.onChange = function () {
        that.list_table.update()
      }
      that.datePicker_start.onEnterKeyDownEvent = that.datePicker_end.onEnterKeyDownEvent = function () {
        $('#navigationSlider .module.viewProgramList .calendars .button').removeClass('force');
      };
      $('#navigationSlider .module.viewProgramList .calendars .button').unbind("click").click(function () {
        var opr = $(this);
        var type = opr.attr('data-type');
        that.emitCalendarsButtonEvent(type);
      });
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
        var arr1 = item['start'] || "";
        var arr2 = item['end'] || "";
        var arr3 = item['title'] || "";
        var arr4 = item['run_time'] || "";
        var arr5 = item['confilct'] || "";
        if (arr5 == 0) {
          arr5 = "正常"
        } else if (arr5 == 1) {
          arr5 = "<span style='color:red'>有空隙</span>"
        } else if (arr5 == 2) {
          arr5 = "<span style='color:red'>有重叠</span>"
        } else {
          arr5 = ""
        }
        var arr6 = item['status'] || "";
        if (arr6 == 0) {
          arr6 = "初始化"
        } else if (arr6 == 1) {
          arr6 = "初始导入"
        } else if (arr6 == 2) {
          arr6 = "准备播放"
        } else if (arr6 == 3) {
          arr6 = "播放结束"
        } else {
          arr6 = ""
        }
        var arr7 = item['estatus'] || "";
        if (arr7 == 0) {
          arr7 = "正常"
        } else if (arr7 == 1) {
          arr7 = "<span style='color:red'>异常</span>"
        } else {
          arr7 = ""
        }
        var arr8 = item['emessage'] || "";
        if (arr8) {
        } else {
          arr8 = "-"
        }
        var arr9 = getSingleItemOperation(item, i);
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
        }, {
          label: arr7
        }, {
          label: arr8
        }, {
          label: arr9
        }];
        return arr;
      }

      function getSingleItemOperation(item, i) {
        var oprView = '<span class="opr" data-type="view" data-id="' + i + '">' + i18n('NAVMNGSLIDER_VIEWDETAIL') + '</span>';
        var opr = oprView;
        return opr;
      }

    },
    emitCalendarsButtonEvent: function(type){
      var that = this;
      $('#navigationSlider .module.viewProgramList .calendars .button').removeClass('force');
      var opr = $('#navigationSlider .module.viewProgramList .calendars .button[data-type=' + type + ']');
      opr.addClass('force');
      switch (type) {
        case 'playing':
          var now = new Date();
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hour = now.getHours();
          var minute = now.getMinutes();
          var date_start = "" + year + "-" + addZero(month) + "-" + addZero(date);
          var date_end = "" + year + "-" + addZero(month) + "-" + addZero(date + 1);
          var hms_start = "" + addZero(hour) + ":" + addZero(minute);
          var hms_end = "" + addZero(hour) + ":" + addZero(minute);
          $("#viewProgramList_calendar_start-datepicker-input").val(date_start);
          $("#viewProgramList_calendar_end-datepicker-input").val(date_end);
          $("#viewProgramList_calendar_start-hms-input").val(hms_start);
          $("#viewProgramList_calendar_end-hms-input").val(hms_end);
          break;
        case 'today':
          var now = new Date();
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hour = now.getHours();
          var minute = now.getMinutes();
          var date_start = "" + year + "-" + addZero(month) + "-" + addZero(date);
          var date_end = "" + year + "-" + addZero(month) + "-" + addZero(date);
          var hms_start = "" + "00" + ":" + "00";
          var hms_end = "" + "23" + ":" + "59";
          $("#viewProgramList_calendar_start-datepicker-input").val(date_start);
          $("#viewProgramList_calendar_end-datepicker-input").val(date_end);
          $("#viewProgramList_calendar_start-hms-input").val(hms_start);
          $("#viewProgramList_calendar_end-hms-input").val(hms_end);
          break;
        case 'yesterday':
          var now = new Date();
          now = new Date(now.getTime() - 86400000);
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hour = now.getHours();
          var minute = now.getMinutes();
          var date_start = "" + year + "-" + addZero(month) + "-" + addZero(date);
          var date_end = "" + year + "-" + addZero(month) + "-" + addZero(date);
          var hms_start = "" + "00" + ":" + "00";
          var hms_end = "" + "23" + ":" + "59";
          $("#viewProgramList_calendar_start-datepicker-input").val(date_start);
          $("#viewProgramList_calendar_end-datepicker-input").val(date_end);
          $("#viewProgramList_calendar_start-hms-input").val(hms_start);
          $("#viewProgramList_calendar_end-hms-input").val(hms_end);
          break;
        case 'tomorrow':
          var now = new Date();
          now = new Date(now.getTime() + 86400000);
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hour = now.getHours();
          var minute = now.getMinutes();
          var date_start = "" + year + "-" + addZero(month) + "-" + addZero(date);
          var date_end = "" + year + "-" + addZero(month) + "-" + addZero(date);
          var hms_start = "" + "00" + ":" + "00";
          var hms_end = "" + "23" + ":" + "59";
          $("#viewProgramList_calendar_start-datepicker-input").val(date_start);
          $("#viewProgramList_calendar_end-datepicker-input").val(date_end);
          $("#viewProgramList_calendar_start-hms-input").val(hms_start);
          $("#viewProgramList_calendar_end-hms-input").val(hms_end);
          break;
        default:
          break;
      }
      that.datePicker_start.onChangeEnabled = false;
      that.datePicker_start.setCalendarDate()
      that.datePicker_end.setCalendarDate()
      that.datePicker_start.onChangeEnabled = true;

      function addZero(number){
        if(number < 10){
          return "0" + number;
        }else{
          return String(number)
        }
      }
    },
    detailDialog: {
      open: function (item, callback) {
        var that = this;
        var taskDialog = new PopupDialog({
          url: 'content/navigationSlider/viewProgramDetailDialog/index.html',
          width: 725,
          height: 649,
          context: that,
          callback: function () {
            $("#viewProgramDetailContent .content").mCustomScrollbar({
              theme: "light"
            });

            $('#taskDialog_title').text((item.title || "") + i18n('NAVMNGSLIDER_DETAIL'));

            var start = item['start'] || "";
            var end = item['end'] || "";
            var title = item['title'] || "";
            var run_time = item['run_time'] || "";
            var confilct = item['confilct'] || "";
            if (confilct == 0) {
              confilct = "正常"
            } else if (confilct == 1) {
              confilct = "有空隙"
            } else if (confilct == 2) {
              confilct = "有重叠"
            } else {
              confilct = ""
            }
            var status = item['status'] || "";
            if (status == 0) {
              status = "初始化"
            } else if (status == 1) {
              status = "初始导入"
            } else if (status == 2) {
              status = "准备播放"
            } else if (status == 3) {
              status = "播放结束"
            } else {
              status = ""
            }
            var estatus = item['estatus'] || "";
            if (estatus == 0) {
              estatus = "正常"
            } else if (estatus == 1) {
              estatus = "异常"
            } else {
              estatus = ""
            }
            var emessage = item['emessage'] || "";
            var channel_id = item['channel_id'] || "";
            var channel_name = item['channel_name'] || "";
            var program_name = item['program_name'] || "";
            var blank = item['blank'] || "";
            var assetrecommendclass = item['assetrecommendclass'] || "";
            var posterboard = item['posterboard'] || "";
            var file_path = item['file_path'] || "";
            var summary_short = item['summary_short'] || "";
            var provider_id = item['provider_id'] || "";
            var asset_id = item['asset_id'] || "";

            $('#viewProgram_channel_id').val(channel_id);
            $('#viewProgram_channel_name').val(channel_name);
            $('#viewProgram_program_name').val(program_name);
            $('#viewProgram_title').val(title);
            $('#viewProgram_blank').val(blank);
            $('#viewProgram_start').val(start);
            $('#viewProgram_end').val(end);
            $('#viewProgram_run_time').val(run_time);
            $('#viewProgram_confilct').val(confilct);
            $('#viewProgram_assetrecommendclass').val(assetrecommendclass);
            $('#viewProgram_posterboard').val(posterboard);
            $('#viewProgram_file_path').val(file_path);
            $('#viewProgram_summary_short').val(summary_short);
            $('#viewProgram_provider_id').val(provider_id);
            $('#viewProgram_asset_id').val(asset_id);
            $('#viewProgram_status').val(status);
            $('#viewProgram_estatus').val(estatus);
            $('#viewProgram_emessage').val(emessage);
          }
        });
        taskDialog.open();
        that.taskDialog = taskDialog;
      },
    },
  };

  var EditProgramListPage = {
    init: function (option) {
      var that = this;
      $(".panel_page_body .module").hide();
      $("#navigationSlider .panel_page_head_right .module").hide();
      $("#navigationSlider .panel_page_head_left .module").hide();


      $("#panel_page_head_jobHistory").show();
      $("#panel_page_head_jobHistory .panel_page_head_title").text(option.name + i18n("NAVMNGSLIDER_JIEMULIEBIAO"));

      $("#navigationSlider .panel_page_head_right .editProgramList").show();

      $("#navigationSlider_viewProgramList_table").empty();
      $("#navigationSlider_viewProgramList").show();
      that.initParm(option);
      that.initTable();
      that.bindEvent();

    },
    initParm: function (option) {
      var that = this;
      that.channel_ids = option && option['metadata_public'] && option['metadata_public']["channelID"] || "";
      that.channel_name = option.name || "";
      $("#viewProgramList_calendar_start").empty();
      $("#viewProgramList_calendar_end").empty();

      var str;
      var result = new Date();
      var  _dif = new Date().getTimezoneOffset()
      result = result.getTime() + _dif * 60 * 1000;
      var status = option && option['status'];
      if(status == 'run'){
        result = result + 1 * 60 * 1000;
      }
      result = new Date(result);
      var year = result.getFullYear();
      var month = result.getMonth() + 1;
      var date = result.getDate();
      var hour = result.getHours();
      var minute = result.getMinutes();
      var second = result.getSeconds();
      str ="" + year + "-" + addZero(month) + "-" + addZero(date) + "T" + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second) + "Z";
      that.start_time_range_start = str;

      function addZero(number){
        if(number < 10){
          return "0" + number;
        }else{
          return String(number)
        }
      }
    },
    initTable: function () {
      var that = this;
      var title = [{
        label: i18n("NAVMNGSLIDER_PROGRAMSTARTTIME")
      }, {
        label: i18n("NAVMNGSLIDER_PROGRAMENDTIME")
      }, {
        label: i18n("NAVMNGSLIDER_PROGRAMTITLE")
      }, {
        label: i18n("NAVMNGSLIDER_PLAYALLTIME")
      }, {
        label: i18n("NAVMNGSLIDER_LIANXUXING")
      }, {
        label: i18n("NAVMNGSLIDER_CURRENTSTATUS")
      }, {
        label: i18n("NAVMNGSLIDER_PROGRAMLOAD")
      }, {
        label: i18n("NAVMNGSLIDER_ERRORMSG")
      }, {
        label: i18n("NAVMNGSLIDER_CAOZUO")
      }];
      var widths = [0.1268, 0.1268, 0.13261, 0.08566, 0.08401, 0.0864, 0.0766, 0.0906, 0.19604];
      var list_table = new StyledList({
        rows: 14,
        columns: title.length,
        containerId: 'navigationSlider_viewProgramList_table',
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
        var start = (page - 1) * 14;
        var end = page * 14 - 1;
        var option = {
          start: start,
          end: end,
          channel_ids: that.channel_ids
        };
        option.start_time_range_start = encodeURIComponent(that.start_time_range_start);

        API.getProgramList(option, function (data, allCount) {
          that.data = data;
          var listData = that.formListDataForList(data);
          list_table.onTotalCount(allCount);
          callback(listData);
        })
      };
      list_table.create();
      that.list_table = list_table;
      $(window).on("resize", function () {
        list_table.resize();
      })
    },
    bindEvent: function () {
      var that = this;
      $('#panel_page_head_jobHistory .panel_page_head_button.back').unbind("click").click(function () {
        Main.recover();
      });
      $('#navigationSlider_viewProgramList').on('click', '.opr', function () {
        var opr = $(this);
        var type = opr.attr('data-type');
        var index = opr.attr('data-id');
        var item = that.data[index];
        switch (type) {
          case 'view':
            that.detailDialog.open(item);
            break;
          case 'add':
            that.assetDialog.init({
              channelId: that.channel_ids,
              channelName: that.channel_name,
              endTime: item['end'],
              beforeScheduleId: item['_id']
            }, function(){
              that.list_table.refreshList();
            });
            break;
          case 'del':
            showMsgDialog({
              width: 517,
              msg: i18n("NAVMNGSLIDER_MSG6"),
              buttonMsg: i18n("NAVMNGSLIDER_CONTINUE"),
            }, function () {
              API.deleteAssetFromList({
                channel_id: that.channel_ids,
                event_id: item['_id']
              }, function(){
                that.list_table.refreshList();
              }, function (status) {
                showMsgDialog({
                  msg: i18n("NAVMNGSLIDER_DELETEASSETFAILED") + status,
                });
              });
            });
            break;
          default:
            break;
        }
      });
      $('#navigationSlider_add_btn').unbind('click').click(function(){
        that.assetDialog.init({
          channelId: that.channel_ids,
          channelName: that.channel_name,
        }, function(){
          that.list_table.refreshList();
        });
      });
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
        var arr1 = item['start'] || "";
        var arr2 = item['end'] || "";
        var arr3 = item['title'] || "";
        var arr4 = item['run_time'] || "";
        var arr5 = item['confilct'] || "";
        if (arr5 == 0) {
          arr5 = "正常"
        } else if (arr5 == 1) {
          arr5 = "<span style='color:red'>有空隙</span>"
        } else if (arr5 == 2) {
          arr5 = "<span style='color:red'>有重叠</span>"
        } else {
          arr5 = ""
        }
        var arr6 = item['status'] || "";
        if (arr6 == 0) {
          arr6 = "初始化"
        } else if (arr6 == 1) {
          arr6 = "初始导入"
        } else if (arr6 == 2) {
          arr6 = "准备播放"
        } else if (arr6 == 3) {
          arr6 = "播放结束"
        } else {
          arr6 = ""
        }
        var arr7 = item['estatus'] || "";
        if (arr7 == 0) {
          arr7 = "正常"
        } else if (arr7 == 1) {
          arr7 = "<span style='color:red'>异常</span>"
        } else {
          arr7 = ""
        }
        var arr8 = item['emessage'] || "";
        if (arr8) {
        } else {
          arr8 = "-"
        }
        var arr9 = getSingleItemOperation(item, i);
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
        }, {
          label: arr7
        }, {
          label: arr8
        }, {
          label: arr9
        }];
        return arr;
      }

      function getSingleItemOperation(item, i) {
        var oprView = '<span class="opr" data-type="view" data-id="' + i + '">' + i18n('NAVMNGSLIDER_VIEWDETAIL') + '</span>';
        var oprAdd = '<span class="opr" data-type="add" data-id="' + i + '">' + i18n('NAVMNGSLIDER_ADDAFTER') + '</span>';
        var oprDel = '<span class="opr" data-type="del" data-id="' + i + '">' + i18n('NAVMNGSLIDER_DEL') + '</span>';
        var opr = oprView + oprAdd + oprDel;
        return opr;
      }

    },
    detailDialog: {
      open: function (item, callback) {
        var that = this;
        var taskDialog = new PopupDialog({
          url: 'content/navigationSlider/viewProgramDetailDialog/index.html',
          width: 725,
          height: 649,
          context: that,
          callback: function () {
            $("#viewProgramDetailContent .content").mCustomScrollbar({
              theme: "light"
            });

            $('#taskDialog_title').text((item.title || "") + i18n('NAVMNGSLIDER_DETAIL'));

            var start = item['start'] || "";
            var end = item['end'] || "";
            var title = item['title'] || "";
            var run_time = item['run_time'] || "";
            var confilct = item['confilct'] || "";
            if (confilct == 0) {
              confilct = "正常"
            } else if (confilct == 1) {
              confilct = "有空隙"
            } else if (confilct == 2) {
              confilct = "有重叠"
            } else {
              confilct = ""
            }
            var status = item['status'] || "";
            if (status == 0) {
              status = "初始化"
            } else if (status == 1) {
              status = "初始导入"
            } else if (status == 2) {
              status = "准备播放"
            } else if (status == 3) {
              status = "播放结束"
            } else {
              status = ""
            }
            var estatus = item['estatus'] || "";
            if (estatus == 0) {
              estatus = "正常"
            } else if (estatus == 1) {
              estatus = "异常"
            } else {
              estatus = ""
            }
            var emessage = item['emessage'] || "";
            var channel_id = item['channel_id'] || "";
            var channel_name = item['channel_name'] || "";
            var program_name = item['program_name'] || "";
            var blank = item['blank'] || "";
            var assetrecommendclass = item['assetrecommendclass'] || "";
            var posterboard = item['posterboard'] || "";
            var file_path = item['file_path'] || "";
            var summary_short = item['summary_short'] || "";
            var provider_id = item['provider_id'] || "";
            var asset_id = item['asset_id'] || "";

            $('#viewProgram_channel_id').val(channel_id);
            $('#viewProgram_channel_name').val(channel_name);
            $('#viewProgram_program_name').val(program_name);
            $('#viewProgram_title').val(title);
            $('#viewProgram_blank').val(blank);
            $('#viewProgram_start').val(start);
            $('#viewProgram_end').val(end);
            $('#viewProgram_run_time').val(run_time);
            $('#viewProgram_confilct').val(confilct);
            $('#viewProgram_assetrecommendclass').val(assetrecommendclass);
            $('#viewProgram_posterboard').val(posterboard);
            $('#viewProgram_file_path').val(file_path);
            $('#viewProgram_summary_short').val(summary_short);
            $('#viewProgram_provider_id').val(provider_id);
            $('#viewProgram_asset_id').val(asset_id);
            $('#viewProgram_status').val(status);
            $('#viewProgram_estatus').val(estatus);
            $('#viewProgram_emessage').val(emessage);
          }
        });
        taskDialog.open();
        that.taskDialog = taskDialog;
      },
    },
    assetDialog: {
      init: function (options, callback) {
        var that = this;
        that.channelId = options.channelId || null;
        that.channelName = options.channelName || null;
        that.beforeScheduleId = options.beforeScheduleId || null;
        that.endTime = options.endTime || '';
        that.callback = callback || null;
        that.dialog = new PopupDialog({
          url: "content/navigationSlider/addAssetDialog/add_asset.html",
          height: 718,
          width: 954,
          context: that,
          callback: function(){
            that.initTable();
            that.bindEvents();
          }
        });
        that.dialog.create();
      },
      bindEvents: function(){
        let that = this;
        $('#navigation_add_asset')
          .on('click', '._dialog_foot ._cancel', () => {
            this.dialog.close();
          })
          .on('click', '._dialog_foot ._confirm', ({currentTarget, target}) => {
            var start_time = new Date();
            var calendar_start_time = $("#navigation_add_asset_calendar-datepicker-input").val();
            var calendar_start_time_array = calendar_start_time.split('-');
            var year_ = parseInt(calendar_start_time_array[0]);
            var month_ = parseInt(calendar_start_time_array[1]);
            var day_ = parseInt(calendar_start_time_array[2]);
            var hour_ = parseInt(that.hourSelect.getKey());
            var minute_ = parseInt(that.minuteSelect.getKey());
            var second_ = parseInt(that.secondSelect.getKey());
            start_time.setFullYear(year_);
            start_time.setMonth(month_ - 1);
            start_time.setDate(day_);
            start_time.setHours(hour_);
            start_time.setMinutes(minute_);
            start_time.setSeconds(second_);

            if (currentTarget ==  target) {
              var selectedEl = $('#navigation_asset_list .i-check input:checked');
              if (selectedEl.length == 0){
                showMsgDialog({
                  msg: i18n("NAVMNGSLIDER_ADDASSETFALERT1"),
                });
                return;
              }
              var selects = []
              for (var i = 0; i < selectedEl.length; i++) {
                var select = selectedEl[i];
                var index = $(select).data('index');
                var data = that.data[index];
                var run_time = data['run_time'] || "00:00:00";
                var run_time_arry = run_time.split(':');
                var hour = run_time_arry[0];
                var minute = run_time_arry[1];
                var second = run_time_arry[2];
                var start = new Date(start_time.getTime());
                var end = new Date(start.getTime() + parseInt(hour)*60*60*1000 + parseInt(minute)*60*1000 + parseInt(second)*1000);
                var date_start = "" + start.getFullYear() + "-" + addZero(start.getMonth() + 1) + "-" + addZero(start.getDate()) + " " + addZero(start.getHours())+ ":" + addZero(start.getMinutes())+ ":" + addZero(start.getSeconds());
                var date_end = "" + end.getFullYear() + "-" + addZero(end.getMonth() + 1) + "-" + addZero(end.getDate()) + " " + addZero(end.getHours())+ ":" + addZero(end.getMinutes())+ ":" + addZero(end.getSeconds());
                selects.push({
                  "channel_id": that.channelId,
                  "channel_name": that.channelName,
                  "program_name": data['title'],
                  //"title": data['title'],
                  //"run_time": data['run_time'],
                  "start" : date_start,
                  "end" : date_end,
                  "provider_id" : data['provider_id'],
                  "asset_id" : data['asset_id']
                })
              }
            }
            if(that.beforeScheduleId){
              showMsgDialog({
                width: 517,
                msg: i18n("NAVMNGSLIDER_MSG7"),
                buttonMsg: i18n("NAVMNGSLIDER_CONTINUE"),
              }, function () {
                API.addAssetToList({
                  channel_id: that.channelId,
                  postData:selects,
                  after: that.beforeScheduleId
                }, function(){
                  that.dialog.close();
                  that.callback && that.callback();
                }, function (status) {
                  showMsgDialog({
                    msg: i18n("NAVMNGSLIDER_ADDASSETFAILED") + status,
                  });
                });
              });
            }else{
              showMsgDialog({
                width: 517,
                msg: i18n("NAVMNGSLIDER_MSG7"),
                buttonMsg: i18n("NAVMNGSLIDER_CONTINUE"),
              }, function () {
                API.addAssetToList({
                  channel_id: that.channelId,
                  postData:selects
                }, function(){
                  that.dialog.close();
                  that.callback && that.callback();
                }, function (status) {
                  showMsgDialog({
                    msg: i18n("NAVMNGSLIDER_ADDASSETFAILED") + status,
                  });
                });
              });
            }
            return;
          })
          .on('keyup', '.search_bar input', ({currentTarget, target, keyCode, which}) => {
            if (target ==currentTarget) {
              var key = keyCode || which
              if (key ==13) {
                that.table.refreshList();
              }
            }
          })
          .on('click', '.search_bar .btn', ({currentTarget, target}) => {
            if (target ==currentTarget) {
              that.table.refreshList();
            }
          })
          .on('click', '#navigation_asset_list .i-check input', ({currentTarget, target}) => {
            if (currentTarget == target) {
              // $('#navigation_asset_list .i-check input').prop('checked', null);
              //$(currentTarget).prop('checked', 'checked');
            }
          })

      },
      initTable: function(){
        let that = this;

        var calendarStyles = {
          width: 282,
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
          borderColor: 'rgba(198,198,198)',
          borderWidth: '1',
          borderRadius: '0px',
          width: '178px',
        };
        var hmsInputStyles = {
          borderColor: 'rgba(0,0,0,0)',
          borderWidth: '0',
          borderRadius: '5px',
          width: '100px',
        };
        that.datePicker_start = new DatePicker({
          containerId: 'navigation_add_asset_calendar',
          calendarStyles: calendarStyles,
          dateInputStyles: dateInputStyles,
          hmsInputStyles: hmsInputStyles,
          iconImage: 'images/product_date.png',
          iconStyle: {
            left: 150
          },
          editable: false
        });
        that.datePicker_start.setCalendarDate = function () {
          var dateStr = this.jqDateInput.val();
          if (dateStr == "") {
            this.clear();
            this.onChange();
          } else {
            this.calendar.setCurrDate(this.parseDateStr(dateStr));
            this.setInputDate();
          }
        };

        var hourSelect_options = Array.apply(null, Array(24)).map(function(item, index){
          var result = ""
          if(index < 10){
            result = "0" + index;
          }else{
            result = "" + index;
          }
          return {
            key: result,
            value: result
          }
        });
        var hourSelect = new newSelect('#navigation_add_asset_hourselect', [], {
          width: 67,
          height: 30,
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
          ScrollBarHeight: "124px"
        });
        hourSelect.updateSelectOptions(hourSelect_options);
        this.hourSelect = hourSelect;

        var minuteSelect_options = Array.apply(null, Array(60)).map(function(item, index){
          var result = ""
          if(index < 10){
            result = "0" + index;
          }else{
            result = "" + index;
          }
          return {
            key: result,
            value: result
          }
        });
        var minuteSelect = new newSelect('#navigation_add_asset_minuteselect', [], {
          width: 67,
          height: 30,
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
          ScrollBarHeight: "124px"
        });
        minuteSelect.updateSelectOptions(minuteSelect_options);
        this.minuteSelect = minuteSelect;

        var secondSelect_options = Array.apply(null, Array(60)).map(function(item, index){
          var result = ""
          if(index < 10){
            result = "0" + index;
          }else{
            result = "" + index;
          }
          return {
            key: result,
            value: result
          }
        });
        var secondSelect = new newSelect('#navigation_add_asset_secondselect', [], {
          width: 67,
          height: 30,
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
          ScrollBarHeight: "124px"
        });
        secondSelect.updateSelectOptions(secondSelect_options);
        this.secondSelect = secondSelect;

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
        let table = new StyledList({
          containerId: "navigation_asset_list",
          rows: 12,
          columns: 7,
          titles: title,
          styles: style,
          listType: 1,
          async: true
        });
        table.getPageData = function (page, callback) {
          var start = (page - 1) * 12;
          var end = page * 12 - 1;
          var search = $('#search_input').val();
          var option = {
            start: start,
            end: end,
            type: 'asset',
            search: search
          };
          API.getAsset(option, function (data, allCount) {
            that.data = data;
            var listData = that.formListDataForList(data);
            table.onTotalCount(allCount);
            callback(listData);
          })
        };
        table.create();
        that.table = table;

        if(that.beforeScheduleId){
          var timeArray = that.endTime.split(' ');
          if(timeArray.length == 2){
            var date_start = timeArray[0];
            var hmsStr = timeArray[1];
            $("#navigation_add_asset_calendar-datepicker-input").val(date_start);
            that.datePicker_start.onChangeEnabled = false;
            that.datePicker_start.setCalendarDate();
            that.datePicker_start.onChangeEnabled = true;

            var hmsArray = hmsStr.split(':');
            var hour = hmsArray[0];
            var minute = hmsArray[1];
            var second = hmsArray[2];
            this.hourSelect.setKey(addZero(hour));
            this.minuteSelect.setKey(addZero(minute));
            this.secondSelect.setKey(addZero(second));
          }
        }else{
          //从顶部进入
          var now = new Date();
          now = new Date(now.getTime() + 1*60*60*1000);
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hour = now.getHours();
          var minute = now.getMinutes();
          var second = now.getSeconds();
          var date_start = "" + year + "-" + addZero(month) + "-" + addZero(date);
          $("#navigation_add_asset_calendar-datepicker-input").val(date_start);
          that.datePicker_start.onChangeEnabled = false;
          that.datePicker_start.setCalendarDate();
          that.datePicker_start.onChangeEnabled = true;

          this.hourSelect.setKey(addZero(hour));
          this.minuteSelect.setKey(addZero(minute));
          this.secondSelect.setKey(addZero(second));
        }
      },
      formListDataForList: function(resp){
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
    }
  };

  var API = {
    checkScheduletvImporting: function (callback, errorCallback) {
      var that = this;
      var url = aquapaas_host + "/aquapaas/rest/scheduletv/importstate";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
        },
        contentType: "application/json",
        dataType: "JSON",
      }).done(function (data, status, xhr) {
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status, textStatus);
      });
    },
    scheduletvImport: function (url_, callback, errorCallback) {
      var that = this;
      var url = aquapaas_host + "/aquapaas/rest/scheduletv/import";
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
        dataType: "JSON",
        data: JSON.stringify({
          "source": url_
        })
      }).done(function (data, status, xhr) {
        callback && callback();
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status, textStatus);
      });
    },
    getList: function (options, callback) {
      /*
      var that = this;
      callback({
        "id": "5d4812cc967ff600a8e9b1b0",
        "name": "quanwangshi全视界",
        "enable": true,
        "create_time": "2019-08-05T19:28:12+0800",
        "last_modified_time": "2019-08-05T19:34:45+0800",
        "metadata": {},
        "metadata_public": {
          "source": "ui",
          "readonly": "false",
          "needSetNavPath": "true",
          "EPGID": "quanwangshi",
          "productTag": "qwslb",
          "app_type": "普通类型",
          "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/001%E7%8E%8B%E7%89%8C%E7%BB%BC%E8%89%BA.jpg"
        },
        "tree_metadata_public": {
          "source": "ui",
          "readonly": "false",
          "needSetNavPath": "true",
          "EPGID": "quanwangshi",
          "productTag": "qwslb",
          "app_type": "普通类型",
          "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/001%E7%8E%8B%E7%89%8C%E7%BB%BC%E8%89%BA.jpg"
        },
        "children_count": 23,
        "children": [{
          "id": "5d481445967ff600a8e9b1b3",
          "ext_id": "1",
          "name": "好看",
          "title": "好看",
          "description": "好看",
          "node_class": "folder",
          "index": 1,
          "enable": true,
          "create_time": "2019-08-05T19:34:29+0800",
          "last_modified_time": "2019-08-05T19:36:44+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "001",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E5%A5%BD%E7%9C%8B/001%E7%8E%8B%E7%89%8C%E7%BB%BC%E8%89%BA.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d48147d967ff600a8e9b1b4",
          "ext_id": "2",
          "name": "少年时代 ",
          "title": "少年时代 ",
          "description": "少年时代 ",
          "node_class": "folder",
          "index": 2,
          "enable": true,
          "create_time": "2019-08-05T19:35:25+0800",
          "last_modified_time": "2019-08-05T19:36:01+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "005",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E5%B0%91%E5%B9%B4%E6%97%B6%E4%BB%A3%20/002%E5%8F%A3%E7%A2%91%E5%A5%BD%E5%89%A7.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d67aa6a967ff600aa52459c",
          "ext_id": "3",
          "name": "今日关注",
          "title": "今日关注",
          "description": "今日关注",
          "node_class": "folder",
          "index": 3,
          "enable": true,
          "create_time": "2019-08-29T18:35:22+0800",
          "last_modified_time": "2019-08-29T18:36:25+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "021",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E4%BB%8A%E6%97%A5%E5%85%B3%E6%B3%A8/007%E5%86%9B%E6%97%85%E5%89%A7%E5%9C%BA.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d49179d967ff600a8e9b1b6",
          "ext_id": "1001",
          "name": "王牌综艺",
          "title": "王牌综艺",
          "description": "王牌综艺",
          "node_class": "folder",
          "index": 11,
          "enable": true,
          "create_time": "2019-08-06T14:01:01+0800",
          "last_modified_time": "2019-08-06T14:01:38+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "115",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E7%8E%8B%E7%89%8C%E7%BB%BC%E8%89%BA/001%E7%8E%8B%E7%89%8C%E7%BB%BC%E8%89%BA.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d4917f3967ff600a8e9b1b7",
          "ext_id": "1002",
          "name": "口碑好剧",
          "title": "口碑好剧",
          "description": "口碑好剧",
          "node_class": "folder",
          "index": 13,
          "enable": true,
          "create_time": "2019-08-06T14:02:27+0800",
          "last_modified_time": "2019-08-06T14:03:05+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1002",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E5%8F%A3%E7%A2%91%E5%A5%BD%E5%89%A7/002%E5%8F%A3%E7%A2%91%E5%A5%BD%E5%89%A7.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d49185c967ff600a8e9b1b8",
          "ext_id": "1003",
          "name": "流金经典",
          "title": "流金经典",
          "description": "流金经典",
          "node_class": "folder",
          "index": 15,
          "enable": true,
          "create_time": "2019-08-06T14:04:12+0800",
          "last_modified_time": "2019-08-06T14:04:39+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1003",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E6%B5%81%E9%87%91%E7%BB%8F%E5%85%B8/003%E9%99%A2%E7%BA%BF%E8%A7%86%E7%95%8C.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d4918bf967ff600a8e9b1b9",
          "ext_id": "1004",
          "name": "宝宝乐园",
          "title": "宝宝乐园",
          "description": "宝宝乐园",
          "node_class": "folder",
          "index": 17,
          "enable": true,
          "create_time": "2019-08-06T14:05:51+0800",
          "last_modified_time": "2019-08-06T14:06:18+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1004",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E5%AE%9D%E5%AE%9D%E4%B9%90%E5%9B%AD/004%E6%BC%AB%E6%97%A0%E8%BE%B9%E7%95%8C.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d49192a967ff600a8e9b1ba",
          "ext_id": "1005",
          "name": "古装玄幻",
          "title": "古装玄幻",
          "description": "古装玄幻",
          "node_class": "folder",
          "index": 19,
          "enable": true,
          "create_time": "2019-08-06T14:07:38+0800",
          "last_modified_time": "2019-08-06T14:08:11+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1005",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E5%8F%A4%E8%A3%85%E7%8E%84%E5%B9%BB/005%E7%8E%84%E5%B9%BB%E5%8F%B2%E8%AF%97.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d4919ea967ff600a8e9b1bb",
          "ext_id": "1006",
          "name": "爱情宝典",
          "title": "爱情宝典",
          "description": "爱情宝典",
          "node_class": "folder",
          "index": 21,
          "enable": true,
          "create_time": "2019-08-06T14:10:50+0800",
          "last_modified_time": "2019-08-06T14:11:36+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1006",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E7%88%B1%E6%83%85%E5%AE%9D%E5%85%B8/007%E5%86%9B%E6%97%85%E5%89%A7%E5%9C%BA.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491a3e967ff600a8e9b1bc",
          "ext_id": "1007",
          "name": "铁血战争",
          "title": "铁血战争",
          "description": "铁血战争",
          "node_class": "folder",
          "index": 23,
          "enable": true,
          "create_time": "2019-08-06T14:12:14+0800",
          "last_modified_time": "2019-08-06T14:12:38+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1007",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E9%93%81%E8%A1%80%E6%88%98%E4%BA%89/007%E5%86%9B%E6%97%85%E5%89%A7%E5%9C%BA.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491a86967ff600a8e9b1bd",
          "ext_id": "1008",
          "name": "罪案谍战",
          "title": "罪案谍战",
          "description": "罪案谍战",
          "node_class": "folder",
          "index": 25,
          "enable": true,
          "create_time": "2019-08-06T14:13:26+0800",
          "last_modified_time": "2019-08-06T14:13:54+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1008",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E7%BD%AA%E6%A1%88%E8%B0%8D%E6%88%98/008%E7%BD%AA%E6%A1%88%E8%B0%8D%E6%88%98.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491ac6967ff600a8e9b1be",
          "ext_id": "1009",
          "name": "情感剧场",
          "title": "情感剧场",
          "description": "情感剧场",
          "node_class": "folder",
          "index": 27,
          "enable": true,
          "create_time": "2019-08-06T14:14:30+0800",
          "last_modified_time": "2019-08-06T14:15:02+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1009",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E6%83%85%E6%84%9F%E5%89%A7%E5%9C%BA/009%E9%83%BD%E5%B8%82%E5%89%A7%E5%9C%BA.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491b11967ff600a8e9b1bf",
          "ext_id": "1010",
          "name": "青春剧场",
          "title": "青春剧场",
          "description": "青春剧场",
          "node_class": "folder",
          "index": 29,
          "enable": true,
          "create_time": "2019-08-06T14:15:45+0800",
          "last_modified_time": "2019-08-06T14:16:11+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1010",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E9%9D%92%E6%98%A5%E5%89%A7%E5%9C%BA/010%E9%9D%92%E6%98%A5%E5%89%A7%E5%9C%BA.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491b55967ff600a8e9b1c0",
          "ext_id": "1011",
          "name": "偶像专场",
          "title": "偶像专场",
          "description": "偶像专场",
          "node_class": "folder",
          "index": 31,
          "enable": true,
          "create_time": "2019-08-06T14:16:53+0800",
          "last_modified_time": "2019-08-06T14:17:19+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1011",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E5%81%B6%E5%83%8F%E4%B8%93%E5%9C%BA/011%E7%AB%A5%E5%BF%83%E6%9C%AA%E6%B3%AF.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491b97967ff600a8e9b1c1",
          "ext_id": "1012",
          "name": "高分佳片",
          "title": "高分佳片",
          "description": "高分佳片",
          "node_class": "folder",
          "index": 33,
          "enable": true,
          "create_time": "2019-08-06T14:17:59+0800",
          "last_modified_time": "2019-08-06T14:18:39+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1012",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E9%AB%98%E5%88%86%E4%BD%B3%E7%89%87/012%E7%BB%8F%E5%85%B8%E6%B8%AF%E7%89%87.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491be9967ff600a8e9b1c2",
          "ext_id": "1013",
          "name": "开心解压 ",
          "title": "开心解压 ",
          "description": "开心解压 ",
          "node_class": "folder",
          "index": 35,
          "enable": true,
          "create_time": "2019-08-06T14:19:21+0800",
          "last_modified_time": "2019-08-06T14:19:46+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1013",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E5%BC%80%E5%BF%83%E8%A7%A3%E5%8E%8B%20/013%E5%96%9C%E5%89%A7%E5%B9%BD%E9%BB%98.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491c29967ff600a8e9b1c3",
          "ext_id": "1014",
          "name": "人物传奇",
          "title": "人物传奇",
          "node_class": "folder",
          "index": 37,
          "enable": true,
          "create_time": "2019-08-06T14:20:25+0800",
          "last_modified_time": "2019-08-06T14:21:02+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1014",
            "navpath": "quanwangshi全视界/",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E4%BA%BA%E7%89%A9%E4%BC%A0%E5%A5%87/014%E6%8E%A2%E7%B4%A2%E8%AE%B0%E5%BD%95.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491c7e967ff600a8e9b1c4",
          "ext_id": "1015",
          "name": "生活百科 ",
          "title": "生活百科 ",
          "description": "生活百科 ",
          "node_class": "folder",
          "index": 39,
          "enable": true,
          "create_time": "2019-08-06T14:21:50+0800",
          "last_modified_time": "2019-08-06T14:22:18+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1015",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E7%94%9F%E6%B4%BB%E7%99%BE%E7%A7%91%20/015%E8%90%8C%E5%AE%A0%E9%99%AA%E4%BC%B4.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491d31967ff600a8e9b1c5",
          "ext_id": "1016",
          "name": "课堂知识",
          "title": "课堂知识",
          "description": "课堂知识",
          "node_class": "folder",
          "index": 41,
          "enable": true,
          "create_time": "2019-08-06T14:24:49+0800",
          "last_modified_time": "2019-08-06T14:25:18+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1016",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E8%AF%BE%E5%A0%82%E7%9F%A5%E8%AF%86/016%E5%A4%A9%E5%A4%A9%E8%AF%BE%E5%A0%82.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491d74967ff600a8e9b1c6",
          "ext_id": "1017",
          "name": "音乐之声",
          "title": "音乐之声",
          "description": "音乐之声",
          "node_class": "folder",
          "index": 43,
          "enable": true,
          "create_time": "2019-08-06T14:25:56+0800",
          "last_modified_time": "2019-08-06T14:26:22+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1017",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E9%9F%B3%E4%B9%90%E4%B9%8B%E5%A3%B0/017%E9%9F%B3%E4%B9%90%E7%A7%80%E5%9C%BA.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491db5967ff600a8e9b1c7",
          "ext_id": "1018",
          "name": "年代剧场",
          "title": "年代剧场",
          "description": "年代剧场",
          "node_class": "folder",
          "index": 45,
          "enable": true,
          "create_time": "2019-08-06T14:27:01+0800",
          "last_modified_time": "2019-08-06T14:27:36+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1018",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E5%B9%B4%E4%BB%A3%E5%89%A7%E5%9C%BA/018%E4%B9%90%E6%B4%BB%E5%81%A5%E8%BA%AB.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491dfe967ff600a8e9b1c8",
          "ext_id": "1019",
          "name": "悬疑烧脑",
          "title": "悬疑烧脑",
          "node_class": "folder",
          "index": 47,
          "enable": true,
          "create_time": "2019-08-06T14:28:14+0800",
          "last_modified_time": "2019-08-06T14:28:41+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1019",
            "navpath": "quanwangshi全视界/",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E6%82%AC%E7%96%91%E7%83%A7%E8%84%91/019%E7%BB%BC%E5%90%88%E4%BD%93%E8%82%B2.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }, {
          "id": "5d491e4d967ff600a8e9b1c9",
          "ext_id": "1020",
          "name": "游戏竞技",
          "title": "游戏竞技",
          "description": "游戏竞技",
          "node_class": "folder",
          "index": 49,
          "enable": true,
          "create_time": "2019-08-06T14:29:33+0800",
          "last_modified_time": "2019-08-06T14:30:05+0800",
          "metadata": {},
          "metadata_public": {
            "entryType": "1",
            "channelID": "1020",
            "navpath": "quanwangshi全视界/",
            "app_type": "普通类型",
            "FILE_poster": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E5%85%A8%E8%A7%86%E7%95%8C/%E6%B8%B8%E6%88%8F%E7%AB%9E%E6%8A%80/020%E6%B8%B8%E6%88%8F%E7%AB%9E%E6%8A%80.jpg"
          },
          "objects_url": "",
          "trid": "5d4812cc967ff600a8e9b1b0",
          "objects_url_script": ["{", "}"]
        }],
        "is_public": true,
        "objects_url_script": null
      });
      return;
      */
      var that = this;
      var url = aquapaas_host + NavigationSlider_Root + '?children=1';
      url = url + "&app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
        },
        contentType: "application/json",
        dataType: "JSON"
      }).done(function (data, status, xhr) {
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        callback && callback(textStatus, jqXHR.responseText);
      });
    },
    changeStatus: function (options, callback) {
      var that = this;
      var url = aquapaas_host + "/aquapaas/rest/scheduletv/control/" + options.channel_id;
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      if(typeof options.clear != "undefined"){
        url = url + "&clear=" + options.clear
      }
      if(typeof options.action != "undefined"){
        url = url + "&action=" + options.action
      }

      var result = null;
      $.ajax({
        type: "POST",
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
    getImportLogList: function (options, callback, errorCallback) {
      var that = this;
      var url = aquapaas_host + "/aquapaas/rest/scheduletv/importhistory";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "&inOrder=false";
      if (options.page) {
        url = url + "&page=" + options.page;
      }
      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
        },
        contentType: "application/json",
        dataType: "JSON",
      }).done(function (data, status, xhr) {
        var totalCount = xhr.getResponseHeader('x-aqua-total-count');
        callback && callback(data, totalCount);
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status, textStatus);
      });
    },
    getProgramList: function (options, callback, errorCallback) {
      var that = this;
      var url = aquapaas_host + "/aquapaas/rest/scheduletv/channel/schedule";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      if (typeof options.start !== "undefined") {
        url = url + "&start=" + options.start;
      }
      if (typeof options.end !== "undefined") {
        url = url + "&end=" + options.end;
      }
      if (typeof options.channel_ids !== "undefined") {
        url = url + "&channel_ids=" + options.channel_ids;
      }
      if (typeof options.start_time_range_start !== "undefined") {
        url = url + "&start_time_range_start=" + options.start_time_range_start;
      }
      if (typeof options.end_time_range_end !== "undefined") {
        url = url + "&start_time_range_end=" + options.end_time_range_end;
      }

      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
        },
        contentType: "application/json",
        dataType: "JSON",
      }).done(function (data, status, xhr) {
        var totalCount = xhr.getResponseHeader('x-aqua-total-count');
        callback && callback(data, totalCount);
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status, textStatus);
      });
    },
    getChannelStatus: function(options, callback, errorCallback){
      var that = this;
      var url = aquapaas_host + "/aquapaas/rest/scheduletv/channel/live";
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      if(options.channels.length > 0){
        url = url + "&channel_ids=" + options.channels.join(',');
      }
      var result = null;
      $.ajax({
        type: "GET",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
        },
        contentType: "application/json",
        dataType: "JSON",
      }).done(function (data, status, xhr) {
        callback && callback(data);
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status, textStatus);
      });
    },
    getAsset: function(options, callback){
      let method = 'Post',
        url = aquapaas_host + "/aquapaas/rest/search/contents/" + options.type,
        opts = [], body = [], urlParam = [];
      urlParam.push('app_type=' + paasAppKey);
      urlParam.push('timestamp=' + new Date().toISOString())
      if(options.start){
        urlParam.push("start=" + options.start)
      }
      if(options.end){
        urlParam.push("end=" + options.end)
      }
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
      if (options.search) {
        var titles = options.search.split(',')
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
          let count = (parseInt(xhr.getResponseHeader("x-aqua-total-count")));
          callback && callback(resp, count);
        }
      })
    },
    addAssetToList: function(options, callback, errorCallback){
      var that = this;
      var url = aquapaas_host + "/aquapaas/rest/scheduletvadmin/channel/" + options.channel_id + '/event';
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      if(options.before){
        url = url + "&before=" + options.before;
      }
      if(options.after){
        url = url + "&after=" + options.after;
      }
      var result = null;
      $.ajax({
        type: "POST",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
        },
        contentType: "application/json",
        dataType: "text",
        data: JSON.stringify(options.postData)
      }).done(function (data, status, xhr) {
        callback && callback();
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status, jqXHR.responseText);
      });

    },
    deleteAssetFromList: function(options, callback, errorCallback){
      var that = this;
      var url = aquapaas_host + "/aquapaas/rest/scheduletvadmin/channel/" + options.channel_id + "/event/" + options.event_id;
      url = url + "?app_key=" + paasAppKey + "&timestamp=" + new Date().toISOString() + "&user_id=" + my.paas.user_id + "&access_token=" + my.paas.access_token + "";
      var result = null;
      $.ajax({
        type: "DELETE",
        async: true,
        url: url,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
        },
        contentType: "application/json",
        dataType: "text",
        data: JSON.stringify(options.postData)
      }).done(function (data, status, xhr) {
        callback && callback();
      }).fail(function (jqXHR, textStatus) {
        errorCallback && errorCallback(jqXHR.status, jqXHR.responseText);
      });

    },
  };

  function addZero(number){
    number = parseInt(number);
    if(number < 10){
      return "0" + number;
    }else{
      return String(number)
    }
  }
  return Main;
})(jQuery);

navigationSlider.init();
