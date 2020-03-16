var setTagByTag = (($, Table, Dialog) => {
    let currentPage=0;
    let tagSpaceType="assettag";
		this.appKey_onlyUsedForSetTagForProduct="_global";
		this.itemsCountOneRow=2;
		this.returnToObj={tagsNameArray:[]};
		this.everyPageDatas={};
		this.productsByTagSearch=[];
		var list_table_table_={};
		let token = "user_id=" + my.paas.user_id +"&user_type=" + my.paas.user_type +"&access_token=" + my.paas.access_token +"&app_key=" + paasAppKey +"&timestamp=";
		function bindEvents(){
		  var that=this;
			 //批量设置节目标签按钮按钮
			 $("#setAssetTagByTag_batchSetTag").bind("click", (e) => {
				var data_combine_asset=[];//asset类型的节目id列表
				var data_combine_bundle=[];//bundle类型的节目id列表
				if(that.returnToObj.tagsNameArray.length>0){
				  var originalTagName=that.returnToObj.tagsNameArray.join(",")
					var objType_addTagToAsset="asset";
					var url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+that.appKey_onlyUsedForSetTagForProduct+"/" + objType_addTagToAsset+ "?tags="+originalTagName+"&" + token + new Date().toISOString();
					jQuery.ajax({
						type: "GET",
						async: false,
						url: url,
						headers: {
								"Accept": "application/json",
								"Content-Type": "application/json",
								"x-aqua-sign": getPaaS_x_aqua_sign('GET', url)
						}
					}).done(function(data, status, xhr){
						if(data){
							data_combine_asset=data.map(function (item){
								return item.obj_id||"";
							});
						}
					});
					var objType_addTagToAsset="bundle";
					var url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+that.appKey_onlyUsedForSetTagForProduct+"/" + objType_addTagToAsset+ "?tags="+originalTagName+"&" + token + new Date().toISOString();
					jQuery.ajax({
					type: "GET",
					async: false,
					url: url,
					headers: {
							"Accept": "application/json",
							"Content-Type": "application/json",
							"x-aqua-sign": getPaaS_x_aqua_sign('GET', url)
					}
				}).done(function(data, status, xhr){
					if(data){
					  data_combine_bundle=data.map(function (item){
							return item.obj_id||"";
						});
					}
				});
				var assetBundleProuctsIds=[];
				assetBundleProuctsIds.push(data_combine_asset,data_combine_bundle)
				var objType_addTagToAsset="assetAndBundle";
				var array_alreadyBindTagNames=[];
				var asset_tags_dialog={};
				var dataFromOutPage=[];
				for(i=0;i<data_combine_asset.length;i++){
					dataFromOutPage.push({"doc_type":"asset","doc_id":data_combine_asset[i]})
				}
				for(i=0;i<data_combine_bundle.length;i++){
					dataFromOutPage.push({"doc_type":"bundle","doc_id":data_combine_bundle[i]})
				}
				createCommonDialog_setTagForProduct(objType_addTagToAsset,array_alreadyBindTagNames,asset_tags_dialog,assetBundleProuctsIds,i18n("ASSET_BTN_BATCHTAG"),638,"batchSet",dataFromOutPage);	
				}
				else{
				  alert(i18n("ASSET_SET_TAG_BY_TAG_ALERT"))
				}
			});
			 $("#setAssetTagByTag_input").bind("keydown", (e) => {
        if(e.keyCode == 13) {
         searchTagInTagList("setAssetTagByTag_input")
				   }
        });
      //search button
    $("#setAssetTagByTag_searchButton").bind("click", (e) => {
       searchTagInTagList("setAssetTagByTag_input")
      })
		};
		function searchTagInTagList(id_){
		  if(document.getElementById(id_).value!="")
			{initTable("search",id_)}
			else{initTable("all")}
		};
		function addEditTag(para,choosedTagShowNameInTable,choosedTagStoredName){
		  var jq=jQuery;
			var that=this;
			this.dialog_confirmUpdateTagsInProuducts = new Dialog({
				url: "content/asset/assetTagLib/assetTagLib_deleteTag.html",
				width: 471,
				height: 266,
				context: this,
				callback: function(){
						var msg_assetTagDelMes = i18n("ASSET_TAG_LIB_UPDATE_TAG_IN_PRODUCT");
						document.getElementById("assetTagDelMes").innerHTML=msg_assetTagDelMes//弹出框文字，包括标签显示名称。
						jQuery("#assetTagDel_close").unbind().bind("click", () => {
								that.dialog_confirmUpdateTagsInProuducts.close();
						});
						currentPage=list_table_table_.currPage;
						var choosedTagStoredName_encode=encodeURIComponent(choosedTagStoredName);
						jQuery("#productDel_ok").unbind().bind('click',{choosedTagStoredName_encode: choosedTagStoredName_encode},function(events) {
								that.dialog_confirmUpdateTagsInProuducts.close();
						});
						jQuery("#productDel_cancel").unbind().bind("click", () => {
								that.dialog_confirmUpdateTagsInProuducts.close();
						});
					}
				});
		this.dialog_confirmUpdateTagsInProuducts.create();
		};
		function bindEvents_dialog_addEditTag(para,choosedTagShowNameInTable,choosedTagStoredName){
				var title=(para=="newAdd")?i18n("ASSET_TAG_LIB_ADD_TAG"):i18n("ASSET_TAG_LIB_EDIT_TAG");
				if(para=="edit"){
					document.getElementById("addTagPopup_input").value=choosedTagShowNameInTable?choosedTagShowNameInTable:""
				}
				document.getElementById("addTagPopup_title").innerHTML=title;
			  jQuery("#addTagPopup_confirm").unbind().bind("click", () => {
					if(document.getElementById("addTagPopup_input").value!=""){
					  addEditTag(para,choosedTagShowNameInTable,choosedTagStoredName);
					}
          else{alert("请填写标签名称")}
        });
				jQuery("#addTagPopup_cancel").unbind().bind("click", () => {
          this.dialog_addTag.close();
        });
				var datePickerStyle = {
					iconImage: 'images/heatstats/style_datepicker_icon.png',
					calendarStyles: {
						navTitleBgColor: '#2ea2d7',
					}
				};
				var picker_addTagPopup_validTimeBegin = new DatePicker($.extend({
          containerId: 'addTagPopup_validTimeBegin'
        }, datePickerStyle));
				var picker_addTagPopup_validTimeEnd = new DatePicker($.extend({
          containerId: 'addTagPopup_validTimeEnd'
        }, datePickerStyle));
		};
		function initTable(para,id_) {
		  var that=this;
			let title = [{
				label: ""
					}, {
				label: i18n("ASSET_TAG_LIB_TAG_NAME")
					}, {
				label: i18n("ASSET_TAG_LIB_YOUXIAOSHIJIAN")
					}, {
				label: ""
					}, {
				label: i18n("ASSET_TAG_LIB_TAG_NAME")
					}, {
				label: i18n("ASSET_TAG_LIB_YOUXIAOSHIJIAN")
					}];
			let style = {
				borderColor: "#E2E2E2",
				borderWidth: 1,
				titleBg: "#45d1f4",
				titleColor: "#FFFFFF",
				titleHeight: 31,
				cellBg: "white",
				evenBg: "#F5FDFF",
				cellColor: "#797979",
				cellHeight: 34,
				footBg: "white",
				footColor: "rgb(121,121,121)",
				inputBg: "#FFFFFF",
				inputBorder: "1px solid rgb(203,203,203)",
				iconColor: "#0099CB",
				columnsWidth: [0.049,0.279,0.172,0.049,0.279,0.172]
			};
			if(para=="all"){
				var list_table_table = new Table({
					containerId: "table_setAssetTagByTag",
					rows: 15,
					columns: 6,
					titles: title,
					styles: style,
					listType: 1,
					returnToObj:that.returnToObj,
					async: true,
					itemsCountOneRow:that.itemsCountOneRow,
					specialStyle:{"tdTextAlignLeftIndex":2,"tdColorBlueCursorPointerIndex":"none"}
				});
				list_table_table.currPage=currentPage;
				list_table_table.getPageData = getServeDatas;
				list_table_table.create();
				list_table_table_=list_table_table;
			}
			else{
				var url = aquapaas_host +"/aquapaas/rest/"+ "tagdef/" + tagSpaceType + "/"　+ "?" + token +  new Date().toISOString();
				$.ajax({
						type  : "GET",
						async :true,
						url   : url,
						contentType : "application/json",
						dataType    : "json",
						error:function(error){
							
						}
				}).done(function(data, status, xhr){
						if(data){
						  var dataLen=data.length;
							var keyword=document.getElementById(id_).value;
							var result=[];
							for(i=0;i<dataLen;i++){
								if(data[i].title.indexOf(keyword)!=-1)
								{result.push(data[i])}
							};
							var result_length=result.length;
							var itemsCountOneRow=that.itemsCountOneRow;//一行显示几条数据
							var tableCurrentPageRowLen= Math.floor(result_length/itemsCountOneRow);
							var result_new=[];
							var lastSecondRowLastIndex=0;
							var result_lastRow=[];
							var lastRowBeginIndex=0;
							if(tableCurrentPageRowLen>0){
								for(i=0;i<tableCurrentPageRowLen;i++){
									var result_new_unit=[];
									for(j=0;j<itemsCountOneRow;j++)
									{
										var title=result[i*itemsCountOneRow+j]&&result[i*itemsCountOneRow+j].title||"";
										var name=result[i*itemsCountOneRow+j]&&result[i*itemsCountOneRow+j].name||"";
										var validTime=validTimeForDisplay(result[i*itemsCountOneRow+j]);
										result_new_unit.push({label:"<div class=\"addTagsForMulti_checkBox\"><div class=\"addTagsForMulti_checkBox_son\"></div></div><div class=\"tag_name_stored\" style=\"display:none\">"+name+"</div>"},{label:""+title+""},{label:""+validTime+""});
										lastSecondRowLastIndex=i*itemsCountOneRow+j
									}
									result_new.push(result_new_unit);
								}
								lastRowBeginIndex=lastSecondRowLastIndex+1
							}
							for(i=lastRowBeginIndex;i<result_length;i++){
								var title=result[i]&&result[i].title||"";
								var name=result[i]&&result[i].name||"";
								var validTime=validTimeForDisplay(result[i]);
								result_lastRow.push({label:"<div class=\"addTagsForMulti_checkBox\"><div class=\"addTagsForMulti_checkBox_son\"></div></div><div class=\"tag_name_stored\" style=\"display:none\">"+name+"</div>"},{label:""+title+""},{label:""+validTime+""});
							}
							result_new.push(result_lastRow);
							var list_table_table = new Table({
								containerId: "table_setAssetTagByTag",
								rows: 15,
								columns: 6,
								titles: title,
								styles: style,
								listType: 0,
								returnToObj:that.returnToObj,
								data: result_new,
								async: true,
								itemsCountOneRow:that.itemsCountOneRow,
								specialStyle:{"tdTextAlignLeftIndex":2,"tdColorBlueCursorPointerIndex":"none"}
							});
							list_table_table.create();
						}
					});
			}
		};	
  
	function validTimeForDisplay(data){
	  var returnData="";
		if(data){
			if(data.expiration_time&&data.expiration_time!=null&data.expiration_time!=""){//默认不失效
				var expiration_time=data.expiration_time;
				var effective_time=(data.effective_time&&data.effective_time!=null)?data.effective_time:"";
				returnData=effective_time.substring(0,10)+"--"+expiration_time.substring(0,10)
			}
			else{
				returnData=i18n("ASSET_TAG_LIB_ALWAYSVALID")
			}
		}
		return returnData;
	}
		
	function getServeDatas(pageNum, callback){
		var that=this;
		var jq=jQuery;
		var url = aquapaas_host +"/aquapaas/rest/"+ "tagdef/" + tagSpaceType + "/"　+ "?" + token +  new Date().toISOString();
		if(typeof pageNum == 'number'){
				url = url +  "&start=" + (pageNum - 1) * this.rowsLmt*this.itemsCountOneRow + "&end=" + (pageNum * this.rowsLmt*this.itemsCountOneRow-1);//一行有3个数据
		}
		$.ajax({
				type  : "GET",
				async :false,
				url   : url,
				contentType : "application/json",
				dataType    : "json",
				error:function(error){
					callback&&callback([]);
					that.onTotalCount(0);	
				}
		}).done(function(data, status, xhr){
				result = data;
				var result_length=result.length;
				var itemsCountOneRow=that.itemsCountOneRow;//一行显示几条数据
				var tableCurrentPageRowLen= Math.floor(result_length/itemsCountOneRow);
				var result_new=[];
				var lastSecondRowLastIndex=0;
				var result_lastRow=[];
				var lastRowBeginIndex=0;
				if(tableCurrentPageRowLen>0){
					for(i=0;i<tableCurrentPageRowLen;i++){
						var result_new_unit=[];
						for(j=0;j<itemsCountOneRow;j++)
						{
							var title=result[i*itemsCountOneRow+j]&&result[i*itemsCountOneRow+j].title||"";
							var name=result[i*itemsCountOneRow+j]&&result[i*itemsCountOneRow+j].name||"";
							var validTime=validTimeForDisplay(result[i*itemsCountOneRow+j]);
							result_new_unit.push({label:"<div class=\"addTagsForMulti_checkBox\"><div class=\"addTagsForMulti_checkBox_son\"></div></div><div class=\"tag_name_stored\" style=\"display:none\">"+name+"</div>"},{label:""+title+""},{label:""+validTime+""});
							lastSecondRowLastIndex=i*itemsCountOneRow+j
						}
						result_new.push(result_new_unit);
					}
					lastRowBeginIndex=lastSecondRowLastIndex+1
				}
				for(i=lastRowBeginIndex;i<result_length;i++){
					var title=result[i]&&result[i].title||"";
					var name=result[i]&&result[i].name||"";
					var validTime=validTimeForDisplay(result[i]);
					result_lastRow.push({label:"<div class=\"addTagsForMulti_checkBox\"><div class=\"addTagsForMulti_checkBox_son\"></div></div><div class=\"tag_name_stored\" style=\"display:none\">"+name+"</div>"},{label:""+title+""},{label:""+validTime+""});
				}
				result_new.push(result_lastRow);
				that.onTotalCount(xhr.getResponseHeader("x-aqua-total-count"));
				callback&&callback(result_new);
			
		});
	};
	initTable("all");
	bindEvents();
})(jQuery, StyledList, PopupDialog)
