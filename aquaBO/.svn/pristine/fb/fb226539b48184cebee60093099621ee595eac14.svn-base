(function($){

	var datePickerStyle = {
		iconImage: 'images/heatstats/style_datepicker_icon.png',
		calendarStyles: {
			navTitleBgColor: '#2ea2d7',
		}
	};

	var heatStats = {
		init: function(){
			var self = this;
			self.setTypeSelector();
			$('input[name=heat-stats-check]').on('change', function(){
				self.changeCheckPanel($(this).val());
			}).eq(0).click();
			$('#htsDownBtn').on('click', function(){
				self.downloadStats();
			});
		},
		setTypeSelector: function(){
			var sel = new StyledSelector({
				containerId: 'heatStatsType',
				styles: {
					optionHeight: 30,
					iconSize: 18,
					iconColor: '#2ea2d7',
					iconInnerColor: '#ffffff'
				},
				options: [{
					label: '栏目热度',
					value: '1'
				}, {
					label: '节目热度',
					value: '2'
				}, {
					label: '用户热度',
					value: '3'
				}]
			});
			sel.create();
			this.typeSelector = sel;
		},
		changeCheckPanel: function(val){
			var self = this;
			$('.heat-stats-check-panel').hide();
			$('#htStartDate').val('');
			$('#htEndDate').val('');
			switch(val){
			case 'day':
			case 'week':
			case 'month':
				$('#htsCheckCalPanel').show();
				self.buildCalendarPanel(val);
				break;
			case 'custom':
				$('#htsCheckCustom').show();
				if(self.intervalSelector == null){
					self.buildCustomPanel();
				} else {
					self.intervalSelector.onChange();
				}
				break;
			default:
				break;
			}
		},
		buildCalendarPanel: function(val){
			var self = this;
			var calper = new CalendarHelper();
			var frag = document.createDocumentFragment();
			for(var i = 0; i < 6; i+=1){
				var $row = $('<div>').addClass('hts-cal-row')
					.append(
						$('<div>').addClass('hts-cal-row-sel')
					).append(
						$('<div>').addClass('hts-cal-row-cels')
					).appendTo(frag);
				for(var j = 0; j < 7; j+=1){
					var index = i * 7 + j;
					var date = calper.date_list[index];
					var meta = calper.meta_list[index];
					var $cell = $('<div>').addClass(meta == 1 ? 'hts-cal-cell-cur' : 'hts-cal-cell-nocur')
						.append(
							$('<div>').addClass('hts-cal-cell-cir')
						).append(
							$('<div>').addClass('hts-cal-cell-txt').append(calper.date_list[index].getDate())
						).appendTo($row.children('.hts-cal-row-cels'));
				}
			}
			$('#htsCheckCalendar').empty().append(frag);
			switch(val){
			case 'day':
				var today = new Date();
				var k = today.getDate() - 1;
				$('.hts-cal-cell-cur').eq(k).addClass('hts-cal-day-selected');
				var tstr = self.formDateStr(today);
				$('#htStartDate').val(tstr);
				$('#htEndDate').val(tstr);
				break;
			case 'week':
				var today = new Date();
				var wday = today.getDay();
				var wfdate = new Date(today.setDate(today.getDate() + 0 - wday));
				var wfirst = wfdate.getDate() - 1;
				today = new Date();
				var wldate = new Date(today.setDate(today.getDate() + 6 - wday));
				var wlast = wldate.getDate() - 1;
				var $curs = $('.hts-cal-cell-cur');
				$curs.eq(wfirst).addClass('hts-cal-day-fsel');
				var $last = $curs.eq(wlast).addClass('hts-cal-day-fsel');
				var $wrow = $last.parent().parent().addClass('hts-cal-week-sel');
				var wfstr = self.formDateStr(wfdate);
				var wlstr = self.formDateStr(wldate);
				$('#htStartDate').val(wfstr);
				$('#htEndDate').val(wlstr);
				break;
			case 'month':
				var $curs = $('.hts-cal-cell-cur');
				$curs.first().addClass('hts-cal-day-fsel');
				$curs.last().addClass('hts-cal-day-fsel');
				var rowCurs = [];
				$('.hts-cal-row').each(function(i, row){
					if($(row).find('.hts-cal-cell-cur').length > 0){
						rowCurs.push(row);
					}
				});
				rowCurs.forEach(function(row){
					var $row = $(row);
					var curLen = $row.find('.hts-cal-cell-cur').length;
					if(curLen != 7){
						var $rowSel = $row.children('.hts-cal-row-sel');
						var rowSelWidth = curLen * 71 - 22;
						if($row.children().last().children().first().hasClass('hts-cal-cell-nocur')){
							var rowSelLeft = $row.find('.hts-cal-cell-nocur').length * 71 + 11;
							$rowSel.css('left', rowSelLeft + 'px').width(rowSelWidth);
						} else {
							$rowSel.width(rowSelWidth);
						}
					}
					$row.addClass('hts-cal-week-sel');
				});
				var mYear = calper.curr_month[0];
				var mMonth = calper.curr_month[1];
				var mfdate = new Date(mYear, mMonth, 1);
				var mldate = new Date(mYear, mMonth, calper.getMonthDays(calper.curr_month));
				var mfstr = self.formDateStr(mfdate);
				var mlstr = self.formDateStr(mldate);
				$('#htStartDate').val(mfstr);
				$('#htEndDate').val(mlstr);
				break;
			}
		},

		buildCustomPanel: function(){
			var self = this;
			var interSel = new StyledSelector({
				containerId: 'htsCustomSel',
				styles: {
					optionHeight: 30,
					iconSize: 18,
					iconColor: '#2ea2d7',
					iconInnerColor: '#ffffff'
				},
				options: [{
					label: '按日期',
					value: 'day'
				}, {
					label: '按周',
					value: 'week'
				}, {
					label: '按月',
					value: 'month'
				}]
			});
			interSel.create();
			self.intervalSelector = interSel;
			interSel.onChange = function(){
				var sel = this;
				$('.hts-custom-items').hide();
				$('#htStartDate').val('');
				$('#htEndDate').val('');
				var val = sel.getValue();
				switch(val){
				case 'day':
					$('#htsCustomDayShortcut').show();
					$('#htsCustomDay').show();
					var $check = $('#htsCustomDayDefault');
					$check.trigger('change');
					if(!$check.prop('checked')){
						$('#htStartDate').val(self.startDatePicker.getDateStr());
						$('#htEndDate').val(self.endDatePicker.getDateStr());
					}
					break;
				case 'week':
					$('#htsCustomDayShortcut').hide();
					$('#htsCustomWeek').show();
					var today = new Date();
					var wldate = new Date(today.setDate(today.getDate() + 0 - today.getDay() - 1));
					var wftmp = new Date(wldate);
					var weeknum = Number($('#htsCustomWeekNum').attr('data-num'));
					var wfdate = new Date(wftmp.setDate(wftmp.getDate() - weeknum * 7 + 1));
					var wfstr = self.formDateStr(wfdate);
					var wlstr = self.formDateStr(wldate);
					$('#htStartDate').val(wfstr);
					$('#htEndDate').val(wlstr);
					break;
				case 'month':
					$('#htsCustomDayShortcut').hide();
					$('#htsCustomMonth').show();
					var monthNum = Number($('#htsCustomMonthNum').attr('data-num'));
					var today = new Date();
					var mldate = new Date(today.setMonth(today.getMonth() - 1));
					var mftmp = new Date(mldate);
					var mfdate = new Date(mftmp.setMonth(mftmp.getMonth() - monthNum));
					var mfday = new Date(mfdate.getFullYear(), mfdate.getMonth(), 1);
					var mlYear = mldate.getFullYear();
					var mlMonth = mldate.getMonth();
					var mlDays = new CalendarHelper().getMonthDays([mlYear, mlMonth]);
					var mlday = new Date(mlYear, mlMonth, mlDays);
					var mfstr = self.formDateStr(mfday);
					var mlstr = self.formDateStr(mlday);
					$('#htStartDate').val(mfstr);
					$('#htEndDate').val(mlstr);
					break;
				default:
					break;
				}
			};

			var startPicker = new DatePicker($.extend({
				containerId: 'htsCustomDayFrom'
			}, datePickerStyle));
			var endPicker =new DatePicker($.extend({
				containerId: 'htsCustomDayTo'
			}, datePickerStyle));
			self.startDatePicker = startPicker;
			self.endDatePicker = endPicker;
			startPicker.onChange = function(){
				var dtstr = this.getDateStr();
				$('#htStartDate').val(dtstr);
			};
			endPicker.onChange = function(){
				var dtstr = this.getDateStr();
				$('#htEndDate').val(dtstr);
			};

			$('#htsCustomDayDefault').off().on('change', function(){
				var $check = $(this);
				if($check.prop('checked')){
					var today = new Date();
					endPicker.setCurrDate({year: today.getFullYear(), month: today.getMonth(), date: today.getDate()});
					endPicker.disable();
					var bfnum = Number($check.attr('data-num'));
					var bfdate = new Date(today.setDate(today.getDate() - bfnum));
					startPicker.setCurrDate({year: bfdate.getFullYear(), month: bfdate.getMonth(), date: bfdate.getDate()});
					startPicker.disable();
				} else {
					startPicker.enable();
					endPicker.enable();
				}
			});

			$('#htsCustomDayShortcut').show();
			$('#htsCustomDay').show();
		},

		formDateStr: function(date){
			var year = date.getFullYear();
			var month = date.getMonth();
			var dateNo = date.getDate();

			var str = '';
			str += year;
			str += '-' + this.preZero(month + 1);
			str += '-' + this.preZero(dateNo);
			return str;
		},

		preZero: function(num){
			var str = String(num);
			if(str.length < 2){
				str = '0' + str;
			}
			return str;
		},

		downloadStats: function(){
			var self = this;
			var startDate = $('#htStartDate').val();
			var endDate = $('#htEndDate').val();
			var htsType = self.typeSelector.getValue();

			if(startDate == ''){
				alert('请选择查询开始日期！');
				return;
			}

			if(endDate == ''){
				alert('请选择查询结束日期！');
				return;
			}

			if(startDate > endDate){
				alert('查询开始日期应不大于结束日期！');
				return;
			}

			var inter = $('input[name=heat-stats-check]:checked').val();
			var interType = '';
			if(inter == 'custom'){
				interType = self.intervalSelector.getValue();
			} else {
				interType = inter;
			}
			var url = PaaSDownloadHost + '/aquapaas/rest/multiapp/statistics/vh/report';
			url += '?type=' + htsType;
			url += '&start_date=' + encodeURIComponent(startDate);
			url += '&end_date=' + encodeURIComponent(endDate);
			url += '&interval=' + interType;
			console.log(url);
			window.open(url);

		}
	};
	heatStats.init();
	window.HeatStats = heatStats;
})(jQuery);
