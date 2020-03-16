var Chorus = {};

var ChorInfo = new UiCat();
ChorInfo.collector.pageID = '12';
ChorInfo.show = function () {
  var _this = this;
  this.columnNode = new ColumnNode(Youai.columnNode, '简介', '0');
  this.collector.columnID = this.columnNode.getNodeId();
  this.collector.columnName = this.columnNode.getNodePath();
  this.collector.serviceEntrance = '0';
  clearTimeout(_this.slideShow);
  Youai.setSector('chor_info', function () {
    _this.setView(function () {
      _this.collector.collect();
    });
  });
};
ChorInfo.setView = function (callback) {
  var _this = this;
  this.getData(function (data) {
    var $txt = $$('.chor_info_container_left')[0];
    if ($txt != null) {
      $txt.innerHTML = (data.metadata && data.metadata['文字简介']) || '';
    }
    var image = data.metadata && data.metadata['图片'] || "";
    var imageArray = image.split(',');
    _this.imageCacheArray = imageArray.forEach(function (item) {
      API.addImageCache(item);
    });
    _this.setSlideShow(imageArray);
    callback && callback();
  });
};
ChorInfo.getData = function (callback) {
  API.getFromKey('简介', callback);
};
ChorInfo.setSlideShow = function (array, i) {
  var _this = this;
  var index = i || 0;
  if (index > array.length - 1) {
    index = 0;
  }
  var $imageContainer = $$('.chor_info_container_right')[0];
  var $image = $_('img');
  $image.src = array[index];
  if ($imageContainer) {
    $imageContainer.innerHTML = "";
    $imageContainer.appendChild($image);
    _this.slideShow = setTimeout(function () {
      _this.setSlideShow(array, index + 1);
    }, 5000)
  }
};
ChorInfo.onFocusIn = function () {
  var _this = this;
  clearTimeout(_this.slideShow);
};
ChorInfo.onFocusOut = function () {
  var _this = this;
  clearTimeout(_this.slideShow);
};

var ChorReg = new UiCat();
ChorReg.collector.pageID = '12';
ChorReg.show = function () {
  var _this = this;
  this.columnNode = new ColumnNode(Youai.columnNode, '报名', '3');
  this.collector.columnID = this.columnNode.getNodeId();
  this.collector.columnName = this.columnNode.getNodePath();
  this.collector.serviceEntrance = '0';
  Youai.setSector('chor_reg', function () {
    _this.setView(function () {
      _this.collector.collect();
    });
  });
};
ChorReg.setView = function (callback) {
  var _this = this;
  this.getData(function (data) {
    var container = $$('.chor_reg_container')[0];
    var $image = $_('img');
    var url = data.metadata && data.metadata['图片'] || "";
    $image.src = url;
    API.addImageCache(url);
    $image.onload = function () {
      if (container) {
        container.innerHTML = "";
        container.appendChild($image);
      }
    };
    callback && callback();
  });
};
ChorReg.getData = function (callback) {
  API.getFromKey('报名', callback);
};

var ChMusic = new UiCat();
ChMusic.collector.pageID = '12';
ChMusic.show = function () {
  var _this = this;
  this.columnNode = new ColumnNode(Youai.columnNode, '歌谱', '4');
  this.collector.columnID = this.columnNode.getNodeId();
  this.collector.columnName = this.columnNode.getNodePath();
  this.collector.serviceEntrance = '0';
  _this.dataView = null;
  _this.grid = null;
  _this.gridData = null;
  _this.title = null;
  Youai.setSector('chor_music', function () {
    _this.setGridView(function () {
      _this.collector.collect();
    });
  });
};
ChMusic.setGridView = function (callback, flag) {
  var _this = this;
  _this.title = null;
  this.getPageTitleData(function (data) {
    data = data[0] || {};
    var title = data.title || "";
    _this.title = title;
    var $title = $$('.music_title')[0];
    $title.innerHTML = title;
    _this.titleColumnNode = new ColumnNode(_this.columnNode, title, _this.dataView.currPage);
    _this.getPageMusicData( title ,function(musicData){
      _this.gridData = musicData || [];
      var num = _this.gridData.length;
      _this.collector.pageNum = _this.dataView.currPage;
      _this.collector.serviceNum = num;
      _this.grid = new GridNav_vertical({
        cols: 6,
        num: num
      });
      var grid = _this.grid;
      var $f = $_f();
      for (var i = 0; i < grid.rowNum; i += 1) {
        var $row = $_('div');
        $row.className = 'grid_row';
        for (var j = 0; j < grid.colNum; j += 1) {
          var index = i * grid.colNum + j;
          if (index < num) {
            var item = _this.gridData[index];
            var $el = $_('div');
            $el.className = 'grid_item';
            var $txt = $_('div');
            $txt.className = 'grid_item_txt';
            var name = item.title || "";
            $txt.innerHTML = checkToMarquee(name || '');
            $el.appendChild($txt);
            $row.appendChild($el);
          } else {
            break;
          }
        }
        $f.appendChild($row);
      }
      var $grid = $$('.music_grid')[0];
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
    });
  }, flag);
};
ChMusic.getPageTitleData = function (callback, flag) {
  var _this = this;
  if (this.dataView == null) {
    API.get(this.navPath, function (data) {
      var stars = data.children;
      _this.dataView = new PagedView(stars, 1);
      _this.dataView.getData(callback, flag);
    });
  } else {
    this.dataView.getData(callback, flag);
  }
};
ChMusic.getPageMusicData = function (name, callback) {
  var _this = this;
  var result = null;
  var url = this.navPath + '/' + name;
  API.get(url , function (data) {
    var result = data.children;
    callback && callback( result )
  });
};
ChMusic.changeGridFocus = function () {
  var grid = this.grid;
  clearMarquee();
  if (grid != null) {
    var row = grid.focus.row;
    var $row = $$('.grid_row')[row];
    if ($row != null) {
      var col = grid.focus.col;
      var $el = $row.children[col];
      if ($el != null) {
        var $epl = $$('.txt_marquee_placer', $el)[0];
        if ($epl != null) {
          if ($epl.offsetWidth > $el.clientWidth) {
            $epl.parentNode.insertBefore(wrapToMarquee($epl.innerText), $epl);
          }
        }
        var $sf = $$('.music_grid_focus')[0];
        if ($sf != null) {
          var rect = $el.getBoundingClientRect();
          if (rect.left > 0 && rect.top > 0) {
            $sf.style.left = (rect.left - 90) + 'px';
            $sf.style.top = (rect.top - 140) + 'px';
          }
          var index = row * grid.colNum + col;
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
ChMusic.up = function () {
  if (this.grid != null && this.grid.up()) {
    this.changeGridFocus();
    return true;
  } else {
    return false;
  }
}
ChMusic.down = function () {
  if (this.grid != null && this.grid.down()) {
    this.changeGridFocus();
  }
}
ChMusic.left = function () {
  if (this.grid != null && this.grid.left()) {
    this.changeGridFocus();
  }
};
ChMusic.right = function () {
  if (this.grid != null && this.grid.right()) {
    this.changeGridFocus();
  }
}
ChMusic.onFocusIn = function () {
  this.changeGridFocus();
  var $f = $$('.music_grid_focus')[0];
  if ($f != null) {
    $f.style.display = 'block';
  }
};
ChMusic.onFocusOut = function () {
  var $f = $$('.music_grid_focus')[0];
  if ($f != null) {
    $f.style.display = 'none';
  }
  clearMarquee();
};
ChMusic.enterPressed = function () {
  var focus = this.grid != null ? this.grid.focus : null;
  if (focus != null) {
    var data = this.gridData || [];
    var index = focus.row * 6 + focus.col;
    var item = data[index];
    var pics = item.metadata && item.metadata['歌谱图片'] || "";
    if(pics === ''){
      pics = [];
    }else{
      pics = pics.split(',');
    }
    var musicTitle = item.title || '';
    this.collector.collect();
    ChMusicDetail.show(pics, this.title, musicTitle);
  }
};
ChMusic.pageDown = function () {
  var _this = this;
  this.setGridView(function () {
    _this.changeGridFocus();
  }, 'next');
};
ChMusic.pageUp = function () {
  var _this = this;
  this.setGridView(function () {
    _this.changeGridFocus();
  }, 'prev');
};
ChMusic.backToView = function(){
  var _this = this;
  _this.collector.serviceEntrance = '-1';
  Youai.showSector(0, function () {
    setFocus(_this);
  });
}

var ChMusicDetail = new UiCat();
ChMusicDetail.collector.pageID = '122';
ChMusicDetail.up = function () {
  return true;
};
ChMusicDetail.back = function () {
  ChMusic.backToView();
  return true;
};
ChMusicDetail.left = function () {
  if (this.caro != null && this.caro.minus()) {
    this.changeFocus();
  }
  return true;
};
ChMusicDetail.right = function () {
  if (this.caro != null && this.caro.plus()) {
    this.changeFocus();
  }
  return true;
};
ChMusicDetail.changeFocus = function () {
  var index = this.caro.focus.index;
  var src1 = this.caroData[index] && this.caroData[index]['url'] || "";
  var name = this.caroData[index] && this.caroData[index]['name'] || "";
  var src2 = this.caroData[index + 1] && this.caroData[index + 1]['url'] || "";
  if (src1 != null) {
  }
  var $el_1 = $$('.grp_det_caro_picpos_1')[0];
  var $el_2 = $$('.grp_det_caro_picpos_2')[0];
  if ($el_1 != null) {
    if(src1){
      $el_1.innerHTML = '<img src="' + src1 + '" />';
    }else{
      $el_1.innerHTML = '';
    }
  }
  if ($el_2 != null) {
    if(src2){
      $el_2.innerHTML = '<img src="' + src2 + '" />';
    }else{
      $el_2.innerHTML = '';
    }
  }
};
ChMusicDetail.show = function (data, title, musicTitle) {
  var _this = this;
  Youai.setSector('chor_music_detail', function () {
    _this.caroData = _this.getMusicAllUrl(data, title, musicTitle);
    _this.setView();
    setFocus(_this);
  }, 1, true);
};
ChMusicDetail.setView = function () {
  var _this = this;
  var data = _this.caroData;
  var num = data.length;
  _this.caro = new CaroNav({
    num: num,
    step: 2,
    loop: false
  });
  var index = 0;
  _this.caro.focus.index = index;

  var src1 = data[index] && data[index]['url'] || '';
  var src2 = data[index + 1] && data[index + 1]['url'] || '';
  var $el_1 = $$('.grp_det_caro_picpos_1')[0];
  var $el_2 = $$('.grp_det_caro_picpos_2')[0];
  if ($el_1 != null) {
    if(src1){
      $el_1.innerHTML = '<img src="' + src1 + '" />';
    }else{
      $el_1.innerHTML = '';
    }
  }
  if ($el_2 != null) {
    if(src2){
      $el_2.innerHTML = '<img src="' + src2 + '" />';
    }else{
      $el_2.innerHTML = '';
    }
  }

  var node = ChMusic.gridColumnNode;
  this.collector.columnID = node.getNodeId();
  this.collector.columnName = node.getNodePath();
  this.collector.pageNum = 0;
  this.collector.serviceNum = 0;
  this.collector.serviceEntrance = '1';
  this.collector.collect();
};
ChMusicDetail.getMusicAllUrl = function (data, title, musicTitle) {
  var _this = this;
  var result = [];
  var i = 0;
  var length = data.length;
  for(i = 0; i < length; i++){
    var item = data[i];
    result.push({
      url: GetMusicPicsUrl + title + '/' + musicTitle + '/' + item,
      name: item
    })
  }
  return result;
};
