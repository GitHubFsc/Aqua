( function($) {
    var adSearchText = '';
    var adsRest = paasHost + paasAdvDomain + '/ads';
    var dmRoot = paasHost + paasDomain + '/dm';

    var localAdpSites = {};
    var adpSiteNames = {};

    var adpSites = [];
    var filterSites = [];

    function makeMoreOption(opts, lmt){
        if(lmt == null){
            lmt = 3;
        }
        var str = '';
        var num = opts.length;
        if(num <= lmt){
            str = opts.join('');
            return str;
        }
        for(var i = 0; i < lmt; i+=1){
            str += opts[i];
        }

        str += '<span class="show_more_option">' + i18n('ADPOS_OPERATION_MORE') +
        '<svg width="14" height="16">'
        + '<rect width="14" height="16" style="fill:transparent"/>'
        + '<polygon points="0,7 4,14 8,7" style="fill:#5da1c0"/>'
        + '</svg>';
        str += '<div class="more_option_panel" style="display:none;">';
        str += '<div>'+ i18n('ADPOS_OPERATION_MORE') +
        '<svg width="14" height="16">'
        + '<rect width="14" height="16" style="fill:transparent"/>'
        + '<polygon points="0,14 4,7 8,14" style="fill:#5da1c0"/>'
        + '</svg>'
        + '</div>';
        for(;i < num; i+=1){
            str += '<div>' + opts[i] + '</div>';
        }
        str += '</div>';
        str += '</span>';
        return str;
    }

    function getSelector(containerId, options) {
        var selector = new StyledSelector({
            containerId: containerId,
            styles: {
                optionHeight: 25
            },
            options: options
        });
        selector.getCloseIcon = function() {
            return '<div class="styled-selector-up-arrow"></div>';
        };
        selector.getOpenIcon = function() {
            return '<div class="styled-selector-down-arrow"></div>';
        };
        return selector;
    }

    function getNumSelector($el, num, unit){
        var options = [];
        for(var i = 0; i < num; i+=1){
            options.push({
                label: preZero(i) + unit,
                value: preZero(i)
            });
        }
        return getSelector($el, options);
    }

    function showAdmasterConfirm(cancelBack, confirmBack){
        var overlay = new OverlayDialog({
            url: 'content/guang_gao_wei/check_confirm_dialog.html',
            width: 480,
            height: 268,
            context: {},
            callback: function(){
                function cancel(){
                    overlay.close();
                    if(typeof cancelBack == 'function'){
                        cancelBack();
                    }
                }
                function confirm(){
                    overlay.close();
                    if(typeof confirmBack == 'function'){
                        confirmBack();
                    }
                }
                $('#adPos_dialog_warn_cancel').on('click', cancel);
                $('#adPos_dialog_warn_close').on('click', cancel);
                $('#adPos_dialog_warn_submit').on('click', confirm);
            }
        });
        overlay.open();
    }

    function confirmToContinue(msg, callback){
        var dialog = new OverlayDialog({
            url: 'content/guang_gao_wei/msg_dialog.html',
            width: 480,
            height: 268,
            context: {},
            callback: function() {
                $('#utils_dialog_info_msg').text(msg);
                $('#utils_dialog_info_submit').on('click', function() {
                    dialog.close();
                    if(typeof callback == 'function'){
                        callback();
                    }
                });
            }
        });
        dialog.open();
    }

    function showNameList($box, nameList, readOnly){
        var row = nameList.length;
        if(row < 3){
            row = 3;
        }
        var $table = $('<table>').attr('cellpadding', '0').attr('cellspacing', '0')
            .addClass('adPos_dialog_namelist_table');
        $table.append(
            $('<thead>').append(
                $('<tr>').append(
                    $('<td>').append(i18n('ADPOS_FLOATING_ACCLIST_APP'))
                ).append(
                    $('<td>').append(i18n('ADPOS_FLOATING_ACCLIST_CHANNEL'))
                ).append(
                    $('<td>').append(i18n('ADPOS_FLOATING_ACCLIST_PERIOD'))
                ).append(
                   readOnly ? '' : $('<td>').append(i18n('ADPOS_LIST_TITLE_OPR'))
                )
            )
        );
        var $body = $('<tbody>').appendTo($table);
        for(var i = 0; i < row; i+=1){
            var $row = $('<tr>').appendTo($body);
            var named = nameList[i];
            if(named != null){
                $row.append(
                    $('<td>').append(named.application)
                ).append(
                    $('<td>').append(named.channel)
                ).append(
                    $('<td>').append(function(){
                        var starttime = named.starttime != null ? named.starttime : '';
                        var endtime = named.endtime != null ? named.endtime : '';
                        return starttime + '-' + endtime;
                    }())
                ).append(
                    readOnly ? '' : $('<td>').append(
                        $('<span>').attr('data-index', i).addClass('adPos_operation').text(i18n('ADPOS_OPERATION_DELETE'))
                    )
                );
            } else {
                $row.append(readOnly ? '<td></td><td></td><td></td>' : '<td></td><td></td><td></td><td></td>');
            }
        }

        $box.empty().append($table);
    }

    function showAddNameList(callback){
        var overlay = new OverlayDialog({
            url: 'content/guang_gao_wei/floating_namelist_add.html',
            width: 760,
            height: 268,
            context: {},
            callback: function(){
                var beginTimeHour = getNumSelector('adPos_dialog_nameadd_starttime_hour', 24, '').create();
                var beginTimeMins = getNumSelector('adPos_dialog_nameadd_starttime_mins', 60, '').create();
                var endTimeHour= getNumSelector('adPos_dialog_nameadd_endtime_hour', 24, '').create();
                var endTimeMins = getNumSelector('adPos_dialog_nameadd_endtime_mins', 60, '').create();
                function cancel(){
                    overlay.close();
                }
                function confirm(){
                    var application = $('#adPos_dialog_nameadd_app').val();
                    var channel = $('#adPos_dialog_nameadd_channel').val();
                    var startTime = beginTimeHour.getValue() + ':' + beginTimeMins.getValue();
                    var endTime = endTimeHour.getValue() + ':' + endTimeMins.getValue();
                    var obj = {
                        application: application,
                        channel: channel,
                        starttime: startTime,
                        endtime: endTime
                    };
                    overlay.close();
                    if(typeof callback == 'function'){
                        callback(obj);
                    }
                }
                $('#adPos_dialog_nameadd_cancel').on('click', cancel);
                $('#adPos_dialog_nameadd_close').on('click', cancel);
                $('#adPos_dialog_nameadd_submit').on('click', confirm);
            }
        });
        overlay.open();
    }

    var adPosKindTuwen = {
        getList: function() {
            var self = this;
            if (!this.list) {
                var listOpt = {
                    containerId: 'adPos_position_list',
                    rows: 11,
                    listType: 1,
                    titles: [{
                        label: i18n('ADPOS_LIST_TITLE_ID')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_NAME')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_SIZE_TW')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_CREATOR')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_MTIME')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_COUNT_TW')
                    }, {
                        label: i18n('ADPOS_TUWEN_LIST_PLAY_MODE')
                    }, {
                        label: i18n('ADPOS_TUWEN_LIST_PLAY_DELAY')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_OPR')
                    }],
                    data: [],
                    styles: {
                        borderColor: 'transparent',
                        borderWidth: 1,
                        titleHeight: 46,
                        titleBg: 'rgb(93,161,192)',
                        titleColor: 'white',
                        cellBg: 'white',
                        evenBg: 'rgb(245,245,245)',
                        cellColor: 'rgb(114,114,114)',
                        footBg: 'white',
                        footColor: 'rgb(121,121,121)',
                        iconColor: 'rgb(93,161,192)',
                        inputBorder: '1px solid rgb(203,203,203)',
                        inputBg: 'white',
                    }
                };
                if(window.AdvSystemType != 'solo'){
                    listOpt.columns = 10;
                    listOpt.titles.unshift({label: i18n('ADPOS_SITE_NAME')});
                    listOpt.styles.columnsWidth = [0.09,0.08,0.14,0.08,0.06,0.13,0.07,0.07,0.04];
                    listOpt.styles.columnsMinWidth = [110,97,179,98,78,168,96,96,55,226];
                    listOpt.styles.ifColumnsWidthAll = true;
                } else {
                    listOpt.columns = 9;
                    listOpt.styles.columnsWidth = [0.11, 0.28, 0.08, 0.07, 0.14, 0.06, 0.06, 0.06];
                }
                this.list = new StyledList(listOpt);

                this.list.getPageData = function(pageNumber) {
                    adSearchText = $('#adPos_search_input').val();
                    var listSelf = this;
                    var listData;
                    var start = (pageNumber - 1) * 11;
                    var end = pageNumber * 11 - 1;
                    var query = '?user_id=' + my.paas.user_id + '&user_type=' + my.paas.user_type;
                    query += '&platform_id=' + my.paas.platform_current_id;
                    query += '&start=' + start;
                    query += '&end=' + end;
                    if(adSearchText){
                        query += '&name=' + adSearchText;
                    }
                    if(filterSites.length > 0){
                        query += '&site_id=' + filterSites.map(function(site){
                          return site.id;
                        }).join(',');
                    }
                    // @formatter:off
                    var queryUrl = adsRest + '/imgadp/imgadps' + query +
                        '&access_token=' + my.paas.access_token +
                        '&app_key=' + paasAppKey +
                        '&timestamp=' + new Date().toISOString();
                    // @formatter:on
                    addLoadingLayer();
                    $.ajax({
                        url: queryUrl,
                        type: 'GET',
                        async: false,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'x-aqua-sign': getPaaS_x_aqua_sign('GET',queryUrl)
                        },
                        dataType: 'json'
                    }).done(function(data, status, xhr) {
                        var totalCount = xhr.getResponseHeader('x-aqua-total-count');
                        listSelf.onTotalCount(totalCount || 0);
                        self.adsData = data;
                        if(window.AdvSystemType == 'local'){
                            if(data.length > 0){
                              var ids = data.map(function(adp){
                                return adp.ext_id;
                              });
                              var url = dmRoot + '/object_site/adv/adv_placement';
                              url += '?object_id=' + ids.join(',');
                              $.ajax({
                                url: url,
                                async: false,
                                headers: {
                                  'Accept': 'application/json',
                                  'Content-Type': 'application/json',
                                }
                              }).done(function(data){
                                  localAdpSites = data;
                              });
                            }
                        }
                        listData = self.formatListData(data || []);
                    }).always(function(){
                        removeLoadingLayer();
                    });

                    return listData;
                };
            }
            this.list.create();
            return this.list;
        },

        formatListData: function(data) {
            var listData = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                var oprEdit = '<span name="edit" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_EDIT') + '</span>';
                var oprDel = '<span name="delete" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_DELETE') + '</span>';
                var oprView = '<span name="view" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_VIEW') + '</span>';
                var oprConnect = '<span name="connect" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_CONNECT') + '</span>';
                var oprDist = '<span name="distribute" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_DIST') + '</span>';
                var oprBindCentral = '<span name="bindcentral" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_BINDCENTRAL') + '</span>';
                var oprUnbindCentral = '<span name="unbindcentral" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_UNBINDCENTRAL') + '</span>';
                var rowData = [];
                var oprs = '';
                if(window.AdvSystemType == 'central'){
                    if(item.site_id == window.AdvSelfSiteId){
                        rowData.push({label: window.AdvSelfSiteName + i18n('ADPOS_SITE_SELF_SUFFIX')});
                        oprs = makeMoreOption([oprView, oprEdit, oprConnect, oprDist, oprDel]);
                    } else {
                        rowData.push({label: (adpSiteNames[item.site_id] || '')});
                        oprs = oprView;
                    }
                } else if(window.AdvSystemType == 'local'){
                    if(item.site_id == window.AdvSelfSiteId){
                        rowData.push({label: window.AdvSelfSiteName + i18n('ADPOS_SITE_SELF_SUFFIX')});
                        // var isBindingCentral = false;
                        // var adpSites = localAdpSites[item.ext_id] || [];
                        // $.each(adpSites, function(i, adpsite){
                          // if(adpsite.siteId == window.AdvCentralSiteId){
                            // isBindingCentral = true;
                            // return false;
                          // }
                        // });
                        // oprs = oprEdit + (isBindingCentral ? oprUnbindCentral : oprBindCentral) + oprDist + oprDel;
                        oprs = makeMoreOption([oprView, oprEdit, oprDist, oprDel]);
                    } else {
                        rowData.push({label: (adpSiteNames[item.site_id] || '')});
                        oprs = oprView;
                    }
                } else {
                    oprs = oprView + oprEdit + oprDel;
                }
				var playcontrolparam_mode="";
				if(item.metadata && item.metadata.playcontrolparam && item.metadata.playcontrolparam.mode){
				   var playcontrolparam_mode_temp=item.metadata.playcontrolparam.mode;
					 playcontrolparam_mode=((playcontrolparam_mode_temp=="timingfloating")?i18n("ADPOS_DIALOG_TIME_FLOATLAYER"):playcontrolparam_mode_temp);
				}
                Array.prototype.push.apply(rowData, [{
                    label: item.ext_id || ''
                }, {
                    label: item.name || ''
                }, {
                    label: item.width + '×' + item.height
                }, {
                    label: item.user_name || ''
                }, {
                    label: item.update_date.slice(0, 10) + ' ' + item.update_date.slice(11, 19)
                }, {
                    label: item.num
                }, {
                    label: playcontrolparam_mode
                }, {
                    label: typeof (item.metadata && item.metadata.playcontrolparam && item.metadata.playcontrolparam.delay) !== 'undefined' ? item.metadata.playcontrolparam.delay : ''
                }, {
                    label: oprs
                }]);
                listData.push(rowData);
            }
            return listData;
        },

        getCreateDialog: function() {
            var self = this;
            if (!this.createDialog) {
                this.createDialog = new PopupDialog({
                    url: 'content/guang_gao_wei/tuwen_create_dialog.html',
                    width: 804,
                    height: 720,
                    context: {},
                    callback: function() {
                        var $dialog = $('#popup-dialog-dialog');
                        var adaptSelector = getSelector('adPos_dialog_ne_adapt_selector', [{
                            label: i18n('ADPOS_DIALOG_SELECTOR_ADAPT_RESTRICT'),
                            value: 0
                        }, {
                            label: i18n('ADPOS_DIALOG_SELECTOR_ADAPT_EXTENSABLE'),
                            value: 1
                        }]);
                        adaptSelector.create();
                        var dfAdSelector = getSelector('adPos_dialog_ne_dfAd_selector', [{
                            label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_BLANK'),
                            value: 0
                        }, {
                            label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_DEFAULT'),
                            value: 1
                        }]);
                        dfAdSelector.create();
                        var nameList = [];
                        showNameList($('#adPos_floating_namelist'), nameList);
                        $('#adPos_dialog_ne_submit').on('click', function() {
                            self.addAdPos(adaptSelector, dfAdSelector, nameList);
                        });
						$('#adPos_dialog_tuwen_floatLayer_Timesetting').attr("placeholder",i18n('ADPOS_DIALOG_FLOATLAYER_TIMESETTING_NOTE'))
                        $('#adPos_floating_app_whitelist').attr('placeholder', i18n('ADPOS_DIALOG_PLACEHOLDER_BY_COMMA'));
                        $("#adPos_admaster_check").on('click', function(){
                            var check = $(this);
                            check.toggleClass('adPos_admaster_open');
                            if(!check.hasClass('adPos_admaster_open')){
                                showAdmasterConfirm(function(){
                                    check.addClass('adPos_admaster_open');
                                });
                            }
                        });
                        $('.adPos_dialog_checkbox').on('click', function(){
                            $(this).toggleClass('adPos_dialog_checkbox_checked');
                        });
                        $dialog.on('click', '.adPos_dialog_radio', function(){
                            var $radio = $(this);
                            if(!$radio.hasClass('adPos_dialog_radio_checked')){
                                $dialog.find('.adPos_dialog_radio_checked').removeClass('adPos_dialog_radio_checked');
                                $radio.addClass('adPos_dialog_radio_checked');
                            }
                        });
                        $('#adPos_floating_namelist_add').on('click', function(){
                            showAddNameList(function(named){
                                nameList.push(named);
                                showNameList($('#adPos_floating_namelist'), nameList);
                            });
                        });
                        $dialog.on('click', '.adPos_operation', function(){
                            var index = Number($(this).attr('data-index'));
                            confirmToContinue(i18n('ADPOS_FLOATING_MSG_NAMEDEL'), function(){
                                nameList.splice(index, 1);
                                showNameList($('#adPos_floating_namelist'), nameList);
                            });
                        });
                    }

                });
            }
            this.createDialog.open();
            return this.createDialog;
        },

        getEditDialog: function(index) {
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var editDialog = new PopupDialog({
                url: 'content/guang_gao_wei/tuwen_edit_dialog.html',
                width: 804,
                height: 720,
                context: {},
                callback: function() {
                	var $dialog = $('#popup-dialog-dialog');
                    $('#adPosTwenDialogTitle').text(i18n('ADPOS_DIALOG_TITLE_BIANJI'));
					$('#adPos_dialog_tuwen_floatLayer_Timesetting').attr("placeholder",i18n('ADPOS_DIALOG_FLOATLAYER_TIMESETTING_NOTE'));
                    $('#adPos_floating_app_whitelist').attr('placeholder', i18n('ADPOS_DIALOG_PLACEHOLDER_BY_COMMA'));
                    var adaptSelector = getSelector('adPos_dialog_ne_adapt_selector', [{
                        label: i18n('ADPOS_DIALOG_SELECTOR_ADAPT_RESTRICT'),
                        value: 0
                    }, {
                        label: i18n('ADPOS_DIALOG_SELECTOR_ADAPT_EXTENSABLE'),
                        value: 1
                    }]);
                    adaptSelector.create();
                    adaptSelector.setValue(adPos.adaptation);
                    var dfAdSelector = getSelector('adPos_dialog_ne_dfAd_selector', [{
                        label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_BLANK'),
                        value: 0
                    }, {
                        label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_DEFAULT'),
                        value: 1
                    }]);
                    dfAdSelector.create();
                    dfAdSelector.setValue(adPos.default_ad);
                    $('#adPos_dialog_ne_id').val(adPos.ext_id).attr('disabled', true);
                    $('#adPos_dialog_ne_name').val(adPos.name);
                    $('#adPos_dialog_ne_size_width').val(adPos.width);
                    $('#adPos_dialog_ne_size_height').val(adPos.height);
                    $('#adPos_dialog_ne_count').val(adPos.num);
                    $('#adPos_is_starting_up').prop('checked', (adPos.metadata && adPos.metadata.isstartingup) == '1');
					if(adPos.metadata && adPos.metadata.playcontrolparam && adPos.metadata.playcontrolparam.mode){
						var playcontrolparam_mode=adPos.metadata.playcontrolparam.mode;
						$('#adPos_dialog_tuwen_ne_play_mode').val((playcontrolparam_mode=="timingfloating")?i18n("ADPOS_DIALOG_TIME_FLOATLAYER"):playcontrolparam_mode);
					}
                    $('#adPos_dialog_tuwen_ne_play_delay').val(adPos.metadata && adPos.metadata.playcontrolparam && adPos.metadata.playcontrolparam.delay);
                    var tuwen_floatLayer_Timesetting_value=(adPos.metadata&&adPos.metadata.floatingsettings&&adPos.metadata.floatingsettings.timing||"");
					var tuwen_floatLayer_duration_value=(adPos.metadata&&adPos.metadata.floatingsettings&&adPos.metadata.floatingsettings.totalduration||"");
					$('#adPos_dialog_tuwen_floatLayer_Timesetting').val(tuwen_floatLayer_Timesetting_value);
					$('#adPos_dialog_tuwen_floatLayer_duration').val(tuwen_floatLayer_duration_value);
					$('#adPos_dialog_ne_max_placement_count').val(adPos.max_placement_count);
					var nameList = $.extend([], adPos.metadata.floatingsettings && adPos.metadata.floatingsettings.namelist);
                    showNameList($('#adPos_floating_namelist'), nameList);
                    if(adPos.metadata && adPos.metadata.isopenfloating) {
                        $('#adPos_ne_floating_isopen').addClass('adPos_dialog_checkbox_checked');
                    }
                    if(adPos.metadata && adPos.metadata.floatingsettings && (adPos.metadata.floatingsettings.namelisttype == '0')){
                        $dialog.find('.adPos_dialog_radio_checked').removeClass('adPos_dialog_radio_checked');
                        $('#adPos_floating_whitelist').addClass('adPos_dialog_radio_checked');
                    }
                    $('#adPos_dialog_tuwen_floating_mininterval').val(adPos.metadata&&adPos.metadata.floatingsettings&&adPos.metadata.floatingsettings.mininterval||"");
                    var floatingApp = adPos.metadata&&adPos.metadata.floatingsettings&&adPos.metadata.floatingsettings.application;
                    $('#adPos_floating_app_poll').val(floatingApp && floatingApp.polling || '');
                    $('#adPos_floating_app_whitelist').val(floatingApp && floatingApp.namelist || '');
                    $('#adPos_dialog_ne_submit').on('click', function() {
                        self.updateAdPos(adPos, adaptSelector, dfAdSelector, editDialog, nameList);
                    });
                    if(adPos.visibility == '1'){
                        $("#adPos_admaster_check").addClass('adPos_admaster_open');
                    }
                    $("#adPos_admaster_check").on('click', function() {
                        var check = $(this);
                        check.toggleClass('adPos_admaster_open');
                        if (!check.hasClass('adPos_admaster_open')) {
                            showAdmasterConfirm(function() {
                            check.addClass('adPos_admaster_open');
                            });
                        }
                    });
                    $('.adPos_dialog_checkbox').on('click', function(){
                        $(this).toggleClass('adPos_dialog_checkbox_checked');
                    });
                    $dialog.on('click', '.adPos_dialog_radio', function(){
                        var $radio = $(this);
                        if(!$radio.hasClass('adPos_dialog_radio_checked')){
                            $dialog.find('.adPos_dialog_radio_checked').removeClass('adPos_dialog_radio_checked');
                            $radio.addClass('adPos_dialog_radio_checked');
                        }
                    });
                    $('#adPos_floating_namelist_add').on('click', function(){
                        showAddNameList(function(named){
                            nameList.push(named);
                            showNameList($('#adPos_floating_namelist'), nameList);
                        });
                    });
                    $dialog.on('click', '.adPos_operation', function(){
                        var index = Number($(this).attr('data-index'));
                        confirmToContinue(i18n('ADPOS_FLOATING_MSG_NAMEDEL'), function(){
                            nameList.splice(index, 1);
                            showNameList($('#adPos_floating_namelist'), nameList);
                        });
                    });
                }

            });
            editDialog.open();
            return editDialog;
        },

        getViewDialog: function(index) {
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var viewDialog = new PopupDialog({
                url: 'content/guang_gao_wei/tuwen_edit_dialog.html',
                width: 804,
                height: 720,
                context: {},
                callback: function() {
                    var $dialog = $('#popup-dialog-dialog');
                    $('#adPosTwenDialogTitle').text(i18n('ADPOS_DIALOG_TITLE_VIEW'));
                    // $('#adPos_dialog_ne_submit').hide();
                    $('#adPos_dialog_ne_cancel').hide();
                    $('#adPos_floating_namelist_add').hide();
                    var adaptSelector = getSelector('adPos_dialog_ne_adapt_selector', [{
                        label: i18n('ADPOS_DIALOG_SELECTOR_ADAPT_RESTRICT'),
                        value: 0
                    }, {
                        label: i18n('ADPOS_DIALOG_SELECTOR_ADAPT_EXTENSABLE'),
                        value: 1
                    }]);
                    adaptSelector.create();
                    adaptSelector.setValue(adPos.adaptation);
                    adaptSelector.disable();
                    var dfAdSelector = getSelector('adPos_dialog_ne_dfAd_selector', [{
                        label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_BLANK'),
                        value: 0
                    }, {
                        label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_DEFAULT'),
                        value: 1
                    }]);
                    dfAdSelector.create();
                    dfAdSelector.setValue(adPos.default_ad);
                    dfAdSelector.disable();
                    $('#adPos_dialog_ne_id').val(adPos.ext_id).attr('disabled', true);
                    $('#adPos_dialog_ne_name').val(adPos.name).attr('disabled', true);
                    $('#adPos_dialog_ne_size_width').val(adPos.width).attr('disabled', true);
                    $('#adPos_dialog_ne_size_height').val(adPos.height).attr('disabled', true);
                    $('#adPos_dialog_ne_count').val(adPos.num).attr('disabled', true);
                    $('#adPos_is_starting_up').prop('checked', (adPos.metadata && adPos.metadata.isstartingup) == '1').attr('disabled', true);
                    var playcontrolparam_mode="";
					if(adPos.metadata && adPos.metadata.playcontrolparam && adPos.metadata.playcontrolparam.mode){
						var playcontrolparam_mode_temp=adPos.metadata.playcontrolparam.mode;
						playcontrolparam_mode=((playcontrolparam_mode_temp=="timingfloating")?i18n("ADPOS_DIALOG_TIME_FLOATLAYER"):playcontrolparam_mode_temp)
					}
					$('#adPos_dialog_tuwen_ne_play_mode').val(playcontrolparam_mode).attr('disabled', true);
                    $('#adPos_dialog_tuwen_ne_play_delay').val(adPos.metadata && adPos.metadata.playcontrolparam && adPos.metadata.playcontrolparam.delay).attr('disabled', true);
                    $('#adPos_dialog_ne_max_placement_count').val(adPos.max_placement_count).attr('disabled', true);
                    if(adPos.visibility == '1'){
                        $("#adPos_admaster_check").addClass('adPos_admaster_open');
                    }
					var tuwen_floatLayer_Timesetting_value=(adPos.metadata&&adPos.metadata.floatingsettings&&adPos.metadata.floatingsettings.timing||"");
					var tuwen_floatLayer_duration_value=(adPos.metadata&&adPos.metadata.floatingsettings&&adPos.metadata.floatingsettings.totalduration||"");
					$('#adPos_dialog_tuwen_floatLayer_Timesetting').val(tuwen_floatLayer_Timesetting_value).attr('disabled', true);
					$('#adPos_dialog_tuwen_floatLayer_duration').val(tuwen_floatLayer_duration_value).attr('disabled', true);
					var nameList = $.extend([], adPos.metadata.floatingsettings && adPos.metadata.floatingsettings.namelist);
                    showNameList($('#adPos_floating_namelist'), nameList, true);
                    if(adPos.metadata && adPos.metadata.isopenfloating) {
                        $('#adPos_ne_floating_isopen').addClass('adPos_dialog_checkbox_checked');
                    }
                    if(adPos.metadata && adPos.metadata.floatingsettings && (adPos.metadata.floatingsettings.namelisttype == '0')){
                        $dialog.find('.adPos_dialog_radio_checked').removeClass('adPos_dialog_radio_checked');
                        $('#adPos_floating_whitelist').addClass('adPos_dialog_radio_checked');
                    }
                    $('#adPos_dialog_tuwen_floating_mininterval').val(adPos.metadata&&adPos.metadata.floatingsettings&&adPos.metadata.floatingsettings.mininterval||"").attr('disabled', true);
                    var floatingApp = adPos.metadata&&adPos.metadata.floatingsettings&&adPos.metadata.floatingsettings.application;
                    $('#adPos_floating_app_poll').val(floatingApp && floatingApp.polling || '').attr('disabled', true);
                    $('#adPos_floating_app_whitelist').val(floatingApp && floatingApp.namelist || '').attr('disabled', true);
                    $('#adPos_dialog_ne_submit').on('click', function() {
                        viewDialog.close();
                    });
				}
            });
            viewDialog.open();
            return viewDialog;
        },

        getDeleteDialog: function(index) {
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var deleteDialog = new PopupDialog({
                url: 'content/guang_gao_wei/delete_dialog.html',
                width: 480,
                height: 268,
                context: {},
                callback: function() {
                    $('.adPos_dialog_del_confirm_info').text(i18n('ADPOS_DIALOG_DEL_CONFIRM_INFO') + (adPos.name || ''));
                    $('#adPos_dialog_del_submit').on('click', function() {
                        self.deleteAdPos(adPos);
                        deleteDialog.close();
                    });
                }

            });
            deleteDialog.open();
            return deleteDialog;
        },

        deleteAdPos: function(adPos) {
            //@formatter:off
            var delUrl = adsRest + '/imgadp/' + adPos.id + '?user_id=' + my.paas.user_id +
                '&user_type=' + my.paas.user_type +
                '&access_token=' + my.paas.access_token +
                '&app_key=' + paasAppKey +
                '&timestamp=' + new Date().toISOString();
            //@formatter:on
            var self = this;
            $.ajax({
                type: 'DELETE',
                url: delUrl,
                headers: {
                    'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', delUrl)
                }
            }).done(function() {
                self.list.refreshList();
            });
        },

        addAdPos: function(adaptSelector, dfAdSelector, nameList) {
            var self = this;
            var adPosId = $('#adPos_dialog_ne_id').val();
            var adPosName = $('#adPos_dialog_ne_name').val();
            var width = Number($('#adPos_dialog_ne_size_width').val());
            var height = Number($('#adPos_dialog_ne_size_height').val());
            var num = Number($('#adPos_dialog_ne_count').val());
            var adaptation = adaptSelector.getValue();
            var default_ad = dfAdSelector.getValue();
            var isStartingUp = $('#adPos_is_starting_up').prop('checked') ? '1' : '0';
            var playMode = $('#adPos_dialog_tuwen_ne_play_mode').val();
            var playDelay = Number($('#adPos_dialog_tuwen_ne_play_delay').val());
            var maxPlacementCount = Number($('#adPos_dialog_ne_max_placement_count').val());
            var visibility = $('#adPos_admaster_check').hasClass('adPos_admaster_open') ? '1' : '0';
            var playMode_trim=document.getElementById("adPos_dialog_tuwen_ne_play_mode").value.trim();
			//过滤浮层定时设置传入数据，不让用户把中文逗号、空格等传入数据库。
			var floatLayer_Timesetting=document.getElementById("adPos_dialog_tuwen_floatLayer_Timesetting").value.replace(/\s+/g, "");
			floatLayer_Timesetting=floatLayer_Timesetting.replace(/，/ig,',');
            var floatLayer_duration=document.getElementById("adPos_dialog_tuwen_floatLayer_duration").value;
            var nameListType = (function(){
                if($('#adPos_floating_whitelist').hasClass('adPos_dialog_radio_checked')){
                    return '0';
                } else if($('#adPos_floating_blacklist').hasClass('adPos_dialog_radio_checked')) {
                    return '1';
                }
            }());
            var isFloatingOpen = $('#adPos_ne_floating_isopen').hasClass('adPos_dialog_checkbox_checked');
            var minInterval = $('#adPos_dialog_tuwen_floating_mininterval').val();
            var appPolling = $('#adPos_floating_app_poll').val();
            var appNamelist = $('#adPos_floating_app_whitelist').val();
			if(adPosId == ''){
                showInputErr('#adPos_dialog_ne_id', i18n('ADPOS_INPUT_WARNING_BLANK_ID'));
                return;
            }

            if(adPosName == ''){
                showInputErr('#adPos_dialog_ne_name', i18n('ADPOS_INPUT_WARNING_BLANK_NAME'));
                return;
            }

            if(width == 0){
                showInputErr('#adPos_dialog_ne_size_width', i18n('ADPOS_INPUT_WARNING_BLANK_WIDTH'));
                return;
            }

            if(height == 0){
                showInputErr('#adPos_dialog_ne_size_height', i18n('ADPOS_INPUT_WARNING_BLANK_HEIGHT'));
                return;
            }

            if(num == 0){
                showInputErr('#adPos_dialog_ne_count', i18n('ADPOS_DIALOG_WARNING_COUNT_BLANK_TW'));
                return;
            }

            if(isNaN(playDelay)){
            	showInputErr('#adPos_dialog_tuwen_ne_play_delay', i18n('ADPOS_DIALOG_WARNING_TW_PLAY_DELAY_NUMBER'));
            	return;
            }

            var adPos = {
                platform_id: my.paas.platform_current_id,
                ext_id: adPosId,
                name: adPosName,
                width: width,
                height: height,
                num: num,
                adaptation: adaptation,
                default_ad: default_ad,
                max_placement_count: maxPlacementCount,
                visibility: visibility,
                metadata: {
                	isstartingup: isStartingUp,
                    type: 'img',
                    playcontrolparam: {
						mode:(playMode_trim==i18n('ADPOS_DIALOG_TIME_FLOATLAYER'))?"timingfloating":playMode,
                    	delay: String(playDelay)
                    },
					isopenfloating: isFloatingOpen,
                    floatingsettings: {
                    	timing: floatLayer_Timesetting,
						totalduration: floatLayer_duration,
						namelisttype: nameListType,
						namelist: nameList,
						mininterval: minInterval,
						application: {
							polling: appPolling,
							namelist: appNamelist
						}
                    }
                }
            };
            var isExist = true;
            // @formatter:off
            var checkUrl = adsRest + '/imgadp/check/' + adPosId + '?user_id=' + my.paas.user_id +
                    '&user_type=' + my.paas.user_type +
                    '&app_key=' + paasAppKey +
                    '&access_token=' + my.paas.access_token +
                    '&timestamp=' + new Date().toISOString();
            // @formatter:on
            $.ajax({
                url: checkUrl,
                type: 'GET',
                async: false,
                headers: {
                    'x-aqua-sign': getPaaS_x_aqua_sign('GET',checkUrl)
                }
            }).done(function(data, ts, xhr) {
                if (xhr.status == 200) {
                    isExist = false;
                }
            }).fail(function(xhr, ts, err) {
                if (xhr.status == 409) {
                    isExist = true;
                }
            });

            if (isExist) {
                showInputErr('#adPos_dialog_ne_id', i18n('ADPOS_DIALOG_WARNING_EXIST_EXT_ID'));
                return;
            }
            // @formatter:off
            var createUrl = adsRest + '/imgadp?user_id=' + my.paas.user_id +
                '&user_type=' + my.paas.user_type +
                '&user_name=' + my.paas.user_name +
                '&access_token=' + my.paas.access_token +
                '&app_key=' + paasAppKey +
                '&timestamp=' + new Date().toISOString();
            // @formatter:on
            $.ajax({
                url: createUrl,
                type: 'POST',
                async: false,
                data: JSON.stringify(adPos),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-aqua-sign': getPaaS_x_aqua_sign('POST',createUrl)
                }
            }).done(function(data) {
                self.createDialog.close();
                if(window.AdvSystemType == 'local'){
                  self.bindToCentral(data);
                }
                self.list.update();
            });
        },

        bindToCentral: function(data){
          var url = adsRest + '/imgadp/' + data.id;
          url += '?user_id=' + my.paas.user_id;
          url += '&access_token=' + my.paas.access_token;
          url += '&app_key=' + paasAppKey;
          url += '&timestamp=' + new Date().toISOString();

          $.ajax({
            url: url,
            type: 'GET',
            async: false,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'x-aqua-sign': getPaaS_x_aqua_sign('GET',url)
            }
          }).done(function(adp){
            AdPosition.bindToCentral(adp);
          });
        },

        updateAdPos: function(adPos, adaptSelector, dfAdSelector, editDialog, nameList) {
            var self = this;
            var adPosName = $('#adPos_dialog_ne_name').val();
            var width = Number($('#adPos_dialog_ne_size_width').val());
            var height = Number($('#adPos_dialog_ne_size_height').val());
            var num = Number($('#adPos_dialog_ne_count').val());
            var adaptation = adaptSelector.getValue();
            var default_ad = dfAdSelector.getValue();
            var isStartingUp = $('#adPos_is_starting_up').prop('checked') ? '1' : '0';
            var playMode = $('#adPos_dialog_tuwen_ne_play_mode').val();
            var playDelay = Number($('#adPos_dialog_tuwen_ne_play_delay').val());
            var maxPlacementCount = Number($('#adPos_dialog_ne_max_placement_count').val());
            var visibility = $('#adPos_admaster_check').hasClass('adPos_admaster_open') ? '1' : '0';
			var playMode_trim=document.getElementById("adPos_dialog_tuwen_ne_play_mode").value.trim();
			var floatLayer_Timesetting=document.getElementById("adPos_dialog_tuwen_floatLayer_Timesetting").value.replace(/\s+/g, "");
            floatLayer_Timesetting=floatLayer_Timesetting.replace(/，/ig,',');
			var floatLayer_duration=document.getElementById("adPos_dialog_tuwen_floatLayer_duration").value;
			var nameListType = (function(){
                if($('#adPos_floating_whitelist').hasClass('adPos_dialog_radio_checked')){
                    return '0';
                } else if($('#adPos_floating_blacklist').hasClass('adPos_dialog_radio_checked')) {
                    return '1';
                }
            }());
            var isFloatingOpen = $('#adPos_ne_floating_isopen').hasClass('adPos_dialog_checkbox_checked');
            var minInterval = $('#adPos_dialog_tuwen_floating_mininterval').val();
            var appPolling = $('#adPos_floating_app_poll').val();
            var appNamelist = $('#adPos_floating_app_whitelist').val();
            if(adPosName == ''){
                showInputErr('#adPos_dialog_ne_name', i18n('ADPOS_INPUT_WARNING_BLANK_NAME'));
                return;
            }

            if(width == 0){
                showInputErr('#adPos_dialog_ne_size_width', i18n('ADPOS_INPUT_WARNING_BLANK_WIDTH'));
                return;
            }

            if(height == 0){
                showInputErr('#adPos_dialog_ne_size_height', i18n('ADPOS_INPUT_WARNING_BLANK_HEIGHT'));
                return;
            }

            if(num == 0){
                showInputErr('#adPos_dialog_ne_count', i18n('ADPOS_DIALOG_WARNING_COUNT_BLANK_TW'));
                return;
            }

            if(isNaN(playDelay)){
            	showInputErr('#adPos_dialog_tuwen_ne_play_delay', i18n('ADPOS_DIALOG_WARNING_TW_PLAY_DELAY_NUMBER'));
            	return;
            }

            adPos.name = adPosName;
            adPos.width = width;
            adPos.height = height;
            adPos.num = num;
            adPos.adaptation = adaptation;
            adPos.default_ad = default_ad;
            adPos.visibility = visibility;
            adPos.metadata.isstartingup = isStartingUp;
            if(!adPos.metadata.playcontrolparam){
            	adPos.metadata.playcontrolparam = {};
            }
            adPos.metadata.playcontrolparam.mode = ((playMode_trim==i18n('ADPOS_DIALOG_TIME_FLOATLAYER'))?"timingfloating":playMode);
            adPos.metadata.playcontrolparam.delay = String(playDelay);
            adPos.max_placement_count = maxPlacementCount;
            adPos.metadata.isopenfloating = isFloatingOpen;
            if(!adPos.metadata.floatingsettings){
                adPos.metadata.floatingsettings = {};
            }
            adPos.metadata.floatingsettings.timing = floatLayer_Timesetting;
            adPos.metadata.floatingsettings.totalduration = floatLayer_duration;
            adPos.metadata.floatingsettings.namelisttype = nameListType;
            adPos.metadata.floatingsettings.namelist = nameList;
            adPos.metadata.floatingsettings.mininterval = minInterval;
            if(!adPos.metadata.floatingsettings.application){
                adPos.metadata.floatingsettings.application = {};
            }
            adPos.metadata.floatingsettings.application.polling = appPolling;
            adPos.metadata.floatingsettings.application.namelist = appNamelist;


            //@formatter:off
            var updateUrl = adsRest + '/imgadp/' + adPos.id + '?user_id=' + my.paas.user_id +
                '&user_type=' + my.paas.user_type +
                '&user_name=' + my.paas.user_name +
                '&access_token=' + my.paas.access_token +
                '&app_key=' + paasAppKey +
                '&timestamp=' + new Date().toISOString();
            //@formatter:on
            $.ajax({
                type: 'PUT',
                async: false,
                url: updateUrl,
                data: JSON.stringify(adPos),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-aqua-sign': getPaaS_x_aqua_sign('PUT',updateUrl)
                }
            }).done(function() {
                self.list.refreshList();
                editDialog.close();
            });
        },

        getAdPosByIndex: function(index){
            return this.adsData && this.adsData[index];
        }

    };

    function movePatchPosition(obj) {
        //@formatter:off
        var axisHeight = $('.adPos_dialog_ne_patch_axis').first().height();
        var $block = $(obj).parents('.adPos_dialog_ne_patch_input_block');
        var prevOffset = $block.attr('patch-position');
        var offset = obj.value;
        if (prevOffset === offset) {
            return;
        }
        var attr_name = offset;
        var itemPosition;
        if (offset == '0') {
            itemPosition = 0;
        } else if (offset == '1') {
            itemPosition = axisHeight;
        } else {
            var parts = offset.split('/');
            var numerator = Number(parts[0]);
            var denominator = Number(parts[1]);
            if (isNaN(numerator) || isNaN(denominator) || denominator == 0) {
                showInputErr(obj, i18n('ADPOS_DIALOG_PATCH_INVALID_POSITION'));
                return;
            }
            itemPosition = numerator / denominator * axisHeight;
        }
        $('.adPos_dialog_ne_patch_input_block[patch-position="' + attr_name + '"]').remove();
        $block.attr('patch-position', attr_name).css('top', itemPosition);

        $('.adPos_dialog_ne_patch_position_label[patch-position="' + attr_name + '"]').remove();
        var itemLabel = i18n('ADPOS_DIALOG_PATCH_POS_MIDDLE');
        if (attr_name === '0') {
            itemLabel = i18n('ADPOS_DIALOG_PATCH_POS_BEFORE');
        } else if (attr_name === '1') {
            itemLabel = i18n('ADPOS_DIALOG_PATCH_POS_AFTER');
        }
        var positionLabel = prevOffset && ($('.adPos_dialog_ne_patch_position_label[patch-position="' + prevOffset + '"]'));
        if (positionLabel && positionLabel.length > 0) {
            positionLabel.attr('patch-position', attr_name).css('top', itemPosition)
                .empty().append(attr_name + '<br>' + itemLabel);
        } else {
            positionLabel = $('<div>').addClass('adPos_dialog_ne_patch_position_label')
                .attr('patch-position', attr_name).css('top', itemPosition)
                .append(attr_name + '<br>' + itemLabel)
                .appendTo($('.adPos_dialog_ne_patch_name_column').first());
        }

        $('.adPos_dialog_ne_patch_position[patch-position="' + attr_name + '"]').remove();
        var positionPoint = prevOffset && $('.adPos_dialog_ne_patch_position[patch-position="' + prevOffset + '"]');
        if (positionPoint && positionPoint.length > 0) {
            positionPoint.attr('patch-position', attr_name).css('top', itemPosition);
        } else {
            positionPoint = $('<div>').addClass('adPos_dialog_ne_patch_position')
                .attr('patch-position', attr_name).css('top', itemPosition)
                .appendTo($('.adPos_dialog_ne_patch_axis').first());
        }
        positionPoint.off().on('click', function() {
            var $posPointSelf = $(this);
            var positionPointTop = $posPointSelf.offset().top;
            var blockHeight = $('.adPos_dialog_ne_patch_input_block').first().height();
            if (blockHeight > 0) {
                $('.adPos_dialog_ne_patch_position').each(function(index, item) {
                    var $checkOverlap = $(item);
                    if (Math.abs(positionPointTop - $checkOverlap.offset().top) < blockHeight) {
                        var checkOverlapAttrName = $checkOverlap.attr('patch-position');
                        $('.adPos_dialog_ne_patch_input_block[patch-position="' + checkOverlapAttrName + '"]').css('z-index', 1);
                    }
                });
                var position_attr_name = $posPointSelf.attr('patch-position');
                $('.adPos_dialog_ne_patch_input_block[patch-position="' + position_attr_name + '"]').css('z-index', 10);
            }
        });

        if(prevOffset === '0' || prevOffset === '1'){
            addPositionIndicator(prevOffset);
        }
        //@formatter:on
    }

    function addPatchPositionInput(patch) {
        //@formatter:off
        var $inputBlock = $('<div>').append('<div></div>')
            .append(
                $('<div>').append(
                    $('<span>').append(i18n('ADPOS_DIALOG_PATCH_DURATION'))
                ).append(
                    $('<input  style="padding-left:12px;width:64px" type="text"/>').on('change', function(){
                        var duration = Number(this.value);
                        if(isNaN(duration)){
                            showInputErr(this, i18n('ADPOS_DIALOG_WARNING_INVALID_VALUE_TIEPIANWEI'));
                        }
                    }).val(patch && patch.duration)
                ).append('<span>s</span>')
            ).append('<div class="adPos_dialog_ne_patch_input_splitter"></div>')
            .append(
                $('<div>').append(
                    $('<span>').append(i18n('ADPOS_DIALOG_PATCH_FORCE_TIME'))
                ).append(
                    $('<input style="padding-left:12px;width:64px" type="text"/>').on('change', function(){
                        var frTime = Number(this.value);
                        if(isNaN(frTime)){
                            showInputErr(this, i18n('ADPOS_DIALOG_WARNING_INVALID_VALUE_TIEPIANWEI'));
                        }
                    }).val(patch && patch.force_time)
                ).append('<span>s</span>')
            ).append('<div class="adPos_dialog_ne_patch_input_splitter"></div>')
            .append(
                $('<div>').append(
                    $('<span>').append(i18n('ADPOS_DIALOG_PATCH_OFFSET'))
                ).append(
                    $('<input  style="padding-left:12px;width:64px" type="text"/>').on('change', function() {
                        movePatchPosition(this);
                    }).val(patch && patch.relative_offset)
                )
            ).append('<div class="adPos_dialog_ne_patch_input_splitter"></div>')
            .append(
                $('<div>').addClass('adPos_dialog_ne_patch_input_delete').on('click', function() {
                    var $inBlock = $(this).parents('.adPos_dialog_ne_patch_input_block');
                    var position = $inBlock.attr('patch-position');
                    if(position){
                        removePatchPositionInput(position);
                    } else {
                        $inBlock.remove();
                    }
                })
            ).addClass('adPos_dialog_ne_patch_input_block')
            .appendTo($('.adPos_dialog_ne_patch_inputs_column').first());

        if(patch){
            movePatchPosition($inputBlock.find('input').eq(2)[0]);
        }
        //@formatter:on
    }

    function removePatchPositionInput(position) {
        $('div[patch-position="' + position + '"]').remove();
        if (position === '0' || position === '1') {
            addPositionIndicator(position);
        }
    }

    function addPositionIndicator(position) {
        var label = i18n('ADPOS_DIALOG_PATCH_POS_BEFORE');
        var positionTop = 0;
        if (position === '1') {
            label = i18n('ADPOS_DIALOG_PATCH_POS_AFTER');
            positionTop = $('.adPos_dialog_ne_patch_axis').first().height();
        }
        $('<div>').addClass('adPos_dialog_ne_patch_position_label').attr('patch-position', position).css('top', positionTop).append(position + '<br>' + label).appendTo($('.adPos_dialog_ne_patch_name_column').first());

        $('<div>').addClass('adPos_dialog_ne_patch_position').attr('patch-position', position).css('top', positionTop).appendTo($('.adPos_dialog_ne_patch_axis').first());
    }

    function getPatchs() {
        var patchObjs = [];
        $('.adPos_dialog_ne_patch_input_block').each(function(index, item) {
            var valueInputs = $(item).find('input');
            var durIn = valueInputs.eq(0);
            var frTimeIn = valueInputs.eq(1);
            var offsetIn = valueInputs.eq(2);
            if (durIn.val() !== '' && frTimeIn.val() !== '' && offsetIn.val() !== '') {
                var duration = Number(durIn.val());
                var force_time = Number(frTimeIn.val());
                var offset = offsetIn.val();
                var available;
                if (isNaN(duration) || isNaN(force_time)) {
                    available = false;
                } else if (offset === '0' || offset === '1') {
                    available = true;
                } else {
                    var ofsParts = offset.split('/');
                    var numerator = Number(ofsParts[0]);
                    var denominator = Number(ofsParts[1]);
                    if (isNaN(numerator) || isNaN(denominator) || denominator == 0) {
                        available = false;
                    } else {
                        available = true;
                    }
                }
                if (!available) {
                    return true;
                }
                patchObjs.push({
                    duration: duration,
                    force_time: force_time,
                    relative_offset: offset
                });
            } else {
                return true;
            }
        });
        return patchObjs;
    }

    function checkPatchAddAvailable(){
    	var $addBtn = $('#adPos_dialog_ne_patch_add');
    	var $checkedInputs = $('input[patch-attr-value="ok"]');
    	var canAdd = true;

    	if($checkedInputs.length != 3){
    		canAdd = false;
    	}

    	$checkedInputs.each(function(i, item){
    		if($(item).val() === ''){
    			canAdd = false;
    		}
    	});

    	if(canAdd){
    		$addBtn.removeClass('adPos_dialog_patch_add_disabled');
    	} else {
    		$addBtn.addClass('adPos_dialog_patch_add_disabled');
    	}
    }

    var adPosKindTiepian = {
        getList: function() {
            var self = this;
            if (!this.list) {
                var listOpt = {
                    rows: 11,
                    containerId: 'adPos_position_list',
                    titles: [{
                        label: i18n('ADPOS_LIST_TITLE_ID')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_NAME')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_CREATOR')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_COUNT_TP')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_MTIME')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_OPR')
                    }],
                    listType: 1,
                    data: [],
                    styles: {
                        borderColor: 'transparent',
                        borderWidth: 1,
                        titleHeight: 46,
                        titleBg: 'rgb(93,161,192)',
                        titleColor: 'white',
                        cellBg: 'white',
                        evenBg: 'rgb(245,245,245)',
                        cellColor: 'rgb(114,114,114)',
                        footBg: 'white',
                        footColor: 'rgb(121,121,121)',
                        iconColor: 'rgb(93,161,192)',
                        inputBorder: '1px solid rgb(203,203,203)',
                        inputBg: 'white',
                    }
                };
                if(window.AdvSystemType != 'solo'){
                    listOpt.columns = 7;
                    listOpt.titles.unshift({label: i18n('ADPOS_SITE_NAME')});
                    listOpt.styles.columnsWidth = [0.09,0.14,0.19,0.13,0.07,0.15];
                    listOpt.styles.columnsMinWidth = [115,177,235,165,96,189,267];
                    listOpt.styles.ifColumnsWidthAll = true;
                } else {
                    listOpt.columns = 6;
                    listOpt.styles.columnsWidth = [0.12, 0.28, 0.13, 0.10, 0.17];
                }
                this.list = new StyledList(listOpt);

                this.list.getPageData = function(pageNumber) {
                    adSearchText = $('#adPos_search_input').val();
                    var listSelf = this;
                    var listData;
                    var start = (pageNumber - 1) * 11;
                    var end = pageNumber * 11 - 1;
                    var query = '?user_id=' + my.paas.user_id + '&user_type=' + my.paas.user_type;
                    query += '&platform_id=' + my.paas.platform_current_id;
                    query += '&start=' + start;
                    query += '&end=' + end;
                    if(adSearchText){
                        query += '&name=' + adSearchText;
                    }
                    if(filterSites.length > 0){
                        query += '&site_id=' + filterSites.map(function(site){
                          return site.id;
                        }).join(',');
                    }
                    // @formatter:off
                    var queryUrl = adsRest + '/videoadp/videoadps' + query +
                        '&access_token=' + my.paas.access_token +
                        '&app_key=' + paasAppKey +
                        '&timestamp=' + new Date().toISOString();
                    // @formatter:on
                    addLoadingLayer();
                    $.ajax({
                        url: queryUrl,
                        type: 'GET',
                        async: false,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'x-aqua-sign': getPaaS_x_aqua_sign('GET',queryUrl)
                        },
                        dataType: 'json'
                    }).done(function(data, status, xhr) {
                        var totalCount = xhr.getResponseHeader('x-aqua-total-count');
                        listSelf.onTotalCount(totalCount || 0);
                        self.adsData = data;
                        if(window.AdvSystemType == 'local'){
                            if(data.length > 0){
                              var ids = data.map(function(adp){
                                return adp.ext_id;
                              });
                              var url = dmRoot + '/object_site/adv/adv_placement';
                              url += '?object_id=' + ids.join(',');
                              $.ajax({
                                url: url,
                                async: false,
                                headers: {
                                  'Accept': 'application/json',
                                  'Content-Type': 'application/json',
                                }
                              }).done(function(data){
                                  localAdpSites = data;
                              });
                            }
                        }
                        listData = self.formatListData(data || []);
                    }).always(function(){
                        removeLoadingLayer();
                    });

                    return listData;
                };
            }
            this.list.create();
            return this.list;
        },

        formatListData: function(data) {
            var listData = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                var oprView = '<span name="view" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_VIEW') + '</span>';
                var oprEdit = '<span name="edit" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_EDIT') + '</span>';
                var oprDel = '<span name="delete" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_DELETE') + '</span>';
                var oprConnect = '<span name="connect" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_CONNECT') + '</span>';
                var oprDist = '<span name="distribute" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_DIST') + '</span>';
                var oprBindCentral = '<span name="bindcentral" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_BINDCENTRAL') + '</span>';
                var oprUnbindCentral = '<span name="unbindcentral" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_UNBINDCENTRAL') + '</span>';
                var rowData = [];
                var oprs = '';
                if(window.AdvSystemType == 'central'){
                    if(item.site_id == window.AdvSelfSiteId){
                        rowData.push({label: window.AdvSelfSiteName + i18n('ADPOS_SITE_SELF_SUFFIX')});
                        oprs = makeMoreOption([oprView, oprEdit, oprConnect, oprDist, oprDel]);
                    } else {
                        rowData.push({label: (adpSiteNames[item.site_id] || '')});
                        oprs = oprView;
                    }
                } else if(window.AdvSystemType == 'local'){
                    if(item.site_id == window.AdvSelfSiteId){
                        rowData.push({label: window.AdvSelfSiteName + i18n('ADPOS_SITE_SELF_SUFFIX')});
                        // var isBindingCentral = false;
                        // var adpSites = localAdpSites[item.ext_id] || [];
                        // $.each(adpSites, function(i, adpsite){
                          // if(adpsite.siteId == window.AdvCentralSiteId){
                            // isBindingCentral = true;
                            // return false;
                          // }
                        // });
                        // oprs = oprEdit + (isBindingCentral ? oprUnbindCentral : oprBindCentral) + oprDist + oprDel;
                        oprs = makeMoreOption([oprView, oprEdit, oprDist, oprDel]);
                    } else {
                        rowData.push({label: (adpSiteNames[item.site_id] || '')});
                        oprs = oprView;
                    }
                } else {
                    oprs = oprView + oprEdit + oprDel;
                }
                var patchCount = item.patchs && item.patchs.length || 0;
                Array.prototype.push.apply(rowData, [{
                    label: item.ext_id || ''
                }, {
                    label: item.name || ''
                }, {
                    label: item.user_name || ''
                }, {
                    label: patchCount
                }, {
                    label: item.update_date.slice(0, 10) + ' ' + item.update_date.slice(11, 19)
                }, {
                    label: oprs
                }]);
                listData.push(rowData);
            }
            return listData;
        },

        getCreateDialog: function() {
            var self = this;
            if (!this.createDialog) {
                this.createDialog = new PopupDialog({
                    url: 'content/guang_gao_wei/tiepian_create_dialog.html',
                    width: 760,
                    height: 720,
                    context: {},
                    callback: function() {
                        var dfAdSelector = getSelector('adPos_dialog_ne_dfAd_selector', [{
                            label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_BLANK'),
                            value: 0
                        }, {
                            label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_DEFAULT'),
                            value: 1
                        }]);
                        dfAdSelector.create();
						$('#adPos_dialog_ne_patch_add').on('click', function() {
							var $addBtn = $(this);
							if (!$addBtn.hasClass('adPos_dialog_patch_add_disabled')) {
								var $duration = $('#adPos_dialog_ne_patch_new_duration');
								var $force_time = $('#adPos_dialog_ne_patch_new_force_time');
								var $relative_offset = $('#adPos_dialog_ne_patch_new_relative_offset');
								addPatchPositionInput({
									duration: $duration.val(),
									force_time: $force_time.val(),
									relative_offset: $relative_offset.val()
								});
								$addBtn.addClass('adPos_dialog_patch_add_disabled');
								$duration.val('').attr('patch-attr-value', '');
								$force_time.val('').attr('patch-attr-value', '');
								$relative_offset.val('').attr('patch-attr-value', '');
							}
						});
						$('#adPos_dialog_ne_patch_new_duration').on('change', function(){
							var duration = Number(this.value);
                        	if(isNaN(duration)){
                        		$(this).attr('patch-attr-value', '');
                            	showInputErr(this, i18n('ADPOS_DIALOG_WARNING_INVALID_VALUE_TIEPIANWEI'));
                        	} else {
                        		$(this).attr('patch-attr-value', 'ok');
                        	}
                        	checkPatchAddAvailable();
						});
						$('#adPos_dialog_ne_patch_new_force_time').on('change', function(){
							var frTime = Number(this.value);
                        	if(isNaN(frTime)){
                        		$(this).attr('patch-attr-value', '');
                            	showInputErr(this, i18n('ADPOS_DIALOG_WARNING_INVALID_VALUE_TIEPIANWEI'));
                        	} else {
                        		$(this).attr('patch-attr-value', 'ok');
                        	}
                        	checkPatchAddAvailable();
						});
						$('#adPos_dialog_ne_patch_new_relative_offset').on('change', function(){
							var offset = this.value;
							if (offset === '0' || offset === '1'){
								$(this).attr('patch-attr-value', 'ok');
							} else {
            					var parts = offset.split('/');
            					var numerator = Number(parts[0]);
            					var denominator = Number(parts[1]);
								if (isNaN(numerator) || isNaN(denominator) || denominator == 0) {
									$(this).attr('patch-attr-value', '');
                					showInputErr(this, i18n('ADPOS_DIALOG_PATCH_INVALID_POSITION'));
            					} else {
            						$(this).attr('patch-attr-value', 'ok');
            					}
            				}
            				checkPatchAddAvailable();
						});
                        $('#adPos_dialog_ne_submit').on('click', function() {
                            self.addAdPos(dfAdSelector);
                        });
                        $("#adPos_admaster_check").on('click', function() {
                            var check = $(this);
                            check.toggleClass('adPos_admaster_open');
                            if (!check.hasClass('adPos_admaster_open')) {
                                showAdmasterConfirm(function() {
                                check.addClass('adPos_admaster_open');
                                });
                            }
                        });
                    }

                });
            }
            this.createDialog.open();
            return this.createDialog;
        },

        getEditDialog: function(index) {
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var editDialog = new PopupDialog({
                url: 'content/guang_gao_wei/tiepian_edit_dialog.html',
                width: 760,
                height: 720,
                context: {},
                callback: function() {
                    var dfAdSelector = getSelector('adPos_dialog_ne_dfAd_selector', [{
                        label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_BLANK'),
                        value: 0
                    }, {
                        label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_DEFAULT'),
                        value: 1
                    }]);
                    dfAdSelector.create();
                    dfAdSelector.setValue(adPos.default_ad);
                    $('#adPos_dialog_ne_id').val(adPos.ext_id).attr('disabled', true);
                    $('#adPos_dialog_ne_name').val(adPos.name);
                    $('#adPos_dialog_ne_size_width').val(adPos.width);
                    $('#adPos_dialog_ne_size_height').val(adPos.height);
                    $('#adPos_dialog_ne_max_placement_count').val(adPos.max_placement_count);
                    if(adPos.visibility == '1'){
                        $("#adPos_admaster_check").addClass('adPos_admaster_open');
                    }
                    if(adPos.metadata.isstartingup === "1"){
                        $('#adPos_tiepian_is_starting_up')[0].checked = true;
                    }else{
                        $('#adPos_tiepian_is_starting_up')[0].checked = false;
                    }

                    var patchs = adPos.patchs || [];
                    for (var i = 0, len = patchs.length; i < len; i++) {
                        addPatchPositionInput(patchs[i]);
                    }

                    $('#adPos_dialog_ne_patch_add').on('click', function() {
						var $addBtn = $(this);
						if (!$addBtn.hasClass('adPos_dialog_patch_add_disabled')) {
							var $duration = $('#adPos_dialog_ne_patch_new_duration');
							var $force_time = $('#adPos_dialog_ne_patch_new_force_time');
							var $relative_offset = $('#adPos_dialog_ne_patch_new_relative_offset');
							addPatchPositionInput({
								duration: $duration.val(),
								force_time: $force_time.val(),
								relative_offset: $relative_offset.val()
							});
							$addBtn.addClass('adPos_dialog_patch_add_disabled');
							$duration.val('').attr('patch-attr-value', '');
							$force_time.val('').attr('patch-attr-value', '');
							$relative_offset.val('').attr('patch-attr-value', '');
						}
					});
					$('#adPos_dialog_ne_patch_new_duration').on('change', function(){
						var duration = Number(this.value);
                       	if(isNaN(duration)){
                       		$(this).attr('patch-attr-value', '');
                           	showInputErr(this, i18n('ADPOS_DIALOG_WARNING_INVALID_VALUE_TIEPIANWEI'));
                       	} else {
                       		$(this).attr('patch-attr-value', 'ok');
                       	}
                       	checkPatchAddAvailable();
					});
					$('#adPos_dialog_ne_patch_new_force_time').on('change', function(){
						var frTime = Number(this.value);
                       	if(isNaN(frTime)){
                       		$(this).attr('patch-attr-value', '');
                           	showInputErr(this, i18n('ADPOS_DIALOG_WARNING_INVALID_VALUE_TIEPIANWEI'));
                       	} else {
                       		$(this).attr('patch-attr-value', 'ok');
                       	}
                       	checkPatchAddAvailable();
					});
					$('#adPos_dialog_ne_patch_new_relative_offset').on('change', function(){
						var offset = this.value;
						if (offset === '0' || offset === '1'){
							$(this).attr('patch-attr-value', 'ok');
						} else {
            				var parts = offset.split('/');
            				var numerator = Number(parts[0]);
            				var denominator = Number(parts[1]);
							if (isNaN(numerator) || isNaN(denominator) || denominator == 0) {
								$(this).attr('patch-attr-value', '');
                				showInputErr(this, i18n('ADPOS_DIALOG_PATCH_INVALID_POSITION'));
            				} else {
            					$(this).attr('patch-attr-value', 'ok');
            				}
            			}
            			checkPatchAddAvailable();
					});
                    $('#adPos_dialog_ne_submit').on('click', function() {
                        self.updateAdPos(adPos, dfAdSelector, editDialog);
                    });
                    $("#adPos_admaster_check").on('click', function() {
                        var check = $(this);
                        check.toggleClass('adPos_admaster_open');
                        if (!check.hasClass('adPos_admaster_open')) {
                            showAdmasterConfirm(function() {
                            check.addClass('adPos_admaster_open');
                            });
                        }
                    });
                }

            });
            editDialog.open();
            return editDialog;
        },

        getViewDialog: function(index) {
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var dialog = new PopupDialog({
                url: 'content/guang_gao_wei/tiepian_view_dialog.html',
                width: 760,
                height: 594,
                context: {},
                callback: function() {
                    var dfAdSelector = getSelector('adPos_dialog_ne_dfAd_selector', [{
                        label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_BLANK'),
                        value: 0
                    }, {
                        label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_DEFAULT'),
                        value: 1
                    }]);
                    dfAdSelector.create();
                    dfAdSelector.setValue(adPos.default_ad);
                    dfAdSelector.disable();
                    $('#adPos_dialog_ne_id').val(adPos.ext_id).attr('disabled', true);
                    $('#adPos_dialog_ne_name').val(adPos.name).attr('disabled', true);
                    $('#adPos_dialog_ne_size_width').val(adPos.width).attr('disabled', true);
                    $('#adPos_dialog_ne_size_height').val(adPos.height).attr('disabled', true);
                    $('#adPos_dialog_ne_max_placement_count').val(adPos.max_placement_count).attr('disabled', true);
                    if(adPos.visibility == '1'){
                        $("#adPos_admaster_check").addClass('adPos_admaster_open');
                    }
                    if(adPos.metadata.isstartingup === "1"){
                        $('#adPos_tiepian_is_starting_up')[0].checked = true;
                    }else{
                        $('#adPos_tiepian_is_starting_up')[0].checked = false;
                    }
                    $('#adPos_tiepian_is_starting_up').attr('disabled', true);

                    var patchs = adPos.patchs || [];
                    patchs.sort(function(a, b){
                        function getNumber(str){
                            if(str === '0' || str === '1'){
                                return Number(str);
                            } else {
                                var numParts = str.split('/');
                                var numerator = numParts[0];
                                var denominator = numParts[1];
                                return numerator/denominator;
                            }
                        }
                        return getNumber(a.relative_offset) - getNumber(b.relative_offset);
                    });

                    var listLen = Math.max(5, patchs.length);
                    // @formatter:off
                    $('<table>').append(
                        $('<thead>').append(
                            $('<tr>').append('<td>')
                                .append($('<td>').text(i18n('ADPOS_DIALOG_TP_PATCH_VIEW_LIST_TIEPIANWEI')))
                                .append($('<td>').text(i18n('ADPOS_DIALOG_TP_PATCH_VIEW_LIST_SHICHANG')))
                                .append($('<td>').text(i18n('ADPOS_DIALOG_TP_PATCH_VIEW_LIST_QIANGZHI')))
                                .append($('<td>').text(i18n('ADPOS_DIALOG_TP_PATCH_VIEW_LIST_XDPIANYI')))
                        )
                    ).append(function(){
                        var tb = $('<tbody>');
                        for(var i = 0; i < listLen; i++){
                            var patch = patchs[i];
                            if(patch){
                                tb.append(
                                    $('<tr>').append($('<td>').text(i + 1))
                                        .append($('<td>').text(
                                            function(){
                                                var patchPositionLabel = i18n('ADPOS_DIALOG_PATCH_POS_MIDDLE');
                                                if(patch.relative_offset === '0'){
                                                    patchPositionLabel = i18n('ADPOS_DIALOG_PATCH_POS_BEFORE');
                                                } else if(patch.relative_offset === '1'){
                                                    patchPositionLabel = i18n('ADPOS_DIALOG_PATCH_POS_AFTER');
                                                }
                                                return patchPositionLabel;
                                            }()
                                        ))
                                        .append($('<td>').text(patch.duration))
                                        .append($('<td>').text(patch.force_time))
                                        .append($('<td>').text(patch.relative_offset))
                                );
                            } else {
                                tb.append('<tr><td>' + (i+1) + '</td><td></td><td></td><td></td><td></td></tr>');
                            }
                        }
                        return tb;
                    }()).addClass('adPos_dialog_tp_patch_view_list_table')
                    .appendTo('#adPos_dialog_tp_patch_view_list_block');
                    // @formatter:on

                    $('#adPos_dialog_ne_submit').on('click', function() {
                        dialog.close();
                    });
                }

            });
            dialog.open();
            return dialog;
        },

        getDeleteDialog: function(index) {
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var deleteDialog = new PopupDialog({
                url: 'content/guang_gao_wei/delete_dialog.html',
                width: 480,
                height: 268,
                context: {},
                callback: function() {
                    $('.adPos_dialog_del_confirm_info').text(i18n('ADPOS_DIALOG_DEL_CONFIRM_INFO') + (adPos.name || ''));
                    $('#adPos_dialog_del_submit').on('click', function() {
                        self.deleteAdPos(adPos);
                        deleteDialog.close();
                    });
                }

            });
            deleteDialog.open();
            return deleteDialog;
        },

        getViewDialog_obs: function(index){
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var viewDialog = new PopupDialog({
                url: 'content/guang_gao_wei/tiepian_patch_view_dialog.html',
                width: 760,
                height: 370,
                context: {},
                callback: function(){
                    $('#adPos_dialog_tp_patch_view_name').text(adPos.name);
                    var patchs = adPos.patchs || [];
                    patchs.sort(function(a, b){
                        function getNumber(str){
                            if(str === '0' || str === '1'){
                                return Number(str);
                            } else {
                                var numParts = str.split('/');
                                var numerator = numParts[0];
                                var denominator = numParts[1];
                                return numerator/denominator;
                            }
                        }
                        return getNumber(a.relative_offset) - getNumber(b.relative_offset);
                    });

                    var listLen = Math.max(5, patchs.length);
                    // @formatter:off
                    $('<table>').append(
                        $('<thead>').append(
                            $('<tr>').append('<td>')
                                .append($('<td>').text(i18n('ADPOS_DIALOG_TP_PATCH_VIEW_LIST_TIEPIANWEI')))
                                .append($('<td>').text(i18n('ADPOS_DIALOG_TP_PATCH_VIEW_LIST_SHICHANG')))
                                .append($('<td>').text(i18n('ADPOS_DIALOG_TP_PATCH_VIEW_LIST_QIANGZHI')))
                                .append($('<td>').text(i18n('ADPOS_DIALOG_TP_PATCH_VIEW_LIST_XDPIANYI')))
                        )
                    ).append(function(){
                        var tb = $('<tbody>');
                        for(var i = 0; i < listLen; i++){
                            var patch = patchs[i];
                            if(patch){
                                tb.append(
                                    $('<tr>').append($('<td>').text(i + 1))
                                        .append($('<td>').text(
                                            function(){
                                                var patchPositionLabel = i18n('ADPOS_DIALOG_PATCH_POS_MIDDLE');
                                                if(patch.relative_offset === '0'){
                                                    patchPositionLabel = i18n('ADPOS_DIALOG_PATCH_POS_BEFORE');
                                                } else if(patch.relative_offset === '1'){
                                                    patchPositionLabel = i18n('ADPOS_DIALOG_PATCH_POS_AFTER');
                                                }
                                                return patchPositionLabel;
                                            }()
                                        ))
                                        .append($('<td>').text(patch.duration))
                                        .append($('<td>').text(patch.force_time))
                                        .append($('<td>').text(patch.relative_offset))
                                );
                            } else {
                                tb.append('<tr><td>' + (i+1) + '</td><td></td><td></td><td></td><td></td></tr>');
                            }
                        }
                        return tb;
                    }()).addClass('adPos_dialog_tp_patch_view_list_table')
                    .appendTo('#adPos_dialog_tp_patch_view_list_block');
                    // @formatter:on
                }
            });
            viewDialog.open();
            return viewDialog;
        },

        deleteAdPos: function(adPos) {
            var self = this;
            //@formatter:off
            var delUrl = adsRest + '/videoadp/' + adPos.id + '?user_id=' + my.paas.user_id +
                '&user_type=' + my.paas.user_type +
                '&access_token=' + my.paas.access_token +
                '&app_key=' + paasAppKey +
                '&timestamp=' + new Date().toISOString();
            //@formatter:on
            $.ajax({
                type: 'DELETE',
                url: delUrl,
                headers: {
                    'x-aqua-sign': getPaaS_x_aqua_sign('DELETE',delUrl)
                }
            }).done(function() {
                self.list.refreshList();
            });
        },

        addAdPos: function(dfAdSelector) {
            var self = this;
            var adPosId = $('#adPos_dialog_ne_id').val();
            var adPosName = $('#adPos_dialog_ne_name').val();
            var width = Number($('#adPos_dialog_ne_size_width').val());
            var height = Number($('#adPos_dialog_ne_size_height').val());
            var default_ad = dfAdSelector.getValue();
            var isStartingUp = $('#adPos_tiepian_is_starting_up').prop('checked') ? '1' : '0';
            var maxPlacementCount = Number($('#adPos_dialog_ne_max_placement_count').val());
            var visibility = $('#adPos_admaster_check').hasClass('adPos_admaster_open') ? '1' : '0';
            if(adPosId == ''){
                showInputErr('#adPos_dialog_ne_id', i18n('ADPOS_INPUT_WARNING_BLANK_ID'));
                return;
            }

            if(adPosName == ''){
                showInputErr('#adPos_dialog_ne_name', i18n('ADPOS_INPUT_WARNING_BLANK_NAME'));
                return;
            }

            if(width == 0){
                showInputErr('#adPos_dialog_ne_size_width', i18n('ADPOS_INPUT_WARNING_BLANK_WIDTH'));
                return;
            }

            if(height == 0){
                showInputErr('#adPos_dialog_ne_size_height', i18n('ADPOS_INPUT_WARNING_BLANK_HEIGHT'));
                return;
            }

            var patchs = getPatchs();

            var adPos = {
                platform_id: my.paas.platform_current_id,
                ext_id: adPosId,
                name: adPosName,
                width: width,
                height: height,
                default_ad: default_ad,
                max_placement_count: maxPlacementCount,
                visibility: visibility,
                patchs: patchs,
                metadata: {
                    isstartingup: isStartingUp,
                    type: 'video',
                }
            };

            var isExist = true;
            // @formatter:off
            var checkUrl = adsRest + '/imgadp/check/' + adPosId + '?user_id=' + my.paas.user_id +
                    '&user_type=' + my.paas.user_type +
                    '&app_key=' + paasAppKey +
                    '&access_token=' + my.paas.access_token +
                    '&timestamp=' + new Date().toISOString();
            // @formatter:on
            $.ajax({
                url: checkUrl,
                type: 'GET',
                async: false,
                headers: {
                    'x-aqua-sign': getPaaS_x_aqua_sign('GET', checkUrl)
                }
            }).done(function(data, ts, xhr) {
                if (xhr.status == 200) {
                    isExist = false;
                }
            }).fail(function(xhr, ts, err) {
                if (xhr.status == 409) {
                    isExist = true;
                }
            });

            if (isExist) {
                showInputErr('#adPos_dialog_ne_id', i18n('ADPOS_DIALOG_WARNING_EXIST_EXT_ID'));
                return;
            }
            // @formatter:off
            var createUrl = adsRest + '/videoadp?user_id=' + my.paas.user_id +
                '&user_type=' + my.paas.user_type +
                '&user_name=' + my.paas.user_name +
                '&access_token=' + my.paas.access_token +
                '&app_key=' + paasAppKey +
                '&timestamp=' + new Date().toISOString();
            // @formatter:on
            $.ajax({
                url: createUrl,
                type: 'POST',
                async: false,
                data: JSON.stringify(adPos),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-aqua-sign': getPaaS_x_aqua_sign('POST', createUrl)
                }
            }).done(function(data) {
                self.createDialog.close();
                if(window.AdvSystemType == 'local'){
                  self.bindToCentral(data);
                }
                self.list.update();
            });
        },

        bindToCentral: function(data){
          var url = adsRest + '/videoadp/' + data.id;
          url += '?user_id=' + my.paas.user_id;
          url += '&access_token=' + my.paas.access_token;
          url += '&app_key=' + paasAppKey;
          url += '&timestamp=' + new Date().toISOString();

          $.ajax({
            url: url,
            type: 'GET',
            async: false,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'x-aqua-sign': getPaaS_x_aqua_sign('GET',url)
            }
          }).done(function(adp){
            AdPosition.bindToCentral(adp);
          });
        },

        updateAdPos: function(adPos, dfAdSelector, editDialog) {
            var self = this;
            var adPosName = $('#adPos_dialog_ne_name').val();
            var width = Number($('#adPos_dialog_ne_size_width').val());
            var height = Number($('#adPos_dialog_ne_size_height').val());
            var default_ad = dfAdSelector.getValue();
            var patchs = getPatchs();
            var isStartingUp = $('#adPos_tiepian_is_starting_up').prop('checked') ? '1' : '0';
            var maxPlacementCount = Number($('#adPos_dialog_ne_max_placement_count').val());
            var visibility = $('#adPos_admaster_check').hasClass('adPos_admaster_open') ? '1' : '0';

            if(adPosName == ''){
                showInputErr('#adPos_dialog_ne_name', i18n('ADPOS_INPUT_WARNING_BLANK_NAME'));
                return;
            }

            if(width == 0){
                showInputErr('#adPos_dialog_ne_size_width', i18n('ADPOS_INPUT_WARNING_BLANK_WIDTH'));
                return;
            }

            if(height == 0){
                showInputErr('#adPos_dialog_ne_size_height', i18n('ADPOS_INPUT_WARNING_BLANK_HEIGHT'));
                return;
            }

            adPos.name = adPosName;
            adPos.width = width;
            adPos.height = height;
            adPos.default_ad = default_ad;
            adPos.patchs = patchs;
            adPos.metadata.isstartingup = isStartingUp;
            adPos.max_placement_count = maxPlacementCount;
            adPos.visibility = visibility;
            //@formatter:off
            var updateUrl = adsRest + '/videoadp/' + adPos.id + '?user_id=' + my.paas.user_id +
                '&user_type=' + my.paas.user_type +
                '&user_name=' + my.paas.user_name +
                '&access_token=' + my.paas.access_token +
                '&app_key=' + paasAppKey +
                '&timestamp=' + new Date().toISOString();
            //@formatter:on
            $.ajax({
                type: 'PUT',
                async: false,
                url: updateUrl,
                data: JSON.stringify(adPos),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-aqua-sign': getPaaS_x_aqua_sign('PUT', updateUrl)
                }
            }).done(function() {
                self.list.refreshList();
                editDialog.close();
            });
        },

        getAdPosByIndex: function(index){
            return this.adsData && this.adsData[index];
        }

    };

    var adPosKindSubtitle = {
        getList: function() {
            var self = this;
            if (!this.list) {
                var listOpt = {
                    rows: 11,
                    containerId: 'adPos_position_list',
                    titles: [{
                        label: i18n('ADPOS_LIST_TITLE_ID')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_NAME')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_CREATOR')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_FONT_SIZE')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_FONT_COLOR')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_MOVE_STEP')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_MOVE_INTERVAL')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_BG_OPACITY')
                    }, {
                        label: i18n('ADPOS_LIST_TITLE_OPR')
                    }],
                    listType: 1,
                    data: [],
                    styles: {
                        borderColor: 'transparent',
                        borderWidth: 1,
                        titleHeight: 46,
                        titleBg: 'rgb(93,161,192)',
                        titleColor: 'white',
                        cellBg: 'white',
                        evenBg: 'rgb(245,245,245)',
                        cellColor: 'rgb(114,114,114)',
                        footBg: 'white',
                        footColor: 'rgb(121,121,121)',
                        iconColor: 'rgb(93,161,192)',
                        inputBorder: '1px solid rgb(203,203,203)',
                        inputBg: 'white',
                    }
                };
                if(window.AdvSystemType != 'solo'){
                    listOpt.columns = 10;
                    listOpt.titles.unshift({label: i18n('ADPOS_SITE_NAME')});
                    listOpt.styles.columnsWidth = [0.07,0.07,0.09,0.06,0.1,0.06,0.1,0.12,0.07];
                    listOpt.styles.columnsMinWidth = [93,92,114,77,132,81,133,150,90,260];
                    listOpt.styles.ifColumnsWidthAll = true;
                } else {
                    listOpt.columns = 9;
                    listOpt.styles.columnsWidth = [0.08, 0.28, 0.07, 0.09, 0.07, 0.09, 0.12, 0.07];
                }
                this.list = new StyledList(listOpt);

                this.list.getPageData = function(pageNumber) {
                    adSearchText = $('#adPos_search_input').val();
                    var listSelf = this;
                    var listData;
                    var start = (pageNumber - 1) * 11;
                    var end = pageNumber * 11 - 1;
                    var query = '?user_id=' + my.paas.user_id + '&user_type=' + my.paas.user_type;
                    query += '&platform_id=' + my.paas.platform_current_id;
                    query += '&start=' + start;
                    query += '&end=' + end;
                    if(adSearchText){
                        query += '&name=' + adSearchText;
                    }
                    if(filterSites.length > 0){
                        query += '&site_id=' + filterSites.map(function(site){
                          return site.id;
                        }).join(',');
                    }
                    // @formatter:off
                    var queryUrl = adsRest + '/subtitleadp/subtitleadps' + query +
                        '&access_token=' + my.paas.access_token +
                        '&app_key=' + paasAppKey +
                        '&timestamp=' + new Date().toISOString();
                    // @formatter:on
                    addLoadingLayer();
                    $.ajax({
                        url: queryUrl,
                        type: 'GET',
                        async: false,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'x-aqua-sign': getPaaS_x_aqua_sign('GET',queryUrl)
                        },
                        dataType: 'json'
                    }).done(function(data, status, xhr) {
                        var totalCount = xhr.getResponseHeader('x-aqua-total-count');
                        listSelf.onTotalCount(totalCount || 0);
                        self.adsData = data;
                        if(window.AdvSystemType == 'local'){
                            if(data.length > 0){
                              var ids = data.map(function(adp){
                                return adp.ext_id;
                              });
                              var url = dmRoot + '/object_site/adv/adv_placement';
                              url += '?object_id=' + ids.join(',');
                              $.ajax({
                                url: url,
                                async: false,
                                headers: {
                                  'Accept': 'application/json',
                                  'Content-Type': 'application/json',
                                }
                              }).done(function(data){
                                  localAdpSites = data;
                              });
                            }
                        }
                        listData = self.formatListData(data || []);
                    }).always(function(){
                        removeLoadingLayer();
                    });

                    return listData;
                };
            }
            this.list.create();
            return this.list;
        },

        formatListData: function(data) {
            var listData = [];
            for (var i = 0, len = data.length; i < len; i++) {
                var item = data[i];
                var oprView = '<span name="view" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_VIEW') + '</span>';
                var oprEdit = '<span name="edit" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_EDIT') + '</span>';
                var oprDel = '<span name="delete" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_DELETE') + '</span>';
                var oprConnect = '<span name="connect" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_CONNECT') + '</span>';
                var oprDist = '<span name="distribute" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_DIST') + '</span>';
                var oprBindCentral = '<span name="bindcentral" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_BINDCENTRAL') + '</span>';
                var oprUnbindCentral = '<span name="unbindcentral" class="adPos_operation" data-index="' + i + '">' + i18n('ADPOS_OPERATION_UNBINDCENTRAL') + '</span>';
                var rowData = [];
                var oprs = '';
                if(window.AdvSystemType == 'central'){
                    if(item.site_id == window.AdvSelfSiteId){
                        rowData.push({label: window.AdvSelfSiteName + i18n('ADPOS_SITE_SELF_SUFFIX')});
                        oprs = makeMoreOption([oprView, oprEdit, oprConnect, oprDist, oprDel]);
                    } else {
                        rowData.push({label: (adpSiteNames[item.site_id] || '')});
                        oprs = oprView;
                    }
                } else if(window.AdvSystemType == 'local'){
                    if(item.site_id == window.AdvSelfSiteId){
                        rowData.push({label: window.AdvSelfSiteName + i18n('ADPOS_SITE_SELF_SUFFIX')});
                        // var isBindingCentral = false;
                        // var adpSites = localAdpSites[item.ext_id] || [];
                        // $.each(adpSites, function(i, adpsite){
                          // if(adpsite.siteId == window.AdvCentralSiteId){
                            // isBindingCentral = true;
                            // return false;
                          // }
                        // });
                        // oprs = oprEdit + (isBindingCentral ? oprUnbindCentral : oprBindCentral) + oprDist + oprDel;
                        oprs = makeMoreOption([oprView, oprEdit, oprDist, oprDel]);
                    } else {
                        rowData.push({label: (adpSiteNames[item.site_id] || '')});
                        oprs = oprView;
                    }
                } else {
                    oprs = oprView + oprEdit + oprDel;
                }
                Array.prototype.push.apply(rowData,[{
                    label: item.ext_id || ''
                }, {
                    label: item.name || ''
                }, {
                    label: item.user_name || ''
                }, {
                    label: item.font_size != null ? item.font_size : ''
                }, {
                    label: item.colour || ''
                }, {
                    label: item.roll_distance != null ? item.roll_distance : ''
                }, {
                	label: item.roll_speed != null ? item.roll_speed : ''
                }, {
                	label: item.diaphaneity != null ? item.diaphaneity : ''
                }, {
                    label: oprs
                }]);
                listData.push(rowData);
            }
            return listData;
        },

        getCreateDialog: function() {
            var self = this;
            if (!this.createDialog) {
                this.createDialog = new PopupDialog({
                    url: 'content/guang_gao_wei/subtitle_ne_dialog.html',
                    width: 760,
                    height: 522,
                    context: {},
                    callback: function() {
                    	$('#adPos_dialog_ne_title').text(i18n('ADPOS_DIALOG_TITLE_XINJIAN'));
                    	$('#adPos_dialog_ne_submit').text(i18n('ADPOS_DIALOG_SUBMIT_XINJIAN'));
                        // var adaptSelector = getSelector('adPos_dialog_ne_adapt_selector', [{
                            // label: i18n('ADPOS_DIALOG_SELECTOR_ADAPT_RESTRICT'),
                            // value: 0
                        // }, {
                            // label: i18n('ADPOS_DIALOG_SELECTOR_ADAPT_EXTENSABLE'),
                            // value: 1
                        // }]);
                        // adaptSelector.create();
                        // var dfAdSelector = getSelector('adPos_dialog_ne_dfAd_selector', [{
                            // label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_BLANK'),
                            // value: 0
                        // }, {
                            // label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_DEFAULT'),
                            // value: 1
                        // }]);
                        // dfAdSelector.create();
                        var upload = new inputFile(my_aqua);
                        upload.init({
                            selectFileBottom: '#adPos_dialog_subtitle_bg_btn',
                            uploadPath: storage_images_folder
                        }, {
                            _isExistFun: function(){
                            	alert(i18n('ADPOS_IMG_EXIST'));
                            },
                            _getfilenamefun: function(name){
                            	$('#adPos_dialog_ne_bgimg').val(name);
                            	// upload.startuploadFile();
                            },
                            _errorfun: function(){
                            	alert(i18n('ADPOS_IMG_UPLOAD_ERROR'));
                            },
                            _endfun: function(fileName, updateSize, fileSize, fileUrl){
                            	$('#adPos_dialog_ne_bgimg').attr('data-img-url', fileUrl);
                            	$('#adPos_dialog_ne_opacity').attr('disabled', false);
                            	alert(i18n('ADPOS_IMG_UPLOAD_OK'));
                            }
                        });
                        $('#adPos_dialog_ne_submit').on('click', function() {
                            // self.addAdPos(adaptSelector, dfAdSelector);
                            self.addAdPos();
                        });
                        $("#adPos_admaster_check").on('click', function() {
                            var check = $(this);
                            check.toggleClass('adPos_admaster_open');
                            if (!check.hasClass('adPos_admaster_open')) {
                                showAdmasterConfirm(function() {
                                check.addClass('adPos_admaster_open');
                                });
                            }
                        });
                    }

                });
            }
            this.createDialog.open();
            return this.createDialog;
        },

        getEditDialog: function(index) {
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var editDialog = new PopupDialog({
                url: 'content/guang_gao_wei/subtitle_ne_dialog.html',
                width: 760,
                height: 522,
                context: {},
                callback: function() {
                	$('#adPos_dialog_ne_title').text(i18n('ADPOS_DIALOG_TITLE_BIANJI'));
                	$('#adPos_dialog_ne_submit').text(i18n('ADPOS_DIALOG_SUBMIT'));
					 // var adaptSelector = getSelector('adPos_dialog_ne_adapt_selector', [{
                        // label: i18n('ADPOS_adPos_dialog_ne_font_sizeDIALOG_SELECTOR_ADAPT_RESTRICT'),
                        // value: 0
                    // }, {
                        // label: i18n('ADPOS_DIALOG_SELECTOR_ADAPT_EXTENSABLE'),
                        // value: 1
                    // }]);
                    // adaptSelector.create();
                    // adaptSelector.setValue(adPos.adaptation);
                    // var dfAdSelector = getSelector('adPos_dialog_ne_dfAd_selector', [{
                        // label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_BLANK'),
                        // value: 0
                    // }, {
                        // label: i18n('ADPOS_DIALOG_SELECTOR_DFAD_DEFAULT'),
                        // value: 1
                    // }]);
                    // dfAdSelector.create();
                    // dfAdSelector.setValue(adPos.default_ad);
                    $('#adPos_dialog_ne_id').val(adPos.ext_id).attr('disabled', true);
                    $('#adPos_dialog_ne_name').val(adPos.name);
                    // $('#adPos_is_starting_up').prop('checked', (adPos.metadata && adPos.metadata.isstartingup) == '1');
                    $('#adPos_dialog_ne_max_placement_count').val(adPos.max_placement_count);
                    if(adPos.visibility == '1'){
                        $("#adPos_admaster_check").addClass('adPos_admaster_open');
                    }
                    $('#adPos_dialog_ne_font_size').val(adPos.font_size);
                    $('#adPos_dialog_ne_font_color').val(adPos.colour && adPos.colour.replace('#', ''));
                    $('#adPos_dialog_ne_opacity').val(adPos.diaphaneity);
                    $('#adPos_dialog_ne_move_step').val(adPos.roll_distance);
                    $('#adPos_dialog_ne_move_interval').val(adPos.roll_speed);
                    $('#adPos_dialog_ne_bgimg').attr('data-img-url', adPos.background_image_url)
                    	.val(adPos.background_image_url && decodeURIComponent(adPos.background_image_url.slice(adPos.background_image_url.lastIndexOf('/')+1)));
                    adPos.background_image_url && $('#adPos_dialog_ne_opacity').attr('disabled', false);
                    var upload = new inputFile(my_aqua);
                    upload.init({
                        selectFileBottom: '#adPos_dialog_subtitle_bg_btn',
                        uploadPath: storage_images_folder
                    }, {
                        _isExistFun: function(){
                        	alert(i18n('ADPOS_IMG_EXIST'));
                        },
                        _getfilenamefun: function(name){
                        	$('#adPos_dialog_ne_bgimg').val(name);
                        	// upload.startuploadFile();
                        },
                        _errorfun: function(){
                        	alert(i18n('ADPOS_IMG_UPLOAD_ERROR'));
                        },
                        _endfun: function(fileName, updateSize, fileSize, fileUrl){
                        	$('#adPos_dialog_ne_bgimg').attr('data-img-url', fileUrl);
                        	$('#adPos_dialog_ne_opacity').attr('disabled', false);
                        	alert(i18n('ADPOS_IMG_UPLOAD_OK'));
                        }
                    });
                    $('#adPos_dialog_ne_submit').on('click', function() {
                        // self.updateAdPos(adPos, adaptSelector, dfAdSelector, editDialog);
                        self.updateAdPos(adPos, editDialog);
                    });
                    $("#adPos_admaster_check").on('click', function() {
                        var check = $(this);
                        check.toggleClass('adPos_admaster_open');
                        if (!check.hasClass('adPos_admaster_open')) {
                            showAdmasterConfirm(function() {
                            check.addClass('adPos_admaster_open');
                            });
                        }
                    });
                }

            });
            editDialog.open();
            return editDialog;
        },

        getViewDialog: function(index) {
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var dialog = new PopupDialog({
                url: 'content/guang_gao_wei/subtitle_ne_dialog.html',
                width: 760,
                height: 522,
                context: {},
                callback: function() {
                	$('#adPos_dialog_ne_title').text(i18n('ADPOS_DIALOG_TITLE_VIEW'));
                	$('#adPos_dialog_ne_submit').text(i18n('ADPOS_DIALOG_SUBMIT'));
                	$('#adPos_dialog_subtitle_bg_btn').hide();
                	$('#adPos_dialog_ne_cancel').hide();
                    $('#adPos_dialog_ne_id').val(adPos.ext_id).attr('disabled', true);
                    $('#adPos_dialog_ne_name').val(adPos.name).attr('disabled', true);
                    $('#adPos_dialog_ne_max_placement_count').val(adPos.max_placement_count).attr('disabled', true);
                    if(adPos.visibility == '1'){
                        $("#adPos_admaster_check").addClass('adPos_admaster_open');
                    }
                    $('#adPos_dialog_ne_font_size').val(adPos.font_size).attr('disabled', true);
                    $('#adPos_dialog_ne_font_color').val(adPos.colour && adPos.colour.replace('#', '')).attr('disabled', true);
                    $('#adPos_dialog_ne_opacity').val(adPos.diaphaneity).attr('disabled', true);
                    $('#adPos_dialog_ne_move_step').val(adPos.roll_distance).attr('disabled', true);
                    $('#adPos_dialog_ne_move_interval').val(adPos.roll_speed).attr('disabled', true);
                    $('#adPos_dialog_ne_bgimg').attr('data-img-url', adPos.background_image_url)
                    	.val(adPos.background_image_url && decodeURIComponent(adPos.background_image_url.slice(adPos.background_image_url.lastIndexOf('/')+1)))
                    	.attr('placeholder', '');
                    if(adPos.background_image_url){
                        $('#adPos_dialog_ne_bgimg').css({
                            'color': '#3e99ae',
                            'cursor': 'pointer'
                        }).on('click', function(){
                            dialog.close();
                            self.getBgImgView(index);
                        });
                    }
                    $('#adPos_dialog_ne_submit').on('click', function() {
                        dialog.close();
                    });
                }

            });
            dialog.open();
            return dialog;
        },

        getDeleteDialog: function(index) {
            var self = this;
            var adPos = this.adsData && this.adsData[index];
            var deleteDialog = new PopupDialog({
                url: 'content/guang_gao_wei/delete_dialog.html',
                width: 480,
                height: 268,
                context: {},
                callback: function() {
                    $('.adPos_dialog_del_confirm_info').text(i18n('ADPOS_DIALOG_DEL_CONFIRM_INFO') + (adPos.name || ''));
                    $('#adPos_dialog_del_submit').on('click', function() {
                        self.deleteAdPos(adPos);
                        deleteDialog.close();
                    });
                }

            });
            deleteDialog.open();
            return deleteDialog;
        },

        deleteAdPos: function(adPos) {
            //@formatter:off
            var delUrl = adsRest + '/subtitleadp/' + adPos.id + '?user_id=' + my.paas.user_id +
                '&user_type=' + my.paas.user_type +
                '&access_token=' + my.paas.access_token +
                '&app_key=' + paasAppKey +
                '&timestamp=' + new Date().toISOString();
            //@formatter:on
            var self = this;
            $.ajax({
                type: 'DELETE',
                url: delUrl,
                headers: {
                    'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', delUrl)
                }
            }).done(function() {
                self.list.refreshList();
            });
        },

        addAdPos: function(adaptSelector, dfAdSelector) {
            var self = this;
            var adPosId = $('#adPos_dialog_ne_id').val();
            var adPosName = $('#adPos_dialog_ne_name').val();
            // var width = Number($('#adPos_dialog_ne_size_width').val());
            // var height = Number($('#adPos_dialog_ne_size_height').val());
            var num = 1;//Number($('#adPos_dialog_ne_count').val());
            // var adaptation = adaptSelector.getValue();
            var default_ad = 1;//dfAdSelector.getValue();
            var isStartingUp = 0;//$('#adPos_is_starting_up').prop('checked') ? '1' : '0';
            // var playMode = $('#adPos_dialog_tuwen_ne_play_mode').val();
            // var playDelay = Number($('#adPos_dialog_tuwen_ne_play_delay').val());
            var maxPlacementCount = Number($('#adPos_dialog_ne_max_placement_count').val());
            var visibility = $('#adPos_admaster_check').hasClass('adPos_admaster_open') ? '1' : '0';
            var fontSize = Number($('#adPos_dialog_ne_font_size').val());
            var fontColor = $('#adPos_dialog_ne_font_color').val();
            fontColor = fontColor ? '#' + fontColor : '';
            var diaphaneity = Number($('#adPos_dialog_ne_opacity').val());
            var moveStep = Number($('#adPos_dialog_ne_move_step').val());
            var moveInterval = Number($('#adPos_dialog_ne_move_interval').val());
            var backgroundImageUrl = $('#adPos_dialog_ne_bgimg').attr('data-img-url');
            if(adPosId == ''){
                showInputErr('#adPos_dialog_ne_id', i18n('ADPOS_INPUT_WARNING_BLANK_ID'));
                return;
            }

            if(adPosName == ''){
                showInputErr('#adPos_dialog_ne_name', i18n('ADPOS_INPUT_WARNING_BLANK_NAME'));
                return;
            }

            var adPos = {
                platform_id: my.paas.platform_current_id,
                ext_id: adPosId,
                name: adPosName,
                num: num,
                default_ad: default_ad,
                max_placement_count: maxPlacementCount,
                visibility: visibility,
                font_size: fontSize,
                colour: fontColor,
                roll_speed: moveInterval,
                roll_distance: moveStep,
                diaphaneity: diaphaneity,
                background_image_url: backgroundImageUrl,
                metadata: {
                	isstartingup: isStartingUp,
                	type: 'subtitle',
                }
            };
            var isExist = true;
            // @formatter:off
            var checkUrl = adsRest + '/imgadp/check/' + adPosId + '?user_id=' + my.paas.user_id +
                    '&user_type=' + my.paas.user_type +
                    '&app_key=' + paasAppKey +
                    '&access_token=' + my.paas.access_token +
                    '&timestamp=' + new Date().toISOString();
            // @formatter:on
            $.ajax({
                url: checkUrl,
                type: 'GET',
                async: false,
                headers: {
                    'x-aqua-sign': getPaaS_x_aqua_sign('GET',checkUrl)
                }
            }).done(function(data, ts, xhr) {
                if (xhr.status == 200) {
                    isExist = false;
                }
            }).fail(function(xhr, ts, err) {
                if (xhr.status == 409) {
                    isExist = true;
                }
            });

            if (isExist) {
                showInputErr('#adPos_dialog_ne_id', i18n('ADPOS_DIALOG_WARNING_EXIST_EXT_ID'));
                return;
            }
            // @formatter:off
            var createUrl = adsRest + '/subtitleadp?user_id=' + my.paas.user_id +
                '&user_type=' + my.paas.user_type +
                '&user_name=' + my.paas.user_name +
                '&access_token=' + my.paas.access_token +
                '&app_key=' + paasAppKey +
                '&timestamp=' + new Date().toISOString();
            // @formatter:on
            $.ajax({
                url: createUrl,
                type: 'POST',
                async: false,
                data: JSON.stringify(adPos),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-aqua-sign': getPaaS_x_aqua_sign('POST',createUrl)
                }
            }).done(function(data) {
                self.createDialog.close();
                if(window.AdvSystemType == 'local'){
                  self.bindToCentral(data);
                }
                self.list.update();
            });
        },

        bindToCentral: function(data){
          //关联中央之前，因只返回广告位id，需先获取广告位的数据如site_id以关联接口调用
          //图文、贴片情形相同
          var url = adsRest + '/subtitleadp/' + data.id;
          url += '?user_id=' + my.paas.user_id;
          url += '&access_token=' + my.paas.access_token;
          url += '&app_key=' + paasAppKey;
          url += '&timestamp=' + new Date().toISOString();

          $.ajax({
            url: url,
            type: 'GET',
            async: false,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'x-aqua-sign': getPaaS_x_aqua_sign('GET',url)
            }
          }).done(function(adp){
            AdPosition.bindToCentral(adp);
          });
        },

        updateAdPos: function(adPos, editDialog) {
            var self = this;
            var adPosName = $('#adPos_dialog_ne_name').val();
            // var width = Number($('#adPos_dialog_ne_size_width').val());
            // var height = Number($('#adPos_dialog_ne_size_height').val());
            // var num = Number($('#adPos_dialog_ne_count').val());
            // var adaptation = adaptSelector.getValue();
            // var default_ad = dfAdSelector.getValue();
            // var isStartingUp = $('#adPos_is_starting_up').prop('checked') ? '1' : '0';
            // var playMode = $('#adPos_dialog_tuwen_ne_play_mode').val();
            // var playDelay = Number($('#adPos_dialog_tuwen_ne_play_delay').val());
            var maxPlacementCount = Number($('#adPos_dialog_ne_max_placement_count').val());
            var visibility = $('#adPos_admaster_check').hasClass('adPos_admaster_open') ? '1' : '0';
            var fontSize = Number($('#adPos_dialog_ne_font_size').val());
            var fontColor = $('#adPos_dialog_ne_font_color').val();
            fontColor = fontColor ? '#' + fontColor : '';
            var diaphaneity = Number($('#adPos_dialog_ne_opacity').val());
            var moveStep = Number($('#adPos_dialog_ne_move_step').val());
            var moveInterval = Number($('#adPos_dialog_ne_move_interval').val());
            var backgroundImageUrl = $('#adPos_dialog_ne_bgimg').attr('data-img-url');
            if(adPosName == ''){
                showInputErr('#adPos_dialog_ne_name', i18n('ADPOS_INPUT_WARNING_BLANK_NAME'));
                return;
            }

            adPos.name = adPosName;
            adPos.max_placement_count = maxPlacementCount;
            adPos.visibility = visibility;
            adPos.font_size = fontSize;
            adPos.colour = fontColor;
            adPos.diaphaneity = diaphaneity;
            adPos.roll_speed = moveInterval;
            adPos.roll_distance = moveStep;
            adPos.background_image_url = backgroundImageUrl;
            //@formatter:off
            var updateUrl = adsRest + '/subtitleadp/' + adPos.id + '?user_id=' + my.paas.user_id +
                '&user_type=' + my.paas.user_type +
                '&user_name=' + my.paas.user_name +
                '&access_token=' + my.paas.access_token +
                '&app_key=' + paasAppKey +
                '&timestamp=' + new Date().toISOString();
            //@formatter:on
            $.ajax({
                type: 'PUT',
                async: false,
                url: updateUrl,
                data: JSON.stringify(adPos),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-aqua-sign': getPaaS_x_aqua_sign('PUT',updateUrl)
                }
            }).done(function() {
                self.list.refreshList();
                editDialog.close();
            });
        },

        getBgImgView: function(index){
            var self = this;
            var adPos = self.adsData && self.adsData[index];
            if(!adPos.background_image_url){
            	openMsgDialog(i18n('ADPOS_SUBTITLE_NOIMG_PREVIEW'));
            	return;
            }
            var img = new Image();
            img.onload = function(){
            	console.log(img.width, img.height);
            	var app = new PreviewModel();
            	app.previewIMG({
            		width: img.width,
            		height: img.height,
            		url: adPos.background_image_url
            	},{});
            };
            img.src = my_aqua.getDownloadFileURL(adPos.background_image_url);
        },

        getAdPosByIndex: function(index){
            return this.adsData && this.adsData[index];
        }

    };

    var AdPosition = {
        init: function() {
            this.listenEvents();
            my_aqua.init(storage_username, storage_password, storage_domain);
			this.getSiteList();
            if(window.AdvSystemType == 'central'){
              $('#adPos_site_filter').show();
            }
			this.setSiteFilter();
        },

        listenEvents: function() {
            var self = this;
            $('#adPos_page_options').on('click', '.panel_page_option', function() {
                var $clObj = $(this);
                var clObj = this;
                $('.panel_page_option_focus').each(function() {
                    if (clObj !== this) {
                        $(this).removeClass('panel_page_option_focus');
                    }
                });
                if (!$clObj.hasClass('panel_page_option_focus')) {
                    $clObj.addClass('panel_page_option_focus');
                }
                self.onOptionSelect($clObj.attr('name'));
            });
            $('#adPos_search_input_icon').on('click', function() {
                self.search();
            });
            $('#adPos_search_input').on('keyup', function(ev){
                if(ev.keyCode === 13){
                    self.search();
                }
            });
            $('#adPos_addPosition').on('click', function() {
                self.showCreateDialog();
            });
            $('#adPos_position_list').on('click', '.adPos_operation', function() {
                var $action = $(this);
                var index = $action.attr('data-index');
                var action = $action.attr('name');
                var ext_id = self.delegate.adsData[index] && self.delegate.adsData[index].ext_id;
                switch(action){
                case 'edit':
                    var inUsePolicy = getInUsePolicy({type:'ad_position', mode:'update', value:ext_id});
                    var allowed = !(inUsePolicy && inUsePolicy.length > 0);
                    if(allowed){
                        openMsgDialog(i18n('MSG_AD_POSITION_UPDATE_ASK'), function(){
                            self.showEditDialog(index);
                        })
                    } else {
                        confirmToContinue(i18n('MSG_AD_POSITION_UPDATE_CONTINUE'), function(){
                            self.showEditDialog(index);
                        })
                    }
                    break;
                case 'delete':
                    showPolicyBindingOperatingMsg({type:'ad_position', mode:'delete', value:ext_id}, function(){
                    	self.showDeleteDialog(index);
                    });
                    break;
                case 'view':
                    self.showViewDialog(index);
                    break;
                case 'connect':
                    self.connectAdPos(index);
                    break;
                case 'distribute':
                    self.viewDistributeSites(index);
                    break;
                case 'bindcentral':
                    self.bindAdpCentral(index);
                    break;
                case 'unbindcentral':
                    self.unbindAdpCentral(index);
                    break;
                default:
                    break;
                }
            }).on('click', '.show_more_option', function(){
                $(this).children('.more_option_panel').toggle();
            }).on('mouseleave', '.more_option_panel', function(){
                $(this).hide();
            });
            $(MyPage.page).on('resize', function() {
                self.list && self.list.resize();
            });
        },

        onOptionSelect: function(option) {
            if (this.currOption !== option) {
                this.currOption = option;
                switch(this.currOption) {
                case 'adPosKindTuwen':
                    this.delegate = adPosKindTuwen;
                    break;
                case 'adPosKindTiepian':
                    this.delegate = adPosKindTiepian;
                    break;
                case 'adPosKindSubtitle':
                	this.delegate = adPosKindSubtitle;
                	break;
                }
                this.getList();
            }
        },

        getList: function() {
            this.list = this.delegate.getList();
        },

        showCreateDialog: function() {
            this.delegate && this.delegate.getCreateDialog();
        },

        showEditDialog: function(index) {
            this.delegate && this.delegate.getEditDialog(index);
        },

        showDeleteDialog: function(index) {
            this.delegate && this.delegate.getDeleteDialog(index);
        },

        showViewDialog: function(index){
            this.delegate && this.delegate.getViewDialog(index);
        },

        search: function(){
            this.list.update();
        },

        getAdPosByIndex: function(index){
            return this.delegate && this.delegate.getAdPosByIndex(index);
        },

        connectAdPos: function(index){
            openAdPosConnect('#ad-connect-layer', this.getAdPosByIndex(index));
        },

        viewDistributeSites: function(index){
            viewDistributeState('#ad-disites-layer', 'adposition', this.getAdPosByIndex(index));
        },

        getSiteList: function(){
          $.ajax({
            async: false,
            url: dmRoot + '/site',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).done(function(data) {
            data = $.makeArray(data);
            adpSites = data;
            data.forEach(function(site){
              adpSiteNames[site.id] = site.name;
            });
          });
        },

        setSiteFilter: function(){
          var self = this;
          var filter = getCombiSelector({
            label: i18n('ADPOS_SITE_SELECTOR'),
            container: '#adPos_site_filter',
            channels: adpSites.map(function(site){
              return {
                label: site.name,
                site: site,
              };
            }),
            onChange: function(channels){
              filterSites = channels.map(function(channel){
                return channel.site;
              });
              self.list.update();
            }
          });
          filter.create();
        },

        bindAdpCentral: function(index){
          if(!window.AdvCentralSiteId){
            alert(i18n('ADPOS_CNECT_NO_CENTRAL_ID'));
            return false;
          }
          var self = this;
          var adp = this.getAdPosByIndex(index);
          var dialog = new PopupDialog({
            url: 'content/utils/msg_dialog.html',
            width: 480,
            height: 268,
            context: {},
            callback: function() {
              $('#utils_dialog_info_title').text(i18n('ADPOS_CNECT_DIALOG_TCN'));
              $('#utils_dialog_info_msg').text(i18n('ADPOS_CNECT_DIALOG_MSGCNPRE') + adp.name + i18n('ADPOS_CNECT_DIALOG_MSGCNSUF'));
              $('#utils_dialog_info_submit').on('click', function() {
                var url = dmRoot + '/object/adv/adv_placement/' + adp.ext_id;
                url += '?site_id=' + adp.site_id;
                $.ajax({
                  type: 'PUT',
                  url: url,
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  data: JSON.stringify({
                    site: [window.AdvCentralSiteId]
                  })
                }).done(function(){
                  self.list.refreshList();
                }).fail(function(xhr){
                  if(xhr.status == 204){
                    self.list.refreshList();
                  }
                });
                dialog.close();
              });
            }
          });
          dialog.open();
        },

        bindToCentral: function(adp){
          var url = dmRoot + '/object/adv/adv_placement/' + adp.ext_id;
          url += '?site_id=' + adp.site_id;
          $.ajax({
            type: 'PUT',
            url: url,
            async: false,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            data: JSON.stringify({
              site: [window.AdvCentralSiteId]
            })
          }).done(function() {

          }).fail(function(xhr) {
            if (xhr.status == 204) {

            }
          });
        },

        unbindAdpCentral: function(index){
          if(!window.AdvCentralSiteId){
            alert(i18n('ADPOS_CNECT_NO_CENTRAL_ID'));
            return false;
          }
          var self = this;
          var adp = this.getAdPosByIndex(index);
          var dialog = new PopupDialog({
            url: 'content/utils/msg_dialog.html',
            width: 480,
            height: 268,
            context: {},
            callback: function() {
              $('#utils_dialog_info_title').text(i18n('ADPOS_CNECT_DIALOG_TUCN'));
              $('#utils_dialog_info_msg').text(i18n('ADPOS_CNECT_DIALOG_MSGUCNPRE') + adp.name + i18n('ADPOS_CNECT_DIALOG_MSGUCNSUF'));
              $('#utils_dialog_info_submit').on('click', function() {
                var url = dmRoot + '/object_site/adv/adv_placement/' + adp.ext_id;
                url += '?site_id=' + window.AdvCentralSiteId;
                $.ajax({
                  type: 'DELETE',
                  url: url,
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
                }).done(function(){
                  self.list.refreshList();
                });
                dialog.close();
              });
            }
          });
          dialog.open();
        }
    };

    window.AdPosition = AdPosition;
    AdPosition.init();
    $('#adPos_adKind_tuwen').click();

}(jQuery));
