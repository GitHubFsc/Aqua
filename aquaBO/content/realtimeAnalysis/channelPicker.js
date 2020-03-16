// @formatter:off
(function(JS){
// @formatter:on

    var analysis = JS.namespace('auAnalysis');

    var ChannelPicker = analysis.ChannelPicker = function(options) {
        this.changeListeners = [];
        this.singleCheck = options && options.singleCheck;
        this.noUpdate = options && options.noUpdate;
        this.noProgram = options && options.noProgram;
        this.channels = options && options.channels;
        this.dateList = options && options.dateList;
        this.currDate = uiUtil.getDateToStr(new Date()).substr(0, 10);
        this.init();
    };

    ChannelPicker.updateClock = null;

    ChannelPicker.prototype = {
        init: function() {

            this.channelPrograms = null;
            if(typeof this.dateList === 'undefined'){
                this.dateList = [];
                this.dateList.push(uiUtil.getDateToStr(new Date()).substr(0, 10));
            }

            if ( typeof this.channels == 'undefined') {
                this.channels = this.getChannelList();
                //this.channels = this.getAquaChannelList();
            }else{
                this.channels = this.channels.map(function(e, i){
                    e.checked = false;
                    e.tmpChecked = false;
                    return e;
                });
            }
            if (!this.noUpdate) {
                this.auMax = 0;
                this.updateTime = REALTIME_UPDATE_INTERVAL || 1000;
                this.refreshTime = REALTIME_REORDER_INTERVAL || 60000;
                this.updateNeedSort = true;
                this.updating = false;
                this.updateLmt = Math.floor(this.refreshTime / this.updateTime);
                this.updateCount = 0;
                this.getChannelStatistic();
            }
        },

        setDateList: function(list) {
            this.dateList = list;
        },

        setChannelStatic: function(list){
            this.channelStatic = list;
            this.fetchIndex = 0;
        },

        getEPGSchedule: function() {
            if (!this.noProgram) {
                this.channelStatic = [];
                for (var i = 0, len = this.channels.length; i < len; i++) {
                    this.channelStatic.push(this.channels[i]);
                }
                this.getEPGByStep();
                //this.getEPGEntriesXML();
                //this.getEPGEntriesJSON();
                //this.getTestEPG();
            }
        },

        getEPGByStep: function() {
            var self = this;
            // @formatter:off
            var epgUrl = EPG_INTERFACE_ADDRESS + EPG_INTERFACE_PATH +
                    '?attribute=stb_list_entry' +
                    this.getEPGQuery({
                       parent_HUID: EPG_PARENT_HUID,
                       depth: '1'
                    }, false);
            // @formatter:on
            jQuery.ajax({
                url: epgUrl,
                type: 'GET',
                dataType: 'xml',
            }).done(function(xmlDoc) {
                self.gotChannelEntries(xmlDoc);
            });
        },

        gotChannelEntries: function(xmlDoc) {
            this.channelHUIDs = {};
            var self = this;
            jQuery(xmlDoc).find('ListOfEntry').each(function(i, item) {
                jQuery(item).children().each(function(j, jtem) {
                    var $channel = jQuery(jtem);
                    //var channelName = $channel.attr('entryName');
                    var channelId = $channel.find('MetaData[mdName="channelID"]').text();
                    channelId = parseInt(channelId, 10);
                    var hUID = $channel.attr('hierarchyUID');
                    self.channelHUIDs[channelId] = hUID;
                });
            });

            jQuery.each(this.channelStatic, function(k, ktem) {
                var channelId = ktem.channelid;
                if ( channelId in self.channelHUIDs) {
                    ktem.hierarchyUID = self.channelHUIDs[channelId];
                }
            });
            this.fetchIndex = 0;
            this.getChannelPrograms();
        },

        getChannelPrograms: function() {
            var self = this;
            var channel = this.channelStatic[this.fetchIndex];
            this.fetchIndex += 1;
            if (channel && channel.hierarchyUID) {
                var programsGot = true;
                var programs = channel.programs;
                if(programs){
                    this.dateList.forEach(function(de, di){
                        if(!(programs[de])){
                            programsGot = false;
                        }
                    });
                } else {
                    programsGot = false;
                }
                if(programsGot){
                    this.getChannelPrograms();
                    return;
                }

                // @formatter:off
                var epgUrl = EPG_INTERFACE_ADDRESS + EPG_INTERFACE_PATH +
                    '?attribute=stb_list_entry' +
                    this.getEPGQuery({
                        parent_HUID: channel.hierarchyUID,
                        depth: '1',
                        target_type: '2',
                        source_HUID: EPG_PARENT_HUID
                    }, false);
                // @formatter:on
                jQuery.ajax({
                    url: epgUrl,
                    type: 'GET',
                    dataType: 'xml',
                }).done(function(xmlDoc) {
                    self.gotChannelDates(xmlDoc, channel);
                }).fail(function() {
                    self.getChannelPrograms();
                });
            } else if (channel) {
                this.getChannelPrograms();
            } else {
                this.onLoadPrograms();
            }
        },

        onLoadPrograms: function(){

        },

        gotChannelDates: function(xmlDoc, channel) {
            var self = this;
            var dates = jQuery(xmlDoc).find('ListOfEntry').children('Folder');
            if (dates.length > 0) {
                var _dateList = [];
                dates.each(function(i, item) {
                    var $date = jQuery(item);
                    var date = $date.attr('entryName');
                    var dHUID = $date.attr('hierarchyUID');
                    if(self.dateList.indexOf(date) > -1){
                        _dateList.push({
                            date: date,
                            hierarchyUID: dHUID
                        });
                    }
                });
                this.dateFetchList = _dateList;
                this.dateFetchIndex = 0;
                this.getChannelDateSchedule(channel);
            } else {
                this.getChannelPrograms();
            }
        },

        getChannelDateSchedule: function(channel){
            var self = this;
            var date = this.dateFetchList[this.dateFetchIndex];
            this.dateFetchIndex += 1;

            if(date && date.hierarchyUID){
                var dateStr = date.date;
                if(channel && channel.programs && channel.programs[dateStr]){
                    this.getChannelDateSchedule(channel);
                    return;
                }

                // @formatter:off
                var epgUrl = EPG_INTERFACE_ADDRESS + EPG_INTERFACE_PATH +
                        '?attribute=stb_list_entry' +
                        this.getEPGQuery({
                            parent_HUID: date.hierarchyUID,
                            depth: '1',
                            target_type: '2',
                            source_HUID: EPG_PARENT_HUID
                        }, false);
                // @formatter:on
                jQuery.ajax({
                    url: epgUrl,
                    type: 'GET',
                    dataType: 'xml',
                }).done(function(xmlDoc) {
                    self.gotChannelDateSchedule(xmlDoc, dateStr, channel);
                }).always(function(){
                    self.getChannelDateSchedule(channel);
                });
            }else if(date){
                this.getChannelDateSchedule(channel);
            }else {
                this.getChannelPrograms();
            }
        },

        gotChannelDateSchedule: function(xmlDoc, date, channel) {
            var programs = jQuery(xmlDoc).find('ListOfEntry').children('Program');
            var prgList = [];
            programs.each(function(l, ltem) {
                var prgName = jQuery(ltem).attr('entryName');
                var schedule = jQuery(ltem).children('Schedule').first();
                var begin = jQuery(schedule).attr('startTime');
                var end = jQuery(schedule).attr('endTime');
                prgList.push({
                    programName: prgName,
                    startTime: begin,
                    endTime: end
                });
            });
            if(!channel.programs){
                channel.programs = {};
            }
            channel.programs[date] = prgList;
        },

        getEPGEntriesXML: function() {
            var self = this;
            // @formatter:off
            var epgUrl = EPG_INTERFACE_ADDRESS + EPG_INTERFACE_PATH +
				    '?attribute=stb_list_entry' +
				    this.getEPGQuery({
					   parent_HUID: EPG_PARENT_HUID,
					   depth: '3'
				    }, false);
		  // @formatter:on
            jQuery.ajax({
                url: epgUrl,
                type: 'GET',
                dataType: 'xml',
            }).done(function(xmlDoc) {
                self.parseXMLListEntries(xmlDoc);
            });
        },

        getEPGEntriesJSON: function() {
            var self = this;
            // @formatter:off
            var epgUrl = EPG_INTERFACE_ADDRESS + EPG_INTERFACE_PATH +
                    '?attribute=json_libs_stb_list_entry' +
                    this.getEPGQuery({
                       parent_HUID: EPG_PARENT_HUID,
                       depth: '1'
                    }, false);
          // @formatter:on
            jQuery.ajax({
                url: epgUrl,
                type: 'GET',
                dataType: 'json',
            }).done(function(data) {
                self.parseJSONListEntries(data && data.DataArea && data.DataArea.ListOfEntry);
            });
        },

        getTestEPG: function() {
            var self = this;
            var elUrl = 'content/realtimeAnalysis/epgEL.xml';
            jQuery.ajax({
                url: elUrl,
                type: 'GET',
                dataType: 'xml'
            }).done(function(xmlDoc) {
                self.parseJSONListEntries(xmlDoc);
            }).fail(function() {

            });
        },

        parseXMLListEntries: function(xmlDoc) {
            this.channelPrograms = {};
            var self = this;
            jQuery(xmlDoc).find('ListOfEntry').each(function(i, item) {
                jQuery(item).children('Folder').each(function(j, jtem) {
                    //var channelName = jQuery(jtem).attr('entryName');

                    jQuery(jtem).children('Folder').each(function(k, ktem) {
                        var date = jQuery(ktem).attr('entryName');
                    });
                });
            });
        },

        parseJSONListEntries: function(list) {
            var self = this;
            if (Array.isArray(list)) {
                for (var i = 0, max = list.length; i < max; i++) {
                    var entry = list[i];
                    //var channelName = entry.ListOfMetaData.channelName;
                    for (var j = 0, jMax = this.channels.length; j < jMax; j++) {
                        var channel = this.channels[j];
                        // if (channelName === channel.channelname) {
                            // channel.hierarchyUID = entry.tagAttribute.hierarchyUID;
                            // channel.localEntryUID = entry.tagAttribute.localEntryUID;
                            // channel.parentHUID = entry.tagAttribute.parentHUID;
                            // channel.sourceHUID = entry.tagAttribute.sourceHUID;
                        // }
                    }
                }
            }
        },

        getEPGQuery: function(option, debug) {
            if ( typeof option == 'undefined') {
                return '';
            }

            // @formatter:off
            var conf = ['parent_HUID', 'depth', 'query_mode', 'without_hierarchy_info', 'filter_mode',
				    'search_script', 'order_script', 'page_no', 'page_size', 'entry_type',
				    'home_UID', 'device_UID', 'need_associated_asset', 'locale', 'product_type',
				    'target_type', 'source_HUID', 'threshold', 'is_qa', 'use_cache'],
				    query = '',
				    len = conf.length,
				    i,
				    item;
		    // @formatter:on
            for ( i = 0; i < len; i++) {
                item = conf[i];
                if (option && option[item]) {
                    query += ('&' + item + '=' + option[item]);
                } else if (debug) {
                    query += ('&' + item + '=');
                }
            }

            return query;
        },

        getAquaChannelList: function(){
            var channels;

            jQuery.ajax({
                type: 'GET',
                url: CHANNEL_LIST_FILE,
                dataType: 'json',
                async: false,
                headers: uiUtil.getAquaXhrHeaders('GET', CHANNEL_LIST_FILE, 'application/cdmi-object')
            }).done(function(data) {
                channels = data && data.metadata && data.metadata.channels;
            });

            if (!channels)
                return [];

            var list = channels.map(function(e, i) {
                var item = {};
                var meta = e;
                item.channelid = parseInt(meta && meta.channelid, 10);
                item.order = parseInt(item.channelid, 10);
                item.label = meta && meta.channelname || '';
                item.py = window.PY.changeToPy(item.label);
                return item;
            });

            return list;
        },

        getChannelList: function() {
            var channels;

            jQuery.ajax({
                type: 'GET',
                url: EPG_INTERFACE_ADDRESS + EPG_CHANNEL_LIST_PATH +
                    '?attribute=json_libs_clu_get_region_channel_group&region_id=' +
                    EPG_REGION_ID + '&channel_type=' + EPG_CHANNEL_TYPE,
                dataType: 'json',
                async: false
            }).done(function(data) {
                channels = data && data.DataArea && data.DataArea.ListOfChannel;
            });

            if (!channels)
                return [];

            var list = channels.map(function(e, i) {
                var item = {};
                var meta = e && e.tagAttribute;
                item.channelid = parseInt(meta && meta.channelID, 10);
                item.order = parseInt(item.channelid, 10);
                item.label = meta && meta.channelName || '';
                item.py = window.PY.changeToPy(item.label);
                return item;
            });

            return list;
        },

        setUpdate: function() {
            if (ChannelPicker.updateClock) {
                clearInterval(ChannelPicker.updateClock);
                ChannelPicker.updateClock = null;
            }

            var self = this;
            ChannelPicker.updateClock = setInterval(function() {
                self.updateChannels();
            }, this.updateTime);
        },

        updateChannels: function() {
            if (document.getElementById('channel_realtime_content_container')) {
                this.getChannelStatistic();
            } else if (ChannelPicker.updateClock) {
                clearInterval(ChannelPicker.updateClock);
                ChannelPicker.updateClock = null;
            }
        },

        getChannelStatistic: function() {
            this.updateCount += 1;
            if (this.updateCount > this.updateLmt) {
                this.updateNeedSort = true;
                this.updateCount = 0;
            }
            if (this.updating)
                return;
            this.updating = true;
            var self = this;
            var Url = aquapaas_host + '/aquapaas/rest/multiapp/channel/realtime/statistics';
            Url += '?app_key=' + paasAppKey;
            Url += '&timestamp=' + new Date().toISOString();
            jQuery.ajax({
                url: Url,
                type: 'GET',
                headers: {
                    'x-aqua-sign': getPaaS_x_aqua_sign('GET', Url)
                }
            }).done(function(data) {
                var channelsInfo = data && data.statistics;
                if (!channelsInfo)
                    return;
                self.auMax = 0;
                for (var i = 0, max = self.channels.length; i < max; i++) {
                    var oldInfo = self.channels[i];
                    for (var j = 0, jMax = channelsInfo.length; j < jMax; j++) {
                        var newInfo = channelsInfo[j];
                        if (oldInfo.channelid === parseInt(newInfo.channel_id, 10)) {
                            oldInfo.streamIn = parseInt(newInfo['in'], 10);
                            oldInfo.streamOut = parseInt(newInfo['out'], 10);
                            oldInfo.auRate = parseFloat(newInfo['rating']) / 100;
                            oldInfo.auNum = parseInt(newInfo['online'], 10);

                            if (oldInfo.auNum > self.auMax) {
                                self.auMax = oldInfo.auNum;
                            }
                            if (oldInfo.streamIn > self.auMax) {
                                self.auMax = oldInfo.streamIn;
                            }
                            if (oldInfo.streamOut > self.auMax) {
                                self.auMax = oldInfo.streamOut;
                            }
                        }
                    }
                    var programs = oldInfo.programs && oldInfo.programs[self.currDate] || [];
                    for (var k = 0, kMax = programs.length; k < kMax; k++) {
                        var now = (new Date()).getTime();
                        var program = programs[k];
                        var prgStartTime = uiUtil.getStrToDate(program.startTime).getTime();
                        var prgEndTime = uiUtil.getStrToDate(program.endTime).getTime();
                        if (now >= prgStartTime && now <= prgEndTime) {
                            oldInfo.currProgram = program.programName;
                            break;
                        }
                    }
                }

                if (self.updateNeedSort) {
                    self.updateNeedSort = false;
                    self.channels.sort(function(a, b) {
                        return b.auNum - a.auNum;
                    });

                    for (var k = 0, kMax = self.channels.length; k < kMax; k++) {
                        self.channels[k].rank = k + 1;
                    }
                }

                self.onUpdate();
                self.updating = false;
            }).fail(function() {
                self.updating = false;
            });
        },

        onUpdate: function() {

        },

        addChangeListener: function(func) {
            if (this.changeListeners.indexOf(func) == -1) {
                this.changeListeners.push(func);
                return true;
            }
            return false;
        },

        removeChangeListener: function(func) {
            var tmpListeners = [];
            for (var i = 0, max = this.changeListeners.length; i < max; i++) {
                var listener = this.changeListeners[i];
                if (func !== listener) {
                    tmpListeners.push(listener);
                }
            }
            this.changeListeners = tmpListeners;
        },

        notifyChange: function() {
            for (var i = 0, max = this.changeListeners.length; i < max; i++) {
                var listener = this.changeListeners[i];
                if ( typeof listener == 'function') {
                    listener(this.pickerContainer);
                }
            }
        },

        displayColumns: 4,

        displayStyles: {
            textColor: 'rgb(121,121,121)',
            BgColor: 'transparent',
            textFocus: 'white',
            BgFocus: 'rgb(147,207,238)',
            itemHeight: '30px',
            fontSize: '14px',
            borderSpacing: '20px 5px',
        },

        filters: [{
            label: '全部',
            value: 'ALL',
            colSpan: 2,
            weight: 'default'
        }, {
            label: 'A',
            value: 'A'
        }, {
            label: 'B',
            value: 'B'
        }, {
            label: 'C',
            value: 'C'
        }, {
            label: 'D',
            value: 'D'
        }, {
            label: 'E',
            value: 'E'
        }, {
            label: 'F',
            value: 'F'
        }, {
            label: 'G',
            value: 'G'
        }, {
            label: 'H',
            value: 'H'
        }, {
            label: 'I',
            value: 'I'
        }, {
            label: 'J',
            value: 'J'
        }, {
            label: 'K',
            value: 'K'
        }, {
            label: 'L',
            value: 'L'
        }, {
            label: 'M',
            value: 'M'
        }, {
            label: 'N',
            value: 'N'
        }, {
            label: 'O',
            value: 'O'
        }, {
            label: 'P',
            value: 'P'
        }, {
            label: 'Q',
            value: 'Q'
        }, {
            label: 'R',
            value: 'R'
        }, {
            label: 'S',
            value: 'S'
        }, {
            label: 'T',
            value: 'T'
        }, {
            label: 'U',
            value: 'U'
        }, {
            label: 'V',
            value: 'V'
        }, {
            label: 'W',
            value: 'W'
        }, {
            label: 'X',
            value: 'X'
        }, {
            label: 'Y',
            value: 'Y'
        }, {
            label: 'Z',
            value: 'Z'
        }],

        getPicker: function() {
            var self = this;
            var chPickerCont = document.createElement('div');
            chPickerCont.className = 'au_analysis_channel_picker';
            var pickerSwitcher = document.createElement('div');
            pickerSwitcher.className = 'au_analysis_channel_picker_switcher';

            var jqChPicker = jQuery(chPickerCont);
            jqChPicker.append(pickerSwitcher);

            this.pickerSwitcher = new StyledSwitcher({
                elements: this.filters,
                container: pickerSwitcher,
                styles: {
                    borderRadius: '0px'
                }
            });

            var channelDisplay = document.createElement('div');
            channelDisplay.className = 'au_analysis_channel_picker_display';
            jqChPicker.append(channelDisplay);

            this.channelsDisplay = jQuery(channelDisplay);

            this.pickerSwitcher.onChange = function(filter) {
                self.filt(filter);
            };

            this.pickerSwitcher.create();

            var cancelBtn = document.createElement('p');
            jQuery(cancelBtn).addClass('au_analysis_channel_picker_cancel_button').text('取消').click(function() {
                self.cancel();
            });

            var submitBtn = document.createElement('p');
            jQuery(submitBtn).addClass('au_analysis_channel_picker_submit_button').text('确定').click(function() {
                self.submit();
            });

            var resetBtn = document.createElement('p');
            jQuery(resetBtn).addClass('au_analysis_channel_picker_reset_button').text('重置').click(function() {
                self.reset();
            });

            jqChPicker.append(resetBtn).append(cancelBtn).append(submitBtn);

            this.pickerContainer = chPickerCont;
            return chPickerCont;
        },

        filt: function(filterValue) {
            this.displayChannels = [];
            if (filterValue === 'ALL') {
                for (var i = 0, max = this.channels.length; i < max; i++) {
                    this.displayChannels.push(this.channels[i]);
                }
            } else {
                for (var i = 0, max = this.channels.length; i < max; i++) {
                    var channel = this.channels[i];
                    if (filterValue.toLowerCase() === channel.py.substr(0, 1).toLowerCase()) {
                        this.displayChannels.push(channel);
                    }
                }
            }

            this.displayChannels.sort(function(a, b) {
                return a.order - b.order;
            });
            this.fillDisplay();
        },

        fillDisplay: function() {
            var self = this;
            var displayTable = document.createElement('table');
            var jqDisplayTable = jQuery(displayTable).css({
                position: 'relative',
                color: this.displayStyles.textColor,
                width: '100%',
                tableLayout: 'fixed',
                textAlign: 'center',
                fontSize: this.displayStyles.fontSize,
                'border-collapse': 'separate',
                'border-spacing': this.displayStyles.borderSpacing,
                backgroundColor: this.displayStyles.BgColor,
            }).attr({
                'cellpadding': 0
            });

            var rowNum = Math.ceil(this.displayChannels.length / this.displayColumns);

            this.displayItems = [];
            for (var i = 0; i < rowNum; i++) {
                var displayRow = document.createElement('tr');
                var jqDisplayRow = jQuery(displayRow);
                for (var j = 0; j < this.displayColumns; j++) {
                    var displayItem = document.createElement('td');
                    jqDisplayRow.append(displayItem);

                    var jqDItem = jQuery(displayItem).height(this.displayStyles.itemHeight);

                    var index = i * this.displayColumns + j;
                    var displayChannel = this.displayChannels[index];
                    if (displayChannel) {
                        var label = displayChannel.label || '';
                        jqDItem.append(label);

                        if (!this.singleCheck) {
                            var deCheck = document.createElement('img');
                            deCheck.src = 'images/realtimeAnalysis/channel_picker_decheck.png';
                            jQuery(deCheck).css({
                                position: 'absolute',
                                top: '3px',
                                right: '3px'
                            });
                            jqDItem.append(deCheck);
                        }

                        jqDItem.css({
                            position: 'relative',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            'text-overflow': 'ellipsis',
                            'whie-space': 'nowrap',
                            'word-break': 'keep-all'
                        }).click(function() {
                            self.displayItemClick(this);
                        });

                        if (displayChannel.tmpChecked) {
                            jqDItem.css({
                                backgroundColor: this.displayStyles.BgFocus,
                                color: this.displayStyles.textFocus
                            });
                        } else {
                            jqDItem.css({
                                backgroundColor: 'transparent',
                                color: 'inherit',
                            });
                        }
                        this.displayItems.push(displayItem);
                    }
                }
                jqDisplayTable.append(displayRow);
            }

            this.channelsDisplay.empty().append(displayTable);
        },

        updateDisplay: function() {
            var self = this;
            jQuery.each(this.displayItems, function(i, item) {
                var channel = self.displayChannels[i];
                var jqItem = jQuery(item);
                if (channel.tmpChecked) {
                    jqItem.css({
                        backgroundColor: self.displayStyles.BgFocus,
                        color: self.displayStyles.textFocus
                    });
                } else {
                    jqItem.css({
                        backgroundColor: 'transparent',
                        color: 'inherit',
                    });
                }
            });
            jQuery(this.pickerContainer).hide().show();
            // Make IE repait for td background-color change.
        },

        displayItemClick: function(obj) {
            var self = this;
            jQuery.each(this.displayItems, function(i, item) {
                if (self.singleCheck) {
                    var channel = self.displayChannels[i];
                    var jqItem = jQuery(item);
                    if (item === obj) {
                        channel.tmpChecked = true;
                        jqItem.css({
                            backgroundColor: self.displayStyles.BgFocus,
                            color: self.displayStyles.textFocus
                        });
                    } else {
                        channel.tmpChecked = false;
                        jqItem.css({
                            backgroundColor: 'transparent',
                            color: 'inherit',
                        });
                    }
                } else {
                    if (item === obj) {
                        var channel = self.displayChannels[i];
                        var jqItem = jQuery(item);
                        if (channel.tmpChecked) {
                            channel.tmpChecked = false;
                            jqItem.css({
                                backgroundColor: 'transparent',
                                color: 'inherit',
                            });
                        } else {
                            channel.tmpChecked = true;
                            jqItem.css({
                                backgroundColor: self.displayStyles.BgFocus,
                                color: self.displayStyles.textFocus
                            });
                        }
                    }
                }
            });
            jQuery(this.pickerContainer).hide().show();
            // Make IE repait for td background-color change.
        },

        getResult: function() {
            var result = [];
            for (var i = 0, max = this.channels.length; i < max; i++) {
                var channel = this.channels[i];
                if (channel && channel.checked) {
                    result.push(channel);
                }
            }
            return result;
        },

        setChosen: function(channelIds){
            this.channels.forEach(function(e, i){
                channelIds.forEach(function(je,j){
                    if(e.channelid == je){
                        e.checked = true;
                        e.tmpChecked = true;
                    }
                });
            });
            this.updateDisplay();
        },

        cancel: function() {
            for (var i = 0, max = this.channels.length; i < max; i++) {
                var channel = this.channels[i];
                channel.tmpChecked = channel.checked;
            }
            this.updateDisplay();
            this.notifyChange();
        },

        submit: function() {
            for (var i = 0, max = this.channels.length; i < max; i++) {
                var channel = this.channels[i];
                channel.checked = channel.tmpChecked;
            }
            this.updateDisplay();
            this.notifyChange();
        },

        reset: function() {
            for (var i = 0, max = this.channels.length; i < max; i++) {
                var channel = this.channels[i];
                channel.tmpChecked = false;
            }
            this.updateDisplay();
        },

        getChannelByRank: function(rank) {
            var channels = [];
            rank = parseInt(rank, 10);
            for (var i = 0; i < rank; i++) {
                var channel = this.channels[i];
                if (channel) {
                    channels.push(channel);
                }
            }
            return channels;
        },

        setChannelsColor: function() {
            if (this.channelsColorSet) {
                return;
            }
            for (var i = 0, len = this.channels.length; i < len; i++) {
                var channel = this.channels[i];
                channel.lineColor = this.channelColors[i] || this.getRandomColor();
            }
            this.channelsColorSet = true;
        },

        getRandomColor: function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);

            return 'rgb(' + r + ',' + g + ',' + b + ')';
        },

        getAuMax: function() {
            return this.auMax;
        },
        // @formatter:off
        channelColors: ['#000080', '#0000CD', '#006400', '#008080', '#00BFFF', '#00FA9A', '#00FF00', '#00FFFF',
                '#2F4F4F', '#4169E1', '#483D8B', '#556B2F', '#696969', '#7CFC00', '#800000', '#800080',
                '#808000', '#9370DB', '#B0C4DE', '#B8860B', '#BC8F8F', '#BDB76B', '#C71585', '#CD5C5C',
                '#CD853E', '#D269E1', '#D8BFD8', '#DAA520', '#DB7093', '#DC143C', '#F08080', '#FF0000',
                '#FFD700', '#FF6347', '#FF00FF', '#FFDEAD', '#FA8072', '#20B2AA', '#00FF00', '#0000FF'],
        // @formatter:on
    };
    // @formatter:off
}(window.JS));
// @formatter:on
