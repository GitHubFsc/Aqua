(function(global, factory) {
    global.CeLueZhongShen = factory(jQuery, StyledList);
    var app = new CeLueZhongShen();
})(this, (function($, Table) {
    var Pane = {
        table: null,
        search: {
            type: 'img',   //img：图文；video：视频；subtitle：字幕；
            state: 'third',
            policyName: ''
        },
        isRefreshTable: { //焦点记忆
            isTrue: false,
            page: 0
        },
        init() {
            var ret = this.initPage();
            if(ret){
              this.bindBtnEvents();
              this.initTable();
            }
        },
        initPage() {    //type聚焦
            if(my.paas.user_type === "0") {
                $("#ce_lue_zhong_shen").html("<div style='height:100%;color:#797979;font-size:26px;text-align:center;line-height:600px;background-color:#fcfcf2;'>" + i18n("ADV_SYSUSER_NOTE_NORIGHT") + "</div>");
                return false;
            };
            $("#ce_lue_zhong_shen .adPolicyAuditMenu .policy_type div[name=type]").removeClass("focus");
            $("#ce_lue_zhong_shen .adPolicyAuditMenu .policy_type div[name=type]#adPolicyEndAudit_policy_" + Pane.search.type).addClass("focus");
            return true;
        },
        bindBtnEvents() {
            var _this = this;
            // type 按钮切换
            $("#ce_lue_zhong_shen .adPolicyAuditMenu .policy_type div[name=type]").click(function () {
                $("#ce_lue_zhong_shen .adPolicyAuditMenu .policy_type div[name=type]").removeClass("focus");
                $(this).addClass("focus")
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
            // 查询事件
            $("#ce_lue_zhong_shen #adPolicyEndAudit_policy_searchInput").keydown(function (e) {  //回车查询事件
                let key = e.keyCode || e.which;
                if (key == 13) {
                  Pane.search.policyName = $(e.target).val();
                  Pane.initTable();
                }
            });
            $("#ce_lue_zhong_shen #adPolicyEndAudit_policy_searchBtn").click(function () {  //查询按钮查询事件
                Pane.search.policyName = $("#ce_lue_zhong_shen #adPolicyEndAudit_policy_searchInput").val();
                Pane.initTable();
            });
            // 列表操作
            $("#ce_lue_zhong_shen #adPolicyEndAuditTable")
            .on("click", '.view', (e) => {   //查看
                let index = $(e.target).data("index");
                let cb = () => {
                    _this.dialog.data = API.data[index];
                    _this.initDialog();
                    _this.bindDialogEvents();
                    _this.loadDialogData();
                };
                _this.dialog = new PopupDialog({
                    url: "content/ce_lue_chu_shen/adPolicyEdit.html",
                    width: 760,
                    height: 599,
                    context: this,
                    callback: cb
                });
                _this.dialog.open();
            })
            .on('click', '.audithis' ,(e) => {   //审核历史
                let index = $(e.target).data("index");
                var data = API.data[index];
                var audithis_dialog = new AuditHis({
                    type: 'ad_policy',
                    id: data.adpolicy_id
                })
            })
            .on('click', '.deney' ,(e) => {   //否决
                let index = $(e.target).data("index");
                var afterDrawn = function () {
                    $(".auditDialog .auditDialogCloseBtn, .auditDialog .auditDialogCancelBtn").click(function () {
                        deney_dialog.close();
                    });
                    $(".auditDialog .auditDialogSubmitBtn").click(function () {
                        API.sendDeneyMsg(index, () => {
                            deney_dialog.close();
                            Pane.isRefreshTable = {
                                isTrue: true,
                                page: String(Pane.table.currPage + 1)
                            };
                            Pane.initTable();
                        });
                    });
                }
                var deney_dialog = new PopupDialog({
                    url: "content/ce_lue_chu_shen/auditDeneyDialog.html",
                    width: 760,
                    height: 342,
                    context: this,
                    callback: afterDrawn
                });
                deney_dialog.open();
            })
            .on('click', '.pass' ,(e) => {   //通过
                let index = $(e.target).data("index");
                var afterDrawn = function () {
                    $(".auditDialog .auditDialogCloseBtn, .auditDialog .auditDialogCancelBtn").click(function () {
                        pass_dialog.close();
                    });
                    $(".auditDialog .auditDialogConfirmBtn").click(function () {
                        API.passAudit(index, () => {
                            pass_dialog.close();
                            Pane.isRefreshTable = {
                                isTrue: true,
                                page: String(Pane.table.currPage + 1)
                            };
                            Pane.initTable();
                        });
                    });
                }
                var pass_dialog = new PopupDialog({
                    url: "content/ce_lue_chu_shen/auditPassConfirmDialog.html",
                    width: 480,
                    height: 288,
                    context: this,
                    callback: afterDrawn
                });
                pass_dialog.open();
            })
        },
        initTable() {   //加载表格
            var titles =  [{
                label: i18n("ADPOLICYAUDIT_TABLE_POLICYID")
            }, {
                label: i18n("ADPOLICYAUDIT_TABLE_CREATOR")
            }, {
                label: i18n("ADPOLICYAUDIT_TABLE_TAG")
            }, {
                label: i18n("ADPOLICYMANAGE_TABLE_CHANNEL")
            }, {
                label: i18n("ADPOLICYAUDIT_TABLE_PRIORITY")
            }, {
                label: i18n("ADPOLICYAUDIT_TABLE_WEIGHT")
            }, {
                label: i18n("ADPOLICYAUDIT_TABLE_BIND")
            }, {
                label: i18n("ADPOLICYAUDIT_TABLE_ACTIVETIME")
            }, {
                label: i18n("ADPOLICYAUDIT_TABLE_DURATION")
            }, {
                label: i18n("ADPOLICYAUDIT_TABLE_OPERATION")
            }];
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
                columnsWidth: [0.20, 0.05, 0.05, 0.07, 0.04, 0.03, 0.12, 0.20, 0.10, 0.10]
            };
            Pane.table = new Table({
                containerId: 'adPolicyEndAuditTable',
                rows: 11,
                columns: titles.length,
                titles: titles,
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
                Pane.table.changePage(isEditObj.page);
            }
        },
        initDialog() {
            var _this = this,
            dialog = _this.dialog;
            dialog.currTagType = dialog.currTagType ? dialog.currTagType : "ADPOLICYMANAGE_TABLE_CHANNEL";
            //日历控件样式
            var calendarStyles = {
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
            }
            var adv_list = {};
            //策略类型下拉框初始化
            dialog.policyTypeBox = new newSelect("#policy_type", {
              "img": i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_IMG"),
              "video": i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_VIDEO"),
              "subtitle": i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_VIDEO")
            }, {
              width: 298,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#F0F0F0",
              disablebackground: "#F0F0F0"
            });
            dialog.policyTypeBox.setDisable();
            //策略权重下拉框初始化
            dialog.policyWeightBox = new newSelect("#policy_weight", {
              "00": "00",
              "50": "50",
              "100": "100"
            }, {
              width: 298,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF"
            });
            dialog.policyWeightBox.setDisable();
          
            //生效时间UI初始化
            dialog.validTimeDataPicker = new DatePicker({
              containerId: 'validtime_date',
              calendarStyles: calendarStyles,
              dateInputStyles: {
                borderColor: '#d3d3d3'
              },
              iconImage: 'image/adPolicyManage/datePickerIcon.png'
            });
            dialog.validTimeHourBox = new newSelect("#validtime_hour", _this._hourArray, {
              width: 70,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF"
            });
            dialog.validTimeHourBox.setDisable();
            dialog.validTimeMinuteBox = new newSelect("#validtime_minute", _this._minuteArray, {
              width: 70,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF"
            });
            dialog.validTimeMinuteBox.setDisable();
            dialog.validTimeSecondBox = new newSelect("#validtime_second", _this._secondArray, {
              width: 70,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF"
            });
            dialog.validTimeSecondBox.setDisable();
            //投放开始时间时间UI初始化
            dialog.durationStartTimeHourBox = new newSelect("#duationstarttime_hour",
              _this._hourArray, {
                width: 70,
                height: 32,
                background: "#FFFFFF",
                selectbackground: "#FFFFFF"
              });
            dialog.durationStartTimeHourBox.setDisable();
            dialog.durationStartTimeMinuteBox = new newSelect("#duationstarttime_minute",
              _this._minuteArray, {
                width: 70,
                height: 32,
                background: "#FFFFFF",
                selectbackground: "#FFFFFF"
              });
            dialog.durationStartTimeMinuteBox.setDisable();
            dialog.durationStartTimeSecondBox = new newSelect("#duationstarttime_second",
              _this._secondArray, {
                width: 70,
                height: 32,
                background: "#FFFFFF",
                selectbackground: "#FFFFFF"
              });
            dialog.durationStartTimeSecondBox.setDisable();
            //失效时间UI初始化
            dialog.invalidTimeDataPicker = new DatePicker({
              containerId: 'invalidtime_date',
              calendarStyles: calendarStyles,
              dateInputStyles: {
                borderColor: '#d3d3d3'
              },
              iconImage: 'image/adPolicyManage/datePickerIcon.png'
            });
            dialog.invalidTimeHourBox = new newSelect("#invalidtime_hour", _this._hourArray, {
              width: 70,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF"
            });
            dialog.invalidTimeHourBox.setDisable();
            dialog.invalidTimeMinuteBox = new newSelect("#invalidtime_minute", _this._minuteArray, {
              width: 70,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF"
            });
            dialog.invalidTimeMinuteBox.setDisable();
            dialog.invalidTimeSecondBox = new newSelect("#invalidtime_second", _this._secondArray, {
              width: 70,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF"
            });
            dialog.invalidTimeSecondBox.setDisable();
            //投放结束时间UI初始化
            dialog.durationEndTimeHourBox = new newSelect("#durationendtime_hour", _this._hourArray, {
              width: 70,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF"
            });
            dialog.durationEndTimeHourBox.setDisable();
            dialog.durationEndTimeMinuteBox = new newSelect("#durationendtime_minute",
              _this._minuteArray, {
                width: 70,
                height: 32,
                background: "#FFFFFF",
                selectbackground: "#FFFFFF"
              });
            dialog.durationEndTimeMinuteBox.setDisable();
            dialog.durationEndTimeSecondBox = new newSelect("#durationendtime_second",
              _this._secondArray, {
                width: 70,
                height: 32,
                background: "#FFFFFF",
                selectbackground: "#FFFFFF"
              });
            dialog.durationEndTimeSecondBox.setDisable();
            //标签类型
            var _tagTypeArray = [{
                key: "ADPOLICYMANAGE_TABLE_CHANNEL",
                value: i18n("ADPOLICYMANAGE_TABLE_CHANNEL")
            }, {
                key: "ADPOLICYMANAGE_TABLE_CATEGORY",
                value: i18n("ADPOLICYMANAGE_TABLE_CATEGORY")
            }, {
                key: "ADPOLICYMANAGE_TABLE_AREA",
                value: i18n("ADPOLICYMANAGE_TABLE_AREA")
            }];
            dialog.tagTypeSelect = new newSelect("#tag_type", _tagTypeArray, {
              width: 298,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF",
              ScrollBarHeight: "150px",
              disablebackground: "#F0F0F0"
            }, function () {
              var type = _this.getValue()
              $(".policy_channel").prev().html(i18n(type));
              dialog.currTagType = type;
              $("#channel_type").html(Model.setTag(dialog.data.metadata, dialog.currTagType).tag.join(",")).attr("title", $("#channel_type").html());
            });
            adv_list = API.getAdLocation();
            //广告位列表
            _this.bindAdvBox = new newSelect("#policy_bindadv", adv_list, {
              width: 239,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF",
              disablebackground: "#F0F0F0"
            });
            _this.bindAdvBox.setDisable();
            //素材列表
            _this.elSelectBox = new newSelect("#el_name", {}, {
              width: 239,
              height: 32,
              background: "#FFFFFF",
              selectbackground: "#FFFFFF"
            });
            _this.elSelectBox.setDisable();
        },
        bindDialogEvents() {
            var _this = this,
            dialog = _this.dialog;
            $(".editDialog")
            .on('click', '.controls .btn', ({currentTarget, target}) => {
              if (currentTarget == target) {
                var type = $(currentTarget).attr('name');
                $(currentTarget).addClass('focus').siblings().removeClass('focus')
                $('.editDialog .info_pane').hide()
                $('.editDialog .info_pane.' + type + '_info').show()
                _this.dialog.currentTab = type
                if (type == 'accurate') {
                  _this.dialog.resize({
                    width: 701,
                    height: 495
                  }, true)
                } else {
                  _this.dialog.resize({
                    width: 760,
                    height: 644
                  }, true)
                }
              }
            })
            .on('click', ".editDialogCloseBtn,.editDialogCancelBtn", function () {
              _this.dialog.close();
            })
            .on('click', ".editDialogSubmitBtn", function () {
              _this.dialog.close();
            })
            .on('click', "#policy_sucai_choose.policy_choose", function () {
            //素材/素材组预览
              var is_sucai = $(".editDialog .radio.select").index(".editDialog .radio");
              var app = new PreviewModel();
              if(is_sucai == 0) {
                app.previewSuCaiZu(dialog.data.adgroup_id);
              } else {
                app.previewSuCai(dialog.data.ad_single_id);
              }
            })
            .on('click', '#map_selector', ({currentTarget, target}) => {
              if (currentTarget, target) {
                var data = {}
                if (_this.dialog.data.shape_range) {
                  data.shape_range = _this.dialog.data.shape_range
                }
                if (_this.dialog.data.locationInfoDetail) {
                  data.locationInfoDetail = _this.dialog.data.locationInfoDetail
                }
                var dialog = mapAccurate({
                  data: data,
                  confirm: (data) => {
                    $.extend(_this.dialog.data, data)
                    dialog.close();
                    // _this.closeSelectDialog();
                  },
                  callback: () => {
                    dialog.close();
                    // _this.closeSelectDialog();
                  }
                })
              }
            });
        },
        loadDialogData() {
            var _this = this,
              dialog = _this.dialog,
              data = dialog.data;
            $("#policy_name").val(data.name);
          
            if (dialog.currentTab == 'accurate') {
              $('.editDialog .controls .btn[name=accurate]').click()
            } else {
              $('.editDialog .controls .btn[name=basic]').click()
            }
          
            if(data.type === "img") {
              dialog.policyTypeBox.setValue(i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_IMG"))
            } else if(data.type === "video") {
              dialog.policyTypeBox.setValue(i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_VIDEO"))
            } else {
              dialog.policyTypeBox.setValue(i18n("ADPOLICYMANAGE_DIALOG_POLICYTYPE_SUBTITLE"))
            }
            $("#policy_priority").val(data.priority);
            dialog.policyWeightBox.setValue(data.weight);
            if(data.activatetime.indexOf("T") >= 0) {
              data.activatetime = data.activatetime.replace("T", " ");
            }
            if(data.expiretime.indexOf("T") >= 0) {
              data.expiretime = data.expiretime.replace("T", " ");
            }
            dialog.validTimeDataPicker.setCurrDate(dialog.validTimeDataPicker.parseDateStr(data.activatetime.split(" ")[0]));
            dialog.validTimeHourBox.setValue(data.activatetime.split(" ")[1].split(":")[0]);
            dialog.validTimeMinuteBox.setValue(data.activatetime.split(" ")[1].split(":")[1]);
            var showTimeSecond = function (time) {
              var result = "";
              if(time) {
                if(time.substr(-5).indexOf("+") >= 0) {
                  result = time.split(time.substr(-5))[0];
                } else {
                  if(time.substr(-5).indexOf("-") >= 0) {
                    result = time.split(time.substr(-5))[0];
                  } else {
                    result = time;
                  }
                }
              }
              return result;
            };
            dialog.validTimeSecondBox.setValue(showTimeSecond(data.activatetime.split(" ")[1].split(":")[2]));
            dialog.durationStartTimeHourBox.setValue(data.play_begintime.split(":")[0]);
            dialog.durationStartTimeMinuteBox.setValue(data.play_begintime.split(":")[1]);
            dialog.durationStartTimeSecondBox.setValue(showTimeSecond(data.play_begintime.split(":")[2]));
            dialog.invalidTimeDataPicker.setCurrDate(dialog.validTimeDataPicker.parseDateStr(data.expiretime.split(" ")[0]));
            dialog.invalidTimeHourBox.setValue(data.expiretime.split(" ")[1].split(":")[0]);
            dialog.invalidTimeMinuteBox.setValue(data.expiretime.split(" ")[1].split(":")[1]);
            dialog.invalidTimeSecondBox.setValue(showTimeSecond(data.expiretime.split(":")[2]));
            dialog.durationEndTimeHourBox.setValue(data.play_endtime.split(":")[0]);
            dialog.durationEndTimeMinuteBox.setValue(data.play_endtime.split(":")[1]);
            dialog.durationEndTimeSecondBox.setValue(showTimeSecond(data.play_endtime.split(":")[2]));
          
            switch(dialog.currTagType) {
                case "ADPOLICYMANAGE_TABLE_CHANNEL":
                    dialog.tagTypeSelect.setValue(dialog.tagTypeSelect.selectItem[0].value)
                break;
            
                case "ADPOLICYMANAGE_TABLE_CATEGORY":
                    dialog.tagTypeSelect.setValue(dialog.tagTypeSelect.selectItem[1].value)
                break;
            
                case "ADPOLICYMANAGE_TABLE_AREA":
                    dialog.tagTypeSelect.setValue(dialog.tagTypeSelect.selectItem[2].value)
                break;
                default:
            }
            var tags = data.metadata
            $("#channel_tags").val((tags.channel_tags||[]).map(item => item.replace('channel:','')).join(",")).attr("title", $("#channel_tags").html());
            $("#catalog_tags").val((tags.catalog_tags||[]).map(item => item.replace('catalog:','')).join(",")).attr("title", $("#catalog_tags").html());
            $("#area_tags").val((tags.area_tags||[]).map(item => item.replace('area:','')).join(",")).attr("title", $("#area_tags").html());
          
            if(data.adp_list.length === 0) {
              $("#unbind_adv.check_box").addClass("checked");
            } else {
              _this.bindAdvBox.setValue(_this.bindAdvBox.selectItem[data.adp_list[0]]);
            }
            if(data.ad_single_id) {
              $(".radio:eq(1)").addClass("select");
            } else {
              $(".radio:eq(0)").addClass("select");
            }
            _this.elSelectBox.setValue(API.getAdEl($(".radio:eq(0)").hasClass("select") ? 0 : 1, data.ad_single_id || data.adgroup_id));
          
            //加载地图信息
            if (data.locationInfoDetail) {
              $('.editDialog #policy_addr').val(data.locationInfoDetail.address)
            }
            $('.editDialog #policy_radius').val(data.shape_range)
        }
    };
    var API = {
        data: [],
        // 获取数据
        getList(pageNum, callback) {
            let url =  paasHost + paasAdvDomain + "/ads/adpolicy/adpolicys";
            let method = "GET";
            let urlParam = [];
                urlParam.push("user_id=" + my.paas.user_id);
                urlParam.push("user_type=" + my.paas.user_type);
                urlParam.push("access_token=" + my.paas.access_token);
                urlParam.push("app_key=" + paasAppKey);
                urlParam.push("timestamp=" + new Date().toISOString());
                urlParam.push("type=" + Pane.search.type);
                urlParam.push("state=" + Pane.search.state + "_audit:prepare_audit");
                urlParam.push("name=" + Pane.search.policyName);
                urlParam.push("start=" + (pageNum - 1) * this.rowsLmt);
                urlParam.push("end=" + (pageNum* this.rowsLmt - 1));
                if (my.paas.platform_current_id) {
                    urlParam.push("platform_id_list=" + my.paas.platform_current_id);
                };
                url += '?' + urlParam.join("&");
            $.ajax({
                type: method,
                url: url,
                async: false,
                headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
                }
            })
            .done(function (resp, status, xhr) {
                if(status == 'success'){
                    API.data = resp;
                    Pane.table.onTotalCount(xhr.getResponseHeader('x-aqua-total-count') || 0);
                    callback&&callback(Model.table(resp));
                } else {
                    callback&&callback([]);
                }
            });
        },
        // 获取频道标签
        listChannelOfChannelTag(tag) {
            var result = false;
            let url = paasHost + paasDomain　 + "/tag/application/global/channel/";
            let method = "GET";
            let urlParam = [];
                urlParam.push("user_id=" + my.paas.user_id);
                urlParam.push("user_type=" + my.paas.user_type);
                urlParam.push("access_token=" + my.paas.access_token);
                urlParam.push("app_key=" + paasAppKey);
                urlParam.push("timestamp=" + new Date().toISOString());
            if(tag) {
                url += "?" + "tags=" + encodeURI(tag);
            }
            url += "&" + urlParam.join("&");
            $.ajax({
                type: method,
                url: url,
                async: false,
                contentType: "application/json",
                dataType: "json",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
                }
            })
            .done(function (data) {
              result = data;
            })
            .fail(function () {
              result = [];
            });
            return result;
        },
        // 获取素材信息
        getAdEl(type, id) {
            var result = "";
            let url = "";
            let method = "GET";
            if(type === 0) {
              url = paasHost + paasAdvDomain + "/ads/adgroup/" + id;
            } else {
              url = paasHost + paasAdvDomain + "/ads/aditem/" + id;
            }
            let urlParam = [];
                urlParam.push("user_id=" + my.paas.user_id);
                urlParam.push("user_type=" + my.paas.user_type);
                urlParam.push("access_token=" + my.paas.access_token);
                urlParam.push("app_key=" + paasAppKey);
                urlParam.push("timestamp=" + new Date().toISOString());
            url += "?" + urlParam.join("&");
            $.ajax({
              type: method,
              async: false,
              url: url,
              headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
              },
              success: function (data) {
                result = data.name || data.title;
              }
            });
            return result;
        },
        //广告位
        getAdLocation() {
            var adv_list = {};
            let url = paasHost + paasAdvDomain + "/ads/imgadp/" + Pane.search.type + "adps";
            let method = "GET";
            let urlParam = [];
                urlParam.push("user_id=" + my.paas.user_id);
                urlParam.push("user_type=" + my.paas.user_type);
                urlParam.push("access_token=" + my.paas.access_token);
                urlParam.push("app_key=" + paasAppKey);
                urlParam.push("timestamp=" + new Date().toISOString());
            url += "?" + urlParam.join("&");
            $.ajax({
            type: method,
            async: false,
            url: url,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "x-aqua-sign": getPaaS_x_aqua_sign(method, url)
            }
            })
            .done(function (resp) {
                for(var i = 0; i < resp.length; i++) {
                    adv_list[resp[i].ext_id] = resp[i].name;
                }
            });
            return adv_list;
        },
        // 发送否决原因
        sendDeneyMsg(index, callback) {
            var msg = $(".auditDialog .auditDialogDeneyReason").val();
            let url = paasHost + paasDomain + "/auditflow/instance/ad_policy/";
            let method = "PUT";
            let id = API.data[index].adpolicy_id;
            let urlParam = [];
                urlParam.push("user_id=" + my.paas.user_id);
                urlParam.push("user_type=" + my.paas.user_type);
                urlParam.push("access_token=" + my.paas.access_token);
                urlParam.push("app_key=" + paasAppKey);
                urlParam.push("timestamp=" + new Date().toISOString());
            url += id + "?" + urlParam.join("&");
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
            })
        },
        passAudit(index, callback) {
            let url = paasHost + paasDomain + "/auditflow/instance/ad_policy/";
            let method = "PUT";
            let id = API.data[index].adpolicy_id;
            let urlParam = [];
                urlParam.push("user_id=" + my.paas.user_id);
                urlParam.push("user_type=" + my.paas.user_type);
                urlParam.push("access_token=" + my.paas.access_token);
                urlParam.push("app_key=" + paasAppKey);
                urlParam.push("timestamp=" + new Date().toISOString());
            url += id + "?" + urlParam.join("&");
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
                    "status": "passed"
                })
            })
            .done((resp, status, xhr) => {
                if(status == 'success'){
                    callback&&callback();
                } else {
                    return;
                }
            })
        }
    };
    var Model = {
        table(data) {
            var listData = [];
            for(var i = 0; i < data.length; i++) {
                let item = data[i];
                if(typeof item === "undefined") {
                    continue;
                }
                if(item.type !== Pane.search.type) {
                    continue;
                }
                var row = [];
                row.push({
                    label: "<div title='" + item.name + "'>" + item.name + "</div>"
                });
                row.push({
                    label: item.user_name
                });
                var metadata_tag = Model.setTag(item.metadata, null);
                var tag_text = metadata_tag.tag.join(",");
                var channel_text = "";
                var channel_key = metadata_tag.tag.map(function (item) {
                    return "channel:" + item;
                });
                // console.log(channel_key);
                var channel_list = [];
                if(channel_key.length !== 0) {
                    channel_list = API.listChannelOfChannelTag(channel_key.join(","));
                }
                channel_list.forEach(function (item) {
                    var obj = {
                      key: item.channel_value,
                      value: item.channel_name
                    };
                });
                channel_list = channel_list.map(function (item) {
                    return Model.find_channel_name(item.obj_id);
                });

                channel_text = channel_list.join(",");
                var tag = metadata_tag.tag.join(",");
                row.push({
                    label: "<div title='" + tag_text + "'>" + tag_text + "</div>"
                });
                row.push({
                    label: "<div title='" + channel_text + "'>" + channel_text + "</div>"
                });
                row.push({
                    label: item.priority
                });
                row.push({
                    label: item.weight
                });
                if(item.adgroup_id) {
                    var ad_name = API.getAdEl(0, item.adgroup_id)
                    row.push({
                        label: "<div title='" + ad_name + "'>" + ad_name + "</div>"
                    });
                } else {
                    var ad_name = API.getAdEl(1, item.ad_single_id)
                    row.push({
                        label: "<div title='" + ad_name + "'>" + ad_name + "</div>"
                    });
                }
                var showTime = function (time) {
                    if(time.indexOf("T") >= 0) {
                        time = time.replace("T", " ");
                    }
                    var result = "";
                    if(time) {
                        if(time.indexOf("+") >= 0) {
                            result = time.split("+")[0];
                        } else {
                            if(time.substr(-5).indexOf("-") >= 0) {
                                result = time.split(time.substr(-5))[0];
                            } else {
                                result = time;
                            }
                        }
                    }
                    return result;
                };
                var active_time = showTime(item.activatetime) + " -- " + showTime(item.expiretime)
                row.push({
                    label: "<div title='" + active_time + "'>" + active_time + "</div>"
                });
                var play_time = showTime(item.play_begintime) + " -- " + showTime(item.play_endtime);
                row.push({
                    label: "<div title='" + play_time + "'>" + play_time + "</div>"
                });
                var op_view = "<span class='view' data-index=" + i + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_VIEW") + "</span>";
                if(my.paas.user_type == "1"){
                    var op_audithis = "<span class='audithis' data-index=" + i + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS") + "</span>";
                    var op_deney = "<span class='deney' data-index=" + i + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_DENEY") + "</span>";
                    var op_pass = "<span class='pass' data-index=" + i + ">" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_PASS") + "</span>";
                } else {
                    var op_audithis = "<span style='cursor:default;color:#797979'>" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_AUDITHIS") + "</span>";
                    var op_deney = "<span style='cursor:default;color:#797979'>" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_DENEY") + "</span>";
                    var op_pass = "<span style='cursor:default;color:#797979'>" + i18n("ADPOLICYAUDIT_TABLE_OPERATION_PASS") + "</span>";
                }
                row.push({
                    label: [op_view, op_audithis, op_deney, op_pass].join("")
                });
                switch(item.state.indexOf(":") !== -1 ? item.state.split(":")[0] : item.state) {
                    // case "first_audit":
                    // case "second_audit":
                    // //合并初审复审状态
                    // if( Pane.search.state == 'first') {
                    //     listData.push(row);
                    // }
                    // break;
                    case "third_audit":
                    //终审
                    if( Pane.search.state == 'third') {
                        listData.push(row);
                    }
                    break;
                    default:
                }
            }
            return listData;
        },
        setTag(tag, type) {
            var result = {
              tag: [],
              channel: []
            };
            if(tag) {
              switch(type) {
              case "ADPOLICYMANAGE_TABLE_CHANNEL":
                if((typeof tag.channel_tags == 'object') && tag.channel_tags.constructor == Array) {
                  tag.channel_tags.forEach(function (item, i) {
                    result.tag.push(item.slice(8));
                  });
                }
                break;
              case "ADPOLICYMANAGE_TABLE_CATEGORY":
                if((typeof tag.catalog_tags == 'object') && tag.catalog_tags.constructor == Array) {
                  tag.catalog_tags.forEach(function (item, i) {
                    result.tag.push(item.slice(8));
                  });
                }
                break;
              case "ADPOLICYMANAGE_TABLE_AREA":
                if((typeof tag.area_tags == 'object') && tag.area_tags.constructor == Array) {
                  tag.area_tags.forEach(function (item, i) {
                    result.tag.push(item.slice(5));
                  });
                }
                break;
              default:
                if((typeof tag.channel_tags == 'object') && tag.channel_tags.constructor == Array) {
                  tag.channel_tags.forEach(function (item, i) {
                    result.tag.push(item.slice(8));
                  });
                }
                if((typeof tag.catalog_tags == 'object') && tag.channel_tags.constructor == Array) {
                  tag.catalog_tags.forEach(function (item, i) {
                    result.tag.push(item.slice(8));
                  });
                }
                if((typeof tag.area_tags == 'object') && tag.channel_tags.constructor == Array) {
                  tag.area_tags.forEach(function (item, i) {
                    result.tag.push(item.slice(5));
                  });
                }
              }
            }
            return result;
        },
        find_channel_name(key) {
            var result = "";
            channel_list.forEach(function (item) {
              if(item.channel_value == key) {
                result = item.channel_name;
              }
            })
            return result;
        }
    };
    var frame = function (){
        Pane.init();
    };
    return frame;
}))