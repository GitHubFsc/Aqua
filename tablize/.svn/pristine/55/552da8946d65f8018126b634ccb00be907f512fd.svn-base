var createTree = (function($, Combo){
  var Pane = {
    ctn: null,
    widgets: {},
    initFrame(ctn) {
      var dom = `<div class='_frame _flex' id='navigation_tree_creator'>
      <div class='header _flex'>
      <div class='header_item logo'>${i18n('NAVIGATE_MNG')}</div>
      <div class='header_item span'></div>
      </div>
      <div class='body'>
      <div class='group basic_info' id='navigation_basic_info'>
        <div class='row'>
          <div class='col' style='flex: 1;display: flex;'>
            <label style='border: none;background-color: transparent;width: 80px;'>${i18n('NAVIGATE_TREE_NAME')}</label>
            <input id='navigation_tree_name' placeholder='${i18n('NAVIGATE_TREENAME')}'/>
          </div>
          <div class='col' style='flex: 1;display: flex;'>
            <label style='border: none;background-color: transparent;width: 80px;line-height: 14px;'>${i18n('NAVIGATE_TREE_NEEDRELEASE')}</label>
            <div id='navigation_need_release' class='combo' style='margin-left: 23px;'></div>
          </div>
        </div>
        <div class='row'>
          <div class='col' style='flex: 1;display: flex;'>
            <label style='border: none;background-color: transparent;width: 80px;line-height: 14px;'>${i18n('NAVIGATE_TREE_IS_PUBLIC')}</label>
        <div class='combo' id='navigation_tree_public'></div>
      </div>
          <div class='col' style='flex: 1;display: flex;'>
            <label style='border: none;background-color: transparent;width: 80px;'>${i18n('NAVIGATE_TREE_APP')}</label>
            <input id='navigation_tree_app'placeholder='${i18n('NAVIGATE_APPKEY')}'/>
          </div>
        </div>
        <div class='row'>
          <div class='col' style='flex: 1;display: flex;'>
            <label style='border: none;background-color: transparent;width: 80px;line-height: 14px;'>${i18n("NAVIGATE_TREE_SETNAVPATH")}</label>
            <div style='margin-left: 23px;' class='combo' id='navigation_set_nav_path'></div>
          </div>
          <div class='col' style='flex: 1;display: flex;'>
            <label style='border: none;background-color: transparent;width: 80px;'>${i18n('NAVIGATE_TREE_TAGS')}</label>
            <input id='navigation_tags'style='margin-left: 23px;'/>
          </div>
        </div>
      </div>
      <!--div class='group public_info' id='navigation_public_info'></div-->
      <div class='group metadata_info' id='navigation_metadata_info'></div>
      </div>
      <div class='foot'>
      <div class='btn _cancel'>${i18n('USERGROUP_QUXIAO')}</div>
      <div class='btn _confirm'>${i18n('NAVIGATION_CREATE')}</div>
      </div>
      </div>`;
      Pane.ctn = $(dom)
      Pane.ctn.appendTo($(ctn));
      this.bindEvents();
    },
    bindEvents(){
      $('#navigation_tree_creator')
        .on('click', '.foot .btn._cancel', () => {
          this.close();
        })
        .on('click', '.foot .btn._confirm', () => {
          API.create(() => {
            this.close();
            API.confirmFn && API.confirmFn();
          });
        })
        .on('click', 'svg[name=add]',(e) => {
          var parent = $(e.currentTarget).parents('.group')
          var idx = $(e.currentTarget).data('index');
          Model.metadata(idx, '', '').insertAfter(parent.find('.row:eq('+idx+')'));
          parent.find('.row').map((idx, item) => {
            $(item).find('label').html(idx+1);
            $(item).find('input.metadata_key, input.metadata_val, svg').data('index', idx);
          })
        })
        .on('click', 'svg[name=del]', (e) => {
          var parent = $(e.currentTarget).parents('.group')
          var idx = $(e.currentTarget).data('index');
          var removable = parent.find('.row').find('input:not(:disabled)').parent('.row').length > 1 ? true: false;
          if (removable) {
            parent.find('.row:eq(' + idx +')').remove();
          }
          parent.find('.row').map((idx, item) => {
            $(item).find('label').html(idx+1);
            $(item).find('input.metadata_key, input.metadata_val, svg').data('index', idx);
          })
        });
        Pane.widgets.Public = new Combo('#navigation_tree_public', [{key: i18n('NAVIGATE_NO'),value: false}, {key: i18n('NAVIGATE_YES'),value: true}], {
          backgroundIMGStyle: 2,
          width: 165,
          height: 30,
          background: "#ffffff",
          selectbackground: "#ffffff",
          disablebackground: "#f6f6f6",
          disableborder: "#c6c6c6"
        }, (value) => {})
        Pane.widgets.NeedRelease = new Combo('#navigation_need_release', [{key: i18n('NAVIGATE_NO'),value: false}, {key: i18n('NAVIGATE_YES'),value: true}], {
          backgroundIMGStyle: 2,
          width: 165,
          height: 30,
          background: "#ffffff",
          selectbackground: "#ffffff",
          disablebackground: "#f6f6f6",
          disableborder: "#c6c6c6"
        }, (value) => {})
        Pane.widgets.SetNavPath = new Combo('#navigation_set_nav_path', [{key: i18n('NAVIGATE_YES'),value: true},{key: i18n('NAVIGATE_NO'),value: false}], {
          backgroundIMGStyle: 2,
          width: 165,
          height: 30,
          background: "#ffffff",
          selectbackground: "#ffffff",
          disablebackground: "#f6f6f6",
          disableborder: "#c6c6c6"
        }, (value) => {})
    },
    close(){
      Pane.ctn.remove();
    },
    loadFrame(data) {
      this.load({
        el: 'public',
        data: data.metadata_public
      })
      this.load({
        el: 'metadata',
        data: data.metadata
      })
    },
    load({el, data}){
      var index = 0;
      switch (el) {
        case 'public':
          var source = Model.metadata(index, 'source', data.source).appendTo($('#navigation_tree_creator .group.public_info'));
          index++;
          var readonly = Model.metadata(index, 'readonly', data.readonly).appendTo($('#navigation_tree_creator .group.public_info'))
          index++;
          delete data.source
          delete data.readonly
          for (var item in data) {
            if (data.hasOwnProperty(item)) {
              Model.metadata(index, item, data[item]).appendTo($('#navigation_tree_creator .group.public_info'));
              index++;
            }
          }
          Model.metadata(index, '', '').appendTo($('#navigation_tree_creator .group.public_info'));
          break;
        default:
        for (var item in data) {
          if (data.hasOwnProperty(item)) {
            Model.metadata(index, item, data[item]).appendTo($('#navigation_tree_creator .group.metadata_info'));
            index++;
          }
        }
        Model.metadata(index, '', '').appendTo($('#navigation_tree_creator .group.metadata_info'));
      }
    }
  };
  var API = {
    //2019-04-30 request 22984 请求url参数app_key更改成与页面所属应用一致的值，而非从配置项获取
    create(callback) {
      var data = this.getData(),
      url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + data.name + '?app_key=' + data.creator_app_key + '&timestamp=' + new Date().toISOString(),
      method = 'Post';
      if (this.sendable(data)) {
        delete data.name;
        $.ajax({
          type: method,
          url: url,
          async: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(data)
        }).always((resp, state, xhr) => {
          if (state == 'success') {
            API.createFolder(resp.name, callback)
          }
        })
      } else {
        console.log('please input necessary data');
      }
    },
    createFolder(name, callback) {
      var {accessKeyId, secretAccessKey} = my.aqua;
      if (accessKeyId && secretAccessKey) {
      var aqua = new TicketAquaUtil({
          host: aqua_host,
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        domainURI: LOGIN_AQUA_DOMAIN_URI
      })
      aqua.getContainer({
        path: 'default/netdisk/' + LOGIN_AQUA_USERNAME + '/' + NAVIGATION_TREE_ROOT + name
      }).forceCreate();
      }
      callback && callback();
    },
    getData(){
      var data = {};
      data.metadata_public = {
        readonly: false,
        source: 'ui'
      };
      data.name = $('#navigation_tree_creator #navigation_tree_name').val();
      data.metadata_public.need_release = String(Pane.widgets.NeedRelease.getValue()) == 'true' ? true : false
      data.is_public = String(Pane.widgets.Public.getValue()) == 'true' ? true : false;
      data.creator_app_key = $('#navigation_tree_creator #navigation_tree_app').val();
      data.metadata_public.needSetNavPath = String(Pane.widgets.SetNavPath.getValue()) == 'true' ? true : false;
      if (data.metadata_public.needSetNavPath) {
        data.metadata_public.tags = $('#navigation_tree_creator #navigation_tags').val().split(',').filter(item => !(item == ''  || typeof item == 'undefined' || item == null || isNaN(item)));
      }
      // $('#tree_creator .group.public_info .row').map((idx, item)=>{
      //   var key = $(item).find('.metadata_key').val();
      //   var val = $(item).find('.metadata_val').val();
      //   if (val && key) {
      //     var booleanKey = ['needSetNavPath', 'is_primary', 'need_release']
      //     if (booleanKey.includes(key)) {
      //       data.metadata_public[key] = (val == 'true' ? true : false);
      //     } else {
      //       data.metadata_public[key] = val;
      //     }
      //   }
      // })
      data.metadata = {};
      $('#navigation_tree_creator .group.metadata_info .row').map((idx, item)=>{
        var key = $(item).find('.metadata_key').val();
        var val = $(item).find('.metadata_val').val();
        if (val && key) {
          data.metadata[key] = val;
        }
      });
      return data;
    },
    sendable(data) {
      var ret = true;
      // if (data.name && data.creator_app_key && typeof data.is_public !== 'undefined') {
      if (!!!data.name) {
        $('#navigation_tree_creator #navigation_tree_name').css('border-color', 'red')
        ret = false;
      } else {
        $('#navigation_tree_creator #navigation_tree_name').css('border-color', '')
      }
      if (!!!data.creator_app_key) {
        $('#navigation_tree_creator #navigation_tree_app').css('border-color', 'red')
        ret = false;
      } else {
        $('#navigation_tree_creator #navigation_tree_app').css('border-color', '')
      }
      return ret;
    }
  };
  var Model = {
    metadata(idx, key, value) {
      var row = $('<div>').addClass('row')
      .append($('<label>').html(idx+1))
      .append($('<input class="metadata_key" index="' + idx + '" value="' + key + '">').attr('placeholder', i18n('NAVIGATE_METADATA_KEYINFO')))
      .append($('<input class="metadata_val" index="' + idx + '" value="' + value + '">').attr('placeholder', i18n('NAVIGATE_METADATA_VALUEINFO')))
      if (key == '') {
        row
        .append('<svg class="opr" name="add" id="rule_add_' + idx + '" data-index="' + idx + '">' + '<polygon points="7,0 10,0 10,7 17,7 17,10 10,10 10,17 7,17 7,10 0,10 0,7 7,7"></polygon>' + '</svg>')
        .append('<svg class="opr" name="del" id="rule_del_' + idx + '" data-index="' + idx + '">' + '<polygon points="0,0 2,0 8.5,7 15,0 17,0 17,2 11,8.5 17,15 17,17 15,17 8.5,11 2,17 0,17 0,15 7,8.5 0,2"></polygon>' + '</svg>')
      } else {
        row.find('input').attr('disabled', 'true');
      }
      return row;
    }
  };
  function tree({el, confirmFn}) {
    var data = {
      name: '',
      metadata_public: {
        source: 'ui',
        readonly: false
      },
      metadata: {
      }
    }
    Pane.initFrame(el)
    Pane.loadFrame(data);
    API.confirmFn = confirmFn;
  }
  return tree
})(jQuery, newSelect)
