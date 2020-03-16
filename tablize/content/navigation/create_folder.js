var navigation_create_folder = (function($, Dialog, Combo){
  var Pane = {
    dialog: null,
    widgets: {},
    init(){
      this.dialog = API.confirmFn = Model.path = Model.app_key = null;
      this.widgets = {};
      this.initDialog();
    },
    initDialog() {
      var callback = () => {
        Pane.initWidgets();
        $('#navigation_create_folder #navigation_path').val(Model.path);
        Pane.load({el: 'public', data: {}});
        Pane.load({el: 'metadata', data: {}});
        this.bindEvents();
      }
      this.dialog = new Dialog({
        url: "content/navigation/create_folder.html",
        height: 665,
        width: 725,
        context: this,
        callback: callback
      });
      this.dialog.create();
    },
    initWidgets(){
      this.widgets.is_manul = new Combo('#navigation_create_is_manul', [{key: i18n('NAVIGATE_YES'),value: true},{key: i18n('NAVIGATE_NO'),value: false}], {
          backgroundIMGStyle: 2,
          width: '100%',
          height: 30,
          background: "#ffffff",
          selectbackground: "#ffffff",
          disablebackground: "#f6f6f6",
          disableborder: "#c6c6c6"
        }, (value) => {})
    },
    load({el, data}){
      var index = 0;
      switch (el) {
        case 'public':
          var entryType = Model.metadata(index, 'entryType', data.entryType||'1').appendTo($('#navigation_create_folder .group.public_info'))
          index++;
          delete data.source
          delete data.readonly
          for (var item in data) {
            if (data.hasOwnProperty(item)) {
              Model.metadata(index, item, data[item]).appendTo($('#navigation_create_folder .group.public_info'));
              index++;
            }
          }
          Model.metadata(index, '', '').appendTo($('#navigation_create_folder .group.public_info'));
          break;
        default:
        for (var item in data) {
          if (data.hasOwnProperty(item)) {
            Model.metadata(index, item, data[item]).appendTo($('#navigation_create_folder .group.metadata_info'));
            index++;
          }
        }
        Model.metadata(index, '', '').appendTo($('#navigation_create_folder .group.metadata_info'));
      }
    },
    bindEvents(){
      //dialog btn
      $('#navigation_create_folder ._dialog_foot')
      .on('click', '.btn._cancel', () => {
        this.dialog.close();
      })
      .on('click', '.btn._confirm', () => {
        API.create(()=>{
          this.dialog.close();
          API.confirmFn && API.confirmFn();
        })
      });
      // metadata add
      $('#navigation_create_folder ._dialog_body .group')
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
    }
  };
  var API = {
    confirmFn: null,
    create(callback){
        var data = Model.getData(),
        path = Model.path,
        app_key = Model.app_key,
        method = 'Post',
        url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + path + '/' + data.name + '?app_key=' + app_key + '&timestamp=' + new Date().toISOString();
        $.ajax({
          type: method,
          url: url,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
          },
          data: JSON.stringify(data)
        }).always((resp, state, xhr) => {
          if (state == 'success') {
            API.createFolder(path + '/' + resp.name, callback)
            // callback && callback();
          }
        })
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
    }
  };
  var Model = {
    path: null,
    app_key: null,
    metadata(idx, key, value) {
      var row = $('<div>').addClass('row')
      .append($('<label>').html(idx+1))
      .append($('<input class="metadata_key" index="' + idx + '" value="' + key + '">').attr('placeholder', i18n('NAVIGATE_METADATA_KEYINFO')))
      .append($('<input class="metadata_val" index="' + idx + '" value="' + (value||'') + '">').attr('placeholder', i18n('NAVIGATE_METADATA_VALUEINFO')))
      if (key == '') {
        row
        .append('<svg class="opr" name="add" id="rule_add_' + idx + '" data-index="' + idx + '">' + '<polygon points="7,0 10,0 10,7 17,7 17,10 10,10 10,17 7,17 7,10 0,10 0,7 7,7"></polygon>' + '</svg>')
        .append('<svg class="opr" name="del" id="rule_del_' + idx + '" data-index="' + idx + '">' + '<polygon points="0,0 2,0 8.5,7 15,0 17,0 17,2 11,8.5 17,15 17,17 15,17 8.5,11 2,17 0,17 0,15 7,8.5 0,2"></polygon>' + '</svg>')
      } else {
        row.find('input').attr('disabled', 'true');
      }
      return row;
    },
    getData(){
      var data = {
        node_class: 'folder',
        metadata: {},
        metadata_public: {
          entryType: 1
        }
      }
      const THIS = '#navigation_create_folder '
      data.name = $(THIS).find('#navigation_folder_name').val();
      data.ext_id = $(THIS).find('#navigation_node_id').val()
      data.title = $(THIS).find('#navigation_title').val();
      data.is_manual = Boolean(String(Pane.widgets.is_manul.getValue()) == 'true' ? true : false);
      data.index = $(THIS).find('#navigation_node_seq').val();
      data.objects_url = $(THIS).find('#navigation_object_url').val()
      data.objects_url_script = $(THIS).find('#navigation_objects_url_script').val().split(',').filter(item => item);

      data.metadata_public = {};
      $(THIS).find(".group.public_info .row").map((idx, el)=>{
        var key = $(el).find('.metadata_key').val()
        var value = $(el).find('.metadata_val').val()
        if (value && key) {
          data.metadata_public[key] = value
        }
      });
      data.metadata = {};
      $(THIS).find(".group.metadata_info .row").map((idx, el)=>{
        var key = $(el).find('.metadata_key').val()
        var value = $(el).find('.metadata_val').val()
        if (value && key) {
          data.metadata[key] = value
        }
      });
      return data;
    }
  };
  var self = function({path, app_key, confirmFn}){
    Pane.init();
    Model.path = path;
    Model.app_key = app_key;
    API.confirmFn = confirmFn;
  };
  return self;
})(jQuery, PopupDialog, newSelect);
