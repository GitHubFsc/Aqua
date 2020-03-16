// @formatter:off
(function(JS){

    var analysis = JS.namespace('auAnalysis'),
        ChannelPicker = JS.checkExist('auAnalysis.ChannelPicker'),
        AuTimePicker = JS.checkExist('auAnalysis.AuTimePicker'),
        ChartAxes = JS.checkExist('auAnalysis.ChartAxes'),
        RatingLineChart = JS.checkExist('auAnalysis.RatingLineChart'),
        RatingInfoList = JS.checkExist('auAnalysis.RatingInfoList'),
        CHMultiBlocks = JS.checkExist('auAnalysis.CHMultiBlocks'),
        analyzer = JS.checkExist('auAnalysis.realtimeAnalysis');
    // @formatter:on

    analysis.channelHistory = {
        init: function() {
            this.interval = 60;
            this.channels = [];
            this.durationBegin = null;
            this.durationEnd = null;
            this.fetchRemoteQuery();

            this.channelPicker = new ChannelPicker({
                noUpdate: true,
                noProgram: true,
                channels: analyzer.channels
            });
            this.auTimePicker = new AuTimePicker({
                dual: true,
            });
            this.getChannelFilter();
            this.getTimeFilter();
            this.getContentView();
        },

        getChannelFilter: function() {
            var self = this;
            var swEl = [{
                label: '频道选择',
                dropdown: {
                    align: 'right',
                    content: function() {
                        return self.getChannelPickerView();
                    },
                    getChangeListener: function(listener) {
                        self.bindChannelPickerListener(listener);
                    }

                },
                value: function() {
                    return self.getChannelPickerResult();
                }

            }];

            this.channelFilter = new StyledSwitcher({
                container: '#channel_history_channel_filter',
                elements: swEl,
                styles: {
                    borderRadius: '3px'
                }
            });

            this.channelFilter.create();

            this.channelFilter.onChange = function(channels) {
                self.setHistoryChannels(channels);
            };
        },

        getTimeFilter: function() {
            var self = this;
            var swEl = [{
                label: '时间段',
                dropdown: {
                    align: 'right',
                    content: function() {
                        return self.getTimePickerView();
                    },
                    getChangeListener: function(listener) {
                        self.bindTimePickerListener(listener);
                    }

                },
                value: function() {
                    return self.getTimePickerResult();
                }

            }];

            this.timeFilter = new StyledSwitcher({
                container: '#channel_history_time_filter',
                elements: swEl,
                styles: {
                    borderRadius: '3px'
                }
            });

            this.timeFilter.create();
            this.setTimePickerWidgets();

            this.timeFilter.onChange = function(value) {
                self.setHistoryDuration(value);
            };
        },

        setTimePickerWidgets: function() {

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
                borderColor: 'rgb(203,203,203)'
            };

            var datePickerStart = new DatePicker({
                containerId: 'channel_history_au_time_picker_date_picker_start',
                calendarStyles: calendarStyles,
                dateInputStyles: dateInputStyles,
                editable: false
            });

            var datePickerEnd = new DatePicker({
                containerId: 'channel_history_au_time_picker_date_picker_end',
                calendarStyles: calendarStyles,
                dateInputStyles: dateInputStyles,
                editable: false
            });

            var hourOptions = [];
            for (var i = 0; i < 24; i++) {
                hourOptions.push({
                    label: i < 10 ? '0' + i : String(i),
                    value: i
                });
            }

            var minOptions = [];
            for (var j = 0; j < 60; j++) {
                minOptions.push({
                    label: j < 10 ? '0' + j : String(j),
                    value: j
                });
            }

            var selStyles = {
                optionHeight: 30,
                iconColor: 'rgb(78,184,239)',
                iconSize: 16,
            };
            var beginHour = new StyledSelector({
                containerId: 'channel_history_au_time_picker_start_hour',
                options: hourOptions,
                styles: selStyles
            });

            var beginMin = new StyledSelector({
                containerId: 'channel_history_au_time_picker_start_min',
                options: minOptions,
                styles: selStyles
            });

            var endHour = new StyledSelector({
                containerId: 'channel_history_au_time_picker_end_hour',
                options: hourOptions,
                styles: selStyles
            });

            var endMin = new StyledSelector({
                containerId: 'channel_history_au_time_picker_end_min',
                options: minOptions,
                styles: selStyles
            });

            beginHour.create();
            beginMin.create();
            endHour.create();
            endMin.create();

            var shortcutEnable = jQuery('#channel_history_au_time_picker_shortcut_enable');
            var shortcutInput = jQuery('#channel_history_au_time_picker_shortcut_input');
            shortcutInput.attr('disabled', true);
            shortcutEnable.on('change', function(){
               if(this.checked){
                   datePickerStart.disable();
                   datePickerEnd.disable();
                   beginHour.disable();
                   beginMin.disable();
                   endHour.disable();
                   endMin.disable();
                   shortcutInput.attr('disabled', false);
               }else{
                   shortcutInput.attr('disabled', true);
                   datePickerStart.enable();
                   datePickerEnd.enable();
                   beginHour.enable();
                   beginMin.enable();
                   endHour.enable();
                   endMin.enable();
               }
            });

            this.auTimePicker.datePickerStart = datePickerStart;
            this.auTimePicker.datePickerEnd = datePickerEnd;
            this.auTimePicker.shortcutEnable = shortcutEnable;
            this.auTimePicker.shortcutInput = shortcutInput;
            this.auTimePicker.beginHourSel = beginHour;
            this.auTimePicker.beginMinSel = beginMin;
            this.auTimePicker.endHourSel = endHour;
            this.auTimePicker.endMinSel = endMin;

            if(this.queryOptionSaved){
                this.auTimePicker.setChosen(this.queryOptionSaved);
                shortcutEnable.trigger('change');
            }
        },

        getChannelPickerView: function() {
            var pickerView = this.channelPicker.getPicker();
            if(this.queryOptionSaved && this.queryOptionSaved.channelIds){
                this.channelPicker.setChosen(this.queryOptionSaved.channelIds);
            }
            return pickerView;
        },

        getTimePickerView: function() {
            return this.auTimePicker.getDualPicker();
        },

        bindTimePickerListener: function(listener) {
            this.auTimePicker.addChangeListener(listener);
        },

        bindChannelPickerListener: function(listener) {
            this.channelPicker.addChangeListener(listener);
        },

        getChannelPickerResult: function() {
            var channels = this.channelPicker.getResult();
            var channelIds = channels.map(function(e, i){
                return e.channelid;
            });
            this.queryOptionSaved = jQuery.extend(this.queryOptionSaved || {}, {
                channelIds:  channelIds
            });
            this.saveQuery();
            return channels;
        },

        getTimePickerResult: function() {
            var result = this.auTimePicker.getResult();

            if(!result){
                return null;
            }

            this.queryOptionSaved = jQuery.extend(this.queryOptionSaved || {}, {
                beginHour: result.beginHour,
                beginMin: result.beginMin,
                endHour: result.endHour,
                endMin: result.endMin,
                beginDate: result.beginDate,
                endDate: result.endDate,
                shortcutEnable: result.shortcutEnable,
                shortcutValue: result.shortcutValue
            });
            this.saveQuery();
            return result;
        },

        setHistoryDuration: function(duration) {
            if (!duration) {
                return;
            }

            var beginTime, endTime, beginDate, endDate;
            if (duration.shortcutEnable) {
                if (duration.shortcutValue === '') {
                    alert('请输入查看时间段。');
                    return;
                }
                var mins = parseInt(duration.shortcutValue, 10);
                if (isNaN(mins)) {
                    alert('您输入的时间格式不正确。');
                    return;
                }
                var curr = new Date();
                var past = new Date(curr.getTime() - mins * 60 * 1000);

                if (curr.getDate() === past.getDate() && (curr.getMonth() === past.getMonth()) && (curr.getFullYear() === past.getFullYear())) {
                    beginTime = past;
                    endTime = curr;
                    beginDate = curr;
                    endDate = curr;
                } else {
                    alert('您输入的时间超出今日范围，请重新输入。');
                    return;
                }
            } else {
                var _beginDate = duration.beginDate;
                var _endDate = duration.endDate;

                if(!_beginDate.year || !_endDate.year){
                    alert('请选择查看日期。');
                    return;
                }

                beginTime = new Date(_beginDate.year, _beginDate.month, _beginDate.date, duration.beginHour, duration.beginMin);
                endTime = new Date(_beginDate.year, _beginDate.month, _beginDate.date, duration.endHour, duration.endMin);

                beginDate = new Date(_beginDate.year, _beginDate.month, _beginDate.date);
                endDate = new Date(_endDate.year, _endDate.month, _endDate.date);

                if (endTime.getTime() <= beginTime.getTime() || (endDate.getTime() < beginDate.getTime())) {
                    alert('您所选择的时间有误，请重新选择。');
                    return;
                } else if (endDate.getTime() - beginDate.getTime() > 31 * 24 * 60 * 60 * 1000) {
                    alert('您选择的时间范围过大，请重新选择。');
                    return;
                }
            }

            var beginTimeStr = uiUtil.getDateToStr(beginTime).substr(11, 5);
            var endTimeStr = uiUtil.getDateToStr(endTime).substr(11, 5);
            var beginDateStr = uiUtil.getDateToStr(beginDate).substr(0, 10);
            var endDateStr = uiUtil.getDateToStr(endDate).substr(0, 10);

            var indiStr = '(' + beginDateStr;
            if (beginDateStr !== endDateStr) {
                indiStr += ('&nbsp;--&nbsp;' + endDateStr);
            }
            indiStr += ('&nbsp;&nbsp;' + beginTimeStr + '&nbsp;--&nbsp;' + endTimeStr + ')' );

            jQuery('#channel_history_duration_indicator').html(indiStr);

            this.dateList = [];
            var _beginDateTime = beginDate.getTime();
            var _endDateTime = endDate.getTime();
            for (var i = _beginDateTime; i <= _endDateTime; i += 24 * 60 * 60 * 1000) {
                var _date = new Date(i);
                this.dateList.push({
                    year: _date.getFullYear(),
                    month: _date.getMonth(),
                    date: _date.getDate()
                });
            }
            this.durationBegin = beginTime;
            this.durationEnd = endTime;
            this.updateChart();

        },

        setHistoryChannels: function(channels) {
            this.channels = channels;
            this.updateChart();
        },

        updateChart: function() {
            if (!this.channels || this.channels.length == 0 || !this.durationBegin || !this.durationEnd || !this.dateList) {
                // When not ready, do not update.
            } else {
                this.setChannelsColor();
                this.getChart();
            }
        },

        axParams: {
            axLmt: 450,
            axStep: 50,
            unit: '收视率(%)',
            unitHeight: 30,
            axSpare: 15,
            xAxLeft: 45,
            precision: 2,
            pointWeight: 0.01,
            maxLmt: 100,
            minLmt: 0.01
        },

        getAxes: function() {
            this.axParams.container = jQuery('#channel_history_chart_container');
            this.axes = new ChartAxes(this.axParams);
            this.axes.getAxes();
        },

        getContentView: function() {
            this.getAxes();
        },

        getChart: function() {
            this.getChartData();
            this.getChannelPrograms();
            //this.getTestData();
        },

        getChannelPrograms: function(){
            this.channelPicker.setChannelStatic(this.channels);
            var dates = this.dateList.map(function(e, i){
                var date = new Date(e.year, e.month, e.date);
                return uiUtil.getDateToStr(date).substr(0, 10);
            });
            this.channelPicker.setDateList(dates);
            this.channelPicker.getChannelPrograms();
        },

        getChartData: function() {
            var self = this;
            var query = this.getQueryStr();
            var Url = aquapaas_host + '/aquapaas/rest/multiapp/channel/history/statistics' + query;
            Url += '&app_key=' + paasAppKey;
            Url += '&timestamp=' + new Date().toISOString();
            jQuery.ajax({
                url: Url,
                type: 'GET',
                headers: {
                    'x-aqua-sign': getPaaS_x_aqua_sign('GET', Url)
                }
            }).done(function(data) {
                self.parseChartData(data && data.statics);
            });
        },

        parseChartData: function(channelsData) {
            if (Array.isArray(channelsData)) {
                for (var i = 0, len = channelsData.length; i < len; i++) {
                    var channelData = channelsData[i];
                    var channelId = parseInt(channelData.channel_id, 10);
                    for (var j = 0, jMax = this.channels.length; j < jMax; j++) {
                        var _channel = this.channels[j];
                        var _channelId = parseInt(_channel.channelid, 10);
                        if (channelId === _channelId) {
                            _channel.max = channelData.max;
                            _channel.min = channelData.min;
                            _channel.avg = channelData.avg;
                            _channel.days = channelData.days;
                            break;
                        }
                    }
                }
                this.getChartContent();
                this.getChartInfoList();
            }
        },

        getQueryStr: function() {
            var query = '?';
            query += 'channel_ids=' + this.getQueryIds();
            query += '&interval=' + this.interval;
            query += '&days=' + this.getQueryDates();
            query += '&time_range=' + this.getQueryDuration();
            return query;
        },

        getQueryIds: function() {
            var _ids = [];
            for (var i = 0, len = this.channels.length; i < len; i++) {
                var _channel = this.channels[i];
                _ids.push(_channel.channelid);
            }

            return _ids.join(',');
        },

        getQueryDuration: function() {
            var _times = [];
            var _beginTime = uiUtil.getDateToStr(this.durationBegin);
            var _endTime = uiUtil.getDateToStr(this.durationEnd);
            _times.push(_beginTime.substr(11, 8));
            _times.push(_endTime.substr(11, 8));

            return _times.join(',');
        },

        getQueryDates: function() {
            var _dates = [];
            for (var i = 0, len = this.dateList.length; i < len; i++) {
                var date = this.dateList[i];
                var year = date.year;
                var month = date.month;
                var date = date.date;
                year = String(year);
                month = month > 9 ? String(month + 1) : '0' + (month + 1);
                date = date > 9 ? String(date) : '0' + date;
                var _date = year + month + date;
                _dates.push(_date);
            }
            return _dates.join(',');
        },

        getTestData: function() {
            for (var i = 0, len = this.channels.length; i < len; i++) {
                var channel = this.channels[i];
                channel.max = this.getRandomRating();
                channel.min = this.getRandomRating();
                channel.avg = this.getRandomRating();
                this.getRandomTime(channel);
            }
            this.getChartContent();
            this.getChartInfoList();
        },

        getRandomTime: function(channel) {
            var beginT = this.durationBegin.getTime();
            var endT = this.durationEnd.getTime();
            channel.times = [];
            for (var i = beginT; i <= endT; i += 60000) {
                var rand = i;
                var _date = new Date(rand);
                var h = _date.getHours();
                var m = _date.getMinutes();
                h = h > 9 ? String(h) : '0' + h;
                m = m > 9 ? String(m) : '0' + m;
                var _time = h + ':' + m + ':00';
                channel.times.push({
                    time: _time,
                    rating: this.getRandomRating()
                });
            }
        },

        getRandomRating: function() {
            return (Math.random() * 4.5).toFixed(2);
        },

        getChartInfoList: function() {
            var infoList = new RatingInfoList({
                channels: this.channels,
                params: {
                    container: jQuery('#channel_history_list_container')
                }
            });
            infoList.getList();
            this.infoList = infoList;
        },

        getChartContent: function() {
            this.getRatingMax();
            this.getChartParams();
            this.axParams.pointWeight = this.pointWeight;
            this.axes.update(this.axParams);

            this.$chart = jQuery('#channel_history_chart_content');
            var blocksView = new CHMultiBlocks({
                channels: this.channels,
                params: {
                    unitRate: this.unitRate,
                    blockHeight: this.axes.axOrigin.y,
                    container: this.$chart,
                    topSpare: 30,
                }
            });
            blocksView.getBlocks();
            this.blocksView = blocksView;
            var self = this;
            this.$chart.unbind().bind('mousemove', function(ev) {
                self.handleMouseOver(ev);
            });
        },

        handleMouseOver: function(ev) {
            var target = ev.target;
            if (!jQuery.nodeName(target, 'polyline')) {
                return;
            }

            var $target = jQuery(target);
            if (!$target.attr('channelid')) {
                return;
            }

            var offsetIndex = $target.attr('dateindex');
            offsetIndex = Number(offsetIndex);
            var offsetRef = this.$chart.children().first().width();

            var chartOffset = this.$chart.offset();
            var evX = ev.pageX;
            var evY = ev.pageY;
            var chartScrollLeft = this.$chart.scrollLeft();

            var currX = evX - chartOffset.left + chartScrollLeft;
            var currY = evY - chartOffset.top;

            var tmpIndiX = currX - offsetIndex * offsetRef;
            var indiXes = [];
            for (var i = 0, len = this.blocksView.indiLabels.length; i < len; i++) {
                var indiX = this.blocksView.firstSpare + i * this.blocksView.indiSpace;
                indiXes.push(indiX);
            }
            indiXes.push(tmpIndiX);
            this.sortUp(indiXes);
            var currIndex = indiXes.indexOf(tmpIndiX);
            var prev = indiXes[currIndex - 1];
            var next = indiXes[currIndex + 1];
            var currIndiX = this.getCloseNeighbour(tmpIndiX, prev, next);
            if ( typeof currIndiX === 'undefined') {
                return;
            }

            var polyX = '' + currIndiX + ',';
            var polyXYes = [];
            this.$chart.children().eq(offsetIndex).find('polyline[channelid]').each(function(j, jtem) {
                var points = jQuery(jtem).attr('points');
                var pointArray = points.split(' ');
                pointArray.forEach(function(ke, k) {
                    if (ke.indexOf(polyX) > -1) {
                        polyXYes.push(ke);
                    }
                });
            });
            var indiYs = polyXYes.map(function(le, l) {
                var indis = le.split(',');
                return Number(indis[1]);
            });
            var tmpIndiY = currY - this.blocksView.topSpare;
            indiYs.push(tmpIndiY);
            this.sortUp(indiYs);
            var currIndexY = indiYs.indexOf(tmpIndiY);
            var prevY = indiYs[currIndexY - 1];
            var nextY = indiYs[currIndexY + 1];
            var currIndiY = this.getCloseNeighbour(currY, prevY, nextY);
            if ( typeof currIndiY === 'undefined') {
                return;
            }

            var polyPoint = '' + currIndiX + ',' + currIndiY;

            var channelIds = [];
            this.$chart.children().eq(offsetIndex).find('polyline[channelid]').each(function(m, me) {
                var $me = jQuery(me);
                var polyPoints = $me.attr('points');
                if (polyPoints.indexOf(polyPoint) > -1) {
                    var polyChannelId = $me.attr('channelid');
                    if (polyChannelId) {
                        channelIds.push(polyChannelId);
                    }
                }
            });

            var channels = [];
            jQuery.each(this.channels, function(n, ne) {
                jQuery.each(channelIds, function(o, oe) {
                    if (ne.channelid === Number(oe)) {
                        channels.push(ne);
                    }
                });
            });
            if(channels.length == 0){
                return;
            }

            if (currIndiX < this.blocksView.firstSpare) {
                return;
            }

            indiXes.splice(currIndex, 1);
            var indiLabelIndex = indiXes.indexOf(currIndiX);
            var indiLabel = this.blocksView.indiLabels[indiLabelIndex];
            var dayStr = channels[0] && channels[0].days && channels[0].days[offsetIndex] &&
                channels[0].days[offsetIndex].day;
            var dayYear = dayStr.substr(0, 4);
            var dayMonth = dayStr.substr(4, 2);
            var dayDate = dayStr.substr(6, 2);
            var dayStr = dayYear + '-' + dayMonth + '-' + dayDate;

            var pointTime = dayStr + ' ' + indiLabel;
            this.showTooltip({
                point: {
                    x: offsetIndex * offsetRef + currIndiX,
                    y: this.blocksView.topSpare + currIndiY
                },
                channels: channels,
                time: pointTime
            });
        },

        showTooltip: function(obj) {
            var anchor = obj && obj.point;
            var channels = obj && obj.channels;
            var pointTime = obj && obj.time;

            var tooltip = document.getElementById('channel_history_tooltip');
            var channelLabels = '';
            var tipTime = uiUtil.getStrToDate(pointTime).getTime();
            for (var i = 0, len = channels.length; i < len; i++) {
                var channel = channels[i];
                var dateStr = pointTime.substr(0, 10);
                var programLabel = '';
                var programs = channel.programs && channel.programs[dateStr];
                if(programs){
                    for(var j = 0, jMax = programs.length; j < jMax; j++){
                        var program = programs[j];
                        var progBegin = uiUtil.getStrToDate(program.startTime);
                        var progEnd = uiUtil.getStrToDate(program.endTime);
                        if(progBegin.getTime() < tipTime && (tipTime < progEnd.getTime())){
                            programLabel = program.programName;
                            break;
                        }
                    }
                }
                channelLabels += '<p>' + channel.label + '&nbsp;' + programLabel + '</p>';
            }
            if (tooltip) {
                jQuery(tooltip).css({
                    left: anchor.x,
                    top: anchor.y
                });
                jQuery('#channel_history_tooltip_content').html(channelLabels);
            } else {
                tooltip = document.createElement('div');
                var icon = '<div id="channel_history_tooltip_icon"><div></div></div>';
                var content = '<div id="channel_history_tooltip_content">' + channelLabels + '</div>';
                jQuery(tooltip).attr('id', 'channel_history_tooltip').css({
                    left: anchor.x,
                    top: anchor.y
                }).append(icon).append(content).appendTo(this.$chart);
            }

            if (this.tooltipTimeout) {
                clearTimeout(this.tooltipTimeout);
            }
            this.tooltipTimeout = setTimeout(function() {
                jQuery('#channel_history_tooltip').remove();
            }, 3000);
        },

        getCloseNeighbour: function(i, a, b) {
            if ( typeof a !== 'undefined' && ( typeof b !== 'undefined')) {
                if (Math.abs(i - a) < Math.abs(i - b)) {
                    return a;
                } else {
                    return b;
                }
            } else if ( typeof a !== 'undefined') {
                return a;
            } else if ( typeof b !== 'undefined') {
                return b;
            }
        },

        sortUp: function(array) {
            array.sort(function(a, b) {
                return a - b;
            });
        },

        // unitRates: [0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.25],
        // divisions: [200, 100, 50, 20, 10, 5, 4],

        getChartParams: function() {
            // for (var i = 0, len = this.unitRates.length; i < len; i++) {
                // this.unitRate = this.unitRates[i];
                // this.division = this.divisions[i];
                // var height = this.ratingMax / this.unitRate;
                // if (height <= this.axParams.axLmt) {
                    // break;
                // }
            // }

            var pointWeight = this.ratingMax / 400;

            this.unitRate = pointWeight;
            this.pointWeight = pointWeight;
        },

        getRatingMax: function() {
            this.ratingMax = 0;
            var self = this;
            jQuery.each(this.channels, function(i, channel) {
                jQuery.each(channel.days, function(j, day) {
                    jQuery.each(day.details, function(k, time) {
                        var rating = parseFloat(time.rating);
                        if (rating > self.ratingMax) {
                            self.ratingMax = rating;
                        }
                    });
                });
            });
        },

        // @formatter:off
        channelColors: ['#99cccc', '#0099cc', '#cc3399', '#339933', '#333300', '#336666',
                '#996699', '#666699', '#cccc44', '#ffcc00', '#996699', '#cc0033',
                '#99cc66', '#666633', '#336699', '#999999', '#006600', '#990033',
                '#ed9474', '#ff6666', '#ff0033', '#99cc33', '#99ccff', '#3366cc',
                '#ff9900', '#ff6600', '#33cc99', '#663399', '#669999', '#99cc99'],
        // @formatter:on

        getRandomColor: function() {
            var r = Math.floor(Math.random() * 255);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);

            return 'rgb(' + r + ',' + g + ',' + b + ')';
        },

        setChannelsColor: function() {
            for (var i = 0, len = this.channels.length; i < len; i++) {
                var channel = this.channels[i];
                channel.lineColor = this.channelColors[i] || this.getRandomColor();
            }
        },

        fetchRemoteQuery: function(){
            var querySaved = localStorage['AquaPaas_queryOption_ch'];
            if(querySaved){
                this.queryOptionSaved = JSON.parse(querySaved);
            }
        },

        saveQuery: function(){
            if(this.queryOptionSaved){
                localStorage['AquaPaas_queryOption_ch'] = JSON.stringify(this.queryOptionSaved);
            }
        }
    };
    // @formatter:off
}(window.JS));
// @formatter:on

