var navigation_edit_asset = (function($, Dialog,Metas){
  let Pane = {
    dialog: null,
    program : true,
    fileattr : true,
    widget :{},
    init(){
      this.program = true;
      this.fileattr = true;
      this.dialog = null;
      this.initDialog();
    },
    initDialog() {
      var callback = () => {
        this.bindEvents();
        this.loadFrame();
        this.initMCSB();
      }
      this.dialog = new Dialog({
        url: "content/navigation/asset_edit.html",
        height: 665,
        width: 763,
        context: this,
        callback: callback
      });
      this.dialog.create();
    },
    bindEvents() {
      //btn function
      $('#navigation_asset_editor')
      .on('click', ' ._dialog_foot ._cancel', ({currentTarget, target}) => {
        if(currentTarget == target) {
          Pane.dialog.close();
        }
      })
      .on('click', ' ._dialog_foot ._confirm', ({currentTarget, target}) => {
        if (currentTarget == target) {
          API.update(() => {
            Pane.dialog.close(); 
            API.confirmFn && API.confirmFn();
          });
        }
      })
      $('#navigation_asset_editor ._dialog_body #tree_detail .tabs')
      .on('click', '.tab', ({target, currentTarget}) => {
        if (target == currentTarget) {
          var type = $(currentTarget).attr('name');
          $(currentTarget).addClass('active').siblings().removeClass('active')
          $('#tree_detail #tab-ctn > div[name=' + type + ']').show().siblings().hide();
          switch (type) {
            case 'program_attr':
              Pane.loadFrame();
            break;
            case 'file_attr':
              Pane.loadFileAttrFrame();
            break;
            default:
            }
          }
        })
      // metadata add
      $('#navigation_asset_editor ._dialog_body .program')
      .on('click', 'svg[name=add]',(e) => {
        var parent = $(e.currentTarget).parents('.program')
        var idx = $(e.currentTarget).data('index');
        Model.metadata(idx, '', '').insertAfter(parent.find('.row:eq('+idx+')'));
        parent.find('.row').map((idx, item) => {
          $(item).find('label').html(idx+1);
          $(item).find('input.metadata_key, input.metadata_val, svg').data('index', idx);
        })
      })
      .on('click', 'svg[name=del]', (e) => {
        var parent = $(e.currentTarget).parents('.program')
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
    },
    initMCSB : function (){
      $("#navigation_dialog_body").mCustomScrollbar({
        axis: "y"
      });
    },
    loadFrame(){
      if (this.program) {
        $('#navigation_edit_asset_name').val(Model.data.name);
        $('#navigation_edit_asset_title').val(Model.data.title);
        $('#navigation_edit_asset_desc').val(Model.data.description);
        this.load({group: 'public', data:utils.ObjectFilter(Model.data.metadata_public, function(key, val) {
          return key.indexOf('FILE_') == -1 ? val : null
        }) })
        this.load({group: 'metadata', data: utils.ObjectFilter(Model.data.metadata, function(key, val) {
          return key.indexOf('FILE_') == -1 ? val : null
        }) })
        this.program = false;
      }
    },
    load({group, data}) {
      var index = 0;
      // if (group == 'public') {
      //   var entryType = Model.metadata(index, 'entryType', data.entryType, true).appendTo($('#navigation_asset_editor .group.public_info'));
      //   index++;
      //   var ProviderId = Model.metadata(index, 'ProviderId', data.ProviderId, true).appendTo($('#navigation_asset_editor .group.public_info'));
      //   index++;
      //   var ProviderAssetId = Model.metadata(index, 'ProviderAssetId', data.ProviderAssetId, true).appendTo($('#navigation_asset_editor .group.public_info'));
      //   index++;
      //   // delete data.entryType;
      //   // delete data.ProviderId;
      //   // delete data.ProviderAssetId;
      // }
      var readOnlyKeys = ['tags', 'entryType', 'ProviderId', 'ProviderAssetId']
      for (var item in data) {
        if (data.hasOwnProperty(item) && data[item] && item) {
          var is_readOnly = (group == 'public' && readOnlyKeys.includes(item))
          Model.metadata(index, item, data[item], is_readOnly).appendTo($('#navigation_asset_editor  #tab-ctn #program_attr .' + group + '_info'));
          index++;
        }
      }
      Model.metadata(index, '', '', false).appendTo($('#navigation_asset_editor #tab-ctn #program_attr .' + group + '_info'));
    },  
    loadFileAttrFrame() {
      if (this.fileattr) {
        var public = new Metas({
          el: '#navigation_asset_editor [name=file_attr] .public_info',
          type: 'file',
          path: Model.node.path,
          metas: utils.ObjectFilter([], function(key, val) {
            return key.indexOf('FILE_') !== -1 ? val : null
          })
        });
        this.widget.metadata_public = public;
        var meta = new Metas({
          el: '#navigation_asset_editor [name=file_attr] .metadata_info',
          type: 'file',
          path: Model.node.path,
          metas: utils.ObjectFilter([], function(key, val) {
           return key.indexOf('FILE_') !== -1 ? val : null
         })
        });
        this.widget.metadata = meta;

        if (this.widget.metadata_public) {
        this.widget.metadata_public.setValue(utils.ObjectFilter(Model.data.metadata_public, function(key, val) {
          return key.indexOf('FILE_') !== -1 ? val : null
        }))
        }
        this.widget.metadata.setValue(utils.ObjectFilter(Model.data.metadata, function(key, val) {
          return key.indexOf('FILE_') !== -1 ? val : null
        }))
        this.fileattr = false;
      }
    }
  };
  let API = {
    update(callback){
      let {name, creator_app_key} = Model.tree,
          {path} = Model.node,
          data = Model.getData(),
          method = 'Put',
          url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + path + '/' + Model.data.name + '?app_key=' + creator_app_key;
      $.ajax({
        type: method,
        url: url,
        async: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(data)
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
    },
    deepClone(desc, src) {
      var ret = null;
      if ($.isEmptyObject(desc)) {
        ret = {}
      } else {
        ret = this.deepClone({}, desc)
      }
      for (var key in src) {
        if (src.hasOwnProperty(key)) {
          switch (Object.prototype.toString.call(src[key])) {
            case '[object String]':
            case '[object Boolean]':
            case '[object Function]':
            case '[object Number]':
            case '[object Null]':
            case '[object Undefined]':
              ret[key] = src[key]
              break;
            case '[object Array]':
              ret[key] = [];
              for (var i = 0; i < src[key].length; i++) {
                var item = this.deepClone({}, {value: src[key][i]}).value
                ret[key].push(item)
              }
              break;
            default://object
              ret[key] = this.deepClone(ret[key], src[key])
          }
        }
      }
      return ret;
    }
  };
  let Model = {
    metadata(idx, key, value, isDisabled) {
      var row = $('<div>').addClass('row')
      .append($('<label>').html(idx+1))
      .append($('<input class="metadata_key" index="' + idx + '" value="' + key + '">').attr('placeholder', i18n('NAVIGATE_METADATA_KEYINFO')))
      .append($('<input class="metadata_val" index="' + idx + '" value="' + value + '">').attr('placeholder', i18n('NAVIGATE_METADATA_VALUEINFO')))
      if (isDisabled) {
        row.find('input').attr('disabled', 'true');
      } else {
        row
        .append('<svg class="opr" name="add" id="rule_add_' + idx + '" data-index="' + idx + '">' + '<polygon points="7,0 10,0 10,7 17,7 17,10 10,10 10,17 7,17 7,10 0,10 0,7 7,7"></polygon>' + '</svg>')
        .append('<svg class="opr" name="del" id="rule_del_' + idx + '" data-index="' + idx + '">' + '<polygon points="0,0 2,0 8.5,7 15,0 17,0 17,2 11,8.5 17,15 17,17 15,17 8.5,11 2,17 0,17 0,15 7,8.5 0,2"></polygon>' + '</svg>')
      }
      return row;
    },
    getData(){
      let ret = JSON.parse(JSON.stringify(this.data))
      ret.name = $('#navigation_asset_editor #navigation_edit_asset_name').val()
      ret.title = $('#navigation_asset_editor #navigation_edit_asset_title').val()
      ret.description = $('#navigation_asset_editor #navigation_edit_asset_desc').val()
      //清空非FILE类型属性
      ret.metadata = this.emptyMetas(ret.metadata, 'attr');
      ret.metadata_public = this.emptyMetas(ret.metadata_public, 'attr');

      //节目属性
      $('#navigation_asset_editor #program_attr .metadata_info .row').map((index, item) => {
        var key = $(item).find('.metadata_key').val(),
            val = $(item).find('.metadata_val').val();
        if (key && val) {
          ret.metadata[key] = val
        }
      });
      $('#navigation_asset_editor #program_attr .public_info .row').map((index, item) => {
        var key = $(item).find('.metadata_key').val(),
            val = $(item).find('.metadata_val').val();
        if (key && val) {
          const booleanKey = ['readonly', 'needSetNavPath', 'is_primary', 'need_release']
          const arrayKey = ['tags']
          if (booleanKey.includes(key)) {
            ret.metadata_public[key] = (val == 'true' ? true : false)
          } else if (arrayKey.includes(key)) {
            ret.metadata_public[key] = val.split(',').filter(item => !(item == ''  || typeof item == 'undefined' || item == null || isNaN(item)))
          } else {
          ret.metadata_public[key] = val
          }
        }
      });
      var fileData = {}
      if (Pane.widget.metadata_public) {
        ret.metadata_public = this.emptyMetas(ret.metadata_public, 'file');
        fileData.metadata_public = Pane.widget.metadata_public.getValue()
        }
      if (Pane.widget.metadata) {
        ret.metadata = this.emptyMetas(ret.metadata, 'file');
      fileData.metadata = Pane.widget.metadata.getValue()
      }
      ret = API.deepClone(ret, fileData);
      return ret;
    },
    emptyMetas(data, type) {
      switch (type) {
        case 'file':
          for (var key in data) {
            if (data.hasOwnProperty(key) && key.indexOf('FILE_') == 0) {
              delete data[key]
            }
          }
          break;
        default:
            for (var key in data) {
            if (data.hasOwnProperty(key) && key.indexOf('FILE_') !== 0) {
                delete data[key]
              }
            }
      }
      return data;
    }
  };
  var utils = {
    ObjectFilter(obj, filter) {
      var ret = {}
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          var item = filter(key, obj[key])
          if (item !== null) {
            ret[key] = item
          }
        }
      }
      return ret;
    }
  }
  let a = function({data, tree, node, confirmFn}){
    API.confirmFn = Model.data = Model.tree = Model.node = null;
    Pane.init();
    API.confirmFn = confirmFn;
    Model.tree = tree;
    Model.node = node
    Model.data = data;
  }
  return a;
})(jQuery, PopupDialog,metas)
