var autoMatch = (function ($, Combo) {
  let backFn;
  let Pane = {
    dialog: null,
    state: null,
    init(opts) {
      Pane.id = opts.data.id;
      backFn = opts.back;
      this.initFrame(opts.data.name);
      this.bindEvents();
      API.list();
      this.state = API.data.length !== 0 ? 'defined' : 'category';
      $('#auto_match').addClass(this.state);
    },
    initFrame(name) {
      var dom = `<div class='_frame _flex' id='auto_match'>
                <div class='header _flex'>
                    <div class='header_item btn back icon' name='back'>${i18n('MNG_BACK')}</div>
                    <div class='header_item split'></div>
                    <div class='header_item'>${name}${i18n('ASSET_ASSET_AUTOMATCH')}</div>
                    <div class='header_item combo' name='switch' id='state'></div>
                    <div class='header_item span'></div>
                    <div class='header_item btn icon' name='add'>${i18n('ASSET_ASSET_AUTOMATCH_ADD')}</div>
                </div>
                <div class='body'>
                    <div class='category'>
                        <h2>${i18n('ASSET_ASSET_AUTOMATCH_INFO1')}</h2>
                        <h2>${i18n('ASSET_ASSET_AUTOMATCH_INFO2')}</h2>
                        <h2>&nbsp;</h2>
                        <h2>${i18n('ASSET_ASSET_AUTOMATCH_INFO3')}</h2>
                        <h2>${i18n('ASSET_ASSET_AUTOMATCH_INFO4')}</h2>
                        <h2>${i18n('ASSET_ASSET_AUTOMATCH_INFO5')}</h2>
                        <h2>${i18n('ASSET_ASSET_AUTOMATCH_INFO6')}</h2>
                        <h2>&nbsp;</h2>
                        <h2>${i18n('ASSET_ASSET_AUTOMATCH_INFO7')}</h2>
                    </div>
                    <div class='defined'></div>
                </div>
                <div class='foot'>
                    <div class='btn cancel'>${i18n('USERGROUP_QUXIAO')}</div>
                    <div class='btn confirm'>${i18n('USERGROUP_QUEDING')}</div>
                </div>
            </div>`;
      this.frame = $(dom);
      this.frame.appendTo($('#asset_asset'));
    },
    bindEvents() {
      var combo = new Combo('#state.combo', [{
        key: i18n('ASSET_ASSET_AUTOMATCH_STATE_CATEGORY'),
        value: 'category'
      }, {
        key: i18n('ASSET_ASSET_AUTOMATCH_STATE_DEFINED'),
        value: 'defined'
      }], {
        width: '100%',
        height: 28,
        backgroundIMGStyle: 2,
        selectbackground: '#4eb8ef',
        background: '#4eb8ef',
        color: '#ffffff'
      }, (value) => {
        this.frame.removeClass('category').removeClass('defined').addClass(value)
        this.state = value;
        console.log(value)
      })
      $('#auto_match .foot .btn.cancel,#auto_match .header_item.btn.back').bind('click', () => {
        this.close();
      });
      $('#auto_match .foot .btn.confirm').bind('click', () => {
        console.log(API.data);
        if(this.state == 'category') {
          API.data.length = 0;
        }
        var data = Pane.bundle_info;
        data.sub_asset_script = API.data;
        API.update(data, () => {
          this.close();
        })
      });
      $('#auto_match .header .btn[name=add]').bind('click', () => {
        let dialog = new AssetPolicyEditor({
          data: [],
          confirmFn: (policy, callback) => {
            let data = Pane.bundle_info;
            data.sub_asset_script = API.data;
            data.sub_asset_script.push(policy)
            API.update(data, () => {
              callback && callback();
              API.list();
            })
          }
        })
      })
      $('#auto_match .body').on('click', '.policy_ctn .btn.edit', (e) => {
        let index = $(e.target).data('index');
        let data = API.data[index]
        Pane.dialog = new AssetPolicyEditor({
          data: data,
          confirmFn: (policy, callback) => {
            let put_data = Pane.bundle_info;
            put_data.sub_asset_script = API.data;
            put_data.sub_asset_script[index] = policy;
            API.update(put_data, () => {
              callback && callback();
              API.list();
            })
          }
        })
      });
      $('#auto_match .body').on('click', '.policy_ctn .btn.del', (e) => {
        let index = $(e.target).data('index');
        let data = Pane.bundle_info;
        data.sub_asset_script = API.data.slice(0, index).concat(API.data.slice(index + 1));
        let message = i18n('ASSET_ASSET_AUTOMATCH_DELINFO1').replace('{{}}', i18n('ASSET_ASSET_AUTOMATCH_DELINFO2') + (index + 1));
        let dialog = new AlertDialog({
          message: message,
          confirmFn: (callback) => {
            API.update(data, () => {
              callback && callback();
              API.list();
            })
          }
        })
      });
    },
    close() {
      this.frame.remove();
      backFn && backFn();
    }
  }
  let API = {
    data: [],
    list() {
      $.ajax({
        type: 'GET',
        url: aquapaas_host + '/aquapaas/rest/asset/' + Pane.id,
        dataType: 'json',
        async: false,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).always((resp, status, xhr) => {
        if(status == 'success') {
          Pane.bundle_info = resp;
          API.data = resp.sub_asset_script || [];
          Model.table(API.data);
        }
      })
    },
    update(data, callback) {
      var req = new XMLHttpRequest(),
        method = 'PUT';
      req.open(method, aquapaas_host + '/aquapaas/rest/asset/' + data.id + '?source=ui', true);
      req.setRequestHeader('Accept', 'application/json')
      req.setRequestHeader('Content-Type', 'application/json');
      req.onreadystatechange = function () {
        if(this.status == '200' && this.readyState == 4) {
          Pane.bundle_info = data;
          API.data = data.sub_asset_script;
          callback && callback();
        }
      }
      req.send(JSON.stringify(data))
    }
  }
  let Model = {
    table(dataset) {
        var fragment = document.createDocumentFragment();
        for(var i = 0; i < dataset.length; i++) {
          var data = dataset[i];
          var item = Model.policy(i, data);
          fragment.appendChild(item[0]);
        }
        $('#auto_match .body .defined').empty().append(fragment);
      },
      policy(index, data) {
        var fragment = document.createDocumentFragment();
        var content = '';
        for(var i = 0; i < data.length; i++) {
          var item = data[i];
          var values = item.value.split(',')
          var str = '';
          if(item.op == 'bt' && values.length == 2) {
            // var regtime = /^(?<date>\d{4}-\d{2}-\d{2})T(?<hour>\d{2}:\d{2})/
            // var regtime = /^(\d{0,4}-\d{0,2}-\d{0,2})T(\d{0,2}:\d{0,2})/g;
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
          content += [(i == 0 ? 'if' : '<br><div style="width: 38px;height: 14px;display: inline-block;"></div>and'), item.field, i18n('ASSET_ASSET_AUTOMATCH_' + item.op.toUpperCase()), str].join(' ')
        }
        var dom = `<div class='policy_ctn'>
                <div class='policy_title'>${i18n('ASSET_ASSET_AUTOMATCH_DELINFO2')}${(index + 1)}</div>
                <div class='policy_body'>
                    <div class='policy_content'>
                        ${content}
                    </div>
                    <div class='policy_opr_bar'>
                        <div class='btn edit' data-index='${index}'>${i18n('ASSET_TAG_LIB_BIANJI')}</div>
                        <div class='btn del' data-index='${index}'>${i18n('ASSET_TAG_LIB_SHANCHU')}</div>
                    </div>
                </div>
            </div>`;
        return $(dom)
      }
  }
  let _self = function (opts) {
    Pane.init(opts);
  }
  return _self;
})(jQuery, newSelect);
