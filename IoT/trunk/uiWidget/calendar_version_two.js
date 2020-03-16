if(!window.CalPubVersionTwo)
	window.CalPubVersionTwo = {};

CalPubVersionTwo.Months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
CalPubVersionTwo.Weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
CalPubVersionTwo.Leap_Year_Month_Days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
CalPubVersionTwo.Nonleap_Year_Month_Days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
CalPubVersionTwo.Weekday_Order = [0, 1, 2, 3, 4, 5, 6];

/*
 * CalendarHelper是Calendar中主要的数据处理单元。
 */
function CalendarHelperVersionTwo(dest){
    this.first_weekday_pref = 0; //以周几作为一周第一天的偏好设置。

    this.curr_month = []; //日历当前显示的月份。

    this.date_list = []; //存储日历中显示的所有日期序列。
    this.meta_list = []; //存储对应于日期序列的冗余信息，当前仅记录了该日期是否是当前月的状态。
    
    this.setDateTo(dest);
}

CalendarHelperVersionTwo.prototype.isLeapYear = function(year){
    if(((year%4 == 0) && (year%100 != 0)) || (year%400 == 0))
        return true;
    return false;
};

CalendarHelperVersionTwo.prototype.getMonthDays = function(_month){
    var year = _month[0];
    var month = _month[1];
    if(this.isLeapYear(year))
        return CalPubVersionTwo.Leap_Year_Month_Days[month];
    return CalPubVersionTwo.Nonleap_Year_Month_Days[month];
};

CalendarHelperVersionTwo.prototype.getPrevMonth = function(curr_month){
    var year = curr_month[0];
    var month = curr_month[1];
    var prev = [];
    if(month > 0){
        prev.push(year);
        prev.push(month -1);
    }else{
        prev.push(year - 1);
        prev.push(11);
    }
    return prev;
};

CalendarHelperVersionTwo.prototype.getNextMonth = function(curr_month){
    var year = curr_month[0];
    var month = curr_month[1];
    var next = [];
    if(month< 11){
        next.push(year);
        next.push(month + 1);
    }else{
        next.push(year + 1);
        next.push(0);
    }
    return next;
};

CalendarHelperVersionTwo.prototype.getNextDate = function(curr_month, date){
	var next_date_year = curr_month[0];
	var next_date_month = curr_month[1];
	var next_date = date + 1;
	if(next_date > this.getMonthDays(curr_month)){
		next_date = 1;
		next_date_month += 1;
		if(next_date_month > 11){
			next_date_month = 0;
			next_date_year +=1;
		} 
	}
	return [next_date_year, next_date_month, next_date];
};

CalendarHelperVersionTwo.prototype.setDateTo = function(dest){
	this.setCurrFullDate(dest);
	this.getDateList();
};

CalendarHelperVersionTwo.prototype.refresh = function(){
	this.setCurrDate(this.curr_date);
    this.getDateList();
};

CalendarHelperVersionTwo.prototype.setCurrFullDate = function(dest){
	this.curr_month = [];
	
	var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var date = now.getDate();
    
    var hasDestYear = dest && (dest.year || dest.year == 0);
    var tmpYear;
    if(hasDestYear && (dest.year == 0))
    	tmpYear = 0;
    else
    	tmpYear = parseInt(hasDestYear, 10);
    this.curr_month.push(hasDestYear && !isNaN(tmpYear) ? tmpYear : year);
    
    var hasDestMonth = dest && (dest.month || dest.month == 0);
   	var tmpMonth;
   	if(hasDestMonth && (dest.month == 0))
   		tmpMonth = 0;
	else
		tmpMonth = Math.max(Math.min(11, parseInt(hasDestMonth, 10)), 0);   		
    this.curr_month.push(hasDestMonth && !isNaN(tmpMonth) ? tmpMonth : month);
    
    var hasDestDate = dest && dest.date;
    var tmpDate = parseInt(hasDestDate, 10);
    this.curr_date = hasDestDate && !isNaN(tmpDate) ? tmpDate : date;
    
    this.setCurrDate(this.curr_date);
};

CalendarHelperVersionTwo.prototype.setCurrDate = function(date){
	var days = this.getMonthDays(this.curr_month);
	this.curr_date = Math.max(Math.min(days, date), 1);
};

CalendarHelperVersionTwo.prototype.getDateList = function(){
    this.date_list = [];
    this.meta_list = [];

    var prev_month = this.getPrevMonth(this.curr_month);
    var next_month = this.getNextMonth(this.curr_month);

    var prev_list = this.getMonthDateList(prev_month);
    var curr_list = this.getMonthDateList(this.curr_month);
    var next_list = this.getMonthDateList(next_month);

    var curr_first_weekday = curr_list[0].getDay();
    var prev_nums = 0;
    for(var i=0; i<7; i++){
        if(CalPubVersionTwo.Weekday_Order[i] == curr_first_weekday){
            prev_nums = i;
            break;
        }
    }
    var curr_nums = curr_list.length;
    var next_nums = 42 - prev_nums - curr_nums;

    this.bindMonthDateListMeta(this.date_list, prev_list, prev_nums, 0, this.meta_list, 0);
    this.bindMonthDateListMeta(this.date_list, curr_list, curr_nums, 1, this.meta_list, 1);
    this.bindMonthDateListMeta(this.date_list, next_list, next_nums, 1, this.meta_list, 0);
};

/*
 * 取得输入月份从月初到月末的日期列表
 */
CalendarHelperVersionTwo.prototype.getMonthDateList = function(_month){
    var year = _month[0];
    var month = _month[1];

    var month_days = this.getMonthDays(_month);

    var date_list = [];
    for(var i = 1; i <= month_days; i++){
        var date = new Date(year, month, i);
        date_list.push(date);
    }
    return date_list;
};

/*
 * 处理前一月、当前月、后一月合并的中间方法
 */
CalendarHelperVersionTwo.prototype.bindMonthDateListMeta = function(dest_list, origin_list, nums, direction, meta_list, meta){
    for(var i = 0; i < nums; i++){
        if(direction){
            dest_list.push(origin_list[i]);
        }else{
            dest_list.push(origin_list[origin_list.length - nums + i]);
        }
        meta_list.push(meta);
    }
};

CalendarHelperVersionTwo.prototype.monthChange = function(type, _dest){
    var dest = [];
    if(!_dest){
        dest.push(this.curr_month[0]);
        dest.push(this.curr_month[1]);
    }else{
        dest = _dest;
    }
    switch(type){
        case -1:
            this.curr_month = this.getPrevMonth(this.curr_month);
            break;
        case 1:
            this.curr_month = this.getNextMonth(this.curr_month);
            break;
        case -2:
            this.curr_month[0] -= 1;
            break;
        case 2:
            this.curr_month[0] += 1;
            break;
        case 0:
            this.curr_month = dest;
            break;
        default:
            break;
    }
    this.refresh();
};

/*
 * Calendar
 */
function CalendarVersionTwo(containerId, dest){
    this.containerId = containerId;
    this.helper = new CalendarHelperVersionTwo(dest);

	this.btn_name = this.containerId + '-btn';
	this.date_name = this.containerId + '-date';
	
    this.active_date_elements = [];
    
    this.opened = false;
    
    this.setStyles();
}

CalendarVersionTwo.prototype.open = function(){
	this.refresh();
	this.opened = true;
};

CalendarVersionTwo.prototype.toggle = function(){
	if(this.opened){
		this.close();
	}else{
		this.open();
	}
};

CalendarVersionTwo.prototype.close = function(){
	var calendar = document.getElementById(this.containerId);
	if(calendar){
		calendar.innerHTML = '';
	}
	this.opened = false;
};

CalendarVersionTwo.prototype.refresh = function(){
    var calendar = document.getElementById(this.containerId);
    if(calendar){
    	calendar.innerHTML = this.draw();
    	this.styleCalendar();
    	this.refreshActiveDates();
    	this.bindEvents();
    }
};

CalendarVersionTwo.prototype.setStyles = function(obj){
	var confObj = obj || {};
	this.calendar_width = confObj.width || '428px';
	this.nav_title_height = confObj.navTitleHeight || '84px';
	this.nav_title_backgroundColor = confObj.navTitleBgColor || 'rgb(0,0,0)';
	this.dates_view_height = confObj.datesViewHeight || '13.5em';
	this.dates_view_gridColor = confObj.datesViewGridColor || '#ffffff';
	this.dates_view_cellColor = confObj.datesViewCellColor || '#ffffff';
	this.weekdays_height = confObj.weekdaysHeight || '1.5em';
	this.weekdays_color = confObj.weekdaysColor || '#a1a1a1';
	this.curr_month_date_color = confObj.currMonthColor || 'rgb(121,121,121)';
	this.non_curr_month_date_color = confObj.nonCurrMonthColor || 'rgb(210,210,210)';
	this.align = confObj.align;
};

CalendarVersionTwo.prototype.styleCalendar = function(){
	var calendar = document.getElementById(this.containerId);
	if(!calendar)
		return;
		
	var nav_title = calendar.children[0];
	var dates_view = calendar.children[1];
	
	if(nav_title && dates_view){
		var jqNavTitle = jQuery(nav_title);
		jqNavTitle.css({
			color: 'white',
			backgroundColor: this.nav_title_backgroundColor,
			tableLayout: 'fixed',
			textAlign: 'center'
		}).outerWidth(this.calendar_width).outerHeight(this.nav_title_height);
		
		var jqDates = jQuery(dates_view);
		jqDates.find('.calendar-weekdays').css({
			color: this.weekdays_color
		}).height(this.weekdays_height);
		
		var titleWidth = jqNavTitle.outerWidth();
		
		jqDates.css({
			backgroundColor: this.dates_view_gridColor,
		}).outerWidth(this.calendar_width).outerHeight(this.dates_view_height)
		.find('td').css({
			backgroundColor: this.dates_view_cellColor
		});
		jqDates.find('.calendar_curr_month_date').css({
			color: this.curr_month_date_color
		});
		jqDates.find('.calendar_non_curr_month_date').css({
			color: this.non_curr_month_date_color
		});
		 
		if(typeof this.align !== 'undefined'){
            var $container = jQuery(calendar);
            if($container.css('position') === 'static'){
                $container.css('position', 'relative');
            }
            if(this.align === 'left'){
                jqNavTitle.css({
                    position: 'absolute',
                    left: 0
                });
                jqDates.css({
                    position: 'absolute',
                    left: 0,
                    top: jqNavTitle.outerHeight()
                }); 
            }else if(this.align === 'right'){
                jqNavTitle.css({
                    position: 'absolute',
                    right: 0
                });
                jqDates.css({
                    position: 'absolute',
                    right: 0,
                    top: jqNavTitle.outerHeight()
                }); 
            }
        }
    }
};

CalendarVersionTwo.prototype.draw = function(){
    var _html = [];

    _html.push(this.drawNavTitle());
    _html.push(this.drawDatesView());

    return _html.join("");
};

CalendarVersionTwo.prototype.drawDatesView = function(){
    var _html = [];
    _html.push("<table class=\"calendar_dates_view\" cellpadding=\"0\" cellspacing=\"0\">");
    _html.push(this.drawDatesViewHead());
    _html.push(this.drawDatesViewBody());
    _html.push("</table>");
	
   	return _html.join("");
};

CalendarVersionTwo.prototype.drawDatesViewBody = function(){
    var grid = [];
    var label_list = [];
    var class_list = [];
    var name_list = [];
    var id_list = [];

    for(var i = 0; i < this.helper.date_list.length; i++){
        var label = this.helper.date_list[i].getDate();
        label_list.push(label);
        var meta = this.helper.meta_list[i];
        class_list.push( meta ? " class=\"calendar_curr_month_date\" " : " class=\"calendar_non_curr_month_date\" ");
        name_list.push( meta ? " name=\"" + this.date_name + "\" " : "");
        id_list.push( meta ? " id=\"" + this.containerId + "-curr-month-date-" + label + "\" ": "");
    }

    grid.push("<tbody class=\"calendar-dates\">");
    var index = 0;
    for(var i=0; i < 6; i++){
        grid.push("<tr>");
        for(var j=0; j < 7; j++){
            var td ="";
						if(class_list[index].indexOf("calendar_curr_month_date")!=-1)
            {
							td = "<td" + class_list[index] + name_list[index] + id_list[index] + "><div class=\"calendar_curr_month_date_button\">" + String(label_list[index]) + "</div></td>";
            }
						else{
							td = "<td" + class_list[index] + name_list[index] + id_list[index] + ">" + String(label_list[index]) + "</td>";
						}
            grid.push(td);
            index++;
        }
        grid.push("</tr>");
    }
		grid.push("<tr class=\"calendar_bottom\"><td colspan=\"7\"></td></div>");
    grid.push("</tbody>");

    return grid.join("");
};

CalendarVersionTwo.prototype.drawDatesViewHead = function(){
    var title = [];
    var title_label_list = [];

    for(var i=0; i<7; i++){
        title_label_list.push(CalPubVersionTwo.Weekdays[CalPubVersionTwo.Weekday_Order[i]]);
    }

    title.push("<thead class=\"calendar-weekdays\"><tr>");
    for(var i=0; i<7; i++){
        var td = "<td class=\"calendar_weekday\" calendarweekday=\"" + CalPubVersionTwo.Weekday_Order[i] + "\">" + title_label_list[i] + "</td>";
        title.push(td);
    }
    title.push("</tr></thead>");

    return title.join("");
};

CalendarVersionTwo.prototype.drawNavTitle = function(){
    var _html = [];

    var name = " name=\"" + this.btn_name + "\" ";
    var back_month_id = " id=\"" + this.containerId + '-back-month"';
    var forw_month_id = ' id="' + this.containerId + '-forw-month"';
    var year = this.helper.curr_month[0];
    var month = this.helper.curr_month[1];
    var month_label = String(year)+i18n("UIWIDGET_CALENDAR_YEAR")+CalPubVersionTwo.Months[month]+i18n("UIWIDGET_CALENDAR_MONTH");
		var backMonth_class="back_forw_month_button_dark";
		var forwMonth_class="back_forw_month_button_dark";
		if(typeof this.calendarMonthBackForw!='undefined'){
			if(this.calendarMonthBackForw=="back"){
				backMonth_class="back_forw_month_button_dark";
				forwMonth_class="back_forw_month_button_dark";
			}
			else{
				backMonth_class="back_forw_month_button_dark";
				forwMonth_class="back_forw_month_button_dark";
			}
		}
    var month_box = "<table class=\"calendar_month_label_container\"><tbody><tr><td><div style=\"width:100%;height:100%\"><div class=\"calendar_month_label\">" +
        month_label + "</div><div class=\"back_forw_month_container\"><div calendarfunc=\"calendar-back-month\" class=\"back_forw_month_button "+backMonth_class+"\" style=\"float:left\"" + name + back_month_id + "></div><div calendarfunc=\"calendar-forw-month\" class=\"back_forw_month_button "+forwMonth_class+" forw_month_button\" style=\"float:right\" " + name + forw_month_id + "></div></div></div></td></tr></tbody></table>";
    _html.push(month_box);
    //_html.push("</tr></table>");

    return _html.join("");
};

CalendarVersionTwo.prototype.monthChange = function(type, dest){
    this.helper.monthChange(type, dest);
    this.refresh();
};

CalendarVersionTwo.prototype.onClick = function(dateElement){
  var jq=jQuery;
	var calendarFunc = jq(dateElement).attr('calendarfunc');
    switch(calendarFunc){
        case "calendar-back-month":
				    this.calendarMonthBackForw="back";
            this.monthChange(-1);
						break;
        case "calendar-forw-month":
				    this.calendarMonthBackForw="forw";
            this.monthChange(1);
						break;
        default:
            this.clickOnCurrMonthDate(dateElement);
            break;
    }
};

CalendarVersionTwo.prototype.clickOnCurrMonthDate = function(dateElement){
	var dateValue=jQuery(dateElement).children().text();
	var date = parseInt(dateValue, 10);
	if(isNaN(date))
		return;
	this.helper.setCurrDate(date);
	this.onCalendarClick(dateElement);
};

/*
 * 供在click事件下进行扩展处理自定义内容的方法。dateElement是当前发生click事件的元素。
 */
CalendarVersionTwo.prototype.onCalendarClick = function(dateElement){
};


CalendarVersionTwo.prototype.getClickables = function(){
    var clickables = [];

    var btns = document.getElementsByName(this.btn_name);
    var dates = document.getElementsByName(this.date_name);
    for(var i = 0; i< btns.length; i++)
        clickables.push(btns[i]);
    for(var j = 0; j < dates.length; j++)
        clickables.push(dates[j]);

    return clickables;
};

CalendarVersionTwo.prototype.refreshActiveDates = function(){
    this.active_date_elements = [];
    this.active_date_elements = document.getElementsByName(this.date_name);
    this.onCalendarRefresh(this.active_date_elements);
};

/*
 * 供在日历刷新时进行扩展处理自定义内容的方法，date_list为当前月的日期元素数组。
 */
CalendarVersionTwo.prototype.onCalendarRefresh = function(date_list){
};

CalendarVersionTwo.prototype.bindEvents = function(){
    var clickables = this.getClickables();
    var _calendar = this;
    var _calCont = document.getElementById(this.containerId);
    for(var i=0; i < clickables.length; i++){
       var obj = clickables[i];
       jQuery(obj).bind('click', _calCont, function(ev){
            ev.originalEvent = ev.originalEvent || {};
            ev.originalEvent.dropdownDelegate = ev.data;
       	    _calendar.onClick(this);
       });
    }
};

CalendarVersionTwo.prototype.getCurrYear = function(){
	return this.helper.curr_month[0];
};

CalendarVersionTwo.prototype.getCurrMonth = function(){
	return this.helper.curr_month[1];
};

CalendarVersionTwo.prototype.getCurrDate = function(){
	return this.helper.curr_date;
};

CalendarVersionTwo.prototype.getCurrDateElement = function(){
	var date = this.helper.curr_date;
	return this.active_date_elements[date - 1];
};

CalendarVersionTwo.prototype.getCurrMonthDateElements = function(){
	return this.active_date_elements;
};

CalendarVersionTwo.prototype.getDateElement = function(date){
	var elementIndex = parseInt(date, 10);
	if(!isNaN(elementIndex)){
		return this.active_date_elements[elementIndex - 1];
	}	
};

CalendarVersionTwo.prototype.setCurrDate = function(dest, silent){
	this.helper.setDateTo(dest);
	if(!silent)
		this.refresh();
};
