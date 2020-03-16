// @formatter:off
(function(JS){
    var analysis = JS.namespace('auAnalysis'),
        AuTimePicker = JS.checkExist('auAnalysis.AuTimePicker'),
        ChannelDropdown = JS.checkExist('auAnalysis.ChannelDropdown'),
        ChartAxes = JS.checkExist('auAnalysis.ChartAxes'),
        RatingSplitChart = JS.checkExist('auAnalysis.RatingSplitChart');
    // @formatter:on
    analysis.programHistory = {
        init: function() {
            this.interval = 60;
            this.fetchRemoteQuery();

            this.programPicker = new AuTimePicker({
                hasChannel: true,
            });

            this.getFilter();
            this.getContentView();
        },

        getFilter: function() {
            var self = this;
            var swEls = [{
                label: '覆盖范围',
                dropdown: {
                    align: 'right',
                    content: function() {
                        return self.getPickerView();
                    },
                    getChangeListener: function(listener) {
                        self.bindProgramPickerListener(listener);
                    }

                },
                value: function() {
                    return self.getPickerResult();
                }

            }];

            this.filter = new StyledSwitcher({
                container: '#programHistory_filter',
                elements: swEls,
                styles: {
                    borderRadius: '3px'
                }
            });

            this.filter.create();
            this.setPickerWidgets();

            var self = this;
            this.filter.onChange = function(result) {
                self.setFilterResult(result);
            };
        },

        getPickerView: function() {
            var pickerView = this.programPicker.getPicker();
            return pickerView;
        },

        getPickerResult: function() {
            var result = this.programPicker.getResult();

            if(!result){
                return null;
            }

            var channel = result.channel;
            var channelIds;
            if(channel){
                channelIds = [channel.channelid];
            }

            var dates = [];
            for (var item in this.checkedDates) {
                if (this.checkedDates.hasOwnProperty(item)) {
                    var dateNum = Number(item);
                    if (!isNaN(dateNum) && this.checkedDates[dateNum]) {
                        dates.push(dateNum);
                    }
                }
            }
            dates.sort(function(a, b) {
                return a - b;
            });
            result.dates = dates;

            this.queryOptionSaved = jQuery.extend(this.queryOptionSaved || {}, {
                beginHour: result.beginHour,
                beginMin: result.beginMin,
                endHour: result.endHour,
                endMin: result.endMin,
                date: result.date,
                channelIds: channelIds,
                dates: dates
            });
            this.saveQuery();
            return result;
        },

        bindProgramPickerListener: function(listener) {
            this.programPicker.addChangeListener(listener);
        },

        setPickerWidgets: function() {
            var self = this;

            this.checkedDates = {};

            var calendar = new Calendar('programHistory_au_time_picker_calendar');
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
                nonCurrMonthColor: 'rgb(200,200,200)'
            };
            calendar.setStyles(calendarStyles);

            function checkDatesState() {
                var year = calendar.getCurrYear();
                var month = calendar.getCurrMonth();
                var weekdays = {};
                var monthCheck = true;
                var dateElements = calendar.getCurrMonthDateElements();
                jQuery.each(dateElements, function(i, item) {
                    var dateChecked = self.checkedDates[i + 1];
                    if (!dateChecked) {
                        monthCheck = false;
                    }
                    var _date = new Date(year, month, i + 1);
                    var _day = _date.getDay();
                    if (!weekdays[_day]) {
                        weekdays[_day] = [];
                    }
                    weekdays[_day].push(dateChecked);

                    var jqItem = jQuery(item);
                    if (dateChecked) {
                        jqItem.css({
                            backgroundColor: 'rgb(18,160,234)',
                            color: 'white'
                        });
                    } else {
                        jqItem.css({
                            backgroundColor: 'rgb(254,254,254)',
                            color: 'rgb(121,121,121)'
                        });
                    }
                });

                self.checkedDates.monthCheck = monthCheck;

                var jqML = jQuery(self.checkedDates.monthLabel);

                if (monthCheck) {
                    jqML.css({
                        backgroundColor: 'rgb(18,160,234)'
                    });
                } else {
                    jqML.css({
                        backgroundColor: 'transparent'
                    });
                }

                for (var j in weekdays) {
                    if (weekdays.hasOwnProperty(j)) {
                        var weekdayCheck = true;
                        jQuery.each(weekdays[j], function(k, ktem) {
                            if (!ktem) {
                                weekdayCheck = false;
                            }
                        });
                        self.checkedDates['weekday' + j] = weekdayCheck;
                    }
                }

                jQuery.each(self.checkedDates.weekdays, function(m, mtem) {
                    var wkday = jQuery(mtem);
                    if (self.checkedDates['weekday' + m]) {
                        wkday.css({
                            backgroundColor: 'rgb(18,160,234)',
                            color: 'white'
                        });
                    } else {
                        wkday.css({
                            backgroundColor: 'rgb(254,254,254)',
                            color: 'rgb(74,174,237)'
                        });
                    }
                });

                jQuery('#programHistory_au_time_picker_calendar').hide().show();
                // Fix for IE redisplay.
            };

            calendar.onCalendarRefresh = function() {
                var calendar = this;
                self.checkedDates = {};

                self.checkedDates.weekdays = jQuery('#programHistory_au_time_picker_calendar').find('.calendar-weekday').css('cursor', 'pointer').unbind().click(function(ev) {
                    var weekdayIndex = jQuery(this).attr('calendarweekday');
                    var weekdayAttr = 'weekday' + weekdayIndex;
                    var weekdayChecked = self.checkedDates[weekdayAttr];

                    var dateElements = calendar.getCurrMonthDateElements();
                    var year = calendar.getCurrYear();
                    var month = calendar.getCurrMonth();
                    jQuery.each(dateElements, function(i, item) {
                        var date = i + 1;
                        var _date = new Date(year, month, date);
                        var matchWeekday = _date.getDay() === Number(weekdayIndex);
                        if (matchWeekday && weekdayChecked) {

                            self.checkedDates[date] = false;
                        } else if (matchWeekday) {

                            self.checkedDates[date] = true;
                        }
                    });
                    checkDatesState();
                });
                self.checkedDates.monthLabel = jQuery('#programHistory_au_time_picker_calendar').find('.calendar-month-label').css('cursor', 'pointer').unbind().click(function(ev) {
                    var dateElements = calendar.getCurrMonthDateElements();
                    var monthCheck = self.checkedDates.monthCheck;
                    if (monthCheck) {
                        jQuery.each(dateElements, function(i, item) {
                            self.checkedDates[i + 1] = false;
                        });
                    } else {
                        jQuery.each(dateElements, function(i, item) {
                            self.checkedDates[i + 1] = true;
                        });
                    }
                    checkDatesState();
                });
            };

            calendar.open();

            calendar.onCalendarClick = function(obj) {
                var dateIndex = parseInt(obj.innerHTML, 10);
                var dateChecked = self.checkedDates[dateIndex];
                self.checkedDates[dateIndex] = !dateChecked;
                checkDatesState();
            };

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
                containerId: 'programHistory_au_time_picker_start_hour',
                options: hourOptions,
                styles: selStyles
            });

            var beginMin = new StyledSelector({
                containerId: 'programHistory_au_time_picker_start_min',
                options: minOptions,
                styles: selStyles
            });

            var endHour = new StyledSelector({
                containerId: 'programHistory_au_time_picker_end_hour',
                options: hourOptions,
                styles: selStyles
            });

            var endMin = new StyledSelector({
                containerId: 'programHistory_au_time_picker_end_min',
                options: minOptions,
                styles: selStyles
            });

            var channelsDropdown = new ChannelDropdown({
                container: '#programHistory_au_time_picker_channels_dropdown',
                styles: selStyles
            });

            beginHour.create();
            beginMin.create();
            endHour.create();
            endMin.create();
            channelsDropdown.create();

            this.programPicker.calendarSel = calendar;
            this.programPicker.beginHourSel = beginHour;
            this.programPicker.beginMinSel = beginMin;
            this.programPicker.endHourSel = endHour;
            this.programPicker.endMinSel = endMin;
            this.programPicker.channelSel = channelsDropdown;
            if(this.queryOptionSaved){
                this.programPicker.setChosen(this.queryOptionSaved);
                var queryDates = this.queryOptionSaved.dates;
                var dateEles = calendar.getCurrMonthDateElements();
                jQuery.each(dateEles, function(i, e){
                    queryDates.forEach(function(je, j){
                        if(e.innerHTML == je){
                            jQuery(e).trigger('click');
                        }
                    });
                });
            }
        },

        setFilterResult: function(result) {
            if (!result) {
                return;
            }

            var channel = result.channel;
            var year = result.date.year;
            var month = result.date.month;
            var beginHour = result.beginHour;
            var beginMin = result.beginMin;
            var endHour = result.endHour;
            var endMin = result.endMin;
            var dates = result.dates;

            if (!channel) {
                alert('请选择一个频道。');
                return;
            }

            if (dates.length === 0) {
                alert('请选择您要查看的日期。');
                return;
            }

            var date = dates[0];
            var beginTime = new Date(year, month, date, beginHour, beginMin);
            var endTime = new Date(year, month, date, endHour, endMin);
            if (endTime.getTime() <= beginTime.getTime()) {
                alert('您所选择的时间段有误，请重新选择。');
                return;
            }

            var beginTimeStr = uiUtil.getDateToStr(beginTime);
            var endTimeStr = uiUtil.getDateToStr(endTime);
            var channelName = channel && channel.label || '';
            // @formatter:off
            var indiStr = '(' + channelName + ' 栏目时间段：' + beginTimeStr.substr(11, 5) + '-' +
                    endTimeStr.substr(11, 5) + ')';
                // @formatter:on
            jQuery('#programHistory_durationIndicator').html(indiStr);

            var dateList = [];
            for (var i = 0, len = dates.length; i < len; i++) {
                dateList.push({
                    'year': year,
                    'month': month,
                    'date': dates[i],
                });
            }
            this.durationBegin = beginTime;
            this.durationEnd = endTime;
            this.dateList = dateList;
            this.channel = channel;
            this.updateChart();
        },

        updateChart: function() {
            if (!this.channel || !this.dateList || !this.durationBegin || !this.durationEnd) {
                // Not ready to update chart.
            } else if (this.dateList.length > 0) {
                this.getChart();
            }
        },

        getChart: function() {
            this.getChartData();
            //this.getTestData();
        },

        setChannelAvgLabel: function() {
            var max = '&nbsp;&nbsp;最大：' + Number(this.channel.max).toFixed(1) + '%';
            var avg = '&nbsp;&nbsp;平均：' + Number(this.channel.avg).toFixed(1) + '%';
            var min = '最小：' + Number(this.channel.min).toFixed(1) + '%';

            jQuery('#programHistory_channelAvgLabel').empty().append(min).append(avg).append(max);
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
                    var _channelId = parseInt(this.channel.channelid, 10);
                    if (channelId === _channelId) {
                        this.channel.max = channelData.max;
                        this.channel.min = channelData.min;
                        this.channel.avg = channelData.avg;
                        this.channel.days = channelData.days;
                        break;
                    }
                }
                this.getChartContent();
                this.setChannelAvgLabel();
            }
        },

        getQueryStr: function() {
            var query = '?';
            query += 'channel_ids=' + this.channel.channelid;
            query += '&interval=' + this.interval;
            query += '&days=' + this.getQueryDates();
            query += '&time_range=' + this.getQueryDuration();
            return query;
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
            this.getRandomTime();
            this.getChartContent();
            this.setChannelAvgLabel();
        },

        getRandomTime: function() {
            var beginT = this.durationBegin.getTime();
            var endT = this.durationEnd.getTime();
            this.channel.days = [];
            this.channel.max = this.getRandomRating();
            this.channel.min = this.getRandomRating();
            this.channel.avg = this.getRandomRating();

            for (var p = 0, len = this.dateList.length; p < len; p++) {
                var date = this.dateList[p];
                var _year = date.year;
                var _month = date.month > 9 ? (date.month + 1) : '0' + (date.month + 1);
                var _date = date.date > 9 ? date.date : '0' + date.date;
                var _day = String(_year) + String(_month) + String(_date);
                var day = {
                    day: _day,
                    details: [],
                    max: this.getRandomRating(),
                    min: this.getRandomRating(),
                    avg: this.getRandomRating(),
                };

                for (var i = beginT; i <= endT; i += 60000) {
                    var rand = i;
                    var _date = new Date(rand);
                    var h = _date.getHours();
                    var m = _date.getMinutes();
                    h = h > 9 ? String(h) : '0' + h;
                    m = m > 9 ? String(m) : '0' + m;
                    var _time = h + ':' + m + ':00';
                    day.details.push({
                        time: _time,
                        rating: this.getRandomRating()
                    });
                }

                this.channel.days.push(day);
            }
        },

        getRandomRating: function() {
            return (Math.random() * 4.5).toFixed(2);
        },

        getChartContent: function() {
            this.getRatingMax();
            this.getChartParams();
            this.axParams.pointWeight = this.pointWeight;
            this.axes.update(this.axParams);

            var rsChart = new RatingSplitChart({
                channel: this.channel,
                params: {
                    container: jQuery('#programHistory_chartContent'),
                    unitRate: this.unitRate,
                    topSpare: 30,
                    blockHeight: this.axes.axOrigin.y,
                }
            });
            rsChart.getBlocks();
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
            this.axParams.container = jQuery('#programHistory_chartContainer');
            this.axes = new ChartAxes(this.axParams);
            this.axes.getAxes();
        },

        getContentView: function() {
            this.getAxes();
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
            jQuery.each(this.channel.days, function(i, day) {
                jQuery.each(day.details, function(j, time) {
                    var rating = parseFloat(time.rating);
                    if (rating > self.ratingMax) {
                        self.ratingMax = rating;
                    }
                });
            });
        },

        fetchRemoteQuery: function(){
            var querySaved = localStorage['AquaPaas_queryOption_ph'];
            if(querySaved){
                this.queryOptionSaved = JSON.parse(querySaved);
            }
        },

        saveQuery: function(){
            if(this.queryOptionSaved){
                localStorage['AquaPaas_queryOption_ph'] = JSON.stringify(this.queryOptionSaved);
            }
        }
    };

    // @formatter:off
}(window.JS));
// @formatter:on
