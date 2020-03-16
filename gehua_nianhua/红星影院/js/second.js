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
      getStrByLen = utils.getStrByLen,
      useMarquee = utils.useMarquee,
      debug = utils.debug,
      getHash = utils.getHash,
      setHash = utils.setHash,
      report = utils.report,
      getUrlParam = utils.getUrlParam,
      AuditTreeVersion = getUrlParam('tree_version'),
      pageID = '111',
      hash = null;
  var dialog = function(opts) {
    var pane = deepClone({}, Pane);
    var api = deepClone({}, API);
    var model = deepClone({}, Model);
    hash = getHash()//记录hash值到模块变量
    if (hash) {
      pane.curPage = typeof hash.secPage !== 'undefined' ? hash.secPage : pane.curPage
      pane.curIndex = typeof hash.secIndex !== 'undefined' ? hash.secIndex : pane.curIndex
    }
    pane.api = api;
    pane.model = model;
    pane.init();
  }
  var Pane = {
    curPage: 0,
    curIndex: 0,
    totalPage: 0,
    folderPos: [
      {l: 131,t: 74},
      {l: 331,t: 74},
      {l: 531,t: 74},
      {l: 731,t: 74},
      {l: 931,t: 74},
      {l: 131,t: 357},
      {l: 331,t: 357},
      {l: 531,t: 357},
      {l: 731,t: 357},
      {l: 931,t: 357}
    ],
    init: function() {
      report.setKey('pageID', pageID)
      this.loadData();
    },
    bindEvents: function() {
      var self = this;
      addEvent({
        up: function() {
          if (self.curIndex - 5 < 0) {
            // history.back();
            self.back();
          } else {
            self.setFocus(self.curIndex - 5)
          }
          return false;
        },
        down: function() {
          self.setFocus(self.curIndex + 5)
          return false;
        },
        left: function() {
          if (self.curIndex == 5) {
            var tmpPage = self.curPage;
            if (self.curPage == 0) {
              self.back();
            } else {
              self.loadPage(self.curPage - 1)
              if (self.curPage < tmpPage) {
                self.setFocus(9)
              }
            }
          } else if (self.curIndex == 0) {
            var tmpPage = self.curPage;
            self.loadPage(self.curPage - 1)
            if (self.curPage < tmpPage) {
              self.setFocus(4)
            } else {
              // history.back();
              self.back();
            }
          } else {
            self.setFocus(self.curIndex - 1)
          }
          return false;
        },
        right: function() {
          if (self.curIndex == 4) {
            var tmpPage = self.curPage;
            self.loadPage(self.curPage + 1)
            if (tmpPage < self.curPage) {
              self.setFocus(0)
            }
          } else if (self.curIndex == 9) {
            var tmpPage = self.curPage;
            self.loadPage(self.curPage + 1)
            if (tmpPage < self.curPage) {
              self.setFocus(5)
            }
          } else {
            self.setFocus(self.curIndex + 1)
          }
          return false;
        },
        pageup: function() {
          self.loadPage(self.curPage - 1);
        },
        pagedown: function() {
          self.loadPage(self.curPage + 1);
        },
        back: function() {
          self.back();
        },
        enter: function() {
          report.setKey('serviceEntrance', '1')
          report.send();
          var curHash = hash
          curHash.secPage = self.curPage;
          curHash.secIndex = self.curIndex;
          setHash(curHash)
          if (hash.curMenu == 0) {
            self.goto3Detail();
          } else {
            self.gotoDetail()
          }
          return false;
        }
      })
    },
    gotoDetail: function() {
      var item = this.model.data[this.curIndex + this.curPage * 10]
      var url = 'asset.html?prev=second&pid=' + item.pid + '&paid=' + item.paid
      if (AuditTreeVersion) {
        url += (url.indexOf('?') !== -1 ? '&': '?') + 'tree_version=' + AuditTreeVersion
      }
      url += location.hash
      location.href = url
    },
    goto3Detail: function() {
      var item = this.model.data[this.curIndex + this.curPage * 10];
      //2019-05-07根据金磊的要求，现在写死假数据
      var vspUrl = vsphost + "/vsp_outlet/catalog/reverse/json?id=10048905&paids=" + item.paid + "&caid=1370495919&key=ahof3hgaobpgn7";
      getJson(vspUrl, function(resp) {
        var vspId = resp.result.list[0].id;
        if(vspId != "undefined"){
          if (navigator.userAgent.lastIndexOf('iPanel') > -1) { //iPanel
            window.location.href = yuanxianhost + "/jiaying_dsyx_ghitv/details.html?entry=20&dataId=" + vspId;
          } else { //歌华适配层
            var ret = GHWEBAPI.StartApp({
              AppMode: 'Mixed',
              AppID: portalAppId,
              AppType: 'WEB',
              AppParam: {
                Linux: yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId,
                Android: yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId,
                ThinClient: yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId
              }
            }, null, "")
          }
        }
      })
    },
    setFocus: function(idx) {
      var list = document.querySelectorAll('.folder'),
          index = idx,
          focus;
      if (index < 0 || index >= 10) {
        index = this.curIndex
      }
      while (index + this.curPage * 10 >= this.model.data.length) {
        index --
      }
      if (!!this.model.data.length) {
        var focus = document.getElementById('focus')
        focus.style.display = 'block';
        // if (typeof index == 'number' && typeof this.folderPos[index] == 'object') {
          focus.style.left = this.folderPos[index].l + 'px'
          focus.style.top = this.folderPos[index].t + 'px'
          var prev_text = document.querySelector('.text.focus')
          if (prev_text) {
            prev_text.classList.remove('focus')
            var data = this.model.data[this.curPage * 10 + this.curIndex]
            if (data) {
              prev_text.innerHTML = getStrByLen(data.text, 16)
            }
          }
          var text = document.querySelectorAll('.text')[index]
          text.classList.add('focus')
          text.innerHTML = useMarquee(this.model.data[this.curPage * 10 + index].text, 16)
        // }
      }
      if (index != this.curIndex) {
        report.setKey('serviceEntrance', '0')
      }
      this.curIndex = index;
      //埋点
      report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[hash.curMenu] + '/' + this.model.data[this.curPage * 8 + this.curIndex].text)
      report.setKey('columnID', '11' + hash.curMenu + this.curIndex)
      report.send();
    },
    removeFocus: function() {
      var focus = document.querySelector('.folder.focus')
      if (focus) {
        focus.classList.remove('focus')
      }
    },
    loadData: function() {
      var self = this;
      self.api.getList(function(resp) {
        var ret = self.model.list(resp)
        self.model.data = ret;
        self.totalPage = Math.ceil(ret.length / 10)
        self.loadPage(self.curPage)
        self.bindEvents();
      })
    },
    loadPage: function(page) {
      var self = this;
      var p = self.curPage;
      if (page >= 0 && page < self.totalPage) {
        p = page
      }
      var set = self.model.data.slice(p * 10, (p + 1) * 10)
      //====== print set data
      console.log('>>>>> set data:' + JSON.stringify(set));
      //=========== print end
      // return p
      if (p < this.curPage) {
        report.setKey('serviceEntrance', '2')
      } else if (p > this.curPage) {
        report.setKey('serviceEntrance', '3')
      }
      this.curPage = p;
      report.setKey('pageNum', this.curPage)
      report.setKey('serviceNum', set.length)
      self.api.getPosterBoard(set, function(resp) {
        self.renderPage(p, resp)
      })

      // self.setFocus(self.curIndex)
    },
    renderPage: function(p, set) {
      this.clearPage();
      var folders = document.querySelectorAll('.folder'),
          texts = document.querySelectorAll('.text');
      for (var i = 0; i < set.length; i++) {
        var item = set[i];
        (function(el, url){
          var img = new Image();
          img.style.height = '100%';
          img.style.width = '100%'
          img.onload = function() {
            el.appendChild(this)
          }
          img.src = url;
        })(folders[i], item.bg)
        if (hash.curMenu != 0) {
          folders[i].classList.add('free')
          folders[i].innerHTML += '<div class="mask"></div>'
        }
        // folders[i].style.backgroundImage = 'url(' + item.bg + ')'
        texts[i].innerHTML = getStrByLen(item.text, 16)
      }
      document.getElementById('page_num').innerHTML = p + 1;
      document.getElementById('page_size').innerHTML = this.totalPage ? this.totalPage : 1;
      if (p == 0) {
        document.querySelector('.pageturn.up').classList.remove('active')
      } else {
        document.querySelector('.pageturn.up').classList.add('active')
      }
      if (p == this.totalPage - 1 || this.totalPage < 2) {
        document.querySelector('.pageturn.down').classList.remove('active')
      } else {
        document.querySelector('.pageturn.down').classList.add('active')
      }
      this.setFocus(this.curIndex||0)
    },
    clearPage: function() {
      var folders = document.querySelectorAll('.folder'),
          texts = document.querySelectorAll('.text');
      for (var i = 0; i < folders.length; i++) {
        // folders[i].style.backgroundImage = ''
        folders[i].innerHTML = ''
        folders[i].classList.remove('free');
      }
      for (var i = 0; i < texts.length; i++) {
        texts[i].innerHTML = ''
      }
    },
    back: function() {
      report.setKey('serviceEntrance', '-1')
      report.send();
      var appBackParam = null;
      var url = './index1.html'
      delete hash.secPage
      delete hash.secIndex
      setHash(hash)
      if (AuditTreeVersion) {
        url += (url.indexOf('?') !== -1 ? '&': '?') + 'tree_version=' + AuditTreeVersion
      }
      url += location.hash
      location.href = url
    }
  };
  var API = {
    getList: function(callback) {
      var self = this;
      var url = treeRoot + menuRoot[hash.curMenu],
          urlParam = [];
      urlParam.push('children=1')
      urlParam.push('enable=all')
      urlParam.push('app_key=' + app_key)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      if (AuditTreeVersion) {//如果是审核版本的话，传入树的版本号
        urlParam.push('tree_version=' + AuditTreeVersion)
      }
      url += '?' + urlParam.join('&')
      getJson(url, function (resp) {
        var data = resp.children
        data.sort(function(a, b) {
          return parseInt(a.index) - parseInt(b.index)
        })
        callback && callback(data)
      })
    },
    getPosterBoard: function(data, callback) {
      var ids = data.map(function(item) {
        return [item.pid,item.paid].join('_')
      });
      var _data = data;
      var url = paas_host + '/aquapaas/rest/search/content_by_id/vod?ids=' + ids.join(',') + '&app_key=' + app_key + '&timestamp=' + new Date().toISOString();
      if (ids.length > 0) {
        getJson(url, function(resp) {
          var tmp = [];
          for (var i = 0; i < _data.length; i++) {
            var target = _data[i];
            for (var j = 0; j < resp.length; j++) {
              var asset = resp[j]
              if (target.pid == asset.provider_id && target.paid == asset.provider_asset_id) {
                var bg = asset.posterboard || asset.packageposterboard ||''
                target.bg = bg.split(',').pop();
              }
            }
            if (!!!target.bg) {
              target.bg = ''
            }
            tmp.push(target)
          }
          callback && callback(tmp)
        })
      } else {
        callback && callback(_data)
      }
    }
  }
  var Model = {
    data: [],
    list: function(resp) {
      var ret = [];
      for (var i = 0; i < resp.length; i++) {
        var item = resp[i];
        if (item.metadata_public.entryType == '6' || item.metadata_public.entryType == '5') {
          var pid = item.metadata_public.ProviderId;
          var paid = item.metadata_public.ProviderAssetId
          // var posters = item.bg.split(',')
          // var poster = posters.pop();
          ret.push({
            text: item.name,
              // bg: poster,
              pid: pid,
              paid: paid
          })
        }
      }
      return ret;
    }
  }
  return {
    init: function(opts) {
      try {
        debug(showLog)
        console.log(location.href);
        var app = new dialog(opts);
      } catch (e) {
        console.log('error message:' + e.message);
      } finally {

      }
    }
  };
}))
