/**
 * remains todo
 * 1. 播放
 * 2. 试播
 * 3. 选集播放
 * 4. 购买跳转
 */
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
      getUrlParam = utils.getUrlParam,
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
    focusType: 'btn',//main btn，recommend,choose
    bought: false,
    index_btn: 0,
    index_recommend: 0,
    index_asset: 0,
    index_serial: 0,
    serialSize: 20,
    serialRow: 2,
    init: function() {
      var self = this;
      if (getUrlParam('asset_id')) {
        provider_id = getUrlParam('asset_id').split('_')[0]
        provider_asset_id = getUrlParam('asset_id').split('_')[1]
      } else {
        provider_id = getUrlParam('provider_id');
        provider_asset_id = getUrlParam('provider_asset_id');
      }
      setupPaaS(function() {
        console.log('paas loaded');
        self.initStorage();
        self.bindEvents();
        self.loadData();
      })
    },
    initStorage: function() {
      this.storage = MyStorage.getStorage();
      this.storage.setNamespace('xor.kgqws.detail')
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
          if (self.focusType == 'asset' || self.focusType == 'serial') {
            document.querySelector('#asset_list').classList.remove('show');
            self.focusType = 'btn'
            self.setFocus();
          } else if (self.focusType == 'buy' || self.focusType == 'online' || self.focusType == 'offline') {
            self.changeAlertFocus(self.focusType, false);
            self.focusType = 'btn'
            self.setFocus();
          } else {
            // exit
            self.storage.setValue('focus', '');
            var backUrl = decodeURIComponent(getUrlParam('backUrl'))
            location.href = backUrl;
          }
          return false;
        },
        enter: function() {
          self.chooseBtn();
          return false;
        }
      })
    },
    loadData: function() {
      var self = this;
      var focus = self.storage.getValue('focus');
      if (focus) {
        deepClone(self, JSON.parse(focus));
      }
      var backUrl = getUrlParam('backUrl')
      if (backUrl) {
        self.storage.setValue('backUrl', backUrl)
      }
      self.api.getList(function(resp) {
        self.model.data = resp
        //更新
        var type = bundle ? 'bundle': 'asset'
        self.api.haveBought(type, function(bought) {
          self.bought = self.isFree(bought)
          self.loadPage(self.model.list(self.model.data))
        if (bundle) {
          self.api.getAssetList(self.model.data, function(resp2) {
            self.model.assets = resp2
            self.loadSerial()
            self.loadAsset();
              self.setFocus();
          })
        }
        })
        //显示用户推荐
        var recommend_name = resp.category.length > 0 ? [resp.category[0],resp.genre[0]].join('_') : '电影'
        self.api.getRecommendList(recommend_name, function(resp) {
          //show command list
          self.loadRecommendList(self.model.Recommend(resp));
        })
      });
      //是否用户收藏
      self.api.getFavorite(function(isFavorite, favorite_item_id) {
        //switch favorite flag
        self.model.isFavorite = isFavorite
        if (isFavorite) {
          document.querySelector('.btns [name=favorite]').classList.add('favorite')
        } else {
          document.querySelector('.btns [name=favorite]').classList.remove('favorite')
        }
        if (favorite_item_id) {
          self.model.favorite_item_id = favorite_item_id;
        }
      })
    },
    loadSerial: function() {
      var serialSize = this.serialSize
      document.getElementById('asset_range').innerHTML = '';
      var set = this.model.assets;
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < set.length; i++) {
        var item = set[i];
        var serialIndex = Math.floor(i / serialSize)
        if (i % serialSize == 0) {
          var dom = document.createElement('div')
          dom.id = 'serial' + serialIndex
          dom.className = 'serial'
          dom.innerHTML = (serialIndex * serialSize + 1) + '-' + (serialIndex + 1) * serialSize
          dom.setAttribute('name', 'serial');
          fragment.appendChild(dom)
        }
      }
      if (Math.ceil(set.length / serialSize) > 1) {
      document.getElementById('asset_range').appendChild(fragment)
      }
      this.loadAsset();
    },
    loadAsset: function(idx) {
      var serialSize = this.serialSize
      var assets = this.model.assets.slice(idx * serialSize, (idx + 1) * serialSize)
      for (var i = 0, len = serialSize; i < len; i++) {
        var item = assets[i]
        if (item) {
          var dom = document.createElement('div')
          dom.innerHTML = idx * serialSize + (i + 1)
          dom.id = 'asset' + i;
          dom.className = 'asset';
          dom.setAttribute('name', 'asset')
          document.querySelectorAll('#asset_ids td')[i].innerHTML = ''
          document.querySelectorAll('#asset_ids td')[i].appendChild(dom)
        } else {
          var span = document.createElement('span')
          span.className = 'asset'
          span.style.display = 'block';
          document.querySelectorAll('#asset_ids td')[i].innerHTML = ''
          document.querySelectorAll('#asset_ids td')[i].appendChild(span)
        }
      }
    },
    loadPage: function(data) {
      document.getElementById('poster').src = data.poster;
      document.getElementById('title').innerHTML = data.title
      document.getElementById('name').innerHTML = data.name
      if (data.type) {
        document.getElementById('type').innerHTML = data.type
      } else {
        document.getElementById('type').style.display = 'none';
      }
      document.getElementById('director').innerHTML = data.director
      document.getElementById('actors').innerHTML = data.actors
      document.getElementById('summary').innerHTML = data.summary
      if (bundle) {
        document.querySelector('.btns [name=choose]').classList.add('visible');
      } else {
        document.querySelector('.btns [name=choose]').classList.remove('visible')
      }
      if (!this.bought) {
        document.querySelector('.btns [name=order]').classList.add('visible')
        document.querySelector('.btns [name=preview]').classList.add('visible')
      } else {
        document.querySelector('.btns [name=play]').classList.add('visible')
        document.querySelector('.btns [name=choose]').classList.add('visible')
      }
      this.setFocus()
    },
    loadRecommendList: function(data) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < data.length; i++) {
        var item = data[i]
        var recommend = document.createElement('div')
        recommend.className = 'poster';
        recommend.setAttribute('name', 'recommend');
        var poster = document.createElement('img')
        poster.src = item.poster
        recommend.appendChild(poster)
        recommend.dataset['asset_id'] = item.asset_id
        fragment.appendChild(recommend)
      }
      document.querySelector('.recommend').appendChild(fragment)
    },
    switchAssetList: function(open) {
      var switcher = document.getElementById('asset_list')
      if (!open) {
        switcher.classList.remove('show')
      } else {
        switcher.classList.add('show')
      }
      // this.setFocus(this.index)
    },
    up: function() {
      var self = this;
      switch (self.focusType) {
        case 'recommend':
          self.focusType = 'btn';
          self.changeBtnFocus();
          break;
        case 'asset':
        case 'serial':
          self.focusType = 'asset';
          var rows = self.serialSize / self.serialRow
          var next = self.index_asset - rows
          if (next < self.serialSize && next >= 0) {
            var count = next % rows
            while (self.serialSize * self.index_serial + next >= self.model.assets.length && count >= 0) {
              if (count >= 0) {
                next--;
              }
            }
            if (count >= 0) {
              self.index_asset = next;
            }
          }
          self.changeAssetFocus();
          break;
        default:
      }
    },
    down: function() {
      var self = this;
      switch (self.focusType) {
        case 'btn':
          self.focusType = 'recommend';
          self.changeRecommendFocus();
          break;
        case 'asset':
          var rows = self.serialSize / self.serialRow
          var next = self.index_asset + rows
          if (next < self.serialSize) {
            var count = next % rows
            while (self.serialSize * self.index_serial + next >= self.model.assets.length && count >= 0) {
              count--;
              if (count >= 0) {
                next--;
              }
            }
            if (count >= 0) {
              self.index_asset = next;
              this.changeAssetFocus();
            } else {
              if (this.checkSerial()) {
                this.focusType = 'serial'
              this.changeSerialFocus();
              }
            }
          } else {
            if (this.checkSerial()) {
              this.focusType = 'serial'
              this.changeSerialFocus();
            }
          }
          break;
        default:

      }
    },
    left: function() {
      var self = this;
      switch (self.focusType) {
        case 'btn':
          var next = this.index_btn - 1
          if (next >= 0) {
            this.index_btn = next
            }
          this.changeBtnFocus();
          break;
        case 'recommend':
          var next = this.index_recommend - 1
          if (next >= 0) {
            this.index_recommend = next
            }
          this.changeRecommendFocus();
          break;
        case 'asset':
          var next = this.index_asset - 1,
              columns = this.serialSize / this.serialRow,
              mod = this.index_asset % columns
          if (mod !== 0) {
            this.index_asset = next
          }
          this.changeAssetFocus();
          break;
        case 'serial':
          var next = this.index_serial - 1
          if (next >= 0) {
            this.index_serial = next
          }
          this.changeSerialFocus();
          break;
        default:

            }
    },
    right: function() {
      var self = this;
      switch (self.focusType) {
        case 'btn':
          var len = document.querySelectorAll('.btns > div.visible').length
              next = this.index_btn + 1
          if (next < len) {
            this.index_btn = next
          }
          this.changeBtnFocus();
          break;
        case 'recommend':
          var len = document.querySelectorAll('.recommend [name="recommend"]').length
              next = this.index_recommend + 1
          if (next < len) {
            this.index_recommend = next
          }
          this.changeRecommendFocus();
          break;
        case 'asset':
          var next = this.index_asset + 1,
              columns = this.serialSize / this.serialRow,
              mod = next % columns
          if (mod !== 0 && (next + this.serialSize * this.index_serial) < this.model.assets.length) {
            this.index_asset = next
            }
          this.changeAssetFocus();
          break;
        case 'serial':
          var serialSize = Math.ceil(this.model.assets.length / this.serialSize)
          var next = this.index_serial + 1
          if (next < serialSize) {
            this.index_serial = next
          }
          this.changeSerialFocus();
          break;
        default:
      }
    },
    setFocus: function(idx) {
      var type = this.focusType
      switch (type) {
        case 'recommend':
          var next = this.index_recommend + idx
          if (next < 0 || next > 6) {
            this.index_recommend = next
        }
          this.changeRecommendFocus();
          break;
        case 'asset':
          var next = this.index_asset + idx
          if (next < this.serialSize && next >= 0) {
            var count = next % (this.serialSize / this.serialRow)
            while (this.serialSize * this.index_serial + next >= this.model.assets.length && count >= 0) {
              if (count >= 0) {
                next--;
              }
            }
            if (count >= 0) {
              this.index_asset = next;
            }
          }
          this.loadAsset(this.index_serial)
          this.changeAssetFocus();
          break;
        case 'serial':
          var serials = Math.floor(this.model.assets.length / this.serialSize),
              next = this.index_serial + idx
          if (next >= 0 && next < serials) {
            this.index_serial = next
          }
          this.changeSerialFocus();
          break;
        case 'btn':
          var len = document.querySelectorAll('.btns > div.visible').length,
              next = this.index_btn + idx
          if (next >= 0 && next < len) {
            this.index_btn = next
          }
          this.changeBtnFocus();
          break;
        default:
          this.changeAlertFocus(type, true);
      }
    },
    chooseBtn: function() {
      var focus = document.querySelector('.focus');
      var type = focus.getAttribute('name')
      var self = this;
      switch (type) {
        case 'recommend'://我的推荐
          var asset_id = focus.dataset['asset_id']
          location.href = './detail.html?asset_id=' + asset_id + '&backUrl=' + location.href;
          break;
        case 'asset'://选集-集数
          var page_focus = {
            focusType: self.focusType,
            index_btn: self.index_btn,
            index_recommend: self.index_recommend,
            index_asset: self.index_asset,
            index_serial: self.index_serial
          }
          self.storage.setValue('focus', JSON.stringify(page_focus))
          var vod = {}
          var asset = this.model.assets[this.index_serial * this.serialSize + this.index_asset]
          vod.ProviderId = asset.provider_id
          vod.ProviderAssetId = asset.provider_asset_id
          vod.videoId = asset.videoid
          playVideo(vod)
          break;
        // case 'serial'://选集-范围
        //   self.index_asset = 0;
        //   self.loadAsset(self.index_serial);
          // break;
        case 'choose':
          self.focusType = 'asset';
          document.querySelector('#asset_list').classList.add('show')
          self.index_serial = self.index_asset = 0;
          self.setFocus();
          break;
        case 'favorite'://收藏
          self.api.toggleFavorite(self.model, function(favorite, id) {
            self.model.isFavorite = favorite;
            if (favorite) {
              document.querySelector('.btns [name=favorite]').classList.add('favorite')
            } else {
              document.querySelector('.btns [name=favorite]').classList.remove('favorite')
            }
            if (id) {
              self.model.favorite_item_id = id;
            }
          })
          break;
        case 'preview'://试播
          if (onlineOrder) {
            self.focusType = 'online'
          } else {
            self.focusType = 'offline'
          }
          var page_focus = {
            focusType: self.focusType,
            index_btn: self.index_btn,
            index_recommend: self.index_recommend,
            index_asset: self.index_asset,
            index_serial: self.index_serial
          }
          self.storage.setValue('focus', JSON.stringify(page_focus))
          var vod = {
            name: this.model.data.name,
            videoId: this.model.data.videoid,
            freeVideoFlag: true
          }
          playVideo(vod)
          break;
        case 'order'://订购
          //onlineOrder: 支持在线订购的话跳转到页面
          // if (onlineOrder) {
          //   location.href = ''
          // }
          self.focusType = 'buy';
          document.querySelector('.alert[name=buy]').classList.add('show');
          self.setFocus();
          var page_focus = {
            focusType: self.focusType,
            index_btn: self.index_btn,
            index_recommend: self.index_recommend,
            index_asset: self.index_asset,
            index_serial: self.index_serial
          }
          self.storage.setValue('focus', JSON.stringify(page_focus))
          break;
        default://播放
          var page_focus = {
            focusType: self.focusType,
            index_btn: self.index_btn,
            index_recommend: self.index_recommend,
            index_asset: self.index_asset,
            index_serial: self.index_serial
          }
          self.storage.setValue('focus', JSON.stringify(page_focus))
          var vod = {}
          if (bundle) {
            var asset = this.model.assets[0]
            vod.name = asset.name
            vod.videoId = asset.videoid
          } else {
            vod.name = this.model.data.name
            vod.videoId = this.model.data.videoid
          }
          playVideo(vod)
      }
      // alert(type);
    },
    changeAlertFocus: function(type, needShow) {
      var dialog = document.querySelector('.alert[name=' + type + ']'),
          isDialogShow = dialog.classList.contains('show')
      if (!isDialogShow) {
        dialog.classList.add('show')
      }
      if (needShow) {
        dialog.classList.add('show')
      } else {
        dialog.classList.remove('show')
      }
    },
    changeBtnFocus: function() {
      this.rmvFocus()
      var list = document.querySelectorAll('.btns > div.visible'),
          focus = null;
      focus = list[this.index_btn]
      if (focus) {
      	focus.classList.add('focus')
      }
    },
    changeSerialFocus: function() {
      this.rmvFocus()
      var list = document.querySelectorAll('.serial')
      var focus = null;
      focus = list[this.index_serial]
      if (focus) {
      	focus.classList.add('focus')
        this.index_asset = 0;
        this.loadAsset(this.index_serial);
      }
    },
    changeAssetFocus: function() {
      this.rmvFocus()
      var list = document.querySelectorAll('.asset'),
          focus = null,
          isDialogShow = document.querySelector('#asset_list').classList.contains('show');
      focus = list[this.index_asset]
      if (focus) {
      	focus.classList.add('focus')
      }
      if (!isDialogShow) {
        document.querySelector('#asset_list').classList.add('show')
      }
    },
    changeRecommendFocus: function() {
      this.rmvFocus();
      var list = document.querySelectorAll('.poster')
      var focus = null;
      focus = list[this.index_recommend]
      if (focus) {
      	focus.classList.add('focus')
      }
    },
    rmvFocus: function() {
      var focus = document.querySelector('.focus')
      if (focus) {
        focus.classList.remove('focus')
      }
    },
    checkSerial: function() {
      var ret = false,
          len = this.model.assets.length,
          serials = 0;
      serials = Math.ceil(len / this.serialSize)
      if (serials > 1) {
        ret = true;
      }
      return ret;
    },
    isFree: function(resp) {
      var ret = false;
      /*---------根据ticket的内容计算用户是否能免费观看--------*/

      ret = true
      /*-------------------- End--------------------------*/
      return ret;
    }
  };
  var API = {
    getList: function(callback) {
      var self = this;
      var url = paasHost + '/aquapaas/rest/search/content_by_id/vod',
          urlParam = [];
      urlParam.push('ids=' + [provider_id, provider_asset_id].join('_'))
      urlParam.push('app_key=' + paasAppKey)//应用授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用授权
      url += '?' + urlParam.join('&')
      request.get(url, function(resp) {
        var ret;
        if (resp.length > 0) {
          ret = resp[0]
        } else {
          ret = {}
        }
        bundle = ret.ispackage == 'Y' ? true : false
        callback && callback(ret)
      })
    },
    getFavorite: function(callback) {
      var type = 'zgdvod',
          user_id = my.paas.user_id,
          access_token = my.paas.access_token,
          url = paasHost + '/aquapaas/rest/favorite/' + type + '/' + user_id,
          urlParam = [];
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('user_id=' + user_id)
      urlParam.push('access_token=' + access_token)
      url += '?' + urlParam.join('&')
      getJson(url, function(resp) {
        var exit = false;
        var favorite_item_id;
        for (var i = 0, len = resp.length; i < len; i++) {
          var item = resp[i];
          // var provider_id = item.metadata.provider_id;
          // var provider_asset_id = item.metadata.provider_asset_id;
          if (provider_id == item.metadata.provider_id && provider_asset_id == item.metadata.provider_asset_id) {
            exit = true
            favorite_item_id = item.favorite_item_id;
          }
        }
        callback && callback(exit, favorite_item_id)
      })
    },
    toggleFavorite: function(model, callback) {
      var data = model.data,
          isFavorite = model.isFavorite
      var putData = {
        metadata: {
          doc_type: data.doc_type,
          doc_id: data.doc_id,
          provider_id: data.provider_id,
          provider_asset_id: data.provider_asset_id,
          navipath: '',//navitree上的path，例如:全网视/电视剧/推荐/
          navipath_id: ''//navitree上asset相对应的父节点的id
        }
      }
      if (isFavorite) {
        putData.favorite_item_id = model.favorite_item_id
        this.removeFavorite(putData, callback)
      } else {
        this.addFavorite(putData, callback)
      }
    },
    addFavorite: function(data, callback) {
      var self = this,
          type = 'zgdvod',
          user_id = my.paas.user_id,
          access_token = my.paas.access_token,
          url = paasHost + '/aquapaas/rest/favorite/' + type + '/' + user_id,
          urlParam = []
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
      urlParam.push('user_id=' + user_id)
      urlParam.push('access_token=' + access_token)
      url += '?' + urlParam.join('&')
      request.post(url, data, function() {
        self.getFavorite(function(isFavorite, id) {
          callback && callback(isFavorite, id)
        })
      })
    },
    removeFavorite: function(data, callback) {
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
        self.getFavorite(function(isFavorite, id) {
          callback && callback(isFavorite, id)
        })
      })
    },
    getRecommendList: function(category, callback) {
      var method = 'Get',
          type = 'zgd_category_genre_datasource',
          url = daasHost + '/aquadaas/rest/recommend/asset/' + type,
          urlParam = [];
      urlParam.push('app_key=' + paasAppKey)//应用授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用授权
      urlParam.push('category_id=' + encodeURIComponent(category))
      url += '?' + urlParam.join('&')
      request.get(url, function(resp) {
        callback && callback(resp.recommend_list)
      })
    },
    getAssetList: function(data, callback) {
      var bundle_id = data.bundle_id || [data.provider_id, data.provider_asset_id].join('_')
      var url = paasHost + '/aquapaas/rest/search/contents/asset',
          urlParam = [];
      urlParam.push('visible=all')
      urlParam.push('bundle_id=' + bundle_id)
      urlParam.push('bundle_id_op=eq')
      urlParam.push('start=-1')
      urlParam.push('sort_mode=a')
      urlParam.push('sort_by=chapter')
      urlParam.push('app_key=' + paasAppKey)//应用授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用授权
      url += '?' + urlParam.join('&')
      getJson(url, function(resp) {
        callback && callback(resp)
      })
    },
    haveBought: function(type, callback) {
      var url = paasHost + '/aquapaas/rest/ticket/available',
          urlParam = [],
          user_id = my.paas.user_id,
          access_token = my.paas.access_token,
          asset_id = [provider_id, provider_asset_id].join('_');
      urlParam.push('asset_type=' + type)
      urlParam.push('asset_id=' + asset_id)
      urlParam.push('app_key=' + paasAppKey)//应用授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用授权
      urlParam.push('user_id=' + user_id)//用户授权
      urlParam.push('access_token=' + access_token)//用户授权
      url += '?' + urlParam.join('&')
      request.post(url, {assets:[]}, function(resp) {
        callback && callback(resp)
      })
    }
  }
  var Model = {
    data: [],
    assets: [],
    isFavorite: false,
    list: function(resp) {
      var ret = {}, data = {};
      try {
        if (resp.ispackage == 'Y') {
          data.title = resp.title
          data.year = resp.year||''
          data.actors = resp.actors
          data.director = resp.director
          data.posterboard = resp.packageposterboard||''
          data.type = resp.genre.join('/')
          data.summary_short = resp.description
        } else {
          data = resp
          data.type = resp.genre.join('/')
        }
        var poster_data = data.posterboard||'',
            poster
        if (Object.prototype.toString.call(poster_data) == '[object Array]') {
          var posts = poster_data
          poster = posts.pop();
        } else {
          poster = poster_data.split(',').pop();
        }
        ret = {
          name: resp.name,
          title: data.title,
          year: data.year,
          actors: data.actors,
          director: data.director,
          poster: poster,
          type: data.type,
          summary: data.summary_short,
          pid: resp.provider_id,
          paid: resp.provider_asset_id,
          chapter: resp.chapter||''
        }
      } catch (e) {
        console.log(e.message);
        ret = {
          name: '',
          title: '',
          year: '',
          actors: '',
          director: '',
          poster: '',
          type: '',
          summary: '',
          pid: '',
          paid: '',
          chapter: ''
        }
      } finally {
        return ret;
      }
    },
    Recommend: function(resp) {
      var ds = [];
      for (var i = 0; i < resp.length; i++) {
        var item = resp[i];
        var poster_list = item.metadata.posterboard_v || item.metadata.packageposterboard;
        var poster = poster_list.split(',').pop();
        ds.push({
          asset_id: item.asset_id,
          poster: poster
        })
      }
      return ds.slice(0, 6);
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
