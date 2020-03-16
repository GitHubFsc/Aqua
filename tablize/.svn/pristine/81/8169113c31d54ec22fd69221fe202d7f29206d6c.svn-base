var TimePicker = (function ($, Calendar, Combo) {
  var Pane = {
    widget: {},
    create(opts) {
      var dateImage = new Image();
      dateImage.src = opts.dateIcon;
      var hourImage = new Image();
      hourImage.src = opts.hourIcon;
      $('#' + opts.containerId).empty().css({
        display: 'flex',
        height: opts.height,
        width: opts.width,
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }).append(
        //date picker
        $('<div id="' + opts.containerId + '_date_input">').css({
          height: opts.height,
          lineHeight: (parseInt(opts.height) + 2) + 'px',
          width: opts.dateWidth - 10,
          border: opts.border,
          backgroundImage: 'url(' + opts.dateIcon + ')',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: opts.dateIconPosition + ' center',
          paddingLeft: '10px',
          fontSize: '14px'
        })
      ).append(
        //hour combo
        $('<div id="' + opts.containerId + '_hour_input">').css({
          height: opts.height,
          lineHeight: (parseInt(opts.height) + 2) + 'px',
          width: opts.hourWidth - 10,
          border: opts.border,
          backgroundImage: 'url(' + opts.hourIcon + ')',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: opts.hourIconPosition + ' center',
          paddingLeft: '10px',
          fontSize: '14px'
        })
      ).append(
        // 伸缩
        $('<div id="' + opts.containerId + '_calendar_ctn"></div>').css({
          backgroundColor: '#efefef',
          width: 299,
          height: 282,
          position: 'fixed',
          top: $('#' + opts.containerId).offset().top + $('#' + opts.containerId).height() + 5,
          left: $('#' + opts.containerId).offset().left + $('#' + opts.containerId).width() - 299,
          border: '1px solid #cbcbcb',
          display: 'flex',
          flexFlow: 'column',
          visibility: 'hidden',
          zIndex: '999'
        }).append(
          $('<div id="' + opts.containerId + '_calendar">').css({
            width: 279,
            height: 186,
            margin: '5px auto'
          })
        ).append(
          $('<div>').css({
            height: 30,
            width: 279,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '5px auto',
            fontSize: '14px'
          }).append(
            $('<div id="' + opts.containerId + '_hour">')
          ).append(
            '时'
          ).append(
            '：'
          ).append(
            $('<div id="' + opts.containerId + '_minute">')
          ).append(
            '分'
          )
        ).append(
          $('<div>').css({
            margin: '7px auto',
            borderTop: '1px solid #fff',
            borderBottom: '1px solid #d0d0d0',
            width: 279
          })
        ).append(
          $('<div>').css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: 279,
            margin: '0 auto'
          }).append(
            $('<div id="' + opts.containerId + '_btn">' + i18n('USERGROUP_QUEDING') + '</div>').css({
              padding: '0 27px',
              backgroundColor: '#2ea2d7',
              color: '#fff',
              borderRadius: '1px',
              border: '1px solid #597f89'
            })
          )
        )
      );
    },
    initWidgets({
      widgets, opts, value
    }) {
      var calendar = new Calendar(opts.containerId + '_calendar', {
        year: (new Date()).getFullYear(),
        month: (new Date()).getMonth(),
        date: (new Date()).getDate()
      })
      calendar.setStyles(opts.calendarStyles);
      calendar.onCalendarClick = (el) => {
        $(el).parentsUntil('table').find('td.calendar-curr-month-date').css({
          backgroundColor: opts.calendarStyles.datesViewCellColor,
          color: opts.calendarStyles.currMonthColor
        });
        $(el).css({
          backgroundColor: '#2ea2d7',
          color: '#fff'
        });
      }
      calendar.open();
      //combo
      var combo_s = new Combo('#' + opts.containerId + '_hour', Array.apply(null, {
        length: 24
      }).map((item, idx) => {
        var val = new String(idx).padStart(2, '0');
        return {
          key: val,
          value: val
        }
      }), {
        backgroundIMGStyle: 2,
        width: "100%",
        height: 30,
        background: "#ffffff",
        selectbackground: "#ffffff",
        disablebackground: "#f6f6f6",
        disableborder: "#c6c6c6",
        ScrollBarHeight: 120
      }, () => {

      })
      var combo_e = new Combo('#' + opts.containerId + '_minute', Array.apply(null, {
        length: 60
      }).map((item, idx) => {
        var val = new String(idx).padStart(2, '0');
        return {
          key: val,
          value: val
        }
      }), {
        backgroundIMGStyle: 2,
        width: "100%",
        height: 30,
        background: "#ffffff",
        selectbackground: "#ffffff",
        disablebackground: "#f6f6f6",
        disableborder: "#c6c6c6",
        ScrollBarHeight: 120
      }, () => {

      })
      $('#' + opts.containerId + '_btn').bind('click', (e) => {
        if(e.target == e.currentTarget) {
          e.stopPropagation();
          value = {
            date: [calendar.getCurrYear(), String(calendar.getCurrMonth() + 1).padStart(2, '0'), String(calendar.getCurrDate()).padStart(2, '0')].join('-'),
            hour: [combo_s.getValue(), combo_e.getValue(), '00'].join(":")
          }
          $('#' + opts.containerId + '_calendar_ctn').css('visibility', 'hidden');
          $('#' + opts.containerId + '_date_input').empty().html(value.date);
          $('#' + opts.containerId + '_hour_input').empty().html(value.hour);
        }
      });
      $('#' + opts.containerId).on('click', '*', (e) => {
        if(e.target == e.currentTarget) {
          let cal = $('#' + opts.containerId + '_calendar_ctn');
          cal.css('visibility', 'visible');
          var lose_focus = (e2) => {
            if($(e2.target).parents('#' + opts.containerId).length !== 0) {
              $(document.body).one('mousedown', lose_focus);
            } else {
              cal.css('visibility', 'hidden')
            }
          }
          $(document.body).one('mousedown', lose_focus)
        }
      });

      widgets.calendar = calendar;
      widgets.hour = combo_s;
      widgets.minute = combo_e;

      var getTimezone = () => {
        var offset = new Date().getTimezoneOffset()
        return [(offset < 0 ? '+' : '-'), String(Math.abs(offset) / 60).padStart(2, '0'), '00'].join('')
      }

      var getValue = () => {
        return [value.date, value.hour].join('T') + getTimezone();
      }
      var setValue = (str) => {
        //es 6 特性
        if(str) {
          // var regexp = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/g;
          var regexp = new RegExp('^(\\d{4}-\\d{2}-\\d{2})T(\\d{2}:\\d{2})')
          var array = regexp.exec(str);
          var date = (array && array[1])||'';
          var hour = (array && array[2])||'';
          // let {
          //   date, hour
          // } = /^(?<date>\d{4}-\d{2}-\d{2})T(?<hour>\d{2}:\d{2})/.exec(str).groups
          if(date && hour) {
            value = {
              date: date,
              hour: hour
            }
            Pane.load({
              widgets, opts, value
            });
          }
        }
      }

      return {
        getValue, setValue
      }
    },
    load({
      widgets, opts, value
    }) {
      var tmp_date = value.date.split('-');
      var cal_val = {
        year: tmp_date[0],
        month: tmp_date[1],
        date: tmp_date[2],
      };
      var tmp_hour = value.hour.split(':');
      var hour = tmp_hour[0];
      var minute = tmp_hour[1];

      widgets.calendar.setCurrDate(cal_val)
      widgets.hour.setValue(hour)
      widgets.minute.setValue(minute)
      $('#' + opts.containerId + '_date_input').empty().html(value.date);
      $('#' + opts.containerId + '_hour_input').empty().html(value.hour);
    }
  }
  var self = function (opts) {
    var value = {},
      widgets = {};
    Pane.create(opts);

    var func = Pane.initWidgets({
      widgets, opts, value
    })
    this.getValue = func.getValue
    this.setValue = func.setValue
  }
  return self;
})(jQuery, Calendar, newSelect);
