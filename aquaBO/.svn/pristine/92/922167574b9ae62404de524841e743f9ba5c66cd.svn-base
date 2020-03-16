// @formatter:off
(function(JS){

    var auAnalysis = JS.namespace('auAnalysis');
    // @formatter:on
    var AuTimePicker = auAnalysis.AuTimePicker = function(option) {
        this.hasChannel = option && option.hasChannel;
        this.dual = option && option.dual;
        this.changeListeners = [];
        this.pickerResult = null;
    };

    AuTimePicker.prototype = {
        init: function() {
        },

        getPicker: function() {
            // @formatter:off
            var self = this,
                timePicker = jQuery(document.createElement('div')),
                tpContent = jQuery(document.createElement('div')),
                cancelBtn = jQuery(document.createElement('p')),
                submitBtn = jQuery(document.createElement('p')),
                calendarCont = '<div id="au_time_picker_calendar"></div>',
                timesCont = jQuery(document.createElement('div')),
                timesContent = '<p class="au_time_picker_label" style="top:5px;">开始时间点：</p>' +
					'<div id="au_time_picker_start_hour"></div>' + '<p class="au_time_picker_split_front" style="top:24px;left:65px;">点：</p>' +
					'<div id="au_time_picker_start_min"></div>' + '<p class="au_time_picker_split_back" style="top:24px;left:165px;">分</p>' +
					'<p class="au_time_picker_label" style="top:75px;">结束时间点：</p>' +
					'<div id="au_time_picker_end_hour"></div>' + '<p class="au_time_picker_split_front" style="top:95px;left:65px;">点：</p>' +
					'<div id="au_time_picker_end_min"></div>' + '<p class="au_time_picker_split_back" style="top:95px;left:165px;">分</p>',
				channelsContent = '<p class="au_time_picker_label" style="top:5px;">频道名称：</p>' + 
		            '<div id="au_time_picker_channels_dropdown"></div>' +
		            '<p class="au_time_picker_label" style="top:60px;">栏目开始时间：</p>' +
                    '<div id="au_time_picker_start_hour"></div>' + '<p class="au_time_picker_split_front" style="top:79px;left:65px;">点：</p>' +
                    '<div id="au_time_picker_start_min"></div>' + '<p class="au_time_picker_split_back" style="top:79px;left:165px;">分</p>' +
                    '<p class="au_time_picker_label" style="top:130px;">栏目结束时间：</p>' +
                    '<div id="au_time_picker_end_hour"></div>' + '<p class="au_time_picker_split_front" style="top:150px;left:65px;">点：</p>' +
                    '<div id="au_time_picker_end_min"></div>' + '<p class="au_time_picker_split_back" style="top:150px;left:165px;">分</p>';		
		 
		  // @formatter:on

            timePicker.addClass('au_analysis_time_picker');
            tpContent.addClass('au_analysis_time_picker_content').append(calendarCont).append(timesCont);
            timesCont.addClass('au_analysis_time_picker_times_cont');
            if (this.hasChannel) {
                timesCont.append(channelsContent);
            } else {
                timesCont.append(timesContent);
            }
            cancelBtn.addClass('au_analysis_channel_picker_cancel_button').text('取消').click(function() {
                self.cancel();
            });
            submitBtn.addClass('au_analysis_channel_picker_submit_button').text('确定').click(function() {
                self.submit();
            });
            timePicker.append(tpContent).append(cancelBtn).append(submitBtn);

            this.pickerContainer = timePicker[0];
            return this.pickerContainer;
        },

        getDualPicker: function() {
            // @formatter:off
            var self = this,
                timePicker = jQuery(document.createElement('div')),
                tpContent = jQuery(document.createElement('div')),
                cancelBtn = jQuery(document.createElement('p')),
                submitBtn = jQuery(document.createElement('p')),
                timesCont = jQuery(document.createElement('div')),
                timesContent = '<p class="au_time_picker_label" style="top:5px;left:15px;">开始日期：</p>' +
                    '<div id="au_time_picker_date_picker_start"></div>' +
                    '<p class="au_time_picker_label" style="top:65px;left:15px;">结束日期：</p>' +
                    '<div id="au_time_picker_date_picker_end"></div>' +
                    '<p class="au_time_picker_label" style="top:130px;left:15px;">开始时间点：</p>' +
                    '<div id="au_time_picker_start_hour"></div>' + '<p class="au_time_picker_split_front" style="top:150px;left:80px;">点：</p>' +
                    '<div id="au_time_picker_start_min"></div>' + '<p class="au_time_picker_split_back" style="top:150px;left:180px;">分</p>' +
                    '<p class="au_time_picker_label" style="top:200px;left:15px;">结束时间点：</p>' +
                    '<div id="au_time_picker_end_hour"></div>' + '<p class="au_time_picker_split_front" style="top:220px;left:80px;">点：</p>' +
                    '<div id="au_time_picker_end_min"></div>' + '<p class="au_time_picker_split_back" style="top:220px;left:180px;">分</p>' +
                    '<div id="au_time_picker_shortcut">' + 
                    '<input type="checkbox" id="au_time_picker_shortcut_enable"/>过去' + 
                    '<input type="text" id="au_time_picker_shortcut_input"/>分钟' +
                    '</div>';
                    
            // @formatter:on

            timePicker.addClass('au_analysis_time_picker');
            timePicker.addClass('au_time_picker_dual');
            tpContent.addClass('au_analysis_time_picker_content').append(timesCont);
            timesCont.addClass('au_analysis_time_picker_times_cont');

            timesCont.append(timesContent);

            cancelBtn.addClass('au_analysis_channel_picker_cancel_button').text('取消').click(function() {
                self.cancel();
            });
            submitBtn.addClass('au_analysis_channel_picker_submit_button').text('确定').click(function() {
                self.submit();
            });
            timePicker.append(tpContent).append(cancelBtn).append(submitBtn);

            this.pickerContainer = timePicker[0];
            return this.pickerContainer;
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

                // @formatter:off
			if (typeof listener == 'function') {
			// @formatter:on

                    listener(this.pickerContainer);
                }
            }
        },

        cancel: function() {
            this.notifyChange();
        },

        submit: function() {
            if (!this.checkWidgets()) {
                return;
            }

            this.pickerResult = {
                beginHour: this.beginHourSel.getValue(),
                beginMin: this.beginMinSel.getValue(),
                endHour: this.endHourSel.getValue(),
                endMin: this.endMinSel.getValue(),
            };
            
            if (this.calendarSel) {
                this.pickerResult.date = {
                    year: this.calendarSel.getCurrYear(),
                    month: this.calendarSel.getCurrMonth(),
                    date: this.calendarSel.getCurrDate(),
                };
            }
             
            if(this.datePickerStart && this.datePickerEnd) {
                this.pickerResult.beginDate = {
                    year: this.datePickerStart.getYear(),
                    month: this.datePickerStart.getMonth(),
                    date: this.datePickerStart.getDate()
                };
                this.pickerResult.endDate = {
                    year: this.datePickerEnd.getYear(),
                    month: this.datePickerEnd.getMonth(),
                    date: this.datePickerEnd.getDate()
                };
            }
            
            if(this.shortcutEnable && this.shortcutInput){
                this.pickerResult.shortcutEnable = this.shortcutEnable.prop('checked');
                this.pickerResult.shortcutValue = this.shortcutInput.val();
            }

            if (this.channelSel) {
                this.pickerResult.channel = this.channelSel.getValue();
            }
            this.notifyChange();
        },

        refreshView: function() {
           
        },

        checkWidgets: function() {
            var self = this;
            var widgets = ['beginHourSel', 'beginMinSel', 'endHourSel', 'endMinSel'];
            if (this.hasChannel) {
                widgets.push('channelSel');
            }else if(this.dual){
                widgets.push('datePickerStart', 'datePickerEnd', 'shortcutEnable', 'shortcutInput');
            }else {
                widgets.push('calendarSel');
            }
          
            var pass = true;
            for (var i = 0, len = widgets.length; i < len; i++) {
                if (self[widgets[i]]) {

                } else {
                    pass = false;
                    break;
                }
            }

            return pass;
        },

        getResult: function() {
            return this.pickerResult;
        },
        
        setChosen: function(result){
            if(this.beginHourSel && typeof result.beginHour !== 'undefined'){
                this.beginHourSel.setValue(result.beginHour);
            }
            if(this.beginMinSel && typeof result.beginMin !== 'undefined'){
                this.beginMinSel.setValue(result.beginMin);
            }
            if(this.endHourSel && typeof result.endHour !== 'undefined'){
                this.endHourSel.setValue(result.endHour);
            }
            if(this.endMinSel && typeof result.endMin !== 'undefined'){
                this.endMinSel.setValue(result.endMin);
            }
            if(this.calendarSel && typeof result.date !== 'undefined'){
                this.calendarSel.setCurrDate(result.date);
            }
            if(this.datePickerStart && typeof result.beginDate !== 'undefined'){
                this.datePickerStart.setCurrDate(result.beginDate);
            }
            if(this.datePickerEnd && typeof result.endDate !== 'undefined'){
                this.datePickerEnd.setCurrDate(result.endDate);
            }
            if(this.shortcutEnable && typeof result.shortcutEnable !== 'undefined'){
                this.shortcutEnable.prop('checked', result.shortcutEnable);
            }
            if(this.shortcutInput && typeof result.shortcutValue !== 'undefined'){
                this.shortcutInput.val(result.shortcutValue);
            }
            if(this.channelSel && result.channelIds){
                this.channelSel.setChosen(result.channelIds);
            }
        }
    };
    // @formatter:off
}(window.JS));
// @formatter:on
