function createCommonDialog_setTagForProduct(objType_addTagToAsset,array_alreadyBindTagNames,afterCloseDialogcallback,dataChoosed_,dialogTitle,dialogHeight,functionType,dataFromOuterPage){
		if(functionType=="batchSet"){
			if((!dataFromOuterPage)||(dataFromOuterPage.length==0)){
				alert(i18n("ASSET_TAG_LIB_QINGXUANZEJIEMU"));
				return;
			}
		};
		if(typeof dataChoosed_ =="undefined"){return}
		this.token_setTagForAsset="user_id=" + my.paas.user_id +"&user_type=" + my.paas.user_type +"&access_token=" + my.paas.access_token +"&app_key=" + paasAppKey +"&timestamp=";
		var dialog_setTagForProduct = new PopupDialog({
				url: 'content/asset/assetTagLib/create_dialog_new.html',
				width: 510,
				height: dialogHeight,
				context:this,
				callback:  function(){afterOpen_commonDialog_setTagForProduct(this.dialog_setTagForProduct,objType_addTagToAsset,array_alreadyBindTagNames)}
		});
	  var jq=jQuery;
		dialog_setTagForProduct.create();
		this.dialog_setTagForProduct=dialog_setTagForProduct;
		this.allTagData=[];
		function afterOpen_commonDialog_setTagForProduct(dialog_setTagForAssetList,objType_addTagToAsset,array_alreadyBindTagNames){
			switch(functionType)
			{
			case "singleSet":
			document.getElementById("dialog_tagAdd_confirm_botton_click").innerHTML=i18n("COMMON_STYLE_CONFIRM_BUTTONA");
				break;
			case "batchSet":
				jQuery("#addTagToProduct_dialogTitle").hide();
				document.getElementById("dialog_tagAdd_confirm_botton_click").innerHTML=i18n("COMMON_STYLE_CONFIRM_BUTTONB");
				break;
			default:
				break;
			}
			var datePickerStyle = {
					iconImage: 'images/heatstats/style_datepicker_icon.png',
					calendarStyles: {
					navTitleBgColor: '#2ea2d7',
				}
			};
			var picker_addTagPopup_validTimeBegin = new DatePicker(jQuery.extend({
					containerId: 'addTagForProduct_Popup_validTimeBegin'
				}, datePickerStyle));
			var picker_addTagPopup_validTimeEnd = new DatePicker(jQuery.extend({
					containerId: 'addTagForProduct_Popup_validTimeEnd'
				}, datePickerStyle));
			document.getElementById("sucai_dialog_title_text").innerHTML=dialogTitle;
			jq("#addTagForProduct_Popup_alwaysValid").unbind().bind('click', function () {
			    var validBginInputId="addTagForProduct_Popup_validTimeBegin-datepicker-input";
					var validEndInputId="addTagForProduct_Popup_validTimeEnd-datepicker-input";
					if(jq(this).children().css("display")=="none"){
						jq(this).children().css("display","block");//设为永久有效
						document.getElementById(validBginInputId).setAttribute("disabled","disabled");
						jq("#"+validBginInputId+"").css("background-color","#efefef");
					  document.getElementById(validEndInputId).setAttribute("disabled","disabled");
						jq("#"+validEndInputId+"").css("background-color","#efefef").val("");
						jq("#addTagForProduct_Popup_validTimeBegin,#addTagForProduct_Popup_validTimeEnd").append("<div class=\"addTagPopup_blockSetTime\" style=\"left:0;top:0;position:absolute;width:100%;height:100%\"></div>");
					}
					else{
						jq(this).children().css("display","none");
					  document.getElementById(validBginInputId).removeAttribute("disabled");
						jq("#"+validBginInputId+"").css("background-color","");
						document.getElementById(validEndInputId).removeAttribute("disabled");
						jq("#"+validEndInputId+"").css("background-color","");
						jq("#addTagForProduct_Popup_validTimeBegin,#addTagForProduct_Popup_validTimeEnd").find(".addTagPopup_blockSetTime").remove()
					}
				})
			var that=this;
			var selfDefineTagObjType="assettag";
			var obj_id=dataChoosed_.id;
			jq("#addTag_selfDefine").unbind().bind("click", () => {
					var name_encode=encodeURIComponent(jq("#ChannelTag_name").val());
					var name=jq("#ChannelTag_name").val();	
					var url = aquapaas_host +"/aquapaas/rest" + "/tagdef/" + selfDefineTagObjType + "/"+ name_encode + "?" + that.token_setTagForAsset + new Date().toISOString();
					jq.ajax({
							type: "PUT",
							async: true,
							url: url,
							headers: {
									'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
							},
							contentType: "application/json",
							data: JSON.stringify({title: name}),
					}).done(function(data, status, xhr){
							//加入列表
							refreshFlowList(objType_addTagToAsset);
					})
			});
			jq("#config_list_search_botton").unbind().bind("click", () => {
					 if(jq("#config_list_search").val()!=""){
						 var allTagData=that.allTagData;
						 var allTagData_len=allTagData.length;
						 var afterSearchData=[];
						 for (let i = 0; i < allTagData_len; i++) {
							if(allTagData[i].title.indexOf(jq("#config_list_search").val())!=-1){
								afterSearchData.push(allTagData[i])
							}
					   }
						 if(afterSearchData.length>0)
						 {initCalendar(afterSearchData[0])};
						 var array_=[];
						 for (let i = 0; i < afterSearchData.length; i++) {
							array_.push({label:afterSearchData[i].title,value:"",storedName:afterSearchData[i].name});
						 };
						 if(array_.length>0){document.getElementById("addTagToProduct_choosedTagTitle").innerHTML=array_[0].label};
							jq("#sucai_dialog_sucaizu_selectable").empty();
							var createDialog_table = new AssetTagLibStyledFlowList({
							container: '#sucai_dialog_sucaizu_selectable',
							data: [],
							resourceData:afterSearchData,
							title: {
									label: i18n('ASSET_TAG_LIB_KEXUANZEJIEMUBIAOQIAN')
							},
							minRows: 8
						});
						createDialog_table.create();
						createDialog_table.update(array_);
						}
						else{
						bindEvents_setTagForAssetList_(objType_addTagToAsset,array_alreadyBindTagNames)
						}
				})
		bindEvents_setTagForAssetList_(objType_addTagToAsset,array_alreadyBindTagNames);
		function bindEvents_setTagForAssetList_(objType_addTagToAsset,array_alreadyBindTagNames){
			refreshFlowList(objType_addTagToAsset);
			jQuery("#ChannelTag_name").attr("placeholder",i18n('ASSET_TAG_LIB_PLACEHOLDER'));
			jq("#sucai_dialog_close,#dialog_tagAdd_close_botton_click").unbind().bind("click", () => {
				dialog_setTagForAssetList.close();
				if(functionType=="singleSet"){
					let dialog_setTagForAsset = new PopupDialog({
							url: "content/asset/assetTagLib/assetTagLib_addTagForProduct.html",
							width: 864,
							height: 516,
							context: this,
							callback: function(){afterCloseDialogcallback(dataChoosed_,objType_addTagToAsset)}
						});
					dialog_setTagForAsset.create();
				}
			});
			var that=this;
			this.appKey_onlyUsedForSetTagForProduct="_global";
			jq("#dialog_tagAdd_confirm_botton_click").bind('click',{objType_addTagToAsset: objType_addTagToAsset},function (events) {
				var objType_addTagToAsset=events.data.objType_addTagToAsset;
				var text_=jQuery("#sucai_dialog_sucaizu_selectable_choosedRadioButton").find(".storedName").text();
				var data={};
				var start_input=document.getElementById("addTagForProduct_Popup_validTimeBegin-datepicker-input");
				var end_input=document.getElementById("addTagForProduct_Popup_validTimeEnd-datepicker-input");
				switch(true){
					case start_input.value.length==0&&end_input.value.length==0:
					data = {
						"details" : [
							{
								"tag" :text_
							}
						]
					};
					break;
				case start_input.value.length!=0&&end_input.value.length!=0:
					data = {
						"details" : [
							{
								"tag" :text_,
								"start" : ""+start_input.value+"T00:00:00+0800",
							  "end" : ""+end_input.value+"T23:59:59+0800"
							}
						]
					};
					break;
					case start_input.value.length==0&&end_input.value.length!=0:
						data = {
							"details" : [
								{
									"tag" :text_,
									"end" : ""+end_input.value+"T23:59:59+0800"
								}
							]
						};
					break;
					case start_input.value.length!=0&&end_input.value.length==0:
					data = {
						"details" : [
							{
								"tag" :text_,
								"start" : ""+start_input.value+"T00:00:00+0800"
							}
						]
					};
					break;
				default:
					break
					};
				var tag_list=data&&data.details||{};
				var appkey=paasAppKey;
				var objType_addTagToAsset=objType_addTagToAsset;
				if(objType_addTagToAsset!="assetAndBundle")//不是批量打标签，所以节目类型只可能是一种
				{
					var obj_id=dataChoosed_.id;
					if(tag_list.length>0){
						var detailStart=tag_list[0].start;
						var detailEnd=tag_list[0].end;
						if( ((typeof detailStart=="undefined")&&(typeof detailEnd=="undefined"))||((detailStart=="")&&(detailEnd==""))||((detailStart==null)&&(detailEnd==null)) ){
							var token_setTagForAsset="user_id=" + my.paas.user_id +"&user_type=" + my.paas.user_type +"&access_token=" + my.paas.access_token +"&app_key=" + paasAppKey +"&timestamp=";
							var url = aquapaas_host +"/aquapaas/rest/asset/tag/" + obj_id + ""; 
							url+=("?"+token_setTagForAsset + new Date().toISOString());
								var tagList={
									"tags" : [
										tag_list[0].tag
									]
								};
								 jQuery.ajax({
										type: "POST",
										async: false,
										url: url,
										data: JSON.stringify(tagList),
										headers: {
												'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
										},
										contentType: "application/json",
								 }).done(function(data, status, xhr){
								 })
						}
						else{
							var url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+that.appKey_onlyUsedForSetTagForProduct+"/" + objType_addTagToAsset+ "/" + obj_id + "?" + that.token_setTagForAsset + new Date().toISOString();
							jQuery.ajax({
								type: "POST",
								async:false,
								url: url,
								headers: {
										'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
								},
								contentType: "application/json",
								dataType: "json",
								data: JSON.stringify(data),
								complete: function(ajaxback){
									
								}
							})
						 }	
					};
				}
				else{
				var assetBundleIds=[[],[]];//asset和bundle的节目列表
				if(typeof dataFromOuterPage =="undefined"){
					assetBundleIds=dataChoosed_;
				}
				else{
					for(var i = 0; i < dataFromOuterPage.length; i++) {
						if(dataFromOuterPage[i].doc_type=="bundle"){//bundle
							assetBundleIds[1].push(dataFromOuterPage[i].doc_id)//用doc_id代替.mail 2018.10.11 17:45
						}
						else if(dataFromOuterPage[i].doc_type=="asset"){
							assetBundleIds[0].push(dataFromOuterPage[i].doc_id)
						}
						else{}
					};
				}
				if(tag_list.length>0){
					var detailStart=tag_list[0].start;
					var detailEnd=tag_list[0].end;
					//为asset打标签
					var typeA="asset";
					var obj_ids=assetBundleIds[0].join(",");
					var obj_id=obj_ids;
					var token_setTagForAsset="user_id=" + my.paas.user_id +"&user_type=" + my.paas.user_type +"&access_token=" + my.paas.access_token +"&app_key=" + paasAppKey +"&timestamp=";
					if(obj_ids!=""){
						if( ((typeof detailStart=="undefined")&&(typeof detailEnd=="undefined"))||((detailStart=="")&&(detailEnd==""))||((detailStart==null)&&(detailEnd==null)) ){
							var url = aquapaas_host +"/aquapaas/rest/asset/tag/" + obj_id + ""; 
							url+=("?"+token_setTagForAsset + new Date().toISOString());
								var tagList={
									"tags" : [
										tag_list[0].tag
									]
								};
								 jQuery.ajax({
										type: "POST",
										async: false,
										url: url,
										data: JSON.stringify(tagList),
										headers: {
												'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
										},
										contentType: "application/json",
								 }).done(function(data, status, xhr){
								 })
						}
						else{
							var url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+that.appKey_onlyUsedForSetTagForProduct+"/" + typeA+ "/" + obj_ids + "?" + that.token_setTagForAsset + new Date().toISOString();
								jQuery.ajax({
									type: "POST",
									async:false,
									url: url,
									headers: {
											'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
									},
									contentType: "application/json",
									dataType: "json",
									data: JSON.stringify(data),
									complete: function(ajaxback){
										
									}
								})
						}	
					}
					
					var typeB="bundle";
					var obj_ids=assetBundleIds[1].join(",");
					var obj_id=obj_ids;
					if(obj_ids!=""){
						if( ((typeof detailStart=="undefined")&&(typeof detailEnd=="undefined"))||((detailStart=="")&&(detailEnd==""))||((detailStart==null)&&(detailEnd==null)) ){
							var url = aquapaas_host +"/aquapaas/rest/asset/tag/" + obj_id + ""; 
							url+=("?"+token_setTagForAsset + new Date().toISOString());
								var tagList={
									"tags" : [
										tag_list[0].tag
									]
								};
								 jQuery.ajax({
										type: "POST",
										async: false,
										url: url,
										data: JSON.stringify(tagList),
										headers: {
												'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
										},
										contentType: "application/json",
								}).done(function(data, status, xhr){
							})
						}
						else{
							var url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+that.appKey_onlyUsedForSetTagForProduct+"/" + typeB+ "/" + obj_ids + "?" + that.token_setTagForAsset + new Date().toISOString();
							jQuery.ajax({
								type: "POST",
								async:false,
								url: url,
								headers: {
										'x-aqua-sign': getPaaS_x_aqua_sign('POST', url)
								},
								contentType: "application/json",
								dataType: "json",
								data: JSON.stringify(data),
								complete: function(ajaxback){
								}
							})
						}
					}
			};	
		}
				that.dialog_setTagForProduct.close();
 				if(functionType=="singleSet"){
					let dialog_setTagForAsset = new PopupDialog({
							url: "content/asset/assetTagLib/assetTagLib_addTagForProduct.html",
							width: 864,
							height: 516,
							context: this,
							callback: function(){afterCloseDialogcallback(dataChoosed_,objType_addTagToAsset)}
						});
					dialog_setTagForAsset.create();
				}
			});
	  };
		
		function initCalendar(data){
		  var jq=jQuery;
			var validBginInputId="addTagForProduct_Popup_validTimeBegin-datepicker-input";
			var validEndInputId="addTagForProduct_Popup_validTimeEnd-datepicker-input";
			var effective_time=(data.effective_time&&data.effective_time!=null)?data.effective_time:"";
			jq("#"+validBginInputId+"").val(effective_time.substring(0,10));
			if(data.expiration_time&&data.expiration_time!=null&data.expiration_time!=""){
				jq("#addTagForProduct_Popup_alwaysValid").children().css("display","none");
				document.getElementById(validBginInputId).removeAttribute("disabled");
				document.getElementById(validEndInputId).removeAttribute("disabled");
				jq("#"+validBginInputId+"").css("background-color","");
				jq("#"+validEndInputId+"").css("background-color","");
				jq("#"+validEndInputId+"").val(data.expiration_time.substring(0,10));
				jq("#addTagForProduct_Popup_validTimeBegin,#addTagForProduct_Popup_validTimeEnd").find(".addTagPopup_blockSetTime").remove();
			}
			else{//永久有效
				jq("#addTagForProduct_Popup_alwaysValid").children().css("display","block");
				document.getElementById(validBginInputId).setAttribute("disabled","disabled");
				document.getElementById(validEndInputId).setAttribute("disabled","disabled");
				jq("#"+validBginInputId+"").css("background-color","#efefef");
				jq("#"+validEndInputId+"").css("background-color","#efefef").val("");
				jq("#addTagForProduct_Popup_validTimeBegin,#addTagForProduct_Popup_validTimeEnd").append("<div class=\"addTagPopup_blockSetTime\" style=\"left:0;top:0;position:absolute;width:100%;height:100%\"></div>");
			};
		};				
		function refreshFlowList(objType_addTagToAsset){
		  var that=this;
			var objType_addTagToAsset=objType_addTagToAsset;
			var createDialog_table = new AssetTagLibStyledFlowList({
					container: '#sucai_dialog_sucaizu_selectable',
					data: [],
					title: {
							label: i18n('ASSET_TAG_LIB_KEXUANZEJIEMUBIAOQIAN')
					},
					minRows: 8
			});
			createDialog_table.create();
			var selfDefineTagObjType="assettag";
			var url = aquapaas_host +"/aquapaas/rest/"+ "tagdef/" + selfDefineTagObjType + "/"　+ "?" + this.token_setTagForAsset +  new Date().toISOString();
			jq.ajax({
					type  : "GET",
					async :true,
					url   : url,
					contentType : "application/json",
					dataType    : "json",
					error:function(error){
						
					}
			}).done(function(data, status, xhr){
				if(data){
					that.allTagData=data;
					let result=[];
					for(var i = 0; i < data.length; i++) {
					  if(i==0){
							document.getElementById("addTagToProduct_choosedTagTitle").innerHTML=data[0].title;
							initCalendar(data[0]);
						}
						result.push({label:data[i].title,value:i,storedName:data[i].name});
					};
					createDialog_table.resourceData=that.allTagData;
					createDialog_table.update(result);
				}
			})
		};
	};
}