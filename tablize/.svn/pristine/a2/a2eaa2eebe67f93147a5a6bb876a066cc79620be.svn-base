(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?
    exports.module = factory(jQuery) :
    typeof define === 'function' && define.amd ?
    define(['jQuery'], factory) : (global.node_version = factory(jQuery))
})(this, (function($) {
  var dialog = function({el, data}) {
    var pane = $.extend(true, {}, Pane)
    var api = $.extend(true, {}, API)
    var model = $.extend(true, {}, Model)
    pane.api = api
    pane.model = model
    pane.init({el, data})
  }
  var Pane = {
    init({el, data}) {
      var frame = this.initFrame(el);
      this.loadData(frame, data)
    },
    initFrame(el) {
      var dom = `<div class='attr'>
        <div class='group release_info' name='${i18n('NAVIGATIONVERSION_VERSION')}'>
          <div class='row'>
            <label class='col'>${i18n('NAVIGATIONAUDIT_TABLE_VERSION')}</label>
            <label class='col'>${i18n('NAVIGATIONAUDIT_TABLE_VERSIONNAME')}</label>
          </div>
          <div class='row'>
            <input class='col' id='navigation_release_version'/>
            <input class='col' id='navigation_release_version_desc'/>
          </div>
          <div class='row'>
            <label class='col'>${i18n('NAVIGATIONAUDIT_TABLE_RELEASE')}</label>
            <label class='col'></label>
          </div>
          <div class='row'>
            <input class='col' id='navigation_release_time'/>
            <div class='col'></div>
          </div>
        </div>
        <div class='group audit_info' name='${i18n('NAVIGATIONAUDIT_LASTVERSION')}'>
          <div class='row'>
            <label class='col'>${i18n('NAVIGATIONAUDIT_TABLE_VERSION')}</label>
            <label class='col'>${i18n('NAVIGATIONAUDIT_TABLE_VERSIONNAME')}</label>
          </div>
          <div class='row'>
            <input class='col' id='navigation_version'/>
            <input class='col' id='navigation_version_desc'/>
          </div>
          <div class='row'>
            <label class='col'>${i18n('NAVIGATIONAUDIT_TABLE_SUBMITTIME')}</label>
            <label class='col'>${i18n('NAVIGATIONAUDIT_TABLE_AUDITSTATUS')}</label>
          </div>
          <div class='row'>
            <input class='col' id='navigation_audit_time'/>
            <input class='col' id='navigation_audit_status'/>
          </div>
        </div>
      </div>`;
      $(el).empty().append($(dom))
      return $(el)
    },
    loadData(ctn, data) {
      var {metadata_public} = data;
      ctn.find('.release_info #navigation_release_version').val(metadata_public.release_tree_version)
      ctn.find('.release_info #navigation_release_version_desc').val(metadata_public.release_tree_version_desc)
      ctn.find('.release_info #navigation_release_time').val(metadata_public.release_time)
      ctn.find('.audit_info #navigation_version').val(metadata_public.audit_tree_version)
      ctn.find('.audit_info #navigation_version_desc').val(metadata_public.audit_tree_version_desc)
      ctn.find('.audit_info #navigation_audit_time').val(convertTimeString(metadata_public.audit_tree_audit_time))
      if (metadata_public.audit_tree_audit_status) {
      ctn.find('.audit_info #navigation_audit_status').val(i18n('NAVIGATIONAUDIT_' + metadata_public.audit_tree_audit_status.toUpperCase()))
      }

    }
  }
  var API = {}
  var Model = {}
  return dialog
}))
