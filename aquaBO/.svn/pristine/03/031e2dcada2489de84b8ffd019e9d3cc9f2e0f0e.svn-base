if (!window.my) {
  window.my = {};
}
/**
 param
 {
 htmlFile,      //需要加载的HTML文件
 jsFile,        //需要加载的JavaScript文件
 addToDomObject,//HTML文件加载到哪个Dom对象上，默认直接加载到document.body中
 sync           //是否异步操作。true:异步操作 false:同步操作
 }
 */
my.includeHTMLJSFile = function(param) {
  this.htmlFile = param.htmlFile ? param.htmlFile : null;
  this.jsFiles = param.jsFiles ? param.jsFiles : null;
  this.addToDomObject = param.addToDomObject ? param.addToDomObject : document.body;
  this.sync = param.sync != true ? false : true;
  this.scriptObjects = [];
  this.divObject = null;
  this.htmlObjChildren = [];
};
my.includeHTMLJSFile.prototype.load = function() {
  var _self = this;
  var ret = true;
  if (this.divObject == null &&
  this.scriptObjects.length == 0 &&
  this.htmlObjChildren.length == 0) {
    if (this.htmlFile != null) {
      var _req;
      if (window.XMLHttpRequest) {
        _req = new XMLHttpRequest();
      } else {
        _req = new ActiveXObject("Microsoft.XMLHTTP");
      }
      _req.callback = function() {
        if (_req.readyState == 4 && _req.status == 200) {
          _self.divObject = document.createElement("div");
          _self.divObject.innerHTML = patchHTML(_req.responseText);
          for (var i = 0; i < _self.divObject.children.length; i++) {
            _self.htmlObjChildren.push(_self.divObject.children[i]);
          }
          for (var i = 0; i < _self.htmlObjChildren.length; i++) {
            var te = _self.htmlObjChildren[i];
            _self.addToDomObject.appendChild(te);
          }
          _self.divObject = null;
        } else {
          ret = false;
        }
      };
      if (_self.sync == true) {
        _req.onreadystatechange = _req.callback;
      }
      _req.open("GET", _self.htmlFile, _self.sync);
      _req.send();
      if (_self.sync == false) {
        _req.callback();
      }
    }
    if (_self.jsFiles != null && _self.jsFiles.length > 0) {
      //zhanghua去除此段原先代码：开始
      //	  var len = _self.jsFiles.length;
      //      for (; len > 0; len--) {
      //        var scrObj = document.createElement("script");
      //        scrObj.setAttribute("type", "text/javascript");
      //        scrObj.setAttribute("async", false);
      //        scrObj.setAttribute("src", _self.jsFiles[len - 1].path);
      //        scrObj.removable = _self.jsFiles[len - 1].removable;
      //        document.getElementsByTagName("HEAD").item(0).appendChild(scrObj);
      //        _self.scriptObjects.push(scrObj);
      //      }
      //zhanghua去除此段原先代码：结束
      //zhanghua添加下列代码：开始
      function loadJS(jsDom) {
        var len;
        if (jsDom) {
          len = jsDom.index - 1;
        } else {
          len = _self.jsFiles.length;
        }
        if (len > 0) {
          console.log("loadJS(" + _self.jsFiles[len - 1].path + ")");
          var scrObj = document.createElement("script");
          scrObj.setAttribute("type", "text/javascript");
          scrObj.setAttribute("async", false);
          scrObj.setAttribute("src", _self.jsFiles[len - 1].path);
          scrObj.index = len;
          scrObj.removable = _self.jsFiles[len - 1].removable;
          scrObj.onload = function() {
            loadJS(this);
          };
          document.getElementsByTagName("HEAD").item(0).appendChild(scrObj);
          _self.scriptObjects.push(scrObj);
        }
      }
      loadJS(null);
      //zhanghua添加下列代码：结束
    }
  } else {
    ret = false;
  }
  return ret;
};
my.includeHTMLJSFile.prototype.remove = function() {
  var _self = this;
  if (_self.scriptObjects != null && _self.scriptObjects.length > 0) {
    var len = _self.scriptObjects.length;
    for (; len > 0; len--) {
      if (_self.scriptObjects[len - 1].removable) {
        document.getElementsByTagName("HEAD").item(0).removeChild(_self.scriptObjects[len - 1]);
      }
    }
    _self.scriptObject = [];
  }
  if (_self.htmlObjChildren.length > 0) {
    for (var i = 0; i < _self.htmlObjChildren.length; i++) {
      _self.addToDomObject.removeChild(_self.htmlObjChildren[i]);
    }
    _self.htmlObjChildren = [];
    _self.divObject = null;
  }
};
