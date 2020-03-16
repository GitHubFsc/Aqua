function IndexChecker(obj) {
  /*
   * obj
   * {
   *     indexes: [],
   *     title: ,
   *     width: ,
   *     height: ,
   *     dialogHtml,
   *     ... // following instance props
   * }
   */
  this.title = '';
  this.width = 662;//532;
  this.height = 500;//366;
  this.indexes = [];
  this.deSelectText = i18n('DAY_SUM_INDEX_CHECKER_DESELECT');
  this.cancelText = i18n('DAY_SUM_INDEX_CHECKER_CANCEL');
  this.setSelectText = i18n('DAY_SUM_INDEX_CHECKER_SETSELECT');
  jQuery.extend(this, obj);
  this._init();
}

IndexChecker.prototype = {
  _init: function() {
    var _this = this;
    _this._sortIndexGroup();
    _this.popup = new PopupDialog({
      width: _this.width,
      height: _this.height,
      local: true,
      content: _this._getDialogHtml(),
      posFixed: true,
      context: {},
      callback: function() {
        jQuery('#index_checker_title').html(_this.title);
        _this.drawGroups();
        jQuery('#index_checker_setselect').html(_this.setSelectText).on('click', function() {
          _this.setSelect();
        });
        jQuery('#index_checker_cancel').html(_this.cancelText);
        jQuery('#index_checker_deselect').html(_this.deSelectText).on('click', function() {
          if(jQuery(this).hasClass('index_checker_deselect_active')){
            _this.deSelectAll();
          }
        });

      }

    });
  },

  _sortIndexGroup: function(){
    this.groups = new Set();
    this.groupMap = new Map();
    this.nullGroup = [];
    for(var i = 0, len = this.indexes.length; i < len; i+=1){
      var index = this.indexes[i];
      if(index.group != null){
        var group = index.group;
        if(!this.groups.has(group)){
          this.groups.add(group);
        }
        if(!this.groupMap.has(group)){
          this.groupMap.set(group, []);
        }
        var groupList = this.groupMap.get(group);
        groupList.push(index);
      } else {
        this.nullGroup.push(index);
      }
    }
  },

  open: function() {
    this.popup.open();
  },

  close: function() {
    this.popup.close();
  },

  setSelect: function() {
    var _this = this;
    if(this._checkerList != null){
      _this.indexes.forEach(function(index){
        if(jQuery('.index_checker_item[data-index-key='+ index.key +']').children('.special_checkbox_active').length > 0){
          index.checked = true;
        } else {
          index.checked = false;
        }
      });
    }
    this.close();
    if ( typeof this.onSelect == 'function') {
      try{
        this.onSelect();
      }catch(e){
        console.log(e.message);
      }
    }
  },

  getSelected: function(){
    var selected = [];
    this.indexes.forEach(function(index){
      if(index.checked){
        selected.push(index);
      }
    });
    return selected;
  },

  onSelect: function() {
  },

  deSelectAll: function() {
    if(this._checkerList != null){
      this._checkerList.find('.special_checkbox_active').removeClass('special_checkbox_active');
      jQuery('#index_checker_deselect').removeClass('index_checker_deselect_active');
    }
  },

  drawGroups: function(){
    var _this = this;
    var frag = document.createDocumentFragment();
    if(this.groups != null){
      this.groups.forEach(function(group){
        var groupList = _this.groupMap.get(group);
        jQuery('<div>').addClass('index_checker_group')
          .append(
            jQuery('<div>').addClass('index_checker_group_label').append(group.label)
          ).append(
            _this.drawCheckers(groupList)
          ).appendTo(frag);
      });
    }
    if(this.nullGroup.length > 0){
      jQuery('<div>').addClass('index_checker_group')
        .append(
          jQuery('<div>').addClass('index_checker_group_label')
        ).append(
          _this.drawCheckers(this.nullGroup)
        ).appendTo(frag);
    }
    this._checkerList = jQuery('#index_checker_list').empty().append(frag);

    if(jQuery('.special_checkbox_active').length > 0){
      jQuery('#index_checker_deselect').addClass('index_checker_deselect_active');
    }
  },

  drawCheckers: function(indexes){
    var total = indexes.length;
    var frag = jQuery('<div>').addClass('index_checker_group_list');
    var $checkAll = jQuery('<div>').addClass('index_checker_item');
    var $checkAllSelect = jQuery('<div class="special_checkbox_outer index_checker_selectall"><div class="special_checkbox_inner"></div></div>');
    $checkAllSelect.on('click', function(){
      var $sel = jQuery(this);
      $sel.toggleClass('special_checkbox_active');
      if($sel.hasClass('special_checkbox_active')){
        frag.find('.special_checkbox_outer:not(.index_checker_selectall)').addClass('special_checkbox_active');
        jQuery('#index_checker_deselect').addClass('index_checker_deselect_active');
      } else {
        frag.find('.special_checkbox_outer:not(.index_checker_selectall)').removeClass('special_checkbox_active');
        if(jQuery('.special_checkbox_active').length == 0){
          jQuery('#index_checker_deselect').removeClass('index_checker_deselect_active');
        }
      }
    });
    $checkAll.append($checkAllSelect)
      .append(jQuery('<div class="index_checker_label"><div>').append(i18n('DAY_SUM_INDEX_CHECKER_SELECTALL')))
      .appendTo(frag);
    for(var i = 0; i < total; i+=1){
      var item = indexes[i];
      if(item != null){
        var $checker = jQuery('<div>').addClass('index_checker_item').appendTo(frag);
        $checker.attr('data-index-key', item.key);
        var checkbox = jQuery('<div class="special_checkbox_outer"><div class="special_checkbox_inner"></div></div>');
        if(item.checked){
          checkbox.addClass('special_checkbox_active');
        }
        $checker.append(checkbox);
        $checker.append(
          jQuery('<div class="index_checker_label"><div>').append(item.label)
        );
      }
    }

    frag.on('click', '.special_checkbox_outer:not(.index_checker_selectall)', function(){
        jQuery(this).toggleClass('special_checkbox_active');
        if(frag.find('.special_checkbox_active:not(.index_checker_selectall)').length == total){
          $checkAllSelect.addClass('special_checkbox_active');
        } else {
          $checkAllSelect.removeClass('special_checkbox_active');
        }
        if(jQuery('.special_checkbox_active').length > 0){
          jQuery('#index_checker_deselect').addClass('index_checker_deselect_active');
        } else {
          jQuery('#index_checker_deselect').removeClass('index_checker_deselect_active');
        }
    });
    if(frag.find('.special_checkbox_active:not(.index_checker_selectall)').length == total){
      $checkAllSelect.addClass('special_checkbox_active');
    }
    return frag;
  },

  _getDialogHtml: function() {
    if(this.dialogHtml != null){
      return this.dialogHtml;
    }
    var html = `
<div class="wp_panel_dialog index_checker_dialog">
  <div class="wp_panel_dialog_title index_checker_dialog_title">
    <div class="wp_panel_dialog_title_label" id="index_checker_title"></div>
    <div class="wp_panel_dialog_close popup_dialog_clear"></div>
  </div>
  <div class="wp_panel_dialog_content index_checker_dialog_content">
    <div id="index_checker_list">
    </div>
    <div id="index_checker_deselect" class="index_checker_deselect"></div>
    <div id="index_checker_cancel" class="index_checker_cancel popup_dialog_clear"></div>
    <div id="index_checker_setselect" class="index_checker_setselect"></div>
  </div>
</div>
`;
    return html;
  }

};