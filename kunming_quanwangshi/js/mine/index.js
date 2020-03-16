(function(globle, factory) {
  typeof exports === 'objects' && typeof module !== 'undefined' ?
    exports.module = factory(utils) :
    typeof define === 'function' && define.amd ?
      define(['utils'], factory) :
      (globle.App = factory(utils))
})(this, (function(utils) {
  'use strict'
  var deepClone = utils.deepClone,
      addEvent = utils.addEvent,
      request = utils.request,
      getUrlParam = utils.getUrlParam,
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
    curTab: '订购',//订购,收藏
    curPage: 0,
    pageSize: 12,
    focus_type: null,//order-订购 column-收藏列表 btn-收藏翻页 menu-收藏删除
    focus_column: 0,
    focus_btn: 0,
    focus_menu: 0,
    canControl: true,
    init: function() {
      var self = this;
      self.bindEvents();
      self.initStorage();
      if (getUrlParam('name')) {
        self.curTab = decodeURI(getUrlParam('name'))
      }
      var focus = this.storage.getValue('focus')
      if (focus) {
        deepClone(this, JSON.parse(focus))
      }
      setupPaaS(function() {
        self.setTab(self.curTab, function() {
          document.getElementById('app').style.display = ''
          self.api.getFavors(function(resp) {
            self.model.data = self.model.favor(resp);
            self.refreshList();
          });
        })
      })

    },
    initStorage: function() {
      this.storage = MyStorage.getStorage();
      this.storage.setNamespace('xor.kgqws.mine')
      if (getUrlParam('backUrl')) {
        this.storage.setValue('backUrl', getUrlParam('backUrl'))
      }
    },
    bindEvents: function() {
      var self = this,
          canControl = self.canControl;
      addEvent({
        left: function() {
          if (canControl) {
            self.moveLeft();
          }
        },
        right: function() {
          if (canControl) {
            self.moveRight();
          }
        },
        up: function() {
          if (canControl) {
            self.moveUp();
          }
        },
        down: function() {
          if (canControl) {
            self.moveDown();
          }
        },
        enter: function() {
          if (canControl) {
            self.enterPressed();
          }
        },
        back: function() {
          if (canControl) {
            self.backPressed();
          }
        }
      })
    },
    moveLeft: function() {
      var tab = this.curTab;
      switch (tab) {
        case '收藏':
          //收藏页
          var type = this.focus_type
          switch (type) {
            case 'btn'://翻页
              if (this.focus_btn > 0) {
                this.focus_btn --
                this.changeBtnFocus();
              }
              break;
            case 'column'://列表
              if (this.focus_column > 0) {
                this.focus_column --
                this.changeColumnFocus();
              } else {
                this.curTab = '订购'
                this.rmvFocus();
                this.setTab(this.curTab);
              }
              break;
            case 'menu':
              if (this.focus_menu > 0) {
                this.focus_menu --;
                this.changeMenuFocus();
              }
            default:
          }
          break;
        default:

      }
    },
    moveRight: function() {
      var tab = this.curTab;
      switch (tab) {
        case '收藏':
          //收藏页
          var type = this.focus_type
          switch (type) {
            case 'btn'://翻页
              var len = document.querySelectorAll('.foots .controls img').length
              if (this.focus_btn < len - 1) {
                this.focus_btn ++
                this.changeBtnFocus();
              }
              break;
            case 'column'://列表
              var len = document.querySelectorAll('.favor_content > img.show').length
              if (this.focus_column < len - 1) {
                this.focus_column ++
                this.changeColumnFocus();
              }
              break;
            case 'menu'://删除弹窗
              if (this.focus_menu < 2) {
                this.focus_menu ++;
                this.changeMenuFocus();
              }
              break;
            default:
          }
          break;
        default:
          var self = this;
          self.curTab = '收藏'
          self.setTab(self.curTab, function() {
            self.changeColumnFocus();
          });
      }
    },
    moveUp: function() {
      var tab = this.curTab;
      switch (tab) {
        case '收藏':
          var type = this.focus_type;
          switch (type) {
            case 'btn':
              this.focus_type = 'column';
              this.focus_column = 0;
              this.changeColumnFocus();
              break;
            case 'column':
              var list = document.querySelectorAll('.favor_content > img.show'),
                  len = list.length,
                  next = this.focus_column - this.pageSize / 2;
              if (next > -1) {
                this.focus_column = next;
                this.changeColumnFocus();
              }
              break;
            case 'menu':
              break;
            default:

          }
          break;
        default:

      }
    },
    moveDown: function() {
      var tab = this.curTab;
      switch (tab) {
        case '收藏':
          var type = this.focus_type;
          switch (type) {
            case 'btn':
              //do nothing
              break;
            case 'column':
              var list = document.querySelectorAll('.favor_content img.show'),
                  len = list.length,
                  next = this.focus_column + this.pageSize / 2
              if (list[next]) {
                this.focus_column = next;
                this.changeColumnFocus();
              } else if (next >= this.pageSize) {
                this.focus_type = 'btn'
                this.focus_btn = 0;
                this.changeBtnFocus();
              } else if (len - 1 > this.pageSize / 2) {
                this.focus_column = len - 1;
                this.changeColumnFocus();
              } else {
                this.focus_type = 'btn';
                this.changeBtnFocus();
              }
              break;
            case 'menu':
              break;
            default:

          }
          break;
        default:

      }
    },
    enterPressed: function() {
      var focus = document.querySelector('.focus'),
          self = this,
          tab = self.curTab;
      switch (tab) {
        case '收藏':
          var totalPage = Math.ceil(self.model.data.length / self.pageSize),
              next = 0;
          var btn = document.querySelector('.focus').getAttribute('name')
          switch (btn) {
            case 'page_down':
              next = self.curPage + 1
              if (next < totalPage) {
                self.curPage = next;
                //渲染页面
                self.refreshList();
              }
              break;
            case 'page_up':
              next = self.curPage - 1
              if (next > -1) {
                self.curPage = next
                //渲染页面
                self.refreshList();
              }
              break;
            case 'menu':
              switch (self.focus_menu) {
                case 1://删除单个
                  var index = self.curPage * self.pageSize + self.focus_column
                  var data = self.model.data[index]
                  self.api.deleteFavorite(data, function() {
                    //重新刷新数据
                    self.model.data = self.model.data.slice(0, index).concat(self.model.data.slice(index + 1))
                    self.refreshList(function() {
                      document.querySelector('.alert[name=delete]').classList.remove('show')
                      self.focus_type = 'column';
                      self.changeColumnFocus();
                    })
                  })
                  break;
                case 0://播放
                  var index = self.curPage * self.pageSize + self.focus_column,
                      data = self.model.data[index],
                      vod = {
                        videoid: data.videoid,
                        name: data.name,
                        check: true
                      }
                  playVideo(vod)
                  break;
                case 2:
                  self.focus_type = 'column';
                  self.changeColumnFocus();
                  document.querySelector('.alert[name=delete]').classList.remove('show');
                  break;
                default:

              }
              break;
            case 'poster':
              // self.gotoDetail();
              this.focus_type = 'menu';
              document.querySelector('.alert[name=delete]').classList.add('show')
              this.changeMenuFocus();
              break;
            default:

          }
          break;
        default://订购
          switch (self.focus_type) {
            case 'alert':
              self.focus_type = 'order';
              document.querySelector('.alert[name=order]').classList.remove('show');
              break;
            default:
          self.focus_type = 'alert';
          document.querySelector('.alert[name=order]').classList.add('show');
      }

      }
    },
    menuPressed: function() {
      if (this.curTab == '收藏' && this.focus_type == 'column') {
        this.focus_type = 'menu';
        document.querySelector('.alert[name=delete]').classList.add('show')
        this.changeMenuFocus();
      }
    },
    backPressed: function() {
      var type = this.focus_type;
      switch (type) {
        case 'alert':
          document.querySelector('.alert[name=order]').classList.remove('show')
          this.focus_type = 'order'
          break;
        case 'menu':
          document.querySelector('.alert[name=delete]').classList.remove('show');
          this.focus_type = 'column';
          this.changeColumnFocus();
          break;
        default://退出应用
          var backUrl = this.storage.getValue('backUrl');
          this.storage.setValue('focus', '');
          this.storage.setValue('backUrl', '');
          location.href = backUrl;
      }
    },
    rmvFocus: function() {
      document.getElementById('favor_focus').style.display = ''
      document.getElementById('btn_focus').style.display = ''
      var focus = document.querySelector('.focus')
      if (focus) {
        focus.classList.remove('focus')
        if (focus.getAttribute('name') == 'poster') {
          focus.style.left = ''
          focus.style.top = ''
          focus.style.width = ''
          focus.style.height = ''
        }
      }
    },
    changeColumnFocus: function() {
      this.rmvFocus();
      var list = document.querySelectorAll('.favor_content img.show'),
          focus = list[this.focus_column],
          focusMask = document.getElementById('favor_focus');
      if (focus) {
        focus.classList.add('focus');
        // focusMask.style.left = (focus.getBoundingClientRect().left - 12) + 'px'
        // focusMask.style.top = (focus.getBoundingClientRect().top - 15) + 'px'
        focusMask.style.left = (focus.getBoundingClientRect().left - 4) + 'px'
        focusMask.style.top = (focus.getBoundingClientRect().top - 5) + 'px'
        focusMask.style.display = 'block'

        // focus.style.width = (focusMask.getBoundingClientRect().width - 2) + 'px'
        // focus.style.height = (focusMask.getBoundingClientRect().height - 2) + 'px'
        // focus.style.left = (focus.getBoundingClientRect().left - focus.parentNode.getBoundingClientRect().left - 11) + 'px'
        // focus.style.top = (focus.getBoundingClientRect().top - focus.parentNode.getBoundingClientRect().top - 14) + 'px'
      }
    },
    changeBtnFocus: function() {
      this.rmvFocus();
      //img 40 * 20 focus_img 48*48
      var btns = document.querySelectorAll('.foots .controls img'),
          focus = btns[this.focus_btn],
          focusMask = document.getElementById('btn_focus')
      focus.classList.add('focus')
      focusMask.style.left = (focus.getBoundingClientRect().left - (48 - 40) / 2) + 'px'
      focusMask.style.top = (focus.getBoundingClientRect().top - (48 - 20) / 2) + 'px'
      focusMask.style.display = 'block'
    },
    changeMenuFocus: function() {
      this.rmvFocus();
      var menus = document.querySelectorAll('.alert[name=delete] > div');
      menus[this.focus_menu].classList.add('focus');
    },
    setTab: function(name, callback) {
      var tabIndex = 0
      switch (name) {
        case '收藏':
          tabIndex = 1
          this.focus_type = 'column';
          break;
        default:
          this.focus_type = 'order';

      }
      //设置tab状态
      var tabs = document.querySelectorAll('.tabs > div');
      for (var i = 0, len = tabs.length; i < len; i++) {
        var tab = tabs[i];
        tab.classList.remove('active')
      }
      tabs[tabIndex].classList.add('active');

      //设置内容状态
      var contents = document.querySelectorAll('.contents > div')
      for (var i = 0, len = contents.length; i < len; i++) {
        var pane = contents[i];
        pane.classList.remove('show')
      }
      contents[tabIndex].classList.add('show')

      //设置foot状态
      var foots = document.querySelectorAll('.foots > div')
      for (var i = 0, len = foots.length; i < len; i++) {
        var foot = foots[i];
        foot.classList.remove('show')
      }
      foots[tabIndex].classList.add('show')

      //回调
      callback && callback();
    },
    loadPage: function(data) {
      var list = document.querySelectorAll('.favor_content > img')
      for (var i = 0, len = list.length; i < len; i++) {
        var img = list[i];
        var item = data[i]
        if (item) {
          img.classList.add('show')
          img.src = item.poster;
        } else {
          img.classList.remove('show')
        }
      }
      if (this.curTab == '收藏' && this.focus_type !== 'btn') {
        this.changeColumnFocus();
      }
      //加载分页
      document.getElementById('cur_page').innerHTML = (this.curPage + 1)
      document.getElementById('total_page').innerHTML = Math.ceil(this.model.data.length / this.pageSize)
    },
    refreshList: function(callback) {
      var self = this,
          start = self.pageSize * self.curPage,
          end = self.pageSize * (self.curPage + 1),
          data = self.model.data.slice(start, end)
      if (data.length == 0 && self.curPage > 0) {
        self.curPage --;
        start = self.pageSize * self.curPage;
        end = self.pageSize * (self.curPage + 1);
        data = self.model.data.slice(start, end);
      }
      if (!(self.focus_column + self.curPage * self.pageSize < self.model.data.length)) {
        self.focus_column = self.model.data.length - self.curPage * self.pageSize - 1
      }
      if (data.length > 0) {
        self.api.getPosters(data, function(data) {
          self.loadPage(data)
          callback && callback();
        })
      } else {
        self.loadPage([])
        callback && callback();
      }
    },
    gotoDetail: function() {
      var self = this;
      //焦点记忆
      var focus = {
        curTab: self.curTab,
        curPage: self.curPage,
        focus_column: self.focus_column
      }
      self.storage.setValue('focus', JSON.stringify(focus))
      //跳转页面
      var asset = self.model.data[self.curPage * self.pageSize + self.focus_column],
          dstUrl = './detail.html',
          urlParam = []
      urlParam.push('provider_id=' + asset.provider_id)
      urlParam.push('provider_asset_id=' + asset.provider_asset_id)
      urlParam.push('backUrl=' + './mine.html')
      dstUrl += '?' + urlParam.join('&')
      location.href = dstUrl;
    }
  }
  var API = {
    getFavors: function(callback) {
      var user_id = my.paas.user_id,
          access_token = my.paas.access_token,
          url = paasHost + '/aquapaas/rest/favorite/zgdvod/' + user_id,
          urlParam = [];
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('user_id=' + user_id)
      urlParam.push('access_token=' + access_token)
      url += '?' + urlParam.join('&')
      request.get(url, function(resp) {
        callback && callback(resp);
      })
    },
    getPosters: function(data, callback) {
      var self = this;
      var url = paasHost + '/aquapaas/rest/search/content_by_id/vod',
          urlParam = [],
          ids = [];
      for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i],
            pid = item.provider_id,
            paid = item.provider_asset_id
        ids.push([pid, paid].join('_'))
      }
      urlParam.push('ids=' + ids.join(','))
      urlParam.push('app_key=' + paasAppKey)//应用授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用授权
      url += '?' + urlParam.join('&')
      request.get(url, function(resp) {
        for (var i = 0, len = data.length; i < len; i++) {
          var item = data[i];
          for (var j = 0, len2 = resp.length; j < len2; j++) {
            var jtem = resp[j]
            if (item.provider_id == jtem.provider_id && item.provider_asset_id == jtem.provider_asset_id) {
              var posterstring = jtem.packageposterboard || jtem.posterboard
              item.poster = posterstring.split(',')[1];
            }
          }
        }
        callback && callback(data)
      })
    },
    deleteFavorite: function(data, callback) {
      console.log(data);
      var self = this,
          type = 'zgdvod',
          user_id = my.paas.user_id,
          access_token = my.paas.access_token,
          url = paasHost + '/aquapaas/rest/favorite/delete/' + type + '/' + user_id + '/' + data.favorite_item_id,
          urlParam = []
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('user_id=' + user_id)
      urlParam.push('access_token=' + access_token)
      url += '?' + urlParam.join('&')
      request.post(url, {}, function() {
        callback && callback()
      })
    },
    deleteAllFavorite: function(ds, callback) {
      console.log(ds);
      var self = this;
      if (ds.length > 0) {
        var data = ds.pop();
        self.deleteFavorite(data, function() {
          self.deleteAllFavorite(ds, callback)
        })
      } else {
        callback && callback();
      }
    }
  }
  var Model = {
    favor: function(data) {
      var ds = [];
      for (var i = 0, len = data.length; i < len; i++) {
        var item = data[i];
        // for (var j = 0, repeat = 20; j < repeat; j++) {
          ds.push({
            provider_id: item.metadata.provider_id,
            provider_asset_id: item.metadata.provider_asset_id,
            favorite_item_id: item.favorite_item_id
          })
        // }
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
