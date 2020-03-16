var assetTagLib = (($, Table, Dialog) => {
    let currentPage=0;
    let tagSpaceType="assettag";
	var	itemsCountOneRow=2;
	var	resultData=[];
	var	currentTagIsAlwaysValid=false;//新增或编辑标签时，默认不永久有效
		var list_table_table_={};
		let token = "user_id=" + my.paas.user_id +"&user_type=" + my.paas.user_type +"&access_token=" + my.paas.access_token +"&app_key=" + paasAppKey +"&timestamp=";
		var that=this;
		function bindEvents(){
		  var that=this;
			jQuery("#assetTagLib_createTagButton").unbind().bind("click", () => {
        let dialog_addTag = new Dialog({
        url: "content/asset/assetTagLib/assetTagLib_addTag.html",
        width: 478,
        height: 269,
        context: this,
        callback: function(){bindEvents_dialog_addEditTag("newAdd","","",that,"","")}
				});
				dialog_addTag.create();
				that.dialog_addTag = dialog_addTag;
      });
		};
		function addEditTag_(para,choosedTagShowNameInTable,choosedTagStoredName,obj_){
			 var jq=jQuery;
			 var that=obj_;
			 if( (para!="newAdd")&&(para!="edit") ){//删除标签
			 }
			 else{
			  var inputValue=document.getElementById("addTagPopup_input").value
				currentPage=list_table_table_.currPage;
				var tagTitle=inputValue;
				var tagName=(para=="newAdd")?inputValue:choosedTagStoredName;
				var tagName_encode=encodeURIComponent(tagName);
				var token = "user_id=" + my.paas.user_id +"&user_type=" + my.paas.user_type +"&access_token=" + my.paas.access_token +"&app_key=" + paasAppKey +"&timestamp=";					
				var tagSpaceType="assettag";
				var data= {"title" : tagTitle};//默认永久有效,永久有效存入数据时，不存入expiration_time。
				//当新建或编辑标签时，如果开始和结束的有效时间都不设置时，start和end参数不写入，界面有效时间为默认值"永久有效".
				var beginDateDOM=document.getElementById("addTagPopup_validTimeBegin-datepicker-input");
				var endDateDOM=document.getElementById("addTagPopup_validTimeEnd-datepicker-input");
				if((beginDateDOM.value.length==0)&&(endDateDOM.value.length==0)){	
				}
				else{
				  if(beginDateDOM.value.length==0){//开始时间不设，只设结束时间
						data= {
							"title" : tagTitle,
							"expiration_time" :endDateDOM.value+"T23:59:59+0800"
						};
					}
					else if(endDateDOM.value.length==0){//结束时间不设，只设开始时间
						data= {
							"title" : tagTitle,
							"effective_time" :beginDateDOM.value+"T00:00:00+0800"
						};
					}
					else{
						data= {
							"title" : tagTitle,
							"effective_time" :beginDateDOM.value+"T00:00:00+0800",
							"expiration_time" :endDateDOM.value+"T23:59:59+0800"
						};
					}
				}
				var currentTagIsAlwaysValid=currentTagIsAlwaysValid;
				if(currentTagIsAlwaysValid==true){
					delete data.expiration_time; 
				}
				var url = aquapaas_host +"/aquapaas/rest/"+ "tagdef/" + tagSpaceType + "/"+tagName_encode+""　+ "?" + token+  new Date().toISOString();
				var ajaxType=((para=="newAdd")?"PUT":"PUT");//目前标签增加和编辑是一个接口。
				jQuery.ajax({
					type  : ajaxType,
					async :true,
					url   : url,
					headers: {
							'x-aqua-sign': getPaaS_x_aqua_sign('PUT', url)
					},
					contentType : "application/json",
					data:JSON.stringify(data),
					error:function(error){
							that.dialog_addTag.close();
					}
				}).done(function(data, status, xhr){	
						initTable();
						//当编辑时,同步节目和节目包上的标签。
						if(para=="edit"){
							that.dialog_addTag.close();
							that.dialog_confirmUpdateTagsInProuducts = new Dialog({
							url: "content/asset/assetTagLib/assetTagLib_deleteTag.html",
							width: 471,
							height: 266,
							context: this,
							callback: function(){
								var msg_updateTagInProducts = i18n("ASSET_TAG_LIB_UPDATE_TAG_IN_PRODUCT");
								document.getElementById("assetTagDelMes").innerHTML=msg_updateTagInProducts//弹出框文字，包括标签显示名称。
								jq("#assetTagDel_close").unbind().bind("click", () => {
										that.dialog_confirmUpdateTagsInProuducts.close();
								});
								currentPage=list_table_table_.currPage;
								var choosedTagStoredName_encode=encodeURIComponent(choosedTagStoredName);
								jq("#assetTagLib_deleteTag_productDel_ok").unbind().bind('click',{choosedTagStoredName_encode: choosedTagStoredName_encode},function(events) {
										that.dialog_confirmUpdateTagsInProuducts.close();
										var data_combine_asset=[];//asset类型的节目id列表
										var data_combine_bundle=[];//bundle类型的节目id列表
										var appKey_onlyUsedForSetTagForProduct="_global";
										var objType_addTagToAsset="asset";
										var url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+appKey_onlyUsedForSetTagForProduct+"/" + objType_addTagToAsset+ "?tags="+choosedTagStoredName_encode+"&" + token + new Date().toISOString();
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
										})
										var appKey_onlyUsedForSetTagForProduct="_global";
										var objType_addTagToAsset="bundle";
										var url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+appKey_onlyUsedForSetTagForProduct+"/" + objType_addTagToAsset+ "?tags="+choosedTagStoredName+"&" + token + new Date().toISOString();
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
										})
									//var assetBundleProuctsIds=[];
									//assetBundleProuctsIds.push(data_combine_asset,data_combine_bundle);
									if(data_combine_asset.length>0){
										var obj_id=data_combine_asset.join(",");
										var appKey_onlyUsedForSetTagForProduct="_global";
										var objType_addTagToAsset="asset";
										var data = {
											"details" : [
												{
													"tag" : choosedTagStoredName,
													"start" :beginDateDOM.value+"T00:00:00+0800",
													"end" :endDateDOM.value+"T23:59:59+0800"
												}
											]
										};
										if(beginDateDOM.value.length==0){delete data.details[0].start};
										if(endDateDOM.value.length==0){delete data.details[0].end};
										var url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+appKey_onlyUsedForSetTagForProduct+"/" + objType_addTagToAsset+ "/" + obj_id + "?" + token + new Date().toISOString();
										jQuery.ajax({
											type: "POST",
											async:true,
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
									};
									if(data_combine_bundle.length>0){
										var obj_id=data_combine_bundle.join(",");
										var appKey_onlyUsedForSetTagForProduct="_global";
										var objType_addTagToAsset="bundle";
										var data = {
											"details" : [
												{
													"tag" : choosedTagStoredName,
													"start" :beginDateDOM.value+"T00:00:00+0800",
													"end" :endDateDOM.value+"T23:59:59+0800"
												}
											]
										};
										if(beginDateDOM.value.length==0){delete data.details[0].start};
										if(endDateDOM.value.length==0){delete data.details[0].end};
										var url = aquapaas_host +"/aquapaas/rest"+ "/tag/application/"+appKey_onlyUsedForSetTagForProduct+"/" + objType_addTagToAsset+ "/" + obj_id + "?" + token + new Date().toISOString();
										jQuery.ajax({
											type: "POST",
											async:true,
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
									};
								});
								jq("#assetTagLib_deleteTag_productDel_cancel").unbind().bind("click", () => {
									that.dialog_confirmUpdateTagsInProuducts.close();
								});
						}});		
				that.dialog_confirmUpdateTagsInProuducts.create();//打开同步产品标签框
			}
			else{
				that.dialog_addTag.close();//关闭增加编辑标签框
			}
		});
	 };
 };
		function bindEvents_dialog_addEditTag(para,choosedTagShowNameInTable,choosedTagStoredName,obj_,validTimeStart,validTimeEnd){
				var jq=jQuery;
				//addTagPopup_validTimeBegin-datepicker-input
				var that=obj_;
				var title=(para=="newAdd")?i18n("ASSET_TAG_LIB_ADD_TAG"):i18n("ASSET_TAG_LIB_EDIT_TAG");
				document.getElementById("addTagPopup_title").innerHTML=title;
			  jQuery("#addTagPopup_confirm").unbind().bind("click", () => {
					if(document.getElementById("addTagPopup_input").value!=""){
					  addEditTag_(para,choosedTagShowNameInTable,choosedTagStoredName,that);
					}
          else{alert("请填写标签名称")}
        });
				jQuery("#addTagPopup_cancel").unbind().bind("click", () => {
          that.dialog_addTag.close();
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
				if(para=="edit"){
					document.getElementById("addTagPopup_input").value=choosedTagShowNameInTable?choosedTagShowNameInTable:"";
					jq("#addTagPopup_input").attr("readonly","readonly").css("background-color","#efefef");
					if( validTimeStart&&(validTimeStart!=null)&&(validTimeStart!="") ){
						document.getElementById("addTagPopup_validTimeBegin-datepicker-input").value=validTimeStart.substring(0,10);
					}
					if( validTimeEnd&&(validTimeEnd!=null)&&(validTimeEnd!="") ){
						document.getElementById("addTagPopup_validTimeEnd-datepicker-input").value=validTimeEnd.substring(0,10);
					}
					else{//没有结束时间，认为是永久有效。
						setTimeAlwaysValid();
					}
				}
				else{//新增标签默认永久有效
					setTimeAlwaysValid();
				}
				jq("#addTagPopup_alwaysValid").unbind().bind('click', function () {
				  currentTagIsAlwaysValid==false?currentTagIsAlwaysValid=true:currentTagIsAlwaysValid=false;
					var dislay_alwaysValid=currentTagIsAlwaysValid?"block":"none";
					jq(this).children().css("display",dislay_alwaysValid);
					var validBginInputId="addTagPopup_validTimeBegin-datepicker-input";
					var validEndInputId="addTagPopup_validTimeEnd-datepicker-input";
					if(currentTagIsAlwaysValid==true){
						document.getElementById(validBginInputId).setAttribute("disabled","disabled");
						jq("#"+validBginInputId+"").css("background-color","#efefef");
					  document.getElementById(validEndInputId).setAttribute("disabled","disabled");
						jq("#"+validEndInputId+"").css("background-color","#efefef").val("");
						jq("#addTagPopup_validTimeBegin,#addTagPopup_validTimeEnd").append("<div class=\"addTagPopup_blockSetTime\" style=\"left:0;top:0;position:absolute;width:100%;height:100%\"></div>");
					}
					else{
						document.getElementById(validBginInputId).removeAttribute("disabled");
						jq("#"+validBginInputId+"").css("background-color","");
						document.getElementById(validEndInputId).removeAttribute("disabled");
						jq("#"+validEndInputId+"").css("background-color","");
						jq("#addTagPopup_validTimeBegin,#addTagPopup_validTimeEnd").find(".addTagPopup_blockSetTime").remove();
					}
				})				
		};
		function setTimeAlwaysValid(){
		    var jq=jQuery;
				currentTagIsAlwaysValid=true;
				jq("#addTagPopup_alwaysValid").children().css("display","block");
				var validBginInputId="addTagPopup_validTimeBegin-datepicker-input";
				var validEndInputId="addTagPopup_validTimeEnd-datepicker-input";
				document.getElementById(validBginInputId).setAttribute("disabled","disabled");
				jq("#"+validBginInputId+"").css("background-color","#efefef");
				document.getElementById(validEndInputId).setAttribute("disabled","disabled");
				jq("#"+validEndInputId+"").css("background-color","#efefef").val("");
				jq("#addTagPopup_validTimeBegin,#addTagPopup_validTimeEnd").append("<div class=\"addTagPopup_blockSetTime\" style=\"left:0;top:0;position:absolute;width:100%;height:100%\"></div>");
		};
		function initTable() {
		  var that=this;
			let title = [{
				label: i18n("ASSET_TAG_LIB_TAG_NAME")
					}, {
				label: i18n("ASSET_TAG_LIB_YOUXIAOSHIJIAN")
					}, {
				label: i18n("ASSET_TAG_LIB_OPERATION")
					}, {
				label: i18n("ASSET_TAG_LIB_TAG_NAME")
					}, {
				label: i18n("ASSET_TAG_LIB_YOUXIAOSHIJIAN")
					}, {
				label: i18n("ASSET_TAG_LIB_OPERATION")
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
				columnsWidth: [0.2467,0.165,0.0858,0.2467,0.165,0.0858]
			};
			var list_table_table = new Table({
				containerId: "table_assetTagLib",
				rows: 15,
				columns: 6,
				titles: title,
				styles: style,
				listType: 1,
				async: true,
				itemsCountOneRow:itemsCountOneRow,
				specialStyle:{"tdTextAlignLeftIndex":6/itemsCountOneRow,"tdColorBlueCursorPointerIndex":1}
			});
			list_table_table.currPage=currentPage;
			list_table_table.getPageData = getServeDatas;
			list_table_table.create();
			list_table_table_=list_table_table;
			var jq=jQuery;
		};	
		
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
				var result = data;
				resultData=data?data:[];
				var result_length=result.length;
				var itemsCountOneRow=that.itemsCountOneRow;//一行显示几条数据
				var tableCurrentPageRowLen= Math.floor(result_length/itemsCountOneRow);
				var result_new=[];
				var lastSecondRowLastIndex=0;
				var result_lastRow=[];
				var lastRowBeginIndex=0;
				if(tableCurrentPageRowLen>0){
					for(var i=0;i<tableCurrentPageRowLen;i++){
						var result_new_unit=[];
						for(var j=0;j<itemsCountOneRow;j++)
						{
							var title=result[i*itemsCountOneRow+j]&&result[i*itemsCountOneRow+j].title||"";
							var name=result[i*itemsCountOneRow+j]&&result[i*itemsCountOneRow+j].name||"";
							var validTime="";
							if(result[i*itemsCountOneRow+j]){
							  let result_data=result[i*itemsCountOneRow+j];
								if(result_data.expiration_time&&result_data.expiration_time!=null&result_data.expiration_time!=""){//默认不失效
									var expiration_time=result_data.expiration_time;
									var effective_time=(result_data.effective_time&&result_data.effective_time!=null)?result_data.effective_time:"";
									validTime=effective_time.substring(0,10)+"--"+expiration_time.substring(0,10)
								}
								else{
									validTime=i18n("ASSET_TAG_LIB_ALWAYSVALID")
								}
							}
							result_new_unit.push({label:title},{label:validTime},{label:"<span class=\"tag_name_stored\" style=\"display:none\">"+name+"</span><span class=\"productTagDeleteButtonA\">"+i18n("ASSET_TAG_LIB_BIANJI")+"</span><span  class=\"productTagDeleteButtonB\" style=\"margin-left:16px\">"+i18n("ASSET_TAG_LIB_SHANCHU")+"</span>"});
							lastSecondRowLastIndex=i*itemsCountOneRow+j
						}
						result_new.push(result_new_unit);
					}
					lastRowBeginIndex=lastSecondRowLastIndex+1
				}
				for(var i=lastRowBeginIndex;i<result_length;i++){//最后一行的第一个。
					var title=result[i]&&result[i].title||"";
					var name=result[i]&&result[i].name||"";
					var result_data=result[i];
					if(result_data.expiration_time&&result_data.expiration_time!=null&result_data.expiration_time!=""){//默认不失效
						var expiration_time=result_data.expiration_time;
						var effective_time=(result_data.effective_time&&result_data.effective_time!=null)?result_data.effective_time:"";
						validTime=effective_time.substring(0,10)+"--"+expiration_time.substring(0,10)
					}
					else{
						validTime=i18n("ASSET_TAG_LIB_ALWAYSVALID")
					}
					result_lastRow.push({label:title},{label:validTime},{label:"<span class=\"tag_name_stored\" style=\"display:none\">"+name+"</span><span class=\"productTagDeleteButtonA\">"+i18n("ASSET_TAG_LIB_BIANJI")+"</span><span  class=\"productTagDeleteButtonB\" style=\"margin-left:16px\">"+i18n("ASSET_TAG_LIB_SHANCHU")+"</span>"});
				}
				result_new.push(result_lastRow);
				that.onTotalCount(xhr.getResponseHeader("x-aqua-total-count"));
				callback&&callback(result_new);
				jq(".productTagDeleteButtonA").each(function(objIndex){
				  var editObj=this;
					jq(this).unbind().bind('click', function () {
						  let dialog_addTag = new Dialog({
								url: "content/asset/assetTagLib/assetTagLib_addTag.html",
								width: 478,
								height: 269,
								context: this,
								callback: function(){
									var index_=jq(editObj).parent().closest("tr").find("td").index(jq(this).parent())-2;//删除的名称在删除前一列
						      var choosedTagShowNameInTable=jq(editObj).closest("tr").find("td").eq(index_).text();
						      var choosedTagStoredName=jq(editObj).parent().find(".tag_name_stored").text();
									var effective_time=resultData&&resultData[objIndex]&&resultData[objIndex].effective_time||"";
									var expiration_time=resultData&&resultData[objIndex]&&resultData[objIndex].expiration_time||"";
									bindEvents_dialog_addEditTag("edit",choosedTagShowNameInTable,choosedTagStoredName,that,effective_time,expiration_time)
								}
							});
								dialog_addTag.create();
								that.dialog_addTag = dialog_addTag;
						})
				});
			 jq(".productTagDeleteButtonB").each(function(){
				jq(this).unbind().bind('click', function () {
					var index_=jq(this).parent().closest("tr").find("td").index(jq(this).parent())-2;//删除的名称在删除前一列
					var choosedTagShowNameInTable=jq(this).closest("tr").find("td").eq(index_).text();
					var choosedTagStoredName=jq(this).parent().find(".tag_name_stored").text();
					var deleteObj=this;
					that.dialog_deleteTag = new Dialog({
					url: "content/asset/assetTagLib/assetTagLib_deleteTag.html",
					width: 471,
					height: 266,
					context: this,
					callback: function(){
							var choosedTagShowNameInTable=jq(deleteObj).closest("tr").find("td").eq(index_).text();
					    var choosedTagStoredName=jq(deleteObj).parent().find(".tag_name_stored").text();
							var choosedTagShowNameInTable=choosedTagShowNameInTable;
							var msg_assetTagDelMes = i18n("ASSET_TAG_LIB_AREYOUSUREDELETE").replace("{{}}", choosedTagShowNameInTable);
							document.getElementById("assetTagDelMes").innerHTML=msg_assetTagDelMes//弹出框文字，包括标签显示名称。
							jQuery("#assetTagDel_close").unbind().bind("click", () => {
									that.dialog_deleteTag.close();
							});
							currentPage=list_table_table_.currPage;
							var choosedTagStoredName_encode=encodeURIComponent(choosedTagStoredName);
							jQuery("#assetTagLib_deleteTag_productDel_ok").unbind().bind('click',{choosedTagStoredName_encode: choosedTagStoredName_encode},function(events) {
									that.dialog_deleteTag.close();
									var tagSpaceType="assettag";
									var url = aquapaas_host +"/aquapaas/rest/" + "tagdef/" + tagSpaceType+ "/"+ choosedTagStoredName_encode + "?" + token + new Date().toISOString();
									jQuery.ajax({
											type : "DELETE",
											async: false,
											url: url,
											headers: {
													'x-aqua-sign': getPaaS_x_aqua_sign('DELETE', url)
											},
											contentType:"application/json"
									}).done(function(){
											initTable();
									}).fail(function(){
											alert("删除失败")
									});
							});
							jQuery("#assetTagLib_deleteTag_productDel_cancel").unbind().bind("click", () => {
									that.dialog_deleteTag.close();
							});
						}
					});
					that.dialog_deleteTag.create();
				});
			});
		});
	};
	initTable();
	bindEvents();
})(jQuery, AssetTagLibStyledList, PopupDialog)
