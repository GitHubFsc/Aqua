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
      useMarquee = utils.useMarquee,
      getStrByLen = utils.getStrByLen,
      getUrlParam = utils.getUrlParam,
      debug = utils.debug,
      exitApp = utils.exitApp,
      getHash = utils.getHash,
      setHash = utils.setHash,
      savePortal = utils.savePortal,
      report = utils.report,
      AuditTreeVersion = getUrlParam('tree_version'),
      pageID = '11',
      hash = null;
  var dialog = function() {
    var pane = deepClone({}, Pane);
    // pane.curMenu = parseInt(getUrlParam('menu')||0)
    var api = deepClone({}, API);
    var model = deepClone({}, Model);

    //外部url参数控制内部 栏目加载
    var outPage = getUrlParam('page')
    switch (outPage) {
      case '0':
        pane.focusType = 'menu';
        pane.curMenu = 0
        break;
      case '1':
        pane.focusType = 'menu';
        pane.curMenu = 1
        break;
      case '2':
        pane.focusType = 'menu';
        pane.curMenu = 2
        break;
      default:
    }

    hash = getHash()//记录hash值到模块变量
    if (hash) {
      pane.focusType = typeof hash.focusType !== 'undefined' ? hash.focusType : pane.focusType
      pane.curMenu = typeof hash.curMenu !== 'undefined' ? hash.curMenu : pane.curMenu
      pane.curIndex = typeof hash.curIndex !== 'undefined' ? hash.curIndex : pane.curIndex

    }
    pane.api = api;
    pane.model = model;
    pane.init();
  }
  var Pane = {
    curIndex: 0,
    curMenu: 0,
    focusType: 'menu',
    menuPos: [
      {l: -41,t: 75},
      {l: -41,t: 261},
      {l: -41,t: 433}
    ],
    folderPos:[
      {l: 202,t: 102},
      {l: 709,t: 102},
      {l: 202,t: 412},
      {l: 402,t: 412},
      {l: 602,t: 412},
      {l: 802,t: 412},
      {l: 1002,t: 412}
    ],
    init: function() {
      if (location.search) {
        savePortal();
      }
      // this.loadData(this.curMenu);
      report.setKey('pageID', pageID)
      this.setMenu(this.curMenu)
      // if (this.focusType == 'folder') {
      //   this.setFocus(this.curIndex)
      // }
      this.bindEvents();
    },
    bindEvents: function() {
      var self = this;
      addEvent({
        up: function() {
          if (self.focusType == 'menu') {
            self.setMenu(self.curMenu - 1)
          } else {
            if (self.curIndex > 1) {
              self.setFocus(Math.floor(self.curIndex / 4))
            }
          }
          return false;
        },
        down: function() {
          if (self.focusType == 'menu') {
            self.setMenu(self.curMenu + 1)
          } else {
            if (self.curIndex > 1) {
              self.gotoLv2();
            } else {
              self.setFocus((self.curIndex + 1) * 2)//0->2 1->4
            }
          }
          return false;
        },
        left: function() {
          if (self.focusType == 'folder' && (self.curIndex == 0 || self.curIndex == 2)) {
            report.setKey('serviceEntrance', '0')
            self.focusType = 'menu'
            self.setMenu(self.curMenu)
          } else if (self.focusType == 'folder') {
            self.setFocus(self.curIndex - 1)
          }
          return false;
        },
        right: function() {
          if (self.focusType == 'menu') {
            report.setKey('serviceEntrance', '0')
            self.focusType = 'folder'
            // self.setFocus(Math.floor(self.curMenu / 2) * 2)
            self.setFocus(0)
          } else if (self.curIndex !== 6 && self.curIndex !== 1) {
            self.setFocus(self.curIndex + 1)
          } else {
            self.gotoLv2();
          }
          return false;
        },
        enter: function() {
          report.setKey('serviceEntrance', '1')
          report.send();
          if (self.focusType == 'folder') {
            if (self.curMenu == 0) {
              self.goto3Detail();
            } else {
              self.gotoDetail()
            }
          } else {
            self.gotoLv2()
          }
          return false;
        },
        back: function() {
          report.setKey('serviceEntrance', '-1')
          report.send();
          document.getElementById('ad').style.display = '';
          setTimeout(function() {
            //应hong.su和shengting.luo的要求退出的时候增加一条埋点发送
            report.setKey('columnName', '红星影院退出应用')
            report.send();
            exitApp();
          }, 5 * 1000)
          return false;
        }
      })
    },
    gotoLv2: function() {
      var self = this
      var appBackParam = null;
      var curHash = hash||{}
      curHash.focusType = self.focusType
      curHash.curMenu = self.curMenu
      curHash.curIndex = self.curIndex
      setHash(curHash)
      var url = './second.html'
      if (AuditTreeVersion) {
        url += (url.indexOf('?') !== -1 ? '&': '?') + 'tree_version=' + AuditTreeVersion
      }
      url += location.hash
      location.href = url
    },
    gotoDetail: function() {
      var item = this.model.data[this.curIndex],
          parent = document.querySelectorAll('.menu')[this.curMenu],
          self = this,
          appBackParam = null;
      var curHash = hash || {}
      curHash.focusType = self.focusType
      curHash.curIndex = self.curIndex
      curHash.curMenu = self.curMenu
      setHash(curHash)
      if (item) {
        var url = 'asset.html?prev=index1&pid=' + item.pid + '&paid=' + item.paid
        if (typeof CyberCloud !== 'undefined') {//瘦终端
          appBackParam = getUrlParam('AppBackParam')
          if (appBackParam) {
            url += '&AppBackParam=' + appBackParam;
          }
        } else {// android & iPanel
          appBackParam = getUrlParam('backUrl')
          if (appBackParam) {
            url += '&backUrl=' + appBackParam;
          }
        }
        if (AuditTreeVersion) {
          url += (url.indexOf('?') !== -1 ? '&': '?') + 'tree_version=' + AuditTreeVersion
        }
        url += location.hash
        location.href = url;
      }
    },
    goto3Detail: function() {
      var item = this.model.data[this.curIndex];
      //2019-05-07根据金磊的要求，现在写死假数据
      if (item) {
        var vspUrl = vsphost + "/vsp_outlet/catalog/reverse/json?id=10048905&paids=" + item.paid + "&caid=1370495919&key=ahof3hgaobpgn7";
        getJson(vspUrl, function(resp) {
          var vspId = resp.result.list[0].id;
          console.log('vspId:' + vspId);
          if(vspId != "undefined") {
            if (navigator.userAgent.lastIndexOf('iPanel') > -1) {//iPanel
              console.log('goto ipanel');
              location.href = yuanxianhost + "/jiaying_dsyx_ghitv/details.html?entry=20&dataId=" + vspId;
            } else { //歌华适配层
              try {
                if (CyberCloud) {// 瘦终端
                  console.log('goto thinClientLink');
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
              } catch (e) {
                console.log('androidLink:' + (yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId));
                location.href = yuanxianhost + "/dsyx_newBox/details.html?entry=20&dataId=" + vspId;
              } finally {

              }
            }
          }
        })
      }
    },
    setFocus: function(index) {
    var focus = document.getElementById('focus')
      focus.style.left = this[this.focusType + 'Pos'][index].l + 'px'
      focus.style.top = this[this.focusType + 'Pos'][index].t + 'px'
      focus.classList.remove('b')
      focus.classList.remove('f')
      if (this.focusType == 'folder') {
        focus.classList.add(index < 2 ? 'b' : 'f')
      } else {
        // focus.classList.remove(index < 2 ? 'b' : 'f')
      }
      // focus.classList[this.focusType == 'folder'?'add':'remove'](index < 2 ? 'b' : 'f')
      focus.style.display = 'block'
      if (this.focusType == 'folder') {
        if (index !== this.curIndex) {
          document.querySelectorAll('.text')[this.curIndex].innerHTML = getStrByLen(this.model.data[this.curIndex].text, 16)
          if (index >1) {
            document.querySelectorAll('.text')[index].innerHTML = useMarquee(this.model.data[index].text, 16)
          }
        }
        if (index !== this.curIndex) {
          report.setKey('serviceEntrance', '0')
        }
        this.curIndex = index
        //埋点
        report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[this.curMenu] + '/' + this.model.data[this.curIndex].text)
        report.setKey('columnID', pageID + this.curMenu + this.curIndex)
      } else {
        //埋点
        report.setKey('columnName', treeRoot.replace(paas_host + '/aquapaas/rest/navigation/trees', '') + menuRoot[this.curMenu])
        report.setKey('columnID', pageID + this.curMenu)
      }
      report.send();
    },
    setMenu: function(idx) {
      var self = this,
          index = idx,
          list = document.querySelectorAll('.menu'),
          focus = list[index];
      if (!focus) {
        index = self.curMenu
        focus = list[index]
      }
      setTimeout(function() {
        self.setMenuActive(focus);
        self.loadData(index)
      }, 300)
      if (index != this.curMenu) {
        report.setKey('serviceEntrance', '0')
      }
      self.curMenu = index;
      // return self.setFocus(index);
    },
    setMenuActive: function(focus) {
      var menu = document.querySelector('.menu.active')
      if (menu) {
        menu.classList.remove('active')
      }
      focus.classList.add('active')
    },
    removeFocus: function() {
      var menu = document.querySelector('.menu.focus'),
          list = document.querySelector('.folder.focus')
      if (menu) {
        menu.classList.remove('focus')
      }
      if (list) {
        list.classList.remove('focus')
      }
    },
    loadData: function(idx) {
      var self = this;
      self.api.list(menuRoot[idx], function(resp) {
        var data = resp.children;
        data.sort(function(a, b) {
          return parseInt(a.index) - parseInt(b.index)
        })
        self.api.getPosterBoard(data, function(resp) {
          self.model.data = self.model.list(resp);
          self.loadPage(self.model.data);
          if (self.focusType == 'menu') {
            self.setFocus(idx);
          } else {
            self.setFocus(self.curIndex)
          }
        })
      })
    },
    loadPage: function(set) {
      this.emptyPage();
      var list = document.querySelectorAll('.folder');
      var text = document.querySelectorAll('.text')
      for (var i = 0; i < set.length; i++) {
        var item = set[i];
        (function(el, url){
          var image = new Image();
          image.style.width = '100%';
          image.style.height = '100%'
          image.onload = function() {
            el.appendChild(this)
          }
          image.src = url
        })(list[i], item.bg)
        if (this.curMenu !== 0) {
          list[i].classList.add('free')
          list[i].innerHTML += '<div class="mask"></div>'
        }
        if (i > 1) {
          text[i].innerHTML = getStrByLen(item.text, 20)
        }
      }
      //埋点
      // report.setKey('pageNum', this.curPage)
      report.setKey('serviceNum', set.length)
    },
    emptyPage: function() {
      var list = document.querySelectorAll('.folder'),
          text = document.querySelectorAll('.small.text')
      for (var i = 0; i < list.length; i++) {
        // list[i].style.backgroundImage = '';
        list[i].innerHTML = ''
        list[i].classList.remove('free')
      }
      for (var i = 0; i < text.length; i++) {
        text[i].innerHTML = ''
      }
    }
  };
  var API = {
    list: function(type, callback) {
      var url = treeRoot + type + '/推荐',
          urlParam = [];
      urlParam.push('children=1')
      urlParam.push('enable=all')
      urlParam.push('app_key=' + app_key)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      if (AuditTreeVersion) {//如果是审核版本的话，传入树的版本号
        urlParam.push('tree_version=' + AuditTreeVersion)
      }
      url += '?' + urlParam.join('&')
      getJson(url, callback)
    },
    getPosterBoard: function(data, callback) {
      var ids = data.map(function(item) {
        return [item.metadata_public.ProviderId,item.metadata_public.ProviderAssetId].join('_')
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
              if (target.metadata_public.ProviderId == asset.provider_id && target.metadata_public.ProviderAssetId == asset.provider_asset_id) {
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
    list: function(data) {
      var ret = [];
      var index = 0
      while (index < 7) {
          var item = data[index]
          // if (item.metadata_public.entryType == '1' && item.name !== '推荐') {
          if (item) {
            // var pid_paid = item.metadata['视频'];
            // var pid = pid_paid && pid_paid.split('+').length == 2  ? pid_paid.split('+')[0]: ''
            // var paid = pid_paid && pid_paid.split('+').length == 2 ? pid_paid.split('+')[1]: ''
            var pid = item.metadata_public.ProviderId
            var paid = item.metadata_public.ProviderAssetId
          ret.push({
            text: item.name,
              bg: item.metadata['节目海报']||item.bg,
              pid: pid,
              paid: paid
          })
        }
        // }
        index++
      }
      return ret;
    }
  }
  return {
    init: function() {
      try {
        debug(showLog);
        console.log(location.href);
        var app = new dialog();
      } catch (e) {
        console.log('*******frame error:' + e.message);
      } finally {

      }
    }
  }
}))
