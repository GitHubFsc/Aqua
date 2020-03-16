//http://192.168.7.143:8080/zgdkm_zh/topic/10/index.html?topic=quanwangshi%E4%B8%93%E9%A2%983%2F%E6%B5%8B%E8%AF%95%E4%B8%93%E9%A2%98

var topic_url = decodeURIComponent(getURLParameter('topic'));
var back_url = decodeURIComponent(getURLParameter('backUrl'))

var App = {
  init: function(){
    log(navigator.userAgent);
    log(new Date().toString());
    var _this = this;
    var search = location.search;
    this.store = MyStorage.getStorage();
    this.store.setNamespace('xor.kgqws.topic');
    setupPaaS(function(){
      log('paas ready.');

      var focusMemory = Hash.get();
      Topic.init(focusMemory);
    });
  },
  onKeyEvent: function(e){
    var code = e.which || e.keyCode;
    switch(code){
      case keyValue.back:
      case keyValue.BACK:
      case keyValue.Back:
      case keyValue.quit:
      case keyValue.QUIT:
      case keyValue.Quit:
        this.back();
        return false;
        break;
    }
  },
  back: function(){
    Hash.set({
      focus: {
        index: -1,
        col: 0
      }
    });
    try{
      //history.back();
      location.href = back_url;
    }catch(e){
      log(e.message);
    }
  },
  goPlayer: function(vod){
    var DeviceType;
    if (navigator.userAgent.lastIndexOf('iPanel') > -1) {
      DeviceType = 3;
    }else{
      DeviceType = 1;
    }
    switch(DeviceType){
      case 1:
      case 2:
        var playParam = window.PlayParam;
        if(vod != null) {
          if(vod.provider_id != null){
            playParam.ProviderID = vod.provider_id;
          }
          if(vod.provider_asset_id != null){
            playParam.ProviderAssetID = vod.provider_asset_id;
          }
        }

        var backParam = window.AppBackParam;
        var url = location.href;
        log(url);
        backParam.AppParam = {
          Linux: url,
          Android: url,
          ThinClient: url
        };

        this.getVSPRev({
          paid: playParam.ProviderAssetID,
          caid: getSmartCardId(),
        }, function(json){

          try{
            playParam.ExtParam = 'app=' + window.PlayParamExtApp + ';poid=' + json.result.list[0].provider.poid;
            // playParam.ExtParam += ';ad=1;businessType=' + json.result.list[0].extra.extra5;

            log(JSON.stringify(playParam));
            var ret = GHWEBAPI.PlayVedioOnDemand_VSP(playParam, backParam);
            if(ret.ResultCode == 0){
              log('play ok.');
            } else {
              log('play fail: ' + ret.Description);
            }
          }catch(e){
            log(e.message);
          }

        });
        break;
      case 3:
        var player = window.LinuxPlayerUrl;
        var param = window.LinuxPlayParam;
        try{
          var CAID = CA.card.serialNumber;
          var serviceGroupId = Math.floor(VOD.server.nodeGroupId);
        }catch(e){
          log(e.message);
        }
        player += '?caid=' + CAID;
        player += '&key=' + (param.key != null ? param.key : '');
        if(vod != null) {
          if(vod.provider_id != null && vod.provider_asset_id != null){
            player += '&pid=' + vod.provider_id + ';' + vod.provider_asset_id;
            // player += '?' + vod.provider_id + '_' + vod.provider_asset_id;
          }
        } else {
          player += '&pid=' + (param.pid != null ? param.pid : '');
          // player += '?' + (param.pid != null ? param.pid : '');
        }
        player += '&nodeGroup=' + serviceGroupId;
        player += '&ip=' + (param.ip != null ? param.ip : '');
        player += '&back=' + encodeURIComponent(location.href);
        log(player);
        location.href = player;
        break;
      default:
        break;
    }
  },
  getVSPRev: function(param, callback){
    log('reverse query by cardid ' + param.caid + ' on paid ' + param.paid);
    makeRequest({
      type: 'GET',
      url: VSP_Host + '/vsp_outlet/catalog/reverse/json?id=' + VSP_ProgramId
      + '&paids=' + param.paid + '&caid=' + param.caid + '&key=' + VSP_AppKey,
      // + '&extra=extra5',
      async: true,
      headers: {
        'Accept': 'application/json',
        // 'Content-Type': 'application/json', //removed for CORS restrict on Changhong Android.
      },
      done: function(data){
        try{
          var json = JSON.parse(data);
          if(typeof callback == 'function'){
            callback(json);
          }
        }catch(e){
          log(e.message);
        }
      },
      fail: function(xhr){
        log('reverse fail: ' + xhr.status);
      }
    });
  },
  preloadImg: function(){
    var imgs = [];
    for(var i = 0, len = imgs.length; i < len; i+= 1){
      var img = new Image();
      img.onload = function(){
        log('preloaded ' + this.src);
      }
      img.src = imgs[i];
    }
  }
};

var Hash = {
  init: function () {
  },
  set: function (obj) {
    var value = JSON.stringify(obj);
    value = my.base64Encode(value);
    App.store.setValue('focusMemory', value);
  },
  get: function () {
    var result = false;
    var focusMemory = App.store.getValue('focusMemory');
    try{
      var focusMemory = my.base64Decode(focusMemory);
      focusMemory = typeof focusMemory == 'string' && focusMemory != '' ? JSON.parse(focusMemory) : null;
      result = focusMemory;
    }catch(e){
      log(e.message);
    }
    return result;
  }
};

function UiCat() {
  //this.collector = new AppRepoint();
}
UiCat.prototype = {
  onKeyEvent: function (e) {
    var code = e.which || e.keyCode;
    switch (code) {
      case keyValue.left:
      case keyValue.LEFT:
        //this.collector.serviceEntrance = '0';
        this.left();
        return false;
        break;
      case keyValue.right:
      case keyValue.RIGHT:
        //this.collector.serviceEntrance = '0';
        this.right();
        return false;
        break;
      case keyValue.up:
      case keyValue.UP:
        //this.collector.serviceEntrance = '0';
        this.up();
        return false;
        break;
      case keyValue.down:
      case keyValue.DOWN:
        //this.collector.serviceEntrance = '0';
        this.down();
        return false;
        break;
      case keyValue.back:
      case keyValue.BACK:
      case keyValue.Back:
      case keyValue.quit:
      case keyValue.QUIT:
      case keyValue.Quit:
        //this.collector.serviceEntrance = '-1';
        if (this.back()) {

        } else {
          App.back();
        }
        return false;
        break;
      case keyValue.pageup:
      case keyValue.pageUp:
      case keyValue.PageUp:
      case keyValue.PAGEUP:
        //this.collector.serviceEntrance = '2';
        this.pageUp();
        return false;
        break;
      case keyValue.pagedown:
      case keyValue.pageDown:
      case keyValue.PageDown:
      case keyValue.PAGEDOWN:
        //this.collector.serviceEntrance = '3';
        this.pageDown();
        return false;
        break;
      case keyValue.enter:
      case keyValue.ENTER:
        //this.collector.serviceEntrance = '1';
        this.enterPressed();
        return false;
      case keyValue.zero:
      case keyValue.one:
      case keyValue.two:
      case keyValue.three:
      case keyValue.four:
      case keyValue.five:
      case keyValue.six:
      case keyValue.seven:
      case keyValue.eight:
      case keyValue.nine:
        this.numInput(code - 48);
        return false;
        break;
      default:
        break;
    }
  },

  numInput: function (num) {
    return false;
  },

  pageUp: function () {
    return false;
  },

  pageDown: function () {
    return false;
  },

  enterPressed: function () {
    return false;
  },

  back: function () {
    return false;
  },

  down: function () {
    return false;
  },

  left: function () {
    return false;
  },

  right: function () {
    return false;
  },

  up: function () {
    return false;
  }

};

function GridForTopic(obj) {
  this.colNum = obj.cols != null ? obj.cols : 1;
  this.leftColNum = 1;
  this.rightColNum =  1;
  this.num = obj.num != null ? obj.num : 0;
  this.init();
}
GridForTopic.prototype = {
  init: function () {
    this.focus = {
      col: 0,
      index: 0 - this.leftColNum,
      lmt: {
        col: null,
        index_min: null,
        index_max: null,
      }
    };
    if(this.colNum > this.num){
      this.focus.lmt.col = this.num - 1;
      this.focus.lmt.index_min = 0 - this.leftColNum;
      this.focus.lmt.index_max = 0 - this.leftColNum;
    }else{
      this.focus.lmt.col = this.colNum - 1;
      this.focus.lmt.index_min = 0 - this.leftColNum;
      this.focus.lmt.index_max = this.num - this.colNum - 1;
    }
  },
  set: function (index, col) {
    if((index >= this.focus.lmt.index_min)  && (index <= this.focus.lmt.index_max)){
      this.focus.index = index;
    }else{
      this.focus.index = -1;
    }
    if(col <= this.focus.lmt.col){
      this.focus.col = col;
    }else{
      this.focus.col = 0;
    }
  },
  up: function () {
    return false;
  },
  down: function () {
    return false;
  },
  left: function () {
    if (this.focus.col > 0) {
      this.focus.col -= 1;
      return true;
    }else if(this.focus.col == 0){
      if (this.focus.index > this.focus.lmt.index_min) {
        this.focus.index -= 1;
        return true;
      }else{
      }
    }else{
    }
    return false;
  },
  right: function () {
    if (this.focus.col < this.focus.lmt.col) {
      this.focus.col += 1;
      return true;
    }else if(this.focus.col == this.focus.lmt.col){
      if (this.focus.index < this.focus.lmt.index_max) {
        this.focus.index += 1;
        return true;
      }else{
        this.focus.index = 0 - this.leftColNum;
        this.focus.col = 0;
        return true;
      }
    }else{
    }
    return false;
  }
};

var Topic = new UiCat();
Topic.imgs = [];
Topic.focusPosition = {
  grid: [
    {left: -151}, {left: 76}, {left: 305}, {left: 534},
    {left: 761}, {left: 988}, {left: 1215},
  ]
};
Topic.init = function(focusMemory){
  var _this = this;
  _this.dataView = null;
  _this.grid = null;
  _this.gridData = null;
  _this.title = null;
  _this.setGridView(function () {
    setFocus(Topic);
  }, focusMemory || null);

  //setFocus(this);
};
Topic.setMack = function (url) {
  var _this = this;
  var $mask = $$('.mask')[0];
  if(url){
    $mask.innerHTML = '<img src="' + url + '" />';
  }
};
Topic.setGridView = function (callback, focusMemory) {
  var _this = this;
  _this.getData(function(result){
    _this.gridData = result.assets || [];
    _this.setMack(result.background || "");
    var num = _this.gridData.length;
    _this.grid = new GridForTopic({
      cols: 5,//焦点可移动的列数
      num: num
    });
    if(focusMemory){
      _this.grid.set(focusMemory.focus.index, focusMemory.focus.col);
    }
    var grid = _this.grid;
    _this.updateGridView();
    if (typeof callback == 'function') {
      callback();
    }
  });
};
Topic.updateGridView = function(){
  var $f = $_f();
  var $focus = null;
  var _this = this;
  var grid = _this.grid;

  for (var j = 0; j < 7; j += 1) {
    var index = grid.focus.index + j;
    var item = _this.gridData[index];
    var $el = $_('div');
    $el.className = 'grid_el';
    if(item){
      var $poster = $_('div');
      $poster.className = 'grid_el_poster';
      var $img = $_('img');
      $img.className = 'poster';
      //$img.src = item.metadata && item.metadata['预览图'] || '';
      $img.src = item.poster || '';
      $poster.appendChild($img);
      var $txt = $_('div');
      $txt.className = 'grid_el_txt';
      var name = item.name || "";
      $txt.innerHTML = checkToMarquee(name || '');
      $el.appendChild($poster);
      $el.appendChild($txt);
      if(grid.leftColNum + grid.focus.col === j){
        $focus = $el;
      }
    }else{
    }
    $f.appendChild($el);
  }
  var $grid = $$('.grid')[0];
  if ($grid != null) {
    $grid.innerHTML = '';
    $grid.appendChild($f);
  }

  if($focus){
    $focus.classList.add('grid_focus');
    var $epl = $$('.txt_marquee_placer', $focus)[0];
    if ($epl != null) {
      var pos = this.focusPosition.grid[grid.leftColNum + grid.focus.col];
      $focus.style.left = pos.left + "px";
      if ($epl.offsetWidth > $focus.clientWidth) {
        $epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
      }
    }
  }
};
Topic.getData = function (callback) {
  var _this = this;
  var url = "/aquapaas/rest/navigation/trees/" + topic_url;
  API.getData(url, function (data) {
    callback && callback( data )
  });
};
Topic.changeGridFocus = function () {
  var _this = this;
  var grid = this.grid;
  var $pr = $$('.grid_focus')[0];
  if ($pr != null) {
    $pr.classList.remove('grid_focus');
    $pr.style.left = "";
    clearMarquee();
  }
  var $f = $$('.star_grid_focus')[0];
  if (grid != null) {
    var col = grid.focus.col;
    var $grid = $$('.grid')[0];
    if ($grid != null) {
      var $el = $grid.children[grid.leftColNum + col];
    }
    if ($el != null) {

      $el.classList.add('grid_focus');
      var pos = this.focusPosition.grid[grid.leftColNum + col];
      $el.style.left = pos.left + "px";
      $f.style.left = (pos.left - 3) + "px";

      var $epl = $$('.txt_marquee_placer', $el)[0];
      if ($epl != null) {
        if ($epl.offsetWidth > $el.clientWidth) {
          $epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
        }
      }
    }
  }
};
Topic.left = function () {
  var preIndex = this.grid.focus.index;
  var preCol = this.grid.focus.col;
  if (this.grid != null && this.grid.left()) {
    if(this.grid.focus.col !== preCol){
      this.changeGridFocus();
    }
    if(this.grid.focus.index !== preIndex) {
      this.updateGridView();
    }
  }
};
Topic.right = function () {
  var preIndex = this.grid.focus.index;
  var preCol = this.grid.focus.col;
  if (this.grid != null && this.grid.right()) {
    if(this.grid.focus.col !== preCol){
      this.changeGridFocus();
    }
    if(this.grid.focus.index !== preIndex) {
      this.updateGridView();
    }
  }
};
Topic.onFocusIn = function () {
  this.changeGridFocus();
  var $f = $$('.star_grid_focus')[0];
  if ($f != null) {
    $f.style.display = 'block';
  }
};
Topic.onFocusOut = function () {
  var $f = $$('.star_grid_focus')[0];
  if ($f != null) {
    $f.style.display = 'none';
  }
  clearMarquee();
};
Topic.enterPressed = function () {
  var _this = this;
  var index = this.grid.focus.index + this.grid.leftColNum + this.grid.focus.col;
  var item = this.gridData[index];
  if(item != null){
    var pid = item.provider_id;
    var paid = item.provider_asset_id;

    var hash = {
      focus: {
        index: _this.grid.focus.index,
        col: _this.grid.focus.col
      }
    };
    Hash.set(hash);
    App.goPlayer({
      provider_id: pid,
      provider_asset_id: paid
    });
  }
};
Topic.preloadImg = function(url){
  var imgs = this.imgs;
  var find = false;
  for(var i = 0, len = imgs.length; i < len; i+= 1){
    if(imgs[i] == url){
      find = true;
      return;
    }
  }
  imgs.push(url);
  var img = new Image();
  img.onload = function(){
    log('preloaded ' + this.src);
  }
  img.src = imgs[i];
};

var API = {
  getData: function(url, callback){
    /*
    var data = {
      "style": "3",
      "background": "http://api.xor-live.io:80/aqua/rest/cdmi/default/netdisk/zgd/tree/quanwangshi%E4%B8%93%E9%A2%983/%E6%B5%8B%E8%AF%95%E4%B8%93%E9%A2%98/007.jpg",
      "assets": [{
        "name": "咕力儿歌13",
        "provider_id": "ZGD",
        "provider_asset_id": "6514C06BC4E36B0A6E1A58C51497968D",
        "poster": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/paas/vod/zgd/image/651/ZGD_6514C06BC4E36B0A6E1A58C51497968DT00.jpg"
      }, {
        "name": "京剧猫之信念的冒险39",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/paas/vod/zgd/image/2ED/ZGD_2ED92094BDDF51A3A200E142A4FB8762T00.jpg"
      }, {
        "name": "枪火",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/paas/vod/zgd/image/2ED/ZGD_2ED92094BDDF51A3A200E142A4FB8762T00.jpg"
      }, {
        "name": "树大招风",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/paas/vod/zgd/image/2ED/ZGD_2ED92094BDDF51A3A200E142A4FB8762T00.jpg"
      }, {
        "name": "无间道",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "../../test/8.png"
      }, {
        "name": "黑社会",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/paas/vod/zgd/image/2ED/ZGD_2ED92094BDDF51A3A200E142A4FB8762T00.jpg"
      }, {
        "name": "神探",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "../../test/9.png"
      }, {
        "name": "暗花",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/paas/vod/zgd/image/2ED/ZGD_2ED92094BDDF51A3A200E142A4FB8762T00.jpg"
      }, {
        "name": "盲探",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "../../test/10.png"
      }, {
        "name": "黑金",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "http://api.xor-live.io/aqua/rest/cdmi/default/netdisk/zgd/paas/vod/zgd/image/2ED/ZGD_2ED92094BDDF51A3A200E142A4FB8762T00.jpg"
      }, {
        "name": "家有喜事",
        "provider_id": "ZGD",
        "provider_asset_id": "2ED92094BDDF51A3A200E142A4FB8762",
        "poster": "../../test/11.png"
      }]
    };
    callback(data)
    return;
    */

    my.paas.getNavigation(url, function(data){
      var items = data.children;
      var style = data.metadata_public && data.metadata_public.style || "";
      var background = data.metadata_public && data.metadata_public.FILE_background || "";
      var assets = [];
      var assetIds = [];
      for(var i = 0, len = items.length; i < len; i+=1){
        var item = items[i];
        if(item != null && item.node_class == 'asset'){
          var provider_id = item.metadata_public.ProviderId;
          var provider_asset_id = item.metadata_public.ProviderAssetId;
          assets.push({
            name: item.name,
            provider_id: provider_id,
            provider_asset_id: provider_asset_id
          });
          assetIds.push(provider_id + '_' + provider_asset_id);
        }
      }
      if(assets.length > 0){
        var url = my.paas.host + '/aquapaas/rest/search/content_by_id/asset?ids=' + assetIds.join(',');
        my.paas.request({
          type: 'GET',
          url: url,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          async: true,
          done: function(vods){
            vods = JSON.parse(vods);
            for(var j = 0, jLen = assets.length; j < jLen; j+=1){
              var asset = assets[j];
              for(var k = 0, kLen = vods.length; k < kLen; k += 1){
                var vod = vods[k];
                if(asset.provider_id == vod.provider_id && asset.provider_asset_id == vod.provider_asset_id){
                  asset.poster = parseAssetPoster(vod, 0);
                  break;
                }
              }
            }
          },
          always: function(){
            callback && callback({
              style: style,
              background: background,
              assets: assets
            });
          }
        }, ['app']);
      }
    });


  }
};

function init(){
  setTimeout(function(){
    App.init();
  }, 50);
}

function doUninit(){
}

function doSystemEvent(e){
  return SystemEventHandle.onSystemEvent(e);
}

SystemEventHandle = {
  handles: [],
  add: function(obj){
    var index = this.handles.indexOf(obj);
    if(index == -1){
      this.handles.push(obj);
    }
  },
  remove: function(obj){
    var index = this.handles.indexOf(obj);
    if (index > -1) {
      this.handles.splice(index, 1);
    }
  },
  onSystemEvent: function(e){
    var ret = true;
    try{
      for (var i = 0, len = this.handles.length; i < len; i++) {
        var handle = this.handles[i];
        if (handle && (typeof handle.onSystemEvent === 'function')) {
          ret = ret && handle.onSystemEvent(e);
        }
      }
    }catch(err){
      log([err.name, err.message, err.lineNumber, err.fileName].join(', '));
    }
    return ret;
  }
};

var MyFocus = App;
var MyFocusLast = null;
var cloudTimeout = null;
function grabEvent(e){
  var ret;

  if (MyFocus != null && typeof MyFocus.onKeyEvent == 'function') {
    try{
      ret = MyFocus.onKeyEvent(e);
      if(ret != null && !ret) {
        if(typeof e.preventDefault == 'function'){
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    }catch(error){
      log([error.name, error.message, error.lineNumber, error.fileName].join(', '));
    }
  } else {
    MyFocus = App;
  }

  if(window.CyberCloud){
    if(window.cloudTimeout != null){
      clearTimeout(window.cloudTimeout);
    }
    window.cloudTimeout = setTimeout(function(){
      log('try exit cloud.');
      try{
        GHWEBAPI.ExitCloud();
      }catch(e){
        log(e.message);
      }
    }, 3 * 60 * 1000);
  }
  return ret;
}

function setFocus(obj, isSilentOut, isSilentIn){
  if(obj == null){
    return false;
  }
  if(typeof obj.onKeyEvent != 'function'){
    return false;
  }
  MyFocusLast = MyFocus;
  MyFocus = obj;
  if(!isSilentOut && MyFocusLast != null && typeof MyFocusLast.onFocusOut == 'function'){
    MyFocusLast.onFocusOut();
  }
  if(!isSilentIn && MyFocus != null && typeof MyFocus.onFocusIn == 'function'){
    MyFocus.onFocusIn();
  }
  return true;
}

document.onkeydown = grabEvent;
