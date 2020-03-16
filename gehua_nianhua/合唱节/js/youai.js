function AppRepoint() {

}

AppRepoint.prototype = {
  init: function () {

  },

  keys: ['P', 'C', 'CN', 'PN', 'SN', 'SE', 'PM', 'CE', 'PE'],

  pageID: '',
  columnID: '',
  columnName: '',
  pageNum: 0,
  serviceNum: 0,
  serviceEntrance: '0',
  PaymentMethod: 0,
  Codeerror: '0',
  Payerror: '0',

  getValues: function () {
    var vals = [];
    vals.push(this.pageID);
    vals.push(this.columnID);
    vals.push(this.columnName);
    vals.push(this.pageNum);
    vals.push(this.serviceNum);
    vals.push(this.serviceEntrance);
    vals.push(this.PaymentMethod);
    vals.push(this.Codeerror);
    vals.push(this.Payerror);
    return vals;
  },

  collect: function () {
    log([this.pageID, this.columnID, this.columnName, this.pageNum, this.serviceNum, this.serviceEntrance, this.PaymentMethod, this.Codeerror, this.Payerror]);
    if (typeof reportData == 'function') {
      reportData({
        pageID: this.pageID,
        columnID: this.columnID,
        columnName: this.columnName,
        pageNum: this.pageNum,
        serviceNum: this.serviceNum,
        serviceEntrance: this.serviceEntrance,
        PaymentMethod: this.PaymentMethod,
        Codeerror: this.Codeerror,
        Payerror: this.Payerror,
      });
    } else {
      log('typeof reportData is not function: ' + (typeof reportData));
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

var Youai = {
  init: function () {
    ChorInfo.navPath = this.navPath + '/简介';
    UiCatStar.navPath = this.navPath + '/演出实况';
    UiCatGroup.navPath = this.navPath + '/艺术团';
    ChMusic.navPath = this.navPath + '/歌谱';
    this.columnNode = new ColumnNode(RootNode, '合唱节', '2');
    var page = App.store.getValue('page');
    if(page != null && page != '') {
      var focusMemory = Hash.get();
    } else {
      page = getURLParameter('page');
      App.store.setValue('focusMemory','{}');
    }
    if(page != ''){
      page = Number(page);
      if(page >= 0 && page <= 3){
        this.focus.col = page;
      }
    }
    setFocus(this);
    this.changeFocus(focusMemory);
  },
  focus: {
    col: 1,
    lmt: {
      col: 3,
    }
  },
  onKeyEvent: function (e) {
    var code = e.which || e.keyCode;
    switch (code) {
      case keyValue.up:
      case keyValue.UP:
        return false;
        break;
      case keyValue.down:
      case keyValue.DOWN:
        this.navToSub();
        return false;
        break;
      case keyValue.left:
      case keyValue.LEFT:
        if (this.focus.col > 0) {
          this.focus.col -= 1;
          this.changeFocus();
        }
        return false;
        break;
      case keyValue.right:
      case keyValue.RIGHT:
        if (this.focus.col < this.focus.lmt.col) {
          this.focus.col += 1;
          this.changeFocus();
        }
        return false;
        break;
      case keyValue.back:
      case keyValue.BACK:
      case keyValue.Back:
      case keyValue.quit:
      case keyValue.QUIT:
      case keyValue.Quit:
        App.back();
        return false;
    }
  },
  changeFocus: function (focusMemory) {
    var $pre = $$('.entry_focus')[0];
    if ($pre != null) {
      $pre.classList.remove('entry_focus');
    }
    var $el = $$('.entry')[this.focus.col];
    if ($el != null) {
      $el.classList.add('entry_focus');
    }
    switch (this.focus.col) {
      case 0:
        ChorInfo.show();
        App.store.setValue('page', '0')
        break;
      case 1:
        UiCatStar.show(focusMemory);
        App.store.setValue('page', '1')
        break;
      case 2:
        if (focusMemory) {
          if (focusMemory.length == 1) {
            UiCatGroup.show(focusMemory);
          } else if (focusMemory.length == 2) {
            UiGroupDetail.show(focusMemory);
          } else if (focusMemory.length == 3) {
            UiGroupDetCaro.show(null, null, focusMemory);
          } else {

          }
        } else {
          UiCatGroup.show();
        }
        App.store.setValue('page', '2')
        break;
      case 3:
        ChMusic.show();
        App.store.setValue('page', '3')
        break;
      default:
        break;
    }
  },
  navToSub: function () {
    switch (this.focus.col) {
      case 0:
        break;
      case 1:
        if (UiCatStar.gridData && ( UiCatStar.gridData.length > 0)) {
          setFocus(UiCatStar);
        }
        break;
      case 2:
        var elIndex = this.findShowingSector();
        if (elIndex == 0) {
          setFocus(UiCatGroup);
        } else if (elIndex == 1) {
          setFocus(UiGroupDetail);
        }
        break;
      case 3:
        setFocus(ChMusic);
        break;
      default:
        break;
    }
  },
  findShowingSector: function () {
    var index = 0;
    var $secs = $$('.entry_sector');
    for (var i = 0, len = $secs.length; i < len; i += 1) {
      if ($secs[i].style.display != 'none') {
        index = i;
        break;
      }
    }
    return index;
  },
  setSector: function (id, callback, index, preserve) {
    index = index != null ? index : 0;
    var $secs = $$('.entry_sector');
    if (!preserve) {
      for (var i = 0, len = $secs.length; i < len; i += 1) {
        if (i != index) {
          $secs[i].style.display = 'none';
        }
      }
    }
    var template = App.getTemplate(id);
    var $sec = $$('.entry_sector')[index];
    if ($sec != null) {
      $sec.innerHTML = '';
      $sec.innerHTML = template;
      $sec.style.display = 'block';
    }
    if (typeof callback == 'function') {
      callback();
    }
  },
  showSector: function (index, callback) {
    index = index != null ? index : 0;
    var $secs = $$('.entry_sector');
    for (var i = 0, len = $secs.length; i < len; i += 1) {
      if (i != index) {
        $secs[i].style.display = 'none';
      }
    }
    $secs[index].style.display = 'block';
    if (typeof callback == 'function') {
      callback();
    }
  },
  onFocusIn: function () {
    var $s = $$('.entry_selected')[0];
    if ($s != null) {
      $s.classList.remove('entry_selected');
      $s.classList.add('entry_focus');
    }
  },
  onFocusOut: function () {
    var $f = $$('.entry_focus')[0];
    if ($f != null) {
      $f.classList.remove('entry_focus');
      $f.classList.add('entry_selected');
    }
  }
};

function PagedView(data, pageSize) {
  if (data != null && typeof data.length != 'undefined') {
    this.data = data;
  } else {
    this.data = [];
  }
  this.pageSize = pageSize > 0 ? pageSize : 1;
  this.init();
}

PagedView.prototype = {
  init: function () {
    this.currPage = 0;
    this.length = this.data.length;
    var pageNum = Math.ceil(this.length / this.pageSize);
    this.pageLmt = pageNum - 1;
    this.pageNum = pageNum;
  },

  previous: function () {
    if (this.currPage > 0) {
      this.currPage -= 1;
      return true;
    } else {
      return false;
    }
  },

  next: function () {
    if (this.currPage < this.pageLmt) {
      this.currPage += 1;
      return true;
    } else {
      return false;
    }
  },

  getData: function (callback, flag) {
    if (flag == 'next') {
      if (!this.next()) {
        return false;
      }
    } else if (flag == 'prev') {
      if (!this.previous()) {
        return false;
      }
    } else if (flag >= 0 && flag < this.pageNum) {
      this.currPage = flag;
    }
    var start = this.currPage * this.pageSize;
    var end = start + this.pageSize;
    start = Math.min(start, (this.length ? this.length - 1 : 0));
    end = Math.min(end, this.length);
    var arr = [];
    for (var i = start; i < end; i += 1) {
      arr.push(this.data[i]);
    }
    if (typeof callback == 'function') {
      callback(arr);
    }
  }
};

function UiCat() {
  this.collector = new AppRepoint();
}

UiCat.prototype = {
  onKeyEvent: function (e) {
    var code = e.which || e.keyCode;
    switch (code) {
      case keyValue.left:
      case keyValue.LEFT:
        this.collector.serviceEntrance = '0';
        this.left();
        return false;
        break;
      case keyValue.right:
      case keyValue.RIGHT:
        this.collector.serviceEntrance = '0';
        this.right();
        return false;
        break;
      case keyValue.up:
      case keyValue.UP:
        this.collector.serviceEntrance = '0';
        if (!this.up()) {
          setFocus(Youai);
        }
        return false;
        break;
      case keyValue.down:
      case keyValue.DOWN:
        this.collector.serviceEntrance = '0';
        this.down();
        return false;
        break;
      case keyValue.back:
      case keyValue.BACK:
      case keyValue.Back:
      case keyValue.quit:
      case keyValue.QUIT:
      case keyValue.Quit:
        this.collector.serviceEntrance = '-1';
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
        this.collector.serviceEntrance = '2';
        this.pageUp();
        return false;
        break;
      case keyValue.pagedown:
      case keyValue.pageDown:
      case keyValue.PageDown:
      case keyValue.PAGEDOWN:
        this.collector.serviceEntrance = '3';
        this.pageDown();
        return false;
        break;
      case keyValue.enter:
      case keyValue.ENTER:
        this.collector.serviceEntrance = '1';
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

var UiCatStar = new UiCat();
UiCatStar.collector.pageID = '12';
UiCatStar.focusPosition = {
  grid: [
    {left: '39px', top: '138px'}, {left: '421px', top: '138px'}, {left: '813px', top: '138px'},
    {left: '39px', top: '366px'}, {left: '421px', top: '366px'}, {left: '813px', top: '366px'}
  ]
};
UiCatStar.show = function (focusMemory) {
  var _this = this;
  this.columnNode = new ColumnNode(Youai.columnNode, '演出实况', '1');
  this.collector.columnID = this.columnNode.getNodeId();
  this.collector.columnName = this.columnNode.getNodePath();
  this.collector.serviceEntrance = '0';
  this.gridData = [];
  Youai.setSector('uicast', function () {
    _this.dataView = null;
    if (focusMemory) {
      _this.setGridView(function () {
        setFocus(UiCatStar);
      }, focusMemory.page, focusMemory.focus);
    } else {
      _this.setGridView(function () {
        _this.collector.collect();
      });
    }
  });
};
UiCatStar.setGridView = function (callback, flag, focus) {
  var _this = this;
  _this.getPageData(function (data) {
    _this.gridData = data;
    var num = data.length;
    _this.collector.pageNum = _this.dataView.currPage;
    _this.collector.serviceNum = num;
    _this.grid = new GridNav({
      cols: 3,
      num: num
    });
    if (focus) {
      _this.grid.focus.col = focus.col;
      _this.grid.focus.row = focus.row;
    }
    var grid = _this.grid;
    var $f = $_f();
    for (var i = 0; i < grid.rowNum; i += 1) {
      var $row = $_('div');
      $row.className = 'grid_row';
      for (var j = 0; j < grid.colNum; j += 1) {
        var index = i * grid.colNum + j;
        if (index < num) {
          var item = data[index];
          var $el = $_('div');
          $el.className = 'grid_el';
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
          $row.appendChild($el);
        } else {
          break;
        }
      }
      $f.appendChild($row);
    }
    var $grid = $$('.star_grid')[0];
    if ($grid != null) {
      $grid.innerHTML = '';
      $grid.appendChild($f);
    }
    var $pi = $$('.page_indicator')[0];
    if ($pi != null) {
      $pi.innerHTML = "第 " + (_this.dataView.currPage + 1) + ' 页' + '/' + "共 " + _this.dataView.pageNum + ' 页';
    }
    if (typeof callback == 'function') {
      callback();
    }
  }, flag);
};
UiCatStar.getPageData = function (callback, flag) {
  var _this = this;
  if (this.dataView == null) {
    API.get(this.navPath, function (data) {
      var items = data.children;
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
            _this.dataView = new PagedView(assets, 6);
            _this.dataView.getData(callback, flag);
          }
        }, ['app']);
      }
    });
  } else {
    this.dataView.getData(callback, flag);
  }
};
UiCatStar.changeGridFocus = function () {
  clearMarquee();
  var grid = this.grid;
  if (grid != null) {
    var row = grid.focus.row;
    var $row = $$('.grid_row')[row];
    if ($row != null) {
      var col = grid.focus.col;
      var $el = $row.children[col];
      if ($el != null) {

        var $sf = $$('.star_grid_focus')[0];
        if ($sf != null) {
          var index = row * grid.colNum + col;

          var pos = this.focusPosition.grid[index];
          $sf.style.left = pos.left;
          $sf.style.top = pos.top;
          $sf.style.display = 'block';

          var $epl = $$('.txt_marquee_placer', $el)[0];
          if ($epl != null) {
            if ($epl.offsetWidth > $el.clientWidth) {
              $epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
            }
          }

          var item = this.gridData[index];
          if (item != null) {
            var node = new ColumnNode(this.columnNode, item.name, index);
            this.gridColumnNode = node;
            this.collector.pageNum = this.dataView.currPage;
            this.collector.serviceNum = this.gridData.length;
            this.collector.columnID = node.getNodeId();
            this.collector.columnName = node.getNodePath();
            this.collector.collect();
          }
        }
      }
    }
  }
};
UiCatStar.up = function () {
  if (this.grid != null && this.grid.up()) {
    this.changeGridFocus();
    return true;
  } else {
    return false;
  }
}
UiCatStar.down = function () {
  if (this.grid != null && this.grid.down()) {
    this.changeGridFocus();
  }
}
UiCatStar.left = function () {
  if (this.grid != null && this.grid.left()) {
    this.changeGridFocus();
  }
};
UiCatStar.right = function () {
  if (this.grid != null && this.grid.right()) {
    this.changeGridFocus();
  }
}
UiCatStar.onFocusIn = function () {
  this.changeGridFocus();
  var $f = $$('.star_grid_focus')[0];
  if ($f != null) {
    $f.style.display = 'block';
  }
};
UiCatStar.onFocusOut = function () {
  var $f = $$('.star_grid_focus')[0];
  if ($f != null) {
    $f.style.display = 'none';
  }
  clearMarquee();
};
UiCatStar.enterPressed = function () {
  // App.goPlayer();
  var focus = this.grid != null ? this.grid.focus : null;
  if (focus != null) {
    var index = focus.row * 3 + focus.col;
    var item = this.gridData[index];
    // var vod = item.metadata['视频'];
    // if(vod != null && vod.indexOf('+') > -1){
    if(item != null){
      // var ids = vod.split('+');
      // var pid = ids[0];
      // var paid = ids[1];
      var pid = item.provider_id;
      var paid = item.provider_asset_id;
      this.collector.collect();
      var hash = {
        page: this.dataView.currPage,
        focus: {
          row: focus.row,
          col: focus.col
        }
      }
      Hash.set(hash);
      App.goPlayer({
        provider_id: pid,
        provider_asset_id: paid
      });
    }
  }
};
UiCatStar.pageDown = function () {
  var _this = this;
  this.setGridView(function () {
    _this.changeGridFocus();
  }, 'next');
};
UiCatStar.pageUp = function () {
  var _this = this;
  this.setGridView(function () {
    _this.changeGridFocus();
  }, 'prev');
};

var UiCatGroup = new UiCat();
UiCatGroup.collector.pageID = '12';
UiCatGroup.focusPosition = {
  grid: [
    {left: '203px', top: '164px'}, {left: '527px', top: '164px'}, {left: '849px', top: '164px'},
    {left: '203px', top: '379px'}, {left: '527px', top: '379px'}, {left: '849px', top: '379px'}
  ]
}
UiCatGroup.show = function (focusMemory) {
  var _this = this;
  _this.dataView = null;
  _this.inputNum = '';
  _this.grid = null;
  _this.gridData = null;
  _this.navGrid = null;
  _this.isSearch = false;
  this.columnNode = new ColumnNode(Youai.columnNode, '艺术团', '2');
  this.collector.columnID = this.columnNode.getNodeId();
  this.collector.columnName = this.columnNode.getNodePath();
  this.collector.serviceEntrance = '0';
  Youai.setSector('uigroup', function () {
    var inputNum = '';
    _this.inputNum = inputNum;
    _this.setNavView();
    if (focusMemory) {
      var tab = focusMemory[0];
      _this.inputNum = tab.inputNum;
      _this.isSearch = tab.isSearch || false;
      _this.setSearchStr(_this.inputNum);
      _this.setGridView(function () {
        setFocus(_this);
      }, tab.page, tab.focus);
    } else {
      _this.setSearchStr(_this.inputNum);
      _this.setGridView(function () {
        _this.collector.collect();
      });
    }
  });
};
UiCatGroup.setNavView = function () {
  var _this = this;
  this.getNavData(function () {
    _this.navGrid = new GridNav({
      col: 1,
      num: 2
    });
    _this.changeNavFocus();
  });
};
UiCatGroup.getNavData = function (callback) {
  if (typeof callback == 'function') {
    callback();
  }
};
UiCatGroup.changeNavFocus = function () {
  var grid = this.navGrid;
  if (grid != null) {
    var $ia = $$('.input_active')[0];
    if ($ia != null) {
      $ia.classList.remove('input_active');
    }
    var row = grid.focus.row;
    if (row == 0) {
      var $nf = $$('.grp_nav_focus')[0];
      if ($nf != null) {
        $nf.classList.remove('search_btn');
        $nf.classList.add('search_in');
        $nf.style.top = '';
      }
      var $si = $$('.grp_search_in')[0];
      $si.classList.add('input_active');
      this.setSearchStr(this.inputNum, true);
    } else if (row == 1) {
      this.setSearchStr(this.inputNum);
      var $nf = $$('.grp_nav_focus')[0];
      if ($nf != null) {
        $nf.classList.remove('search_in');
        $nf.classList.add('search_btn');
        $nf.style.top = '';
      }
    }
  }
};
UiCatGroup.changeGridFocus = function () {
  clearMarquee();
  var $grid = $$('.grp_grid')[0];
  var grid = this.grid;
  if (grid != null) {
    var row = grid.focus.row;
    var $row = $$('.grid_row', $grid)[row];
    if ($row != null) {
      var col = grid.focus.col;
      var $el = $row.children[col];
      if ($el != null) {

        var $sf = $$('.grp_grid_focus')[0];
        if ($sf != null) {
          var index = row * grid.colNum + col;

          var pos = this.focusPosition.grid[index];
          $sf.style.left = pos.left;
          $sf.style.top = pos.top;
          $sf.style.display = 'block';

          var $epl = $$('.txt_marquee_placer', $el)[0];
          if ($epl != null) {
            if ($epl.offsetWidth > $el.clientWidth) {
              $epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
            }
          }

          var item = this.gridData[index];
          if (item != null) {
            var parentColumnNode;
            if(this.isSearch){
              parentColumnNode = this.selectedNavNode;
            }else{
              parentColumnNode = this.columnNode;
            }
            var node = new ColumnNode(parentColumnNode, item.name, index);
            this.gridColumnNode = node;
            this.collector.pageNum = this.dataView.currPage;
            this.collector.serviceNum = this.gridData.length;
            this.collector.columnID = node.getNodeId();
            this.collector.columnName = node.getNodePath();
            this.collector.collect();
          }
        }
      }
    }
  }
};
UiCatGroup.setGridView = function (callback, flag, focus) {
  var _this = this;
  _this.getPageData(function (data) {
    _this.gridData = data;
    var num = data.length;
    _this.collector.pageNum = _this.dataView.currPage;
    _this.collector.serviceNum = num;
    _this.grid = new GridNav({
      cols: 3,
      num: num
    });
    if (focus) {
      _this.grid.focus.col = focus.col;
      _this.grid.focus.row = focus.row;
    }
    var grid = _this.grid;
    var $f = $_f();
    for (var i = 0; i < grid.rowNum; i += 1) {
      var $row = $_('div');
      $row.className = 'grid_row';
      for (var j = 0; j < grid.colNum; j += 1) {
        var index = i * grid.colNum + j;
        if (index < num) {
          var item = data[index];
          var $el = $_('div');
          $el.className = 'grid_el';
          var $poster = $_('div');
          $poster.className = 'grid_el_poster';
          var $img = $_('img');
          $img.className = 'poster';
          $img.src = item.metadata && item.metadata['预览图'] || '';
          $poster.appendChild($img);
          var $txt = $_('div');
          $txt.className = 'grid_el_txt';
          var name = item.name || "";
          $txt.innerHTML = checkToMarquee(name);
          $el.appendChild($poster);
          $el.appendChild($txt);
          $row.appendChild($el);
        } else {
          break;
        }
      }
      $f.appendChild($row);
    }
    var $grid = $$('.grp_grid')[0];
    if ($grid != null) {
      $grid.innerHTML = '';
      $grid.appendChild($f);
    }
    var $pi = $$('.page_indicator')[0];
    if ($pi != null) {
      $pi.innerHTML = "第 " + (_this.dataView.currPage + 1) + ' 页' + '/' + "共 " + _this.dataView.pageNum + ' 页';
    }
    if (typeof callback == 'function') {
      callback();
    }
  }, flag);
};
UiCatGroup.getPageData = function (callback, flag) {
  var _this = this;
  if (this.dataView == null) {
    if(_this.isSearch){
      var url = my.paas.host + '/aquapaas/rest/navigation/trees/nodes/年华/合唱节?key=metadata.艺术团编号&value=' + this.inputNum + '&op=rlk&enable=all';
      my.paas.request({
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        done: function(data){
          log('Search ok.');
          try{
            var items = JSON.parse(data);
            _this.dataView = new PagedView(items, 6);
            _this.dataView.getData(callback, flag);
          }catch(e){
            log(e.message);
          }
        },
        fail: function(xhr){
          var items = [];
          _this.dataView = new PagedView(items, 6);
          _this.dataView.getData(callback, flag);
          log('Search fail: ' + this.inputNum + ', ' + xhr.status)
        }
      }, ['app']);
    }else{
      API.get(this.navPath, function (data) {
        var stars = data.children;
        _this.dataView = new PagedView(stars, 6);
        _this.dataView.getData(callback, flag);
      });
    }
  } else {
    this.dataView.getData(callback, flag);
  }
};
UiCatGroup.removeGridFocus = function () {
  var $of = $$('.grp_grid_focus')[0];
  if ($of != null) {
    $of.style.display = 'none';
  }
};
UiCatGroup.addNavFocus = function () {
  var $f = $$('.grp_nav_focus')[0];
  if ($f != null) {
    $f.style.display = 'block';
    if ($f.classList.contains('search_in')) {
      var $si = $$('.grp_search_in')[0];
      $si.classList.add('input_active');
      this.setSearchStr(this.inputNum, true);
    }
  }
};
UiCatGroup.removeNavFocus = function () {
  var $f = $$('.grp_nav_focus')[0];
  if ($f != null) {
    $f.style.display = 'none';
  }
  var $ia = $$('.input_active')[0];
  if ($ia != null) {
    $ia.classList.remove('input_active');
  }
  this.setSearchStr(this.inputNum);
};
UiCatGroup.left = function () {
  if (this.isNav) {
  } else {
    if (this.grid != null && this.grid.left()) {
      this.changeGridFocus();
      return true;
    } else {
      this.isNav = true;
      this.removeGridFocus();
      this.addNavFocus();
      clearMarquee();
    }
  }
  return true;
};
UiCatGroup.right = function () {
  if (this.isNav && (this.grid != null) && (this.grid.num > 0)) {
    this.isNav = false;
    this.removeNavFocus();
    this.changeGridFocus();
  } else {
    if (this.grid != null && this.grid.right()) {
      this.changeGridFocus();
      return true;
    }
  }
  return true;
};
UiCatGroup.up = function () {
  if (this.isNav) {
    if (this.navGrid != null && this.navGrid.up()) {
      this.changeNavFocus();
      return true;
    } else {
      return false;
    }
  } else {
    if (this.grid != null && this.grid.up()) {
      this.changeGridFocus();
      return true;
    } else {
      return false;
    }
  }
};
UiCatGroup.down = function () {
  if (this.isNav) {
    if (this.navGrid != null && this.navGrid.down()) {
      this.changeNavFocus();
      return true;
    }
  } else {
    if (this.grid != null && this.grid.down()) {
      this.changeGridFocus();
      return true;
    }
  }
  return true;
};
UiCatGroup.pageUp = function () {
  if (!this.isNav) {
    var _this = this;
    this.setGridView(function () {
      _this.changeGridFocus();
    }, 'prev');
  }
};
UiCatGroup.pageDown = function () {
  if (!this.isNav) {
    var _this = this;
    this.setGridView(function () {
      _this.changeGridFocus();
    }, 'next');
  }
};
UiCatGroup.numInput = function (num) {
  if (this.isNav) {
    if (this.navGrid != null && this.navGrid.focus.row == 0) {
      if (this.inputNum == null) {
        this.inputNum = '';
      }
      if (this.inputNum.length >= 5) {
        return false;
      }
      this.inputNum += String(num);
      this.setSearchStr(this.inputNum, true);
    }
  }
  return true;
};
UiCatGroup.back = function () {
  if (this.isNav) {
    if (this.navGrid != null && this.navGrid.focus.row == 0) {
      this.inputNum = this.inputNum.slice(0, -1);
      this.setSearchStr(this.inputNum, true);
      return true;
    }
  }
  return false;
};
UiCatGroup.setSearchStr = function (str, isActive) {
  var $in = $$('.grp_search_in')[0];
  if (!isActive) {
    if (str == '') {
      $in.innerHTML = '|艺术团编号';
    } else {
      $in.innerHTML = str;
    }
  } else {
    $in.innerHTML = str + '|';
  }
};
UiCatGroup.onFocusIn = function () {
  if (this.gridData && (this.gridData.length > 0)) {
    this.isNav = false;
    this.changeGridFocus();
  } else {
    this.isNav = true;
    this.addNavFocus();
  }
};
UiCatGroup.onFocusOut = function () {
  this.removeGridFocus();
  this.removeNavFocus();
  clearMarquee();
};
UiCatGroup.backToView = function (focusMemory) {
  var _this = this;
  _this.collector.serviceEntrance = '-1';
  Youai.showSector(0, function () {
    if (focusMemory) {
      _this.show(focusMemory);
    } else {
      setFocus(_this);
    }
  });
};
UiCatGroup.searchGroup = function () {
  var _this = this;
  _this.dataView = null;
  if(this.inputNum === ''){
    _this.isSearch = false;
  }else if(this.inputNum != null && this.inputNum.length > 0){
    _this.isSearch = true;
    this.selectedNavNode = new ColumnNode(this.columnNode, '搜索', '0');
    this.collector.columnID = this.selectedNavNode.getNodeId();
    this.collector.columnName = this.selectedNavNode.getNodePath();
    this.collector.serviceEntrance = '1';
  }else{
  }
  this.setGridView(function(){
    _this.isSearch && _this.collector.collect();
    setFocus(_this);
  });
};
UiCatGroup.enterPressed = function () {
  if (this.isNav) {
    if (this.navGrid != null && this.navGrid.focus.row == 1) {
      this.searchGroup();
    }
  } else {
    if (this.grid != null) {
      var focus = this.grid.focus;
      var index = focus.row * 3 + focus.col;
      var item = this.gridData[index];
      var name = item.name;
      UiGroupDetail.navPath = this.navPath + '/' + name;
      UiGroupDetail.show();
    }
  }
  return true;
};
UiCatGroup.restoreFromFocusMemory = function (focusMemory) {
  var name = decodeURIComponent(focusMemory.focus.name);
  var focus = focusMemory.focus;
  var index = focus.row * 3 + focus.col;
  this.columnNode = new ColumnNode(Youai.columnNode, '艺术团', '2');
  var isSearch = focusMemory.isSearch;
  if(isSearch){
    this.selectedNavNode = new ColumnNode(this.columnNode, '搜索', '0');
    var node = new ColumnNode(this.selectedNavNode, name, index);
    this.gridColumnNode = node;
  }else{
    var node = new ColumnNode(this.columnNode, name, index);
    this.gridColumnNode = node;
  }
};

var UiGroupDetail = new UiCat();
UiGroupDetail.collector.pageID = '120';
UiGroupDetail.focusPosition = {
  grid: [
    {left: '54px'}, {left: '340px'}, {left: '623px'}, {left: '905px'}
  ]
}
UiGroupDetail.show = function (focusMemory, preserve, hideFocus) {
  var _this = this;
  this.selectedNav = null;
  _this.navData = [];
  _this.dataView = null;
  _this.gridData = [];
  _this.grid = null;
  _this.focusMemory = null;
  _this.collector.serviceEntrance = '1';
  Youai.setSector('uigroup_detail', function () {
    _this.focus = {
      row: 0,
      lmt: {
        row: 1
      }
    };
    if (focusMemory) {
      _this.focus.row = 1;
      _this.focusMemory = focusMemory;
      focusMemoryRestoreFromTopToBottom(focusMemory);
      var tab1 = focusMemory[1];
      _this.navPath = decodeURIComponent(tab1.navPath);
      var page = tab1.page;
      var focus = tab1.focus;
      _this.workflow(function () {
        if (hideFocus) {
        } else {
          setFocus(_this);
        }
      }, page, focus);
    } else {
      !hideFocus && setFocus(_this);
      _this.workflow(function () {
      });
    }
  }, 1, preserve);
};
UiGroupDetail.workflow = function (callback, page, focus) {
  var _this = this;
  _this.setDetailView(function () {
    _this.setNavView(_this.navData, function () {
      _this.setGridView(function () {
        callback && callback();
      }, page, focus);
    });
  });
};
UiGroupDetail.setDetailView = function (callback) {
  var _this = this;
  this.getDetailData(function (data) {
    var $poster = $$('.grp_detail_poster')[0];
    var imageUri = data.metadata && data.metadata['内容图'] || '';
    if (imageUri) {
      $poster.innerHTML = '<img src="' + imageUri + '" />';
    }
    $$('.grp_name_txt')[0].innerHTML = data.name || '';
    $$('.grp_info_txt')[0].innerHTML = data.metadata && data.metadata['文字简介'] || '';
    /*
     var navArray = data.children || [];
     navArray = navArray.map(function(item){
     return {
     name: item.name
     }
     });
     _this.navArray = navArray;
     */
    //这里直接写死为三个
    //_this.navData = ['风采掠影', '作品展示', '团队荣誉'];
    _this.navData = ['风采掠影'];
    _this.navNodes = [
      new ColumnNode(UiCatGroup.gridColumnNode, '风采掠影', '1'),
    ];
    callback && callback();
  });
};
UiGroupDetail.setNavView = function (names, callback) {
  this.navGrid = new GridNav({
    cols: names.length || 0,
    num: names.length || 0
  });
  var frag = $_f();
  for (var i = 0, len = names.length; i < len; i += 1) {
    var $nav = $_('div');
    $nav.className = 'grp_detail_nav';
    $nav.innerHTML = names[i];
    frag.appendChild($nav);
  }
  var $navs = $$('.grp_detail_navs')[0];
  if ($navs != null) {
    $navs.innerHTML = '';
    $navs.appendChild(frag);
    $navs.children[0].classList.add('grp_det_nav_sel');
    this.selectedNav = this.navData[0];
    this.selectedNavNode = this.navNodes[0];
    callback && callback();
  }
};
UiGroupDetail.setGridView = function (callback, flag, focus) {
  var _this = this;
  this.getPageData(function (data) {
    _this.gridData = data;
    var num = data.length;
    _this.grid = new GridNav({
      cols: 4,
      num: num
    });
    if (focus) {
      _this.grid.focus.col = focus.col;
    }
    var grid = _this.grid;
    var $f = $_f();
    for (var i = 0; i < grid.rowNum; i += 1) {
      var $row = $_('div');
      $row.className = 'grid_row';
      for (var j = 0; j < grid.colNum; j += 1) {
        var index = i * grid.colNum + j;
        if (index < num) {
          var item = data[index];
          var $el = $_('div');
          $el.className = 'grid_el';
          var $poster = $_('div');
          $poster.className = 'grid_el_poster';
          var $img = $_('img');
          $img.className = 'poster';
          //$img.src = item.metadata && item.metadata['图片'] || '';
          $img.src = item.poster || '';
          $poster.appendChild($img);
          var $txt = $_('div');
          $txt.className = 'grid_el_txt';
          var name = item.name || "";
          $txt.innerHTML = checkToMarquee(name);
          $el.appendChild($poster);
          $el.appendChild($txt);
          $row.appendChild($el);
        } else {
          break;
        }
      }
      $f.appendChild($row);
    }
    var $grid = $$('.grp_detail_grid')[0];
    if ($grid != null) {
      $grid.innerHTML = '';
      $grid.appendChild($f);
    }
    var uigroup_detail = $$('.uigroup_detail')[0];
    var $pi = $$('.page_indicator', uigroup_detail)[0];
    if ($pi != null) {
      $pi.innerHTML = "第 " + (_this.dataView.currPage + 1) + ' 页' + '/' + "共 " + _this.dataView.pageNum + ' 页';
    }
    if (typeof callback == 'function') {
      callback();
    }
  }, flag);
};
UiGroupDetail.getPageData = function (callback, flag) {
  var _this = this;
  if (this.dataView == null) {
    var url = this.navPath + '/' + this.selectedNav;
    API.get(url, function (data) {
      var items = data.children;
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
            _this.dataView = new PagedView(assets, 4);
            _this.dataView.getData(callback, flag);
          }
        }, ['app']);
      }
    });
  } else {
    this.dataView.getData(callback, flag);
  }
};
UiGroupDetail.pageDown = function () {
  var _this = this;
  if (this.focus.row == 1) {
    this.setGridView(function () {
      _this.changeFocus();
    }, 'next');
  }
};
UiGroupDetail.pageUp = function () {
  var _this = this;
  if (this.focus.row == 1) {
    this.setGridView(function () {
      _this.changeFocus();
    }, 'prev');
  }
};
UiGroupDetail.getDetailData = function (callback) {
  var _this = this;
  var data = {};
  my.paas.request({
    type: 'GET',
    url: my.paas.host + _this.navPath + '?children=1',
    async: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    done: function(raw){
      log('Get navigation ok: ' + _this.navPath);
      try{
        data = JSON.parse(raw);
        _this.detailData = data;
        callback(data);
      }catch(e){
        log(e.message);
      }
    },
    fail: function(xhr){
      log('Get navigation fail: ' + _this.navPath + ' , ' + xhr.status);
      callback({});
    }
  }, ['app']);
};
UiGroupDetail.up = function () {
  if (this.focus.row > 0) {
    this.focus.row -= 1;
    this.changeFocus();
    return true;
  } else {
    return false;
  }
};
UiGroupDetail.down = function () {
  switch (this.focus.row) {
    case 0:
      if (!this.grid || this.grid && (this.grid.num == 0)) {
      } else {
        this.focus.row += 1;
        this.changeFocus();
      }
      break;
    case 1:
      break;
  }
  return true;
};
UiGroupDetail.left = function () {
  switch (this.focus.row) {
    case 0:
      break;
    case 1:
      if (this.grid != null && this.grid.left()) {
        this.changeFocus();
      }
      break;
  }
  return true;
};
UiGroupDetail.right = function () {
  switch (this.focus.row) {
    case 0:
      break;
    case 1:
      if (this.grid != null && this.grid.right()) {
        this.changeFocus();
      }
      break;
  }
  return true;
};
UiGroupDetail.back = function () {
  UiCatGroup.backToView(this.focusMemory);
  return true;
};
UiGroupDetail.changeFocus = function () {
  clearMarquee();
  var $f = $$('.grp_detail_focus')[0];
  if ($f != null) {
    $f.classList.remove('row1');
    $f.classList.remove('row2');
    $f.classList.remove('row3');

    switch (this.focus.row) {
      case 0:
        $f.style.left = "";
        $f.classList.add('row1');
        var node = new ColumnNode(UiCatGroup.gridColumnNode, '团队简介', '0');
        this.gridColumnNode = node;
        this.collector.columnID = node.getNodeId();
        this.collector.columnName = node.getNodePath();
        this.collector.pageNum = 0;
        this.collector.serviceNum = 0;
        this.collector.collect();
        break;
      case 1:
        $f.classList.add('row3');
        var grid = this.grid;
        if (grid != null) {
          var col = grid.focus.col;
          var $grid = $$('.grp_detail_grid')[0];
          if ($grid != null) {
            var $el = $grid.children[0].children[col];
          }
          if ($el != null) {

            var pos = this.focusPosition.grid[col];
            $f.style.left = pos.left;

            var $epl = $$('.txt_marquee_placer', $el)[0];
            if ($epl != null) {
              if ($epl.offsetWidth > $el.clientWidth) {
                $epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
              }
            }
            var item = this.gridData[col];
            if (item != null) {
              var node = new ColumnNode(this.selectedNavNode, item.name, col);
              this.gridColumnNode = node;
              this.collector.pageNum = this.dataView.currPage;
              this.collector.serviceNum = this.gridData.length;
              this.collector.columnID = node.getNodeId();
              this.collector.columnName = node.getNodePath();
              this.collector.collect();
            }
          }
        }
        break;
    }
  }
};
UiGroupDetail.onFocusIn = function () {
  this.changeFocus();
  var $f = $$('.grp_detail_focus')[0];
  if ($f != null) {
    $f.style.display = 'block';
  }
};
UiGroupDetail.onFocusOut = function () {
  var $f = $$('.grp_detail_focus')[0];
  if ($f != null) {
    $f.style.display = 'none';
    clearMarquee();
  }
};
UiGroupDetail.enterPressed = function () {
  switch (this.focus.row) {
    case 0:
      UiGroupDetInfo.show(this.detailData);
      break;
    case 1:
      var grid = this.grid;
      var navGrid = this.navGrid;
      if (grid != null) {
        var navGrid_col = navGrid.focus.col;
        var grid_col = grid.focus.col;
        var select = this.gridData[grid_col];
        if(select != null){
          var pid = select.provider_id;
          var paid = select.provider_asset_id;
          this.collector.collect();
          var hash = [];
          if (UiCatGroup.dataView && UiCatGroup.grid) {
            var row = UiCatGroup.grid.focus.row;
            var col = UiCatGroup.grid.focus.col;
            hash.push({
              page: UiCatGroup.dataView.currPage,
              focus: {
                row: row,
                col: col,
                name: encodeURIComponent(UiCatGroup.gridData[row * 3 + col].name || "")
              },
              isSearch: UiCatGroup.isSearch,
              inputNum: UiCatGroup.inputNum,
            });
          } else {
            hash.push(this.focusMemory[0]);
          }
          hash.push({
            navPath: encodeURIComponent(this.navPath),
            //selectedNav: encodeURIComponent(this.selectedNav),
            page: this.dataView.currPage,
            focus: {
              col: grid_col
            }
          });
          Hash.set(hash);
          App.goPlayer({
            provider_id: pid,
            provider_asset_id: paid
          });
        }
      }
      break;
  }
  return true;
};
UiGroupDetail.backToView = function () {
  var _this = this;
  _this.collector.serviceEntrance = '-1';
  Youai.showSector(1, function () {
    setFocus(_this);
  });
};
UiGroupDetail.restoreFromFocusMemory = function (focusMemory) {
  var index = focusMemory.focus.col;
  var name = decodeURIComponent(focusMemory.focus.name);
  this.selectedNavNode = new ColumnNode(UiCatGroup.gridColumnNode, '风采掠影', '1');
  this.gridColumnNode = new ColumnNode(this.selectedNavNode, name, index);
};

var UiGroupDetInfo = new UiCat();
UiGroupDetInfo.collector.pageID = '1200';
UiGroupDetInfo.up = function () {
  return true;
};
UiGroupDetInfo.back = function () {
  UiGroupDetail.backToView();
  return true;
};
UiGroupDetInfo.enterPressed = function () {
  UiGroupDetail.backToView();
  return true;
};
UiGroupDetInfo.show = function (data) {
  var _this = this;
  Youai.setSector('uigroup_det_info', function () {
    _this.setView(data);
    setFocus(_this);
  }, 2, true);
};
UiGroupDetInfo.setView = function (data) {
  var $name = $$('.grp_det_info_name')[0];
  if ($name != null) {
    $name.innerHTML = data.name || '';
  }
  var $txt = $$('.grp_det_info_txt')[0];
  if ($txt != null) {
    $txt.innerHTML = data.metadata && data.metadata['文字简介'] || '';
  }
  var node = UiGroupDetail.gridColumnNode;
  this.collector.columnID = node.getNodeId();
  this.collector.columnName = node.getNodePath();
  this.collector.pageNum = 0;
  this.collector.serviceNum = 0;
  this.collector.serviceEntrance = '1';
  this.collector.collect();
};

var UiGroupDetCaro = new UiCat();
UiGroupDetCaro.collector.pageID = '1201';
UiGroupDetCaro.up = function () {
  return true;
};
UiGroupDetCaro.back = function () {
  UiGroupDetail.backToView();
  return true;
};
UiGroupDetCaro.left = function () {
  if (this.caro != null && this.caro.minus()) {
    this.changeFocus();
  }
  return true;
};
UiGroupDetCaro.right = function () {
  if (this.caro != null && this.caro.plus()) {
    this.changeFocus();
  }
  return true;
};
UiGroupDetCaro.changeFocus = function () {
  var index = this.caro.focus.index;
  var item = this.caroData[index];
  if (item != null) {
    var node = new ColumnNode(UiGroupDetail.selectedNavNode, item.name, index);
    this.collector.pageNum = index;
    this.collector.serviceNum = this.caroData.length;
    this.collector.columnID = node.getNodeId();
    this.collector.columnName = node.getNodePath();
    this.collector.collect();
  }
  var $el = $$('.grp_det_caro_picpos')[0];
  if (item.metadata['类型'] != '视频') {
    var el = item.metadata['图片'] || '';
    if ($el != null) {
      $el.innerHTML = '<img src="' + el + '" />';
    }
  } else {
    $el.innerHTML = '';
    var vod = item.metadata['视频'];
    if (vod != null && vod.indexOf('+') > -1) {
      var ids = vod.split('+');
      this.collector.collect();
      var hash = [];
      if (UiCatGroup.dataView && UiCatGroup.grid) {
        var row = UiCatGroup.grid.focus.row;
        var col = UiCatGroup.grid.focus.col;
        hash.push({
          page: UiCatGroup.dataView.currPage,
          focus: {
            row: row,
            col: col,
            name: encodeURIComponent(UiCatGroup.gridData[row * 3 + col].name || "")
          },
          isSearch: UiCatGroup.isSearch,
          inputNum: UiCatGroup.inputNum,
        });
      } else {
        hash.push(UiGroupDetail.focusMemory[0]);
      }
      if (UiGroupDetail.dataView && UiGroupDetail.grid) {
        var col = UiGroupDetail.grid.focus.col;
        hash.push({
          navPath: encodeURIComponent(UiGroupDetail.navPath),
          page: UiGroupDetail.dataView.currPage,
          focus: {
            col: col,
            name: encodeURIComponent(UiGroupDetail.gridData[col].name || "")
          }
        });
      } else {
        hash.push(UiGroupDetail.focusMemory[1]);
      }
      hash.push({
        focus: index
      });
      Hash.set(hash);
      App.goPlayer({
        provider_id: ids[0],
        provider_asset_id: ids[1]
      });
    }



  }
};
UiGroupDetCaro.show = function (data, select, focusMemory) {
  var _this = this;
  _this.focusMemory = null;
  Youai.setSector('uigroup_det_caro', function () {
    if (focusMemory) {
      _this.focusMemory = focusMemory;
      focusMemoryRestoreFromTopToBottom(focusMemory);
      var tab1 = focusMemory[1];
      var tab2 = focusMemory[2];
      var url = decodeURIComponent(tab1.navPath) + '/' + '风采掠影';
      _this.getData(url, function (data) {
        _this.caroData = data;
        select = tab2.focus;
        _this.setView(data, data[select]);
        setFocus(_this);
        UiGroupDetail.show(focusMemory, true, true);
      });
    } else {
      _this.caroData = data;
      _this.setView(data, select);
      setFocus(_this);
    }
  }, 2, true);
};
UiGroupDetCaro.setView = function (data, select) {
  var _this = this;
  var num = data.length;
  _this.caro = new CaroNav({
    num: num,
    loop: false
  });
  var index = 0;
  for (var i = 0, len = data.length; i < len; i += 1) {
    if (data[i].id == select.id) {
      index = i;
      break;
    }
  }
  _this.caro.focus.index = index;
  var metadata = select.metadata;
  var type = metadata['类型'] || "";
  if (type == '图片') {
    var el = metadata && metadata['图片'] || '';
    var $el = $$('.grp_det_caro_picpos')[0];
    if ($el != null) {
      $el.innerHTML = '<img src="' + el + '" />';
    }
  } else if (type == '视频') {
    var $el = $$('.grp_det_caro_picpos')[0];
    if ($el != null) {
      $el.innerHTML = '';
    }
  } else {

  }

  var node = new ColumnNode(UiGroupDetail.selectedNavNode, select.name, index);
  this.collector.columnID = node.getNodeId();
  this.collector.columnName = node.getNodePath();
  this.collector.pageNum = index;
  this.collector.serviceNum = num;
  this.collector.serviceEntrance = '1';
  this.collector.collect();
};
UiGroupDetCaro.getData = function (url, callback) {
  var _this = this;
  API.get(url, function (data) {
    var items = data.children || [];
    callback && callback(items);
  });
};

function GridNav(obj) {
  this.colNum = obj.cols != null ? obj.cols : 1;
  this.num = obj.num != null ? obj.num : 0;
  this.init();
}

GridNav.prototype = {
  init: function () {
    this.focus = {
      col: 0,
      row: 0,
      lmt: {
        row: 0,
        col: 0,
      }
    };
    this.rowNum = Math.ceil(this.num / this.colNum);
    this.focus.lmt.row = this.rowNum - 1;
    var lastRowNum = this.num - (this.rowNum - 1) * this.colNum;
    this.focus.lmt.col = lastRowNum - 1;
  },

  up: function () {
    if (this.focus.row > 0) {
      this.focus.row -= 1;
      return true;
    }
    return false;
  },

  down: function () {
    if (this.focus.row < this.focus.lmt.row) {
      this.focus.row += 1;
      if (this.focus.row == this.focus.lmt.row) {
        if (this.focus.col > this.focus.lmt.col) {
          this.focus.col = this.focus.lmt.col;
        }
      }
      return true;
    }
    return false;
  },

  left: function () {
    if (this.focus.col > 0) {
      this.focus.col -= 1;
      return true;
    }
    return false;
  },

  right: function () {
    if (this.focus.row < this.focus.lmt.row) {
      if (this.focus.col < this.colNum - 1) {
        this.focus.col += 1;
        return true;
      }
    } else if (this.focus.row == this.focus.lmt.row) {
      if (this.focus.col < this.focus.lmt.col) {
        this.focus.col += 1;
        return true;
      }
    }
    return false;
  }
};

function GridNav_vertical(obj) {
  this.colNum = obj.cols != null ? obj.cols : 1;
  this.num = obj.num != null ? obj.num : 0;
  this.init();
}

GridNav_vertical.prototype = {
  init: function () {
    this.focus = {
      col: 0,
      row: 0,
      lmt: {
        row: 0,
        col: 0,
      }
    };
    this.rowNum = Math.ceil(this.num / this.colNum);
    this.focus.lmt.row = this.rowNum - 1;
    var lastRowNum = this.num - (this.rowNum - 1) * this.colNum;
    this.focus.lmt.col = lastRowNum - 1;
  },

  up: function () {
    if (this.focus.col > 0) {
      this.focus.col -= 1;
      return true;
    }
    return false;
  },

  down: function () {
    if (this.focus.row < this.focus.lmt.row) {
      if (this.focus.col < this.colNum - 1) {
        this.focus.col += 1;
        return true;
      }
    } else if (this.focus.row == this.focus.lmt.row) {
      if (this.focus.col < this.focus.lmt.col) {
        this.focus.col += 1;
        return true;
      }
    }
    return false;

  },

  left: function () {
    if (this.focus.row > 0) {
      this.focus.row -= 1;
      return true;
    }
    return false;
  },

  right: function () {
    if (this.focus.row < this.focus.lmt.row) {
      this.focus.row += 1;
      if (this.focus.row == this.focus.lmt.row) {
        if (this.focus.col > this.focus.lmt.col) {
          this.focus.col = this.focus.lmt.col;
        }
      }
      return true;
    }
    return false;
  }
};

function CaroNav(obj) {
  this.num = obj.num != null ? obj.num : 0;
  this.isLoop = !!obj.loop;
  this.step = obj.step != null ? obj.step : 1;
  this.init();
}

CaroNav.prototype = {
  init: function () {
    this.focus = {
      index: 0,
      lmt: 0
    };
    this.focus.lmt = this.num - 1;
  },

  plus: function () {
    if (this.focus.index + this.step <= this.focus.lmt) {
      this.focus.index += this.step;
      return true;
    } else if (this.isLoop) {
      this.focus.index = 0;
      return true;
    } else {
      return false;
    }
  },

  minus: function () {
    if (this.focus.index - this.step >= 0) {
      this.focus.index -= this.step;
      return true;
    } else if (this.isLoop) {
      this.focus.index = this.focus.lmt;
      return true;
    } else {
      return false;
    }
  }
};

function ColumnNode(parentNode, name, bit) {
  this.bit = bit;
  this.name = name;
  this.parent = parentNode;
}

ColumnNode.prototype = {
  getNodeId: function () {
    if (this.nodeId != null) {
      return this.nodeId;
    }
    var id = '';
    if (this.parent != null) {
      id += this.parent.getNodeId();
    }
    id += this.bit;
    this.nodeId = id;
    return id;
  },

  getNodePath: function () {
    if (this.nodePath != null) {
      return this.nodePath;
    }
    var path = '';
    if (this.parent != null) {
      path += this.parent.getNodePath();
    }
    path += '/' + this.name;
    this.nodePath = path;
    return path;
  },
}

var RootNode = new ColumnNode(null, '年华', '1');

function focusMemoryRestoreFromTopToBottom(focusMemory) {
  var array = [UiCatGroup, UiGroupDetail, UiGroupDetCaro];
  var focusMemoryLength = focusMemory.length;
  var i;
  for (i = 0; i < focusMemoryLength; i++) {
    var Model = array[i];
    if (Model.restoreFromFocusMemory && (typeof Model.restoreFromFocusMemory == 'function'))
      Model.restoreFromFocusMemory(focusMemory[i]);
  }
}

function parseAssetPoster(asset, index){
  var poster = '';
  var posters = asset && (typeof asset.posterboard == 'string') && asset.posterboard.split(',') || [];
  index = index != null ? index : posters.length-1;
  poster = posters[index];
  if(poster == null){
    poster = '';
  }
  return poster;
}

function parseBundlePoster(bundle, index){
  var poster = '';
  var posters = bundle && (typeof bundle.packageposterboard == 'string') && bundle.packageposterboard.split(',') || [];
  index = index != null ? index : posters.length-1;
  poster = posters[index];
  if(poster == null){
    poster = '';
  }
  return poster;
}
