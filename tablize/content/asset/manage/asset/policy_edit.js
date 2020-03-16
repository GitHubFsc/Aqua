var AssetPolicyEditor = (function ($, Dialog, Combo) {
  let Pane = {
    dialog: null,
    widgets: {},
    init() {
      this.initDialog();
    },
    initDialog() {
      let cb = () => {
        API.getMeta();
        Pane.loadData();
        Pane.bindEvents();
      }
      this.dialog = new Dialog({
        url: 'content/asset/manage/asset/policy_edit.html',
        width: 1128,
        height: 634,
        context: this,
        callback: cb
      });
      this.dialog.create();
    },
    loadData() {
      $('#asset_policy_editor #policy_list').empty();
      let data = API.data;
      for(var i = 0; i < data.length; i++) {
        Model.policy(i, data[i]);
      }
      Model.policy(data.length, {})
      this.loadDesc();
    },
    loadDesc() {
      let ctn = $('#asset_policy_editor .desc');
      ctn.empty();
      for(var i = 0; i < API.data.length; i++) {
        let item = API.data[i];
        var values = item.value.split(',')
        var str = '';
        if(item.op == 'bt' && values.length == 2) {
          // var regtime = /^(?<date>\d{4}-\d{2}-\d{2})T(?<hour>\d{2}:\d{2})/
          // var regtime = /^(\d{0,4}-\d{0,2}-\d{0,2})T(\d{0,2}:\d{0,2})/g
          var regtime = new RegExp('^(\\d{4}-\\d{2}-\\d{2})T(\\d{2}:\\d{2})/g');
          switch(regtime.test(item.value)) {
          case true:
            var group1 = regtime.exec(values[0]);
            var group2 = regtime.exec(values[1]);
            str = [[group1[1], group1[2]].join(' '), [group2[1], group2[2]].join(' ')].join('-')
            break;
          default:
            str = [values[0], values[1]].join('-')
            break;
          }
        } else {
          str = item.value
        }
        $('<a>' + [(i == 0 ? 'if' : '<br><div style="width: 38px;height: 14px;display: inline-block;"></div>and'), item.field, i18n('ASSET_ASSET_AUTOMATCH_' + item.op.toUpperCase()), str].join(' ') + '</a>').appendTo(ctn);
      }
    },
    bindEvents() {
      $('#asset_policy_editor #policy_list').on('click', 'svg[name=add]', (e) => {
        if(e.target == e.currentTarget) {
          API.cacheData();
          Pane.loadData();
        }
      });
      $('#asset_policy_editor #policy_list').on('click', 'svg[name=del]', (e) => {
        if(e.target == e.currentTarget) {
          API.cacheData();
          let index = $(e.target).data('index');
          API.data = API.data.slice(0, index).concat(API.data.slice(index + 1));
          Pane.loadData();
        }
      });
      $('#asset_policy_editor ._dialog_foot .btn.cancel').bind('click', () => {
        Pane.dialog.close();
      })
      $('#asset_policy_editor ._dialog_foot .btn.confirm').bind('click', () => {
        if(API.confirmFn) {
          API.cacheData();
          API.confirmFn(API.data, () => {
            Pane.dialog.close();
          })
        }
      })
    }
  };
  let API = {
    meta: [],
    update(callback) {
      console.log(API.data);
      callback && callback();
    },
    getMeta() {
      $.ajax({
        type: 'get',
        async: false,
        url: aquapaas_host + '/aquapaas/rest/assetdef/metadata/asset',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json'
        }
      }).always((resp, status, xhr) => {
        if(status == 'success') {
          this.meta = resp;
        }
      })
    },
    getWeek(str) {
      var ret = '';
      switch(str) {
      case '01':
        ret = 'Monday';
        break;
      case '02':
        ret = 'Tuesday';
        break;
      case '03':
        ret = 'Wednesday';
        break;
      case '04':
        ret = 'Thursday';
        break;
      case '05':
        ret = 'Friday';
        break;
      case '06':
        ret = 'Saturday';
        break;
      case '07':
        ret = 'Sunday';
        break;
      }
      return ret;
    },
    cacheData() {
      let frameLen = $('#asset_policy_editor #policy_list').children().length;
      var tmp_data = [];
      for(var i = 0; i < frameLen; i++) {
        var policy = {};
        var field = Pane.widgets['combo_field_' + i].getValue()
        var opr = Pane.widgets['combo_opr_' + i].getValue();
        var value;
        var op = '';
        var granularity = '';
        switch(opr) {
        case 'week':
          op = 'in';
          granularity = opr;
          var weeks = jQuery('.policy_rule:eq(' + i + ')').find('.i-check').find('input:checked').parent('.i-check');
          var values = [];
          for(var j = 0; j < weeks.length; j++) {
            values.push(API.getWeek(String(parseInt($(weeks[j]).data('index')) + 1).padStart(2, '0')))
          }
          value = values.join(',')
          break;
        case 'hour':
          op = 'bt';
          granularity = opr;
          value = [Pane.widgets['combo_value_start_' + i].getValue(), Pane.widgets['combo_value_end_' + i].getValue()].join(',');
          break;
        case 'time':
          op = 'bt';
          granularity = '';
          value = [Pane.widgets['time_picker_start_' + i].getValue(), Pane.widgets['time_picker_end_' + i].getValue()].join(',')
          break;
        default:
          op = opr
          value = $('#rule_value_' + i + ' input').val();
        }
        policy.field = field;
        policy.op = op;
        policy.value = value;
        if(granularity) {
          policy.granularity = granularity;
        }
        if(value) {
          tmp_data.push(policy)
        }
      }
      API.data = tmp_data;
    }
  };
  let Model = {
    policy(index, data) {
        let tmp_data =
          JSON.parse(JSON.stringify(data));
        let rule = $("<div></div>").addClass('policy_rule').append(
          '<div class="index">' + (index + 1) + '</div>'
        ).append(
          '<div class="combo" name="field" id="rule_field_' + index + '"></div>'
        ).append(
          '<input disabled="true" class="rule_type" id="rule_type_' + index + '">'
        ).append(
          '<div class="combo" name="opr" id="rule_opr_' + index + '"></div>'
        ).append(
          '<div class="value" id="rule_value_' + index + '" data-index="' + index + '"></div>'
        ).append(
          '<svg name="add" id="rule_add_' + index + '" data-index="' + index + '">' + '<polygon points="7,0 10,0 10,7 17,7 17,10 10,10 10,17 7,17 7,10 0,10 0,7 7,7"></polygon>' + '</svg>'
        ).append(
          '<svg name="del" id="rule_del_' + index + '" data-index="' + index + '">' + '<polygon points="0,0 2,0 8.5,7 15,0 17,0 17,2 11,8.5 17,15 17,17 15,17 8.5,11 2,17 0,17 0,15 7,8.5 0,2"></polygon>' + '</svg>'
        );
        let meta = Model.meta();
        rule.appendTo($('#asset_policy_editor #policy_list'));
        Pane.widgets['combo_field_' + index] = new Combo('#rule_field_' + index, meta, {
          backgroundIMGStyle: 2,
          width: "100%",
          height: 30,
          background: "#ffffff",
          selectbackground: "#ffffff",
          disablebackground: "#f6f6f6",
          disableborder: "#c6c6c6",
          ScrollBarHeight: 120
        }, (value) => {
          //load type
          var type = API.meta.filter((item) => {
            return item.name == value
          })[0].type;
          $('input#rule_type_' + index).val(type);
          switch(type) {
          case 'boolean':
            Pane.widgets['combo_opr_' + index].freshselectItem(selectItem.filter((item) => {
              return ['eq'].includes(item.value)
            }), 'init')
            break;
          case 'string':
          case 'array':
          case 'enum':
            Pane.widgets['combo_opr_' + index].freshselectItem(selectItem.filter((item) => {
              return ['eq', 'lk', 'in'].includes(item.value)
            }), 'init')
            break;
          case 'int':
          case 'number':
            Pane.widgets['combo_opr_' + index].freshselectItem(selectItem.filter((item) => {
              return ['eq', 'in', 'bt', 'gt', 'lt'].includes(item.value)
            }), 'init')
            break;
          case 'date':
            Pane.widgets['combo_opr_' + index].freshselectItem(selectItem.filter((item) => {
              return ['week', 'hour', 'time'].includes(item.value);
            }), 'init');
            break;
          }
          Pane.widgets['combo_opr_' + index].content.find('li:eq(0)').click();
        });
        let selectItem = [{
          key: i18n('ASSET_ASSET_AUTOMATCH_EQ'),
          value: 'eq'
        }, {
          key: i18n('ASSET_ASSET_AUTOMATCH_LK'),
          value: 'lk'
        }, {
          key: i18n('ASSET_ASSET_AUTOMATCH_IN'),
          value: 'in'
        }, {
          key: i18n('ASSET_ASSET_AUTOMATCH_BT'),
          value: 'bt'
        }, {
          key: i18n('ASSET_ASSET_AUTOMATCH_GT'),
          value: 'gt'
        }, {
          key: i18n('ASSET_ASSET_AUTOMATCH_LT'),
          value: 'lt'
        }, {
          key: i18n('ASSET_ASSET_AUTOMATCH_WEEK'),
          value: 'week'
        }, {
          key: i18n('ASSET_ASSET_AUTOMATCH_HOUR'),
          value: 'hour'
        }, {
          key: i18n('ASSET_ASSET_AUTOMATCH_TIME'),
          value: 'time'
        }];
        Pane.widgets['combo_opr_' + index] = new Combo('#rule_opr_' + index, selectItem, {
          backgroundIMGStyle: 2,
          width: "100%",
          height: 30,
          background: "#ffffff",
          selectbackground: "#ffffff",
          disablebackground: "#f6f6f6",
          disableborder: "#c6c6c6",
          ScrollBarHeight: 90
        }, (value) => {
          switch(value) {
          case 'in':
            $('#rule_value_' + index).empty().append($('<input>').attr('placeholder', i18n('ASSET_ASSET_AUTOMATCH_INPUT_PLACEHOLDER')));
            break;
          case 'lk':
          case 'bt':
          case 'gt':
          case 'lt':
            $('#rule_value_' + index).empty().append($('<input>'));
            break;
          case 'eq':
            $('#rule_value_' + index).empty();
            if($('#rule_type' + index).val() == 'combo') {
              delete Pane.widgets['combo_value_' + index];
              Pane.widgets['combo_value_' + index] = new Combo('#rule_type' + index, [{
                key: i18n('ASSET_META_TABLE_OPR_TRUE'),
                value: true
              }, {
                key: i18n('ASSET_META_TABLE_OPR_FALSE'),
                value: false
              }])
            } else {
              delete Pane.widgets['combo_value_' + index];
              $('#rule_value_' + index).empty().append($('<input>'));
            }
            break;
          case 'hour':
            $('#rule_value_' + index).empty().append($('<div id="combo_value_start_' + index + '"></div>-<div id="combo_value_end_' + index + '"></div>'));
            Pane.widgets['combo_value_start_' + index] = new Combo('#combo_value_start_' + index, Array.apply(null, {
              length: 24
            }).map((item, idx) => {
              var val = String(idx).padStart(2, '0');
              return {
                key: val + i18n('PRODUCT_PACKAGE_HOUR'),
                value: val
              }
            }), {
              backgroundIMGStyle: 2,
              width: 210,
              height: 30,
              background: "#ffffff",
              selectbackground: "#ffffff",
              disablebackground: "#f6f6f6",
              disableborder: "#c6c6c6",
              ScrollBarHeight: 120
            }, () => {

            })
            Pane.widgets['combo_value_end_' + index] = new Combo('#combo_value_end_' + index, Array.apply(null, {
              length: 24
            }).map((item, idx) => {
              var val = String(idx).padStart(2, '0');
              return {
                key: val + i18n('PRODUCT_PACKAGE_HOUR'),
                value: val
              }
            }), {
              backgroundIMGStyle: 2,
              width: 210,
              height: 30,
              background: "#ffffff",
              selectbackground: "#ffffff",
              disablebackground: "#f6f6f6",
              disableborder: "#c6c6c6",
              ScrollBarHeight: 120
            }, () => {

            })
            break;
          case 'week':
            $('#rule_value_' + index).empty().append($(Array.apply(null, {
              length: 7
            }).map((item, idx) => {
              return "<div class='week_day'><div data-index='" + idx + "' class='i-check'><input type='checkbox'/><label></label></div><label>" + i18n('ASSET_ASSET_AUTOMATCH_WEEKDAY' + (idx + 1)) + "</label></div>";
            }).join('')));
            break;
          case 'time':
            $('#rule_value_' + index).empty().append(
              $('<div id="time_picker_start_' + index + '"></div>-<div id="time_picker_end_' + index + '"></div>')
            )
            Pane.widgets['time_picker_start_' + index] = new TimePicker({
              containerId: 'time_picker_start_' + index,
              height: 30,
              width: 234,
              dateWidth: 122,
              hourWidth: 98,
              dateIcon: 'uiWidget/images/datepicker_calendaricon.png',
              dateIconPosition: '93px',
              hourIcon: 'uiWidget/images/open1.png',
              hourIconPosition: '66px',
              border: '1px solid #e7e7e7',
              calendarStyles: {
                width: 279,
                navTitleHeight: 25,
                navTitleBgColor: '#0f84a1',
                datesViewHeight: 168,
                datesViewGridColor: '#e2e2e2',
                datesViewCellColor: '#ffffff',
                weekdaysHeight: 22,
                weekdaysColor: '#000000',
                currMonthColor: '#737373',
                nonCurrMonthColor: '#e2e2e2'
              }
            });
            Pane.widgets['time_picker_end_' + index] = new TimePicker({
              containerId: 'time_picker_end_' + index,
              height: 30,
              width: 234,
              dateWidth: 122,
              hourWidth: 98,
              dateIcon: 'uiWidget/images/datepicker_calendaricon.png',
              dateIconPosition: '93px',
              hourIcon: 'uiWidget/images/open1.png',
              hourIconPosition: '66px',
              border: '1px solid #e7e7e7',
              calendarStyles: {
                width: 279,
                navTitleHeight: 25,
                navTitleBgColor: '#0f84a1',
                datesViewHeight: 168,
                datesViewGridColor: '#e2e2e2',
                datesViewCellColor: '#ffffff',
                weekdaysHeight: 22,
                weekdaysColor: '#000000',
                currMonthColor: '#737373',
                nonCurrMonthColor: '#e2e2e2'
              }
            });
            break;
          };
        });
        if(tmp_data) {
          let field_idx = Pane.widgets['combo_field_' + index].selectItem.findIndex((item) => {
            return item.value == tmp_data.field
          })
          Pane.widgets['combo_field_' + index].content.find('li:eq(' + (field_idx == -1 ? 0 : field_idx) + ')').click();

          var type = $('#rule_type_' + index).val();
          if(type == 'date') {
            if(tmp_data.granularity) {
              Pane.widgets['combo_opr_' + index].content.find('li[data-key=' + tmp_data.granularity + ']').click();
            } else {
              Pane.widgets['combo_opr_' + index].content.find('li' + (typeof tmp_data.op == 'undefined' ? ':eq(0)' : '[data-key=time]')).click();
            }

          } else {
            Pane.widgets['combo_opr_' + index].content.find('li[data-key=' + tmp_data.op + ']').click();
          }
          //           Pane.widgets['combo_opr_' + index].content.find('li:eq(' + (op_idx == -1 ? 0 : op_idx) + ')').click();
          switch($('#rule_type_' + index).val()) {
          case 'string':
          case 'array':
          case 'enum':
          case 'int':
          case 'number':
            rule.find('#rule_value_' + index + ' input').val(tmp_data.value);
            break;
          case 'boolean':
            Pane.widgets['combo_value_' + index].setValue(tmp_data.value)
            break;
          case 'date':
            if(!jQuery.isEmptyObject(tmp_data)) {
              switch(tmp_data.granularity) {
              case 'hour':
                var hour_value = tmp_data.value.split(',');
                Pane.widgets['combo_value_start_' + index].setValue(hour_value[0])
                Pane.widgets['combo_value_end_' + index].setValue(hour_value[1])
                break;
              case 'week':
                var week_day = tmp_data.value.split(',')
                $('#rule_value_' + index).find('div.i-check').map((idx, item) => {
                  if(week_day.includes(API.getWeek(String(idx + 1).padStart(2, '0')))) {
                    $(item).find('input').click();
                  }
                })
                break;
              default:
                var time_value = tmp_data.value.split(',');
                Pane.widgets['time_picker_start_' + index].setValue(time_value[0])
                Pane.widgets['time_picker_end_' + index].setValue(time_value[1])
                break;
              }
            }
            break;
          }
        }
      },
      meta() {
        let ret = [];
        for(item of API.meta) {
          ret.push({
            key: [item.title, '(', item.name, ')'].join(''),
            value: item.name
          })
        }
        return ret;
      }
  }

  let self = function (opts) {
    API.data = JSON.parse(JSON.stringify(opts.data))
    API.confirmFn = opts.confirmFn
    Pane.init(opts.data);
  }
  return self;

})(jQuery, PopupDialog, newSelect);
