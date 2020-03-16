var CMSAppAdmin = (function($,Tree){
	function parseStr(para){
    return para != null ? para : '';
  };
	var cmsModule = {
    init:function(){
			this.initPara();
			this.getCardFile();
			this.initRequest();
			this.initFirstPageUI();
			var self=this;
			this.UserLogin(function(data){
				self.UserAccessKeyId=data.objectID;
				self.UsersecretAccessKey=data.secretAccessKey;
			});
			this.templateFileObj=[];
    },
	getCardFile:function(){
	    var self=this;
			jQuery.ajax({
				type: "GET",
				url: "content/CMS/cardTitleItemTemplateObject.json",
				async: false,
				dataType: "json"
		}).done(function(data) {
			self.cardFileObj=data
		})
	},

		initPara:function(){
			this.notInitPageAttributeBody=true;
			this.notInitCardAttributeBody=true;
			this.notInitItemAttributeBody=true;
			this.notInitItemAppearanceBody=true;
			this.cardFileObj=null;
			this.rowIndex=0;
			this.tabType="editAppType";
			this.treeName="";
			this.currentTreeId="";
			this.expandedData=[];
			this.clickTreeNode={};
			this.tabInex=0;
			this.allCardData=[];
			this.referTable={	
				"topic":i18n("CMS_ASSET_TOPIC"),
				"column":i18n("CMS_ASSET_SERVICE_COLUMN"),
        "vod_asset":i18n("CMS_ASSET"),
				"vod_bundle":i18n("CMS_ASSET_PACKAGE"),
				"BuyProductPackage":i18n("CMS_ASSET_BUY_PRODUCT_PACKAGE"),
				"HistoryVODItem":i18n("CMS_ASSET_MY_HISTORY_VIEW"),
			};
			this.pageFileObj={
			"text": {
				"normal": {
					"type": "relative",
					"width": -2,
					"height": -1,
					"top": 0,
					"left": 0,
					"elements": [
						{
							"type": "text",
							"zIndex": 0,
							"index": 0,
							"text": "$normalText$",
							"top": 0,
							"left": 0,
							"right": 0,
							"bottom": 0,
							"width": -2,
							"height": -1,
							"textColor": "$normalTextColor$",
							"shapeBgColor": "$normalShapeBgColor$",
							"shapeBorderColor": "$normalShapeBorderColor$",
							"shapeBorderWidth": "0",
							"padding": "13,10,13",
							"textSize": 24
						}
					]
				},
				"focus": {
					"type": "relative",
					"width": -2,
					"height": -1,
					"top": 0,
					"left": 0,
					"elements": [
						{
							"type": "text",
							"zIndex": 0,
							"index": 0,
							"text": "$focusText$",
							"top": 0,
							"left": 0,
							"right": 0,
							"bottom": 0,
							"width": -2,
							"height": -1,
							"textColor": "$focusTextColor$",
							"shapeBgColor": "$focusShapeBgColor$",
							"shapeBorderColor": "$focusShapeBorderColor$",
							"shapeBorderWidth": "0",
							"padding": "13,10,13",
							"textSize": 24
						}
					]
				},
				"selected": {
					"type": "relative",
					"width": -2,
					"height": -1,
					"top": 0,
					"left": 0,
					"elements": [
						{
							"zIndex": 0,
							"index": 0,
							"top": 0,
							"left": 0,
							"right": 0,
							"bottom": 0,
							"width": -2,
							"height": -1,
							"textColor": "$selectTextColor$",
							"shapeBgColor": "$selectShapeBgColor$",
							"shapeBorderColor": "$selectShapeBorderColor$",
							"shapeBorderWidth": "0",
							"padding": "13,10,13",
							"textSize": 24,
							"type": "text",
							"text": "$selectText$"
						}
					]
				}
			},
			"image": {
				"normal": {
					"type": "relative",
					"elements": [
						{
							"index": 0,
							"type": "image",
							"zIndex": 0,
							"top": 0,
							"left": 0,
							"width": -1,
							"height": -1,
							"url": "$normalPoster$",
							"isVisible": true
						},
						{
							"index": 1,
							"type": "image",
							"zIndex": 1,
							"top": 0,
							"left": 0,
							"width": -1,
							"height": -1,
							"url": "$focusPoster$",
							"isVisible": false
						},
						{
							"index": 2,
							"type": "image",
							"zIndex": 2,
							"top": 0,
							"left": 0,
							"width": -1,
							"height": -1,
							"url": "$selectPoster$",
							"isVisible": false
						}
					]
				},
				"focus": {
					"type": "relative",
					"elements": [
						{
							"index": 0,
							"type": "image",
							"zIndex": 0,
							"top": 0,
							"left": 0,
							"width": -1,
							"height": -1,
							"url": "$normalPoster$",
							"isVisible": false
						},
						{
							"index": 1,
							"type": "image",
							"zIndex": 1,
							"top": 0,
							"left": 0,
							"width": -1,
							"height": -1,
							"url": "$focusPoster$",
							"isVisible": true
						},
						{
							"index": 2,
							"type": "image",
							"zIndex": 2,
							"top": 0,
							"left": 0,
							"width": -1,
							"height": -1,
							"url": "$selectPoster$",
							"isVisible": false
						}
					]
				},
				"selected": {
					"type": "relative",
					"elements": [
						{
							"index": 0,
							"type": "image",
							"zIndex": 0,
							"top": 0,
							"left": 0,
							"width": -1,
							"height": -1,
							"url": "$normalPoster$",
							"isVisible": false
						},
						{
							"index": 1,
							"type": "image",
							"zIndex": 1,
							"top": 0,
							"left": 0,
							"width": -1,
							"height": -1,
							"url": "$focusPoster$",
							"isVisible": false
						},
						{
							"index": 2,
							"type": "image",
							"zIndex": 2,
							"top": 0,
							"left": 0,
							"width": -1,
							"height": -1,
							"url": "$selectPoster$",
							"isVisible": true
						}
					]
				}
			},
			"emptyTitleItemContent": {
				"actionIntent": {
					"intentName": "ReqFocus",
					"slots": {
						"direction": "down"
					}
				},
				"data": {
					"title": "精彩推荐"
				}
			},
			"titleItemActionIntent": {
				"intentName": "OpenRecommand",
				"slots": {
					"type": "$type$",
					"folderFullPath": "$folderFullPath$",
					"templateId": "$templateId$",
					"pid": "$pid$",
					"paid": "$paid$"
				}
			}
		 };
		 this.treeColumnDataTemplateName="";
		},
		
		initRequest:function(){
			var self=this;
			var aquaHost = aqua_host;	
			var storage_username = LOGIN_AQUA_USERNAME;
			var storage_password = LOGIN_AQUA_PWD;
			var storage_domain   = LOGIN_AQUA_DOMAIN_URI;
			this.upload = new UploadModule(aquaHost, storage_username, storage_password , storage_domain);
		},
		
		UserLogin:function(successCallBack){
			//try{
			 if((typeof(LOGIN_AQUA_USERNAME)!="undefined")&&(typeof(LOGIN_AQUA_PWD)!="undefined")&&(typeof(LOGIN_AQUA_DOMAIN_URI)!="undefined")){
					var userName = LOGIN_AQUA_USERNAME;
					var password =LOGIN_AQUA_PWD;
					var authStrToEncode = userName + ":" + password;
					jQuery.ajax({
							type: "GET",
							url: aqua_host + "/aqua/rest/cdmi/cdmi_users/" + userName + "",
							async: false,
							dataType: "json",
							headers: {
									"Accept": "application/cdmi-user",
									"Authorization": "Basic " + my.base64Encode(authStrToEncode),
									"x-aqua-user-domain-uri": LOGIN_AQUA_DOMAIN_URI,
									"X-CDMI-Specification-Version": "1.0.2"
							},
							contentType: "application/json"
					}).done(function(data) {
						successCallBack(data)
					})
				}
				//}}catch(e){
				//};
		},
		openCreateAppDialog: function(){
		 var htmlUrl="content/CMS/user-dialog.html";
		 var htmlHeight=463;  
     var self = this;
     var dialog = new PopupDialog({
        width: 725,
        height: htmlHeight,
        url: htmlUrl,
        context: {},
        callback: function(){
					$("#cms_dialog_submit").unbind().bind('click', function () {//here
					  var appName=document.getElementById("cms_app_admin_app_name").value;
						if(appName.indexOf("_")!=-1){//mail:2019.8.27
						  var text=i18n("CMS_COMFIRM1");
							self.showOverlayMsgDialog(text, function() {
								
							},function(){
								$("#user-admin-msg-cancel").hide();
								$("#user-admin-msg-content").css("margin-top","10px");
							});
							return;
						};
						
					  var method = 'POST';
						var dataPost={
							"creator_app_key": "aquaBO",//??确认
							"is_public": true,//is_public 默认是
							"metadata_public": {
								"source": "ui",//这块查看了navigation页面，是写死传入后台的
								"readonly": "false",//这块查看了navigation页面，是写死传入后台的
								"app_type": "CMS",
								"tree_class":"cms_tree",
								"need_release":true//mail:2019.8.12
							},
							"metadata": {
								"appName":document.getElementById("cms_app_admin_app_name").value,		
								"screenWidth":document.getElementById("cms_app_admin_screen_width").value,		
								"screenHeight":document.getElementById("cms_app_admin_screen_height").value,
								"navigationWidth":document.getElementById("cms_app_admin_nav_width").value,
								"navigationHeight":document.getElementById("cms_app_admin_nav_height").value,	
								"描述":	document.getElementById("cms_app_admin_desc").value
							}
						};
						var treeName=encodeURIComponent(document.getElementById("cms_app_admin_app_name").value);
						var url = aquapaas_host + '/aquapaas/rest/navigation/trees/'+treeName+'?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
						url=url+"&tree_version=00";
						$.ajax({
							type: method,
							url: url,
							async: true,
							data: JSON.stringify(dataPost),
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
							}
						}).always((resp, status, xhr) => {
							if (status == 'success') {
								self.createDialog.close();
								self.refreshTable();
								self.createFolder(appName,function(){
								})
							}
						})
					});
        }
      });
			this.createDialog=dialog;
      dialog.open();
    },
		getQuery: function (options, callback) {
      var that = this;
			var secretAccessKey = that.UsersecretAccessKey;
			var accessKeyId = that.UserAccessKeyId;
		  that.aquaUtil = new CMSAquaUtil({
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
      });
      var objectType = options.objectType;
      var url = options.url;
      that.aquaUtil.query({
        objectType: objectType,
        scopeSpec: [{
          parentURI: '== ' + url,
        }],
        resultsSpec: {},
        preserve: true,
        async: true,
        callback: callback
      });
    },
	
	checkCreateSnapTreeAction:function(version,snapShotData){
		var currentAppLevelTreeData=this.currentAppLevelTreeData;
		var result="fail";
		this.getSingleTree(currentAppLevelTreeData.name,currentAppLevelTreeData.id,function(data){
			if(data&&data.metadata_public&&data.metadata_public.last_snapshot_version&&(data.metadata_public.last_snapshot_version==version)){
				result="success"
			}
			else{
				result="fail"
			}
		});
		return result;
	},
	
	intervalCheckSnapTreeCreated:function(version,snapShotData){
	    var self=this;
		var version=version;
	    var snapShotData=snapShotData;
		setTimeout(function (){
			var status=self.checkCreateSnapTreeAction(version,snapShotData);
			if(status=="success"){
				self.afterCreateSnapTree(version,snapShotData)
			}
			else{
				self.intervalCheckSnapTreeCreated(version,snapShotData)
			}
		}, 30000);
	},
	
	checkCreateSnapTreeFinished:function(version,snapShotData){
		//立即检查一次
		var status=this.checkCreateSnapTreeAction(version,snapShotData);
		if(status=="success"){
			this.afterCreateSnapTree(version,snapShotData)
		}
		else{
			this.intervalCheckSnapTreeCreated(version,snapShotData)
		}
	},
	
	afterCreateSnapTree:function(version,snapShotData){
		var self=this;
	    var version=version;
	    var snapShotData=snapShotData;
	    self.pushToAudit(snapShotData,function(){
			self.authDialog.close();
			if(snapShotData&&snapShotData.version){
				var new_name = self.currentAppLevelTreeData["name"]+"_"+snapShotData.version;
				//创建文件夹
				var cmsJsonFileLocation=aqua_host+"/aqua/rest/cdmi/default/netdisk/" + LOGIN_AQUA_USERNAME+"/"+CMSJsonFilePath+self.currentAppLevelTreeData["name"]+"/"+new_name+"/";
				self.checkFolderExist(encodeURI(cmsJsonFileLocation),function(jqXHR){
					 if(jqXHR&&jqXHR.status&&(jqXHR.status==404)){
						self.folder_create(encodeURI(cmsJsonFileLocation),function(){
						});
					 }
				},function(){
					
				});
				//获得work下所有文件
				self.getQuery({//here
					objectType: 'application/cdmi-object',
					url: "/default/netdisk/" + LOGIN_AQUA_USERNAME+"/"+CMSJsonFilePath+self.currentAppLevelTreeData["name"]+"/"+"work/",
				}, function (result) {
					 var objects = result.objects || [];
					var list = objects.map(function (notice, i) {
						var objectName = notice.objectName;
						var obj = self.aquaUtil.getObject({
							path: "/default/netdisk/" + LOGIN_AQUA_USERNAME+"/"+CMSJsonFilePath+self.currentAppLevelTreeData["name"]+"/"+new_name+"/",
							name: objectName
						});
						obj.copyFrom(false, "/default/netdisk/" + LOGIN_AQUA_USERNAME+"/"+CMSJsonFilePath+self.currentAppLevelTreeData["name"]+"/"+"work/" + objectName, function () {
								
							}, function () {
								
							});
					});
				
				})					
			}
		});
	},
	
		openAuditDialog: function(){
		  var htmlUrl="content/CMS/audit-dialog.html";
      var self = this;
      var dialog = new PopupDialog({
        width: 468,
        height: 286,
        url: htmlUrl,
        context: {},
        callback: function(){
					$("#cms_audit_submit").unbind().bind('click', function () {
						var name=self.currentAppLevelTreeData["name"];
						var authBody={
							version_desc: document.getElementById("cms_version_desc").value
						};
						
						self.getTreeSnapshot(name,authBody,function(data){
						  var snapShotData=data;
						  var version=snapShotData.version||"";
						  if(version!=""){
							self.checkCreateSnapTreeFinished(version,snapShotData)//mail:2019.10.31
						  }
						});
					})
					$("#cms_asset_admin_audit_dialog_close").unbind().bind('click', function () {
						self.authDialog.close()
					})
        }
      });
      dialog.open();
			self.authDialog=dialog;
    },
		
		pushToAudit:function(data,callback){
			var method = 'Post';
			var treeid=data.id;
			var obj={
				filter:data.name||"",
			  version:data.version||"",
				description:document.getElementById("cms_version_desc").value
			}
      var url = aquapaas_host + '/aquapaas/rest/auditflow/instance/metadata/nav_tree/' + treeid;
      var urlParam = [];
      urlParam.push('user_id=' + my.paas.user_id)//用户级授权
      urlParam.push('access_token=' + my.paas.access_token)//用户级授权
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        },
        data: JSON.stringify(obj)
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback();
        }
      })
		},
		
		getTreeSnapshot:function(name,authObj,callback){
			var method = 'Post';
      var url = aquapaas_host + '/aquapaas/rest/navigation/trees/snapshot/' + name;
      var urlParam = [];
      urlParam.push('app_key=' + paasAppKey)
      urlParam.push('timestamp=' + new Date().toISOString())
			urlParam.push('&tree_version=00')
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(authObj)
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback && callback(resp)
        }
      })
		},
		
		getFilesBelowPath: function(parent_uri,callback){
		  var self=this;
			var secretAccessKey = self.UsersecretAccessKey;
			var accessKeyId = self.UserAccessKeyId;
			var parent_uri = parent_uri;
			var object_type = "application/cdmi-object";
			var scope_spec = [{
				"objectType": "== " + object_type,
				"parentURI": "== " + parent_uri
			}];
			var specs = {
				'cdmi_scope_specification': scope_spec
				//'cdmi_results_specification': result_spec
			};
			var restRoot = aqua_host+ "/aqua/rest/cdmi";
			var url = restRoot + "/cdmi_query/?sort=updatetime-";
			jQuery.ajax({
					type: 'PUT',
					url: url,
					async: false,
					data: JSON.stringify(specs),
					dataType: 'json',
					headers: getAjaxRequestHeaders('PUT', url, object_type),
			}).done(function(data) {
				callback(data)
			});
			function getAjaxRequestHeaders(method, url, contentType) {
				if (!accessKeyId || !secretAccessKey) {
					return;
				}
				var urlPath = encodeURI(trimURL(url));
				var nowDateTime = new Date().getTime();
				var stringToSign = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
				return {
					'Accept': contentType,
					'Content-Type': contentType,
					'Authorization': 'AQUA ' + accessKeyId + ":" + my.base64Encode(str_hmac_sha1(secretAccessKey, stringToSign)),
					'x-aqua-date': nowDateTime,
					'x-aqua-read-reference-redirect': false,
					};
				};
			function trimURL(){
				if ( typeof url !== 'string') {
						return '';
				}
				if (url.indexOf('//') > -1) {
						url = url.split('//')[1];
				}
				var tmp1 = url.indexOf("/") >= 0 ? url.indexOf("/") : 0;
				var tmp2 = url.indexOf("?");
				var urlPath = url.substr(tmp1, (tmp2 >= 0 ? tmp2 : url.length) - tmp1);
				return urlPath;
			};		
		},
		
		transferAndFillPosterUrl:function(posterUrl,eleId){
			if((typeof posterUrl!="undefined")&&(posterUrl)&&(posterUrl!=null)){
				var posterUrl=posterUrl;
				var strArray=posterUrl.split("http://");
				var strArrayProcessed=[];
				for(var i= 0,len = strArray.length;i<len;i++){
					if(strArray[i].indexOf("https://")!=-1){
					var temp=strArray[i].split("https://");
					for(var j= 0,lenB = temp.length;j<lenB;j++){
						if(j==0){
						strArrayProcessed.push("http://"+temp[j])
						}
						else{
						strArrayProcessed.push("https://"+temp[j])
						}
					};
					}
					else{
					strArrayProcessed.push("http://"+strArray[i])
					}
				}; 
				var choosedPosterUrl="";
				for(var i= 0,len = strArrayProcessed.length;i<len;i++){
					var temp=strArrayProcessed[i].substring(strArrayProcessed[i].lastIndexOf("/"),strArrayProcessed[i].lastIndexOf("."));
					var tempRemoveNum=temp.replace(/[^a-z]+/ig,""); //取里面英文字母
					if(tempRemoveNum.substring(tempRemoveNum.length-1,tempRemoveNum.length)=="T"){
					choosedPosterUrl=strArrayProcessed[i];
					break;
					}
				};
				if(choosedPosterUrl.substring(choosedPosterUrl.length-1,choosedPosterUrl.length)==","){
				 choosedPosterUrl=choosedPosterUrl.substring(0,choosedPosterUrl.length-1)
				};
				document.getElementById(eleId).value=choosedPosterUrl||"";
			}
		},
		
		combineFlie_url:function(url_,method){
		  var self=this;
			var url=encodeURI(url_);
			var method=method;
			//try {     
				var arrObj = url.split("//");
				var tmp1 = (arrObj[1].indexOf("/") >= 0) ? arrObj[1].indexOf("/") : 0;
				var tmp2 = arrObj[1].indexOf("?");
				var urlPath = arrObj[1].substr(tmp1, ((tmp2 >= 0) ? (tmp2) : arrObj[1].length) - tmp1);
				var nowDateTime = new Date().getTime();
				var StringToSign = "GET\n\n" + nowDateTime + "\n" + urlPath;//因为content-type是空，所以GET\n\n。
				var ret = url;
				if (tmp2 < 0) {
					ret += "?";
				} else {
					ret += "&";
				}
				ret += "aquatoken=" + encodeURIComponent(self.UserAccessKeyId) + ":" + encodeURIComponent(my.base64Encode(str_hmac_sha1(self.UsersecretAccessKey, StringToSign)));
				ret += "&xaquadate=" + nowDateTime;
				return ret;
			//} catch (e) {
				//return "";
			//}
		},
		
		popupLayout: function(){
			 var htmlUrl="content/CMS/create_card.html";
			 var htmlHeight=659;  
			 var self = this;
			 var dataJSONfileObjects=[];
			 var dialog = new PopupDialog({
					width: 723,
					height: htmlHeight,
					url: htmlUrl,
					context: {},
					callback: function(){
						$("#cms_app_admin_layout_container").parent().mCustomScrollbar({
							theme:"my-theme"
						});
						if(typeof CMScardTemplatePath!="undefined"){
							var parent_uri = "/default/netdisk/"+LOGIN_AQUA_USERNAME+"/"+CMScardTemplatePath.substring(0,CMScardTemplatePath.length-1);
							self.getFilesBelowPath(parent_uri,function(dataJSONfile){
								if(typeof CMScardTemplateImagePath!="undefined"){
									var img_parent_uri = "/default/netdisk/"+LOGIN_AQUA_USERNAME+"/"+CMScardTemplateImagePath.substring(0,CMScardTemplateImagePath.length-1);
									var dataImageObjectsList=[];
									self.getFilesBelowPath(img_parent_uri,function(dataImage){
										if(dataImage.objects){
											var dataImageObjectsList=dataImage.objects;
										};
										if(dataJSONfile.objects){
											dataJSONfileObjects=dataJSONfile.objects;
											self.cardJSONLen=dataJSONfileObjects.length;
											self.imgLoadLen=0;
											for(var i= 0,len = dataJSONfileObjects.length;i<len;i++){
											  var curImgName="";
												var imgPath="";
												var dataJSONfileObjectsName=dataJSONfileObjects[i].objectName;
												var JSONFilelastIndexDash=dataJSONfileObjectsName.lastIndexOf(".");
										    var objectNameFirstPart=dataJSONfileObjectsName.substring(0,JSONFilelastIndexDash);
												for(var j= 0,lenImg = dataImageObjectsList.length;j<lenImg;j++){
													var dataImageObjectsListObjName=dataImageObjectsList[j].objectName;
													var ImgFilelastIndexDash=dataImageObjectsListObjName.lastIndexOf(".");
													if(dataImageObjectsListObjName.substring(0,ImgFilelastIndexDash)==objectNameFirstPart){
														curImgName=dataImageObjectsListObjName;
														if(curImgName!=""){
																var imgPathTemp=aqua_host+"/aqua/rest/cdmi"+img_parent_uri+"/"+curImgName;
																imgPath=self.combineFlie_url(imgPathTemp,"GET");
														}
														break;
													}
												};
												var marginTop=(i>0?6:0);
												var bottomWordsColor=(i==0?"#0099cb":"#727272");
												var className=(i==0?"cms_app_admin_layout_top_blue":"cms_app_admin_layout_top_grey");
												var bottomClassName=(i==0?"cms_app_admin_layout_bottom_blue":"cms_app_admin_layout_bottom_grey");
												$('#cms_app_admin_layout_container').append("<div class=\"cms_app_admin_layout\" style=\"margin-top:"+marginTop+"px;\"><img id=\"cms_app_admin_layout_top_son_"+i+"\" style=\"height:auto\" class=\"cms_app_admin_layout_top_son "+className+"\" src = \""+imgPath+"\"/><div class=\"cms_app_admin_layout_bottom "+bottomClassName+"\" style=\"color:"+bottomWordsColor+"\">"+objectNameFirstPart+"</div></div>");
												document.getElementById("cms_app_admin_layout_top_son_"+i+"").onload=function(){
													self.imgLoadLen=self.imgLoadLen+1;
													if(self.imgLoadLen==self.cardJSONLen){
														$('#cms_app_admin_layout_container').css("visibility","visible")
													}
												};
												document.getElementById("cms_app_admin_layout_top_son_"+i+"").onerror=function(){
													self.imgLoadLen=self.imgLoadLen+1;
													if(self.imgLoadLen==self.cardJSONLen){
														$('#cms_app_admin_layout_container').css("visibility","visible")
													}
												};
											}
										};
									})
								}
							})
						}
						$(".cms_app_admin_layout").each(function(index){
							$(this).unbind().bind('click', function () {
									$(".cms_app_admin_layout").each(function(){
										$(this).children().eq(0).removeClass("cms_app_admin_layout_top_blue").addClass("cms_app_admin_layout_top_grey");
										$(this).children().eq(1).css("color","#727272").removeClass("cms_app_admin_layout_bottom_blue").addClass("cms_app_admin_layout_bottom_grey");
									})
									$(this).children().eq(0).removeClass("cms_app_admin_layout_top_grey").addClass("cms_app_admin_layout_top_blue");
									$(this).children().eq(1).css("color","#0099cb").removeClass("cms_app_admin_layout_bottom_grey").addClass("cms_app_admin_layout_bottom_blue");
								})
							});
						$("#cms_add_card_submit").unbind().bind('click', function () {
							self.addNewCardBelowAppRequest(dataJSONfileObjects)
						})
					}
				})
				this.createDialog=dialog;
				self.addNewCardDialog=dialog;
				dialog.open();
		},
		openAddNewPageDialog: function(){
			var htmlUrl="content/CMS/add_new_page.html";
      var self = this;
      var dialog = new PopupDialog({
        width: 468,
        height: 224,
        url: htmlUrl,
        context: {},
        callback: function(){
					$("#cms_add_new_page_submit").unbind().bind('click', function () {
						self.addNewPageBelowAppRequest()
          })
					}
				});
				self.addNewPageDialog=dialog;
				dialog.open();
			},
			addTreePoint: function(url,dataPost,callback){
			  var method="POST";
				$.ajax({
				type: method,
				url: url,
				async: true,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(dataPost),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
					}
				}).always((resp, status, xhr) => {
					if (status == 'success') {
						callback()
					}
				})
			},
			
		  viewSingleFile:function(fileNameurl,callback){
			  var self=this;
				var secretAccessKey = self.UsersecretAccessKey;
				var accessKeyId = self.UserAccessKeyId;
				var method = "GET";
				var contentType = "application/cdmi-object";
				var nowDateTime = new Date().getTime();
				var urlPath = fileNameurl;
				var StringToSign_netdisk = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
				jQuery.ajax({
					type: method,
					url: aqua_host+urlPath + "",
					async: false,
					dataType: "json",
					headers: {
							"Accept": contentType,
							"Content-Type": contentType,
							"Authorization": "AQUA " + accessKeyId + ":" + my.base64Encode(str_hmac_sha1(secretAccessKey, StringToSign_netdisk)),
							"x-aqua-date": nowDateTime,
							"X-CDMI-Specification-Version": "1.0.2"
					},
					contentType: "application/json"
				}).done(function(data) {
					if(data&&data.value){
						callback(data.value)
					}
				})
			},
			
			addOrEditNewTreeCommon: function(url,bodyData,method,netdiskUrl,callback){//添加卡片 
			  var self=this;
				var urlTree = aquapaas_host + '/aquapaas/rest/navigation/trees/';
				urlTree=urlTree+url;
				$.ajax({
					type: method,
					url: urlTree,
					async: false,
					data: JSON.stringify(bodyData),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'x-aqua-sign': getPaaS_x_aqua_sign(method, urlTree)
					}
				}).always((resp, status, xhr) => {
					if (status == 'success') {
						self.createFolder(netdiskUrl,function(){
							callback()
						})
					}
				})
			},
			
			addNewCardBelowAppRequest:function(dataJSONfileObjects){
			  var self=this;
				var currentAppLevelTreeData=self.currentAppLevelTreeData;
				var currentTreePointData=self.currentTreePointData;
				var treeName=encodeURIComponent(document.getElementById("cms_app_admin_input_card_name").value);
				var url = encodeURIComponent(currentAppLevelTreeData["name"]); 
				url = url + '/' + encodeURIComponent(currentTreePointData["name"]);
				var netdiskUrl=currentAppLevelTreeData["name"] + '/' + currentTreePointData["name"] +'/' + document.getElementById("cms_app_admin_input_card_name").value + '/';
				url = url + '/' + treeName;
				url = url + '?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
				var cardId=document.getElementById("cms_app_admin_input_card_id").value;
				var method = 'POST';
				var bodyData={  
					"ext_id": cardId,//查看了navigation页面的代码，创建树时，传节点id
					"index":"",//???节点排序号，可不填？4.8	CREATE_ NAV_NODE
          "is_manual":true,//查看了navigation页面的代码，打开用户不动是true.所有默认true?
					"metadata_public":{"entryType":"1"},//查看了navigation页面的代码，创建树时，传"entryType":"1"
					"name":treeName,//查看了navigation页面的代码，创建树时，目录名称
					"node_class":"folder",//查看了navigation页面的代码，创建树时，传node_class: 'folder'
					"objects_url":"",
					"objects_url_script":[""],
					"title":treeName,
					"metadata":{
						"id": cardId
					}
				};
				self.addOrEditNewTreeCommon(url,bodyData,method,netdiskUrl,function(){//添加layout
				 var treeName=document.getElementById("cms_app_admin_input_card_name").value;
				 var layoutName=$(".cms_app_admin_layout_top_blue").parent().find(".cms_app_admin_layout_bottom").text();
				 var url = encodeURIComponent(currentAppLevelTreeData["name"]); 
				 url = url + '/' + encodeURIComponent(currentTreePointData["name"]);
				 url = url + '/' + encodeURIComponent(treeName);
				 var netdiskUrl=currentAppLevelTreeData["name"]+ '/'+currentTreePointData["name"] + '/' + treeName + '/'+ layoutName+"/";
				 url = url + '/' + encodeURIComponent(layoutName);
				 url = url + '?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
				 var bodyData={  
					"ext_id": "",//查看了navigation页面的代码，创建树时，传节点id
					"index":"",//???节点排序号，可不填？4.8	CREATE_ NAV_NODE
					"is_manual":true,//查看了navigation页面的代码，打开用户不动是true.所有默认true?
					"metadata_public":{"entryType":"1"},//查看了navigation页面的代码，创建树时，传"entryType":"1"
					"name":layoutName,//查看了navigation页面的代码，创建树时，目录名称
					"node_class":"folder",//查看了navigation页面的代码，创建树时，传node_class: 'folder'
					"objects_url":"",
					"objects_url_script":[""],
					"title":layoutName
					};
					self.addOrEditNewTreeCommon(url,bodyData,method,netdiskUrl,function(){
						//添加layout下的item节点
									for(var i= 0,len = dataJSONfileObjects.length;i<len;i++){
										var dataJSONfileObjectsName=dataJSONfileObjects[i].objectName;
										var JSONFilelastIndexDash=dataJSONfileObjectsName.lastIndexOf(".");
										var objectNameFirstPart=dataJSONfileObjectsName.substring(0,JSONFilelastIndexDash);
										if(objectNameFirstPart==layoutName){//找到模板名称
											var fileUrl= "/aqua/rest/cdmi/default/netdisk/"+LOGIN_AQUA_USERNAME+"/"+CMScardTemplatePath.substring(0,CMScardTemplatePath.length-1)+"/"+encodeURIComponent(dataJSONfileObjectsName);
											self.viewSingleFile(fileUrl,function(data){//读取当前摸板文件内容
												var dataTransfer=JSON.parse(data);
												if(dataTransfer.items){
													var items=dataTransfer.items;
													for(var j= 0,lenItem = items.length;j<lenItem;j++){
														var showIndex=((j+1>9)?(j+1):("0"+(j+1)));
														var itemsUnit=items[j];
														var focusEnable=false;//如果不存在，为false
														if(typeof itemsUnit.focusEnable!="undefined"){
														 focusEnable=itemsUnit.focusEnable
														};
														var itemsUnitBodySend={//每个创建的item子节点提交的数据
															"ext_id":"",
															"index":"",
															"is_manual":true,
															"metadata_public":{"entryType":"1"},
															"name":i18n("CMS_ASSET_PROJECT")+showIndex,
															"node_class":"folder",
															"objects_url":"",
															"objects_url_script":[""],
															"title":i18n("CMS_ASSET_PROJECT")+showIndex,
															"metadata":{
																//项目外观内容
																"focusEnable": focusEnable,
																"defaultBgImage": itemsUnit.defaultBgImage||"",
																"defaultBgColor": itemsUnit.defaultBgColor||"",
																"defaultImage": itemsUnit.defaultImage||"",
																"defaultFocusScale": itemsUnit.defaultFocusScale||"",
																"defaultFocusBorderColor": itemsUnit.defaultFocusBorderColor||"",
																"defaultFocusBorderWidth": itemsUnit.defaultFocusBorderWidth||"",
																"defaultFocusBorderRadius": itemsUnit.defaultFocusBorderRadius||"",
																"defaultFocusZ": itemsUnit.defaultFocusZ||"",
																//项目内容
																"content_type": itemsUnit.content_type||"",
																"item_id": itemsUnit.item_id||"",
																"item_name": itemsUnit.item_name||"",
																"poster": itemsUnit.poster||""
															}
														};
														//开始添加项目节点
													 var itemName=i18n("CMS_ASSET_PROJECT")+showIndex;
													 var url = encodeURIComponent(currentAppLevelTreeData["name"]); 
													 url = url + '/' + encodeURIComponent(currentTreePointData["name"]);
													 url = url + '/' + encodeURIComponent(treeName);
													 url = url + '/' + encodeURIComponent(layoutName);
													 url = url + '/' + encodeURIComponent(itemName);
													 url = url + '?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
													 var netdiskUrl=currentAppLevelTreeData["name"]+ '/'+currentTreePointData["name"] + '/' + treeName + '/'+ layoutName+"/" +itemName +"/";
													 self.addOrEditNewTreeCommon(url,itemsUnitBodySend,method,netdiskUrl,function(){
													 })
													}
												}
											})
										}
									}
							})
				});
				var currentData=self.currentTreePointData;
				var name=currentData["name"];
				var id=currentData["id"];
				var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
				var node =  treeObj.getNodeByParam("id",self.clickTreeNode.id );
				var open=self.clickTreeNode.open;
				self.addNewCardDialog.close();
				treeObj.reAsyncChildNodes(node, 'refresh',false,function(){
					//新增页面成功，表格增加一行。
					var len=self.expandedData.length;
					if(open==true){len=1};
					document.getElementById("cms_app_admin_dash").style.display="block";
					self.adjustTreeTableTr(len,"expand","cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
					self.adjustTrLenForTreeTable("cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_right_1","cms_app_admin_page2_left_tree_left")
					self.initCardListBelowPage(self.tabInex);
				})
			},
			
			addNewPageBelowAppRequest: function(){
			  var self=this;
				var currentAppLevelTreeData=this.currentAppLevelTreeData;
				var appName=document.getElementById("cms_add_new_page_input").value;
				if(appName.indexOf("_")!=-1){//mail:2019.8.27
					var text=i18n("CMS_COMFIRM2");
					self.showMsgDialog(text, function() {
						
					},function(){
						$("#user-admin-msg-cancel").hide();
						$("#user-admin-msg-content").css("margin-top","10px");
					});
					return;
				};
				var method = 'POST';
				var dataPost={
					"ext_id": "",
					"index":"",			
          "is_manual":true,
	        "metadata":{},
					"metadata_public":{"entryType":"1"},
					"name":appName,
					"node_class":"folder",
					"objects_url":"",
					"objects_url_script":[""],
					"title":""
				}
				var treeName=encodeURIComponent(document.getElementById("cms_add_new_page_input").value);
				var url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + currentAppLevelTreeData["name"] + '/' + treeName + '?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
				$.ajax({
					type: method,
					url: url,
					async: true,
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					data: JSON.stringify(dataPost),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
					}
				}).always((resp, status, xhr) => {
					if (status == 'success') {
						var self=this;
						var currentAppLevelTreeData=this.currentAppLevelTreeData;
						var name=currentAppLevelTreeData["name"]+"/"+document.getElementById("cms_add_new_page_input").value;
						self.createFolder(name,function(){
							var currentData=self.currentAppLevelTreeData;
			        var name=currentData["name"];
							var id=currentData["id"];
							var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
						  var node = treeObj.getNodesByFilter(function (node) { return node.level == 0 }, true); 
							self.addNewPageDialog.close();
							treeObj.reAsyncChildNodes(node, 'refresh',false,function(){
								//新增页面成功，表格增加一行。
								document.getElementById("cms_app_admin_dash").style.display="block";
								self.adjustTreeTableTr(1,"expand","cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
								self.adjustTrLenForTreeTable("cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_right_1","cms_app_admin_page2_left_tree_left")
								self.initPageListBelowApp(self.tabInex);
							});
								/*
							  self.zTreeObj.reAsyncChildNodes(treeNode, 'refresh',false,function(){
								});
								*/
						})
					}
				})
			},
			createFolder:function(name, callback){
				var aqua = new CMSAquaUtil({
					host: aqua_host
				})
				aqua.login({
					path: '/cdmi_users/',
					name: LOGIN_AQUA_USERNAME,
					password: LOGIN_AQUA_PWD,
					domainURI: LOGIN_AQUA_DOMAIN_URI
				})
				aqua.getContainer({
					path: 'default/netdisk/' + LOGIN_AQUA_USERNAME + '/' + NAVIGATION_TREE_ROOT + name
				}).forceCreate();
				callback && callback();
			},
			 delFolder(name, callback) {
				var aqua = new CMSAquaUtil({
					host: aqua_host
				})
				aqua.login({
					path: '/cdmi_users/',
					name: LOGIN_AQUA_USERNAME,
					password: LOGIN_AQUA_PWD,
					domainURI: LOGIN_AQUA_DOMAIN_URI
				})
				aqua.getContainer({
					path: 'default/netdisk/' + LOGIN_AQUA_USERNAME + '/' + NAVIGATION_TREE_ROOT + name
				}).delObj();
				callback && callback();
			},
			openAdjustOrderDialog: function(callback){
			 var htmlUrl="content/CMS/adjust_order.html";
				var self = this;
				var dialog = new PopupDialog({
					width: 468,
					height: 230,
					url: htmlUrl,
					context: {},
					callback: function(){
						$('#cms_adjust-order-dialog-submit').on('click', function(){
							if(typeof callback == 'function'){
								callback();
							}
							dialog.close();
						});
					}
      });
      dialog.open();
    },
		showMsgDialog: function(msg, callback,openCallback){
			var dialog = new PopupDialog({
			url: 'content/CMS/msg-dialog.html',
			width: 470,
			height: 266,
			context: {},
			zIndex: 3000,
			id: 'cms_user-admin-msg',
			callback: function(){
				if(openCallback){	
					openCallback()
				}
				$('#cms_user-admin-msg-content').text(msg);
				$('#cms_user-admin-msg-close').on('click', function(){
					dialog.close();
				});
				$('#cms_user-admin-msg-cancel').on('click', function(){
					dialog.close();
				});
				$('#cms_app_admin_msg_dialog_submit').on('click', function(){
					dialog.close();
					if(typeof callback == 'function'){
						callback();
					}
				});
			}
		});
		dialog.open();
		},
		
		showOverlayMsgDialog: function(msg, callback,openCallback){
			var dialog = new OverlayDialog({
			url: 'content/CMS/msg-dialog.html',
			width: 470,
			height: 266,
			context: {},
			zIndex: 3000,
			id: 'cms_user-admin-msg',
			callback: function(){
				if(openCallback){	
					openCallback()
				}
				$('#cms_user-admin-msg-content').text(msg);
				$('#cms_user-admin-msg-close').on('click', function(){
					dialog.close();
				});
				$('#cms_user-admin-msg-cancel').on('click', function(){
					dialog.close();
				});
				$('#cms_app_admin_msg_dialog_submit').on('click', function(){
					dialog.close();
					if(typeof callback == 'function'){
						callback();
						}
					});
				}
			});
			dialog.open();
		},

		refreshTable:function(){
		  var self=this;
      var rows=15;
			self.list = new StyledList({
				async: true,
				rows: rows,
				columns: 3,
				containerId: 'cms_app_admin_page1',
				listType: 1,
				titles: [
					{label: i18n("CMS_YINGYONGNAME")},
					{label: i18n("CMS_DESC")},
					{label: i18n("CMS_OPER")}
				],
				styles: {
					borderColor: 'rgb(226,226,226)',
					borderWidth: 1,
					titleHeight: 31,
					titleBg: 'rgb(69,209,244)',
					titleColor: 'white',
					cellBg: 'white',
					evenBg: 'rgb(245,253,255)',
					cellColor: 'rgb(121,121,121)',
					cellHeight: 34,
					footBg: 'white',
					footColor: 'rgb(121,121,121)',
					iconColor: 'rgb(0,153,203)',
					inputBorder: '1px solid rgb(203,203,203)',
					inputBg: 'white',
					columnsWidth: [0.393, 0.433, 0.173]
					},
					data: []
				});
				self.list.getPageData = function(pageNumber, gotData){
				  var start = (pageNumber - 1) * rows;
          var end = pageNumber * rows - 1;
					var url = aquapaas_host + '/aquapaas/rest/navigation/trees?';
					url += 'start=' + start;
					url += '&end=' + end;
					url += '&is_primary=true';
					url += '&tree_class=cms_tree';
					if($("#cms_app_admin_search").val()!=""){
						url += '&tree_name='+encodeURIComponent($("#cms_app_admin_search").val());
					};
					//url += '&tree_class=2';
					if (my.paas.user.metadata.AquaBO_naviUserRight!=""){
						url += '&tree_name='+my.paas.user.metadata.AquaBO_naviUserRight;
					};
					url += '&app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();    					
					var method = 'Get';
					$.ajax({
						type: method,
						url: url,
						async: true,
						dataType: 'json',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
						}
					}).always((resp, status, xhr) => {
						if (status == 'success') {
							if(resp){
								self.list.onTotalCount(xhr.getResponseHeader('x-aqua-total-count'));
								var formListData=self.formListData(resp);
							  self.originalData=formListData.originalData;
								gotData(formListData.processedData)
							}
						}
						else{
							self.list.onTotalCount(0);
							self.originalData = [];
							gotData([]);
						}
					})
				
				};
				self.list.create();
		},
		initFirstPageUI:function(){
		  var self = this;
			self.refreshTable();
			self.bindFirstPageEvents();
		},
		bindFirstPageEvents:function(){
		  var self=this;
			$("#cms_app_admin_page1").on("click",".opr-default-admin-entry",function(){//进入第二页
			  self.pid="";
			  self.paid="";
				self.fullPathArray=[];
				self.rowIndex=$(this).parent().attr("data-index");
				var currentData=self.originalData[self.rowIndex];
				var name=currentData.name||"";
				self.treeName=name;
        self.tabType="editAppType";//进入时，选中的是app这层树。			  
				self.toggleElement(".cms_app_admin_page1",".cms_app_admin_page2");//显示到第二页
				$(".cms_app_admin_tab").each(function(){
					$(this).removeClass("cms_app_admin_tab_focus").hide();
				});
				$(".cms_app_admin_tab_interval").each(function(){//所有tab去除标亮。
					$(this).hide();
				});
				$(".cms_app_admin_display_container_after_click_tab").each(function(){
					$(this).hide();
				});
				var showTabClass="cms_app_admin_tab_for_app";//进入第二页，用户默认查看应用节点信息。
				var defaultShowContainerIndex=0;
				self.tabInex=defaultShowContainerIndex;
				$(".cms_app_admin_display_container_after_click_tab").eq(defaultShowContainerIndex).show().css("visibility","visible");
				$("."+showTabClass+"").each(function(){
					$(this).show()
				});
				$("."+showTabClass+"").eq(0).addClass("cms_app_admin_tab_focus");
				if(currentData&&currentData.metadata_public&&currentData.metadata_public.need_release){
					$("#cms_app_admin_audit").show();
				}
				else{
					$("#cms_app_admin_audit").hide();
				}
				self.drawSecondPageRightTitle();
				self.bindSecondPageButtonEvents();
				self.drawSecondPageTreeContainer();
			});
			$("#cms_app_admin_page1").on("click",".cms_app_delete_app",function(){ 
			  self.rowIndex=$(this).parent().attr("data-index");
				var currentData=self.originalData[self.rowIndex];
				var text=i18n("CMS_DELETE_CONFIRM2");
				var name=currentData.name||"";
				text=text+"\"";
				text=text+currentData.metadata.appName;
				text=text+"\"";
				text=text+i18n("CMS_DELETE_CONFIRM3");
				text=text+" ？";
				self.showMsgDialog(text, function() {
					self.deleteTree(encodeURIComponent(name),function(){
					})
				},function(){
					$("#cms_user-admin-msg-content").css("margin-top","0px")
				})
			});
			$("#cms_app_admin_add").unbind().bind('click', function () {
        self.openCreateAppDialog()
      });
			$("#cms_app_admin_audit").unbind().bind('click', function () {
			  var cmsJsonFileLocation=aqua_host+"/aqua/rest/cdmi/default/netdisk/" + LOGIN_AQUA_USERNAME+"/"+CMSJsonFilePath+self.currentAppLevelTreeData["name"]+"/"+"work/";
					self.checkFolderExist(encodeURI(cmsJsonFileLocation),function(jqXHR){
					 if(jqXHR&&jqXHR.status&&(jqXHR.status==404)){//目录不存在
							var text=i18n("CMS_COMFIRM3");
							self.showMsgDialog(text, function() {
							},function(){
								$("#user-admin-msg-cancel").hide();
								$("#user-admin-msg-content").css("margin-top","10px");
							});
					 }
				},function(){//目录存在
					self.openAuditDialog();
				}); 
			});
			$("#cms_app_admin_search").parent().find(".user-admin-search-icon").unbind().bind('click', function () {
			  self.refreshTable();
			});
			$('#cms_app_admin_search').on('keyup', function(e) {
				var key = e.keyCode||e.which;
				if (key == 13) {
					self.refreshTable();
				}
			})
		},
		deleteTree:function(name,callback,para){
			var self=this;
			var url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
			if(para){
			url=url+para
			};
			var method="DELETE";
			$.ajax({
				type: method,
				url: url,
				async: true,
				dataType: 'json',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
				}
			}).always((resp, status, xhr) => {
				self.refreshTable();
				callback();
				self.delFolder(name,function(){
				})
			})
		},
		deleteTreeNotDeleteFolder:function(name,callback,para){
			var self=this;
			var url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
			if(para){
			url=url+para
			};
			var method="DELETE";
			$.ajax({
				type: method,
				url: url,
				async: true,
				dataType: 'json',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
				}
			}).always((resp, status, xhr) => {
				callback();
			})
		},
		toggleElement:function(hiddenElementClass,showElementClass){
			$(hiddenElementClass).each(function(){
				$(this).hide()
			});
			$(showElementClass).each(function(){
				$(this).show()
			});
	 },
	  updateFolder(path, name, callback) {
      var old_name = path,
          new_name = path.slice(0, path.lastIndexOf('/') + 1) + name
      if (old_name !== new_name) {
        var aqua = new CMSAquaUtil({
          host: aqua_host
        })
        aqua.login({
          path: '/cdmi_users/',
          name: LOGIN_AQUA_USERNAME,
          password: LOGIN_AQUA_PWD,
          domainURI: LOGIN_AQUA_DOMAIN_URI
        })
        aqua.getContainer({
          path: 'default/netdisk/' + LOGIN_AQUA_USERNAME + '/' + NAVIGATION_TREE_ROOT,
          name: old_name
        }).rename(new_name);
         callback && callback();
       }
    },
		
		initCurrentPageFileToNetdisk:function(){
			var self=this;
			var currentTreePointData=self.currentTreePointData;
			var currentAppLevelTreeData=self.currentAppLevelTreeData;
			this.getSingleTree(currentAppLevelTreeData.name,currentTreePointData.id,function(data){
				self.collectPageDataToObj={};
				self.collectDataToPageObj(data);
					//一、收集所有模板json数据
				var allJsonDataList=[];
				if(typeof CMScardTemplatePath!="undefined"){
					var parent_uri = "/default/netdisk/"+LOGIN_AQUA_USERNAME+"/"+CMScardTemplatePath.substring(0,CMScardTemplatePath.length-1);
					self.getFilesBelowPath(parent_uri,function(dataJSONfile){
						var dataJSONfileObj=dataJSONfile.objects;
						for(var i= 0,len = dataJSONfileObj.length;i<len;i++){
								var dataJSONfileObjectsName=dataJSONfileObj[i].objectName;
								var JSONFilelastIndexDash=dataJSONfileObjectsName.lastIndexOf(".");
								var objectNameFirstPart=dataJSONfileObjectsName.substring(0,JSONFilelastIndexDash);
								var fileUrl= "/aqua/rest/cdmi/default/netdisk/"+LOGIN_AQUA_USERNAME+"/"+CMScardTemplatePath.substring(0,CMScardTemplatePath.length-1)+"/"+encodeURIComponent(dataJSONfileObjectsName);
								self.viewSingleFile(fileUrl,function(data){
									allJsonDataList.push(JSON.parse(data))
								})
						};
					})
				};
				var transferData=null;
				var stringReplaceMapingsConfig=null;
				if(typeof CMSStringReplaceMapings!="undefined"){
					stringReplaceMapingsConfig=CMSStringReplaceMapings
				};
				var cardFileObj=self.cardFileObj;
				var combineNewObj=Object2ObjectEx.page2PageEx(self.collectPageDataToObj,cardFileObj,allJsonDataList,stringReplaceMapingsConfig);
				var aquaHost = aqua_host;	
				var storage_username = LOGIN_AQUA_USERNAME;
				var storage_password = LOGIN_AQUA_PWD;
				var storage_domain   = LOGIN_AQUA_DOMAIN_URI;
				var upload1 = new UploadModule(aquaHost, storage_username, storage_password , storage_domain);
				var folder = CMSJsonFilePath+currentAppLevelTreeData["name"]+"/"+"work/";
				upload1.uploadJson({
					name: self.currentAppLevelTreeData["name"]+"_"+currentTreePointData["name"]+".json",
					path: folder,
					data: JSON.stringify(combineNewObj)
				}, {
					_startfun: function (file_name, updateSize, fileSize, self) {
						//单个文件上传开始的回调函数
						var console_message = file_name + "start";
					},
					_progressfun: function (file_name, updateSize, fileSize, self) {
						//单个文件上传过程的回调函数
						var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
					},
					_errorfun: function (e) {
						//单个文件上传失败的回调函数
					},
					_endfun: function (file_name, updateSize, fileSize, file_url, self) {
						//单个文件上传结束的回调函数
						var console_message = file_name + " end. The url = " + file_url;
					},
				});
			},"children=1")
		},
		
		my_aqua_xhr:function () {
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
    },
		
		_str_hmac_sha1:function(_key, _data) {
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
    },
		
		_base64Encode:function(str) {
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
    },
		
		 my_aqua_addXHRHeaderRequest:function (xhr, method, url, contentType, move_overwrite, status) {
      //status为真的话 uri格式为../ 否则为https://
			var self=this;
			var secretAccessKey = self.UsersecretAccessKey;
			var accessKeyId = self.UserAccessKeyId;
      if (status) {
        var tmp1 = (url.indexOf("/") >= 0) ? url.indexOf("/") : 0;
        var tmp2 = url.indexOf("?");
        var urlPath = url.substr(tmp1, ((tmp2 >= 0) ? (tmp2) : url.length) - tmp1);
      } else {
        var arrObj = url.split("//");
        var tmp1 = (arrObj[1].indexOf("/") >= 0) ? arrObj[1].indexOf("/") : 0;
        var tmp2 = arrObj[1].indexOf("?");
        var urlPath = arrObj[1].substr(tmp1, ((tmp2 >= 0) ? (tmp2) : arrObj[1].length) - tmp1);
      }
      //my_aqua.printLog(urlPath);
      var nowDateTime = new Date().getTime();

      var StringToSign = method + "\n" + contentType + "\n" + nowDateTime + "\n" + urlPath;
      //console.log(StringToSign);
      if (xhr) {
        xhr.setRequestHeader("Accept", contentType);
        xhr.setRequestHeader("Content-Type", contentType);
        xhr.setRequestHeader("Authorization", "AQUA " + accessKeyId + ":" + self._base64Encode(self._str_hmac_sha1(secretAccessKey, StringToSign)));
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
      ret += "aquatoken=" + encodeURIComponent(accessKeyId) + ":" + encodeURIComponent(self._base64Encode(self._str_hmac_sha1(secretAccessKey, StringToSign)));
      ret += "&xaquadate=" + nowDateTime;
      return ret;
    },
		
		checkFolderExist:function(urlPath,failCallback,successCallback){
			var self=this;
      var xhr = self.my_aqua_xhr();
      var url = urlPath;
      xhr.open("GET", url, false);
      self.my_aqua_addXHRHeaderRequest(xhr, "GET", url, "application/cdmi-container");
      xhr.send();
      if (xhr.readyState == 4 && xhr.status == 200) {
        successCallback()
      }
			else{
				failCallback(xhr)
			}

		},
		
		folder_create:function (url,callback) {
		  var self=this;
      var ret = false;
      var xhr = self.my_aqua_xhr();
      var url = url;
      //xhr.open("PUT", my_aqua.getHasTokenUrl("PUT", url, 600), false);
      //xhr.setRequestHeader("Accept", "application/cdmi-container");
      //xhr.setRequestHeader("X-CDMI-Specification-Version", "1.0.2");
      //xhr.setRequestHeader("Authorization", my_aqua.Authorization);
      //xhr.setRequestHeader("Content-Type", "application/cdmi-container");
      xhr.open("PUT", url, false);
      self.my_aqua_addXHRHeaderRequest(xhr, "PUT", url, "application/cdmi-container");
      xhr.send("{}");
      if (xhr.readyState == 4 && ((xhr.status>199)&&(xhr.status<300))) {
        callback()
      }
    },
	
	  initFileToNetdisk:function(fileName){
		  var self=this;
			self.currentAppLevelTreeData["name"]
			var cmsJsonFileLocation=aqua_host+"/aqua/rest/cdmi/default/netdisk/" + LOGIN_AQUA_USERNAME+"/"+CMSJsonFilePath+self.currentAppLevelTreeData["name"]+"/";
			var cmsJsonFileLocationWork=aqua_host+"/aqua/rest/cdmi/default/netdisk/" + LOGIN_AQUA_USERNAME+"/"+CMSJsonFilePath+self.currentAppLevelTreeData["name"]+"/"+"work/";
			
			self.checkFolderExist(encodeURI(cmsJsonFileLocation),function(jqXHR){
				 if(jqXHR&&jqXHR.status&&(jqXHR.status==404)){//app name目录不存在
					self.folder_create(encodeURI(cmsJsonFileLocation),function(){
					  //app name下work目录是否存在
						self.checkFolderExist(encodeURI(cmsJsonFileLocationWork),function(jqXHR){
							if(jqXHR&&jqXHR.status&&(jqXHR.status==404)){//app name下work目录不存在
								self.folder_create(encodeURI(cmsJsonFileLocationWork),function(){
									self.initFileToNetdiskStart(fileName);
								})
							}
						},function(){//app name下work目录存在
							self.initFileToNetdiskStart(fileName);
						})
						
					});
				 }
			},function(){//app name目录存在
				 //app name下work目录是否存在
				self.checkFolderExist(encodeURI(cmsJsonFileLocationWork),function(jqXHR){
					if(jqXHR&&jqXHR.status&&(jqXHR.status==404)){//app name下work目录不存在
						self.folder_create(encodeURI(cmsJsonFileLocationWork),function(){
							self.initFileToNetdiskStart(fileName);
						})
					}
				},function(){//app name下work目录存在
					self.initFileToNetdiskStart(fileName);
				})
			});
		//here
		},
		
		initFileToNetdiskStart:function(fileName){
		  var self=this;
			var currentAppLevelTreeData=self.currentAppLevelTreeData;
			this.getSingleTree(currentAppLevelTreeData.name,currentAppLevelTreeData.id,function(data){
				self.collectAppDataToObj={};
				self.collectAppDataToJSObj(data);
				self.getPageTitleItemTemplateObjectFile(function(transferData){
					var aquaHost = aqua_host;	
					var storage_username = LOGIN_AQUA_USERNAME;
					var storage_password = LOGIN_AQUA_PWD;
					var storage_domain   = LOGIN_AQUA_DOMAIN_URI;
					var upload1 = new UploadModule(aquaHost, storage_username, storage_password , storage_domain);
					var folder = CMSJsonFilePath+currentAppLevelTreeData["name"]+"/"+"work/";
					upload1.uploadJson({
						name: fileName,
						path: folder,
						data: JSON.stringify(transferData)
					}, {
						_startfun: function (file_name, updateSize, fileSize, self) {
							//单个文件上传开始的回调函数
							var console_message = file_name + "start";
						},
						_progressfun: function (file_name, updateSize, fileSize, self) {
							//单个文件上传过程的回调函数
							var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
						},
						_errorfun: function (e) {
							//单个文件上传失败的回调函数
						},
						_endfun: function (file_name, updateSize, fileSize, file_url, self) {
							//单个文件上传结束的回调函数
							var console_message = file_name + " end. The url = " + file_url;
						},
					});
				})
			},"children=1")
		},
		
		getPageTitleItemTemplateObjectFile:function(callback){
		  var self=this;
			var fileUrl="content/CMS/pageTitleItemTemplateObject.json";
			var data=this.pageFileObj;
			var stringReplaceMapingsConfig=null;
			if(typeof CMSStringReplaceMapings!="undefined"){
				stringReplaceMapingsConfig=CMSStringReplaceMapings
			};
		  var newObj=Object2ObjectEx.app2AppEx(self.collectAppDataToObj,data,stringReplaceMapingsConfig);
			callback(newObj)
		},
		
		viewLocalFile:function(url,callback){
			$.ajax({
				type: "GET",
				url: url,
				async: true,
				headers: {
					//'Accept': 'application/json',
					//'Content-Type': 'application/json',
					//'x-aqua-sign': getPaaS_x_aqua_sign("GET", url)
				}
			}).always((resp, status, xhr) => {
				if (status == 'success') {
					if(resp){
						callback(resp)
					}
				}
				else{
					callback(null)
				}
			})
		},
		
		getcardTitleItemTemplateObjectFile:function(callback){
		  var self=this;
			var parent_uri = "/default/netdisk/"+LOGIN_AQUA_USERNAME+"/"+CMScardTemplatePath.substring(0,CMScardTemplatePath.length-1);
			//二、获取一个名为cardTitleItemTemplateObject.json的模板文件，并将文件中的对象转变为Javascript对象。
			var fileUrl="cardTitleItemTemplateObject.json";
      var pageTitleItemTemplateObjectTransfer=null;
			self.viewSingleFile(fileUrl,function(data){
				pageTitleItemTemplateObjectTransfer=(JSON.parse(data));
			});
			callback(pageTitleItemTemplateObjectTransfer);
		},
		
		collectDataToPageObj:function(data){
			var self=this;
			var pageObj={};
			if(data){
				pageObj={
					"pageName": data.name||""
				};
				var cardsArray=[];
			  if(data.children){
				  var cards=data.children;
					var temp=cards;
					/*
					cards=temp.sort(function(a,b){
						return a.name>b.name
					});
					*/
					for(var i= 0,len = cards.length;i<len;i++){
						var curChildren=cards[i];
						var cardUnit={};
						var cardId="";
						if(curChildren&&curChildren.metadata&&curChildren.metadata.id){
							cardId=curChildren.metadata.id
						}
						else{
							cardId=curChildren.ext_id||""
						}
						if(curChildren&&curChildren.metadata){
							var cardUnit={
								"id": cardId,
								"name": curChildren.name||"",
								"width": curChildren.metadata.width||"",
								"height": curChildren.metadata.height||"",
								"top": curChildren.metadata.top||"",
								"left": curChildren.metadata.left||"",
								"right": curChildren.metadata.right||"",
								"bottom": curChildren.metadata.bottom||""
							}
							var title_type=(curChildren.metadata&&curChildren.metadata.title_type)||"";
							var content_type=(curChildren.metadata&&curChildren.metadata.content_type)||"";
							if(title_type&&title_type!=""){
								switch(title_type)
								{
								case "image":
									cardUnit.titleItem={
										 "normal": {
											"type": "image",
											"url": (curChildren.metadata&&curChildren.metadata.normal_image)||""
										},
										"focus": {
											"type": "image",
											"url": (curChildren.metadata&&curChildren.metadata.focus_image)||""
										},
										"selected": {
											"type": "image",
											"url": (curChildren.metadata&&curChildren.metadata.selected_image)||""
										}
									};
									break;
								case "text":
									cardUnit.titleItem={
										"normal": {
											"type": "text",
											"text": (curChildren.metadata&&curChildren.metadata.normal_text)||"",
											"textColor": (curChildren.metadata&&curChildren.metadata.normal_textColor)||"",
											"shapeBgColor": (curChildren.metadata&&curChildren.metadata.normal_shapeBgColor)||"",
											"shapeBorderColor": (curChildren.metadata&&curChildren.metadata.normal_shapeBorderColor)||""
										},
										"focus": {
											"type": "text",
											"text": (curChildren.metadata&&curChildren.metadata.focus_text)||"",
											"textColor": (curChildren.metadata&&curChildren.metadata.focus_textColor)||"",
											"shapeBgColor": (curChildren.metadata&&curChildren.metadata.focus_shapeBgColor)||"",
											"shapeBorderColor": (curChildren.metadata&&curChildren.metadata.focus_shapeBorderColor)||""
										},
										"selected": {
											"type": "text",
											"text": (curChildren.metadata&&curChildren.metadata.selected_text)||"",
											"textColor": (curChildren.metadata&&curChildren.metadata.selected_textColor)||"",
											"shapeBgColor": (curChildren.metadata&&curChildren.metadata.selected_shapeBgColor)||"",
											"shapeBorderColor": (curChildren.metadata&&curChildren.metadata.selected_shapeBorderColor)||""
										}
									}
									break;
								default:
									break;
								}
							};
							//标题项内容
							if(content_type&&content_type!=""){
								cardUnit.titleItem.content={};
								switch(content_type)
								{
									case "vod_asset":
									case "vod_bundle":
										cardUnit.titleItem.content.type="vod";
										var pid=(curChildren.metadata&&curChildren.metadata.pid)||"";
										var paid=(curChildren.metadata&&curChildren.metadata.paid)||"";
										cardUnit.titleItem.content.pid=pid;
										cardUnit.titleItem.content.paid=paid;
										cardUnit.titleItem.content.title=(curChildren.metadata&&curChildren.metadata.item_name)||"";
										cardUnit.titleItem.content.posterUrl=(curChildren.metadata&&curChildren.metadata.poster)||"";
										break;
									case "column":
										cardUnit.titleItem.content.type="column";
										cardUnit.titleItem.content.title=(curChildren.metadata&&curChildren.metadata.item_name)||"";
										cardUnit.titleItem.content.folderFullPath=(curChildren.metadata&&curChildren.metadata.folderFullPath)||"";
										cardUnit.titleItem.content.posterUrl=(curChildren.metadata&&curChildren.metadata.poster)||"";
										break;
									case "topic":
										cardUnit.titleItem.content.type="topic";
										cardUnit.titleItem.content.title=(curChildren.metadata&&curChildren.metadata.item_name)||"";
										cardUnit.titleItem.content.folderFullPath=(curChildren.metadata&&curChildren.metadata.folderFullPath)||"";
										cardUnit.titleItem.content.posterUrl=(curChildren.metadata&&curChildren.metadata.poster)||"";
										cardUnit.titleItem.content.templateId=(curChildren.metadata&&curChildren.metadata.templateId)||"";
										break;
									default:
										cardUnit.titleItem.content.type="";
										break;
								};
							}
						};
						cardsArray.push(cardUnit);
						var currentAppLevelTreeData=self.currentAppLevelTreeData;
						self.getSingleTree(currentAppLevelTreeData.name,curChildren.id,function(data){
							if(data.children&&data.children[0]){
								var layout=data.children[0];//目前定下只有一个layout
								cardUnit.cardLayout={};
								cardUnit.cardLayout.layoutTemplateName=layout.name;
								var itemsArray=[];
								//获取items列表
								self.getSingleTree(currentAppLevelTreeData.name,layout.id,function(data){
									if(data.children&&data.children){
										var itemChildren=data.children;
										var temp=itemChildren;	
										itemChildren=temp.sort(function(a,b){//由于items在树结构里是排序过的,所以写到json文件也要排序,一一对应。
											return a.name>b.name
										});
										for(var j= 0,len = itemChildren.length;j<len;j++){
											var itemUnit= {};
										  var currentItemChildren=itemChildren[j];
											if(currentItemChildren.metadata){
											  var focusEnable=false;//默认false
												if(typeof currentItemChildren.metadata.focusEnable!="undefined"){
												 focusEnable=currentItemChildren.metadata.focusEnable
												};
												var itemUnit= {
													"focusEnable": focusEnable,
													"defaultBgImage": currentItemChildren.metadata.defaultBgImage||"",
													"defaultBgColor": currentItemChildren.metadata.defaultBgColor||"",
													"defaultImage": currentItemChildren.metadata.defaultImage||"",
													"defaultFocusScale": currentItemChildren.metadata.defaultFocusScale||"",
													"defaultFocusBorderColor": currentItemChildren.metadata.defaultFocusBorderColor||"",
													"defaultFocusBorderWidth": currentItemChildren.metadata.defaultFocusBorderWidth||"",
													"defaultFocusBorderRadius": currentItemChildren.metadata.defaultFocusBorderRadius||"",
													"defaultFocusZ": currentItemChildren.metadata.defaultFocusZ||""
												};
												var content_type=currentItemChildren.metadata.content_type||"";
												itemUnit.content={};
												switch(content_type)
												{
													case "vod_asset":
													case "vod_bundle":
														itemUnit.content.type="vod";
														var pid=(currentItemChildren.metadata&&currentItemChildren.metadata.pid)||"";
														var paid=(currentItemChildren.metadata&&currentItemChildren.metadata.paid)||"";
														itemUnit.content.pid=pid;
														itemUnit.content.paid=paid;
														itemUnit.content.title=(currentItemChildren.metadata&&currentItemChildren.metadata.title)||"";
														itemUnit.content.posterUrl=(currentItemChildren.metadata&&currentItemChildren.metadata.poster)||"";
														break;
													case "column":
														itemUnit.content.type="column";
														itemUnit.content.title=(currentItemChildren.metadata&&currentItemChildren.metadata.title)||"";//mail:2019.10.21
														itemUnit.content.folderFullPath=(currentItemChildren.metadata&&currentItemChildren.metadata.folderFullPath)||"";
														itemUnit.content.posterUrl=(currentItemChildren.metadata&&currentItemChildren.metadata.poster)||"";
														break;
													case "topic":
														itemUnit.content.type="topic";
														itemUnit.content.title=(currentItemChildren.metadata&&currentItemChildren.metadata.title)||"";
														itemUnit.content.folderFullPath=(currentItemChildren.metadata&&currentItemChildren.metadata.folderFullPath)||"";
														itemUnit.content.posterUrl=(currentItemChildren.metadata&&currentItemChildren.metadata.poster)||"";
														itemUnit.content.templateId=(currentItemChildren.metadata&&currentItemChildren.metadata.templateId)||"";
														break;
													case "HistoryVODItem":
														itemUnit.content.type="custom";
														itemUnit.content.name="HistoryVODItem";
														break;
													case "BuyProductPackage":
														itemUnit.content.type="custom";
														itemUnit.content.name="BuyProductPackage";
														itemUnit.content.treeName="";
														if(currentItemChildren.metadata&&currentItemChildren.metadata.folderFullPath&&currentItemChildren.metadata.folderFullPath!=""){
															var folderFullPath=currentItemChildren.metadata.folderFullPath;
															if(folderFullPath.indexOf("/")==-1){
																itemUnit.content.treeName=folderFullPath
															}
															else{
																itemUnit.content.treeName=folderFullPath.substring(0,folderFullPath.indexOf("/"))
															}
														}
													break;
													default:
														itemUnit.content.type="";
														delete itemUnit.content;
														//mail:2019.8.15 如果content.type=""，则删除content对象
														break;
												};
											}
											itemsArray.push(itemUnit)
										}
									}
								},"children=1");
								cardUnit.cardLayout.items=itemsArray
							}
						},"children=1")
					}
				};
				pageObj.cards=cardsArray;
			};
			self.collectPageDataToObj=pageObj
		},
		
		collectAppDataToJSObj:function(data){
		  var self=this;
			var appObj={
			};
			if(data&&data.metadata){
				appObj={
					"appName": data.metadata.appName||"",
					"screenWidth": data.metadata.screenWidth||"",
					"screenHeight": data.metadata.screenHeight||"",
					"navigationWidth": data.metadata.navigationWidth||"",
					"navigationHeight": data.metadata.navigationHeight||""
				}
			};
			var pagesArray=[];
			if(data.children){
			  var pageList=data.children;
				var temp=pageList;
				/*
				pageList=temp.sort(function(a,b){
					return a.name>b.name
				});
				*/
				for(var i= 0,len = data.children.length;i<len;i++){
				  var curChildren=data.children[i];
					var pagesUnit={
						"pageName": curChildren.name||"",
						"bgImage": (curChildren.metadata&&curChildren.metadata.bgImage)||"",
						//"pageUrl": aqua_host+"/aqua/rest/cdmi"+"/default/netdisk/"+LOGIN_AQUA_USERNAME+"/"+CMSJsonFilePath+self.currentAppLevelTreeData["name"]+"_"+(curChildren.name||"")+".json"
						"pageUrl": aqua_host+"/aqua/rest/cdmi"+"/default/netdisk/"+LOGIN_AQUA_USERNAME+"/"+CMSJsonFilePath+self.currentAppLevelTreeData["name"]+"/"+"$treeName$_$treeVersion$/"+self.currentAppLevelTreeData["name"]+"_"+(curChildren.name||"")+".json"
					};
					var title_type=(curChildren.metadata&&curChildren.metadata.title_type)||"";
					var content_type=(curChildren.metadata&&curChildren.metadata.content_type)||"";
					if(title_type&&title_type!=""){
					  //标题项定义
						if(title_type=="image"){
							pagesUnit.titleItem={
								 "normal": {
									"type": "image",
									"url": (curChildren.metadata&&curChildren.metadata.normal_image)||""
								},
								"focus": {
									"type": "image",
									"url": (curChildren.metadata&&curChildren.metadata.focus_image)||""
								},
								"selected": {
									"type": "image",
									"url": (curChildren.metadata&&curChildren.metadata.selected_image)||""
								}
							}
						}
						else{
							pagesUnit.titleItem={
								"normal": {
									"type": "text",
									"text": (curChildren.metadata&&curChildren.metadata.normal_text)||"",
									"textColor": (curChildren.metadata&&curChildren.metadata.normal_textColor)||"",
									"shapeBgColor": (curChildren.metadata&&curChildren.metadata.normal_shapeBgColor)||"",
									"shapeBorderColor": (curChildren.metadata&&curChildren.metadata.normal_shapeBorderColor)||""
								},
								"focus": {
									"type": "text",
									"text": (curChildren.metadata&&curChildren.metadata.focus_text)||"",
									"textColor": (curChildren.metadata&&curChildren.metadata.focus_textColor)||"",
									"shapeBgColor": (curChildren.metadata&&curChildren.metadata.focus_shapeBgColor)||"",
									"shapeBorderColor": (curChildren.metadata&&curChildren.metadata.focus_shapeBorderColor)||""
								},
								"selected": {
									"type": "text",
									"text": (curChildren.metadata&&curChildren.metadata.selected_text)||"",
									"textColor": (curChildren.metadata&&curChildren.metadata.selected_textColor)||"",
									"shapeBgColor": (curChildren.metadata&&curChildren.metadata.selected_shapeBgColor)||"",
									"shapeBorderColor": (curChildren.metadata&&curChildren.metadata.selected_shapeBorderColor)||""
								}
							}
						};
						//标题项内容
						if(content_type&&content_type!=""){
							pagesUnit.titleItem.content={};
							switch(content_type)
							{
								case "vod_asset":
								case "vod_bundle":
									pagesUnit.titleItem.content.type="vod";
									var pid=(curChildren.metadata&&curChildren.metadata.pid)||"";
									var paid=(curChildren.metadata&&curChildren.metadata.paid)||"";
									pagesUnit.titleItem.content.pid=pid;
									pagesUnit.titleItem.content.paid=paid;
									pagesUnit.titleItem.content.title=(curChildren.metadata&&curChildren.metadata.item_name)||"";
									pagesUnit.titleItem.content.posterUrl=(curChildren.metadata&&curChildren.metadata.poster)||"";
									break;
								case "column":
									pagesUnit.titleItem.content.type="column";
									pagesUnit.titleItem.content.title=(curChildren.metadata&&curChildren.metadata.item_name)||"";
									pagesUnit.titleItem.content.folderFullPath=(curChildren.metadata&&curChildren.metadata.folderFullPath)||"";
									pagesUnit.titleItem.content.posterUrl=(curChildren.metadata&&curChildren.metadata.poster)||"";
									break;
								case "topic":
									pagesUnit.titleItem.content.type="topic";
									pagesUnit.titleItem.content.title=(curChildren.metadata&&curChildren.metadata.item_name)||"";
									pagesUnit.titleItem.content.folderFullPath=(curChildren.metadata&&curChildren.metadata.folderFullPath)||"";
									pagesUnit.titleItem.content.posterUrl=(curChildren.metadata&&curChildren.metadata.poster)||"";
									pagesUnit.titleItem.content.templateId=(curChildren.metadata&&curChildren.metadata.templateId)||"";
									break;
								default:
									pagesUnit.titleItem.content.type="";
									break;
							};
						}
					};
					pagesArray.push(pagesUnit)
				}
			};
			appObj.pages=pagesArray;
			self.collectAppDataToObj=appObj;
		},
		
		bindSecondPageButtonEvents:function(){
			var self=this;
			$("#cms_app_admin_submit").unbind().bind('click',function(){
				self.newTreePointNameRevised=self.currentTreePointData["name"];
				self.nameRevised=false;
				switch(self.tabType)
				{
					case "editAppType":
					  self.editAppAttr(function(){
						self.initFileToNetdisk(self.currentAppLevelTreeData["name"]+".json");
						});
						break;
					case "editPageType":
						if(document.getElementById("cms_app_admin_page_attr_page_name").value.indexOf("_")!=-1){//mail:2019.8.27
						  var text=i18n("CMS_COMFIRM2");
							self.showMsgDialog(text, function() {
								
							},function(){
								$("#user-admin-msg-cancel").hide();
								$("#user-admin-msg-content").css("margin-top","10px");
							});
							return;
						};
						
					  //改名tree
					  if(self.currentTreePointData["name"]!=document.getElementById("cms_app_admin_page_attr_page_name").value){//节点名字变动了
							var sendData={"name":document.getElementById("cms_app_admin_page_attr_page_name").value};
							var pathPara=encodeURIComponent(self.currentAppLevelTreeData["name"])+"/by_id:"+self.currentTreePointData["id"];
							var oldName=self.currentTreePointData["name"];
							self.editPageAttrCommon(pathPara,sendData,function(){//改节点名
								self.newTreePointNameRevised=document.getElementById("cms_app_admin_page_attr_page_name").value;
								//改网盘路径
								self.currentTreePointData["name"]=self.newTreePointNameRevised;
								self.updateFolder(self.PNode["name"]+"/"+oldName, self.newTreePointNameRevised, function(){
									self.editPageAttr(function(){
										var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
										var node = treeObj.getNodesByFilter(function (node) { return node.level == 0 }, true); 
										treeObj.reAsyncChildNodes(node, 'refresh',false,function(){
											self.adjustTrLenForTreeTable("cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_right_1","cms_app_admin_page2_left_tree_left")
										});
									},self.newTreePointNameRevised);
								}) 
							},"updatefield=name")
						}
						else{
							self.editPageAttr(function(){},self.currentTreePointData["name"]);
						};
						break;
					case "editCardType":
					  var currentTreePointData=self.currentTreePointDataNotIncludeChildren;
						
						var sendData={};
						for(var i in currentTreePointData){
							sendData[i]=currentTreePointData[i]
						};
						if(!sendData.metadata){
							sendData.metadata={};
						}
						sendData.metadata["id"]=document.getElementById("cms_app_admin_card_id").value;
						sendData.metadata["name"]=document.getElementById("cms_app_admin_card_name").value;
						sendData.metadata["width"]=document.getElementById("cms_app_admin_card_width").value;
						sendData.metadata["height"]=document.getElementById("cms_app_admin_card_height").value;
						sendData.metadata["top"]=document.getElementById("cms_app_admin_card_margin_top").value;
						sendData.metadata["left"]=document.getElementById("cms_app_admin_card_margin_left").value;
						sendData.metadata["right"]=document.getElementById("cms_app_admin_card_margin_right").value;
						sendData.metadata["bottom"]=document.getElementById("cms_app_admin_card_margin_bottom").value;
						//标题项定义
						if($("#cms_app_admin_title_type_card").find("input").val()==i18n("CMS_ASSET_NONE")){
						  //删除标题项定义
							delete sendData.title_type;
							delete sendData.metadata.normal_image;
							delete sendData.metadata.focus_image;
							delete sendData.metadata.selected_image;
							delete sendData.metadata.normal_text;
							delete sendData.metadata.normal_textColor;
							delete sendData.metadata.normal_shapeBgColor;
							delete sendData.metadata.normal_shapeBorderColor;
							delete sendData.metadata.focus_text;
							delete sendData.metadata.focus_textColor;
							delete sendData.metadata.focus_shapeBgColor;
							delete sendData.metadata.focus_shapeBorderColor;
							delete sendData.metadata.selected_text;
							delete sendData.metadata.selected_textColor;
							delete sendData.metadata.selected_shapeBgColor;
							delete sendData.metadata.selected_shapeBorderColor;
							//删除标题项内容
							delete sendData.metadata.item_id;
							delete sendData.metadata.item_name;
							delete sendData.metadata.content_type;
							delete sendData.metadata.templateId;
							delete sendData.metadata.title_type
							delete sendData.metadata.pid;
							delete sendData.metadata.paid;
							delete sendData.metadata.poster;
							delete sendData.metadata.folderFullPath;
						}
						else{
						  //填充所有标题项定义
							var cardTitleType=$("#cms_app_admin_title_type_card").find("input").val();
							var title_type="image";
							if(cardTitleType==i18n("CMS_PIC")){
								title_type="image"
							}
							else if(cardTitleType==i18n("CMS_TEXT")){
								title_type="text"
							}
							else{
							}
							sendData.metadata.title_type=title_type;
							sendData.metadata["normal_image"]=document.getElementById("cms_app_admin_upload_daily_status_pic_input2").value;
							sendData.metadata["focus_image"]=document.getElementById("cms_app_admin_upload_focused_pic_input2").value;
							sendData.metadata["selected_image"]=document.getElementById("cms_app_admin_upload_choosed_status_pic_input2").value;
							//内容类型 type没有？？？和标题类型type重复
							sendData.metadata["normal_text"]=document.getElementById("cms_app_admin_card_upload_daily_status_text_input").value;
							sendData.metadata["normal_textColor"]=document.getElementById("cms_app_admin_card_upload_daily_status_text_color_input").value?("#"+document.getElementById("cms_app_admin_card_upload_daily_status_text_color_input").value):"";
							sendData.metadata["normal_shapeBgColor"]=document.getElementById("cms_app_admin_card_upload_daily_status_text_bg_color_input").value?("#"+document.getElementById("cms_app_admin_card_upload_daily_status_text_bg_color_input").value):"";
							sendData.metadata["normal_shapeBorderColor"]=document.getElementById("cms_app_admin_card_upload_daily_status_text_border_color_input").value?("#"+document.getElementById("cms_app_admin_card_upload_daily_status_text_border_color_input").value):"";
							sendData.metadata["focus_text"]=document.getElementById("cms_app_admin_card_upload_focus_status_text_input").value;
							sendData.metadata["focus_textColor"]=document.getElementById("cms_app_admin_card_upload_focus_status_text_color_input").value?("#"+document.getElementById("cms_app_admin_card_upload_focus_status_text_color_input").value):"";
							sendData.metadata["focus_shapeBgColor"]=document.getElementById("cms_app_admin_card_upload_focus_status_text_bg_color_input").value?("#"+document.getElementById("cms_app_admin_card_upload_focus_status_text_bg_color_input").value):"";
							sendData.metadata["focus_shapeBorderColor"]=document.getElementById("cms_app_admin_card_upload_focus_status_text_border_color_input").value?("#"+document.getElementById("cms_app_admin_card_upload_focus_status_text_border_color_input").value):"";
							sendData.metadata["selected_text"]=document.getElementById("cms_app_admin_card_upload_selected_status_text_input").value;
							sendData.metadata["selected_textColor"]=document.getElementById("cms_app_admin_card_upload_selected_status_text_color_input").value?("#"+document.getElementById("cms_app_admin_card_upload_selected_status_text_color_input").value):"";
							sendData.metadata["selected_shapeBgColor"]=document.getElementById("cms_app_admin_card_upload_selected_status_text_bg_color_input").value?("#"+document.getElementById("cms_app_admin_card_upload_selected_status_text_bg_color_input").value):"";
							sendData.metadata["selected_shapeBorderColor"]=document.getElementById("cms_app_admin_card_upload_selected_status_text_border_color_input").value?("#"+document.getElementById("cms_app_admin_card_upload_selected_status_text_border_color_input").value):"";
							var cms_app_admin_content_type1_value=$("#cms_app_admin_content_type2").find("input").val();
							if(cms_app_admin_content_type1_value==i18n("CMS_ASSET_NONE")){
							 delete sendData.metadata.item_id;
							 delete sendData.metadata.item_name;
							 delete sendData.metadata.content_type;
							 delete sendData.metadata.templateId;
							 delete sendData.metadata.pid;
							 delete sendData.metadata.paid;
							 delete sendData.metadata.poster;
							 delete sendData.metadata.folderFullPath;
							}
							else{
								sendData.metadata["item_id"]=document.getElementById("cms_app_admin_project_id2").value;
								sendData.metadata["item_name"]=document.getElementById("cms_app_admin_project_name2").value;
								var referTable=self.referTable;
								var content_type=cms_app_admin_content_type1_value;
								var content_type_value="";
								for(var i in referTable){
									if(referTable[i]==content_type){
										content_type_value=i;
										break
									}
								};
								sendData.metadata["content_type"]=content_type_value;
								sendData.metadata["pid"]=self.pid;
								sendData.metadata["paid"]=self.paid;
								sendData.metadata["poster"]=$("#cms_app_admin_item_upload_poster_card").val();
								sendData.metadata["folderFullPath"]=self.fullPathArray.join("/");
								if(content_type_value=="topic"){
									sendData.metadata["templateId"]=self.treeColumnDataTemplateName;
								}
							}
						};
						
						if(self.currentTreePointData["name"]!=document.getElementById("cms_app_admin_card_name").value){//节点名字变动了
							var sendDataReviseCard={"name":document.getElementById("cms_app_admin_card_name").value};
							var pathParaNew=encodeURIComponent(self.currentAppLevelTreeData["name"])+"/by_id:"+self.currentTreePointData["id"];
              var oldName=self.currentTreePointData["name"];
							self.editPageAttrCommon(pathParaNew,sendDataReviseCard,function(){//改节点名
								var newTreePointCardNameRevised=document.getElementById("cms_app_admin_card_name").value;
								//改网盘路径
								self.currentTreePointData["name"]=newTreePointCardNameRevised;
								var oldCardPath=self.currentAppLevelTreeData["name"]+"/"+self.PNode["name"]+"/"+oldName;
								self.updateFolder(oldCardPath, newTreePointCardNameRevised, function(){
										var pathPara=encodeURIComponent(self.currentAppLevelTreeData["name"])+"/"+encodeURIComponent(self.PNode["name"])+"/"+encodeURIComponent(self.currentTreePointData["name"]);
										self.editPageAttrCommon(pathPara,sendData,function(){
											var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
											var node =  treeObj.getNodeByParam("id",self.PNode["id"]); 
											treeObj.reAsyncChildNodes(node, 'refresh',false,function(){
												self.adjustTrLenForTreeTable("cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_right_1","cms_app_admin_page2_left_tree_left")
											});
										})
								}) 
							},"updatefield=name")
						 }
						 else{
							var currentTreePointData=self.currentTreePointDataNotIncludeChildren;
							if(!currentTreePointData.metadata){
								currentTreePointData.metadata={};
							}
							var titleType=$(".cms_app_admin_display_container_after_click_tab").eq(self.tabInex).find("#cms_app_admin_title_type_card").find("input").val();
							if( ($("#cms_app_admin_content_type2").find("input").val()!=i18n("CMS_ASSET_NONE"))&&(titleType!=i18n("CMS_ASSET_NONE")) ){
								var cms_app_admin_content_type1_value=$("#cms_app_admin_content_type2").find("input").val();
								var cms_app_admin_content_type1_stored_value="";
								switch(cms_app_admin_content_type1_value)
								{
								case i18n("CMS_ASSET"):
									cms_app_admin_content_type1_stored_value="vod_asset";
									break;
								case i18n("CMS_ASSET_PACKAGE"):
									cms_app_admin_content_type1_stored_value="vod_bundle";
									break;
								default:
									break;
								};
							}
							var pathPara=encodeURIComponent(self.currentAppLevelTreeData["name"])+"/"+encodeURIComponent(self.PNode["name"])+"/"+encodeURIComponent(self.currentTreePointData["name"]);
							self.editPageAttrCommon(pathPara,sendData,function(){
								var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
								var node =  treeObj.getNodeByParam("id",self.PNode["id"]); 
								//不改卡片名称情况下，修改卡片上其他属性，不用重新刷新树结构。
								//treeObj.reAsyncChildNodes(node, 'refresh',false,function(){
								//});
							})
						 }
						break;
					case "editItemType":
						var currentTreePointData=self.currentTreePointDataNotIncludeChildren;
						if(!currentTreePointData.metadata){
							currentTreePointData.metadata={};
						}
						var sendData={};
						for(var i in currentTreePointData){
							sendData[i]=currentTreePointData[i]
						};
						if(document.getElementById("cms_app_admin_item_can_be_choose").children.length==0){//"是否能够被选中"下拉框没被初始化过(还未进入tab)
							var currentTreePointData=self.currentTreePointData;
							if(currentTreePointData.metadata){
								var itemMetadata=currentTreePointData.metadata
								var focusEnable=itemMetadata.focusEnable;
								if(typeof focusEnable=="undefined"){//当返回参数里没有focusEnable字段时，默认input框默认选false;
									//$("#cms_app_admin_item_can_be_choose").find("input").val(i18n("CMS_ASSET_TRUE"))
									sendData.metadata.focusEnable=false
								}
								else{
									if(focusEnable){//值为true
										//$("#cms_app_admin_item_can_be_choose").find("input").val(i18n("CMS_ASSET_TRUE"))
									sendData.metadata.focusEnable=true
									}
									else{
										//$("#cms_app_admin_item_can_be_choose").find("input").val(i18n("CMS_ASSET_FALSE"))
										sendData.metadata.focusEnable=false
									}
								}
							}
						}
						else{
							var canBeChoose=$("#cms_app_admin_item_can_be_choose").find("input").val();
							if(canBeChoose==i18n("CMS_ASSET_TRUE")){
								sendData.metadata.focusEnable=true
							}
							else{
								sendData.metadata.focusEnable=false
							};
						}
						sendData.metadata["defaultBgImage"]=document.getElementById("cms_app_admin_item_default_bg").value;
						sendData.metadata["defaultBgColor"]=("#"+document.getElementById("cms_app_admin_item_default_bg_color").value);
						sendData.metadata["defaultImage"]=document.getElementById("cms_app_admin_item_pic_url").value;
						sendData.metadata["defaultFocusScale"]=document.getElementById("cms_app_admin_size_get_focus").value;
						sendData.metadata["defaultFocusBorderColor"]=("#"+document.getElementById("cms_app_admin_border_color_get_focus").value);
						sendData.metadata["defaultFocusBorderWidth"]=document.getElementById("cms_app_admin_border_width_get_focus").value;
						sendData.metadata["defaultFocusBorderRadius"]=document.getElementById("cms_app_admin_arc_get_focus").value;
						sendData.metadata["defaultFocusZ"]=document.getElementById("cms_app_admin_z_height_get_focus").value;
						
						var referTable=self.referTable;
						var content_type=$("#cms_app_admin_item_content_type3").find("input").val();
						var content_type_value="";
						for(var i in referTable){
							if(referTable[i]==content_type){
								content_type_value=i;
								break
							}
						};
						sendData.metadata["content_type"]=content_type_value;
						sendData.metadata["item_id"]=$("#cms_app_admin_item_project_id").val();
						sendData.metadata["item_name"]=$("#cms_app_admin_item_project_name").val();
						sendData.metadata["title"]=$("#cms_app_admin_item_title").val();
						sendData.metadata["poster"]=$("#cms_app_admin_item_upload_poster").val();
						sendData.metadata["pid"]=self.pid;
						sendData.metadata["paid"]=self.paid;
						sendData.metadata["poster"]=$("#cms_app_admin_item_upload_poster").val();
						sendData.metadata["folderFullPath"]=self.fullPathArray.join("/");
						if(content_type==i18n("CMS_ASSET_NONE")){
							delete sendData.metadata.content_type;
							delete sendData.metadata.item_id;
							delete sendData.metadata.item_name;
							delete sendData.metadata.title;
							delete sendData.metadata.poster;
							delete sendData.metadata.pid;
							delete sendData.metadata.paid;
							delete sendData.metadata.folderFullPath;
							delete sendData.metadata.templateId;
						};
						if(content_type_value=="topic"){
							sendData.metadata["templateId"]=self.treeColumnDataTemplateName;
						}
						var pNode = self.clickTreeNode.getParentNode();//layout
						var cardNode=pNode.getParentNode();
						var pageNode=cardNode.getParentNode();		
						var pathPara=encodeURIComponent(self.currentAppLevelTreeData["name"])+"/"+encodeURIComponent(pageNode["name"])+"/"+encodeURIComponent(cardNode["name"])+"/"+encodeURIComponent(pNode["name"])+"/"+encodeURIComponent(self.clickTreeNode["name"]);
						self.editPageAttrCommon(pathPara,sendData,function(){
							var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
							var node =  treeObj.getNodeByParam("id",pNode["id"]); 
							treeObj.reAsyncChildNodes(node, 'refresh',false,function(){
							});
						})
	          break;
					default:
						break;
				};
				//self.toggleElement(".cms_app_admin_page2",".cms_app_admin_page1");
			});
			$("#cms_app_admin_cancel").unbind().bind('click',function(){
				self.toggleElement(".cms_app_admin_page2",".cms_app_admin_page1");
			})
		},
		editAppAttr:function(callback){
		  var self=this;
		  if(document.getElementById("cms_app_page_attr_app_name").value.indexOf("_")!=-1){//mail:2019.8.27
				var text=i18n("CMS_COMFIRM1");
				self.showMsgDialog(text, function() {
					
				},function(){
					$("#user-admin-msg-cancel").hide();
					$("#user-admin-msg-content").css("margin-top","10px");
				});
				return;
			};
			var currentData=this.currentAppLevelTreeData;
			var name=currentData["name"];
			var method = "PUT";
			var url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
			var sendData=currentData;
			if(!currentData.metadata){
				sendData.metadata={};
			}
			sendData.metadata={
				"appName":document.getElementById("cms_app_page_attr_app_name").value,
				"screenWidth":document.getElementById("cms_app_page_attr_screen_width").value,
				"screenHeight":document.getElementById("cms_app_page_attr_screen_height").value,
				"navigationWidth":document.getElementById("cms_app_page_attr_nav_width").value,
				"navigationHeight":document.getElementById("cms_app_page_attr_nav_height").value,
				"描述":document.getElementById("cms_app_page_attr_desc").value
			};
			
			$.ajax({
        type: method,
        url: url,
        async: true,
				data: JSON.stringify(sendData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
					callback(resp)
				}
			})
		},
		
		editPageAttrCommon:function(pathPara,sendData,callback,paras){
			var self=this;
			var method = "PUT";
			var url = aquapaas_host + '/aquapaas/rest/navigation/trees/'
			url=url+pathPara;
			url=url+ '?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
			if(paras){
				url=url+"&"+paras;
			}
			$.ajax({
        type: method,
        url: url,
        async: true,
				data: JSON.stringify(sendData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
					callback()
				}
			})
		},
		
		editPageAttr:function(callback,newPageName){
		  var self=this;
			var currentData=this.currentAppLevelTreeData;
			var treeName=currentData["name"];
			var clickTreeNode=self.clickTreeNode;
			var pageName=clickTreeNode["name"];
			if(newPageName){
				pageName=newPageName
			}
			var method = "PUT";
			var url = aquapaas_host + '/aquapaas/rest/navigation/trees'
			url=url+'/'+treeName+'';
			url=url+'/'+pageName+'';
			url=url+ '?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
			
			var sendData=currentData;
			if(!currentData.metadata){
				sendData.metadata={};
			};
			sendData.metadata={
				"pageName":document.getElementById("cms_app_admin_page_attr_page_name").value, 
				"bgImage":document.getElementById("cms_app_admin_upload_bg_pic_input").value,
			};
			if($("#cms_app_admin_title_type").find("input").val()==i18n("CMS_ASSET_NONE")){
				//删除标题项定义
				delete sendData.metadata.normal_image;
				delete sendData.metadata.focus_image;
				delete sendData.metadata.selected_image;
				delete sendData.metadata.normal_text;
				delete sendData.metadata.normal_textColor;
				delete sendData.metadata.normal_shapeBgColor;
				delete sendData.metadata.normal_shapeBorderColor;
				delete sendData.metadata.focus_text;
				delete sendData.metadata.focus_textColor;
				delete sendData.metadata.focus_shapeBgColor;
				delete sendData.metadata.focus_shapeBorderColor;
				delete sendData.metadata.selected_text;
				delete sendData.metadata.selected_textColor;
				delete sendData.metadata.selected_shapeBgColor;
				delete sendData.metadata.selected_shapeBorderColor;
				//删除标题项内容
				delete sendData.metadata.item_id;
				delete sendData.metadata.item_name;
				delete sendData.metadata.content_type;
				delete sendData.metadata.title_type;
				delete sendData.metadata.pid;
				delete sendData.metadata.paid;
				delete sendData.metadata.poster;
				delete sendData.metadata.folderFullPath;
				delete sendData.metadata.templateId;
			}
			else{
				 //填充所有标题项定义
				var pageTitleType=$("#cms_app_admin_title_type").find("input").val();
				var title_type="image";
				if(pageTitleType==i18n("CMS_PIC")){
					title_type="image"
				}
				else if(pageTitleType==i18n("CMS_TEXT")){
					title_type="text"
				}
				else{
				}
				sendData.metadata.title_type=title_type;
				sendData.metadata["normal_image"]=document.getElementById("cms_app_admin_upload_daily_status_pic_input1").value;
				sendData.metadata["focus_image"]=document.getElementById("cms_app_admin_upload_focused_pic_input1").value;
				sendData.metadata["selected_image"]=document.getElementById("cms_app_admin_upload_choosed_status_pic_input1").value;
				//内容类型 type没有？？？和标题类型type重复
				sendData.metadata["normal_text"]=document.getElementById("cms_app_admin_page_upload_daily_status_text_input").value;
				sendData.metadata["normal_textColor"]=document.getElementById("cms_app_admin_page_upload_daily_status_text_color_input").value?("#"+document.getElementById("cms_app_admin_page_upload_daily_status_text_color_input").value):"";
				sendData.metadata["normal_shapeBgColor"]=document.getElementById("cms_app_admin_page_upload_daily_status_text_bg_color_input").value?("#"+document.getElementById("cms_app_admin_page_upload_daily_status_text_bg_color_input").value):"";
				sendData.metadata["normal_shapeBorderColor"]=document.getElementById("cms_app_admin_page_upload_daily_status_text_border_color_input").value?("#"+document.getElementById("cms_app_admin_page_upload_daily_status_text_border_color_input").value):"";
				sendData.metadata["focus_text"]=document.getElementById("cms_app_admin_page_upload_focus_status_text_input").value;
				sendData.metadata["focus_textColor"]=document.getElementById("cms_app_admin_page_upload_focus_status_text_color_input").value?("#"+document.getElementById("cms_app_admin_page_upload_focus_status_text_color_input").value):"";
				sendData.metadata["focus_shapeBgColor"]=document.getElementById("cms_app_admin_page_upload_focus_status_text_bg_color_input").value?("#"+document.getElementById("cms_app_admin_page_upload_focus_status_text_bg_color_input").value):"";
				sendData.metadata["focus_shapeBorderColor"]=document.getElementById("cms_app_admin_page_upload_focus_status_text_border_color_input").value?("#"+document.getElementById("cms_app_admin_page_upload_focus_status_text_border_color_input").value):"";
				sendData.metadata["selected_text"]=document.getElementById("cms_app_admin_page_upload_selected_status_text_input").value;
				sendData.metadata["selected_textColor"]=document.getElementById("cms_app_admin_page_upload_selected_status_text_color_input").value?("#"+document.getElementById("cms_app_admin_page_upload_selected_status_text_color_input").value):"";
				sendData.metadata["selected_shapeBgColor"]=document.getElementById("cms_app_admin_page_upload_selected_status_text_bg_color_input").value?("#"+document.getElementById("cms_app_admin_page_upload_selected_status_text_bg_color_input").value):"";
				sendData.metadata["selected_shapeBorderColor"]=document.getElementById("cms_app_admin_page_upload_selected_status_text_border_color_input").value?("#"+document.getElementById("cms_app_admin_page_upload_selected_status_text_border_color_input").value):"";
				sendData.metadata["pid"]=self.pid;
				sendData.metadata["paid"]=self.paid;
				sendData.metadata["poster"]=$("#cms_app_admin_item_upload_poster_page").val();
				sendData.metadata["folderFullPath"]=self.fullPathArray.join("/");
				
				var cms_app_admin_content_type1_value=$("#cms_app_admin_content_type1").find("input").val();
				if(cms_app_admin_content_type1_value==i18n("CMS_ASSET_NONE")){
				 delete sendData.metadata.item_id;
				 delete sendData.metadata.item_name;
				 delete sendData.metadata.content_type;
				 delete sendData.metadata.pid;
				 delete sendData.metadata.paid;
				 delete sendData.metadata.poster;
				 delete sendData.metadata.folderFullPath;
				 delete sendData.metadata.templateId;
				}
				else{
					sendData.metadata["item_id"]=document.getElementById("cms_app_admin_project_id1").value;
					sendData.metadata["item_name"]=document.getElementById("cms_app_admin_project_name1").value;
					var referTable=self.referTable;
					var content_type=cms_app_admin_content_type1_value;
					var content_type_value="";
					for(var i in referTable){
						if(referTable[i]==content_type){
							content_type_value=i;
							break
						}
					};
					sendData.metadata["content_type"]=content_type_value;
				}
			};
			if(content_type_value=="topic"){
				sendData.metadata["templateId"]=self.treeColumnDataTemplateName;
			};
			$.ajax({
        type: method,
        url: url,
        async: true,
				data: JSON.stringify(sendData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
					 self.initFileToNetdisk(self.currentAppLevelTreeData["name"]+".json");
					 self.initCurrentPageFileToNetdisk();
					 callback()
					}
			})
		},
		getSingleTree:function(name,id,callback,para){//根据参数获取某一个树节点,name为树名称，id为树中节点id。
			var method = "GET";
      var url = aquapaas_host + '/aquapaas/rest/navigation/trees/' + name + '/by_id:'+id;
			url=url+'?app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();
			url=url+"&tree_version=00";
			if(para){
				url=url+"&"+para
			};
			$.ajax({
        type: method,
        url: url,
        async: false,
        dataType: 'json',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
					if(resp){
						callback(resp)
					}
				}
			})
		},
		drawAppAttr:function(data){
			var appName="";
			if(data.metadata&&data.metadata["appName"]){
				appName=data.metadata["appName"]
			}
			document.getElementById("cms_app_page_attr_app_name").value=appName;
			if(data.metadata){
			  var metadata=data.metadata;
				var screenWidth=metadata["screenWidth"]||"";
				var screenHeight=metadata["screenHeight"]||"";
				var navWidth=metadata["navigationWidth"]||"";
				var navHeight=metadata["navigationHeight"]||"";
				var desc=metadata["描述"]||"";
				document.getElementById("cms_app_page_attr_screen_width").value=screenWidth;
				document.getElementById("cms_app_page_attr_screen_height").value=screenHeight;
				document.getElementById("cms_app_page_attr_nav_width").value=navWidth;
				document.getElementById("cms_app_page_attr_nav_height").value=navHeight;
				document.getElementById("cms_app_page_attr_desc").value=desc;
			}
		},
		drawPageAttr:function(data,firstObj){
		  var self=this;
			try{
				if(data.metadata){
					document.getElementById("cms_app_admin_page_attr_page_name").value=data.metadata.pageName||this.currentTreePointData["name"]||"";
					document.getElementById("cms_app_admin_upload_bg_pic_input").value=data.metadata.bgImage||"";
					document.getElementById("cms_app_admin_upload_daily_status_pic_input1").value=data.metadata.normal_image||"";
					document.getElementById("cms_app_admin_upload_focused_pic_input1").value=data.metadata.focus_image||"";
					document.getElementById("cms_app_admin_upload_choosed_status_pic_input1").value=data.metadata.selected_image||"";
					document.getElementById("cms_app_admin_page_upload_daily_status_text_input").value=data.metadata.normal_text||"";
					document.getElementById("cms_app_admin_page_upload_daily_status_text_color_input").value=data.metadata.normal_textColor?data.metadata.normal_textColor.replace("#",""):"";
					document.getElementById("cms_app_admin_page_upload_daily_status_text_bg_color_input").value=data.metadata.normal_shapeBgColor?data.metadata.normal_shapeBgColor.replace("#",""):"";
					document.getElementById("cms_app_admin_page_upload_daily_status_text_border_color_input").value=data.metadata.normal_shapeBorderColor?data.metadata.normal_shapeBorderColor.replace("#",""):"";
					document.getElementById("cms_app_admin_page_upload_focus_status_text_input").value=data.metadata.focus_text||"";
					document.getElementById("cms_app_admin_page_upload_focus_status_text_color_input").value=data.metadata.focus_textColor?data.metadata.focus_textColor.replace("#",""):"";
					document.getElementById("cms_app_admin_page_upload_focus_status_text_bg_color_input").value=data.metadata.focus_shapeBgColor?data.metadata.focus_shapeBgColor.replace("#",""):"";
					document.getElementById("cms_app_admin_page_upload_focus_status_text_border_color_input").value=data.metadata.focus_shapeBorderColor?data.metadata.focus_shapeBorderColor.replace("#",""):"";
					document.getElementById("cms_app_admin_page_upload_selected_status_text_input").value=data.metadata.selected_text||"";
					document.getElementById("cms_app_admin_page_upload_selected_status_text_color_input").value=data.metadata.selected_textColor?data.metadata.selected_textColor.replace("#",""):"";
					document.getElementById("cms_app_admin_page_upload_selected_status_text_bg_color_input").value=data.metadata.selected_shapeBgColor?data.metadata.selected_shapeBgColor.replace("#",""):"";
					document.getElementById("cms_app_admin_page_upload_selected_status_text_border_color_input").value=data.metadata.selected_shapeBorderColor?data.metadata.selected_shapeBorderColor.replace("#",""):"";
					document.getElementById("cms_app_admin_project_id1").value=data.metadata["item_id"]?data.metadata["item_id"]:"";
					document.getElementById("cms_app_admin_project_name1").value=data.metadata["item_name"]?data.metadata["item_name"]:"";
					document.getElementById("cms_app_admin_item_upload_poster_page").value=data.metadata["poster"]?data.metadata["poster"]:"";
					var cms_app_admin_content_type1_stored_value=i18n("CMS_ASSET");//默认值是节目
					if(data.metadata.content_type){
						var referTable=self.referTable;
						if(referTable[data.metadata.content_type]){
							cms_app_admin_content_type1_stored_value=referTable[data.metadata.content_type]
						}
					};
				 $("#cms_app_admin_content_type1").find("input").val(cms_app_admin_content_type1_stored_value);
				 
				 if(!data.metadata.title_type){//没有标题类型
						$("#cms_app_admin_title_type").find("input").val(i18n("CMS_ASSET_NONE"));
						$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content1").each(function(){
							$(this).hide();
						});
					}
					else{
						 $(firstObj).find(".cms_app_admin_page_title_item_define_none,#cms_app_admin_title_item_content1").each(function(){
								$(this).show();
						 });
						$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content1").each(function(){
							$(this).show();
						});
						if(data.metadata.title_type=="text"){
							$("#cms_app_admin_title_type").find("input").val(i18n("CMS_TEXT"));
							$("#cms_app_admin_status_container1").css("width","100%");
							$(firstObj).find(".cms_app_admin_title_type_pic").each(function(){
								$(this).hide();
							});
							$(firstObj).find(".cms_app_admin_title_type_text").each(function(){
								$(this).show();
							});
						}
						else if(data.metadata.title_type=="image"){
							$("#cms_app_admin_title_type").find("input").val(i18n("CMS_PIC"));
							$("#cms_app_admin_status_container1").css("width","calc(100% - 80px)");
							$(firstObj).find(".cms_app_admin_title_type_text").each(function(){
								$(this).hide();
							});
							$(firstObj).find(".cms_app_admin_title_type_pic").each(function(){
								$(this).show();
							});
						}
						else{
						};
						if(!data.metadata.content_type){
							 $("#cms_app_admin_content_type1").find("input").val(i18n("CMS_ASSET_NONE"));
							 $(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
								$(this).hide();
							})
						}
						else{
							 $(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
								$(this).show();
							})
						}
					}
				}
			}catch(e){
			}
		},
		drawCardAttr:function(data,firstObj){
		  var self=this;
			try{
			    if(data.metadata&&data.metadata.id){
					document.getElementById("cms_app_admin_card_id").value=data.metadata.id;
				}
				else{
					document.getElementById("cms_app_admin_card_id").value=data.ext_id||"";
				};
				if(data.metadata){
						document.getElementById("cms_app_admin_card_name").value=data.metadata.name||data.name||"";
						document.getElementById("cms_app_admin_card_width").value=data.metadata.width||"";
						document.getElementById("cms_app_admin_card_height").value=data.metadata.height||"";
						document.getElementById("cms_app_admin_card_margin_top").value=data.metadata.top||"";
						document.getElementById("cms_app_admin_card_margin_left").value=data.metadata.left||"";
						document.getElementById("cms_app_admin_card_margin_right").value=data.metadata.right||"";
						document.getElementById("cms_app_admin_card_margin_bottom").value=data.metadata.bottom||"";
						document.getElementById("cms_app_admin_upload_daily_status_pic_input2").value=data.metadata.normal_image||"";
						document.getElementById("cms_app_admin_upload_focused_pic_input2").value=data.metadata.focus_image||"";
						document.getElementById("cms_app_admin_upload_choosed_status_pic_input2").value=data.metadata.selected_image||"";
						document.getElementById("cms_app_admin_card_upload_daily_status_text_input").value=data.metadata.normal_text||"";
					  document.getElementById("cms_app_admin_card_upload_daily_status_text_color_input").value=data.metadata.normal_textColor?data.metadata.normal_textColor.replace("#",""):"";
					  document.getElementById("cms_app_admin_card_upload_daily_status_text_bg_color_input").value=data.metadata.normal_shapeBgColor?data.metadata.normal_shapeBgColor.replace("#",""):"";
					  document.getElementById("cms_app_admin_card_upload_daily_status_text_border_color_input").value=data.metadata.normal_shapeBorderColor?data.metadata.normal_shapeBorderColor.replace("#",""):"";
					  document.getElementById("cms_app_admin_card_upload_focus_status_text_input").value=data.metadata.focus_text||"";
					  document.getElementById("cms_app_admin_card_upload_focus_status_text_color_input").value=data.metadata.focus_textColor?data.metadata.focus_textColor.replace("#",""):"";
					  document.getElementById("cms_app_admin_card_upload_focus_status_text_bg_color_input").value=data.metadata.focus_shapeBgColor?data.metadata.focus_shapeBgColor.replace("#",""):"";
					  document.getElementById("cms_app_admin_card_upload_focus_status_text_border_color_input").value=data.metadata.focus_shapeBorderColor?data.metadata.focus_shapeBorderColor.replace("#",""):"";
					  document.getElementById("cms_app_admin_card_upload_selected_status_text_input").value=data.metadata.selected_text||"";
					  document.getElementById("cms_app_admin_card_upload_selected_status_text_color_input").value=data.metadata.selected_textColor?data.metadata.selected_textColor.replace("#",""):"";
					  document.getElementById("cms_app_admin_card_upload_selected_status_text_bg_color_input").value=data.metadata.selected_shapeBgColor?data.metadata.selected_shapeBgColor.replace("#",""):"";
					  document.getElementById("cms_app_admin_card_upload_selected_status_text_border_color_input").value=data.metadata.selected_shapeBorderColor?data.metadata.selected_shapeBorderColor.replace("#",""):"";
						document.getElementById("cms_app_admin_project_id2").value=data.metadata["item_id"]?data.metadata["item_id"]:"";
						document.getElementById("cms_app_admin_project_name2").value=data.metadata["item_name"]?data.metadata["item_name"]:"";
						document.getElementById("cms_app_admin_item_upload_poster_card").value=data.metadata["poster"]?data.metadata["poster"]:"";
						var cms_app_admin_content_type1_stored_value=i18n("CMS_ASSET");//默认节目
						if(data.metadata.content_type){
							var referTable=self.referTable;
						  if(referTable[data.metadata.content_type]){
							  cms_app_admin_content_type1_stored_value=referTable[data.metadata.content_type]
						  }
						}
					$("#cms_app_admin_content_type2").find("input").val(cms_app_admin_content_type1_stored_value);
					if(!data.metadata.title_type){//没有标题类型
						$("#cms_app_admin_title_type_card").find("input").val(i18n("CMS_ASSET_NONE"));
						$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content2").each(function(){
							$(this).hide();
						});
					}
					else{
						 $(firstObj).find(".cms_app_admin_page_title_item_define_none,#cms_app_admin_title_item_content2").each(function(){
								$(this).show();
						 });
						$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content2").each(function(){
							$(this).show();
						});
						if(data.metadata.title_type=="text"){
							$("#cms_app_admin_title_type_card").find("input").val(i18n("CMS_TEXT"));
							$("#cms_app_admin_status_container2").css("width","100%");
							$(firstObj).find(".cms_app_admin_title_type_pic").each(function(){
								$(this).hide();
							});
							$(firstObj).find(".cms_app_admin_title_type_text").each(function(){
								$(this).show();
							});
						}
						else if(data.metadata.title_type=="image"){
							$("#cms_app_admin_title_type_card").find("input").val(i18n("CMS_PIC"));
							$("#cms_app_admin_status_container2").css("width","calc(100% - 80px)");
							$(firstObj).find(".cms_app_admin_title_type_text").each(function(){
								$(this).hide();
							});
							$(firstObj).find(".cms_app_admin_title_type_pic").each(function(){
								$(this).show();
							});
						}
						else{
						};
						if(!data.metadata.content_type){
							 $("#cms_app_admin_content_type2").find("input").val(i18n("CMS_ASSET_NONE"));
							 $(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
								$(this).hide();
							})
						}
						else{
							 $(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
								$(this).show();
							})
						}
					}
				}
			}catch(e){
			}
		},
		adjustTrLenForTreeTable:function(container,treeContainer,treeLeftContainer){
			var containerHeight=document.getElementById(container).offsetHeight;
			var treeHeight=document.getElementById(treeContainer).offsetHeight;
			var needCollapseNum=((containerHeight-treeHeight)/41);//表格高度加边框41
			if(needCollapseNum!=0){
				if(needCollapseNum>0){
					this.adjustTreeTableTr(Math.abs(needCollapseNum),"collapse",container,treeLeftContainer);
				}
				else{
				 this.adjustTreeTableTr(Math.abs(needCollapseNum),"expand",container,treeLeftContainer);
				}
			}
		},
		drawAppTree:function(data){
			var self=this;
			var name=data.name||"";
			data.open=true;
			//data.name=data["metadata"]["应用名称"];
			var zNodes = [data];
		  if(zNodes[0].children){
				for(var i= 0,len = zNodes[0].children.length;i<len;i++){
					var temp=zNodes[0].children[i];
					temp.children=[];
				}
			};
			var temp=zNodes[0].children;
			/*
			zNodes[0].children=temp.sort(function(a,b){
				return a.name>b.name
			});
			*/
			zNodes[0].children=temp;
			function getURL(treeId, treeNode){
				var url=aquapaas_host + '/aquapaas/rest/navigation/trees/';
				url=url+self.treeName;
				if(typeof(treeNode)=="undefined"||typeof(treeNode.id)=="undefined"||(treeNode==null)){
					url=url+'/by_id:'+self.currentAppLevelTreeData["id"];
				}
				else{
					url=url+'/by_id:'+treeNode.id;
				}
				url=url+'?children=1&app_key='+ paasAppKey;
				url=url+'&timestamp=' +new Date().toISOString();
				url=url+'&tree_version=00';
				return url
			};
			function getURLNotIncludeChild(treeId, treeNode){
				var url=aquapaas_host + '/aquapaas/rest/navigation/trees/';
				url=url+self.treeName;
				url=url+'/by_id:'+treeNode.id;
				url=url+'?app_key='+ paasAppKey;
				url=url+'&timestamp=' +new Date().toISOString();
				return url
			};
			var setting = {
				check:{
					enable: false,
					autoCheckTrigger:true,
					chkStyle:"checkbox"
				},
				async: {
					enable: true,
					url: getURL,
					//url: "http://192.168.7.143:8080/aquapaas/rest/navigation/trees/20190721-%E5%BA%94%E7%94%A83/by_id:5d3809a88ac460282238f8d8?children=1&app_key=aquaBO&timestamp=2019-07-24T12:06:32.378Z&_=1563967544891",
					type: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					dataFilter: (treeId, parentNode, rsp)=>{
						var parentNodeChildren=rsp.children||[];
						
						if(parentNode.level>1){//卡片及卡片以下层展开
							//调整样式
							//console.log(parentNode.level);
							if(parentNode.level==2){//点击卡片，展开layout层
								if(parentNode.isLastNode){//页面最后一张卡片
									var tId=parentNode.tId;
									if(parentNodeChildren.length>0){
										$("#"+tId+"").closest("ul").append("<div class=\"cms_app_admin_last_card_layout_appear_when_last_card_expand\"></div>");
									};
									var bottomLayout=1;
									for(var i= 0,len = parentNodeChildren.length;i<len;i++){
										$("#"+tId+"").closest("ul").append("<div style=\"bottom:"+bottomLayout+"px\" class=\"cms_app_admin_page_white_block\"></div>");
										bottomLayout=bottomLayout+41;
									}
								}
							}
							else{//item 层
							  var parentNodeParent=parentNode.getParentNode();
								if(parentNode.isLastNode){
									var currentId=parentNode.tId;
									var tId=parentNodeParent.tId;
									var bottom=42;
									var bottomLayout=1;
									if(rsp.children){
										for(var i= 0,len = rsp.children.length;i<len;i++){
											if(parentNodeParent.isLastNode){
												$("#"+tId+"").closest("ul").append("<div style=\"bottom:"+bottom+"px\" class=\"cms_app_admin_page_white_block\"></div>");
											};
											$("#"+currentId+"").closest("ul").append("<div style=\"bottom:"+bottomLayout+"px\" class=\"cms_app_admin_page_white_block\"></div>");
										bottom=bottom+41;
										bottomLayout=bottomLayout+41;
									}
								}
							 }
							}
						}
						
						var rsp_children=rsp.children;
						var rsp_childrenNew=[];
						var rsp_childrenFiltered=[];
						for(var i= 0,len = rsp_children.length;i<len;i++){
							var rsp_childrenUnit=rsp_children[i];
							if(rsp_childrenUnit.node_class&&rsp_childrenUnit.node_class!="folder"){
							}
							else{
								rsp_childrenUnit.children=[];
								rsp_childrenNew.push(rsp_childrenUnit);
							}
						};
						var temp=rsp_childrenNew;
						/*
						rsp_childrenNew=temp.sort(function(a,b){
							return a.name>b.name
						});
						*/
						rsp_childrenNew=temp;
						if(parentNode.level==3){//只有最后一级项目，需要树节点排序，因为01，02...显示，且不会调整位置
							rsp_childrenNew=temp.sort(function(a,b){
								return a.name>b.name
							});
						}
						self.expandedData=rsp_childrenNew;
						return rsp_childrenNew
					}
				},
				callback: {
					beforeCheck:function(treeId, treeNode){
					},
					onCheck: function(event, treeId, treeNode){  
					},
					beforeCollapse:function(treeId, treeNode){
						if(treeNode.level==2&&treeNode.isLastNode){//页面最后一张卡片
							var tId=treeNode.tId;
							$("#"+tId+"").closest("ul").find(".cms_app_admin_last_card_layout_appear_when_last_card_expand").each(function(){
								$(this).remove();
							});
							$("#"+tId+"").closest("ul").find(".cms_app_admin_page_white_block").each(function(){
								$(this).remove();
							})
						};
						if(treeNode.level==3&&treeNode.isLastNode){//页面最后一张卡片
							var tId=treeNode.getParentNode().tId;
							$("#"+tId+"").closest("ul").find(".cms_app_admin_page_white_block").each(function(){
								$(this).remove();
							})
						};
						//$("#cms_app_admin_dash_link").css("visibility","hidden");
					},
					onCollapse:function(event, treeId, treeNode){
						var childrenLen=treeNode.children.length;
						var tId=treeNode.tId;
						$("#"+tId+"").find("span").eq(0).removeClass("collapse_switch_img");
						$("#"+tId+"").find("span").eq(0).removeClass("expand_switch_img");
						$("#"+tId+"").find("span").eq(0).removeClass("collapse_switch_img_last");
						$("#"+tId+"").find("span").eq(0).removeClass("expand_switch_img_last");
						var parentTId=treeNode.parentTId;
						var indexInParentTId=$("#"+parentTId+"").find("ul").eq(0).children().index($("#"+tId+""));
						if(childrenLen==0){
						 var levelLen=$("#"+parentTId+"").find("ul").eq(0).children().length;
						 if(indexInParentTId<(levelLen-1)){
								$("#"+tId+"").find("span").eq(0).addClass("collapse_switch_img")
						  }
							else{
								$("#"+tId+"").find("span").eq(0).addClass("collapse_switch_img_last")
							}
						};
						self.adjustTreeTableTr(childrenLen,"collapse","cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
						var containerHeight=document.getElementById("cms_app_admin_page2_left_body").offsetHeight;
						var treeHeight=document.getElementById("cms_app_admin_page2_left_tree_right_1").offsetHeight;
						var needCollapseNum=((containerHeight-treeHeight)/41);//表格高度加边框41
						//console.log(containerHeight);
						//console.log(treeHeight);
						//console.log(needCollapseNum);
						if(needCollapseNum>0){
							self.adjustTreeTableTr(needCollapseNum,"collapse","cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
						}
					},
					beforeExpand:function(treeId, treeNode){
					  //console.log(1);
					  /*
						if(self.tId==treeNode.tId){
							jQuery("#"+self.tId+"").find(".bottom_open").addClass("cms_app_admin_blue_img1");
						 jQuery("#"+self.tId+"").find(".bottom_close").addClass("cms_app_admin_blue_img2");
						}
						*/
						//currentTreeId
						var allCardData=self.allCardData;
						if(treeNode.level==2){//卡片下面的层次  
							self.dataBelowCurrentCard=[];
							for(var i= 0,len = allCardData.length;i<len;i++){
							  if(treeNode.id==allCardData[i].id){
									self.dataBelowCurrentCard=allCardData[i]
								}
							}
						}
						//else{
							self.zTreeObj.reAsyncChildNodes(treeNode, 'refresh',false,function(){
								var tId=treeNode.tId;
								var childrenLen=self.expandedData.length;
								//console.log(childrenLen);
								self.adjustTreeTableTr(childrenLen,"expand","cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
								$("#"+tId+"").find("span").eq(0).removeClass("collapse_switch_img");
								$("#"+tId+"").find("span").eq(0).removeClass("expand_switch_img");
								$("#"+tId+"").find("span").eq(0).removeClass("collapse_switch_img_last");
								$("#"+tId+"").find("span").eq(0).removeClass("expand_switch_img_last");
								if(childrenLen==0){
								  //console.log($("#"+tId+"").find("span").eq(0));
									$("#"+tId+"").find("span").eq(0).addClass("expand_switch_img");
								};
								var parentTId=treeNode.parentTId;
								var indexInParentTId=$("#"+parentTId+"").find("ul").eq(0).find("li").index($("#"+tId+""));
								if(childrenLen==0){
								 var levelLen=$("#"+parentTId+"").find("ul").eq(0).find("li").length;
								 if(indexInParentTId<(levelLen-1)){
										$("#"+tId+"").find("span").eq(0).addClass("expand_switch_img")
									}
									else{
										$("#"+tId+"").find("span").eq(0).addClass("expand_switch_img_last")
									}
								};
								
							})
						//}
						//$("#cms_app_admin_dash_link").css("visibility","hidden");
					},
					onExpand:function(event, treeId, treeNode){ 
						/*
					  if(self.tId==treeNode.tId){
							jQuery("#"+self.tId+"").find(".bottom_open").addClass("cms_app_admin_blue_img1");
						 jQuery("#"+self.tId+"").find(".bottom_close").addClass("cms_app_admin_blue_img2");
						}
						*/
					},
					onClick: function(event, treeId, treeNode){
						var clickTreeNode=self.clickTreeNode;
						self.treeColumnDataTemplateName="";
						$("#"+clickTreeNode.tId+"").find("a").eq(0).css("background-color","");
						$("#"+clickTreeNode.tId+"").find("a").eq(0).find("span").css("color","#797979");
						/*
						if(treeNode.level==4){
							$("#"+treeNode.tId+"").find(".ico_close").css("background-image","url('content/CMS/images/zTree/item.png')");
							$("#"+treeNode.tId+"").find(".ico_open").css("background-image","url('content/CMS/images/zTree/item.png')");
						};
						*/
						$("#"+treeNode.tId+"").find("a").eq(0).css("background-color","#80daf1");
						$("#"+treeNode.tId+"").find("a").eq(0).find("span").css("color","#ffffff");
						if((treeNode.tId!=clickTreeNode.tId)&&(clickTreeNode.level==4)){//上次点击的项目节点颜色还原。
							$("#"+clickTreeNode.tId+"").find(".ico_close").css("background-image","url('content/CMS/images/zTree/item.png')");
							$("#"+clickTreeNode.tId+"").find(".ico_open").css("background-image","url('content/CMS/images/zTree/item.png')");
						}
						if(treeNode.level==4){
							$("#"+treeNode.tId+"").find(".ico_close").css("background-image","url('content/CMS/images/zTree/item_white.png')");
							$("#"+treeNode.tId+"").find(".ico_open").css("background-image","url('content/CMS/images/zTree/item_white.png')");
						}
						var tId=treeNode.tId;
						self.pageUploadArray=[];//图片上传对象
						self.picUploadCount=0;
						var currentTreeNodeData={};
						var method="GET";
					  var newUrl=getURLNotIncludeChild(treeId, treeNode);
						newUrl=newUrl+"&children=1";
						newUrl=newUrl+"&tree_version=00";
						$.ajax({//当点击树时，获取这一层树的数据(用于刷新右侧列表)
						type: method,
						url: newUrl,
						async: false,
						dataType: 'json',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'x-aqua-sign': getPaaS_x_aqua_sign(method, newUrl)
							}
						}).always((resp, status, xhr) => {
							currentTreeNodeData=resp;
							self.currentTreePointData=resp;
						});
						self.fullPathArray=[];//点击节点时，初始化fullPathArray
						self.pid="";
						self.paid="";
						var currentTreePointData=self.currentTreePointData;
						if(currentTreePointData.metadata){
							if(currentTreePointData.metadata.folderFullPath){
								self.fullPathArray=currentTreePointData.metadata.folderFullPath.split("/");
							};
							self.pid=currentTreePointData.metadata.pid||"";
							self.paid=currentTreePointData.metadata.paid||"";
							self.treeColumnDataTemplateName=currentTreePointData.metadata.templateId||"";
						};
						var newUrlNotIncludeChildren=getURLNotIncludeChild(treeId, treeNode);
						newUrlNotIncludeChildren=newUrlNotIncludeChildren+"&tree_version=00";
						$.ajax({//当点击树时，获取这一层树的数据(用于刷新右侧列表)
						type: method,
						url: newUrlNotIncludeChildren,
						async: false,
						dataType: 'json',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json',
							'x-aqua-sign': getPaaS_x_aqua_sign(method, newUrl)
							}
						}).always((resp, status, xhr) => {
							self.currentTreePointDataNotIncludeChildren=resp;
						});
						//if (status == 'success') {
					   self.clickTreeNode=treeNode;
						 $(".cms_app_admin_tab").each(function(){//所有tab去除标亮。
							$(this).removeClass("cms_app_admin_tab_focus").hide();
						 });
						 $(".cms_app_admin_tab_interval").each(function(){//所有tab去除标亮。
							$(this).hide();
						 });
						 $(".cms_app_admin_display_container_after_click_tab").each(function(){
								$(this).hide();
						 });
						var showTabClass="";//显示哪些tab
						var defaultShowContainerIndex=0;
						switch(treeNode.level)
						{
						case 0:
						  self.tabType="editAppType";
							showTabClass="cms_app_admin_tab_for_app";
							defaultShowContainerIndex=0;
							self.tabInex=defaultShowContainerIndex;
							$(".cms_app_admin_display_container_after_click_tab").eq(defaultShowContainerIndex).show().css("visibility","visible");
							self.drawAppAttr(currentTreeNodeData);
							break;
						case 1:
							var pNode = treeNode.getParentNode();
							self.PNode=pNode;
						  //上传图片对象初始化
							self.tabType="editPageType";
							showTabClass="cms_app_admin_tab_for_page";
							defaultShowContainerIndex=5;
							self.tabInex=defaultShowContainerIndex;
						  $(".cms_app_admin_display_container_after_click_tab").eq(defaultShowContainerIndex).show().css("visibility","visible");
							var firstObj=$(".cms_app_admin_display_container_after_click_tab").eq(defaultShowContainerIndex);
							$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content1").each(function(){
								$(this).show();
							});
							var folder=NAVIGATION_TREE_ROOT + self.currentAppLevelTreeData["name"] + "/" + self.currentTreePointData["name"];
							self.bindUploadEventsPage("#cms_app_admin_upload_bg_pic_button","cms_app_admin_upload_bg_pic_input",folder);
							self.bindUploadEventsPage("#cms_app_admin_upload_daily_status_pic_button1","cms_app_admin_upload_daily_status_pic_input1",folder);
							self.bindUploadEventsPage("#cms_app_admin_upload_focused_pic_button1","cms_app_admin_upload_focused_pic_input1",folder);
							self.bindUploadEventsPage("#cms_app_admin_upload_choosed_status_pic_button1","cms_app_admin_upload_choosed_status_pic_input1",folder);
							self.bindUploadEventsPage("#cms_app_admin_item_upload_poster_button_page","cms_app_admin_item_upload_poster_page",folder);
							if(self.notInitPageAttributeBody){
								self.notInitPageAttributeBody=false;
								self.pageTitleType="pic";
								var typeSelect = self.getNormalSelector('cms_app_admin_title_type', [{
									label: i18n("CMS_PIC"),
									value: "pic"
								},{
									label: i18n("CMS_TEXT"),
									value: "text"
								},{
									label: i18n("CMS_ASSET_NONE"),
									value: i18n("CMS_ASSET_NONE")
								}]);
								typeSelect.create();
								typeSelect.onChange = function(obj){
									self.pageTitleType=obj.value;
									if(obj.value=="text"){
										$("#cms_app_admin_status_container1").css("width","100%");
										$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content1").each(function(){
											$(this).show();
										});
										$(firstObj).find(".cms_app_admin_title_type_pic").each(function(){
											$(this).hide();
										});
										$(firstObj).find(".cms_app_admin_title_type_text").each(function(){
											$(this).show();
										});
									}
									else if(obj.value=="pic"){
										$("#cms_app_admin_status_container1").css("width","calc(100% - 80px)");
										$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content1").each(function(){
											$(this).show();
										});
										$(firstObj).find(".cms_app_admin_title_type_text").each(function(){
											$(this).hide();
										});
										$(firstObj).find(".cms_app_admin_title_type_pic").each(function(){
											$(this).show();
										});
									}
									else if(obj.value==i18n("CMS_ASSET_NONE")){
									 $(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content1").each(function(){
											$(this).hide();
										});
									}
									else{
									}
								};
								var pageContentSelect = self.getNormalSelector('cms_app_admin_content_type1', [{//mail:2019.8.1  页面标题项中的标题项内容类型只有节目、栏目、专题三个选项
									label: i18n("CMS_ASSET"),
									value: i18n("CMS_ASSET")
								},{
									label: i18n("CMS_ASSET_PACKAGE"),
									value: i18n("CMS_ASSET_PACKAGE")
								},{
									label: i18n("CMS_ASSET_SERVICE_COLUMN"),
									value: i18n("CMS_ASSET_SERVICE_COLUMN")
								},{
									label: i18n("CMS_ASSET_TOPIC"),
									value: i18n("CMS_ASSET_TOPIC")
									},
									{
									label: i18n("CMS_ASSET_NONE"),
									value: i18n("CMS_ASSET_NONE")
									}
								]);
								pageContentSelect.create();
                pageContentSelect.onChange = function(obj){
									switch(obj.value)
									{
									case i18n("CMS_ASSET_NONE"):
										 $(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
											$(this).hide();
										})
										break;
									default:
										$(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
											$(this).show();
										});
									break;
									}
                }									
								//图片上传
								$("#cms_app_admin_choose_submit1").unbind().bind('click', function (){
									switch($("#cms_app_admin_content_type1").find("input").val())
									{
									case i18n("CMS_ASSET"): 
										var assetBundleType="asset";
										self.chooseProgramsOrProgramsPkg(function(){
											var titles=[
												{label: ""},
												{label: i18n("CMS_ASSET_PROVIDER")},
												{label: i18n("CMS_ASSET_CHOOSE_PID")},
												{label: i18n("CMS_ASSET_TITLE")},
												{label: i18n("CMS_ASSET_START_TIME")},
												{label: i18n("CMS_ASSET_ALL_PATH")},
												{label: i18n("CMS_ASSET_STATUS")}
											];
											var dialogTitle=i18n("CMS_ASSET_CHOOSE_PROGRAM");
											var sendBody=[];
											if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {//用户有节目授权
												sendBody.push('provider_id=' + my.paas.user.metadata.AquaBO_mediaUserRight + '&provider_id_op=in')
												}
											var sendRequestUrl=aquapaas_host + "/aquapaas/rest/search/contents/asset";
											self.initPrograms(dialogTitle,titles,sendRequestUrl,sendBody,"asset",function(){
												self.chooseProgramsOrPkgDialog.close();
											  var storedAssetOrBundleData=self.storedAssetOrBundleData;
												document.getElementById("cms_app_admin_project_id1").value=storedAssetOrBundleData.asset.item_id||"";
												document.getElementById("cms_app_admin_project_name1").value=storedAssetOrBundleData.asset.item_name||"";
												//document.getElementById("cms_app_admin_item_upload_poster_page").value=storedAssetOrBundleData[assetBundleType].posterUrl||"";
											  self.transferAndFillPosterUrl(storedAssetOrBundleData[assetBundleType].posterUrl,"cms_app_admin_item_upload_poster_page");
											});
										});
										break;
									case i18n("CMS_ASSET_PACKAGE"): 
										var assetBundleType="bundle";
										self.chooseProgramsOrProgramsPkg(function(){
											var titles=[
												{label: ""},
												{label: i18n("CMS_ASSET_PROVIDER")},
												{label: i18n("CMS_ASSET_CHOOSE_PKG_PID")},
												{label: i18n("CMS_ASSET_TITLE")},
												{label: i18n("CMS_ASSET_START_TIME")},
												{label: i18n("CMS_ASSET_ALL_PATH")},
												{label: i18n("CMS_ASSET_STATUS")}
											];
											var dialogTitle=i18n("CMS_ASSET_CHOOSE_PROGRAM_PKG");
											var sendBody=[];
											if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {//用户有节目授权
												sendBody.push('provider_id=' + my.paas.user.metadata.AquaBO_mediaUserRight + '&provider_id_op=in')
												}
											var sendRequestUrl=aquapaas_host + "/aquapaas/rest/search/contents/bundle";
											self.initPrograms(dialogTitle,titles,sendRequestUrl,sendBody,"bundle",function(){
												self.chooseProgramsOrPkgDialog.close();
											  var storedAssetOrBundleData=self.storedAssetOrBundleData;
												document.getElementById("cms_app_admin_project_id1").value=storedAssetOrBundleData.bundle.item_id||"";
												document.getElementById("cms_app_admin_project_name1").value=storedAssetOrBundleData.bundle.item_name||"";
												//document.getElementById("cms_app_admin_item_upload_poster_page").value=storedAssetOrBundleData[assetBundleType].posterUrl||"";
												self.transferAndFillPosterUrl(storedAssetOrBundleData[assetBundleType].posterUrl,"cms_app_admin_item_upload_poster_page");
											});
										});
										break;
									case i18n("CMS_ASSET_TOPIC"): 
										self.initColumn(i18n("CMS_ASSET_CHOOSE_TOPIC"),function(treeNodeColumn){
											if(treeNodeColumn&&treeNodeColumn.metadata_public&&treeNodeColumn.metadata_public.style){
												self.treeColumnDataTemplateName=treeNodeColumn.metadata_public.style
											}
											$('#cms_app_admin_project_id1').val(treeNodeColumn.id||"");
											$('#cms_app_admin_project_name1').val(treeNodeColumn.name||"");
										},CMSTopicTreeList);
									break;
									case i18n("CMS_ASSET_SERVICE_COLUMN"): 
										self.initColumn(i18n("CMS_ASSET_CHOOSE_COLUMN"),function(treeNodeColumn){
											$('#cms_app_admin_project_id1').val(treeNodeColumn.id||"");
											$('#cms_app_admin_project_name1').val(treeNodeColumn.name||"");
										},CMSColumnTreeList);
									break;
									default:
										break;
									}
								});
							};
							self.drawPageAttr(currentTreeNodeData,firstObj);
							
							break;
						case 2:
						    var pNode = treeNode.getParentNode();
								self.PNode=pNode;//卡片需要用到父节点页面
								self.tabType="editCardType";
								showTabClass="cms_app_admin_tab_for_card";
								defaultShowContainerIndex=7;
								self.tabInex=defaultShowContainerIndex;
								$(".cms_app_admin_display_container_after_click_tab").eq(defaultShowContainerIndex).show().css("visibility","visible");
								var firstObj=$(".cms_app_admin_display_container_after_click_tab").eq(defaultShowContainerIndex);
								$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content2").each(function(){
									$(this).show();
								});
								var folder=NAVIGATION_TREE_ROOT + self.currentAppLevelTreeData["name"] + "/"+self.PNode["name"] + "/" + self.currentTreePointData["name"];
								self.bindUploadEventsPage("#cms_app_admin_upload_daily_status_pic_button2","cms_app_admin_upload_daily_status_pic_input2",folder);
								self.bindUploadEventsPage("#cms_app_admin_upload_focused_pic_button2","cms_app_admin_upload_focused_pic_input2",folder);
								self.bindUploadEventsPage("#cms_app_admin_upload_choosed_status_pic_button2","cms_app_admin_upload_choosed_status_pic_input2",folder);
								self.bindUploadEventsPage("#cms_app_admin_item_upload_poster_button_card","cms_app_admin_item_upload_poster_card",folder);
								if(self.notInitCardAttributeBody){
										self.notInitCardAttributeBody=false;
										var typeSelect = self.getNormalSelector('cms_app_admin_title_type_card', [{
											label: i18n("CMS_PIC"),
											value: "pic"
										},{
											label: i18n("CMS_TEXT"),
											value: "text"
										},{
											label: i18n("CMS_ASSET_NONE"),
											value: i18n("CMS_ASSET_NONE")
											}
										]);
										typeSelect.create();
										//document.getElementById("cms_app_admin_title_type").value=i18n("CMS_PIC");
										typeSelect.onChange = function(obj){
											if(obj.value=="text"){
												$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content2").each(function(){
													$(this).show();
												});
												$("#cms_app_admin_status_container2").css("width","100%");
												$(firstObj).find(".cms_app_admin_title_type_pic").each(function(){
													$(this).hide();
												});
												$(firstObj).find(".cms_app_admin_title_type_text").each(function(){
													$(this).show();
												});
											}
											else if(obj.value=="pic"){
												$(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content2").each(function(){
													$(this).show();
												});
												$("#cms_app_admin_status_container2").css("width","calc(100% - 80px)");
												$(firstObj).find(".cms_app_admin_title_type_text").each(function(){
													$(this).hide();
												});
												$(firstObj).find(".cms_app_admin_title_type_pic").each(function(){
													$(this).show();
												});
											}
											else if(obj.value==i18n("CMS_ASSET_NONE")){
											  $(firstObj).find(".cms_app_admin_page_title_item_define_none,.cms_app_admin_page_title_item_content_none,#cms_app_admin_title_item_content2").each(function(){
													$(this).hide();
												});
											}
											else{
											}
										};
										var cardContentSelect = self.getNormalSelector('cms_app_admin_content_type2', [{
											label: i18n("CMS_ASSET"),
											value: i18n("CMS_ASSET")
										},{
											label: i18n("CMS_ASSET_PACKAGE"),
											value: i18n("CMS_ASSET_PACKAGE")
										},{
											label: i18n("CMS_ASSET_SERVICE_COLUMN"),
											value: i18n("CMS_ASSET_SERVICE_COLUMN")
										},{
											label: i18n("CMS_ASSET_TOPIC"),
											value: i18n("CMS_ASSET_TOPIC")
											},{
											label: i18n("CMS_ASSET_NONE"),
											value: i18n("CMS_ASSET_NONE")
											}
										]);
										cardContentSelect.create();
										cardContentSelect.onChange = function(obj){
											switch(obj.value)
											{
											case i18n("CMS_ASSET_NONE"):
												 $(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
													$(this).hide();
												})
												break;
											default:
												$(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
													$(this).show();
												})
											break;
										  }
										};
										$("#cms_app_admin_choose_submit2").unbind().bind('click', function (){
											switch($("#cms_app_admin_content_type2").find("input").val())
											{
											case i18n("CMS_ASSET"):
												var assetBundleType="asset";
												self.chooseProgramsOrProgramsPkg(function(){
													var titles=[
														{label: ""},
														{label: i18n("CMS_ASSET_PROVIDER")},
														{label: i18n("CMS_ASSET_CHOOSE_PID")},
														{label: i18n("CMS_ASSET_TITLE")},
														{label: i18n("CMS_ASSET_START_TIME")},
														{label: i18n("CMS_ASSET_ALL_PATH")},
														{label: i18n("CMS_ASSET_STATUS")}
													];
													var dialogTitle=i18n("CMS_ASSET_CHOOSE_PROGRAM");
													var sendBody=[];
													if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {//用户有节目授权
														sendBody.push('provider_id=' + my.paas.user.metadata.AquaBO_mediaUserRight + '&provider_id_op=in')
														}
													var sendRequestUrl=aquapaas_host + "/aquapaas/rest/search/contents/asset";
													self.initPrograms(dialogTitle,titles,sendRequestUrl,sendBody,"asset",function(){
														self.chooseProgramsOrPkgDialog.close();
														var storedAssetOrBundleData=self.storedAssetOrBundleData;
														document.getElementById("cms_app_admin_project_id2").value=storedAssetOrBundleData.asset.item_id||"";
														document.getElementById("cms_app_admin_project_name2").value=storedAssetOrBundleData.asset.item_name||"";
														//document.getElementById("cms_app_admin_item_upload_poster_card").value=storedAssetOrBundleData[assetBundleType].posterUrl||"";
														self.transferAndFillPosterUrl(storedAssetOrBundleData[assetBundleType].posterUrl,"cms_app_admin_item_upload_poster_card");
													});
												});
												break;
												case i18n("CMS_ASSET_PACKAGE"):
													var assetBundleType="bundle";
													self.chooseProgramsOrProgramsPkg(function(){
														var titles=[
															{label: ""},
															{label: i18n("CMS_ASSET_PROVIDER")},
															{label: i18n("CMS_ASSET_CHOOSE_PKG_PID")},
															{label: i18n("CMS_ASSET_TITLE")},
															{label: i18n("CMS_ASSET_START_TIME")},
															{label: i18n("CMS_ASSET_ALL_PATH")},
															{label: i18n("CMS_ASSET_STATUS")}
														];
														var dialogTitle=i18n("CMS_ASSET_CHOOSE_PROGRAM_PKG");
														var sendBody=[];
														if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {//用户有节目授权
															sendBody.push('provider_id=' + my.paas.user.metadata.AquaBO_mediaUserRight + '&provider_id_op=in')
															}
														var sendRequestUrl=aquapaas_host + "/aquapaas/rest/search/contents/bundle";
														self.initPrograms(dialogTitle,titles,sendRequestUrl,sendBody,"bundle",function(){
															self.chooseProgramsOrPkgDialog.close();
															var storedAssetOrBundleData=self.storedAssetOrBundleData;
															document.getElementById("cms_app_admin_project_id2").value=storedAssetOrBundleData.bundle.item_id||"";
															document.getElementById("cms_app_admin_project_name2").value=storedAssetOrBundleData.bundle.item_name||"";
															//document.getElementById("cms_app_admin_item_upload_poster_card").value=storedAssetOrBundleData[assetBundleType].posterUrl||"";
															self.transferAndFillPosterUrl(storedAssetOrBundleData[assetBundleType].posterUrl,"cms_app_admin_item_upload_poster_card");
														});
													});
													break;
										  	case i18n("CMS_ASSET_TOPIC"): 
													self.initColumn(i18n("CMS_ASSET_CHOOSE_TOPIC"),function(treeNodeColumn){
														if(treeNodeColumn&&treeNodeColumn.metadata_public&&treeNodeColumn.metadata_public.style){
															self.treeColumnDataTemplateName=treeNodeColumn.metadata_public.style
														};
														$('#cms_app_admin_project_id2').val(treeNodeColumn.id||"");
														$('#cms_app_admin_project_name2').val(treeNodeColumn.name||"");
													},CMSTopicTreeList);
												break;
												case i18n("CMS_ASSET_SERVICE_COLUMN"): 
													self.initColumn(i18n("CMS_ASSET_CHOOSE_COLUMN"),function(treeNodeColumn){
														$('#cms_app_admin_project_id2').val(treeNodeColumn.id||"");
														$('#cms_app_admin_project_name2').val(treeNodeColumn.name||"");
													},CMSColumnTreeList);
												break;
											default:
												break;
											}
										});
									};
									self.drawCardAttr(currentTreeNodeData,firstObj);
								break;
								case 3:
									var pNode = treeNode.getParentNode();
									var allCardData=self.allCardData;
			            var currentCardData={};
									for(var i= 0,len = allCardData.length;i<len;i++){
										if(pNode.id==allCardData[i].id){
											currentCardData=allCardData[i]
										}
									};
									self.tabType="editLayoutType";
									showTabClass="cms_app_admin_tab_for_item";
									defaultShowContainerIndex=9;
									self.tabInex=defaultShowContainerIndex;
									$(".cms_app_admin_display_container_after_click_tab").eq(defaultShowContainerIndex).show().css("visibility","visible");
									var firstObj=$(".cms_app_admin_display_container_after_click_tab").eq(defaultShowContainerIndex);
									self.initItemList();
									break;
								case 4:
									self.tabType="editItemType";	
                  $("#cms_app_admin_item_can_be_choose").empty();//初始化									
									var pNode = treeNode.getParentNode();
									var cardNode=pNode.getParentNode();
									var pageNode=cardNode.getParentNode();
									var allCardData=self.allCardData;
			            var currentCardData={};
									for(var i= 0,len = allCardData.length;i<len;i++){
										if(cardNode.id==allCardData[i].id){
											currentCardData=allCardData[i]
										}
									};
									var currentTreePointData=self.currentTreePointData;
									if(currentTreePointData.metadata){
									  var itemMetadata=currentTreePointData.metadata;
										$("#cms_app_admin_item_default_bg").val(itemMetadata.defaultBgImage||"");
										$("#cms_app_admin_item_default_bg_color").val(itemMetadata.defaultBgColor?itemMetadata.defaultBgColor.replace("#",""):"");
										$("#cms_app_admin_item_pic_url").val(itemMetadata.defaultImage||"");
										$("#cms_app_admin_size_get_focus").val((typeof itemMetadata.defaultFocusScale!="undefined")?itemMetadata.defaultFocusScale:"");
										$("#cms_app_admin_border_color_get_focus").val(itemMetadata.defaultFocusBorderColor?itemMetadata.defaultFocusBorderColor.replace("#",""):"");
										$("#cms_app_admin_border_width_get_focus").val((typeof itemMetadata.defaultFocusBorderWidth!="undefined")?itemMetadata.defaultFocusBorderWidth:"");
										$("#cms_app_admin_arc_get_focus").val((typeof itemMetadata.defaultFocusBorderRadius!="undefined")?itemMetadata.defaultFocusBorderRadius:"");
										$("#cms_app_admin_z_height_get_focus").val((typeof itemMetadata.defaultFocusZ!="undefined")?itemMetadata.defaultFocusZ:"");
									};
									showTabClass="cms_app_admin_tab_current_item";
									defaultShowContainerIndex=10;
									self.tabInex=defaultShowContainerIndex;
									var firstObj=$(".cms_app_admin_display_container_after_click_tab").eq(defaultShowContainerIndex);
									$(firstObj).show().css("visibility","visible");
									var folder=NAVIGATION_TREE_ROOT + self.currentAppLevelTreeData["name"] + "/"+pageNode["name"] + "/" + cardNode["name"]+ "/" + pNode["name"]+ "/" + treeNode["name"];
									self.bindUploadEventsPage("#cms_app_admin_item_upload_poster_button","cms_app_admin_item_upload_poster",folder);
									self.bindUploadEventsPage("#cms_app_admin_item_default_bg_button","cms_app_admin_item_default_bg",folder);
									self.bindUploadEventsPage("#cms_app_admin_item_pic_url_button","cms_app_admin_item_pic_url",folder);
									if(self.notInitItemAttributeBody){
										self.notInitItemAttributeBody=false;
										$("#cms_app_admin_choose_submit3").unbind().bind('click', function (){
											switch($("#cms_app_admin_item_content_type3").find("input").val())
											{
											case i18n("CMS_ASSET"):
												var assetBundleType="asset";
												self.chooseProgramsOrProgramsPkg(function(){
													var titles=[
														{label: ""},
														{label: i18n("CMS_ASSET_PROVIDER")},
														{label: i18n("CMS_ASSET_CHOOSE_PID")},
														{label: i18n("CMS_ASSET_TITLE")},
														{label: i18n("CMS_ASSET_START_TIME")},
														{label: i18n("CMS_ASSET_ALL_PATH")},
														{label: i18n("CMS_ASSET_STATUS")}
													];
													var dialogTitle=i18n("CMS_ASSET_CHOOSE_PROGRAM");
													var sendBody=[];
													if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {//用户有节目授权
														sendBody.push('provider_id=' + my.paas.user.metadata.AquaBO_mediaUserRight + '&provider_id_op=in')
														}
													var sendRequestUrl=aquapaas_host + "/aquapaas/rest/search/contents/asset";
													self.initPrograms(dialogTitle,titles,sendRequestUrl,sendBody,"asset",function(){
														self.chooseProgramsOrPkgDialog.close();
														var storedAssetOrBundleData=self.storedAssetOrBundleData;
														document.getElementById("cms_app_admin_item_project_id").value=storedAssetOrBundleData.asset.item_id||"";
														document.getElementById("cms_app_admin_item_project_name").value=storedAssetOrBundleData.asset.item_name||"";
														document.getElementById("cms_app_admin_item_title").value=storedAssetOrBundleData.asset.item_name||"";
														//document.getElementById("cms_app_admin_item_upload_poster").value=storedAssetOrBundleData[assetBundleType].posterUrl||"";
														self.transferAndFillPosterUrl(storedAssetOrBundleData[assetBundleType].posterUrl,"cms_app_admin_item_upload_poster");
													});
												});
												break;
												case i18n("CMS_ASSET_PACKAGE"): 
												  var assetBundleType="bundle";
													self.chooseProgramsOrProgramsPkg(function(){
														var titles=[
															{label: ""},
															{label: i18n("CMS_ASSET_PROVIDER")},
															{label: i18n("CMS_ASSET_CHOOSE_PKG_PID")},
															{label: i18n("CMS_ASSET_TITLE")},
															{label: i18n("CMS_ASSET_START_TIME")},
															{label: i18n("CMS_ASSET_ALL_PATH")},
															{label: i18n("CMS_ASSET_STATUS")}
														];
														var dialogTitle=i18n("CMS_ASSET_CHOOSE_PROGRAM_PKG");
														var sendBody=[];
														if (my.paas.user.metadata.AquaBO_mediaUserRight !== '') {//用户有节目授权
															sendBody.push('provider_id=' + my.paas.user.metadata.AquaBO_mediaUserRight + '&provider_id_op=in')
															}
														var sendRequestUrl=aquapaas_host + "/aquapaas/rest/search/contents/bundle";
														self.initPrograms(dialogTitle,titles,sendRequestUrl,sendBody,"bundle",function(){
															self.chooseProgramsOrPkgDialog.close();
															var storedAssetOrBundleData=self.storedAssetOrBundleData;
															document.getElementById("cms_app_admin_item_project_id").value=storedAssetOrBundleData.bundle.item_id||"";
															document.getElementById("cms_app_admin_item_project_name").value=storedAssetOrBundleData.bundle.item_name||"";
															document.getElementById("cms_app_admin_item_title").value=storedAssetOrBundleData.bundle.item_name||"";
															//document.getElementById("cms_app_admin_item_upload_poster").value=storedAssetOrBundleData[assetBundleType].posterUrl||"";
															self.transferAndFillPosterUrl(storedAssetOrBundleData[assetBundleType].posterUrl,"cms_app_admin_item_upload_poster");
														});
													});
													break;
												case i18n("CMS_ASSET_BUY_PRODUCT_PACKAGE"): 
													self.initServicePackages()
													break;
											 case i18n("CMS_ASSET_SERVICE_COLUMN"): 
													self.initColumn(i18n("CMS_ASSET_CHOOSE_COLUMN"),function(treeNodeColumn){
														$('#cms_app_admin_item_project_id').val(treeNodeColumn.id||"");
														$('#cms_app_admin_item_project_name').val(treeNodeColumn.name||"");//here
														$('#cms_app_admin_item_title').val(treeNodeColumn.name||"");
													},CMSColumnTreeList)
													break;
											case i18n("CMS_ASSET_TOPIC"): 
													self.initColumn(i18n("CMS_ASSET_CHOOSE_SERVICE_PACKAGE"),function(treeNodeColumn){
														if(treeNodeColumn&&treeNodeColumn.metadata_public&&treeNodeColumn.metadata_public.style){
															self.treeColumnDataTemplateName=treeNodeColumn.metadata_public.style
														}
														$('#cms_app_admin_item_project_id').val(treeNodeColumn.id||"");
														$('#cms_app_admin_item_project_name').val(treeNodeColumn.name||"");
														$('#cms_app_admin_item_title').val(treeNodeColumn.name||"");
													},CMSTopicTreeList)
													break;
											default:
												break;
											}
										});
										var itemContentTypeSelect = self.getNormalSelector('cms_app_admin_item_content_type3', [{
											label: i18n("CMS_ASSET"),
											value: i18n("CMS_ASSET")
										},{
											label: i18n("CMS_ASSET_PACKAGE"),
											value: i18n("CMS_ASSET_PACKAGE")
										},{
											label: i18n("CMS_ASSET_BUY_PRODUCT_PACKAGE"),
											value: i18n("CMS_ASSET_BUY_PRODUCT_PACKAGE")
										},{
											label: i18n("CMS_ASSET_SERVICE_COLUMN"),
											value: i18n("CMS_ASSET_SERVICE_COLUMN")
										},{
											label: i18n("CMS_ASSET_TOPIC"),
											value: i18n("CMS_ASSET_TOPIC")
										},{
											label: i18n("CMS_ASSET_MY_HISTORY_VIEW"),
											value: i18n("CMS_ASSET_MY_HISTORY_VIEW")
										},{
											label: i18n("CMS_ASSET_NONE"),
											value: i18n("CMS_ASSET_NONE")
										}]);
										itemContentTypeSelect.create();
										itemContentTypeSelect.onChange = function(obj){
											$("#cms_app_admin_item_content_type").attr("data-index",obj.value);
											if((obj.value==i18n("CMS_ASSET_NONE"))||(obj.value==i18n("CMS_ASSET_MY_HISTORY_VIEW"))){
												$(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
													$(this).hide();
												})
											}
											else{
												$(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
													$(this).show();
												})
											}
										};
										var cardNode=pNode.getParentNode();
									  var pageNode=cardNode.getParentNode();
									}
									self.initCurrentItem(firstObj)
								break;
							default:
								break;
						};
						$("."+showTabClass+"").each(function(){
							$(this).show()
						})
						$("."+showTabClass+"").eq(0).addClass("cms_app_admin_tab_focus")
					//}
				}
			}
     };			
		var treeTableContainer=document.getElementById("cms_app_admin_page2_left_body");
		treeTableContainer.style.visibility="visible";
		var zTreeObj = $.fn.zTree.init($("#cms_app_admin_page2_left_tree_right"), setting, zNodes);
		self.zTreeObj = $.fn.zTree.getZTreeObj('cms_app_admin_page2_left_tree_right');
		var treeContainer=document.getElementById("cms_app_admin_page2_left_tree_container");
		var defaultL1DataTrLen=zNodes[0].children.length+1;//父节点也是一行
		if(zNodes[0].children.length==0){document.getElementById("cms_app_admin_dash").style.display="none"};
		this.drawLeftTable(defaultL1DataTrLen);
		treeContainer.style.height=treeTableContainer.clientHeight+"px";
		treeContainer.style.visibility="visible";//树显示
		},
		
		initCurrentItem:function(firstObj){
			var currentTreePointData=this.currentTreePointData;
			if(currentTreePointData.metadata){
			  var currentItem=currentTreePointData.metadata;
				var contentType=currentItem.content_type;
				var referTable=this.referTable;
				if(contentType){
					if(referTable[contentType]){
						$("#cms_app_admin_item_content_type3").find("input").val(referTable[contentType]);
						$(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
							$(this).show();
						})
					}
				}
				else{//如果初始没有content_type,就表示没有content_type,下拉菜单显示无。
					$("#cms_app_admin_item_content_type3").find("input").val(i18n("CMS_ASSET_NONE"));
					$(firstObj).find(".cms_app_admin_page_title_item_content_none").each(function(){
						$(this).hide();
					})
				}
				$("#cms_app_admin_item_project_id").val(currentItem.item_id||"");
				$("#cms_app_admin_item_project_name").val(currentItem.item_name||"");
				$("#cms_app_admin_item_title").val(currentItem.title||"");
				$("#cms_app_admin_item_upload_poster").val(currentItem.poster||"");
			};
		},
		
		bindUploadEventsPage:function(button1,inputContainer,folder){
			function deepCopy(o1, o2){
				// 取出第一个对象的每一个属性
				for(var key in o1){
					// 取出第一个对象当前属性对应的值
					var item = o1[key]; // dog
					// 判断当前的值是否是引用类型
					// 如果是引用类型, 就重新开辟一块存储空间
					if(item instanceof Object){
					   if(typeof item!="function"){
							var temp = new Object();
							/*{name: "wc",age: "3"}*/
						   deepCopy(item, temp);   //递归
							o2[key] = temp;
					    }
						else{
						   o2[key] = o1[key];
						}
					}else{
						// 基本数据类型
						o2[key] = o1[key];
					}
				}
			};
	        var self=this;
			var upload={};
			deepCopy(self.upload,upload);
			var storage_images_folder  =  folder+"/";
			upload.init({
				selectFileBottom: button1,
				uploadPath: storage_images_folder,
				checkExist_Boolean: true
			}, {
				_startfun: function (file_name, updateSize, fileSize, self) {
					//单个文件上传开始的回调函数
					var console_message = file_name + "start";
				},
				_progressfun: function (file_name, updateSize, fileSize, self) {
					//单个文件上传过程的回调函数
					var console_message = file_name + "progress updateSize: " + updateSize.toString() + "fileSize" + fileSize.toString();
				},
				_errorfun: function (e) {
					//单个文件上传失败的回调函数
				},
				_endfun: function (file_name, updateSize, fileSize, file_url, self) {
					//单个文件上传结束的回调函数
					var console_message = file_name + " end. The url = " + file_url;
				},
			}, {
				_beforeAllStartFun: function(files, next){
					//点击selectFileBottom，选择文件后，回调该函数
					this.startuploadFile()
					var i = 0;
					for(i = 0; i < files.files.length; i++){
						var name = files.files[i].name;
					};
					next();
				},
				_allStartFun: function(next){
					next();
				},
				_checkAllExistFun: function(existArray, next){
					//如果checkExist_Boolean为true，正式上传前发现有已存在的文件，则回调该函数
					var file_name = existArray.join(",");
					var console_message = file_name + "已存在";
					var ret = confirm(i18n('CMS_UPLOAD_HINT'))
					if (ret) {
						next()
					}
					else{
						self.countImgUploadNum();
					}
				},
				_afterAllEndFun: function(result){
					if(result.data){
						document.getElementById(inputContainer).value=decodeURI(result.data[0].file_url);
					}
				}
			});
			this.pageUploadArray.push(upload);
		},
		
		initServicePackages:function(){
			var self=this;
		  /*
			var dialog = new PopupDialog({
			url: 'content/CMS/choose_service_package.html',
			width: 516,
			height: 669,
			context: {},
			zIndex: 3000,
			id: 'cms_app_admin_choose_service_pack',
			callback: function(){
				self.drawServicePackage();
				$('#cms-app-admin-msg-close').on('click', function(){
					dialog.close();
				});
			}
		 });
		 dialog.open();
		 self.dialogProductPackage=dialog;
		 */
			self.initColumnExcludeNodes(i18n("CMS_ASSET_CHOOSE_SERVICE_PACKAGE"),function(treeNodeColumn){
				$('#cms_app_admin_item_project_id').val("");//mail:2019.8.21
				$('#cms_app_admin_item_project_name').val(self.treeNameColumn||"");//here drawColumn
				$('#cms_app_admin_item_title').val(self.treeNameColumn||"");
			},CMSProductPackageTreeList)
		},
		initColumn:function(title,callback,configItem){
			this.treeNodeColumn={};
		  var self=this;
			var dialog = new PopupDialog({
			url: 'content/CMS/choose_column.html',
			width: 516,
			height: 669,
			context: {},
			zIndex: 3000,
			id: 'cms_app_admin_choose_column',
			callback: function(){
			  self.drawColumn(title,callback,configItem);
				$('#cms_app_admin_column_title').text(title)
				$('#cms-app-admin-msg-close').on('click', function(){
					dialog.close();
				});
				$('#cms_app_admin_column_submit').on('click', function(){
				  var treeNodeColumn=self.treeNodeColumn;
				  callback(treeNodeColumn);
					dialog.close();
				});
				
			}
		 });
		 dialog.open();
		},
		
		initColumnExcludeNodes:function(title,callback,configItem){
			this.treeNodeColumn={};
		  var self=this;
			var dialog = new PopupDialog({
			url: 'content/CMS/choose_column.html',
			width: 516,
			height: 669,
			context: {},
			zIndex: 3000,
			id: 'cms_app_admin_choose_column',
			callback: function(){
			  self.drawColumnExcludeNodes(title,callback,configItem);
				$('#cms_app_admin_column_title').text(title)
				$('#cms-app-admin-msg-close').on('click', function(){
					dialog.close();
				});
				$('#cms_app_admin_column_submit').on('click', function(){
				  callback();
					if($('#cms_app_admin_column_choose_tree').find(".styled-selector-inputbox").val()!=""){
						self.fullPathArray=[];
						self.fullPathArray.push($('#cms_app_admin_column_choose_tree').find(".styled-selector-inputbox").val());
					}
					dialog.close();
				});
				
			}
		 });
		 dialog.open();
		},
		
		createColumnTree:function(treeData){
			var self=this;
			self.fullPathArray=[];
			treeData.open=true;
			var zNodes=[];
			zNodes.push(treeData);
			if(zNodes[0].children){
				for(var i= 0,len = zNodes[0].children.length;i<len;i++){
					var temp=zNodes[0].children[i];
					temp.children=[];
				}
			};
			var tempColumn=zNodes[0].children;
			/*
			zNodes[0].children=tempColumn.sort(function(a,b){
				return a.name>b.name
			});
			*/
			function getURL(treeId, treeNode){
				var url=aquapaas_host + '/aquapaas/rest/navigation/trees/';
				url=url+self.treeNameColumn;
				url=url+'/by_id:'+treeNode.id;
				url=url+'?children=1&app_key='+ paasAppKey;
				url=url+'&timestamp=' +new Date().toISOString();
				url=url+'&tree_version=00';
				return encodeURI(url)
			};
			var setting = {
					check:{
						enable: false,
						autoCheckTrigger:true,
						chkStyle:"checkbox"
					},
					async: {
						enable: true,
						url: getURL,
						//url: "http://192.168.7.143:8080/aquapaas/rest/navigation/trees/20190721-%E5%BA%94%E7%94%A83/by_id:5d3809a88ac460282238f8d8?children=1&app_key=aquaBO&timestamp=2019-07-24T12:06:32.378Z&_=1563967544891",
						type: 'GET',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						dataFilter: (treeId, parentNode, rsp)=>{
							var parentNodeChildren=rsp.children||[];
							if(parentNode.level>1){//卡片及卡片以下层展开
								//调整样式
								//console.log(parentNode.level);
								if(parentNode.level==2){//点击卡片，展开layout层
									if(parentNode.isLastNode){//页面最后一张卡片
										var tId=parentNode.tId;
										if(parentNodeChildren.length>0){
											$("#"+tId+"").closest("ul").append("<div class=\"cms_app_admin_last_card_layout_appear_when_last_card_expand\"></div>");
										};
										var bottomLayout=1;
										for(var i= 0,len = parentNodeChildren.length;i<len;i++){
											$("#"+tId+"").closest("ul").append("<div style=\"bottom:"+bottomLayout+"px\" class=\"cms_app_admin_page_white_block\"></div>");
											bottomLayout=bottomLayout+41;
										}
									}
								}
								else{//item 层
									var parentNodeParent=parentNode.getParentNode();
									if(parentNode.isLastNode){
										var currentId=parentNode.tId;
										var tId=parentNodeParent.tId;
										var bottom=42;
										var bottomLayout=1;
										if(rsp.children){
											for(var i= 0,len = rsp.children.length;i<len;i++){
												if(parentNodeParent.isLastNode){
													$("#"+tId+"").closest("ul").append("<div style=\"bottom:"+bottom+"px\" class=\"cms_app_admin_page_white_block\"></div>");
												};
												$("#"+currentId+"").closest("ul").append("<div style=\"bottom:"+bottomLayout+"px\" class=\"cms_app_admin_page_white_block\"></div>");
											bottom=bottom+41;
											bottomLayout=bottomLayout+41;
										}
									}
								 }
								}
							}
							var rsp_children=rsp.children;
							var rsp_childrenNew=[];
							var rsp_childrenFiltered=[];
							for(var i= 0,len = rsp_children.length;i<len;i++){
								var rsp_childrenUnit=rsp_children[i];
								if(rsp_childrenUnit.node_class&&rsp_childrenUnit.node_class!="folder"){
								}
								else{
									rsp_childrenUnit.children=[];
									rsp_childrenNew.push(rsp_childrenUnit);
								}
							};
							var temp=rsp_childrenNew;
							/*
							rsp_childrenNew=temp.sort(function(a,b){
								return a.name>b.name
							});
							*/
							self.expandedData=rsp_childrenNew;
							return rsp_childrenNew
						}
					},
					callback: {
						beforeCheck:function(treeId, treeNode){
						},
						onCheck: function(event, treeId, treeNode){  
						},
						beforeCollapse:function(treeId, treeNode){
							if(treeNode.level==2&&treeNode.isLastNode){//页面最后一张卡片
								var tId=treeNode.tId;
								$("#"+tId+"").closest("ul").find(".cms_app_admin_last_card_layout_appear_when_last_card_expand").each(function(){
									$(this).remove();
								});
								$("#"+tId+"").closest("ul").find(".cms_app_admin_page_white_block").each(function(){
									$(this).remove();
								})
							};
							if(treeNode.level==3&&treeNode.isLastNode){//页面最后一张卡片
								var tId=treeNode.getParentNode().tId;
								$("#"+tId+"").closest("ul").find(".cms_app_admin_page_white_block").each(function(){
									$(this).remove();
								})
							};
							//$("#cms_app_admin_dash_link").css("visibility","hidden");
						},
						onCollapse:function(event, treeId, treeNode){
							var childrenLen=treeNode.children.length;
							var tId=treeNode.tId;
							$("#"+tId+"").find("span").eq(0).removeClass("collapse_switch_img");
							$("#"+tId+"").find("span").eq(0).removeClass("expand_switch_img");
							$("#"+tId+"").find("span").eq(0).removeClass("collapse_switch_img_last");
							$("#"+tId+"").find("span").eq(0).removeClass("expand_switch_img_last");
							var parentTId=treeNode.parentTId;
							var indexInParentTId=$("#"+parentTId+"").find("ul").eq(0).children().index($("#"+tId+""));
							if(childrenLen==0){
							 var levelLen=$("#"+parentTId+"").find("ul").eq(0).children().length;
							 if(indexInParentTId<(levelLen-1)){
									$("#"+tId+"").find("span").eq(0).addClass("collapse_switch_img")
								}
								else{
									$("#"+tId+"").find("span").eq(0).addClass("collapse_switch_img_last")
								}
							};
							//console.log(childrenLen);
							self.adjustTreeTableTr(childrenLen,"collapse","cms_app_admin_page2_left_body2","cms_app_admin_page2_left_tree_left2");
							var containerHeight=document.getElementById("cms_app_admin_page2_left_body2").offsetHeight;
							var treeHeight=document.getElementById("cms_app_admin_page2_left_tree_right2").offsetHeight;
							//console.log(containerHeight);
							//console.log(treeHeight);
							var needCollapseNum=((containerHeight-treeHeight)/41);//表格高度加边框41
							//console.log(needCollapseNum);
							if(needCollapseNum>0){
								self.adjustTreeTableTr(needCollapseNum,"collapse","cms_app_admin_page2_left_body2","cms_app_admin_page2_left_tree_left2");
							}
						},
						beforeExpand:function(treeId, treeNode){
							 //console.log(1);
					  /*
						if(self.tId==treeNode.tId){
							jQuery("#"+self.tId+"").find(".bottom_open").addClass("cms_app_admin_blue_img1");
						 jQuery("#"+self.tId+"").find(".bottom_close").addClass("cms_app_admin_blue_img2");
						}
						*/
						//currentTreeId
						var allCardData=self.allCardData;
						if(treeNode.level==2){//卡片下面的层次  
							self.dataBelowCurrentCard=[];
							for(var i= 0,len = allCardData.length;i<len;i++){
							  if(treeNode.id==allCardData[i].id){
									self.dataBelowCurrentCard=allCardData[i]
								}
							}
						}
						//else{
							self.zTreeObjColumn.reAsyncChildNodes(treeNode, 'refresh',false,function(){
								var tId=treeNode.tId;
								var childrenLen=self.expandedData.length;
								self.adjustTreeTableTr(childrenLen,"expand","cms_app_admin_page2_left_body2","cms_app_admin_page2_left_tree_left2");
								$("#"+tId+"").find("span").eq(0).removeClass("collapse_switch_img");
								$("#"+tId+"").find("span").eq(0).removeClass("expand_switch_img");
								$("#"+tId+"").find("span").eq(0).removeClass("collapse_switch_img_last");
								$("#"+tId+"").find("span").eq(0).removeClass("expand_switch_img_last");
								if(childrenLen==0){
								  //console.log($("#"+tId+"").find("span").eq(0));
									$("#"+tId+"").find("span").eq(0).addClass("expand_switch_img");
								};
								var parentTId=treeNode.parentTId;
								var indexInParentTId=$("#"+parentTId+"").find("ul").eq(0).find("li").index($("#"+tId+""));
								if(childrenLen==0){
								 var levelLen=$("#"+parentTId+"").find("ul").eq(0).find("li").length;
								 if(indexInParentTId<(levelLen-1)){
										$("#"+tId+"").find("span").eq(0).addClass("expand_switch_img")
									}
									else{
										$("#"+tId+"").find("span").eq(0).addClass("expand_switch_img_last")
									}
								};
								
							})
						},
						onExpand:function(event, treeId, treeNode){ 
						},
						onClick: function(event, treeId, treeNode){
							var treeNodeColumn=self.treeNodeColumn;
							$("#"+treeNodeColumn.tId+"").find("cms_column_tree_choosed_node").remove();
							$("#"+treeNode.tId+"").append("<img id=\"cms_column_tree_choosed_node\" style=\"position:absolute;right:16px;top:11px\" src = \"content/CMS/images/choosed.png\"/>");
							$("#"+treeNodeColumn.tId+"").find("a").eq(0).css("background-color","");
							$("#"+treeNodeColumn.tId+"").find("a").eq(0).find("span").css("color","#797979");
							$("#"+treeNode.tId+"").find("a").eq(0).css("background-color","#80daf1");
							$("#"+treeNode.tId+"").find("a").eq(0).find("span").css("color","#ffffff");
							$("#"+treeNode.tId+"").addClass("cms_app_admin_choosed");
							self.treeNodeColumn=treeNode;
							var level=treeNode.level;
							var fullPathArray=[];
							fullPathArray.push(treeNode.name);
							var currentNode=treeNode;
							for(var i= 0,len = level;i<len;i++){
								currentNode=currentNode.getParentNode();
								fullPathArray.push(currentNode.name);
							};
							self.fullPathArray=fullPathArray.reverse();						
						}
					}
				};  
				var treeTableContainer=document.getElementById("cms_app_admin_page2_left_body2");
				treeTableContainer.style.visibility="visible";
				$("#cms_app_admin_page2_left_tree_right2").empty();
				var zTreeObj = $.fn.zTree.init($("#cms_app_admin_page2_left_tree_right2"), setting, zNodes);
				self.zTreeObjColumn=zTreeObj;
				var treeContainer=document.getElementById("cms_app_admin_page2_left_tree_container2");
				var defaultL1DataTrLen=zNodes[0].children.length+1;//父节点也是一行
				if(zNodes[0].children.length==0){document.getElementById("cms_app_admin_dash2").style.display="none"};
				this.drawLeftTable2(defaultL1DataTrLen);
				//console.log(treeTableContainer.clientHeight);
				treeContainer.style.height=treeTableContainer.clientHeight+"px";
				treeContainer.style.visibility="visible";//树显示
		},
		
		drawColumn:function(title,callback,configItem){
			try{
				var self=this;
				var cmsColumnTree=configItem;
				if(typeof cmsColumnTree!="undefined"){
					var columnTreeListSelect=[];
					for(var i= 0,len = cmsColumnTree.length;i<len;i++){
						var columnTreeListUnit=cmsColumnTree[i];
						columnTreeListSelect.push({
							label: columnTreeListUnit.tree_name,
							value: columnTreeListUnit.tree_id
						})
					};
					var columnSelect = self.getNormalSelector('cms_app_admin_column_choose_tree', columnTreeListSelect);
					columnSelect.create();
					columnSelect.onChange = function(obj){
						var currentName=obj.getLabel();
						var currentValue=obj.value;
						self.treeNameColumn=currentName;
						self.getSingleTree(encodeURIComponent(currentName),encodeURIComponent(currentValue),function(data){
							var defaultTreeData=data;
							self.createColumnTree(defaultTreeData)
						},"children=1");
					};
					var name=cmsColumnTree[0].tree_name;
					self.treeNameColumn=name;
					var id=cmsColumnTree[0].tree_id;
					this.getSingleTree(encodeURIComponent(name),encodeURIComponent(id),function(data){
						var defaultTreeData=data;
						self.createColumnTree(defaultTreeData)
					},"children=1");
				};
			}catch(e){
			}
		},
		
		drawColumnExcludeNodes:function(title,callback,configItem){
			try{
				var self=this;
				var cmsColumnTree=configItem;
				if(typeof cmsColumnTree!="undefined"){
					var columnTreeListSelect=[];
					for(var i= 0,len = cmsColumnTree.length;i<len;i++){
						var columnTreeListUnit=cmsColumnTree[i];
						columnTreeListSelect.push({
							label: columnTreeListUnit.tree_name,
							value: columnTreeListUnit.tree_id
						})
					};
					var columnSelect = self.getNormalSelector('cms_app_admin_column_choose_tree', columnTreeListSelect);
					columnSelect.create();
					columnSelect.onChange = function(obj){
						var currentName=obj.getLabel();
						var currentValue=obj.value;
						self.treeNameColumn=currentName;
					};
					var name=cmsColumnTree[0].tree_name;
					self.treeNameColumn=name;
					//var id=cmsColumnTree[0].tree_id;
				};
			}catch(e){
			}
		},
		
		drawServicePackage:function(){
			var self=this;
			var url = aquapaas_host + "/aquapaas/rest/product/products";
			url = url + "?enable=all"
      url += '&app_key=' + paasAppKey;
      url += '&timestamp=' + new Date().toISOString();
			var method="GET";
			$.ajax({
				type: method,
				url: url,
				async: true,
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
				}
			}).always((resp, status, xhr) => {
				self.choosedIndex="notChoose";
				if (status == 'success') {
					for(var i= 0,len = resp.length;i<len;i++){
						var title=resp[i].title||"";
						var ext_id=(resp[i].metadata&&resp[i].metadata.ext_id)?resp[i].metadata.ext_id:"";
						if(i==0){
							$('#cms_app_admin_service_package_container').append("<div data-value=\""+ext_id+"\" class=\"cms_app_admin_table_tr cms_app_admin_table_tr_hover\">"+title+"</tr>")
						}
						else{
							$('#cms_app_admin_service_package_container').append("<div data-value=\""+ext_id+"\" class=\"cms_app_admin_table_tr\">"+title+"</tr>")
						}
					};
					$('#cms_app_admin_service_package_container').parent().find(".lecture_recommend_dialog_submit").on('click', function (){
						var currentElement=$('#cms_app_admin_service_package_container').find(".cms_app_admin_table_tr_hover");
						var title=$(currentElement).text();
						var projectid=$(currentElement).attr("data-value");
						var currentTabContainer=$(".cms_app_admin_display_container_after_click_tab").eq(self.tabInex);
						$(currentTabContainer).find("#cms_app_admin_item_project_id").val(projectid);
						$(currentTabContainer).find("#cms_app_admin_item_project_name").val(title);
						self.dialogProductPackage.close()
					})
				};
				/*
				$("#cms_app_admin_service_package_container").children().mouseover(function(){
					if($(this).index()!=0){
						$(this).removeClass("cms_app_admin_table_tr").addClass("cms_app_admin_table_tr_hover");
					}
				});
				$("#cms_app_admin_service_package_container").children().mouseout(function(){
					if(($(this).index()!=0)&&(self.choosedIndex!=$(this).index())){
						$(this).removeClass("cms_app_admin_table_tr_hover").addClass("cms_app_admin_table_tr");
					}
				});
				*/
				$("#cms_app_admin_service_package_container").children().on('click', function (){
					self.choosedIndex=$(this).index();
					$("#cms_app_admin_service_package_container").children().each(function(){
						$(this).removeClass("cms_app_admin_table_tr_hover").addClass("cms_app_admin_table_tr")
					});
					if($(this).index()!=0){
						$(this).removeClass("cms_app_admin_table_tr").addClass("cms_app_admin_table_tr_hover");
					}
				});
			})
		},
		
		refreshProgramsTable:function(dialogTitle,titles,sendRequestUrl,sendBody,node_class){
			var self=this;
			var rows=12;
			self.page_program_list = new StyledList({
				async: true,
				rows: rows,
				columns: 7,
				containerId: 'cms_view_result_table',
				listType: 1,
				titles: titles,
				styles: {
					borderColor: 'rgb(226,226,226)',
					borderWidth: 1,
					titleHeight: 31,
					titleBg: 'rgb(69,209,244)',
					titleColor: 'white',
					cellBg: 'white',
					evenBg: 'rgb(245,253,255)',
					cellColor: 'rgb(121,121,121)',
					cellHeight: 34,
					footBg: 'white',
					footColor: 'rgb(121,121,121)',
					iconColor: 'rgb(0,153,203)',
					inputBorder: '1px solid rgb(203,203,203)',
					inputBg: 'white',
					columnsWidth: [0.053,0.087,0.12,0.283,0.188,0.172,0.078]
				},
				data: []
			});
			self.page_program_list.getPageData = function(pageNumber, gotData){
				var start = (pageNumber - 1) * rows;
				var end = pageNumber * rows - 1;
				var url = sendRequestUrl+"?";
				url += 'start=' + start;
				url += '&end=' + end;
				url += '&visible=all';
				url += '&app_key=' + paasAppKey + '&timestamp=' + new Date().toISOString();      
				var method = 'POST';
				$.ajax({
					type: method,
					url: url,
					async: true,
					data: JSON.stringify(sendBody),
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).always((resp, status, xhr) => {
					if (status == 'success') {
						if(resp){
							self.page_program_list.onTotalCount(xhr.getResponseHeader('x-aqua-total-count'));
							self.AssetBundleData=resp;
							var formListData=self.formListDataAssetBundle(resp);
							self.pageAssetOriginalData=formListData.originalData;
							gotData(formListData.processedData)
						}
					}
					else{
						self.page_program_list.onTotalCount(0);
						self.originalData = [];
						gotData([]);
					}
				})
			};
			self.page_program_list.create();
		},
		
		initPrograms:function(dialogTitle,titles,sendRequestUrl,sendBody,node_class,callback){
		  var typeTiltle=(node_class=="asset"?i18n("CMS_ASSET"):i18n("CMS_ASSET_PACKAGE"));
		  var self=this;
		  this.AssetBundleData=[];//存储当前页面节目和节目包数据
			self.storedAssetOrBundleData={"asset":{
				"item_id":"",
				"item_name":"",
				"posterUrl":""
			},"bundle":{
				"item_id":"",
				"item_name":"",
				"posterUrl":""
			}};
			//self.pageAssetOriginalData=[];
			$("#cms_asset_admin_choose_program_submit").unbind().bind('click', function () {
			    //判断节目或节目包有没有上架
				var currentChoosedData={};
				var choosedItemLegal=true;
				$(".cms_app_admin_radio_box_inner").each(function(index){
					if($(this).css("display")=="block"){
						currentChoosedData=self.AssetBundleData[index];
						if(!currentChoosedData.visible||(currentChoosedData.visible=="false")){
							//choosedItemLegal=false;
							var text=typeTiltle+i18n("CMS_COMFIRM4");
							self.showOverlayMsgDialog(text, function() {
								callback()
							},function(){
								//$("#user-admin-msg-cancel").hide();
								$("#cms_user-admin-msg-content").css("margin-top","10px");
							});
							return;
						}
						else if((typeof currentChoosedData.serial_missing!="undefined")&&(currentChoosedData.serial_missing==true)){
							if(node_class=="bundle"){//根据需求，只有产品包会存在缺集情况
								//choosedItemLegal=false;
								var text=typeTiltle+i18n("CMS_SHORTAGE");
								self.showOverlayMsgDialog(text, function() {
									callback()
								},function(){
									//$("#user-admin-msg-cancel").hide();
									$("#cms_user-admin-msg-content").css("margin-top","10px");
								});
								return;
							}
						}
						else if((typeof currentChoosedData.quality_missing!="undefined")&&(currentChoosedData.quality_missing==true)){
							//choosedItemLegal=false;
							var text=typeTiltle+i18n("CMS_CODE_RATE_SHORTAGE");
							self.showOverlayMsgDialog(text, function() {
								callback()
							},function(){
								//$("#user-admin-msg-cancel").hide();
								$("#cms_user-admin-msg-content").css("margin-top","10px");
							});
							return;
						}
						else{
							callback()
						}
					}
				});
				/*
				if(choosedItemLegal){
					callback();
				}
				*/
			})
				$("#cms_view_result_table").on("click",".cms_app_admin_radio_box_outer",function(){
					 var clickIndex=$(".cms_app_admin_radio_box_outer").index($(this));
					 $(".cms_app_admin_radio_box_inner").each(function(allIndex){
				  if(clickIndex!=allIndex){
						$(this).hide()
					 }
				 });
				 if($(this).children().css("display")=="none"){
					$(this).children().show();
					var dataIndex=$(this).attr("data-index");
					var pageAssetOriginalData=self.pageAssetOriginalData[dataIndex];
					self.storedAssetOrBundleData[node_class]={};
					self.storedAssetOrBundleData[node_class]["item_id"]=(pageAssetOriginalData.provider_id||"")+"_"+(pageAssetOriginalData.provider_asset_id||"");
					self.storedAssetOrBundleData[node_class]["item_name"]=pageAssetOriginalData["title"];
					
					var posterKey=(node_class=="asset"?"posterboard":"packageposterboard")
					self.storedAssetOrBundleData[node_class]["posterUrl"]=pageAssetOriginalData[posterKey]||"";
					if(self.storedAssetOrBundleData[node_class]["item_id"]=="_"){
						self.storedAssetOrBundleData[node_class]["item_id"]=""
					};
						if(self.storedAssetOrBundleData[node_class]["item_name"]=="_"){
						self.storedAssetOrBundleData[node_class]["item_name"]=""
					};
					self.pid=pageAssetOriginalData.provider_id;
			    self.paid=pageAssetOriginalData.provider_asset_id;
				 }
				 else{
					$(this).children().hide();
					//self.creatAssetBelowPageData=[];
				 }
			});
		  $('#cms_app_admin_program_title').text(dialogTitle);
			self.refreshProgramsTable(dialogTitle,titles,sendRequestUrl,sendBody,node_class);
			
			$("#cms_asset_admin_choose_program_search").unbind().bind('click', function () {
			  if($("#cms_asset_admin_choose_program_input").val()==""){
					self.refreshProgramsTable(dialogTitle,titles,sendRequestUrl,sendBody,node_class);
				}
				else{
				  var sendBodyNew=[];
					sendBodyNew[0]=sendBody[0]+"&title="+$("#cms_asset_admin_choose_program_input").val()+"&title_op=lk";
					self.refreshProgramsTable(dialogTitle,titles,sendRequestUrl,sendBodyNew,node_class);
				}
			});
			$('#cms_asset_admin_choose_program_input').on('keyup', function(e) {
				var key = e.keyCode||e.which;
				if (key == 13) {
					if($("#cms_asset_admin_choose_program_input").val()==""){
						self.refreshProgramsTable(dialogTitle,titles,sendRequestUrl,sendBody,node_class);
					}
					else{
						var sendBodyNew=[];
					  sendBodyNew[0]=sendBody[0]+"&title="+$("#cms_asset_admin_choose_program_input").val()+"&title_op=lk";
						self.refreshProgramsTable(dialogTitle,titles,sendRequestUrl,sendBodyNew,node_class,"title="+$("#cms_asset_admin_choose_program_input").val()+"&title_op=lk");
					}
				}
			})
		},
		formListDataAssetBundle: function(navigations){
		  var returnObj={
				originalData:[],
				processedData:[]
			}
			var rowData = [];
			try{
				var self=this;
				var navigationsNew=[];
				for(var i= 0,len = navigations.length;i<len;i++){
					var navigationUnitNew=navigations[i];
					navigationsNew.push(navigationUnitNew)
				};
				var formData = navigationsNew.map(function(navigationUnit, i){
						var provider_id=navigationUnit.provider_id;
						var provider_asset_id=navigationUnit.provider_asset_id;
						var title=navigationUnit.title;
						var licensing_window_start=navigationUnit.licensing_window_start;
						var visible=navigationUnit.visible;
						var category=navigationUnit.category;
						
						var ops = "<span><div data-index=\""+i+"\" class=\"cms_app_admin_radio_box_outer\"><div class=\"cms_app_admin_radio_box_inner\"></div></div></span>";
						var rowData = [];
						rowData.push({
							label: ops
						})
						rowData.push({
							label: provider_id
						})
						rowData.push({
							label: provider_asset_id
						});
						rowData.push({
							label: title
						})
						rowData.push({
							label: convertTimeString(licensing_window_start)
						});
						rowData.push({
							label: Array.isArray(category) ? category.join(',') : category
						})
						rowData.push({
							label: i18n('ASSET_SHELF_TABLE_STATUS_' + String(visible).toUpperCase())
						})
						return rowData;
				});
			}catch(e){
			};
		 returnObj.originalData=navigationsNew;
		 returnObj.processedData=formData;
     return returnObj;
   },
	 
		formListData: function(navigations){
		  var returnObj={
				originalData:[],
				processedData:[]
			}
			var rowData = [];
			try{
				var self=this;
				var navigationsNew=[];
				for(var i= 0,len = navigations.length;i<len;i++){
					var navigationUnitNew=navigations[i];
					navigationsNew.push(navigationUnitNew)
				};
				var formData = navigationsNew.map(function(navigationUnit, i){
						var ops = '<div class="oprs-all" data-index="' + i + '">';
						ops += '<div class="opr-default opr-default-admin-entry" data-opr="edit" style="margin:0 20px">'+i18n("CMS_ADMIN")+'</div>';
						ops += '<div class="opr-default cms_app_delete_app" data-opr="audit" style="margin:0 20px">'+i18n("CMS_DELETE")+'</div>';
						ops += '</div>';
						var appName="";
						var desc="";
						if(typeof navigationUnit["metadata"]!="undefined"){
						  var metadata=navigationUnit["metadata"];
							if(typeof metadata["appName"]!="undefined"){
								appName=metadata["appName"]
							};
							if(typeof metadata["描述"]!="undefined"){
								desc=metadata["描述"]
							};
						};
						var rowData = [
						{
							label: self.getTitledSpan(parseStr(appName))
						}, {
							label: self.getTitledSpan(parseStr(desc))
						}, {
							label: ops
						}
						];
						return rowData;
				});
			}catch(e){
			};
		 returnObj.originalData=navigationsNew;
		 returnObj.processedData=formData;
     return returnObj;
   },
		chooseProgramsOrProgramsPkg:function(callback){
			var dialog = new PopupDialog({
			url: 'content/CMS/choose_program.html',
			width: 954,
			height: 660,
			context: {},
			zIndex: 3000,
			id: 'cms_app_admin_choose_program',
			callback: function(){
				callback();
				$('#cms-app-admin-msg-close').on('click', function(){
					dialog.close();
				});
			}
		 });
		 dialog.open();
		 this.chooseProgramsOrPkgDialog=dialog
		},
		drawSecondPageTreeContainer:function(){
		  var self=this;
			var currentData=this.originalData[this.rowIndex];
			var name=currentData["name"];
			var id=currentData["id"];
		  this.getSingleTree(name,id,function(data){
			  self.currentAppLevelTreeData=data;//存储app tree的数据
				self.currentTreePointData=data;
			});
			this.getSingleTree(name,id,function(data){
			  self.drawAppAttr(data);//打开第二页时，先填入应用属性。
				self.drawAppTree(data);
			},"children=1")
		},
		adjustTreeTableTr:function(childrenLength,type,id1,id2){
			var childrenLen=childrenLength;
			var container=document.getElementById(id1);
		  var tableLen=container.children.length;
			var everyRowHeight=40;
			if(type=="expand"){
				for(var i= 0,len = childrenLen;i<len;i++){
					var div = document.createElement("div");
					div.setAttribute("style","border-bottom:1px #e2e2e2 solid;width:100%;height:"+everyRowHeight+"px");
					container.appendChild(div);
				};
				var height=document.getElementById(id2).clientHeight;
				document.getElementById(id2).style.height=(height+(everyRowHeight+1)*childrenLen+"px")
			}
			else{
				for(var i= 0,len = childrenLen;i<len;i++){
					$("#"+id1+"").children().eq((tableLen-1-i)).remove()
				};
				var height=document.getElementById(id2).clientHeight;
				document.getElementById(id2).style.height=(height-(everyRowHeight+1)*childrenLen+"px")
			}
		},
		drawSecondPageRightTitle:function(){
		  var self=this;
			if(window.screen.width<1300){
				$(".cms_app_admin_tab").each(function(index){
					if(index!=0&&index<5){
						$(this).css("width","88px");
					}
				});
				$(".cms_app_admin_tab_interval").each(function(index){
					if(index<3){
						$(this).css("width","3px");
					}
				});
				var inputWidth=(document.getElementById("cms_app_admin_page2_body").clientWidth-56-30)/2;
				$(".cms_app_admin_resize_input").each(function(){
					$(this).css("width",inputWidth+"px")
				})
			}
			else{
				if(window.screen.width<1440){
					$(".cms_app_admin_tab").each(function(index){
						if(index!=0&&index<5){
							if(index==1||index==2){
								$(this).css({
									 "width": "100px"
								})
							}
						 else{
								$(this).css({
									"width": "102px"
								})
						 }
						}
				 })
			 }
			};
			var totalWidth=0;
			var titleChildren=document.getElementById("cms_app_admin_page2_right_title").children;
      for(var i= 0,len =9;i<len;i++){//一级树有5个tab
				totalWidth=totalWidth+titleChildren[i].offsetWidth
			};
			titleChildren[9].style.width="calc(100% - "+totalWidth+"px)";
			document.getElementById("cms_app_admin_page2_right_title").style.visibility="visible";
			document.getElementById("cms_app_admin_page2_body").style.visibility="visible";
		  $("#cms_app_admin_page2_body").find(".cms_app_admin_display_container_after_click_tab").mCustomScrollbar({
				theme:"my-theme"
			});
			$(".cms_app_admin_tab").each(function(index){
			  var index=index;
				$(this).unbind().bind('click', function () {//切换tab
					self.tabInex=index;
					$("#cms_app_admin_page2_body").children().each(function(){
						$(this).hide()
					});
					$("#cms_app_admin_page2_body").children().eq(index).show();
					switch(index)
					{
						case 1:
							self.initPageListBelowApp(index);
							break;
						case 2:
							self.initVersionInfo(index);
							break;
						case 3:
							self.initAuditPublishHistory(index);
							break;
						case 4:
							self.initHistoryVersionManagement(index);
							break;
						case 6:
							self.initCardListBelowPage(index);
							break;
						case 8:
							self.initLayoutList(index);
							break;
						case 11:
							self.initLayoutAppearance();
						default:
							break;
					};
					$(".cms_app_admin_tab").each(function(){$(this).removeClass("cms_app_admin_tab_focus")})
						$(this).addClass("cms_app_admin_tab_focus")
					});
			})
		},
		initVersionInfo:function(){
			var currentAppLevelTreeData=this.currentAppLevelTreeData;
			if(currentAppLevelTreeData.metadata_public){
				var metadataPublic=currentAppLevelTreeData.metadata_public;
				$("#cms_version_info_version_id").val(metadataPublic.release_tree_version||"");
				$("#cms_version_info_version_name").val(metadataPublic.release_tree_version_desc||"");
				$("#cms_version_info_publish_name").val(metadataPublic.release_time?convertTimeString(metadataPublic.release_time):"");
				$("#cms_version_info_version_id2").val(metadataPublic.audit_tree_version||"");
				$("#cms_version_info_version_name2").val(metadataPublic.audit_tree_version_desc||"");
				$("#cms_version_info_last_audit_time").val(metadataPublic.audit_tree_audit_time?convertTimeString(metadataPublic.audit_tree_audit_time):"");
				if(metadataPublic.audit_tree_audit_status){
					$("#cms_version_info_audit_result").val(i18n('NAVIGATIONAUDIT_' + metadataPublic.audit_tree_audit_status.toUpperCase()));
				}
			}
		},
		initPageListBelowAppTableAfterSort:function(dataChildren){
      $("#cms_app_admin_page_list_container").find("tbody").empty();
			var tableContainerHeight=document.getElementById("cms_app_admin_page2_body").clientHeight-15-70;
			var trH=42+1;
			var columnNum=3;
			var trNum=Math.floor(tableContainerHeight/trH);
			var dataChildren=dataChildren;
		  if(typeof dataChildren!="undefined"){
				var tableList=[];
				for(var i= 0,len = dataChildren.length;i<len;i++){
					var arrayUnit=[];
					var pageTitle=dataChildren[i].name||"";
					var childrenTreeId=dataChildren[i].id||"";
					arrayUnit.push(i);
					arrayUnit.push(pageTitle);
					arrayUnit.push("<div data-id=\""+childrenTreeId+"\" data-display-value=\""+pageTitle+"\" data-value=\""+dataChildren[i].name+"\" class=\"oprs-all\"><div class=\"opr-default cms_app_adjust_order\">"+i18n("CMS_ORDER")+"</div><div class=\"opr-default cms_app_delete_page\" >"+i18n("CMS_DELETE")+"</div></div>");
					tableList.push(arrayUnit)
				};
				for(var i= 0,len = tableList.length;i<len;i++){
					var tdHTMl="";
					for(var j= 0,lenB = tableList[i].length;j<lenB;j++){
						tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\">"+tableList[i][j]+"</td>")
					};
					$("#cms_app_admin_page_list_container").find("tbody").append("<tr>"+tdHTMl+"</tr>");
				};
				var diverse=0;
				if(tableList.length<trNum){
					diverse=trNum-tableList.length;
					for(var i= 0,len = diverse;i<len;i++){
						var tdHTMl="";
						for(var j= 0,lenB = columnNum;j<lenB;j++){
							tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\"></td>")
						};
						$("#cms_app_admin_page_list_container").find("tbody").append("<tr>"+tdHTMl+"</tr>");
					}
				}
			}
		},
		initCardListBelowPageAfterSort:function(dataChildren){
		  $("#cms_app_admin_card_list_container").find("tbody").empty();
		  var tableContainerHeight=document.getElementById("cms_app_admin_page2_body").clientHeight-15-70;
			var trH=42+1;
			var columnNum=4;
			var trNum=Math.floor(tableContainerHeight/trH);
			var dataChildren=dataChildren;
			if(typeof dataChildren!="undefined"){
				var tableList=[];
				
				for(var i= 0,len = dataChildren.length;i<len;i++){
					var arrayUnit=[];
					var cardId="";
					if(dataChildren[i].metadata&&dataChildren[i].metadata.id){
						cardId=dataChildren[i].metadata.id
					}
					else{
						cardId=dataChildren[i].ext_id||"";
					};
					var pageTitle=dataChildren[i].name||"";
					var childrenTreeId=dataChildren[i].id||"";
					arrayUnit.push(i);
					arrayUnit.push(cardId?cardId:"");
					arrayUnit.push(pageTitle);
					arrayUnit.push("<div data-id=\""+childrenTreeId+"\" data-display-value=\""+pageTitle+"\" data-value=\""+dataChildren[i].name+"\" class=\"oprs-all\"><div class=\"opr-default cms_app_adjust_order\">"+i18n("CMS_ORDER")+"</div><div class=\"opr-default cms_app_delete_page\" >"+i18n("CMS_DELETE")+"</div></div>");
					tableList.push(arrayUnit)
				};
				
				for(var i= 0,len = tableList.length;i<len;i++){
					var tdHTMl="";
					for(var j= 0,lenB = tableList[i].length;j<lenB;j++){
						tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\">"+tableList[i][j]+"</td>")
					};
					$("#cms_app_admin_card_list_container").find("tbody").append("<tr>"+tdHTMl+"</tr>");
				};
				var diverse=0;
				if(tableList.length<trNum){
					diverse=trNum-tableList.length;
					for(var i= 0,len = diverse;i<len;i++){
						var tdHTMl="";
						for(var j= 0,lenB = columnNum;j<lenB;j++){
							tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\"></td>")
						};
						$("#cms_app_admin_card_list_container").find("tbody").append("<tr>"+tdHTMl+"</tr>");
					}
				}
			}
		},
		initPageListBelowApp:function(index){
		  var self=this;
			$("#cms_app_admin_page2_body").children().eq(index).find("tbody").empty();
			var tableContainerHeight=document.getElementById("cms_app_admin_page2_body").clientHeight-15-70;
			var trH=42+1;
			var columnNum=3;
			var trNum=Math.floor(tableContainerHeight/trH);
			if(this.currentAppLevelTreeData){
				var currentAppLevelTreeData=this.currentAppLevelTreeData;
				var name=currentAppLevelTreeData["name"];
				var id=currentAppLevelTreeData["id"];
				this.getSingleTree(name,id,function(data){
					if(data.children){
						var tableList=[];
						var dataChildren=[];
						var dataChildrenOld=data.children;
						/*
						dataChildren=dataChildrenOld.sort(function(a,b){
							return a.name>b.name
						});
						*/
						dataChildren=dataChildrenOld;
						for(var i= 0,len = dataChildren.length;i<len;i++){
							var arrayUnit=[];
							var pageTitle=dataChildren[i].name;
							var childrenTreeId=dataChildren[i].id;
							arrayUnit.push(i);
							arrayUnit.push(pageTitle);
							arrayUnit.push("<div data-id=\""+childrenTreeId+"\" data-display-value=\""+pageTitle+"\" data-value=\""+dataChildren[i].name+"\" class=\"oprs-all\"><div class=\"opr-default cms_app_adjust_order\">"+i18n("CMS_ORDER")+"</div><div class=\"opr-default cms_app_delete_page\" >"+i18n("CMS_DELETE")+"</div></div>");
							tableList.push(arrayUnit)
						}
					};
					for(var i= 0,len = tableList.length;i<len;i++){
						var tdHTMl="";
						for(var j= 0,lenB = tableList[i].length;j<lenB;j++){
							tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\">"+tableList[i][j]+"</td>")
						};
						$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
					};
					var diverse=0;
					if(tableList.length<trNum){
						diverse=trNum-tableList.length;
						for(var i= 0,len = diverse;i<len;i++){
							var tdHTMl="";
							for(var j= 0,lenB = columnNum;j<lenB;j++){
								tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\"></td>")
							};
							$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
						}
					};
					$("#cms_app_admin_page2_body").children().eq(index).find("tbody").on('click', '.cms_app_adjust_order', function(){
						var name=self.currentAppLevelTreeData["name"];
						var id=$(this).parent().attr("data-id");
						var dataValue=$(this).parent().attr("data-value");
						self.openAdjustOrderDialog(function(){
							 self.getSingleTree(name,id,function(data){
								var sendData=data;
								if(!sendData.metadata){
									sendData.metadata={};
								};
								var newIndex=document.getElementById("cms_adjust_order_input").value;
								var sendData={};
								sendData.index=parseInt(newIndex);//here
								//var pathPara=encodeURIComponent(name)+"/"+encodeURIComponent(dataValue);
								var pathPara=encodeURIComponent(self.currentAppLevelTreeData["name"])+"/by_id:"+id;
								self.editPageAttrCommon(pathPara,sendData,function(){
									var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
									var node = treeObj.getNodesByFilter(function (node) { return node.level == 0 }, true); 
									treeObj.reAsyncChildNodes(node,'refresh',false,function(){
										var containerHeight=document.getElementById("cms_app_admin_page2_left_body").offsetHeight;
										var treeHeight=document.getElementById("cms_app_admin_page2_left_tree_right_1").offsetHeight;
										var needCollapseNum=((containerHeight-treeHeight)/41);//表格高度加边框41
										if(needCollapseNum>0){
											self.adjustTreeTableTr(needCollapseNum,"collapse","cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
										}
									  if(node&&node.children){
											self.initPageListBelowAppTableAfterSort(node.children);
										}
									})
								},"updatefield=index")
							})
					})
					})
					$("#cms_app_admin_page2_body").children().eq(index).find("tbody").on('click', '.cms_app_delete_page', function(){
						var text=i18n("CMS_DELETE_CONFIRM");
						text=text+"\"";
						text=text+$(this).parent().attr("data-display-value");
						text=text+"\"";
						text=text+" ？";
						var dataValue=encodeURIComponent(self.currentAppLevelTreeData["name"])+"/"+encodeURIComponent($(this).parent().attr("data-value"));
						
						self.showMsgDialog(text, function() {
								self.deleteTree(dataValue,function(){
						  	var currentData=self.currentAppLevelTreeData;
								var name=currentData["name"];
								var id=currentData["id"];
								var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
								var node = treeObj.getNodesByFilter(function (node) { return node.level == 0 }, true); 
								treeObj.reAsyncChildNodes(node, 'refresh',false,function(){
									//新增页面成功，表格增加一行。
									document.getElementById("cms_app_admin_dash").style.display="block";
									self.adjustTreeTableTr(1,"collapse","cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
									self.adjustTrLenForTreeTable("cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_right_1","cms_app_admin_page2_left_tree_left");
									self.initPageListBelowApp(self.tabInex);
								});
						})
						})
					})
					$("#cms_app_admin_page_new_add_page").unbind().bind('click', function () {
						self.openAddNewPageDialog()
					 })
				},"children=1&enable=true")
			}
		},
		initCardListBelowPage:function(index){
		  var self=this;
			$("#cms_app_admin_page2_body").children().eq(index).find("tbody").empty();
			var tableContainerHeight=document.getElementById("cms_app_admin_page2_body").clientHeight-15-70;
			var trH=42+1;
			var columnNum=4;
			var trNum=Math.floor(tableContainerHeight/trH);
			if(this.currentTreePointData){
				var currentTreePointData=this.currentTreePointData;
				var currentAppLevelTreeData=this.currentAppLevelTreeData;
				var appLevelTreeName=currentAppLevelTreeData["name"];
				var id=currentTreePointData["id"];
				this.getSingleTree(appLevelTreeName,id,function(data){
					if(data.children){
					    var dataChildren=data.children;
						var tableList=[];
						for(var i= 0,len = data.children.length;i<len;i++){
							var arrayUnit=[];
							var cardId="";
							if(dataChildren[i].metadata&&dataChildren[i].metadata.id){
								cardId=dataChildren[i].metadata.id
							}
							else{
								cardId=data.children[i].ext_id||"";
							};
							var pageTitle=data.children[i].name||"";
							if(data.children[i].metadata.name){
								pageTitle=data.children[i].metadata.name
							};
							var childrenTreeId=data.children[i].id;
							arrayUnit.push(i);
							arrayUnit.push(cardId?cardId:"");
							arrayUnit.push(pageTitle?pageTitle:"");
							arrayUnit.push("<div data-id=\""+childrenTreeId+"\" data-display-value=\""+pageTitle+"\" data-value=\""+data.children[i].name+"\" class=\"oprs-all\"><div class=\"opr-default cms_app_adjust_order\">"+i18n("CMS_ORDER")+"</div><div class=\"opr-default cms_app_delete_page\" >"+i18n("CMS_DELETE")+"</div></div>");
							tableList.push(arrayUnit)
						}
					};
					for(var i= 0,len = tableList.length;i<len;i++){
						var tdHTMl="";
						for(var j= 0,lenB = tableList[i].length;j<lenB;j++){
							tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\">"+tableList[i][j]+"</td>")
						};
						$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
					};
					var diverse=0;
					if(tableList.length<trNum){
						diverse=trNum-tableList.length;
						for(var i= 0,len = diverse;i<len;i++){
							var tdHTMl="";
							for(var j= 0,lenB = columnNum;j<lenB;j++){
								tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\"></td>")
							};
							$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
						}
					};
					$("#cms_app_admin_page_new_add_card").unbind().bind('click', function () {
						self.popupLayout()
					 })
					var appTreeName=self.currentAppLevelTreeData["name"];
					//调整顺序
					$("#cms_app_admin_page2_body").children().eq(index).find("tbody").on('click', '.cms_app_adjust_order', function(){
						var name=self.currentTreePointData["name"];
						var id=$(this).parent().attr("data-id");
						var dataValue=$(this).parent().attr("data-value");
						self.openAdjustOrderDialog(function(){
							 self.getSingleTree(appTreeName,id,function(data){
								var sendData=data;
								if(!sendData.metadata){
									sendData.metadata={};
								};
								var newIndex=document.getElementById("cms_adjust_order_input").value;
								var sendData={};
								sendData.index=parseInt(newIndex);
								//var pathPara=encodeURIComponent(appTreeName)+"/"+encodeURIComponent(name)+"/"+encodeURIComponent(dataValue);
								var pathPara=encodeURIComponent(self.currentAppLevelTreeData["name"])+"/by_id:"+id;
								self.editPageAttrCommon(pathPara,sendData,function(){
									var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
									var node =  treeObj.getNodeByParam("id",self.clickTreeNode.id);
									var currentNodeIsOpen=node.open;
									treeObj.reAsyncChildNodes(node,'refresh',false,function(){	
										if(currentNodeIsOpen){//原先该节点是展开的
											var containerHeight=document.getElementById("cms_app_admin_page2_left_body").offsetHeight;
											var treeHeight=document.getElementById("cms_app_admin_page2_left_tree_right_1").offsetHeight;
											var needCollapseNum=((containerHeight-treeHeight)/41);//表格高度加边框41
											if(needCollapseNum>0){
												self.adjustTreeTableTr(needCollapseNum,"collapse","cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
											}
										}
										else{
											if(node&&node.children){
											self.adjustTreeTableTr(node.children.length,"expand","cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
											}
										};
										self.adjustTrLenForTreeTable("cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_right_1","cms_app_admin_page2_left_tree_left");
										if(node&&node.children){
											self.initCardListBelowPageAfterSort(node.children);
										}
									})
								},"updatefield=index")
							})
						})
					});
					$("#cms_app_admin_page2_body").children().eq(index).find("tbody").on('click', '.cms_app_delete_page', function(){
						var text=i18n("CMS_DELETE_CONFIRM");
						text=text+"\"";
						text=text+$(this).parent().attr("data-display-value");
						text=text+"\"";
						text=text+" ？";
						var dataValue=$(this).parent().attr("data-value");
						var pathPara=encodeURIComponent(appTreeName)+"/"+encodeURIComponent(self.currentTreePointData["name"])+"/"+encodeURIComponent(dataValue);
						self.showMsgDialog(text, function() {
								self.deleteTree(pathPara,function(){
						  	var currentData=self.currentTreePointData;
								var name=currentData["name"];
								var id=currentData["id"];
								var treeObj = $.fn.zTree.getZTreeObj("cms_app_admin_page2_left_tree_right");
							  var node =  treeObj.getNodeByParam("id",self.clickTreeNode.id);
								var open=self.clickTreeNode.open;
								treeObj.reAsyncChildNodes(node,'refresh',false,function(){
									var len=self.expandedData.length;
									var collapseExpand="expand";
									if(open==true){
										len=1;
										collapseExpand="collapse"
									};
									document.getElementById("cms_app_admin_dash").style.display="block";
									self.adjustTreeTableTr(len,collapseExpand,"cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_left");
									self.adjustTrLenForTreeTable("cms_app_admin_page2_left_body","cms_app_admin_page2_left_tree_right_1","cms_app_admin_page2_left_tree_left");
									self.initCardListBelowPage(self.tabInex);
								})
						})
						})
					})
					$("#cms_app_admin_page_new_add_page").unbind().bind('click', function () {
						self.openAddNewPageDialog()
					 })
				},"children=1&enable=true")
			}
		},
		initLayoutList:function(index){
		  var self=this;
			$("#cms_app_admin_page2_body").children().eq(index).find("tbody").empty();
			var tableContainerHeight=document.getElementById("cms_app_admin_page2_body").clientHeight-15-70;
			var trH=42+1;
			var columnNum=2;
			if(self.currentTreePointData.children){
			  var childrenData=self.currentTreePointData.children;
				var trNum=Math.floor(tableContainerHeight/trH);
				var tableList=[];
				for(var i= 0,len = childrenData.length;i<len;i++){
					var arrayUnit=[];
					arrayUnit.push(i+1);
					arrayUnit.push(childrenData[i].name||"");
					tableList.push(arrayUnit)
				};
				for(var i= 0,len = tableList.length;i<len;i++){
					var tdHTMl="";
					for(var j= 0,lenB = columnNum;j<lenB;j++){
						var styleClass=((j==1)?"cms_app_admin_align_left":"");
						tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td "+styleClass+"\">"+tableList[i][j]+"</td>")
					};
					$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
				}
				var diverse=0;
				if(tableList.length<trNum){
					diverse=trNum-tableList.length;
					for(var i= 0,len = diverse;i<len;i++){
						var tdHTMl="";
						for(var j= 0,lenB = columnNum;j<lenB;j++){
							tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\"></td>")
						};
						$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
					}
				};
			}
		},
		initItemList:function(){ 
		  var self=this;
			var tabInex=self.tabInex;
			$("#cms_app_admin_page2_body").children().eq(tabInex).find("tbody").empty();
			var tableContainerHeight=document.getElementById("cms_app_admin_page2_body").clientHeight-15-70;
			var trH=42+1;
			var columnNum=4;
			var trNum=Math.floor(tableContainerHeight/trH);
			var tableList=[];
			var referTable=this.referTable;
			var items=self.currentTreePointData.children;
			var temp=items.sort(function(a,b){//项目表格需要排序，和项目树节点、最后存入json的次序一致。
				return a.name>b.name
			});
			items=temp;
			if(items){
				if(items.length!=0){
					for(var i= 0,len = items.length;i<len;i++){
						var arrayUnit=[];
						arrayUnit.push(i);
						var contentType="";
						if(items[i].metadata&&items[i].metadata.content_type&&referTable[items[i].metadata.content_type]){
							contentType=referTable[items[i].metadata.content_type]
						};
						arrayUnit.push(contentType||"");
						if(items[i].name){
							arrayUnit.push(items[i].name.replace(i18n("CMS_ASSET_PROJECT"),""));
							arrayUnit.push(items[i].name);
						}
						else{
							arrayUnit.push("");
							arrayUnit.push("");
						}
						tableList.push(arrayUnit)
					};
				};
				for(var i= 0,len = tableList.length;i<len;i++){
					var tdHTMl="";
					for(var j= 0,lenB = columnNum;j<lenB;j++){
						var styleClass=((j==3)?"cms_app_admin_align_left":"");
						tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td "+styleClass+"\">"+tableList[i][j]+"</td>")
					};
					$("#cms_app_admin_page2_body").children().eq(tabInex).find("tbody").append("<tr>"+tdHTMl+"</tr>");
				};
			}
			var diverse=0;
			if(tableList.length<trNum){
			  diverse=trNum-tableList.length;
				for(var i= 0,len = diverse;i<len;i++){
					var tdHTMl="";
					for(var j= 0,lenB = columnNum;j<lenB;j++){
						tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\"></td>")
					};
					$("#cms_app_admin_page2_body").children().eq(tabInex).find("tbody").append("<tr>"+tdHTMl+"</tr>");
				}
			};
			
		},
		initLayoutAppearance:function(){
			var self=this;
			 //if(self.notInitItemAppearanceBody){
				//self.notInitItemAppearanceBody=false;
			 //初始化下拉框组件
			if(document.getElementById("cms_app_admin_item_can_be_choose").children.length==0){//"是否能够被选中"下拉框没被初始化过(还未进入tab)
				var canBeChooseSelect = self.getNormalSelector('cms_app_admin_item_can_be_choose', [{
				label: i18n("CMS_ASSET_TRUE"),
				value: "true"
				},{
				label: i18n("CMS_ASSET_FALSE"),
				value: "false"
				}]);
				canBeChooseSelect.create();
			  //};
				var currentTreePointData=self.currentTreePointData;
				if(currentTreePointData.metadata){
					var itemMetadata=currentTreePointData.metadata
					var focusEnable=itemMetadata.focusEnable;
					if(typeof focusEnable=="undefined"){//当返回参数里没有focusEnable字段时，根据文档，input框默认选false;
						canBeChooseSelect.setValue("false")
					}
					else{
						if(focusEnable){//值为true
							canBeChooseSelect.setValue("true")
						}
						else{
							canBeChooseSelect.setValue("false")
						}
					}
				}
			}
		},
		getListAuthHistory:function(name,callback){
		  var method = 'Get';
          // url = aquapaas_host + '/aquapaas/rest/auditflow/instance/instances/nav_tree',
      var url = aquapaas_host + '/aquapaas/rest/navigation/trees';
      var urlParam = [];
      urlParam.push('app_key=' + paasAppKey)//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString())//应用级授权
      urlParam.push('user_id=' + my.paas.user_id)//用户级授权
      urlParam.push('access_token=' + my.paas.access_token)//用户级授权
      urlParam.push('is_primary=false')//非主树
      urlParam.push('tree_name=' + name)
			urlParam.push('tree_class=' + 'cms_tree')
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          ret = resp
        } else {
          ret = []
        }
        callback && callback(ret)
      })
		},
		initAuditPublishHistory:function(index){
			var self=this;
			$("#cms_app_admin_page2_body").children().eq(index).find("tbody").empty();
			var appLevelTreeName=self.currentAppLevelTreeData["name"];
			self.getListAuthHistory(appLevelTreeName,function(data){
				var tableContainerHeight=document.getElementById("cms_app_admin_audit_publish_history_container").clientHeight-35;
				var trH=42+1;
				var columnNum=5;
				var trNum=Math.floor(tableContainerHeight/trH);
				var tableList=[];
				for(var i= 0,len =data.length;i<len;i++){
					var arrayUnit=[];
					arrayUnit.push(i);
					var time="";
					//mail:2019.8.12
					if(data[i].metadata_public&&data[i].metadata_public.release_time){
						time=data[i].metadata_public.release_time
					}
          else{
						time=((data[i].metadata_public&&data[i].metadata_public.audit_time)||"") 
					}			
          if(time!=""){
						time=convertTimeString(time)
					}					
					arrayUnit.push(time);
					arrayUnit.push((data[i].metadata_public&&data[i].metadata_public.version)||"");
					arrayUnit.push((data[i].metadata_public&&data[i].metadata_public.version_desc)||"");
					var status = '';
					var audit_status=((data[i].metadata_public&&data[i].metadata_public.audit_status)||"");
					var release_status=((data[i].metadata_public&&data[i].metadata_public.release_status)||"");
					var is_active_release=((data[i].metadata_public&&data[i].metadata_public.is_active_release)||"");
					
					if (audit_status == 'deprecated') {
						status = i18n('CMS_DEPRECATED')
					} else if (audit_status == 'first_audit:prepare_audit') {
						status = i18n('CMS_PREPAREAUDIT')
					} else if (release_status == 'released') {
						if (is_active_release) {
							status = i18n('CMS_ISACTIVE')
						} else {
							status = i18n('CMS_RELEASED')
						}
					} else {
						status = i18n('CMS_PASSED')
					}
					arrayUnit.push(status);
					tableList.push(arrayUnit)
				};
				for(var i= 0,len = tableList.length;i<len;i++){
					var tdHTMl="";
					for(var j= 0,lenB = tableList[i].length;j<lenB;j++){
						tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\">"+tableList[i][j]+"</td>")
					};
					$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
				}
				var diverse=0;
				if(tableList.length<trNum){
					diverse=trNum-tableList.length;
					for(var i= 0,len = diverse;i<len;i++){
						var tdHTMl="";
						for(var j= 0,lenB = columnNum;j<lenB;j++){
							tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\"></td>")
						};
						$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
					}
				}
			});
			return;
		},
		
		getAuthList:function(treeName,callback){
			var method = 'Get';
      var url = aquapaas_host + '/aquapaas/rest/navigation/trees';
      var urlParam = [];
      urlParam.push('app_key=' + paasAppKey);//应用级授权
      urlParam.push('timestamp=' + new Date().toISOString());//应用级授权
      urlParam.push('user_id=' +  my.paas.user_id);//用户级授权
      urlParam.push('access_token=' +  my.paas.access_token);//用户级授权
      urlParam.push('release_status=released');//审核通过的待发布树
      urlParam.push('tree_name=' + treeName);
			urlParam.push('tree_class=cms_tree')
      url += '?' + urlParam.join('&')
      $.ajax({
        type: method,
        url: url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-aqua-sign': getPaaS_x_aqua_sign(method, url)
        }
      }).always((resp, status, xhr) => {
        if (status == 'success') {
          callback(resp)
        } else {
         callback([])
        }
      })
		},
		
		initHistoryVersionTable:function(index){
			$("#cms_app_admin_page2_body").children().eq(index).find("tbody").empty();
			var self=this;
			var appLevelTreeName=self.currentAppLevelTreeData["name"];
			self.getAuthList(appLevelTreeName,function(data){
				var tableContainerHeight=document.getElementById("cms_app_admin_audit_history_version_container").clientHeight-35;
				var trH=42+1;
				var columnNum=6;
				var trNum=Math.floor(tableContainerHeight/trH);
				var tableList=[];
				for(var i= 0,len = data.length;i<len;i++){
					var arrayUnit=[];
					arrayUnit.push(i);
					arrayUnit.push(data[i].create_time?(convertTimeString(data[i].create_time)):"");
					arrayUnit.push((data[i].metadata_public&&data[i].metadata_public.version)||"");
					arrayUnit.push((data[i].metadata_public&&data[i].metadata_public.version_desc)||"");
					arrayUnit.push((data[i].metadata_public&&data[i].metadata_public.release_time)?(convertTimeString(data[i].metadata_public.release_time)):"");
					var buttonClass=(data[i].metadata_public&&data[i].metadata_public.is_active_release)?"cms_app_admin_td_button_grey":"cms_app_admin_td_button";
					arrayUnit.push("<div class=\""+buttonClass+"\">"+i18n("CMS_DELETE")+"</div>");
					tableList.push(arrayUnit)
				};
				for(var i= 0,len = tableList.length;i<len;i++){
					var tdHTMl="";
					for(var j= 0,lenB = tableList[i].length;j<lenB;j++){
						tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\">"+tableList[i][j]+"</td>")
					};
					$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
				}
				var diverse=0;
				if(tableList.length<trNum){
					diverse=trNum-tableList.length;
					for(var i= 0,len = diverse;i<len;i++){
						var tdHTMl="";
						for(var j= 0,lenB = columnNum;j<lenB;j++){
							tdHTMl=(tdHTMl+"<td class=\"cms_app_admin_td\"></td>")
						};
						$("#cms_app_admin_page2_body").children().eq(index).find("tbody").append("<tr>"+tdHTMl+"</tr>");
					}
				}
			});
		},
		
		initHistoryVersionManagement:function(index){
			var self=this;
			$("#cms_app_admin_page2_body").children().eq(index).find("tbody").empty();
			$("#cms_app_admin_audit_history_version_container").on("click",".cms_app_admin_td_button",function(){	
				var versionNo=$(this).closest("tr").find("td").eq(2).text();
				var currentAppLevelTreeData=self.currentAppLevelTreeData;
				var versionNoPara="&tree_version="+versionNo+"";
				var treeName=currentAppLevelTreeData.name;
				var text=i18n("CMS_DELETE_CONFIRM2");
				text=text+"\"";
				text=text+treeName;
				text=text+"\"";
				text=text+i18n("CMS_DELETE_CONFIRM3");
				text=text+" ？";
				self.showMsgDialog(text, function() {
					self.deleteTreeNotDeleteFolder(encodeURIComponent(treeName),function(){
						self.initHistoryVersionTable(index)
					},versionNoPara)
				},function(){
				})
			});
			self.initHistoryVersionTable(index)
		},
		drawLeftTable2:function(dataRowNum){
			var outContainer=document.getElementById("cms_app_admin_column_container");
			var container=document.getElementById("cms_app_admin_page2_left_body2");
			container.innerHTML="";
			var clientHeight=outContainer.clientHeight;
			var everyRowHeight=40;
			var defaultRowNum=Math.floor(clientHeight/everyRowHeight);
			for(var i= 0,len = dataRowNum;i<len;i++){
				var div = document.createElement("div");
				div.setAttribute("style","border-bottom:1px #e2e2e2 solid;width:100%;height:"+everyRowHeight+"px");
				if(i==0){
					//div.className="cms_app_admin_blue_block"
				}
				container.appendChild(div);
			};
			document.getElementById("cms_app_admin_page2_left_tree_left2").style.height=(dataRowNum*(everyRowHeight+1)+"px");
		},
		drawLeftTable:function(dataRowNum){
			var outContainer=document.getElementById("cms_app_admin_page2_left_body_container");
			var container=document.getElementById("cms_app_admin_page2_left_body");
			var clientHeight=outContainer.clientHeight;
			var everyRowHeight=40;
			var defaultRowNum=Math.floor(clientHeight/everyRowHeight);
			for(var i= 0,len = dataRowNum;i<len;i++){
				var div = document.createElement("div");
				div.setAttribute("style","border-bottom:1px #e2e2e2 solid;width:100%;height:"+everyRowHeight+"px");
				if(i==0){
					//div.className="cms_app_admin_blue_block"
				}
				container.appendChild(div);
			};
			document.getElementById("cms_app_admin_page2_left_tree_left").style.height=(dataRowNum*(everyRowHeight+1)+"px");
		},
		getTitledSpan:function(str){
			return $('<span>').append(str).attr('title', str)[0].outerHTML;
		},
		getNormalSelector:function(containerId, options){
			var selector = new StyledSelector({
				containerId: containerId,
				styles: {
					optionHeight: 25,
					iconSize: 14,
				},
				options: options
			});
			selector.getCloseIcon = function() {
				return '<div class="stuptact-styled-selector-up-arrow"></div>';
			};
			selector.getOpenIcon = function() {
				return '<div class="stuptact-styled-selector-down-arrow"></div>';
			};
			return selector;
		}
  };
	
  return{
    init(){
      cmsModule.init();
    }
  }
})(jQuery,jQuery.fn.zTree);