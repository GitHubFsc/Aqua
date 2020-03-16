var UploadModule = (function ($) {

  function UploadModule(aqua) {
    var that = this;
    that.my_aqua = aqua;
    that.STATUS = "enable";
    that.ERROR = "";
    that.file_status_array = [];
    that.files_status_upload = false;
    that.allUploadDataArray = [];
    that.uploadFilesNumber = 0;
  }

  UploadModule.prototype = {
    initParm: function () {
      var that = this;
      that.STATUS = "enable";
      that.ERROR = "";
      that.file_status_array = [];
      that.files_status_upload = false;
      that.allUploadDataArray = [];
      that.uploadFilesNumber = 0;
    },
    init: function (setting, simpleFun, allFun) {
      var that = this;
      if (typeof(setting) == "object") {
        this.selectFileBottom = setting.selectFileBottom; //选择上传按钮
        this.uploadPath = setting.uploadPath; //选择上传路径
        this.checkExist_Boolean = setting.checkExist_Boolean; //上传前是否检查命名是否有冲突
        this.uploadNow_Boolean = setting.uploadNow_Boolean;//开始上传按钮
        this.accept = setting.accept || "*";//接受格式
      }
      if (typeof(simpleFun) == "object") {
        this.startFun = simpleFun._startfun;  //已开始上传情况下回调函数
        this.progressFun = simpleFun._progressfun; //上传过程中回调函数
        this.errorFun = simpleFun._errorfun; //上传失败回调函数
        this.endFun = simpleFun._endfun; //上传结束回调函数
      }
      if (typeof(allFun) == "object") {
        this.getFileRenameResult = allFun._getFileRenameResult ? allFun._getFileRenameResult : function(result){return result};//所有文件-重命名回调函数
        this.beforeAllStartFun = allFun._beforeAllStartFun; //所有文件-在选择文件完毕时的回调函数，回调参数选择的文件
        this.allStartFun = allFun._allStartFun; //所有文件-在开始上传前回调函数
        this.checkAllExistFun = allFun._checkAllExistFun; //一次性检查所有文件是否有已存在同名文件的回调函数
        this.afterAllEndFun = allFun._afterAllEndFun; //结束本次上传事件，最终回调函数
      }
      that.createInput();
    },
    createInput: function(){
      var that = this;
      var systemFile = document.createElement("input");
      systemFile.setAttribute("type", "file");
      systemFile.setAttribute("multiple", "true");
      systemFile.setAttribute("accept", this.accept);
      systemFile.setAttribute("style", "display:none");
      systemFile.onchange = function () {
        that.files = this;
        if (that.beforeAllStartFun) {
          that.beforeAllStartFun(that.files, function(){
            cb();
          });
        }else{
          cb();
        }
        function cb(){
          that.uploadNow_Boolean && that.startuploadFile();
        }
      };
      that.systemFile = systemFile;
      $('body')[0].appendChild(systemFile);
      $(this.selectFileBottom).unbind("click").click(function () {
        if(that.STATUS == 'enable'){
          that.systemFile.click();
        }
      });
    },
    startuploadFile: function (successCallback, failedCallback) {
      var that = this;
      that.successCallback = successCallback;
      that.failedCallback = failedCallback;
      that.allStartFun && that.allStartFun();
      return that.uploadFile(that.files);
    },
    uploadFile: function (_file) {
      //上传前初始化
      var that = this;
      that.initParm();
      var i, name, aquaFile;
      var allAquaFileArray
      if (_file && _file.files && _file.files.length > 0) {
        //上传前先逐一确认是否已有同名文件
        if(that.checkExist_Boolean){
          allAquaFileArray = [];
          for (i = 0; i < _file.files.length; i++) {
            name = that.getFileRenameResult(_file.files[i].name);
            aquaFile = new my_aqua.file({
              name: name,
              path: that.uploadPath,
            });
            var Exist = aquaFile.checkExist();
            allAquaFileArray.push({
              aquaFile: aquaFile,
              exist: Exist,
              name: name
            });
          }
          var existArray = allAquaFileArray.filter(function(item){
            return item.exist
          }).map(function(item){
            return item.name;
          });
          if(existArray.length > 0){
            that.checkAllExistFun && that.checkAllExistFun(existArray);
            return;
          }
        }
        for (i = 0; i < _file.files.length; i++) {
          that.uploadSingleFile(_file, i);
        }
      }
    },
    uploadSingleFile: function (_file, i) {
      var that = this;
      that.uploadResult = false;
      var config = {
        path: that.uploadPath,
        inputFile: _file.files[i],
        onstart: function (updateSize, fileSize) {
          var self = this;
          if ($.isFunction(that.startFun))
            that.startFun(_file.files[i].name, updateSize, fileSize, self);
        },
        onprogress: function (updateSize, fileSize) {
          var self = this;
          if ($.isFunction(that.progressFun))
            that.progressFun(_file.files[i].name, updateSize, fileSize, self);
        },
        onerror: function (e) {
          if ($.isFunction(that.errorFun))
            that.errorFun(e);
          if(!that.ERROR){
            that.ERROR = that.getFileRenameResult(_file.files[i].name) + "_" + e;
            that.afterAllEndFun && that.afterAllEndFun({
              error: e
            });
          }
          return false;
        },
        onend: function (updateSize, fileSize, self) {
          //这里是上传完单个内容后的函数调用
          var self = this;
          if ($.isFunction(that.endFun)) {
            //如何返回下载地址？
            that.uploadFilesNumber++;
            var aquaFile = new that.my_aqua.file({
              name: that.getFileRenameResult(_file.files[i].name),
              path: that.uploadPath,
            });
            aquaFile.getMetadata();
            var file_url = aquaFile.getDownloadFileURL(this.parentURI);
            that.allUploadDataArray[i] = {
              name : aquaFile.name,
              file_url : file_url
            };
            that.endFun(aquaFile.name, updateSize, fileSize, file_url, self, that.uploadFilesNumber, _file.files.length);
          }
          that.file_status_array[i] = 1;
          if (that.sum_of_array(that.file_status_array) == _file.files.length) {
            that.files_status_upload = true;
            that.afterAllEndFun && that.afterAllEndFun({
              data: that.allUploadDataArray
            });
          }
          this.cancel();
        }
      };
      if (that.getFileRenameResult) {
        config.rename = that.getFileRenameResult(_file.files[i].name);
      }
      var newFile = new that.my_aqua.createFile(config);
    },
    clear: function(){
      var that = this;
      that.systemFile.value = "";
    },
    sum_of_array: function (array) {
      var result = 0;
      for (var i = 0; i < array.length; i++) {
        result += array[i];
      }
      return result;
    },
    setAvailable: function(){
      this.STATUS = "enable";
    },
    setDisable: function(){
      this.STATUS = "disable";
    }
  };

  return UploadModule;
})(jQuery);
