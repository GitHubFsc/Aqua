var TicketAqua = (function () {
    var _restRoot = aqua_host+ "/aqua/rest/cdmi";
    //var _restRoot = "../aqua/rest/cdmi";

    var _async = false;//同步 or 异步
    var _timeout = 2000;//超时时间
    var _rootContainerID = "";//当前domain的objectID用户创建用户使用

    function TicketAqua() {
        this.userData = {
            secretAccessKey: null,
            accessKeyId: null,
            domain: null
        };
        this.dataObject = new _DataObject(this.userData);
        this.query = new _Query(this.userData);
        this.container = new _Container(this.userData, this.query,this.dataObject);
        this.token = new _Token(this.userData);
        this.domain = new _Domain(this.userData);
        this.user = new _User(this.userData, this.container);
    }

    //object对象
    function _DataObject(userData) {
        this.userData = userData;
    }
    _DataObject.prototype = {
        /**
         * 判断指定路径下的文件是否存在
         * @param  string  path 文件路径
         * @param  string  name 文件名称
         * @return Boolean   ture => 存在 false => 不存在
         */
        isExist: function (path, name) {
            var fileExist = false;

            if(!_checkUserKey(this.userData)){
                return fileExist;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-object";
            var method = "GET";
            var parentURI = _getParentURIByPath(path);
            //var urlPath = _restRoot + _encodePath(parentURI) + encodeURIComponent(name);
            var urlPath = _restRoot + _encodePath(parentURI) + (name ? encodeURIComponent(name) : "") + "?parentURI";
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                dataType: "json",
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function () {
                fileExist = true;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return fileExist;
        },
        /**
         * 创建指定路径下的文件
         * @param options 创建所需数据
         * 如｛
         *    name : "name",
         *    path : "path",
         *    metaData :　｛
         *
         *    ｝
         * ｝
         * @return Object 创建成功　=> 新创建对象的数据  创建失败　=> null
         */
        createFile: function (options) {
            var result = null;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var name = options.name;
            var path = options.path;
            var metaData = options.metaData;
            var parentURI = _getParentURIByPath(path);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-object";
            var method = "PUT";
            var urlPath = _restRoot + _encodePath(parentURI) + (name ? encodeURIComponent(name) : "") + "?";
            for (var i in metaData) {
                urlPath = urlPath + ("metadata:" + i + ";");//names
            }
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));

            var putData = {
                metadata : metaData ? metaData : {}
            };

            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                dataType: "json",
                data: JSON.stringify(putData),
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function (data) {
                result = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return result;
        },
        /**
         * 获取指定路径下的文件全部数据
         * @param  String path 文件路径
         * @param  String name 文件名称
         * @return Object      返回获取到的数据, 如果未获取到则返回null
         */
        getAllFields: function (path, name) {
            var result = null;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var parentURI = _getParentURIByPath(path);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-object";
            var method = "GET";
            var urlPath = _restRoot + _encodePath(parentURI) + ( name ? ( encodeURIComponent(name) ) : "" );
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                dataType: "json",
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function (data) {
                result = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return result;
        },
        /**
         * 更新指定路径下的文件
         * @param options 更新数据
         * 如｛
         *    name : "name",（必填）
         *    path : "path",（必填）
         *    metaData :　｛
         *
         *    ｝
         * ｝
         * @return Boolean   ture => 更新成功 false => 更新失败
         */
        updateFile: function (options) {
            var result = false;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var name = options.name;
            var path = options.path;
            var metaData = options.metaData;
            var parentURI = _getParentURIByPath(path);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-object";
            var method = "PUT";
            var urlPath = _restRoot + _encodePath(parentURI) + (name ? encodeURIComponent(name) : "") + "?";
            var names = [];
            var putData = {};
            for (var x in metaData) {
                names.push("metadata:" + encodeURIComponent(x));
            }
            if (names.length > 0) {
                urlPath = urlPath  + names.join(";");
                putData.metadata = metaData;
            } else {
                console.log("updateFile()方法中metaData参数无效");
                return result;
            }
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));

            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                dataType: "json",
                data: JSON.stringify(putData),
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function () {
                result = true;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status === 204){
                    result = true;
                }else{
                    _handleError(jqXHR, textStatus, errorThrown);
                }
            });
            return result;
        },
        /**
         * 删除指定路径下的文件
         * @param  string  path 文件路径
         * @param  string  name 文件名称
         * @return Boolean   ture => 删除成功 false => 删除失败
         */
        deleteFile: function (path, name) {
            var result = false;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var parentURI = _getParentURIByPath(path);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-object";
            var method = "DELETE";
            var urlPath = _restRoot + _encodePath(parentURI) + ( name ? ( encodeURIComponent(name) ) : "" );
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                }
            }).done(function () {
                result = true;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return result;
        },
        copyFile: function(options){
            var result = null;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var name = options.name;
            var path = options.path1;

            var parentURI = _getParentURIByPath(path);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-object";
            var method = "PUT";
            var urlPath = _restRoot + _encodePath(parentURI) + (name ? encodeURIComponent(name) : "");

            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));

            var putData = {
                copy :  (_getParentURIByPath(options.path)) + ( name ? ( encodeURIComponent(name) ) : "" )
            };

            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                dataType: "json",
                data: JSON.stringify(putData),
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function (data) {
                result = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return result;
        }
    };


    //container对象
    function _Container(userData, queryObj,object) {
        this.userData = userData;
        this.query = queryObj;
        this.object = object;
    }
    _Container.prototype = {
        /**
         * 将指定路径下的文件夹复制到指定的路径下
         * @param  string  path 文件夹路径
         * @param  string  name 文件夹名称
         * @param  string  path1 要复制到的路径
         * @return Boolean   ture => 存在 false => 不存在
         */
        copyFolder : function(options){
            var name = options.name;
            var path1 = options.path1;
            var path = options.path;
            var that = this;
            if(this.isExist(path1, name)){
                console.log("The folder is Existed.");
            }else{
                var data = that.getAllFields(path, name);
                var list_children = that.getListChildren({
                    path : path + name + "/"
                });
                console.log(data);
                that.createFolder({
                    path : path1,
                    name : name,
                    metaData : data.metadata
                })
                list_children.objects.forEach(function(item){
                    that.object.copyFile({
                            path : path + name + "/",
                            name : item.objectName,
                            path1: path1 + name + "/"

                        });
                });
                list_children.container.forEach(function(item){
                    that.copyFolder({
                        path : path + name + "/",
                        name : item.objectName.substr(0,(item.objectName.length - 1)),
                        path1: path1 + name + "/"

                    });
                });
            }
        },
        /**
         * 判断指定路径下的文件夹是否存在
         * @param  string  path 文件夹路径
         * @param  string  name 文件夹名称
         * @return Boolean   ture => 存在 false => 不存在
         */
        isExist: function (path, name) {
            var isFolderExist = false;

            if(!_checkUserKey(this.userData)){
                return isFolderExist;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var parentURI = _getParentURIByPath(path, name);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-container";
            var method = "GET";
            var urlPath = _restRoot + _encodePath(parentURI) + (name ? encodeURIComponent(name) + "/" : "") + "?parentURI";
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                dataType: "json",
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function () {
                isFolderExist = true;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return isFolderExist;
        },
        /**
         * 创建指定路径下的文件夹
         * @param path 文件夹路径
         * @param name 文件夹名称
         * @return Object 创建成功　=> 新创建对象的数据  创建失败　=> null
         */
        createFolder: function (options) {
            var result = null;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var name = options.name;
            var path = options.path;
            var metaData = options.metaData;
            var parentURI = _getParentURIByPath(path);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-container";
            var method = "PUT";
            var urlPath = _restRoot + _encodePath(parentURI) + ( name ? ( encodeURIComponent(name) + "/" ) : "" ) + "?";
            for (var i in metaData) {
                urlPath = urlPath + ("metadata:" + i + ";");//names
            }
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));

            var putData = {
                metadata : metaData ? metaData : {}
            };

            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                dataType: "json",
                data: JSON.stringify(putData),
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function (data) {
                result = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return result;
        },
        /**
         * 获取指定路径下的文件夹下的文件
         * @param  Object options
         * 如｛
         *  objectType ： objectType,（缺省application/cdmi-node）
         *  path ： path,（必填）
         *  results ： results,
         *  order ： order,
         *  range : range 如（1-12）
         * ｝
         * @return Object      返回获取到的数据, 如果未获取到则返回null
         *
         * 备注 当objectType为application/cdmi-node或者未填写的时候则返回所有文件和文件夹
         *     当objectType为application/cdmi-object 则返回所有文件
         *     当objectType为application/cdmi-container 则返回所有文件夹
         */
        getListChildren: function (options) {
            var path = options && options.path;
            var objectType = options && options.objectType || "application/cdmi-node";
            if(!path){
                console.log("getListChildren()方法中path参数无效");
                return null;
            }
            options.objectType = objectType;
            options.scope = [{
                "parentURI": "== " + path
            }];
            if(objectType != "application/cdmi-node"){
                options.scope[0]["objectType"] = objectType;
            }

            return this.query.queryCDMI(options);
        },
        /**
         * 获取指定路径下的文件全部字段数据
         * @param  String path 文件路径
         * @param  String name 文件名称
         * @return Object      返回获取到的数据, 如果未获取到则返回null
         */
        getAllFields: function (path, name) {
            var getData = null;

            if(!_checkUserKey(this.userData)){
                return getData;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var path = path;
            var name = name;
            var parentURI = _getParentURIByPath(path);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-container";
            var method = "GET";
            var urlPath = _restRoot + _encodePath(parentURI) + ( name ? ( encodeURIComponent(name) + "/" ) : "" );
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                dataType: "json",
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function (data) {
                getData = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return getData;
        },
        /**
         * 更新指定路径下的文件夹
         * @param options 更新数据
         * 如｛
         *    name : "name",（必填）
         *    path : "path",（必填）
         *    metaData :　｛
         *
         *    ｝
         * ｝
         * @return Boolean   ture => 更新成功 false => 更新失败
         */
        updateFolder: function (options) {
            var ret = false;

            if(!_checkUserKey(this.userData)){
                return ret;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;

            var name = options.name;
            var path = options.path;
            var parentURI = _getParentURIByPath(path);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-container";
            var method = "PUT";
            var urlPath = _restRoot + _encodePath(parentURI) + ( name ? ( encodeURIComponent(name) + "/" ) : "" ) + "?";
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            for (var i in options.metaData) {
                urlPath = urlPath + ("metadata:" + i + ";");
            }
            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                dataType: "json",
                data: '{"metadata":' + JSON.stringify(options.metaData) + '}',
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function () {
                ret = true;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status === 204){
                    ret = true;
                }else{
                    _handleError(jqXHR, textStatus, errorThrown);
                }
            });
            return ret;
        },
        /**
         * 删除指定路径下的文件夹
         * @param  string  path 文件夹路径
         * @param  string  name 文件夹名称
         * @return Boolean   ture => 删除成功 false => 删除失败
         */
        deleteFolder: function (path, name) {
            var ret = false;

            if(!_checkUserKey(this.userData)){
                return ret;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var parentURI = _getParentURIByPath(path);
            var nowDateTime = new Date().getTime();
            var contentType = "application/cdmi-container";
            var method = "DELETE";
            var urlPath = _restRoot + _encodePath(parentURI) + ( name ? ( encodeURIComponent(name) + "/") : "" );
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            jQuery.ajax({
                type: method,
                url: urlPath,
                async: _async,
                timeout: _timeout,
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "x-aqua-read-reference-redirect": false,
                    "Content-Type": contentType
                },
                contentType: "application/json"
            }).done(function () {
                ret = true;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return ret;
        }
    };

    //Domain对象
    function _Domain(userData) {
        this.userData = userData;
    }
    _Domain.prototype = {
        /**
         * 获取登录用户所在域的domain数据
         * @param Object metadata 需要查看的属性 如｛name : ""｝ 或者 "ALL"
         * @return Object
         *      返回获取到的数据
         *          当metadata未传递或者传递空对象返回全部meta值
         *          当metadata未"ALL" 则返回全部数据
         *      未获取则返回null
         */
        getDomain : function(metadata) {
            var result = null;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var domain = this.userData.domain;

            var method = "GET";
            var contentType = "application/cdmi-domain";
            var nowDateTime = new Date().getTime();
            var urlPath = _restRoot + "/cdmi_domains/default/" + domain + "/";
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;

            if(metadata !== "ALL"){
                var names = [];
                for (var x in metadata) {
                    names.push("metadata:" + encodeURIComponent(x));
                }
                if (names.length > 0) {
                    urlPath = urlPath + "?" + names.join(";");
                } else {
                    urlPath = urlPath + "?metadata;"
                }
            }

            jQuery.ajax({
                type: method,
                url: urlPath,
                async : _async,
                timeout : _timeout,
                dataType: "json",
                headers: {
                    "Accept": contentType,
                    "Content-Type": contentType,
                    "Authorization": "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk)),
                    "x-aqua-date": nowDateTime,
                    "X-CDMI-Specification-Version": "1.0.2"
                },
                contentType: "application/json"
            }).done(function (data) {
                result = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return result;
        },
        /**
         * 更新domain的meta值
         * @param metadata 更新的数据 如｛name : "name"｝
         * @return Boolean   ture => 更新成功 false => 更新失败
         * ps metadata未传递或者传递空对象(保证数据安全) 则返回false
         */
        updateDomain : function(metadata) {
            var result = false;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var domain = this.userData.domain;
            if(!metadata){
                console.log("updateDomain()方法中metadata参数无效");
                return result;
            }
            var method = "PUT";
            var contentType = "application/cdmi-domain";
            var nowDateTime = new Date().getTime();
            var urlPath = _restRoot + "/cdmi_domains/default/" + domain + "/";
            var names = [];
            var putData = {};
            for (var x in metadata) {
                names.push("metadata:" + encodeURIComponent(x));
            }
            if (names.length > 0) {
                urlPath = urlPath + "?" + names.join(";");
                putData.metadata = metadata;
            } else {
                console.log("updateDomain()方法中metadata参数无效");
                return result;
            }
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            jQuery.ajax({
                type: method,
                url: urlPath,
                data: JSON.stringify(putData),
                async : _async,
                timeout : _timeout,
                dataType: "json",
                headers: {
                    "Accept": contentType,
                    "Content-Type": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "X-CDMI-Specification-Version": "1.0.2"
                },
                contentType: "application/json"
            }).done(function (data) {
                result = true;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.status === 204){
                    result = true;
                }else{
                    _handleError(jqXHR, textStatus, errorThrown);
                }
            });
            return result;
        }
    };

    //Token对象
    function _Token(userData) {
        this.userData = userData;
    }
    _Token.prototype = {
        /**
         * 根据url和有效期生成URL后缀
         * @param  String  url          url地址
         * @param  Int  expires_valid_date token有效期
         * @return String                   URL后缀
         */
        getExpiresToken  : function(pathUrl, expires_valid_date) {
            var ret = "";
            if(!_checkUserKey(this.userData)){
                return ret;
            }

            var method = "GET";
            var contentType = "";
            var dateTime = new Date().getTime() + expires_valid_date;
            var stringToSign = method + "\n" + contentType + "\n" + dateTime + "\n" + _buildHostUrl(pathUrl);
            var aquatoken = this.userData.accessKeyId + ":" + _base64Encode(_str_hmac_sha1(this.userData.secretAccessKey, stringToSign));

            ret += "?aquatoken=" + encodeURIComponent(aquatoken);
            ret += "&xaquadate=" + dateTime;
//            ret += "&uriprefix=" + encodeURIComponent(uriprefix);
            return ret;
        },
        /**
         * 根据uriprefix，aquatoken，expires生成URl后缀
         * @param  String uriprefix [请求前缀]
         * @param  String aquatoken [token有效期]
         * @param  int expires   [请求后缀]
         * @return String           [URL后缀]
         */
        getXAquaDateToken  : function(aquatoken, expires, uriprefix) {
            var ret = "";
            ret += "?aquatoken=" + encodeURIComponent(aquatoken);
            ret += "&expires=" + expires;
            ret += "&uriprefix=" + encodeURIComponent(uriprefix);
            return ret;
        }
    };

    //Query对象
    function _Query(userData) {
        this.userData = userData;
    }
    _Query.prototype = {
        /**
         * queryCDMI查询数据
         * @param  Object option 查询参数
         * 如｛
         *  objectType ： objectType,（缺省application/cdmi-object）
         *  scope ： scope,
         *  results ： results,
         *  order ： order,
         *  range : range 如（1-12）
         * ｝
         * @return Object        返回获取到的数据, 如果未获取到则返回null
         */
        queryCDMI : function(option) {
            var result = null;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var objectType = option && option.objectType;
            var scopeSpec = option && option.scope;
            var resultsSpec = option && option.results;
            var order = option && option.order;
            var range = option && option.range;
            if(!_checkUserKey(this.userData)){
                return result;
            }
            var urlPath = _restRoot + '/cdmi_query/';
            var default_results_spec = {
                'objectID' : '',
                'objectName' : '',
                'parentURI' : '',
                'metadata' : {}
            };
            objectType = objectType || 'application/cdmi-object';
            resultsSpec = resultsSpec || default_results_spec;
            urlPath = order ? urlPath + "?sort=" + order : urlPath;
            if(range){
                urlPath = order ? urlPath + "&range=" + range :  urlPath + "?range="  + range;
            }

            var specs = {
                'cdmi_scope_specification' : scopeSpec,
                'cdmi_results_specification' : resultsSpec
            };

            var method = "PUT";
            var contentType = objectType;
            var nowDateTime = new Date().getTime();

            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            jQuery.ajax({
                type: method,
                url: urlPath,
                async : _async,
                timeout : _timeout,
                dataType: "json",
                data: JSON.stringify(specs),
                headers: {
                    "Accept": contentType,
                    "Content-Type": contentType,
                    "Authorization": authorization,
                    "x-aqua-date": nowDateTime,
                    "X-CDMI-Specification-Version": "1.0.2"
                },
                contentType: "application/json"
            }).done(function (data) {
                result = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return result;
        },
        /**
         * 通过ObjectId查询数据
         * @param  Object option 查询参数
         * 如｛
         *  objectType ： objectType,（缺省application/cdmi-object）
         *  objectId ： objectId,
         * ｝
         * @return Object        返回获取到的数据, 如果未获取到则返回null
         */
        queryByObjectId : function(option) {
            var result = null;

            if(!_checkUserKey(this.userData)){
                return result;
            }
            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var objectType = option && option.objectType;
            var objectId = option && option.objectId;
            if(!objectId){
                console.log("queryByObjectId()方法传入参数非法,objectId属性未传递或者为空");
                return result;
            }
            var urlPath = _restRoot + '/cdmi_objectid/' + objectId;
            objectType = objectType || 'application/cdmi-object';

            var method = "GET";
            var contentType = objectType;
            var nowDateTime = new Date().getTime();

            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));
            jQuery.ajax({
                type: method,
                url: urlPath,
                async : _async,
                timeout : _timeout,
                dataType: "json",
                headers: {
                    'Accept': contentType,
                    'Content-Type': contentType,
                    'Authorization': authorization,
                    'x-aqua-date': nowDateTime,
                    'x-aqua-read-reference-redirect': false
                },
                contentType: "application/json"
            }).done(function (data) {
                result = data;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return result;
        }
    };

    function _User(userData, container) {
        this.userData = userData;
        this.container = container;
    }

    _User.prototype = {
        /**
         * 用户登录
         * @param  String userName 用户
         * @param  String password 密码
         * @param  String domain   域名
         * @return Boolean  ture => 登录成功 false => 登录失败
         */
        login: function (userName, password, domain) {
            var res = false;

            var method = "GET";
            var contentType = "application/cdmi-user";
            var urlPath = _restRoot + "/cdmi_users/" + encodeURIComponent(userName);
            var authorization = "Basic " + _base64Encode(_utf16to8(userName + ":" + password));
            var proDomainURI = "/cdmi_domains/default/" + domain + "/";

            var that = this;
            jQuery.ajax({
                type: method,
                url: urlPath,
                async : _async,
                timeout : _timeout,
                dataType: "json",
                headers: {
                    "Accept": contentType,
                    "Authorization": authorization,
                    "x-aqua-user-domain-uri": proDomainURI,
                    "X-CDMI-Specification-Version": "1.0.2"
                },
                contentType: "application/json"
            }).done(function (data) {
                if(data.objectID && data.secretAccessKey){
                    that.setKey({
                        accessKeyId : data.objectID,
                        secretAccessKey : data.secretAccessKey,
                        domain : domain
                    });
                    res = true;
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });

            return res;
        },
        /**
         * 创建用户
         * @param  Object option 用户参数
         * 如｛
         *  name ： name,（
         *  password ： password,
         *  isAdmin ： true/false 默认false
         * ｝
         * @return Boolean  ture => 创建成功 false => 创建失败
         */
        createUser: function (optinon) {
            var result = false;
            var name = optinon && optinon.name;
            var password = optinon && optinon.password;
            var isAdmin = optinon && optinon.isAdmin || false;

            var accessKeyId = this.userData.accessKeyId;
            var secretAccessKey = this.userData.secretAccessKey;
            var domain = this.userData.domain;

            var rootContainerID = "";
            if(!_rootContainerID){
                var containerData = this.container.getAllFields("/default/" + domain + "/", null);
                rootContainerID = containerData && containerData.objectID;
                //回设rootContainerID,避免重复获取
                _rootContainerID = rootContainerID;
            }else{
                rootContainerID = _rootContainerID;
            }
            if(!rootContainerID){
                return result;
            }
            var domainURI = "/cdmi_domains/default/" + domain + "/";

            var method = "POST";
            var contentType = "application/cdmi-user";
            var nowDateTime = new Date().getTime();
            var userData =  {
                objectName: name,
                domainURI: domainURI,
                password: password,
                metadata: {
                    "root_container": rootContainerID
                },
                privileges : isAdmin ? "+0xf" : "+0x0"
            };

            var urlPath = _restRoot + "/cdmi_users/" + encodeURIComponent(name);
            var url = _buildHostUrl(urlPath);
            var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;
            var authorization = "AQUA " + accessKeyId + ":" + _base64Encode(_str_hmac_sha1(secretAccessKey, StringToSign_netdisk));

            jQuery.ajax({
                type: method,
                url: urlPath,
                async : _async,
                timeout : _timeout,
                dataType: "json",
                headers: {
                    'Accept': contentType,
                    'Content-Type': contentType,
                    'Authorization': authorization,
                    'x-aqua-date': nowDateTime,
                    'x-aqua-read-reference-redirect': false,
                    "x-aqua-user-domain-uri" : domainURI
                },
                contentType: "application/json",
                data: JSON.stringify(userData)
            }).done(function (data) {
                result = true;
            }).fail(function (jqXHR, textStatus, errorThrown) {
                _handleError(jqXHR, textStatus, errorThrown);
            });
            return result;
        },
        /**
         * 设置用户key值
         * @param options 参数
         * 如｛
         *  accessKeyId ： accessKeyId,
         *  secretAccessKey ： secretAccessKey,
         *  domain ：domain
         * ｝
         */
        setKey: function (options) {
            this.userData.accessKeyId = options && options.accessKeyId;
            this.userData.secretAccessKey = options && options.secretAccessKey;
            this.userData.domain = options && options.domain;
        },
        /**
         * 获取用户key值
         */
        getKey: function () {
            return {
                accessKeyId: this.userData.accessKeyId,
                secretAccessKey: this.userData.secretAccessKey,
                domain: this.userData.domain
            }
        }

    };

    /**
     * 检测用户key值是否为空
     */
    function _checkUserKey(userData) {
        var result = false;

        var accessKeyId = jQuery.trim(userData.accessKeyId);
        var secretAccessKey = jQuery.trim(userData.secretAccessKey);
        var domain = jQuery.trim(userData.domain);
        if(accessKeyId && secretAccessKey && (typeof domain != 'undefined')){
            result = true;
        }else{
            console.log("用户数据(accessKeyId,secretAccessKey,domain)中属性值为空，请登录或者调用setKey()方法进行设置");
        }
        return result;
    }

    //encodePath
    function _encodePath(path){
        var ret = null;
        if (path) {
            var a = path.split("/");
            for (var i = 0; i < a.length; i++) {
                a[i] = encodeURIComponent(a[i]);
            }
            ret = a.join("/");
        }
        if (ret == null) {
            ret = "";
        }
        else {
            if (ret.substr(ret.length - 1, 1) != "/") {
                ret += "/";
            }
        }
        return ret;
    }

    //getParentURIByPath
    function _getParentURIByPath(path) {
        if(path){
            var slashIndex = path.lastIndexOf('/');
            if(slashIndex < path.length - 1){
                return path + '/';
            }else{
                return path;
            }
        }
    }

    //_handleError
    function _handleError(jqXHR, textStatus, errorThrown) {
        var errorCode = jqXHR.status;
        switch(errorCode){
            case 400:
                console.log(errorCode + "--The request contains invalid parameters or field names.");
                break;
            case 401:
                console.log(errorCode + "--The authentication credentials are missing or invalid.");
                break;
            case 403:
                console.log(errorCode + "--The client lacks the proper authorization to perform this reques.");
                break;
            case 404:
                console.log(errorCode + "--The resource was not found at the specified URI.");
                break;
            case 409:
                console.log(errorCode + "--The operation conflicts with a non-CDMI access protocol lock or may cause a state transition error on the server orthe data object may not be deleted.");
                break;
            default :
                console.log(errorCode);
                break;
        }
    }

    //buildWithHostUrl
    function _buildHostUrl(url) {
        return (url.indexOf("//") > -1) ? _buildWithHostUrl(url) : _buildNoHostUrl(url);
    }

    //buildNoHostUrl
    function _buildNoHostUrl(url) {
        var tmp1 = (url.indexOf("/") >= 0) ? url.indexOf("/") : 0;
        var tmp2 = url.indexOf("?");
        var urlPath = url.substr(tmp1, ((tmp2 >= 0) ? (tmp2) : url.length) - tmp1);
        return urlPath;
    }

    //buildWithHostUrl
    function _buildWithHostUrl(url) {
        var arrObj = url.split("//");
        var tmp1 = (arrObj[1].indexOf("/") >= 0) ? arrObj[1].indexOf("/") : 0;
        var tmp2 = arrObj[1].indexOf("?");
        var urlPath = arrObj[1].substr(tmp1, ((tmp2 >= 0) ? (tmp2) : arrObj[1].length) - tmp1);
        return urlPath;
    }

    //utf16to8
    function _utf16to8(str) {
        var out, i, len, c;
        out = "";
        len = str.length;

        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);

            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i)
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
            }
        }
        return out;
    }

    //base64Encode
    function _base64Encode(str) {
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

        var out, i, len;
        var c1, c2, c3;

        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }

    //str_hmac_sha1
    function _str_hmac_sha1(_key, _data){
        var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase */
        var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance */
        var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode */
        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_sha1(s){
            return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
        }

        function b64_sha1(s){
            return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
        }

        function str_sha1(s){
            return binb2str(core_sha1(str2binb(s), s.length * chrsz));
        }

        function hex_hmac_sha1(key, data){
            return binb2hex(core_hmac_sha1(key, data));
        }

        function b64_hmac_sha1(key, data){
            return binb2b64(core_hmac_sha1(key, data));
        }

        function str_hmac_sha1(key, data){
            return binb2str(core_hmac_sha1(key, data));
        }

        /*
         * Perform a simple self-test to see if the VM is working
         */
        function sha1_vm_test(){
            return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
        }

        /*
         * Calculate the SHA-1 of an array of big-endian words, and a bit length
         */
        function core_sha1(x, len){
            /* append padding */
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;

            var w = Array(80);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            var e = -1009589776;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;

                for (var j = 0; j < 80; j++) {
                    if (j < 16)
                        w[j] = x[i + j];
                    else
                        w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                    e = d;
                    d = c;
                    c = rol(b, 30);
                    b = a;
                    a = t;
                }

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
                e = safe_add(e, olde);
            }
            return Array(a, b, c, d, e);

        }

        /*
         * Perform the appropriate triplet combination function for the current
         * iteration
         */
        function sha1_ft(t, b, c, d){
            if (t < 20)
                return (b & c) | ((~ b) & d);
            if (t < 40)
                return b ^ c ^ d;
            if (t < 60)
                return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        }

        /*
         * Determine the appropriate additive constant for the current iteration
         */
        function sha1_kt(t){
            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
        }

        /*
         * Calculate the HMAC-SHA1 of a key and some data
         */
        function core_hmac_sha1(key, data){
            var bkey = str2binb(key);
            if (bkey.length > 16)
                bkey = core_sha1(bkey, key.length * chrsz);

            var ipad = Array(16), opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);
            return core_sha1(opad.concat(hash), 512 + 160);
        }

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        function safe_add(x, y){
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        function rol(num, cnt){
            return (num << cnt) | (num >>> (32 - cnt));
        }

        /*
         * Convert an 8-bit or 16-bit string to an array of big-endian words
         * In 8-bit function, characters >255 have their hi-byte silently ignored.
         */
        function str2binb(str){
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
            return bin;
        }

        /*
         * Convert an array of big-endian words to a string
         */
        function binb2str(bin){
            var str = "";
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < bin.length * 32; i += chrsz)
                str += String.fromCharCode((bin[i >> 5] >>> (32 - chrsz - i % 32)) & mask);
            return str;
        }

        /*
         * Convert an array of big-endian words to a hex string.
         */
        function binb2hex(binarray){
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
            }
            return str;
        }

        /*
         * Convert an array of big-endian words to a base-64 string
         */
        function binb2b64(binarray){
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) |
                    (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) |
                    ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32)
                        str += b64pad;
                    else
                        str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        }
        return str_hmac_sha1(_key, _data);
    }
    return TicketAqua;
})();