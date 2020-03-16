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
      getJson = utils.getJson,
      getUrlParam = utils.getUrlParam,
      debug = utils.debug,
      playVideo = utils.playVideo,
      bundle = false,
      getHash = utils.getHash,
      setHash = utils.setHash,
      report = utils.report,
      AuditTreeVersion = getUrlParam('tree_version'),
      hash = null;
  var dialog = function(opts) {
    var pane = deepClone({}, Pane);
    var api = deepClone({}, API);
    var model = deepClone({}, Model);
    hash = getHash()//记录hash值到模块变量
    if (hash) {
      pane.focusType = hash.assetType || pane.focusType
      pane.index = hash.assetIndex || pane.index
    }
    pane.api = api;
    pane.model = model;
    pane.init();
  }
  var Pane = {
    focusType: 'main',
    index: 0,
    init: function() {
      bundle = hash.curMenu == 2 ? true: false
      this.bindEvents();
      report.setKey('pageID', getUrlParam('prev') == 'index1' ? '110':'1110')
      this.loadData();
    },
    bindEvents: function() {
      var self = this;
      addEvent({
        up: function() {
          if (self.focusType == 'serial') {
            self.setFocus(self.index - 10)
          } else if (self.focusType == 'asset') {
            self.setFocus(self.index - 1)
          }
          return false;
        },
        down: function() {
          if (self.focusType == 'serial') {
            self.setFocus(self.index + 10)
          } else if (self.focusType == 'asset') {
            self.setFocus(self.index + 1)
          }
          return false;
        },
        left: function() {
          if (self.focusType == 'asset') {
            self.focusType = 'serial'
            self.setFocus(self.index)
          }
          return false;
        },
        right: function() {
          if (self.focusType == 'serial') {
            self.focusType = 'asset'
            self.setFocus(Math.floor(self.index / 10) * 10)
          }
          return false;
        },
        back: function() {
          report.setKey('serviceEntrance', '-1')
          var prev = getUrlParam('prev')
          if (self.focusType == 'main') {
            var appBackParam = null
            var url = './' + prev + '.html'
            delete hash.assetIndex
            delete hash.assetType;
            setHash(hash)
            if (AuditTreeVersion) {
              url += (url.indexOf('?') !== -1 ? '&': '?') + 'tree_version=' + AuditTreeVersion
            }
            url += location.hash
            location.href = url
            report.send();
          } else {
            self.focusType = 'main'
            // self.switchAssetList(false);
            self.setFocus(0)
          }
          return false;
        },
        enter: function() {
          report.setKey('serviceEntrance', '1')
          var data = self.model.data
          if (bundle) {//剧集
            if (self.focusType == 'main') {
              self.focusType = 'serial'
              self.setFocus(0)
            } else if (self.focusType == 'asset') {
              var data = self.model.assets[self.index]
              //记录页面状态
              var curHash = hash
              curHash.assetType = self.focusType
              curHash.assetIndex = self.index
              setHash(curHash)
              report.setKey('columnID', '11' + hash.curMenu + (getUrlParam('prev') !== 'index1' ? hash.secIndex : hash.curIndex) + self.index)
              report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[hash.curMenu] + '/' + data.name + '/' + self.model.assets[self.index].chapter)
              report.send();
              playVideo({
                ProviderId: data.provider_id,
                ProviderAssetId: data.provider_asset_id
              })
            } else {
              // report.setKey('serviceEntrance', '0')
              // report.send();
            }
          } else {//单集
            report.setKey('columnID', '11' + hash.curMenu + (getUrlParam('prev') !== 'index1' ? hash.secIndex : hash.curIndex))
            report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[hash.curMenu] + '/' + data.name)
            report.send();
            playVideo({
              ProviderId: data.pid,
              ProviderAssetId: data.paid
            })
          }
          return false;
        }
      })
    },
    loadData: function() {
      var self = this;
      self.api.getList(function(resp) {
        self.model.data = self.model.list(resp)
        var assets = resp.children;
        // if (Object.prototype.toString.call(assets) == '[object Array]') {
        //   assets.sort(function(a, b) {
        //     return parseInt(a.chapter) - parseInt(b.chapter)
        //   })
        // }
        self.model.assets = assets;
        self.loadPage(self.model.data)
      })
    },
    loadSerial: function() {
      document.getElementById('asset_range').innerHTML = '';
      var set = this.model.assets;
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < set.length; i++) {
        var item = set[i];
        var serialIndex = Math.floor(i / 10)
        if (i % 10 == 0) {
          var dom = document.createElement('div')
          dom.id = 'serial' + serialIndex
          dom.className = 'serial'
          dom.innerHTML = serialIndex + '1-' + (serialIndex + 1) + 0
          fragment.appendChild(dom)
        }
      }
      document.getElementById('asset_range').appendChild(fragment)
      this.loadAsset();
    },
    loadAsset: function() {
      var serial = Math.floor(this.index / 10)
      var assets = this.model.assets.slice(serial * 10, (serial + 1) * 10)
      var fragment = document.createDocumentFragment();
      document.getElementById('asset_ids').innerHTML = ''
      for (var i = 0; i < assets.length; i++) {
        var item = assets[i]
        var dom = document.createElement('div')
        dom.innerHTML = serial * 10 + (i + 1)
        dom.id = 'asset' + i;
        dom.className = 'asset';
        fragment.appendChild(dom)
      }
      document.getElementById('asset_ids').appendChild(fragment);
    },
    loadPage: function(data) {
      document.getElementById('poster').style.backgroundImage = 'url(' + data.poster + ')';
      document.getElementById('title').innerHTML = data.title
      if (data.year) {
        document.getElementById('year').innerHTML = data.year
      } else {
        document.getElementById('year').style.display = 'none';
      }
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
        document.getElementById('play').innerHTML = '选&nbsp;&nbsp;集'
        try {
          this.loadSerial();
        } catch (e) {
          console.log(e.message);
        } finally {

        }
      }
      this.setFocus(this.index)
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
    setFocus: function(idx) {
      var columnName = treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[getUrlParam('menu')] + '/' + this.model.data.name
      var focus = document.querySelector('.focus')
      if (focus) {
        focus.classList.remove('focus')
      }
      var index = idx
      if (this.focusType == 'main') {
        report.setKey('columnID', '11' + hash.curMenu + (getUrlParam('prev') !== 'index1' ? hash.secIndex : hash.curIndex))
        report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[hash.curMenu] + '/' + this.model.data.name)
        this.switchAssetList(false);
        document.getElementById('play').classList.add('focus')
      } else if (this.focusType == 'serial') {
        this.switchAssetList(true);
        var maxSerial = Math.ceil(this.model.assets.length / 10) * 10 - 1
        if (maxSerial < index) {
          index = this.index
        } else if (index < 0) {
          index = this.index
        }
        var serialIndex = Math.floor(index / 10)
        document.getElementById('serial' + serialIndex).classList.add('focus')
        this.index = index;
        this.loadAsset()
        // report.setKey('columnID', '11' + hash.curMenu + (getUrlParam('prev') !== 'index1' ? hash.secIndex : hash.curIndex))
        // report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[hash.curMenu] + '/' + this.model.data.name)
      } else {
        this.switchAssetList(true);
        var range_min = Math.floor(this.index / 10) * 10;
        var range_max = Math.min(range_min + 9, this.model.assets.length - 1);
        var assetIndex = 0
        if (index < range_min || index > range_max) {
          index = this.index
        }
        var assetIndex = index % 10
        document.getElementById('asset' + assetIndex).classList.add('focus')
        if (index != this.index) {
          report.setKey('serviceEntrance', '0')
        }
        this.index = index;
        report.setKey('columnID', '11' + hash.curMenu + (getUrlParam('prev') !== 'index1' ? hash.secIndex : hash.curIndex) + this.index)
        report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[hash.curMenu] + '/' + this.model.data.name + '/' + this.model.assets[this.index].name)
      }
      // report.send();
    }
  };
  var API = {
    getList: function(callback) {
      var self = this;
      var url = paas_host + '/aquapaas/rest/asset/' + [getUrlParam('pid'), getUrlParam('paid')].join('_') + '?app_key=' + app_key + '&timestamp=' + new Date().toISOString()
      // getJson(url, function(resp) {
        if (bundle) {
          self.getBundle(callback)
        } else {
          self.getAsset(callback)
        }
      // })
    },
    getAsset: function(callback) {
      // var url = paas_host + '/aquapaas/rest/search/content_by_id/asset?ids=' + data.provider_id + '_' + data.provider_asset_id +'&app_key=' + app_key + '&timestamp=' + new Date().toISOString()
      var url = paas_host + '/aquapaas/rest/search/content_by_id/asset?ids=' + [getUrlParam('pid'), getUrlParam('paid')].join('_') +'&app_key=' + app_key + '&timestamp=' + new Date().toISOString()
      getJson(url, function(resp) {
        var _data = resp[0]
        callback && callback(resp[0])
      })
    },
    getBundle: function(callback) {
      // var url = paas_host + '/aquapaas/rest/search/content_by_id/vod?ids=' + data.provider_id + '_' + data.provider_asset_id +'&app_key=' + app_key + '&timestamp=' + new Date().toISOString();
      var url = paas_host + '/aquapaas/rest/search/content_by_id/vod?ids=' + [getUrlParam('pid'), getUrlParam('paid')].join('_') +'&app_key=' + app_key + '&timestamp=' + new Date().toISOString();
      var self = this;
      getJson(url, function(resp) {
        var _data = resp[0]
        self.getAssetList(_data, callback)
      })
    },
    getAssetList: function(data, callback) {
      var bundle_id = data.bundle_id || [data.provider_id, data.provider_asset_id].join('_')
      var url = paas_host + '/aquapaas/rest/search/contents/asset?visible=all&bundle_id=' + bundle_id + '&bundle_id_op=eq&start=-1&sort_mode=a&sort_by=chapter&app_key=' + app_key + '&timestamp=' + new Date().toISOString()
      getJson(url, function(resp) {
        var _data = data
        _data.children = resp||[];
        callback && callback(_data)
      })
    }
  }
  var Model = {
    data: [],
    assets: [],
    list: function(resp) {
      var ret = {}, data = {};
      try {
        if (resp.ispackage == 'Y') {
          data.title = resp.title
          data.year = resp.year||''
          data.actors = resp.actors
          data.director = resp.director
          data.posterboard = resp.packageposterboard||''
          data.description = ''
          data.summary_short = resp.description
        } else {
          data = resp
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
          type: data.description,
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
    }
  }
  return {
    init: function(opts) {
      debug(showLog)
      console.log(location.href);
      var app = new dialog(opts);
    }
  };
}))
