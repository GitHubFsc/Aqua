var inputFile = (function ($) {
    var _restRoot = aquaHost + "/aqua/rest/cdmi";
    //var _restRoot = "../aqua/rest/cdmi";
    /*
     var _async = false;//同步 or 异步
     var _timeout = 2000;//超时时间
     var _rootContainerID = "";//当前domain的objectID用户创建用户使用
     */
    function inputFile(aqua) {
        var that = this;
        this.file_index = 0;
        this.file_status_array = [];       //记录每个文件是否上传完毕 完毕的话则显示1 否0
        this.files_status_upload = false;  //记录整体是否上传关闭
        this.fileList = [];                //记录已经上传的文件
        this.uploadFilesNumber = 0;
        this.fileList = [];                //记录已经上传的文件
        this.uploadPath = "";
        this.isExistFun = null;
        this.getFileNameFun = null;
        this.startFun = null;
        this.progressFun = null;
        this.errorFun = null;
        this.endFun = null;
        that.my_aqua = aqua;
    }

    inputFile.prototype = {
        init: function (setting, fun) {
            var that = this;
            if (typeof(setting) == "object") {
                this.selectFileBottom   = setting.selectFileBottom;
                this.uploadPath         = setting.uploadPath;
                this.uploadRename         = setting.uploadRename;
                this.uploadRenameKeepSuffixName = setting.uploadRenameKeepSuffixName;
                this.uploadEssentialFile = setting.uploadEssentialFile;
                this.startUploadBottom   = setting.startUploadBottom;
                this.accept = setting.accept || "*";
            }
            else{
                console.log("上传组件定义参数错误");
                return;
            }
            if (typeof(fun) == "object") {
                this.isExistFun     = fun._isExistFun;
                this.startFun       = fun._startfun;
                this.progressFun    = fun._progressfun;
                this.errorFun       = fun._errorfun;
                this.endFun         = fun._endfun;
                this.getFileNameFun = fun._getfilenamefun;
                this.beforeStartFun = fun._beforeStartFun;
                this.beforeUploadPreviewFun = fun._beforeUploadPreviewFun;
            }
            var systemFile = document.createElement("input");
            systemFile.setAttribute("type", "file");
            systemFile.setAttribute("multiple", "true");
            systemFile.setAttribute("accept", this.accept);
            systemFile.setAttribute("style", "display:none");
            systemFile.onchange = function () {
                that.files = this;
                if(that.uploadEssentialFile){
                    if(!that.checkUploadFileExist(that.files,that.uploadEssentialFile)){
                        alert(i18n('LECTRUECREATE_ZAISHANGCHUANDEWENJIANZHONGXUYAOBAOHAN') + that.uploadEssentialFile)
                        return;
                    }
                }
                that.getFileNameFun(that.files.files[0].name);
                var file = that.files.files[0];
                var reader = new FileReader();
                reader.onload = function(e){
                    //show.innerHTML = '<img src="'+e.target.result+'" alt="img">';
                    if(that.beforeUploadPreviewFun){
                        that.beforeUploadPreviewFun(e.target.result);
                    }
                }
                reader.readAsDataURL(file);
                if(that.beforeStartFun){
                    that.beforeStartFun();
                }
                if(!that.startUploadBottom){
                    that.startuploadFile();
                }
            }
            $('body')[0].appendChild(systemFile);
            $(this.selectFileBottom).unbind("click").click(function () {
                systemFile.click();
            });
        },

        uploadFile: function (_file) {
            //上传前初始化
            var that = this;
            that.initReady();

            if (_file && _file.files && _file.files.length > 0) {
                if (_file.files.length == 1) {
                    //for (var i = 0; i < _file.files.length; i++) {
                    var i = 0;
                    var name = that.getFileSuffixName(_file.files[i].name);
                    var aquaFile = new my_aqua.file({
                        name: name,
                        path: that.uploadPath,
                    });
                    if (that.checkFileExist(aquaFile)) {
                        if ($.isFunction(that.isExistFun))
                            that.isExistFun(that.files.files[0].name);
                    } else {
                        return that.uploadSingleFile(_file, i);
                    }
                }
                else {
                    alert("请只上传一个文件!");
                }
            }
        },

        getFileSuffixName:function(filename){
            var that = this;
            var name = filename;
            var nameArray = name.split(".");
            var suffixName = "";
            if(nameArray.length > 1){
                suffixName = "." + nameArray[nameArray.length - 1];
            }else{
                suffixName = "";
            }
            if(that.uploadRenameKeepSuffixName && that.uploadRename){
                name = that.uploadRename + suffixName;
            }else if(that.uploadRename){
                name = that.uploadRename;
            }
            return name;
        },
        initReady: function () {
            var that = this;
            that.file_status_array = [];
            that.files_status_upload = false;
            that.fileList = [];
            that.file_status_array = [];
            that.file_index = 4;
            that.uploadFilesNumber = 0;
        },
        checkUploadFileExist:function(_file,name){
            var j = 0;
            for(j = 0; j<_file.files.length; j++){
                var file = _file.files[j];
                if(file.name === name){
                    return true;
                }
            };
            return  false;
        },
        checkFileExist: function (aquaFile) {
            //检查在下载列表里是否已经存在了
            var inputFile_fileList_isExist =
                $.each(this.fileList, function (index, item) {
                    var ret = false;
                    // console.log(item.aquaFile.name + "==" + aquaFile.name + ";" + item.aquaFile.path + "==" + aquaFile.path);
                    if (item.aquaFile.name == aquaFile.name && item.aquaFile.path == aquaFile.path) {
                        ret = true;
                    }
                    return ret;
                });
            return (inputFile_fileList_isExist == true || aquaFile.checkExist() == true);
        },
        checkReadyUpload : function(){
            var that = this;
            if(that.files && (that.files.files.length > 0)){
                if(that.uploadEssentialFile){
                    if(!that.checkUploadFileExist(that.files,that.uploadEssentialFile)){
                        alert(i18n('LECTRUECREATE_ZAISHANGCHUANDEWENJIANZHONGXUYAOBAOHAN') + that.uploadEssentialFile)
                        return false;
                    }
                }
                return true;
            }else{
                return false;
            }
        },
        uploadSingleFile: function (_file, i) {
            var that = this;
            //console.warn(i);
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
                    return false;
                },
                onend: function (updateSize, fileSize, self) {
                    //这里是上传完单个内容后的函数调用
                    var self = this;
                    if ($.isFunction(that.endFun)) {
                        //如何返回下载地址？
                        var aquaFile = new that.my_aqua.file({
                            name: that.getFileSuffixName(_file.files[i].name),
                            path: that.uploadPath,
                        });
                        aquaFile.getMetadata();
                        that.uploadFilesNumber++;
                        var file_url = aquaFile.getDownloadFileURL(this.parentURI);
                        that.endFun(aquaFile.name, updateSize, fileSize, file_url, self,that.uploadFilesNumber,_file.files.length);
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
            };
            if(that.uploadRename){
                config.rename = that.getFileSuffixName(_file.files[i].name);
            }
            var newFile = new that.my_aqua.createFile(config);

            that.fileList.push({
                aquaFile: newFile,
                newFile: newFile
            });
        },

        sum_of_array: function (array) {
            var result = 0;
            for (var i = 0; i < array.length; i++) {
                result += array[i];
            }
            return result;
        },

        startuploadFile:function(){
            var that = this;
            return that.uploadFile(that.files);
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
