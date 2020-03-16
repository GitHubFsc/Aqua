if(!window.CalPub)
	window.CalPub = {};

CalPub.Months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
CalPub.Weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
CalPub.Leap_Year_Month_Days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
CalPub.Nonleap_Year_Month_Days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
CalPub.Weekday_Order = [0, 1, 2, 3, 4, 5, 6];

/*
 * CalendarHelper是Calendar中主要的数据处理单元。
 */
function CalendarHelper(dest){
    this.first_weekday_pref = 0; //以周几作为一周第一天的偏好设置。

    this.curr_month = []; //日历当前显示的月份。

    this.date_list = []; //存储日历中显示的所有日期序列。
    this.meta_list = []; //存储对应于日期序列的冗余信息，当前仅记录了该日期是否是当前月的状态。
    
    this.setDateTo(dest);
}

CalendarHelper.prototype.isLeapYear = function(year){
    if(((year%4 == 0) && (year%100 != 0)) || (year%400 == 0))
        return true;
    return false;
};

CalendarHelper.prototype.getMonthDays = function(_month){
    var year = _month[0];
    var month = _month[1];
    if(this.isLeapYear(year))
        return CalPub.Leap_Year_Month_Days[month];
    return CalPub.Nonleap_Year_Month_Days[month];
};

CalendarHelper.prototype.getPrevMonth = function(curr_month){
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

CalendarHelper.prototype.getNextMonth = function(curr_month){
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

CalendarHelper.prototype.getNextDate = function(curr_month, date){
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

CalendarHelper.prototype.setDateTo = function(dest){
	this.setCurrFullDate(dest);
	this.getDateList();
};

CalendarHelper.prototype.refresh = function(){
	this.setCurrDate(this.curr_date);
    this.getDateList();
};

CalendarHelper.prototype.setCurrFullDate = function(dest){
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

CalendarHelper.prototype.setCurrDate = function(date){
	var days = this.getMonthDays(this.curr_month);
	this.curr_date = Math.max(Math.min(days, date), 1);
};

CalendarHelper.prototype.getDateList = function(){
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
        if(CalPub.Weekday_Order[i] == curr_first_weekday){
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
CalendarHelper.prototype.getMonthDateList = function(_month){
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
CalendarHelper.prototype.bindMonthDateListMeta = function(dest_list, origin_list, nums, direction, meta_list, meta){
    for(var i = 0; i < nums; i++){
        if(direction){
            dest_list.push(origin_list[i]);
        }else{
            dest_list.push(origin_list[origin_list.length - nums + i]);
        }
        meta_list.push(meta);
    }
};

CalendarHelper.prototype.monthChange = function(type, _dest){
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
function Calendar(containerId, dest){
    this.containerId = containerId;
    this.helper = new CalendarHelper(dest);

	this.btn_name = this.containerId + '-btn';
	this.date_name = this.containerId + '-date';
	
    this.active_date_elements = [];
    
    this.opened = false;
    
    this.setStyles();
}

Calendar.prototype.open = function(){
	this.refresh();
	this.opened = true;
};

Calendar.prototype.toggle = function(){
	if(this.opened){
		this.close();
	}else{
		this.open();
	}
};

Calendar.prototype.close = function(){
	var calendar = document.getElementById(this.containerId);
	if(calendar){
		calendar.innerHTML = '';
	}
	this.opened = false;
};

Calendar.prototype.refresh = function(){
    var calendar = document.getElementById(this.containerId);
    if(calendar){
    	calendar.innerHTML = this.draw();
    	this.styleCalendar();
    	this.refreshActiveDates();
    	this.bindEvents();
    }
};

Calendar.prototype.setStyles = function(obj){
	var confObj = obj || {};
	this.calendar_width = confObj.width || '20em';
	this.nav_title_height = confObj.navTitleHeight || '2em';
	this.nav_title_backgroundColor = confObj.navTitleBgColor || 'rgb(0,0,0)';
	this.dates_view_height = confObj.datesViewHeight || '13.5em';
	this.dates_view_gridColor = confObj.datesViewGridColor || 'rgb(226,226,226)';
	this.dates_view_cellColor = confObj.datesViewCellColor || 'white';
	this.weekdays_height = confObj.weekdaysHeight || '1.5em';
	this.weekdays_color = confObj.weekdaysColor || 'rgb(121,121,121)';
	this.curr_month_date_color = confObj.currMonthColor || 'rgb(121,121,121)';
	this.non_curr_month_date_color = confObj.nonCurrMonthColor || 'rgb(210,210,210)';
	this.align = confObj.align;
};

Calendar.prototype.styleCalendar = function(){
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
			textAlign: 'center',
			fontWeight: 'bold' 
		}).outerWidth(this.calendar_width).outerHeight(this.nav_title_height)
		.find('.calendar-nav-btn').css({
			cursor: 'pointer'
		});
		jqNavTitle.find('.calendar-month-label').css({
			cursor: 'default'
		});
		jqNavTitle.find('.calendar-year-label').css({
			cursor: 'default'
		});
		
		var jqDates = jQuery(dates_view);
		jqDates.find('.calendar-weekdays').css({
			color: this.weekdays_color
		}).find('.calendar-weekday').css({
			cursor: 'default'
		}).height(this.weekdays_height);
		
		var titleWidth = jqNavTitle.outerWidth();
		
		jqDates.css({
			backgroundColor: this.dates_view_gridColor,
			tableLayout: 'fixed',
			textAlign: 'center'
		}).outerWidth(titleWidth).outerHeight(this.dates_view_height)
		.find('td').css({
			backgroundColor: this.dates_view_cellColor
		});
		jqDates.find('.calendar-curr-month-date').css({
			color: this.curr_month_date_color,
			fontWeight: 'bold',
			cursor: 'pointer'
		});
		jqDates.find('.calendar-non-curr-month-date').css({
			color: this.non_curr_month_date_color,
			cursor: 'default'
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

Calendar.prototype.draw = function(){
    var _html = [];

    _html.push(this.drawNavTitle());
    _html.push(this.drawDatesView());

    return _html.join("");
};

Calendar.prototype.drawDatesView = function(){
    var _html = [];

    _html.push("<table class=\"calendar-dates-view\" cellspacing=\"1px\">");
    _html.push(this.drawDatesViewHead());
    _html.push(this.drawDatesViewBody());
    _html.push("</table>");

   	return _html.join("");
};

Calendar.prototype.drawDatesViewBody = function(){
    var grid = [];
    var label_list = [];
    var class_list = [];
    var name_list = [];
    var id_list = [];

    for(var i = 0; i < this.helper.date_list.length; i++){
        var label = this.helper.date_list[i].getDate();
        label_list.push(label);
        var meta = this.helper.meta_list[i];
        class_list.push( meta ? " class=\"calendar-curr-month-date\" " : " class=\"calendar-non-curr-month-date\" ");
        name_list.push( meta ? " name=\"" + this.date_name + "\" " : "");
        id_list.push( meta ? " id=\"" + this.containerId + "-curr-month-date-" + label + "\" ": "");
    }

    grid.push("<tbody class=\"calendar-dates\">");
    var index = 0;
    for(var i=0; i < 6; i++){
        grid.push("<tr>");
        for(var j=0; j < 7; j++){

            var td = "<td" + class_list[index] + name_list[index] + id_list[index] + ">" + String(label_list[index]) + "</td>";

            grid.push(td);
            index++;
        }
        grid.push("</tr>");
    }
    grid.push("</tbody>");

    return grid.join("");
};

Calendar.prototype.drawDatesViewHead = function(){
    var title = [];
    var title_label_list = [];

    for(var i=0; i<7; i++){
        title_label_list.push(CalPub.Weekdays[CalPub.Weekday_Order[i]]);
    }

    title.push("<thead class=\"calendar-weekdays\"><tr>");
    for(var i=0; i<7; i++){
        var td = "<td class=\"calendar-weekday\" calendarweekday=\"" + CalPub.Weekday_Order[i] + "\">" + title_label_list[i] + "</td>";
        title.push(td);
    }
    title.push("</tr></thead>");

    return title.join("");
};

Calendar.prototype.drawNavTitle = function(){
    var _html = [];

    var name = " name=\"" + this.btn_name + "\" ";
    var back_year_id = " id=\"" + this.containerId + '-back-year"';
    var back_month_id = " id=\"" + this.containerId + '-back-month"';
    var forw_month_id = ' id="' + this.containerId + '-forw-month"';
    var forw_year_id = ' id="' + this.containerId + '-forw-year"';

    var back_year = "<td calendarfunc=\"calendar-back-year\" class=\"calendar-nav-btn\"" + name + back_year_id + ">" + "<<"  + "</td>";
    var back_month = "<td calendarfunc=\"calendar-back-month\" class=\"calendar-nav-btn\"" + name + back_month_id + ">" + "<" + "</td>";
    var forw_month = "<td calendarfunc=\"calendar-forw-month\" class=\"calendar-nav-btn\"" + name + forw_month_id + ">" + ">" + "</td>";
    var forw_year = "<td calendarfunc=\"calendar-forw-year\" class=\"calendar-nav-btn\""+ name + forw_year_id + ">" +">>" + "</td>";

    var year = this.helper.curr_month[0];
    var month = this.helper.curr_month[1];
    var month_label = CalPub.Months[month];
    var year_label = String(year);
    var month_box = "<td class=\"calendar-month-label\">" +
        month_label + "</td>";
    var year_box = "<td class=\"calendar-year-label\">" +
        year_label + "</td>";

    _html.push("<table class=\"calendar-nav-title\" cellspacing=\"0px\"><tr>");
    _html.push(back_year);
    _html.push(back_month);
    _html.push(month_box);
    _html.push(year_box);
    _html.push(forw_month);
    _html.push(forw_year);
    _html.push("</tr></table>");

    return _html.join("");
};

Calendar.prototype.monthChange = function(type, dest){
    this.helper.monthChange(type, dest);
    this.refresh();
};

Calendar.prototype.onClick = function(dateElement){
	var calendarFunc = jQuery(dateElement).attr('calendarfunc');
    switch(calendarFunc){
        case "calendar-back-year":
            this.monthChange(-2);
            break;
        case "calendar-back-month":
            this.monthChange(-1);
            break;
        case "calendar-forw-month":
            this.monthChange(1);
            break;
        case "calendar-forw-year":
            this.monthChange(2);
            break;
        default:
            this.clickOnCurrMonthDate(dateElement);
            break;
    }
};

Calendar.prototype.clickOnCurrMonthDate = function(dateElement){
	var date = parseInt(dateElement.innerHTML, 10);
	if(isNaN(date))
		return;
	this.helper.setCurrDate(date);
	this.onCalendarClick(dateElement);
};

/*
 * 供在click事件下进行扩展处理自定义内容的方法。dateElement是当前发生click事件的元素。
 */
Calendar.prototype.onCalendarClick = function(dateElement){
};


Calendar.prototype.getClickables = function(){
    var clickables = [];

    var btns = document.getElementsByName(this.btn_name);
    var dates = document.getElementsByName(this.date_name);
    for(var i = 0; i< btns.length; i++)
        clickables.push(btns[i]);
    for(var j = 0; j < dates.length; j++)
        clickables.push(dates[j]);

    return clickables;
};

Calendar.prototype.refreshActiveDates = function(){
    this.active_date_elements = [];
    this.active_date_elements = document.getElementsByName(this.date_name);
    this.onCalendarRefresh(this.active_date_elements);
};

/*
 * 供在日历刷新时进行扩展处理自定义内容的方法，date_list为当前月的日期元素数组。
 */
Calendar.prototype.onCalendarRefresh = function(date_list){
};

Calendar.prototype.bindEvents = function(){
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

Calendar.prototype.getCurrYear = function(){
	return this.helper.curr_month[0];
};

Calendar.prototype.getCurrMonth = function(){
	return this.helper.curr_month[1];
};

Calendar.prototype.getCurrDate = function(){
	return this.helper.curr_date;
};

Calendar.prototype.getCurrDateElement = function(){
	var date = this.helper.curr_date;
	return this.active_date_elements[date - 1];
};

Calendar.prototype.getCurrMonthDateElements = function(){
	return this.active_date_elements;
};

Calendar.prototype.getDateElement = function(date){
	var elementIndex = parseInt(date, 10);
	if(!isNaN(elementIndex)){
		return this.active_date_elements[elementIndex - 1];
	}	
};

Calendar.prototype.setCurrDate = function(dest, silent){
	this.helper.setDateTo(dest);
	if(!silent)
		this.refresh();
};
