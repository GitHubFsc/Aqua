(function(globle, factory) {
  typeof exports === 'objects' && typeof module !== 'undefined' ?
    exports.module = factory(utils) :
    typeof define === 'function' && define.amd ?
      define(['utils'], factory) :
      (globle.app = factory(utils))
})(this, (function(utils) {
  'use strict'
  var deepClone = utils.deepClone,
      addEvent = utils.addEvent,
      request = utils.request,
      getJson = utils.getJson,
      debug = utils.debug,
      playVideo = utils.playVideo,
      bundle = false,
      getHash = utils.getHash,
      setHash = utils.setHash,
      report = utils.report,
      provider_id, provider_asset_id;
  var dialog = function(opts) {
    var pane = deepClone({}, Pane);
    var api = deepClone({}, API);
    var model = deepClone({}, Model);
    pane.api = api;
    pane.model = model;
    pane.init();
  }
  var Pane = {
    focusType: 'menu',
    focus_menu: 0,
    focus_column: 0,
    focus_btn: 0,
    focus_page: 0,
    pageSize: 12,
    pageRows: 2,
    curPage: 0,
    focus: {
      offsetX: 12,
      offsetY: 16
    },
    init: function() {
      var self = this;
      setupPaaS(function() {
        console.log('paas loaded');
      })
      self.initStorage();
      self.bindEvents();
      var focus = self.storage.getValue('focus')
      if (focus) {
        deepClone(self, JSON.parse(focus))
      }
      self.api.getHeader(getURLParameter('name'), function(resp) {
        self.model.headerData = self.model.header(resp)
        self.loadHeader(function() {
          self.setTab(function() {
        self.setFocus();
      })
        })
      })
    },
    initStorage: function() {
      this.storage = MyStorage.getStorage();
      this.storage.setNamespace('xor.kgqws.column')
    },
    loadHeader: function(callback) {
      var ctn = document.querySelector('.column_header'),
          data = this.model.headerData;
      ctn.innerHTML = '';
      var fragment = document.createDocumentFragment()
      for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i]
        var el = document.createElement('div')
        el.innerHTML = item.name
        fragment.appendChild(el)
      }
      ctn.appendChild(fragment)
      callback && callback();
    },
    setFocus: function(index) {
      var self = this,
          type = this.focusType,
          preFocus = document.querySelector('.focus'),
          focus;
      self.rmvFocus();
      switch (type) {
        case 'menu':
          self.changeMenuFocus();
          break;
        case 'column':
          self.changeColumnFocus();
          break;
        case 'btn':
          self.changeBtnFocus();
          break;
        case 'page':
          self.changePageFocus();
          break;
        default:

      }
    },
    rmvFocus: function() {
      var preFocus = document.querySelector('.focus');
      if (preFocus) {
        preFocus.style.left = ''
        preFocus.style.top = ''
        preFocus.style.width = ''
        preFocus.style.height = ''
        preFocus.classList.remove('focus')
      }
      clearMarquee();
    },
    bindEvents: function() {
      var self = this;
      addEvent({
        up: function() {
          self.up();
          return false;
        },
        down: function() {
          self.down();
          return false;
        },
        left: function() {
          self.left();
          return false;
        },
        right: function() {
          self.right();
          return false;
        },
        back: function() {
          if (self.focusType == 'column') {
            self.focusType = 'menu'
            self.changeMenuFocus();
          } else {
            self.storage.setValue('focus', '')
            location.href = getURLParameter('backUrl')||'./index.html'
          }
          return false;
        },
        enter: function() {
          self.enterPressed();
          return false;
        }
      })
    },
    up: function() {
      var self = this;
      switch (self.focusType) {
        case 'menu':
            self.model.data.length = 0;
            self.focus_column = 0
          if (self.focus_menu > 0) {
            self.focus_menu--;
          }
          self.changeMenuFocus();
          break;
        case 'column':
            if (self.focus_column / 6 < 1) {
              self.focusType = 'btn'
            self.changeBtnFocus();
            } else {
            self.focus_column -= (self.pageSize / self.pageRows)
            self.changeColumnFocus();
            }
          break;
        case 'page':
          self.focusType = 'column';
          self.focus_column = 0;
          self.changeColumnFocus();
          break;
        default:

          }
        },
        down: function() {
      var self = this;
      switch (self.focusType) {
        case 'menu':
          var len = self.model.headerData.length;
          var next = self.focus_menu + 1;
          if (next < len) {
            self.focus_menu = next
          }
          self.changeMenuFocus();
          break;
        case 'column':
          var next = self.focus_column + (self.pageSize / self.pageRows)
          if (next < self.pageSize) {
            var count = next % (self.pageSize / self.pageRows)
            while (self.pageSize * self.curPage + next >= self.model.data.length && count >= 0) {
              count--;
              if (count >= 0) {
                next--;
              }
            }
            if (count >= 0) {
              self.focus_column = next
              self.changeColumnFocus();
            } else {
              self.focusType = 'page'
              if (next == (self.pageSize - 1)) {
                self.focus_page = 1
            } else {
                self.focus_page = 0
            }
              self.changePageFocus();
          }
            } else {
            self.focusType = 'page'
            if (self.focus_column == (self.pageSize - 1)) {
              self.focus_page = 1
            } else {
              self.focus_page = 0
            }
            self.changePageFocus();
            }
          break;
        case 'btn':
          self.focusType = 'column';
          self.changeColumnFocus();
          break;
        default:

          }
        },
        right: function() {
      var self = this;
      switch (self.focusType) {
        case 'menu':
            if (self.model.data.length > 0) {
            self.focusType = 'column';
            self.focus_column = 0;
            self.changeColumnFocus();
          }
          break;
        case 'column':
          var next = self.focus_column + 1;
          if (next % (self.pageSize / self.pageRows) !== 0 && (self.curPage * self.pageSize + next < self.model.data.length)) {
            self.focus_column = next
            self.changeColumnFocus();
          } else if (next == (self.pageSize - 1) || ((self.curPage * self.pageSize + next) == self.model.data.length)) {
            self.focusType = 'page'
            self.changePageFocus()
            }
          break;
        case 'btn':
          var len = 2;
          var next = self.focus_btn + 1
          if (next < len) {
            self.focus_btn = next
            self.changeBtnFocus();
            }
          break;
        case 'page':
          var len = 2;
          var next = self.focus_page + 1
          if (next < len) {
            self.focus_page = next
            self.changePageFocus();
          }
          break;
        default:

          }
        },
    left: function() {
      var self = this;
      switch (self.focusType) {
        case 'btn':
          var next = self.focus_btn - 1;
          if (next >= 0) {
            self.focus_btn = next
            self.changeBtnFocus();
          }
          break;
        case 'column':
          if (self.focus_column % (self.pageSize / self.pageRows) == 0) {
            self.focusType = 'menu';
            self.changeMenuFocus();
          } else {
            self.focus_column -= 1;
            self.changeColumnFocus();
          }
          break;
        case 'page':
          var next = self.focus_page - 1;
          if (next >= 0) {
            self.focus_page = next
            self.changePageFocus();
          }
          break;
        default:

          }
        },
    changeMenuFocus: function() {
      var self = this,
          list = document.querySelectorAll('.column_header div'),
          focus = list[self.focus_menu];
      self.rmvFocus();
      focus.classList.add('focus')
      //是否使用marquee
      var text = focus.innerHTML
      var useMarquee = getByteLen(text) > 8 ? true : false;
      if (useMarquee) {
        focus.innerHTML = ''
        focus.appendChild(wrapToMarquee(text));
      }
      // End
      self.setTab(function() {});
      self.showFocusBg(focus.getBoundingClientRect().left, focus.getBoundingClientRect().top)
    },
    adjustMenu: function() {
      var self = this,
          list = document.querySelectorAll('.column_header div'),
          focus = list[self.focus_menu]
      //判断是否在范围内
      var rect = [focus.parentElement.getBoundingClientRect().top, focus.parentElement.getBoundingClientRect().bottom]
      var top = focus.getBoundingClientRect().top;
      var bottom = focus.getBoundingClientRect().bottom
      if (top < rect[0]) {
        focus.parentElement.scrollTop = focus.parentElement.scrollTop - (rect[0] - top)
      } else if (bottom > rect[1]) {
        focus.parentElement.scrollTop = focus.parentElement.scrollTop + (bottom - rect[1])
        }
      //判断结束
    },
    changeColumnFocus: function() {
      var self = this,
          list = document.querySelectorAll('img.poster:not(.invisible)')
          focus = list[this.focus_column]
      self.rmvFocus();
      focus.style.left = (focus.getBoundingClientRect().left - self.focus.offsetX) + 'px'
      focus.style.top = (focus.getBoundingClientRect().top - self.focus.offsetY) + 'px'
      focus.style.height = (focus.getBoundingClientRect().height + self.focus.offsetY * 2 - 4) + 'px'
      focus.style.width = (focus.getBoundingClientRect().width + self.focus.offsetX * 2 - 2) + 'px'
      self.showFocusBg(focus.getBoundingClientRect().left, focus.getBoundingClientRect().top)
      focus.classList.add('focus')
    },
    changeBtnFocus: function() {
      var self = this,
          list = document.querySelectorAll('.jump')
      self.rmvFocus();
      var focus = list[this.focus_btn]
      focus.classList.add('focus')
      self.showFocusBg(focus.getBoundingClientRect().left, focus.getBoundingClientRect().top)
    },
    changePageFocus: function() {
      var self = this,
          list = document.querySelectorAll('.page'),
          focus = list[this.focus_page]
      self.rmvFocus();
      focus.classList.add('focus')
      self.showFocusBg(focus.getBoundingClientRect().left, focus.getBoundingClientRect().top)
    },
    showFocusBg: function(left, top) {
      var type = this.focusType,
          mask;
      document.querySelector('.column_header_focus').style.display = ''
      document.querySelector('.column_content_focus').style.display = ''
      document.querySelector('.page_focus').style.display = ''
      switch (type) {
        case 'menu':
          mask = document.querySelector('.column_header_focus')
          break;
        case 'column':
          mask = document.querySelector('.column_content_focus')
          break;
        case 'page':
          mask = document.querySelector('.page_focus')
        default:

      }
      if (mask) {
        mask.style.left = left + 'px';
        mask.style.top = top + 'px';
        mask.style.display = 'block';
      }
    },
    loadPage: function(data) {
      var self = this;
      var posters = []
      for (var i = 0, len = this.pageSize; i < len; i++) {
        var item = data[i]
        var el = document.querySelector('#vod_' + (i + 1))
        if (item) {
          el.classList.remove('invisible')
          el.style.backgroundColor = item.poster
          posters.push({target: el, pid: item.pid, paid: item.paid})
        } else {
          el.classList.add('invisible')
        }
      }
      document.querySelector('#cur_page').innerHTML = this.curPage + 1
      document.querySelector('#tot_page').innerHTML = Math.ceil(this.model.data.length / this.pageSize)
      this.api.getPosters(posters, function(resp) {
        self.loadPosters(posters, resp)
      })
    },
    enterPressed: function() {
      var focus = document.querySelector('.focus')
      var type = focus.getAttribute('name')
      switch (type) {
        case 'vod':
          var item = this.model.data[this.curPage * this.pageSize + this.focus_column]
          var pid = item.pid;
          var paid = item.paid;
          var focus = {
            focusType: this.focusType,
            focus_menu: this.focus_menu,
            focus_column: this.focus_column,
            curPage: this.curPage
          }
          this.storage.setValue('focus', JSON.stringify(focus))
          location.href = './detail.html?' + ['provider_id=' + pid, 'provider_asset_id=' + paid, 'backUrl=' + location.href].join('&')
          break;
        case 'search':
          var focus = {
            focusType: this.focusType,
            focus_menu: this.focus_menu,
            focus_column: this.focus_column,
            focus_btn: this.focus_btn,
            curPage: this.curPage
          }
          this.storage.setValue('focus', JSON.stringify(focus))
          location.href = './search.html?' + ['backUrl=' + location.href].join('&')
          break;
        case 'mine':
          var focus = {
            focusType: this.focusType,
            focus_menu: this.focus_menu,
            focus_column: this.focus_column,
            focus_btn: this.focus_btn,
            curPage: this.curPage
          }
          this.storage.setValue('focus', JSON.stringify(focus))
          location.href = './mine.html?' + ['backUrl=' + location.href].join('&')
          break;
        case 'page_up':
          var start, end;
          if (this.curPage > 0) {
            this.curPage --;
            start = this.curPage * this.pageSize
            end = (this.curPage + 1) * this.pageSize
            this.loadPage(this.model.data.slice(start, end))
          }
          break;
        case 'page_down':
          if (this.curPage < Math.ceil(this.model.data.length / this.pageSize)) {
            this.curPage ++;
            start = this.curPage * this.pageSize
            end = (this.curPage + 1) * this.pageSize
            var data = this.model.data.slice(start, end)
            if (data.length > 0) {
              this.loadPage(data)
            }
          }
          break;
        default:
      }
    },
    loadPosters: function(src, data) {
      for (var i = 0; i < src.length; i++) {
        var item = src[i]
        for (var j = 0; j < data.length; j++) {
          var jtem = data[j]
          if (item.pid == jtem.provider_id && item.paid == jtem.provider_asset_id) {
            var posters = jtem.packageposterboard || jtem.posterboard
            var poster = posters.split(',').pop();
            item.target.src = poster
          }
        }
      }
    },
    setTab: function(callback) {
      var self = this,
          name = self.model.headerData[self.focus_menu].name,
          pre = document.querySelector('.column_header div.selected'),
          focus = document.querySelectorAll('.column_header div')[self.focus_menu]
      if (pre) {
        pre.classList.remove('selected')
      }
      focus.classList.add('selected')
      self.adjustMenu();
      self.api.getList([getURLParameter('name'), name].join('/'), function(resp) {
        self.model.data = self.model.list(resp)
        self.loadPage(self.model.data.slice(self.curPage * self.pageSize, (self.curPage + 1) * self.pageSize))
        callback && callback();
      })
    }
  };
  var API = {
    getHeader: function(name, callback) {
      var url = paasHost + '/aquapaas/rest/navigation/trees/' + [secondTreeName, name].join('/'),
          urlParam = [];
      urlParam.push('children=1')
      urlParam.push('app_key=' + paasAppKey)//应用授权
      urlParam.push('timestamp=' + getTimeStamp())//应用授权
      url += '?' + urlParam.join('&')
      request.get(url, function(resp) {
        callback && callback(resp.children)
      })
    },
    getList: function(name, callback) {
      var url = paasHost + '/aquapaas/rest/navigation/trees/' + [secondTreeName, name].join('/'),
          urlParam = []
      urlParam.push('children=1')
      urlParam.push('app_key=' + paasAppKey)//应用授权
      urlParam.push('timestamp=' + getTimeStamp())//应用授权
      url += '?' + urlParam.join('&')
      request.get(url, function(resp) {
        callback && callback(resp.children)
      })
    },
    getPosters: function(posters, callback) {
      var url = paasHost + '/aquapaas/rest/search/content_by_id/vod',
          ids = [],
          urlParam = []
      for (var i = 0; i < posters.length; i++) {
        var item = posters[i];
        ids.push([item.pid, item.paid].join('_'))
      }
      urlParam.push('ids=' + ids.join(','))
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + getTimeStamp())
      url += '?' + urlParam.join('&')
      request.get(url, function(resp) {
        callback && callback(resp)
      })
    }
  }
  var Model = {
    data: [],
    headerData: [],
    header: function(data) {
      var ds = []
      for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i]
        ds.push({
          name: item.name
        })
      }
      return ds
    },
    list: function(data) {
      var ds = []
      for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i]
        ds.push({
          poster: item.poster,
          pid: item.metadata_public.ProviderId,
          paid: item.metadata_public.ProviderAssetId
        })
      }
      return ds;
    }
  }
  return {
    init: function(opts) {
      debug(printLog)
      console.log(location.href);
      var app = new dialog(opts);
    }
  };
}))
