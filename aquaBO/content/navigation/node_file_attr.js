var node_file_attr = (function($, Combo, Metas) {
  var frame = function ({el, type, tree, node, confirmFn, path, data}) {
    Pane.type = Pane.path = API.confirmFn = Model.tree = Model.node = Model.data = null;
    Pane.type = type;
    API.confirmFn = confirmFn;
    Model.tree = tree;
    Model.node = node;
    Pane.path = path
    Pane.init(el, type)
    if (data) {
      Pane.appType = data.metadata_public.app_type || 0
      Pane.loadFrame({
        type: Pane.type,
        data: data
      });
    } else {
      API.getNode((resp) => {
        Pane.appType = resp.metadata_public.app_type || 0
        Pane.loadFrame({
          type: Pane.type,
          data: resp
        });
      });
    }
    this.getValue = ()=>{
      return Pane.getValue()
    }
  }
  var Pane = {
    widget: {},
    init(el, type) {
      var dom = `<div class='file'>
        ${type == 'tree' ? `` : `<div class='public_info group metadata'></div>`}
        <div class='metadata_info group metadata'></div>
      </div>`
      $(el).empty().append($(dom))
      Pane.initFrame(type);
    },
    initFrame(type) {
     switch (type) {
       case 'tree':
          this.widget.public = new Combo('#is_public', [{
            key: i18n('NAVIGATE_YES'),
            value: true
          }, {
            key: i18n('NAVIGATE_NO'),
            value: false
          }], {
           backgroundIMGStyle: 2,
           width: '100%',
           height: 30,
           background: "#ffffff",
           selectbackground: "#ffffff",
           disablebackground: "#f6f6f6",
           disableborder: "#c6c6c6"
         }, (value) => {})
         break;
       default:
          this.widget.manul = new Combo('#is_manul', [{
            key: i18n('NAVIGATE_YES'),
            value: true
          }, {
            key: i18n('NAVIGATE_NO'),
            value: false
          }], {
           backgroundIMGStyle: 2,
           width: '100%',
           height: 30,
           background: "#ffffff",
           selectbackground: "#ffffff",
           disablebackground: "#f6f6f6",
           disableborder: "#c6c6c6"
         }, (value) => {});
          this.widget.manul.setDisable();
       var public = new Metas({
         el: '[name=file_attr] .public_info',
         type: 'file',
         path: this.path,
         metas: utils.ObjectFilter([], function(key, val) {
           return key.indexOf('FILE_') !== -1 ? val : null
         })
       })
       this.widget.metadata_public = public
     }
     var meta = new Metas({
       el: '[name=file_attr] .metadata_info',
       type: 'file',
       path: this.path,
       metas: utils.ObjectFilter([], function(key, val) {
         return key.indexOf('FILE_') !== -1 ? val : null
       })
     })
     this.widget.metadata = meta
   },
    loadFrame({type, data = {}}) {
      if (this.widget.metadata_public) {
      this.widget.metadata_public.setValue(utils.ObjectFilter(data.metadata_public, function(key, val) {
        return key.indexOf('FILE_') !== -1 ? val : null
      }))
      }
      this.widget.metadata.setValue(utils.ObjectFilter(data.metadata, function(key, val) {
        return key.indexOf('FILE_') !== -1 ? val : null
      }))
      var appType = API.getAppType();
      var keys = appType.filter(item => item.appKey == this.appType)
      if (this.widget.metadata_public) {
      this.widget.metadata_public.updateKeyOption((keys.length > 0 ? keys[0] : {keys:[]}).keys.filter(item => item.indexOf('FILE_') == 0))
      }
      this.widget.metadata.updateKeyOption((keys.length > 0 ? keys[0] : {keys:[]}).keys.filter(item => item.indexOf('FILE_') == 0))
   },
    load({type, group, data}) {
     var index = 0;
     switch (type) {
       case 'tree':
       if (group == 'public') {
         var source = Model.metadata(index, 'source', data.source, true).appendTo($('#tree_editor .group.public_info'));
         index++;
         var readonly = Model.metadata(index, 'readonly', data.readonly, true).appendTo($('#tree_editor .group.public_info'));
         index++;
         delete data.source
         delete data.readonly
       }
         break;
       default:
       if (group == 'public') {
         var entryType = Model.metadata(index, 'entryType', data.entryType, true).appendTo($('#tree_editor .group.public_info'));
         index++;
         delete data.entryType;
       }
     }
     for (var item in data) {
       if (data.hasOwnProperty(item) && data[item] && item) {
         Model.metadata(index, item, data[item], false).appendTo($('#tree_editor .group.' + group + '_info'));
         index++;
       }
     }
     Model.metadata(index, '', '').appendTo($('#tree_editor .group.' + group + '_info'));
   },
    getValue() {
      var ret = {}
      if (this.widget.metadata_public) {
        ret.metadata_public = this.widget.metadata_public.getValue()
        }
      ret.metadata = this.widget.metadata.getValue()
      return ret;
   }
 };
 var API = {
   getNode(callback){
     let {name, creator_app_key} = Model.tree,
         {id} = Model.node,
         method = 'Get',
         url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/by_id:' + id,
         urlParam = [];
     urlParam.push('app_key=' + paasAppKey)//应用级授权
     urlParam.push('timestamp=' + new Date().toISOString());//应用级授权
     urlParam.push('tree_version=00')
     url += '?' + urlParam.join('&')
     $.ajax({
       type: method,
       url: url,
       async: true,
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
       }
     }).always((resp, status, xhr) => {
       if (status == 'success') {
          callback && callback(resp);
       }
     })
   },
   getAppType() {
     var ret = []
     $.ajax({
       type: 'Get',
       async: false,
       url: './appType.config',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       dataType: 'json'
     }).always((resp, status, xhr) => {
       if (status == 'success') {
         ret = ret.concat(resp);
       }
     })
     return ret;
  }
 };
 var Model = {
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
return frame;
})(jQuery, newSelect, metas)
