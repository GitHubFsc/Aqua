var inputFile = (function ($) {
  var _restRoot = location.origin + "/aqua/rest/cdmi";
  //var _restRoot = "../aqua/rest/cdmi";
  /*
  var _async = false;//同步 or 异步
  var _timeout = 2000;//超时时间
  var _rootContainerID = "";//当前domain的objectID用户创建用户使用
  */
  
  function inputFile() {
    this.file_index = 0;
    this.file_status_array = [];       //记录每个文件是否上传完毕 完毕的话则显示1 否0
    this.files_status_upload = false;  //记录整体是否上传关闭 
    this.fileList = [];                //记录已经上传的文件
    this.uploadPath = "";
    this.isExistFun = null;
    this.startFun = null;
    this.progressFun = null;
    this.errorFun = null;
    this.endFun = null;
  }

  inputFile.prototype = {
      init: function(domID, path, fun){
        var that = this;
        $(domID).click(function(){
          var systemFile = document.createElement("input");
          systemFile.setAttribute("type", "file");
          systemFile.setAttribute("multiple", "true");
          systemFile.setAttribute("accept", "*");
          systemFile.setAttribute("style", "display:none");
          systemFile.onchange = function(){
            that.uploadFile(this);
          }
          $('body')[0].appendChild(systemFile);
          systemFile.click();
        });
        this.uploadPath    = path;
        if(typeof(fun) == "object"){
          this.isExistFun    = fun._isExistFun;
          this.startFun    = fun._startfun;
          this.progressFun = fun._progressfun;
          this.errorFun    = fun._errorfun;
          this.endFun      = fun._endfun;
        }
      },
      
      uploadFile: function (_file) {
        //上传前初始化
        var that = this;
        that.initReady();
        if (_file && _file.files && _file.files.length > 0) {
          if(_file.files.length == 1){
            //for (var i = 0; i < _file.files.length; i++) {
            var i = 0;
            var aquaFile = new my_aqua.file({
                name: _file.files[i].name,
                path: that.uploadPath,
              });
              if (that.checkFileExist(aquaFile)) {
                if($.isFunction(that.isExistFun))
                that.isExistFun();
              } else {
                that.uploadSingleFile(_file, i);
              }
            //}
          }
          else {
            alert("请上传一个文件!");
          }
        }
      },
     
      initReady: function () {
        var that = this;
        that.file_status_array = [];
        that.files_status_upload = false;
        that.fileList = [];  
        that.file_status_array = [];
        that.file_index = 4;
      },
      
      checkFileExist: function (aquaFile) {
        //检查在下载列表里是否已经存在了
        var inputFile_fileList_isExist =
          $.each(this.fileList, function(index, item) {
            var ret = false;
           // console.log(item.aquaFile.name + "==" + aquaFile.name + ";" + item.aquaFile.path + "==" + aquaFile.path);
            if (item.aquaFile.name == aquaFile.name && item.aquaFile.path == aquaFile.path) {
              ret = true;
            }
            return ret;
          }); 
        return (inputFile_fileList_isExist == true || aquaFile.checkExist() == true);
      },

      uploadSingleFile: function (_file, i) {
        var that = this;
        //console.warn(i);
        var newFile = new my_aqua.createFile({
          path:that.uploadPath,
          inputFile: _file.files[i],
          onstart         : function(updateSize, fileSize) {
            var self = this;
            if($.isFunction(that.startFun))
            that.startFun(_file.files[i].name, updateSize, fileSize, self);
          },
          onprogress      : function(updateSize, fileSize) {
            var self = this;
            if($.isFunction(that.startFun))
            that.progressFun(_file.files[i].name, updateSize, fileSize, self);
          },
          onerror         : function(e) {
            if($.isFunction(that.startFun))
            that.errorFun(e);
          },
          onend           : function(updateSize, fileSize, self) {
            //这里是上传完单个内容后的函数调用
            var self = this;
            if($.isFunction(that.endFun)){
              //如何返回下载地址？
              var aquaFile = new my_aqua.file({
                name: _file.files[i].name,
                path: that.uploadPath,
              });
              aquaFile.getMetadata();
              console.log(this.parentURI);
              var file_url  = aquaFile.getDownloadFileURL(this.parentURI);
              that.endFun(_file.files[i].name, updateSize, fileSize, file_url , self);
            }

            //aquaFile.isExist = true;
            var index = -1;

            if( that.file_index + 1 >= _file.files.length ){ //上传文件的数量低于五个
              that.file_status_array[i] = 1;
              if( that.sum_of_array(that.file_status_array) == _file.files.length ){
                that.files_status_upload = true;
              }
            
              if (index >= 0) {
                that.fileList.splice(index, 1);
              }
              this.cancel();
              
            }
            else {
              //上传文件大于五个
              //这个时候也已经上传完毕了 那就先看看 i + 1 + 5 是否大于文件的数量
              //大于等于的话 则就开始给数组赋值 确认是否上传完毕
              //小于的话 则开始递归
              var upload_message = "成功上传" + i;
              //console.warn(upload_message);
              
              if( i + 1 + 5 > _file.files.length){
                that.file_status_array[ i % 5 ] = 1;
                if( that.sum_of_array(that.file_status_array) == that.file_index + 1 ){
                  that.files_status_upload = true;
                }
                if (index >= 0) {
                  that.fileList.splice(index, 1);
                }
                this.cancel();
              }
              else{
                var upload_message = "准备上传" + i + 5;
                //console.warn(upload_message);
              that.uploadSingleFile(_file, i + 5 );
              }
            }
          }
        });
        
        that.fileList.push({
          aquaFile: newFile,
          newFile: newFile
        });
      },

      sum_of_array: function (array) {
        var result = 0;
        for(var i = 0; i < array.length; i++) {
          result += array[i];
        }
        return result;
      }
      
    };
  function getParentURIByPath(path) {
      var ret = _restRoot + "/";
      if (path) {
          ret += path + "/";
      }
      return ret;
  }
  return inputFile;
})(jQuery);