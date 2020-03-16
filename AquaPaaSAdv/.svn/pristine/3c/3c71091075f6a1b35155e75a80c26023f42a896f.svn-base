(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?
    exports.module = factory(jQuery) :
    typeof define === 'function' && define.amd ?
    define(['jquery'], factory) : (global.InputCombo = factory(jQuery))
})(this, (function($) {
  var dialog = function(opts) {
    var pane = $.extend(true, {}, Pane, {showCombo: opts.showCombo||false, enable: opts.enable||true});
    var model = $.extend(true, {}, Model)
    pane.model = model;
    pane.icon = opts.icon || 'url(./images/navigation/arrow.png)'
    pane.scroll = opts.scrollHeight || null
    pane.callback = opts.callback || null
    // var width, height, needCombo = opts.enable || false
    var combo = pane.init(opts)
    this.update = (opts) => {
      pane.update(combo, opts)
    }
    this.getValue = () => {
      return pane.select.value
    }
    this.setValue = (value) => {
      pane.setComboValue(combo, value)
    }
    this.getLabel = (value) => {
      return pane.select.label
    }
    this.setLabel = (value) => {
      pane.setComboLabel(combo, value)
    }
    this.disable = () => {
      pane.disableWidget(combo);
    }
    this.enable = () => {
      pane.enableWidget(combo)
    }
  }
  var Pane = {
    select: {
      label: '',
      value: ''
    },
    enable: true,
    init({el, width, height, content, color}) {
      var dom = `<div class='combo'>
        <input>
        <div class='combo_list' style='display: none;'>
          <!-- this is a combo list -->
          <!-- <a data-value=''>label</a> -->
        </div>
      </div>`;
      var widget = $(dom)
      widget.css({
        width: width || '100%',
        height: height || '100%',
        color: color || '#797979',
        position: 'relative'
      })
      widget.find('input').css({
        height: '100%',
        width: '100%',
        border: 'none',
        background: 'transparent',
        paddingLeft: '10px',
        paddingRight: '30px',
        outline: 'none',
        marginRight: '0'
      })
      widget.find('.combo_list').css({
        position: 'absolute',
        top: height || $(el).height(),
        left: '-1px',
        width: '100%',
        border: '1px solid #e2e2e2',
        backgroundColor: '#fff',
        zIndex: 1
      })
      if (this.scroll) {
        widget.find('.combo_list').css({
          overflowY: 'auto',
          maxHeight: parseInt(this.scroll) + 'px'
        })
      }
      // if (this.callback) {
      //   widget.on('keypress', 'input', ({currentTarget, target, keyCode, which}) => {
      //     if (currentTarget == target) {
      //       var key = keyCode || which;
      //       if (key == 13) {
      //         this.callback(this.select.value)
      //       }
      //     }
      //   })
      //   .on('click', '.combo_list > a', ({currentTarget, target}) => {
      //     if (currentTarget == target) {
      //       this.callback(this.select.value);
      //     }
      //   })
      // }
      $(el).empty().append(widget)
      var bg_position = 0.95 * $(el).width() - 20 + 'px ' + ((height && typeof height == 'string' && (height.indexOf('%') !== -1 ? parseInt(height) / 100 * $(el).height() : height) || $(el).height() / 2 ) - 6) + 'px'
      widget.find('input').css({
        backgroundRepeat: 'no-repeat',
        backgroundPosition: bg_position
      })
      if (this.showCombo) {
        widget.find('input').css({
          // backgroundImage: 'url(../../uiWidget/images/arrow.png)'
          backgroundImage: this.icon
        })
        this.updateCombo(widget, content);
      }
      widget.on('click', 'input', (e) => {
        var currentTarget = e.currentTarget;
        if (currentTarget == e.target) {
          if (this.showCombo && this.enable) {
            var combo = widget.find('.combo_list')
            var isShow = combo.css('display') == 'none' ? false: true
            combo.css('display', isShow ? 'none' : '')
            if (!isShow) {
              $(document).one('click', function(e) {
                if (e.target !== currentTarget) {
                  combo.css('display', 'none')
                }
              })
            }
          } else {
            console.log('do not show combo');
          }
        }
        e.stopPropagation();
      })
      .on('keydown', 'input', ({which, keyCode, currentTarget}) => {
        var key = which || keyCode
        if (key == 13) {
          var combo = widget.find('.combo_list')
          var val = $(currentTarget).val();
          combo.css('display', 'none');
          this.select = {label: val, value: val}
          this.callback && this.callback(this.select.value);
        }
      })
      .on('click', '.combo_list a', ({currentTarget, target}) => {
        if (currentTarget == target) {
          var combo = widget.find('.combo_list')
          var index = $(currentTarget).index()
          combo.css('display', 'none');
          var select = $(currentTarget)
          widget.find('input').val(select.html())//.data(select.data('value'))
          this.select = this.model.data[index]
          this.callback && this.callback(this.select.value);
        }
      })
      return widget
    },
    update(widget, {content, enable, scrollHeight}) {
      this.showCombo = enable
      if (this.showCombo) {
        widget.find('input').css({
          // backgroundImage: 'url(../../uiWidget/images/arrow.png)'
          backgroundImage: this.icon
        })
        if (typeof scrollHeight !== 'undefined') {
          widget.find('.combo_list').css({
            overflowY: 'auto',
            maxHeight: scrollHeight
          })
        }
        this.updateCombo(widget, content)
      } else {
        widget.find('input').css({
          backgroundImage: ''
        })
      }
    },
    updateCombo(widget, content) {
      if (Object.prototype.toString.call(content) == '[object Array]') {
        var ctn = widget.find('.combo_list');
        ctn.empty();
        this.model.data = [];
        for (var i = 0; i < content.length; i++) {
          var item = content[i]
          var label = item.label;
          var value = item.value;
          var li = $('<a>')
          li.html(label).data('value', value).css({
            lineHeight: ctn.parent().height() + 'px',
            paddingLeft: '10px',
            color: 'inherit',
            width: 'calc(100% - 10px)',
            display: 'block',
            cursor: 'pointer'
          })
          ctn.append(li);
          this.model.data.push({
            label: label,
            value: value
          })
        }
      }
    },
    setComboValue(widget, value) {
      var select = this.model.data.filter((item) => {
        return item.value == value
      })
      this.select = select.length > 0 ? select[0] : {label: value, value: value}
      widget.find('input').val(this.select.label)
    },
    setComboLabel(widget, label) {
      var select = this.model.data.filter((item) => {
        return item.label == label
      })
      this.select = select.length > 0 ? select[0] : {label: label, value: label}
      widget.find('input').val(this.select.label)
    },
    enableWidget(widget) {
      this.enable = true;
      widget.find('input').removeAttr('disabled').css({
        'backgroundImage': this.icon,
        'backgroundColor': 'transparent'
      })
    },
    disableWidget(widget){
      this.enable = false;
      widget.find('input').attr('disabled', '').css({
        'backgroundImage': '',
        'backgroundColor': ''
      })

    }
  }
  var API = {
  }
  var Model = {
    data: []
  }
  return dialog
}))
