var asset_tags_dialog =  ((dataChoosed_,objType_addTagToAsset,assetData) => {
	let dialog_setTagForAsset = new PopupDialog({
		url: "content/asset/assetTagLib/assetTagLib_addTagForProduct.html",
		width: 864,
		height: 516,
		context: this,
		callback: function () {
			asset_tags_dialog_(dataChoosed_, dialog_setTagForAsset, objType_addTagToAsset,assetData)
		}
	});
	dialog_setTagForAsset.create();
});
var asset_tags_dialog_ = ((dataChoosed_,dialog_setTagForAsset_,objType_addTagToAsset,assetData) => {
	 var jq=jQuery;
	 var that=this;
   var Dialog=PopupDialog;
	 this.appKey_onlyUsedForSetTagForProduct="_global";//mail:20180802 10:02 fangli:此appkey只是针对Asset打tag的功能.
	 this.createDialog_taglist={};
	 jq("#tag_for_product_add_container").empty();
	 var objType_addTagToAsset=objType_addTagToAsset;
	 this.objType_addTagToAsset=objType_addTagToAsset;
	 var dataChoosed_replaceData={};
	 if(typeof dataChoosed_ =="undefined"){//产品没有provider_id和provider_asset_id时，用doc_id代替.mail 2018.10.11 17:45
		dataChoosed_replaceData={"id":assetData.doc_id}
	 }
	 else{
		dataChoosed_replaceData=dataChoosed_
	 };
	 var dataChoosed_=dataChoosed_replaceData;
	 let obj_id=dataChoosed_.id;
	 let token_setTagForAsset="user_id=" + my.paas.user_id +"&user_type=" + my.paas.user_type +"&access_token=" + my.paas.access_token +"&app_key=" + paasAppKey +"&timestamp=";
	 let url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+this.appKey_onlyUsedForSetTagForProduct+"/" + objType_addTagToAsset+ "/" + obj_id + "?" + token_setTagForAsset + new Date().toISOString();
	 let addImgStyle="cursor:pointer;height:44px;width:62px;border-radius:8px;display:inline-block;margin-left:14px;margin-top:14px";
	 var details_=[];
	 jQuery.ajax({
			type: "GET",
			async: false,
			url: url,
			headers: {
					'x-aqua-sign': getPaaS_x_aqua_sign('GET', url)
			},
			contentType: "application/json",
	 }).done(function(data, status, xhr){
	    var data=data;
			//获取到数组中的tag只是name,现在要匹配他们的title，显示在界面上。
			var selfDefineTagObjType="assettag";
			var url = aquapaas_host +"/aquapaas/rest/"+ "tagdef/" + selfDefineTagObjType + "/"　+ "?" + token_setTagForAsset +  new Date().toISOString();
			var allTagsData=[];
			jq.ajax({
					type  : "GET",
					async :false,
					url   : url,
					contentType : "application/json",
					dataType    : "json",
					error:function(error){
					}
			}).done(function(data, status, xhr){	
				allTagsData=data
			})
		 if(data&&data.details){
				var marginStyle="";
				details_=data.details;
				var details_len=details_.length;
				if(details_len>0){marginStyle="-26px"};
				for(var i = 0; i < details_len; i++) {
				 var currentDetail=details_[i];
				 var currentDetail_tagName=currentDetail&&currentDetail.tag||"";
				 var currentTag_display=currentDetail_tagName;
				 var allTagsDataLen=allTagsData.length;
				 var existInTagLib=false;
				 for(var j = 0; j < allTagsDataLen; j++) {
						if(currentDetail_tagName==allTagsData[j].name){
							existInTagLib=true;
							currentTag_display=allTagsData[j].title;
							break;
						}
				 };
				 var deleteIconDisplay=(existInTagLib?"block":"none");
				 var tagValidTime_start=currentDetail&&currentDetail.start||"";
				 var tagValidTime_end=currentDetail&&currentDetail.end||"";
				 if(tagValidTime_end&&tagValidTime_end!=null&tagValidTime_end!=""){//默认不失效
					var expiration_time=tagValidTime_end;
					var effective_time=(tagValidTime_start&&tagValidTime_start!=null)?tagValidTime_start:"";
					validTime=effective_time.substring(0,10)+"-"+expiration_time.substring(0,10)
				 }
				 else{//end为空时表示永久有效。
						validTime=i18n("ASSET_TAG_LIB_ALWAYSVALID")
					}
				 jq("#tag_for_product_add_container").append("<div class=\"tagsList_for_asset\" style=\"display:inline-block;color:#ffffff;background-color:#1dbde5;border-radius:8px;margin-left:13px;margin-top:14px;min-width:162px;height:50px\"><div style=\"font-size:14px;border-radius:8px;margin-top:5px;min-width:162px;width;auto;height:25px;\"><div class=\"eachTagForProduct\" style=\"float:left;width:auto;margin-left:10px;height:25px;line-height:25px;vertical-align:middle;margin-right:11px;margin-top:-3px\">"+currentTag_display+"</div><div class=\"storedName\" style=\"display:none\">"+currentDetail_tagName+"</div><img class=\"delete_icon\" style=\"float:right;margin-right:5px;margin-top:0px;cursor:pointer;width:12px;height:12px;display:"+deleteIconDisplay+"\" src=\"images/word_library_dialog.png\"></div><div style=\"height:25px;vertical-align:middle;margin-left:10px;margin-top:-3px\">"+validTime+"</div>")
				};
			}
			else{
				marginStyle="";
			}
			jq("#tag_for_product_add_container").append("<div id=\"assetTagAdd_button\" class=\"user-admin-group-add\" style=\"margin-top:"+marginStyle+"\"></div>")
			//jq("#tag_for_product_add_container").append("<img id=\"assetTagAdd_button\" style=\""+addImgStyle+"\" src=\"images/addItem.png\">")
			jq(".delete_icon").each(function(index){
				jq(this).click(function(){
				 var deleteObj=this;
				 if(data&&data.details&&data.details[index]){
					 var dataDetailUnit=data.details[index];
					 var detailStart=dataDetailUnit.start;
					 var detailEnd=dataDetailUnit.end;
					 var tagName=(dataDetailUnit.tag?encodeURIComponent(dataDetailUnit.tag):"");
					 if( ((typeof detailStart=="undefined")&&(typeof detailEnd=="undefined"))||((detailStart=="")&&(detailEnd==""))||((detailStart==null)&&(detailEnd==null)) ){
						//mail:2019.3.6 16:58  生效时间和失效时间都没有
						var url = aquapaas_host +"/aquapaas/rest/asset/tag/" + obj_id + "?tags="+tagName+""; 
						url+=("&"+token_setTagForAsset + new Date().toISOString());					
						jQuery.ajax({
							type: "DELETE",
							async: true,
							url: url,
							headers: {
									'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', url)
							}
						}).done(function(data, status, xhr){
							jq(deleteObj).closest(".tagsList_for_asset").remove();
							if(jq(".tagsList_for_asset").length==0){
								jq("#assetTagAdd_button").css("margin-top","14px")
							}
						})
					 }
					 else{//here
						var url = aquapaas_host +"/aquapaas/rest/tag/delete/"+that.appKey_onlyUsedForSetTagForProduct+"/" + objType_addTagToAsset+ "/" + obj_id + "?tag="+tagName+""; 
						url+=("&"+token_setTagForAsset + new Date().toISOString());							 
							jQuery.ajax({
								type: "DELETE",
								async: true,
								url: url,
								headers: {
										'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', url)
								}
							}).done(function(data, status, xhr){
							jq(deleteObj).closest(".tagsList_for_asset").remove();
							if(jq(".tagsList_for_asset").length==0){
								jq("#assetTagAdd_button").css("margin-top","14px")
							}
						})
					}
				 };
				});
			});
	 }).fail(function(){
			marginStyle="";
			jq("#tag_for_product_add_container").append("<div id=\"assetTagAdd_button\" class=\"user-admin-group-add\" style=\"margin-top:"+marginStyle+"\"></div>")
	 })
	  var that=this;
		jq("#assetTagLib_deleteTag_productDel_cancel, #assetTagLib_addTagForProduct_productDel_cancel, #assetTagDel_close").bind("click", () => {
				dialog_setTagForAsset_.close();
		});
		 jq("#assetTagAdd_button").bind("click", () => {
		  var array_alreadyBindTagNames=[];
			jq("#tag_for_product_add_container").find(".storedName").each(function(){
				array_alreadyBindTagNames.push(jq(this).text())
			});
			createCommonDialog_setTagForProduct(objType_addTagToAsset,array_alreadyBindTagNames,asset_tags_dialog,dataChoosed_,i18n("ASSET_TAG_LIB_TIANJIAJIEMUBIAOQIAN"),708,"singleSet");
		});
		function refreshFlowList(objType_addTagToAsset){
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
			var url = aquapaas_host +"/aquapaas/rest/"+ "tagdef/" + selfDefineTagObjType + "/"　+ "?" + token_setTagForAsset +  new Date().toISOString();
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
					let result=[];
					for(var i = 0; i < data.length; i++) {
					  if(i==0){
            document.getElementById("addTagToProduct_choosedTagTitle").innerHTML=data[0].title
						}
						result.push({label:data[i].title,value:i,storedName:data[i].name});
					};
					createDialog_table.update(result);
				}
			})
		};
})
