var POEditor = (function($){

  function getNormalSelector(containerId, options){
    var selector = new StyledSelector({
      containerId: containerId,
      styles: {
        optionHeight: 25,
        iconSize: 14,
      },
      options: options
    });
    selector.getCloseIcon = function() {
      return '<div class="stuptact-styled-selector-up-arrow"></div>';
    };
    selector.getOpenIcon = function() {
      return '<div class="stuptact-styled-selector-down-arrow"></div>';
    };
    return selector;
  }

  function showMsgDialog(msg, callback) {
    var dialog = new OverlayDialog({
      url: 'content/userAdmin/msg-dialog.html',
      width: 470,
      height: 266,
      context: {},
      zIndex: 3000,
      id: 'user-admin-msg',
      callback: function() {
        $('#user-admin-msg-content').text(msg);
        $('#user-admin-msg-close').on('click', function() {
          dialog.close();
        });
        $('#user-admin-msg-cancel').on('click', function() {
          dialog.close();
        });
        $('#user-admin-msg-submit').on('click', function() {
          dialog.close();
          if ( typeof callback == 'function') {
            callback();
          }
        });
      }

    });
    dialog.open();
  }

  function preZero(num){
    var str = num.toString();
    if(str.length < 2){
      str = '0' + str;
    }
    return str;
  }

  function getSomeOption(num, start, timeStyle){
    var opts = [];
    num = num != null ? num : 0;
    start = start != null ? start: 0;
    for(var i = start; i < start + num; i+=1){
      var str = timeStyle ? preZero(i) : i.toString();
      opts.push({
        label: str,
        value: str
      });
    }
    return opts;
  }

  function getHourSelect(id){
    return getNormalSelector(id, getSomeOption(24, 0, true));
  }

  function getMinuteSelect(id){
    return getNormalSelector(id, getSomeOption(60, 0, true));
  }

  function getSecSelect(id){
    return getNormalSelector(id, getSomeOption(60, 0, true));
  }

  function UTCtoMyTime(str){
    var date = new Date(str);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
      hour: preZero(date.getHours()),
      min: preZero(date.getMinutes()),
      sec: preZero(date.getSeconds())
    };
  }

  function findSelfOption(options){
    var self = null;
    options = $.makeArray(options);
    $.each(options, function(i, option){
      if(option.scope == 'user:self'){
        self = option;
        return false;
      }
    });
    return self;
  }

  function showLongTip(el, str){
  	removeLongTip();
  	var pos = el.getBoundingClientRect();
  	$('<div>').attr('id', 'po-long-tip')
  		.text(str)
  		.css({
  			left: pos.left + 50,
  			top: pos.bottom + 10,
  		}).appendTo(document.body);
  }

  function removeLongTip(){
  	$('#po-long-tip').remove();
  }

  function getMetaInput(index, meta){
    var $row = $('<div>').addClass('user-admin-meta-row');
    $row.append(
      $('<label>').addClass('user-admin-meta-index').append(index)
    );
    $row.append(
      $('<input>').addClass('user-admin-meta-key').attr('placeholder', '在此填写Key')
        .val(meta && meta.key)

    );
    $row.append(
      $('<input>').addClass('user-admin-meta-value').attr('placeholder', '在此填写Key值')
        .val(meta && meta.value)
        .hover(function(){
          showLongTip(this, $(this).val());
        }, removeLongTip)
    );
    $row.attr('data-type', meta && meta.type);
    return $row;
  }

  var myTimeZone = '+0800';

  var datePickerStyle = {
    iconImage: 'images/heatstats/style_datepicker_icon.png',
    calendarStyles: {
      navTitleBgColor: '#2ea2d7',
    }
  };

  var editor = {
    init: function(offering){
      var self = this;
      self.pageNum = 1;
      self.pages = 3;
      self.offering = JSON.parse(JSON.stringify(offering));
      self.pageBuilt = {
        1: false,
        2: false,
        3: false
      };
      $('.po-editor-cancel').on('click', function(){
        self.back();
      });
    },

    pageBuild1: function(){
      var self = this;
      var po = self.offering;
      self.metaEditor.setValue(po.metadata);
      self.effectiveTime.setTime(po.effective_time);
      self.expireTime.setTime(po.expiration_time);
      self.cycleEditor.setCycle(po);
      $('#po-id').val(po.offering_id);
      $('#po-name').val(po.name);
      $('#po-type').val(po.offering_class);
      if(po.rule_asset){
        $('#po-rule-asset-tag').val(po.rule_asset.tags);
        $('#po-rule-asset-extra').val(function(extra){
          var str = '';
          var item = extra && extra[0];
          if(item){
            for(var i in item){
              if(item.hasOwnProperty(i)){
                str += i + ',';
                break;
              }
            }
            var jtem = item[i];
            for(var j in jtem){
              if(jtem.hasOwnProperty(j)){
                str += j + ',' + jtem[j];
                break;
              }
            }

          }
          return str;
        }(po.rule_asset.extra));
      }
      if(po.rule_user){
        $('#po-rule-user-tag').val(po.rule_user.tags);
      }
      if(po.rule_offering){
        $('#po-rule-offering-tag').val(po.rule_offering.tags);
      }
      $('#po-descript').val(po.description);

      if(self.type == 'view'){
        self.metaEditor.disable();
        self.effectiveTime.disable();
        self.expireTime.disable();
        self.cycleEditor.disable();
        $('#po-name').attr('disabled', true);
        $('#po-type').attr('disabled', true);
        $('#po-rule-asset-tag').attr('disabled', true);
        $('#po-rule-asset-extra').attr('disabled', true);
        $('#po-rule-user-tag').attr('disabled', true);
        $('#po-rule-offering-tag').attr('disabled', true);
        $('#po-descript').attr('disabled', true);
      }

      self.pageBuilt[1] = true;
    },

    pageSave1: function(){
      var self = this;
      var po = self.offering;
      po.name = $('#po-name').val();
      po.offering_class = $('#po-type').val();
      if(typeof po.rule_asset != 'object'){
        po.rule_asset = {};
      }
      po.rule_asset.tags = $('#po-rule-asset-tag').val();
      var extra = $('#po-rule-asset-extra').val().split(',');
      if(extra.length == 3){
        po.rule_asset.extra = [];
        po.rule_asset.extra[0] = {};
        po.rule_asset.extra[0][extra[0]] = {};
        po.rule_asset.extra[0][extra[0]][extra[1]] = extra[2];
      }
      if(typeof po.rule_user != 'object'){
        po.rule_user = {};
      }
      po.rule_user.tags = $('#po-rule-user-tag').val();
      if(typeof po.rule_offering != 'object'){
        po.rule_offering = {};
      }
      po.rule_offering.tags = $('#po-rule-offering-tag').val();
      po.description = $('#po-descript').val();
      po.metadata = self.metaEditor.getValue();
      po.effective_time = self.effectiveTime.getTime();
      po.expiration_time = self.expireTime.getTime();
      var cycles = self.cycleEditor.getCycle();
      po.big_cycle = cycles.big_cycle;
      po.second_cycle = cycles.second_cycle;
    },

    pageBuild2: function(){
      var self = this;
      self.repSelect = getNormalSelector('po-rep-purchase', [
      {label: '不允许', value: false},
      {label: '允许', value: true}
      ]).create();
      self.priCurSelect = getNormalSelector('po-pri-cur', [
      {label: '人民币(RMB)', value: 'RMB'},
      {label: '积分(credit)', value: 'credit'},
      {label: '互动券时间(ticket_time)', value: 'ticket_time'},
      ]).create();
      self.priTypeSelect = getNormalSelector('po-pri-type', [
      {label: '固定价格(fixed)', value: 'fixed'},
      {label: '原价折扣(discount)', value: 'discount'},
      {label: '促销价(alt_price)', value: 'alt_price'},
      {label: '原价立减(minus)', value: 'minus'},
      ]);
      self.priTypeSelect.onChange = function(){
        var val = this.getValue();
        switch(val){
        case 'fixed':
          $('#po-pri-tlab').text('价格');
          break;
        case 'discount':
          $('#po-pri-tlab').text('折扣');
          break;
        case 'alt_price':
          $('#po-pri-tlab').text('促销价');
          break;
        case 'minus':
          $('#po-pri-tlab').text('价格');
          break;
        default:
          break;
        }
      };
      self.priTypeSelect.create();
      self.ticketEffType = getNormalSelector('po-ticket-efftype', [
      {label: 'offering', value: 'offering'},
      {label: 'asset', value: 'asset'}
      ]).create();
      self.ticketLifeUnit = getNormalSelector('po-ticket-life-unit',[
      {label: '年', value: 'y'},
      {label: '月', value: 'M'},
      {label: '天', value: 'd'},
      {label: '小时', value: 'h'},
      {label: '分钟', value: 'm'},
      ]).create();

      var po = self.offering;
      if(po.allow_repeat_purchase != null){
        self.repSelect.setValue(po.allow_repeat_purchase);
      }
      var selfOption = findSelfOption(po.purchase_options);
      if (selfOption != null) {
        self.priCurSelect.setValue(selfOption.price_currency);
        self.priTypeSelect.setValue(selfOption.price_type);
        switch(selfOption.price_type) {
        case 'fixed':
          $('#po-price-in').val(selfOption.price);
          break;
        case 'discount':
          $('#po-price-in').val(selfOption.discount);
          break;
        case 'alt_price':
          break;
        case 'minus':
          $('#po-price-in').val(selfOption.price);
          break;
        default:
          break;
        }
        self.ticketEffType.setValue(selfOption.ticket_lifetime_type);
        var ticketLifeNum = parseInt(selfOption.ticket_lifetime);
        if (!isNaN(ticketLifeNum)) {
          $('#po-ticket-life-in').val(ticketLifeNum);
          self.ticketLifeUnit.setValue(selfOption.ticket_lifetime.replace(ticketLifeNum.toString(), ''));
        }
      }

      if(self.type == 'view'){
        self.repSelect.disable();
        self.priCurSelect.disable();
        self.priTypeSelect.disable();
        $('#po-price-in').attr('disabled', true);
        self.ticketEffType.disable();
        $('#po-ticket-life-in').attr('disabled', true);
        self.ticketLifeUnit.disable();
      }

      self.pageBuilt[2] = true;
    },

    pageSave2: function(){
      var self = this;
      var po = self.offering;
      po.allow_repeat_purchase = self.repSelect.getValue();
      if(po.purchase_options == null){
        po.purchase_options = [];
      }
      var selfOption = findSelfOption(po.purchase_options);
      if(selfOption == null){
        selfOption = {
          scope: 'user:self'
        };
        po.purchase_options.push(selfOption);
      }
      selfOption.price_currency = self.priCurSelect.getValue();
      selfOption.price_type = self.priTypeSelect.getValue();
      switch(selfOption.price_type){
      case 'fixed':
        selfOption.price = $('#po-price-in').val();
        break;
      case 'discount':
        selfOption.discount = $('#po-price-in').val();
        break;
      case 'alt_price':
        selfOption.alt_price_metadata_key = 'alt_price';
        break;
      case 'minus':
        selfOption.price = $('#po-price-in').val();
        break;
      default:
        break;
      }
      selfOption.ticket_lifetime_type = self.ticketEffType.getValue();
      var lftNum = $('#po-ticket-life-in').val();
      if(lftNum != ''){
        selfOption.ticket_lifetime = lftNum + self.ticketLifeUnit.getValue();
      }

    },

    pageBuild3: function(){
      var self = this;
      self.limitUseOffering = getNormalSelector('po-limit-useoff', [
      {label: '否', value: false},
      {label: '是', value: true}
      ]).create();
      self.limCycNum = getNormalSelector('po-lcount-num', getSomeOption(12,1,false)).create();
      self.limCycUnit = getNormalSelector('po-lcount-lab', [
      {label: '年', value: 'y'},
      {label: '月', value: 'M'},
      {label: '周', value: 'w'},
      ]).create();
      self.limImmd = getNormalSelector('po-ls-imm', [
      {label: '否', value: false},
      {label: '是', value: true}
      ]).create();

      var po = self.offering;
      if(po.limit_use_offering != null){
        self.limitUseOffering.setValue(po.limit_use_offering);
      }
      $('#po-limit-upto').val(po.limit_time_range_count);
      $('#po-limit-count').val(po.limit_count);
      if(po.limit_time_range){
        var rangNum = parseInt(po.limit_time_range);
        if(!isNaN(rangNum)){
          self.limCycNum.setValue(rangNum.toString());
          self.limCycUnit.setValue(po.limit_time_range.replace(rangNum.toString(), ''));
        }
      }
      if(po.limit_from_natural_time != null){
        self.limImmd.setValue(po.limit_from_natural_time);
      }
      $('#po-ltotal-count').val(po.limit_total_count);

      if(self.type == 'view'){
        self.limitUseOffering.disable();
        $('#po-limit-upto').attr('disabled', true);
        $('#po-limit-count').attr('disabled', true);
        self.limCycNum.disable();
        self.limCycUnit.disable();
        self.limImmd.disable();
        $('#po-ltotal-count').attr('disabled', true);
      }

      self.pageBuilt[3] = true;
    },

    pageSave3: function(){
      var self = this;
      var po = self.offering;
      po.limit_use_offering = self.limitUseOffering.getValue();
      if(po.limit_use_offering === true){
        po.limit_time_range_count = $('#po-limit-upto').val();
        po.limit_count = $('#po-limit-count').val();
        po.limit_time_range = self.limCycNum.getValue() + self.limCycUnit.getValue();
        po.limit_from_natural_time = self.limImmd.getValue();
        po.limit_total_count = $('#po-ltotal-count').val();
      } else {
        po.limit_use_offering = false;
      }
    },

    effectiveTime: {
      init: function(){
        this.picker = new DatePicker($.extend({
          containerId: 'po-efftime-picker'
        }, datePickerStyle));
        this.hourSelect = getHourSelect('po-efftime-hour').create();
        this.minSelect = getMinuteSelect('po-efftime-min').create();
        this.secSelect = getSecSelect('po-efftime-sec').create();
      },

      getTime: function(){
        var date = this.picker.getDateStr();
        var h = this.hourSelect.getValue();
        var m = this.minSelect.getValue();
        var s = this.secSelect.getValue();
        if(date == null){
          return undefined;
        } else {
          var str = date + 'T' + h + ':' + m + ':' + s + myTimeZone;
          return str;
        }
      },

      setTime: function(str){
        this.init();
        if(str != null){
          var obj = UTCtoMyTime(str);
          this.picker.setCurrDate(obj);
          this.hourSelect.setValue(obj.hour);
          this.minSelect.setValue(obj.min);
          this.secSelect.setValue(obj.sec);
        }
      },

      disable: function(){
        this.picker.disable();
        this.hourSelect.disable();
        this.minSelect.disable();
        this.secSelect.disable();
      }
    },

    expireTime: {
      init: function(){
        this.picker = new DatePicker($.extend({
          containerId: 'po-exptime-picker'
        }, datePickerStyle));
        this.hourSelect = getHourSelect('po-exptime-hour').create();
        this.minSelect = getMinuteSelect('po-exptime-min').create();
        this.secSelect = getSecSelect('po-exptime-sec').create();
      },

      getTime: function(){
        var date = this.picker.getDateStr();
        var h = this.hourSelect.getValue();
        var m = this.minSelect.getValue();
        var s = this.secSelect.getValue();
        if(date == null){
          return undefined;
        } else {
          var str = date + 'T' + h + ':' + m + ':' + s + myTimeZone;
          return str;
        }
      },

      setTime: function(str){
        this.init();
        if(str != null){
          var obj = UTCtoMyTime(str);
          this.picker.setCurrDate(obj);
          this.hourSelect.setValue(obj.hour);
          this.minSelect.setValue(obj.min);
          this.secSelect.setValue(obj.sec);
        }
      },

      disable: function(){
        this.picker.disable();
        this.hourSelect.disable();
        this.minSelect.disable();
        this.secSelect.disable();
      }
    },

    cycleEditor: {
      init: function(){
        this.bigCycle = getNormalSelector('po-big-cycle', [
          {label: '月', value: 'month'},
          {label: '周', value: 'week'},
          {label: '日', value: 'day'},
        ]);
        this.bigCycle.onChange = function(){
          var val = this.getValue();
          $('.po-second-cycle').hide();
          $('.po-second-cycle[data-cycle="'+ val +'"]').show();
        };
        this.secondMonth.init();
        this.secondWeek.init();
        this.secondDay.init();
        this.bigCycle.create();
      },

      setCycle: function(offering){
        this.init();
        if(offering.big_cycle != null){
          this.bigCycle.setValue(offering.big_cycle);
          switch(offering.big_cycle){
          case 'month':
            this.secondMonth.setValue(offering.second_cycle);
            break;
          case 'week':
            this.secondWeek.setValue(offering.second_cycle);
            break;
          case 'day':
            this.secondDay.setValue(offering.second_cycle);
            break;
          }
        }
      },

      getCycle: function(){
        var obj = {};
        obj.big_cycle = this.bigCycle.getValue();
        switch(obj.big_cycle){
        case 'month':
          obj.second_cycle = this.secondMonth.getValue();
          break;
        case 'week':
          obj.second_cycle = this.secondWeek.getValue();
          break;
        case 'day':
          obj.second_cycle = this.secondDay.getValue();
          break;
        }
        return obj;
      },

      secondMonth: {
        init: function(){
          var table = $('<table><tbody></tbody></table>').attr('cellspacing', 1).attr('cellpadding', 0);
          var tbody = table.children('tbody').eq(0);
          var d = 1;
          for(var i = 0; i < 3; i+=1){
            var tr = $('<tr>').appendTo(tbody);
            for(var j = 0; j < 12; j+=1){
              var td = $('<td>').appendTo(tr);
              if(d <= 31){
                td.append(
                  $('<div>').addClass('po-secy-date').attr('data-date', d).append(d)
                  .on('click', function(){
                    $(this).toggleClass('po-secy-date-selected');
                  })
                );
              }
              d+=1;
            }
          }
          $('#po-secy-month').empty().append(table);
        },

        setValue: function(val){
          if(val != null){
            var days = val.split(',');
            days.forEach(function(day){
              $('.po-secy-date[data-date="'+ day +'"]').addClass('po-secy-date-selected');
            });
          }
        },

        getValue: function(){
          var str = $.map($('.po-secy-date-selected'), function(item, i){
            return $(item).attr('data-date');
          }).join(',');
          return str;
        },

        disable: function(){
          $('.po-secy-date').off();
        },

      },

      secondWeek: {
        init: function(){
          var table = $('<table><tbody></tbody></table>').attr('cellspacing', 0).attr('cellpadding', 0);
          var tbody = table.children('tbody').eq(0);
          var labs = [
            {label: '日',value: 7},
            {label: '一',value: 1},
            {label: '二',value: 2},
            {label: '三',value: 3},
            {label: '四',value: 4},
            {label: '五',value: 5},
            {label: '六',value: 6},
          ];

          var tr = $('<tr>').appendTo(tbody);
          for(var j = 0; j < 7; j+=1){
            var td = $('<td>').appendTo(tr);
            var lab = labs[j];
            td.append(
              $('<div>').addClass('po-secy-week').attr('data-week', lab.value).append(lab.label)
              .on('click', function(){
                $(this).toggleClass('po-secy-week-selected');
              })
            );
          }

          $('#po-secy-week').empty().append(table);
        },

        setValue: function(val){
          if(val != null){
            var days = val.split(',');
            days.forEach(function(day){
              $('.po-secy-week[data-week="'+ day +'"]').addClass('po-secy-week-selected');
            });
          }
        },

        getValue: function(){
          var str = $.map($('.po-secy-week-selected'), function(item, i){
            return $(item).attr('data-week');
          }).join(',');
          return str;
        },

        disable: function(){
          $('.po-secy-week').off();
        }
      },

      secondDay: {
        init: function(){
          var self = this;
          $('<div>').addClass('po-secy-day-add').appendTo('#po-secy-day');
          $('#po-secy-day').on('click', '.po-secy-day-add', function(){
            self.openAddDialog();
          });
          $('#po-secy-day').on('click', '.po-secy-day-del', function(){
            $(this).parent().remove();
          });
        },
        openAddDialog: function(){
          var dialog = new PopupDialog({
            url: 'content/productOffering/second-cycle-time.html',
            width: 482,
            height: 210,
            context: {},
            callback: function(){
              var startHour = getHourSelect('po-cyctime-hour-start').create();
              var startMin = getMinuteSelect('po-cyctime-min-start').create();
              var endHour = getHourSelect('po-cyctime-hour-end').create();
              var endMin = getMinuteSelect('po-cyctime-min-end').create();
              $('#po-editor-cyt-submit').on('click', function(){
                var str = '';
                str += startHour.getValue();
                str += ':';
                str += startMin.getValue();
                str += '-';
                str += endHour.getValue();
                str += ':';
                str += endMin.getValue();
                $('<div>').addClass('po-secy-day-item').append(
                  $('<span>').append(str)
                ).append(
                  $('<div>').addClass('po-secy-day-del')
                ).attr('data-time', str)
                .insertBefore($('#po-secy-day').find('.po-secy-day-add'));
                dialog.close();
              });
            }
          });
          dialog.open();
        },

        setValue: function(val){
          if(val != null){
            var days = val.split(',');
            days.forEach(function(day){
              $('<div>').addClass('po-secy-day-item').append(
                  $('<span>').append(day)
                ).append(
                  $('<div>').addClass('po-secy-day-del')
                ).attr('data-time', day)
                .insertBefore($('#po-secy-day').find('.po-secy-day-add'));
            });
          }
        },

        getValue: function(){
          var str = $.map($('.po-secy-day-item'), function(item, i){
            return $(item).attr('data-time');
          }).join(',');
          return str;
        },

        disable: function(){
          $('#po-secy-day').addClass('po-secy-disabled');
        },
      },

      disable: function(){
        this.bigCycle.disable();
        this.secondMonth.disable();
        this.secondWeek.disable();
        this.secondDay.disable();
      }
    },

    metaEditor: {
      init: function(){
        var self = this;
        $('#po-meta-edit').on('click', function(){
          self.editMeta();
        });
      },

      setValue: function(metadata){
        var self = this;
        self.metadata = metadata;
        self.init();
        self.showMetaNum();
      },

      getValue: function(){
        return this.metadata;
      },

      showMetaNum: function(){
        var self = this;
        var i = 0;
        for(var prop in self.metadata){
          if(self.metadata.hasOwnProperty(prop)){
            i+=1;
          }
        }
        $('#po-meta-num').val(i + '项');
      },

      disable: function(){
        $('#po-meta-edit').hide();
      },

      editMeta: function(){
        var self = this;
        var dialog = new PopupDialog({
          url: 'content/productOffering/po-meta-edit.html',
          width: 952,
          height: 388,
          context: {},
          callback: function() {
            var metalist = [];
            var userMeta = self.metadata;
            if(userMeta){
              for (var m in userMeta) {
                if (userMeta.hasOwnProperty(m)) {
                  var metaObj = {
                    key: m,
                  };
                  if(typeof userMeta[m] == 'string'){
                    metaObj.value = userMeta[m];
                  } else {
                    metaObj.value = JSON.stringify(userMeta[m]);
                    metaObj.type = 'json';
                  }
                  metalist.push(metaObj);
                }
              }
            }
            var rlen = Math.max(3, metalist.length);
            var frag = document.createDocumentFragment();
            for (var i = 0; i < rlen; i += 1) {
              getMetaInput(i + 1, metalist[i]).appendTo(frag);
            }
            $('<div>').addClass('user-admin-meta-add').on('click', function() {
              getMetaInput(i += 1).insertBefore(this);
            }).appendTo(frag);
            $('#po-edit-meta-ins').empty().append(frag);
            $('#po-edit-meta-submit').on('click', function() {
              var newMeta = {};
              $('.user-admin-meta-row').each(function(r, row) {
                var $row = $(row);
                var key = $row.children('.user-admin-meta-key').val();
                if (key != '') {
                  var val = $row.children('.user-admin-meta-value').val();
                  if($row.attr('data-type') == 'json'){
                    newMeta[key] = JSON.parse(val);
                  } else {
                    newMeta[key] = val;
                  }
                }
              });
              self.metadata = newMeta;
              self.showMetaNum();
              dialog.close();
            });
          }

        });
        dialog.open();

      }

    },


    changeStep: function(num) {
      var self = this;

      num = Number(num);
      num = Math.min(num, self.pages);
      self.pageNum = num;

      var $active = $('.po-step-active');
      if($active.length > 0){
        var curr = $active.eq(0).attr('data-step');
        if (curr == num) {
          return;
        } else {
          $active.removeClass('po-step-active');
        }
      }

      $('.po-step-option[data-step="' + num + '"]').addClass('po-step-active');
      $('.po-editor-step-box[data-step="' + num + '"]').addClass('po-step-active');

      if(!self.pageBuilt[num]){
        self['pageBuild'+num]();
      }

    },


    back: function(){
      $('#po-editor-page').empty().hide();
    },

    setup: function(callback, offering){
      var self = this;
      $.get('content/productOffering/editor.html', function(data){
        $('#po-editor-page').empty().append(data).show();
        self.init(offering);
        if(typeof callback == 'function'){
          callback();
        }
      });
    },

    add: function(callback){
      var self = this;
      self.type = 'add';
      function nextFunc(){
        if(self.pageNum == self.pages){
          $('#po-editor-btn-next').hide();
          $('#po-editor-btn-add').show();
        } else {
          $('#po-editor-btn-add').hide();
          $('#po-editor-btn-next').show();
        }
      }
      this.setup(function(){
        $('#po-editor-title').text('新增营销策略');
        $('#po-editor-btn-cancel').show();
        $('#po-editor-btn-next').on('click', function(){
          self.changeStep(self.pageNum + 1);
          nextFunc();
        });
        $('#po-editor-btn-add').on('click', function(){
          var ret = self.addOffering();
          if(ret === true){
            self.back();
            if(typeof callback == 'function'){
              callback();
            }
          } else if(ret === false) {
            alert('添加失败！');
          }
        });
        $('.po-step-option').on('click', function(){
          var num = $(this).attr('data-step');
          self.changeStep(num);
          nextFunc();
        }).eq(0).click();
      }, {});

    },

    view: function(offering){
      var self = this;
      self.type = 'view';
      this.setup(function(){
        $('#po-editor-title').text('查看营销策略');
        $('#po-editor-back').show();
        $('.po-step-option').on('click', function(){
          var num = $(this).attr('data-step');
          self.changeStep(num);
        }).eq(0).click();
      }, offering);
    },

    edit: function(offering, callback){
      var self = this;
      self.type = 'edit';
      this.setup(function(){
        $('#po-editor-title').text('编辑营销策略');
        $('#po-editor-btn-cancel').show();
        $('#po-editor-btn-update').show().on('click', function(){
          var ret = self.updateOffering();
          if(ret === true){
            self.back();
            if(typeof callback == 'function'){
              callback();
            }
          } else if(ret === false) {
            alert('更新失败！');
          }
        });
        $('.po-step-option').on('click', function(){
          var num = $(this).attr('data-step');
          self.changeStep(num);
        }).eq(0).click();
      }, offering);
    },

    checkEditing: function(){
      var self = this;
      for(var i in self.pageBuilt){
        if(self.pageBuilt[i]){
          self['pageSave'+i]();
        }
      }
      var po = self.offering;
      if(!po.name){
        alert(i18n("PRODUCTOFFERING_DIALOG_VALID_NAME"));
        return false;
      }
      var selfOption = findSelfOption(po.purchase_options);
      if(selfOption != null){
        if(selfOption.price_type == 'fixed' || selfOption.price_type == 'minus'){
          if(selfOption.price == ''){
            alert(i18n("PRODUCTOFFERING_DIALOG_VALID_PRICE"));
            return false;
          }
        }
        if(selfOption.price_type == 'discount'){
          if(selfOption.discount == ''){
            alert(i18n("PRODUCTOFFERING_DIALOG_VALID_DISCOUNT"));
            return false;
          }
        }
        if(selfOption.ticket_lifetime_type == "offering"){
          var ticket_msg = /([\d]+)([y|M|d|h|m])/.exec(selfOption.ticket_lifetime);
          if(ticket_msg == null || ticket_msg.length !== 3){
            alert(i18n("PRODUCTOFFERING_DIALOG_VALID_TICKET"));
            return false;
          }
        }
        if($('#po-rule-asset-extra').val() != '' && (po.rule_asset.extra == null)){
          alert(i18n("PRODUCTOFFERING_DIALOG_VALID_CONTENT"));
          return false;
        }
      } else {
        alert('请设置购买选项');
        return false;
      }
      return true;
    },

    addOffering: function(){
      var self = this;
      if(this.checkEditing()){
        var ret = false;
        var url = aquapaas_host + "/aquapaas/rest/offering";
        $.ajax({
          url: url,
          type: "POST",
          async: false,
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(self.offering),
          headers: {
            "Accept": "application/json"
          }
        }).done(function() {
          ret = true;
        });
        return ret;
      }
    },

    updateOffering: function(){
      var self = this;
      if(this.checkEditing()){
        var ret = false;
        var url = aquapaas_host + "/aquapaas/rest/offering/" + self.offering.offering_id;
        $.ajax({
          url: url,
          type: "PUT",
          async: false,
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(self.offering),
          headers: {
            "Accept": "application/json"
          }
        }).done(function() {
          ret = true;
        });
        return ret;
      }
    },
  };

  return editor;
})(jQuery);
