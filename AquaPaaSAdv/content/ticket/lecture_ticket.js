var LectureTicket = (function ($) {
  var aqua_host = aquaHost;
  var aquapaas_host = paasHost;


  var searchKeyword = '';
  var AQUA_SEARCH_HOST = aquapaas_host;

  return {
    init: function () {
      var that = this;
      that.initList();
      that.listen();
      that.token = "user_id=" + my.paas.user_id +
        "&user_type=" + my.paas.user_type +
        "&access_token=" + my.paas.access_token +
        "&app_key=" + paasAppKey +
        "&timestamp=";
      var aqua = new Aqua();
      aqua.user.setKey({
        secretAccessKey: my.aqua.secretAccessKey,
        accessKeyId: my.aqua.accessKeyId,
        domain: "tif"
      });
      that.aqua = aqua;
    },
    initList: function () {
      var self = this;
      this.List = new StyledList({
        async: true,
        rows: 15,
        columns: 9,
        containerId: 'lecture_ticket_list',
        listType: 1,
        data: [],
        titles: [
          {
            label: i18n('LECTURETICKET_SUOSHUJIEMU')
          },
          {
            label: i18n('LECTURETICKET_PICIMINGCHEN')
          },
          {
            label: i18n('LECTURETICKET_PICI')
          },
          {
            label: i18n('LECTURETICKET_KECHENGQUANSHULIANG')
          },
          {
            label: i18n('LECTURETICKET_YOUXIAOQI')
          },
          {
            label: i18n('LECTURETICKET_ZHEKOULEIXING')
          },
          {
            label: i18n('LECTURETICKET_ZHEKOUDUIYING')
          },
          {
            label: i18n('LECTURETICKET_DUIHUAN')
          },
          {
            label: i18n('LECTURETICKET_CAOZUO')
          }
                ],
        styles: {
          columnsWidth: [0.125, 0.125,0.1,0.1, 0.1, 0.1, 0.1, 0.1,0.125],
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
      this.List.getPageData = function (pageNumber, gotData) {
        var start = (pageNumber - 1) * 15 + 1;
        var end = pageNumber * 15;
        var options = {
          start: start,
          end: end
        };
        if(searchKeyword != "") {
          options.batch_no = searchKeyword;
        }
        self.api.getListData(options, function (data, allCount) {
          self.List.onTotalCount(allCount);
          gotData(self.formatListData(data));
        });
      };
      this.List.create();
    },
    listen: function () {
      var self = this;
      $('#lecture_ticket_search_input').unbind("click").on('keydown', function (ev) {
        if(ev.keyCode == 13) {
          self.searchTicket();
        }
      });
      $('#lecture_ticket_search_handle').unbind("click").on('click', function (ev) {
        self.searchTicket();
      });
      $('#lecture_ticket_new_btn').unbind("click").on('click', function () {
        self.openAddDialog();
      });
      $('#lecture_ticket_list').unbind("click").on('click', '.lecture_ticket_op', function (ev) {
        var $op = $(this);
        var index = $op.attr('data-index');
        var name = $op.attr('name');
        if(!index) {
          return;
        }
        var courseTicket = self.courseTicketData[Number(index)];
        switch(name) {
        case 'view':
          self.viewCourseTicket(courseTicket);
          break;
        case 'export':
          self.exportCourseTicket(courseTicket);
          break;
        case 'del':
          self.delCourseTicket(courseTicket);
          break;
        default:
          break;
        }
      });
    },
    showSelectCalendar: function (calId) {
      var that = this;
      that.destroyCalendar();
      var sel_cal = new Calendar(calId);
      sel_cal.extendOnClick = function (object) {
        var curr_date_index = -1;
        var length = sel_cal.curr_month_date_elements.length;
        for(var i = 0; i < length; i++) {
          if(sel_cal.curr_month_date_elements[i] === object) {
            curr_date_index = i;
            break;
          }
        }
        if(curr_date_index == -1) {} else {
          var year = sel_cal.helper.curr_month[0];
          var month = sel_cal.helper.curr_month[1];
          that.setDateRange(curr_date_index + 1, month, year, calId);
        }
      };
    },
    destroyCalendar: function () {
      if(jQuery("#lecture_ticket_date_selector").length > 0) {
        jQuery("#lecture_ticket_date_selector")[0].innerHTML = "";
      }
    },
    setDateRange: function (day, month, year, calId) {
      var that = this;
      switch(calId) {
      case "lecture_ticket_date_selector":
        var from_input = document.getElementById("lecture_ticket_date_input_from");
        var _month = month < 9 ? '0' + String(month + 1) : String(month + 1);
        var _day = day < 10 ? '0' + String(day) : String(day);
        var label = String(year) + "-" + _month + "-" + _day;
        from_input.value = label;
        break;
      default:
        break;
      }
      that.destroyCalendar();
    },
    searchTicket: function () {
      searchKeyword = $('#lecture_ticket_search_input').val();
      this.List.update();
    },
    viewCourseTicket: function (data) {
      var that = this;
      that.view.init(data, that);
    },
    exportCourseTicket: function (data) {
      var that = this;
      var third_party = data.third_party;
      var batch_no = data.batch_no;
      var start_time = data.start_time.replace("+", "%2b");
      var end_time = data.end_time.replace("+", "%2b");
      var type = data.type;
      var discount = data.discount;
      var minus_price = data.minus_price;
      that.api.exportTicket([{
        key: "third_party",
        value: third_party
        }, {
        key: "batch_no",
        value: batch_no
        }, {
        key: "start_time",
        value: (start_time)
        }, {
        key: "end_time",
        value: (end_time)
        }, {
        key: "export_format",
        value: "browser"
        }], function (data) {});
    },
    delCourseTicket: function (data) {
      var that = this;
      that.dialog = new PopupDialog({
        url: 'content/ticket/ticket_dialog_delete.html',
        context: this,
        width: 355,
        height: 225,
        callback: function () {
          $('#lecture_recommend_del_confirm').on('click', function () {
            var third_party = data.third_party;
            var batch_no = data.batch_no;
            var courseid = data.courseid;
            that.api.deleteTicket([{
              key: "third_party",
              value: third_party
              }, {
              key: "batch_no",
              value: batch_no
              }], function () {
              that.dialog.close();
              that.List.update();
            });
          });
        }
      });
      this.dialog.open();
    },
    openAddDialog: function () {
      var self = this;
      this.courseHourEditing = null;
      this.dialog = new PopupDialog({
        url: 'content/ticket/ticket_dialog_add_and_edit.html',
        width: 759,
        height: 662,
        context: {},
        callback: function () {
          self.typeCombo = new newSelect("#lecture_ticket_item_type", [{
            key: i18n("LECTURETICKET_MIANFEI"),
            value: "free"
            }, {
            key: "discount",
            value:i18n("LECTURETICKET_ZHEKOU")
            }, {
            value: i18n("LECTURETICKET_LIJIAN"),
            key: "minus"
          }], {
            width: 322,
            height: 30,
            background: "#ffffff",
            selectbackground: "#ffffff",
            openIconUrl: "./uiWidget/images/open1.png",
            closeIconUrl: "./uiWidget/images/close1.png"
          }, function () {})
          self.exchangePriceType = new newSelect("#lecture_ticket_exchange_price_type", [{
            value: i18n("LECTURETICKET_WU"),
            key: ""
          },{
            value: "Points",
            key: "points"
          }], {
            width: 170,
            height: 30,
            background: "#ffffff",
            selectbackground: "#ffffff",
            openIconUrl: "./uiWidget/images/open1.png",
            closeIconUrl: "./uiWidget/images/close1.png"
          }, function () {})
          self.searchType = new newSelect("#lecture_ticket_search_type", [{
            value: i18n("LECTURETICKET_JIEMU"),
            key: "asset"
            }, {
            value: i18n("LECTURETICKET_JIEMUBAO"),
            key: "bundle"
            }, {
            value: i18n("LECTURETICKET_BIAOQIAN"),
            key: "tag"
            },], {
            width: 322,
            height: 30,
            background: "#ffffff",
            selectbackground: "#ffffff",
            openIconUrl: "./uiWidget/images/open1.png",
            closeIconUrl: "./uiWidget/images/close1.png"
          }, function (item) {
            if(item == "asset"){
              $("#asset_name_label").text(i18n("LECTURETICKET_JIEMUMINGCHENG"));
              $("#search_option1").show();
              $("#search_option2").show();
              $("#search_option3").show();
              $("#search_option4").hide();
              self.dialog.resize({
                width: 759,
                height: 662,
              }, true);
            }else if(item == "bundle"){
              $("#asset_name_label").text(i18n("LECTURETICKET_JIEMUBAOMINGCHENG"));
              $("#search_option1").show();
              $("#search_option2").show();
              $("#search_option3").show();
              $("#search_option4").hide();
              self.dialog.resize({
                width: 759,
                height: 662,
              }, true);
            }else{
              $("#search_option1").hide();
              $("#search_option2").hide();
              $("#search_option3").hide();
              $("#search_option4").show();
              self.dialog.resize({
                width: 759,
                height: 597,
              }, true);
            }
            $("#lecture_ticket_item_name").val("");
            self.courseEditing = null;
          })
          $('#lecture_ticket_code_input').on('keydown', function (ev) {
            if(ev.keyCode == 13) {
              self.getCourseInfo();
            }
          });
          $('#lecture_ticket_dialog_get_info').on('click', function () {
            self.getCourseInfo();
          });
          $("#lecture_ticket_date_input_from").unbind("click").click(function () {
            self.showSelectCalendar("lecture_ticket_date_selector");
            return false;
          });
          $('#lecture_ticket_dialog_confirm').on('click', function () {
            if(!self.courseEditing && ((self.searchType.getValue() == "asset") || (self.searchType.getValue() == "bundle"))) {
              alert(i18n('LECTURETICKET_QINGXIANHUOQUJIANGZUOXINXI'));
            } else {
              self.confirmCreate();
            }
          });
        }
      });
      this.dialog.open();
    },
    confirmCreate: function () {
      var self = this;
      var createor_user_id = my.paas.user_id;
      var asset_type = self.searchType.getValue();
      var asset_id = "";
      var asset_name = "";
      var tags = "";
      if((asset_type == "asset") || (asset_type == "bundle")){
        asset_id = $("#lecture_ticket_pid_input").val() + "_" + $("#lecture_ticket_paid_input").val()
        asset_name = $("#lecture_ticket_item_name").val() || "";
      }else{
        tags = $("#lecture_ticket_tags_name").val() || "";
      }
      var prefix = $("#lecture_ticket_item_prefix").val();//序号前缀
      var start_num = $("#lecture_ticket_item_start_num").val();//序号初始值
      var batch_name = $("#lecture_ticket_batch_name").val();//批次显示名称
      var batch_no = $("#lecture_ticket_batch_no").val();//批次名称
      var count = $("#lecture_ticket_item_number").val();//数量
      var coupon_lifetime;
      if(!$("#lecture_ticket_date_input_from").val()){
        alert(i18n('LECTURETICKET_SHIJIANWUXIAOQINGZHONGXINXUANZESHIJIAN'));
        return;
      }
      var end_date = new Date($("#lecture_ticket_date_input_from").val());
      end_date.setHours(23);
      end_date.setMinutes(59);
      end_date.setSeconds(59);
      var now_date = new Date();
      if(end_date.getTime() < now_date.getTime()) {
        alert(i18n('LECTURETICKET_SHIJIANWUXIAOQINGZHONGXINXUANZESHIJIAN'));
        return;
      }
      coupon_lifetime = Math.floor((end_date.getTime() - now_date.getTime()) / (1000 * 60 * 60)) + "h";//有效日期
      var type = self.typeCombo.getValue();//折扣类型
      var discount = "",
        minus_price = "";
      switch(type) {
      case "discount":
        discount = $("#lecture_ticket_item_type_count").val()//折扣对应数量/金额
        break;
      case "minus":
        minus_price = $("#lecture_ticket_item_type_count").val();//折扣对应数量/金额
        break;
        default:
      }
      var third_party = $('#lecture_ticket_item_third_party').val();//第三方
      var options;
      if((asset_type == "asset") || (asset_type == "bundle")){
        options = [{
          key: "creator_user_id",
          value: createor_user_id
        }, {
          key: "asset_id",
          value: asset_id
        }, {
          key: "asset_type",
          value: asset_type
        }, {
          key: "asset_name",
          value: asset_name
        }, {
          key: "third_party",
          value: third_party
        }, {
          key: "coupon_lifetime",
          value: coupon_lifetime
        }, {
          key: "batch_no",
          value: batch_no
        },{
          key: "batch_name",
          value: batch_name
        }, {
          key: "count",
          value: count
        }, {
          key: "type",
          value: type
        }, {
          key: "discount",
          value: discount
        }, {
          key: "minus_price",
          value: minus_price
        }, {
          key: "prefix",
          value: prefix
        }, {
          key: "start_number",
          value: start_num
        }];
      }else{
        options = [{
          key: "creator_user_id",
          value: createor_user_id
        }, {
          key: "tags",
          value: tags
        }, {
          key: "third_party",
          value: third_party
        }, {
          key: "coupon_lifetime",
          value: coupon_lifetime
        }, {
          key: "batch_no",
          value: batch_no
        },{
          key: "batch_name",
          value: batch_name
        }, {
          key: "count",
          value: count
        }, {
          key: "type",
          value: type
        }, {
          key: "discount",
          value: discount
        }, {
          key: "minus_price",
          value: minus_price
        }, {
          key: "prefix",
          value: prefix
        }, {
          key: "start_number",
          value: start_num
        }];
      }
      var exchange_price_type = self.exchangePriceType.getValue();
      var exchange_price_value = $("#lecture_ticket_item_exchange_price_value").val();
      if(exchange_price_type){
        options.push({
          key: "exchange_price_type",
          value: exchange_price_type
        });
        options.push({
          key: "exchange_price_value",
          value: exchange_price_value
        });
      }
      self.api.createTicket(options, function (data) {
        self.dialog.close();
        self.List.update();
      });
    },
    getCourseInfo: function () {
      var self = this;
      var searchType = self.searchType.getValue();
      if(!$("#lecture_ticket_pid_input").val() || !$("#lecture_ticket_paid_input").val()) {
        return;
      }
      var courseID = $("#lecture_ticket_pid_input").val() + "_" + $("#lecture_ticket_paid_input").val()
      if((this.courseEditing && this.courseEditing.coursename) != courseID) {
        $('#lecture_recommend_item_name').val('');
        this.courseEditing = null;
      }
      addLoadingLayer();
      var courseDate = self.api.getFullCourseData(courseID, searchType);
      this.dialog.data = courseDate;
      if(courseDate && courseDate) {
        self.courseEditing = courseDate;
        $('#lecture_ticket_item_name').val(courseDate.name || '');
      } else {
        alert(i18n('LECTURETICKET_HUOQUBUDAOJIANGZUOXINXI'));
      }
      removeLoadingLayer();
    },
    formatListData: function (data) {
      var that = this;
      this.courseTicketData = data;
      var listData = data.map(function (a, i) {
        if(!a) {
          return [];
        }
        var courseName = "";
        if(a["_id"]['asset_name']){
          courseName = a["_id"]['asset_name'];
        }else{
          courseName = a["_id"]['tags'] || '';
        }
        var batch_name = a["_id"]['batch_name'] || '';
        var batch_no = a["_id"]['batch_no'] || '';
        var number = a['count'] || '';

        var lifetime;
        var endtime = new Date(a["_id"]['expire_time']['$date']);
        var year = endtime.getYear() + 1900;
        var month = endtime.getMonth() + 1;
        var date = endtime.getDate();
        var nowtime = new Date();
        if(nowtime.getTime() < endtime.getTime()) {
          lifetime = year + "-" + month + "-" + date + " 前";
        } else {
          lifetime = i18n('LECTURETICKET_YIGUOQI')
        }

        if((a["_id"]['enable'] == "false") || (a["_id"]['enable'] == false)) {
          lifetime = i18n('LECTURETICKET_YISHIXIAO');
        }

        function getTypeLabel(type) {
          var ret = '';
          switch(type) {
          case 'free':
            ret = i18n("LECTURETICKET_MIANFEI")
            break;
          case 'discount':
            ret = i18n("LECTURETICKET_ZHEKOU")
            break;
          case 'minus':
            ret = i18n("LECTURETICKET_LIJIAN")
            break;
          default:
            ret = i18n("LECTURETICKET_MIANFEI")
          }
          return ret;
        }
        var type = a["_id"]['type']
        var exchange_pric;
        if(!a["_id"]['exchange_price_type'] && !a["_id"]['exchange_price_value']){
          exchange_pric = "";
        }else{
          exchange_pric = (a["_id"]['exchange_price_type'] || "") + "/" + (a["_id"]['exchange_price_value'] || "");
        }
        var typeString = getTypeLabel(type);
        var typeDuiYin = '';
        switch(type) {
        case "free":
          typeDuiYin = 0
          break;
        case "discount":
          typeDuiYin = a["_id"]['discount'] || ""
          break;
        case "minus":
          typeDuiYin =  a["_id"]['minus_price'] || ""
          break;
        default:
          typeDuiYin = 0
        }
        var operations = '';
        operations += '<span class="lecture_ticket_op" name="view" data-index="' + i + '">' + i18n('LECTURETICKET_CHAKAN') + '</span>';
        operations += '<span class="lecture_ticket_op" name="export" data-index="' + i + '">' + i18n('LECTURETICKET_DAOCHU') + '</span>';
        operations += '<span class="lecture_ticket_op" name="del" data-index="' + i + '">' + i18n('LECTURETICKET_LIJISHIXIAO') + '</span>';
        return [{
          label: courseName
                }, {
          label: batch_name
                },{
          label: batch_no
                },{
          label: number
                }, {
          label: lifetime
                }, {
          label: typeString
                }, {
          label: typeDuiYin
                }, {
          label: exchange_pric
        }, {
          label: operations
                }];
      });
      this.courseTicketData = this.courseTicketData.map(function (a, i) {
        var startDate = new Date("2015-01-01");
        var endDate = new Date(a["_id"]['expire_time']['$date']);
        var getTime = function (date, status) {
          var result;
          var format = function (number) {
            if(number < 10) {
              return "0" + number;
            }
            return "" + number;
          }
          var year = date.getYear() + 1900;
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var hour = date.getHours();
          var minute = date.getMinutes();
          var seconds = date.getSeconds();
          if(status) {
            hour = 0;
            minute = 0;
            seconds = 0;
          } else {
            hour = 23;
            minute = 59;
            seconds = 59;
          }
          var result = year + '-' + format(month) + '-' + format(day) + "T" + format(hour) + ":" + format(minute) + ":" + format(seconds) + "+0800";
          return result;
        };
        return {
          lesson: a["_id"]['asset_name'] || '',
          batch_no: a["_id"]['batch_no'] || '',
          third_party: a["_id"]['third_party'] || '',
          start_time: getTime(startDate, 1),
          end_time: getTime(endDate, 0)
        }
      });
      return listData;
    },
    view: {
      init: function (data, context) {
        var that = this;
        that.data = data;
        that.initPage(context);
        that.initList(context);
      },
      initPage: function (context) {
        var that = this;
        $("#lecture_ticket_list").html("");
        $(".panel_page_head_title_follower").hide();
        $(".panel_page_head_right").hide();
        $(".panel_top_search_box").attr("style", "display:none");
        var ParentNode = jQuery(".lecture_ticket_page_head_title_back");
        var headerNode = jQuery("<div class='header'></div>");
        headerNode.appendTo(ParentNode);
        var BackNode = jQuery("<div class='header_item btn back '>" + i18n("LECTURETICKET_FANHUI") + "</div>");
        BackNode.appendTo(headerNode);
        BackNode.attr("id", "lectureCreatePage_head_container_Back");
        var title = that.data["lesson"] + " " + that.data["batch_no"];
        $(".panel_page_head_title").text(title);
        BackNode.unbind("click").click(function () {
          $("#lecture_ticket_list").html("");
          $(".lecture_ticket_page_head_title_back").html("");
          $(".panel_page_head_title").text(i18n('LECTURETICKET_KECHENGQUANGUANLI'));
          $(".panel_top_search_box").attr("style", "");
          $(".panel_page_head_right").show();
          context.init();
        });
      },
      initList: function (context) {
        var self = this;
        var third_party = self.data.third_party;
        var batch_no = self.data.batch_no;
        var start_time = self.data.start_time.replace("+", "%2b");
        var end_time = self.data.end_time.replace("+", "%2b");
        var options = [
          {
            key: "third_party",
            value: third_party
          },
          {
            key: "batch_no",
            value: batch_no
          },
          {
            key: "start_time",
            value: (start_time)
          },
          {
            key: "end_time",
            value: (end_time)
          },
          {
            key: "export_format",
            value: "json"
          }];
        context.api.getTicketListData(options, function (data) {
          var table_data = self.formatListData(data);
          self.List = new StyledList({
            async: true,
            rows: 15,
            columns: 9,
            containerId: 'lecture_ticket_list',
            listType: 0,
            data: table_data,
            titles: [{
              label: i18n('LECTURETICKET_KECHENGQUANXUHAO')
            }, {
              label: i18n('LECTURETICKET_KECHENGQUANXINXI')
            }, {
              label: i18n('LECTURETICKET_DUIHUANZHUANGTAI')
            }, {
              label: i18n('LECTURETICKET_YOUXIAOZHUANGTAI')
            }, {
              label: i18n('LECTURETICKET_YOUXIAOQI')
            }, {
              label: i18n('LECTURETICKET_SUOSHUREN')
            }, {
              label: i18n('LECTURETICKET_DUIHUANSHIJIAN')
            }, {
              label: i18n('LECTURETICKET_TICKETID')
            }, {
              label: i18n('LECTURETICKET_LAIYUAN')
            }],
            styles: {
              columnsWidth: [0.125, 0.125, 0.125, 0.125, 0.1, 0.1, 0.1, 0.1,0.1],
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
          self.List.create();
          context.List = self.List;
        });

      },
      formatListData: function (data) {
        var listData = data.map(function (a, i) {
          if(!a) {
            return [];
          }
          var ticket_info = a['coupon_id'] || '';
          var expire_time_date = new Date(a['expire_time']);
          var year = expire_time_date.getYear() + 1900;
          var month = expire_time_date.getMonth() + 1;
          var date = expire_time_date.getDate();
          var expire_time = year + "-" + month + "-" + date + " 前";
          if(localeLanguage == 'en-US.json') {
            expire_time = "before" + year + "-" + month + "-" + date;
          }
          var status = (a['status'] == "unused") ? i18n('LECTURETICKET_WEISHIYONG') : i18n('LECTURETICKET_YISHIYONG');
          var enable = (((a['enable'] == true) || ((a['enable'] == "true"))) ? i18n('LECTURETICKET_KEYONG') : i18n('LECTURETICKET_BUKEYONG'))
          var use_time;
          try {
            use_time = convertTimeString(a['use_time']).split(" ")[0];
          } catch(e) {
            use_time = '';
            console.error(e.message)
          };
          var source = "";
          if(a['source_type']){
            source = a['source_value'] || "";
          }else{
            source = "";
          }
          return [{
            label: a['coupon_no'] || ""
          }, {
            label: ticket_info
          }, {
            label: status
          }, {
            label: enable
          }, {
            label: expire_time
          }, {
            label: a['user_name']
          }, {
            label: use_time
          }, {
            label: a['ticket'] && a['ticket'].ticket_id || ''
          }, {
            label: source
          }];
        });
        return listData;
      }
    },
    api: {
      token : "user_id=" + my.paas.user_id +
      "&user_type=" + my.paas.user_type +
      "&access_token=" + my.paas.access_token +
      "&app_key=" + paasAppKey +
      "&timestamp=",
      getFullCourseData: function (_code, type) {
        var ret = null;
        $.ajax({
          method: "get",
          url: AQUA_SEARCH_HOST + '/aquapaas/rest/search/content_by_id/' + type + '/' + _code,
          async: false,
          dataType: 'json',
        }).done(function (data) {
          ret = data;
        }).fail(function (xhr) {});
        return ret;
      },
      getListData: function (options, callback) {
        var that = this;
        var url = AQUA_SEARCH_HOST + '/aquapaas/rest/coupon/list/batch_no' ;
        url = url + "?" + that.token + new Date().toISOString();
        if(options.batch_no){
          url = url + "&batch_no=" + options.batch_no
        }
        url = url + "&start=" + options.start + "&end=" + options.end
        $.ajax({
          method: "GET",
          url: url,
          async: false,
          dataType: 'json',
          headers: {
            'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
          },
        }).done(function (data, status, xhr) {
          if(typeof callback == "function") {
            if(data.result){
              var totalCount = data['count'] || 0;
              callback(data.result, totalCount);
            }else{
              callback([]);
            }
          }
        }).fail(function (xhr) {
          callback([]);
        });
      },
      createTicket: function (options, callback) {
        var options_String = "";
        options.forEach(function (item, i) {
          if(i == 0) {
            options_String += "?" + item.key + "=" + item.value;
          } else {
            options_String += "&" + item.key + "=" + item.value;
          }
        });
        $.ajax({
          method: "post",
          url: AQUA_SEARCH_HOST + '/aquapaas/rest/coupon' + encodeURI(options_String),
          async: false,
          dataType: 'json',
        }).done(function (data) {
          if(typeof callback == "function") {
            callback(data);
          }
        }).fail(function (xhr) {
          var str = xhr.getAllResponseHeaders();
          var reg = /\"(.*?)\"/g;
          var str = str.match(reg);
          var message = "";
          try {
            message = str[0];
          } catch(err) {
            message = "";
          }
          alert(i18n('LECTURETICKET_CHUANGJIANSHIBAI') + message);

        });
      },
      exportTicket: function (options, callback) {
        var options_String = "";
        options.forEach(function (item, i) {
          if(i == 0) {
            options_String += "?" + item.key + "=" + item.value;
          } else {
            options_String += "&" + item.key + "=" + item.value;
          }
        });
        var downloadURI = AQUA_SEARCH_HOST + '/aquapaas/rest/coupon/export' + options_String;
        window.open(downloadURI);
        /*
        $.ajax({
            method:"get",
            url: AQUA_SEARCH_HOST + '/aquapaas/rest/coupon/export' + options_String,
            async: false,
            dataType: 'json'
        }).done(function(data){
            console.log(data);
            if(typeof callback == "function"){
                callback(data);
            }
        }).fail(function(xhr){
            alert('导出失败！');
        });
        */
      },
      deleteTicket: function (options, callback) {
        var options_String = "";
        options.forEach(function (item, i) {
          if(i == 0) {
            options_String += "?" + item.key + "=" + item.value;
          } else {
            options_String += "&" + item.key + "=" + item.value;
          }
        });
        $.ajax({
          method: "post",
          url: AQUA_SEARCH_HOST + '/aquapaas/rest/coupon/disable' + options_String,
          async: false,
          dataType: 'json'
        }).done(function (data) {
          console.log(data);
          if(typeof callback == "function") {
            callback(data);
          }
        }).fail(function (xhr) {
          if(xhr.status == 200) {
            if(typeof callback == "function") {
              callback();
            }
          } else {
            alert(i18n('LECTURETICKET_SHANCHUSHIBAI'));
          }
        });
      },
      getTicketListData: function (options, callback) {
        var options_String = "";
        options.forEach(function (item, i) {
          if(i == 0) {
            options_String += "?" + item.key + "=" + item.value;
          } else {
            options_String += "&" + item.key + "=" + item.value;
          }
        });
        $.ajax({
          method: "get",
          url: AQUA_SEARCH_HOST + '/aquapaas/rest/coupon/export' + options_String,
          async: false,
          dataType: 'json'
        }).done(function (data) {
          var userIds = data.map(function (item) {
            if(item.user_id) {
              return item.user_id;
            }
          }).join(",").match(/(?:[0-9a-zA-Z]+)/g);
          if(userIds != null){
          var _url = AQUA_SEARCH_HOST + "/aquapaas/rest/users/public?user_ids=" + userIds.join(','); //data.map(function (item) {
            // if(item.user_id) {
              // return item.user_id
            // }
          // }).join(",").match(/(?:[0-9a-zA-Z]+)/g).join(",");
          $.ajax({
            method: "get",
            url: _url,
            async: false,
            dataType: "json"
          }).done(function (resp) {
            for (var i = 0; i < data.length; i++) {
              var item = data[i];
              for (var j = 0; j < resp.length; j++) {
                var jtem = resp[j]
                if (item.user_id == jtem.user_id) {
                  item.user_name = jtem.user_name;
                }
                if(item["source_type"] == "user_id"){
                  if (item["source"] == jtem.user_id) {
                    item["source_value"] = jtem.user_name;
                  }
                }
              }
            }
          });
          }
          if(typeof callback == "function") {
            console.log("run cb")
            callback(data);
          }
        }).fail(function (xhr) {
          var str = xhr.getAllResponseHeaders();
          var reg = /\"(.*?)\"/g;
          var str = str.match(reg);
          var message = "";
          try {
            message = str[0];
          } catch(err) {
            message = "";
          }
          var data = [];
          if(typeof callback == "function") {
            callback(data);
          }
          alert(i18n('LECTURETICKET_HUOQUSHIBAI') + message);
        });
      }
    }
  };
  function addLoadingLayer(){
    jQuery('.loading_layer').remove();
    jQuery('<div>').addClass('loading_layer').appendTo(document.body);
  }
  function removeLoadingLayer(){
    jQuery('.loading_layer').remove();
  }
}(jQuery));
LectureTicket.init();