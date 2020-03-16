var broadcastAssetImport = (function($){
	var broadcastAssetImportModule = {
    init:function(){
		  var self=this;
			this.clearIntervalCheck();
			window.broadcastAssetImportObj=null;
			this.initPara();
		  this.checkIfHasImportMissionRequest(function(){
			  self.hasImportMission=true;
				self.showMsgDialogOneButton(i18n("ASSET_IMPORT_ATTENTION_4"),"msg-dialog-one-botton.html")
			});
			this.importAssetUserLogin(function(data){
				var secretAccessKey=data.secretAccessKey;
        var accessKeyId=data.objectID;
				self.importAssetUserAccessKeyId=data.objectID;
				self.importAssetUsersecretAccessKey=data.secretAccessKey;
			});
			this.initFirstPageUI();
			this.bindEventsFirstPage();
			this.bindEventsSecondPage();
    },
		initPara:function(){
			this.importMissonKeyList=[{
				key:"asset_importZGD",displayName:""
				},{
				key:"failure_asset_importZGD",displayName:""
				}
			];
			this.hasImportMission=false;
			this.exportScope="all";
			this.importAssetUserAccessKeyId="";
			this.importAssetUsersecretAccessKey="";
			this.importForbidden=false;
			this.importLogData=[];
			this.previewForbidden=false;
		},
		importAssetUserLogin:function(successCallBack){
			try{
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
				}}catch(e){
				};
		},
		checkIfHasImportMissionRequest:function(hasMissionCallback){
		  var self=this
		  var importMissonKeyList=this.importMissonKeyList;
			for(var i= 0,len = importMissonKeyList.length;i<len;i++){
			  if(this.hasImportMission){}
				else{
					var name=importMissonKeyList[i].key;
					var url = aquapaas_host +"/aquapaas/rest/asset/status/"
					url=(url+name);
					url=(url+"?app_key="+paasAppKey);
					url=(url+"&timestamp="+new Date().toISOString());
					jQuery.ajax({
						type: "GET",
						async: false,
						url: url,
						dataType:"text",
						headers: {
								//"Accept": "application/json",
								//"Content-Type": "application/json",
								"x-aqua-sign": getPaaS_x_aqua_sign('GET', url)
						}
					}).done(function(data, status, xhr){
						if(data&&(data!="finish")){
							hasMissionCallback()
						}
					}).fail(function (jqXHR, textStatus){
						 //hasMissionCallback()
					})
				}
			}
		},
		initFirstPageUI:function(){
		  $(".asset_import_program_path_element").each(function(){
				$(this).hide()
			});
			$(".asset_import_sub_path_element").each(function(){
				$(this).hide()
			});
		  var self=this;
			try{
			  var importMethod=[{
					"label":"中广电传媒 (zgd)",
					"value":"zgd"
					}
				];
				if(typeof importMethod!="undefined"){
					var importMethodSelectorOptions=importMethod;
					var importMethodSelector = new AssetImportStyledSelector({
						containerId: "asset_import_import_method_selector",
						styles: {
							optionHeight: 28,
							iconSize: 14,
						},
						options: importMethodSelectorOptions,
						expandCallback:function(){
							$("#asset_import_import_method_selector").find(".styled-selector-inputbox").addClass("asset_import_stuptact_styled_selector_expand")
						},
						collapseCallback:function(){
							$("#asset_import_import_method_selector").find(".styled-selector-inputbox").removeClass("asset_import_stuptact_styled_selector_expand")
						}
					})
					importMethodSelector.getCloseIcon = function() {
						return '<div class="asset_import_stuptact_styled_selector_up_arrow"></div>';
					};
					importMethodSelector.getOpenIcon = function() {
						return '<div class="asset_import_stuptact_styled_selector_down_arrow"></div>';
					};
					importMethodSelector.create();
					importMethodSelector.onChange = function(){
						self.clearIntervalCheck();
					};
				};
				var importScopeSelectorOptions=[{
					"label":i18n("ASSET_IMPORT_ALL"),
					"value":"all"
					},{
					"label":i18n("ASSET_IMPORT_APPOINT_SUB_PATH"),
					"value":"subPath"
					},{
					"label":i18n("ASSET_IMPORT_APPOINT_PROGRAM_PATH"),
					"value":"programPath"
					}
				];
				if(typeof importSourcePath!="undefined"){
					document.getElementById("asset_import_import_source_path_label_input").innerHTML=importSourcePath.label;
					$("#asset_import_import_source_path_label_input").attr("data_value",importSourcePath.value);
				}
			}catch(e){
			};
			var importScopeSelector = new AssetImportStyledSelector({
				containerId: "asset_import_import_scope_selector",
				styles: {
					optionHeight: 28,
					iconSize: 14,
				},
				options: importScopeSelectorOptions,
				expandCallback:function(){
					$("#asset_import_import_scope_selector").find(".styled-selector-inputbox").addClass("asset_import_stuptact_styled_selector_expand")
				},
				collapseCallback:function(){
					$("#asset_import_import_scope_selector").find(".styled-selector-inputbox").removeClass("asset_import_stuptact_styled_selector_expand")
				}
			})
			importScopeSelector.getCloseIcon = function() {
				return '<div class="asset_import_stuptact_styled_selector_up_arrow"></div>';
			};
			importScopeSelector.getOpenIcon = function() {
				return '<div class="asset_import_stuptact_styled_selector_down_arrow"></div>';
			};
			importScopeSelector.create();
			importScopeSelector.onChange = function(){
				self.clearIntervalCheck();
				var curValue=this.value;
				self.exportScope=curValue;
				switch(curValue)
				{
				case "all":
					self.previewForbidden=false;
					document.getElementById("asset_import_check_preview").className="asset_import_button";
				  $(".asset_import_program_path_element").each(function(){
						$(this).hide()
					});
					$(".asset_import_sub_path_element").each(function(){
						$(this).hide()
					});
					break;
				case "subPath":
					self.previewForbidden=false;
					document.getElementById("asset_import_check_preview").className="asset_import_button";
				  self.toggleElement(".asset_import_program_path_element",".asset_import_sub_path_element");
					break;
				case "programPath":
				  self.previewForbidden=true;//mail 2019.7.11 导入范围为节目路径时，没有预览接口。
					document.getElementById("asset_import_check_preview").className="asset_import_button_gray";
					self.toggleElement(".asset_import_sub_path_element",".asset_import_program_path_element");
					break;
				default:
					break;
				}
      };
			this.adjustSize();
      if(this.hasImportMission){
				document.getElementById("asset_import_check_preview").className="asset_import_button_gray";
				document.getElementById("asset_import_run").className="asset_import_button_gray"
			}
			else{
				document.getElementById("asset_import_check_preview").className="asset_import_button";
				document.getElementById("asset_import_run").className="asset_import_button"
			}
		},
		
		importFileFunction1:function(callback,fileType,exportScope){
			var exportScope=this.exportScope;
			var localPath=$("#asset_import_import_source_path_label_input").attr("data_value");
			var subdirectory=document.getElementById("asset_import_sub_path_input").value;
			var spName="zgd";//文档：目前只支持zgd
			var url = aquapaas_host +"/aquapaas/rest/asset/job/total_import_sp/";
			var start=document.getElementById("asset_import_date_picker_begin").value;
			var end=document.getElementById("asset_import_date_picker_end").value;
			url=(url+encodeURIComponent(spName));
			url=(url+"?local_path="+encodeURIComponent(localPath));
			if((typeof fileType!="undefined")&&(fileType=="preview")){
				url=(url+"&mode=preview");
			};
			if( (typeof exportScope!="undefined")&&(exportScope=="subPath") ){
				url=(url+"&subdirectory="+encodeURIComponent(subdirectory));
				if(start!=""){
					url=(url+"&start="+start+"");
				}
				if(end!=""){
					url=(url+"&end="+end+"");
				}
			};
			url=(url+"&app_key="+paasAppKey);
			url=(url+"&timestamp="+new Date().toISOString());
			jQuery.ajax({
				type: "GET",
				async: false,
				url: url,
				dataType:"text",
				headers: {
						"Accept": "application/json",
						"Content-Type": "application/json",
						"x-aqua-sign": getPaaS_x_aqua_sign('GET', url)
				}
			}).done(function(data, status, xhr){
				if(data){
					callback(data)
				}
			})
		},
		
		importFileFunction2:function(callback,fileType){
			var localPath=$("#asset_import_import_source_path_label_input").attr("data_value");
			var url = aquapaas_host + "/aquapaas/rest/asset/job/failure_import/zgd";
			url=(url+"?local_path="+encodeURIComponent(localPath));
			url=(url+"&app_key="+paasAppKey);
			url=(url+"&timestamp="+new Date().toISOString());
			var dataObj=$("#asset_import_program_path_input").val().split(",");
			jQuery.ajax({
				type: "POST",
				async: true,
				url: url,
				dataType:"text",
				data: JSON.stringify(dataObj),
				headers: {
						"Accept": "application/json",
						"Content-Type": "application/json",
						"x-aqua-sign": getPaaS_x_aqua_sign('POST', url)
				}
			}).done(function(data, status, xhr){
				if(data){
					callback(data)
				}
			})
		},
		
		getImportLogFile:function(callback){
			if(typeof LOGIN_AQUA_USERNAME!="undefined"){
				var self=this;
				var secretAccessKey = self.importAssetUsersecretAccessKey;
				var accessKeyId = self.importAssetUserAccessKeyId;
				var method = "GET";
				var contentType = "application/cdmi-object";
				var nowDateTime = new Date().getTime();
				var urlPath = "/aqua/rest/cdmi/default/netdisk/"+LOGIN_AQUA_USERNAME+"/paas/vod/zgd/image/response/"+encodeURIComponent(fileName);
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
					if(data){
							callback(data)
						}
					})
			}
		},
		
		enterLogPage:function(){
			this.toggleElement(".asset_import_page1",".asset_import_page2");
			this.initAssetLogPage();
			this.bindLogPageEvents();
		},
		formatLogData:function(data){
			var dataObj={
				path:"",
				programName:"",
				PID:"",
				PAID:"",
				type:""
			};
			var dataUnitSplitColon=data.split(":");
			if(dataUnitSplitColon[1]){
				var SplitSlash=dataUnitSplitColon[1].split("/");
				if(SplitSlash[0]){
					dataObj.path=SplitSlash[0]
				}
				if(SplitSlash[1]){
					dataObj.programName=SplitSlash[1]
				}
			};
			if(dataUnitSplitColon[0]){
				var underLineArray=dataUnitSplitColon[0].split("_");
				if(underLineArray[0]){
					dataObj.PID=underLineArray[0];
				};
				if(underLineArray[1]){
					dataObj.PAID=underLineArray[1];
				};
			};
			if(dataUnitSplitColon[2]){
				dataObj.type=dataUnitSplitColon[2]
			};
			return dataObj
		},
		bindLogPageEvents:function(){
		  var self=this;
			$('#asset_import_refresh_log').on('click', function(){
				self.initAssetLogPage();
			});
			$('#asset_import_panel_page_2_container').on('click', '.opr-default', function(){
				var selectIndex = $(this).parents('.oprs-all').attr('data-index');
				var currentImportLogData=self.importLogData[selectIndex];
				if(currentImportLogData.objectName){
					if(typeof LOGIN_AQUA_USERNAME!="undefined"){
						var fileName=currentImportLogData.objectName;
						var secretAccessKey = self.importAssetUsersecretAccessKey;
						var accessKeyId = self.importAssetUserAccessKeyId;
						var method = "GET";
						var contentType = "application/cdmi-object";
						var nowDateTime = new Date().getTime();
						var urlPath = "/aqua/rest/cdmi/default/netdisk/"+LOGIN_AQUA_USERNAME+"/paas/vod/zgd/image/response/"+encodeURIComponent(fileName);
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
								var currentImportLogDataValue=JSON.parse(data.value);
								self.showMsgDialogViewResult("msg-dialog-view-result.html",currentImportLogDataValue,function(data){
									var dataArray=[];
									var dataArrayObj=[];
									var totalNum=0;
									try{
										if(data.succcess){
											var tableDataSucccess=data.succcess;
											totalNum=totalNum+tableDataSucccess.length;
											document.getElementById("asset_import_view_result_success").innerHTML=tableDataSucccess.length;
											for(var i= 0,len = tableDataSucccess.length;i<len;i++){
												var dataUnitArray=[];
												var tableDataSucccessFormat=self.formatLogData(tableDataSucccess[i]);
												dataUnitArray.push({"label":tableDataSucccessFormat.PID});
												dataUnitArray.push({"label":tableDataSucccessFormat.PAID});
												dataUnitArray.push({"label":tableDataSucccessFormat.path});
												dataUnitArray.push({"label":tableDataSucccessFormat.programName});
												dataUnitArray.push({"label":""});
												dataUnitArray.push({"label":""});
												dataUnitArray.push({"label":""});
												dataUnitArray.push({"label":"<div>"+i18n("ASSET_IMPORT_SUCCESS")+"</div>"});
												dataArray.push(dataUnitArray);
												dataArrayObj.push(tableDataSucccessFormat);
											}
										};
										if(data.error){
											var tableDataError=data.error;
											totalNum=totalNum+tableDataError.length;
											document.getElementById("asset_import_view_result_fail").innerHTML=tableDataError.length;
											for(var i= 0,len = tableDataError.length;i<len;i++){
												var dataUnitArray=[];
												var tableDataErrorFormat=self.formatLogData(tableDataError[i]);
												dataUnitArray.push({"label":tableDataErrorFormat.PID});
												dataUnitArray.push({"label":tableDataErrorFormat.PAID});
												dataUnitArray.push({"label":tableDataErrorFormat.path});
												dataUnitArray.push({"label":tableDataErrorFormat.programName});
												dataUnitArray.push({"label":""});
												dataUnitArray.push({"label":""});
												dataUnitArray.push({"label":""});
												dataUnitArray.push({"label":"<div style=\"color:red\">"+i18n("ASSET_IMPORT_FAIL")+"</div>"});
												dataArray.push(dataUnitArray);
												dataArrayObj.push(tableDataErrorFormat);
											}
										};
										document.getElementById("asset_import_view_result_total").innerHTML=totalNum;
										self.resultTabledataArray=dataArray;
										self.drawResultTable(dataArray);
										self.bindResultTableEvents(dataArrayObj);
									}catch(e){
									}
								})
							}
						})
					}
				}
			})
		},
	  getLogFilesData:function(callback){
		  var self=this;
			if(typeof LOGIN_AQUA_USERNAME!="undefined"){
				var secretAccessKey = self.importAssetUsersecretAccessKey;
				var accessKeyId = self.importAssetUserAccessKeyId;
				var self = this;
				var parent_uri = "/default/netdisk/"+LOGIN_AQUA_USERNAME+"/paas/vod/zgd/image/response";
				var object_type = "application/cdmi-object";
				var result_spec = {
					"objectID": "1",
					"objectName": "1",
					"metadata": {
							"cdmi_ctime": "1"
					}
				};
				var scope_spec = [{
						"objectType": "== " + object_type,
						"parentURI": "== " + parent_uri
				}];
				var specs = {
						'cdmi_scope_specification': scope_spec,
						'cdmi_results_specification': result_spec
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
		},
		initAssetLogPage:function(){
		  var self=this;
			this.getLogFilesData(function(data){
				if(data&&data.objects){
					var logData=data.objects;
					self.importLogData=logData;
					var dataArray=[];
					for(var i= 0,len = logData.length;i<len;i++){
						var dataUnit=logData[i];
					  if(dataUnit.objectName.indexOf("importZGD_preview")!=-1){
							continue
						};
						var ops = '<div class="oprs-all" data-index="' + i + '">';
						ops += '<div class="opr-default" data-opr="view_result">'+i18n("ASSET_IMPORT_VIEW_RESULT")+'</div>';
						ops += '</div>';
						var dataUnitArray=[];
						var createTime="";
						var logType="";
						var missionId="";
						if(logData[i]&&logData[i].metadata&&logData[i].metadata.cdmi_ctime){
							var cdmi_ctime=logData[i].metadata.cdmi_ctime;
							createTime=cdmi_ctime.substring(0,10)+"  "+cdmi_ctime.substring(11,19)
						};
						dataUnitArray.push({"label":createTime});
						var objectName=dataUnit.objectName;
						if(objectName.indexOf("importZGD_import")!=-1){
							logType=i18n("ASSET_IMPORT_SUB_PATH");
							missionId=objectName.replace("importZGD_import_","").replace(".json","")
						}
						else if(objectName.indexOf("importZGD_failureimport")!=-1){
							logType=i18n("ASSET_IMPORT_PROGRAM_PATH");
							missionId=objectName.replace("importZGD_failureimport_","").replace(".json","")
						}
						else{
						};
						dataUnitArray.push({"label":logType});
						dataUnitArray.push({"label":missionId});
						dataUnitArray.push({"label":ops});
						dataArray.push(dataUnitArray);
					};
					
					self.list = new StyledList({
						async: true,
						rows: 14,
						columns: 4,
						containerId: 'asset_import_panel_page_2_container',
						listType: 0,
						titles: [
							{label: i18n("ASSET_IMPORT_IMPORT_TIME")},
							{label: i18n("ASSET_IMPORT_MISSION_TYPE")},
							{label: i18n("ASSET_IMPORT_MISSION_ID")},
							{label: i18n("ASSET_IMPORT_MISSION_OPER")}
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
							columnsWidth: [0.25, 0.29, 0.247, 0.21]
						},
						data: dataArray
					});
					self.list.create();
				}
			})
		},
		
		clearIntervalCheck:function(){
			if((typeof broadcastAssetImportObj!= "undefined")&&(broadcastAssetImportObj!=null)&&(typeof broadcastAssetImportObj.intervalForCheckPreviewFile != "undefined")){
			clearInterval(broadcastAssetImportObj.intervalForCheckPreviewFile);
			}
		},
		
		bindEventsFirstPage:function(){
		  var self=this;
			$("#asset_import_log_entry_button").unbind().bind('click', function () {
				self.clearIntervalCheck();
				self.enterLogPage();
			});
			$("#asset_import_check_preview").unbind();
			$("#asset_import_run").unbind();
			if(this.hasImportMission){}
			else{
				$("#asset_import_check_preview").bind('click', function () {
					self.clearIntervalCheck();
					if(self.previewForbidden){
					}
					else{
						var exportScope=self.exportScope;
							self.importFileFunction1(function(data){
							  broadcastAssetImportObj={};
								if(typeof LOGIN_AQUA_USERNAME!="undefined"){
									broadcastAssetImportObj.intervalForCheckPreviewFile=setInterval(function(){//mail:2019.7.11
										if( (document.getElementById("asset_import_log_entry_button")==null) ){  
												clearInterval(broadcastAssetImportObj.intervalForCheckPreviewFile);
										}
										//else{
											var fileName="importZGD_preview_";
											fileName=(fileName+data);
											fileName=(fileName+".json");
											var secretAccessKey = self.importAssetUsersecretAccessKey;
											var accessKeyId = self.importAssetUserAccessKeyId;
											var method = "GET";
											var contentType = "application/cdmi-object";
											var nowDateTime = new Date().getTime();
											var urlPath = "/aqua/rest/cdmi/default/netdisk/"+LOGIN_AQUA_USERNAME+"/paas/vod/zgd/image/response/"+encodeURIComponent(fileName);
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
												//请求成功表示发现文件，就不再轮询
												self.clearIntervalCheck();
												if(data&&data.value){
													var dataValue=data.value;
													self.drawFirstPageTable(dataValue);
												}
											});
										//}
									},1500);
								}
							},"preview",exportScope)
					}
				})
				$("#asset_import_run").bind('click', function () {
					if(self.importForbidden){
					}
					else{
						switch(self.exportScope)
						{
						case "all":
							self.importFileFunction1(function(data){
								self.showMsgDialogOneButton(i18n("ASSET_IMPORT_ATTENTION_5"),"msg-dialog.html");
							})
							break;
						case "subPath":
							self.importFileFunction1(function(data){
								self.showMsgDialogOneButton(i18n("ASSET_IMPORT_ATTENTION_5"),"msg-dialog.html");
							})
							break;
						case "programPath":
							self.importFileFunction2(function(data){
								self.showMsgDialogOneButton(i18n("ASSET_IMPORT_ATTENTION_5"),"msg-dialog.html");
							})
							break;
						default:
								break;
						};
					}
				});
			}
		},
		
		bindEventsSecondPage:function(){
		 var self=this;
			$("#asset_import_back_to_page1").unbind().bind('click', function () {
				self.toggleElement(".asset_import_page2",".asset_import_page1");
			});
		},
		
		adjustSize:function(){
		
			var importSourcePathLabel=document.getElementById("asset_import_import_source_path_label");
			var asset_import_program_path_label=document.getElementById("asset_import_program_path_label");
			
			var firstRow=document.getElementById("asset_import_panel_page_1_first_part");
			var importMethodLabel=document.getElementById("asset_import_import_method_selector_label");
			var importMethodInput=document.getElementById("asset_import_import_method_selector");
			var importSourcePathInput=document.getElementById("asset_import_import_source_path_label_input");
			var innerEleMarginRight=29;
			
			var adjustedWidthImportSourcePathInput=firstRow.offsetWidth;
			adjustedWidthImportSourcePathInput=(adjustedWidthImportSourcePathInput-parseInt(importMethodLabel.style.marginLeft));
			adjustedWidthImportSourcePathInput=(adjustedWidthImportSourcePathInput-importMethodLabel.offsetWidth);
			adjustedWidthImportSourcePathInput=(adjustedWidthImportSourcePathInput-importMethodInput.offsetWidth);
			adjustedWidthImportSourcePathInput=(adjustedWidthImportSourcePathInput-parseInt(importSourcePathLabel.style.marginLeft));
			var noteWidth=adjustedWidthImportSourcePathInput;
			adjustedWidthImportSourcePathInput=(adjustedWidthImportSourcePathInput-importSourcePathLabel.offsetWidth);
			adjustedWidthImportSourcePathInput=(adjustedWidthImportSourcePathInput-innerEleMarginRight-2);//2为边框
			
			importSourcePathInput.style.width=(adjustedWidthImportSourcePathInput+"px");
			document.getElementById("asset_import_program_path_input").style.width=(adjustedWidthImportSourcePathInput+14+"px");
			
			
			if(window.screen.width<1300){
				importSourcePathLabel.style.marginLeft="20px";
				document.getElementById("asset_import_sub_path_label").style.marginLeft="20px";
				asset_import_program_path_label.style.marginLeft="20px";
				document.getElementById("asset_import_import_method_selector_label").style.width="80px";
				document.getElementById("asset_import_import_scope").style.width="80px";
				//14
				document.getElementById("asset_import_import_source_path_label").style.width="96px";
				document.getElementById("asset_import_sub_path_label").style.width="63px";
				asset_import_program_path_label.style.width="78px";
				asset_import_sub_path_calendar.style.marginLeft="20px";
				document.getElementById("asset_import_sub_path_input").style.width="190px";
			}
			else{
				noteWidth=(noteWidth-document.getElementById("asset_import_import_source_path_label").offsetWidth-428);
				document.getElementById("asset_import_sub_path_input").style.width=(noteWidth+"px")
			}

			document.getElementById("asset_import_panel_page_1_container").style.visibility="visible";	
			
			var minTrLen=9;
			var combineStr=(i18n("ASSET_IMPORT_TOTAL")+"：  "+i18n("ASSET_IMPORT_NEW_ADD")+"：  ");
			combineStr=(combineStr+(i18n("ASSET_IMPORT_UPDATE"))+"：  "+i18n("ASSET_IMPORT_ERROER")+"：");
			document.getElementById("asset_import_preview_title").innerHTML=combineStr;
			var asset_import_asset_table=document.getElementById("asset_import_asset_table");
			$("#asset_import_asset_table").empty();
			for(var i= 0,len = minTrLen;i<len;i++){
				var tableTr= document.createElement("tr");
				asset_import_asset_table.appendChild(tableTr);
				for(var j= 0,lenTd = 5;j<lenTd;j++){
					var tableTd= document.createElement("td");
					tableTd.className = "asset_import_title_container_id";
					tableTr.appendChild(tableTd);
				}
			}
		},
		
		drawFirstPageTable:function(data){
		   try{
				var dataJSON=JSON.parse(data);
				if( (!dataJSON.add||dataJSON.add.length==0)&&(!dataJSON.update||dataJSON.update.length==0) ){
						this.importForbidden=true;
						document.getElementById("asset_import_run").className="asset_import_button_gray";
						document.getElementById("asset_import_forbidden_run_notice1").innerHTML=i18n("ASSET_IMPORT_ATTENTION_8");
						document.getElementById("asset_import_forbidden_run_notice2").innerHTML=i18n("ASSET_IMPORT_ATTENTION_9")
				}
				else{
					if(dataJSON.error&&dataJSON.error.length>0){
						this.importForbidden=true;
						document.getElementById("asset_import_run").className="asset_import_button_gray";
						document.getElementById("asset_import_forbidden_run_notice1").innerHTML=i18n("ASSET_IMPORT_ATTENTION_6");
						document.getElementById("asset_import_forbidden_run_notice2").innerHTML=i18n("ASSET_IMPORT_ATTENTION_7")
					}
					else{
						this.importForbidden=false;
						document.getElementById("asset_import_run").className="asset_import_button";
						document.getElementById("asset_import_forbidden_run_notice1").innerHTML=i18n("ASSET_IMPORT_ATTENTION_2");
						document.getElementById("asset_import_forbidden_run_notice2").innerHTML=i18n("ASSET_IMPORT_ATTENTION_3")
					}
				};
				
				var tdNum=5;
				var addCount=0;
				var updateCount=0;
				var errorCount=0;
				var totalCount=0;
				if(dataJSON.addCount){
					addCount=dataJSON.addCount;
				};
				if(dataJSON.updateCount){
					updateCount=dataJSON.updateCount;
				};
				if(dataJSON.errorCount){
					errorCount=dataJSON.errorCount;
				};
				if(dataJSON.totalCount){
					totalCount=dataJSON.totalCount;
				};
				var combineStr=(i18n("ASSET_IMPORT_TOTAL")+"："+totalCount+"  "+i18n("ASSET_IMPORT_NEW_ADD")+"："+addCount+"  ");
				combineStr=(combineStr+(i18n("ASSET_IMPORT_UPDATE"))+"："+updateCount+"  "+i18n("ASSET_IMPORT_ERROER")+"："+errorCount);
				document.getElementById("asset_import_preview_title").innerHTML=combineStr;
				var tableData=[];
				function pushTableDataArray(firstRowWords,dataInputUnit){
					for(var i= 0,len = dataInputUnit.length;i<len;i++){
						var dataUnit=dataInputUnit[i];
						var arrayUnit=[];
						arrayUnit.push(firstRowWords);
						var dataUnitSplitColon=dataUnit.split(":");
						if(dataUnitSplitColon[1]){
							var dataUnitSplitColonLastPart=dataUnitSplitColon[1];
							var SplitSlash=dataUnitSplitColonLastPart.split("/");
							if(SplitSlash[0]){
								arrayUnit.push(SplitSlash[0])
							}
							if(SplitSlash[1]){
								arrayUnit.push(SplitSlash[1])
							}
						};
						if(dataUnitSplitColon[0]){
							var underLineArray=dataUnitSplitColon[0].split("_");
							if(underLineArray[0]){
								arrayUnit.push(underLineArray[0])
							};
							if(underLineArray[1]){
								arrayUnit.push(underLineArray[1])
							};
						}
						tableData.push(arrayUnit);
					}
				};
				if(addCount>0){
					if(dataJSON.add){
						pushTableDataArray(i18n("ASSET_IMPORT_NEW_ADD"),dataJSON.add);
					}
				};
				if(updateCount>0){
					if(dataJSON.update){
						pushTableDataArray(i18n("ASSET_IMPORT_UPDATE"),dataJSON.update);
					}
				};
				if(errorCount>0){
					if(dataJSON.error){
						pushTableDataArray(i18n("ASSET_IMPORT_ERROER"),dataJSON.error);
					}
				};
				var minTrLen=9;
				var asset_import_asset_table=document.getElementById("asset_import_asset_table");
				$("#asset_import_asset_table").empty();
				for(var i= 0,len = tableData.length;i<len;i++){
					var tableTr= document.createElement("tr");
					asset_import_asset_table.appendChild(tableTr);
					var currenTableData=tableData[i];
					for(var j= 0,lenTd = currenTableData.length;j<lenTd;j++){
						var tableTd= document.createElement("td");
						tableTd.className = "asset_import_title_container_id";
						if(j==2){tableTd.style.cssText="text-align:left;padding-left:10px"};
						if(j==0){
							if(currenTableData[j]==i18n("ASSET_IMPORT_ERROER")){
								tableTd.style.color="red"
							}
							else{
								tableTd.style.color="#797979"
							}
						};
						tableTd.innerHTML=currenTableData[j];
						tableTr.appendChild(tableTd);
					}
				}
				var addTrNum=0;
				if(tableData.length<minTrLen){
					addTrNum=minTrLen-tableData.length;
					for(var i= 0,len = addTrNum;i<len;i++){
						var tableTr= document.createElement("tr");
						asset_import_asset_table.appendChild(tableTr);
						for(var j= 0,lenTd = tdNum;j<lenTd;j++){
							var tableTd= document.createElement("td");
							tableTd.className = "asset_import_title_container_id";
							tableTr.appendChild(tableTd);
						}
					}
				}
			}catch(e){
			}
		},
	 toggleElement:function(hiddenElementClass,showElementClass){
		$(hiddenElementClass).each(function(){
			$(this).hide()
		});
		$(showElementClass).each(function(){
			$(this).show()
		});
	 },
	 showMsgDialogOneButton:function(msg, fileName, callback){
	    var self=this;
			var dialog = new OverlayDialog({
				url: 'content/asset_import/'+fileName+'',
				width: 470,
				height: 266,
				context: {},
				zIndex: 3000,
				id: 'user-admin-msg',
				callback: function(){
					$('#user-admin-msg-content').text(msg);
					$('#user-admin-msg-close').on('click', function(){
						dialog.close();
					});
					$('#user-admin-msg-submit').on('click', function(){
					  self.enterLogPage();
						dialog.close();
						if(typeof callback == 'function'){
							callback();
						}
					});
				}
			});
			dialog.open();
		},
		 showMsgDialogViewResult:function(fileName, data, openCallback, submitCallback){
			var dialog = new OverlayDialog({
				url: 'content/asset_import/'+fileName+'',
				width: 1134,
				height: 662,
				context: {},
				zIndex: 3000,
				id: 'user-admin-msg',
				callback: function(){
					openCallback(data);
					$('#user-admin-msg-close').on('click', function(){
						dialog.close();
					});
					$('#user-admin-msg-submit').on('click', function(){
						dialog.close();
					});
				}
			});
			dialog.open();
		},
		
		drawResultTable: function(data){
			var self = this;
      self.resultTablelist = new StyledList({
        async: true,
        rows: 12,
        columns: 8,
        containerId: 'asset_import_view_result_table',
        listType: 0,
        titles: [
          {label: "PID"},
          {label: "PAID"},
          {label: i18n("ASSET_IMPORT_ASSET_PATH")},
          {label: i18n("ASSET_IMPORT_ASSET_NAME")},
					{label: i18n("ASSET_IMPORT_DRAMA_NUMBER")},
          {label: i18n("ASSET_IMPORT_DRAMA_STATUS")},
          {label: i18n("ASSET_IMPORT_CONTENT_POSTER_STATUS")},
          {label: i18n("ASSET_IMPORT_IMPORT_STATUS")}
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
          columnsWidth: [0.0889, 0.0962, 0.111, 0.21, 0.109, 0.109, 0.152, 0.12]
        },
        data: data
      });
      self.resultTablelist.create();
		},
		
		refreshResultTable:function(data){
			var self=this;
			for(var i= 0,len = data.length;i<len;i++){
				var dataUnit=data[i];
				if(dataUnit.metadata){
					var dataUnitMetadata=dataUnit.metadata;
					var Episode_ID=(dataUnitMetadata.Episode_ID?dataUnitMetadata.Episode_ID:"");
					var Chapter=(dataUnitMetadata.Chapter?dataUnitMetadata.Chapter:"");
					var ChapterNew=Chapter;
					if( (Chapter.substring(0,1)=="0")&&(Chapter.substring(1,2)!="0") ){
						ChapterNew=(Chapter.substring(1,3))
					}
					else if ( (Chapter.substring(0,1)=="0")&&(Chapter.substring(1,2)=="0") ){
						 ChapterNew=(Chapter.substring(2,3))
					}
					else{};
					var programNum=Episode_ID+"/"+ChapterNew;
					var serial_missing=dataUnitMetadata.serial_missing;
					var serialMissingDisplay=(serial_missing?i18n("ASSET_IMPORT_SHORTAGE"):i18n("ASSET_IMPORT_WANZHENG"))
					var contentAvaiable=(dataUnit.content_available?i18n("ASSET_IMPORT_JIUXU"):i18n("ASSET_IMPORT_WEIJIUXU"))
					var pid=dataUnit.provider_id;
					var paid=dataUnit.provider_asset_id;
					var resultTabledataArray=self.resultTabledataArray;
					for(var j= 0,lenTable = resultTabledataArray.length;j<len;j++){
						if((resultTabledataArray[j][0].label==pid)&&(resultTabledataArray[j][1].label==paid)){
							var styleStr1=(serial_missing?"color:red":"");
							var styleStr2=(dataUnit.content_available?"":"color:red");
							self.resultTabledataArray[j][4]={"label":programNum};
							self.resultTabledataArray[j][5]={"label":"<div style=\""+styleStr1+"\">"+serialMissingDisplay+"</div>"};
							self.resultTabledataArray[j][6]={"label":"<div style=\""+styleStr2+"\">"+contentAvaiable+"</div>"};
							break;
						}//判断第一、二列是paid
					};
				}
			};
			self.drawResultTable(self.resultTabledataArray);
		},
		
		bindResultTableEvents:function(dataCombine){
		  var self=this;
			asset_import_get_program_status
			$("#asset_import_get_program_status").unbind().bind('click', function () {
				self.getProgramStatusList(dataCombine,function(data){
					self.refreshResultTable(data)
				})
			})
			$("#asset_import_check_program_status").unbind().bind('click', function () {
				self.scanProgramStatus(dataCombine,function(){
					self.getProgramStatusList(dataCombine,function(data){
						self.refreshResultTable(data)
					})
				});
			})
		},
		
		getProgramStatusList:function(dataCombine,callback){
			var dataStr="";
			for(var i= 0,len = dataCombine.length;i<len;i++){
			  var dataStrUnit=dataCombine[i].PID+"_"+dataCombine[i].PAID;
				if(i==0){
					dataStr=dataStr+dataStrUnit
				}
				else{
					dataStr=dataStr+","+dataStrUnit
				}
			};
			var ids=dataStr;
			var url = aquapaas_host + '/aquapaas/rest/asset/assets';
			url=(url+"?ids="+encodeURIComponent(ids));
			url=(url+"&app_key="+paasAppKey);
			url=(url+"&timestamp="+new Date().toISOString());
			jQuery.ajax({
				type: "GET",
				async: true,
				url: url,
				headers: {
						"Accept": "application/json",
						"Content-Type": "application/json",
						"x-aqua-sign": getPaaS_x_aqua_sign('GET', url)
				}
			}).done(function(data, status, xhr){
				callback(data)
			})
		},

		scanProgramStatus:function(dataCombine,callback){
			var self=this;
			var dataObj=[];
			for(var i= 0,len = dataCombine.length;i<len;i++){
				var dataUnit=dataCombine[i].PID+"_"+dataCombine[i].PAID+":"+dataCombine[i].type;
				dataObj.push(dataUnit);
			}
			var url = aquapaas_host + "/aquapaas/rest/asset/job/state/scan";
			url=(url+"?app_key="+paasAppKey);
			url=(url+"&timestamp="+new Date().toISOString());
			jQuery.ajax({
				type: "POST",
				async: true,
				url: url,
				data: JSON.stringify(dataObj),
				headers: {
						"Accept": "application/json",
						"Content-Type": "application/json",
						"x-aqua-sign": getPaaS_x_aqua_sign('POST', url)
				}
			}).done(function(data, status, xhr){
				callback();
			})
		}
  };
	
  return{
    init(){
      broadcastAssetImportModule.init();
    }
  }
})(jQuery);
