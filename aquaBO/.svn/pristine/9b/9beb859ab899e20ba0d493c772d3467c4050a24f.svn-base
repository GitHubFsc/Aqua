(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?
    exports.module = factory(jQuery, InputCombo, MetaUploader, OverlayDialog) :
    typeof define === 'function' && define.amd ?
    define(['jquery', 'input_combo', 'metauploader', 'overlayDialog'], factory) : (global.metas = factory(jQuery, InputCombo, MetaUploader, OverlayDialog))
})(this, (function($, InputCombo, MetaUploader, Dialog) {
  const readOnlyBooleanMetas = ['readonly', 'needSetNavPath', 'is_primary', 'need_release', 'is_active_release']
  const readOnlyMetas = readOnlyBooleanMetas.concat([/*tree标签*/'source', 'version', 'version_desc', 'audit_tree_version', 'audit_tree_version_desc', 'audit_tree_audit_time', 'audit_tree_audit_status', 'last_snapshot_version', 'audit_status', 'release_status', 'audit_time', 'release_time', 'primary_tree_id',/*node标签*/'tags', 'entryType'])
  var dialog = function(opts) {
    var model = $.extend(true, {}, Model);
    var api = $.extend(true, {}, API);
    var pane = $.extend(true, {}, Pane, {keyCombo: opts.keyCombo || false, type: opts.type || 'default', path: opts.path||'', api, model});
    var meta = pane.init(opts)
    $(opts.el).append(meta);
    // pane.setValue(opts.metas)
    this.getValue = () => {
      return pane.getValue()
    }
    this.setValue = (metadata) => {
      pane.setValue(metadata);
    }
    this.updateKeyOption = (options) => {
      pane.setKeylist(options);
    }
  }
  var Pane = {
    ctn: '',
    type: '',
    meta: [],
    path: '',
    keyCombo: false,
    init({type, index = 0, el}) {
      var dom, widgets;
      this.type = type
      this.ctn = $(el);
      switch (this.type) {
        case 'file':
          ({dom, widgets} = this.initFileFrame({el, index}));
          break;
        default:
          ({dom, widgets} = this.initDefaultFrame({el, index}))
      }
      this.meta = this.meta.slice(0, index).concat([widgets]).concat(this.meta.slice(index))
      return {dom, widgets}
    },
    initDefaultFrame({el, isDisabled='', index=1}) {
      var dom = this.model.normal({el, isDisabled, index})
      dom.on('contextmenu', 'input.metadata_val', (e) => {
        if (e.currentTarget == e.target) {
          e.preventDefault();
          var isDisabled = !!$(e.currentTarget).attr('disabled')
          if (!isDisabled) {
            this.showRightMenu(e, val => {
              $(e.currentTarget).val(val)
            })
          }
        }
      })
      if (index == 0) {
        $(el).append(dom)
      } else {
        // dom.insertAfter('[id^=wid_]:eq(' + parseInt(index - 1) + ')')
        var prevDom = $(el).find('[id^=wid_]:eq(' + parseInt(index - 1) + ')')
        dom.insertAfter(this.ctn.selector + ' [id=' + prevDom.attr('id') + ']');
      }
      var widgets = this.initWidgets(dom);
      this.bindEvents(dom);
      return {dom, widgets}
    },
    initFileFrame({el, isDisabled='', index=1}) {
      var dom = this.model.file({el, isDisabled, index})
      if (index == 0) {
        $(el).append(dom)
      } else {
        dom.insertAfter(this.ctn.selector + ' [id^=wid_]:eq(' + parseInt(index - 1) + ')')
      }
      var widgets = this.initWidgets(dom);
      this.bindEvents(dom);

      return {dom, widgets}
    },
    initWidgets(widget) {
      var widgets = [];
      var elId = widget.find('.metadata_key').attr('id')
      if (elId) {
        var keyCombo = new InputCombo({
          el: '#' + elId,
          showCombo: this.keyCombo,
          content: this.keyList
        })
        widgets.push(keyCombo)
      }
      if (this.type == 'file') {
        var fileId = '#' + widget.find('.metadata_val').attr('id')
        var file = new MetaUploader({
          el: fileId,
          path: this.path
        })
        widgets.push(file)
      } else {
        widgets.push($('#' + widget.find('.metadata_val').attr('id')))
      }
      return widgets
    },
    bindEvents(dom) {
      dom.on('click', 'svg[name=add] polygon', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var elDom = $(currentTarget)
          if (elDom.parent().attr('id').indexOf('value') !== -1) {
            // dom.append()
            var input = this.model.value()
            var selfDom = elDom.parents('[id^=val_]');
            input.insertAfter('#' + selfDom.attr('id'))
            var selfDomIndex = selfDom.index();
            var metaWidget = this.meta[dom.index()];
            metaWidget = metaWidget.slice(0, selfDomIndex + 1).concat(this.initWidgets(input)).concat(metaWidget.slice(selfDomIndex + 1))
            this.meta[dom.index()] = metaWidget;
            // widgets = widgets.concat(this.initWidgets(input))
            console.log(this.meta);
          } else {
            var index = parseInt(elDom.parents('[id^=wid_]').find('.meta_index').html())
            var meta = this.init({el: this.ctn, index: index, type: this.type}).dom
            // meta.insertAfter('div#' + dom.parents('[id^=wid_]').attr('id'))
          }
          console.log('add');
          this.adjust_index()
        }
      })
      .on('click', 'svg[name=del] polygon', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var dom = $(currentTarget)
          if (dom.parent().attr('id').indexOf('rule')!== -1) {
            this.removeNode('key', dom.parents('[id^=wid_]'));
          } else {
            this.removeNode('val', dom.parents('[id^=val_]:not(.metadata_val)'));
          }
          this.adjust_index()
        }
      })
      .on('click', '.i-check', ({currentTarget, target}) => {
        //多文件控制
      })
      .on('keyup', 'input.metadata_val', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var val = $(currentTarget).val()
          $(currentTarget).data('value', val);
        }
      })
      .on('keyup', 'input.metadata_key', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var val = $(currentTarget).val()
          $(currentTarget).data('value', val);
        }
      })
    },
    adjust_index() {
      this.ctn.find('label.meta_index').map((idx, item) => {
        $(item).html(idx + 1).attr('title', idx + 1)
      })
    },
    removeNode(type, node) {
      if (node.siblings(':not(.disabled)').length > (type == 'key' ? 0 : 1)) {
        var index = node.index();
        if (type == 'key') {
          this.meta = this.meta.slice(0, index).concat(this.meta.slice(index + 1))
        } else {
          var p_index = node.parents('[id^=wid_]').index();
          var widget = this.meta[p_index]
          widget = widget.slice(0, index).concat(widget.slice(index + 1))
          this.meta[p_index] = widget
        }
        node.remove()
      } else {
        var index = node.index();
        if (type == 'key') {
          this.meta[index][0].setValue('')
          for (var i = 1; i < this.meta[index].length; i++) {
            if (typeof this.meta[index][i].setValue == 'function') {
              this.meta[index][i].setValue('')
            } else {
              this.meta[index][i].val('')
            }
          }
          node.find('[id^=val_]:not(:eq(0))').remove()//删除多余的内容
          this.meta[index] = this.meta[index].slice(0,2)
        } else {
          var p_index = node.parents('[id^=wid_]').index();
          this.meta[p_index][index].setValue('')
        }
      }
    },
    getValue() {
      var ret = []
      if (this.type == 'file') {
        ret = this.meta.map((widgets, index) => {
          var meta = {}
          var key = widgets[0].getValue()
          if (key) {
            if (['Poster'].includes(key)) {
              meta[key] = widgets.slice(1).map((widget, idx) => {
                return widget.getValue()
              }).filter(item => item !== '')
            } else if ('tags' == key) {

            } else {
            meta[key] = widgets.slice(1).map((widget, idx) => {
              return widget.getValue()
            }).filter(item => item !== '').join(',')
          }
          }
          return meta
        })
      } else {
        ret = this.meta.map((widgets, index) => {
          var meta = {}
          var key = widgets[0].getValue()
          if (key) {
            if (readOnlyBooleanMetas.includes(key)) {
              var valueEl = this.ctn.find('.meta_index[title=' + (index + 1) + ']').parents('[id^=wid_]').find('.metadata_val')
              meta[key] = (valueEl.data('value') ? valueEl.data('value') : valueEl.val()) == 'true' ? true : false
           } else {
             var valueEl = this.ctn.find('.meta_index[title=' + (index + 1) + ']').parents('[id^=wid_]').find('.metadata_val')
             meta[key] = valueEl.data('value') ? valueEl.data('value') : valueEl.val();
          }
          }
          return meta;
        })
      }
      var meta = {};
      ret.map((item) => {
        if (JSON.stringify(item) !== '{}') {
          meta = $.extend(true, meta, item)
        }
      })
      return meta;
    },
    setValue(metas) {
      //分解meta属性
      var dealeddata = []
      for (var key in metas) {
        if (metas.hasOwnProperty(key) && readOnlyMetas.includes(key)) {
          var set = []
          set.push(key);
          var vals
          switch (Object.prototype.toString.call(metas[key])) {
            case '[object Boolean]':
            case '[object Array]':
              vals = metas[key]
            break;
            default:
            vals = metas[key].split(',')
          }
          set = set.concat(vals)
          dealeddata.push(set)
        }
      }
      //然后取出剩余属性
      for (var key in metas) {
        if (metas.hasOwnProperty(key) && !readOnlyMetas.includes(key)) {
          var set = []
          set.push(key);
          var vals = String(metas[key]).split(',')
          set = set.concat(vals)
          dealeddata.push(set)
        }
      }
      //开始加载值并且渲染页面
      for (var i = 0; i < dealeddata.length; i++) {
        var set = dealeddata[i]
        if (!this.meta[i]) {
          var meta = this.init({el: this.ctn, index: i, type: this.type}).dom
          // this.ctn.append(meta)
        }
        if (this.type !== 'file') {//普通属性
          this.meta[i][0].setValue(set[0]);
          var value = set.slice(1).join(',')
          this.meta[i][1].val(set[0] == 'audit_tree_audit_status' ? i18n('NAVIGATIONAUDIT_' + value.toUpperCase()): value).data('value', value)
          if (readOnlyMetas.includes(set[0])) {
            this.meta[i][0].disable();
            this.meta[i][1].attr('disabled', '')
            this.ctn.find('[id^=wid_]:eq(' + i + ')').addClass('disabled')
          }
        } else {//文件类属性
          var is_readOnly = false;
          for (var j = 0; j < set.length; j++) {
            var item = set[j]
            if(!this.meta[i][j]) {
              var input = this.model.value()
              var parent = this.ctn.find('[id^=wid_]:eq(' + i + ')')
              parent.append(input)
              this.meta[i] = this.meta[i].concat(this.initWidgets(input))
            }
            this.meta[i][j].setValue(item)
            if (j == 0 && readOnlyMetas.includes(item)) {
              is_readOnly = true
            }
            if (is_readOnly) {
              this.meta[i][j].disable();
            }
          }
        }
      }
      if (dealeddata.length == this.meta.length) {
        this.init({el: this.ctn, index: this.meta.length, type: this.type})
      }
    },
    setKeylist(list) {
      if (list && list.length > 0) {
        this.keyCombo = true;
        this.keyList = list.map((item, index) => {
          return {
            label: item,
            value: item
          }
        })
        for (var i = 0; i < this.meta.length; i++) {
          this.meta[i][0].update({
            content: this.keyList,
            enable: this.keyCombo
          })
        }
      } else {
        this.keyCombo = false;
        for (var i = 0; i < this.meta.length; i++) {
          this.meta[i][0].update({
            enable: this.keyCombo
          })
        }
      }
    },
    showRightMenu(e_o, callback) {
      var position = {x: e_o.clientX + window.scrollX, y: e_o.clientY + window.scrollY}
      if ($('[id^=menu_right_]').length > 0) {
        $('[id^=menu_right_]').remove();
      }
      var dom = '<div id="menu_right_' + new Date().getTime() + '">';
          dom += '<a name="multiEditor">' + i18n('NAVIGATE_RIGHTMENU_TEXT') + '</a>';
          dom += '<a name="picChooser">' + i18n('NAVIGATE_RIGHTMENU_PIC') + '</a>';
          dom += '</div>'
      var menu = $(dom)
      menu.css({
        position: 'absolute',
        left: position.x,
        top: position.y,
        backgroundColor: '#fff',
        border: '1px solid #e2e2e2',
        borderBottom: 'none',
        width: '150px',
        zIndex: 1,
        color: '#797979'
      }).appendTo(document.body)
      .find('a').css({
        display: 'block',
        cursor: 'pointer',
        lineHeight: '30px',
        height: '30px',
        borderBottom: '1px solid #e2e2e2',
        paddingLeft: '10px'
      })
      $(document.body).one('click', (e) => {
        menu.remove();
      })
      menu.on('click', 'a', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var type = $(currentTarget).attr('name')
          switch (type) {
            case 'multiEditor':
              this.multiEditor($(e_o.currentTarget).val(), callback)
              break;
            case 'picChooser':
              this.picChooser((resp) => {
                $(e_o.currentTarget).val(resp)
              });
            default:

          }
          menu.remove();
        }
      })
    },
    multiEditor(text, callback) {
      var dialogId = 'multiEditor_' + new Date().getTime()
      var dom = `<div class='_dialog' id='${dialogId}'>
        <link rel='stylesheet' href='style/dialog.css' />
        <div class='_dialog_title'>
          <div class='_dialog_title_label'>${i18n('NAVIGATE_RIGHTMENU_TEXT')}</div>
          <div class='_span'></div>
          <div class='_dialog_close popup_dialog_clear'></div>
        </div>
        <div class='_dialog_body'>
          <div id='textarea_${dialogId}' style='margin: 8px 8px;'></div>
        </div>
        <div class='_dialog_foot'>
          <div class='btn _cancel'>${i18n('AUTH_MNG_DIALOG_CANCEL')}</div>
          <div class='btn _confirm'>${i18n('AUTH_MNG_DIALOG_DETAIL_CONFIRM')}</div>
        </div>
      </div>`;
      var dialog = new Dialog({
        id: dialogId,
        width: 420,
        height: 350,
        content: dom,
        local: true,
        context: this,
        callback: () => {
          var editor = UE.getEditor('textarea_' + dialogId, {
            toolbars: [['cleardoc', 'selectall', 'undo', 'redo']],
            elementPathEnabled: false,
            initialFrameHeight: 200,
            initialFrameWidth: 400,
            wordCount: false,
            autoHeight: false
          })
          editor.ready(function() {
            if (text) {
              editor.setContent(text)
            }
          })
          $('#' + dialogId)
          .on('click', '.btn._cancel, ._dialog_close', ({currentTarget, target}) => {
            if (currentTarget == target) {
              UE.delEditor('textarea_' + dialogId)
              dialog.close()
            }
          })
          .on('click', '.btn._confirm', ({currentTarget, target}) => {
            if (currentTarget == target) {
              callback && callback(editor.getContent())
              UE.delEditor('textarea_' + dialogId)
              dialog.close()
            }
          })
        }
      })
      dialog.create();
    },
    picChooser(callback) {
      var dialogId = 'pic_' + new Date().getTime();
      var dom = `<div class='_dialog'>
        <div class='_dialog_title'>
          <div class='_dialog_title_label'>选择图片</div>
          <div class='_dialog_span'></div>
          <div class='_dialog_close'></div>
        </div>
        <div class='_dialog_body' style='height: 300px;'></div>
      </div>`
      var dialog = new Dialog({
        id: dialogId,
        width: 420,
        height: 350,
        content: dom,
        local: true,
        context: this,
        callback: () => {
          this.api.getServerPosts(NAVIGATION_PIC_HOST, this.model.posts, (fragment) => {
            $('#' + dialog.dialogId).find('._dialog_body').empty().append(fragment)
            $('#' + dialog.dialogId + ' ._dialog_body').mCustomScrollbar({
              theme: 'groundgreen'
            });
          })
          $('#' + dialog.dialogId)
          .on('click', '._dialog_close', () => {
            dialog.close();
          })
          .on('click', '.pic img', ({currentTarget, target}) => {
            if (currentTarget == target) {
              var url = $(currentTarget).attr('src')
              callback && callback(url)
              dialog.close();
            }
          })
          .on('click', '.pic .folder', ({currentTarget, target}) => {
            if (currentTarget == target) {
              var url = $(currentTarget).attr('name');
              if (url.indexOf(NAVIGATION_PIC_HOST) == -1) {
                return;
              }
              this.api.getServerPosts(url, this.model.posts, (fragment) => {
                $('#' + dialog.dialogId).find('._dialog_body .mCSB_container').empty().append(fragment)
                $('#' + dialog.dialogId + ' ._dialog_body').mCustomScrollbar('update');
              })
            }
          })
        }
      });
      dialog.create();
    }
  }
  var API = {
    getServerPosts(url, model, callback) {
      $.ajax({
        method: 'Get',
        url: url,
        async: true
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback(model(resp))
        }
      })
    }
  }
  var Model = {
    normal({el, index=0, isDisabled=''}) {
      var timestamp = new Date().getTime();
      var dom = `<div id='wid_${timestamp}'>
        <label class='meta_index' title='${index+1}'>${index+1}</label>
        <div id='key_${timestamp}' class="metadata_key" placeholder='${'在此填写key'}' ${isDisabled?'disabled':''} style='display: inline-block'></div>
        <input id='value_${timestamp}' class="metadata_val" placeholder='${'在此填写value'}' ${isDisabled?'disabled':''}/>
        <svg style='height: 18px;width: 18px;' class='opr' name='add' id='rule_add_${timestamp}' data-index='${index}'><polygon points='7,0 10,0 10,7 17,7 17,10 10,10 10,17 7,17 7,10 0,10 0,7 7,7'></polygon></svg>
        <svg style='height: 18px;width: 18px;' class='opr' name='del' id='rule_del_${timestamp}' data-index='${index}'><polygon points='0,0 2,0 8.5,7 15,0 17,0 17,2 11,8.5 17,15 17,17 15,17 8.5,11 2,17 0,17 0,15 7,8.5 0,2'></polygon></svg>
      </div>`;
      var widget = $(dom)
      return widget
    },
    file({el, index=0, isDisabled=''}) {
      var timestamp = new Date().getTime();
      var dom = `<div id='wid_${timestamp}'>
        <div style='display: flex;align-items: center;'>
          <label class='meta_index'>${index+1}</label>
          <div id='key_${timestamp}' class="metadata_key" placeholder='${'在此填写key'}' ${isDisabled?'disabled':''}></div>
          <div id='multi_${timestamp}' class='i-check'>
            <input name='check' type='checkbox'>
            <label></label>
          </div>
          <label style='border: none;flex: 1;text-align: left;padding-left: 10px;'>${i18n('NAVIGATION_MULTIFILE')}</label>
          <svg style='height: 18px;width: 18px;' class='opr' name='add' id='rule_add_${timestamp}' data-index='${index}'><polygon points='7,0 10,0 10,7 17,7 17,10 10,10 10,17 7,17 7,10 0,10 0,7 7,7'></polygon></svg>
          <svg style='height: 18px;width: 18px;' class='opr' name='del' id='rule_del_${timestamp}' data-index='${index}'><polygon points='0,0 2,0 8.5,7 15,0 17,0 17,2 11,8.5 17,15 17,17 15,17 8.5,11 2,17 0,17 0,15 7,8.5 0,2'></polygon></svg>
        </div>
        <div id='val_${timestamp}' style='display: flex;align-items: center;'>
          <div id='value_${timestamp}' class="metadata_val" placeholder='${'在此填写value'}' ${isDisabled?'disabled':''}></div>
          <svg style='height: 18px;width: 18px;' class='opr' name='add' id='value_add_${timestamp}' data-index='0'><polygon points='7,0 10,0 10,7 17,7 17,10 10,10 10,17 7,17 7,10 0,10 0,7 7,7'></polygon></svg>
          <svg style='height: 18px;width: 18px;' class='opr' name='del' id='value_del_${timestamp}' data-index='0'><polygon points='0,0 2,0 8.5,7 15,0 17,0 17,2 11,8.5 17,15 17,17 15,17 8.5,11 2,17 0,17 0,15 7,8.5 0,2'></polygon></svg>
        </div>
      </div>`;
      var widget = $(dom)
      return widget
    },
    value({isDisabled=''}={}) {
      var timestamp = new Date().getTime();
      var dom = `<div style='display: flex;align-items: center;' id='val_${timestamp}'>
        <div id='value_${timestamp}_0' class="metadata_val" placeholder='${'在此填写value'}' ${isDisabled?'disabled':''}></div>
        <svg style='height: 18px;width: 18px;' class='opr' name='add' id='value_add_${timestamp}' data-index='${timestamp}'><polygon points='7,0 10,0 10,7 17,7 17,10 10,10 10,17 7,17 7,10 0,10 0,7 7,7'></polygon></svg>
        <svg style='height: 18px;width: 18px;' class='opr' name='del' id='value_del_${timestamp}' data-index='${timestamp}'><polygon points='0,0 2,0 8.5,7 15,0 17,0 17,2 11,8.5 17,15 17,17 15,17 8.5,11 2,17 0,17 0,15 7,8.5 0,2'></polygon></svg>
      </div>`
      return $(dom)
    },
    posts(resp) {
      var list = $(resp).find('a[href]').map((idx, item) => {
        var type = ''
        if ((item.innerHTML.lastIndexOf('/') == item.innerHTML.length - 1)) {
          type = 'folder'
        } else if (/.(([j|J][p|P][e|E]{0,}[g|G])|([G|g][i|I][f|F])|([p|P][n|N][g|G])|([b|B][m|M][p|P]))$/g.test(item.innerHTML)) {
          type = 'img'
        };
        return {
          name: item.innerHTML.replace(/\/$/, ''),
          type: type,
          href: item.href
        }
      })
      var dom = `<div style='display: flex;flex-wrap: wrap;'>`;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var content = ''
        switch (item.type) {
          case 'folder':
            content = `<div class='folder' style='width: 100%;height: 90px;background-image: url(./content/CMS/images/zTree/open_folder.png);background-repeat: no-repeat;background-position: center;' name='${item.href}'></div>`
            break;
          case 'img':
            content = `<img src='${item.href}' style='width: 100%;height: 90px;' />`
            break;
          default:

        }
        if (content) {
          dom += `<div style='width: 94px;height: 104px;margin: 4px;margin-bottom: 10px;' class='pic'>
            ${content}
            <div style='width: 100%;height: 14px;line-height: 14px;text-align: center;overflow: hidden;text-overflow: ellipsis;font-size: 12px;color: #797979;' title='${item.name}'>${item.name}</div>
          </div>`
        }
      }
      dom += `</div>`
      return dom;
    }
  }
  return dialog
}))
