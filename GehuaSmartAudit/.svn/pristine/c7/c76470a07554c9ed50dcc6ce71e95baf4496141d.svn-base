define(['jquery', 'my'], function($, my){

var tifAqua = {};
tifAqua.host = '';
tifAqua.restRoot = '/aqua/rest/cdmi';
tifAqua.userName = null;
tifAqua.accessKeyId = null;
tifAqua.secretAccessKey = null;
tifAqua.rootURI = null;
tifAqua.tifPath = "/default/tif/";
tifAqua.tifDomainURI = "/cdmi_domains" + tifAqua.tifPath;
tifAqua.thumbnails = null;
tifAqua.tifRole = null;

tifAqua.setUp = function(obj){
	$.extend(this, obj);
};

tifAqua.printLog = function(args){
//console.log(args);
};

tifAqua.encodePath = function(path){
  var ret = null;
  //tifAqua.printLog(path);
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
  //tifAqua.printLog(ret);
  return ret;
};


tifAqua.addXHRHeaderRequest = function(xhr, method, url, contentType, query){
  var arrObj;
  if(url.indexOf('//') > -1){
    arrObj = url.split("//");
  } else {
    arrObj = ['', url];
  }
  var tmp1 = (arrObj[1].indexOf("/") >= 0) ? arrObj[1].indexOf("/") : 0;
  var tmp2 = arrObj[1].indexOf("?");
  var urlPath = arrObj[1].substr(tmp1, ((tmp2 >= 0) ? (tmp2) : arrObj[1].length) - tmp1);
  var nowDateTime = new Date().getTime();

  var StringToSign = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
  if (xhr) {
    xhr.setRequestHeader("Accept", contentType);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("Authorization", "AQUA " + tifAqua.accessKeyId + ":" + my.base64Encode(my.str_hmac_sha1(tifAqua.secretAccessKey, StringToSign)));
    xhr.setRequestHeader("x-aqua-date", nowDateTime);
	xhr.setRequestHeader("x-aqua-read-reference-redirect", false);
  }
  var ret = url;
  if (tmp2 < 0) {
    ret += "?";
  }
  else {
    ret += "&";
  }
  ret += "aquatoken=" + encodeURIComponent(tifAqua.accessKeyId) + ":" + encodeURIComponent(my.base64Encode(my.str_hmac_sha1(tifAqua.secretAccessKey, StringToSign)));
  ret += "&xaquadate=" + nowDateTime;
  return ret;
};

//支持Aqua通配符访问
tifAqua.addXHRHeaderRequestForWildcard = function(xhr, url, contentType, aquatoken){
  var arrObj = url.split("//");
  var tmp1 = (arrObj[1].indexOf("/") >= 0) ? arrObj[1].indexOf("/") : 0;
  var tmp2 = arrObj[1].indexOf("?");
  if (xhr) {
    xhr.setRequestHeader("Accept", contentType);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.setRequestHeader("Authorization", "AQUA " + aquatoken);
	xhr.setRequestHeader("x-aqua-read-reference-redirect", false);
  }
  var ret = url;
  if (tmp2 < 0) {
    ret += "?";
  }
  else {
    ret += "&";
  }
  ret += "aquatoken=" + encodeURIComponent(aquatoken);
  return ret;
};


tifAqua.getParentURIByPath = function( path ) {
  //  var ret = tifAqua.tifPath + "/";
 //   if ( path ) {
 //       ret += path + "/";
 //   }
 //   return ret;
    return path;
}

tifAqua.getPathByParentURI = function( parentURI ) {
    var ret = null;
    var tmp = tifAqua.tifPath + "/";
    if ( parentURI && parentURI.indexOf( tmp ) == 0 ) {
        ret = parentURI.substr( tmp.length, parentURI.length - tmp.length - 1 );
        if ( ret == "" ) {
            ret = null;
        }
    }
    return ret;
}
/*
tifAqua.getPathByParentURI = function( parentURI ) {
    var ret = null;
    var tmp = tifAqua.tifPath + "coursewares/";
    if ( parentURI && parentURI.indexOf( tmp ) == 0 ) {
        ret = parentURI.substr( tmp.length, parentURI.length - tmp.length - 1 );
        if ( ret == "" ) {
            ret = null;
        }
    }
	console.log("[tifAqua.getPathByParentURI]ret="+ret);
    return ret;
}
*/
tifAqua.xhr = function(){
  var _req;
  if (window.XMLHttpRequest) {
    _req = new XMLHttpRequest();
  }
  else {
    _req = new ActiveXObject("Microsoft.XMLHTTP");
  }
  _req.sendAsBinary = function(datastr){
    function byteValue(x){
      return x.charCodeAt(0) & 0xff;
    }
    var ords = Array.prototype.map.call(datastr, byteValue);
    var ui8a = new Uint8Array(ords);
    this.send(ui8a.buffer);
  }

  return _req;
};

/**
 * 用户登陆
 */
tifAqua.init = function(userName, password){
  var ret = false;
  tifAqua.userName = userName;
  tifAqua.Authorization = "Basic " + my.base64Encode(tifAqua.userName + ":" + password);
  var xhr = new tifAqua.xhr();
  //var url = "../aqua/rest/cdmi/cdmi_users/" + tifAqua.userName;
  var url = tifAqua.restRoot + "/cdmi_users/"  + tifAqua.userName;
  xhr.open("GET", url, false);
  xhr.setRequestHeader("Accept", "application/cdmi-user");
  xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
  xhr.setRequestHeader("Authorization", "Basic " + my.base64Encode(tifAqua.userName + ":" + password));
  xhr.setRequestHeader("x-aqua-user-domain-uri", tifAqua.tifDomainURI);

  xhr.send();
  if (xhr.readyState == 4 && xhr.status == 200) {
    if (xhr.responseText) {
      var tmp = JSON.parse(xhr.responseText);
      if (tmp.objectID && tmp.secretAccessKey && tmp.objectName) {
        tifAqua.userName = tmp.objectName;
        tifAqua.accessKeyId = tmp.objectID;
        tifAqua.secretAccessKey = tmp.secretAccessKey;
		/*
		tifAqua.rootContainerID = tmp.metadata.root_container;
		if(tifAqua.rootContainerID && tifAqua.rootContainerID!=""){
			ret = true;
		}else{
			console.info("Cann't get root container ID of that user!");
			ret = false;
		}
		*/
      }
    }
  }
  if (ret == true) {
	ret = tifAqua.getUserRole();
  }
  return ret;
};

tifAqua.file = function(args){
  this.type = "aquaFile";
  this.parentObj = null;
  this.path = null;
  this.parentURI = null;
  this.mimetype = null;
  this.name = null;
  this.metadata = {};
  this.isExist = false;
  this.hadGetMetadata = false;
  this.password = null;
  $.extend(this, args);
  if (this.name && this.name.files) {
    var file = this.name.files[0];
    this.name = file.name;
  }
  this.parentURI = tifAqua.getParentURIByPath(this.path);
  this.tags = [];
};

tifAqua.file.prototype.getMetadata = function(metadata){
  var ret = false;
  if (this.name && this.name != "") {
    var xhr = new tifAqua.xhr();
    var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + encodeURIComponent(this.name);

    if(metadata){
		var names = [];
		for (var x in metadata) {
		  names.push("metadata:"+encodeURIComponent(x));
		}
		if (names.length > 0) {
			url = url+"?"+names.join(";");
		}
	}

	xhr.open("GET", url, false);
    tifAqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-object");
    xhr.send();
    tifAqua.printLog("tifAqua.file(" + this.name + ").getMetadata(GET) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {

      var tmp = JSON.parse(xhr.responseText);
	  $.extend(this.metadata, tmp.metadata);
	  this.objectID = tmp.objectID;
	  this.name = tmp.objectName;
	  this.isExist = true;
      ret = true;
    }
  }
  return ret;
}

/**
 * 设置Metadata
 * @param metadata
 */
tifAqua.file.prototype.setMetadata = function(metadata){
  var ret = false;
  //if (metadata && this.isExist == true) {
  if (metadata) {
    var xhr = new tifAqua.xhr();
    var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + encodeURIComponent(this.name) + "?";
    var names = [];
    var putMetadata = {};
    var tmpMetadata = {};
    for (var x in metadata) {
      //names.push("metadata:netdisk_custom_" + encodeURIComponent(x));
      names.push("metadata:"+encodeURIComponent(x));
      //tmpMetadata["netdisk_custom_" + x] = metadata[x];
      tmpMetadata[x] = metadata[x];
      if (metadata[x] != null) {
        //putMetadata["netdisk_custom_" + x] = metadata[x];
        putMetadata[x] = metadata[x];
      }
    }
    if (names.length > 0) {
      url = url+names.join(";");
      xhr.open("PUT", url, false);
      tifAqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object");
      xhr.send('{"metadata":' + JSON.stringify(putMetadata) + '}');
      tifAqua.printLog("tifAqua.file(" + this.name + ").setMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
      if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 204 || xhr.status == 1223)) {
        for (var x in tmpMetadata) {
          if (tmpMetadata[x] == null) {
            delete (this.metadata[x]);
          }
          else {
            this.metadata[x] = tmpMetadata[x];
          }
        }
		if (xhr.responseText) {
			var tmp = JSON.parse(xhr.responseText);
			this.objectID = tmp.objectID;
		}
        ret = true;
      }
    }
  }
  return ret;
}

tifAqua.file.prototype.deleteObj = function(){
  var ret = false;
  if (this.name && this.name != "") {
    var xhr = new tifAqua.xhr();
    var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + encodeURIComponent(this.name);
    //xhr.open("DELETE", tifAqua.getHasTokenUrl("DELETE", url, 600), false);
    //xhr.setRequestHeader("Accept", "application/cdmi-object");
    //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
    //xhr.setRequestHeader("Authorization", tifAqua.Authorization);
    //xhr.setRequestHeader("Content-Type", "application/cdmi-object");
    xhr.open("DELETE", url, false);
    tifAqua.addXHRHeaderRequest(xhr, "DELETE", url, "application/cdmi-object");
    xhr.send();
    tifAqua.printLog("tifAqua.file(" + this.name + ").deleteObj(DELETE) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 200)) {
      this.metadata = {};
      this.isExist = false;
      ret = true;
    }
  }
  return ret;
};

tifAqua.file.prototype.getDownloadImageURL = function(){
  var ret = "";
  if (this.name && this.name != "") {
    var url = tifAqua.restRoot +"/cdmi_objectid/"+this.name;
    //var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + this.name;
    ret = tifAqua.addXHRHeaderRequest(null, "GET", url, "");
  }
  return ret;
};

tifAqua.file.prototype.getDownloadImageURLByName = function(){
  var ret = "";
  if (this.name && this.name != "") {
	var url = tifAqua.restRoot + tifAqua.encodePath(this.path) + this.name;
    //var url = tifAqua.restRoot +"/cdmi_objectid/"+this.name;
    //var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + this.name;
    ret = tifAqua.addXHRHeaderRequest(null, "GET", url, "");
  }
  return ret;
};

tifAqua.file.prototype.checkExist = function(){
  var ret = this.isExist;
  if (ret == false) {
    if (this.name && this.name != "") {
      var xhr = new tifAqua.xhr();
      var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + encodeURIComponent(this.name);
      xhr.open("GET", url, false);
      tifAqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-object");
      xhr.send();
      tifAqua.printLog("tifAqua.file(" + this.name + ").checkExist(GET) status=" + xhr.status + "\n" + xhr.responseText);
      if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
        var tmp = JSON.parse(xhr.responseText);
        if (tmp.objectName && tmp.objectName == this.name) {
          this.isExist = true;
          ret = true;
        }
      }
    }
  }
  return ret;
};

/**
 * 获取用户标签
 */
tifAqua.file.prototype.getUserTags = function(){
  var ret = false;
    var xhr = new tifAqua.xhr();
    var url = tifAqua.host + "/aqua/rest/tag/user/" + tifAqua.accessKeyId;

	xhr.open("GET", url, false);
    tifAqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-tags");
    xhr.send();
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
      var tmp = JSON.parse(xhr.responseText);
	  $.extend(this.tags, tmp.tags);
      ret = true;
    }
  return ret;
};

/**
 * 添加用户标签
 */
tifAqua.file.prototype.putUserTags = function(tags){
  var ret = false;
    var xhr = new tifAqua.xhr();
    var url = tifAqua.host + "/aqua/rest/tag/user/" + tifAqua.accessKeyId;
	xhr.open("PUT", url, false);
    tifAqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-tags");
    xhr.send(JSON.stringify(tags));
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
      var tmp = JSON.parse(xhr.responseText);
	  $.extend(this.metadata, tmp.metadata);
      ret = true;
    }
  return ret;
};

/**
 * 删除用户标签
 */
tifAqua.file.prototype.removeUserTags = function(tags){
  var ret = false;
    var xhr = new tifAqua.xhr();
    var url = tifAqua.host + "/aqua/rest/tag/user/" + tifAqua.accessKeyId;
	xhr.open("PUT", url, false);
    tifAqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-tags");
    xhr.send(JSON.stringify(tags));
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
      var tmp = JSON.parse(xhr.responseText);
	  $.extend(this.metadata, tmp.metadata);
      ret = true;
    }
  return ret;
};

tifAqua.folder = function(args){
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
  this.children = [];
  this.isExist = false;
  this.hadGetMetadata = false;
  $.extend(this, args);
  this.parentURI = tifAqua.getParentURIByPath(this.path);
  this.totalCount = null;
  this.objectID = null;
};

tifAqua.folder.prototype.getMetadata = function(){
  var ret = false;
  var xhr = new tifAqua.xhr();
  //var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + "?parentURI;metadata";
  var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "");
  //xhr.open("GET", tifAqua.getHasTokenUrl("GET", url, 600), false);
  //xhr.setRequestHeader("Accept", "application/cdmi-container");
  //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
  //xhr.setRequestHeader("Authorization", tifAqua.Authorization);
  //xhr.setRequestHeader("Content-Type", "application/cdmi-container");
  xhr.open("GET", url, false);
  tifAqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-container");
  xhr.send();
  tifAqua.printLog("tifAqua.folder(" + this.name + ").getMetadata(GET) status=" + xhr.status + "\n" + xhr.responseText);
  if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
    var tmp = JSON.parse(xhr.responseText);
    if (tmp.metadata) {
      for (var x in tmp.metadata) {
        if (tmp.metadata[x] == null) {
          delete (tmp.metadata[x]);
        }
      }
      $.extend(this.metadata, tmp.metadata);
      delete (this.metadata.cdmi_acl);
      if (tmp.parentURI) {
        this.parentURI = tmp.parentURI;
      }
	  this.objectID = tmp.objectID;
      this.hadGetMetadata = true;
      this.isExist = true;
      ret = true;
    }
  }
  return ret;
};

/**
 * 设置Metadata
 * @param metadata
 */
tifAqua.folder.prototype.setMetadata = function(metadata){
  var ret = false;
  if (metadata) {
    var xhr = new tifAqua.xhr();
    var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + "?";
    //console.log("setmetadata="+url);
	var names = [];
    var tmpMetadata = {};
    var putMetadata = {};
    for (var x in metadata) {
      names.push("metadata:"+encodeURIComponent(x));
      tmpMetadata[x] = metadata[x];
      if (metadata[x] != null) {
        putMetadata[x] = metadata[x];
      }
    }
    if (names.length > 0) {
      url += names.join(";");
      xhr.open("PUT", url, false);
      tifAqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
	  //console.log('{"metadata":' + JSON.stringify(putMetadata) + '}');
	  xhr.send('{"metadata":' + JSON.stringify(putMetadata) + '}');
      tifAqua.printLog("tifAqua.folder(" + this.name + ").setMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
      if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 1223 || xhr.status == 201)) {
        for (var x in tmpMetadata) {
          if (tmpMetadata[x] == null) {
            delete (this.metadata[x]);
          }
          else {
            this.metadata[x] = tmpMetadata[x];
          }
        }
		if (xhr.responseText) {
			var tmp = JSON.parse(xhr.responseText);
			this.objectID = tmp.objectID;
		}
        ret = true;
      }
    }
  }
  return ret;
};

tifAqua.folder.prototype.checkExist = function(){
  var ret = this.isExist;
  if (ret == false) {
    var xhr = new tifAqua.xhr();
    var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "") + "?parentURI";
    xhr.open("GET", url, false);
    tifAqua.addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-container");
    xhr.send();
    tifAqua.printLog("tifAqua.folder(" + this.name + ").checkExist(GET) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
      var tmp = JSON.parse(xhr.responseText);
      if (tmp.parentURI) {
        this.parentURI = tmp.parentURI;
      }
      this.isExist = true;
      ret = true;
    }
  }
  return ret;
};

tifAqua.folder.prototype.getChildrenForContainer = function(start,end,result){
  var xhr = new tifAqua.xhr();
  var ret = true;
  try {
		//var parentURI = tifAqua.rootURI+"cits_customers/";
		//var parentURI = tifAqua.rootURI+"transactions/current/";
		var url ="";
		if(start && start=="-1")
		{
			url = tifAqua.restRoot + "/cdmi_query?sort=updatetime";
		}else{
			url = tifAqua.restRoot + "/cdmi_query/?sort=updatetime-&range="+(start ? start:1)+"-"+(end ? end:20);
		}
		xhr.open("PUT", url, false);
		tifAqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
		var createtime="";
		if(!this.query){
			if(result && result!=""){
				xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI +'","objectType" : "== application/cdmi-container",'+'"parentURI":"== '+this.parentURI+'"}'+'],'+result+'}');
			}else{
				xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI+'","objectType" : "== application/cdmi-container",'+'"parentURI":"== '+this.parentURI+'"}'+']}');
			}
		}
		else{
			var str = [];
			var mode = "";
			for (var x in this.query) {
				if(this.query[x]!="ALL")
				{
					if(x=="cdmi_ctime"){
						//createtime = this.query[x] +" 00:00:00";
						//str.push('"'+x+'":' + '"== ' + this.query[x]+"T00:00:00.000000+0800"+'"');
						str.push('"'+x+'":' + '">= ' + "2013-09-03T00:00:00.000000+0800"+'"');
					}else if(x=="courseware_name" && start != "-1"){
						str.push('"'+x+'":' + '"contains ' + this.query[x]+'"');
					}else {
						if(x=="mode"){
							mode = this.query[x];
						}else if(x=="tags" && mode ==1 ){
							var metadataValue = this.query[x].split(",");
							if(metadataValue.length > 1){
								str.push('"'+x+'":' + '"multi- ' + this.query[x]+'"');
							}
							else{
								str.push('"'+x+'":' + '"== ' + this.query[x]+'"');
							}
						}else if(x=="tags" && mode ==2){
							var metadataValue = this.query[x].split(",");
							if(metadataValue.length > 1){
								str.push('"'+x+'":' + '"multiand- ' + this.query[x]+'"');
							}
							else{
								str.push('"'+x+'":' + '"== ' + this.query[x]+'"');
							}
						}else{
							str.push('"'+x+'":' + '"== ' + this.query[x]+'"');
						}
					}
				}
			}
			if(createtime==""){
				if(result && result!=""){
					xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI +'","objectType" : "== application/cdmi-container",'+'"parentURI":"== '+this.parentURI+'","metadata" : {'+str+'}'+'}'+'],'+result+'}');
				}else{
					xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI +'",'+'"parentURI":"== '+this.parentURI+'","metadata" : {'+str+'}'+'}'+']}');
				}
			}else{
				if(result && result!=""){
					xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI +'","objectType" : "== application/cdmi-container",'+'"createTime":"== '+createtime+'",'+'"parentURI":"== '+this.parentURI+'","metadata" : {'+str+'}'+'}'+'],'+result+'}');
				}else{
					xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI+'",'+'"createTime":"== '+createtime+'",'+'"parentURI":"== '+this.parentURI+'","metadata" : {'+str+'}'+'}'+']}');
				}
			}
		}
		tifAqua.printLog("tifAqua.folder().getChildren() status=" + xhr.status + "\n" + xhr.responseText);

		if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
			this.isExist = true;
			var tmp = JSON.parse(xhr.responseText);
			this.totalCount=tmp.count;
			if ( tmp.container && tmp.container.length > 0 ) {
				if ( tmp.container ) {
					for ( var i = 0; i < tmp.container.length; i++ ) {
							var tmp1 = null;
							if ( tmp.container[i].objectType == "application/cdmi-container" ) {
								if ( tmp.container[i].objectName && tmp.container[i].objectName != "" ) {
									tmp1 = new tifAqua.folder( {
										path : tmp.container[i].parentURI,
										name : tmp.container[i].objectName,
										parentObj : this,
										metadata : tmp.container[i].metadata,
										parentURI : tmp.container[i].parentURI,
										domainID : tmp.container[i].domainID,
										isExist : true
									} );
									delete ( tmp1.metadata.cdmi_acl );
									tmp1.objectID = tmp.container[i].objectID;
								}
							}
							if ( tmp1 && ( tmp1.metadata || ( tmp1 && !tmp1.metadata && tmp1.getMetadata( ) == true ) ) ) {
								this.children.push( tmp1 );
							}

					}
				}
			}
		}
		else {
			  ret = false;
		}
	}
	catch (e) {
    ret = false;
  }
  return ret;
};


tifAqua.folder.prototype.getChildrenForObj = function(start,end,result){
  var xhr = new tifAqua.xhr();
  var ret = true;
  try {
		//var parentURI = tifAqua.rootURI+"cits_customers/";
		//var parentURI = tifAqua.rootURI+"transactions/current/";
		var url ="";
		if(start && start=="-1")
		{
			url = tifAqua.restRoot + "/cdmi_query?sort=updatetime";
		}else{
			url = tifAqua.restRoot + "/cdmi_query/?sort=updatetime-&range="+(start ? start:1)+"-"+(end ? end:20);
		}
		xhr.open("PUT", url, false);
		tifAqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object");
		var createtime="";
		if(!this.query){
			if(result && result!=""){
				xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI+'","objectType" : "== application/cdmi-object",'+'"parentURI":"== '+this.parentURI+'"}'+'],'+result+'}');
			}else{
				xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI+'",'+'"parentURI":"== '+this.parentURI+'"}'+']}');
			}
		}
		else{
			var str = [];
			for (var x in this.query) {
				if(this.query[x]!="ALL")
				{
					if(x=="cdmi_ctime"){
						var timeValue = this.query[x].split(",");
						if(timeValue.length > 1){
							str.push('"'+x+'":' + '"between ' + this.query[x]+'"');
						}
						else{
							str.push('"'+x+'":' + '">= ' + this.query[x]+'"');
						}
					}
					else{
						var metadataValue = this.query[x].split(",");
						if(metadataValue.length > 1){
							str.push('"'+x+'":' + '"multi- ' + this.query[x]+'"');
						}
						else{
							str.push('"'+x+'":' + '"== ' + this.query[x]+'"');
						}
					}
				}
			}
			if(createtime==""){
				if(result && result!=""){
					xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI+'","objectType" : "== application/cdmi-object",'+'"parentURI":"== '+this.parentURI+'","metadata" : {'+str+'}'+'}'+'],'+result+'}');
				}else{
					xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI+'","objectType" : "== application/cdmi-object",'+'"parentURI":"== '+this.parentURI+'","metadata" : {'+str+'}'+'}'+']}');
				}
			}else{
				if(result && result!=""){
					xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI+'","objectType" : "== application/cdmi-object",'+'"createTime":"== '+createtime+'",'+'"parentURI":"== '+this.parentURI+'","metadata" : {'+str+'}'+'}'+'],'+result+'}');
				}else{
					xhr.send('{ "cdmi_scope_specification" : [{"domainURI" : "== '+tifAqua.tifDomainURI+'","objectType" : "== application/cdmi-object",'+'"createTime":"== '+createtime+'",'+'"parentURI":"== '+this.parentURI+'","metadata" : {'+str+'}'+'}'+']}');
				}
			}
		}
		tifAqua.printLog("tifAqua.folder().getChildren() status=" + xhr.status + "\n" + xhr.responseText);

		if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
			this.isExist = true;
			var tmp = JSON.parse(xhr.responseText);
			this.totalCount=tmp.count;
			  if (tmp.objects && tmp.objects.length > 0) {
				if (tmp.objects) {
				  for (var i = 0; i < tmp.objects.length; i++) {
					  var tmp1 = null;
					  tifAqua.printLog("tmp1=" + tmp1);
					  if (tmp.objects[i].objectType == "application/cdmi-object") {
						if (tmp.objects[i].objectName &&
						tmp.objects[i].objectName != "") {
						  tmp1 = new tifAqua.file({
							path: tmp.objects[i].parentURI,
							name: tmp.objects[i].objectName,
							objectID: tmp.objects[i].objectID,
							parentObj: this,
							metadata: tmp.objects[i].metadata,
							parentURI: tmp.objects[i].parentURI,
							isExist: true,
							hadGetMetadata: true,
							mimetype: tmp.objects[i].mimetype
						  });

						  delete (tmp1.metadata.cdmi_acl);
						}
					  }

					  if (tmp1 && (tmp1.metadata || (tmp1 && !tmp1.metadata && tmp1.getMetadata() == true))) {
						this.children.push(tmp1);
					  }
				  }
				}
			  }
		}
		else {
			  ret = false;
		}
	}
	catch (e) {
    ret = false;
  }
  return ret;
};


tifAqua.folder.prototype.deleteObj = function(){
  var ret = false;
  var xhr = new tifAqua.xhr();
  if(this.name && !this.name.substring(this.name.length -1) == "/"){
	  this.name += "/";
  }
  var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name)) : "");
  //xhr.open("DELETE", tifAqua.getHasTokenUrl("DELETE", url, 600), false);
  //xhr.setRequestHeader("Accept", "application/cdmi-container");
  //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
  //xhr.setRequestHeader("Authorization", tifAqua.Authorization);
  //xhr.setRequestHeader("Content-Type", "application/cdmi-container");
  xhr.open("DELETE", url, false);
  tifAqua.addXHRHeaderRequest(xhr, "DELETE", url, "application/cdmi-container");
  xhr.send();
  tifAqua.printLog("tifAqua.folder(" + this.name + ").deleteObj(DELETE) status=" + xhr.status + "\n" + xhr.responseText);
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
};
tifAqua.folder.prototype.create = function( ) {
    var ret = false;
    var xhr = new tifAqua.xhr( );
    var url = tifAqua.restRoot + tifAqua.encodePath( this.parentURI ) + ( this.name ? ( encodeURIComponent( this.name ) + "/" ) : "" );
    xhr.open( "PUT", url, false );
    tifAqua.addXHRHeaderRequest( xhr, "PUT", url, "application/cdmi-container" );
    xhr.send( "{}" );
    tifAqua.printLog( "tifAqua.folder(" + this.name + ").create(PUT) status=" + xhr.status + "\n" + xhr.responseText );
    if ( xhr.readyState == 4 && ( xhr.status == 201 || xhr.status == 204 ) ) {
        this.isExist = true;
        if ( xhr.responseText ) {
            var tmp = JSON.parse( xhr.responseText );
            if ( tmp.metadata ) {
                this.metadata = tmp.metadata;
                delete ( this.metadata.cdmi_acl );
                if ( tmp.parentURI ) {
                    this.parentURI = tmp.parentURI;
                }
                if ( tmp.domainID ) {
                    this.domainID = tmp.domainID;
                }
            }
			this.objectID = tmp.objectID;
        }
        if ( this.parentObj ) {
            this.parentObj.children.push( this );
            this.parentObj.sortChildren( );
        }
        ret = true;
    }
    return ret;
}
if ( typeof FileReader != 'undefined' ) {

    tifAqua.createFile = function( args ) {
        this.inputFile = null;
        this.path = null;
		this.metadata = null;
        this.cancelRetryTime = 0;
        this.onstart = function( updateSize, fileSize ) {
            return;
        };
        this.onerror = function( e ) {
            return;
        };
        this.onprogress = function( updateSize, fileSize ) {
            return;
        };
        this.onend = function( updateSize, fileSize ) {
            return;
        };
        this.isPause = false;
        this.isLastPart = false;
        this.isFinish = false;
        this.updateCount = 0;
		this.uploadPercentage = "0%";
        this.runFunction = {
            name : "createFile",
            hasWaitCallBack : false
        };
        this.stepSize = 1024 * 1024;
        //5M
        this.fileReader = null;
        this.xhr = null;
        this.xhr1 = null;
        this.url = null;
        this.bloCount = 0;
        $.extend( this, args );
        this.parentURI = tifAqua.getParentURIByPath( this.path );

        if ( this.inputFile ) {
            //var file = this.inputFile.files[0];
            this.fileSize = this.inputFile.size;
            this.fileName = this.inputFile.name;
            //this.fileLastModifiedDate = file.lastModifiedDate.format("yyyy-MM-dd HH:mm:ss");
        }

        this.xhr = new tifAqua.xhr( );
        this.xhr.parentObject = this;
        this.url = tifAqua.restRoot + tifAqua.encodePath( this.parentURI ) + encodeURIComponent( this.fileName );
        //this.xhr.open("PUT", tifAqua.getHasTokenUrl("PUT", this.url, 600), true);
        //this.xhr.setRequestHeader("Accept", "application/cdmi-object");
        //this.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
        //this.xhr.setRequestHeader("Authorization", tifAqua.Authorization);
        //this.xhr.setRequestHeader("Content-Type", "application/cdmi-object");
        this.xhr.open( "PUT", this.url, true );
        tifAqua.addXHRHeaderRequest( this.xhr, "PUT", this.url, "application/cdmi-object" );
        var obj = {
            mimetype : my.getContentType( this.fileName ),
			metadata : this.metadata
			/*
            metadata : {
                //netdisk_file_size: this.fileSize.toString(),
                //netdisk_file_name: this.fileName,
                //netdisk_file_lastModifiedDate: this.fileLastModifiedDate,
                upLoad_stepSize : this.stepSize.toString( ),
                upLoad_finish : "false",

            }
			*/
        };
		obj.metadata["upLoad_stepSize"] = this.stepSize.toString( );
		obj.metadata["upLoad_finish"] = "false";

        this.bloCount = parseInt( this.fileSize / this.stepSize ) + ( this.fileSize % this.stepSize > 0 ? 1 : 0 );
        if ( this.bloCount == 1 ) {
            this.isLastPart = true;
        }
        for ( var i = 0; i < this.bloCount; i++ ) {
            obj.metadata["upLoad_part" + i] = "false";
        }
        this.onstart( this.updateCount, this.fileSize );
        this.xhr.onreadystatechange = function( ) {
            this.parentObject.runFunction.name = "createFile";
            console.log( this.readyState + ":" + this.status + ":" + this.responseText );
            if ( this.readyState == 4 ) {
                tifAqua.printLog( "tifAqua.createFile(PUT_CreateFileInfo) status=" + this.status + "\n" + this.responseText );
                this.parentObject.runFunction.hasWaitCallBack = false;
                if ( this.parentObject.isPause == false ) {
                    if ( this.status == 201 || this.status == 204) {

					    if (this.status == 201 && this.responseText){
							/* 添加courseware_file_objectID，生成缩略图时需要*/
							var tmp = JSON.parse( this.responseText );
							this.parentObject.metadata["courseware_file_objectID"] = tmp.objectID;
                            this.parentObject.metadata["parent_uri"] = tmp.parentURI;
						}

                        if ( this.parentObject.isPause == false ) {
                            this.parentObject._updateBlock( 0 );
                        }
                    } else {
                        this.parentObject.isPause = true;
                        this.parentObject.onerror( "Create File's metadata failed!" )
                    }
                }
            }
            if ( this.parentObject.runFunction.name == "createFile" ) {
                this.parentObject.runFunction.name = "";
            }
        }
        this.xhr.send( JSON.stringify( obj ) );
        this.runFunction.hasWaitCallBack = true;
        if ( this.runFunction.name == "createFile" ) {
            this.runFunction.name = "";
        }
    }

    tifAqua.createFile.prototype.start = function( ) {
        if ( this.runFunction.hasWaitCallBack == true ) {
            this.isPause = false;
        } else {
            if ( this.isFinish == false && ( ( this.runFunction.name == "_updateFileBloToAqua" && this.isPause == false && this.runFunction.hasWaitCallBack == false ) || ( this.isPause == true && this.runFunction.hasWaitCallBack == false && this.runFunction.name == "" ) ) ) {
                this.runFunction.name = "start";
                if ( this.isPause == true && this.runFunction.hasWaitCallBack == false ) {
                    this.isPause = false;
                    this.onstart( this.updateCount, this.fileSize );
                }
                if ( this.isPause == false ) {
                    //this.xhr.open("GET", tifAqua.getHasTokenUrl("GET", this.url + "?metadata:upLoad_part", 600), true);
                    //this.xhr.setRequestHeader("Accept", "application/cdmi-object");
                    //this.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
                    //this.xhr.setRequestHeader("Authorization", tifAqua.Authorization);
                    //this.xhr.setRequestHeader("Content-Type", "application/cdmi-object");
                    this.xhr.open( "GET", this.url + "?metadata:upLoad_part", true );
                    tifAqua.addXHRHeaderRequest( this.xhr, "GET", this.url, "application/cdmi-object" );
                    this.xhr.onreadystatechange = function( ) {
                        console.log( "this.readyState=" + this.readyState + ";this.status=" + this.status + ";this.responseText=" + this.getAllResponseHeaders( ) );
                        this.parentObject.runFunction.name = "start";
                        if ( this.readyState == 4 ) {
                            tifAqua.printLog( "tifAqua.createFile(GET) status=" + this.status + "\n" + this.responseText );
                            this.parentObject.runFunction.hasWaitCallBack = false;
                            if ( this.parentObject.isPause == false ) {
                                if ( this.status == 200 && this.responseText ) {
                                    var tmp = JSON.parse( this.responseText );
                                    if ( tmp.metadata ) {
                                        var tmp1 = 0;
                                        var index = -1;
                                        for ( var i = 0; i < this.parentObject.bloCount; i++ ) {
                                            if ( tmp.metadata["upLoad_part" + i] == "false" ) {
                                                if ( tmp1 == 0 ) {
                                                    index = i;
                                                }
                                                tmp1++;
                                            }
                                        }
                                        if ( tmp1 == 1 ) {
                                            this.parentObject.isLastPart = true;
                                        }
                                        if ( index >= 0 ) {
                                            this.parentObject._updateBlock( index );
                                        }
                                    }
                                } else {
                                    this.parentObject.isPause = true;
                                    this.parentObject.onerror( "Get aleady updated file part failed!" );
                                }
                            }
                        }
                        if ( this.parentObject.runFunction.name == "start" ) {
                            this.parentObject.runFunction.name = "";
                        }
                    }
                    this.runFunction.hasWaitCallBack = true;
                    this.xhr.send( );
                }
                if ( this.runFunction.name == "start" ) {
                    this.runFunction.name = "";
                }
            }
        }
    };

    tifAqua.createFile.prototype._updateBlock = function( bloNumber ) {
        this.runFunction.name = "_updateBlock";
        if ( this.isPause == false && bloNumber >= 0 && bloNumber < this.bloCount ) {
            if ( !this.fileReader ) {
                this.fileReader = new FileReader( );
                this.fileReader.parentObject = this;
                this.fileReader.onerror = function( e ) {
                    tifAqua.printLog( "FileReader error:" + this.error );
                };
                this.fileReader.onloadend = function( e ) {
                    this.parentObject.runFunction.name = "_updateBlock";
                    this.parentObject.runFunction.hasWaitCallBack = false;
                    if ( this.error == null && this.parentObject.isPause == false ) {
                        this.parentObject._updateFileBloToAqua.apply( this.parentObject, [this.bloNumber, this.result] );
                    } else {
                        this.parentObject.isPause = true;
                        this.parentObject.onerror.apply( this.parentObject, ["_updateBlock(onloadend):" + this.error] );
                    }
                    if ( this.parentObject.runFunction.name == "_updateBlock" ) {
                        this.parentObject.runFunction.name = "";
                    }
                };
            }
            this.fileReader.bloNumber = bloNumber;
            var start = bloNumber * this.stepSize;
            var end = ( ( start + this.stepSize + 1 ) > this.fileSize ) ? this.fileSize : ( start + this.stepSize + 1 );
            var blob = null;
            if ( bloNumber == 0 && this.bloCount == 1 ) {
                blob = this.inputFile;
            } else {
                if ( this.inputFile.slice ) {
                    blob = this.inputFile.slice( start, end, this.inputFile.type );
                } else if ( this.inputFile.webkitSlice ) {//Blob中的方法
                    blob = this.inputFile.webkitSlice( start, end, this.inputFile.type );
                } else if ( this.inputFile.mozSlice ) {
                    blob = this.inputFile.mozSlice( start, end, this.inputFile.type );
                }
            }
            try {
                if ( blob != null ) {
                    this.fileReader.error = null;
                    this.fileReader.result = null;
                    this.fileReader.readyState = 0;
                    //if (this.fileReader.readAsBinaryString) {
                    //  this.fileReader.readAsBinaryString(blob);
                    //}
                    //else if (this.fileReader.readAsArrayBuffer) {
                    this.fileReader.readAsArrayBuffer( blob );
                    //}
                    this.runFunction.hasWaitCallBack = true;
                } else {
                    this.isPause = true;
                    this.onerror.apply( this, ["get local file part failed!"] );
                }
            } catch (e) {
                this.isPause = true;
                this.onerror.apply( this, ["_updateBlock:" + e] );
            }
        }
        if ( this.runFunction.name == "_updateBlock" ) {
            this.runFunction.name = "";
        }
    };

    tifAqua.createFile.prototype._updateFileBloToAqua = function( bloNumber, buff ) {
        var len = ( ( bloNumber < ( this.bloCount - 1 ) ) ? ( this.stepSize ) : ( this.fileSize % this.stepSize ) );
		console.log("[tifAqua.createFile.prototype._updateFileBloToAqua]file_sequence="+this.metadata.file_sequence+",this.metadata.is_cover="+this.metadata.is_cover);
		var uploadPercentageTemp = this.uploadPercentage;
		var filSequenceTemp = this.metadata.file_sequence;
		var isCoverTemp = this.metadata.is_cover;
		console.log("[tifAqua.createFile.prototype._updateFileBloToAqua]this.parentURITemp="+this.parentURITemp+",this.objectIDTemp="+this.objectIDTemp);
        this.runFunction.name = "_updateFileBloToAqua";
        if ( this.isPause == false ) {
            this.xhr.bloNumber = bloNumber;
            var start = bloNumber * this.stepSize;
            var end = ( ( start + this.stepSize - 1 ) > ( this.fileSize - 1 ) ) ? this.fileSize - 1 : ( start + this.stepSize - 1 );

            //this.xhr.open("PUT", tifAqua.getHasTokenUrl("PUT", this.url, 600), true);
            //this.xhr.setRequestHeader("Accept", my.getContentType(this.fileName));
            //this.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
            //this.xhr.setRequestHeader("Authorization", tifAqua.Authorization);
            //this.xhr.setRequestHeader("Content-Type", my.getContentType(this.fileName));
            this.xhr.open( "PUT", this.url, true );
            tifAqua.addXHRHeaderRequest( this.xhr, "PUT", this.url, my.getContentType( this.fileName ) );
            this.xhr.setRequestHeader( "Content-Length", len.toString( ) );
            this.xhr.setRequestHeader( "Content-Range", "bytes " + start + "-" + end + "/" + this.fileSize );
            this.xhr.onreadystatechange = function( ) {
                if ( this.readyState == 4 ) {
                    tifAqua.printLog( "tifAqua.createFile(PUT_Part_" + this.bloNumber + "_Data) status=" + this.status + "\n" + this.responseText );
                    this.parentObject.runFunction.hasWaitCallBack = false;
                    this.parentObject.runFunction.name = "_updateFileBloToAqua";
                    if ( this.parentObject.isPause == false ) {
                        if ( this.status == 204 ) {
                            this.parentObject.runFunction.hasWaitCallBack = true;
                            var _self = this.parentObject;
                            setTimeout( function( ) {
                                _self.runFunction.hasWaitCallBack = false;
                                if ( _self.isPause == false ) {
                                    _self.runFunction.name = "_updateFileBloToAqua";
                                    //_self.xhr.open("PUT", tifAqua.getHasTokenUrl("PUT", _self.url + "?metadata:upLoad_part" + _self.xhr.bloNumber + ";metadata:upLoad_finish", 600), true);
                                    //_self.xhr.setRequestHeader("Accept", "application/cdmi-object");
                                    //_self.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
                                    //_self.xhr.setRequestHeader("Authorization", tifAqua.Authorization);
                                    //_self.xhr.setRequestHeader("Content-Type", "application/cdmi-object");
                                    _self.xhr.open( "PUT", _self.url + "?metadata:upLoad_part" + _self.xhr.bloNumber + ";metadata:upLoad_finish", true );
                                    tifAqua.addXHRHeaderRequest( _self.xhr, "PUT", _self.url, "application/cdmi-object" );
                                    _self.xhr.onreadystatechange = function( ) {
                                        if ( this.readyState == 4 ) {
                                            this.parentObject.runFunction.name = "_updateFileBloToAqua";
                                            tifAqua.printLog( "tifAqua.createFile(PUT_Part_" + this.bloNumber + "_Update_OK) status=" + this.status + "\n" + this.responseText );
                                            this.parentObject.runFunction.hasWaitCallBack = false;
                                            if ( this.parentObject.isPause == false ) {
                                                if ( this.status == 204 ) {
                                                    var len = ( ( this.bloNumber < ( this.parentObject.bloCount - 1 ) ) ? ( this.parentObject.stepSize ) : ( this.parentObject.fileSize % this.parentObject.stepSize ) );
                                                    this.parentObject.updateCount += len;
                                                    if ( this.parentObject.isLastPart == true ) {
                                                        this.parentObject.isFinish = true;
                                                        this.parentObject.isPause = true;
														this.parentObject.genThumbnailAndUpdate(this.parentObject.metadata);
                                                        this.parentObject.onend.apply( this.parentObject, [this.parentObject.updateCount, this.parentObject.fileSize] );
                                                    } else {
                                                        this.parentObject.onprogress.apply( this.parentObject, [this.parentObject.updateCount, this.parentObject.fileSize] );
                                                        this.parentObject.start( );
                                                    }
                                                } else {
                                                    this.parentObject.isPause = true;
                                                    this.parentObject.onerror.apply( this.parentObject, ["Modify upload file's part" + this.bloNumber + " metadata!"] );
                                                }
                                            }
                                            if ( this.parentObject.runFunction.name == "_updateFileBloToAqua" ) {
                                                this.parentObject.runFunction.name = "";
                                            }
                                        }
                                    }
                                    _self.runFunction.hasWaitCallBack = true;
                                    _self.xhr.send.apply( _self.xhr, ['{"metadata":{"upLoad_finish":"' + ( ( _self.isLastPart == true ) ? "true" : "false" ) + '","upload_status":"'+ ( ( _self.isLastPart == true ) ? "finish" : "uploading" ) +'","upload_percentage":"'+ ( ( _self.isLastPart == true ) ? "100%": uploadPercentageTemp)+'","file_sequence":"'+filSequenceTemp+'","is_cover":"'+isCoverTemp +'"}}'] );
                                    tifAqua.printLog( "tifAqua.createFile(PUT) status=" + _self.xhr.status + "\n" + _self.xhr.responseText );

                                    if ( _self.runFunction.name == "_updateFileBloToAqua" ) {
                                        _self.runFunction.name = "";
                                    }
                                }
                            }, 0 );
                        } else {
                            this.parentObject.isPause = true;
                            this.parentObject.onerror.apply( this.parentObject, ["Update file's part" + this.bloNumber + "!"] );
                        }
                    }
                    if ( this.parentObject.runFunction.name == "_updateFileBloToAqua" ) {
                        this.parentObject.runFunction.name = "";
                    }
                }
            }
            //this.xhr.sendAsBinary(buff);
            this.xhr.send( buff );
            this.runFunction.hasWaitCallBack = true;
        }
        if ( this.runFunction.name == "_updateFileBloToAqua" ) {
            this.runFunction.name = "";
        }
    };

    tifAqua.createFile.prototype.cancel = function( ) {
        this.isPause = true;
        if ( this.runFunction.hasWaitCallBack == true && this.cancelRetryTime < 20 ) {
            this.cancelRetryTime++;
            var _self = this;
            setTimeout( function( ) {
                tifAqua.printLog( "Cancel!!" );
                _self.cancel.apply( _self, [] );
            }, 500 );
        } else {
            if ( this.xhr && this.isFinish == false && this.runFunction.hasWaitCallBack == false ) {
                this.xhr.onreadystatechange = null;
                //this.xhr.open("DELETE", tifAqua.getHasTokenUrl("DELETE", this.url, 14400), false);
                //this.xhr.setRequestHeader("Accept", "application/cdmi-object");
                //this.xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
                //this.xhr.setRequestHeader("Authorization", tifAqua.Authorization);
                //this.xhr.setRequestHeader("Content-Type", "application/cdmi-object");
                this.xhr.open( "DELETE", this.url, false );
                tifAqua.addXHRHeaderRequest( this.xhr, "DELETE", this.url, "application/cdmi-object" );
                this.xhr.send( );
                tifAqua.printLog( "tifAqua.createFile(DELETE) status=" + this.xhr.status + "\n" + this.xhr.responseText );
            }
            this.url = null;
            this.inputFile = null;
            this.path = null;
            this.onstart = function( updateSize, fileSize ) {
                return;
            };
            this.onerror = function( e ) {
                return;
            };
            this.onprogress = function( updateSize, fileSize ) {
                return;
            };
            this.onend = function( updateSize, fileSize ) {
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
                name : "",
                hasWaitCallBack : false
            };
        }
    };

    tifAqua.createFile.prototype.pause = function( ) {
        if ( this.isPause == false ) {
            this.isPause = true;
        }
    };

	/*
	上传完毕，生成缩略图和更新课件"courseware_covers_file_objectID"
	*/
	tifAqua.createFile.prototype.genThumbnailAndUpdate = function(metadata) {

					if ( metadata ) {
						tifAqua.enqueue(metadata);
						if ( metadata["is_cover"] == "1" ) {
						    //var coursewareObjID = metadata["courseware_objectID"]
						    //var url = tifAqua.restRoot +"/cdmi_objectid/"+ coursewareObjID;
							var parentURI = metadata["parent_uri"];
							var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + "?metadata:courseware_covers_file_objectID";
						    this.xhr.open("PUT", url, false);
							tifAqua.addXHRHeaderRequest(this.xhr, "PUT", url, "application/cdmi-container");
							var putMetadata = {};
							putMetadata.courseware_covers_file_objectID = metadata["courseware_file_objectID"];
							this.xhr.send('{"metadata":' + JSON.stringify(putMetadata) + '}');
						}
					}

    };

}

tifAqua.enqueue = function(metadata){
	var ret = false;
	var xhr = new tifAqua.xhr();
	var url = null;
	if (metadata && metadata["thumbnail_containerID"] && metadata["thumbnail_containerID"]!="" ){
			tifAqua.thumbnails = metadata["thumbnail_containerID"];
	}
	if(metadata && tifAqua.thumbnails){
		var url = tifAqua.restRoot + "/XMMediaProcessAgentTaskQueue";
		xhr.open("POST", url, false);
		tifAqua.addXHRHeaderRequest(xhr, "POST", url, "application/cdmi-queue");
		if (metadata.courseware_type && metadata.courseware_type == 2) {
			var	values ='{\\"Method\\"'+":"+'\\"31\\",';
			values +='\\"Type\\"'+":"+'\\"2\\",';
			values +='\\"VideoObjectID\\"'+":"+'\\"'+metadata.courseware_file_objectID+'\\",';
			values +='\\"TargetContainerID\\"'+":"+'\\"'+tifAqua.thumbnails+'\\",';
			values +='\\"FrameSizeX\\"'+":"+'\\"100\\",';
			values +='\\"FrameSizeY\\"'+":"+'\\"100\\",';
			values +='\\"TimeStamp \\"'+":"+'\\"HHMMSS\\",';
			values +='\\"Frame \\"'+":"+'\\"n\\"}';
		} else {
			var	values ='{\\"Method\\"'+":"+'\\"21\\",';
			values +='\\"PictureObjectID\\"'+":"+'\\"'+metadata.courseware_file_objectID+'\\",';
			values +='\\"TargetContainerID\\"'+":"+'\\"'+tifAqua.thumbnails+'\\",';
			values +='\\"TargetPictureName\\"'+":"+'\\"'+metadata.courseware_file_objectID+'\\",';
			values +='\\"Size\\"'+":"+'\\"100,100\\",';
			values +='\\"courseware_objectID\\"'+":"+'\\"'+metadata.courseware_objectID+'\\",';
			values +='\\"courseware_file_objectID\\"'+":"+'\\"'+metadata.courseware_file_objectID+'\\",';
			values +='\\"file_sequence\\"'+":"+'\\"'+metadata.file_sequence+'\\",';
			values +='\\"file_name\\"'+":"+'\\"'+metadata.file_name+'\\",';
			values +='\\"user_id\\"'+":"+'\\"'+tifAqua.userName+'\\",';
			values +='\\"is_cover\\"'+":"+'\\"'+metadata.is_cover+'\\"}';
		}

		//console.log('{"mimetype":"text/plain","value":["' + values + '"]}');
		xhr.send('{"mimetype":"text/plain","value":["' +  values + '"]}');

		if (xhr.readyState == 4 && (xhr.status == 201)) {
			ret = true;
		}
	}
	return ret;
}

tifAqua.file.prototype.deleteObjById = function(){
  var ret = false;
  if (this.name && this.name != "") {
    var xhr = new tifAqua.xhr();
    // var url = tifAqua.restRoot + tifAqua.encodePath(this.parentURI) + encodeURIComponent(this.name);
    var url = tifAqua.restRoot +"/cdmi_objectid/"+this.name;
    xhr.open("DELETE", url, false);
    tifAqua.addXHRHeaderRequest(xhr, "DELETE", url, "application/cdmi-object");
    xhr.send();
    tifAqua.printLog("tifAqua.file(" + this.name + ").deleteObj(DELETE) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && (xhr.status == 204 || xhr.status == 200)) {
      this.metadata = {};
      this.isExist = false;
      ret = true;
    }
  }
  return ret;
};

/**
 * 设置Metadata
 * @param metadata
 */
tifAqua.file.prototype.setMetadataById = function(metadata){
  var ret = false;

  if (metadata) {
    var xhr = new tifAqua.xhr();
	var url = tifAqua.restRoot +"/cdmi_objectid/"+this.name+ "?";
    var names = [];
    var putMetadata = {};
    var tmpMetadata = {};
    for (var x in metadata) {
      //names.push("metadata:netdisk_custom_" + encodeURIComponent(x));
      names.push("metadata:"+encodeURIComponent(x));
      //tmpMetadata["netdisk_custom_" + x] = metadata[x];
      tmpMetadata[x] = metadata[x];
      if (metadata[x] != null) {
        //putMetadata["netdisk_custom_" + x] = metadata[x];
        putMetadata[x] = metadata[x];
      }
    }
    if (names.length > 0) {
      url = url+names.join(";");
      xhr.open("PUT", url, false);
      tifAqua.addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-object");
      xhr.send('{"metadata":' + JSON.stringify(putMetadata) + '}');
      tifAqua.printLog("tifAqua.file(" + this.name + ").setMetadata(PUT) status=" + xhr.status + "\n" + xhr.responseText);
      if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 204 || xhr.status == 1223)) {
        for (var x in tmpMetadata) {
          if (tmpMetadata[x] == null) {
            delete (this.metadata[x]);
          }
          else {
            this.metadata[x] = tmpMetadata[x];
          }
        }
		if (xhr.responseText) {
			var tmp = JSON.parse(xhr.responseText);
			this.objectID = tmp.objectID;
		}
        ret = true;
      }
    }
  }
  return ret;
};

//支持通配符获取container
tifAqua.folder.prototype.getMetadataForWildcard = function(aquatoken, expires, uriprefix){
	var ret = false;
	var xhr = new tifAqua.xhr();
	var url = tifAqua.host + tifAqua.encodePath(this.parentURI) + (this.name ? (encodeURIComponent(this.name) + "/") : "");
	if (url.indexOf("?") < 0) {
		url += "?";
	}
	else {
		url += "&";
	}
	url += "uriprefix=" + uriprefix;
	url += "&expires=" + expires;

	xhr.open("GET", url, false);
	tifAqua.addXHRHeaderRequestForWildcard(xhr, url, "application/cdmi-container", aquatoken);
	xhr.send();
    tifAqua.printLog("tifAqua.folder(" + this.name + ").getMetadata(GET) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {
		var tmp = JSON.parse(xhr.responseText);
		if (tmp.metadata) {
		for (var x in tmp.metadata) {
			if (tmp.metadata[x] == null) {
			delete (tmp.metadata[x]);
			}
		}
		$.extend(this.metadata, tmp.metadata);
		delete (this.metadata.cdmi_acl);
		if (tmp.parentURI) {
			this.parentURI = tmp.parentURI;
		}
		this.objectID = tmp.objectID;
		this.hadGetMetadata = true;
		this.isExist = true;
		ret = true;
		}
	}
	return ret;
};

//支持通配符获取object
tifAqua.file.prototype.getMetadataForWildcard = function(aquatoken, expires, uriprefix){
  var ret = false;
  if (this.name && this.name != "") {
    var xhr = new tifAqua.xhr();
    var url = tifAqua.host + tifAqua.encodePath(this.parentURI) + encodeURIComponent(this.name);

	if (url.indexOf("?") < 0) {
		url += "?";
	}
	else {
		url += "&";
	}
	url += "uriprefix=" + uriprefix;
	url += "&expires=" + expires;

	xhr.open("GET", url, false);
    tifAqua.addXHRHeaderRequestForWildcard(xhr, url, "application/cdmi-object", aquatoken);
    xhr.send();
    tifAqua.printLog("tifAqua.file(" + this.name + ").getMetadata(GET) status=" + xhr.status + "\n" + xhr.responseText);
    if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText) {

      var tmp = JSON.parse(xhr.responseText);
	  $.extend(this.metadata, tmp.metadata);
	  this.objectID = tmp.objectID;
	  this.name = tmp.objectName;
	  this.isExist = true;
      ret = true;
    }
  }
  return ret;
};

//支持通配符获取URL
tifAqua.file.prototype.getDownloadImageURLByNameForWildcard = function(aquatoken, expires, uriprefix){
  var ret = "";
  if (this.name && this.name != "") {
	var url = tifAqua.host + tifAqua.encodePath(this.path) + this.name;
	if (url.indexOf("?") < 0) {
		url += "?";
	}
	else {
		url += "&";
	}
	url += "uriprefix=" + uriprefix;
	url += "&expires=" + expires;

    ret = tifAqua.addXHRHeaderRequestForWildcard(null, url, "", aquatoken);
  }
  return ret;
};

return tifAqua;
});
