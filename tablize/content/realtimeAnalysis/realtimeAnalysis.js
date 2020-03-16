// @formatter:off
(function(JS) {
    var ChannelPicker = JS.checkExist('auAnalysis.ChannelPicker'),
        realtimeAnalysis = JS.namespace('auAnalysis.realtimeAnalysis');

    realtimeAnalysis.layout = 
	'<div id="realtime_analysis_second_menu" class="second_menu">' +
		'<div id="channel_realtime_container" onclick="window.JS.auAnalysis.realtimeAnalysis.analyzeChannelRealtime(this);">' +
			'<img src="images/realtimeAnalysis/channel_realtime_dark.png"/>' +
		'</div>' + 
		'<div id="channel_history_container" style="" onclick="window.JS.auAnalysis.realtimeAnalysis.analyzeChannelHistory(this);">' +
			'<img src="images/realtimeAnalysis/channel_history_dark.png"/>' +
		'</div>' + 
		'<div id="program_history_container" style="" onclick="window.JS.auAnalysis.realtimeAnalysis.analyzeProgramHistory(this);">' +
			'<img src="images/realtimeAnalysis/program_history_dark.png"/>' +
		'</div>' +
	'</div>';
    // @formatter:on

    realtimeAnalysis.init = function() {
        jQuery("#second_menu_container").empty().append(this.layout);
        // jQuery('#page_container').css({
            // height: '100%',
        // });
        this.setClock();
        var channelPicker = new ChannelPicker({
            noUpdate: true
        });
        channelPicker.getEPGSchedule();
        this.channelPicker = channelPicker;
        this.channels = channelPicker.channels;
        
        // this.analyzeChannelRealtime(document.getElementById('channel_realtime_container'));
        //this.analyzeChannelHistory(document.getElementById('channel_history_container'));
    };

    /**
     * 更换二级菜单样式
     */
    realtimeAnalysis.changeMenuStyle = function(obj) {
        $second_menu_v = jQuery(".second_menu_v");
        if ($second_menu_v.length > 0) {
            $second_menu_v.children().attr("src", $second_menu_v.children().attr("src").replace("white", "dark"));
            $second_menu_v.removeClass("second_menu_v");
        }
        jQuery(obj).addClass("second_menu_v");
        jQuery(obj).children().attr("src", jQuery(obj).children().attr("src").replace("dark", "white"));
    };

    realtimeAnalysis.titleTxts = {
        channel_realtime_container: 'images/realtimeAnalysis/channel_realtime_titletxt.png',
        channel_history_container: 'images/realtimeAnalysis/channel_history_titletxt.png',
        program_history_container: 'images/realtimeAnalysis/program_history_titletxt.png',
    };

    realtimeAnalysis.changeTitleTxt = function(container, obj) {
        var titleTxt = this.titleTxts[jQuery(obj).attr('id')];
        if (titleTxt) {
            jQuery('#' + container + ' #au_analysis_titletxt').attr('src', titleTxt);
        }
    };

    realtimeAnalysis.setClock = function() {
        if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }

        this.clockTime = new Date().getTime();

        var self = this;
        this.clockInterval = setInterval(function() {
            self.updateClock();
        }, 1000);
    };

    realtimeAnalysis.updateClock = function() {
        this.clockTime += 1000;
        var clock;
        if ( clock = jQuery('[id=au_analysis_clock]')) {
            clock.html(this.getTimeStr(this.clockTime));
        } else if (this.clockInterval) {
            clearInterval(this.clockInterval);
            this.clockInterval = null;
        }
    };

    realtimeAnalysis.getTimeStr = function(time) {
        var _date = new Date(time);
        var year = _date.getFullYear();
        var month = _date.getMonth();
        var date = _date.getDate();
        var hours = _date.getHours();
        var mins = _date.getMinutes();
        var secs = _date.getSeconds();

        year = String(year);
        month = month > 8 ? String(month + 1) : '0' + (month + 1);
        date = date > 9 ? String(date) : '0' + date;
        hours = hours > 9 ? String(hours) : '0' + hours;
        mins = mins > 9 ? String(mins) : '0' + mins;
        secs = secs > 9 ? String(secs) : '0' + secs;

        return year + '-' + month + '-' + date + ' ' + hours + ':' + mins + ':' + secs;
    };

    realtimeAnalysis.analyzeChannelRealtime = function(container, obj) {
        // this.changeMenuStyle(obj);
        this.changeTitleTxt(container, obj);
        var jses = window.JS.loadDependence([{
            module: 'StyledSwitcher',
            path: '../../../uiWidget/styledSwitcher.js',
            environment: window
        }, {
            module: 'auAnalysis.ChannelPicker',
            path: '../channelPicker.js'
        }, {
            module: 'StyledList',
            path: '../../../uiWidget/styledList.js',
            environment: window,
        }, {
            module: 'auAnalysis.ChannelInfoListChart',
            path: 'listChart.js'
        }, {
            module: 'auAnalysis.ChartAxes',
            path: '../chartAxes.js',
        }, {
            module: 'auAnalysis.ChannelBarView',
            path: 'channelBarView.js'
        }, {
            module: 'auAnalysis.ChannelInfoBarChart',
            path: 'barChart.js'
        }, {
            module: 'auAnalysis.channelRealtime',
            path: 'channelRealtime.js'
        }]);

        jses.push({
            name: 'chRlinit.js',
            removable: true
        });
        uiUtil.includePage(jQuery('#' + container + ' #au_analysis_content')[0], 'content/realtimeAnalysis/channelRealtime', 'channel_realtime.html', jses);
    };

    realtimeAnalysis.analyzeChannelHistory = function(container, obj) {
        // this.changeMenuStyle(obj);
        this.changeTitleTxt(container, obj);
        var jses = window.JS.loadDependence([{
            module: 'StyledSwitcher',
            path: '../../../uiWidget/styledSwitcher.js',
            environment: window
        }, {
            module: 'Calendar',
            path: '../../../uiWidget/newCalendar.js',
            environment: window  
        }, {
            module: 'DatePicker',
            path: '../../../uiWidget/datePicker.js',
            environment: window            
        }, {
            module: 'auAnalysis.ChannelPicker',
            path: '../channelPicker.js',
        }, {
            module: 'StyledSelector',
            path: '../../../uiWidget/styledSelector.js',
            environment: window
        }, {
            module: 'auAnalysis.AuTimePicker',
            path: '../auTimePicker.js',
        }, {
            module: 'auAnalysis.ChartAxes',
            path: '../chartAxes.js',
        }, {
            module: 'auAnalysis.RatingLineChart',
            path: 'ratingLineChart.js',
        }, {
            module: 'auAnalysis.CHMultiBlocks',
            path: 'chMultiBlocks.js' 
        }, {
            module: 'auAnalysis.RatingInfoList',
            path: 'ratingInfoList.js',
        }, {
            module: 'auAnalysis.channelHistory',
            path: 'channelHistory.js'
        }]);

        jses.push({
            name: 'chHsinit.js',
            removable: true
        });
        uiUtil.includePage(jQuery('#' + container + ' #au_analysis_content')[0], 'content/realtimeAnalysis/channelHistory', 'channel_history.html', jses);
    };

    realtimeAnalysis.analyzeProgramHistory = function(container, obj) {
        // this.changeMenuStyle(obj);
        this.changeTitleTxt(container, obj);
        var jses = window.JS.loadDependence([{
            module: 'StyledSwitcher',
            path: '../../../uiWidget/styledSwitcher.js',
            environment: window
        }, {
            module: 'Calendar',
            path: '../../../uiWidget/newCalendar.js',
            environment: window  
        }, {
            module: 'auAnalysis.ChannelDropdown',
            path: 'channelDropdown.js',
        }, {
            module: 'auAnalysis.AuTimePicker',
            path: '../auTimePicker.js',
        }, {
            module: 'StyledSelector',
            path: '../../../uiWidget/styledSelector.js',
            environment: window
        }, {
            module: 'auAnalysis.ChartAxes',
            path: '../chartAxes.js',
        }, {
            module: 'auAnalysis.RatingBlockView',
            path: 'ratingBlockView.js',
        }, {
            module: 'auAnalysis.RatingSplitChart',
            path: 'ratingSplitChart.js',
        }, {
            module: 'auAnalysis.programHistory',
            path: 'programHistory.js'
        }]);
        
        jses.push({
            name: 'prHsinit.js',
            removable: true
        });
        uiUtil.includePage(jQuery('#' + container + ' #au_analysis_content')[0], 'content/realtimeAnalysis/programHistory', 'program_history.html', jses);
    };
    // @formatter:off
}(window.JS));
// @formatter:on
