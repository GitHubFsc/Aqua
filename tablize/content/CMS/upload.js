self_service_adviser_upload={
	uploadFile:function(buttonId,inputFileOnchangeCallback,inputCallback){
	    var that=this;
	  var jq=jQuery;
		var shopPic = document.createElement("input");
		shopPic.setAttribute("type", "file");
		//systemFile.setAttribute("multiple", "true");
		//systemFile.setAttribute("accept", "*");
		shopPic.setAttribute("style", "display:none");
		shopPic.onchange = function(){
			inputCallback();
			var file = this.files[0];
			//以文本读取，显示界面。
			var reader = new FileReader();
			reader.onload=function(e){
				inputFileOnchangeCallback(file,this.result);
			};
			reader.readAsDataURL(file);
		}
		jq('body')[0].appendChild(shopPic);
		jq("#"+buttonId+"").click(function(){
				shopPic.click();
		 });
	},
	checkParentFolderExist:function(urlPath,failCallback,successCallback){
	  var jq=jQuery;
		var method = "GET";
    var contentType = "application/cdmi-container";
    var nowDateTime = new Date().getTime();
    var urlPath =urlPath;
    var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
    jq.ajax({
        type: method,
        url:urlPath,
        async : true,
        dataType: "json",
        //data:"{}",
        headers: {
            "Accept": contentType,
            "Content-Type": contentType,
            "Authorization": "AQUA " + my_aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my_aqua.secretAccessKey, StringToSign_netdisk)),
            "x-aqua-date": nowDateTime,
            "X-CDMI-Specification-Version": "1.0.2"
        },
        contentType: "application/json"
    }).done(function (data) {
		  successCallback()
    }).fail(function (jqXHR, textStatus){ 
			 failCallback(jqXHR, textStatus);
    });
	},
	createParentFolderIfParentFolderNotExist:function(urlPath,createSuccessCallback){
		var jq=jQuery;
		var method = "PUT";
    var contentType = "application/cdmi-container";
    var nowDateTime = new Date().getTime();
    var urlPath =urlPath;
    var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
    jq.ajax({
        type: method,
        url:urlPath,
        async : true,
        dataType: "json",
        data:"{}",
        headers: {
            "Accept": contentType,
            "Content-Type": contentType,
            "Authorization": "AQUA " + my_aqua.accessKeyId + ":" + my.base64Encode(str_hmac_sha1(my_aqua.secretAccessKey, StringToSign_netdisk)),
            "x-aqua-date": nowDateTime,
            "X-CDMI-Specification-Version": "1.0.2"
        },
        contentType: "application/json"
    }).done(function (data) {
			createSuccessCallback()
    });
	}
}
