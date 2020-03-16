my_aqua = (function ($) {
    var my_aqua = {};

    my_aqua.restRoot = aquaHost + "/aqua/rest/cdmi";
    my_aqua.restRoot_ = "../aqua/rest/cdmi";
    my_aqua.netdiskRoot = "/default/netdisk";
    my_aqua.userName = null;
//my_aqua.userGroup = "ROLE_USER";
//my_aqua.password = null;
    my_aqua.accessKeyId = null;
    my_aqua.secretAccessKey = null;
    my_aqua.domainID = null;
    my_aqua.containers = null;
    my_aqua.domainURI = null;

    my_aqua.printLog = function (args) {
        //console.log(args);
    }

    my_aqua.encodePath = function (path) {
        var ret = null;
        //my_aqua.printLog(path);
        if (path) {
            var a = path.split("/");
            for (var i = 0; i < a.length; i++) {
                a[i] = encodeURIComponent(a[i]);
            }
            ret = a.join("/");
        }
        if (ret == null) {
            ret = "";
        } else {
            if (ret.substr(ret.length - 1, 1) != "/") {
                ret += "/";
            }
        }
        //my_aqua.printLog(ret);
        return ret;
    }

    my_aqua.getHasTokenUrl = function (method, url, expiredTime) {
        var ret = url;
        var tmp1 = (url.indexOf("/") >= 0) ? url.indexOf("/") : 0;
        var tmp2 = url.indexOf("?");
        var urlPath = url.substr(tmp1, ((tmp2 >= 0) ? (tmp2) : url.length) - tmp1);
        //my_aqua.printLog(urlPath);
        var HA1 = hex_md5(method + ":" + urlPath);
        //my_aqua.printLog("HA1:" + HA1);
        var HA2 = hex_md5(my_aqua.userName + ":" + "DEMO");
        //my_aqua.printLog("HA2:" + HA2);
        var Key = "swt3tdhd";
        var Expired_time = parseInt(new Date().getTime() / 1000) + expiredTime;
        var Token = _base64Encode(Expired_time + ":" + my_aqua.userName + ":DEMO:" + hex_md5(HA1 + ":" + Expired_time + ":" + HA2 + ":" + Key));
        //my_aqua.printLog('hex_md5(HA1 + ":" + Expired_time + ":" + HA2 + ":" + Key)=' + hex_md5(HA1 + ":" + Expired_time + ":" + HA2 + ":" + Key));
        if (tmp2 < 0) {
            ret += "?";
        } else {
            ret += "&";
        }
        ret += "token=" + Token;
        my_aqua.printLog(ret);
        return ret;
    }

    my_aqua.addXHRHeaderRequest = function (xhr, method, url, contentType, move_overwrite,status) {
        //status为真的话 uri格式为../ 否则为https://
        if(status){
            var tmp1 = (url.indexOf("/") >= 0) ? url.indexOf("/") : 0;
            var tmp2 = url.indexOf("?");
            var urlPath = url.substr(tmp1, ((tmp2 >= 0) ? (tmp2) : url.length) - tmp1);
        }else{
            var arrObj = url.split("//");
            var tmp1 = (arrObj[1].indexOf("/") >= 0) ? arrObj[1].indexOf("/") : 0;
            var tmp2 = arrObj[1].indexOf("?");
            var urlPath = arrObj[1].substr(tmp1, ((tmp2 >= 0) ? (tmp2) : arrObj[1].length) - tmp1);
        }
        //my_aqua.printLog(urlPath);
        var nowDateTime = new Date().getTime();

        var StringToSign = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
        console.log(StringToSign);
        if (xhr) {
            xhr.setRequestHeader("Accept", contentType);
            xhr.setRequestHeader("Content-Type", contentType);
            xhr.setRequestHeader("Authorization", "AQUA " + my_aqua.accessKeyId + ":" + _base64Encode(_str_hmac_sha1(my_aqua.secretAccessKey, StringToSign)));
            xhr.setRequestHeader("x-aqua-date", nowDateTime);
            if (move_overwrite) {
                xhr.setRequestHeader("x-aqua-move-overwrite", move_overwrite);
            }
        }
        var ret = url;
        if (tmp2 < 0) {
            ret += "?";
        } else {
            ret += "&";
        }
        ret += "aquatoken=" + encodeURIComponent(my_aqua.accessKeyId) + ":" + encodeURIComponent(_base64Encode(_str_hmac_sha1(my_aqua.secretAccessKey, StringToSign)));
        ret += "&xaquadate=" + nowDateTime;
        //console.log(b64_hmac_sha1(my_aqua.secretAccessKey, StringToSign) + "=");
        //console.log(ret);
        return ret;
    }

    my_aqua.getParentURIByPath = function (path) {
        var ret = my_aqua.netdiskRoot + "/";
        if (path) {
            ret += path;
        }
        return ret;
    }

    my_aqua.getPathByParentURI = function (parentURI) {
        var ret = null;
        var tmp = my_aqua.netdiskRoot + "/";
        if (parentURI && parentURI.indexOf(tmp) == 0) {
            ret = parentURI.substr(tmp.length, parentURI.length - tmp.length - 1);
            if (ret == "") {
                ret = null;
            }
        }
        return ret;
    }

    my_aqua.xhr = function () {
        var _req;
        if (window.XMLHttpRequest) {
            _req = new XMLHttpRequest();
        } else {
            _req = new ActiveXObject("Microsoft.XMLHTTP");
        }
        _req.sendAsBinary = function (datastr) {
            function byteValue(x) {
                return x.charCodeAt(0) & 0xff;
            }

            var ords = Array.prototype.map.call(datastr, byteValue);
            var ui8a = new Uint8Array(ords);
            this.send(ui8a.buffer);
        }

        return _req;
    }

    my_aqua.domain = function () {
    }

    my_aqua.domain.getDomainMetadata = function () {
        var accessKeyId = my_aqua.accessKeyId;
        var secretAccessKey = my_aqua.secretAccessKey;
        var domain = my_aqua.domainURI;

        var method = "GET";
        var contentType = "application/cdmi-domain";
        var nowDateTime = new Date().getTime();
        var urlPath = my_aqua.restRoot + domain + "?metadata;";
        //var urlPath = "../aqua/rest/cdmi/cdmi_domains/default/netdisk/clouduser_999/?metadata;";

        //var url = _buildHostUrl(urlPath);
        //var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;


        var xhr = new my_aqua.xhr();
        var url = urlPath;
        xhr.open("GET", url, false);
        my_aqua.addXHRHeaderRequest(xhr, "GET", url, contentType);
        xhr.send();
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
            var tmp = JSON.parse(xhr.responseText);
            return tmp;
        } else {
            return false;
        }
    };

    my_aqua.domain.setDomainMetadata = function (putMetadata) {
        var accessKeyId = my_aqua.accessKeyId;
        var secretAccessKey = my_aqua.secretAccessKey;
        var domain = my_aqua.domainURI;

        var method = "PUT";
        var contentType = "application/cdmi-domain";
        var nowDateTime = new Date().getTime();
        var urlPath = my_aqua.restRoot + domain + "?metadata;";
        //var urlPath = "../aqua/rest/cdmi/cdmi_domains/default/netdisk/clouduser_999/?metadata;";

        //var url = _buildHostUrl(urlPath);
        //var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + url;


        var xhr = new my_aqua.xhr();
        var url = urlPath;
        xhr.open("PUT", url, false);
        my_aqua.addXHRHeaderRequest(xhr, "PUT", url, contentType);
        xhr.send('{"metadata":' + dojo.toJson(putMetadata) + '}');
        if (xhr.readyState == 4 && xhr.status == 204) {
            return true;
        } else {
            return false;
        }
    };

    my_aqua.file = function (args) {
        this.type = "aquaFile";
        this.parentObj = null;
        this.path = null;
        this.parentURI = null;
        this.domainURI = null;
        this.domainMetadata = {};
        this.domainID = null;
        this.mimetype = null;
        this.name = null;
        this.metadata = {};
        this.isExist = false;
        this.hadGetMetadata = false;
        $.extend(this, args);
        if (this.name && this.name.files) {
            var file = this.name.files[0];
            this.name = file.name;
        }
        this.parentURI = my_aqua.getParentURIByPath(this.path);
    }

    my_aqua.file.prototype.getParentURI = function () {
        var xhr = new my_aqua.xhr();
        var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name) + "?parentURI;";
        xhr.open("GET", url, false);
        my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-object");
        xhr.send();
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
            var tmp = JSON.parse(xhr.responseText);
            return tmp.parentURI;
        } else {
            return false;
        }
    };

    my_aqua.file.prototype.getMetadata = function () {
        var ret = false;
        if (this.name && this.name != "") {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name) + "?mimetype;parentURI;domainURI;metadata;replicas;objectID;mimetype;"; //original
            //        var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name);
            xhr.open("GET", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-object");
            xhr.send();
            my_aqua.printLog("my_aqua.file(" + this.name + ").getMetadata(GET) status=" + xhr.status + "\n" + xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
                var tmp = JSON.parse(xhr.responseText);
                // console.log('file.objectID: ', tmp.objectID);
                if (tmp.metadata && (!tmp.metadata.netdisk_upLoad_finish || (tmp.metadata.netdisk_upLoad_finish && tmp.metadata.netdisk_upLoad_finish == "true"))) {
                    this.hadGetMetadata = true;
                    for (var x in tmp.metadata) {
                        if (tmp.metadata[x] == null) {
                            delete(tmp.metadata[x]);
                        }
                    }
                    $.extend(this.metadata, tmp.metadata);
                    delete(this.metadata.cdmi_acl);
                    if (tmp.mimetype) {
                        this.mimetype = tmp.mimetype;
                    }
                    //add replicas
                    if (tmp.replicas) {
                        this.replicas = tmp.replicas;
                    } else {
                        this.replicas = [];
                    }
                    //console.log('188:tmp.domainURL:',tmp.domainURI);
                    if (tmp.domainURI) { //��domainURI��ѯdomain
                        this.domainURI = tmp.domainURI;
                        var xhr1 = new my_aqua.xhr();
                        var url1 = my_aqua.restRoot + this.domainURI + "?metadata:cdmi_data_redundancy;metadata:cdmi_immediate_redundancy;";
                        //console.log('193:url1: ',url1);
                        xhr1.open("GET", url1, false);
                        my_aqua.addXHRHeaderRequest(xhr1, "GET", url1, "application/cdmi-domain");
                        xhr1.send();
                        if (xhr1.readyState == 4 && xhr1.status == 200 && xhr1.responseText) {
                            var domainInfo = JSON.parse(xhr1.responseText);
                            if (domainInfo.metadata) {
                                this.domainMetadata = domainInfo.metadata;
                            }
                        }
                    }
                    if (tmp.objectID) {
                        this.objectID = tmp.objectID;

                    }
                    //                //�������
                    //                if ( tmp.domainURI ) {
                    //                    this.domainURI = tmp.domainURI;
                    //                    var xhr1 = new my_aqua.xhr( );
                    //                    var url1 = 'test.json';
                    //                    console.log('211:url1: ',url1);
                    //                    xhr1.open( "GET", url1, false );
                    //                    my_aqua.addXHRHeaderRequest( xhr1, "GET", url1, "application/cdmi-domain" );
                    //                    xhr1.send();
                    //                    if ( xhr1.readyState == 4 && xhr1.status == 200 && xhr1.responseText ) {
                    //                        var domainInfo = JSON.parse( xhr1.responseText );
                    //                        if ( domainInfo.metadata ) {
                    //                            console.log('���ص�domain��metadat: ',domainInfo.metadata);
                    //                            this.metadata = domainInfo.metadata;
                    //                        }
                    //                    } else {console.log('xhr1.readyState :',xhr1.readyState );}
                    //                }

                    //                if ( tmp.domainURI ) {              //��domainURI��ȡdomainID
                    //                    this.domainURI = tmp.domainURI;
                    //                    var xhr1 = new my_aqua.xhr( );
                    //                    var url1 = my_aqua.restRoot + this.domainURI;
                    //                    //console.log('192:url1: ',url1);
                    //                    xhr1.open( "GET", url1, false );
                    //                    my_aqua.addXHRHeaderRequest( xhr1, "GET", url1, "application/cdmi-domain" );
                    //                    xhr1.send( );
                    //                    if ( xhr1.readyState == 4 && xhr1.status == 200 && xhr1.responseText ) {
                    //                        var tmp1 = JSON.parse( xhr1.responseText );
                    //                        if ( tmp1.objectID ) {
                    //                            this.domainID = tmp1.objectID;
                    //                        }
                    //                    }
                    //                }
                    this.isExist = true;
                    ret = true;
                }
            }
        }
        return ret;
    }

    /**
     * ����ȫ���Զ���Metadata
     * @param metadata
     */
    my_aqua.file.prototype.setAllCustomMetadata = function (metadata) {

        var ret = true;
        var tmpMetadata = dojo.clone(metadata);
        if (metadata && this.isExist == true) {
            if (this.hadGetMetadata == false) {
                ret = this.getMetadata();
            }
            if (ret == true) {
                var putMetadata = {};
                for (var x in this.metadata) {
                    //if (x.indexOf("netdisk_custom_") == 0) {
                    var find = false;
                    for (var y in tmpMetadata) {
                        //if ("netdisk_custom_" + y == x) {
                        if (y == x) {
                            putMetadata[y] = tmpMetadata[y];
                            delete(tmpMetadata[y]);
                            find = true;
                            break;
                        }
                    }
                    if (find == false) {
                        //putMetadata[x.substr(15, x.length - 15)] = null;
                        putMetadata[x] = null;
                    }
                    //}
                }
                for (var x in tmpMetadata) {
                    putMetadata[x] = tmpMetadata[x];
                }
                ret = this.setMetadata(putMetadata);
            }
        } else {
            ret = false;
        }
        return ret;
    };
    my_aqua.file.prototype.setTags = function (tags) {
        if (tags && this.isExist == true) {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name) + "?";

        }
    };

    /**
     * ����Metadata
     * @param metadata
     */
    my_aqua.file.prototype.setMetadata = function (metadata) {
        var ret = false;
        if (metadata && this.isExist == true) {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name) + "?";
            var names = [];
            var putMetadata = {};
            var tmpMetadata = {};
            for (var x in metadata) {
                //names.push("metadata:netdisk_custom_" + encodeURIComponent(x));
                names.push(encodeURIComponent(x));
                //tmpMetadata["netdisk_custom_" + x] = metadata[x];
                tmpMetadata[x] = metadata[x];
                if (metadata[x] != null) {
                    //putMetadata["netdisk_custom_" + x] = metadata[x];
                    putMetadata[x] = metadata[x];
                }
            }
            if (names.length > 0) {
                url += names.join(";");
                //xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", url, 600), false);
                //xhr.setRequestHeader("Accept", "application/cdmi-object");
                //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
                //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
                //xhr.setRequestHeader("Content-Type", "application/cdmi-object");
                xhr.open("PUT", url, false);
                my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object");
                xhr.send('{"mimetype":"' + my.getContentType(this.name) + '","metadata":' + dojo.toJson(putMetadata) + '}');
                my_aqua.printLog("my_aqua.file(" + this.name + ").setMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
                if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 1223)) {
                    for (var x in tmpMetadata) {
                        if (tmpMetadata[x] == null) {
                            delete(this.metadata[x]);
                        } else {
                            this.metadata[x] = tmpMetadata[x];
                        }
                    }
                    ret = true;
                }
            }
        }
        return ret;
    }

    my_aqua.file.prototype.setMimeType = function (MimeType) {
        var ret = false;
        if (MimeType) {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name) + "?";
            url += "";
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object");
            xhr.send('{"mimetype":"' + MimeType + '"}');
            if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 1223)) {
                this.mimetype = MimeType;
                ret = true;
            }
        }
        return ret;
    }

    my_aqua.file.prototype.deleteObj = function () {

        var ret = false;
        if (this.name && this.name != "") {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name);
            // console.log('deleteObj: ', this.parentURI + '/' + this.name)
            //xhr.open("DELETE", my_aqua.getHasTokenUrl("DELETE", url, 600), false);
            //xhr.setRequestHeader("Accept", "application/cdmi-object");
            //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
            //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
            //xhr.setRequestHeader("Content-Type", "application/cdmi-object");
            xhr.open("DELETE", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "DELETE", url, "application/cdmi-object");
            xhr.send();
            my_aqua.printLog("my_aqua.file(" + this.name + ").deleteObj(DELETE) status=" + xhr.status + "\n" + xhr.responseText);
            if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 200)) {
                this.metadata = {};
                if (this.parentObj) {
                    for (var i = 0; i < this.parentObj.children.length; i++) {
                        if (this.type == "aquaFile" && this.name == this.parentObj.children[i].name && this.path == this.parentObj.children[i].path) {
                            this.parentObj.children.splice(i, 1);
                            break;
                        }
                    }
                }
                this.isExist = false;
                ret = true;
            }
        }
        return ret;
    }

    my_aqua.file.prototype.getDownloadFileURL = function (original_parentURI) {
        // console.log('getDownloadFileURL(', original_parentURI, ')')
        var ret = "";
        if (this.name && this.name != "" && this.isExist == true) {
            if (original_parentURI && original_parentURI !== '' && (original_parentURI.charAt(original_parentURI.length - 1) === '/')) {
                var url = my_aqua.restRoot_ + my_aqua.encodePath(original_parentURI) + encodeURIComponent(this.name);
            } else {
                var url = my_aqua.restRoot_ + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name);
            }
            //ret = my_aqua.addXHRHeaderRequest(null, "GET", url, "", null,true);
            ret = url;
        }
        return ret;
    }
    my_aqua.file.prototype.getDownloadFileURL_origin = function (original_parentURI) {
        // console.log('getDownloadFileURL(', original_parentURI, ')')
        var ret = "";
        if (this.name && this.name != "" && this.isExist == true) {
            if (original_parentURI && original_parentURI !== '' && (original_parentURI.charAt(original_parentURI.length - 1) === '/')) {
                var url = my_aqua.restRoot + my_aqua.encodePath(original_parentURI) + encodeURIComponent(this.name);
            } else {
                var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name);
            }
        }
        return url;
    }

    my_aqua.getDownloadFileURL = function (URI) {
        var ret = "";
        //URI有两种
        //一种是../aqua/格式
        //另一种是http://格式
        //这里统一转化为第二种格式
        if(URI.indexOf('http://')<0){
            URI = aquaHost + URI.slice(2);
        }
        if(URI.indexOf('?aquatoken=') >= 0){
            URI = URI.split("?aquatoken=")[0];
        }
        ret = my_aqua.addXHRHeaderRequest(null, "GET", URI, "");
        return ret;
    }


    my_aqua.file.prototype.rename = function (rename) {
        // console.log('aquadatacenterjs:389 rename to: ', rename);
        var ret = false;
        if (this.isExist == true && rename && rename != "") {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(rename);
            // console.log(':392: url: ', url)
            //xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", url, 600), false);
            //xhr.setRequestHeader("Accept", "application/cdmi-object");
            //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
            //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
            //xhr.setRequestHeader("Content-Type", "application/cdmi-object");
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object");
            xhr.send('{"move":"' + this.parentURI.substr(1, this.parentURI.length - 1) + this.name + '"}');
            my_aqua.printLog("my_aqua.file(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 201 && xhr.responseText) {
                this.name = rename;
                if (this.parentObj) {
                    this.parentObj.sortChildren();
                }
                ret = true;
            }
        }
        return ret;
    };

    my_aqua.file.prototype.move = function (dest_folder_url) {
        // console.log('my_aqua.file.prototype.move(', dest_folder_url, ')');
        var ret = false;
        if (this.isExist === true && dest_folder_url && dest_folder_url !== "") {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(dest_folder_url) + encodeURIComponent(this.name);
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object", 'false');
            xhr.send('{"move":"' + this.parentURI.substr(1, this.parentURI.length - 1) + this.name + '"}');
            my_aqua.printLog("my_aqua.file(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 201 && xhr.responseText) {
                if (this.parentObj) {
                    this.parentObj.sortChildren();
                }
                ret = true;
            }
        }
        // console.log("move 结果: ", ret);
        return ret;
    };

    my_aqua.file.prototype.copy = function (dest_folder_url) {
        // console.log('my_aqua.file.prototype.copy(', dest_folder_url, ')');
        // console.log("this:%o ", this);
        var ret = false;
        if (this.isExist === true && dest_folder_url && dest_folder_url !== '') {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(dest_folder_url) + encodeURIComponent(this.name);
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object");
            xhr.send('{"copy":"' + "/" + this.parentURI.substr(1, this.parentURI.length - 1) + this.name + '"}');
            my_aqua.printLog("my_aqua.file(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            // console.log(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 202) {
                ret = true;
            }
        }
        // console.log("copy 结果: ", ret);
        return ret;
    };

    my_aqua.file.prototype.link = function (dest_folder_url) {
        // console.log('link(', dest_folder_url, ')');
        var ret = false;
        if (this.isExist === true && dest_folder_url && dest_folder_url !== '') {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(dest_folder_url) + encodeURIComponent(this.name);
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object");
            xhr.setRequestHeader("x-aqua-asProxy", "true");
            // xhr.setRequestHeader("x-aqua-read-reference-redirect", "false"); // try this
            xhr.send('{"reference":"' + '/' + this.parentURI.substr(1, this.parentURI.length - 1) + this.name + '"}');
            my_aqua.printLog("my_aqua.file(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            // console.log(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 201) {
                ret = true;
            }
        }
        // console.log("link 结果: ", ret);
        return ret;
    };

// my_aqua.file.prototype.link = function(dest_folder_url) {
//     console.log('my_aqua.file.prototype.link(', dest_folder_url, ')');
//     var ret = false;
//     var original_file_obj = null;
//     if (this.isExist === true && dest_folder_url && dest_folder_url !== '') {
//         var xhr = new my_aqua.xhr();
//         var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name);
//         xhr.open("GET", url, false);
//         my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-object");
//         xhr.setRequestHeader("x-aqua-read-reference-redirect", false);
//         xhr.send();
//         my_aqua.printLog("my_aqua.file(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
//         console.log(xhr.responseText);
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             original_file_obj = JSON.parse(xhr.responseText);
//             console.log("original_file_obj : %o", original_file_obj);
//         } else {
//             return false;
//         }
//         var send_file_obj = {};
//         send_file_obj.mimetype = original_file_obj.mimetype;
//         send_file_obj.metadata = original_file_obj.metadata;
//         // send_file_obj.value = original_file_obj.value;
//         var xhr_1 = new my_aqua.xhr();
//         var url_1 = my_aqua.restRoot + my_aqua.encodePath(dest_folder_url) + encodeURIComponent(this.name);
//         xhr.open("PUT", url_1, false);
//         my_aqua.addXHRHeaderRequest(xhr, "PUT", url_1, "application/cdmi-object");
//         xhr.setRequestHeader("x-aqua-read-reference-redirect", false);
//         xhr.send(JSON.stringify(send_file_obj));
//         my_aqua.printLog("my_aqua.file(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
//     }
//     console.log("link 结果: ", ret);
//     return ret;
// };

    my_aqua.file.prototype.checkExistInSpecifiedFolder = function () {
        var ret = this.isExist;
        // console.log("path:   ", this.path);
        var file_url = my_aqua.encodePath(this.path);
        if (file_url.charAt(file_url.length - 1) === '/') {
            file_url = file_url.slice(0, -1);
        }
        var xhr = new my_aqua.xhr();
        var url = my_aqua.restRoot + file_url + '?metadata';
        xhr.open("GET", url, false);
        my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-object");
        xhr.send();
        my_aqua.printLog("my_aqua.file(" + this.name + ").checkExist(GET) status=" + xhr.status + "\n" + xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
            ret = true;
        }
        return ret;
    };

    my_aqua.file.prototype.checkExist = function () {
        var ret = this.isExist;
        if (ret == false) {
            if (this.name && this.name !== '') {
                var xhr = new my_aqua.xhr();
                var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name) + "?parentURI;metadata:netdisk_upLoad_finish";
                //xhr.open("GET", my_aqua.getHasTokenUrl("GET", url, 600), false);
                //xhr.setRequestHeader("Accept", "application/cdmi-object");
                //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
                //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
                //xhr.setRequestHeader("Content-Type", "application/cdmi-object");
                xhr.open("GET", url, false);
                my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-object");
                xhr.send();
                my_aqua.printLog("my_aqua.file(" + this.name + ").checkExist(GET) status=" + xhr.status + "\n" + xhr.responseText);
                if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
										alert(i18n("ADV_SYSUSER_ZIZHIWENJIANYICUNZAI"));
                    var tmp = JSON.parse(xhr.responseText);
                    if (tmp.metadata && (!tmp.metadata.netdisk_upLoad_finish || (tmp.metadata.netdisk_upLoad_finish && tmp.metadata.netdisk_upLoad_finish == "true"))) {
                        for (var x in tmp.metadata) {
                            if (tmp.metadata[x] == null || tmp.metadata[x] == "") {
                                tmp.metadata[x] = null;
                                delete(tmp.metadata[x]);
                            }
                        }
                        $.extend(this.metadata, tmp.metadata);
                        if (tmp.parentURI) {
                            this.parentURI = tmp.parentURI;
                        }
                        this.isExist = true;
                        ret = true;
                    }
                }
            }
        }
        return ret;
    }

    my_aqua.folder = function (args) {
        this.type = "aquaFolder";
        this.parentObj = null;
        this.subFolderSort = "name";
        this.subFolderSortType = "string";
        this.subFileSort = "name";
        this.subFileSortType = "string";
        this.path = null;
        this.parentURI = null;
        this.name = null;
        this.query = null;
        this.metadata = {};
        this.domainURI = null;
        this.domainMetadata = {};
        this.children = [];
        this.isExist = false;
        this.hadGetMetadata = false;
        this.domainID = null;
        $.extend(this, args);
        this.parentURI = my_aqua.getParentURIByPath(this.path);

    }

    my_aqua.folder.prototype.pasteByMove = function (aquaObject) {
        var ret = false;
        if (this.isExist == true && aquaObject.type == "aquaFile" && aquaObject.name != "" && aquaObject.name != null && aquaObject.isExist == true) {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + (aquaObject.name ? (encodeURIComponent(aquaObject.name)) : "");
            //xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", url, 600), false);
            //xhr.setRequestHeader("Accept", "application/cdmi-object");
            //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
            //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
            //xhr.setRequestHeader("Content-Type", "application/cdmi-object");
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object");
            xhr.send('{"move":"' + aquaObject.parentURI.substr(1, aquaObject.parentURI.length - 1) + aquaObject.name + '"}');
            my_aqua.printLog("my_aqua.folder(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 201 && xhr.responseText) {
                var tmp = JSON.parse(xhr.responseText);
                if (aquaObject.parentObj) {
                    for (var i = 0; i < aquaObject.parentObj.children.length; i++) {
                        if (aquaObject.name == aquaObject.parentObj.children[i].name && aquaObject.path == aquaObject.parentObj.children[i].path) {
                            aquaObject.parentObj.children.splice(i, 1);
                            break;
                        }
                    }
                }
                aquaObject.parentObj = this;
                aquaObject.parentURI = this.parentURI + (this.name ? (this.name + "/") : "");
                if (tmp.parentURI) {
                    aquaObject.parentURI = tmp.parentURI;
                }
                aquaObject.path = my_aqua.getPathByParentURI(aquaObject.parentURI);
                this.children.push(aquaObject);
                this.sortChildren();
                ret = true;
            }
        } else if (aquaObject.type == "aquaFolder" && aquaObject.name != "" && aquaObject.name != null && aquaObject.isExist == true) {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + (aquaObject.name ? (encodeURIComponent(aquaObject.name) + "/") : "");
            //xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", url, 600), false);
            //xhr.setRequestHeader("Accept", "application/cdmi-container");
            //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
            //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
            //xhr.setRequestHeader("Content-Type", "application/cdmi-container");
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
            xhr.send('{"move":"' + aquaObject.parentURI.substr(1, aquaObject.parentURI.length - 1) + aquaObject.name + '/"}');
            my_aqua.printLog("my_aqua.folder(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 201 && xhr.responseText) {
                var tmp = JSON.parse(xhr.responseText);
                if (aquaObject.parentObj) {
                    for (var i = 0; i < aquaObject.parentObj.children.length; i++) {
                        if (aquaObject.name == aquaObject.parentObj.children[i].name && aquaObject.path == aquaObject.parentObj.children[i].path) {
                            aquaObject.parentObj.children.splice(i, 1);
                            break;
                        }
                    }
                }
                aquaObject.parentObj = this;
                aquaObject.parentURI = this.parentURI + (this.name ? (this.name + "/") : "");
                if (tmp.parentURI) {
                    aquaObject.parentURI = tmp.parentURI;
                }
                aquaObject.path = my_aqua.getPathByParentURI(aquaObject.parentURI);
                this.children.push(aquaObject);
                this.sortChildren();
                ret = true;
            }
        }
        return ret;
    }

    my_aqua.folder.prototype.rename = function (rename) {
        var ret = false;
        if (this.isExist == true && rename && rename != "") {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(rename) + "/";
            //xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", url, 600), false);
            //xhr.setRequestHeader("Accept", "application/cdmi-object");
            //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
            //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
            //xhr.setRequestHeader("Content-Type", "application/cdmi-object");
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
            xhr.send('{"move":"' + this.parentURI.substr(1, this.parentURI.length - 1) + this.name + '/"}');
            my_aqua.printLog("my_aqua.folder(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 201 && xhr.responseText) {
                this.name = rename;
                if (this.parentObj) {
                    this.parentObj.sortChildren();
                }
                ret = true;
            }
        }
        return ret;
    };

    my_aqua.folder.prototype.download = function (metada, container) {

        var ret = false;
        /*
         var xhr = new my_aqua.xhr();
         var url = "../aqua/rest/compressed/default/netdisk/clouduser_999/1_2_3/?metadata=true&recursive=true";
         xhr.open("GET", url, false);
         my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/zip");
         xhr.send();
         if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 200)) {
         console.log(xhr.responseText);
         }
         */

        var contentType = "application/cdmi-object";
        var nowDateTime = new Date().getTime();
        var url = my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.name);
        var urlPath = "/aqua/rest/compressed/" + url;
        var uriprefix = urlPath;
        var expires = nowDateTime + 1209600000;
        var StringToSign = "GET" + "\n" + expires + "\n" + uriprefix;
        var aquatoken = my_aqua.accessKeyId + ":" + _base64Encode(_str_hmac_sha1(my_aqua.secretAccessKey, StringToSign));

        var downCWURL = urlPath + "?aquatoken=" + encodeURIComponent(aquatoken) + "&expires=" + expires + "&uriprefix=" + uriprefix + "&metadata=" + metada + "&recursive=" + container;
        return downCWURL;


        /*
         var contentType = "application/cdmi-object";
         var nowDateTime = new Date().getTime();
         var urlPath = "/aqua/rest/compressed/default/netdisk/clouduser_999/1_2_3/";
         //生成token
         var uriprefix = urlPath;
         var expires = nowDateTime + 1209600000;
         //var StringToSign = "GET" + "\n" + nowDateTime + "\n" + urlPath;

         var StringToSign = "GET" + "\n" + expires + "\n" + uriprefix;
         var aquatoken = my_aqua.accessKeyId + ":" + _base64Encode(_str_hmac_sha1(my_aqua.secretAccessKey, StringToSign));

         var downCWURL = urlPath + "?metadata=true&recursive=true&aquatoken="+encodeURIComponent(aquatoken) + "&expires="+expires;
         */
        jQuery.ajax({
            type: "get",
            url: downCWURL,
            async: false,
            timeout: 2000,
        })

        /*jQuery.ajax({
         type: "get",
         url: "http://172.16.20.131:8080/aqua/rest/compressed/pannel/?metadata=true&recursive=true",
         async: false,
         timeout: 2000,
         dataType: "json",
         headers: {
         "Accept": "application/zip",
         "Authorization": "AQUA " + my_aqua.accessKeyId + ":" + _base64Encode(_str_hmac_sha1(my_aqua.secretAccessKey, StringToSign)),
         "x-aqua-date": new Date().getTime(),
         "x-aqua-read-reference-redirect": false
         }
         }).done(function () {
         console.log("完成");
         return true;
         }).fail(function (jqXHR, textStatus, errorThrown) {
         console.log("失败");
         });
         */
        return ret;
    };


    my_aqua.folder.prototype.move = function (dest_folder_url) {
        // console.log('my_aqua.folder.prototype.move(', arguments, ')');
        var ret = false;
        if (this.isExist === true && dest_folder_url && dest_folder_url !== "") {
            var xhr = new my_aqua.xhr();
            // var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(newContainer) + '/' + encodeURIComponent(this.name) + '/';
            var url = my_aqua.restRoot + my_aqua.encodePath(dest_folder_url) + encodeURIComponent(this.name) + '/';
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
            xhr.send('{"move":"' + this.parentURI.substr(1, this.parentURI.length - 1) + this.name + '/' + '"}'); //要加'/'
            my_aqua.printLog("my_aqua.folder(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 201 && xhr.responseText) {
                // this.name = rename;
                if (this.parentObj) {
                    this.parentObj.sortChildren();
                }
                ret = true;
            }
        }
        // console.log("move folder 结果: ", ret);
        return ret;
    };

    my_aqua.folder.prototype.copy = function (dest_folder_url) {
        // console.log('my_aqua.folder.prototype.copy(', dest_folder_url, ')');
        // console.log("this:%o ", this);
        var ret = false;
        if (this.isExist === true && dest_folder_url && dest_folder_url !== '') {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(dest_folder_url) + encodeURIComponent(this.name) + '/';
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
            xhr.send('{"copy":"' + "/" + this.parentURI.substr(1, this.parentURI.length - 1) + this.name + '/' + '"}'); //要加'/'
            my_aqua.printLog("my_aqua.folder(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            // console.log(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 201) {
                ret = true;
            }
        }
        // console.log("copy folder 结果: ", ret);
        return ret;
    };

    my_aqua.folder.prototype.link = function (dest_folder_url) {
        // console.log('my_aqua.folder.prototype.link(', dest_folder_url, ')');
        var ret = false;
        if (this.isExist === true && dest_folder_url && dest_folder_url !== '') {
            var xhr = new my_aqua.xhr();
            var url = my_aqua.restRoot + my_aqua.encodePath(dest_folder_url) + encodeURIComponent(this.name) + '/';
            xhr.open("PUT", url, false);
            my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
            xhr.setRequestHeader("x-aqua-asProxy", "true");
            // xhr.setRequestHeader("x-aqua-read-reference-redirect", "false"); // try this
            xhr.send('{"reference":"' + this.parentURI.substr(1, this.parentURI.length - 1) + this.name + '/' + '"}'); //要加'/'
            my_aqua.printLog("my_aqua.folder(" + this.name + ").getMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
            // console.log(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == 201) {
                ret = true;
            }
        }
        // console.log("link folder 结果: ", ret);
        return ret;
    };

    my_aqua.folder.prototype.checkExistInSpecifiedFolder = function () {
        var ret = this.isExist;
        // console.log("path:   ", this.path);
        var file_url = my_aqua.encodePath(this.path);
        if (file_url.charAt(file_url.length - 1) === '/') {
            console.log(file_url);
        }
        var xhr = new my_aqua.xhr();
        var url = my_aqua.restRoot + file_url + '?metadata';
        xhr.open("GET", url, false);
        my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-container");
        xhr.send();
        my_aqua.printLog("my_aqua.folder(" + this.name + ").checkExist(GET) status=" + xhr.status + "\n" + xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
            ret = true;
        }
        return ret;
    };

    /*
     my_aqua.folder.prototype.getMetadata = function() {
     var ret = false;
     var xhr = new my_aqua.xhr();
     var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + "?parentURI;domainID;childrenrange;metadata;objectID;";
     xhr.open("GET", url, false);
     my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-container");
     xhr.send();
     my_aqua.printLog("my_aqua.folder(" + this.name + ").getMetadata(GET) status=" + xhr.status + "\n" + xhr.responseText);
     if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
     var tmp = JSON.parse(xhr.responseText);
     // console.log('folder.objectID: ', tmp.objectID);
     if (tmp.metadata) {
     for (var x in tmp.metadata) {
     if (tmp.metadata[x] == null) {
     delete(tmp.metadata[x]);
     }
     }
     $.extend(this.metadata, tmp.metadata);
     delete(this.metadata.cdmi_acl);
     if (tmp.parentURI) {
     this.parentURI = tmp.parentURI;
     }
     if (tmp.objectID) {
     this.objectID = tmp.objectID;
     }

     // if (tmp.objectID) {
     //     this.objectID = tmp.objectID;
     //     console.log("this.objectID: ", this.objectID);
     //     var xhr2 = new my_aqua.xhr();
     //     var url2 = my_aqua.restRoot + "/cdmi_objectid/" + this.objectID + "/";
     //     xhr2.open("GET", url2, false);
     //     my_aqua.addXHRHeaderRequest(xhr1, "GET", url, "application/cdmi-container");
     //     xhr2.send();
     //     if (xhr2.readyState == 4 && xhr2.status == 200 && xhr2.responseText) {
     //         var tmp2 = JSON.parse(xhr2.responseText);
     //         console.log("用文件的objectID查询后的返回: %o", tmp2);
     //         // if (tmp2.domainURI) {
     //         //     this.domainURI = tmp2.domainURI;
     //         // }
     //     }
     // }
     if (tmp.domainID) {
     this.domainID = tmp.domainID;
     var xhr1 = new my_aqua.xhr();
     url = my_aqua.restRoot + "/cdmi_objectid/" + this.domainID + "?domainURI;";
     xhr1.open("GET", url, false);
     my_aqua.addXHRHeaderRequest(xhr1, "GET", url, "application/cdmi-domain");
     xhr1.send();
     if (xhr1.readyState == 4 && xhr1.status == 200 && xhr1.responseText) {
     var tmp1 = JSON.parse(xhr1.responseText);
     if (tmp1.metadata) {
     $.extend(this.domainMetadata, tmp1.metadata);
     }
     if (tmp1.domainURI) {
     this.domainURI = tmp1.domainURI;
     }
     }
     }
     this.hadGetMetadata = true;
     this.isExist = true;
     ret = true;
     }
     }
     return ret;
     }
     */

    my_aqua.folder.prototype.getMetadata = function () {
        var ret = false;
        var xhr = new my_aqua.xhr();
        var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + "?parentURI;domainID;childrenrange;metadata;objectID;";
        xhr.open("GET", url, false);
        my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-container");
    xhr.send();
    my_aqua.printLog("my_aqua.folder(" + this.name + ").getMetadata(GET) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
      var tmp = JSON.parse(xhr.responseText);
      // console.log('folder.objectID: ', tmp.objectID);
      if (tmp.metadata) {
        for (var x in tmp.metadata) {
          if (tmp.metadata[x] == null) {
            delete(tmp.metadata[x]);
          }
        }
        $.extend(this.metadata, tmp.metadata);
        delete(this.metadata.cdmi_acl);
        if (tmp.parentURI) {
          this.parentURI = tmp.parentURI;
        }
        if (tmp.objectID) {
          this.objectID = tmp.objectID;
        }

        if (tmp.objectID) {
          this.objectID = tmp.objectID;
          console.log("this.objectID: ", this.objectID);

          var xhr3 = new my_aqua.xhr();
          var url = "/aqua/rest/cdmi/cdmi_objectid/" + this.objectID;
          xhr3.open("GET", url, false);
          my_aqua.addXHRHeaderRequest(xhr3, "GET", url, "application/cdmi-container");
          xhr3.send();
          if (xhr3.readyState == 4 && xhr3.status == 200 && xhr3.responseText) {
            var tmp2 = JSON.parse(xhr3.responseText);
            this.allproperty = tmp2;
            //tmp2就是完整版了， 应该没有太大问题


            /*
             1.UI设定
             依样画葫芦 添加ACL管理这一栏。
             注意只有文件夹才能有这权力

             2.后端接口依旧是问题
             读取到ACL 如何判断这数据的含义？
             如何配置ACL 保存自己的想法？

             */

            /*
             var xhr3 = new my_aqua.xhr();
             var url = "/aqua/rest/cdmi/cdmi_objectid/" + this.objectID;
             xhr3.open("PUT", url, false);
             my_aqua.addXHRHeaderRequest(xhr3, "PUT", url, "application/cdmi-container");
             xhr3.send(dojo.toJson(tmp2));
             */
          }
        }
        if (tmp.domainID) {
          this.domainID = tmp.domainID;
          var xhr1 = new my_aqua.xhr();
          url = my_aqua.restRoot + "/cdmi_objectid/" + this.domainID + "?domainURI;";
          xhr1.open("GET", url, false);
          my_aqua.addXHRHeaderRequest(xhr1, "GET", url, "application/cdmi-domain");
          xhr1.send();
          if (xhr1.readyState == 4 && xhr1.status == 200 && xhr1.responseText) {
            var tmp1 = JSON.parse(xhr1.responseText);
            if (tmp1.metadata) {
              $.extend(this.domainMetadata, tmp1.metadata);
            }
            if (tmp1.domainURI) {
              this.domainURI = tmp1.domainURI;
            }
          }
        }
        this.hadGetMetadata = true;
        this.isExist = true;
        ret = true;
      }
    }
    return ret;
  }

  my_aqua.folder.prototype.setACL = function (value1, value2) {
    console.log("setACL ing~");
    var ret = false;
    var xhr3 = new my_aqua.xhr();
    var url = "/aqua/rest/cdmi/cdmi_objectid/" + this.objectID + '/?metadata';
    xhr3.open("PUT", url, false);
    my_aqua.addXHRHeaderRequest(xhr3, "PUT", url, "application/cdmi-container");


    switch (value1) {
      case "readonly":
        var obj1 = {
          "acetype": "ALLOW",
          "identifier": "EVERYONE@",
          "aceflags": "NO_PROPAGATE",
          "acemask": "READ_OBJECT, READ_ATTRIBUTES, READ_METADATA, LIST_CONTAINER, EXECUTE"
        }
        var obj2 = {
          "acetype": "ALLOW",
          "identifier": "ANONYMOUS@",
          "aceflags": "NO_PROPAGATE",
          "acemask": "READ_OBJECT, READ_ATTRIBUTES, READ_METADATA, LIST_CONTAINER, EXECUTE"
        }
        break;
      case "readwrite":
        var obj1 = {
          "acetype": "ALLOW",
          "identifier": "EVERYONE@",
          "aceflags": "NO_PROPAGATE",
          "acemask": "WRITE_OBJECT,DELETE, ADD_OBJECT, APPEND_DATA, ADD_SUBCONTAINER,WRITE_METADATA,DELETE_OBJECT,DELETE_SUBCONTAINER,DELETE_SUBCONTAINER"
        }
        var obj2 = {
          "acetype": "ALLOW",
          "identifier": "ANONYMOUS@",
          "aceflags": "NO_PROPAGATE",
          "acemask": "WRITE_OBJECT,DELETE, ADD_OBJECT, APPEND_DATA, ADD_SUBCONTAINER,WRITE_METADATA,DELETE_OBJECT,DELETE_SUBCONTAINER,DELETE_SUBCONTAINER"
        }
        break;
      case "readwriteall":
        var obj1 = {
          "acetype": "ALLOW",
          "identifier": "EVERYONE@",
          "aceflags": "NO_PROPAGATE",
          "acemask": "READ_ACL,WRITE_ACL,READ_OBJECT, READ_ATTRIBUTES, READ_METADATA, LIST_CONTAINER, EXECUTE,WRITE_OBJECT,DELETE, ADD_OBJECT, APPEND_DATA, ADD_SUBCONTAINER,WRITE_METADATA,DELETE_OBJECT,DELETE_SUBCONTAINER,DELETE_SUBCONTAINER"
        }
        var obj2 = {
          "acetype": "ALLOW",
          "identifier": "ANONYMOUS@",
          "aceflags": "NO_PROPAGATE",
          "acemask": "READ_ACL,WRITE_ACL,READ_OBJECT, READ_ATTRIBUTES, READ_METADATA, LIST_CONTAINER, EXECUTE,WRITE_OBJECT,DELETE, ADD_OBJECT, APPEND_DATA, ADD_SUBCONTAINER,WRITE_METADATA,DELETE_OBJECT,DELETE_SUBCONTAINER,DELETE_SUBCONTAINER"
        }
        break;
      default:
    }
    switch (value2) {
      case "readonly":
        var obj3 = {
          "acetype": "ALLOW",
          "identifier": "AUTHENTICATED@",
          "aceflags": "NO_PROPAGATE",
          "acemask": "READ_OBJECT, READ_ATTRIBUTES, READ_METADATA, LIST_CONTAINER, EXECUTE"
        }
        break;
      case "readwrite":
        var obj3 = {
          "acetype": "ALLOW",
          "identifier": "AUTHENTICATED@",
          "aceflags": "NO_PROPAGATE",
          "acemask": "WRITE_OBJECT,DELETE, ADD_OBJECT, APPEND_DATA, ADD_SUBCONTAINER,WRITE_METADATA,DELETE_OBJECT,DELETE_SUBCONTAINER,DELETE_SUBCONTAINER"
        }
        break;
      case "readwriteall":
        var obj3 = {
          "acetype": "ALLOW",
          "identifier": "AUTHENTICATED@",
          "aceflags": "NO_PROPAGATE",
          "acemask": "READ_ACL,WRITE_ACL,READ_OBJECT, READ_ATTRIBUTES, READ_METADATA, LIST_CONTAINER, EXECUTE,WRITE_OBJECT,DELETE, ADD_OBJECT, APPEND_DATA, ADD_SUBCONTAINER,WRITE_METADATA,DELETE_OBJECT,DELETE_SUBCONTAINER,DELETE_SUBCONTAINER"
        }
        break;
    }
    var tmp2 = {};
    tmp2.metadata = {};
    tmp2.metadata.cdmi_acl = [];
    tmp2.metadata.cdmi_acl.push(obj1);
    tmp2.metadata.cdmi_acl.push(obj2);
    tmp2.metadata.cdmi_acl.push(obj3);

    xhr3.send(dojo.toJson(tmp2));
    if (xhr3.readyState == 4 && xhr3.status == 200 && xhr3.responseText) {
      var tmp2 = JSON.parse(xhr3.responseText);
    }
    this.getMetadata();
    return ret;
  }

  my_aqua.folder.prototype.getACL = function () {
    var cmdi_acl_tmp = this.allproperty.metadata.cdmi_acl;
    var READ_ACL = "0x00020000";
    var WRITE_ACL = "0x00040000";
    var WRITE_OBJECT = "0x00000002";
    var READ_OBJECT = "0x00000001";
    var LIST_CONTAINER = "0x00000001";
    var WRITE_OBJECT = "0x00000002";
    var ADD_OBJECT = "0x00000002";
    var APPEND_DATA = "0x00000004";
    var ADD_SUBCONTAINER = "0x00000004";
    var READ_METADATA = "0x00000008";
    var WRITE_METADATA = "0x00000010";
    var EXECUTE = "0x00000020";
    var DELETE_OBJECT = "0x00000040";
    var DELETE_SUBCONTAINER = "0x00000040";
    var READ_ATTRIBUTES = "0x00000080";
    var WRITE_ATTRIBUTES = "0x00000100";
    var WRITE_RETENTION = "0x00000200";
    var WRITE_RETENTION_HOLD = "0x00000400";
    var DELETE = "0x00010000";
    var WRITE_OWNER = "0x00080000";
    var SYNCHRONIZE = "0x00100000";

    var readonly = parseInt(READ_OBJECT) | parseInt(READ_ATTRIBUTES) | parseInt(READ_METADATA) | parseInt(LIST_CONTAINER) | parseInt(EXECUTE);

    var readwrite = parseInt(WRITE_OBJECT) | parseInt(DELETE) | parseInt(ADD_OBJECT) | parseInt(APPEND_DATA) | parseInt(ADD_SUBCONTAINER) | parseInt(WRITE_METADATA) | parseInt(DELETE_OBJECT) | parseInt(DELETE_SUBCONTAINER) | parseInt(DELETE_SUBCONTAINER);

    var readwriteall = readonly | readwrite | parseInt(READ_ACL) | parseInt(WRITE_ACL);

    var AUTHENTICATED_value = "";
    var EVERYONE_value = "";

    $.each(cmdi_acl_tmp, function (i) {
      if ((cmdi_acl_tmp[i].identifier == "EVERYONE@") && (EVERYONE_value == "")) {
        if ((parseInt(cmdi_acl_tmp[i].acemask) & readwriteall) == readwriteall) {
          EVERYONE_value = "readwriteall";
        }
        else if ((parseInt(cmdi_acl_tmp[i].acemask) & readwrite) == readwrite) {
          EVERYONE_value = "readwrite";
        }
        else if ((parseInt(cmdi_acl_tmp[i].acemask) & readonly ) == readonly) {
          EVERYONE_value = "readonly";
        }
        else {

        }
      }
      if ((cmdi_acl_tmp[i].identifier == "ANONYMOUS@") && (EVERYONE_value == "")) {
        if ((parseInt(cmdi_acl_tmp[i].acemask) & readwriteall) == readwriteall) {
          EVERYONE_value = "readwriteall";
        }
        else if ((parseInt(cmdi_acl_tmp[i].acemask) & readwrite) == readwrite) {
          EVERYONE_value = "readwrite";
        }
        else if ((parseInt(cmdi_acl_tmp[i].acemask) & readonly ) == readonly) {
          EVERYONE_value = "readonly";
        }
        else {

        }
      }
      if ((cmdi_acl_tmp[i].identifier == "AUTHENTICATED@") && (AUTHENTICATED_value == "")) {
        if ((parseInt(cmdi_acl_tmp[i].acemask) & readwriteall ) == readwriteall) {
          AUTHENTICATED_value = "readwriteall";
        }
        else if ((parseInt(cmdi_acl_tmp[i].acemask) & readwrite ) == readwrite) {
          AUTHENTICATED_value = "readwrite";
        }
        else if ((parseInt(cmdi_acl_tmp[i].acemask) & readonly ) == readonly) {
          AUTHENTICATED_value = "readonly";
        }
        else {

        }
      }
    });
    return [AUTHENTICATED_value, EVERYONE_value];
  }

  /**
   * ����ȫ���Զ���Metadata
   * @param metadata
   */
  my_aqua.folder.prototype.setAllCustomMetadata = function (metadata) {
    var ret = true;
    var tmpMetadata = dojo.clone(metadata);
    if (metadata && this.isExist == true) {
      if (this.hadGetMetadata == false) {
        ret = this.getMetadata();
      }
      if (ret == true) {
        var putMetadata = {};
        for (var x in this.metadata) {
          //if (x.indexOf("netdisk_custom_") == 0) {
          var find = false;
          for (var y in tmpMetadata) {
            //if ("netdisk_custom_" + y == x) {
            if (y == x) {
              putMetadata[y] = tmpMetadata[y];
              delete(tmpMetadata[y]);
              find = true;
              break;
            }
          }
          if (find == false) {
            //putMetadata[x.substr(15, x.length - 15)] = null;
            putMetadata[x] = null;
          }
          //}
        }
        for (var x in tmpMetadata) {
          putMetadata[x] = tmpMetadata[x];
        }
        ret = this.setMetadata(putMetadata);
      }
    } else {
      ret = false;
    }
    return ret;
  };

  /**
   * ����Metadata
   * @param metadata
   */
  my_aqua.folder.prototype.setMetadata = function (metadata) {
    var ret = false;
    if (metadata && this.isExist == true) {
      var xhr = new my_aqua.xhr();
      var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + "?";
      var names = [];
      var tmpMetadata = {};
      var putMetadata = {};
      for (var x in metadata) {
        //names.push("metadata:netdisk_custom_" + encodeURIComponent(x));
        names.push(encodeURIComponent(x));
        //tmpMetadata["netdisk_custom_" + x] = metadata[x];
        tmpMetadata[x] = metadata[x];
        if (metadata[x] != null) {
          //putMetadata["netdisk_custom_" + x] = metadata[x];
          putMetadata[x] = metadata[x];
        }
      }
      if (names.length > 0) {
        url += names.join(";");
        //xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", url, 600), false);
        //xhr.setRequestHeader("Accept", "application/cdmi-container");
        //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
        //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
        //xhr.setRequestHeader("Content-Type", "application/cdmi-container");
        xhr.open("PUT", url, false);
        my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
        xhr.send('{"metadata":' + dojo.toJson(putMetadata) + '}');
        my_aqua.printLog("my_aqua.folder(" + this.name + ").setMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
        if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 1223)) {
          for (var x in tmpMetadata) {
            if (tmpMetadata[x] == null) {
              delete(this.metadata[x]);
            } else {
              this.metadata[x] = tmpMetadata[x];
            }
          }
          ret = true;
        }
      }
    }
    return ret;
  }

  my_aqua.folder.prototype.deleteObj = function () {
    var ret = false;
    var xhr = new my_aqua.xhr();
    var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "");
    //xhr.open("DELETE", my_aqua.getHasTokenUrl("DELETE", url, 600), false);
    //xhr.setRequestHeader("Accept", "application/cdmi-container");
    //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
    //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
    //xhr.setRequestHeader("Content-Type", "application/cdmi-container");
    xhr.open("DELETE", url, false);
    my_aqua.addXHRHeaderRequest(xhr, "DELETE", url, "application/cdmi-container");
    xhr.send();
    my_aqua.printLog("my_aqua.folder(" + this.name + ").deleteObj(DELETE) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 200)) {
      this.metadata = {};
      this.children = [];
      if (this.parentObj) {
        for (var i = 0; i < this.parentObj.children.length; i++) {
          if (this.type == "aquaFolder" && this.name == this.parentObj.children[i].name && this.path == this.parentObj.children[i].path) {
            this.parentObj.children.splice(i, 1);
            break;
          }
        }
      }
      this.isExist = false;
      ret = true;
    }
    return ret;
  }

  my_aqua.folder.prototype.checkExist = function () {
    var ret = this.isExist;
    if (ret == false) {
      var xhr = new my_aqua.xhr();
      var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + "?parentURI;domainID";
      //xhr.open("GET", my_aqua.getHasTokenUrl("GET", url, 600), false);
      //xhr.setRequestHeader("Accept", "application/cdmi-container");
      //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
      //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
      //xhr.setRequestHeader("Content-Type", "application/cdmi-container");
      xhr.open("GET", url, false);
      my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-container");
      xhr.send();
      my_aqua.printLog("my_aqua.folder(" + this.name + ").checkExist(GET) status=" + xhr.status + "\n" + xhr.responseText);
      if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
        var tmp = JSON.parse(xhr.responseText);
        if (tmp.parentURI) {
          this.parentURI = tmp.parentURI;
        }
        if (tmp.domainID) {
          this.domainID = tmp.domainID;
        }
        this.isExist = true;
        ret = true;
      }
    }
    return ret;
  }

  my_aqua.folder.prototype._sortFun = function (a, b, sort, sortType) {
    var ret = 0;
    var desc = false;
    var sortField = dojo.clone(sort);
    if (sortField.indexOf("-") == 0) {
      desc = true;
      sortField = sortField.substr(1, sortField.length - 1);
    }
    sortField = sortField.split(".");

    var strA = a;
    var strB = b;
    for (var i = 0; i < sortField.length; i++) {
      if (strA) {
        strA = strA[sortField[i]];
      }
    }
    for (var i = 0; i < sortField.length; i++) {
      if (strB) {
        strB = strB[sortField[i]];
      }
    }

    if (strA && strB) {
      switch (sortType) {
        case "string":
        {
          ret = strA.localeCompare(strB);
          break;
        }
        case "number":
        {
          ret = Number(strA) - Number(strB);
          break;
        }
        default:
          ret = 0;
          break;
      }
    } else if (!strA && strB) {
      ret = -1;
    } else if (!strA && !strB) {
      ret = 0;
    }
    if (desc == true) {
      ret = 0 - ret;
    }
    return ret;
  };

  /**
   * param: subFolderSort,subFolderSortType,subFileSort,subFileSortType
   */
  my_aqua.folder.prototype.sortChildren = function () {
    var _self = this;
    if (arguments.length == 4) {
      this.subFolderSort = arguments[0];
      this.subFolderSortType = arguments[1];
      this.subFileSort = arguments[2];
      this.subFileSortType = arguments[3];
    }
    if (this.children.length > 0) {
      if ((this.subFolderSort != null && this.subFolderSort != "") || (this.subFileSort != null && this.subFileSort != "")) {
        var folderChildren = [];
        var fileChildren = [];
        for (var i = 0; i < this.children.length; i++) {
          if (this.children[i].type == "aquaFolder") {
            folderChildren.push(this.children[i]);
          } else if (this.children[i].type == "aquaFile") {
            fileChildren.push(this.children[i]);
          }
        }
        if (folderChildren.length > 0 && this.subFolderSort != null && this.subFolderSort != "") {
          folderChildren.sort(function (a, b) {
            return _self._sortFun(a, b, _self.subFolderSort, _self.subFolderSortType);
          });
        }
        if (fileChildren.length > 0 && this.subFileSort != null && this.subFileSort != "") {
          fileChildren.sort(function (a, b) {
            return _self._sortFun(a, b, _self.subFileSort, _self.subFileSortType);
          });
        }
        this.children = [];
        for (var i = 0; i < folderChildren.length; i++) {
          this.children.push(folderChildren[i]);
        }
        for (var i = 0; i < fileChildren.length; i++) {
          this.children.push(fileChildren[i]);
        }
      }
    }
  }
  // http://172.16.20.131:8080/aqua/rest/cdmi/cdmi_query?range=1-10
  my_aqua.folder.prototype.getChildren = function (folderName, folderParentURI) {
    // console.log('my_aqua.folder.prototype.getChildren(', folderName, ',', folderParentURI, ')')
    // console.log('this.name,this.parentURI: ', this.name, this.parentURI)

    var ret = true;

    var that_name = (this.name ? (encodeURIComponent(this.name) + "/") : ""); // Pagination display
    var that_path = my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "");
    var that_query = (this.query ? this.query : null); // Pagination display

    my_aqua.waitDiv.style.display = "";
    //try {
    var xhr = new my_aqua.xhr();
    var urls = [];
    // if (!this.query) {
    //     var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + "?children";
    //     //var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + "";
    //     // console.log(':948:')
    //     //xhr.open("GET", my_aqua.getHasTokenUrl("GET", url, 600), false);
    //     //xhr.setRequestHeader("Accept", "application/cdmi-container");
    //     //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
    //     //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
    //     //xhr.setRequestHeader("Content-Type", "application/cdmi-container");
    //     xhr.open("GET", url, false);
    //     my_aqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-container");
    //     xhr.send();
    //     my_aqua.printLog("my_aqua.folder(" + this.name + ").getChildren(GET-childrenIds) status=" + xhr.status + "\n" + xhr.responseText);
    //     if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
    //         var tmp = JSON.parse(xhr.responseText);
    //         if (tmp.childrenIds && tmp.childrenIds.length > 0) {
    //             for (var i = 0; i <= tmp.childrenIds.length / 50 && i < 5; i++) {
    //                 var start = i * 50;
    //                 var end = start + 50;
    //                 if (start < tmp.childrenIds.length) {
    //                     if (end > tmp.childrenIds.length) {
    //                         end = tmp.childrenIds.length;
    //                     }
    //                     var tmpArray = tmp.childrenIds.slice(start, end);
    //                     urls.push(my_aqua.restRoot + "/cdmi_search/cdmi_objectid/?ids=" + tmpArray.join(","));
    //                 }
    //             }
    //         }
    //     }
    // } else {
    //     urls[0] = my_aqua.restRoot + "/cdmi_search/?";
    //     var str = [];
    //     if (my_aqua.domainID != null) {
    //         str.push("domainID=" + my_aqua.domainID);
    //     }
    //     for (var x in this.query) {
    //         str.push(x + "=" + this.query[x]);
    //     }
    //     urls[0] += str.join("&");
    // }
    // if (urls.length > 0) {
    this.children = [];
    //for ( var j = 0; j < urls.length; j++ ) {
    //xhr.open("GET", my_aqua.getHasTokenUrl("GET", urls[j], 600), false);
    //xhr.setRequestHeader("Accept", "application/cdmi-object");
    //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
    //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
    //xhr.setRequestHeader("Content-Type", "application/cdmi-object");

    var _url = "/aqua/rest/cdmi/cdmi_query?range=" + Pagination.pageStart + "-" + Pagination.pageEnd + "&sort=type-" + (Pagination.sortType ? "," + Pagination.sortType : "");
    xhr.open("PUT", _url, false);
    // my_aqua.addXHRHeaderRequest(xhr, "PUT", _url, "application/cdmi-container"); //所有文件夹
    my_aqua.addXHRHeaderRequest(xhr, "PUT", _url, (this.query == null) ? "application/cdmi-node" : "application/cdmi-object");
    xhr.send(
        (function () {
          var ret = null;
          if (that_query == null) {
            ret = JSON.stringify({
              "cdmi_scope_specification": [{
                // "parentURI" : "== " + my_aqua.netdiskRoot + "/" + that_name
                "parentURI": "== " + decodeURIComponent(that_path)
              }]
            });
          } else if (typeof that_query.tags === 'string') {
            //                    console.log('928: 搜索tag: that_query ', that_query.tags);

            var _body = {
              "cdmi_scope_specification": []
            };
            _body.cdmi_scope_specification.push({
              "domainURI": "== " + my_aqua.netdiskRoot,
              "metadata": {
                "tags": "== " + that_query.tags
              }
            });

            ret = JSON.stringify(_body);
          } else {
            //                    console.log('940 : not a tag :', that_query);
            var _body = {
              "cdmi_scope_specification": []
            };
            var _array = that_query.objectName.split(",");
            $.each(_array, function (index, val) {
              _body.cdmi_scope_specification.push({
                //                                    "parentURI" : "== " + my_aqua.netdiskRoot
                "domainURI": "== " + my_aqua.netdiskRoot,
                "objectName": "contains " + val
              });
            });
            ret = JSON.stringify(_body);
          }
          return ret;
        })()
    );

    // xhr.open( "GET", urls[j], false );
    // my_aqua.addXHRHeaderRequest( xhr, "GET", urls[j], "application/cdmi-object" );
    // xhr.send( );

    my_aqua.printLog("my_aqua.folder(" + this.name + ").getChildren(GET-cdmi_search) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
      this.isExist = true;
      var tmp = JSON.parse(xhr.responseText);
      Pagination.count = tmp.count ? tmp.count : 0; //=========================??
      $("#paging").show();
      Pagination.init();

      if ((tmp.objects && tmp.objects.length > 0) || (tmp.container && tmp.container.length > 0)) {
        // console.log(':1053:return: ', tmp.container.length);
        localStorage.setItem('current_container', tmp.container);
        var strtmp = this.parentURI + (this.name ? this.name + "/" : "");
        my_aqua.printLog("match parentURI str=" + strtmp);
        if (tmp.container) {
          for (var i = 0; i < tmp.container.length; i++) {
            if ((!this.query) || tmp.container[i].parentURI.indexOf(strtmp) == 0) {
              var tmp1 = null;
              if (tmp.container[i].objectType == "application/cdmi-container") {
                if (tmp.container[i].objectName && tmp.container[i].objectName != "") {
                  tmp1 = new my_aqua.folder({
                    path: my_aqua.getPathByParentURI(this.query ? tmp.objects[i].parentURI : strtmp),
                    name: (tmp.container[i].objectName.lastIndexOf("/") > 0) ? tmp.container[i].objectName.substr(0, tmp.container[i].objectName.lastIndexOf("/")) : tmp.container[i].objectName,
                    parentObj: this,
                    metadata: tmp.container[i].metadata,
                    parentURI: this.query ? tmp.objects[i].parentURI : strtmp,
                    domainID: tmp.container[i].domainID,
                    isExist: true
                  });
                  delete(tmp1.metadata.cdmi_acl);
                }
              }
              if (tmp1 && (tmp1.metadata || (tmp1 && !tmp1.metadata && tmp1.getMetadata() == true))) {
                this.children.push(tmp1);
              }
            }
          }
        }
        if (tmp.objects) {
          for (var i = 0; i < tmp.objects.length; i++) {
            if ((!this.query) || tmp.objects[i].parentURI.indexOf(strtmp) == 0) {
              var tmp1 = null;
              if (tmp.objects[i].objectType == "application/cdmi-object") {
                if (tmp.objects[i].objectName && tmp.objects[i].objectName != "" && (!tmp.objects[i].metadata.netdisk_upLoad_finish || (tmp.objects[i].metadata.netdisk_upLoad_finish && tmp.objects[i].metadata.netdisk_upLoad_finish == "true"))) {
                  tmp1 = new my_aqua.file({
                    path: my_aqua.getPathByParentURI(this.query ? tmp.objects[i].parentURI : strtmp),
                    name: tmp.objects[i].objectName,
                    parentObj: this,
                    metadata: tmp.objects[i].metadata,
                    parentURI: this.query ? tmp.objects[i].parentURI : strtmp,
                    domainID: tmp.objects[i].domainID,
                    isExist: true,
                    hadGetMetadata: false,
                    mimetype: tmp.objects[i].mimetype,
                  });
                  delete(tmp1.metadata.cdmi_acl);
                }
              }
              if (tmp1 && (tmp1.metadata || (tmp1 && !tmp1.metadata && tmp1.getMetadata() == true))) {
                this.children.push(tmp1);
              }
            }
          }
        }
      }
    } else {
      ret = false;
    }
    //}
    if (this.children.length > 0) {
      this.sortChildren();
    }
    // } else {
    //     ret = false;
    // }
    // } catch (e) {
    // ret = false;
    // }
    my_aqua.waitDiv.style.display = "none";
    return ret;
  }

  my_aqua.folder.prototype.create = function () {
    var ret = false;
    var xhr = new my_aqua.xhr();
    var url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "");
    //xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", url, 600), false);
    //xhr.setRequestHeader("Accept", "application/cdmi-container");
    //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
    //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
    //xhr.setRequestHeader("Content-Type", "application/cdmi-container");
    xhr.open("PUT", url, false);
    my_aqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
    xhr.send("{}");
    my_aqua.printLog("my_aqua.folder(" + this.name + ").create(PUT) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && (xhr.status == 201)) {
      this.isExist = true;
      if (xhr.responseText) {
        var tmp = JSON.parse(xhr.responseText);
        if (tmp.metadata) {
          this.metadata = tmp.metadata;
          delete(this.metadata.cdmi_acl);
          if (tmp.parentURI) {
            this.parentURI = tmp.parentURI;
          }
          if (tmp.domainID) {
            this.domainID = tmp.domainID;
          }
        }
      }
      if (this.parentObj) {
        this.parentObj.children.push(this);
        this.parentObj.sortChildren();
      }
      ret = true;
    }
    return ret;
  }

  my_aqua.folder.prototype.createSubFolder = function (folderName) {
    var ret = false;
    if (folderName && folderName != "") {
      var newFolder = new my_aqua.folder({
        name: folderName,
        path: ((this.path || this.name) ? ((this.path ? (this.path + "/") : "") + (this.name ? this.name : "")) : null),
        parentObj: this
      });
      ret = newFolder.create();
    }
    return ret;
  }
  my_aqua.logout = function () {
    my_aqua.userName = null;
    my_aqua.accessKeyId = null;
    my_aqua.secretAccessKey = null;
  }

  my_aqua.init = function (userName, password, domain) {
    var _choose = "netdisk";
    //if (typeof(arguments[2]) != "undefined") _choose = arguments[2];

    //console.log(location.href);
    var ret = false;
    my_aqua.userName = userName;
    my_aqua.Authorization = "Basic " + _base64Encode(my.utf16to8(my_aqua.userName + ":" + password));
    var xhr = new my_aqua.xhr();
    //var tmp = my_aqua.restRoot;
    //tmp = tmp.substr(tmp.indexOf("/"), tmp.length - tmp.indexOf("/"));
    //var url = "https://" + location.href.toString().formatUrl().host + tmp + "/cdmi_users/" + my_aqua.userName;
    var url = my_aqua.restRoot + "/cdmi_users/" + encodeURIComponent(my_aqua.userName);
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Accept", "application/cdmi-user");
    xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
    //    console.info(my_aqua.userName);
    xhr.setRequestHeader("Authorization", "Basic " + _base64Encode(my.utf16to8(my_aqua.userName + ":" + password)));
    //    console.info(my.base64Decode(_base64Encode(my_aqua.userName + ":" + password)))
    xhr.setRequestHeader("x-aqua-user-domain-uri", domain);
    if(domain){
      var domain_strs = domain.split('/');
      console.log(domain_strs);
      if(domain_strs[3] == ""){
        my_aqua.netdiskRoot = "/default/netdisk/" + userName;
      }else{
        my_aqua.netdiskRoot = "/default/" + domain_strs[3];
      }
    }
    /*
     if (userName == "cstest") {
     my_aqua.netdiskRoot = "/" + userName;
     } else if (userName == "cmbc_admin") {
     //xhr.setRequestHeader("x-aqua-user-domain-uri", "/cdmi_domains/default/bankcrm/");
     my_aqua.netdiskRoot = "/default/bankcrm";
     } else if (userName == "iecs_admin") {
     //xhr.setRequestHeader("x-aqua-user-domain-uri", "/cdmi_domains/default/iecs/");
     my_aqua.netdiskRoot = "/default/iecs";
     } else if (userName == "xgx_admin") {
     //xhr.setRequestHeader("x-aqua-user-domain-uri", "/cdmi_domains/default/xinguoxian/");
     my_aqua.netdiskRoot = "/default/xinguoxian";
     } else if (userName == "npvruser") {
     //xhr.setRequestHeader("x-aqua-user-domain-uri", "/cdmi_domains/default/");
     my_aqua.netdiskRoot = "/default/npvr";
     } else {
     switch (_choose) {
     case "netdisk":
     //xhr.setRequestHeader("x-aqua-user-domain-uri", "/cdmi_domains/default/");
     my_aqua.netdiskRoot = "/default/netdisk/" + userName;
     break;
     case "iecs":
     //xhr.setRequestHeader("x-aqua-user-domain-uri", "/cdmi_domains/default/iecs/");
     my_aqua.netdiskRoot = "/default/netdisk/" + userName;
     break;
     case "xinguoxian":
     //xhr.setRequestHeader("x-aqua-user-domain-uri", "/cdmi_domains/default/xinguoxian/");
     my_aqua.netdiskRoot = "/default/netdisk/" + userName;
     break;
     case "bankcrm":
     //xhr.setRequestHeader("x-aqua-user-domain-uri", window["BANKCRM_DOMAINURI"] || "/cdmi_domains/default/bankcrm/");
     my_aqua.netdiskRoot = "/default/netdisk/" + userName;
     break;
     case "general":
     //var login_domain_value = "";
     //if (typeof (arguments[3]) != "undefined") login_domain_value = arguments[3];
     //xhr.setRequestHeader("x-aqua-user-domain-uri", arguments[3] || "");
     my_aqua.netdiskRoot = "/default/netdisk/" + userName;
     break;
     default:
     // xhr.setRequestHeader("x-aqua-user-domain-uri", "/cdmi_domains/default/");
     my_aqua.netdiskRoot = "/default/netdisk/" + userName;
     }
     }
     */
    xhr.send();
    if (xhr.readyState == 4 && xhr.status == 200) {
      if (xhr.responseText) {
        var tmp = JSON.parse(xhr.responseText);
        if (tmp.objectID && tmp.secretAccessKey && tmp.objectName) {
          my_aqua.userName = tmp.objectName;
          my_aqua.accessKeyId = tmp.objectID;
          my_aqua.secretAccessKey = tmp.secretAccessKey;
          //my_aqua.domainURI = tmp.domainURI + "netdisk/" + tmp.objectName + '/';
          my_aqua.BooleanAdmin = (parseInt(tmp.privileges) & parseInt("0x1")) ? true : false;
          if (tmp.containers) {
            my_aqua.containers = tmp.containers;
          }
          ret = true;
        }
      }
    }
    return ret;
  }
  if (typeof FileReader != 'undefined') {

        my_aqua.createFile = function (args) {
            this.inputFile = null;
            this.path = null;
            this.cancelRetryTime = 0;
            this.onstart = function (updateSize, fileSize) {
                return;
            };
            this.onerror = function (e) {
                return;
            };
            this.onprogress = function (updateSize, fileSize) {
                return;
            };
            this.onend = function (updateSize, fileSize) {
                return;
            };
            this.isPause = false;
            this.isLastPart = false;
            this.isFinish = false;
            this.updateCount = 0;
            this.runFunction = {
                name: "createFile",
                hasWaitCallBack: false
            };
            this.stepSize = 1024 * 1024;
            //5M
            this.fileReader = null;
            this.xhr = null;
            this.xhr1 = null;
            this.url = null;
            this.bloCount = 0;
            $.extend(this, args);
            this.parentURI = my_aqua.getParentURIByPath(this.path);

            if (this.inputFile) {
                //var file = this.inputFile.files[0];
                this.fileSize = this.inputFile.size;
                this.fileName = this.inputFile.name;
                if(this.rename){
                    this.fileName = this.rename;
                }
                //this.fileLastModifiedDate = file.lastModifiedDate.format("yyyy-MM-dd HH:mm:ss");
            }

            this.xhr = new my_aqua.xhr();
            this.xhr.parentObject = this;
            this.url = my_aqua.restRoot + my_aqua.encodePath(this.parentURI) + encodeURIComponent(this.fileName);
            //this.xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", this.url, 600), true);
            //this.xhr.setRequestHeader("Accept", "application/cdmi-object");
            //this.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
            //this.xhr.setRequestHeader("Authorization", my_aqua.Authorization);
            //this.xhr.setRequestHeader("Content-Type", "application/cdmi-object");
            this.xhr.open("PUT", this.url, true);
            my_aqua.addXHRHeaderRequest(this.xhr, "PUT", this.url, "application/cdmi-object");
            this.xhr.setRequestHeader("x-aqua-asProxy", "true"); // USE AQUA RROXY
            var obj = {
                mimetype: my.getContentType(this.fileName),
                metadata: {
                    //netdisk_file_size: this.fileSize.toString(),
                    //netdisk_file_name: this.fileName,
                    //netdisk_file_lastModifiedDate: this.fileLastModifiedDate,
                    netdisk_upLoad_stepSize: this.stepSize.toString(),
                    netdisk_upLoad_finish: "false"
                }
      };
      this.bloCount = parseInt(this.fileSize / this.stepSize) + (this.fileSize % this.stepSize > 0 ? 1 : 0);
            if (this.bloCount == 1) {
                this.isLastPart = true;
            }
            for (var i = 0; i < this.bloCount; i++) {
                obj.metadata["netdisk_upLoad_part" + i] = "false";
            }
            this.onstart(this.updateCount, this.fileSize);
            this.xhr.onreadystatechange = function () {
                this.parentObject.runFunction.name = "createFile";
                //console.log(this.readyState + ":" + this.status + ":" + this.responseText);
                if (this.readyState == 4) {
                    my_aqua.printLog("my_aqua.createFile(PUT_CreateFileInfo) status=" + this.status + "\n" + this.responseText);
                    this.parentObject.runFunction.hasWaitCallBack = false;
                    if (this.parentObject.isPause == false) {
                        if (this.status == 201 || this.status == 204) {
                            if (this.parentObject.isPause == false) {
                                this.parentObject._updateBlock(0);
                            }
                        } else {
                            this.parentObject.isPause = true;
                            this.parentObject.onerror("Create File's metadata failed!")
                        }
                    }
                }
                if (this.parentObject.runFunction.name == "createFile") {
                    this.parentObject.runFunction.name = "";
                }
            }
            this.xhr.send(JSON.stringify(obj));
            this.runFunction.hasWaitCallBack = true;
            if (this.runFunction.name == "createFile") {
                this.runFunction.name = "";
            }
        }

        my_aqua.createFile.prototype.start = function () {
            if (this.runFunction.hasWaitCallBack == true) {
                this.isPause = false;
            } else {
                if (this.isFinish == false && ((this.runFunction.name == "_updateFileBloToAqua" && this.isPause == false && this.runFunction.hasWaitCallBack == false) || (this.isPause == true && this.runFunction.hasWaitCallBack == false && this.runFunction.name == ""))) {
                    this.runFunction.name = "start";
                    if (this.isPause == true && this.runFunction.hasWaitCallBack == false) {
                        this.isPause = false;
                        this.onstart(this.updateCount, this.fileSize);
                    }
                    if (this.isPause == false) {
                        //this.xhr.open("GET", my_aqua.getHasTokenUrl("GET", this.url + "?metadata:netdisk_upLoad_part", 600), true);
                        //this.xhr.setRequestHeader("Accept", "application/cdmi-object");
                        //this.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
                        //this.xhr.setRequestHeader("Authorization", my_aqua.Authorization);
                        //this.xhr.setRequestHeader("Content-Type", "application/cdmi-object");
                        this.xhr.open("GET", this.url + "?metadata:netdisk_upLoad_part", true);
                        my_aqua.addXHRHeaderRequest(this.xhr, "GET", this.url, "application/cdmi-object");
                        this.xhr.onreadystatechange = function () {
                            //console.log("this.readyState=" + this.readyState + ";this.status=" + this.status + ";this.responseText=" + this.getAllResponseHeaders());
                            this.parentObject.runFunction.name = "start";
                            if (this.readyState == 4) {
                                my_aqua.printLog("my_aqua.createFile(GET) status=" + this.status + "\n" + this.responseText);
                                this.parentObject.runFunction.hasWaitCallBack = false;
                                if (this.parentObject.isPause == false) {
                                    if (this.status == 200 && this.responseText) {
                                        var tmp = JSON.parse(this.responseText);
                                        if (tmp.metadata) {
                                            var tmp1 = 0;
                                            var index = -1;
                                            for (var i = 0; i < this.parentObject.bloCount; i++) {
                                                if (tmp.metadata["netdisk_upLoad_part" + i] == "false") {
                                                    if (tmp1 == 0) {
                                                        index = i;
                                                    }
                                                    tmp1++;
                                                }
                                            }
                                            if (tmp1 == 1) {
                                                this.parentObject.isLastPart = true;
                                            }
                                            if (index >= 0) {
                                                this.parentObject._updateBlock(index);
                                            }
                                        }
                                    } else {
                                        this.parentObject.isPause = true;
                                        this.parentObject.onerror("Get aleady updated file part failed!");
                                    }
                                }
                            }
                            if (this.parentObject.runFunction.name == "start") {
                                this.parentObject.runFunction.name = "";
                            }
                        }
                        this.runFunction.hasWaitCallBack = true;
                        this.xhr.send();
                    }
                    if (this.runFunction.name == "start") {
                        this.runFunction.name = "";
                    }
                }
            }
        };

        my_aqua.createFile.prototype._updateBlock = function (bloNumber) {
            this.runFunction.name = "_updateBlock";
            if (this.isPause == false && bloNumber >= 0 && bloNumber < this.bloCount) {
                if (!this.fileReader) {
                    this.fileReader = new FileReader();
                    this.fileReader.parentObject = this;
                    this.fileReader.onerror = function (e) {
                        my_aqua.printLog("FileReader error:" + this.error);
                    };
                    this.fileReader.onloadend = function (e) {
                        this.parentObject.runFunction.name = "_updateBlock";
                        this.parentObject.runFunction.hasWaitCallBack = false;
                        if (this.error == null && this.parentObject.isPause == false) {
                            this.parentObject._updateFileBloToAqua.apply(this.parentObject, [this.bloNumber, this.result]);
                        } else {
                            this.parentObject.isPause = true;
                            this.parentObject.onerror.apply(this.parentObject, ["_updateBlock(onloadend):" + this.error]);
                        }
                        if (this.parentObject.runFunction.name == "_updateBlock") {
                            this.parentObject.runFunction.name = "";
                        }
                    };
                }
                this.fileReader.bloNumber = bloNumber;
                var start = bloNumber * this.stepSize;
        var end = ((start + this.stepSize + 1) > this.fileSize) ? this.fileSize : (start + this.stepSize + 1);
        var blob = null;
                if (bloNumber == 0 && this.bloCount == 1) {
                    blob = this.inputFile;
                } else {
                    if (this.inputFile.slice) {
                        blob = this.inputFile.slice(start, end, this.inputFile.type);
                    } else if (this.inputFile.webkitSlice) { //Blob�еķ���
                        blob = this.inputFile.webkitSlice(start, end, this.inputFile.type);
                    } else if (this.inputFile.mozSlice) {
                        blob = this.inputFile.mozSlice(start, end, this.inputFile.type);
                    }
        }
        try {
                    if (blob != null) {
                        this.fileReader.error = null;
                        this.fileReader.result = null;
                        this.fileReader.readyState = 0;
                        //if (this.fileReader.readAsBinaryString) {
                        //  this.fileReader.readAsBinaryString(blob);
                        //}
                        //else if (this.fileReader.readAsArrayBuffer) {
                        this.fileReader.readAsArrayBuffer(blob);
                        //}
                        this.runFunction.hasWaitCallBack = true;
                    } else {
                        this.isPause = true;
                        this.onerror.apply(this, ["get local file part failed!"]);
                    }
                } catch (e) {
                    this.isPause = true;
                    this.onerror.apply(this, ["_updateBlock:" + e]);
                }
            }
            if (this.runFunction.name == "_updateBlock") {
                this.runFunction.name = "";
            }
        };

    my_aqua.createFile.prototype._updateFileBloToAqua = function (bloNumber, buff) {
      var len = ((bloNumber < (this.bloCount - 1)) ? (this.stepSize) : (this.fileSize % this.stepSize));
      this.runFunction.name = "_updateFileBloToAqua";
      if (this.isPause == false) {
        this.xhr.bloNumber = bloNumber;
        var start = bloNumber * this.stepSize;
        var end = ((start + this.stepSize - 1) > (this.fileSize - 1)) ? this.fileSize - 1 : (start + this.stepSize - 1);

        //this.xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", this.url, 600), true);
        //this.xhr.setRequestHeader("Accept", my.getContentType(this.fileName));
                //this.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
                //this.xhr.setRequestHeader("Authorization", my_aqua.Authorization);
                //this.xhr.setRequestHeader("Content-Type", my.getContentType(this.fileName));
                this.xhr.open("PUT", this.url, true);
                my_aqua.addXHRHeaderRequest(this.xhr, "PUT", this.url, my.getContentType(this.fileName));
                this.xhr.setRequestHeader("Content-Length", len.toString());
                this.xhr.setRequestHeader("Content-Range", "bytes " + start + "-" + end + "/" + this.fileSize);
                this.xhr.setRequestHeader("x-aqua-asProxy", "true"); // USE AQUA RROXY
                this.xhr.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        my_aqua.printLog("my_aqua.createFile(PUT_Part_" + this.bloNumber + "_Data) status=" + this.status + "\n" + this.responseText);
                        this.parentObject.runFunction.hasWaitCallBack = false;
                        this.parentObject.runFunction.name = "_updateFileBloToAqua";
                        if (this.parentObject.isPause == false) {
                            if (this.status == 204) {
                                this.parentObject.runFunction.hasWaitCallBack = true;
                                var _self = this.parentObject;
                                setTimeout(function () {
                                    _self.runFunction.hasWaitCallBack = false;
                                    if (_self.isPause == false) {
                                        _self.runFunction.name = "_updateFileBloToAqua";
                                        //_self.xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", _self.url + "?metadata:netdisk_upLoad_part" + _self.xhr.bloNumber + ";metadata:netdisk_upLoad_finish", 600), true);
                                        //_self.xhr.setRequestHeader("Accept", "application/cdmi-object");
                                        //_self.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
                                        //_self.xhr.setRequestHeader("Authorization", my_aqua.Authorization);
                                        //_self.xhr.setRequestHeader("Content-Type", "application/cdmi-object");
                                        _self.xhr.open("PUT", _self.url + "?metadata:netdisk_upLoad_part" + _self.xhr.bloNumber + ";metadata:netdisk_upLoad_finish", true);
                                        my_aqua.addXHRHeaderRequest(_self.xhr, "PUT", _self.url, "application/cdmi-object");
                                        _self.xhr.setRequestHeader("x-aqua-asProxy", "true"); // USE AQUA RROXY

                                        _self.xhr.onreadystatechange = function () {

                                            if (this.readyState == 4 && this.status != 204) {
                                                console.info("400 error");

                                                var xxhr = new my_aqua.xhr();
                                                xxhr.open("GET", _self.url + "?metadata:netdisk_upLoad_part" + _self.xhr.bloNumber + ";", false);
                                                my_aqua.addXHRHeaderRequest(xxhr, "GET", _self.url, "application/cdmi-object");
																								xxhr.send();

                                                var tmp = JSON.parse(xxhr.responseText);
                                                var isEmptyObject = true;

                                                if (tmp["metadata"].hasOwnProperty("netdisk_upLoad_part" + _self.xhr.bloNumber)) {
                                                    isEmptyObject = false;
                                                }

                                                if (!isEmptyObject) {
                                                    console.info(isEmptyObject)

                                                    var yxhr = new my_aqua.xhr();
                                                    yxhr.open("PUT", _self.url + "?metadata:netdisk_upLoad_part" + _self.xhr.bloNumber + ";metadata:netdisk_upLoad_finish", false);
                                                    my_aqua.addXHRHeaderRequest(yxhr, "PUT", _self.url, "application/cdmi-object");
																										yxhr.send.apply(yxhr, ['{"metadata":{"netdisk_upLoad_finish":"' + ((_self.isLastPart == true) ? "true" : "false") + '"}}']);
                                                    //_self.xhr.send.apply( _self.xhr, ['{"metadata":{"netdisk_upLoad_finish":"' + ( ( _self.isLastPart == true ) ? "true" : "false" ) + '"}}'] );
                                                    //return;
                                                } else {
                                                    console.info(isEmptyObject)
                                                    //return;
                                                }

                                            }

                                            if (this.readyState == 4) {
                                                this.parentObject.runFunction.name = "_updateFileBloToAqua";
                                                my_aqua.printLog("my_aqua.createFile(PUT_Part_" + this.bloNumber + "_Update_OK) status=" + this.status + "\n" + this.responseText);
                                                this.parentObject.runFunction.hasWaitCallBack = false;
                                                if (this.parentObject.isPause == false) {
                                                    if (this.status == 204 || this.status == 400) {
                                                        var len = ((this.bloNumber < (this.parentObject.bloCount - 1)) ? (this.parentObject.stepSize) : (this.parentObject.fileSize % this.parentObject.stepSize));
                                                        this.parentObject.updateCount += len;
                                                        if (this.parentObject.isLastPart == true) {
                                                            this.parentObject.isFinish = true;
                                                            this.parentObject.isPause = true;
                                                            this.parentObject.onend.apply(this.parentObject, [this.parentObject.updateCount, this.parentObject.fileSize]);
                                                        } else {
                                                            this.parentObject.onprogress.apply(this.parentObject, [this.parentObject.updateCount, this.parentObject.fileSize]);
                                                            this.parentObject.start();
                                                        }
                                                    } else {
                                                        this.parentObject.isPause = true;
                                                        this.parentObject.onerror.apply(this.parentObject, ["Modify upload file's part" + this.bloNumber + " metadata!"]);
                                                    }
                                                }
                                                if (this.parentObject.runFunction.name == "_updateFileBloToAqua") {
                                                    this.parentObject.runFunction.name = "";
                                                }
                                            }
                                        }
                                        _self.runFunction.hasWaitCallBack = true;
                                        //console.info("want to send")
                                        _self.xhr.send.apply(_self.xhr, ['{"metadata":{"netdisk_upLoad_finish":"' + ((_self.isLastPart == true) ? "true" : "false") + '"}}']);
                                        my_aqua.printLog("my_aqua.createFile(PUT) status=" + _self.xhr.status + "\n" + _self.xhr.responseText);

                                        if (_self.runFunction.name == "_updateFileBloToAqua") {
                                            _self.runFunction.name = "";
                                        }
                                    }
                                }, 0);
                            } else {
                                this.parentObject.isPause = true;
                                this.parentObject.onerror.apply(this.parentObject, ["Update file's part" + this.bloNumber + "!"]);
                            }
                        }
                        if (this.parentObject.runFunction.name == "_updateFileBloToAqua") {
                            this.parentObject.runFunction.name = "";
                        }
                    }
                }
                //this.xhr.sendAsBinary(buff);
                this.xhr.send(buff);
                this.runFunction.hasWaitCallBack = true;
            }
            if (this.runFunction.name == "_updateFileBloToAqua") {
                this.runFunction.name = "";
            }
        };

        my_aqua.createFile.prototype.cancel = function () {
            this.isPause = true;
            if (this.runFunction.hasWaitCallBack == true && this.cancelRetryTime < 20) {
                this.cancelRetryTime++;
                var _self = this;
                setTimeout(function () {
                    my_aqua.printLog("Cancel!!");
                    _self.cancel.apply(_self, []);
                }, 500);
            } else {
                if (this.xhr && this.isFinish == false && this.runFunction.hasWaitCallBack == false) {
                    this.xhr.onreadystatechange = null;
                    //this.xhr.open("DELETE", my_aqua.getHasTokenUrl("DELETE", this.url, 14400), false);
                    //this.xhr.setRequestHeader("Accept", "application/cdmi-object");
                    //this.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
                    //this.xhr.setRequestHeader("Authorization", my_aqua.Authorization);
                    //this.xhr.setRequestHeader("Content-Type", "application/cdmi-object");
          this.xhr.open("DELETE", this.url, false);
          my_aqua.addXHRHeaderRequest(this.xhr, "DELETE", this.url, "application/cdmi-object");
          this.xhr.send();
                    my_aqua.printLog("my_aqua.createFile(DELETE) status=" + this.xhr.status + "\n" + this.xhr.responseText);
                }
                this.url = null;
                this.inputFile = null;
                this.path = null;
                this.onstart = function (updateSize, fileSize) {
                    return;
                };
                this.onerror = function (e) {
                    return;
                };
                this.onprogress = function (updateSize, fileSize) {
                    return;
                };
                this.onend = function (updateSize, fileSize) {
                    return;
                };
                this.cancelRetryTime = 0;
                this.isPause = true;
                this.fileReader = null;
                this.isLastPart = false;
                this.isFinish = false;
                this.updateCount = 0;
                this.bloCount = 0;
                this.xhr = null;
                this.fileSize = 0;
                this.fileName = null;
                this.fileLastModifiedDate = null;
                this.runFunction = {
                    name: "",
                    hasWaitCallBack: false
                };
            }
        };

        my_aqua.createFile.prototype.pause = function () {
            if (this.isPause == false) {
                this.isPause = true;
            }
        };

    }

    /* utf16to8 <---> utf8to16
     ================================================= */
    my.utf16to8 = function (str) {
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

        return out
    }

    my.utf8to16 = function (str) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;

        while (i < len) {
            c = str.charCodeAt(i++);

            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    out += str.charAt(i - 1);

                    break;

                case 12:
                case 13:
                    char2 = str.charCodeAt(i++);

                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;

                case 14:
                    char2 = str.charCodeAt(i++);

                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break
            }
        }

        return out
    }


    if (!window.my) {
        window.my = {};
    }
    my.contentTypeMap = {
        "001": "application/x-001",
        "301": "application/x-301",
        "323": "text/h323",
        "906": "application/x-906",
        "907": "drawing/907",
        "a11": "application/x-a11",
        "acp": "audio/x-mei-aac",
        "ai": "application/postscript",
        "aif": "audio/aiff",
        "aifc": "audio/aiff",
        "aiff": "audio/aiff",
        "anv": "application/x-anv",
        "asa": "text/asa",
        "asf": "video/x-ms-asf",
        "asp": "text/asp",
        "asx": "video/x-ms-asf",
        "au": "audio/basic",
        "avi": "video/avi",
        "awf": "application/vnd.adobe.workflow",
        "biz": "text/xml",
        "bmp": "application/x-bmp",
        "bot": "application/x-bot",
        "c4t": "application/x-c4t",
        "c90": "application/x-c90",
        "cal": "application/x-cals",
        "cat": "application/vnd.ms-pki.seccat",
        "cdf": "application/x-netcdf",
        "cdr": "application/x-cdr",
        "cel": "application/x-cel",
        "cer": "application/x-x509-ca-cert",
        "cg4": "application/x-g4",
        "cgm": "application/x-cgm",
        "cit": "application/x-cit",
        "class": "java/*",
        "cml": "text/xml",
        "cmp": "application/x-cmp",
        "cmx": "application/x-cmx",
        "cot": "application/x-cot",
        "crl": "application/pkix-crl",
        "crt": "application/x-x509-ca-cert",
        "csi": "application/x-csi",
        "css": "text/css",
        "cut": "application/x-cut",
        "dbf": "application/x-dbf",
        "dbm": "application/x-dbm",
        "dbx": "application/x-dbx",
        "dcd": "text/xml",
        "dcx": "application/x-dcx",
        "der": "application/x-x509-ca-cert",
        "dgn": "application/x-dgn",
        "dib": "application/x-dib",
        "dll": "application/x-msdownload",
        "doc": "application/msword",
        "dot": "application/msword",
        "drw": "application/x-drw",
        "dtd": "text/xml",
        "dwf": "Model/vnd.dwf",
        "dwf": "application/x-dwf",
        "dwg": "application/x-dwg",
        "dxb": "application/x-dxb",
        "dxf": "application/x-dxf",
        "edn": "application/vnd.adobe.edn",
        "emf": "application/x-emf",
        "eml": "message/rfc822",
        "ent": "text/xml",
        "epi": "application/x-epi",
        "eps": "application/x-ps",
        "eps": "application/postscript",
        "etd": "application/x-ebx",
        "exe": "application/x-msdownload",
        "fax": "image/fax",
        "fdf": "application/vnd.fdf",
        "fif": "application/fractals",
        "fo": "text/xml",
        "frm": "application/x-frm",
        "g4": "application/x-g4",
        "gbr": "application/x-gbr",
        "gcd": "application/x-gcd",
        "gif": "image/gif",
        "gl2": "application/x-gl2",
        "gp4": "application/x-gp4",
        "hgl": "application/x-hgl",
        "hmr": "application/x-hmr",
        "hpg": "application/x-hpgl",
        "hpl": "application/x-hpl",
        "hqx": "application/mac-binhex40",
        "hrf": "application/x-hrf",
        "hta": "application/hta",
        "htc": "text/x-component",
        "htm": "text/html",
        "html": "text/html",
        "htt": "text/webviewhtml",
        "htx": "text/html",
        "icb": "application/x-icb",
        "ico": "image/x-icon,application/x-ico",
        "iff": "application/x-iff",
        "ig4": "application/x-g4",
        "igs": "application/x-igs",
        "iii": "application/x-iphone",
        "img": "application/x-img",
        "ins": "application/x-internet-signup",
        "isp": "application/x-internet-signup",
        "IVF": "video/x-ivf",
        "java": "java/*",
        "jfif": "image/jpeg",
        "jpe": "image/jpeg,application/x-jpe",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg,application/x-jpg",
        "js": "application/x-javascript",
        "jsp": "text/html",
        "la1": "audio/x-liquid-file",
        "lar": "application/x-laplayer-reg",
        "latex": "application/x-latex",
        "lavs": "audio/x-liquid-secure",
        "lbm": "application/x-lbm",
        "lmsff": "audio/x-la-lms",
        "ls": "application/x-javascript",
        "ltr": "application/x-ltr",
        "m1v": "video/x-mpeg",
        "m2v": "video/x-mpeg",
        "m3u": "audio/mpegurl",
        "m4e": "video/mpeg4",
        "mac": "application/x-mac",
        "man": "application/x-troff-man",
        "math": "text/xml",
        "mdb": "application/msaccess,application/x-mdb",
        "mfp": "application/x-shockwave-flash",
        "mht": "message/rfc822",
        "mhtml": "message/rfc822",
        "mi": "application/x-mi",
        "mid": "audio/mid",
        "midi": "audio/mid",
        "mil": "application/x-mil",
        "mml": "text/xml",
        "mnd": "audio/x-musicnet-download",
        "mns": "audio/x-musicnet-stream",
        "mocha": "application/x-javascript",
        "movie": "video/x-sgi-movie",
        "mp1": "audio/mp1",
        "mp2": "audio/mp2",
        "mp2v": "video/mpeg",
        "mp3": "audio/mp3",
        "mp4": "video/mpeg4",
        "mpa": "video/x-mpg",
        "mpd": "application/vnd.ms-project",
        "mpe": "video/x-mpeg",
        "mpeg": "video/mpg",
        "mpg": "video/mpg",
        "mpga": "audio/rn-mpeg",
        "mpp": "application/vnd.ms-project",
        "mps": "video/x-mpeg",
        "mpt": "application/vnd.ms-project",
        "mpv": "video/mpg",
        "mpv2": "video/mpeg",
        "mpw": "application/vnd.ms-project",
        "mpx": "application/vnd.ms-project",
        "mtx": "text/xml",
        "mxp": "application/x-mmxp",
        "net": "image/pnetvue",
        "nrf": "application/x-nrf",
        "nws": "message/rfc822",
        "odc": "text/x-ms-odc",
        "out": "application/x-out",
        "p10": "application/pkcs10",
        "p12": "application/x-pkcs12",
        "p7b": "application/x-pkcs7-certificates",
        "p7c": "application/pkcs7-mime",
        "p7m": "application/pkcs7-mime",
        "p7r": "application/x-pkcs7-certreqresp",
        "p7s": "application/pkcs7-signature",
        "pc5": "application/x-pc5",
        "pci": "application/x-pci",
        "pcl": "application/x-pcl",
        "pcx": "application/x-pcx",
        "pdf": "application/pdf",
        "pdx": "application/vnd.adobe.pdx",
        "pfx": "application/x-pkcs12",
        "pgl": "application/x-pgl",
        "pic": "application/x-pic",
        "pko": "application/vnd.ms-pki.pko",
        "pl": "application/x-perl",
        "plg": "text/html",
        "pls": "audio/scpls",
        "plt": "application/x-plt",
        "png": "image/png,application/x-png",
        "pot": "application/vnd.ms-powerpoint",
        "ppa": "application/vnd.ms-powerpoint",
        "ppm": "application/x-ppm",
        "pps": "application/vnd.ms-powerpoint",
        "ppt": "application/vnd.ms-powerpoint,application/x-ppt",
        "pr": "application/x-pr",
        "prf": "application/pics-rules",
        "prn": "application/x-prn",
        "prt": "application/x-prt",
        "ps": "application/x-ps",
        "ps": "application/postscript",
        "ptn": "application/x-ptn",
        "pwz": "application/vnd.ms-powerpoint",
        "r3t": "text/vnd.rn-realtext3d",
        "ra": "audio/vnd.rn-realaudio",
        "ram": "audio/x-pn-realaudio",
        "ras": "application/x-ras",
        "rat": "application/rat-file",
        "rdf": "text/xml",
        "rec": "application/vnd.rn-recording",
        "red": "application/x-red",
        "rgb": "application/x-rgb",
        "rjs": "application/vnd.rn-realsystem-rjs",
        "rjt": "application/vnd.rn-realsystem-rjt",
        "rlc": "application/x-rlc",
        "rle": "application/x-rle",
        "rm": "application/vnd.rn-realmedia",
        "rmf": "application/vnd.adobe.rmf",
        "rmi": "audio/mid",
        "rmj": "application/vnd.rn-realsystem-rmj",
        "rmm": "audio/x-pn-realaudio",
        "rmp": "application/vnd.rn-rn_music_package",
        "rms": "application/vnd.rn-realmedia-secure",
        "rmvb": "application/vnd.rn-realmedia-vbr",
        "rmx": "application/vnd.rn-realsystem-rmx",
        "rnx": "application/vnd.rn-realplayer",
        "rp": "image/vnd.rn-realpix",
        "rpm": "audio/x-pn-realaudio-plugin",
        "rsml": "application/vnd.rn-rsml",
        "rt": "text/vnd.rn-realtext",
        "rtf": "application/msword,application/x-rtf",
        "rv": "video/vnd.rn-realvideo",
        "sam": "application/x-sam",
        "sat": "application/x-sat",
        "sdp": "application/sdp",
        "sdw": "application/x-sdw",
        "sit": "application/x-stuffit",
        "slb": "application/x-slb",
        "sld": "application/x-sld",
        "slk": "drawing/x-slk",
        "smi": "application/smil",
        "smil": "application/smil",
        "smk": "application/x-smk",
        "snd": "audio/basic",
        "sol": "text/plain",
        "sor": "text/plain",
        "spc": "application/x-pkcs7-certificates",
        "spl": "application/futuresplash",
        "spp": "text/xml",
        "ssm": "application/streamingmedia",
        "sst": "application/vnd.ms-pki.certstore",
        "stl": "application/vnd.ms-pki.stl",
        "stm": "text/html",
        "sty": "application/x-sty",
        "svg": "text/xml",
        "swf": "application/x-shockwave-flash",
        "tdf": "application/x-tdf",
        "tg4": "application/x-tg4",
        "tga": "application/x-tga",
        "tif": "image/tiff,application/x-tif",
        "tiff": "image/tiff",
        "tld": "text/xml",
        "top": "drawing/x-top",
        "torrent": "application/x-bittorrent",
        "tsd": "text/xml",
        "txt": "text/plain",
        "uin": "application/x-icq",
        "uls": "text/iuls",
        "vcf": "text/x-vcard",
        "vda": "application/x-vda",
        "vdx": "application/vnd.visio",
        "vml": "text/xml",
        "vpg": "application/x-vpeg005",
        "vsd": "application/vnd.visio,application/x-vsd",
        "vss": "application/vnd.visio",
        "vst": "application/vnd.visio",
        "vst": "application/x-vst",
        "vsw": "application/vnd.visio",
        "vsx": "application/vnd.visio",
        "vtx": "application/vnd.visio",
        "vxml": "text/xml",
        "wav": "audio/wav",
        "wax": "audio/x-ms-wax",
        "wb1": "application/x-wb1",
        "wb2": "application/x-wb2",
        "wb3": "application/x-wb3",
        "wbmp": "image/vnd.wap.wbmp",
        "wiz": "application/msword",
        "wk3": "application/x-wk3",
        "wk4": "application/x-wk4",
        "wkq": "application/x-wkq",
        "wks": "application/x-wks",
        "wm": "video/x-ms-wm",
        "wma": "audio/x-ms-wma",
        "wmd": "application/x-ms-wmd",
        "wmf": "application/x-wmf",
        "wml": "text/vnd.wap.wml",
        "wmv": "video/x-ms-wmv",
        "wmx": "video/x-ms-wmx",
        "wmz": "application/x-ms-wmz",
        "wp6": "application/x-wp6",
        "wpd": "application/x-wpd",
        "wpg": "application/x-wpg",
        "wpl": "application/vnd.ms-wpl",
        "wq1": "application/x-wq1",
        "wr1": "application/x-wr1",
        "wri": "application/x-wri",
        "wrk": "application/x-wrk",
        "ws": "application/x-ws",
        "ws2": "application/x-ws",
        "wsc": "text/scriptlet",
        "wsdl": "text/xml",
        "wvx": "video/x-ms-wvx",
        "xdp": "application/vnd.adobe.xdp",
        "xdr": "text/xml",
        "xfd": "application/vnd.adobe.xfd",
        "xfdf": "application/vnd.adobe.xfdf",
        "xhtml": "text/html",
        "xls": "application/vnd.ms-excel,application/x-xls",
        "xlw": "application/x-xlw",
        "xml": "text/xml",
        "xpl": "audio/scpls",
        "xq": "text/xml",
        "xql": "text/xml",
        "xquery": "text/xml",
        "xsd": "text/xml",
        "xsl": "text/xml",
        "xslt": "text/xml",
        "xwd": "application/x-xwd",
        "x_b": "application/x-x_b",
        "x_t": "application/x-x_t"
    };
    my.getContentType = function (str) {
        var ret = "application/octet-stream";
        var a = str.split(".");
        if (a.length > 0) {
            if (my.contentTypeMap[a[a.length - 1].toLowerCase()]) {
                ret = my.contentTypeMap[a[a.length - 1].toLowerCase()];
            }
        }
        return ret;
    }
    return my_aqua;
})(jQuery);
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

//_str_hmac_sha1
function _str_hmac_sha1(_key, _data) {
    var hexcase = 0;
    /* hex output format. 0 - lowercase; 1 - uppercase */
    var b64pad = "";
    /* base-64 pad character. "=" for strict RFC compliance */
    var chrsz = 8;
    /* bits per input character. 8 - ASCII; 16 - Unicode */
    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    function hex_sha1(s) {
        return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
    }

    function b64_sha1(s) {
        return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
    }

    function str_sha1(s) {
        return binb2str(core_sha1(str2binb(s), s.length * chrsz));
    }

    function hex_hmac_sha1(key, data) {
        return binb2hex(core_hmac_sha1(key, data));
    }

    function b64_hmac_sha1(key, data) {
        return binb2b64(core_hmac_sha1(key, data));
    }

    function _str_hmac_sha1(key, data) {
        return binb2str(core_hmac_sha1(key, data));
    }

    /*
     * Perform a simple self-test to see if the VM is working
     */
    function sha1_vm_test() {
        return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
    }

    /*
     * Calculate the SHA-1 of an array of big-endian words, and a bit length
     */
    function core_sha1(x, len) {
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
    function sha1_ft(t, b, c, d) {
        if (t < 20)
            return (b & c) | ((~b) & d);
        if (t < 40)
            return b ^ c ^ d;
        if (t < 60)
            return (b & c) | (b & d) | (c & d);
        return b ^ c ^ d;
    }

    /*
     * Determine the appropriate additive constant for the current iteration
     */
    function sha1_kt(t) {
        return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
    }

    /*
     * Calculate the HMAC-SHA1 of a key and some data
     */
    function core_hmac_sha1(key, data) {
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
    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function rol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * Convert an 8-bit or 16-bit string to an array of big-endian words
     * In 8-bit function, characters >255 have their hi-byte silently ignored.
     */
    function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (32 - chrsz - i % 32);
        return bin;
    }

    /*
     * Convert an array of big-endian words to a string
     */
    function binb2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += chrsz)
            str += String.fromCharCode((bin[i >> 5] >>> (32 - chrsz - i % 32)) & mask);
        return str;
    }

    /*
     * Convert an array of big-endian words to a hex string.
     */
    function binb2hex(binarray) {
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
    function binb2b64(binarray) {
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

    return _str_hmac_sha1(_key, _data);
}
